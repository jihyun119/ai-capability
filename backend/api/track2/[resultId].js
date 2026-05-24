import { getTrack2Result } from "../../src/db.js";

/**
 * GET /api/track2/:resultId
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      error: { code: "METHOD_NOT_ALLOWED", message: "GET만 허용됩니다." }
    });
  }

  const { resultId } = req.query;

  try {
    const record = await getTrack2Result(resultId);

    return res.status(200).json({
      status:   "success",
      track:    "track2",
      resultId: record.result_id,
      total:    record.total_score,
      grade:    record.grade,
      axes: {
        task_clarity:      { label: "작업 명확성", score: record.score_task_clarity },
        context_provision: { label: "배경·맥락",   score: record.score_context      },
        role_assignment:   { label: "역할 지정",   score: record.score_role         },
        output_format:     { label: "출력 형식",   score: record.score_format       },
        iteration:         { label: "반복 개선",   score: record.score_iteration    },
        critical_review:   { label: "비판적 검토", score: record.score_critical     }
      },
      feedback: {
        strengths:  [record.strength_1, record.strength_2].filter(Boolean),
        weaknesses: [record.weakness_1, record.weakness_2].filter(Boolean),
        summary:    record.feedback_text
      }
    });
  } catch {
    return res.status(404).json({
      status: "error",
      track: "track2",
      error: { code: "NOT_FOUND", message: "결과를 찾을 수 없습니다.", retryable: false }
    });
  }
}
