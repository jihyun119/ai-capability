import { evaluateTrack1 } from "../../../src/track1/evaluate.js";
import { repairTrack1LlmResult } from "../../../src/track1/repair.js";
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
    const repaired = await repairTrack1LlmResult(req.body?.llmResult);
    if (repaired.status === "invalid_prompt_pasted") {
      return res.status(400).json(track1InputError("PROMPT_PASTED", repaired.reason));
    }

    const result = evaluateTrack1({
      llmResult: repaired.result ?? req.body?.llmResult,
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

function track1InputError(code, message) {
  return {
    status: "error",
    track: "track1",
    version: "track1-v1",
    error: {
      code,
      message,
      retryable: true
    }
  };
}
