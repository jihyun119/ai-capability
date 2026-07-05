import { TRACK3_JUDGE_SYSTEM_PROMPT } from "./judgePrompt.js";
import { TRACK3_VERSION, getScenario } from "./scenarios.js";
import { buildConversationText, countUserTurns, runCodeChecks, userTurns } from "./codeChecks.js";

export const TRACK3_AXES = [
  ["goal_definition", "목표 정의"],
  ["context", "맥락 제공"],
  ["information_structure", "정보 구조화"],
  ["task_decomposition", "작업 분해"],
  ["output_design", "출력 설계"],
  ["interaction_control", "상호작용 조율"],
  ["verification", "검증 유도"],
  ["practical_application", "실무 적용"]
];

export async function judgeTrack3({ scenarioId, turns, finalOutput, earlyFinish = false } = {}) {
  const scenario = getScenario(scenarioId);
  const codeChecks = runCodeChecks({ turns, earlyFinish });
  const judgeResult = await runLlmJudge({ scenario, turns, finalOutput })
    .catch(() => buildHeuristicJudge({ scenario, turns, finalOutput }));
  const normalizedJudge = normalizeJudgeResult(judgeResult, { turns, finalOutput });
  const total = calculateTotalScore(normalizedJudge, codeChecks);

  return {
    track: "track3",
    version: TRACK3_VERSION,
    scenario: {
      scenario_id: scenario.scenario_id,
      title: scenario.title,
      role: scenario.role
    },
    total,
    grade: gradeForTotal(total),
    axis_scores: normalizedJudge.axis_scores,
    delta_score: normalizedJudge.delta_score,
    code_checks: codeChecks,
    move_tagging: normalizedJudge.move_tagging,
    sequence_valid: normalizedJudge.sequence_valid,
    best_intervention: normalizedJudge.best_intervention,
    missed_intervention: normalizedJudge.missed_intervention,
    confidence: normalizedJudge.confidence,
    feedback: {
      summary_strengths: normalizedJudge.summary_strengths,
      summary_weaknesses: normalizedJudge.summary_weaknesses,
      recommendation: recommendationFor(normalizedJudge.axis_scores)
    }
  };
}

async function runLlmJudge({ scenario, turns, finalOutput }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
  if (!apiKey || process.env.ENABLE_TRACK3_LLM_JUDGE === "false") {
    return buildHeuristicJudge({ scenario, turns, finalOutput });
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });
  const payload = {
    scenario,
    turns,
    final_output: finalOutput
  };

  const response = await withTimeout(openai.chat.completions.create({
    model: process.env.TRACK3_JUDGE_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: TRACK3_JUDGE_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(payload) }
    ],
    temperature: 0.1,
    max_tokens: 1600,
    response_format: { type: "json_object" }
  }), Number(process.env.TRACK3_JUDGE_TIMEOUT_MS || 8000));

  return JSON.parse(response.choices[0].message.content.trim());
}

function buildHeuristicJudge({ scenario, turns, finalOutput }) {
  const users = userTurns(turns);
  const first = users[0]?.content || "";
  const later = users.slice(1).map((turn) => turn.content).join("\n");
  const allUser = users.map((turn) => turn.content).join("\n");
  const output = String(finalOutput || "");
  const codeChecks = runCodeChecks({ turns });
  const moves = users.map((turn, index) => ({
    turn: index + 1,
    moves: inferMoves(turn.content, index, output),
    note: "규칙 기반 예비 태깅"
  }));

  const axis_scores = [
    axis("goal_definition", "목표 정의", scoreBySignals(first, [/문제|목표|전환율|개선|분석|만들/i, /산출물|분석안|보고서|표|결과/i]), quote(first)),
    axis("context", "맥락 제공", scoreByScenarioContext(allUser, scenario), quote(allUser)),
    axis("information_structure", "정보 구조화", scoreBySignals(allUser, [/\n|1\.|2\.|[-*]|:/, /조건|배경|목표|형식|제약/]), quote(allUser)),
    axis("task_decomposition", "작업 분해", scoreDecomposition(users, moves), `${users.length}턴 사용`),
    axis("output_design", "출력 설계", codeChecks.checks.find((check) => check.key === "output_format_signal")?.score ? 3 : 1, quote(allUser)),
    axis("interaction_control", "상호작용 조율", scoreBySignals(later, [/방금|제안|그중|선택|좁혀|우선|반영/i, /집중|수정|제외|방향/i]), quote(later)),
    axis("verification", "검증 유도", codeChecks.checks.find((check) => check.key === "verification_signal")?.score ? 3 : 0, quote(allUser)),
    axis("practical_application", "실무 적용", scoreFinalOutput(output, scenario), quote(output))
  ];

  return {
    move_tagging: moves,
    sequence_valid: moves.some((m) => m.moves.includes("M1")) && users.length >= 3,
    axis_scores,
    delta_score: {
      score: users.length >= 4 && output.length > 250 ? 3 : users.length >= 2 ? 2 : 1,
      evidence: "대화 턴 수와 최종 산출물 구체성을 기준으로 산정했습니다.",
      t1_expected_level: "첫 발화만으로는 일반적 초안 수준이 예상됩니다.",
      final_level: output.length > 250 ? "최종 산출물이 구조화된 실행안에 가깝습니다." : "최종 산출물 보완이 필요합니다."
    },
    best_intervention: bestIntervention(moves),
    missed_intervention: missedIntervention(axis_scores),
    confidence: users.length >= 4 ? "medium" : "low",
    summary_strengths: summarizeStrengths(axis_scores),
    summary_weaknesses: summarizeWeaknesses(axis_scores)
  };
}

function normalizeJudgeResult(result, { turns, finalOutput }) {
  const byKey = new Map((Array.isArray(result.axis_scores) ? result.axis_scores : []).map((item) => [item.key || keyForAxis(item.axis), item]));
  const axis_scores = TRACK3_AXES.map(([key, label]) => {
    const item = byKey.get(key) || {};
    const score = clampScore(item.score);
    return {
      key,
      axis: label,
      score,
      max: 4,
      rate: Math.round((score / 4) * 100) / 100,
      evidence: String(item.evidence || "").slice(0, 240),
      comment: String(item.comment || "").slice(0, 240)
    };
  });

  const fallback = buildHeuristicJudge({ scenario: getScenario(), turns, finalOutput });
  return {
    move_tagging: Array.isArray(result.move_tagging) ? result.move_tagging : fallback.move_tagging,
    sequence_valid: Boolean(result.sequence_valid),
    axis_scores,
    delta_score: {
      score: clampScore(result.delta_score?.score),
      evidence: String(result.delta_score?.evidence || "").slice(0, 240),
      t1_expected_level: String(result.delta_score?.t1_expected_level || "").slice(0, 240),
      final_level: String(result.delta_score?.final_level || "").slice(0, 240)
    },
    best_intervention: result.best_intervention || fallback.best_intervention,
    missed_intervention: String(result.missed_intervention || fallback.missed_intervention),
    confidence: ["high", "medium", "low"].includes(result.confidence) ? result.confidence : fallback.confidence,
    summary_strengths: String(result.summary_strengths || summarizeStrengths(axis_scores)),
    summary_weaknesses: String(result.summary_weaknesses || summarizeWeaknesses(axis_scores))
  };
}

function calculateTotalScore(judge, codeChecks) {
  const processAvg = avg(judge.axis_scores.slice(0, 7).map((axis) => axis.score));
  const axis8 = judge.axis_scores[7]?.score || 0;
  const delta = judge.delta_score?.score || 0;
  return Math.round(
    (processAvg * 12.5)
    + (delta * 3.75)
    + (axis8 * 3.75)
    + codeChecks.score
  );
}

function gradeForTotal(total) {
  if (total >= 85) return "실전 위임형";
  if (total >= 70) return "구조화 활용형";
  if (total >= 55) return "기본 활용형";
  return "초안 의존형";
}

function recommendationFor(axisScores) {
  const weakest = [...axisScores].sort((a, b) => a.score - b.score)[0];
  const map = {
    goal_definition: "첫 턴에서 문제와 최종 산출물을 한 문장으로 고정해보세요.",
    context: "AI가 판단할 수 있도록 대상, 제약, 참고 지표를 함께 제공해보세요.",
    information_structure: "지시, 배경, 조건, 산출물 형식을 구분해서 작성해보세요.",
    task_decomposition: "한 번에 완성 요청하기보다 설계, 초안, 검증, 최종화로 나눠보세요.",
    output_design: "표 형식, 포함 항목, 사용 목적을 함께 지정해보세요.",
    interaction_control: "AI 답변 중 무엇을 선택하거나 버릴지 직접 판단해보세요.",
    verification: "논리 비약, 누락, 데이터 검증 가능성 같은 점검 기준을 제시해보세요.",
    practical_application: "최종본에 실행 주체, 다음 액션, 우선순위를 포함해보세요."
  };
  return map[weakest?.key] || "다음 시도에서는 목표, 맥락, 검증 기준을 더 분명히 제시해보세요.";
}

function inferMoves(text, index) {
  const moves = [];
  if (/(문제|상황|목표|산출물|제약|조건|분석|개선)/i.test(text)) moves.push("M1");
  if (index > 0 && /(선택|제외|좁혀|집중|우선|방향|타깃|반영)/i.test(text)) moves.push("M2");
  if (/(초안|표|목록|구조|정리|작성|만들)/i.test(text)) moves.push("M3");
  if (/(검증|검토|지적|누락|허점|리스크|논리|오류)/i.test(text)) moves.push("M4");
  if (/(최종|회의|공유|제출|완성|최종본)/i.test(text)) moves.push("M5");
  return moves.length ? moves : [];
}

function scoreBySignals(text, regexes) {
  const hits = regexes.filter((regex) => regex.test(text)).length;
  if (hits >= 2) return 4;
  if (hits === 1) return 2;
  return 0;
}

function scoreByScenarioContext(text, scenario) {
  const scenarioTerms = [
    ...scenario.available_info,
    ...scenario.constraints,
    scenario.role,
    scenario.situation
  ].join(" ");
  const tokens = scenarioTerms.match(/[가-힣A-Za-z0-9%]+/g) || [];
  const unique = [...new Set(tokens.filter((token) => token.length >= 2))].slice(0, 30);
  const hits = unique.filter((token) => text.includes(token)).length;
  if (hits >= 6) return 4;
  if (hits >= 3) return 3;
  if (hits >= 1) return 2;
  return 0;
}

function scoreDecomposition(users, moves) {
  const moveSet = new Set(moves.flatMap((move) => move.moves));
  if (users.length >= 5 && moveSet.size >= 4) return 4;
  if (users.length >= 3 && moveSet.size >= 3) return 3;
  if (users.length >= 2) return 2;
  return 0;
}

function scoreFinalOutput(output, scenario) {
  const includes = scenario.expected_output.must_include || [];
  const hits = includes.filter((item) => output.includes(item) || output.includes(item.replace(/\s/g, ""))).length;
  if (hits >= 4 && output.length >= 300) return 4;
  if (hits >= 2 && output.length >= 160) return 3;
  if (output.length >= 80) return 2;
  return 0;
}

function axis(key, label, score, evidence) {
  return { key, axis: label, score, evidence, comment: "" };
}

function keyForAxis(axisName) {
  const found = TRACK3_AXES.find(([, label]) => label === axisName);
  return found?.[0];
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(4, Math.round(number)));
}

function avg(numbers) {
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function quote(text) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  return compact.slice(0, 160);
}

function bestIntervention(moves) {
  const preferred = moves.find((move) => move.moves.includes("M4"))
    || moves.find((move) => move.moves.includes("M2"))
    || moves.find((move) => move.moves.includes("M3"));
  return preferred
    ? { turn: preferred.turn, reason: `${preferred.moves.join(", ")} 기능이 드러났습니다.` }
    : { turn: 0, reason: "뚜렷한 중간 개입이 부족했습니다." };
}

function missedIntervention(axisScores) {
  const weakest = [...axisScores].sort((a, b) => a.score - b.score)[0];
  return `${weakest.axis}을 더 분명히 보여줄 수 있는 개입이 필요했습니다.`;
}

function summarizeStrengths(axisScores) {
  const top = [...axisScores].sort((a, b) => b.score - a.score).slice(0, 2).map((axis) => axis.axis);
  return `${top.join(", ")}에서 비교적 강점이 드러났습니다.`;
}

function summarizeWeaknesses(axisScores) {
  const bottom = [...axisScores].sort((a, b) => a.score - b.score).slice(0, 2).map((axis) => axis.axis);
  return `${bottom.join(", ")} 보완이 필요합니다.`;
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Track3 judge timeout after ${timeoutMs}ms.`)), timeoutMs))
  ]);
}
