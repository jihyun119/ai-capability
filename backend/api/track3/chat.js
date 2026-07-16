import { generateTrack3Chat } from "../../../src/track3/chat.js";

/**
 * POST /api/track3/chat
 *
 * Request:
 * {
 *   "scenarioId": "t3_growth_001",
 *   "turns": [{"role": "user", "content": "..."}],
 *   "userMessage": "방금 초안에서 누락된 KPI를 지적해줘.",
 *   "artifact": "현재 왼쪽 산출물 내용"
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      track: "track3",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  try {
    const payload = req.body || {};
    const compactMessage = String(payload.userMessage || "").replace(/\s/g, "");

    if (compactMessage.length < 5) {
      return res.status(400).json({
        status: "error",
        track: "track3",
        error: {
          code: "INVALID_INPUT",
          message: "userMessage는 공백 제외 최소 5자 이상이어야 합니다.",
          retryable: true
        }
      });
    }

    const result = await generateTrack3Chat(payload);
    return res.status(200).json({
      status: "success",
      track: "track3",
      version: result.version,
      scenarioId: result.scenarioId,
      result
    });
  } catch (err) {
    const isInvalid = err.code === "INVALID_INPUT";
    console.error("[track3/chat]", err);
    return res.status(isInvalid ? 400 : 500).json({
      status: "error",
      track: "track3",
      error: {
        code: isInvalid ? "INVALID_INPUT" : "INTERNAL_ERROR",
        message: err.message,
        retryable: isInvalid
      }
    });
  }
}
