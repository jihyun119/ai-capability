/**
 * Track 2 E2E 테스트 스크립트 (Supabase 직접 연동)
 * 실행: node scripts/track2-e2e-test.js
 *
 * .env 파일의 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY 사용
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { score } from "../src/track2/scorer.js";
import { generateFeedback } from "../backend/feedback.js";

// ── env 로드 (Node 20.6+ native --env-file 사용, 없으면 수동 파싱) ──────────
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Supabase 연결 ─────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── 테스트 데이터 ─────────────────────────────────────────────────────────────
const TEST_NICKNAME = "테스트_" + Date.now();
const TEST_ANSWERS  = { Q1: "D", Q2: "D", Q3: "B", Q4: "C" };
const TEST_FREE_TEXT = `
I always define the goal and constraints clearly before asking Claude anything.
I consistently provide background context and explain the purpose and audience upfront.
I frequently assign a role or persona so Claude knows the perspective to write from.
I sometimes specify the output format such as length, structure, and tone.
When the response fell short or was missing key details, I follow up with a revision request.
I occasionally challenge Claude if the answer seems incorrect or unclear.
`.trim();

// ── Step 1: 응시자 생성 ───────────────────────────────────────────────────────
async function step1_createRespondent() {
  console.log("\n[1] 응시자 생성...");
  const accessToken = randomUUID().replace(/-/g, "");
  const { data, error } = await supabase
    .from("respondents")
    .insert({ nickname: TEST_NICKNAME, access_token: accessToken })
    .select("id, nickname, access_token")
    .single();

  if (error) throw new Error("응시자 생성 실패: " + error.message);
  console.log("  ✅ respondentId:", data.id);
  console.log("  ✅ accessToken:", data.access_token);
  return data;
}

// ── Step 2: 채점 ─────────────────────────────────────────────────────────────
function step2_score() {
  console.log("\n[2] 채점...");
  const result = score(TEST_FREE_TEXT, TEST_ANSWERS);
  console.log("  총점:", result.total + "/100");
  console.log("  등급:", result.grade);
  result.axes.forEach((ax) => {
    console.log(`  ${ax.name}: ${ax.finalScore}/${ax.maxScore} (mc:${ax.mcNormalized} essay:${ax.essayScore} freq:${ax.freqWord})`);
  });
  return result;
}

// ── Step 3: 피드백 생성 ───────────────────────────────────────────────────────
async function step3_feedback(scoringResult) {
  console.log("\n[3] 피드백 생성...");
  const summary = await generateFeedback(scoringResult);
  console.log("  피드백:", summary);
  return summary;
}

// ── Step 4: DB 저장 ───────────────────────────────────────────────────────────
async function step4_save(respondent, scoringResult, feedbackSummary) {
  console.log("\n[4] DB 저장...");
  const { saveTrack2Result } = await import("../backend/db.js");
  const { resultId, shareSlug } = await saveTrack2Result({
    respondentId:     respondent.id,
    nicknameSnapshot: respondent.nickname,
    answers:          TEST_ANSWERS,
    scoringResult,
    feedbackSummary
  });
  console.log("  ✅ resultId:", resultId);
  console.log("  ✅ shareSlug:", shareSlug);
  return { resultId, shareSlug };
}

// ── Step 5: 조회 확인 ─────────────────────────────────────────────────────────
async function step5_read(shareSlug) {
  console.log("\n[5] 결과 조회 확인...");
  const { getTrack2Result } = await import("../backend/db.js");
  const record = await getTrack2Result(shareSlug);
  console.log("  ✅ total_score:", record.total_score);
  console.log("  ✅ grade:", record.grade);
  console.log("  ✅ share_slug:", record.share_slug);
}

// ── 실행 ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log("=== Track 2 E2E 테스트 시작 ===");
    console.log("Supabase URL:", process.env.SUPABASE_URL || "(없음 — .env 확인 필요)");

    const respondent    = await step1_createRespondent();
    const scoringResult = step2_score();
    const feedbackSummary = await step3_feedback(scoringResult);
    const { shareSlug } = await step4_save(respondent, scoringResult, feedbackSummary);
    await step5_read(shareSlug);

    console.log("\n=== ✅ 모든 단계 통과 ===\n");
  } catch (err) {
    console.error("\n❌ 테스트 실패:", err.message);
    process.exit(1);
  }
})();
