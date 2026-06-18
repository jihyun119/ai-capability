import { listScenarios, getScenario, TRACK3_VERSION } from "../../../src/track3/scenarios.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      track: "track3",
      error: { code: "METHOD_NOT_ALLOWED", message: "GET만 허용됩니다.", retryable: false }
    });
  }

  const scenarioId = req.query?.scenarioId;
  return res.status(200).json({
    status: "success",
    track: "track3",
    version: TRACK3_VERSION,
    result: scenarioId ? getScenario(scenarioId) : listScenarios()
  });
}
