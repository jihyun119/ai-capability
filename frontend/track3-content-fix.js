(function () {
  const t3ScenarioData = [
    {
      key: "pm",
      tags: ["의사결정", "PRD", "우선 순위"],
      title: "PM",
      summary: "3주 안에 만들 핵심 기능을 결정하고, 다음 회의에 바로 쓸 수 있는 PRD 초안을 만듭니다.",
      situation: [
        "당신은 키키오 선물하기 프로덕트 팀의 PM입니다. 다음 분기 3주 동안 만들 핵심 기능 하나를 정해야 합니다.",
        "개발자는 '쿠폰함 알림 기능'을, 디자이너는 '위시리스트 공유 기능'을, 데이터 분석가는 '구매 후 추천 기능'을 각각 1순위로 제안했습니다. 기간은 3주뿐이라 셋 중 하나만 선택해야 합니다.",
        "AI에게 후보를 비교할 의사결정 프레임워크를 요청하고, 최종적으로 다음 회의에 바로 쓸 수 있는 PRD(제품요구사항문서) 초안을 만들어보세요.",
      ],
      mission: [
        "비교 기준 설정과 후보안별 비교 평가",
        "선택과 선정 근거",
        "PRD 핵심 항목 (목표·성공지표·범위·일정 등)",
      ],
      artifactSections: ["후보 비교표", "선택안 & 선정 근거", "PRD 초안"],
    },
    {
      key: "marketing",
      tags: ["리텐션", "CRM", "예산 배분"],
      title: "마케팅",
      summary: "재구매율 저하 원인 가설과 캠페인 방향을 잡고, 바로 집행 가능한 캠페인 기획서를 만듭니다.",
      situation: [
        "당신은 이모레퍼시픽 스킨케어팀의 마케팅 담당자입니다. 신제품 라인이 출시된 지 2개월이 됐는데 재구매율이 8%로 업계 평균보다 낮습니다.",
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
      artifactSections: ["원인 가설 & 뉴스 근거", "타깃 & 핵심 메시지", "채널별 실행안 & 예산", "성과 지표 & 기대효과"],
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
      dataSchemas: [
        {
          name: "가입자 정보",
          columns: ["user_id", "signup_date", "birth_year", "gender", "region", "signup_channel", "last_login_at", "user_status"],
        },
        {
          name: "구매 로그",
          columns: ["order_id", "user_id", "product_id", "product_category", "quantity", "discount_amount", "payment_amount", "purchased_at", "order_status"],
        },
        {
          name: "고객 문의 로그",
          columns: ["inquiry_id", "user_id", "order_id", "inquiry_type", "inquiry_content", "inquiry_created_at", "response_created_at", "resolution_status", "satisfaction_score"],
        },
      ],
      mission: [
        "제공된 정보를 바탕으로 무엇이 핵심 문제인지 정의하고, 그렇게 판단한 이유 작성",
        "우선적으로 확인할 데이터와 분석 순서 작성",
        "가능한 원인과 가장 먼저 수행해야 할 추가 분석 또는 개선 과제 제안",
      ],
      artifactSections: ["핵심 문제 & 지표 해석", "분석 가설 & 우선순위", "데이터 & 검증 계획", "경영진 제안 & 다음 액션"],
    },
  ];

  state.t3Scenario = state.t3Scenario ?? 0;
  state.t3Scenarios = state.t3Scenarios || null;
  state.t3ScenarioId = state.t3ScenarioId || null;
  state.t3Turns = state.t3Turns || [];
  state.t3Artifact = state.t3Artifact || "";
  state.t3FinalOutput = state.t3FinalOutput || "";
  state.t3Result = state.t3Result || null;
  state.t3SaveResult = state.t3SaveResult || null;
  state.t3Error = state.t3Error || "";
  state.t3Draft = state.t3Draft || "";
  let t3ChatPending = false;
  let t3ChatWarning = "";

  function resetTrack3Progress() {
    state.t3Scenario = 0;
    state.t3ScenarioId = null;
    state.t3Turns = [];
    state.t3Artifact = "";
    state.t3FinalOutput = "";
    state.t3Result = null;
    state.t3SaveResult = null;
    state.t3Error = "";
    state.t3Draft = "";
    t3ChatPending = false;
    t3ChatWarning = "";
  }

  window.__resetTrack3Progress = resetTrack3Progress;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    return String(value).split(/\n+/).map((item) => item.trim()).filter(Boolean);
  }

  function scenarioIdOf(item, fallbackIndex = 0) {
    return item?.scenarioId || item?.scenario_id || item?.id || item?.key || `scenario-${fallbackIndex}`;
  }

  function adaptT3Scenario(item, fallback = {}, fallbackIndex = 0) {
    const scenarioId = scenarioIdOf(item, fallbackIndex);
    return {
      ...fallback,
      ...item,
      key: item?.key || fallback.key || scenarioId,
      scenarioId,
      tags: asArray(item?.tags).length ? asArray(item.tags) : (fallback.tags || []),
      title: item?.title || fallback.title || "",
      summary: item?.summary || item?.description || fallback.summary || "",
      situation: asArray(item?.situation || item?.context || item?.situationDescription || item?.situation_description).length
        ? asArray(item?.situation || item?.context || item?.situationDescription || item?.situation_description)
        : (fallback.situation || []),
      mission: asArray(item?.mission || item?.missionGuide || item?.mission_guide).length
        ? asArray(item?.mission || item?.missionGuide || item?.mission_guide)
        : (fallback.mission || []),
      artifactSections: asArray(item?.artifactSections || item?.artifact_sections).length
        ? asArray(item?.artifactSections || item?.artifact_sections)
        : (fallback.artifactSections || []),
      newsTitle: item?.newsTitle || item?.news_title || fallback.newsTitle,
      news: asArray(item?.news).length ? asArray(item.news) : fallback.news,
      metricsTitle: item?.metricsTitle || item?.metrics_title || fallback.metricsTitle,
      metrics: Array.isArray(item?.metrics) ? item.metrics : fallback.metrics,
      dataTitle: item?.dataTitle || item?.data_title || fallback.dataTitle,
      dataSources: asArray(item?.dataSources || item?.data_sources).length
        ? asArray(item?.dataSources || item?.data_sources)
        : fallback.dataSources,
      dataSchemas: Array.isArray(item?.dataSchemas || item?.data_schemas)
        ? (item.dataSchemas || item.data_schemas)
        : fallback.dataSchemas,
    };
  }

  function t3ScenarioOrderRank(item, fallbackIndex = 0) {
    const key = `${item?.key || ""} ${item?.scenarioId || ""} ${item?.title || ""}`.toLowerCase();
    if (key.includes("marketing") || key.includes("마케팅")) return 0;
    if (key.includes("data") || key.includes("데이터")) return 1;
    if (key.includes("pm") || key.includes("prd")) return 2;
    return 10 + fallbackIndex;
  }

  function orderedT3Scenarios(list) {
    return list
      .map((item, index) => ({ item, index, rank: t3ScenarioOrderRank(item, index) }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map(({ item }) => item);
  }

  function activeT3Scenarios() {
    if (!state.t3ScenariosLoaded) return [];

    const scenarios = Array.isArray(state.t3Scenarios) && state.t3Scenarios.length > 0
      ? state.t3Scenarios
      : t3ScenarioData;
    return orderedT3Scenarios(scenarios);
  }

  function selectedT3Scenario() {
    const scenarios = activeT3Scenarios();
    const index = Number.isFinite(Number(state.t3Scenario)) ? Number(state.t3Scenario) : 0;
    return scenarios[index] || scenarios[0] || t3ScenarioData[0];
  }

  function t3ProjectName(item = selectedT3Scenario()) {
    const explicit = item?.projectName || item?.project_name || item?.project || item?.serviceName || item?.service_name;
    if (explicit) return explicit;
    const id = String(item?.scenarioId || item?.id || item?.key || "").toLowerCase();
    if (id.includes("marketing")) return "이모레퍼시픽 스킨케어";
    if (id.includes("data")) return "마켓쿨리";
    if (id.includes("pm")) return "키키오 선물하기";
    return item?.title || "Track 3";
  }

  function makeT3IntroCards() {
    return [
      ["직무 시나리오", "기획, 데이터, 마케팅 등 실제 업무에 가까운 가상 상황을 선택해요."],
      ["5턴 AI 대화", "AI에게 질문하고, 부족한 조건을 보완하며 산출물을 만들어가요."],
      ["리포트 결과", "8개 평가축을 기준으로 잘한 점, 보완할 점, 개선 프롬프트를 받아요."],
    ].map(([title, desc]) => `<article><strong>${title}</strong><span>${desc}</span></article>`).join("");
  }

  function t3UiText(value) {
    return String(value ?? "").replace(/PRD/g, "세부기획안");
  }

  function t3ScenarioRole(item) {
    const explicit = item?.role || item?.jobRole || item?.job_role;
    const id = String(item?.scenarioId || item?.id || item?.key || "").toLowerCase();
    const role = String(explicit || "").toLowerCase();
    if (id.includes("marketing") || role.includes("마케팅")) return "마케팅";
    if (id.includes("data") || role.includes("데이터 분석")) return "데이터 분석";
    if (id.includes("pm") || id.includes("prd") || role.includes("pm")) return "PM";
    if (explicit) return String(explicit);
    return String(item?.title || "");
  }

  function t3ScenarioCardTitle(item) {
    const explicit = item?.projectTitle || item?.project_title || item?.projectName || item?.project_name;
    if (explicit) return String(explicit);

    const id = String(item?.scenarioId || item?.id || item?.key || "").toLowerCase();
    if (id.includes("marketing")) return "재구매율 개선 캠페인 기획";
    if (id.includes("data")) return "데이터 분석";
    if (id.includes("pm") || id.includes("prd")) return "핵심 기능 우선순위 및 PRD 초안";
    return String(item?.summary || "Track 3 프로젝트");
  }

  function makeT3ScenarioCards() {
    const scenarios = activeT3Scenarios();
    if (scenarios.length === 0) {
      return `<div class="t3-scenario-loading">시나리오를 불러오는 중...</div>`;
    }

    return scenarios.map((item, index) => {
      const role = t3ScenarioRole(item);
      const projectTitle = role === "마케팅"
        ? "신제품 재구매율 개선 캠페인"
        : role === "데이터 분석"
          ? "사업 성과 변화 분석 프로젝트"
          : role === "PM"
            ? "분기 핵심 기능 우선순위 결정"
            : t3ScenarioCardTitle(item);
      const title = `${String.fromCharCode(65 + index)}. ${projectTitle}`;
      const description = role === "데이터 분석"
        ? "신규 고객은 증가했지만 매출은 개선되지 않았습니다. 제공된 지표와 로그 데이터를 바탕으로 경영진 회의용 분석 계획을 세워야 합니다."
        : item.summary;
      const tags = (item.tags || [])
        .map((tag) => String(tag).trim())
        .filter((tag) => tag && tag !== role)
        .slice(0, 3);

      return `
        <button class="t3-scenario-card ${Number(state.t3Scenario || 0) === index ? "is-selected" : ""}" type="button" data-t3-scenario="${index}">
          <span class="t3-scenario-tags">
            <i class="t3-scenario-tag t3-scenario-role">${escapeHtml(role)}</i>
            ${tags.map((tag) => `<i class="t3-scenario-tag">${escapeHtml(t3UiText(tag))}</i>`).join("")}
          </span>
          <strong class="t3-scenario-title">${escapeHtml(t3UiText(title))}</strong>
          <small class="t3-scenario-description">${escapeHtml(t3UiText(description))}</small>
        </button>`;
    }).join("");
  }

  function makeT3ScenarioExtras(item) {
    const news = item.news ? `<h2>${item.newsTitle}</h2><ul>${item.news.map((text) => `<li>${text}</li>`).join("")}</ul>` : "";
    const metrics = item.metrics ? `
      <h2>${item.metricsTitle}</h2>
      <table class="t3-metrics"><thead><tr><th>지표</th><th>지난 분기</th><th>이번 분기</th></tr></thead><tbody>
        ${item.metrics.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody></table>` : "";
    const dataSources = item.dataSources ? `<h2>${item.dataTitle}</h2><ul>${item.dataSources.map((text) => `<li>${text}</li>`).join("")}</ul>` : "";
    const dataSchemas = Array.isArray(item.dataSchemas) && item.dataSchemas.length ? `
      <table class="t3-data-schema">
        <thead><tr><th>데이터</th><th>이용 가능한 컬럼</th></tr></thead>
        <tbody>${item.dataSchemas.map((schema) => `
          <tr>
            <td>${escapeHtml(schema.name)}</td>
            <td><span class="t3-data-columns">${asArray(schema.columns).map((column) => `<code>${escapeHtml(column)}</code>`).join("")}</span></td>
          </tr>`).join("")}</tbody>
      </table>` : "";
    return `${news}${metrics}${dataSources}${dataSchemas}`;
  }

  function makeT3ChatBrief(item = selectedT3Scenario()) {
    return `
      <h2 class="t3-step-title"><span class="t3-step-badge" aria-hidden="true">1</span><span>상황 설명</span></h2>
      ${item.situation.map((text) => `<p>${t3UiText(text)}</p>`).join("")}
      <h2 class="t3-step-title"><span class="t3-step-badge" aria-hidden="true">2</span><span>미션 가이드</span></h2>
      <p>다음 내용을 중심으로 AI와 함께 최종 제출물을 만들어보세요.</p>
      <ul>${item.mission.map((text) => `<li>${t3UiText(text)}</li>`).join("")}</ul>
      ${makeT3ScenarioExtras(item)}`;
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

  function currentT3Evaluation() {
    return state.t3Result?.result || state.t3Result || null;
  }

  function t3AxisLabel(key, value) {
    return value?.axis || value?.label || value?.name || ({
      goal_definition: "목표 정의",
      context: "맥락 제공",
      information_structure: "정보 구조화",
      task_decomposition: "작업 분해",
      output_design: "출력 설계",
      interaction_control: "상호작용 조율",
      verification: "검증 유도",
      practical_application: "실무 적용",
    }[key] || key);
  }

  function t3ScoreRowsFromEvaluation() {
    const evaluation = currentT3Evaluation();
    const axes = evaluation?.axes || evaluation?.axis_scores || evaluation?.scores;
    if (!axes || typeof axes !== "object") return null;

    const entries = Array.isArray(axes)
      ? axes.map((value) => [value?.key || value?.axis || "", value])
      : Object.entries(axes);

    return entries.map(([key, value]) => {
      const score = typeof value === "number" ? value : Number(value?.score ?? value?.total ?? value?.value ?? 0);
      const max = typeof value === "object" ? Number(value.max || 100) : 100;
      const percent = typeof value === "object" && Number.isFinite(Number(value.rate))
        ? Number(value.rate) * 100
        : (max > 0 ? (score / max) * 100 : score);
      const displayScore = max <= 5 ? percent : score;
      return {
        key,
        label: t3AxisLabel(key, value),
        score: Math.round(displayScore),
        percent: Math.max(0, Math.min(100, percent)),
        description: t3SafeAxisComment(value?.comment, key, percent),
      };
    }).filter((row) => row.label && Number.isFinite(row.score));
  }

  function t3AxisFeedback(key, percent) {
    const level = percent >= 75 ? "high" : percent >= 50 ? "mid" : "low";
    const feedback = {
      goal_definition: {
        high: "해결할 문제와 기대하는 결과물이 명확하게 연결되어 있어요.",
        mid: "목표는 드러나지만 기대하는 결과물을 조금 더 구체화할 필요가 있어요.",
        low: "해결할 문제와 최종 결과물을 먼저 명확하게 정해보세요."
      },
      context: {
        high: "AI가 판단하는 데 필요한 배경과 제약 조건을 충분히 제공했어요.",
        mid: "기본 맥락은 전달했지만 대상과 제약 조건을 더 보강하면 좋아요.",
        low: "AI가 상황을 판단할 수 있도록 배경, 대상, 제약 조건을 추가해보세요."
      },
      information_structure: {
        high: "지시와 배경, 조건이 구분되어 정보를 쉽게 파악할 수 있어요.",
        mid: "핵심 정보는 있지만 지시와 배경을 더 분명하게 나누면 좋아요.",
        low: "지시, 배경, 조건, 산출물 형식을 구분해서 전달해보세요."
      },
      task_decomposition: {
        high: "복잡한 작업을 목적에 맞는 단계로 나누어 진행했어요.",
        mid: "작업을 일부 나누었지만 단계별 목적을 더 선명하게 정하면 좋아요.",
        low: "한 번에 완성하기보다 설계, 초안, 검증, 최종화로 나누어보세요."
      },
      output_design: {
        high: "사용 목적에 맞게 결과물의 형식과 포함 항목을 구체적으로 설계했어요.",
        mid: "결과물 형식은 제시했지만 분량과 포함 항목을 더 구체화하면 좋아요.",
        low: "결과물의 형식, 분량, 포함 항목과 사용 목적을 함께 지정해보세요."
      },
      interaction_control: {
        high: "AI의 답변을 바탕으로 방향과 우선순위를 능동적으로 조정했어요.",
        mid: "후속 요청은 있었지만 선택과 제외의 근거를 더 분명히 제시하면 좋아요.",
        low: "AI의 제안 중 선택할 것과 제외할 것을 직접 판단해보세요."
      },
      verification: {
        high: "오류와 누락을 확인할 구체적인 검증 기준을 제시했어요.",
        mid: "검토를 요청했지만 확인할 기준을 더 구체적으로 정하면 좋아요.",
        low: "논리 비약, 누락, 실행 가능성처럼 구체적인 기준으로 검증을 요청해보세요."
      },
      practical_application: {
        high: "최종 결과물이 실제 업무에서 바로 활용할 수 있는 형태로 완성됐어요.",
        mid: "결과물의 기본 구조는 갖췄지만 실행 항목을 더 보완하면 좋아요.",
        low: "담당자, 우선순위와 다음 행동을 포함해 실제 사용할 수 있게 완성해보세요."
      }
    };
    return feedback[key]?.[level] || "이번 평가축에서 다음 행동을 더 구체적으로 보여주세요.";
  }

  function t3SafeAxisComment(value, key, percent) {
    const comment = String(value || "").replace(/\s+/g, " ").trim();
    const userText = (state.t3Turns || [])
      .filter((turn) => turn?.role === "user")
      .map((turn) => turn.content || "")
      .join(" ");
    const unsafe = !comment
      || comment.length > 140
      || t3SharesLongSequence(comment, userText);
    return unsafe ? t3AxisFeedback(key, percent) : comment;
  }

  function t3SharesLongSequence(left, right, size = 18) {
    const normalize = (text) => String(text || "").toLowerCase().replace(/[^가-힣a-z0-9]/g, "");
    const source = normalize(left);
    const target = normalize(right);
    if (source.length < size || target.length < size) return false;
    for (let index = 0; index <= source.length - size; index += 1) {
      if (target.includes(source.slice(index, index + size))) return true;
    }
    return false;
  }

  function t3DetailRowsFromEvaluation() {
    const evaluation = currentT3Evaluation();
    const scoreRows = t3ScoreRowsFromEvaluation() || [];
    const axisDetails = scoreRows
      .filter((row) => row.description)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
    if (axisDetails.length > 0) return axisDetails;

    const feedback = evaluation?.feedback || evaluation?.details || evaluation?.report;
    const details = Array.isArray(feedback?.details) ? feedback.details
      : Array.isArray(feedback?.weaknesses) ? feedback.weaknesses
      : Array.isArray(feedback) ? feedback
      : null;
    if (!details?.length) return null;

    return details.slice(0, 3).map((item, index) => ({
      key: item.key || item.axis || "",
      label: item.name || item.label || scoreRows[index]?.label || "피드백",
      score: Math.round(Number(item.score ?? scoreRows[index]?.score ?? 78)),
      percent: Math.max(0, Math.min(100, Number.isFinite(Number(item.rate)) ? Number(item.rate) * 100 : (scoreRows[index]?.percent ?? 78))),
      description: item.description || item.comment || item.feedback || item.text || "",
    }));
  }

  function makeT3ScoreRows() {
    const rows = t3ScoreRowsFromEvaluation();
    if (!rows?.length) {
      return `<p><b>평가 결과 없음</b><strong>-</strong><i><span style="width:0%"></span></i></p>`;
    }

    return rows.map(({ label, score, percent }) => `<p><b>${escapeHtml(label)}</b><strong>${score}점</strong><i><span style="width:${percent}%"></span></i></p>`).join("");
  }

  function makeT3DetailRows() {
    const details = t3DetailRowsFromEvaluation();
    if (!details?.length) {
      return `<article><p><b>리포트 대기</b><strong>-</strong><i><span style="width:0%"></span></i></p><div>${escapeHtml(state.t3Error || "제출 후 평가 결과가 표시됩니다.")}</div></article>`;
    }

    return details.map(({ label, score, percent, description }) => `
      <article>
        <p><b>${escapeHtml(label)}</b><strong>${score}점</strong><i><span style="width:${percent}%"></span></i></p>
        <div>${escapeHtml(description)}</div>
      </article>`).join("");
  }

  function normalizedT3Turns(turns = state.t3Turns) {
    return Array.isArray(turns)
      ? turns.map((turn) => ({
        role: turn.role === "assistant" || turn.role === "ai" ? "assistant" : "user",
        content: String(turn.content || turn.message || turn.text || "").trim(),
      })).filter((turn) => turn.content)
      : [];
  }

  function formatT3MessageContent(value) {
    return escapeHtml(String(value || "")).replace(/\n/g, "<br />");
  }

  function hasT3Artifact() {
    return Boolean(String(state.t3Artifact || state.t3FinalOutput || "").trim());
  }

  function canSubmitT3() {
    return getT3TurnCount() > 0;
  }

  function makeT3ChatMessages() {
    const turns = normalizedT3Turns();
    if (turns.length === 0 && !t3ChatPending) {
      return `<div class="t3-chat-empty">메시지를 입력하면 AI와의 대화가 시작됩니다.</div>`;
    }

    const messages = turns.map((turn) => `<div class="t3-message t3-message-${turn.role === "assistant" ? "assistant" : "user"}">${formatT3MessageContent(turn.content)}</div>`).join("");
    const pending = t3ChatPending
      ? `<div class="t3-message t3-message-assistant t3-message-pending" aria-live="polite"><span>•</span><span>•</span><span>•</span></div>`
      : "";
    return `${messages}${pending}`;
  }

  function scrollT3ChatToBottom(root = document) {
    const messages = root.querySelector?.("[data-t3-chat-messages]");
    if (!messages) return;
    messages.scrollTop = messages.scrollHeight;
  }

  function autoResizeTrack3Textarea(textarea) {
    if (!textarea) return;

    textarea.style.height = "auto";

    const minHeight = 24;
    const maxHeight = 220;
    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  function t3TurnProgressCount(turns, maxTurns = 5) {
    const count = (Array.isArray(turns) ? turns : [])
      .filter((turn) => turn?.role !== "assistant" && turn?.role !== "ai")
      .filter((turn) => String(turn?.content || turn?.message || turn?.text || "").trim())
      .length;
    return Math.max(0, Math.min(maxTurns, count));
  }

  function getT3TurnCount() {
    return t3TurnProgressCount(state.t3Turns);
  }

  function isT3TurnComplete() {
    return getT3TurnCount() >= 5;
  }

  function makeT3TurnProgress() {
    const turnCount = getT3TurnCount();
    return Array.from({ length: 5 }, (_, index) => `<i class="${index < turnCount ? "is-filled" : ""}"></i>`).join("");
  }

  function makeT3Artifact() {
    const value = normalizeT3Markdown(state.t3Artifact || state.t3FinalOutput).trim();
    const sections = selectedT3Scenario().artifactSections || ["작성 내용"];
    const contentBySection = parseT3ArtifactSections(value, sections);

    return `<div class="t3-artifact-doc"><div class="t3-artifact-body">${sections.map((title, index) => {
      const content = contentBySection.get(title) || "";
      const body = content
        ? renderT3Markdown(content)
        : "AI와 대화하면 이 영역이 채워집니다.";
      return `<article class="${content ? "" : "is-empty"}"><h3>${index + 1}. ${escapeHtml(t3UiText(title))}</h3><div class="t3-markdown">${body}</div></article>`;
    }).join("")}</div></div>`;
  }

  function normalizeT3Markdown(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/[\u2028\u2029]/g, "\n");
  }

  function renderT3Markdown(value) {
    const markdown = normalizeT3Markdown(value).trim();
    if (!markdown) return "";

    if (!window.marked?.parse || !window.DOMPurify?.sanitize) {
      return escapeHtml(markdown).replace(/\n/g, "<br />");
    }

    const rendered = window.marked.parse(markdown, {
      async: false,
      breaks: true,
      gfm: true,
    });

    return window.DOMPurify.sanitize(rendered, {
      ALLOWED_TAGS: [
        "a", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3", "h4", "h5", "h6",
        "hr", "li", "ol", "p", "pre", "strong", "table", "tbody", "td", "th", "thead", "tr", "ul",
      ],
      ALLOWED_ATTR: ["href", "title"],
      ALLOW_DATA_ATTR: false,
    });
  }

  function parseT3ArtifactSections(value, sections) {
    const result = new Map(sections.map((section) => [section, ""]));
    if (!value) return result;

    const markers = sections.flatMap((section) => {
      const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = new RegExp(`(?:^|\\n)\\s*(?:#{1,6}\\s*)?(?:\\d+[.)]\\s*)?${escaped}\\s*(?:\\n|$)`, "i").exec(value);
      return match ? [{ section, index: match.index, contentStart: match.index + match[0].length }] : [];
    }).sort((a, b) => a.index - b.index);

    if (markers.length) {
      markers.forEach((marker, index) => {
        const end = markers[index + 1]?.index ?? value.length;
        result.set(marker.section, value.slice(marker.contentStart, end).trim());
      });
      return result;
    }

    value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean).forEach((part, index) => {
      if (sections[index]) result.set(sections[index], part);
    });
    return result;
  }

  function refreshT3ChatUi() {
    const screen = document.querySelector('[data-screen="t3-chat"]');
    if (!screen) return;

    screen.querySelectorAll("[data-t3-turn-progress], .t3-chat-panel header > span").forEach((node) => {
      node.innerHTML = makeT3TurnProgress();
    });

    const messages = screen.querySelector("[data-t3-chat-messages]");
    if (messages) {
      messages.innerHTML = makeT3ChatMessages();
      scrollT3ChatToBottom(screen);
    }

    const artifact = screen.querySelector("[data-t3-artifact]");
    if (artifact) artifact.innerHTML = makeT3Artifact();

    const input = screen.querySelector("[data-t3-chat-input]");
    const sendButton = screen.querySelector("[data-t3-chat-send], .t3-chat-composer button");
    const submitButton = screen.querySelector(".t3-submit");
    const warning = screen.querySelector("[data-t3-chat-warning]");
    const turnComplete = isT3TurnComplete();
    const submitReady = canSubmitT3();

    if (input) {
      input.placeholder = turnComplete ? "5턴이 완료되었습니다. 최종 제출물을 확인해주세요." : "메시지 입력";
      input.disabled = t3ChatPending || turnComplete;
      if (state.t3Draft && input.value !== state.t3Draft) input.value = state.t3Draft;
      autoResizeTrack3Textarea(input);
    }
    if (warning) {
      warning.textContent = t3ChatWarning;
      warning.hidden = !t3ChatWarning;
    }
    if (sendButton) sendButton.disabled = t3ChatPending || turnComplete;
    if (submitButton) {
      submitButton.disabled = !submitReady;
      submitButton.classList.toggle("is-ready", submitReady);
    }
  }

  function t3ResultGrade() {
    const evaluation = currentT3Evaluation();
    return evaluation?.grade || evaluation?.type || "평가 대기";
  }

  function t3ResultScore() {
    const evaluation = currentT3Evaluation();
    const score = Number(evaluation?.total ?? evaluation?.score ?? evaluation?.totalScore);
    return Number.isFinite(score) ? Math.round(score) : "-";
  }

  function t3ResultHeadline() {
    const evaluation = currentT3Evaluation();
    return evaluation?.headline || evaluation?.feedback?.headline || evaluation?.feedback?.summary_strengths || "평가 결과를 확인할 수 없어요";
  }

  function t3ResultSummary() {
    const evaluation = currentT3Evaluation();
    const feedback = evaluation?.feedback || {};
    return evaluation?.summary
      || feedback.summary
      || [feedback.summary_strengths, feedback.summary_weaknesses, feedback.recommendation].filter(Boolean).join(" ")
      || evaluation?.comment
      || state.t3Error
      || "제출한 대화와 산출물을 바탕으로 평가를 생성하지 못했습니다.";
  }

  const T3_SHARE_AXES = [
    { key: "goal_definition", aliases: ["goal_definition", "task_clarity"], label: "목표 정의" },
    { key: "context", aliases: ["context"], label: "맥락 제공" },
    { key: "information_structure", aliases: ["information_structure"], label: "정보 구조화" },
    { key: "task_decomposition", aliases: ["task_decomposition", "task_breakdown"], label: "작업 분해" },
    { key: "output_design", aliases: ["output_design"], label: "출력 설계" },
    { key: "interaction_control", aliases: ["interaction_control", "interaction_coordination"], label: "상호작용 조율" },
    { key: "verification", aliases: ["verification", "validation_induction"], label: "검증 유도" },
  ];

  function buildT3ShareData() {
    const rows = t3ScoreRowsFromEvaluation() || [];
    const axes = T3_SHARE_AXES.map(({ key, aliases, label }) => {
      const row = rows.find((candidate) => aliases.includes(String(candidate.key || "")))
        || rows.find((candidate) => candidate.label === label);
      return row
        ? { ...row, key, label }
        : { key, label, score: 0, percent: 0, description: t3AxisFeedback(key, 0) };
    });
    const details = (t3DetailRowsFromEvaluation() || [...axes].sort((left, right) => left.score - right.score))
      .slice(0, 3);

    return {
      total: t3ResultScore(),
      grade: t3ResultGrade(),
      headline: t3ResultHeadline(),
      summary: t3ResultSummary(),
      axes,
      details,
    };
  }

  window.ShareService?.configure({
    getTrack3ShareData: buildT3ShareData,
    getShareUrl: () => window.location.href,
  });

  async function getT3Json(url) {
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Track 3 데이터를 불러오지 못했습니다.");
    }
    return result;
  }

  async function loadT3Scenarios() {
    if (state.t3ScenariosLoaded || state.t3ScenariosLoading) return;

    state.t3ScenariosLoading = true;
    try {
      const response = await getT3Json("/api/track3/scenarios");
      const list = Array.isArray(response.result) ? response.result : [];
      if (list.length > 0) {
        state.t3Scenarios = list.map((item, index) => adaptT3Scenario(item, t3ScenarioData[index], index));
      } else {
        state.t3Scenarios = t3ScenarioData;
      }
      state.t3ScenariosLoaded = true;
      const selected = selectedT3Scenario();
      state.t3ScenarioId = selected.scenarioId || selected.key;
      const current = state.currentScreen;
      if (current === "t3-scenario" || current === "t3-chat") {
        render();
        showScreen(current);
      }
    } catch (error) {
      state.t3Scenarios = t3ScenarioData;
      state.t3ScenariosLoaded = true;
      console.error("[track3:scenarios]", error);
      const current = state.currentScreen;
      if (current === "t3-scenario" || current === "t3-chat") {
        render();
        showScreen(current);
      }
    } finally {
      state.t3ScenariosLoading = false;
    }
  }

  function activeT3ScenarioId() {
    const selected = selectedT3Scenario();
    return selected.scenarioId || selected.key || state.t3ScenarioId || "pm";
  }

  function syncT3ChatTab(tabName = "chat") {
    const screen = document.querySelector('[data-screen="t3-chat"]');
    if (!screen) return;
    screen.dataset.t3Tab = tabName;
    screen
      .querySelectorAll("[data-t3-tab]")
      .forEach((button) => button.classList.toggle("is-active", button.dataset.t3Tab === tabName));
  }

  function extractT3AssistantMessage(result) {
    const payload = result?.result || result || {};
    return payload.assistantMessage
      || payload.message
      || payload.content
      || payload.response
      || payload.reply
      || "";
  }

  async function sendTrack3Chat() {
    const input = document.querySelector('[data-screen="t3-chat"] [data-t3-chat-input]');
    const rawMessage = input?.value || "";
    const userMessage = rawMessage.trim();
    state.t3Draft = rawMessage;
    if (!userMessage) return;
    if (userMessage.replace(/\s/g, "").length < 5) {
      t3ChatWarning = "내용을 조금 더 구체적으로 입력해주세요. 최소 5글자 이상 입력해야 AI 답변을 생성할 수 있습니다.";
      refreshT3ChatUi();
      return;
    }
    if (t3ChatPending) return;
    if (isT3TurnComplete()) {
      refreshT3ChatUi();
      return;
    }

    const turnsBeforeRequest = normalizedT3Turns();
    state.t3Draft = "";
    state.t3Turns = [...turnsBeforeRequest, { role: "user", content: userMessage }];
    t3ChatPending = true;
    t3ChatWarning = "";
    render();
    showScreen("t3-chat");
    syncT3ChatTab("chat");
    scrollT3ChatToBottom();

    try {
      const response = await postJson("/api/track3/chat", {
        scenarioId: activeT3ScenarioId(),
        turns: turnsBeforeRequest,
        userMessage,
        artifact: state.t3Artifact || "",
      });
      const payload = response.result || response;
      const responseTurns = normalizedT3Turns(payload.turns);
      const assistantMessage = extractT3AssistantMessage(response);
      state.t3Turns = responseTurns.length > 0
        ? responseTurns
        : [...state.t3Turns, ...(assistantMessage ? [{ role: "assistant", content: assistantMessage }] : [])];
      state.t3Artifact = payload.artifact || payload.finalOutput || state.t3Artifact || "";
      state.t3Draft = "";
    } catch (error) {
      state.t3Turns = turnsBeforeRequest;
      state.t3Draft = rawMessage;
      console.error("[track3:chat]", error);
    } finally {
      t3ChatPending = false;
      render();
      showScreen("t3-chat");
      syncT3ChatTab("chat");
      refreshT3ChatUi();
    }
  }

  function persistTrack3Result(result, requestPayload) {
    const respondent = respondentPayload();
    if (!respondent.respondentId) return;

    fireAndForgetPostJson("/api/track3/save", {
      ...respondent,
      scenarioId: requestPayload.scenarioId,
      turns: requestPayload.turns,
      finalOutput: requestPayload.finalOutput,
      earlyFinish: requestPayload.earlyFinish,
      evaluation: result?.result || result,
    });
  }

  async function submitTrack3() {
    if (!canSubmitT3()) {
      refreshT3ChatUi();
      return;
    }
    const loadingStartedAt = Date.now();
    render();
    showScreen("t3-loading");

    try {
      await ensureRespondentReady();
      const turns = normalizedT3Turns();
      const finalOutput = String(state.t3FinalOutput || state.t3Artifact || "").trim();
      const requestPayload = {
        scenarioId: activeT3ScenarioId(),
        turns,
        finalOutput,
        earlyFinish: getT3TurnCount() < 5,
      };
      const response = await postJson("/api/track3/submit", requestPayload);
      state.t3Result = response;
      persistTrack3Result(response, requestPayload);
    } catch (error) {
      state.t3Error = error.message || "Track 3 결과를 불러오지 못했습니다.";
      console.error("[track3:submit]", error);
    }

    await waitForMinimumLoading(loadingStartedAt);
    render();
    showScreen("t3-result");
  }

  window.__track3Submit = submitTrack3;

  t3Screens = function t3Screens() {
    state.t3Scenario = state.t3Scenario ?? 0;

    return [
      loginScreen("track3-login", "t3-intro"),
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
            <h2 class="t3-scenario-guide-title" hidden>먼저 평가받고 싶은<br />직무 상황을 선택하세요</h2>
            <p>Track 3는 선택한 시나리오를 바탕으로 AI와 5턴 동안 대화하며 최종 산출물을 만드는 실전 평가입니다.</p>
            <p>구체적인 상황 설명과 미션 가이드는 다음 화면에서 제공됩니다.</p>
            <h2>진행 방식</h2>
            <ul>
              <li>직무 시나리오 선택</li>
              <li>상황과 미션 확인</li>
              <li>AI와 5턴 대화</li>
              <li>최종 산출물 제출</li>
              <li>평가 리포트 확인</li>
            </ul>
            <p class="t3-scenario-guide-note" hidden>테스트를 통해 AI 실무 적용 점수와 피드백 레포트를 확인하실 수 있습니다</p>
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
          <h1 data-t3-mobile-title>${escapeHtml(t3UiText(t3ProjectName()))}</h1>
          <div class="t3-mobile-progress" data-t3-turn-progress><i></i><i></i><i></i><i></i><i></i></div>
          <nav class="t3-mobile-tabs" aria-label="Track 3 sections">
            <button type="button" data-t3-tab="brief" class="is-active">상황 설명</button>
            <button type="button" data-t3-tab="work">작업 영역</button>
            <button type="button" data-t3-tab="chat">AI 채팅</button>
          </nav>
        </section>
        <section class="t3-chat-layout">
          <aside class="t3-chat-brief" data-t3-chat-brief>${makeT3ChatBrief()}</aside>
          <section class="t3-workspace">
            <h2 class="t3-step-title"><span class="t3-step-badge" aria-hidden="true">4</span><span>최종 제출물 작업 영역</span></h2>
            <p>AI와 대화할수록 해당 영역이 채워집니다.<br>최대 5턴까지 대화 가능합니다.<br>작업 영역은 대화 진행에 따라 지속적으로 업데이트됩니다.<br>채팅 시작 전 AI에게는 시나리오 상황이 제공되어 있지 않습니다.</p>
            <div class="t3-artifact" data-t3-artifact>${makeT3Artifact()}</div>
          </section>
          <aside class="t3-chat-panel">
            <header><h2 class="t3-step-title"><span class="t3-step-badge" aria-hidden="true">3</span><span>AI 채팅</span></h2><span><i></i><i></i><i></i><i></i><i></i></span></header>
            <div class="t3-chat-messages" data-t3-chat-messages>${makeT3ChatMessages()}</div>
            <div class="t3-chat-footer">
            <label class="t3-chat-composer"><textarea rows="1" data-t3-chat-input placeholder="메시지 입력">${escapeHtml(state.t3Draft || "")}</textarea><button type="button" data-t3-chat-send>↑</button></label>
            <p class="t3-chat-warning" data-t3-chat-warning hidden></p>
            </div>
          </aside>
        </section>
        <nav class="t3-chat-actions">
          <button class="cta secondary t3-chat-back" type="button" data-t3-back-scenario>이전</button>
          ${button("제출", "t3-loading", "primary", "t3-submit")}
        </nav>`,
        "t3-screen t3-chat-screen"
      ),
      screen(
        "t3-loading",
        "T3-04 분석 로딩",
        `${header()}<section class="t3-loading-content"><h1>AI와 협업한 과정을<br />분석하는 중...</h1><div class="analysis-loading-mascot" aria-hidden="true"></div></section>`,
        "t3-screen t3-loading-screen"
      ),
      screen(
        "t3-result",
        "T3-05 결과 화면",
        `${header()}
        <section class="t3-result-layout">
          <article class="t3-result-score">
            <strong class="t3-grade">${escapeHtml(t3ResultGrade())}</strong>
            <h1>${t3ResultScore()}점</h1>
            <div class="t3-score-list">${makeT3ScoreRows()}</div>
          </article>
        </section>
        <nav class="t3-result-nav">
          ${button("상세 리포트 보기", "t3-report", "primary", "t3-detail-open")}
          <button class="cta secondary t3-result-share" type="button">공유하기</button>
        </nav>`,
        "t3-screen t3-result-screen"
      ),
      screen(
        "t3-report",
        "T3-08 상세 리포트",
        `${header()}
        <section class="t3-report-mobile">
          <h1>${escapeHtml(t3ResultHeadline())}</h1>
          <p class="t3-report-summary">${escapeHtml(t3ResultSummary())}</p>
          <div class="t3-detail-list">${makeT3DetailRows()}</div>
          <nav class="t3-report-nav">
            ${button("다른 Track 도전", "home", "primary", "t3-result-home t3-report-next")}
            ${button("이전", "t3-result", "secondary", "t3-report-back")}
          </nav>
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
    if (name === "t3-scenario" || name === "t3-chat") {
      loadT3Scenarios();
    }
    if (name === "t3-chat") {
      syncT3ChatScenario();
      const screen = document.querySelector('[data-screen="t3-chat"]');
      if (screen && !screen.dataset.t3Tab) screen.dataset.t3Tab = "brief";
      refreshT3ChatUi();
    }
  };

  if (typeof render === "function") {
    render();
  }

  let t3SharePending = false;

  async function shareT3Result(button) {
    if (t3SharePending || !button) return;
    const originalText = button.textContent;
    t3SharePending = true;
    button.disabled = true;
    button.textContent = "이미지 준비 중...";
    try {
      if (!window.ShareService?.shareResult) throw new Error("공유 서비스를 사용할 수 없습니다.");
      const outcome = await window.ShareService.shareResult("track3");
      button.textContent = outcome === "shared" ? "결과 공유창 열림" : "이미지 저장됨";
    } catch (error) {
      if (error?.name !== "AbortError") {
        button.textContent = "공유 실패";
        console.error("[track3:share]", error);
      }
    } finally {
      t3SharePending = false;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1400);
    }
  }

  document.addEventListener("click", (event) => {
    const shareButton = event.target.closest(".t3-result-share");
    if (shareButton) {
      event.preventDefault();
      shareT3Result(shareButton);
      return;
    }

    const resultHomeButton = event.target.closest(".t3-result-home");
    if (resultHomeButton) {
      event.preventDefault();
      state.t3Result = null;
      state.t3SaveResult = null;
      state.t3Error = "";
      render();
      const targetScreen = window.matchMedia("(max-width: 1180px)").matches
        ? "track"
        : "home";
      showScreen(targetScreen);
      return;
    }

    const backButton = event.target.closest("[data-t3-back-scenario]");
    if (backButton) {
      event.preventDefault();
      if (getT3TurnCount() > 0 && !window.confirm("다른 시나리오로 이동하면 현재 대화와 작업물이 초기화됩니다.")) return;

      state.t3Turns = [];
      state.t3Artifact = "";
      state.t3FinalOutput = "";
      state.t3Result = null;
      state.t3SaveResult = null;
      state.t3Error = "";
      state.t3Draft = "";
      t3ChatWarning = "";
      t3ChatPending = false;
      const scenarios = activeT3Scenarios();
      const nextScenario = Math.max(0, Number(state.t3Scenario || 0));
      state.t3Scenario = nextScenario;
      state.t3ScenarioId = scenarioIdOf(scenarios[nextScenario], nextScenario);
      render();
      showScreen("t3-scenario");
      return;
    }

    const scenarioButton = event.target.closest("[data-t3-scenario]");
    if (!scenarioButton) return;

    const nextScenario = Number(scenarioButton.dataset.t3Scenario) || 0;
    const scenarios = activeT3Scenarios();
    const nextScenarioId = scenarioIdOf(scenarios[nextScenario], nextScenario);
    if (state.t3ScenarioId && state.t3ScenarioId !== nextScenarioId) {
      state.t3Turns = [];
      state.t3Artifact = "";
      state.t3FinalOutput = "";
      state.t3Result = null;
      state.t3SaveResult = null;
      state.t3Draft = "";
      t3ChatWarning = "";
      t3ChatPending = false;
    }
    state.t3Scenario = nextScenario;
    state.t3ScenarioId = nextScenarioId;
    scenarioButton
      .closest(".t3-scenario-list")
      ?.querySelectorAll("[data-t3-scenario]")
      .forEach((button) => button.classList.toggle("is-selected", button === scenarioButton));
  }, true);

  document.addEventListener("click", (event) => {
    const sendButton = event.target.closest(".t3-chat-composer button");
    if (!sendButton) return;

    event.preventDefault();
    sendTrack3Chat();
  }, true);

  document.addEventListener("keydown", (event) => {
    const field = event.target.closest("[data-t3-chat-input]");
    if (
      !field
      || event.key !== "Enter"
      || event.shiftKey
      || event.ctrlKey
      || event.isComposing
      || event.repeat
    ) return;

    event.preventDefault();
    sendTrack3Chat();
  });

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

    state.t3Draft = field.value;
    if (t3ChatWarning) {
      t3ChatWarning = "";
      const warning = field.closest(".t3-chat-panel")?.querySelector("[data-t3-chat-warning]");
      if (warning) {
        warning.textContent = "";
        warning.hidden = true;
      }
    }
    autoResizeTrack3Textarea(field);
  });
})();
