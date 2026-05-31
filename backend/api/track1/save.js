import { evaluateTrack1 } from "../../../src/track1/evaluate.js";
import { repairTrack1LlmResult } from "../../../src/track1/repair.js";
import { saveTrack1Result } from "../../db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      track: "track1",
      version: "track1-v1",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  try {
    const resultId = req.body?.resultId;
    const respondentId = req.body?.respondentId;
    if (!resultId || !respondentId) {
      return res.status(400).json({
        status: "error",
        track: "track1",
        version: "track1-v1",
        error: { code: "INVALID_INPUT", message: "resultId와 respondentId가 필요합니다.", retryable: true }
      });
    }

    const repaired = await repairTrack1LlmResult(req.body?.llmResult);
    if (repaired.status === "invalid_prompt_pasted") {
      return res.status(400).json({
        status: "error",
        track: "track1",
        version: "track1-v1",
        error: { code: "PROMPT_PASTED", message: repaired.reason, retryable: true }
      });
    }

    const evaluationResult = evaluateTrack1({
      llmResult: repaired.result ?? req.body?.llmResult,
      questionnaire: req.body?.questionnaire,
      tieBreaks: req.body?.tieBreaks,
      includeInternal: true
    });

    if (evaluationResult.status !== "success") {
      return res.status(400).json(evaluationResult);
    }

    const saved = await saveTrack1Result({
      resultId,
      respondentId,
      nicknameSnapshot: req.body?.nickname || "익명",
      birthYear: req.body?.birthYear,
      questionnaireVersion: req.body?.questionnaireVersion || "track1-12",
      questionnaire: req.body?.questionnaire,
      llmResult: req.body?.llmResult,
      evaluationResult
    });

    return res.status(200).json({
      status: "success",
      track: "track1",
      version: "track1-v1",
      resultId: saved.resultId,
      shareSlug: saved.shareSlug
    });
  } catch (error) {
    console.error("[track1/save]", error);
    return res.status(500).json({
      status: "error",
      track: "track1",
      version: "track1-v1",
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Track 1 결과 저장에 실패했습니다.",
        retryable: true
      }
    });
  }
}
