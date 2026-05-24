import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── 응시자 검증 ───────────────────────────────────────────────────────────────

export async function validateRespondent(respondentId, accessToken) {
  const { data, error } = await supabase
    .from("respondents")
    .select("id, nickname, access_token")
    .eq("id", respondentId)
    .single();

  if (error || !data) throw new Error("응시자를 찾을 수 없습니다.");
  if (data.access_token !== accessToken) throw new Error("access_token이 일치하지 않습니다.");

  await supabase.from("respondents")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", respondentId);

  return data;
}

// ── Track 2 결과 저장 ─────────────────────────────────────────────────────────

export async function saveTrack2Result({ respondentId, nicknameSnapshot, answers, scoringResult, feedbackSummary }) {
  const { axes, total, grade, strengths, weaknesses } = scoringResult;
  const resultId = randomUUID();
  const shareSlug = generateSlug();

  const mcScores        = Object.fromEntries(axes.map((ax) => [ax.key, ax.mcNormalized]));
  const extractedFeatures = Object.fromEntries(axes.map((ax) => [ax.key, { evidence: ax.evidence, frequency: ax.freqWord }]));
  const promptScores    = Object.fromEntries(axes.map((ax) => [ax.key, ax.essayScore]));
  const finalScores     = Object.fromEntries(axes.map((ax) => [ax.key, ax.finalScore]));

  const { error } = await supabase.from("track2_results").insert({
    result_id:            resultId,
    respondent_id:        respondentId,
    nickname_snapshot:    nicknameSnapshot,
    version:              "track2-v1",
    status:               "success",
    questionnaire_version: "track2-4-v1",
    mc_raw_answers:       { Q1: answers.Q1, Q2: answers.Q2, Q3: answers.Q3, Q4: answers.Q4 },
    mc_scores:            mcScores,
    extracted_features:   extractedFeatures,
    prompt_scores:        promptScores,
    final_scores:         finalScores,
    total_score:          total,
    grade,
    feedback:             { strengths, weaknesses, summary: feedbackSummary },
    share_slug:           shareSlug,
    created_at:           new Date().toISOString()
  });

  if (error) throw new Error(`track2_results 저장 실패: ${error.message}`);

  // diagnosis_answers 저장 (Q1~Q4)
  const diagnosisRows = Object.entries(answers).map(([qKey, answer]) => ({
    respondent_id:        respondentId,
    result_id:            resultId,
    track:                "track2",
    questionnaire_version: "track2-4-v1",
    question_key:         qKey,
    answer_value:         String(answer),
    axis_key:             "multi"
  }));

  const { error: diagError } = await supabase.from("diagnosis_answers").insert(diagnosisRows);
  if (diagError) console.error("diagnosis_answers 저장 실패:", diagError.message);

  return { resultId, shareSlug };
}

// ── Track 2 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack2Result(shareSlug) {
  const { data, error } = await supabase
    .from("track2_results")
    .select("*")
    .eq("share_slug", shareSlug)
    .single();

  if (error || !data) throw new Error("결과를 찾을 수 없습니다.");
  return data;
}

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function generateSlug() {
  return randomUUID().replace(/-/g, "").slice(0, 10);
}
