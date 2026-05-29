import { evaluateTrack1 } from "../../../src/track1/evaluate.js";

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
    const shouldPersist = Boolean(req.body?.respondentId && req.body?.accessToken);
    let respondent = null;

    if (shouldPersist) {
      const { validateRespondent } = await import("../../db.js");
      respondent = await validateRespondent(req.body.respondentId, req.body.accessToken);
    }

    const result = evaluateTrack1({
      llmResult: req.body?.llmResult,
      questionnaire: req.body?.questionnaire,
      tieBreaks: req.body?.tieBreaks,
      includeInternal: shouldPersist
    });

    if (shouldPersist && result.status === "success") {
      const { saveTrack1Result } = await import("../../db.js");
      const { resultId, shareSlug } = await saveTrack1Result({
        respondentId: req.body.respondentId,
        nicknameSnapshot: respondent.nickname,
        birthYear: req.body.birthYear,
        questionnaireVersion: req.body.questionnaireVersion || "track1-12",
        questionnaire: req.body.questionnaire,
        llmResult: req.body.llmResult,
        evaluationResult: result
      });
      result.resultId = resultId;
      result.shareSlug = shareSlug;
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
