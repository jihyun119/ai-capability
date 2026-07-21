export const TRACK3_VERSION = "track3-step1-demo-v1";
export const TRACK3_MAX_TURNS = 5;

export const TRACK3_SCENARIOS = [
  {
    scenario_id: "pm_001",
    title: "분기 핵심 기능 우선순위 결정",
    role: "키키오 선물하기 프로덕트 팀의 PM",
    canonical_terms: [
      { value: "키키오 선물하기", aliases: ["카카오 선물하기"] }
    ],
    situation: "다음 분기 3주 동안 진행할 핵심 기능 하나를 선정해야 한다. 영업팀, 디자인팀, 데이터팀이 각각 다른 기능을 1순위로 제안했고, 리소스와 기간 제약상 하나만 선택 가능하다.",
    mission: "5턴 안에 AI와 함께 세 후보를 비교하고, 최종 의사결정 근거와 회의 공유용 PRD 초안을 만든다.",
    artifact_sections: ["후보 비교표", "선택안 & 선정 근거", "PRD 초안", "최종 제출물"],
    final_artifact_section: "최종 제출물",
    available_info: [
      "영업팀 제안: 쿠폰함 기능",
      "디자인팀 제안: 위시리스트 공유 기능",
      "데이터팀 제안: 구매 후 추천 기능",
      "가용 리소스: 개발자 2명, 디자이너 1명",
      "가용 기간: 3주"
    ],
    constraints: [
      "세 후보 중 하나만 선택해야 한다.",
      "리소스와 기간상 동시 진행은 불가하다.",
      "모든 판단을 AI에게 맡기지 않고 최종 의사결정은 사용자가 내려야 한다.",
      "AI에게는 비교 프레임워크, 후보별 장단점, 리스크 정리를 요청하는 것이 적절하다.",
      "최종 결과물은 다음 회의에서 바로 공유 가능한 PRD 형태여야 한다."
    ],
    expected_output: {
      format: "기능 선정 근거가 포함된 PRD 초안",
      must_include: [
        "비교 기준",
        "기능 선정 결과",
        "선정 근거",
        "목표",
        "성공지표",
        "범위",
        "제외범위",
        "일정"
      ],
      quality_bar: "기능 하나가 명확히 선정되어 있고, 다음 회의에서 추가 설명 없이 공유 가능한 PRD 초안이어야 한다."
    },
    evaluation_context: {
      important_context: [
        "세 팀이 서로 다른 기능을 1순위로 제안했다.",
        "개발자 2명, 디자이너 1명, 3주라는 제약이 있다.",
        "세 후보 중 하나만 선택해야 한다.",
        "AI가 최종 결정을 대신하는 것이 아니라, 사용자가 판단 근거를 세우는 과정이 중요하다."
      ],
      good_final_output: [
        "세 후보가 임팩트, 리소스 적합성, 리스크 등 비교 가능한 기준으로 정리되어 있다.",
        "비교 결과를 바탕으로 기능 하나가 명확히 선정되어 있다.",
        "선정 근거가 논리적으로 설명되어 있다.",
        "PRD 핵심 항목인 목표, 성공지표, 범위, 제외범위, 일정이 포함되어 있다.",
        "회의에서 바로 공유 가능한 구조다."
      ],
      bad_final_output: [
        "AI에게 최종 선택을 전부 위임한다.",
        "세 후보를 비교하지 않고 특정 기능만 바로 선택한다.",
        "리소스와 3주 기간 제약을 무시한다.",
        "PRD 항목이 빠져 단순 추천 메모에 그친다."
      ]
    }
  },
  {
    scenario_id: "marketing_001",
    title: "신제품 재구매율 개선 캠페인",
    role: "이모레퍼시픽 스킨케어팀의 마케팅 담당자",
    canonical_terms: [
      { value: "이모레퍼시픽", aliases: ["이모레 퍼시픽", "아모레퍼시픽"] }
    ],
    situation: "신제품 출시 2개월 후 재구매율이 업계 평균보다 낮다. 지난 1주 업계 뉴스를 근거로 원인을 진단하고, 한정된 예산과 채널 안에서 다음 달 바로 집행 가능한 캠페인을 기획해야 한다.",
    mission: "5턴 안에 AI와 함께 재구매율 저하 원인 가설을 좁히고, 다음 달 집행 가능한 캠페인 기획서를 만든다.",
    artifact_sections: ["원인 가설 & 뉴스 근거", "타깃 & 핵심 메시지", "채널별 실행안 & 예산", "성과 지표 & 기대효과", "최종 제출물"],
    final_artifact_section: "최종 제출물",
    available_info: [
      "신제품 출시 2개월",
      "재구매율 8%로 업계 평균보다 낮음",
      "이번 달 마케팅 예산 300만원",
      "운영 채널: Instagram, 카카오톡 채널",
      "뉴스 1: CRM·리텐션 마케팅 투자 1년새 40% 증가",
      "뉴스 2: 효과 체감까지 평균 6주, 사용법·효능 교육 콘텐츠가 초기 이탈 방지 관건",
      "뉴스 3: 구독형 모델로 재구매 고객 선점 경쟁 본격화"
    ],
    constraints: [
      "예산 300만원 안에서 설계해야 한다.",
      "Instagram과 카카오톡 채널만 사용할 수 있다.",
      "원인 가설은 제공된 뉴스 중 관련 있는 정보를 활용해 뒷받침해야 한다.",
      "가설을 좁히는 최종 판단은 사용자가 내려야 한다.",
      "신규 채널 추가, TV 광고, 오프라인 매장 신설처럼 주어진 자원을 벗어나는 해결책은 인정하지 않는다.",
      "최종 결과물은 다음 달 바로 집행 가능한 형태여야 한다."
    ],
    expected_output: {
      format: "재구매율 저하 원인 분석 및 캠페인 기획서",
      must_include: [
        "원인 가설",
        "뉴스 근거",
        "가설 검증 방법",
        "타깃",
        "메시지",
        "채널별 실행안",
        "예산 배분",
        "기대효과"
      ],
      quality_bar: "뉴스 근거와 예산/채널 제약을 반영해 다음 달 바로 실행 가능한 캠페인 기획서여야 한다."
    },
    evaluation_context: {
      important_context: [
        "재구매율 8%가 업계 평균보다 낮다.",
        "예산은 300만원이고 채널은 Instagram과 카카오톡뿐이다.",
        "제공된 뉴스 3건을 원인 가설의 근거로 활용해야 한다.",
        "AI가 가설을 대신 결정하기보다 사용자가 가설을 선택하거나 배제하는 개입이 중요하다."
      ],
      good_final_output: [
        "재구매율 저하 원인이 가설 형태로 정리되어 있다.",
        "최소 하나 이상의 가설이 제공된 뉴스와 연결되어 있다.",
        "가설의 데이터/뉴스 검증 가능성이 구분되어 있다.",
        "타깃, 메시지, 채널별 실행안이 구체적이다.",
        "예산 300만원이 채널별 또는 액션별로 배분되어 있다.",
        "다음 달 바로 집행 가능한 일정과 실행 단위가 있다."
      ],
      bad_final_output: [
        "뉴스를 전혀 활용하지 않는다.",
        "예산이나 채널 제약을 무시한다.",
        "TV 광고, 신규 채널 개설 등 실행 불가능한 해결책을 제안한다.",
        "원인 진단 없이 캠페인 아이디어만 나열한다."
      ]
    }
  },
  {
    scenario_id: "da_001",
    title: "사업 성과 변화 분석 프로젝트",
    role: "마켓쿨리의 데이터 분석 담당자",
    canonical_terms: [
      { value: "마켓쿨리", aliases: ["마켓컬리"] }
    ],
    situation: "최근 신규 고객은 증가했지만 사업 성과가 기대만큼 개선되지 않고 있다. 제공된 지표와 데이터 자원을 바탕으로 문제를 정의하고, 원인을 파악하기 위한 분석 프로젝트 계획을 수립해야 한다.",
    mission: "5턴 안에 AI와 함께 핵심 문제를 정의하고, 경영진 보고용 분석 프로젝트 계획서를 만든다.",
    artifact_sections: ["핵심 문제 & 지표 해석", "분석 가설 & 우선순위", "데이터 & 검증 계획", "경영진 제안 & 다음 액션", "최종 제출물"],
    final_artifact_section: "최종 제출물",
    available_info: [
      "신규 가입자 수: 20,000명 → 27,000명",
      "첫 구매 전환율: 18% → 19%",
      "30일 내 재구매율: 28% → 17%",
      "평균 주문 금액: 48,000원 → 39,000원",
      "월 매출: 11.2억 원 → 10.9억 원",
      "현재 이용 가능한 데이터: 가입자 정보, 구매 로그, 고객 문의(CS) 로그",
      "가입자 정보 컬럼: user_id, signup_date, birth_year, gender, region, signup_channel, last_login_at, user_status",
      "구매 로그 컬럼: order_id, user_id, product_id, product_category, quantity, discount_amount, payment_amount, purchased_at, order_status",
      "고객 문의 로그 컬럼: inquiry_id, user_id, order_id, inquiry_type, inquiry_content, inquiry_created_at, response_created_at, resolution_status, satisfaction_score",
      "그 외 데이터는 별도 요청이 필요함"
    ],
    constraints: [
      "현재 제공된 정보만으로는 원인을 단정할 수 없다.",
      "사용자는 AI와 최대 5턴 이내로 대화 가능하다.",
      "최종 제출물은 핵심 문제, 분석 계획, 경영진에게 제안할 다음 액션을 포함해야 한다.",
      "원인 추측보다 검증 가능한 분석 계획을 제시해야 한다."
    ],
    expected_output: {
      format: "경영진 보고용 분석 프로젝트 계획서",
      must_include: [
        "핵심 문제 정의",
        "지표 해석",
        "분석 우선순위",
        "활용 가능한 데이터",
        "추가 필요 데이터",
        "분석 단계",
        "검증 방법",
        "다음 액션"
      ],
      quality_bar: "원인을 단정하지 않고, 제공 지표의 관계를 해석해 의사결정으로 이어지는 분석 계획이어야 한다."
    },
    evaluation_context: {
      important_context: [
        "신규 가입자는 증가했지만 매출은 소폭 감소했다.",
        "첫 구매 전환율은 소폭 개선됐지만 30일 내 재구매율과 평균 주문 금액이 크게 하락했다.",
        "현재 데이터는 가입자 정보, 구매 로그, CS 로그뿐이다.",
        "현재 정보만으로 원인을 단정하면 안 된다.",
        "경영진 보고용이므로 분석 결과가 의사결정 또는 다음 액션으로 연결되어야 한다."
      ],
      good_final_output: [
        "재구매율 하락만 반복하지 않고 지표 간 관계를 바탕으로 핵심 문제를 정의한다.",
        "제공된 지표를 해석해 분석 우선순위를 설정한다.",
        "현재 데이터로 가능한 분석과 추가 확보가 필요한 데이터를 구분한다.",
        "분석 단계가 논리적 순서로 구성되어 있다.",
        "각 원인 가설을 어떤 데이터와 방법으로 검증할지 연결한다.",
        "경영진에게 제안할 다음 액션이 포함되어 있다."
      ],
      bad_final_output: [
        "재구매율이 감소했다는 현상만 반복한다.",
        "제공된 정보만으로 원인을 단정한다.",
        "활용 가능한 데이터와 추가 필요 데이터를 구분하지 않는다.",
        "분석 계획이 실제 의사결정이나 액션으로 이어지지 않는다."
      ]
    }
  }
];

export function getScenario(scenarioId = "pm_001") {
  return TRACK3_SCENARIOS.find((scenario) => scenario.scenario_id === scenarioId)
    || TRACK3_SCENARIOS[0];
}

export function listScenarios() {
  return TRACK3_SCENARIOS.map((scenario) => ({
    scenario_id: scenario.scenario_id,
    title: scenario.title,
    role: scenario.role,
    mission: scenario.mission,
    artifact_sections: scenario.artifact_sections,
    final_artifact_section: scenario.final_artifact_section
  }));
}
