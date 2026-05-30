import { score } from "../../../src/track2/scorer.js";
import { generateFeedback } from "../../feedback.js";
import { saveTrack2Result } from "../../db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      track: "track2",
      version: "track2-v1",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  try {
    const { resultId, respondentId, answers, freeText } = req.body ?? {};
    if (!resultId || !respondentId || !answers || typeof freeText !== "string") {
      return res.status(400).json({
        status: "error",
        track: "track2",
        version: "track2-v1",
        error: { code: "INVALID_INPUT", message: "resultId, respondentId, answers, freeText가 필요합니다.", retryable: true }
      });
    }

    const scoringResult = score(freeText, answers);
    const feedbackResult = req.body?.feedbackResult || await generateFeedback(scoringResult);
    const saved = await saveTrack2Result({
      resultId,
      respondentId,
      nicknameSnapshot: req.body?.nickname || "익명",
      birthYear: req.body?.birthYear,
      answers,
      freeText,
      scoringResult,
      feedbackResult
    });

    return res.status(200).json({
      status: "success",
      track: "track2",
      version: "track2-v1",
      resultId: saved.resultId,
      shareSlug: saved.shareSlug
    });
  } catch (error) {
    console.error("[track2/save]", error);
    return res.status(500).json({
      status: "error",
      track: "track2",
      version: "track2-v1",
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Track 2 결과 저장에 실패했습니다.",
        retryable: true
      }
    });
  }
}
