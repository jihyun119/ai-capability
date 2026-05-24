import { validateSubmitInput } from "../../validate.js";
import { score } from "../../../src/track2/scorer.js";
import { generateFeedback } from "../../feedback.js";
import { validateRespondent, saveTrack2Result } from "../../db.js";

/**
 * POST /api/track2/submit
 *
 * Request body:
 * {
 *   "respondentId": "uuid",
 *   "accessToken": "token",
 *   "questionnaireVersion": "track2-4-v1",
 *   "answers": { "Q1": "D", "Q2": "D", "Q3": "B", "Q4": "C" },
 *   "freeText": "I usually give the AI my goal..."
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error", track: "track2", version: "track2-v1",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  const { valid, errors } = validateSubmitInput(req.body);
  if (!valid) {
    return res.status(400).json({
      status: "error", track: "track2", version: "track2-v1",
      error: { code: "INVALID_INPUT", message: errors.join(" "), retryable: true }
    });
  }

  const { respondentId, accessToken, answers, freeText } = req.body;

  try {
    // 응시자 검증
    const respondent = await validateRespondent(respondentId, accessToken);

    // 채점
    const scoringResult = score(freeText, answers);

    // 피드백 생성
    const feedbackSummary = await generateFeedback(scoringResult);

    // DB 저장
    const { resultId, shareSlug } = await saveTrack2Result({
      respondentId,
      nicknameSnapshot: respondent.nickname,
      answers,
      scoringResult,
      feedbackSummary
    });

    // 응답
    const axisResponse = Object.fromEntries(
      scoringResult.axes.map((ax) => [ax.key, {
        label:    ax.name,
        score:    ax.finalScore,
        max:      ax.maxScore,
        rate:     Math.round((ax.finalScore / ax.maxScore) * 100) / 100,
        evidence: ax.evidence
      }])
    );

    return res.status(200).json({
      status:    "success",
      track:     "track2",
      version:   "track2-v1",
      resultId,
      shareSlug,
      createdAt: new Date().toISOString(),
      result: {
        total:     scoringResult.total,
        grade:     scoringResult.grade,
        axes:      axisResponse,
        feedback: {
          strengths:  scoringResult.strengths,
          weaknesses: scoringResult.weaknesses,
          summary:    feedbackSummary
        }
      }
    });
  } catch (err) {
    console.error("[track2/submit]", err);
    const isAuth = err.message.includes("응시자") || err.message.includes("access_token");
    return res.status(isAuth ? 401 : 500).json({
      status: "error", track: "track2", version: "track2-v1",
      error: {
        code:     isAuth ? "INVALID_INPUT" : "INTERNAL_ERROR",
        message:  err.message,
        retryable: false
      }
    });
  }
}
