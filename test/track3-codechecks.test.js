import test from "node:test";
import assert from "node:assert/strict";
import { runCodeChecks, validateChatInput, validateSubmitInput } from "../src/track3/codeChecks.js";
import { judgeTrack3 } from "../src/track3/judge.js";

const sampleTurns = [
  { role: "user", content: "전환율 5% 문제를 분석하려고 합니다. 팀 회의용 분석안 구조를 잡아주세요." },
  { role: "assistant", content: "퍼널별로 보겠습니다." },
  { role: "user", content: "결제 전 이탈에 집중하고, 2주 안에 가능한 액션으로 좁혀주세요." },
  { role: "assistant", content: "좋습니다." },
  { role: "user", content: "원인 가설, 확인 KPI, 필요한 데이터, 우선순위, 다음 액션을 표로 정리해주세요." },
  { role: "assistant", content: "초안입니다." },
  { role: "user", content: "논리 비약, 누락 KPI, 데이터로 검증하기 어려운 가설을 지적해주세요." },
  { role: "assistant", content: "검토했습니다." },
  { role: "user", content: "그 지적을 반영해서 최종 분석안으로 완성해주세요." }
];

test("validateChatInput rejects short messages and max turns", () => {
  assert.equal(validateChatInput({ turns: [], userMessage: "짧음" }).valid, false);
  assert.equal(validateChatInput({ turns: sampleTurns, userMessage: "추가 요청입니다" }).valid, false);
});

test("runCodeChecks scores observable Track 3 signals", () => {
  const result = runCodeChecks({ turns: sampleTurns });
  assert.equal(result.max, 20);
  assert.ok(result.score >= 14);
  assert.equal(result.checks.length, 6);
});

test("validateSubmitInput accepts a usable final output", () => {
  const result = validateSubmitInput({
    turns: sampleTurns,
    finalOutput: "원인 가설, 확인 KPI, 필요한 데이터, 우선순위, 다음 액션이 포함된 최종 분석안입니다."
  });
  assert.equal(result.valid, true);
});

test("judgeTrack3 returns a demo evaluation without OpenAI", async () => {
  const original = process.env.ENABLE_TRACK3_LLM_JUDGE;
  process.env.ENABLE_TRACK3_LLM_JUDGE = "false";
  const result = await judgeTrack3({
    scenarioId: "t3_growth_001",
    turns: sampleTurns,
    finalOutput: [
      "원인 가설: 결제 단계 UX 또는 신뢰 정보 부족",
      "확인 KPI: 예약 클릭률, 결제 시작률, 결제 완료율",
      "필요한 데이터: 단계별 로그, 결제 실패 사유, CS 문의",
      "우선순위: 결제 전 이탈 원인 확인",
      "다음 액션: 2주 안에 결제 단계 문구와 FAQ 개선 실험"
    ].join("\n")
  });
  process.env.ENABLE_TRACK3_LLM_JUDGE = original;

  assert.equal(result.track, "track3");
  assert.equal(result.axis_scores.length, 8);
  assert.ok(result.total > 0);
});
