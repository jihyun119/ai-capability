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
      "D. 나 스스로 경험 정리가 가능하도록 AI가 방향을 제시하게 하고, 대화 속 나의 답변을 바탕으로 초안을 만든다.",
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
  currentScreen: "home",
  user: null,
  respondent: null,
  respondentPromise: null,
  t1Answers: {},
  t1QuestionError: null,
  t1LlmText: "",
  t1Result: null,
  t1Error: "",
  t2Answers: {},
  t2QuestionError: null,
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
        <button type="button" data-go="track3-login">Track 3</button>
        <button type="button" data-go="pooky-characters">푸키 캐릭터</button>
      </nav>
    </aside>`;
}

function button(label, go, variant = "primary", extra = "") {
  return `<button class="cta ${variant} ${extra}" type="button" data-go="${go}">${label}</button>`;
}

function screen(id, label, body, classes = "") {
  const cleanClasses = classes.replace(/\bactive\b/g, "").trim();
  const activeClass = state.currentScreen === id ? " active" : "";
  return `<section class="screen ${cleanClasses}${activeClass}" data-screen="${id}" aria-label="${label}">${body}</section>`;
}

function progress(current, total, mobileTotal = total) {
  const mobileProgress = mobileTotal !== total
    ? `<p class="progress-label progress-label-mobile">${current}/${mobileTotal}</p>`
    : "";
  const mobileFill = mobileTotal !== total
    ? `<span class="progress-fill-mobile" style="width:${(current / mobileTotal) * 100}%"></span>`
    : "";
  return `
    <p class="progress-label progress-label-desktop">${current}/${total}</p>
    ${mobileProgress}
    <div class="progress" aria-hidden="true">
      <span class="progress-fill-desktop" style="width:${(current / total) * 100}%"></span>
      ${mobileFill}
    </div>`;
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
      ${trackCard("Track 1", ["3분 소요", "대학생 추천"], "AI 관계 유형 테스트", "나는 AI를 집사처럼 쓰는 사람일까, 검색창처럼 쓰는 사람일까? MBTI처럼 가볍게 확인하는 재미용 테스트", "t1-login")}
        ${trackCard("Track 2", ["5분 소요", "100점 만점"], "AI 활용 역량 테스트", "평소 AI 사용 패턴을 분석해 내가 어떤 방식으로 질문하고 활용하는 사람인지 확인합니다.", "t2-login")}
        ${trackCard("Track 3", ["10분 소요", "인앱 채팅"], "AI 실무 적용 테스트", "직무별 가상 시나리오에 직접 프롬프트를 작성하고, OpenAI 공식 가이드라인 기준으로 실전 역량을 평가받습니다.", "track3-login")}
    </section>
    <p class="track-note">처음이라면 AI 관계 유형 테스트로 시작해보세요.<br />결과를 확인한 뒤 다른 테스트로<br />자연스럽게 이어갈 수 있습니다.</p>
    ${footer()}`,
    "h02-screen"
  );
}

function t1IntroScreen() {
  return screen(
    "t1-intro",
    "T1-01 AI 관계 유형 테스트 안내",
    `${header()}
    <section class="intro-hero">
      <div>
        <p class="eyebrow">Track 1 · 재미용 · 약 5분</p>
        <h1>AI 관계<br /> 유형 테스트</h1>
        <p>당신은 AI를 어떤 태도로 대하고 있을까요?<br />당신의 AI 답변을 통해 평소 사용 습관을 분석합니다.</p>
      </div>
      ${char("searcher", "hero-character")}
      <div class="desktop-intro-characters t1-desktop-intro-characters" aria-hidden="true">
        ${char("love", "desktop-intro-character desktop-intro-character-a")}
        ${char("searcher", "desktop-intro-character desktop-intro-character-b")}
      </div>
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
  const errorState = state[`${prefix}QuestionError`];
  const questionError = errorState?.question === `Q${index}` ? errorState.message : "";
  return screen(
    `${prefix}-q-${index}`,
    `${prefix.toUpperCase()} 객관식 질문 ${index}`,
    `${header()}
    <section class="question-area">
      ${progress(index, total)}
      <h1>${title}</h1>
      ${questionError ? `<em class="question-error">${questionError}</em>` : ""}
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
    </nav>
    ${desktopFooter()}`,
    "compact-screen"
  );
}

function t1QuestionScreen(question, index, total, prev, next) {
  const currentQuestionIndex = index - 1;
  const totalQuestions = t1Questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const questionError = state.t1QuestionError?.question === `Q${index}`
    ? state.t1QuestionError.message
    : "";
  return screen(
    `t1-q-${index}`,
    `Track 1 객관식 질문 ${index}`,
    `${header()}
    <section class="t1-question-area">
      <p class="progress-label progress-label-desktop">${currentQuestionIndex + 1}/${totalQuestions}</p>
      <div class="progress" aria-hidden="true">
        <span class="progress-fill-desktop" style="width:${progressPercent}% !important"></span>
      </div>
      <h1>${question.heading}</h1>
      <p class="t1-question-guide">아래 두 문장을 비교한 뒤,<br />현재 나와 더 가까운 정도를 선택해주세요.</p>
      ${questionError ? `<em class="question-error">${questionError}</em>` : ""}
      <article class="t1-scale-card">
        <p class="t1-scale-a ${t1ScaleTextClass(question.a)}">${formatT1ScaleText(question.a)}</p>
        <div class="t1-scale-row">
          ${[1, 2, 3, 4, 5].map((value) => {
            const selected = state.t1Answers[`Q${index}`] === value ? " class=\"is-selected\"" : "";
            return `<button${selected} type="button" aria-label="${value}점" data-t1-question="Q${index}" data-t1-answer="${value}"><span>${value}</span><i></i></button>`;
          }).join("")}
        </div>
        <div class="t1-scale-arrow" aria-hidden="true"><span></span></div>
        <p class="t1-scale-b ${t1ScaleTextClass(question.b)}">${formatT1ScaleText(question.b)}</p>
      </article>
    </section>
    <nav class="nav-buttons t1-question-nav">
      ${button("이전", prev, "secondary muted")}
      ${button("다음", next)}
    </nav>
    ${desktopFooter()}`,
    "compact-screen t1-question-screen"
  );
}

function formatT1ScaleText(text) {
  const fixed = {
    "나는 AI 없이도 하루 일과에 큰 지장이 없다": "나는 AI없이도 하루 일과에 큰<br />지장이 없다",
    "나는 AI 없이 하루를 보내면 뭔가 빠진 느낌이 든다": "나는 AI없이 하루를 보내면<br />뭔가 빠진 느낌이 든다",
  };
  return fixed[text] || text;
}

function t1ScaleTextClass(text) {
  const length = text.replace(/\s/g, "").length;
  if (length >= 34) return "is-very-long";
  if (length >= 24) return "is-long";
  return "";
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
2. **Output Constraint:** Return ONLY one valid JSON object. Do not explain this prompt, the schema, or your reasoning.

### Dimensions to Assess (Values: "low", "medium", or "high")
* **A (AI Dependence):** How deeply AI is integrated into their tasks or workflows.
* **B (Emotional Closeness):** Relational warmth or companionship. (Task-focused or casual tone alone is NOT high closeness; require explicit emotional framing or gratitude).
* **C (Trust):** Output acceptance vs. verification. (Normal checking, refinement, or quality control is usually medium/high trust; only persistent skepticism, source-demanding, or factual challenging is low trust).
* **D (User Control):** Level of explicit constraints, formats, goals, and corrections set by the user.

### Logic & Calibration Rules
* **Status:** Always use \`"success"\`.
* **Confidence (\`confidence\`):** Use \`high\` only with repeated behavioral evidence; otherwise use \`medium\` or \`low\`.
* **Notes (\`notes\`):** Provide exactly one short, generic behavioral observation per axis. For B, distinguish politeness from emotional closeness. For C, distinguish normal quality control from distrust. Do not list raw data or scoring criteria.
* **Tags (\`tags\`):** Return exactly 3 short English behavior tags. No more, no fewer.

### Strict JSON Schema
{
  "status": "success",
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

const MIN_RESULT_LOADING_MS = 4200;

function t1CopyScreen() {
  return screen(
    "t1-copy",
    "T1-03 복붙 미션",
    `${header()}
    <section class="t1-copy-mission">
      ${progress(t1Questions.length, t1Questions.length)}
      <h1>이제 당신의 AI에게 <br />물어볼 차례에요</h1>
      <p>아래 문장을 복사해 평소 사용하는 AI 채팅창에 붙여넣으세요.<br />ChatGPT, Claude, Gemini 등<br />어떤 AI든 괜찮습니다.</p>
      <article class="t1-prompt-card">
        <textarea readonly>${t1UserPrompt}</textarea>
        <button class="cta primary t1-copy-button" type="button" data-copy-prompt>프롬프트 복사하기</button>
      </article>
    </section>
    <nav class="nav-buttons t1-copy-nav">
      ${button("이전", `t1-q-${t1Questions.length}`, "secondary")}
      ${button("답변 붙여넣으러 가기", "t1-paste")}
    </nav>
    ${desktopFooter()}`,
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
      </section>
      ${desktopFooter()}`,
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
      </section>
      ${desktopFooter()}`,
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
  const result = state.t1Result;
  const typeName = result?.type?.name || "AI 관계 유형";
  const card = result?.resultCard || {
    description: "결과 분석을 완료하면 유형 설명이 표시됩니다.",
    keywords: ["AI관계", "분석중", "푸키"],
  };
  const descriptionLines = String(card.description || "")
    .split("\n")
    .filter(Boolean)
    .map(escapeHtml);
  const mainDescription = descriptionLines.slice(0, 2).join("<br />") || typeName;
  const subDescription = descriptionLines.slice(2).join("<br />") || "AI 활용 진단 결과를 확인해보세요.";
  const hashtags = normalizeShareKeywords(card.keywords);

  return screen(
    "t1-share",
    "결과 공유 카드",
    `<div class="share-export t1-share-export" data-share-capture>
      <header class="share-top-bar">
        <button class="brand" type="button" data-go="home" aria-label="푸키 홈으로 이동">
          <img class="logo-img" src="${logoDir}Logo.v2.png" alt="" />
          <span>푸키</span>
        </button>
        <button class="share-close" type="button" data-go="t1-result" aria-label="공유 화면 닫기"></button>
      </header>
      <section class="t1-share-card">
        <div class="t1-share-title">
          <p>당신의 AI 관계 유형은</p>
          <h1>${escapeHtml(typeName)}</h1>
          <div class="t1-share-hashtags">
            ${hashtags.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}
          </div>
        </div>
        ${charByType(typeName, "t1-share-character")}
        <strong>${mainDescription}</strong>
        <p class="t1-share-description">${subDescription}</p>
      </section>
    </div>
    <nav class="nav-buttons t1-share-nav">
      <button class="cta secondary mobile-share-save" type="button" data-save-result="track1">이미지 저장</button>
      <button class="cta" type="button" data-share-result="track1">공유하기</button>
    </nav>`,
    "compact-screen t1-share-screen"
  );
}

function t2ShareScreen() {
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
      strengths: [{ description: "답변 제출 후 표시됩니다." }],
      weaknesses: [{ description: "답변 제출 후 표시됩니다." }],
    },
  };
  const displayGrade = displayTrack2Grade(result);
  const feedback = {
    summary: displayTrack2Summary(result, result.feedback?.summary || "AI 활용 진단 결과를 확인해보세요."),
    strength: result.feedback?.strength || result.feedback?.strengths?.[0]?.description || "강점 분석이 표시됩니다.",
    weakness: result.feedback?.weakness || result.feedback?.weaknesses?.[0]?.description || "보완점 분석이 표시됩니다.",
  };
  const chart = renderTrack2Radar(result);

  return screen(
    "t2-share",
    "Track 2 결과 공유 카드",
    `<div class="share-export t2-share-export" data-share-capture>
      <header class="share-top-bar">
        <button class="brand" type="button" data-go="home" aria-label="푸키 홈으로 이동">
          <img class="logo-img" src="${logoDir}Logo.v2.png" alt="" />
          <span>푸키</span>
        </button>
        <button class="share-close" type="button" data-go="t2-result" aria-label="공유 화면 닫기"></button>
      </header>
      <section class="t2-share-content">
        <article class="t2-score-card t2-share-score-card">
          <p>당신의 AI 활용 역량 점수는</p>
          <h1>${Math.round(result.total)}점</h1>
          ${chart}
        </article>
        <strong class="t2-grade-pill">${escapeHtml(displayGrade)}</strong>
        <p class="t2-result-summary">${escapeHtml(feedback.summary)}</p>
        <section class="t2-feedback-list">
          <article>
            <h2><span>Strength</span> 강점</h2>
            <p class="t2-feedback-body">${escapeHtml(feedback.strength)}</p>
          </article>
          <article>
            <h2><span>Weakness</span> 약점</h2>
            <p class="t2-feedback-body">${escapeHtml(feedback.weakness)}</p>
          </article>
        </section>
      </section>
    </div>
    <nav class="nav-buttons t2-share-nav">
      <button class="cta secondary mobile-share-save" type="button" data-save-result="track2">이미지 저장</button>
      <button class="cta" type="button" data-share-result="track2">공유하기</button>
    </nav>`,
    "compact-screen t2-share-screen"
  );
}

function t1ResultScreen() {
  const result = state.t1Result;
  const typeName = result?.type?.name || "분석 대기 중";
  const card = result?.resultCard || {
    description: "결과 분석을 완료하면 유형 설명이 표시됩니다.",
    keywords: ["분석전", "대기중", "테스트"],
    reasonStory: ["답변을 제출하면 유형 분류 이유가 표시됩니다."],
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

  return screen(
    "t1-result",
    "T1-06 AI 관계 유형 테스트 결과",
    `${header()}
    <section class="t1-result-content">
      <article class="result-card t1-result-card">
        <p>당신의 AI 관계 유형은</p>
        <h1>${typeName}</h1>
        ${charByType(typeName === "분석 대기 중" ? "AI 몰라형" : typeName, "result-character")}
        <strong>${mainDescription}</strong>
        <span>${subDescription}</span>
      </article>
      <article class="t1-result-info">
        <h2>왜 이 유형이 나왔나요?</h2>
        <p>${reasonStory.length ? reasonStory.map(escapeHtml).join("<br />") : "AI 사용 패턴과 답변 근거를 종합해 유형을 분류했습니다."}</p>
      </article>
      <p class="t1-result-note">확인된 대화 기록 기반 결과입니다.</p>
      <section class="scores t1-score-bars">
        ${axisEntries.map(([key, axis]) => {
          const score = Math.round(Number(axis.score) || 0);
          return `<p><span><b>${axisDisplayLabels[key]}</b> <strong>${score}점 ${axis.level}</strong></span><i style="--score:${score}%"></i></p>`;
        }).join("")}
      </section>
    </section>
    <nav class="nav-buttons t1-result-nav">
      <button class="cta secondary" type="button" data-share-open="track1">공유하기</button>
      ${button("다른 Track 도전", "track")}
    </nav>
    ${button("푸키 캐릭터 더 알아보기", "pooky-characters", "secondary", "t1-character-link")}
    ${desktopFooter()}`,
    "compact-screen t1-result-screen scroll-screen"
  );
}

function t2IntroScreen() {
  return screen(
    "t2-intro",
    "T2-01 AI 활용 역량 테스트 안내",
    `${header()}
    <section class="intro-hero t2-intro-hero">
      <div>
        <p class="eyebrow">Track 2 · 패턴 분석 · 약 8분</p>
        <h1>AI 활용 역량<br /> 테스트</h1>
        <p>자소서, 보고서, 과제, 기획처럼 실제 목적이 있는 상황에서 당신이 AI를 어떻게 활용하는지 분석합니다.</p>
      </div>
      ${charByType("프로 트집러형", "hero-character")}
      <div class="desktop-intro-characters t2-desktop-intro-characters" aria-hidden="true">
        ${charByType("프로 트집러형", "desktop-intro-character desktop-intro-character-a")}
        ${char("anxious", "desktop-intro-character desktop-intro-character-b")}
      </div>
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
      return questionScreen("t2", n, 4, question.title, question.options, n === 1 ? "t2-intro" : `t2-q-${n - 1}`, n === 4 ? "t2-prompt" : `t2-q-${n + 1}`);
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

const t2PromptMarkers = [
  "look back at our entire conversation history",
  "write a single cohesive paragraph",
  "weave all six of the following observations",
  "for every one of these six behaviors",
];

const pookieShareText = "푸키에서 AI 시대 생존력을 테스트해보세요. 지금 바로 당신의 AI 역량을 확인할 수 있어요! https://ai-capability-green.vercel.app/";

function t2PromptScreen() {
  return screen(
    "t2-prompt",
    "T2-03 프롬프트 복사",
    `${header()}
    <section class="t2-copy-mission">
      ${progress(4, 4)}
      <h1>이제 당신의 AI에게 <br />물어볼 차례에요</h1>
      <p>아래 문장을 복사해 평소 사용하는 AI 채팅창에 붙여넣으세요.<br />ChatGPT, Claude, Gemini 등<br />어떤 AI든 괜찮습니다.</p>
      <article class="t1-prompt-card">
        <textarea readonly>${t2UserPromptClean}</textarea>
        <button class="cta primary t1-copy-button" type="button" data-copy-prompt>프롬프트 복사하기</button>
      </article>
    </section>
    <nav class="nav-buttons t1-copy-nav">
      ${button("이전", "t2-q-4", "secondary")}
      ${button("답변 붙여넣으러 가기", "t2-paste")}
    </nav>
    ${desktopFooter()}`,
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
  const displayGrade = displayTrack2Grade(result);
  const feedback = {
    summary: displayTrack2Summary(result, result.feedback?.summary || "AI 활용 진단 결과를 확인해보세요."),
    strength: result.feedback?.strength || result.feedback?.strengths?.[0]?.description || "강점 분석이 표시됩니다.",
    weakness: result.feedback?.weakness || result.feedback?.weaknesses?.[0]?.description || "보완점 분석이 표시됩니다.",
    insight: result.feedback?.insight || "면접용 요약 문장이 표시됩니다.",
  };
  const chart = renderTrack2Radar(result);
  return screen(
    "t2-result",
    "T2-06 AI 활용 역량 테스트 결과",
    `${header()}
    <section class="t2-result-content">
      <article class="t2-score-card">
        <p>당신의 AI 활용 역량 점수는</p>
        <h1>${Math.round(result.total)}점</h1>
        ${chart}
      </article>
      <strong class="t2-grade-pill">${escapeHtml(displayGrade)}</strong>
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
          <h2><span>나는 AI를 이렇게 활용하는 사람이에요</span></h2>
          <p class="t2-feedback-body">${feedback.insight}</p>
        </article>
      </section>
      <nav class="nav-buttons t2-result-nav">
        <button class="cta secondary" type="button" data-share-open="track2">공유하기</button>
        ${button("다른 Track 도전", "track")}
      </nav>
      ${button("푸키 캐릭터 더 알아보기", "pooky-characters", "secondary", "t2-character-link")}
    </section>
    ${footer()}`,
    "t2-result-screen scroll-screen"
  );
}

function renderTrack2Radar(result) {
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
  return `<div class="radar-chart" aria-label="AI 활용 역량 테스트 레이더 차트">
    <svg viewBox="0 0 270 270" role="img" aria-hidden="true">
      ${[0.2, 0.4, 0.6, 0.8].map((rate) => `<polygon class="radar-grid" points="${gridPolygon(rate)}" />`).join("")}
      ${axisOrder.map((_, index) => `<line class="radar-axis" x1="${center}" y1="${center}" x2="${point(1, index).split(",")[0]}" y2="${point(1, index).split(",")[1]}" />`).join("")}
      <polygon class="radar-fill" points="${radarPoints}" />
      <polygon class="radar-stroke" points="${radarPoints}" />
      ${axisOrder.map((key, index) => `<circle class="radar-dot" cx="${point(result.axes[key]?.rate || 0, index).split(",")[0]}" cy="${point(result.axes[key]?.rate || 0, index).split(",")[1]}" r="3.5" />`).join("")}
      ${axisOrder.map((key, index) => `<text class="radar-label" x="${labelPositions[index].x}" y="${labelPositions[index].y}" text-anchor="${labelPositions[index].anchor}">${result.axes[key]?.label || key}</text>`).join("")}
    </svg>
  </div>`;
}

function t3Screens() {
  return screen(
    "t3-comingsoon",
    "AI 실무 적용 테스트 Coming Soon",
    `${header()}
    <section class="coming-soon-page">
      <p class="eyebrow">Beta Notice</p>
      <h1>AI 실무 적용 테스트는<br />준비 중이에요</h1>
      <p>이번 베타에서는 AI 관계 유형 테스트와 AI 활용 역량 테스트를 먼저 완성합니다.<br />직무별 실전 시나리오 평가는 이후 버전에서 공개할게요.</p>
    </section>`,
    "compact-screen"
  );
}

function myReportScreen() {
  return screen(
    "my-report",
    "M01 마이 리포트",
    `${header()}<section class="simple-page"><h1>내 AI 활용<br />리포트</h1><p>당신은 AI를 반복적으로 개선하며 결과물을 완성하는 활용자입니다.</p><div class="report-list"><article><strong>AI 관계 유형 테스트</strong><span>시키는만큼만 해 형</span></article><article><strong>AI 활용 역량 테스트</strong><span>76점 · 실무 적응형</span></article><article><strong>AI 실무 적용 테스트</strong><span>82점 · 상위 18%</span></article></div><article class="portfolio-copy"><strong>포트폴리오용 요약</strong><span>AI를 초안 생성 도구로만 사용하지 않고, 목적과 기준에 맞게 결과물을 반복 개선하는 방식으로 활용합니다.</span></article></section><nav class="nav-buttons">${button("처음으로", "home", "secondary")}${button("문장 복사", "my-report")}</nav>`,
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
    ["L01", "AI 관계 유형 테스트 로그인", "t1-login"],
    ["T1-01", "AI 관계 유형 테스트 안내", "t1-intro"],
    ["T1-02", "AI 관계 유형 테스트 객관식 12문항", "t1-q-1"],
    ["T1-03", "복붙 미션", "t1-copy"],
    ["T1-04", "답변 제출", "t1-paste"],
    ["T1-05", "분석 로딩", "t1-loading"],
    ["T1-06", "AI 관계 유형 테스트 결과", "t1-result"],
    ["L02", "AI 활용 역량 테스트 로그인", "t2-login"],
    ["T2-01", "AI 활용 역량 테스트 안내", "t2-intro"],
    ["T2-02", "AI 활용 역량 테스트 객관식 4문항", "t2-q-1"],
    ["T2-03", "AI 답변 제출", "t2-paste"],
    ["T2-04", "AI 활용 역량 테스트 결과", "t2-result"],
    ["T3", "AI 실무 적용 테스트", "track3-login"],
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

function desktopFooter() {
  return `<div class="desktop-page-footer">${footer()}</div>`;
}

function legacyDesktopHomeTracks() {
  return `
    <section class="home-desktop-tracks" aria-label="Track 선택">
      <h2>원하는 <strong>Track</strong>으로 시작하세요!</h2>
      <div class="desktop-track-list">
        ${trackCard("Track 1", ["3분 소요", "대학생 추천"], "AI 관계 유형 테스트", "나는 AI를 집사처럼 쓰는 사람일까, 검색창처럼 쓰는 사람일까? MBTI처럼 가볍게 확인하는 재미용 테스트", "t1-login")}
        ${trackCard("Track 2", ["5분 소요", "100점 만점"], "AI 활용 역량 테스트", "평소 AI 사용 패턴을 분석해 내가 어떤 방식으로 질문하고 활용하는 사람인지 확인합니다.", "t2-login")}
        ${trackCard("Track 3", ["10분 소요", "인앱 채팅"], "AI 실무 적용 테스트", "직무별 가상 시나리오에 직접 프롬프트를 작성하고, OpenAI 공식 가이드라인 기준으로 실전 역량을 평가받습니다.", "track3-login")}
      </div>
    </section>`;
}

function desktopHomeTrackCard(track, meta, title, desc, go) {
  return `
    <button class="home-track-card" type="button" data-go="${go}">
      <span class="home-track-chips"><b>${track}</b>${meta.map((item) => `<i>${item}</i>`).join("")}</span>
      <strong>${title}</strong>
      <small>${desc}</small>
      <span class="home-track-arrow" aria-hidden="true">→</span>
    </button>`;
}

function desktopHomeTracks() {
  return `
    <section class="home-desktop-tracks" aria-label="Track 선택">
      <h2>원하는 <strong>Track</strong>으로 시작하세요!</h2>
      <div class="desktop-track-list">
        ${desktopHomeTrackCard("Track 1", ["3분 소요", "대학생 추천"], "AI 관계 유형 테스트", "나는 AI를 집사처럼 쓰는 사람일까, 검색창처럼 쓰는 사람일까? MBTI처럼 가볍게 확인하는 재미용 테스트", "t1-login")}
        ${desktopHomeTrackCard("Track 2", ["5분 소요", "100점 만점"], "AI 활용 역량 테스트", "평소 AI 사용 패턴을 분석해 내가 어떤 방식으로 질문하고 활용하는 사람인지 확인합니다.", "t2-login")}
        ${desktopHomeTrackCard("Track 3", ["10분 소요", "인앱 채팅"], "AI 실무 적용 테스트", "직무별 가상 시나리오에 직접 프롬프트를 작성하고, OpenAI 공식 가이드라인 기준으로 실전 역량을 평가받습니다.", "track3-login")}
      </div>
    </section>`;
}

function homeScreen() {
  return screen(
    "home",
    "H01 랜딩 홈",
    `${header()}
    <main class="home-content home-content-v2">
      <h1 class="home-title-mobile">나, <mark>AI</mark>를<br />잘 쓰고 있는 걸까?</h1>
      <h1 class="home-title-desktop"><span>POOKIE</span><mark>AI 시대에서</mark> 살아남기</h1>
      <p>AI를 얼마나 자주 쓰는지가 아니라,<br /><strong>어떤 방식으로 활용</strong>하는지 진단해보세요.<br /><strong>가벼운 유형 테스트</strong>부터 <strong>실전 프롬프트 역량 평가</strong>까지<br />확인할 수 있습니다.</p>
      <div class="character-cluster">
        ${char("friend", "char c1")}
        ${char("boss", "char c2")}
        ${char("searcher", "char c3")}
        ${char("unsure", "char c4")}
      </div>
    </main>
    <div class="cta-stack home-start-v2">
      ${button("내 AI 활용 역량 알아보기", "track")}
      ${button("실전 역량 평가하기", "track")}
    </div>
    ${desktopHomeTracks()}
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
      ${progress(t1Questions.length, t1Questions.length)}
      <h1>AI가 뭐라고 답했나요?</h1>
      <p>프롬프트 원문이 아니라,<br />AI가 반환한 답변을 그대로 붙여넣어 주세요.</p>
      <img class="answer-example-image t1-example-image" src="./assets/track1-example.png" alt="AI 관계 유형 테스트 AI 답변 예시" />
      <span class="answer-example-caption">(예시 화면)</span>
      <textarea data-field="t1-paste" placeholder="여기에 AI가 답변한 JSON 또는 텍스트를 붙여넣어 주세요.">${escapeHtml(state.t1LlmText)}</textarea>
      ${state.t1Error ? `<em class="form-error">${state.t1Error}</em>` : ""}
    </section>
    <nav class="nav-buttons t1-answer-nav">
      ${button("이전", "t1-copy", "secondary")}
      ${button("내 유형 분석하기", "t1-loading")}
    </nav>
    ${desktopFooter()}`,
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
      <p>프롬프트 원문이 아니라,<br />AI가 작성한 답변을 그대로 붙여넣어 주세요.</p>
      <img class="answer-example-image t2-example-image" src="./assets/track2-example.png" alt="AI 활용 역량 테스트 AI 답변 예시" />
      <span class="answer-example-caption">(예시 화면)</span>
      <textarea data-field="t2-paste" placeholder="여기에 AI가 작성한 줄글 답변을 붙여넣어 주세요.">${escapeHtml(state.t2FreeText)}</textarea>
      ${state.t2Error ? `<em class="form-error">${state.t2Error}</em>` : ""}
    </section>
    <nav class="nav-buttons t2-answer-nav">
      ${button("이전", "t2-prompt", "secondary")}
      ${button("내 패턴 분석하기", "t2-loading")}
    </nav>
    ${desktopFooter()}`,
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
            <input type="text" inputmode="numeric" maxlength="4" placeholder="예: 2003" data-birth-year />
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
    t2ShareScreen(),
    t3Screens(),
    myReportScreen(),
    characterGalleryScreen(),
    mapScreen(),
    menuOverlay(),
  ].join("");
}

function showScreen(name) {
  state.currentScreen = name;
  clearQuestionErrorOutsideScreen(name);
  document.querySelectorAll(".screen").forEach((screenNode) => {
    screenNode.classList.toggle("active", screenNode.dataset.screen === name);
  });
  resetViewportPosition();
}

function resetViewportPosition() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  app.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  app.scrollTop = 0;
  app.scrollLeft = 0;
  window.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    app.scrollTop = 0;
    app.scrollLeft = 0;
    window.scrollTo?.(0, 0);
  });
}

function clearQuestionErrorOutsideScreen(name) {
  const t1Match = String(name).match(/^t1-q-(\d+)$/);
  if (!t1Match || state.t1QuestionError?.question !== `Q${t1Match[1]}`) {
    state.t1QuestionError = null;
  }

  const t2Match = String(name).match(/^t2-q-(\d+)$/);
  if (!t2Match || state.t2QuestionError?.question !== `Q${t2Match[1]}`) {
    state.t2QuestionError = null;
  }
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

const initialScreen = new URLSearchParams(window.location.search).get("screen");
if (initialScreen && document.querySelector(`[data-screen="${initialScreen}"]`)) {
  showScreen(initialScreen);
}

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
    state.t1QuestionError = null;
    t1Answer.closest(".screen")?.querySelector(".question-error")?.remove();
    t1Answer.parentElement.querySelectorAll("button").forEach((buttonNode) => buttonNode.classList.remove("is-selected"));
    t1Answer.classList.add("is-selected");
    return;
  }

  const t2Answer = event.target.closest("[data-t2-answer]");
  if (t2Answer) {
    state.t2Answers[t2Answer.dataset.t2Question] = t2Answer.dataset.t2Answer;
    state.t2QuestionError = null;
    t2Answer.closest(".screen")?.querySelector(".question-error")?.remove();
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
    shareTarget.textContent = "이미지 준비 중";
    shareTarget.disabled = true;
    try {
      const outcome = await shareResult(shareTarget.dataset.shareResult);
      shareTarget.textContent = outcome === "shared" ? "결과 공유창 열림" : "이미지 저장됨";
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

  const saveTarget = event.target.closest("[data-save-result]");
  if (saveTarget) {
    event.preventDefault();
    const originalText = saveTarget.dataset.saveLabel || saveTarget.textContent;
    saveTarget.dataset.saveLabel = originalText;
    saveTarget.textContent = "저장 중";
    saveTarget.disabled = true;
    try {
      const outcome = await saveResultImage(saveTarget.dataset.saveResult);
      saveTarget.textContent = outcome === "shared" ? "저장창 열림" : "저장 완료";
    } catch (error) {
      saveTarget.textContent = "저장 실패";
      console.error(error);
    } finally {
      setTimeout(() => {
        saveTarget.textContent = originalText;
        saveTarget.disabled = false;
      }, 1400);
    }
    return;
  }

  const shareOpenTarget = event.target.closest("[data-share-open]");
  if (shareOpenTarget) {
    event.preventDefault();
    const shareScreen = shareOpenTarget.dataset.shareOpen === "track2" ? "t2-share" : "t1-share";
    if (shareOpenTarget.dataset.shareOpen === "track1" || shareOpenTarget.dataset.shareOpen === "track2") {
      state.currentScreen = shareScreen;
      render();
      showScreen(shareScreen);
      return;
    }
  }

  const target = event.target.closest("[data-go]");
  if (!target) return;
  if (target.matches("[data-login-next]") && target.disabled) return;
  event.preventDefault();

  if (!ensureQuestionAnsweredBeforeMove(target.dataset.go)) {
    return;
  }

  if (target.matches("[data-login-next]")) {
    try {
      beginPrepareRespondent(target.closest(".login-screen"));
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
    if (target.dataset.go === "t2-result" && state.t2Result) {
      render();
      closeMenu();
      showScreen("t2-result");
      return;
    }
    await submitTrack2();
    return;
  }

  if (target.dataset.go === "t3-loading" && typeof window.__track3Submit === "function") {
    await window.__track3Submit();
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
  state.t1QuestionError = null;
  state.t1LlmText = "";
  state.t1Result = null;
  state.t1Error = "";
}

function resetTrack2() {
  state.t2Answers = {};
  state.t2QuestionError = null;
  state.t2FreeText = "";
  state.t2Result = null;
  state.t2Error = "";
}

function ensureQuestionAnsweredBeforeMove(nextScreen) {
  const activeScreen = document.querySelector(".screen.active");
  const activeName = activeScreen?.dataset.screen || "";
  const t1Match = activeName.match(/^t1-q-(\d+)$/);
  const t2Match = activeName.match(/^t2-q-(\d+)$/);

  if (t1Match && isForwardTrack1Move(activeName, nextScreen)) {
    const index = Number(t1Match[1]);
    if (!state.t1Answers[`Q${index}`]) {
      state.t1QuestionError = {
        question: `Q${index}`,
        message: "답변을 선택해야 다음 문항으로 넘어갈 수 있어요.",
      };
      render();
      showScreen(activeName);
      return false;
    }
    state.t1QuestionError = null;
  }

  if (t2Match && isForwardTrack2Move(activeName, nextScreen)) {
    const index = Number(t2Match[1]);
    if (!state.t2Answers[`Q${index}`]) {
      state.t2QuestionError = {
        question: `Q${index}`,
        message: "답변을 선택해야 다음 문항으로 넘어갈 수 있어요.",
      };
      render();
      showScreen(activeName);
      return false;
    }
    state.t2QuestionError = null;
  }

  return true;
}

function isForwardTrack1Move(activeName, nextScreen) {
  const current = Number(activeName.replace("t1-q-", ""));
  if (nextScreen === "t1-copy") return current === t1Questions.length;
  const next = Number(String(nextScreen).replace("t1-q-", ""));
  return Number.isFinite(next) && next > current;
}

function isForwardTrack2Move(activeName, nextScreen) {
  const current = Number(activeName.replace("t2-q-", ""));
  if (nextScreen === "t2-prompt") return current === t2Questions.length;
  const next = Number(String(nextScreen).replace("t2-q-", ""));
  return Number.isFinite(next) && next > current;
}

function resetResults() {
  resetTrack1();
  resetTrack2();
}

async function submitTrack1() {
  state.t1Error = "";
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

  if (looksLikeTrack1Prompt(state.t1LlmText)) {
    state.t1Error = "프롬프트 원문이 아니라, AI가 작성한 답변을 그대로 붙여넣어 주세요.";
    render();
    showScreen("t1-paste");
    return;
  }

  const loadingStartedAt = Date.now();
  showScreen("t1-loading");

  try {
    await ensureRespondentReady();
    const result = await postJson("/api/track1/submit", {
      ...respondentPayload(),
      questionnaireVersion: "track1-12",
      questionnaire: { answers: state.t1Answers },
      llmResult: state.t1LlmText,
    });

    if (result.status !== "success") {
      const apiError = new Error(result.error?.message || result.reason || "AI 관계 유형 테스트 분석에 실패했습니다.");
      apiError.code = result.error?.code || result.status;
      throw apiError;
    }

    state.t1Result = result;
    await waitForMinimumLoading(loadingStartedAt);
    render();
    showScreen("t1-result");
    persistTrack1Result(result);
  } catch (error) {
    state.t1Error = friendlyTrack1Error(error);
    render();
    showScreen("t1-paste");
  }
}

// ── Track 2 자유서술 검증 (Layer 1 + Layer 2) ────────────────────────────────

const T2_FREQ_WORDS = ["always", "consistently", "frequently", "sometimes", "occasionally", "rarely", "never"];

const T2_AXIS_KEYWORDS = {
  task_clarity:    ["defin", "goal", "constraint", "scope", "specif", "open-end", "requirement", "condition", "parameter", "instruction", "task", "what should", "what not", "narrow", "explicit"],
  context:         ["background", "context", "purpose", "audience", "upfront", "situation", "workflow", "surrounding", "intent", "explain", "before asking", "provide", "prior to", "setup"],
  role:            ["role", "persona", "expert", "assign", "perspective", "title", "act as", "identity", "framed", "position", "specialist"],
  output_format:   ["format", "length", "structure", "tone", "style", "layout", "wording", "ordering", "label", "citation", "visual", "table", "paragraph", "translation", "present", "deliver"],
  iteration:       ["follow-up", "follow up", "revision", "unsatisfi", "fell short", "refine", "rework", "adjust", "incorrect", "missing", "misplaced", "repetitive", "overly", "not satisfied", "revise"],
  critical_review: ["challeng", "push back", "pushback", "question", "verify", "incorrect", "unclear", "disagree", "dispute", "inaccurat", "inconsistent", "disconnected", "misalign", "without question", "accept", "rarely accept"]
};

function validateT2FreeText(text) {
  if (!text || text.trim().length === 0) return "AI가 생성한 답변을 붙여넣어 주세요.";

  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);

  // Layer 1: 기본 형식
  if (words.length < 30)
    return `최소 30단어 이상 작성해주세요. (현재 ${words.length}단어)`;

  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  if (sentenceCount < 3)
    return `최소 3문장 이상 작성해주세요. (현재 ${sentenceCount}문장)`;

  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / words.length;
  if (uniqueRatio < 0.4)
    return "동일한 단어가 너무 많이 반복되었습니다.";

  // Layer 2: 내용 관련성
  const hasFreqWord = T2_FREQ_WORDS.some((fw) => new RegExp(`\\b${fw}\\b`).test(lower));
  if (!hasFreqWord)
    return "빈도를 나타내는 표현(always, sometimes, frequently 등)을 포함해주세요.";

  const axisHits = Object.values(T2_AXIS_KEYWORDS).filter((keywords) =>
    keywords.some((kw) => lower.includes(kw))
  ).length;
  if (axisHits < 2)
    return "AI 활용 내용이 부족합니다. 목표 설정, 맥락 제공, 역할 지정, 출력 형식 등을 포함해주세요.";

  return null;
}

async function submitTrack2() {
  state.t2Error = "";
  const missing = t2Questions
    .map((_, index) => `Q${index + 1}`)
    .filter((key) => !state.t2Answers[key]);

  if (missing.length > 0) {
    state.t2Error = "상황 문항 4개에 모두 답변해 주세요.";
    render();
    showScreen("t2-paste");
    return;
  }

  const freeTextError = validateT2FreeText(state.t2FreeText);
  if (freeTextError) {
    state.t2Error = freeTextError;
    render();
    showScreen("t2-paste");
    return;
  }

  if (looksLikeTrack2Prompt(state.t2FreeText)) {
    state.t2Error = "복사한 프롬프트 원문이 아니라 AI가 작성한 답변을 붙여넣어 주세요.";
    render();
    showScreen("t2-paste");
    return;
  }

  const loadingStartedAt = Date.now();
  showScreen("t2-loading");

  try {
    await ensureRespondentReady();
    const result = await postJson("/api/track2/submit", {
      ...respondentPayload(),
      answers: state.t2Answers,
      freeText: state.t2FreeText,
    });

    if (result.status !== "success") {
      throw new Error(result.error?.message || "AI 활용 역량 테스트 분석에 실패했습니다.");
    }

    state.t2Result = result;
    await waitForMinimumLoading(loadingStartedAt);
    render();
    showScreen("t2-result");
    persistTrack2Result(result);
  } catch (error) {
    state.t2Error = error.message;
    render();
    showScreen("t2-paste");
  }
}

function looksLikeTrack2Prompt(text) {
  const lower = String(text || "").toLowerCase();
  return t2PromptMarkers.filter((marker) => lower.includes(marker)).length >= 2;
}

function looksLikeTrack1Prompt(text) {
  const lower = String(text || "").toLowerCase();
  const markers = [
    "analyze the user's interaction style",
    "core guidelines",
    "dimensions to assess",
    "logic & calibration rules",
    "strict json schema",
    "return exactly 3 short english behavior tags",
    "do not explain this prompt",
  ];
  return markers.filter((marker) => lower.includes(marker)).length >= 2;
}

function waitForMinimumLoading(startedAt, minMs = MIN_RESULT_LOADING_MS) {
  const remaining = minMs - (Date.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, remaining);
  });
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
    const error = new Error(`${result.error?.message || "요청을 처리할 수 없습니다."}${details}`);
    error.code = result.error?.code;
    throw error;
  }
  return result;
}

function friendlyTrack1Error(error) {
  const message = String(error?.message || "");
  const code = error?.code || "";
  const shouldUsePasteGuide = [
    code === "PROMPT_PASTED",
    /not enough evidence/i.test(message),
    /insufficient_history/i.test(message),
    /insufficient history/i.test(message),
    /minimal history/i.test(message),
    /status가 success/i.test(message),
    /success 또는 insufficient_history/i.test(message),
    /ai가 반환한 답변/i.test(message),
    /프롬프트 원문/i.test(message),
    /schema/i.test(message),
    /signals/i.test(message),
    /confidence/i.test(message),
    /tags/i.test(message),
    /json/i.test(message),
  ].some(Boolean);

  if (shouldUsePasteGuide) {
    return "프롬프트 원문이 아니라, AI가 작성한 답변을 그대로 붙여넣어 주세요.";
  }

  return message || "AI 답변을 읽지 못했어요. 답변 전체를 다시 붙여넣어 주세요.";
}

function persistTrack1Result(result) {
  const respondent = respondentPayload();
  if (!respondent.respondentId || !result?.resultId) return;

  fireAndForgetPostJson("/api/track1/save", {
    ...respondent,
    resultId: result.resultId,
    questionnaireVersion: "track1-12",
    questionnaire: { answers: state.t1Answers },
    llmResult: state.t1LlmText,
  });
}

function persistTrack2Result(result) {
  const respondent = respondentPayload();
  if (!respondent.respondentId || !result?.resultId) return;

  fireAndForgetPostJson("/api/track2/save", {
    ...respondent,
    resultId: result.resultId,
    answers: state.t2Answers,
    freeText: state.t2FreeText,
    feedbackResult: result.result?.feedback || null,
  });
}

function fireAndForgetPostJson(url, payload) {
  const body = JSON.stringify(payload);
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: body.length < 60000,
  }).catch((error) => {
    console.error("[background-save]", error);
  });
}

function beginPrepareRespondent(screenNode) {
  const user = readRespondentInput(screenNode);
  const previousUser = state.respondent || state.user;
  const userChanged = Boolean(previousUser && !isSameUserIdentity(previousUser, user));

  if (userChanged) {
    state.respondent = null;
    state.respondentPromise = null;
    resetUserTrackProgress();
  }

  state.user = user;
  if (userChanged) render();

  if (
    state.respondent
    && isSameUserIdentity(state.respondent, user)
  ) {
    state.respondentPromise = null;
    return state.respondent;
  }

  state.respondentPromise = createRespondent(user).catch((error) => {
    console.error("[respondent]", error);
    state.respondentPromise = null;
    return null;
  });
  return state.respondentPromise;
}

function readRespondentInput(screenNode) {
  const nickname = screenNode?.querySelector(".nickname-input input")?.value.trim();
  if (!nickname) throw new Error("닉네임을 입력해 주세요.");

  const birthYear =
    screenNode.querySelector("[data-birth-year]")?.value.trim()
    || Array.from(screenNode.querySelectorAll("[data-birth-input]")).map((input) => input.value.trim())[0]
    || "";
  const gender = screenNode.querySelector("[data-gender-select]")?.value || "";
  const birth = birthYear;

  return { nickname, birth, birthYear: Number(birthYear) || null, gender: gender || null };
}

function isSameUserIdentity(left, right) {
  if (!left || !right) return false;
  return String(left.nickname || "").trim() === String(right.nickname || "").trim()
    && Number(left.birthYear || 0) === Number(right.birthYear || 0)
    && String(left.gender || "") === String(right.gender || "");
}

function resetUserTrackProgress() {
  resetTrack1();
  resetTrack2();
  window.__resetTrack3Progress?.();
}

async function createRespondent(user) {
  const respondent = await postJson("/api/respondents", {
    nickname: user.nickname,
    birthYear: user.birthYear,
    gender: user.gender,
  });
  if (respondent.status !== "success") {
    throw new Error(respondent.error?.message || "응시자 정보를 생성하지 못했습니다.");
  }

  const respondentState = {
    respondentId: respondent.respondentId,
    accessToken: respondent.accessToken,
    nickname: respondent.nickname || user.nickname,
    birthYear: respondent.birthYear || user.birthYear,
    gender: respondent.gender || user.gender,
  };

  if (!isSameUserIdentity(state.user, user)) return null;

  state.respondent = respondentState;
  state.respondentPromise = null;

  return respondentState;
}

async function ensureRespondentReady() {
  if (state.respondent?.respondentId && state.respondent?.accessToken) return state.respondent;
  if (state.respondentPromise) {
    const respondent = await state.respondentPromise;
    if (respondent?.respondentId && respondent?.accessToken) return respondent;
  }
  if (state.user?.nickname) {
    state.respondentPromise = createRespondent(state.user);
    return await state.respondentPromise;
  }
  return null;
}

function respondentPayload() {
  if (!state.respondent?.respondentId || !state.respondent?.accessToken) return {};
  return {
    respondentId: state.respondent.respondentId,
    accessToken: state.respondent.accessToken,
    nickname: state.respondent.nickname || state.user?.nickname || null,
    birthYear: state.respondent.birthYear || state.user?.birthYear || null,
    gender: state.respondent.gender || state.user?.gender || null,
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
  const { blob, filename, title, text } = await createResultShareImage(track);
  const shareData = { title, text };
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ ...shareData, files: [file] });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") throw error;
    }
  }

  downloadBlob(blob, filename);
  return "downloaded";
}

async function saveResultImage(track) {
  const { blob, filename, title, text } = await createResultShareImage(track);
  const file = new File([blob], filename, { type: "image/png" });

  if (isTouchShareDevice() && navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ title, text, files: [file] });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") throw error;
    }
  }

  downloadBlob(blob, filename);
  return "downloaded";
}

function isMobileSafari() {
  const userAgent = navigator.userAgent || "";
  return /iP(ad|hone|od)/.test(userAgent) && /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS/i.test(userAgent);
}

function isTouchShareDevice() {
  return isMobileSafari() || (navigator.maxTouchPoints > 0 && /Android|Mobile|iP(ad|hone|od)/i.test(navigator.userAgent || ""));
}

function displayTrack2Grade(result = {}) {
  const rawGrade = String(result.grade || "").trim();
  const displayGradeByRaw = {
    "AI 파트너형": "AI 전략가",
    "AI 활용형": "실무 적용형",
    "AI 탐색형": "성장형 활용자",
    "AI 입문형": "단발성 사용자",
    "AI 초보형": "입문 사용자",
  };
  if (displayGradeByRaw[rawGrade]) return displayGradeByRaw[rawGrade];
  if (rawGrade && !/[#,:]/.test(rawGrade) && rawGrade.length <= 16) return rawGrade;

  const total = Number(result.total);
  if (Number.isFinite(total)) {
    if (total >= 85) return "AI 전략가";
    if (total >= 70) return "실무 적용형";
    if (total >= 55) return "성장형 활용자";
    if (total >= 40) return "단발성 사용자";
    return "입문 사용자";
  }
  return "AI 활용 역량";
}

function displayTrack2Summary(result = {}, summary = "") {
  const rawGrade = String(result.grade || "").trim();
  const displayGrade = displayTrack2Grade(result);
  return rawGrade && rawGrade !== displayGrade
    ? String(summary).replaceAll(rawGrade, displayGrade)
    : String(summary);
}

function createNativeShareData(track) {
  if (track === "track2") {
    const result = state.t2Result?.result || {};
    const grade = displayTrack2Grade(result);
    return {
      title: `내 AI 활용 역량은 ${grade}`,
      text: pookieShareText,
    };
  }

  const result = state.t1Result;
  const typeName = result?.type?.name || "AI 관계 유형";
  return {
    title: `내 AI 관계 유형은 ${typeName}`,
    text: pookieShareText,
  };
}

async function createResultShareImage(track) {
  const screenId = track === "track2"
    ? document.querySelector('.screen.active[data-screen="t2-share"]')
      ? "t2-share"
      : "t2-result"
    : document.querySelector('.screen.active[data-screen="t1-share"]')
      ? "t1-share"
      : "t1-result";

  const screenNode = document.querySelector(`.screen.active[data-screen="${screenId}"]`) ||
    document.querySelector(`.screen[data-screen="${screenId}"]`);
  const captureNode = screenId === "t1-share" || screenId === "t2-share"
    ? screenNode?.querySelector("[data-share-capture]") || screenNode
    : screenNode;
  const filename = track === "track2" ? "pookie-track2-result.png" : "pookie-track1-result.png";
  const title = createNativeShareData(track).title;
  const text = createNativeShareData(track).text;

  if (captureNode) {
    try {
      const blob = await captureScreenAsPng(captureNode);
      return { blob, filename, title, text };
    } catch (error) {
      console.warn("Result DOM capture failed; falling back to canvas image.", error);
    }
  }

  return track === "track2" ? createTrack2ShareImage() : createTrack1ShareImage();
}

async function createTrack1ShareImage() {
  const result = state.t1Result;
  const typeName = result?.type?.name || "AI 관계 유형";
  const card = result?.resultCard || {};
  const keywords = normalizeShareKeywords(card.keywords);
  const description = card.description || "AI 활용 진단 결과를 확인해보세요.";
  const canvas = createShareCanvas();
  const ctx = canvas.getContext("2d");
  await drawTrack1ShareCard(ctx, canvas, typeName, keywords, description);
  return canvasToSharePayload(canvas, "pookie-track1-result.png", `내 AI 관계 유형은 ${typeName}`, pookieShareText);
}

function normalizeShareKeywords(keywords) {
  const fallback = ["AI관계", "결과공유", "푸키"];
  const cleaned = (Array.isArray(keywords) ? keywords : [])
    .map((keyword) => String(keyword || "").replace(/^#/, "").trim())
    .filter(Boolean);
  return [...cleaned, ...fallback].slice(0, 3);
}

async function createTrack2ShareImage() {
  const result = state.t2Result?.result || {};
  const total = Number.isFinite(Number(result.total)) ? Math.round(Number(result.total)) : "--";
  const grade = displayTrack2Grade(result);
  const feedback = result.feedback || {};
  const summary = displayTrack2Summary(result, feedback.summary || "AI 활용 진단 결과를 확인해보세요.");
  const strength = feedback.strength || feedback.strengths?.[0]?.description || "강점 분석이 표시됩니다.";
  const weakness = feedback.weakness || feedback.weaknesses?.[0]?.description || "보완점 분석이 표시됩니다.";
  const canvas = createShareCanvas();
  const ctx = canvas.getContext("2d");
  drawTrack2ShareCard(ctx, canvas, { total, grade, axes: result.axes || {}, summary, strength, weakness });
  return canvasToSharePayload(canvas, "pookie-track2-result.png", `내 AI 활용 역량은 ${grade}`, pookieShareText);
}

function createShareCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  return canvas;
}

async function captureScreenAsPng(screenNode) {
  const width = Math.ceil(screenNode.getBoundingClientRect().width || 393);
  const minHeight = screenNode.matches?.("[data-share-capture]") ? 0 : 920;
  const height = Math.ceil(Math.max(screenNode.scrollHeight, screenNode.getBoundingClientRect().height, minHeight));
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

function drawTrack2ShareCard(ctx, canvas, result) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#7d39eb";
  roundRect(ctx, 72, 72, 56, 56, 8);
  ctx.fill();
  drawLogoEyes(ctx, 72, 72);
  drawText(ctx, "푸키", 148, 113, 34, 800, "#000", "Paperlogy");
  drawCloseIcon(ctx, 958, 80, 46);

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  roundRect(ctx, 56, 164, 968, 548, 28);
  ctx.stroke();

  drawCenteredText(ctx, "당신의 AI 활용 역량 점수는", 255, 48, 300, "#111", "Pretendard");
  drawCenteredText(ctx, `${result.total}점`, 338, 98, 800, "#000", "Unbounded");
  drawTrack2RadarCanvas(ctx, result.axes, 380, 378, 320);

  drawPill(ctx, result.grade, 326, 782, 428, 72, 36);
  drawCenteredMultilineText(ctx, result.summary, 936, 840, 42, 32, 300, "#111");
  drawTrack2FeedbackCard(ctx, 56, 1050, "Strength", "강점", result.strength);
  drawTrack2FeedbackCard(ctx, 56, 1202, "Weakness", "약점", result.weakness);
}

function drawCloseIcon(ctx, x, y, size) {
  ctx.save();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.restore();
}

function drawPill(ctx, text, x, y, width, height, radius) {
  ctx.fillStyle = "#c6ff33";
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.stroke();
  drawCenteredText(ctx, text, y + 48, 32, 800, "#000", "Pretendard");
}

function drawTrack2FeedbackCard(ctx, x, y, labelEn, labelKo, body) {
  ctx.fillStyle = "#fff";
  roundRect(ctx, x, y, 968, 116, 16);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = "800 30px Pretendard";
  ctx.fillStyle = "#7d39eb";
  ctx.textAlign = "left";
  ctx.fillText(labelEn, x + 62, y + 44);
  const labelWidth = ctx.measureText(labelEn).width;
  ctx.fillStyle = "#000";
  ctx.fillText(` ${labelKo}`, x + 62 + labelWidth, y + 44);

  drawMultilineText(ctx, body, x + 62, y + 82, 820, 29, 24, 400, "#000", 2);
}

function drawTrack2RadarCanvas(ctx, axes, x, y, size) {
  const axisOrder = ["task_clarity", "context", "role", "output_format", "iteration", "critical_review"];
  const fallbackLabels = {
    task_clarity: "작업 명확성",
    context: "맥락 설명",
    role: "역할 지정",
    output_format: "출력 형식",
    iteration: "반복 개선",
    critical_review: "비판적 검토",
  };
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const maxRadius = size * 0.28;
  const angles = [-90, -30, 30, 90, 150, 210];
  const point = (rate, index) => {
    const angle = (angles[index] * Math.PI) / 180;
    const radius = maxRadius * rate;
    return [centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius];
  };

  ctx.save();
  ctx.strokeStyle = "#d9d9d9";
  ctx.lineWidth = 2;
  for (const rate of [0.2, 0.4, 0.6, 0.8]) {
    const points = axisOrder.map((_, index) => point(rate, index));
    drawPolygonPath(ctx, points);
    ctx.stroke();
  }
  for (let index = 0; index < axisOrder.length; index += 1) {
    const [axisX, axisY] = point(1, index);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(axisX, axisY);
    ctx.stroke();
  }

  const radarPoints = axisOrder.map((key, index) => point(Math.max(0, Math.min(1, Number(axes[key]?.rate) || 0)), index));
  ctx.fillStyle = "#7d39eb";
  drawPolygonPath(ctx, radarPoints);
  ctx.fill();
  ctx.strokeStyle = "#7d39eb";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "#000";
  for (const [dotX, dotY] of radarPoints) {
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const labelPositions = [
    [centerX, y + 24, "center"],
    [x + size - 8, y + 112, "right"],
    [x + size - 8, y + 222, "right"],
    [centerX, y + size - 8, "center"],
    [x + 8, y + 222, "left"],
    [x + 8, y + 112, "left"],
  ];
  ctx.font = "500 22px Pretendard";
  ctx.fillStyle = "#000";
  axisOrder.forEach((key, index) => {
    const [labelX, labelY, align] = labelPositions[index];
    ctx.textAlign = align;
    ctx.fillText(axes[key]?.label || fallbackLabels[key], labelX, labelY);
  });
  ctx.restore();
}

function drawPolygonPath(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

async function drawTrack1ShareCard(ctx, canvas, typeName, keywords, description) {
  const descriptionLines = String(description || "")
    .split("\n")
    .filter(Boolean);
  const mainDescription = descriptionLines.slice(0, 2).join(" ") || "AI 관계 유형 결과입니다.";
  const subDescription = descriptionLines.slice(2).join(" ") || descriptionLines[0] || "AI 사용 패턴을 바탕으로 나온 결과입니다.";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#7d39eb";
  roundRect(ctx, 72, 72, 56, 56, 8);
  ctx.fill();
  drawLogoEyes(ctx, 72, 72);
  drawText(ctx, "푸키", 148, 113, 34, 800, "#000", "Paperlogy");

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  roundRect(ctx, 56, 164, 968, 1030, 34);
  ctx.stroke();

  drawCenteredText(ctx, "당신의 AI 관계 유형은", 250, 50, 300, "#111", "Pretendard");
  drawCenteredText(ctx, typeName, 324, 72, 800, "#7d39eb", "Unbounded");
  drawCenteredPills(ctx, keywords, 358, 760);
  await drawCharacter(ctx, characterSrcByType(typeName), 220, 468, 640, 450);
  drawCenteredMultilineText(ctx, mainDescription, 1000, 720, 44, 36, 800, "#7d39eb");
  drawCenteredMultilineText(ctx, subDescription, 1120, 700, 34, 28, 300, "#111");
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

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight, fontSize, fontWeight, color, maxLines = 5) {
  const lines = wrapText(ctx, String(text || "").replace(/\n+/g, " "), maxWidth, fontSize, fontWeight);
  ctx.font = `${fontWeight} ${fontSize}px Pretendard`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
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
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (isTouchShareDevice()) {
    setTimeout(() => {
      try {
        window.open(url, "_blank", "noopener,noreferrer");
      } catch {
        // Browser download behavior differs by mobile webview/Safari version.
      }
    }, 120);
  }
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
