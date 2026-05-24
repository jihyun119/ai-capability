import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Track 2 결과를 DB에 저장
 */
export async function saveTrack2Result({ resultId, answers, freeText, scoringResult, feedbackSummary, respondentInfo = {} }) {
  const { axes, total, grade, strengths, weaknesses } = scoringResult;
  const ax = Object.fromEntries(axes.map((a) => [a.key, a]));

  const record = {
    result_id: resultId,
    track: "track2",
    version: "track2-v1",
    status: "success",

    // respondent_info
    nickname:   respondentInfo.nickname   || null,
    gender:     respondentInfo.gender     || null,
    birth_year: respondentInfo.birthYear  || null,

    // mc_raw_answers
    q1_answer: answers.Q1 || null,
    q2_answer: answers.Q2 || null,
    q3_answer: answers.Q3 || null,
    q4_answer: answers.Q4 || null,

    // mc_scores (정규화된 값)
    mc_score_task_clarity: ax.task_clarity?.mcNormalized    ?? null,
    mc_score_context:      ax.context_provision?.mcNormalized ?? null,
    mc_score_role:         ax.role_assignment?.mcNormalized  ?? null,
    mc_score_format:       ax.output_format?.mcNormalized    ?? null,
    mc_score_iteration:    ax.iteration?.mcNormalized        ?? null,
    mc_score_critical:     ax.critical_review?.mcNormalized  ?? null,

    // prompt_input
    free_text: freeText,

    // prompt_llm_evidence (규칙 기반 추출)
    evidence_task_clarity: ax.task_clarity?.evidence    ?? null,
    evidence_context:      ax.context_provision?.evidence ?? null,
    evidence_role:         ax.role_assignment?.evidence  ?? null,
    evidence_format:       ax.output_format?.evidence    ?? null,
    evidence_iteration:    ax.iteration?.evidence        ?? null,
    evidence_critical:     ax.critical_review?.evidence  ?? null,

    // prompt_scores
    prompt_score_task_clarity: ax.task_clarity?.essayScore    ?? null,
    prompt_score_context:      ax.context_provision?.essayScore ?? null,
    prompt_score_role:         ax.role_assignment?.essayScore  ?? null,
    prompt_score_format:       ax.output_format?.essayScore    ?? null,
    prompt_score_iteration:    ax.iteration?.essayScore        ?? null,
    prompt_score_critical:     ax.critical_review?.essayScore  ?? null,

    // final_scores
    score_task_clarity: ax.task_clarity?.finalScore    ?? null,
    score_context:      ax.context_provision?.finalScore ?? null,
    score_role:         ax.role_assignment?.finalScore  ?? null,
    score_format:       ax.output_format?.finalScore    ?? null,
    score_iteration:    ax.iteration?.finalScore        ?? null,
    score_critical:     ax.critical_review?.finalScore  ?? null,
    total_score: total,

    // final_result
    grade,
    strength_1:    strengths[0] || null,
    strength_2:    strengths[1] || null,
    weakness_1:    weaknesses[0] || null,
    weakness_2:    weaknesses[1] || null,
    feedback_text: feedbackSummary || null,

    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from("track2_results").insert(record);
  if (error) throw new Error(`DB 저장 실패: ${error.message}`);

  return resultId;
}

/**
 * resultId로 Track 2 결과 조회
 */
export async function getTrack2Result(resultId) {
  const { data, error } = await supabase
    .from("track2_results")
    .select("*")
    .eq("result_id", resultId)
    .single();

  if (error) throw new Error(`결과 조회 실패: ${error.message}`);
  return data;
}
