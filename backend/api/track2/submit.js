import { randomUUID } from "node:crypto";
import { validateSubmitInput } from "../../validate.js";
import { score } from "../../../src/track2/scorer.js";
import { generateFeedback } from "../../feedback.js";
import { saveTrack2Result } from "../../db.js";

/**
 * POST /api/track2/submit
 *
 * Request body:
 * {
 *   "answers": { "Q1": "D", "Q2": "D", "Q3": "B", "Q4": "C" },
 *   "freeText": "I usually give the AI my goal...",
 *   "respondentInfo": { "nickname": "...", "gender": "...", "birthYear": 2000 }  // optional
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      track: "track2",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  // 입력 검증
  const { valid, errors } = validateSubmitInput(req.body);
  if (!valid) {
    return res.status(400).json({
      status: "error",
      track: "track2",
      error: { code: "INVALID_INPUT", message: errors.join(" "), retryable: true }
    });
  }

  const { answers, freeText, respondentInfo = {} } = req.body;

  try {
    // 채점
    const scoringResult = score(freeText, answers);

    // 피드백 생성 (OpenAI 실패 시 템플릿 fallback)
    const feedbackSummary = await generateFeedback(scoringResult);

    // 결과 저장
    const resultId = randomUUID();
    await saveTrack2Result({ resultId, answers, freeText, scoringResult, feedbackSummary, respondentInfo });

    // 응답 구성
    const axisResponse = Object.fromEntries(
      scoringResult.axes.map((ax) => [
        ax.key,
        {
          label:    ax.name,
          score:    ax.finalScore,
          max:      ax.maxScore,
          rate:     Math.round((ax.finalScore / ax.maxScore) * 100) / 100,
          evidence: ax.evidence,
          freqWord: ax.freqWord
        }
      ])
    );

    return res.status(200).json({
      status:   "success",
      track:    "track2",
      version:  "track2-v1",
      resultId,
      total:    scoringResult.total,
      grade:    scoringResult.grade,
      axes:     axisResponse,
      feedback: {
        strengths: scoringResult.strengths,
        weaknesses: scoringResult.weaknesses,
        summary:   feedbackSummary
      }
    });
  } catch (err) {
    console.error("[track2/submit]", err);
    return res.status(500).json({
      status: "error",
      track: "track2",
      error: { code: "INTERNAL_ERROR", message: "채점 중 오류가 발생했습니다.", retryable: false }
    });
  }
}
