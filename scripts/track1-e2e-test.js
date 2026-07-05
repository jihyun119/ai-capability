import { readFile } from "node:fs/promises";
import { createRespondent, getTrack1Result, saveTrack1Result } from "../backend/db.js";
import { evaluateTrack1, parseTrack1Input } from "../src/track1/evaluate.js";

const TEST_NICKNAME = `테스트_track1_${Date.now()}`;

async function main() {
  console.log("=== Track 1 E2E 테스트 시작 ===");

  const llmResult = parseTrack1Input(
    await readFile("examples/track1/sample_success.json", "utf8")
  );
  const questionnaire = parseTrack1Input(
    await readFile("examples/track1/sample_questionnaire_answers.json", "utf8")
  );

  console.log("\n[1] 응시자 생성...");
  const respondent = await createRespondent(TEST_NICKNAME);
  console.log("  ✅ respondentId:", respondent.id);
  console.log("  ✅ accessToken:", respondent.access_token);

  console.log("\n[2] Track 1 채점...");
  const evaluationResult = evaluateTrack1({
    llmResult,
    questionnaire,
    includeInternal: true
  });
  if (evaluationResult.status !== "success") {
    throw new Error(`Track 1 채점 실패: ${evaluationResult.error?.message}`);
  }
  console.log("  유형:", `${evaluationResult.type.id}. ${evaluationResult.type.name}`);
  console.log("  최종 점수:", JSON.stringify(evaluationResult.scoreBreakdown.final));

  console.log("\n[3] DB 저장...");
  const { resultId, shareSlug } = await saveTrack1Result({
    respondentId: respondent.id,
    nicknameSnapshot: respondent.nickname,
    questionnaireVersion: "track1-12",
    questionnaire,
    llmResult,
    evaluationResult
  });
  console.log("  ✅ resultId:", resultId);
  console.log("  ✅ shareSlug:", shareSlug);

  console.log("\n[4] 결과 조회 확인...");
  const record = await getTrack1Result(shareSlug);
  console.log("  ✅ type_name:", record.type_name);
  console.log("  ✅ result_id:", record.result_id);

  console.log("\n=== ✅ 모든 단계 통과 ===\n");
}

main().catch((error) => {
  console.error("\n❌ 테스트 실패:", error.message);
  process.exit(1);
});
