const VALID_CHOICES = new Set(["A", "B", "C", "D", "E"]);
const MC_QUESTIONS = ["Q1", "Q2", "Q3", "Q4"];

/**
 * POST /api/track2/submit 입력값 검증
 */
export function validateSubmitInput(body) {
  const errors = [];

  // answers
  if (!body.answers || typeof body.answers !== "object") {
    errors.push("answers 필드가 없거나 올바르지 않습니다.");
  } else {
    for (const q of MC_QUESTIONS) {
      if (!VALID_CHOICES.has(body.answers[q])) {
        errors.push(`answers.${q}는 A~E 중 하나여야 합니다.`);
      }
    }
  }

  // freeText
  if (!body.freeText || typeof body.freeText !== "string" || body.freeText.trim().length < 10) {
    errors.push("freeText가 없거나 너무 짧습니다 (최소 10자).");
  }

  return { valid: errors.length === 0, errors };
}
