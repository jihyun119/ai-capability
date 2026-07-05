export const TRACK3_VERSION = "track3-step1-demo-v1";
export const TRACK3_MAX_TURNS = 5;

export const TRACK3_SCENARIOS = [
  {
    scenario_id: "t3_growth_001",
    title: "예약 전환율 개선 분석안 만들기",
    role: "헬스케어 앱의 주니어 PM",
    situation: "회원가입 후 예약 결제까지 이어지는 전환율이 5%로 낮다.",
    mission: "5턴 안에 AI와 함께 팀 회의에서 공유할 수 있는 분석안을 만든다.",
    available_info: [
      "월 방문자 30,000명",
      "회원가입 전환율 18%",
      "예약 클릭률 9%",
      "결제 완료율 5%",
      "최근 결제 단계에서 CS 문의가 늘고 있다."
    ],
    constraints: [
      "추가 개발 리소스는 제한적이다.",
      "2주 안에 실험 가능한 액션이어야 한다.",
      "의료 정보 규제상 과장된 혜택 표현은 사용할 수 없다."
    ],
    expected_output: {
      format: "분석안 또는 표",
      must_include: [
        "원인 가설",
        "확인 KPI",
        "필요한 데이터",
        "우선순위",
        "다음 액션"
      ],
      quality_bar: "팀 회의에서 추가 가공 없이 공유할 수 있어야 한다."
    },
    evaluation_context: {
      important_context: [
        "전환율 5%라는 문제를 중심으로 접근해야 한다.",
        "회원가입 이후 예약 결제까지의 퍼널을 나눠야 한다.",
        "2주 안에 실행 가능한 액션이어야 한다.",
        "개발 리소스 제한을 고려해야 한다."
      ],
      good_final_output: [
        "퍼널 단계별 원인 가설이 있다.",
        "각 가설을 확인할 KPI가 있다.",
        "필요한 데이터와 확인 방법이 구체적이다.",
        "우선순위와 다음 액션이 실행 가능하게 정리되어 있다.",
        "주어진 제약 안에서 실행 가능한 개선안이다."
      ],
      bad_final_output: [
        "일반적인 마케팅 개선안에 그친다.",
        "주어진 지표를 활용하지 않는다.",
        "실행 주체나 다음 액션이 없다.",
        "2주 안에 실행하기 어려운 대규모 개발 과제를 제안한다."
      ]
    }
  }
];

export function getScenario(scenarioId = "t3_growth_001") {
  return TRACK3_SCENARIOS.find((scenario) => scenario.scenario_id === scenarioId)
    || TRACK3_SCENARIOS[0];
}

export function listScenarios() {
  return TRACK3_SCENARIOS.map((scenario) => ({
    scenario_id: scenario.scenario_id,
    title: scenario.title,
    role: scenario.role,
    mission: scenario.mission
  }));
}
