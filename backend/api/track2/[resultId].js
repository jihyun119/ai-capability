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
      shareSlug: record.share_slug,
      createdAt: record.created_at,
      result: {
        total:    record.total_score,
        grade:    record.grade,
        axes:     record.final_scores,
        feedback: record.feedback
      }
    });
  } catch {
    return res.status(404).json({
      status: "error", track: "track2",
      error: { code: "NOT_FOUND", message: "결과를 찾을 수 없습니다.", retryable: false }
    });
  }
}
