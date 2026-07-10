import test from "node:test";
import assert from "node:assert/strict";
import { runCodeChecks, validateChatInput, validateSubmitInput } from "../src/track3/codeChecks.js";
import {
  TRACK3_AXES,
  applyRestatementPolicy,
  calculateTrack3TotalScore,
  judgeTrack3
} from "../src/track3/judge.js";

const sampleTurns = [
  { role: "user", content: "다음 분기 핵심 기능 하나를 선정하고 회의용 PRD 초안을 만들려고 합니다." },
  { role: "assistant", content: "후보별 비교 프레임을 잡아보겠습니다." },
  { role: "user", content: "개발자 2명, 디자이너 1명, 3주 안에 가능한지를 중요 기준으로 좁혀주세요." },
  { role: "assistant", content: "좋습니다." },
  { role: "user", content: "비교 기준, 기능 선정 결과, 선정 근거, 목표, 성공지표, 범위, 제외범위, 일정을 표로 정리해주세요." },
  { role: "assistant", content: "초안입니다." },
  { role: "user", content: "논리 비약, 누락된 고려사항, 3주 안에 어려운 범위를 검토하고 지적해주세요." },
  { role: "assistant", content: "검토했습니다." },
  { role: "user", content: "그 지적을 반영해서 최종 PRD 초안으로 완성해주세요." }
];

test("validateChatInput rejects short messages and max turns", () => {
  assert.equal(validateChatInput({ turns: [], userMessage: "짧음" }).valid, false);
  assert.equal(validateChatInput({ turns: sampleTurns, userMessage: "추가 요청입니다" }).valid, false);
});

test("runCodeChecks returns observable signals as diagnostics only", () => {
  const result = runCodeChecks({ turns: sampleTurns });
  assert.equal(result.max, 0);
  assert.equal(result.score, 0);
  assert.equal(result.diagnostic_max, 20);
  assert.ok(result.diagnostic_score >= 14);
  assert.equal(result.checks.length, 6);
  assert.ok(result.checks.every((check) => check.contributes_to_total === false));
});

test("scenario restatement policy caps an otherwise inflated evaluation", () => {
  const inflatedAxes = TRACK3_AXES.map(([key, axis]) => ({
    key,
    axis,
    score: 4,
    max: 4,
    rate: 1,
    evidence: "시나리오 원문",
    comment: ""
  }));

  const enforced = applyRestatementPolicy({
    axisScores: inflatedAxes,
    deltaScore: 4,
    sequenceValid: true
  });
  const total = calculateTrack3TotalScore({
    axis_scores: enforced.axisScores,
    delta_score: { score: enforced.deltaScore }
  });

  assert.deepEqual(enforced.axisScores.slice(0, 7).map((axis) => axis.score), [1, 1, 1, 0, 1, 0, 0]);
  assert.equal(enforced.axisScores[7].score, 4);
  assert.equal(enforced.deltaScore, 0);
  assert.equal(enforced.sequenceValid, false);
  assert.equal(total, 28);
});

test("validateSubmitInput accepts a usable final output", () => {
  const result = validateSubmitInput({
    turns: sampleTurns,
    finalOutput: "비교 기준, 기능 선정 결과, 선정 근거, 목표, 성공지표, 범위, 제외범위, 일정이 포함된 최종 PRD 초안입니다."
  });
  assert.equal(result.valid, true);
});

test("judgeTrack3 returns a demo evaluation without OpenAI", async () => {
  const original = process.env.ENABLE_TRACK3_LLM_JUDGE;
  process.env.ENABLE_TRACK3_LLM_JUDGE = "false";
  const result = await judgeTrack3({
    scenarioId: "pm_001",
    turns: sampleTurns,
    finalOutput: [
      "기능 선정 결과: 위시리스트 공유 기능",
      "선정 근거: 3주 안에 개발자 2명과 디자이너 1명으로 MVP 범위 구현 가능",
      "목표: 선물 탐색과 공유 전환 개선",
      "성공지표: 공유 클릭률, 공유 후 구매 전환율",
      "범위: 위시리스트 생성, 공유 링크, 기본 상품 카드",
      "제외범위: 추천 알고리즘 고도화, 쿠폰 정책 변경",
      "일정: 1주차 설계, 2주차 구현, 3주차 QA 및 릴리즈"
    ].join("\n")
  });
  process.env.ENABLE_TRACK3_LLM_JUDGE = original;

  assert.equal(result.track, "track3");
  assert.equal(result.axis_scores.length, 8);
  assert.ok(result.axis_scores.every((axis) => axis.comment.length > 0));
  assert.ok(result.axis_scores.every((axis) => !axis.comment.includes("다음 분기 핵심 기능 하나를 선정")));
  assert.ok(result.total > 0);
});

test("judgeTrack3 gives different scores for weak and strong conversations", async () => {
  const original = process.env.ENABLE_TRACK3_LLM_JUDGE;
  process.env.ENABLE_TRACK3_LLM_JUDGE = "false";

  const weakTurns = Array.from({ length: 5 }, () => ([
    { role: "user", content: "아무거나 해줘" },
    { role: "assistant", content: "요청을 반영했습니다." }
  ])).flat();

  const weak = await judgeTrack3({
    scenarioId: "pm_001",
    turns: weakTurns,
    finalOutput: "작업 초안입니다. 아직 구체적인 목표, 맥락, 제약, 산출물 형식이 충분히 정리되지 않았습니다."
  });

  const strong = await judgeTrack3({
    scenarioId: "pm_001",
    turns: sampleTurns,
    finalOutput: [
      "기능 선정 결과: 위시리스트 공유 기능",
      "선정 근거: 3주 안에 개발자 2명과 디자이너 1명으로 MVP 범위 구현 가능",
      "목표: 선물 탐색과 공유 전환 개선",
      "성공지표: 공유 클릭률, 공유 후 구매 전환율",
      "범위: 위시리스트 생성, 공유 링크, 기본 상품 카드",
      "제외범위: 추천 알고리즘 고도화, 쿠폰 정책 변경",
      "일정: 1주차 설계, 2주차 구현, 3주차 QA 및 릴리즈"
    ].join("\n")
  });

  process.env.ENABLE_TRACK3_LLM_JUDGE = original;

  assert.ok(strong.total > weak.total);
  assert.ok(strong.axis_scores.find((axis) => axis.key === "context").score > weak.axis_scores.find((axis) => axis.key === "context").score);
});
