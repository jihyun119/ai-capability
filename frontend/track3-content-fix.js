(function () {
  const t3ScenarioData = [
    {
      key: "pm",
      tags: ["의사결정", "PRD", "우선 순위"],
      title: "PM",
      summary: "3주 안에 만들 핵심 기능을 결정하고, 다음 회의에 바로 쓸 수 있는 PRD 초안을 만듭니다.",
      situation: [
        "당신은 키키오 선물하기 서비스 개선 팀의 PM입니다. 다음 분기 3주 동안 만들 핵심 기능 하나를 정해야 합니다.",
        "개발자는 '쿠폰함 알림 기능'을, 디자이너는 '위시리스트 공유 기능'을, 데이터 분석가는 '구매 후 추천 기능'을 각각 1순위로 제안했습니다. 기간은 3주뿐이라 셋 중 하나만 선택해야 합니다.",
        "AI에게 후보를 비교할 의사결정 프레임워크를 요청하고, 최종적으로 다음 회의에 바로 쓸 수 있는 PRD(제품요구사항문서) 초안을 만들어보세요.",
      ],
      mission: [
        "비교 기준 설정과 후보안별 비교 평가",
        "선택과 선정 근거",
        "PRD 핵심 항목 (목표·성공지표·범위·일정 등)",
      ],
    },
    {
      key: "marketing",
      tags: ["리텐션", "CRM", "예산 배분"],
      title: "마케팅",
      summary: "재구매율 저하 원인 가설과 캠페인 방향을 잡고, 바로 집행 가능한 캠페인 기획서를 만듭니다.",
      situation: [
        "당신은 이모레 퍼시픽 스킨케어팀의 마케팅 담당자입니다. 신제품 라인이 출시된 지 2개월이 됐는데 재구매율이 8%로 업계 평균보다 낮습니다.",
        "이번 달 마케팅 예산은 300만원이고, 운영 중인 채널은 Instagram과 카카오톡 채널 두 개뿐입니다.",
        "AI에게 재구매율 저하 원인 가설과 캠페인 방향을 요청하고, 최종적으로 다음 달에 바로 집행 가능한 캠페인 기획서를 만들어보세요.",
      ],
      newsTitle: "지난 일주일 마케팅 업계 핵심 뉴스",
      news: [
        "업계, '첫 구매 이후'가 진짜 승부처 - 스킨케어 브랜드들, 재구매 유도 위한 CRM·리텐션 마케팅 투자 1년새 40% 증가",
        "효과 체감까지 평균 6주 - 스킨케어 신제품 초기 이탈 막으려면 '사용법·효능 교육' 콘텐츠가 관건",
        "뮈신사 뷰티 공격적인 할인 공세 - 경쟁 브랜드들, 구독형 모델로 재구매 고객 선점 경쟁 본격화",
      ],
      mission: [
        "원인 가설과 가설별 검증 가능성",
        "캠페인 타깃과 메시지",
        "채널별 실행안과 예산배분",
        "기대효과 및 핵심 인사이트",
      ],
    },
    {
      key: "data",
      tags: ["문제정의", "지표분석", "경영진 보고"],
      title: "데이터 분석",
      summary: "제공된 지표와 로그 데이터를 바탕으로 경영진 회의용 분석 프로젝트 계획서를 만듭니다.",
      situation: [
        "당신은 마켓쿨리의 데이터 분석 담당자입니다. 최근 신규 고객은 크게 증가했지만, 지난 회의에서 경영진은 사업 성과가 기대만큼 좋지 못하다고 느끼고 있습니다.",
        "다음 주 진행되는 경영진 회의에서 '가장 먼저 확인해야 할 문제는 무엇인가?', '우리는 어떤 방향으로 추가 분석을 진행해야 하는가?', '최근 신규 고객은 증가하는데 사업 성과는 왜 좋아지지 않는가?'라는 질문을 담은 분석 프로젝트 설계안을 발표해야 합니다.",
        "현재 제공된 정보만으로는 원인을 단정할 수 없습니다. AI와 협업하여 경영진에게 보고할 분석 프로젝트 계획서를 작성해보세요.",
      ],
      metricsTitle: "최근 주요 지표",
      metrics: [
        ["신규 가입자 수", "20,000명", "27,000명"],
        ["첫 구매 전환율", "18%", "19%"],
        ["30일 내 재구매율", "28%", "17%"],
        ["평균 주문 금액", "48,000원", "39,000원"],
        ["월 매출", "11.2억 원", "10.9억 원"],
      ],
      dataTitle: "현재 이용 가능한 데이터",
      dataSources: ["가입자 정보", "구매 로그", "고객 문의(CS) 로그"],
      mission: [
        "제공된 정보를 바탕으로 무엇이 핵심 문제인지 정의하고, 그렇게 판단한 이유 작성",
        "우선적으로 확인할 데이터와 분석 순서 작성",
        "가능한 원인과 가장 먼저 수행해야 할 추가 분석 또는 개선 과제 제안",
      ],
    },
  ];

  function selectedT3Scenario() {
    const index = Number.isFinite(Number(state.t3Scenario)) ? Number(state.t3Scenario) : 0;
    return t3ScenarioData[index] || t3ScenarioData[0];
  }

  function makeT3IntroCards() {
    return [
      ["직무 시나리오", "기획, 데이터, 마케팅 등 실제 업무에 가까운 가상 상황을 선택해요."],
      ["5턴 AI 대화", "AI에게 질문하고, 부족한 조건을 보완하며 산출물을 만들어가요."],
      ["리포트 결과", "8개 평가축을 기준으로 잘한 점, 보완할 점, 개선 프롬프트를 받아요."],
    ].map(([title, desc]) => `<article><strong>${title}</strong><span>${desc}</span></article>`).join("");
  }

  function makeT3ScenarioCards() {
    return t3ScenarioData.map((item, index) => `
      <button class="t3-scenario-card ${Number(state.t3Scenario || 0) === index ? "is-selected" : ""}" type="button" data-t3-scenario="${index}">
        <span>${item.tags.map((tag, tagIndex) => `<i class="${tagIndex === 0 ? "is-active" : ""}">${tag}</i>`).join("")}</span>
        <strong>${item.title}</strong>
        <small>${item.summary}</small>
      </button>`).join("");
  }

  function makeT3ScenarioExtras(item) {
    const news = item.news ? `<h2>${item.newsTitle}</h2><ul>${item.news.map((text) => `<li>${text}</li>`).join("")}</ul>` : "";
    const metrics = item.metrics ? `
      <h2>${item.metricsTitle}</h2>
      <table class="t3-metrics"><thead><tr><th>지표</th><th>지난 분기</th><th>이번 분기</th></tr></thead><tbody>
        ${item.metrics.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody></table>` : "";
    const dataSources = item.dataSources ? `<h2>${item.dataTitle}</h2><ul>${item.dataSources.map((text) => `<li>${text}</li>`).join("")}</ul>` : "";
    return `${news}${metrics}${dataSources}`;
  }

  function makeT3ChatBrief(item = selectedT3Scenario()) {
    return `
      <h2>상황 설명</h2>
      ${item.situation.map((text) => `<p>${text}</p>`).join("")}
      ${makeT3ScenarioExtras(item)}
      <h2>미션 가이드</h2>
      <p>다음 내용을 중심으로 AI와 함께 최종 제출물을 만들어보세요.</p>
      <ul>${item.mission.map((text) => `<li>${text}</li>`).join("")}</ul>`;
  }

  function makeT3ScoreRows() {
    return [
      ["목표 정의", 78],
      ["맥락 제공", 46],
      ["정보 구조화", 50],
      ["작업 분해", 78],
      ["출력 설계", 78],
      ["상호작용 조율", 78],
      ["검증 유도", 78],
    ].map(([label, score]) => `<p><b>${label}</b><strong>${score}점</strong><i><span style="width:${score}%"></span></i></p>`).join("");
  }

  function makeT3DetailRows() {
    return [
      ["정보 구조화", 50],
      ["출력 설계", 78],
      ["검증 유도", 78],
    ].map(([label, score]) => `
      <article>
        <p><b>${label}</b><strong>${score}점</strong><i><span style="width:${score}%"></span></i></p>
        <div>AI 답변의 누락 지점이나 반대 근거를 확인하는 요청은 아직 보완이 필요해요. 최종 선택안을 받은 뒤 실패할 수 있는 이유, 반대 의견, 놓친 리스크를 물어보면 결과물이 더 탄탄해집니다.</div>
      </article>`).join("");
  }

  t3Screens = function t3Screens() {
    state.t3Scenario = state.t3Scenario ?? 0;

    return [
      loginScreen("t3-login", "t3-intro"),
      screen(
        "t3-intro",
        "T3-01 Track 3 안내",
        `${header()}
        <section class="t3-intro-layout">
          <div class="t3-intro-copy">
            <p class="eyebrow">Track 3 · 5턴대화 · 약 10분</p>
            <h1>AI 실무 적용 테스트</h1>
            <p>직무별 가상 상황에서 AI와 직접 대화하며<br />문제를 해결하는 과정 전체를 평가합니다.</p>
            <div class="t3-intro-characters">
              ${char("love", "t3-character t3-character-a")}
              <img class="t3-character t3-character-b" src="./characters-final/skeptic-regular.png" alt="" />
            </div>
          </div>
          <div class="t3-intro-cards">${makeT3IntroCards()}</div>
        </section>
        ${button("테스트 시작하기", "t3-scenario", "primary", "t3-wide-start")}
        ${footer()}`,
        "t3-screen t3-intro-screen"
      ),
      screen(
        "t3-scenario",
        "T3-02 시나리오 선택",
        `${header()}
        <section class="t3-scenario-layout">
          <aside class="t3-scenario-guide">
            <h2>시나리오 선택</h2>
            <p>먼저 평가받고 싶은 직무 상황을 선택하세요. Track 3는 선택한 시나리오를 바탕으로 AI와 5턴 동안 대화하며 최종 산출물을 만드는 실전 평가입니다.</p>
            <p>구체적인 상황 설명과 미션 가이드는 다음 화면에서 제공됩니다.</p>
            <h2>진행 방식</h2>
            <ul>
              <li>직무 시나리오 선택</li>
              <li>상황과 미션 확인</li>
              <li>AI와 5턴 대화</li>
              <li>최종 산출물 제출</li>
              <li>평가 리포트 확인</li>
            </ul>
          </aside>
          <section class="t3-scenario-list">${makeT3ScenarioCards()}${button("다음", "t3-chat", "primary", "t3-scenario-next")}</section>
        </section>`,
        "t3-screen t3-scenario-screen"
      ),
      screen(
        "t3-chat",
        "T3-03 인앱 채팅",
        `${header()}
        <section class="t3-mobile-flow-head" style="display:none">
          <h1 data-t3-mobile-title>${selectedT3Scenario().title} 시나리오</h1>
          <div class="t3-mobile-progress"><i></i><i></i><i></i><i></i><i></i></div>
          <nav class="t3-mobile-tabs" aria-label="Track 3 sections">
            <button type="button" data-t3-tab="brief" class="is-active">상황 설명</button>
            <button type="button" data-t3-tab="work">작업 영역</button>
            <button type="button" data-t3-tab="chat">AI 채팅</button>
          </nav>
        </section>
        <section class="t3-chat-layout">
          <aside class="t3-chat-brief" data-t3-chat-brief>${makeT3ChatBrief()}</aside>
          <section class="t3-workspace">
            <h2>최종 제출물 작업 영역</h2>
            <p>AI와 대화할수록 해당 영역이 채워집니다. 최대 5턴까지 대화 가능합니다.</p>
            <div></div><div></div><div></div>
            ${button("제출", "t3-loading", "primary", "t3-submit")}
          </section>
          <aside class="t3-chat-panel">
            <header><h2>AI 채팅</h2><span><i></i><i></i><i></i><i></i><i></i></span></header>
            <div class="t3-bubble t3-bubble-user"></div>
            <div class="t3-bubble t3-bubble-ai"></div>
            <div class="t3-bubble t3-bubble-user"></div>
            <div class="t3-bubble t3-bubble-ai"></div>
            <div class="t3-bubble t3-bubble-user"></div>
            <div class="t3-bubble t3-bubble-ai"></div>
            <label class="t3-chat-composer"><textarea rows="1" data-t3-chat-input placeholder="메시지 입력"></textarea><button type="button">↑</button></label>
          </aside>
        </section>`,
        "t3-screen t3-chat-screen"
      ),
      screen(
        "t3-loading",
        "T3-04 분석 로딩",
        `${header()}<section class="t3-loading-content"><h1>당신과 AI의 관계를<br />해석하는 중...</h1><img src="./Logo/Logo.v1.png" alt="" /></section>`,
        "t3-screen t3-loading-screen"
      ),
      screen(
        "t3-result",
        "T3-05 결과 화면",
        `${header()}
        <section class="t3-result-layout">
          <article class="t3-result-score">
            <strong class="t3-grade">실무 적용형</strong>
            <h1>74점</h1>
            <div class="t3-score-list">${makeT3ScoreRows()}</div>
          </article>
          <article class="t3-result-report">
            <h2>일을 맡기는 구조는 꽤 잘 잡혀 있어요</h2>
            <p>당신은 문제 상황을 빠르게 이해하고, AI에게 원하는 산출물의 방향을 비교적 명확하게 전달하는 편이에요. 다만 중간 대화에서 AI의 답변을 검증하거나, 빠진 조건을 다시 물어보는 과정은 조금 더 보완하면 좋아요.</p>
            <div class="t3-detail-list">${makeT3DetailRows()}</div>
          </article>
        </section>
        <nav class="t3-result-nav"><button class="cta t3-detail-open" data-target="t3-report" style="display:none">상세 리포트 보기</button>${button("공유하기", "t3-result", "secondary")}${button("다른 Track 도전", "home")}</nav>`,
        "t3-screen t3-result-screen"
      ),
      screen(
        "t3-report",
        "T3-08 상세 리포트",
        `${header()}
        <section class="t3-report-mobile">
          <h1>일을 맡기는 구조는 꽤 잘 잡혀 있어요</h1>
          <p class="t3-report-summary">당신은 문제 상황을 빠르게 이해하고, AI에게 원하는 산출물의 방향을 비교적 명확하게 전달하는 편이에요. 다만 중간 대화에서 AI의 답변을 검증하거나, 빠진 조건을 다시 물어보는 과정은 조금 더 보완하면 좋아요.</p>
          <div class="t3-detail-list">${makeT3DetailRows()}</div>
          ${button("다른 Track 도전", "home", "primary", "t3-report-next")}
          ${button("이전", "t3-result", "secondary", "t3-report-back")}
        </section>`,
        "t3-screen t3-report-screen"
      ),
    ].join("");
  };

  function syncT3ChatScenario() {
    const brief = document.querySelector('[data-screen="t3-chat"] [data-t3-chat-brief]');
    if (brief) brief.innerHTML = makeT3ChatBrief();
  }

  const originalShowScreen = showScreen;
  showScreen = function patchedShowScreen(name) {
    originalShowScreen(name);
    if (name === "t3-chat") {
      syncT3ChatScenario();
      const screen = document.querySelector('[data-screen="t3-chat"]');
      if (screen && !screen.dataset.t3Tab) screen.dataset.t3Tab = "brief";
    }
  };

  if (typeof render === "function") {
    render();
  }

  document.addEventListener("click", (event) => {
    const scenarioButton = event.target.closest("[data-t3-scenario]");
    if (!scenarioButton) return;

    state.t3Scenario = Number(scenarioButton.dataset.t3Scenario) || 0;
    scenarioButton
      .closest(".t3-scenario-list")
      ?.querySelectorAll("[data-t3-scenario]")
      .forEach((button) => button.classList.toggle("is-selected", button === scenarioButton));
  }, true);

  document.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-t3-tab]");
    if (!tabButton) return;

    const screen = tabButton.closest('[data-screen="t3-chat"]');
    if (!screen) return;

    screen.dataset.t3Tab = tabButton.dataset.t3Tab || "brief";
    screen
      .querySelectorAll("[data-t3-tab]")
      .forEach((button) => button.classList.toggle("is-active", button === tabButton));
  }, true);

  document.addEventListener("input", (event) => {
    const field = event.target.closest("[data-t3-chat-input]");
    if (!field) return;

    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 132)}px`;
  });
})();
