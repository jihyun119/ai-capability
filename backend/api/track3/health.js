import { TRACK3_MAX_TURNS, TRACK3_VERSION, listScenarios } from "../../../src/track3/scenarios.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      track: "track3",
      error: { code: "METHOD_NOT_ALLOWED", message: "GET만 허용됩니다.", retryable: false }
    });
  }

  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY);
  const chatModelEnabled = process.env.ENABLE_TRACK3_CHAT_MODEL !== "false";
  const judgeModelEnabled = process.env.ENABLE_TRACK3_LLM_JUDGE !== "false";

  return res.status(200).json({
    status: "success",
    track: "track3",
    version: TRACK3_VERSION,
    result: {
      openaiConfigured: hasOpenAiKey,
      chatMode: hasOpenAiKey && chatModelEnabled ? "openai" : "fallback",
      judgeMode: hasOpenAiKey && judgeModelEnabled ? "openai" : "fallback",
      scenarioCount: listScenarios().length,
      maxTurns: TRACK3_MAX_TURNS
    }
  });
}
