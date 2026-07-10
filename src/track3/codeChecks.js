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

export function runCodeChecks({ turns = [], earlyFinish = false } = {}) {
  const normalizedTurns = normalizeTurns(turns);
  const users = userTurns(normalizedTurns);
  const userText = users.map((turn) => turn.content).join("\n");
  const avgLength = users.length
    ? users.reduce((sum, turn) => sum + turn.content.length, 0) / users.length
    : 0;
  const laterText = users.slice(1).map((turn) => turn.content).join("\n");

  const checks = [
    {
      key: "turn_completion",
      label: "대화 완주",
      contributes_to_total: false,
      max: 4,
      score: users.length >= TRACK3_MAX_TURNS || earlyFinish ? 4 : users.length >= 3 ? 2 : 0,
      passed: users.length >= TRACK3_MAX_TURNS || earlyFinish,
      evidence: `${users.length}/${TRACK3_MAX_TURNS}턴`
    },
    {
      key: "valid_length",
      label: "발화 유효 길이",
      contributes_to_total: false,
      max: 3,
      score: avgLength >= 45 ? 3 : avgLength >= 20 ? 2 : avgLength >= 10 ? 1 : 0,
      passed: avgLength >= 45,
      evidence: `평균 ${Math.round(avgLength)}자`
    },
    {
      key: "output_format_signal",
      label: "출력 형식 요청 표현",
      contributes_to_total: false,
      max: 3,
      score: OUTPUT_FORMAT_RE.test(userText) ? 3 : 0,
      passed: OUTPUT_FORMAT_RE.test(userText),
      evidence: firstMatch(userText, OUTPUT_FORMAT_RE)
    },
    {
      key: "verification_signal",
      label: "검증 관련 표현",
      contributes_to_total: false,
      max: 4,
      score: VERIFICATION_RE.test(userText) ? 4 : 0,
      passed: VERIFICATION_RE.test(userText),
      evidence: firstMatch(userText, VERIFICATION_RE)
    },
    {
      key: "follow_up_signal",
      label: "후속 개입 표현",
      contributes_to_total: false,
      max: 3,
      score: FOLLOW_UP_RE.test(laterText) ? 3 : 0,
      passed: FOLLOW_UP_RE.test(laterText),
      evidence: firstMatch(laterText, FOLLOW_UP_RE)
    },
    {
      key: "structure_signal",
      label: "구조화 신호",
      contributes_to_total: false,
      max: 3,
      score: STRUCTURE_RE.test(userText) ? 3 : 0,
      passed: STRUCTURE_RE.test(userText),
      evidence: firstMatch(userText, STRUCTURE_RE)
    }
  ];

  return {
    score: 0,
    max: 0,
    diagnostic_score: checks.reduce((sum, check) => sum + check.score, 0),
    diagnostic_max: checks.reduce((sum, check) => sum + check.max, 0),
    checks
  };
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
