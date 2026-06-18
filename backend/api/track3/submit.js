import { randomUUID } from "node:crypto";
import { getScenario } from "../../../src/track3/scenarios.js";
import { validateSubmitInput } from "../../../src/track3/codeChecks.js";
import { judgeTrack3 } from "../../../src/track3/judge.js";

/**
 * POST /api/track3/submit
 *
 * Demo mode only: no Supabase persistence yet.
 *
 * Request:
 * {
 *   "scenarioId": "t3_growth_001",
 *   "turns": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
 *   "finalOutput": "왼쪽 산출물 최종 내용",
 *   "earlyFinish": false
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
    const evaluation = await judgeTrack3({
      scenarioId: scenario.scenario_id,
      turns: validation.turns,
      finalOutput: validation.finalOutput,
      earlyFinish: Boolean(body.earlyFinish)
    });
    const resultId = `demo_${randomUUID()}`;

    return res.status(200).json({
      status: "success",
      track: "track3",
      version: evaluation.version,
      resultId,
      shareSlug: resultId,
      createdAt: new Date().toISOString(),
      result: evaluation
    });
  } catch (err) {
    console.error("[track3/submit]", err);
    return res.status(500).json({
      status: "error",
      track: "track3",
      error: { code: "INTERNAL_ERROR", message: err.message, retryable: false }
    });
  }
}
