import test from "node:test";
import assert from "node:assert/strict";
import { runCodeChecks, validateChatInput, validateSubmitInput } from "../src/track3/codeChecks.js";
import {
  TRACK3_AXES,
  applyRestatementPolicy,
  calculateTrack3ScoreBreakdown,
  calculateTrack3TotalScore,
  judgeTrack3
} from "../src/track3/judge.js";
import {
  buildTrack3ChatMessages,
  compactTrack3AssistantMessage,
  generateTrack3Chat,
  normalizeArtifactText,
  normalizeTrack3Artifact,
  stripTrack3ChatMarkdown
} from "../src/track3/chat.js";
import { listScenarios } from "../src/track3/scenarios.js";

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

test("runCodeChecks contributes up to 20 points", () => {
  const result = runCodeChecks({ turns: sampleTurns });
  assert.equal(result.max, 20);
  assert.equal(result.score, 17);
  assert.equal(result.diagnostic_max, 20);
  assert.equal(result.diagnostic_score, result.score);
  assert.equal(result.checks.length, 6);
  assert.ok(result.checks.every((check) => check.contributes_to_total === true));
});

test("early finish does not count as completing all five turns", () => {
  const result = runCodeChecks({ turns: sampleTurns.slice(0, 4), earlyFinish: true });
  const completion = result.checks.find((check) => check.key === "turn_completion");

  assert.equal(completion.score, 1);
  assert.equal(completion.passed, false);
  assert.match(completion.evidence, /2\/5턴 \(조기 제출\)/);
});

test("normalizeTrack3Artifact rejects user-message and meta-note contamination", () => {
  const previousArtifact = "# 기존 분석안\n- AI가 정리한 핵심 분석";
  const userMessage = "매출 감소 원인을 분석하고 다음 행동을 표로 정리해주세요.";

  assert.equal(normalizeTrack3Artifact(userMessage, { previousArtifact, lastUserMessage: userMessage }), previousArtifact);
  assert.equal(normalizeTrack3Artifact(
    `# 2턴 반영 메모\n사용자 요청: ${userMessage}`,
    { previousArtifact, lastUserMessage: userMessage }
  ), previousArtifact);
  assert.equal(normalizeTrack3Artifact(
    "# 원인 분석\n- 재구매율 하락을 먼저 검증해야 합니다.",
    { previousArtifact, lastUserMessage: userMessage }
  ), "# 원인 분석\n- 재구매율 하락을 먼저 검증해야 합니다.");
});

test("normalizeArtifactText converts section objects to ordered Markdown", () => {
  const sections = ["후보 비교표", "선택안 & 선정 근거", "PRD 초안"];
  const artifact = {
    "PRD 초안": { 목표: "재구매율 개선", 기능: ["쿠폰함", "알림"] },
    "후보 비교표": "| 후보 | 점수 |\n| --- | ---: |\n| 쿠폰함 | 85 |",
    "선택안 & 선정 근거": "쿠폰함을 우선합니다."
  };

  const normalized = normalizeArtifactText(artifact, sections);

  assert.equal(normalized.includes("[object Object]"), false);
  assert.ok(normalized.indexOf("## 후보 비교표") < normalized.indexOf("## 선택안 & 선정 근거"));
  assert.ok(normalized.indexOf("## 선택안 & 선정 근거") < normalized.indexOf("## PRD 초안"));
  assert.match(normalized, /\*\*목표\*\*: 재구매율 개선/);
  assert.match(normalized, /- 쿠폰함/);
});

test("normalizeTrack3Artifact accepts object output without leaking object coercion", () => {
  const normalized = normalizeTrack3Artifact(
    { "핵심 문제 & 지표 해석": "신규 고객 증가가 매출로 연결되지 않습니다." },
    { artifactSections: ["핵심 문제 & 지표 해석"] }
  );

  assert.equal(normalized, "## 핵심 문제 & 지표 해석\n신규 고객 증가가 매출로 연결되지 않습니다.");
});

test("Track 3 chat fallback preserves the prior artifact without copying user input", async () => {
  const original = process.env.ENABLE_TRACK3_CHAT_MODEL;
  process.env.ENABLE_TRACK3_CHAT_MODEL = "false";
  const previousArtifact = "# 기존 산출물\n- AI가 작성한 내용";
  const userMessage = "이 문장을 작업 영역에 그대로 넣지 마세요.";

  let result;
  try {
    result = await generateTrack3Chat({
      scenarioId: "pm_001",
      turns: [],
      userMessage,
      artifact: previousArtifact
    });
  } finally {
    if (original == null) delete process.env.ENABLE_TRACK3_CHAT_MODEL;
    else process.env.ENABLE_TRACK3_CHAT_MODEL = original;
  }

  assert.equal(result.artifact, previousArtifact);
  assert.equal(result.artifact.includes(userMessage), false);
  assert.match(result.assistantMessage, /기존 최종 제출물 초안을 유지/);
});

test("stripTrack3ChatMarkdown converts assistant Markdown to readable plain text", () => {
  const markdown = [
    "### 분석 결과",
    "**핵심 원인**은 `재구매율 하락`입니다.",
    "- [관련 자료](https://example.com)를 확인하세요.",
    "> ~~추정~~보다 검증이 필요합니다.",
    "```text",
    "검증 계획",
    "```"
  ].join("\n");

  const plainText = stripTrack3ChatMarkdown(markdown);
  assert.equal(plainText, [
    "분석 결과",
    "핵심 원인은 재구매율 하락입니다.",
    "• 관련 자료를 확인하세요.",
    "추정보다 검증이 필요합니다.",
    "검증 계획"
  ].join("\n"));
  assert.doesNotMatch(plainText, /[#*_`~>\[\]]/);
});

test("buildTrack3ChatMessages preserves roles and keeps the latest user request last", () => {
  const turns = [
    { role: "user", content: "먼저 핵심 문제를 정의해줘." },
    { role: "assistant", content: "핵심 문제는 재구매율 하락입니다." },
    { role: "user", content: "방금 답변에서 검증할 지표만 세 개 골라줘." }
  ];

  const messages = buildTrack3ChatMessages({
    turns,
    artifact: "# 현재 분석안\n재구매율 하락을 우선 분석한다.",
    artifactSections: ["핵심 문제 & 지표 해석", "데이터 & 검증 계획"]
  });

  assert.deepEqual(messages.map((message) => message.role), ["system", "user", "assistant", "user"]);
  assert.equal(messages.at(-1).content, "방금 답변에서 검증할 지표만 세 개 골라줘.");
  assert.match(messages[0].content, /current_artifact/);
  assert.match(messages[0].content, /현재 분석안/);
  assert.match(messages[0].content, /## 핵심 문제 & 지표 해석/);
  assert.equal(messages.slice(1).some((message) => message.content.includes("previous_artifact")), false);
});

test("Track 3 scenarios expose three or four artifact sections", () => {
  const scenarios = listScenarios();

  assert.equal(scenarios.length, 3);
  assert.ok(scenarios.every((scenario) => scenario.artifact_sections.length >= 3));
  assert.ok(scenarios.every((scenario) => scenario.artifact_sections.length <= 4));
  assert.deepEqual(scenarios[0].artifact_sections, ["후보 비교표", "선택안 & 선정 근거", "PRD 초안"]);
});

test("compactTrack3AssistantMessage keeps chat concise while artifact holds details", () => {
  const longReply = "알겠습니다. 요청하신 내용을 반영해 핵심 문제와 지표 해석을 정리하겠습니다. 이어서 재구매율, 평균 주문 금액, 고객 세그먼트별 차이와 검증 방법을 자세히 설명하고 실행 순서까지 모두 안내드리겠습니다.";
  const compact = compactTrack3AssistantMessage(longReply);

  assert.ok(compact.length <= 110);
  assert.match(compact, /^알겠습니다\./);
  assert.equal(compact.includes("실행 순서까지 모두 안내"), false);
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
  }, { turnCount: 5 });

  assert.deepEqual(enforced.axisScores.slice(0, 7).map((axis) => axis.score), [1, 1, 1, 0, 1, 0, 0]);
  assert.equal(enforced.axisScores[7].score, 4);
  assert.equal(enforced.deltaScore, 0);
  assert.equal(enforced.sequenceValid, false);
  assert.equal(total, 22);
});

test("Track 3 score combines LLM 80 and code 20", () => {
  const perfectJudge = {
    axis_scores: TRACK3_AXES.map(([key, axis]) => ({ key, axis, score: 4 })),
    delta_score: { score: 4 }
  };
  const breakdown = calculateTrack3ScoreBreakdown(perfectJudge, {
    codeChecks: { score: 20 },
    turnCount: 5
  });

  assert.deepEqual(breakdown.llm_judge, {
    score: 80,
    max: 80,
    process: 50,
    delta: 15,
    result: 15
  });
  assert.deepEqual(breakdown.code_based, { score: 20, max: 20 });
  assert.equal(breakdown.total, 100);
});

test("completion adjustment separates two-turn and five-turn answers", () => {
  const twoTurnJudge = {
    axis_scores: [4, 4, 3, 2, 3, 2, 2, 3].map((score, index) => ({
      key: TRACK3_AXES[index][0],
      axis: TRACK3_AXES[index][1],
      score
    })),
    delta_score: { score: 2 }
  };
  const fiveTurnJudge = {
    axis_scores: [4, 4, 4, 3, 3, 3, 3, 3].map((score, index) => ({
      key: TRACK3_AXES[index][0],
      axis: TRACK3_AXES[index][1],
      score
    })),
    delta_score: { score: 3 }
  };

  const twoTurn = calculateTrack3ScoreBreakdown(twoTurnJudge, {
    codeChecks: { score: 15 },
    turnCount: 2,
    earlyFinish: true
  });
  const fiveTurn = calculateTrack3ScoreBreakdown(fiveTurnJudge, {
    codeChecks: { score: 20 },
    turnCount: 5
  });

  assert.equal(twoTurn.total, 38);
  assert.equal(twoTurn.completion.multiplier, 0.55);
  assert.equal(fiveTurn.total, 85);
  assert.equal(fiveTurn.completion.multiplier, 1);
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
