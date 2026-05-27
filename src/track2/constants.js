// ── 축 정의 ──────────────────────────────────────────────────────────────────

export const AXIS_NAMES = [
  "작업 명확성", "배경·맥락", "역할 지정", "출력 형식", "반복 개선", "비판적 검토"
];

export const AXIS_KEYS = [
  "task_clarity", "context", "role",
  "output_format", "iteration", "critical_review"
];

export const AXIS_MAX = {
  task_clarity: 20,
  context:      20,
  role:         15,
  output_format: 15,
  iteration:    15,
  critical_review: 15
};

// ── 빈도 부사 ─────────────────────────────────────────────────────────────────

// 순서: 강함 → 약함 (index가 낮을수록 강한 부사)
export const FREQ_WORDS = [
  "always", "consistently", "frequently",
  "sometimes", "occasionally", "rarely", "never"
];

export const PROXIMITY = 60; // 축 키워드 앞뒤 탐색 범위 (문자 수)

// ── 축별 키워드 ───────────────────────────────────────────────────────────────

export const AXIS_KEYWORDS = {
  task_clarity: [
    "defin", "goal", "constraint", "scope", "specif", "open-end",
    "requirement", "condition", "parameter", "instruction", "task",
    "what should", "what not", "narrow", "explicit"
  ],
  context: [
    "background", "context", "purpose", "audience", "upfront", "situation",
    "workflow", "surrounding", "intent", "explain", "before asking",
    "provide", "prior to", "setup"
  ],
  role: [
    "role", "persona", "expert", "assign", "perspective", "title",
    "act as", "identity", "framed", "position", "specialist"
  ],
  output_format: [
    "format", "length", "structure", "tone", "style", "layout",
    "wording", "ordering", "label", "citation", "visual", "table",
    "paragraph", "translation", "present", "deliver"
  ],
  iteration: [
    "follow-up", "follow up", "revision", "unsatisfi", "fell short",
    "refine", "rework", "adjust", "incorrect", "missing", "misplaced",
    "repetitive", "overly", "not satisfied", "revise"
  ],
  critical_review: [
    "challeng", "push back", "pushback", "question", "verify",
    "incorrect", "unclear", "disagree", "dispute", "inaccurat",
    "inconsistent", "disconnected", "misalign", "without question",
    "accept", "rarely accept"
  ]
};

// ── 빈도 부사 → 점수 매핑 ────────────────────────────────────────────────────

export const SCORE_MAP = {
  task_clarity: {
    always: 20, consistently: 20,
    frequently: 16,
    sometimes: 10, occasionally: 10,
    rarely: 4,
    never: 0, NONE: 0
  },
  context: {
    always: 20, consistently: 20,
    frequently: 16,
    sometimes: 10, occasionally: 10,
    rarely: 4,
    never: 0, NONE: 0
  },
  role: {
    always: 15, consistently: 15, frequently: 15,
    sometimes: 10, occasionally: 10,
    rarely: 5,
    never: 0, NONE: 0
  },
  output_format: {
    always: 15, consistently: 15, frequently: 15,
    sometimes: 10, occasionally: 10,
    rarely: 5, never: 5,
    NONE: 0
  },
  iteration: {
    always: 15, consistently: 15,
    frequently: 10, sometimes: 10,
    occasionally: 5, rarely: 5,
    never: 0, NONE: 0
  },
  critical_review: {
    always: 15, consistently: 15,
    frequently: 10, sometimes: 10,
    occasionally: 5, rarely: 5,
    never: 0, NONE: 0
  }
};

// ── 객관식 점수표 ─────────────────────────────────────────────────────────────
// 배열 순서: [task_clarity, context, role, output_format, iteration, critical_review]

export const MC_SCORES = {
  Q1: {
    A: [0,  0,  0,  0,  5,  0],
    B: [0,  12, 0,  0,  12, 0],
    C: [0,  0,  0,  0,  15, 15],
    D: [20, 0,  0,  15, 0,  15],
    E: [0,  0,  0,  0,  0,  9]
  },
  Q2: {
    A: [5,  0,  0,  0,  0,  0],
    B: [12, 0,  0,  9,  0,  0],
    C: [0,  0,  0,  12, 15, 0],
    D: [20, 0,  15, 15, 0,  0],
    E: [3,  0,  0,  0,  0,  0]
  },
  Q3: {
    A: [5,  0,  0,  0,  0,  0],
    B: [12, 20, 0,  0,  0,  0],
    C: [12, 0,  0,  0,  15, 0],
    D: [0,  20, 15, 0,  15, 0],
    E: [0,  0,  0,  0,  0,  12]
  },
  Q4: {
    A: [0,  0,  0,  0,  0,  0],
    B: [0,  3,  0,  0,  0,  0],
    C: [12, 12, 0,  0,  0,  0],
    D: [15, 20, 15, 0,  0,  15],
    E: [0,  0,  0,  0,  0,  12]
  }
};

// 객관식 축별 최대점수 (정규화 기준)
export const MC_AXIS_MAX = {
  task_clarity: 67,
  context:      52,
  role:         45,
  output_format: 30,
  iteration:    45,
  critical_review: 45
};

// ── 기본 점수 ─────────────────────────────────────────────────────────────────
// 객관식 구조상 동시에 모든 축 만점 불가 → 실질 만점 90.2점
// 기본점수 9.8을 더해 100점 만점으로 보정

export const BASE_SCORE = 9.8;

// ── 등급 기준 ─────────────────────────────────────────────────────────────────

export const GRADE_SCALE = [
  { min: 85, max: 101, grade: "AI 파트너형" },
  { min: 70, max: 85,  grade: "AI 활용형"   },
  { min: 55, max: 70,  grade: "AI 탐색형"   },
  { min: 40, max: 55,  grade: "AI 입문형"   },
  { min: 0,  max: 40,  grade: "AI 초보형"   }
];
