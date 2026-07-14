import { TRACK3_MAX_TURNS } from "./scenarios.js";

const OUTPUT_FORMAT_RE = /(표|목록|문서|보고서|형식|포맷|항목|구조|정리|포함|분량|톤|회의|공유)/i;
const VERIFICATION_RE = /(검증|검토|지적|누락|허점|리스크|논리 비약|데이터|확인|반례|오류|틀린|어려운 가설)/i;
const FOLLOW_UP_RE = /(방금|위|앞서|제안|가설|그중|집중|선택|제외|좁혀|우선|반영|수정|다시)/i;
const STRUCTURE_RE = /(\n\s*[-*0-9]|#{1,3}\s|[:：]\s|1\.|2\.|3\.|\/|\|)/;

export function normalizeTurns(inputTurns = []) {
  if (!Array.isArray(inputTurns)) return [];

  return inputTurns
    .filter((turn) => turn && typeof turn === "object")
    .map((turn) => ({
      role: normalizeRole(turn.role),
      content: String(turn.content ?? "").trim()
    }))
    .filter((turn) => turn.role && turn.content.length > 0);
}

export function userTurns(turns = []) {
  return normalizeTurns(turns).filter((turn) => turn.role === "user");
}

export function countUserTurns(turns = []) {
  return userTurns(turns).length;
}

export function buildConversationText(turns = []) {
  return normalizeTurns(turns)
    .map((turn, index) => `${index + 1}. ${turn.role}: ${turn.content}`)
    .join("\n");
}

export function validateChatInput({ turns = [], userMessage }) {
  const errors = [];
  const normalizedTurns = normalizeTurns(turns);
  const currentTurnCount = countUserTurns(normalizedTurns);
  const message = String(userMessage ?? "").trim();

  if (!message || message.length < 5) {
    errors.push("userMessage는 최소 5자 이상이어야 합니다.");
  }

  if (currentTurnCount >= TRACK3_MAX_TURNS) {
    errors.push(`이미 최대 ${TRACK3_MAX_TURNS}턴을 모두 사용했습니다.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    turns: normalizedTurns,
    userMessage: message,
    currentTurnCount
  };
}

export function validateSubmitInput({ turns = [], finalOutput }) {
  const errors = [];
  const normalizedTurns = normalizeTurns(turns);
  const users = userTurns(normalizedTurns);
  const output = String(finalOutput ?? "").trim();

  if (users.length < 1) errors.push("평가할 사용자 발화가 없습니다.");
  if (users.length > TRACK3_MAX_TURNS) errors.push(`사용자 발화는 최대 ${TRACK3_MAX_TURNS}턴까지 허용됩니다.`);
  if (!output || output.length < 20) errors.push("finalOutput은 최소 20자 이상이어야 합니다.");

  return {
    valid: errors.length === 0,
    errors,
    turns: normalizedTurns,
    finalOutput: output
  };
}

export function runCodeChecks({ turns = [], earlyFinish = false, scenario = null } = {}) {
  const normalizedTurns = normalizeTurns(turns);
  const users = userTurns(normalizedTurns);
  const integrity = analyzeTrack3Integrity({ turns: normalizedTurns, scenario });
  const effectiveUsers = integrity.unique_turn_indices.map((index) => users[index]).filter(Boolean);
  const userText = effectiveUsers.map((turn) => turn.content).join("\n");
  const validTurnCount = effectiveUsers.filter((turn) => turn.content.length >= 10).length;
  const laterText = effectiveUsers.slice(1).map((turn) => turn.content).join("\n");

  const checks = [
    {
      key: "turn_completion",
      label: "대화 완주",
      contributes_to_total: true,
      max: 4,
      score: completionCheckScore(integrity.effective_turn_count),
      passed: integrity.effective_turn_count >= TRACK3_MAX_TURNS,
      evidence: `${integrity.effective_turn_count}/${TRACK3_MAX_TURNS} 유효 턴 (입력 ${users.length}턴)${earlyFinish && users.length < TRACK3_MAX_TURNS ? " (조기 제출)" : ""}`
    },
    {
      key: "valid_length",
      label: "발화 유효 길이",
      contributes_to_total: true,
      max: 3,
      score: validTurnCount >= 5 ? 3 : validTurnCount >= 3 ? 2 : validTurnCount >= 1 ? 1 : 0,
      passed: validTurnCount >= TRACK3_MAX_TURNS,
      evidence: `${validTurnCount}/${effectiveUsers.length}개 고유 발화 10자 이상`
    },
    {
      key: "output_format_signal",
      label: "출력 형식 요청 표현",
      contributes_to_total: true,
      max: 3,
      score: OUTPUT_FORMAT_RE.test(userText) ? 3 : 0,
      passed: OUTPUT_FORMAT_RE.test(userText),
      evidence: firstMatch(userText, OUTPUT_FORMAT_RE)
    },
    {
      key: "verification_signal",
      label: "검증 관련 표현",
      contributes_to_total: true,
      max: 4,
      score: VERIFICATION_RE.test(userText) ? 4 : 0,
      passed: VERIFICATION_RE.test(userText),
      evidence: firstMatch(userText, VERIFICATION_RE)
    },
    {
      key: "follow_up_signal",
      label: "후속 개입 표현",
      contributes_to_total: true,
      max: 3,
      score: FOLLOW_UP_RE.test(laterText) ? 3 : 0,
      passed: FOLLOW_UP_RE.test(laterText),
      evidence: firstMatch(laterText, FOLLOW_UP_RE)
    },
    {
      key: "structure_signal",
      label: "구조화 신호",
      contributes_to_total: true,
      max: 3,
      score: STRUCTURE_RE.test(userText) ? 3 : 0,
      passed: STRUCTURE_RE.test(userText),
      evidence: firstMatch(userText, STRUCTURE_RE)
    }
  ];

  const score = checks.reduce((sum, check) => sum + check.score, 0);
  const max = checks.reduce((sum, check) => sum + check.max, 0);

  return {
    score,
    max,
    diagnostic_score: score,
    diagnostic_max: max,
    checks,
    integrity
  };
}

export function analyzeTrack3Integrity({ turns = [], scenario = null } = {}) {
  const users = userTurns(turns);
  const unique = [];
  const duplicateTurnIndices = [];

  users.forEach((turn, index) => {
    const normalized = normalizeComparable(turn.content);
    const duplicate = unique.some((entry) => textSimilarity(normalized, entry.normalized) >= 0.9);
    if (duplicate) duplicateTurnIndices.push(index);
    else unique.push({ index, normalized, content: turn.content });
  });

  const baseline = scenario ? scenarioBaselineText(scenario) : "";
  const scenarioCoverage = baseline
    ? unique.map((entry) => ngramContainment(entry.normalized, baseline, 3))
    : unique.map(() => 0);
  const firstCopyMarkerCount = countScenarioCopyMarkers(unique[0]?.content);
  const firstLooksCopied = unique[0]?.normalized.length >= 80
    && (scenarioCoverage[0] >= 0.62 || firstCopyMarkerCount >= 2);
  const hasNovelFollowUp = unique.slice(1).some((entry, index) => (
    entry.normalized.length >= 8 && scenarioCoverage[index + 1] < 0.55
  ));

  return {
    raw_turn_count: users.length,
    effective_turn_count: unique.length,
    duplicate_turn_count: duplicateTurnIndices.length,
    duplicate_turn_indices: duplicateTurnIndices.map((index) => index + 1),
    unique_turn_indices: unique.map((entry) => entry.index),
    scenario_restatement_likely: Boolean(firstLooksCopied && !hasNovelFollowUp),
    first_turn_scenario_overlap: round2(scenarioCoverage[0] || 0),
    first_turn_copy_markers: firstCopyMarkerCount
  };
}

function completionCheckScore(turnCount) {
  if (turnCount >= TRACK3_MAX_TURNS) return 4;
  if (turnCount === 4) return 3;
  if (turnCount === 3) return 2;
  if (turnCount === 2) return 1;
  return 0;
}

function normalizeRole(role) {
  if (role === "assistant" || role === "ai") return "assistant";
  if (role === "user") return "user";
  return null;
}

function firstMatch(text, regex) {
  const match = String(text || "").match(regex);
  return match ? match[0] : null;
}

function scenarioBaselineText(scenario) {
  return normalizeComparable([
    scenario?.role,
    scenario?.situation,
    scenario?.mission,
    ...(scenario?.available_info || []),
    ...(scenario?.constraints || [])
  ].filter(Boolean).join(" "));
}

function countScenarioCopyMarkers(value) {
  const text = String(value || "");
  return [
    /상황\s*설명/,
    /미션\s*가이드/,
    /다음\s*내용을\s*중심으로\s*AI와\s*함께\s*최종\s*제출물을\s*만들어보세요/,
    /최근\s*(?:주요\s*)?지표/,
    /현재\s*이용\s*가능한\s*데이터/
  ].filter((pattern) => pattern.test(text)).length;
}

function normalizeComparable(value) {
  return String(value || "").toLowerCase().replace(/[^가-힣a-z0-9]/g, "");
}

function textSimilarity(left, right) {
  if (!left || !right) return 0;
  if (left === right) return 1;
  const leftGrams = ngrams(left, 3);
  const rightGrams = ngrams(right, 3);
  if (!leftGrams.size || !rightGrams.size) return 0;
  let intersection = 0;
  for (const gram of leftGrams) if (rightGrams.has(gram)) intersection += 1;
  return intersection / (leftGrams.size + rightGrams.size - intersection);
}

function ngramContainment(source, target, size) {
  const sourceGrams = ngrams(source, size);
  const targetGrams = ngrams(target, size);
  if (!sourceGrams.size || !targetGrams.size) return 0;
  let matches = 0;
  for (const gram of sourceGrams) if (targetGrams.has(gram)) matches += 1;
  return matches / sourceGrams.size;
}

function ngrams(value, size) {
  const text = String(value || "");
  const grams = new Set();
  if (text.length < size) {
    if (text) grams.add(text);
    return grams;
  }
  for (let index = 0; index <= text.length - size; index += 1) {
    grams.add(text.slice(index, index + size));
  }
  return grams;
}

function round2(value) {
  return Math.round(Number(value) * 100) / 100;
}
