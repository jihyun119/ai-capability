import { TRACK3_CHAT_SYSTEM_PROMPT } from "./judgePrompt.js";
import { TRACK3_MAX_TURNS, TRACK3_VERSION, getScenario } from "./scenarios.js";
import { normalizeTurns, validateChatInput } from "./codeChecks.js";

export async function generateTrack3Chat({ scenarioId, turns = [], userMessage, artifact = "" } = {}) {
  const validation = validateChatInput({ turns, userMessage });
  if (!validation.valid) {
    const error = new Error(validation.errors.join(" "));
    error.code = "INVALID_INPUT";
    throw error;
  }

  const scenario = getScenario(scenarioId);
  const nextTurns = [...validation.turns, { role: "user", content: validation.userMessage }];
  const userTurnCount = validation.currentTurnCount + 1;
  const result = await callChatModel({ scenario, turns: nextTurns, artifact })
    .catch((error) => {
      console.error("[track3:chat] OpenAI 호출 실패, fallback으로 전환합니다:", error.message);
      return buildFallbackChat({ scenario, turns: nextTurns, artifact });
    });

  return {
    track: "track3",
    version: TRACK3_VERSION,
    scenarioId: scenario.scenario_id,
    assistantMessage: cleanText(result.assistant_message || result.assistantMessage),
    artifact: cleanText(result.artifact) || cleanText(artifact),
    turnCount: userTurnCount,
    remainingTurns: Math.max(0, TRACK3_MAX_TURNS - userTurnCount),
    isComplete: userTurnCount >= TRACK3_MAX_TURNS,
    turns: [...nextTurns, { role: "assistant", content: cleanText(result.assistant_message || result.assistantMessage) }]
  };
}

async function callChatModel({ scenario, turns, artifact }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
  if (!apiKey || process.env.ENABLE_TRACK3_CHAT_MODEL === "false") {
    return buildFallbackChat({ scenario, turns, artifact });
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey });
  const response = await withTimeout(openai.chat.completions.create({
    model: process.env.TRACK3_CHAT_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: TRACK3_CHAT_SYSTEM_PROMPT },
      {
        // 시나리오는 의도적으로 전달하지 않는다. AI는 사용자가 대화에서 직접 말해준
        // 정보만 알아야 하며(실제 ChatGPT처럼), 이를 통해 사용자의 맥락 제공 능력을 실제로 평가한다.
        role: "user",
        content: JSON.stringify({
          previous_artifact: artifact || "",
          turns: normalizeTurns(turns)
        })
      }
    ],
    temperature: 0.5,
    max_tokens: 1200,
    response_format: { type: "json_object" }
  }), Number(process.env.TRACK3_CHAT_TIMEOUT_MS || 8000));

  return JSON.parse(response.choices[0].message.content.trim());
}

function buildFallbackChat({ scenario, turns, artifact }) {
  const lastUser = [...turns].reverse().find((turn) => turn.role === "user")?.content || "";
  const turnCount = turns.filter((turn) => turn.role === "user").length;
  const baseArtifact = artifact || [
    "# 작업 초안",
    "",
    "아직 사용자가 제공한 정보가 충분하지 않습니다.",
    "현재까지 사용자가 직접 전달한 내용을 바탕으로만 초안을 구성합니다.",
    "",
    "## 사용자 제공 정보",
    "- 구체적인 목표, 맥락, 제약, 산출물 형식을 추가로 알려주면 초안을 더 정확히 만들 수 있습니다."
  ].join("\n");

  const artifactText = updateArtifact(baseArtifact, lastUser, turnCount);
  return {
    assistant_message: [
      `${turnCount}턴 요청을 반영했습니다.`,
      "왼쪽 산출물 초안을 업데이트했어요.",
      turnCount >= TRACK3_MAX_TURNS
        ? "이제 최종 제출 및 평가로 넘어갈 수 있습니다."
        : "다음 턴에서는 방향 선택, 검증 기준, 최종화 요청 중 하나를 더 구체화하면 좋습니다."
    ].join(" "),
    artifact: artifactText
  };
}

function updateArtifact(baseArtifact, lastUser, turnCount) {
  const addition = [
    "",
    `## ${turnCount}턴 반영 메모`,
    `사용자 요청: ${lastUser.slice(0, 180)}`,
    "- 위 요청에서 확인되는 정보만 반영했습니다."
  ].join("\n");
  return `${baseArtifact}${addition}`;
}

function cleanText(value) {
  return String(value || "").trim();
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Track3 chat timeout after ${timeoutMs}ms.`)), timeoutMs))
  ]);
}
