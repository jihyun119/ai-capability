import { createRespondent } from "../../db.js";

/**
 * POST /api/respondents
 *
 * Request body:
 * { "nickname": "홍길동" }
 *
 * Response:
 * { "status": "success", "respondentId": "uuid", "accessToken": "token", "nickname": "홍길동" }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  const { nickname } = req.body ?? {};

  if (!nickname || typeof nickname !== "string" || nickname.trim().length < 1) {
    return res.status(400).json({
      status: "error",
      error: { code: "INVALID_INPUT", message: "nickname이 필요합니다.", retryable: true }
    });
  }

  try {
    const respondent = await createRespondent(nickname.trim());
    return res.status(201).json({
      status:      "success",
      respondentId: respondent.id,
      accessToken:  respondent.access_token,
      nickname:     respondent.nickname
    });
  } catch (err) {
    console.error("[respondents]", err);
    return res.status(500).json({
      status: "error",
      error: { code: "INTERNAL_ERROR", message: err.message, retryable: false }
    });
  }
}
