import { randomUUID } from "node:crypto";
import { loadEnv } from "../src/shared/env.js";

loadEnv();

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const supabaseServiceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
}

if (!/^https?:\/\/.+/i.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL 형식이 올바르지 않습니다. https://...supabase.co 형태로 설정해주세요.");
}

const supabaseHost = new URL(supabaseUrl).host;
const supabaseRestUrl = `${supabaseUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/i, "")}/rest/v1`;

// ── 응시자 생성 ───────────────────────────────────────────────────────────────

export async function createRespondent(nickname, birthYear = null, gender = null) {
  const accessToken = randomUUID().replace(/-/g, "");
  const payload = {
    nickname,
    access_token: accessToken,
    birth_year: toNumber(birthYear),
    gender: normalizeGender(gender)
  };

  const error = await insertWithSchemaFallback("respondents", payload);
  if (error) throw new Error(`응시자 생성 실패: ${error.message}`);

  const { data, error: selectError } = await restSelectOne(
    "respondents",
    "*",
    { access_token: accessToken }
  );

  if (selectError || !data) throw new Error(`응시자 생성 실패: ${selectError?.message}`);
  return data;
}

// ── 응시자 검증 ───────────────────────────────────────────────────────────────

export async function validateRespondent(respondentId, accessToken) {
  const { data, error } = await restSelectOne(
    "respondents",
    "*",
    { id: respondentId }
  );

  if (error || !data) throw new Error("응시자를 찾을 수 없습니다.");
  if (data.access_token !== accessToken) throw new Error("access_token이 일치하지 않습니다.");

  await restUpdate("respondents", { last_seen_at: new Date().toISOString() }, { id: respondentId });

  return data;
}

// ── Track 2 결과 저장 ─────────────────────────────────────────────────────────

export async function saveTrack2Result({ resultId = randomUUID(), respondentId, nicknameSnapshot, birthYear = null, gender = null, answers, freeText, scoringResult, feedbackResult }) {
  const { axes, total, grade } = scoringResult;
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
    gender:               normalizeGender(gender),
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

  const error = await insertWithSchemaFallback("track2_results", compactTrack2Payload(payload));

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

  const diagError = await insertWithSchemaFallback("diagnosis_answers", diagnosisRows);
  if (diagError) console.error("diagnosis_answers 저장 실패:", diagError.message);

  return { resultId, shareSlug: resultId };
}

// ── Track 1 결과 저장 ─────────────────────────────────────────────────────────

export async function saveTrack1Result({ resultId = randomUUID(), respondentId, nicknameSnapshot, birthYear = null, gender = null, questionnaireVersion = "track1-12", questionnaire, llmResult, evaluationResult }) {
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
    gender: normalizeGender(gender),
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

  const error = await insertWithSchemaFallback("track1_results", compactTrack1Payload(payload));

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

  const diagError = await insertWithSchemaFallback("diagnosis_answers", diagnosisRows);
  if (diagError) console.error("diagnosis_answers 저장 실패:", diagError.message);

  return { resultId, shareSlug: resultId };
}

// ── Track 1 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack1Result(resultId) {
  const { data, error } = await restSelectOne("track1_results", "*", { result_id: resultId });

  if (error || !data) throw new Error("결과를 찾을 수 없습니다.");
  return data;
}

// ── Track 2 결과 조회 ─────────────────────────────────────────────────────────

export async function getTrack2Result(resultId) {
  const { data, error } = await restSelectOne("track2_results", "*", { result_id: resultId });

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
  const mutablePayload = Array.isArray(payload)
    ? payload.map((row) => ({ ...row }))
    : { ...payload };
  const initialKeys = Array.isArray(mutablePayload)
    ? new Set(mutablePayload.flatMap((row) => Object.keys(row)))
    : new Set(Object.keys(mutablePayload));
  const maxAttempts = initialKeys.size + 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const error = await restInsert(table, mutablePayload);
    if (!error) return null;

    const missingColumn = extractMissingColumn(error.message);
    if (!missingColumn || !payloadHasColumn(mutablePayload, missingColumn)) return error;

    console.warn(`[${table}] Supabase schema cache missing column '${missingColumn}', retrying without it.`);
    deletePayloadColumn(mutablePayload, missingColumn);
  }

  return new Error(`${table} 저장 실패: Supabase 스키마 불일치가 반복되었습니다.`);
}

async function restInsert(table, payload) {
  const { error } = await supabaseRestFetch(table, {
    method: "POST",
    body: payload,
    headers: { Prefer: "return=minimal" }
  });
  return error;
}

async function restSelectOne(table, columns, filters) {
  const params = new URLSearchParams({ select: columns });
  for (const [key, value] of Object.entries(filters)) {
    params.set(key, `eq.${value}`);
  }

  const { data, error } = await supabaseRestFetch(`${table}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/vnd.pgrst.object+json" }
  });
  return { data, error };
}

async function restUpdate(table, patch, filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    params.set(key, `eq.${value}`);
  }
  const { error } = await supabaseRestFetch(`${table}?${params.toString()}`, {
    method: "PATCH",
    body: patch,
    headers: { Prefer: "return=minimal" }
  });
  return error;
}

async function supabaseRestFetch(path, { method, body, headers = {} }) {
  const url = `${supabaseRestUrl}/${path}`;
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    return {
      data: null,
      error: new Error(`Supabase 네트워크 연결 실패(${supabaseHost}): ${error.message}`)
    };
  }

  const text = await response.text();
  const parsed = parseJsonOrText(text);
  if (!response.ok) {
    const message = typeof parsed === "object" && parsed?.message
      ? parsed.message
      : text || response.statusText;
    return {
      data: null,
      error: new Error(`Supabase REST ${response.status}: ${message}`)
    };
  }

  return { data: parsed, error: null };
}

function parseJsonOrText(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function payloadHasColumn(payload, column) {
  if (Array.isArray(payload)) return payload.some((row) => column in row);
  return column in payload;
}

function deletePayloadColumn(payload, column) {
  if (Array.isArray(payload)) {
    for (const row of payload) delete row[column];
    return;
  }
  delete payload[column];
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

const TRACK1_COMPACT_COLUMNS = [
  "result_id",
  "respondent_id",
  "track",
  "version",
  "status",
  "nickname",
  "nickname_snapshot",
  "birth_year",
  "gender",
  "questionnaire_version",
  "q1_answer",
  "q2_answer",
  "q3_answer",
  "q4_answer",
  "q5_answer",
  "q6_answer",
  "q7_answer",
  "q8_answer",
  "q9_answer",
  "q10_answer",
  "q11_answer",
  "q12_answer",
  "raw_pasted_llm_result",
  "parsed_llm_result",
  "type_code",
  "type_name",
  "reason_story",
  "llm_evidence_mode",
  "llm_verdict",
  "llm_tags",
  "mc_raw_answers",
  "mc_scores",
  "prompt_scores",
  "final_scores",
  "binary_profile",
  "result_card",
  "share_slug",
  "created_at"
];

const TRACK2_COMPACT_COLUMNS = [
  "result_id",
  "respondent_id",
  "track",
  "version",
  "status",
  "nickname",
  "nickname_snapshot",
  "birth_year",
  "gender",
  "questionnaire_version",
  "q1_answer",
  "q2_answer",
  "q3_answer",
  "q4_answer",
  "free_text",
  "total_score",
  "grade",
  "strength_1",
  "strength_2",
  "weakness_1",
  "weakness_2",
  "feedback_text",
  "mc_raw_answers",
  "mc_scores",
  "extracted_features",
  "prompt_scores",
  "final_scores",
  "feedback",
  "share_slug",
  "created_at"
];

function compactTrack1Payload(payload) {
  return pickPayload(payload, TRACK1_COMPACT_COLUMNS);
}

function compactTrack2Payload(payload) {
  return pickPayload(payload, TRACK2_COMPACT_COLUMNS);
}

function pickPayload(payload, columns) {
  const picked = {};
  for (const column of columns) {
    if (column in payload) picked[column] = payload[column];
  }
  return picked;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeGender(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["male", "m", "남", "남성"].includes(normalized)) return "male";
  if (["female", "f", "여", "여성"].includes(normalized)) return "female";
  if (["other", "nonbinary", "non-binary", "기타"].includes(normalized)) return "other";
  return normalized || null;
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

function normalizeSupabaseUrl(value) {
  const normalized = normalizeEnvValue(value);
  if (typeof normalized !== "string") return normalized;
  const match = normalized.match(/https?:\/\/[a-z0-9-]+\.supabase\.co/i);
  if (match) return match[0];
  return normalized.replace(/\/rest\/v1$/i, "");
}
