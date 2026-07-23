import { generateTrack3Chat } from "../src/track3/chat.js";
import { judgeTrack3 } from "../src/track3/judge.js";
import { getScenario } from "../src/track3/scenarios.js";
import { loadEnv } from "../src/shared/env.js";

loadEnv();

const scenario = getScenario("pm_001");
const userMessages = [
  "키키오 선물하기팀에서 다음 분기 3주 동안 진행할 핵심 기능 하나를 선정해야 합니다. 쿠폰함 알림, 위시리스트 공유, 구매 후 추천을 비교할 프레임워크와 회의용 실행 계획 구조를 잡아주세요.",
  "3주 안에 검증 가능한지를 중요 기준으로 두겠습니다. 세 후보의 임팩트, 구현 가능성, 판단 근거, 출시 리스크를 비교해주세요.",
  "저는 위시리스트 공유 기능에 집중하겠습니다. 선택안과 선정 근거, 실행 순서와 검증 방법을 작업 영역에 정리해주세요.",
  "방금 초안에서 논리 비약, 빠진 고려사항, 3주 안에 어려운 범위가 없는지 지적해주세요.",
  "그 지적을 반영해서 작업 영역 전체를 다음 회의에서 바로 공유할 수 있는 실행 계획으로 완성해주세요."
];

let turns = [];
let artifact = "";

console.log("=== Track 3 demo chat 시작 ===");
console.log("Scenario:", scenario.title);

for (const userMessage of userMessages) {
  const response = await generateTrack3Chat({
    scenarioId: scenario.scenario_id,
    turns,
    userMessage,
    artifact
  });
  turns = response.turns;
  artifact = response.artifact;
  console.log(`\n[${response.turnCount}/5] user:`, userMessage);
  console.log("assistant:", response.assistantMessage);
}

console.log("\n=== Track 3 judge 시작 ===");
const evaluation = await judgeTrack3({
  scenarioId: scenario.scenario_id,
  turns,
  finalOutput: artifact
});

console.log("총점:", evaluation.total);
console.log("등급:", evaluation.grade);
console.log("신뢰도:", evaluation.confidence);
console.log("축별 점수:");
for (const axis of evaluation.axis_scores) {
  console.log(`- ${axis.axis}: ${axis.score}/4`);
}
console.log("추천:", evaluation.feedback.recommendation);
