const VALID_CHOICES = new Set(["A", "B", "C", "D", "E"]);
const MC_QUESTIONS = ["Q1", "Q2", "Q3", "Q4"];
const TRACK2_PROMPT_MARKERS = [
  "look back at our entire conversation history",
  "write a single cohesive paragraph",
  "weave all six of the following observations",
  "for every one of these six behaviors"
];

export function validateSubmitInput(body, { requireRespondent = true } = {}) {
  const errors = [];

  if (requireRespondent && (!body.respondentId || typeof body.respondentId !== "string"))
    errors.push("respondentId가 없습니다.");

  if (requireRespondent && (!body.accessToken || typeof body.accessToken !== "string"))
    errors.push("accessToken이 없습니다.");

  if (!body.answers || typeof body.answers !== "object") {
    errors.push("answers 필드가 없거나 올바르지 않습니다.");
  } else {
    for (const q of MC_QUESTIONS) {
      if (!VALID_CHOICES.has(body.answers[q]))
        errors.push(`answers.${q}는 A~E 중 하나여야 합니다.`);
    }
  }

  if (!body.freeText || typeof body.freeText !== "string" || body.freeText.trim().length < 10) {
    errors.push("freeText가 없거나 너무 짧습니다 (최소 10자).");
  } else if (looksLikeTrack2Prompt(body.freeText)) {
    errors.push("복사한 프롬프트 원문이 아니라 AI가 작성한 답변을 붙여넣어 주세요.");
  }

  return { valid: errors.length === 0, errors };
}

export function looksLikeTrack2Prompt(text) {
  const lower = String(text || "").toLowerCase();
  return TRACK2_PROMPT_MARKERS.filter((marker) => lower.includes(marker)).length >= 2;
}
