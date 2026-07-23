import test from "node:test";
import assert from "node:assert/strict";
import { analyzeTrack3Integrity, runCodeChecks, validateChatInput, validateSubmitInput } from "../src/track3/codeChecks.js";
import {
  TRACK3_AXES,
  applyMoveScoreConsistency,
  applyRepetitionPolicy,
  applyRestatementPolicy,
  calculateTrack3ScoreBreakdown,
  calculateTrack3TotalScore,
  judgeTrack3
} from "../src/track3/judge.js";
import {
  applyCanonicalTerms,
  buildTrack3ChatMessages,
  buildTrack3AssistantMessage,
  compactTrack3AssistantMessage,
  generateTrack3Chat,
  mergeTrack3ArtifactSections,
  mergeTrack3SectionUpdates,
  normalizeArtifactText,
  normalizeTrack3SectionUpdates,
  normalizeUpdatedSections,
  normalizeTrack3Artifact,
  stripTrack3ArtifactMeta,
  stripTrack3ChatMarkdown
} from "../src/track3/chat.js";
import { TRACK3_CHAT_SYSTEM_PROMPT, TRACK3_JUDGE_SYSTEM_PROMPT } from "../src/track3/judgePrompt.js";
import { getScenario, listScenarios } from "../src/track3/scenarios.js";

const sampleTurns = [
  { role: "user", content: "다음 분기 핵심 기능 하나를 선정하고 회의용 실행 계획을 만들려고 합니다." },
  { role: "assistant", content: "후보별 비교 프레임을 잡아보겠습니다." },
  { role: "user", content: "3주 안에 가능한지를 중요 기준으로 삼고 후보별 리스크를 비교해주세요." },
  { role: "assistant", content: "좋습니다." },
  { role: "user", content: "문제 정의, 비교 기준, 기능 선정 결과, 선정 근거, 실행 계획, 검증 방법을 표로 정리해주세요." },
  { role: "assistant", content: "초안입니다." },
  { role: "user", content: "논리 비약, 누락된 고려사항, 3주 안에 어려운 범위를 검토하고 지적해주세요." },
  { role: "assistant", content: "검토했습니다." },
  { role: "user", content: "그 지적을 반영해서 작업 영역 전체를 회의용 실행 계획으로 완성해주세요." }
];

test("Track 3 Judge prompt includes operational process and delta anchors", () => {
  for (const axis of [
    "1. 목표 정의",
    "2. 맥락 제공",
    "3. 정보 구조화",
    "4. 작업 분해",
    "5. 출력 설계",
    "6. 상호작용 조율",
    "7. 검증 유도"
  ]) {
    assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, new RegExp(axis.replace(".", "\\.")));
  }

  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /Intervention-effect delta score, 0-4/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /A strong first prompt must not by itself reduce the delta score/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /Requests to add metrics.*are not verification/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /Without both M4 and M5, the maximum is 3/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /If any turn is tagged M4, verification cannot be 0/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /Delta 4 requires an M4 turn followed by a later M5 turn/);
  for (const score of [4, 3, 2, 1, 0]) {
    assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, new RegExp(`- ${score}:`));
  }
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /identify the relevant turn numbers and the concrete final-output change/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /full cumulative workspace as the final deliverable/);
  assert.match(TRACK3_JUDGE_SYSTEM_PROMPT, /workspace sections only to corroborate/);
  assert.doesNotMatch(TRACK3_CHAT_SYSTEM_PROMPT, /finalization_requested/);
});

test("validateChatInput rejects short messages and max turns", () => {
  assert.equal(validateChatInput({ turns: [], userMessage: "짧음" }).valid, false);
  assert.equal(validateChatInput({ turns: sampleTurns, userMessage: "추가 요청입니다" }).valid, false);
});

test("runCodeChecks contributes up to 20 points", () => {
  const result = runCodeChecks({ turns: sampleTurns });
  assert.equal(result.max, 20);
  assert.equal(result.score, 20);
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
  assert.match(completion.evidence, /2\/5 유효 턴 \(입력 2턴\) \(조기 제출\)/);
});

test("repeated prompts count as one effective turn", () => {
  const repeatedTurns = Array.from({ length: 5 }, () => ([
    { role: "user", content: "같은 요청을 반복해서 입력하고 있습니다. 비교표를 만들어주세요." },
    { role: "assistant", content: "요청을 확인했습니다." }
  ])).flat();
  const integrity = analyzeTrack3Integrity({ turns: repeatedTurns, scenario: getScenario("pm_001") });
  const checks = runCodeChecks({ turns: repeatedTurns, scenario: getScenario("pm_001") });

  assert.equal(integrity.raw_turn_count, 5);
  assert.equal(integrity.effective_turn_count, 1);
  assert.equal(integrity.duplicate_turn_count, 4);
  assert.equal(checks.integrity.effective_turn_count, 1);
  assert.equal(checks.checks.find((check) => check.key === "turn_completion").score, 0);
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

test("stripTrack3ArtifactMeta removes feedback notes but preserves the deliverable", () => {
  const artifact = [
    "## 분석 가설 & 우선순위",
    "- 재구매율 하락을 1순위로 검증합니다.",
    "- 고객 피드백을 정성 분석합니다.",
    "",
    "## 피드백 반영",
    "- 사용자가 LTV를 추가해달라고 요청함",
    "- 수정 요청: KPI를 더 구체화",
    "",
    "## 데이터 & 검증 계획",
    "- 코호트별 LTV를 비교합니다."
  ].join("\n");

  const sanitized = stripTrack3ArtifactMeta(artifact);

  assert.match(sanitized, /재구매율 하락을 1순위로 검증/);
  assert.match(sanitized, /고객 피드백을 정성 분석/);
  assert.match(sanitized, /## 데이터 & 검증 계획/);
  assert.equal(sanitized.includes("사용자가 LTV"), false);
  assert.equal(sanitized.includes("수정 요청"), false);
});

test("stripTrack3ArtifactMeta removes labeled feedback lines inside a valid section", () => {
  const artifact = [
    "## PRD 초안",
    "- 목표: 재구매율을 개선합니다.",
    "- 피드백 반영: 알림 기능을 추가해달라는 요청",
    "- 핵심 기능: 쿠폰 만료 알림"
  ].join("\n");

  assert.equal(
    stripTrack3ArtifactMeta(artifact),
    "## PRD 초안\n- 목표: 재구매율을 개선합니다.\n- 핵심 기능: 쿠폰 만료 알림"
  );
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
  assert.match(result.assistantMessage, /기존 작업 영역을 유지/);
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

test("buildTrack3ChatMessages includes only the output contract, not hidden scenario facts", () => {
  const scenario = getScenario("marketing_001");
  const messages = buildTrack3ChatMessages({
    scenario,
    turns: [{ role: "user", content: "원인 가설만 먼저 정리해주세요." }]
  });
  const system = messages[0].content;

  assert.match(system, /이모레퍼시픽/);
  assert.match(system, /expected_output/);
  assert.doesNotMatch(system, /300만원/);
  assert.doesNotMatch(system, /재구매율 8%/);
  assert.match(system, /Do not pre-fill untouched sections/);
  assert.match(system, /user turn 1 of 5/);
});

test("Track 3 applies structured section updates regardless of command phrasing", async () => {
  const phrases = [
    "뉴스를 바탕으로 원인 가설을 세워줘.",
    "가설별 적합성 우선순위를 매겨줘.",
    "우선 원인 가설부터 정리하는 것으로."
  ];
  const chatModel = async () => ({
    assistant_message: "원인 가설을 정리했습니다.",
    request_kind: "artifact_update",
    section_updates: [{
      section: "원인 가설 & 뉴스 근거",
      content: "효과 체감 전 이탈을 우선 검증합니다."
    }]
  });

  for (const userMessage of phrases) {
    const result = await generateTrack3Chat({
      scenarioId: "marketing_001",
      turns: [],
      userMessage,
      artifact: ""
    }, { chatModel });

    assert.deepEqual(result.updatedSections, ["원인 가설 & 뉴스 근거"]);
    assert.match(result.artifact, /효과 체감 전 이탈/);
  }
});

test("Track 3 still rejects unsolicited artifact changes for context-only input", async () => {
  const result = await generateTrack3Chat({
    scenarioId: "marketing_001",
    turns: [],
    userMessage: "난 이모레퍼시픽 마케팅 담당자야.",
    artifact: ""
  }, {
    chatModel: async () => ({
      assistant_message: "역할을 확인했습니다.",
      request_kind: "context_only",
      section_updates: [{
        section: "원인 가설 & 뉴스 근거",
        content: "요청하지 않은 가설입니다."
      }]
    })
  });

  assert.deepEqual(result.updatedSections, []);
  assert.equal(result.artifact, "");
});

test("structured updates preserve untouched sections and ignore unknown headings", () => {
  const sections = ["원인 가설", "타깃", "성과 지표"];
  const updates = normalizeTrack3SectionUpdates([
    { section: "허용되지 않은 섹션", content: "무시됩니다." },
    { section: "원인 가설", content: "## 원인 가설\n새 가설입니다." }
  ], { artifactSections: sections });

  assert.deepEqual(updates, [{ section: "원인 가설", content: "새 가설입니다." }]);
  assert.equal(mergeTrack3SectionUpdates({
    previousArtifact: "## 타깃\n기존 타깃입니다.",
    artifactSections: sections,
    sectionUpdates: updates
  }), "## 원인 가설\n새 가설입니다.\n\n## 타깃\n기존 타깃입니다.");
});

test("chat success message is based on content that actually passed section validation", async () => {
  const result = await generateTrack3Chat({
    scenarioId: "marketing_001",
    userMessage: "원인 가설을 뉴스 근거와 함께 비교해주세요."
  }, {
    chatModel: async () => ({
      assistant_message: "원인 가설 영역을 업데이트했습니다.",
      request_kind: "artifact_update",
      section_updates: [{ section: "잘못된 섹션명", content: "표시되면 안 됩니다." }]
    })
  });

  assert.deepEqual(result.updatedSections, []);
  assert.equal(result.artifact, "");
  assert.match(result.assistantMessage, /반영하지 못했습니다/);
  assert.doesNotMatch(result.assistantMessage, /업데이트했습니다/);
});

test("mergeTrack3ArtifactSections applies only sections declared as updated", () => {
  const sections = ["원인 가설", "타깃", "실행안"];
  const previousArtifact = [
    "## 타깃",
    "기존 타깃을 유지합니다."
  ].join("\n");
  const candidateArtifact = [
    "## 원인 가설",
    "효과 체감 전 이탈을 검증합니다.",
    "",
    "## 타깃",
    "AI가 요청 없이 바꾼 타깃입니다.",
    "",
    "## 실행안",
    "AI가 미리 만든 실행안입니다."
  ].join("\n");

  assert.equal(mergeTrack3ArtifactSections({
    candidateArtifact,
    previousArtifact,
    artifactSections: sections,
    updatedSections: ["원인 가설"]
  }), "## 원인 가설\n효과 체감 전 이탈을 검증합니다.\n\n## 타깃\n기존 타깃을 유지합니다.");
});

test("mergeTrack3ArtifactSections preserves prior content when an updated section is truncated", () => {
  assert.equal(mergeTrack3ArtifactSections({
    candidateArtifact: "## 원인 가설\n새 가설입니다.",
    previousArtifact: "## 원인 가설\n기존 가설입니다.\n\n## 타깃\n기존 타깃입니다.",
    artifactSections: ["원인 가설", "타깃"],
    updatedSections: ["원인 가설", "타깃"]
  }), "## 원인 가설\n새 가설입니다.\n\n## 타깃\n기존 타깃입니다.");
});

test("mergeTrack3ArtifactSections rejects unsolicited content when no section was updated", () => {
  assert.equal(mergeTrack3ArtifactSections({
    candidateArtifact: "## 핵심 문제\nAI가 요청 없이 만든 내용입니다.",
    previousArtifact: "",
    artifactSections: ["핵심 문제", "분석 계획"],
    updatedSections: []
  }), "");
});

test("canonical terms correct user-substituted organization names", () => {
  const scenario = getScenario("marketing_001");
  const corrected = applyCanonicalTerms(
    "아모레퍼시픽 캠페인과 이모레 퍼시픽의 예산안",
    scenario.canonical_terms
  );

  assert.equal(corrected, "이모레퍼시픽 캠페인과 이모레퍼시픽의 예산안");
});

test("assistant message summarizes updated sections and falls back from casual speech", () => {
  const sections = ["원인 가설 & 뉴스 근거"];

  assert.deepEqual(normalizeUpdatedSections(["원인 가설 & 뉴스 근거", "허용되지 않은 섹션"], sections), sections);
  assert.equal(
    buildTrack3AssistantMessage("가설을 뉴스 근거와 연결했어", sections),
    "‘원인 가설 & 뉴스 근거’ 영역을 업데이트했습니다."
  );
  assert.match(
    buildTrack3AssistantMessage("뉴스 2를 근거로 초기 이탈 가설을 보강했습니다.", sections),
    /업데이트했습니다.*보강했습니다/
  );
});

test("Track 3 scenarios expose four cumulative workspace sections", () => {
  const scenarios = listScenarios();

  assert.equal(scenarios.length, 3);
  assert.equal(scenarios[0].artifact_sections.length, 4);
  assert.equal(scenarios[1].artifact_sections.length, 4);
  assert.equal(scenarios[2].artifact_sections.length, 4);
  assert.deepEqual(scenarios[0].artifact_sections, ["문제 정의", "후보 비교 기준 & 비교표", "선택안 & 선정 근거", "실행 계획 & 검증 방법"]);
  assert.ok(scenarios.every((scenario) => !scenario.final_artifact_section));
  assert.equal(getScenario("marketing_001").role, "이모레퍼시픽 스킨케어팀의 마케팅 담당자");
  assert.equal(getScenario("da_001").role, "마켓쿨리의 데이터 분석 담당자");
});

test("Track 3 scenario API exposes the canonical frontend display model", () => {
  const scenarios = listScenarios();
  const pm = scenarios.find((scenario) => scenario.scenario_id === "pm_001");
  const marketing = scenarios.find((scenario) => scenario.scenario_id === "marketing_001");
  const data = scenarios.find((scenario) => scenario.scenario_id === "da_001");

  assert.equal(pm.title, "PM");
  assert.equal(pm.scenario_title, "분기 핵심 기능 우선순위 결정");
  assert.deepEqual(pm.situation, [
    "당신은 키키오 선물하기 프로덕트 팀의 PM입니다. 다음 분기 3주 동안 만들 핵심 기능 하나를 정해야 합니다.",
    "개발자는 '쿠폰함 알림 기능'을, 디자이너는 '위시리스트 공유 기능'을, 데이터 분석가는 '구매 후 추천 기능'을 각각 1순위로 제안했습니다. 기간은 3주뿐이라 셋 중 하나만 선택해야 합니다.",
    "AI에게 후보를 비교할 의사결정 프레임워크를 요청하고, 최종적으로 다음 회의에 바로 쓸 수 있는 세부기획안(제품요구사항문서) 초안을 만들어보세요."
  ]);
  assert.match(marketing.news[2], /뮈신사 뷰티 공격적인 할인 공세/);
  assert.equal(data.metrics.length, 5);
  assert.equal(data.dataSchemas.length, 3);
  assert.match(data.situation[1], /가장 먼저 확인해야 할 문제는 무엇인가/);
});

test("Track 3 backend does not invent PM resources or alter candidate ownership", () => {
  const scenario = getScenario("pm_001");
  const serialized = JSON.stringify(scenario);

  assert.match(serialized, /개발자 제안: 쿠폰함 알림 기능/);
  assert.match(serialized, /디자이너 제안: 위시리스트 공유 기능/);
  assert.match(serialized, /데이터 분석가 제안: 구매 후 추천 기능/);
  assert.doesNotMatch(serialized, /개발자 2명|디자이너 1명|영업팀 제안|쿠폰함 기능"/);
});

test("Track 3 Judge context contains every canonical scenario paragraph", () => {
  for (const scenario of ["pm_001", "marketing_001", "da_001"].map(getScenario)) {
    for (const paragraph of scenario.display.situation) {
      assert.ok(
        scenario.situation.includes(paragraph),
        `${scenario.scenario_id} Judge context is missing: ${paragraph}`
      );
    }
  }
});

test("Track 3 accepts updates to any requested workspace section", async () => {
  const chatModel = async () => ({
    assistant_message: "요청을 반영했습니다.",
    request_kind: "artifact_update",
    section_updates: [{ section: "성과 지표 & 기대효과", content: "다음 달 재구매율 목표와 점검 지표입니다." }]
  });

  const result = await generateTrack3Chat({
    scenarioId: "marketing_001",
    userMessage: "성과 지표와 기대효과를 구체적으로 작성해주세요."
  }, { chatModel });
  assert.deepEqual(result.updatedSections, ["성과 지표 & 기대효과"]);
  assert.match(result.artifact, /## 성과 지표 & 기대효과/);
});

test("compactTrack3AssistantMessage keeps chat concise while artifact holds details", () => {
  const longReply = "알겠습니다. 요청하신 내용을 반영해 핵심 문제와 지표 해석을 정리하겠습니다. 이어서 재구매율, 평균 주문 금액, 고객 세그먼트별 차이와 검증 방법을 자세히 설명하고 실행 순서까지 모두 안내드리겠습니다.";
  const compact = compactTrack3AssistantMessage(longReply);

  assert.ok(compact.length <= 110);
  assert.match(compact, /^알겠습니다\./);
  assert.equal(compact.includes("실행 순서까지 모두 안내"), false);
  assert.equal(compact.includes("  "), false);
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

test("scenario copy is detected without relying on the LLM judge", () => {
  const scenario = getScenario("pm_001");
  const copied = [
    scenario.role,
    scenario.situation,
    scenario.mission,
    ...scenario.available_info,
    ...scenario.constraints
  ].join("\n");
  const integrity = analyzeTrack3Integrity({
    scenario,
    turns: [{ role: "user", content: copied }]
  });

  assert.equal(integrity.scenario_restatement_likely, true);
  assert.ok(integrity.first_turn_scenario_overlap >= 0.9);
});

test("scenario copy is detected from frontend boilerplate even when wording differs", () => {
  const copied = [
    "상황 설명",
    "당신은 키키오 선물하기 프로덕트 팀의 PM입니다. 다음 분기 3주 동안 만들 핵심 기능 하나를 정해야 합니다.",
    "개발자는 쿠폰함 알림 기능을, 디자이너는 위시리스트 공유 기능을, 데이터 분석가는 구매 후 추천 기능을 각각 제안했습니다.",
    "AI에게 후보를 비교할 의사결정 프레임워크를 요청하고 다음 회의에 쓸 PRD 초안을 만들어보세요.",
    "미션 가이드",
    "다음 내용을 중심으로 AI와 함께 작업 영역을 완성해보세요."
  ].join("\n");
  const integrity = analyzeTrack3Integrity({
    scenario: getScenario("pm_001"),
    turns: [{ role: "user", content: copied }]
  });

  assert.equal(integrity.scenario_restatement_likely, true);
  assert.ok(integrity.first_turn_copy_markers >= 2);
});

test("repetition policy caps interaction and improvement evidence", () => {
  const inflatedAxes = TRACK3_AXES.map(([key, axis]) => ({ key, axis, score: 4, max: 4, rate: 1, comment: "" }));
  const enforced = applyRepetitionPolicy({
    axisScores: inflatedAxes,
    deltaScore: 4,
    sequenceValid: true,
    effectiveTurnCount: 1,
    duplicateTurnCount: 4
  });

  assert.equal(enforced.axisScores.find((axis) => axis.key === "task_decomposition").score, 0);
  assert.equal(enforced.axisScores.find((axis) => axis.key === "interaction_control").score, 0);
  assert.equal(enforced.deltaScore, 0);
  assert.equal(enforced.sequenceValid, false);
});

test("move tags and Judge scores cannot contradict each other", () => {
  const axes = TRACK3_AXES.map(([key, axis]) => ({ key, axis, score: key === "verification" ? 0 : 3, max: 4, rate: 0.75 }));
  const withVerification = applyMoveScoreConsistency({
    axisScores: axes,
    deltaScore: 4,
    moveTagging: [
      { turn: 2, moves: ["M3"], note: "초안 작성" },
      { turn: 3, moves: ["M4"], note: "선정 근거 검증" },
      { turn: 4, moves: ["M5"], note: "검증 반영 후 최종화" }
    ]
  });

  assert.equal(withVerification.axisScores.find((axis) => axis.key === "verification").score, 2);
  assert.equal(withVerification.deltaScore, 4);

  const withoutVerification = applyMoveScoreConsistency({
    axisScores: axes.map((axis) => axis.key === "verification" ? { ...axis, score: 4 } : axis),
    deltaScore: 4,
    moveTagging: [
      { turn: 2, moves: ["M2"], note: "방향 선택" },
      { turn: 3, moves: ["M3"], note: "초안 작성" },
      { turn: 4, moves: ["M5"], note: "최종화" }
    ]
  });

  assert.equal(withoutVerification.axisScores.find((axis) => axis.key === "verification").score, 1);
  assert.equal(withoutVerification.deltaScore, 3);
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
  assert.equal(breakdown.completion.effective_turn_count, 5);
});

test("effective turns remain diagnostic without scaling the total", () => {
  const perfectJudge = {
    axis_scores: TRACK3_AXES.map(([key, axis]) => ({ key, axis, score: 4 })),
    delta_score: { score: 4 }
  };
  const breakdown = calculateTrack3ScoreBreakdown(perfectJudge, {
    codeChecks: { score: 20 },
    turnCount: 5,
    effectiveTurnCount: 1
  });

  assert.equal(breakdown.completion.turn_count, 5);
  assert.equal(breakdown.completion.effective_turn_count, 1);
  assert.equal("multiplier" in breakdown.completion, false);
  assert.equal(breakdown.total, 100);
});

test("turn count remains diagnostic without a completion multiplier", () => {
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

  assert.equal(twoTurn.total, 69);
  assert.equal(twoTurn.completion.turn_count, 2);
  assert.equal(twoTurn.completion.early_finish, true);
  assert.equal("multiplier" in twoTurn.completion, false);
  assert.equal(fiveTurn.total, 85);
  assert.equal(fiveTurn.completion.turn_count, 5);
  assert.equal("multiplier" in fiveTurn.completion, false);
});

test("validateSubmitInput accepts a usable final output", () => {
  const result = validateSubmitInput({
    turns: sampleTurns,
    finalOutput: "문제 정의, 비교 기준, 기능 선정 결과, 선정 근거, 실행 계획, 검증 방법이 포함된 회의용 작업 영역입니다."
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
      "문제 정의: 3주 안에 검증할 핵심 기능 하나를 선택한다.",
      "기능 선정 결과: 위시리스트 공유 기능",
      "선정 근거: 세 후보 중 3주 안에 검증 가능한 범위와 출시 리스크를 우선 비교했다.",
      "실행 계획: 1주차 범위 확정, 2주차 구현, 3주차 검증 및 회의 공유",
      "검증 방법: 공유 클릭률과 공유 후 구매 전환율을 확인한다."
    ].join("\n")
  });
  process.env.ENABLE_TRACK3_LLM_JUDGE = original;

  assert.equal(result.track, "track3");
  assert.equal(result.axis_scores.length, 8);
  assert.ok(result.axis_scores.every((axis) => axis.comment.length >= 70 && axis.comment.length <= 140));
  assert.ok(result.axis_scores.every((axis) => axis.comment.match(/[^.!?]+[.!?]?/g).every((sentence) => /요[.!?]?$/.test(sentence.trim()))));
  assert.ok(result.axis_scores.every((axis) => !axis.comment.includes("다음 분기 핵심 기능 하나를 선정")));
  assert.match(result.feedback.summary_weaknesses, /요[.!?]?$/);
  assert.ok(result.total > 0);
});

test("heuristic judge recognizes a clear problem, outcome, and immediate deliverable", async () => {
  const original = process.env.ENABLE_TRACK3_LLM_JUDGE;
  process.env.ENABLE_TRACK3_LLM_JUDGE = "false";
  const turns = [
    {
      role: "user",
      content: "신제품 재구매율 저조의 원인 가설을 설정하고 예산과 채널에 맞는 캠페인 방향을 세우려고 해. 작업 계획을 먼저 세워줘."
    },
    { role: "assistant", content: "작업 계획을 정리했습니다." },
    { role: "user", content: "효과 체감 지연 가설을 우선 검토해줘." },
    { role: "assistant", content: "우선 가설을 반영했습니다." },
    { role: "user", content: "다음 달 실행 가능성을 기준으로 방향을 조정해줘." },
    { role: "assistant", content: "실행 가능성을 반영했습니다." },
    { role: "user", content: "논리 비약과 누락된 지표를 검증해줘." },
    { role: "assistant", content: "검증 결과를 반영했습니다." },
    { role: "user", content: "팀 공유용 최종 기획서로 완성해줘." }
  ];

  let result;
  try {
    result = await judgeTrack3({
      scenarioId: "marketing_001",
      turns,
      finalOutput: "원인 가설, 타깃, 채널별 실행안, 예산 배분, 성과 지표가 포함된 다음 달 캠페인 기획서입니다."
    });
  } finally {
    if (original == null) delete process.env.ENABLE_TRACK3_LLM_JUDGE;
    else process.env.ENABLE_TRACK3_LLM_JUDGE = original;
  }

  assert.equal(result.axis_scores.find((axis) => axis.key === "goal_definition").score, 4);
  assert.equal(new Set(result.axis_scores.map((axis) => axis.comment)).size, result.axis_scores.length);
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
      "문제 정의: 3주 안에 검증할 핵심 기능 하나를 선택한다.",
      "기능 선정 결과: 위시리스트 공유 기능",
      "선정 근거: 세 후보 중 3주 안에 검증 가능한 범위와 출시 리스크를 우선 비교했다.",
      "실행 계획: 1주차 범위 확정, 2주차 구현, 3주차 검증 및 회의 공유",
      "검증 방법: 공유 클릭률과 공유 후 구매 전환율을 확인한다."
    ].join("\n")
  });

  process.env.ENABLE_TRACK3_LLM_JUDGE = original;

  assert.ok(strong.total > weak.total);
  assert.ok(strong.axis_scores.find((axis) => axis.key === "context").score > weak.axis_scores.find((axis) => axis.key === "context").score);
});
