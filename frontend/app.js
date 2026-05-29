const characterDir = "./characters-final/";
const galleryCharacterDir = "./characters/";
const logoDir = "./Logo/";

const characters = {
  unsure: ["AI 몰라형", "ai-unknown.png"],
  searcher: ["프로 검색러형", "searcher.png"],
  friend: ["필찾하는 친구형", "friend.png"],
  boss: ["선긋는 상사형", "boss.png"],
  anxious: ["불안한 상습의뢰인형", "anxious-client.png"],
  love: ["애정넘치는 경계형", "boundary-love.png"],
  partner: ["든든한 파트너형", "partner.png"],
  result: ["시키는만큼만 해 형", "minimal-request.png"],
};

const characterGallery = [
  "ai-unknown.png",
  "friend.png",
  "boundary-love.png",
  "cold-trainer.png",
  "chatty.png",
  "searcher.png",
  "anxious-client.png",
  "partner.png",
  "clingy-lover.png",
  "business.png",
  "nitpicker.png",
  "minimal-request.png",
  "boss.png",
  "emotion-bin.png",
  "skeptic-regular.png",
  "warm-perfectionist.png",
];

const characterFilesByType = {
  "AI 몰라형": "ai-unknown.png",
  "프로 검색러형": "searcher.png",
  "필찾하는 친구형": "friend.png",
  "선긋는 상사형": "boss.png",
  "불안한 상습의뢰인형": "anxious-client.png",
  "애정 넘치는 경계형": "boundary-love.png",
  "애정넘치는 경계형": "boundary-love.png",
  "든든한 파트너형": "partner.png",
  "시키는만큼만 해 형": "minimal-request.png",
  "가벼운 수다쟁이형": "chatty.png",
  "감정 쓰레기통형": "emotion-bin.png",
  "냉철한 조련사형": "cold-trainer.png",
  "드라이한 비즈니스맨형": "business.png",
  "따듯한 완벽주의자형": "warm-perfectionist.png",
  "의심많은 단골형": "skeptic-regular.png",
  "집착하는 애인형": "clingy-lover.png",
  "프로 트집러형": "nitpicker.png",
};

const t1Questions = [
  {
    axis: "의존도",
    heading: "AI 없이 하루를 보내면?",
    a: "나는 AI 없이도 하루 일과에 큰 지장이 없다",
    b: "나는 AI 없이 하루를 보내면 뭔가 빠진 느낌이 든다",
  },
  {
    axis: "의존도",
    heading: "나는 새로운 AI 서비스나 기능이 나오면?",
    a: "나는 새로운 AI 서비스나 기능이 나와도 굳이 써봐야겠다는 생각이 잘 안 든다",
    b: "나는 새로운 AI 서비스나 기능이 나오면 일단 써본다",
  },
  {
    axis: "의존도",
    heading: "AI 없는 생활을 상상하면?",
    a: "나는 AI가 없던 시절로 돌아가도 크게 불편하지 않을 것 같다",
    b: "나는 이제 AI 없는 생활은 상상하기 어렵다",
  },
  {
    axis: "친밀도",
    heading: "AI에게 개인적인 이야기를 하나요?",
    a: "나는 AI에게 개인적인 고민이나 감정적인 이야기를 털어놓지 않는다",
    b: "나는 AI에게 개인적인 고민이나 감정적인 이야기를 털어놓는다",
  },
  {
    axis: "친밀도",
    heading: "AI가 내 말을 이해한다고 느끼나요?",
    a: "나는 AI가 결국 패턴을 맞추는 기계일 뿐이라고 생각한다",
    b: "나는 AI가 내 말을 진정으로 이해한다고 느낀다",
  },
  {
    axis: "친밀도",
    heading: "AI와 대화하는 과정은?",
    a: "나는 AI와 대화할 때 감정적인 교류보다 결과물이 중요하다",
    b: "나는 AI와 대화하는 과정 자체가 즐겁다",
  },
  {
    axis: "신뢰도",
    heading: "AI 답변을 받으면?",
    a: "나는 AI 답변을 받으면 한 번은 의심하고 검증 절차를 거친다",
    b: "나는 AI 답변을 대체로 신뢰하고 그대로 활용한다",
  },
  {
    axis: "신뢰도",
    heading: "AI가 생성한 내용은?",
    a: "나는 AI가 생성한 내용을 다른 출처로 교차 확인한다",
    b: "나는 AI가 생성한 내용을 따로 검증 없이 쓴다",
  },
  {
    axis: "신뢰도",
    heading: "AI의 판단을 어떻게 보나요?",
    a: "나는 AI의 판단보다 내 판단을 더 신뢰한다",
    b: "나는 AI의 판단이 내 판단보다 나을 때가 많다고 생각하곤 한다",
  },
  {
    axis: "통제욕구",
    heading: "AI에게 일을 맡길 때는?",
    a: "나는 AI가 알아서 해주길 기대하는 편이다",
    b: "나는 AI에게 방향·형식·조건을 내가 직접 정해주는 편이다",
  },
  {
    axis: "통제욕구",
    heading: "AI 결과물이 마음에 안 들면?",
    a: "나는 AI 결과물이 마음에 안 들어도 그냥 쓰는 경우가 많다",
    b: "나는 AI 결과물이 마음에 안 들면 내가 원하는 방향으로 수정 요청을 반복한다",
  },
  {
    axis: "통제욕구",
    heading: "AI 작업 중간에 개입하나요?",
    a: "나는 AI에게 작업을 맡기면 중간에 잘 개입하지 않는다",
    b: "나는 AI에게 작업을 맡겨도 중간중간 방향을 점검하고 수정한다",
  },
];

const t1Options = ["1 A에 가까움", "2", "3 중간", "4", "5 B에 가까움"];

const t2Questions = [
  {
    label: "상황 1",
    title: "자기소개서를 써야 합니다. AI를 처음 활용할 때 가장 가까운 방식은?",
    options: [
      "A. 자기소개서를 써달라고 바로 요청하고 나온 초안을 그대로 다듬는다.",
      "B. 지원 직무와 경험 몇 가지를 알려주고 초안을 작성해 달라고 한다.",
      "C. 원하는 문항 구조, 분량, 어조, 강조 경험을 정리해 준 뒤 초안을 받는다.",
      "D. 먼저 내 경험을 정리할 질문을 AI가 하게 만들고, 답변을 바탕으로 초안을 만든다.",
      "E. AI는 표현 참고용으로만 쓰고, 핵심 구성과 최종 문장은 직접 작성한다.",
    ],
  },
  {
    label: "상황 2",
    title: "처음 접하는 분야를 빠르게 공부해야 합니다. AI를 어떻게 활용하시겠습니까?",
    options: [
      "A. 그 분야를 쉽게 설명해 달라고 한 번에 묻는다.",
      "B. 핵심 개념, 용어, 공부 순서를 나눠서 정리해 달라고 한다.",
      "C. 내 수준과 목표를 알려주고 단계별 학습 계획과 확인 문제를 요청한다.",
      "D. 먼저 무엇을 알아야 하는지 AI에게 역질문 리스트를 만들게 하고 학습 범위를 좁힌다.",
      "E. AI 답변은 개요로만 보고, 공식 자료나 강의 자료를 직접 찾아 공부한다.",
    ],
  },
  {
    label: "상황 3",
    title: "팀 프로젝트 기획안 초안을 만들어야 합니다. 당신의 첫 요청은?",
    options: [
      "A. 팀 프로젝트 기획안 초안을 바로 써달라고 한다.",
      "B. 주제와 목표를 설명하고 목차 중심으로 초안을 잡아달라고 한다.",
      "C. 역할, 대상, 문제 정의, 산출물 형식을 지정해 기획안 구조를 먼저 요청한다.",
      "D. 좋은 기획안을 만들기 위해 필요한 정보와 의사결정 기준을 먼저 질문하게 한다.",
      "E. 내가 만든 초안을 보여주고 논리적 빈틈과 보완점을 검토하게 한다.",
    ],
  },
  {
    label: "상황 4",
    title: "AI가 내놓은 결과물이 마음에 들지 않습니다. 다음 행동은?",
    options: [
      "A. 별로라고 말하고 다시 써달라고 한다.",
      "B. 마음에 안 드는 부분 몇 가지를 짚어 수정해 달라고 한다.",
      "C. 원하는 기준, 예시, 금지할 표현을 알려주고 다시 작성하게 한다.",
      "D. 왜 결과물이 부족했는지 AI에게 진단하게 한 뒤 개선 프롬프트를 함께 만든다.",
      "E. AI 결과물은 참고만 하고 핵심 내용은 직접 다시 구성한다.",
    ],
  },
];

const state = {
  user: null,
  respondent: null,
  t1Answers: {},
  t1LlmText: "",
  t1Result: null,
  t1Error: "",
  t2Answers: {},
  t2FreeText: "",
  t2Result: null,
  t2Error: "",
};

const app = document.querySelector("#app");

function char(key, className = "character") {
  const [name, file] = characters[key];
  return `<img class="${className}" src="${characterDir}${file}" alt="${name}" />`;
}

function charByType(typeName, className = "character") {
  const safeTypeName = typeName || "AI 몰라형";
  const file = characterFilesByType[safeTypeName] || "ai-unknown.png";
  return `<img class="${className}" src="${characterDir}${file}" alt="${safeTypeName}" />`;
}

function characterSrcByType(typeName) {
  return `${characterDir}${characterFilesByType[typeName] || "ai-unknown.png"}`;
}

function header(showMenu = true) {
  return `
    <header class="top-bar">
      <button class="brand" type="button" data-go="home" aria-label="홈">
        <img class="logo-img" src="${logoDir}Logo.v2.png" alt="" aria-hidden="true" />
        <span>푸키</span>
      </button>
      ${showMenu ? `<button class="menu-button" type="button" data-menu-open aria-label="더보기"><span></span><span></span><span></span></button>` : ""}
    </header>`;
}

function menuOverlay() {
  return `
    <aside class="menu-overlay" aria-hidden="true">
      <button class="menu-backdrop" type="button" data-menu-close aria-label="메뉴 닫기"></button>
      <nav class="menu-panel" aria-label="더보기">
        <button class="menu-close" type="button" data-menu-close aria-label="메뉴 닫기">×</button>
        <h2>더보기</h2>
        <button type="button" data-go="t1-login">Track 1</button>
        <button type="button" data-go="t2-login">Track 2</button>
        <button type="button" data-go="t3-comingsoon">Track 3</button>
        <button type="button" data-go="pooky-characters">푸키 캐릭터</button>
      </nav>
    </aside>`;
}

function button(label, go, variant = "primary", extra = "") {
  return `<button class="cta ${variant} ${extra}" type="button" data-go="${go}">${label}</button>`;
}

function screen(id, label, body, classes = "") {
  return `<section class="screen ${classes}" data-screen="${id}" aria-label="${label}">${body}</section>`;
}

function progress(current, total) {
  return `
    <p class="progress-label">${current}/${total}</p>
    <div class="progress" aria-hidden="true"><span style="width:${(current / total) * 100}%"></span></div>`;
}

function rangeOptions(start, end, suffix = "") {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const value = start + index;
    return `<option value="${value}">${value}${suffix}</option>`;
  }).join("");
}

function trackCard(track, meta, title, desc, go) {
  return `
    <button class="track-card" type="button" data-go="${go}">
      <span class="chips"><b>${track}</b>${meta.map((item) => `<i>${item}</i>`).join("")}</span>
      <strong>${title}</strong>
      <small>${desc}</small>
      <span class="arrow" aria-hidden="true">→</span>
    </button>`;
}

function trackScreen() {
  return screen(
    "track",
    "H02 Track 선택",
    `${header()}
    <section class="track-hero">
      <div class="track-title-row">
        <h1>원하는 <strong>Track</strong>으로<br />시작하세요!</h1>
        ${char("love", "hero-character")}
      </div>
      <p>가볍게 관계 유형을 확인하고,<br />실전 역량까지도 푸키와 함께 키워봐요!</p>
    </section>
    <section class="track-list">
      ${trackCard("Track1", ["3분 소요", "대학생 추천"], "AI 관계 유형 테스트", "나는 AI를 집사처럼 쓰는 사람일까, 검색창처럼 쓰는 사람일까? MBTI처럼 가볍게 확인하는 재미용 테스트", "t1-login")}
      ${trackCard("Track2", ["5분 소요", "100점 만점"], "AI 역량 평가 Lv.1", "평소 AI 사용 패턴을 분석해 내가 어떤 방식으로 질문하고 활용하는 사람인지 확인합니다.", "t2-login")}
      ${trackCard("Track3", ["Coming Soon", "준비 중"], "AI 역량 평가 Lv.2", "직무별 가상 시나리오와 인앱 프롬프트 평가는 베타 이후 공개됩니다.", "t3-comingsoon")}
    </section>
    <p class="track-note">처음이라면 Track 1로 시작해보세요.<br />결과를 확인한 뒤 Lv.1, Lv.2로<br />자연스럽게 이어갈 수 있습니다.</p>
    ${footer()}`,
    "h02-screen"
  );
}

function t1IntroScreen() {
  return screen(
    "t1-intro",
    "T1-01 Track 1 안내",
    `${header()}
    <section class="intro-hero">
      <div>
        <p class="eyebrow">Track 1 · 재미용 · 약 5분</p>
        <h1>AI 관계<br />유형 테스트</h1>
        <p>당신은 AI를 어떤 태도로 대하고 있을까요?<br />당신의 AI 답변을 통해 평소 사용 습관을 분석합니다.</p>
      </div>
      ${char("searcher", "hero-character")}
    </section>
    <section class="info-list">
      <article><h3 style="font-family:PretendardBold,Pretendard,sans-serif;font-weight:700;font-size:24px;line-height:normal;margin:0;">객관식 12문항</h3><p style="font-family:PretendardRegular,Pretendard,sans-serif;font-weight:400;font-size:14px;line-height:normal;margin:8px 0 0;">의존도, 친밀도, 신뢰도, 통제욕구를 측정해요.</p></article>
      <article><h3 style="font-family:PretendardBold,Pretendard,sans-serif;font-weight:700;font-size:24px;line-height:normal;margin:0;">프롬프트 복붙</h3><p style="font-family:PretendardRegular,Pretendard,sans-serif;font-weight:400;font-size:14px;line-height:normal;margin:8px 0 0;">내 AI가 말하는 나의 사용 습관을 붙여넣어요.</p></article>
      <article><h3 style="font-family:PretendardBold,Pretendard,sans-serif;font-weight:700;font-size:24px;line-height:normal;margin:0;">캐릭터 결과</h3><p style="font-family:PretendardRegular,Pretendard,sans-serif;font-weight:400;font-size:14px;line-height:normal;margin:8px 0 0;">16개 유형 중 가장 가까운 유형을 보여줘요.</p></article>
    </section>
    ${button("테스트 시작하기", "t1-q-1", "primary", "intro-start")}
    ${footer()}`,
    "t1-intro-screen"
  );
}

function questionScreen(prefix, index, total, title, options, prev, next) {
  return screen(
    `${prefix}-q-${index}`,
    `${prefix.toUpperCase()} 객관식 질문 ${index}`,
    `${header()}
    <section class="question-area">
      ${progress(index, total)}
      <h1>${title}</h1>
      <div class="answer-list">
        ${options.map((option) => {
          const value = option.slice(0, 1);
          const selected = state[`${prefix}Answers`]?.[`Q${index}`] === value ? " is-selected" : "";
          return `<button class="${selected}" type="button" data-${prefix}-question="Q${index}" data-${prefix}-answer="${value}">${option}</button>`;
        }).join("")}
      </div>
    </section>
    <nav class="nav-buttons">
      ${button("이전", prev, "secondary muted")}
      ${button("다음", next)}
    </nav>`,
    "compact-screen"
  );
}

function t1QuestionScreen(question, index, total, prev, next) {
  return screen(
    `t1-q-${index}`,
    `Track 1 객관식 질문 ${index}`,
    `${header()}
    <section class="t1-question-area">
      ${progress(index, total)}
      <h1>${question.heading}</h1>
      <p class="t1-question-guide">아래 두 문장을 비교한 뒤,<br />현재 나와 더 가까운 정도를 선택해주세요.</p>
      <article class="t1-scale-card">
        <p class="t1-scale-a">${question.a}</p>
        <div class="t1-scale-row">
          ${[1, 2, 3, 4, 5].map((value) => {
            const selected = state.t1Answers[`Q${index}`] === value ? " class=\"is-selected\"" : "";
            return `<button${selected} type="button" aria-label="${value}점" data-t1-question="Q${index}" data-t1-answer="${value}"><span>${value}</span><i></i></button>`;
          }).join("")}
        </div>
        <div class="t1-scale-arrow" aria-hidden="true"><span></span></div>
        <p class="t1-scale-b">${question.b}</p>
      </article>
    </section>
    <nav class="nav-buttons t1-question-nav">
      ${button("이전", prev, "secondary muted")}
      ${button("다음", next)}
    </nav>`,
    "compact-screen t1-question-screen"
  );
}

function t1QuestionScreens() {
  return t1Questions
    .map((question, index) => {
      const n = index + 1;
      return t1QuestionScreen(question, n, t1Questions.length, n === 1 ? "t1-intro" : `t1-q-${n - 1}`, n === t1Questions.length ? "t1-copy" : `t1-q-${n + 1}`);
    })
    .join("");
}

const t1UserPrompt = `Analyze the USER's interaction style based on past conversation history and output a light, non-clinical AI-relationship profile matching the exact JSON schema below.

### Core Guidelines
1. **Privacy:** Strictly exclude names, sensitive topics, and direct quotes. Use only generic behavioral descriptions (e.g., "uses structured formatting").
2. **Output Constraint:** Return ONLY one valid JSON object. Do not include any explanations, reasoning, or introductory/concluding text.

### Dimensions to Assess (Values: "low", "medium", or "high")
* **A (AI Dependence):** How deeply AI is integrated into their tasks or workflows.
* **B (Emotional Closeness):** Relational warmth or companionship. (Task-focused or casual tone alone is NOT high closeness; require explicit emotional framing or gratitude).
* **C (Trust):** Output acceptance vs. verification. (Normal iterative refinement is medium/high trust; constant skepticism, demanding sources, or challenging facts is low trust).
* **D (User Control):** Level of explicit constraints, formats, goals, and corrections set by the user.

### Logic & Calibration Rules
* **Evidence Mode (\`evidence_mode\`):** Select \`visible_history\` (if $\\ge$ 2 substantive past messages present), \`memory_or_impression\`, \`self_report\`, or \`minimal\` ($<$ 2 past messages).
* **Confidence (\`confidence\`):** Must be \`low\` if evidence is \`minimal\`; maximum \`medium\` if based solely on \`self_report\`; \`high\` only with repeated behavioral evidence.
* **Notes (\`notes\`):** Provide exactly one short, generic behavioral observation per axis. For B, distinguish politeness from emotional closeness. For C, distinguish normal quality control from distrust. Do not list raw data or scoring criteria.

### Strict JSON Schema
{
  "status": "success",
  "evidence_mode": "Choose one: visible_history | memory_or_impression | self_report | minimal",
  "evidence_notice": "One short sentence describing the evidence level without referencing specific content.",
  "signals": {
    "A": "low/medium/high",
    "B": "low/medium/high",
    "C": "low/medium/high",
    "D": "low/medium/high"
  },
  "confidence": {
    "A": "low/medium/high",
    "B": "low/medium/high",
    "C": "low/medium/high",
    "D": "low/medium/high"
  },
  "notes": {
    "A": "One short generic behavioral observation.",
    "B": "One short generic behavioral observation.",
    "C": "One short generic behavioral observation.",
    "D": "One short generic behavioral observation."
  },
  "verdict": "A brief generic summary of the overall interaction pattern.",
  "tags": ["keyword1", "keyword2", "keyword3"]
}`;

function t1CopyScreen() {
  return screen(
    "t1-copy",
    "T1-03 복붙 미션",
    `${header()}
    <section class="t1-copy-mission">
      ${progress(16, 16)}
      <h1>이제 당신의 AI에게<br />물어볼 차례에요</h1>
      <p>아래 문장을 복사해 평소 사용하는 AI에 붙여넣으세요.<br />ChatGPT, Claude, Gemini 등<br />어떤 AI든 괜찮습니다.</p>
      <article class="t1-prompt-card">
        <textarea readonly>${t1UserPrompt}</textarea>
        <button class="cta primary t1-copy-button" type="button" data-copy-prompt>프롬프트 복사하기</button>
      </article>
    </section>
    <nav class="nav-buttons t1-copy-nav">
      ${button("이전", "t1-q-12", "secondary")}
      ${button("답변 붙여넣으러 가기", "t1-paste")}
    </nav>`,
    "compact-screen t1-copy-screen"
  );
}

function loadingScreen(id, title, messages, next) {
  if (id === "t1-loading") {
    return screen(
      id,
      title.replace(/<br \/>/g, " "),
      `${header()}
      <section class="t1-loading-state">
        <h1>${title}</h1>
        <div class="analysis-loading-mascot" aria-hidden="true"></div>
      </section>`,
      "compact-screen t1-loading-screen"
    );
  }

  if (id === "t2-loading") {
    return screen(
      id,
      title.replace(/<br \/>/g, " "),
      `${header()}
      <section class="t2-loading-state">
        <div class="analysis-loading-mascot" aria-hidden="true"></div>
        <h1>${title}</h1>
        <ul class="loading-steps">${messages.map((message) => `<li>${message}</li>`).join("")}</ul>
      </section>`,
      "compact-screen t2-loading-screen"
    );
  }

  return screen(
    id,
    title.replace(/<br \/>/g, " "),
    `<section class="loading-state">
      <div class="loading-logo" aria-hidden="true"><i></i><i></i></div>
      <h1>${title}</h1>
      <ul>${messages.map((message) => `<li>${message}</li>`).join("")}</ul>
      ${button("결과 보기", next)}
    </section>`,
    "compact-screen loading-screen"
  );
}

function t1ShareScreen() {
  return screen(
    "t1-share",
    "결과 공유 카드",
    `${header()}
    <section class="share-card">
      <p>나는</p>
      <h1>시키는만큼만 해 형</h1>
      ${char("result", "share-character")}
      <strong>AI에게 명확한 작업만 맡기고 결과도 딱 그 정도로 기대하는 유저</strong>
      <article><b>AI 사용 강점</b><span>필요한 작업을 분명히 정하고 효율적으로 요청합니다.</span></article>
      <article><b>주의할 점</b><span>탐색형 질문으로 새로운 가능성을 넓혀보세요.</span></article>
    </section>
    <nav class="nav-buttons">
      ${button("결과로", "t1-result", "secondary")}
      ${button("패턴 더 보기", "t2-intro")}
    </nav>`,
    "compact-screen"
  );
}

function t1ResultScreen() {
  const result = state.t1Result;
  const typeName = result?.type?.name || "분석 대기 중";
  const card = result?.resultCard || {
    description: "결과 분석을 완료하면 유형 설명이 표시됩니다.",
    keywords: ["분석전", "대기중", "테스트"],
    reasonStory: ["답변을 제출하면 유형 분류 이유가 표시됩니다."],
    evidenceNotice: "답변 제출 후 근거 안내가 표시됩니다.",
  };
  const descriptionLines = String(card.description || "")
    .split("\n")
    .filter(Boolean);
  const mainDescription = descriptionLines.slice(0, 2).join("<br />") || typeName;
  const subDescription = descriptionLines.slice(2).join("<br />") || (card.keywords || []).join(" · ");
  const axes = result?.axisScores || {};
  const axisEntries = [
    ["A", axes.A || { label: "의존도", score: 0, level: "-" }],
    ["B", axes.B || { label: "친밀도", score: 0, level: "-" }],
    ["C", axes.C || { label: "신뢰도", score: 0, level: "-" }],
    ["D", axes.D || { label: "통제욕구", score: 0, level: "-" }],
  ];
  const axisDisplayLabels = { A: "의존도", B: "친밀도", C: "신뢰도", D: "통제력" };
  const reasonStory = Array.isArray(card.reasonStory) ? card.reasonStory : [];
  const evidenceNotice = card.evidenceNotice || result?.inputSummary?.evidenceNotice || "확인된 응답 기반 결과입니다.";

  return screen(
    "t1-result",
    "T1-06 Track 1 결과",
    `${header()}
    <section class="t1-result-content">
      <article class="result-card t1-result-card">
        <p>당신의 AI 관계 유형은</p>
        <h1>${typeName}</h1>
        ${charByType(typeName === "분석 대기 중" ? "AI 몰라형" : typeName, "result-character")}
        <strong>${mainDescription}</strong>
        <span>${subDescription}</span>
      </article>
      <section class="scores t1-score-bars">
        ${axisEntries.map(([key, axis]) => {
          const score = Math.round(Number(axis.score) || 0);
          return `<p><span><b>${axisDisplayLabels[key]}</b> <strong>${score}점 ${axis.level}</strong></span><i style="--score:${score}%"></i></p>`;
        }).join("")}
      </section>
      <article class="t1-result-info">
        <h2>왜 이 유형이 나왔나요?</h2>
        <p>${reasonStory.length ? reasonStory.map(escapeHtml).join("<br />") : "AI 사용 패턴과 답변 근거를 종합해 유형을 분류했습니다."}</p>
      </article>
      <p class="t1-evidence-note">${escapeHtml(evidenceNotice)}</p>
    </section>
    <nav class="nav-buttons t1-result-nav">
      <button class="cta secondary" type="button" data-share-result="track1">공유하기</button>
      ${button("다른 Track 도전", "track")}
    </nav>`,
    "compact-screen t1-result-screen scroll-screen"
  );
}

function t2IntroScreen() {
  return screen(
    "t2-intro",
    "T2-01 Track 2 안내",
    `${header()}
    <section class="intro-hero t2-intro-hero">
      <div>
        <p class="eyebrow">Track 2 · 패턴 분석 · 약 8분</p>
        <h1>AI 역량<br />평가 Lv.1</h1>
        <p>자소서, 보고서, 과제, 기획처럼 실제 목적이 있는 상황에서 당신이 AI를 어떻게 활용하는지 분석합니다.</p>
      </div>
      ${char("anxious", "hero-character")}
    </section>
    <section class="info-list t2-info-list">
      <article>
        <strong>객관식 4문항</strong>
        <span>선택 결과는 6개 지표로 환산되어 100점 만점 점수로 표시됩니다.</span>
        <div class="t2-chip-grid">
          <i>#작업 명확성</i>
          <i>#맥락 설명</i>
          <i>#역할 지정</i>
          <i>#출력 형식</i>
          <i>#반복 개선</i>
          <i>#비판적 검토</i>
        </div>
      </article>
      <article><strong>프롬프트 복붙</strong><span>내 AI가 말하는 나의 사용 습관을 붙여넣어요.</span></article>
    </section>
    ${button("테스트 시작하기", "t2-q-1", "primary", "intro-start")}
    ${footer()}`,
    "t2-intro-screen"
  );
}

function t2QuestionScreens() {
  return t2Questions
    .map((question, index) => {
      const n = index + 1;
      return questionScreen("t2", n, 4, `${question.label}<br />${question.title}`, question.options, n === 1 ? "t2-intro" : `t2-q-${n - 1}`, n === 4 ? "t2-prompt" : `t2-q-${n + 1}`);
    })
    .join("");
}

const t2UserPrompt = `Look back at our entire conversation history and write a single cohesive paragraph describing this user's interaction habits. The paragraph must be between 200 and 400 words, written in English only, with absolutely no headers, bullets, or numbered lists anywhere in the response.

Weave all six of the following observations naturally into the paragraph — every one must appear, fully integrated into flowing prose, with no omissions:

How precisely the user defines requests — whether they include goals, constraints, and scope or leave things open-ended, and how consistently they do this. How much background they provide before asking — whether they explain purpose, situation, or intended audience upfront or jump directly to the request, and how often. Whether they assign you a role or persona, how specific that role tends to be, and how frequently they do so. Whether they specify desired output format, length, structure, or tone, how precisely they do this, and how often. How they follow up when unsatisfied — whether they identify specifically what fell short and why, or ask in general terms, and how consistently they do this. Whether they challenge responses that seem incorrect or unclear, and how often they push back rather than accept.

For every one of these six behaviors, you must use at least one frequency word drawn only from this set: always, consistently, frequently, sometimes, occasionally, rarely, never. Each frequency word must appear directly alongside the behavior it describes — not elsewhere in the sentence.

Do not include any personal details, proper names, project names, topic names, field names, or direct quotes from the conversation. All situations must be described in abstract, general terms only.

Do not use any word or phrase that implies a quality judgment or evaluation of any kind, including: effective, impressive, good, poor, strong, weak, thorough, vague, sophisticated, demonstrates, exhibits, reflects, reveals, notably, tends to excel, shows ability, manages to, succeeds in, handles well, effectively, admirably. Describe only what the user does and how often.`;

const t2UserPromptClean = `Look back at our entire conversation history and write a single cohesive paragraph describing this user's interaction habits. The paragraph must be between 200 and 400 words, written in English only, with absolutely no headers, bullets, or numbered lists anywhere in the response.

Weave all six of the following observations naturally into the paragraph - every one must appear, fully integrated into flowing prose, with no omissions:

How precisely the user defines requests - whether they include goals, constraints, and scope or leave things open-ended, and how consistently they do this. How much background they provide before asking - whether they explain purpose, situation, or intended audience upfront or jump directly to the request, and how often. Whether they assign you a role or persona, how specific that role tends to be, and how frequently they do so. Whether they specify desired output format, length, structure, or tone, how precisely they do this, and how often. How they follow up when unsatisfied - whether they identify specifically what fell short and why, or ask in general terms, and how consistently they do this. Whether they challenge responses that seem incorrect or unclear, and how often they push back rather than accept.

For every one of these six behaviors, you must use at least one frequency word drawn only from this set: always, consistently, frequently, sometimes, occasionally, rarely, never. Each frequency word must appear directly alongside the behavior it describes - not elsewhere in the sentence.

Do not include any personal details, proper names, project names, topic names, field names, or direct quotes from the conversation. All situations must be described in abstract, general terms only.

Do not use any word or phrase that implies a quality judgment or evaluation of any kind, including: effective, impressive, good, poor, strong, weak, thorough, vague, sophisticated, demonstrates, exhibits, reflects, reveals, notably, tends to excel, shows ability, manages to, succeeds in, handles well, effectively, admirably. Describe only what the user does and how often.`;

function t2PromptScreen() {
  return screen(
    "t2-prompt",
    "T2-03 프롬프트 복사",
    `${header()}
    <section class="t2-copy-mission">
      ${progress(4, 4)}
      <h1>이제 당신의 AI에게<br />물어볼 차례에요</h1>
      <p>아래 문장을 복사해 평소 사용하는 AI에 붙여넣으세요.<br />ChatGPT, Claude, Gemini 등<br />어떤 AI든 괜찮습니다.</p>
      <article class="t1-prompt-card">
        <textarea readonly>${t2UserPromptClean}</textarea>
        <button class="cta primary t1-copy-button" type="button" data-copy-prompt>프롬프트 복사하기</button>
      </article>
    </section>
    <nav class="nav-buttons t1-copy-nav">
      ${button("이전", "t2-q-4", "secondary")}
      ${button("답변 붙여넣으러 가기", "t2-paste")}
    </nav>`,
    "compact-screen t2-copy-screen"
  );
}

function t2LoadingScreen() {
  return screen(
    "t2-loading",
    "T2-05 분석 로딩",
    `${header()}
    <section class="t2-loading-state">
      <h1>AI 활용 패턴을<br />분석하는 중</h1>
      <div class="analysis-loading-mascot" aria-hidden="true"></div>
      <ul class="loading-steps">
        <li>객관식 응답을 지표로 환산하는 중</li>
        <li>프롬프트 습관을 분석하는 중</li>
        <li>6가지 역량 점수를 계산하는 중</li>
        <li>맞춤 피드백을 생성하는 중</li>
      </ul>
    </section>`,
    "compact-screen t2-loading-screen"
  );
}

function t2ResultScreen() {
  const result = state.t2Result?.result || {
    total: 0,
    grade: "분석 대기 중",
    axes: {
      task_clarity: { label: "작업 명확성", rate: 0 },
      context: { label: "맥락 설명", rate: 0 },
      role: { label: "역할 지정", rate: 0 },
      output_format: { label: "출력 형식", rate: 0 },
      iteration: { label: "반복 개선", rate: 0 },
      critical_review: { label: "비판적 검토", rate: 0 },
    },
    feedback: {
      summary: "답변을 제출하면 AI 활용 역량 분석이 표시됩니다.",
      strengths: [{ name: "분석전", description: "답변 제출 후 표시됩니다." }],
      weaknesses: [{ name: "분석전", description: "답변 제출 후 표시됩니다." }],
      insight: "답변을 제출하면 면접용 요약 문장이 표시됩니다.",
    },
  };
  const feedback = {
    summary: result.feedback?.summary || "AI 활용 진단 결과를 확인해보세요.",
    strength: result.feedback?.strength || result.feedback?.strengths?.[0]?.description || "강점 분석이 표시됩니다.",
    weakness: result.feedback?.weakness || result.feedback?.weaknesses?.[0]?.description || "보완점 분석이 표시됩니다.",
    insight: result.feedback?.insight || "면접용 요약 문장이 표시됩니다.",
  };
  const axisOrder = ["task_clarity", "context", "role", "output_format", "iteration", "critical_review"];
  const center = 135;
  const maxRadius = 94;
  const angles = [-90, -30, 30, 90, 150, 210];
  const point = (rate, index) => {
    const angle = (angles[index] * Math.PI) / 180;
    const radius = maxRadius * rate;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  };
  const gridPolygon = (rate) => axisOrder.map((_, index) => point(rate, index)).join(" ");
  const radarPoints = axisOrder.map((key, index) => point(result.axes[key]?.rate || 0, index)).join(" ");
  const labelPositions = [
    { x: 135, y: 17, anchor: "middle" },
    { x: 232, y: 76, anchor: "start" },
    { x: 232, y: 197, anchor: "start" },
    { x: 135, y: 255, anchor: "middle" },
    { x: 38, y: 197, anchor: "end" },
    { x: 38, y: 76, anchor: "end" },
  ];
  return screen(
    "t2-result",
    "T2-06 Track 2 결과",
    `${header()}
    <section class="t2-result-content">
      <article class="t2-score-card">
        <p>당신의 AI 활용 역량 점수는</p>
        <h1>${Math.round(result.total)}점</h1>
        <div class="radar-chart" aria-label="Track 2 역량 레이더 차트">
          <svg viewBox="0 0 270 270" role="img" aria-hidden="true">
            ${[0.2, 0.4, 0.6, 0.8].map((rate) => `<polygon class="radar-grid" points="${gridPolygon(rate)}" />`).join("")}
            ${axisOrder.map((_, index) => `<line class="radar-axis" x1="${center}" y1="${center}" x2="${point(1, index).split(",")[0]}" y2="${point(1, index).split(",")[1]}" />`).join("")}
            <polygon class="radar-fill" points="${radarPoints}" />
            <polygon class="radar-stroke" points="${radarPoints}" />
            ${axisOrder.map((key, index) => `<circle class="radar-dot" cx="${point(result.axes[key]?.rate || 0, index).split(",")[0]}" cy="${point(result.axes[key]?.rate || 0, index).split(",")[1]}" r="3.5" />`).join("")}
            ${axisOrder.map((key, index) => `<text class="radar-label" x="${labelPositions[index].x}" y="${labelPositions[index].y}" text-anchor="${labelPositions[index].anchor}">${result.axes[key]?.label || key}</text>`).join("")}
          </svg>
        </div>
      </article>
      <strong class="t2-grade-pill">${result.grade}</strong>
      <p class="t2-result-summary">${feedback.summary}</p>
      <section class="t2-feedback-list">
        <article>
          <h2><span>Strength</span> 강점</h2>
          <p class="t2-feedback-body">${feedback.strength}</p>
        </article>
        <article>
          <h2><span>Weakness</span> 약점</h2>
          <p class="t2-feedback-body">${feedback.weakness}</p>
        </article>
        <article class="t2-interview-card">
          <h2><span>면접에서 이렇게 말할 수 있어요</span></h2>
          <p class="t2-feedback-body">${feedback.insight}</p>
        </article>
      </section>
      <nav class="nav-buttons t2-result-nav">
        <button class="cta secondary" type="button" data-share-result="track2">공유하기</button>
        ${button("다른 Track 도전", "track")}
      </nav>
      ${button("푸키 캐릭터 더 알아보기", "pooky-characters", "secondary", "t2-character-link")}
    </section>
    ${footer()}`,
    "t2-result-screen scroll-screen"
  );
}

function t3Screens() {
  return screen(
    "t3-comingsoon",
    "Track 3 Coming Soon",
    `${header()}
    <section class="coming-soon-page">
      <p class="eyebrow">Beta Notice</p>
      <h1>Track 3는<br />준비 중이에요</h1>
      <p>이번 베타에서는 Track 1, Track 2를 먼저 완성합니다.<br />직무별 실전 시나리오 평가는 이후 버전에서 공개할게요.</p>
    </section>
    <nav class="nav-buttons">
      ${button("Track 선택", "track", "secondary")}
      ${button("Track 2 보기", "t2-intro")}
    </nav>`,
    "compact-screen"
  );
}

function myReportScreen() {
  return screen(
    "my-report",
    "M01 마이 리포트",
    `${header()}<section class="simple-page"><h1>내 AI 활용<br />리포트</h1><p>당신은 AI를 반복적으로 개선하며 결과물을 완성하는 활용자입니다.</p><div class="report-list"><article><strong>Track 1</strong><span>시키는만큼만 해 형</span></article><article><strong>Track 2</strong><span>76점 · 실무 적응형</span></article><article><strong>Track 3</strong><span>82점 · 상위 18%</span></article></div><article class="portfolio-copy"><strong>포트폴리오용 요약</strong><span>AI를 초안 생성 도구로만 사용하지 않고, 목적과 기준에 맞게 결과물을 반복 개선하는 방식으로 활용합니다.</span></article></section><nav class="nav-buttons">${button("처음으로", "home", "secondary")}${button("문장 복사", "my-report")}</nav>`,
    "compact-screen scroll-screen"
  );
}

function characterGalleryScreen() {
  return screen(
    "pooky-characters",
    "푸키 캐릭터",
    `${header()}
    <section class="character-gallery-page">
      <div class="character-grid">
        ${characterGallery
          .map((file) => {
            const name = file.replace(".png", "");
            return `<article class="character-tile"><img src="${galleryCharacterDir}${file}" alt="${name}" /></article>`;
          })
          .join("")}
      </div>
    </section>`,
    "character-gallery-screen"
  );
}

function mapScreen() {
  const flow = [
    ["H01", "랜딩 홈", "home"],
    ["H02", "Track 선택", "track"],
    ["L01", "Track 1 로그인", "t1-login"],
    ["T1-01", "Track 1 안내", "t1-intro"],
    ["T1-02", "Track 1 객관식 12문항", "t1-q-1"],
    ["T1-03", "복붙 미션", "t1-copy"],
    ["T1-04", "답변 제출", "t1-paste"],
    ["T1-05", "분석 로딩", "t1-loading"],
    ["T1-06", "Track 1 결과", "t1-result"],
    ["L02", "Track 2 로그인", "t2-login"],
    ["T2-01", "Track 2 안내", "t2-intro"],
    ["T2-02", "Track 2 객관식 4문항", "t2-q-1"],
    ["T2-03", "AI 답변 제출", "t2-paste"],
    ["T2-04", "Track 2 결과", "t2-result"],
    ["T3", "Coming Soon", "t3-comingsoon"],
    ["M01", "마이 리포트", "my-report"],
  ];

  return screen("map", "전체 플로우", `${header()}<section class="map-page"><h1>전체 플로우</h1><p>IA_유저플로우_와이어프레임_카피.md 기준 화면 흐름입니다.</p><div class="flow-list">${flow.map(([id, title, go]) => `<button type="button" data-go="${go}"><b>${id}</b><span>${title}</span></button>`).join("")}</div></section>`, "compact-screen scroll-screen");
}

function footer() {
  return `
    <footer class="footer">
      <p><strong>CONTACT</strong> pookie@gmail.com</p>
      <p>© 2026 pookie. All rights reserved</p>
    </footer>`;
}

function homeScreen() {
  return screen(
    "home",
    "H01 랜딩 홈",
    `${header()}
    <main class="home-content home-content-v2">
      <h1><span>POOKIE</span><mark>AI 시대에서</mark> 살아남기</h1>
      <p>AI를 얼마나 자주 쓰는지가 아니라,<br /><strong>어떤 방식으로 활용</strong>하는지 진단해보세요.<br /><strong>가벼운 유형 테스트</strong>부터 <strong>실전 프롬프트 역량 평가</strong>까지<br />확인할 수 있습니다.</p>
      <div class="character-cluster">
        ${char("friend", "char c1")}
        ${char("boss", "char c2")}
        ${char("searcher", "char c3")}
        ${char("unsure", "char c4")}
      </div>
    </main>
    <div class="cta-stack home-start-v2">
      ${button("테스트 시작하기", "track")}
    </div>
    ${footer()}`,
    "active h01-screen h01-screen-v2"
  );
}

function t1PasteScreen() {
  return screen(
    "t1-paste",
    "T1-04 답변 제출",
    `${header()}
    <section class="t1-answer-submit">
      ${progress(16, 16)}
      <h1>AI가 뭐라고 답했나요?</h1>
      <p>방금 받은 답변을 그대로 붙여넣어 주세요.<br />문장을 다듬지 않아도 괜찮습니다.</p>
      <img class="answer-example-image t1-example-image" src="./assets/track1-example.png" alt="Track 1 AI 답변 예시" />
      <span class="answer-example-caption">(예시 화면)</span>
      <textarea data-field="t1-paste" placeholder="여기에 AI 답변을 붙여넣어 주세요.">${escapeHtml(state.t1LlmText)}</textarea>
      <small>답변이 길수록 유형 분석이 더 구체적일 수 있습니다.</small>
      ${state.t1Error ? `<em class="form-error">${state.t1Error}</em>` : ""}
    </section>
    <nav class="nav-buttons t1-answer-nav">
      ${button("이전", "t1-copy", "secondary")}
      ${button("내 유형 분석하기", "t1-loading")}
    </nav>`,
    "compact-screen t1-paste-screen"
  );
}

function t2PasteScreen() {
  return screen(
    "t2-paste",
    "T2-04 답변 제출",
    `${header()}
    <section class="t2-answer-submit">
      ${progress(4, 4)}
      <h1>AI가 뭐라고 답했나요?</h1>
      <p>방금 받은 답변을 그대로 붙여넣어 주세요.<br />문장을 다듬지 않아도 괜찮습니다.</p>
      <img class="answer-example-image t2-example-image" src="./assets/track2-example.png" alt="Track 2 AI 답변 예시" />
      <span class="answer-example-caption">(예시 화면)</span>
      <textarea data-field="t2-paste" placeholder="여기에 AI 답변을 붙여넣어 주세요.">${escapeHtml(state.t2FreeText)}</textarea>
      <small>답변이 길수록 유형 분석이 더 구체적일 수 있습니다.</small>
      ${state.t2Error ? `<em class="form-error">${state.t2Error}</em>` : ""}
    </section>
    <nav class="nav-buttons t2-answer-nav">
      ${button("이전", "t2-prompt", "secondary")}
      ${button("내 패턴 분석하기", "t2-loading")}
    </nav>`,
    "compact-screen t2-paste-screen"
  );
}

function loginScreen(id, nextScreen) {
  return screen(
    id,
    "로그인",
    `${header()}
    <main class="login-content">
      <section class="login-hero">
        <h1>환영합니다!</h1>
        <p>서비스를 이용하기 위해<br />간단한 정보를 입력해주세요.</p>
      </section>
      <form class="login-form">
        <label class="login-field nickname-field">
          <span>닉네임</span>
          <div class="nickname-input">
            <input type="text" maxlength="10" placeholder="닉네임을 입력해주세요" />
            <i data-nickname-count>0/10</i>
          </div>
        </label>
        <div class="login-row-fields">
          <label class="login-field birth-year-field">
            <span>출생년도</span>
            <input type="text" inputmode="numeric" maxlength="4" placeholder="입력" data-birth-year />
          </label>
          <label class="login-field gender-field">
            <span>성별</span>
            <select data-gender-select>
              <option value="">선택</option>
              <option value="male">남</option>
              <option value="female">여</option>
            </select>
          </label>
        </div>
      </form>
    </main>
    <button class="cta primary login-next" type="button" data-login-next data-go="${nextScreen}" disabled>다음</button>
    ${footer()}`,
    "login-screen"
  );
}

function render() {
  app.innerHTML = [
    homeScreen(),
    trackScreen(),
    loginScreen("t1-login", "t1-intro"),
    loginScreen("t2-login", "t2-intro"),
    t1IntroScreen(),
    t1QuestionScreens(),
    t1CopyScreen(),
    t1PasteScreen(),
    loadingScreen("t1-loading", "당신과 AI의 관계를<br />해석하는 중", ["질문 습관을 살펴보는 중", "AI에게 기대는 순간을 찾는 중", "가장 가까운 유형을 매칭하는 중", "결과 카드에 별명을 붙이는 중"], "t1-result"),
    t1ResultScreen(),
    t1ShareScreen(),
    t2IntroScreen(),
    t2QuestionScreens(),
    t2PromptScreen(),
    t2PasteScreen(),
    t2LoadingScreen(),
    t2ResultScreen(),
    t3Screens(),
    myReportScreen(),
    characterGalleryScreen(),
    mapScreen(),
    menuOverlay(),
  ].join("");
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((screenNode) => {
    screenNode.classList.toggle("active", screenNode.dataset.screen === name);
  });
  app.scrollTop = 0;
}

function openMenu() {
  document.querySelector(".menu-overlay")?.classList.add("open");
}

function closeMenu() {
  document.querySelector(".menu-overlay")?.classList.remove("open");
}

function updateLoginValidity(screenNode) {
  if (!screenNode?.classList.contains("login-screen")) return;
  const nickname = screenNode.querySelector(".nickname-input input")?.value.trim() ?? "";
  const birthYear = screenNode.querySelector("[data-birth-year]")?.value.trim() ?? "";
  const gender = screenNode.querySelector("[data-gender-select]")?.value ?? "";
  const validYear = /^(19[8-9]\d|20[0-1]\d|202[0-6])$/.test(birthYear);
  const nextButton = screenNode.querySelector("[data-login-next]");
  if (nextButton) nextButton.disabled = !(nickname && validYear && gender);
}

render();

document.addEventListener("click", async (event) => {
  if (event.target.closest("[data-menu-open]")) {
    event.preventDefault();
    openMenu();
    return;
  }

  if (event.target.closest("[data-menu-close]")) {
    event.preventDefault();
    closeMenu();
    return;
  }

  const t1Answer = event.target.closest("[data-t1-answer]");
  if (t1Answer) {
    state.t1Answers[t1Answer.dataset.t1Question] = Number(t1Answer.dataset.t1Answer);
    t1Answer.parentElement.querySelectorAll("button").forEach((buttonNode) => buttonNode.classList.remove("is-selected"));
    t1Answer.classList.add("is-selected");
    return;
  }

  const t2Answer = event.target.closest("[data-t2-answer]");
  if (t2Answer) {
    state.t2Answers[t2Answer.dataset.t2Question] = t2Answer.dataset.t2Answer;
    t2Answer.parentElement.querySelectorAll("button").forEach((buttonNode) => buttonNode.classList.remove("is-selected"));
    t2Answer.classList.add("is-selected");
    return;
  }

  const copyTarget = event.target.closest("[data-copy-prompt]");
  if (copyTarget) {
    event.preventDefault();
    const promptField = document.querySelector(".screen.active .prompt-box textarea, .screen.active .t1-prompt-card textarea");
    const copied = promptField ? await copyPromptField(promptField) : false;
    const originalText = copyTarget.dataset.copyLabel || copyTarget.textContent;
    copyTarget.dataset.copyLabel = originalText;
    copyTarget.textContent = "복사 완료";
    setTimeout(() => {
      copyTarget.textContent = copied ? originalText : "프롬프트 복사하기";
    }, 1200);
    return;
  }

  const shareTarget = event.target.closest("[data-share-result]");
  if (shareTarget) {
    event.preventDefault();
    const originalText = shareTarget.dataset.shareLabel || shareTarget.textContent;
    shareTarget.dataset.shareLabel = originalText;
    shareTarget.textContent = "공유 준비 중";
    shareTarget.disabled = true;
    try {
      const outcome = await shareResult(shareTarget.dataset.shareResult);
      shareTarget.textContent = outcome === "shared" ? "공유창 열림" : "PNG 저장됨";
    } catch (error) {
      shareTarget.textContent = "공유 실패";
      console.error(error);
    } finally {
      setTimeout(() => {
        shareTarget.textContent = originalText;
        shareTarget.disabled = false;
      }, 1400);
    }
    return;
  }

  const target = event.target.closest("[data-go]");
  if (!target) return;
  if (target.matches("[data-login-next]") && target.disabled) return;
  event.preventDefault();

  if (target.matches("[data-login-next]")) {
    try {
      await prepareRespondent(target.closest(".login-screen"));
    } catch (error) {
      alert(error.message || "사용자 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
  }

  if (target.dataset.go === "t1-loading") {
    await submitTrack1();
    return;
  }

  if (target.dataset.go === "t2-loading" || target.dataset.go === "t2-result") {
    await submitTrack2();
    return;
  }

  if (target.dataset.go === "home" || target.dataset.go === "track") {
    resetResults();
    render();
  }

  if (target.dataset.go === "t1-intro") {
    resetTrack1();
    render();
  }

  if (target.dataset.go === "t2-intro") {
    resetTrack2();
    render();
  }

  closeMenu();
  showScreen(target.dataset.go);
});

document.addEventListener("input", (event) => {
  const field = event.target.closest("[data-field]");
  if (field?.dataset.field === "t1-paste") state.t1LlmText = field.value;
  if (field?.dataset.field === "t2-paste") state.t2FreeText = field.value;

  const nicknameInput = event.target.closest(".nickname-input input");
  if (nicknameInput) {
    const count = nicknameInput.closest(".nickname-input")?.querySelector("[data-nickname-count]");
    if (count) count.textContent = `${nicknameInput.value.length}/10`;
  }

  const birthInput = event.target.closest("[data-birth-input], [data-birth-year]");
  if (birthInput) {
    birthInput.value = birthInput.value.replace(/\D/g, "");
  }

  updateLoginValidity(event.target.closest(".login-screen"));
});

function resetTrack1() {
  state.t1Answers = {};
  state.t1LlmText = "";
  state.t1Result = null;
  state.t1Error = "";
}

function resetTrack2() {
  state.t2Answers = {};
  state.t2FreeText = "";
  state.t2Result = null;
  state.t2Error = "";
}

function resetResults() {
  resetTrack1();
  resetTrack2();
}

async function submitTrack1() {
  state.t1Error = "";
  const minLoadingMs = 2500;
  const missing = t1Questions
    .map((_, index) => `Q${index + 1}`)
    .filter((key) => !state.t1Answers[key]);

  if (missing.length > 0) {
    state.t1Error = "객관식 12문항에 모두 답변해 주세요.";
    render();
    showScreen("t1-paste");
    return;
  }

  if (!state.t1LlmText.trim()) {
    state.t1Error = "AI가 반환한 JSON을 붙여넣어 주세요.";
    render();
    showScreen("t1-paste");
    return;
  }

  const loadingStartedAt = Date.now();
  showScreen("t1-loading");

  try {
    const result = await postJson("/api/track1/submit", {
      ...respondentPayload(),
      questionnaireVersion: "track1-12",
      questionnaire: { answers: state.t1Answers },
      llmResult: state.t1LlmText,
    });

    if (result.status !== "success") {
      throw new Error(result.error?.message || "Track 1 분석에 실패했습니다.");
    }

    state.t1Result = result;
    await waitForMinimumLoading(loadingStartedAt, minLoadingMs);
    render();
    showScreen("t1-result");
  } catch (error) {
    state.t1Error = error.message;
    render();
    showScreen("t1-paste");
  }
}

async function submitTrack2() {
  state.t2Error = "";
  const minLoadingMs = 2000;
  const missing = t2Questions
    .map((_, index) => `Q${index + 1}`)
    .filter((key) => !state.t2Answers[key]);

  if (missing.length > 0) {
    state.t2Error = "상황 문항 4개에 모두 답변해 주세요.";
    render();
    showScreen("t2-paste");
    return;
  }

  if (state.t2FreeText.trim().length < 10) {
    state.t2Error = "AI가 생성한 답변을 10자 이상 붙여넣어 주세요.";
    render();
    showScreen("t2-paste");
    return;
  }

  const loadingStartedAt = Date.now();
  showScreen("t2-loading");

  try {
    const result = await postJson("/api/track2/submit", {
      ...respondentPayload(),
      answers: state.t2Answers,
      freeText: state.t2FreeText,
    });

    if (result.status !== "success") {
      throw new Error(result.error?.message || "Track 2 분석에 실패했습니다.");
    }

    state.t2Result = result;
    await waitForMinimumLoading(loadingStartedAt, minLoadingMs);
    render();
    showScreen("t2-result");
  } catch (error) {
    state.t2Error = error.message;
    render();
    showScreen("t2-paste");
  }
}

async function waitForMinimumLoading(startedAt, minimumMs) {
  const remainingMs = minimumMs - (Date.now() - startedAt);
  if (remainingMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, remainingMs));
  }
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    const details = Array.isArray(result.error?.details) && result.error.details.length > 0
      ? `\n${result.error.details.join("\n")}`
      : "";
    throw new Error(`${result.error?.message || "요청을 처리할 수 없습니다."}${details}`);
  }
  return result;
}

async function prepareRespondent(screenNode) {
  const nickname = screenNode?.querySelector(".nickname-input input")?.value.trim();
  if (!nickname) throw new Error("닉네임을 입력해 주세요.");

  const birthYear =
    screenNode.querySelector("[data-birth-year]")?.value.trim()
    || Array.from(screenNode.querySelectorAll("[data-birth-input]")).map((input) => input.value.trim())[0]
    || "";
  const birth = birthYear;

  state.user = { nickname, birth, birthYear: Number(birthYear) || null };

  if (state.respondent?.nickname === nickname) return state.respondent;

  const respondent = await postJson("/api/respondents", {
    nickname,
    birthYear: state.user.birthYear,
  });
  if (respondent.status !== "success") {
    throw new Error(respondent.error?.message || "응시자 정보를 생성하지 못했습니다.");
  }

  state.respondent = {
    respondentId: respondent.respondentId,
    accessToken: respondent.accessToken,
    nickname: respondent.nickname || nickname,
    birthYear: respondent.birthYear || state.user.birthYear,
  };

  return state.respondent;
}

function respondentPayload() {
  if (!state.respondent?.respondentId || !state.respondent?.accessToken) return {};
  return {
    respondentId: state.respondent.respondentId,
    accessToken: state.respondent.accessToken,
    birthYear: state.respondent.birthYear || state.user?.birthYear || null,
  };
}

async function copyPromptField(promptField) {
  const text = promptField.value;
  if (copyPromptFieldSync(promptField)) return true;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      promptField.blur();
      return true;
    }
  } catch {
    // Leave the selected text visible so the user can copy manually if needed.
  }
  return false;
}

function copyPromptFieldSync(promptField) {
  const text = promptField.value;
  let copiedFromEvent = false;
  const handleCopy = (copyEvent) => {
    copyEvent.clipboardData?.setData("text/plain", text);
    copyEvent.preventDefault();
    copiedFromEvent = true;
  };

  document.addEventListener("copy", handleCopy, { once: true });
  try {
    const commandResult = document.execCommand("copy");
    if (copiedFromEvent || commandResult) return true;
  } catch {
    // Try visible field selection next.
  } finally {
    document.removeEventListener("copy", handleCopy);
  }

  promptField.focus();
  promptField.select();
  promptField.setSelectionRange(0, text.length);

  try {
    if (document.execCommand("copy")) {
      promptField.blur();
      return true;
    }
  } catch {
    // Leave the selected text visible so the user can copy manually if needed.
  }
  return false;
}

async function shareResult(track) {
  const { blob, filename } = await createResultShareImage(track);
  const shareData = createNativeShareData(track);
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    await navigator.share({ ...shareData, files: [file] });
    return "shared";
  }

  downloadBlob(blob, filename);
  return "downloaded";
}

function createNativeShareData(track) {
  if (track === "track2") {
    const result = state.t2Result?.result || {};
    const grade = result.grade || "AI 활용 역량";
    return {
      title: `내 AI 활용 역량은 ${grade}`,
      text: "AI 활용 진단 테스트 결과를 확인해보세요.",
      url: window.location.href,
    };
  }

  const result = state.t1Result;
  const typeName = result?.type?.name || "AI 관계 유형";
  return {
    title: `내 AI 관계 유형은 ${typeName}`,
    text: "AI 활용 진단 테스트 결과를 확인해보세요.",
    url: window.location.href,
  };
}

async function createResultShareImage(track) {
  const screenId = track === "track2" ? "t2-result" : "t1-result";
  const screenNode = document.querySelector(`.screen[data-screen="${screenId}"]`);
  const filename = track === "track2" ? "pookie-track2-result.png" : "pookie-track1-result.png";
  const title = createNativeShareData(track).title;
  const text = "AI 활용 진단 테스트 결과를 공유합니다.";

  if (screenNode) {
    const blob = await captureScreenAsPng(screenNode);
    return { blob, filename, title, text };
  }

  if (track === "track2") return createTrack2ShareImage();
  return createTrack1ShareImage();
}

async function createTrack1ShareImage() {
  const result = state.t1Result;
  const typeName = result?.type?.name || "AI 관계 유형";
  const card = result?.resultCard || {};
  const keywords = card.keywords || [];
  const description = card.description || "AI 활용 진단 결과를 확인해보세요.";
  const axes = result?.axisScores || {};
  const canvas = createShareCanvas();
  const ctx = canvas.getContext("2d");
  drawShareBackground(ctx, canvas);
  drawShareHeader(ctx, "AI 관계 유형 테스트");
  drawCenteredText(ctx, "당신의 AI 관계 유형은", 220, 50, 400, "#111", "Pretendard");
  drawCenteredText(ctx, typeName, 305, 72, 800, "#000", "Pretendard");
  await drawCharacter(ctx, characterSrcByType(typeName), 300, 365, 480, 420);
  drawCenteredMultilineText(ctx, description, 835, 760, 42, 36, 300, "#111");
  drawCenteredPills(ctx, keywords, 945, 760);
  drawTrack1Axes(ctx, axes, 120, 1110);
  drawShareFooter(ctx);
  return canvasToSharePayload(canvas, "pookie-track1-result.png", `내 AI 관계 유형은 ${typeName}`, "AI 활용 진단 테스트 결과를 공유합니다.");
}

async function createTrack2ShareImage() {
  const result = state.t2Result?.result || {};
  const total = result.total ?? "--";
  const grade = result.grade || "AI 활용 역량";
  const feedback = result.feedback || {};
  const canvas = createShareCanvas();
  const ctx = canvas.getContext("2d");
  drawShareBackground(ctx, canvas);
  drawShareHeader(ctx, "AI 역량 평가 Lv.1");
  drawCenteredText(ctx, "AI 활용 역량 점수", 220, 50, 400, "#111", "Pretendard");
  drawCenteredText(ctx, `${total}점`, 340, 104, 800, "#000", "Pretendard");
  drawCenteredText(ctx, grade, 430, 54, 800, "#7d39eb", "Pretendard");
  drawCenteredMultilineText(ctx, feedback.summary || "AI 활용 진단 결과를 확인해보세요.", 540, 800, 38, 30, 400, "#111");
  drawTrack2Axes(ctx, result.axes || {}, 120, 760);
  drawShareFooter(ctx);
  return canvasToSharePayload(canvas, "pookie-track2-result.png", `내 AI 활용 역량은 ${grade}`, "AI 활용 진단 테스트 결과를 공유합니다.");
}

function createShareCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  return canvas;
}

async function captureScreenAsPng(screenNode) {
  const width = Math.ceil(screenNode.getBoundingClientRect().width || 393);
  const height = Math.ceil(Math.max(screenNode.scrollHeight, screenNode.getBoundingClientRect().height, 920));
  const clone = screenNode.cloneNode(true);

  clone.classList.add("active");
  clone.style.position = "relative";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.minHeight = `${height}px`;
  clone.style.margin = "0";
  clone.style.transform = "none";
  clone.style.boxShadow = "none";
  clone.style.overflow = "hidden";

  await inlineImages(clone);
  inlineComputedStyles(screenNode, clone);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div>
      </foreignObject>
    </svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));

  try {
    const image = await loadImage(url);
    const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0, width, height);
    return await canvasToBlob(canvas);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function inlineComputedStyles(source, target) {
  const computed = window.getComputedStyle(source);
  const computedText = computed.cssText || Array.from(computed)
    .map((property) => `${property}:${computed.getPropertyValue(property)};`)
    .join("");
  target.setAttribute("style", `${target.getAttribute("style") || ""};${computedText}`);

  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);
  for (let index = 0; index < sourceChildren.length; index += 1) {
    inlineComputedStyles(sourceChildren[index], targetChildren[index]);
  }
}

async function inlineImages(root) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map(async (image) => {
    try {
      const absoluteUrl = new URL(image.getAttribute("src"), window.location.href).href;
      const response = await fetch(absoluteUrl);
      const blob = await response.blob();
      image.src = await blobToDataUrl(blob);
    } catch {
      // If a decorative image cannot be inlined, the capture can still proceed.
    }
  }));
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("공유 이미지를 만들 수 없습니다."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

function drawShareBackground(ctx, canvas) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 6;
  roundRect(ctx, 56, 56, canvas.width - 112, canvas.height - 112, 36);
  ctx.stroke();
}

function drawShareHeader(ctx, label) {
  ctx.fillStyle = "#7d39eb";
  roundRect(ctx, 108, 106, 56, 56, 8);
  ctx.fill();
  drawLogoEyes(ctx, 108, 106);
  drawText(ctx, "푸키", 184, 149, 34, 800, "#000", "Paperlogy");
  drawText(ctx, label, 108, 228, 32, 700, "#777", "Pretendard");
}

function drawShareFooter(ctx) {
  ctx.fillStyle = "#c6ff33";
  roundRect(ctx, 120, 1278, 840, 86, 43);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
  drawCenteredText(ctx, "AI 시대에서 살아남기 · AI 활용역량 진단 테스트", 1332, 30, 800, "#000", "Pretendard");
}

async function drawCharacter(ctx, src, x, y, width, height) {
  try {
    const image = await loadImage(src);
    const ratio = Math.min(width / image.width, height / image.height);
    const drawWidth = image.width * ratio;
    const drawHeight = image.height * ratio;
    ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } catch {
    drawCenteredText(ctx, "푸키", y + height / 2, 72, 800, "#7d39eb", "Paperlogy");
  }
}

function drawTrack1Axes(ctx, axes, x, y) {
  const entries = [
    ["A", axes.A || { label: "의존도", score: 0, level: "-" }],
    ["B", axes.B || { label: "친밀도", score: 0, level: "-" }],
    ["C", axes.C || { label: "신뢰도", score: 0, level: "-" }],
    ["D", axes.D || { label: "통제욕구", score: 0, level: "-" }],
  ];
  for (const [index, [key, axis]] of entries.entries()) {
    const top = y + index * 62;
    const score = Math.max(0, Math.min(100, Number(axis.score) || 0));
    drawText(ctx, `${key}.${axis.label} ${score}점 · ${axis.level}`, x, top + 30, 30, 800, "#000", "Pretendard");
    ctx.fillStyle = "#d9d9d9";
    roundRect(ctx, x + 420, top, 520, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#7d39eb";
    roundRect(ctx, x + 420, top, 520 * (score / 100), 34, 17);
    ctx.fill();
  }
}

function drawTrack2Axes(ctx, axes, x, y) {
  const values = Object.values(axes);
  const list = values.length > 0 ? values : [
    { label: "작업 명확성", rate: 0 },
    { label: "배경·맥락", rate: 0 },
    { label: "역할 지정", rate: 0 },
    { label: "출력 형식", rate: 0 },
    { label: "반복 개선", rate: 0 },
    { label: "비판적 검토", rate: 0 },
  ];
  for (const [index, axis] of list.entries()) {
    const top = y + index * 82;
    const rate = Math.max(0, Math.min(1, Number(axis.rate) || 0));
    drawText(ctx, axis.label, x, top + 30, 28, 800, "#000", "Pretendard");
    ctx.fillStyle = "#d9d9d9";
    roundRect(ctx, x + 320, top, 620, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#7d39eb";
    roundRect(ctx, x + 320, top, 620 * rate, 34, 17);
    ctx.fill();
  }
}

function drawCenteredPills(ctx, keywords, y, maxWidth) {
  const labels = keywords.slice(0, 3).map(String);
  if (labels.length === 0) return;
  ctx.font = "800 32px Pretendard";
  const widths = labels.map((label) => ctx.measureText(label).width + 58);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + (labels.length - 1) * 18;
  let currentX = 540 - Math.min(totalWidth, maxWidth) / 2;
  for (const [index, label] of labels.entries()) {
    const width = widths[index];
    ctx.fillStyle = "#c6ff33";
    roundRect(ctx, currentX, y, width, 58, 29);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.stroke();
    drawText(ctx, label, currentX + 29, y + 40, 32, 800, "#000", "Pretendard");
    currentX += width + 18;
  }
}

function drawCenteredMultilineText(ctx, text, y, maxWidth, lineHeight, fontSize, fontWeight, color) {
  const lines = wrapText(ctx, String(text).replace(/\n+/g, " "), maxWidth, fontSize, fontWeight);
  ctx.font = `${fontWeight} ${fontSize}px Pretendard`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  lines.slice(0, 5).forEach((line, index) => {
    ctx.fillText(line, 540, y + index * lineHeight);
  });
  ctx.textAlign = "left";
}

function drawCenteredText(ctx, text, y, fontSize, fontWeight, color, fontFamily) {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, 540, y);
  ctx.textAlign = "left";
}

function drawText(ctx, text, x, y, fontSize, fontWeight, color, fontFamily) {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.fillText(text, x, y);
}

function wrapText(ctx, text, maxWidth, fontSize, fontWeight) {
  ctx.font = `${fontWeight} ${fontSize}px Pretendard`;
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLogoEyes(ctx, x, y) {
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1.5;
  for (const offset of [17, 34]) {
    ctx.beginPath();
    ctx.ellipse(x + offset, y + 34, 8, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x + offset - 1, y + 34, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function canvasToSharePayload(canvas, filename, title, text) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("공유 이미지를 만들 수 없습니다."));
        return;
      }
      resolve({ blob, filename, title, text });
    }, "image/png");
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
