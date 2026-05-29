import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { loadEnv } from "../src/shared/env.js";

loadEnv();

const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL);
const supabaseServiceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
}

if (!/^https?:\/\/.+/i.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL 형식이 올바르지 않습니다. https://...supabase.co 형태로 설정해주세요.");
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

// ── 응시자 생성 ───────────────────────────────────────────────────────────────

export async function createRespondent(nickname, birthYear = null) {
  const accessToken = randomUUID().replace(/-/g, "");
  const payload = {
    nickname,
    access_token: accessToken,
    birth_year: toNumber(birthYear)
  };

  const error = await insertWithSchemaFallback("respondents", payload);
  if (error) throw new Error(`응시자 생성 실패: ${error.message}`);

  const { data, error: selectError } = await supabase
    .from("respondents")
    .select("id, nickname, access_token")
    .eq("access_token", accessToken)
    .single();

  if (selectError || !data) throw new Error(`응시자 생성 실패: ${selectError?.message}`);
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

export async function saveTrack2Result({ respondentId, nicknameSnapshot, birthYear = null, answers, freeText, scoringResult, feedbackResult }) {
  const { axes, total, grade } = scoringResult;
  const resultId = randomUUID();
  const byKey = Object.fromEntries(axes.map((ax) => [ax.key, ax]));
  const field = (schemaKey) => byKey[TRACK2_AXIS_FIELD_MAP[schemaKey]];

  const payload = {
    result_id:            resultId,
    respondent_id:        respondentId,
    track:                "track2",
    version:              "track2-v1",
    status:               "success",
    nickname:             nicknameSnapshot,
    nickname_snapshot:    nicknameSnapshot,
    birth_year:           toNumber(birthYear),
    questionnaire_version: "track2-4-v1",
    q1_answer:            answers.Q1,
    q2_answer:            answers.Q2,
    q3_answer:            answers.Q3,
    q4_answer:            answers.Q4,
    mc_score_task_clarity: rounded(field("task_clarity")?.mcNormalized),
    mc_score_context:      rounded(field("context")?.mcNormalized),
    mc_score_role:         rounded(field("role")?.mcNormalized),
    mc_score_format:       rounded(field("format")?.mcNormalized),
    mc_score_iteration:    rounded(field("iteration")?.mcNormalized),
    mc_score_critical:     rounded(field("critical")?.mcNormalized),
    free_text:             freeText || null,
    evidence_task_clarity: field("task_clarity")?.evidence || null,
    evidence_context:      field("context")?.evidence || null,
    evidence_role:         field("role")?.evidence || null,
    evidence_format:       field("format")?.evidence || null,
    evidence_iteration:    field("iteration")?.evidence || null,
    evidence_critical:     field("critical")?.evidence || null,
    prompt_score_task_clarity: rounded(field("task_clarity")?.essayScore),
    prompt_score_context:      rounded(field("context")?.essayScore),
    prompt_score_role:         rounded(field("role")?.essayScore),
    prompt_score_format:       rounded(field("format")?.essayScore),
    prompt_score_iteration:    rounded(field("iteration")?.essayScore),
    prompt_score_critical:     rounded(field("critical")?.essayScore),
    score_task_clarity: rounded(field("task_clarity")?.finalScore),
    score_context:      rounded(field("context")?.finalScore),
    score_role:         rounded(field("role")?.finalScore),
    score_format:       rounded(field("format")?.finalScore),
    score_iteration:    rounded(field("iteration")?.finalScore),
    score_critical:     rounded(field("critical")?.finalScore),
    total_score:          rounded(total),
    grade,
    strength_1:           scoringResult.strengths?.[0] || feedbackResult?.strengths?.[0]?.name || null,
    strength_2:           scoringResult.strengths?.[1] || feedbackResult?.strengths?.[1]?.name || null,
    weakness_1:           scoringResult.weaknesses?.[0] || feedbackResult?.weaknesses?.[0]?.name || null,
    weakness_2:           scoringResult.weaknesses?.[1] || feedbackResult?.weaknesses?.[1]?.name || null,
    feedback_text:        buildFeedbackText(feedbackResult),
    llm_text_output:      feedbackResult ? JSON.stringify(feedbackResult) : null,
    mc_raw_answers:       { Q1: answers.Q1, Q2: answers.Q2, Q3: answers.Q3, Q4: answers.Q4 },
    mc_scores:            Object.fromEntries(axes.map((ax) => [ax.key, rounded(ax.mcNormalized)])),
    extracted_features:   Object.fromEntries(axes.map((ax) => [ax.key, { evidence: ax.evidence, frequency: ax.freqWord }])),
    prompt_scores:        Object.fromEntries(axes.map((ax) => [ax.key, rounded(ax.essayScore)])),
    final_scores:         Object.fromEntries(axes.map((ax) => [ax.key, rounded(ax.finalScore)])),
    feedback:             feedbackResult,
    share_slug:           resultId,
    created_at:           new Date().toISOString()
  };

  const error = await insertWithSchemaFallback("track2_results", payload);

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

  return { resultId, shareSlug: resultId };
}

// ── Track 1 결과 저장 ─────────────────────────────────────────────────────────

export async function saveTrack1Result({ respondentId, nicknameSnapshot, birthYear = null, questionnaireVersion = "track1-12", questionnaire, llmResult, evaluationResult }) {
  const resultId = randomUUID();
  const answers = questionnaire?.answers || {};
  const canonicalLlm = parseMaybeJson(llmResult);
  const scoreBreakdown = evaluationResult.scoreBreakdown || {};
  const type = evaluationResult.type || {};
  const resultCard = evaluationResult.resultCard || {};
  const questionnaireScores = scoreBreakdown.questionnaire || {};
  const promptScores = scoreBreakdown.prompt || {};
  const finalScores = scoreBreakdown.final || {};
  const binaryProfile = evaluationResult.binaryProfile || {};
  const tieResolution = evaluationResult.tieResolution || {};
  const notes = canonicalLlm?.notes || {};
  const signals = canonicalLlm?.signals || {};
  const confidence = canonicalLlm?.confidence || {};

  const payload = {
    result_id: resultId,
    respondent_id: respondentId,
    track: "track1",
    version: "track1-v1",
    status: "success",
    nickname: nicknameSnapshot,
    nickname_snapshot: nicknameSnapshot,
    birth_year: toNumber(birthYear),
    questionnaire_version: questionnaireVersion,
    q1_answer: toNumber(answers.Q1),
    q2_answer: toNumber(answers.Q2),
    q3_answer: toNumber(answers.Q3),
    q4_answer: toNumber(answers.Q4),
    q5_answer: toNumber(answers.Q5),
    q6_answer: toNumber(answers.Q6),
    q7_answer: toNumber(answers.Q7),
    q8_answer: toNumber(answers.Q8),
    q9_answer: toNumber(answers.Q9),
    q10_answer: toNumber(answers.Q10),
    q11_answer: toNumber(answers.Q11),
    q12_answer: toNumber(answers.Q12),
    mc_score_A: rounded(questionnaireScores.A),
    mc_score_B: rounded(questionnaireScores.B),
    mc_score_C: rounded(questionnaireScores.C),
    mc_score_D: rounded(questionnaireScores.D),
    raw_pasted_llm_result: typeof llmResult === "string" ? llmResult : JSON.stringify(llmResult ?? null),
    parsed_llm_result: canonicalLlm || null,
    note_A: notes.A || null,
    note_B: notes.B || null,
    note_C: notes.C || null,
    note_D: notes.D || null,
    prompt_score_A: rounded(promptScores.A),
    prompt_score_B: rounded(promptScores.B),
    prompt_score_C: rounded(promptScores.C),
    prompt_score_D: rounded(promptScores.D),
    score_A: rounded(finalScores.A),
    score_B: rounded(finalScores.B),
    score_C: rounded(finalScores.C),
    score_D: rounded(finalScores.D),
    level_A: toDbLevel(binaryProfile.A),
    level_B: toDbLevel(binaryProfile.B),
    level_C: toDbLevel(binaryProfile.C),
    level_D: toDbLevel(binaryProfile.D),
    tie_axes: evaluationResult.tieAxes || [],
    source_A: tieResolution.A?.source || null,
    source_B: tieResolution.B?.source || null,
    source_C: tieResolution.C?.source || null,
    source_D: tieResolution.D?.source || null,
    reason_A: tieResolution.A?.reason || null,
    reason_B: tieResolution.B?.reason || null,
    reason_C: tieResolution.C?.reason || null,
    reason_D: tieResolution.D?.reason || null,
    type_code: type.id,
    type_name: type.name,
    reason_story: Array.isArray(resultCard.reasonStory) ? resultCard.reasonStory.join("\n") : null,
    llm_raw_json: canonicalLlm || null,
    llm_evidence_mode: canonicalLlm?.evidence_mode || null,
    llm_signal_A: signals.A || null,
    llm_signal_B: signals.B || null,
    llm_signal_C: signals.C || null,
    llm_signal_D: signals.D || null,
    llm_confidence_A: confidence.A || null,
    llm_confidence_B: confidence.B || null,
    llm_confidence_C: confidence.C || null,
    llm_confidence_D: confidence.D || null,
    llm_verdict: canonicalLlm?.verdict || null,
    llm_tags: Array.isArray(canonicalLlm?.tags) ? canonicalLlm.tags.slice(0, 3) : [],
    mc_raw_answers: Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [key, Number(value)])
    ),
    mc_scores: questionnaireScores,
    prompt_scores: {
      scores: promptScores,
      evidence_mode: canonicalLlm?.evidence_mode || null,
      signals,
      confidence,
      notes,
      verdict: canonicalLlm?.verdict || null,
      tags: Array.isArray(canonicalLlm?.tags) ? canonicalLlm.tags.slice(0, 3) : []
    },
    final_scores: {
      scores: finalScores,
      binary_profile: binaryProfile,
      axis_scores: evaluationResult.axisScores || null,
      result_card: resultCard,
      tie_axes: evaluationResult.tieAxes || [],
      tie_resolution: tieResolution
    },
    binary_profile: binaryProfile,
    result_card: resultCard,
    share_slug: resultId,
    created_at: new Date().toISOString()
  };

  const error = await insertWithSchemaFallback("track1_results", payload);

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

  return { resultId, shareSlug: resultId };
}

// ── Track 1 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack1Result(resultId) {
  const { data, error } = await supabase
    .from("track1_results")
    .select("*")
    .eq("result_id", resultId)
    .single();

  if (error || !data) throw new Error("결과를 찾을 수 없습니다.");
  return data;
}

// ── Track 2 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack2Result(resultId) {
  const { data, error } = await supabase
    .from("track2_results")
    .select("*")
    .eq("result_id", resultId)
    .single();

  if (error || !data) throw new Error("결과를 찾을 수 없습니다.");
  return data;
}

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function track1AxisForQuestion(questionKey) {
  const number = Number(String(questionKey).replace(/^Q/i, ""));
  if (number >= 1 && number <= 3) return "A";
  if (number >= 4 && number <= 6) return "B";
  if (number >= 7 && number <= 9) return "C";
  if (number >= 10 && number <= 12) return "D";
  return "unknown";
}

async function insertWithSchemaFallback(table, payload) {
  const mutablePayload = { ...payload };
  const maxAttempts = Object.keys(mutablePayload).length + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { error } = await supabase.from(table).insert(mutablePayload);
    if (!error) return null;

    const missingColumn = extractMissingColumn(error.message);
    if (!missingColumn || !(missingColumn in mutablePayload)) return error;

    console.warn(`[${table}] Supabase schema cache missing column '${missingColumn}', retrying without it.`);
    delete mutablePayload[missingColumn];
  }

  return new Error(`${table} 저장 실패: Supabase 스키마 불일치가 반복되었습니다.`);
}

function extractMissingColumn(message = "") {
  return message.match(/Could not find the '([^']+)' column/)?.[1] || null;
}

const TRACK2_AXIS_FIELD_MAP = {
  task_clarity: "task_clarity",
  context: "context",
  role: "role",
  format: "output_format",
  iteration: "iteration",
  critical: "critical_review"
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function rounded(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function toDbLevel(value) {
  if (value === "고" || value === "high" || value === "높음") return "high";
  if (value === "저" || value === "low" || value === "낮음") return "low";
  return null;
}

function parseMaybeJson(value) {
  if (!value || typeof value !== "string") return value || null;
  try {
    return JSON.parse(value.trim());
  } catch {
    const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!fenced) return null;
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      return null;
    }
  }
}

function buildFeedbackText(feedbackResult) {
  if (!feedbackResult) return null;
  return [
    feedbackResult.summary,
    ...(feedbackResult.strengths || []).map((item) => `${item.name}: ${item.description}`),
    ...(feedbackResult.weaknesses || []).map((item) => `${item.name}: ${item.description}`),
    feedbackResult.insight
  ].filter(Boolean).join("\n");
}

function normalizeEnvValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
