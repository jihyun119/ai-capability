/**
 * Track 2 채점 핵심 로직
 * Python track2_scorer.py를 Node.js로 포팅
 * LLM 없이 규칙 기반(빈도 부사 근접도)으로 완전 동작
 */

import {
  AXIS_KEYS, AXIS_NAMES, AXIS_MAX,
  AXIS_KEYWORDS, FREQ_WORDS, PROXIMITY,
  SCORE_MAP, MC_SCORES, MC_AXIS_MAX, GRADE_SCALE, BASE_SCORE
} from "./constants.js";

// ── 빈도 부사 추출 ────────────────────────────────────────────────────────────

/**
 * 방식 A: 축 키워드 앞뒤 PROXIMITY 문자 이내에서 빈도 부사 탐색
 * Python extract_freq_word() 포팅
 *
 * @returns {{ freqWord: string, evidence: string }}
 */
function extractFreqWord(text, axisKey) {
  const textLower = text.toLowerCase();
  const keywords = AXIS_KEYWORDS[axisKey];

  let bestFreq = "NONE";
  let bestEvidence = "NONE";
  let bestPriority = FREQ_WORDS.length; // 낮을수록 강한 부사

  for (const keyword of keywords) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const keywordRegex = new RegExp(escaped, "g");
    let match;

    while ((match = keywordRegex.exec(textLower)) !== null) {
      const kwStart = match.index;
      const kwEnd = match.index + match[0].length;
      const windowStart = Math.max(0, kwStart - PROXIMITY);
      const windowEnd = Math.min(text.length, kwEnd + PROXIMITY);
      const window = textLower.slice(windowStart, windowEnd);

      for (let i = 0; i < FREQ_WORDS.length; i++) {
        const freq = FREQ_WORDS[i];
        if (new RegExp(`\\b${freq}\\b`).test(window)) {
          if (i < bestPriority) {
            bestPriority = i;
            bestFreq = freq;

            // Evidence 구절 추출 (원문 그대로)
            const origWindow = text.slice(windowStart, windowEnd).trim();
            const sentences = origWindow.split(/(?<=[.!?])\s+/);
            const matchSent = sentences.find(
              (s) => s.toLowerCase().includes(freq) && s.toLowerCase().includes(keyword)
            );
            bestEvidence = matchSent
              ? matchSent.trim()
              : origWindow.slice(0, 120) + (origWindow.length > 120 ? "..." : "");
          }
          break; // 이 window에서 가장 강한 부사 찾으면 다음 키워드로
        }
      }
    }
  }

  return { freqWord: bestFreq, evidence: bestEvidence };
}

// ── 점수 결정 ─────────────────────────────────────────────────────────────────

function decideScore(freqWord, axisKey) {
  return SCORE_MAP[axisKey][freqWord] ?? 0;
}

// ── 객관식 채점 ───────────────────────────────────────────────────────────────

function scoreMC(answers) {
  const totals = new Array(AXIS_KEYS.length).fill(0);
  for (const [q, ans] of Object.entries(answers)) {
    const scores = MC_SCORES[q]?.[ans];
    if (scores) scores.forEach((pts, i) => { totals[i] += pts; });
  }
  return totals;
}

// ── 등급 판정 ─────────────────────────────────────────────────────────────────

function decideGrade(total) {
  for (const { min, max, grade } of GRADE_SCALE) {
    if (total >= min && total < max) return grade;
  }
  return "AI 초보형";
}

// ── 메인 채점 함수 ────────────────────────────────────────────────────────────

/**
 * 통합 채점 함수. Python score() 포팅.
 *
 * @param {string} essay - 유저가 붙여넣은 줄글 텍스트
 * @param {object|null} mcAnswers - { Q1: "D", Q2: "C", ... } 또는 null (줄글만 채점)
 * @returns {ScoringResult}
 */
export function score(essay, mcAnswers = null) {
  const hasMC = mcAnswers !== null;
  const mcTotals = hasMC ? scoreMC(mcAnswers) : new Array(AXIS_KEYS.length).fill(0);

  const axes = AXIS_KEYS.map((key, i) => {
    const name = AXIS_NAMES[i];
    const maxScore = AXIS_MAX[key];

    // 줄글 채점
    const { freqWord, evidence } = extractFreqWord(essay, key);
    const essayScore = decideScore(freqWord, key);
    const essayNormalized = essayScore; // SCORE_MAP이 이미 축 만점 기준

    // 객관식 채점
    const mcRaw = mcTotals[i];
    const mcMax = MC_AXIS_MAX[key];
    const mcNormalized = hasMC ? round1((mcRaw / mcMax) * maxScore) : 0;

    // 통합 (mc 40% + essay 60%)
    const finalScore = hasMC
      ? round1(mcNormalized * 0.4 + essayNormalized * 0.6)
      : round1(essayNormalized);

    return { key, name, maxScore, freqWord, evidence, essayScore, essayNormalized, mcRaw, mcNormalized, finalScore };
  });

  const total = round1(axes.reduce((sum, ax) => sum + ax.finalScore, 0) + BASE_SCORE);
  const grade = decideGrade(total);

  // 강점/약점 (비율 기준 정렬)
  const sorted = [...axes].sort((a, b) => (b.finalScore / b.maxScore) - (a.finalScore / a.maxScore));
  const strengths = sorted.slice(0, 2).map((ax) => ax.name);
  const weaknesses = sorted.slice(-2).reverse().map((ax) => ax.name);

  return { axes, total, grade, hasMC, mcAnswers: mcAnswers || {}, strengths, weaknesses };
}

function round1(val) {
  return Math.round(val * 10) / 10;
}
