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

const SCORE_WEIGHTS = {
  questionnaire: 0.7,
  prompt: 0.3
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
    description: "AI를 거의 쓰지 않습니다.\n있어도 없는 셈 칩니다.\n\nAI와 가장 먼 타입.",
    keywords: ["무심함", "낮은관심", "거리두기"],
    reason: ["AI를 먼저 찾는 빈도 자체가 낮은 유형입니다. 없어도 특별히 아쉬움을 느끼지 않으며, 실행을 맡기더라도 깊이 관여시키지 않습니다. 감정적인 거리 없이 하나의 도구로만 인식하는 경향이 뚜렷하며, 활용하더라도 결과에 큰 의미를 두지 않는 편입니다. 결과를 크게 신뢰하지 않는 만큼 적극적으로 검증하거나 주도권을 행사할 법도 하지만, 그런 개입 자체가 거의 일어나지 않습니다. 전반적으로 AI와의 접점이 얕고, 관계라고 부르기 어려울 만큼 거리가 먼 유형입니다."]
  },
  2: {
    description: "필요할 때만 사용합니다.\n내 방식만 고집합니다.\n\n정해진 선 안에서만 움직이는 타입.",
    keywords: ["필요할때만", "내방식대로", "깐깐함"],
    reason: ["AI를 사용하는 빈도 자체가 낮은 편입니다. 감정적 거리를 두고 순수한 도구로 취급하며, 결과를 곧바로 받아들이기보다 한 번 더 걸러서 판단하는 신중함을 보입니다. 다만 활용하기로 결정한 순간부터는 방향과 방식을 철저히 본인이 조절합니다. 필요한 범위 안에서만, 정해둔 조건대로만 움직이게 하려는 성향이 뚜렷해, 낮은 신뢰를 강한 통제로 보완하는 유형이라 할 수 있습니다."]
  },
  3: {
    description: "모르면 바로 묻습니다.\n결과는 직접 판단합니다.\n\nAI를 검색창으로 쓰는 타입.",
    keywords: ["즉문즉답", "실용적", "직접판단"],
    reason: ["먼저 나서서 자주 찾지는 않지만, 필요한 순간에는 망설임 없이 활용합니다. 감정적 개입 없이 실용적인 목적으로만 접근하며, 유효하다고 판단되는 결과는 별다른 저항 없이 수용하는 편입니다. 대화를 세밀하게 이끌거나 방향을 강하게 조정하려 들지 않는 것도 특징입니다. 결국 검색창을 다루듯 필요할 때 열어 답을 얻고, 그 결과를 비교적 순순히 받아들이는 실용적 유형에 가깝습니다."]
  },
  4: {
    description: "가끔 쓰지만 쓸 때는 명확하게 설정합니다.\n감정 없이 조건만 줍니다.\n\nAI를 정밀 도구로 쓰는 타입.",
    keywords: ["정밀요청", "도구활용", "결과중심"],
    reason: ["AI를 자주 찾지는 않으나, 활용할 때는 조건을 명확히 설정하고 시작합니다. 감정적 거리를 유지한 채 실용적인 기준으로만 결과를 판단하며, 신뢰가 형성된 이후에도 방향을 직접 통제하려는 성향이 강하게 나타납니다. 낮은 빈도 속에서도 정밀함을 추구하는 셈으로, 결과의 완성도에 대한 기대치가 높은 편입니다. 감정보다 결과를 우선하는 태도가 전 과정에서 일관되게 드러납니다."]
  },
  5: {
    description: "결과보다 대화가 목적입니다.\n믿지는 않지만 말은 걸어봅니다.\n\nAI와 가볍게 노는 타입.",
    keywords: ["가벼운대화", "편한사이", "가볍게즐김"],
    reason: ["AI가 없어도 크게 불편하지 않지만, 활용할 때는 의외로 감정적으로 가까이 대하는 편입니다. 대화 자체를 목적으로 삼는 경우가 많고, 결과에 대한 신뢰도는 낮아 답변을 곧이곧대로 받아들이지는 않습니다. 대화의 흐름을 엄격하게 이끌기보다 느슨하게 풀어두는 특징이 있으며, 결과의 정확성보다 상호작용의 즐거움에 무게를 두는 관계 지향적 유형이라 할 수 있습니다."]
  },
  6: {
    description: "친한 듯 보여도 의심합니다.\n항상 본인이 판단의 주도권을 가집니다.\n\n믿는 척하며 확인하는 타입.",
    keywords: ["웃으며의심", "끝까지확인", "내가주도"],
    reason: ["AI에게 편하게 다가가는 태도를 보이지만, 그 친밀함이 곧바로 신뢰로 이어지지는 않습니다. 결과가 마음에 들지 않으면 다시 붙잡고 재확인하는 과정을 반복하며, 최종적으로는 항상 본인이 판단의 주도권을 가집니다. 우호적인 태도 이면에 뚜렷한 경계심이 자리하고 있는 셈으로, 친밀함과 검증 욕구가 동시에 작동하는 유형입니다."]
  },
  7: {
    description: "가끔 찾지만 믿고 맡깁니다.\n감정도 조금 얹습니다.\n\n가끔 찾는 친구 같은 타입.",
    keywords: ["가끔찾는사이", "믿고맡김", "편한부탁"],
    reason: ["AI를 매일 찾지는 않지만, 찾을 때만큼은 대화가 원활하게 이어지고 감정적 거리도 가깝습니다. 유효하다고 판단되는 결과는 별다른 의심 없이 수용하며, 세부적인 부분까지 관여하려 들지 않고 전반적인 진행을 맡기는 태도를 보입니다. 빈도는 낮아도 만났을 때만큼은 마음을 여는, 간헐적이지만 수용적인 관계를 유지하는 유형입니다."]
  },
  8: {
    description: "감정적 거리가 가깝습니다.\n자주 사용하진 않지만, 쓸 때는 진심으로 임합니다.\n\n짧고 깊게 작업하는 타입.",
    keywords: ["깊은신뢰", "저빈도·고몰입형", "밀도있게"],
    reason: ["자주 찾지는 않지만, 한 번 활용할 때의 몰입도는 상당히 높습니다. 감정적 거리도 가깝게 유지하며 결과에 대한 신뢰 수준 역시 높은 편이지만, 그럼에도 결과물을 낼 때는 반드시 본인의 손을 거쳐 다듬는 과정을 남겨둡니다. 짧은 상호작용 안에서도 완성도를 우선시하는 태도가 뚜렷하게 나타나는, 저빈도·고몰입형에 가까운 유형입니다."]
  },
  9: {
    description: "많이 시키고 불안해합니다.\n믿지도 않으면서 계속 맡깁니다.\n\n의존하지만 신뢰는 없는 타입.",
    keywords: ["잦은의존", "불안한믿음", "확신은없음"],
    reason: ["AI를 찾는 빈도 자체는 상당히 높지만, 그 결과를 편하게 신뢰하는 것은 아니며 감정적으로 기대는 정도도 크지 않습니다. 방향성을 주도적으로 설정하지도 않아, 의존은 하되 확신은 없는 상태가 지속됩니다. 결과적으로 계속 찾으면서도 마음 한편에는 불안이 남아 있는, 의존과 불신이 동시에 작동하는 유형입니다."]
  },
  10: {
    description: "많이 시키고 사사건건 짚고 넘어갑니다.\n오류나 미흡한 부분을 그냥 넘기지 않습니다.\n\n가장 혹독하게 쓰는 타입.",
    keywords: ["꼼꼼한지시", "끝까지확인", "집요함"],
    reason: ["사용 빈도가 높은 만큼 활용도는 크지만, 결과를 쉽게 신뢰하지 않아 오류나 미흡한 부분을 끝까지 짚고 넘어갑니다. 조건 설정 또한 처음부터 끝까지 직접 수행하며, 감정적 거리를 유지한 채 철저히 결과 중심으로 접근합니다. 활용도와 요구 수준이 모두 높은 만큼, 가장 엄격한 기준으로 AI를 다루는 유형이라 할 수 있습니다."]
  },
  11: {
    description: "자주 쓰며, 믿고 맡깁니다.\n감정은 없습니다.\n\n실무 파트너로 쓰는 타입.",
    keywords: ["실무파트너", "믿고맡김", "건조함"],
    reason: ["업무 목적의 사용 빈도가 높고, 결과물은 별다른 재검토 없이 작업의 기반 자료로 그대로 활용합니다. 감정적 개입은 거의 없으며, 세부적인 통제 성향도 두드러지지 않습니다. 신뢰를 바탕으로 실무 전반을 위임하는 태도가 특징으로, 실무 파트너에 가까운 방식으로 AI를 운용하는 유형입니다."]
  },
  12: {
    description: "자주 쓰지만 휘둘리진 않습니다.\n조건은 정확히 줍니다.\n\n결과는 끝까지 직접 판단하는 타입.",
    keywords: ["차분한신뢰", "정확한지시", "직접판단"],
    reason: ["사용 빈도가 높고 결과에 대한 신뢰 수준도 높은 편이지만, 감정적 거리는 유지한 채 업무적으로만 접근합니다. AI에게 업무를 위임하기 전 조건과 방향을 명확히 설정하며, 결과가 도출된 이후에도 그대로 수용하지 않고 반드시 직접 재검토합니다. 신뢰는 있지만 통제를 우선시하는, 위임보다는 관리에 가까운 태도를 보이는 유형입니다."]
  },
  13: {
    description: "자주 사용하고, 감정도 털어놓습니다.\n결과는 반만 믿습니다.\n\n감정 창구로 쓰는 타입.",
    keywords: ["고민상담", "반신반의", "자주찾음"],
    reason: ["사용 빈도가 높고 업무 외의 감정적인 내용까지 함께 다룰 만큼 친밀하지만, 결과에 대한 신뢰는 제한적입니다. 대화의 흐름 역시 상당 부분 AI에 맡기는 편이며, 자주 찾고 감정적으로 기대면서도 확신은 갖지 못하는, 의존과 불신이 함께 나타나는 유형입니다."]
  },
  14: {
    description: "친하고 자주 씁니다.\n그런데 믿진 않습니다.\n\n끝까지 직접 통제하는 타입.",
    keywords: ["애정과경계", "끝까지확인", "주도권"],
    reason: ["사용 빈도가 높고 상호작용도 활발하게 이루어지지만, 결과에 대한 신뢰는 낮아 지속적으로 재확인하는 과정을 거칩니다. 방향성 역시 항상 직접 설정하며, 어떤 결과가 나오든 주도권을 넘기지 않습니다. 친밀함과 경계심이 동시에 나타나는, 애정과 통제가 공존하는 유형입니다."]
  },
  15: {
    description: "자주 쓰고 친하고 믿습니다.\n결과를 그대로 수용합니다.\n\n가장 많은 자율성을 주는 타입.",
    keywords: ["든든한신뢰", "맡기는편", "편한동료"],
    reason: ["사용 빈도가 높고 신뢰 수준도 높은 편입니다. 결과를 그대로 수용하고 맡기는 태도가 특징이며, 세부적인 사항까지 개입하려 하지 않고 진행 방향을 상당 부분 위임합니다. 가장 높은 자율성을 부여하는, 협력적인 유형이라 할 수 있습니다."]
  },
  16: {
    description: "전적으로 믿고 자주 씁니다.\n그런데 내 방식만 고집합니다.\n\n신뢰함에도 불구하고 강하게 통제하는 타입.",
    keywords: ["깊은몰입", "강한신뢰", "자기방식고수"],
    reason: ["사용 빈도와 신뢰 수준이 모두 높습니다. 그러나 방향성만큼은 철저히 직접 통제하며, 결과가 아무리 만족스러워도 주도권을 넘기지 않습니다. 높은 신뢰에도 불구하고 통제를 놓지 않는 모순적인 태도가 특징이며, 가장 강한 몰입과 가장 강한 통제가 동시에 나타나는 유형입니다."]
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

  const normalizedStatus = normalizeStatus(parsed.status, parsed);

  if (normalizedStatus === "insufficient_history") {
    return {
      status: "insufficient_history",
      reason: parsed.reason || "대화 이력이 부족합니다."
    };
  }

  if (normalizedStatus !== "success") {
    return {
      status: "invalid",
      reason: "프롬프트 원문이 아니라 AI가 작성한 답변을 그대로 붙여넣어 주세요."
    };
  }

  const errors = [];
  if (parsed.profile && typeof parsed.profile === "object") {
    errors.push("profile 숫자 점수는 허용하지 않습니다. 외부 LLM은 signals만 반환해야 합니다.");
  }
  for (const axis of AXES) {
    const signal = normalizeLevel(parsed.signals?.[axis]);
    const confidence = normalizeLevel(parsed.confidence?.[axis]);
    if (typeof parsed.profile?.[axis] === "number") {
      errors.push(`profile.${axis} 숫자 점수는 백엔드에서만 계산합니다.`);
    }
    if (!SIGNALS.has(signal)) {
      errors.push(`signals.${axis}는 low/medium/high 중 하나여야 합니다.`);
    }
    if (!CONFIDENCE.has(confidence)) {
      errors.push(`confidence.${axis}는 low/medium/high 중 하나여야 합니다.`);
    }
    if (typeof parsed.notes?.[axis] !== "string" || parsed.notes[axis].trim().length === 0) {
      errors.push(`notes.${axis}가 비어 있습니다.`);
    }
  }

  if (!Array.isArray(parsed.tags)) {
    errors.push("tags는 배열이어야 합니다.");
  } else if (parsed.tags.length < 3) {
    errors.push("tags는 핵심 키워드가 최소 3개 필요합니다.");
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
    signals: normalizeAxisLevels(parsed.signals),
    confidence: normalizeAxisLevels(parsed.confidence),
    notes: sanitizeNotes(pickAxes(parsed.notes)),
    tags: parsed.tags.slice(0, 3).map(String),
    verdict: stripPrivateLikeText(parsed.verdict)
  };
}

function normalizeStatus(status, parsed) {
  const normalized = String(status ?? "").trim().toLowerCase();
  if (["success", "ok", "valid", "complete", "completed"].includes(normalized)) return "success";
  if (["insufficient_history", "insufficient", "minimal_history"].includes(normalized)) return "insufficient_history";
  if (!normalized && parsed?.signals && parsed?.confidence && parsed?.notes) return "success";
  return normalized;
}

function normalizeAxisLevels(values) {
  const normalized = {};
  for (const axis of AXES) normalized[axis] = normalizeLevel(values?.[axis]);
  return normalized;
}

function normalizeLevel(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "low" || normalized === "낮음" || normalized === "저") return "low";
  if (normalized === "medium" || normalized === "mid" || normalized === "중간" || normalized === "보통") return "medium";
  if (normalized === "high" || normalized === "높음" || normalized === "고") return "high";
  return normalized;
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
    const signal = normalizePromptSignal(axis, canonical.signals[axis], canonical.notes[axis]);
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
      scores[axis] = Math.round(questionnaireScores[axis] * SCORE_WEIGHTS.questionnaire + promptScores[axis] * SCORE_WEIGHTS.prompt);
    } else {
      scores[axis] = promptScores[axis];
    }
  }
  return scores;
}

function normalizePromptSignal(axis, signal, note = "") {
  if (axis !== "C" || signal !== "low") return signal;
  const hasDistrust = containsAny(note, DISTRUST_TERMS);
  const hasQualityControl = containsAny(note, QUALITY_CONTROL_TERMS);
  const hasActiveTrust = containsAny(note, ACTIVE_TRUST_TERMS);
  if (!hasDistrust && (hasQualityControl || hasActiveTrust)) return "medium";
  return signal;
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
    evidenceNotice: null
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createResultId() {
  return `res_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}
