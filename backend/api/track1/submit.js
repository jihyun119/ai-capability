import { evaluateTrack1 } from "../../../src/track1/evaluate.js";
import { randomUUID } from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      track: "track1",
      version: "track1-v1",
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "POST만 허용됩니다.",
        retryable: false
      }
    });
  }

  try {
    const result = evaluateTrack1({
      llmResult: req.body?.llmResult,
      questionnaire: req.body?.questionnaire,
      tieBreaks: req.body?.tieBreaks,
      includeInternal: false
    });

    if (result.status === "success") {
      const resultId = randomUUID();
      result.resultId = resultId;
      result.shareSlug = resultId;
    }

    const statusCode = result.status === "success" ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      track: "track1",
      version: "track1-v1",
      error: {
        code: "INVALID_INPUT",
        message: error.message || "Track 1 입력값이 올바르지 않습니다.",
        retryable: true
      }
    });
  }
}
