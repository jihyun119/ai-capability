import { validateSubmitInput } from "../../validate.js";
import { score } from "../../../src/track2/scorer.js";
import { generateFeedback } from "../../feedback.js";

/**
 * POST /api/track2/submit
 *
 * Request body:
 * {
 *   "respondentId": "uuid",
 *   "accessToken": "token",
 *   "answers": { "Q1": "D", "Q2": "D", "Q3": "B", "Q4": "C" },
 *   "freeText": "I usually give the AI my goal..."
 * }
 *
 * Response result 구조:
 * {
 *   total:  74,
 *   grade:  "AI 활용형",
 *   axes: { task_clarity: { label, score, max, rate }, ... },
 *   feedback: {
 *     summary:    "전반적인 요약 2~3문장",
 *     strengths:  [{ name, description }, ...],
 *     weaknesses: [{ name, description }, ...],
 *     insight:    "면접에서 말할 수 있는 1인칭 AI 활용 스타일"
 *   }
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error", track: "track2", version: "track2-v1",
      error: { code: "METHOD_NOT_ALLOWED", message: "POST만 허용됩니다.", retryable: false }
    });
  }

  const isDemoMode = !req.body?.respondentId || !req.body?.accessToken;
  const { valid, errors } = validateSubmitInput(req.body, { requireRespondent: !isDemoMode });
  if (!valid) {
    return res.status(400).json({
      status: "error", track: "track2", version: "track2-v1",
      error: { code: "INVALID_INPUT", message: errors.join(" "), retryable: true }
    });
  }

  const { respondentId, accessToken, answers, freeText } = req.body;

  try {
    if (isDemoMode) {
      const scoringResult = score(freeText, answers);
      const feedbackResult = await generateFeedback(scoringResult);
      const axesResponse = buildAxesResponse(scoringResult);

      return res.status(200).json({
        status:    "success",
        track:     "track2",
        version:   "track2-v1",
        resultId:  `demo_${Date.now()}`,
        createdAt: new Date().toISOString(),
        result: {
          total:    scoringResult.total,
          grade:    scoringResult.grade,
          axes:     axesResponse,
          feedback: feedbackResult
        }
      });
    }

    // 응시자 검증
    const { validateRespondent, saveTrack2Result } = await import("../../db.js");
    const respondent = await validateRespondent(respondentId, accessToken);

    // 채점 (LLM 없이 규칙 기반)
    const scoringResult = score(freeText, answers);

    // 피드백 생성 (OpenAI → fallback 템플릿)
    const feedbackResult = await generateFeedback(scoringResult);

    // DB 저장
    const { resultId, shareSlug } = await saveTrack2Result({
      respondentId,
      nicknameSnapshot: respondent.nickname,
      birthYear: req.body.birthYear,
      answers,
      freeText,
      scoringResult,
      feedbackResult
    });

    // 축별 응답 구성 (레이더 차트용)
    const axesResponse = buildAxesResponse(scoringResult);

    return res.status(200).json({
      status:    "success",
      track:     "track2",
      version:   "track2-v1",
      resultId,
      shareSlug,
      createdAt: new Date().toISOString(),
      result: {
        total:    scoringResult.total,
        grade:    scoringResult.grade,
        axes:     axesResponse,
        feedback: feedbackResult   // { summary, strengths, weaknesses, insight }
      }
    });
  } catch (err) {
    console.error("[track2/submit]", err);
    const isAuth = err.message.includes("응시자") || err.message.includes("access_token");
    return res.status(isAuth ? 401 : 500).json({
      status: "error", track: "track2", version: "track2-v1",
      error: {
        code:      isAuth ? "INVALID_INPUT" : "INTERNAL_ERROR",
        message:   err.message,
        retryable: false
      }
    });
  }
}

function buildAxesResponse(scoringResult) {
  return Object.fromEntries(
    scoringResult.axes.map((ax) => [ax.key, {
      label: ax.name,
      score: ax.finalScore,
      max:   ax.maxScore,
      rate:  Math.round((ax.finalScore / ax.maxScore) * 100) / 100,
      evidence: ax.evidence
    }])
  );
}
