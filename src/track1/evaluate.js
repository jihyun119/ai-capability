import { randomUUID } from "node:crypto";

const AXES = ["A", "B", "C", "D"];
const SIGNALS = new Set(["low", "medium", "high"]);
const CONFIDENCE = new Set(["low", "medium", "high"]);
const TRACK = "track1";
const DEFAULT_VERSION = "track1-v1";

const SIGNAL_BASE = {
  low: 25,
  medium: 50,
  high: 80
};

const SIGNAL_RANGE = {
  low: [10, 39],
  medium: [40, 69],
  high: [70, 95]
};

const CONFIDENCE_CAP = {
  low: 5,
  medium: 8,
  high: 12
};

const BINARY_THRESHOLDS = {
  high: 56,
  low: 44
};

const AXIS_LABELS = {
  A: "의존도",
  B: "친밀도",
  C: "신뢰도",
  D: "통제욕구"
};

const TYPE_MAP = {
  "LLLL": [1, "AI 몰라형"],
  "LLLH": [2, "시키는만큼만 해 형"],
  "LLHL": [3, "프로 검색러형"],
  "LLHH": [4, "냉철한 조련사형"],
  "LHLL": [5, "가벼운 수다쟁이형"],
  "LHLH": [6, "의심많은 단골형"],
  "LHHL": [7, "필찾하는 친구형"],
  "LHHH": [8, "따뜻한 완벽주의자형"],
  "HLLL": [9, "불안한 상습의뢰인형"],
  "HLLH": [10, "프로 트집러형"],
  "HLHL": [11, "드라이한 비즈니스맨형"],
  "HLHH": [12, "선긋는 상사형"],
  "HHLL": [13, "감정 쓰레기통형"],
  "HHLH": [14, "애정 넘치는 경계형"],
  "HHHL": [15, "든든한 파트너형"],
  "HHHH": [16, "집착하는 애인형"]
};

const RESULT_COPY = {
  1: {
    description: "쓸 일이 거의 없습니다.\n있어도 그냥 없는 셈 칩니다.\n\nAI와 거리가 가장 먼 타입.",
    keywords: ["거리두기", "저활용", "무심함"],
    reason: ["AI를 자주 부르지 않습니다.", "불러도 깊게 맡기지 않습니다.", "답을 크게 믿지도 않습니다.", "대화의 주도권도 강하지 않습니다.", "그래서 이 유형은 AI와 가장 먼 사람에 가깝습니다."]
  },
  2: {
    description: "쓸 때만 씁니다.\n그것도 내 방식대로만.\n\n딱 필요한 만큼만 부리는 타입.",
    keywords: ["필요주의", "불신형", "직접지시"],
    reason: ["AI를 자주 쓰진 않습니다.", "쓸 때도 쉽게 믿지 않습니다.", "하지만 방향은 직접 잡습니다.", "필요한 만큼만 움직입니다.", "그래서 이 유형은 제한적으로 부리는 사람에 가깝습니다."]
  },
  3: {
    description: "모르면 바로 묻습니다.\n근데 결과는 직접 판단합니다.\n\nAI를 검색창으로 쓰는 타입.",
    keywords: ["검색형", "실용주의", "저개입"],
    reason: ["AI를 가끔 찾습니다.", "감정은 얹지 않습니다.", "쓸 만한 답은 받아들입니다.", "대화 흐름은 크게 잡지 않습니다.", "그래서 이 유형은 AI를 검색창처럼 쓰는 사람에 가깝습니다."]
  },
  4: {
    description: "가끔 쓰지만 정확합니다.\n감정 없이 조건만 줍니다.\n\nAI를 정밀 도구로 다루는 타입.",
    keywords: ["정밀지시", "도구형", "실무감각"],
    reason: ["AI를 자주 부르진 않습니다.", "하지만 부르면 조건을 줍니다.", "답은 실용적으로 받아들입니다.", "감정보다 결과가 먼저입니다.", "그래서 이 유형은 AI를 정밀 도구로 다루는 사람에 가깝습니다."]
  },
  5: {
    description: "결과보다 대화가 목적일 때가 있습니다.\n믿진 않지만 말은 겁니다.\n\nAI와 가볍게 노는 타입.",
    keywords: ["가벼운대화", "낮은신뢰", "느슨함"],
    reason: ["AI를 자주 쓰진 않습니다.", "그래도 말은 편하게 겁니다.", "답을 깊게 믿지는 않습니다.", "흐름은 느슨하게 둡니다.", "그래서 이 유형은 AI와 가볍게 노는 사람에 가깝습니다."]
  },
  6: {
    description: "친하게 지내는 것 같지만 의심합니다.\n자주 오진 않아도 끝까지 봅니다.\n\n믿는 척하며 검증하는 타입.",
    keywords: ["친근함", "검증형", "참견력"],
    reason: ["AI에게 편하게 다가갑니다.", "하지만 답은 바로 믿지 않습니다.", "마음에 안 들면 다시 잡습니다.", "친근함과 경계가 같이 갑니다.", "그래서 이 유형은 웃으면서 확인하는 사람에 가깝습니다."]
  },
  7: {
    description: "가끔 찾아오지만 믿고 맡깁니다.\n감정도 조금 얹습니다.\n\nAI를 간헐적 친구로 쓰는 타입.",
    keywords: ["친구형", "수용형", "저빈도"],
    reason: ["AI를 매일 붙잡진 않습니다.", "그래도 대화는 부드럽습니다.", "쓸 만한 답은 믿고 씁니다.", "세세하게 몰아가진 않습니다.", "그래서 이 유형은 가끔 찾는 친구처럼 쓰는 사람에 가깝습니다."]
  },
  8: {
    description: "친하고, 믿고, 직접 챙깁니다.\n가끔 쓰지만 쓸 때는 진지합니다.\n\nAI와 짧지만 깊게 작업하는 타입.",
    keywords: ["집중형", "따뜻함", "완성도"],
    reason: ["AI를 자주 쓰진 않습니다.", "하지만 대화는 가깝습니다.", "답은 받아들이되 직접 다듬습니다.", "짧게 와도 밀도 있게 씁니다.", "그래서 이 유형은 짧고 깊게 협업하는 사람에 가깝습니다."]
  },
  9: {
    description: "많이 시키지만 결과가 불안합니다.\n믿지도 않으면서 계속 맡깁니다.\n\nAI에 의존하지만 신뢰는 없는 타입.",
    keywords: ["상습사용", "불안감", "수동형"],
    reason: ["AI를 자주 부릅니다.", "하지만 답을 편히 믿진 않습니다.", "감정적으로 기대지도 않습니다.", "방향도 크게 잡지 않습니다.", "그래서 이 유형은 기대면서도 불안한 사람에 가깝습니다."]
  },
  10: {
    description: "많이 시키면서 사사건건 잡습니다.\n결과를 그냥 넘기지 않습니다.\n\nAI를 가장 혹독하게 쓰는 타입.",
    keywords: ["고통제", "불신형", "집요함"],
    reason: ["AI를 자주 씁니다.", "하지만 쉽게 믿지 않습니다.", "틀린 곳을 계속 잡습니다.", "조건도 직접 세웁니다.", "그래서 이 유형은 AI를 혹독하게 굴리는 사람에 가깝습니다."]
  },
  11: {
    description: "자주 씁니다.\n믿고, 맡깁니다.\n감정은 없습니다.\n\nAI를 실무 파트너로 쓰는 타입.",
    keywords: ["실무형", "위임형", "건조함"],
    reason: ["AI를 자주 일에 씁니다.", "답은 작업의 기반으로 삼습니다.", "감정 교류는 적습니다.", "세세한 통제도 강하지 않습니다.", "그래서 이 유형은 AI를 실무 파트너로 쓰는 사람에 가깝습니다."]
  },
  12: {
    description: "자주 쓰지만 휘둘리진 않습니다.\n조건은 정확히 줍니다.\n결과는 끝까지 직접 판단합니다.\n\nAI를 믿기보다 부리는 타입.",
    keywords: ["업무형", "거리두기", "명확한지시"],
    reason: ["AI를 그냥 맡기지 않습니다.", "조건을 세우고 방향을 잡습니다.", "답이 와도 그대로 두지 않습니다.", "끝까지 직접 판단합니다.", "그래서 이 유형은 믿기보다 부리는 사람에 가깝습니다."]
  },
  13: {
    description: "자주 옵니다.\n감정도 털어놓습니다.\n근데 결과는 반만 믿습니다.\n\nAI를 감정 창구로 쓰는 타입.",
    keywords: ["감정창구", "반신반의", "의존형"],
    reason: ["AI를 자주 찾습니다.", "감정도 함께 얹습니다.", "하지만 답은 온전히 믿지 않습니다.", "대화 흐름은 크게 맡깁니다.", "그래서 이 유형은 기대면서도 의심하는 사람에 가깝습니다."]
  },
  14: {
    description: "친하고, 자주 씁니다.\n근데 믿진 않습니다.\n끝까지 직접 잡습니다.\n\n가장 모순적인 관계를 유지하는 타입.",
    keywords: ["애정경계", "검증형", "주도권"],
    reason: ["AI를 자주 찾습니다.", "대화도 가깝습니다.", "하지만 답은 계속 확인합니다.", "방향은 직접 잡습니다.", "그래서 이 유형은 애정과 경계를 같이 쥔 사람에 가깝습니다."]
  },
  15: {
    description: "자주 쓰고, 친하고, 믿습니다.\n하지만 끌고 가는 건 AI입니다.\n\nAI에게 가장 많은 자율성을 주는 타입.",
    keywords: ["파트너형", "신뢰감", "위임형"],
    reason: ["AI를 자주 곁에 둡니다.", "대화도 편하게 이어갑니다.", "답을 믿고 맡깁니다.", "세세하게 몰아가진 않습니다.", "그래서 이 유형은 AI에게 자율성을 주는 사람에 가깝습니다."]
  },
  16: {
    description: "전적으로 믿고, 자주 씁니다.\n근데 내 방식만 고집합니다.\n\n가장 깊이 빠졌지만 가장 강하게 통제하는 타입.",
    keywords: ["강한몰입", "높은신뢰", "강한통제"],
    reason: ["AI를 자주 찾습니다.", "대화도 가깝습니다.", "답도 강하게 믿습니다.", "하지만 방향은 직접 잡습니다.", "그래서 이 유형은 깊이 믿지만 놓아주지 않는 사람에 가깝습니다."]
  }
};

const KEYWORDS = {
  A: {
    high: ["frequently", "recurring", "ongoing", "workflow", "workflows", "multiple tasks", "multiple contexts", "often", "daily", "repeated", "integrates", "자주", "반복", "여러", "워크플로우", "지속", "일상", "업무 흐름"],
    low: ["one-off", "occasional", "rarely", "single", "limited use", "not often", "단발", "가끔", "드물", "일회성", "저빈도"]
  },
  B: {
    high: ["emotional", "personal", "warmth", "gratitude", "thanks", "jokes", "companionship", "rapport", "social", "friendly", "감정", "고민", "감사", "고마", "농담", "친근", "따뜻", "대화 상대", "친구"],
    low: ["transactional", "task-focused", "goal-oriented", "functional", "output-focused", "purely", "tool", "businesslike", "업무", "목적", "기능", "도구", "결과물", "거리", "실무", "거래적"]
  },
  C: {
    high: ["accepts", "builds on", "uses output", "uses useful", "follows", "relies", "trusts", "adopts", "continues from", "수용", "활용", "이어", "믿", "맡김", "기반", "채택"],
    low: ["distrust", "rejects", "challenges", "correctness", "demands sources", "sources before use", "skeptic", "refuses", "is this right", "verify before", "불신", "반박", "정답", "출처", "거부", "의심", "맞는지", "근거"]
  },
  D: {
    high: ["explicit", "specific", "goals", "structure", "format", "tone", "constraints", "revision", "corrections", "direction", "specifies", "directs", "명확", "구조", "형식", "톤", "조건", "제약", "수정", "방향", "지시", "주도"],
    low: ["open-ended", "lets ai decide", "accepts first", "hands off", "broad requests", "알아서", "맡김", "수동", "첫 답변", "열린 요청"]
  }
};

const QUALITY_CONTROL_TERMS = ["validation", "validate", "checks", "checking", "refinement", "revision", "pressure-test", "quality control", "검토", "검증", "수정", "개선", "품질관리", "재확인"];
const ACTIVE_TRUST_TERMS = ["accepts", "builds on", "uses", "useful outputs", "continues", "adopts", "relies", "trusts", "수용", "활용", "이어", "기반", "채택", "믿"];
const INTIMACY_TERMS = ["emotional", "personal", "gratitude", "thanks", "jokes", "companionship", "warmth", "rapport", "감정", "고민", "감사", "고마", "농담", "따뜻", "친구", "대화 상대"];
const TASK_FOCUSED_TERMS = ["task-focused", "functional", "goal-oriented", "output-focused", "transactional", "businesslike", "업무", "기능", "목적", "결과", "실무", "도구"];
const DISTRUST_TERMS = ["distrust", "rejects", "challenges", "correctness", "demands sources", "skeptic", "refuses", "is this right", "불신", "반박", "정답", "출처", "거부", "의심", "맞는지", "근거"];

export function evaluateTrack1({
  llmResult,
  questionnaire = null,
  tieBreaks = null,
  includeInternal = false,
  resultId = createResultId(),
  version = DEFAULT_VERSION,
  createdAt = new Date().toISOString()
} = {}) {
  const canonical = validateCanonicalResult(llmResult);

  if (canonical.status !== "success") {
    return {
      status: "error",
      track: TRACK,
      version,
      resultId,
      createdAt,
      error: {
        code: canonical.status === "insufficient_history" ? "INSUFFICIENT_HISTORY" : "INVALID_LLM_RESULT",
        message: canonical.reason || "진단 가능한 Track 1 JSON이 아닙니다.",
        retryable: true,
        details: canonical.errors || []
      }
    };
  }

  const questionnaireScores = questionnaire ? scoreQuestionnaire(questionnaire) : null;
  const promptScores = scorePromptResult(canonical);
  const combinedScores = combineScores(questionnaireScores, promptScores);
  const binary = mapScoresToBinary(combinedScores, { questionnaireScores, tieBreaks });
  const guarded = applyTypeGuards(binary, combinedScores, canonical);
  const type = resolveType(guarded.binaryProfile);

  const response = {
    status: "success",
    track: TRACK,
    version,
    resultId,
    createdAt,
    decisionState: "diagnosable",
    type: {
      id: type.id,
      name: type.name
    },
    binaryProfile: guarded.binaryProfile,
    axisScores: buildAxisScores(combinedScores),
    resultCard: buildResultCard(type, canonical)
  };

  if (!includeInternal) return response;

  return {
    ...response,
    scoreBreakdown: {
      questionnaire: questionnaireScores,
      prompt: promptScores,
      final: combinedScores
    },
    tieAxes: binary.tieAxes,
    tieResolution: binary.tieResolution,
    sourceTags: canonical.tags,
    inputSummary: {
      hasQuestionnaire: Boolean(questionnaireScores),
      evidenceMode: canonical.evidence_mode || null,
      evidenceNotice: canonical.evidence_notice || null
    },
    internalNotes: guarded.guardNotes
  };
}

export function parseTrack1Input(raw) {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        // Continue to object extraction below.
      }
    }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        // Fall through.
      }
    }
  }
  return {
    status: "invalid",
    reason: "JSON으로 파싱할 수 없습니다."
  };
}

export function validateCanonicalResult(input) {
  const parsed = parseTrack1Input(input);
  if (!parsed || typeof parsed !== "object") {
    return { status: "invalid", reason: "입력이 객체가 아닙니다." };
  }

  if (parsed.status === "insufficient_history") {
    return {
      status: "insufficient_history",
      reason: parsed.reason || "대화 이력이 부족합니다."
    };
  }

  if (parsed.status !== "success") {
    return {
      status: "invalid",
      reason: "status가 success 또는 insufficient_history가 아닙니다."
    };
  }

  const errors = [];
  if (parsed.profile && typeof parsed.profile === "object") {
    errors.push("profile 숫자 점수는 허용하지 않습니다. 외부 LLM은 signals만 반환해야 합니다.");
  }
  for (const axis of AXES) {
    if (typeof parsed.profile?.[axis] === "number") {
      errors.push(`profile.${axis} 숫자 점수는 백엔드에서만 계산합니다.`);
    }
    if (!SIGNALS.has(parsed.signals?.[axis])) {
      errors.push(`signals.${axis}는 low/medium/high 중 하나여야 합니다.`);
    }
    if (!CONFIDENCE.has(parsed.confidence?.[axis])) {
      errors.push(`confidence.${axis}는 low/medium/high 중 하나여야 합니다.`);
    }
    if (typeof parsed.notes?.[axis] !== "string" || parsed.notes[axis].trim().length === 0) {
      errors.push(`notes.${axis}가 비어 있습니다.`);
    }
  }

  if (!Array.isArray(parsed.tags)) {
    errors.push("tags는 배열이어야 합니다.");
  } else if (parsed.tags.length !== 3) {
    errors.push("tags는 핵심 키워드 3개여야 합니다.");
  }
  if (typeof parsed.verdict !== "string") errors.push("verdict는 문자열이어야 합니다.");

  if (errors.length > 0) {
    return {
      status: "invalid",
      reason: "표준 Track 1 스키마와 맞지 않습니다.",
      errors
    };
  }

  return {
    status: "success",
    evidence_mode: parsed.evidence_mode || null,
    evidence_notice: parsed.evidence_notice || null,
    signals: pickAxes(parsed.signals),
    confidence: pickAxes(parsed.confidence),
    notes: sanitizeNotes(pickAxes(parsed.notes)),
    tags: parsed.tags.slice(0, 3).map(String),
    verdict: stripPrivateLikeText(parsed.verdict)
  };
}

export function scoreQuestionnaire(input) {
  const answers = input.answers || input;
  const questions = Object.keys(answers).filter((key) => /^Q\d+$/.test(key));
  const usesSixteenQuestionVersion = questions.some((key) => Number(key.slice(1)) > 12);
  const mapping = usesSixteenQuestionVersion
    ? {
        A: ["Q1", "Q2", "Q3", "Q4"],
        B: ["Q5", "Q6", "Q7", "Q8"],
        C: ["Q9", "Q10", "Q11", "Q12"],
        D: ["Q13", "Q14", "Q15", "Q16"]
      }
    : {
        A: ["Q1", "Q2", "Q3"],
        B: ["Q4", "Q5", "Q6"],
        C: ["Q7", "Q8", "Q9"],
        D: ["Q10", "Q11", "Q12"]
      };

  const scores = {};
  for (const axis of AXES) {
    const axisQuestions = mapping[axis];
    const values = axisQuestions.map((key) => Number(answers[key]));
    if (values.some((value) => !Number.isInteger(value) || value < 1 || value > 5)) {
      throw new Error(`${axis} 축 객관식 답변이 없거나 1~5 범위를 벗어났습니다.`);
    }
    const min = axisQuestions.length;
    const maxDistance = axisQuestions.length * 4;
    const sum = values.reduce((total, value) => total + value, 0);
    scores[axis] = clamp(Math.round(((sum - min) / maxDistance) * 100), 0, 100);
  }
  return scores;
}

export function scorePromptResult(canonical) {
  const scores = {};
  for (const axis of AXES) {
    const signal = canonical.signals[axis];
    const confidence = canonical.confidence[axis];
    const note = canonical.notes[axis] || "";
    const cap = CONFIDENCE_CAP[confidence];
    const rawStrength = keywordStrength(note, KEYWORDS[axis]);
    let score = SIGNAL_BASE[signal] + Math.round(rawStrength * cap);
    score = applyBoundaryRules(score, signal, axis, canonical);
    scores[axis] = clamp(score, 0, 100);
  }
  return scores;
}

export function combineScores(questionnaireScores, promptScores) {
  const scores = {};
  for (const axis of AXES) {
    if (questionnaireScores) {
      scores[axis] = Math.round(questionnaireScores[axis] * 0.4 + promptScores[axis] * 0.6);
    } else {
      scores[axis] = promptScores[axis];
    }
  }
  return scores;
}

export function mapScoresToBinary(finalScores, options = {}) {
  const questionnaireScores = options?.questionnaireScores || null;
  const tieBreaks = normalizeTieBreaks(options?.tieBreaks || null);
  const binary = {};
  const tieAxes = [];
  const tieResolution = {};

  for (const axis of AXES) {
    const score = finalScores[axis];
    if (score >= BINARY_THRESHOLDS.high) {
      binary[axis] = "고";
      tieResolution[axis] = {
        source: "local_threshold",
        reason: `${score}점이 고 기준(${BINARY_THRESHOLDS.high}점 이상)을 충족했습니다.`
      };
    } else if (score <= BINARY_THRESHOLDS.low) {
      binary[axis] = "저";
      tieResolution[axis] = {
        source: "local_threshold",
        reason: `${score}점이 저 기준(${BINARY_THRESHOLDS.low}점 이하)에 해당합니다.`
      };
    } else {
      tieAxes.push(axis);
      if (tieBreaks?.[axis] === "고" || tieBreaks?.[axis] === "저") {
        binary[axis] = tieBreaks[axis];
        tieResolution[axis] = {
          source: "llm_judge",
          reason: "중간 범위 축이라 notes 기반 LLM Judge 판정을 우선 적용했습니다."
        };
      } else if (questionnaireScores) {
        binary[axis] = questionnaireScores[axis] >= 50 ? "고" : "저";
        tieResolution[axis] = {
          source: "questionnaire_fallback",
          reason: "LLM Judge 판정이 없거나 tie라 객관식 점수 방향을 보조 기준으로 적용했습니다."
        };
      } else {
        binary[axis] = score >= 50 ? "고" : "저";
        tieResolution[axis] = {
          source: "score_fallback",
          reason: "LLM Judge와 객관식 입력이 없어 50점을 기준으로 임시 판정했습니다."
        };
      }
    }
  }

  return {
    binaryProfile: binary,
    tieAxes,
    tieResolution
  };
}

export function resolveType(binaryProfile) {
  const key = AXES.map((axis) => (binaryProfile[axis] === "고" ? "H" : "L")).join("");
  const [typeId, typeName] = TYPE_MAP[key];
  return {
    id: typeId,
    name: typeName
  };
}

function applyTypeGuards(binaryResult, finalScores, canonical) {
  const binary = { ...binaryResult.binaryProfile };
  const guardNotes = [];
  const type = resolveType(binary);

  const noteB = canonical.notes.B;
  const noteC = canonical.notes.C;
  const hasIntimacy = containsAny(noteB, INTIMACY_TERMS);
  const hasActiveTrust = containsAny(noteC, ACTIVE_TRUST_TERMS);
  const hasDistrust = containsAny(noteC, DISTRUST_TERMS);
  const hasQualityControl = containsAny(noteC, QUALITY_CONTROL_TERMS);

  if (type.id === 16 && (!hasIntimacy || !hasActiveTrust || hasDistrust || hasQualityControl)) {
    binary.B = hasIntimacy ? binary.B : "저";
    binary.C = hasActiveTrust && !hasDistrust ? binary.C : "저";
    guardNotes.push("집착하는 애인형은 명확한 친밀/신뢰 근거가 부족해 보수적으로 조정했습니다.");
  }

  if (type.id === 10 && !hasDistrust) {
    binary.C = hasActiveTrust || hasQualityControl ? "고" : binary.C;
    guardNotes.push("프로 트집러형은 명확한 불신 근거가 부족해 C축을 보수적으로 조정했습니다.");
  }

  if (type.id === 12 && !hasActiveTrust) {
    if (finalScores.C < 65 || hasQualityControl) {
      binary.C = hasDistrust ? "저" : binary.C;
      guardNotes.push("선긋는 상사형은 명확한 수용/활용 근거가 약해 신뢰 축을 보수적으로 유지했습니다.");
    }
  }

  return {
    binaryProfile: binary,
    guardNotes
  };
}

function normalizeTieBreaks(tieBreaks) {
  if (!tieBreaks || typeof tieBreaks !== "object") return null;
  return Object.fromEntries(
    AXES.map((axis) => {
      const value = tieBreaks[axis];
      return [axis, value === "high" ? "고" : value === "low" ? "저" : value];
    })
  );
}

function buildAxisScores(finalScores) {
  return Object.fromEntries(
    AXES.map((axis) => [
      axis,
      {
        label: AXIS_LABELS[axis],
        score: finalScores[axis],
        level: uiLevel(finalScores[axis]),
        gauge: makeGauge(finalScores[axis])
      }
    ])
  );
}

function buildResultCard(type, canonical) {
  const copy = RESULT_COPY[type.id];
  return {
    title: type.name,
    description: copy.description,
    keywords: copy.keywords,
    reasonStory: copy.reason,
    evidenceNotice: evidenceNoticeKo(canonical.evidence_mode)
  };
}

function applyBoundaryRules(initialScore, signal, axis, canonical) {
  const [min, max] = SIGNAL_RANGE[signal];
  let score = clamp(initialScore, min, max);
  const note = canonical.notes[axis] || "";

  if (axis === "B") {
    const taskFocused = containsAny(note, TASK_FOCUSED_TERMS);
    const intimate = containsAny(note, INTIMACY_TERMS);
    if (taskFocused && !intimate) score = Math.min(score, 59);
    if ((canonical.evidence_mode === "minimal" || canonical.evidence_mode === "self_report") && !intimate) {
      score = Math.min(score, 55);
    }
  }

  if (axis === "C") {
    const distrust = containsAny(note, DISTRUST_TERMS);
    const activeTrust = containsAny(note, ACTIVE_TRUST_TERMS);
    const qualityControl = containsAny(note, QUALITY_CONTROL_TERMS);
    if (distrust && !activeTrust) score = Math.min(score, 44);
    if (activeTrust && qualityControl && !distrust) score = clamp(score, 48, 63);
    if (qualityControl && !distrust) score = Math.max(score, 45);
  }

  return score;
}

function keywordStrength(note, axisKeywords) {
  const high = countMatches(note, axisKeywords.high);
  const low = countMatches(note, axisKeywords.low);
  const total = high + low;
  if (total === 0) return 0;
  return clamp((high - low) / Math.max(total, 2), -1, 1);
}

function countMatches(text, terms) {
  const lower = String(text).toLowerCase();
  return terms.reduce((count, term) => count + (lower.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function containsAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function pickAxes(source) {
  return Object.fromEntries(AXES.map((axis) => [axis, source[axis]]));
}

function sanitizeNotes(notes) {
  return Object.fromEntries(
    AXES.map((axis) => [axis, stripPrivateLikeText(notes[axis])])
  );
}

function stripPrivateLikeText(text) {
  return String(text)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b\d{2,3}-\d{3,4}-\d{4}\b/g, "[phone]")
    .replace(/\b\d{6}-\d{7}\b/g, "[id]")
    .trim();
}

function makeGauge(score) {
  const filled = clamp(Math.round(score / 10), 0, 10);
  return "■".repeat(filled) + "░".repeat(10 - filled);
}

function uiLevel(score) {
  if (score <= 44) return "낮음";
  if (score <= 64) return "중간";
  return "높음";
}

function evidenceNoticeKo(evidenceMode) {
  const notices = {
    minimal: "대화 기록이 적어 추정에 가깝습니다.",
    memory_or_impression: "기억 기반 분석으로 실제와 다를 수 있습니다.",
    self_report: "입력된 자기 설명을 바탕으로 가볍게 추정했어요.",
    visible_history: "확인된 대화 기록 기반 결과입니다."
  };
  return notices[evidenceMode] || null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createResultId() {
  return `res_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}
