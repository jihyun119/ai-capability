import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { loadEnv } from "../src/shared/env.js";

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

// ── 응시자 생성 ───────────────────────────────────────────────────────────────

export async function createRespondent(nickname) {
  const accessToken = randomUUID().replace(/-/g, "");

  const { data, error } = await supabase
    .from("respondents")
    .insert({ nickname, access_token: accessToken })
    .select("id, nickname, access_token")
    .single();

  if (error || !data) throw new Error(`응시자 생성 실패: ${error?.message}`);
  return data;
}

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

export async function saveTrack2Result({ respondentId, nicknameSnapshot, answers, scoringResult, feedbackResult }) {
  const { axes, total, grade } = scoringResult;
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
    feedback:             feedbackResult,
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

// ── Track 1 결과 저장 ─────────────────────────────────────────────────────────

export async function saveTrack1Result({ respondentId, nicknameSnapshot, questionnaireVersion = "track1-12", questionnaire, llmResult, evaluationResult }) {
  const resultId = randomUUID();
  const shareSlug = generateSlug();
  const answers = questionnaire?.answers || {};
  const scoreBreakdown = evaluationResult.scoreBreakdown || {};
  const type = evaluationResult.type || {};
  const resultCard = evaluationResult.resultCard || {};
  const promptScores = scoreBreakdown.prompt || null;
  const finalScores = scoreBreakdown.final || null;

  const { error } = await supabase.from("track1_results").insert({
    result_id: resultId,
    respondent_id: respondentId,
    nickname_snapshot: nicknameSnapshot,
    version: "track1-v1",
    status: "success",
    questionnaire_version: questionnaireVersion,
    mc_raw_answers: Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [key, Number(value)])
    ),
    mc_scores: scoreBreakdown.questionnaire || null,
    prompt_scores: {
      scores: promptScores,
      evidence_mode: llmResult?.evidence_mode || null,
      signals: llmResult?.signals || null,
      confidence: llmResult?.confidence || null,
      notes: llmResult?.notes || null,
      verdict: llmResult?.verdict || null,
      tags: llmResult?.tags || []
    },
    final_scores: {
      scores: finalScores,
      binary_profile: evaluationResult.binaryProfile || null,
      axis_scores: evaluationResult.axisScores || null,
      result_card: resultCard,
      tie_axes: evaluationResult.tieAxes || [],
      tie_resolution: evaluationResult.tieResolution || null
    },
    binary_profile: evaluationResult.binaryProfile || null,
    result_card: resultCard,
    type_code: type.id,
    type_name: type.name,
    share_slug: shareSlug,
    created_at: new Date().toISOString()
  });

  if (error) throw new Error(`track1_results 저장 실패: ${error.message}`);

  const diagnosisRows = Object.entries(answers).map(([qKey, answer]) => ({
    respondent_id: respondentId,
    result_id: resultId,
    track: "track1",
    questionnaire_version: questionnaireVersion,
    question_key: qKey,
    answer_value: String(answer),
    axis_key: track1AxisForQuestion(qKey)
  }));

  const { error: diagError } = await supabase.from("diagnosis_answers").insert(diagnosisRows);
  if (diagError) console.error("diagnosis_answers 저장 실패:", diagError.message);

  return { resultId, shareSlug };
}

// ── Track 1 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack1Result(shareSlug) {
  const { data, error } = await supabase
    .from("track1_results")
    .select("*")
    .eq("share_slug", shareSlug)
    .single();

  if (error || !data) throw new Error("결과를 찾을 수 없습니다.");
  return data;
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

function track1AxisForQuestion(questionKey) {
  const number = Number(String(questionKey).replace(/^Q/i, ""));
  if (number >= 1 && number <= 3) return "A";
  if (number >= 4 && number <= 6) return "B";
  if (number >= 7 && number <= 9) return "C";
  if (number >= 10 && number <= 12) return "D";
  return "unknown";
}
