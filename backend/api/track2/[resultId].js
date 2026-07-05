import { getTrack2Result } from "../../db.js";

/**
 * GET /api/results/track2/:shareSlug
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error", error: { code: "METHOD_NOT_ALLOWED" }
    });
  }

  const { resultId: shareSlug } = req.query;

  try {
    const record = await getTrack2Result(shareSlug);

    return res.status(200).json({
      status:    "success",
      track:     "track2",
      version:   record.version,
      resultId:  record.result_id,
      shareSlug: record.result_id,
      createdAt: record.created_at,
      result: {
        total:    record.total_score,
        grade:    record.grade,
        axes:     buildAxesFromRecord(record),
        feedback: buildFeedbackFromRecord(record)
      }
    });
  } catch {
    return res.status(404).json({
      status: "error", track: "track2",
      error: { code: "NOT_FOUND", message: "결과를 찾을 수 없습니다.", retryable: false }
    });
  }
}

function buildAxesFromRecord(record) {
  if (record.final_scores) {
    return {
      task_clarity: buildAxis("작업 명확성", record.final_scores.task_clarity, 20, record.extracted_features?.task_clarity?.evidence),
      context: buildAxis("배경·맥락", record.final_scores.context, 20, record.extracted_features?.context?.evidence),
      role: buildAxis("역할 지정", record.final_scores.role, 15, record.extracted_features?.role?.evidence),
      output_format: buildAxis("출력 형식", record.final_scores.output_format, 15, record.extracted_features?.output_format?.evidence),
      iteration: buildAxis("반복 개선", record.final_scores.iteration, 15, record.extracted_features?.iteration?.evidence),
      critical_review: buildAxis("비판적 검토", record.final_scores.critical_review, 15, record.extracted_features?.critical_review?.evidence)
    };
  }

  return {
    task_clarity: buildAxis("작업 명확성", record.score_task_clarity, 20, record.evidence_task_clarity),
    context: buildAxis("배경·맥락", record.score_context, 20, record.evidence_context),
    role: buildAxis("역할 지정", record.score_role, 15, record.evidence_role),
    output_format: buildAxis("출력 형식", record.score_format, 15, record.evidence_format),
    iteration: buildAxis("반복 개선", record.score_iteration, 15, record.evidence_iteration),
    critical_review: buildAxis("비판적 검토", record.score_critical, 15, record.evidence_critical)
  };
}

function buildAxis(label, score, max, evidence) {
  const value = Number(score) || 0;
  return {
    label,
    score: value,
    max,
    rate: Math.round((value / max) * 100) / 100,
    evidence
  };
}

function buildFeedbackFromRecord(record) {
  if (record.feedback) return record.feedback;
  return {
    summary: record.feedback_text,
    strengths: [record.strength_1, record.strength_2].filter(Boolean).map((name) => ({ name })),
    weaknesses: [record.weakness_1, record.weakness_2].filter(Boolean).map((name) => ({ name })),
    insight: record.llm_text_output
  };
}
