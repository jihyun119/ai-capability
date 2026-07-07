import { randomUUID } from "node:crypto";
import { getScenario } from "../../../src/track3/scenarios.js";
import { validateSubmitInput } from "../../../src/track3/codeChecks.js";
import { judgeTrack3 } from "../../../src/track3/judge.js";
import { saveTrack3Result } from "../../db.js";

/**
 * POST /api/track3/save
 *
 * Request body:
 * {
 *   "respondentId": "uuid",
 *   "scenarioId": "pm_001",
 *   "turns": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
 *   "finalOutput": "왼쪽 산출물 최종 내용",
 *   "earlyFinish": false,
 *   "evaluation": {...}, // 선택: /api/track3/submit이 이미 반환한 결과를 그대로 넘기면 OpenAI를 다시 호출하지 않음
 *   "nickname": "익명",
 *   "birthYear": 1998,
 *   "gender": "female"
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

  const body = req.body || {};
  if (!body.respondentId) {
    return res.status(400).json({
      status: "error",
      track: "track3",
      error: { code: "INVALID_INPUT", message: "respondentId가 필요합니다.", retryable: true }
    });
  }

  const validation = validateSubmitInput(body);
  if (!validation.valid) {
    return res.status(400).json({
      status: "error",
      track: "track3",
      error: { code: "INVALID_INPUT", message: validation.errors.join(" "), retryable: true }
    });
  }

  try {
    const scenario = getScenario(body.scenarioId);
    const evaluation = body.evaluation || await judgeTrack3({
      scenarioId: scenario.scenario_id,
      turns: validation.turns,
      finalOutput: validation.finalOutput,
      earlyFinish: Boolean(body.earlyFinish)
    });

    const saved = await saveTrack3Result({
      resultId: randomUUID(),
      respondentId: body.respondentId,
      nicknameSnapshot: body.nickname || "익명",
      birthYear: body.birthYear,
      gender: body.gender,
      scenario,
      turns: validation.turns,
      finalOutput: validation.finalOutput,
      earlyFinish: Boolean(body.earlyFinish),
      evaluation
    });

    return res.status(200).json({
      status: "success",
      track: "track3",
      version: evaluation.version,
      resultId: saved.resultId,
      shareSlug: saved.shareSlug,
      createdAt: new Date().toISOString(),
      result: evaluation
    });
  } catch (err) {
    console.error("[track3/save]", err);
    return res.status(500).json({
      status: "error",
      track: "track3",
      error: { code: "INTERNAL_ERROR", message: err.message, retryable: true }
    });
  }
}
