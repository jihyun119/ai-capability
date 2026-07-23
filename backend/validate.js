import { AXIS_KEYWORDS, FREQ_WORDS } from "../src/track2/constants.js";

const VALID_CHOICES = new Set(["A", "B", "C", "D", "E"]);
const MC_QUESTIONS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"];
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

  if (!body.freeText || typeof body.freeText !== "string") {
    errors.push("freeText가 없습니다.");
  } else if (looksLikeTrack2Prompt(body.freeText)) {
    errors.push("복사한 프롬프트 원문이 아니라 AI가 작성한 답변을 붙여넣어 주세요.");
  } else {
    const freeTextErrors = validateFreeText(body.freeText);
    errors.push(...freeTextErrors);
  }

  return { valid: errors.length === 0, errors };
}

export function looksLikeTrack2Prompt(text) {
  const lower = String(text || "").toLowerCase();
  return TRACK2_PROMPT_MARKERS.filter((marker) => lower.includes(marker)).length >= 2;
}

// ── Layer 1: 기본 형식 검사 ───────────────────────────────────────────────────

function checkMinWords(text, min = 30) {
  const count = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  if (count < min) return `최소 ${min}단어 이상 작성해주세요. (현재 ${count}단어)`;
  return null;
}

function checkMinSentences(text, min = 3) {
  const count = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  if (count < min) return `최소 ${min}문장 이상 작성해주세요. (현재 ${count}문장)`;
  return null;
}

function checkUniqueWordRatio(text, minRatio = 0.4) {
  const words = text.toLowerCase().trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return null;
  const ratio = new Set(words).size / words.length;
  if (ratio < minRatio) return "동일한 단어가 너무 많이 반복되었습니다.";
  return null;
}

// ── Layer 2: 내용 관련성 검사 ─────────────────────────────────────────────────

function checkFreqWordPresence(text) {
  const lower = text.toLowerCase();
  const found = FREQ_WORDS.some((fw) => new RegExp(`\\b${fw}\\b`).test(lower));
  if (!found) return "빈도를 나타내는 표현(always, sometimes, frequently 등)을 포함해주세요.";
  return null;
}

function checkAxisKeywordHits(text, minAxes = 2) {
  const lower = text.toLowerCase();
  const hitCount = Object.values(AXIS_KEYWORDS).filter((keywords) =>
    keywords.some((kw) => lower.includes(kw))
  ).length;
  if (hitCount < minAxes)
    return "AI 활용 내용이 부족합니다. 목표 설정, 맥락 제공, 역할 지정, 출력 형식 등을 포함해주세요.";
  return null;
}

// ── 통합 검증 ─────────────────────────────────────────────────────────────────

export function validateFreeText(text) {
  const results = [
    checkMinWords(text),
    checkMinSentences(text),
    checkUniqueWordRatio(text),
    checkFreqWordPresence(text),
    checkAxisKeywordHits(text),
  ];
  return results.filter(Boolean);
}
