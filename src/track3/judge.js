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
    .catch((error) => {
      console.error("[track3:judge] OpenAI 호출 실패, 휴리스틱 채점으로 전환합니다:", error.message);
      return buildHeuristicJudge({ scenario, turns, finalOutput });
    });
  const normalizedJudge = normalizeJudgeResult(judgeResult, { scenario, turns, finalOutput });
  const total = calculateTrack3TotalScore(normalizedJudge);

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
    evidence_assessment: normalizedJudge.evidence_assessment,
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
    axis("goal_definition", "목표 정의", scoreBySignals(first, [/문제|목표|선정|결정|개선|분석|기획|계획|만들/i, /산출물|분석안|보고서|기획서|PRD|표|결과|초안/i]), quote(first)),
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
    evidence_assessment: {
      scenario_restatement_only: false,
      user_added_value: [],
      reason: "휴리스틱 모드에서는 시나리오 재진술 여부를 의미적으로 판정하지 않습니다."
    },
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

function normalizeJudgeResult(result, { scenario, turns, finalOutput }) {
  const fallback = buildHeuristicJudge({ scenario, turns, finalOutput });
  const evidenceAssessment = normalizeEvidenceAssessment(result.evidence_assessment, fallback.evidence_assessment);
  const fallbackByKey = new Map(fallback.axis_scores.map((item) => [item.key, item]));
  const byKey = new Map((Array.isArray(result.axis_scores) ? result.axis_scores : []).map((item) => [item.key || keyForAxis(item.axis), item]));
  let axis_scores = TRACK3_AXES.map(([key, label]) => {
    const item = byKey.get(key) || fallbackByKey.get(key) || {};
    const score = item.score == null ? clampScore(fallbackByKey.get(key)?.score) : clampScore(item.score);
    const evidence = String(item.evidence || "").slice(0, 240);
    return {
      key,
      axis: label,
      score,
      max: 4,
      rate: Math.round((score / 4) * 100) / 100,
      evidence,
      comment: safeAxisComment(item.comment, { key, score, evidence, turns })
    };
  });

  let deltaScore = clampScore(result.delta_score?.score);
  let sequenceValid = Boolean(result.sequence_valid);
  if (evidenceAssessment.scenario_restatement_only) {
    const enforced = applyRestatementPolicy({ axisScores: axis_scores, deltaScore, sequenceValid });
    axis_scores = enforced.axisScores;
    deltaScore = enforced.deltaScore;
    sequenceValid = enforced.sequenceValid;
  }

  return {
    move_tagging: Array.isArray(result.move_tagging) ? result.move_tagging : fallback.move_tagging,
    sequence_valid: sequenceValid,
    evidence_assessment: evidenceAssessment,
    axis_scores,
    delta_score: {
      score: deltaScore,
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

export function calculateTrack3TotalScore(judge) {
  const processAvg = avg(judge.axis_scores.slice(0, 7).map((axis) => axis.score));
  const axis8 = judge.axis_scores[7]?.score || 0;
  const delta = judge.delta_score?.score || 0;
  const judgeScore =
    (processAvg * 12.5)
    + (delta * 3.75)
    + (axis8 * 3.75);
  return Math.round((judgeScore / 80) * 100);
}

function normalizeEvidenceAssessment(value, fallback) {
  const assessment = value && typeof value === "object" ? value : fallback;
  return {
    scenario_restatement_only: assessment?.scenario_restatement_only === true,
    user_added_value: Array.isArray(assessment?.user_added_value)
      ? assessment.user_added_value.map((item) => String(item).slice(0, 160)).slice(0, 5)
      : [],
    reason: String(assessment?.reason || "").slice(0, 240)
  };
}

function safeAxisComment(value, { key, score, evidence, turns }) {
  const comment = String(value || "").replace(/\s+/g, " ").trim();
  const userText = userTurns(turns).map((turn) => turn.content).join(" ");
  const unsafe = !comment
    || comment.length > 140
    || normalizeComparable(comment) === normalizeComparable(evidence)
    || sharesLongSequence(comment, userText);

  return unsafe ? axisFeedbackFor(key, score) : comment;
}

function normalizeComparable(value) {
  return String(value || "").toLowerCase().replace(/[^가-힣a-z0-9]/g, "");
}

function sharesLongSequence(left, right, size = 18) {
  const source = normalizeComparable(left);
  const target = normalizeComparable(right);
  if (source.length < size || target.length < size) return false;
  for (let index = 0; index <= source.length - size; index += 1) {
    if (target.includes(source.slice(index, index + size))) return true;
  }
  return false;
}

function axisFeedbackFor(key, score) {
  const level = score >= 3 ? "high" : score >= 2 ? "mid" : "low";
  const feedback = {
    goal_definition: {
      high: "해결할 문제와 기대하는 결과물이 명확하게 연결되어 있어요.",
      mid: "목표는 드러나지만 기대하는 결과물을 조금 더 구체화할 필요가 있어요.",
      low: "해결할 문제와 최종 결과물을 먼저 명확하게 정해보세요."
    },
    context: {
      high: "AI가 판단하는 데 필요한 배경과 제약 조건을 충분히 제공했어요.",
      mid: "기본 맥락은 전달했지만 대상과 제약 조건을 더 보강하면 좋아요.",
      low: "AI가 상황을 판단할 수 있도록 배경, 대상, 제약 조건을 추가해보세요."
    },
    information_structure: {
      high: "지시와 배경, 조건이 구분되어 정보를 쉽게 파악할 수 있어요.",
      mid: "핵심 정보는 있지만 지시와 배경을 더 분명하게 나누면 좋아요.",
      low: "지시, 배경, 조건, 산출물 형식을 구분해서 전달해보세요."
    },
    task_decomposition: {
      high: "복잡한 작업을 목적에 맞는 단계로 나누어 진행했어요.",
      mid: "작업을 일부 나누었지만 단계별 목적을 더 선명하게 정하면 좋아요.",
      low: "한 번에 완성하기보다 설계, 초안, 검증, 최종화로 나누어보세요."
    },
    output_design: {
      high: "사용 목적에 맞게 결과물의 형식과 포함 항목을 구체적으로 설계했어요.",
      mid: "결과물 형식은 제시했지만 분량과 포함 항목을 더 구체화하면 좋아요.",
      low: "결과물의 형식, 분량, 포함 항목과 사용 목적을 함께 지정해보세요."
    },
    interaction_control: {
      high: "AI의 답변을 바탕으로 방향과 우선순위를 능동적으로 조정했어요.",
      mid: "후속 요청은 있었지만 선택과 제외의 근거를 더 분명히 제시하면 좋아요.",
      low: "AI의 제안 중 선택할 것과 제외할 것을 직접 판단해보세요."
    },
    verification: {
      high: "오류와 누락을 확인할 구체적인 검증 기준을 제시했어요.",
      mid: "검토를 요청했지만 확인할 기준을 더 구체적으로 정하면 좋아요.",
      low: "논리 비약, 누락, 실행 가능성처럼 구체적인 기준으로 검증을 요청해보세요."
    },
    practical_application: {
      high: "최종 결과물이 실제 업무에서 바로 활용할 수 있는 형태로 완성됐어요.",
      mid: "결과물의 기본 구조는 갖췄지만 실행 항목을 더 보완하면 좋아요.",
      low: "담당자, 우선순위와 다음 행동을 포함해 실제 사용할 수 있게 완성해보세요."
    }
  };
  return feedback[key]?.[level] || "이번 평가축에서 다음 행동을 더 구체적으로 보여주세요.";
}

export function applyRestatementPolicy({ axisScores, deltaScore, sequenceValid }) {
  return {
    axisScores: applyRestatementCaps(axisScores),
    deltaScore: 0,
    sequenceValid: false
  };
}

function applyRestatementCaps(axisScores) {
  const caps = {
    goal_definition: 1,
    context: 1,
    information_structure: 1,
    task_decomposition: 0,
    output_design: 1,
    interaction_control: 0,
    verification: 0
  };

  return axisScores.map((axis) => {
    const cap = caps[axis.key];
    if (cap == null || axis.score <= cap) return axis;
    const score = cap;
    return {
      ...axis,
      score,
      rate: Math.round((score / axis.max) * 100) / 100,
      comment: axis.comment
        ? `${axis.comment} 시나리오 재진술 상한을 적용했습니다.`
        : "시나리오 재진술 상한을 적용했습니다."
    };
  });
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
