import { getTrack3Result } from "../../db.js";

/**
 * GET /api/results/track3/:resultId
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error", error: { code: "METHOD_NOT_ALLOWED" }
    });
  }

  const { resultId: shareSlug } = req.query;

  try {
    const record = await getTrack3Result(shareSlug);

    return res.status(200).json({
      status:    "success",
      track:     "track3",
      version:   record.version,
      resultId:  record.result_id,
      shareSlug: record.result_id,
      createdAt: record.created_at,
      result: {
        scenario: {
          scenario_id: record.scenario_id,
          title: record.scenario_title,
          role: record.scenario_role
        },
        total: record.total_score,
        grade: record.grade,
        axis_scores: record.axis_scores,
        delta_score: record.delta_score,
        code_checks: record.code_checks,
        score_breakdown: record.code_checks?.score_breakdown || null,
        move_tagging: record.move_tagging,
        sequence_valid: record.sequence_valid,
        best_intervention: record.best_intervention,
        missed_intervention: record.missed_intervention,
        confidence: record.confidence,
        feedback: record.feedback
      }
    });
  } catch {
    return res.status(404).json({
      status: "error", track: "track3",
      error: { code: "NOT_FOUND", message: "결과를 찾을 수 없습니다.", retryable: false }
    });
  }
}
