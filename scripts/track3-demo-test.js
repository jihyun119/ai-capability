import { generateTrack3Chat } from "../src/track3/chat.js";
import { judgeTrack3 } from "../src/track3/judge.js";
import { getScenario } from "../src/track3/scenarios.js";
import { loadEnv } from "../src/shared/env.js";

loadEnv();

const scenario = getScenario("t3_growth_001");
const userMessages = [
  "헬스케어 앱에서 회원가입 후 예약 결제까지 전환율이 5%로 낮습니다. 우선 퍼널 단계별로 문제를 나누고, 팀 회의용 분석안 구조를 잡아주세요.",
  "제안한 방향 중 결제 전 이탈에 집중하겠습니다. 개발 리소스가 제한적이고 2주 안에 실험해야 한다는 조건을 반영해주세요.",
  "원인 가설, 확인 KPI, 필요한 데이터, 우선순위, 다음 액션을 표로 정리한 초안을 만들어주세요.",
  "방금 초안에서 논리 비약, 빠진 KPI, 실제 데이터로 검증하기 어려운 가설을 먼저 지적해주세요.",
  "그 지적을 반영해서 팀 회의에서 바로 공유할 수 있는 최종 분석안으로 정리해주세요."
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
