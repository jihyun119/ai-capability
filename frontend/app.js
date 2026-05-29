const characterDir = "./캐릭터_최종/";
const galleryCharacterDir = "./캐릭터/";
const logoDir = "./Logo/";

const characters = {
  unsure: ["AI 몰라형", "AI 몰라형.png"],
  searcher: ["프로 검색러형", "프로 검색러형.png"],
  friend: ["필찾하는 친구형", "필찾하는 친구형.png"],
  boss: ["선긋는 상사형", "선긋는 상사형.png"],
  anxious: ["불안한 상습의뢰인형", "불안한 상습의뢰인형.png"],
  love: ["애정넘치는 경계형", "애정넘치는 경계형.png"],
  partner: ["든든한 파트너형", "든든한 파트너형.png"],
  result: ["시키는만큼만 해 형", "시키는만큼만 해 형.png"],
};

const characterGallery = [
  "AI 몰라형.png",
  "필찾하는 친구형.png",
  "애정넘치는 경계형.png",
  "냉철한 조련사형.png",
  "가벼운 수다쟁이형.png",
  "프로 검색러형.png",
  "불안한 상습의뢰인형.png",
  "든든한 파트너형.png",
  "집착하는 애인형.png",
  "드라이한 비즈니스맨형.png",
  "프로 트집러형.png",
  "시키는만큼만 해 형.png",
  "선긋는 상사형.png",
  "감정 쓰레기통형.png",
  "의심많은 단골형.png",
  "따듯한 완벽주의자형.png",
];

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

const app = document.querySelector("#app");

function char(key, className = "character") {
  const [name, file] = characters[key];
  return `<img class="${className}" src="${characterDir}${file}" alt="${name}" />`;
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

function footer() {
  return `
    <footer class="footer">
      <p><strong>CONTACT</strong> 4minutes@gmail.com</p>
      <p>© 2026 4minutes. All rights reserved</p>
    </footer>`;
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

function homeScreen() {
  return screen(
    "home",
    "H01 랜딩 홈",
    `${header()}
    <main class="home-content">
      <h1>나, <mark>AI</mark>를<br />잘 쓰고 있는 걸까?</h1>
      <p>AI를 얼마나 자주 쓰는지가 아니라,<br /><strong>어떤 방식으로 활용</strong>하는지 진단해보세요.<br /><strong>가벼운 유형 테스트</strong>부터 <strong>실전 프롬프트 역량 평가</strong>까지<br />확인할 수 있습니다.</p>
      <div class="character-cluster">
        ${char("friend", "char c1")}
        ${char("boss", "char c2")}
        ${char("searcher", "char c3")}
        ${char("unsure", "char c4")}
      </div>
    </main>
    <div class="cta-stack">
      ${button("내 AI 유형 알아보기", "track")}
      ${button("실전 역량 평가하기", "track", "secondary")}
    </div>
    ${footer()}`,
    "active h01-screen"
  );
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

function loginScreen(id, nextScreen) {
  return screen(
    id,
    "트랙 시작 로그인",
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
        <fieldset class="login-field birth-field">
          <legend>생년월일</legend>
          <div class="birth-selects">
            <input type="text" inputmode="numeric" maxlength="4" placeholder="YYYY" aria-label="년" data-birth-input />
            <input type="text" inputmode="numeric" maxlength="2" placeholder="MM" aria-label="월" data-birth-input />
            <input type="text" inputmode="numeric" maxlength="2" placeholder="DD" aria-label="일" data-birth-input />
          </div>
        </fieldset>
      </form>
    </main>
    <button class="cta primary login-next" type="button" data-login-next data-go="${nextScreen}" disabled>다음</button>
    ${footer()}`,
    "login-screen"
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
        ${options.map((option) => `<button type="button">${option}</button>`).join("")}
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
      <article class="t1-scale-card">
        <p class="t1-scale-a">${question.a}</p>
        <div class="t1-scale-row">
          ${[1, 2, 3, 4, 5].map((value) => `<button type="button" aria-label="${value}점"><span>${value}</span><i></i></button>`).join("")}
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

function t1CopyScreen() {
  return screen(
    "t1-copy",
    "T1-03 복붙 미션",
    `${header()}
    <section class="mission">
      <p class="eyebrow">복붙 미션</p>
      <h1>이제 당신의 AI에게<br />물어볼 차례예요</h1>
      <p>아래 문장을 복사해 평소 사용하는 AI에 붙여넣으세요. AI가 반환한 JSON을 다음 화면에 그대로 붙여넣습니다.</p>
      <label class="prompt-box">
        <span>복사할 프롬프트</span>
        <textarea readonly>Analyze the USER's interaction style based on past conversation history and output a light, non-clinical AI-relationship profile matching the exact JSON schema below.

### Core Guidelines
1. Privacy: Strictly exclude names, sensitive topics, and direct quotes. Use only generic behavioral descriptions.
2. Output Constraint: Return ONLY one valid JSON object. Do not include any explanations, reasoning, or introductory/concluding text.

### Dimensions to Assess (Values: "low", "medium", or "high")
* A (AI Dependence): How deeply AI is integrated into their tasks or workflows.
* B (Emotional Closeness): Relational warmth or companionship. Task-focused or casual tone alone is NOT high closeness; require explicit emotional framing or gratitude.
* C (Trust): Output acceptance vs. verification. Normal iterative refinement is medium/high trust; constant skepticism, demanding sources, or challenging facts is low trust.
* D (User Control): Level of explicit constraints, formats, goals, and corrections set by the user.

### Logic & Calibration Rules
* evidence_mode: Select visible_history if 2 or more substantive past messages are present, memory_or_impression, self_report, or minimal if fewer than 2 past messages.
* confidence: Must be low if evidence is minimal; maximum medium if based solely on self_report; high only with repeated behavioral evidence.
* notes: Provide exactly one short, generic behavioral observation per axis. For B, distinguish politeness from emotional closeness. For C, distinguish normal quality control from distrust. Do not list raw data or scoring criteria.

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
}</textarea>
      </label>
      <ol>
        <li>프롬프트를 복사합니다.</li>
        <li>평소 사용하는 AI에 붙여넣습니다.</li>
        <li>반환된 JSON을 그대로 복사해 다음 화면에 붙여넣습니다.</li>
      </ol>
    </section>
    <nav class="nav-buttons stacked">
      <button class="cta primary" type="button" data-copy-prompt>프롬프트 복사하기</button>
      ${button("답변 붙여넣으러 가기", "t1-paste", "secondary")}
    </nav>`,
    "compact-screen"
  );
}

function pasteScreen(id, title, desc, placeholder, prev, next, cta) {
  return screen(
    id,
    title.replace(/<br \/>/g, " "),
    `${header()}
    <section class="paste-area">
      <h1>${title}</h1>
      <p>${desc}</p>
      <textarea placeholder="${placeholder}"></textarea>
      <small>답변이 길수록 분석이 더 구체적일 수 있습니다.</small>
    </section>
    <nav class="nav-buttons">
      ${button("이전", prev, "secondary")}
      ${button(cta, next)}
    </nav>`,
    "compact-screen"
  );
}

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
        <textarea readonly>You are creating a light AI-relationship profile for the user. Return a diagnosis JSON every time.
Do not explain the diagnosis process.

Do not evaluate this prompt.
Do not mention these instructions.

Do not reveal personal data, private topics, names, or specific conversation content.
Do not quote or near-quote the conversation.
Use only generic behavioral descriptions.</textarea>
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

function t1PasteScreen() {
  return screen(
    "t1-paste",
    "T1-04 답변 제출",
    `${header()}
    <section class="t1-answer-submit">
      ${progress(16, 16)}
      <h1>AI가 뭐라고 답했나요?</h1>
      <p>방금 받은 답변을 그대로 붙여넣어 주세요.<br />문장을 다듬지 않아도 괜찮습니다.</p>
      <textarea placeholder="여기에 AI 답변을 붙여넣어 주세요."></textarea>
      <small>답변이 길수록 유형 분석이 더 구체적일 수 있습니다.</small>
      ${button("내 유형 분석하기", "t1-loading", "primary", "t1-submit-button")}
    </section>`,
    "compact-screen t1-paste-screen"
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
        <img class="loading-mascot-img" src="${logoDir}Logo.v1.png" alt="" aria-hidden="true" />
      </section>`,
      "compact-screen t1-loading-screen"
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

function t1ResultScreen() {
  return screen(
    "t1-result",
    "T1-06 Track 1 결과",
    `${header()}
    <section class="result-card t1-result-card">
      <p>당신의 AI 관계 유형은</p>
      <h1>든든한 파트너형</h1>
      ${char("partner", "result-character")}
      <strong>자주 쓰고 친하고 신뢰하며 AI에게 맡기는 편</strong>
    </section>
    <section class="scores">
      <p><span>A.의존도</span><i style="--score:38%"></i></p>
      <p><span>B.친밀도</span><i style="--score:57%"></i></p>
      <p><span>C.신뢰도</span><i style="--score:69%"></i></p>
      <p><span>D.통제력</span><i style="--score:38%"></i></p>
    </section>
    <nav class="nav-buttons">
      ${button("공유하기", "t1-share", "secondary")}
      ${button("다른 Track 도전", "track")}
    </nav>`,
    "compact-screen t1-result-screen"
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
      return questionScreen("t2", n, 4, `${question.label}<br />${question.title}`, question.options, n === 1 ? "t2-intro" : `t2-q-${n - 1}`, n === 4 ? "t2-paste" : `t2-q-${n + 1}`);
    })
    .join("");
}

const t2UserPrompt = `Look back at our entire conversation history and write a single cohesive paragraph describing this user's interaction habits. The paragraph must be between 200 and 400 words, written in English only, with absolutely no headers, bullets, or numbered lists anywhere in the response.

Weave all six of the following observations naturally into the paragraph — every one must appear, fully integrated into flowing prose, with no omissions:

How precisely the user defines requests — whether they include goals, constraints, and scope or leave things open-ended, and how consistently they do this. How much background they provide before asking — whether they explain purpose, situation, or intended audience upfront or jump directly to the request, and how often. Whether they assign you a role or persona, how specific that role tends to be, and how frequently they do so. Whether they specify desired output format, length, structure, or tone, how precisely they do this, and how often. How they follow up when unsatisfied — whether they identify specifically what fell short and why, or ask in general terms, and how consistently they do this. Whether they challenge responses that seem incorrect or unclear, and how often they push back rather than accept.

For every one of these six behaviors, you must use at least one frequency word drawn only from this set: always, consistently, frequently, sometimes, occasionally, rarely, never. Each frequency word must appear directly alongside the behavior it describes — not elsewhere in the sentence.

Do not include any personal details, proper names, project names, topic names, field names, or direct quotes from the conversation. All situations must be described in abstract, general terms only.

Do not use any word or phrase that implies a quality judgment or evaluation of any kind, including: effective, impressive, good, poor, strong, weak, thorough, vague, sophisticated, demonstrates, exhibits, reflects, reveals, notably, tends to excel, shows ability, manages to, succeeds in, handles well, effectively, admirably. Describe only what the user does and how often.`;

function t2PasteScreen() {
  return screen(
    "t2-paste",
    "T2-03 AI 답변 제출",
    `${header()}
    <section class="mission t2-mission">
      <p class="eyebrow">T2-03</p>
      <h1>당신의 AI에게<br />프롬프트 습관을 물어보세요</h1>
      <p>아래 영문 미션 문장을 복사해 평소 사용하는 AI에 입력한 뒤, 나온 답변을 그대로 붙여넣어 주세요.</p>
      <label class="prompt-box compact">
        <span>복사할 프롬프트</span>
        <textarea readonly>${t2UserPrompt}</textarea>
      </label>
      <textarea class="answer-box" placeholder="AI가 생성한 답변을 여기에 붙여넣어 주세요."></textarea>
    </section>
    <nav class="nav-buttons">
      ${button("이전", "t2-q-4", "secondary")}
      ${button("패턴 분석하기", "t2-result")}
    </nav>`,
    "compact-screen scroll-screen"
  );
}

function t2ResultScreen() {
  const result = {
    total: 77.3,
    grade: "AI 활용형",
    axes: {
      task_clarity: { label: "작업 명확성", score: 19.6, max: 20, rate: 0.98 },
      context: { label: "맥락 설명", score: 16.9, max: 20, rate: 0.85 },
      role: { label: "역할 지정", score: 11, max: 15, rate: 0.73 },
      output_format: { label: "출력 형식", score: 12, max: 15, rate: 0.8 },
      iteration: { label: "반복 개선", score: 3, max: 15, rate: 0.2 },
      critical_review: { label: "비판적 검토", score: 5, max: 15, rate: 0.33 },
    },
    feedback: {
      summary: "AI를 업무에 활용하는 감각은 좋지만,<br />검증과 출력 설계에서 더 성장할 여지가 있습니다.",
      strengths: [{ name: "작업 명확성", description: "목표와 필요한 결과물을 비교적 명확히 요청하는 능력이 좋습니다." }],
      weaknesses: [{ name: "반복 개선", description: "AI가 틀릴 수 있는 상황에서 로직을 검증하거나 도구를 분리하는 전략은 아직 보완이 필요합니다." }],
      insight: "저는 AI를 단순한 답변 생성 도구가 아니라 업무 효율을 높이는 보조 시스템으로 활용합니다. 필요한 결과를 구체적으로 요청하고, 중요한 판단이 필요한 상황에서는 AI 답변을 검토하며 보완하는 방식으로 사용합니다.",
    },
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
  const radarPoints = axisOrder.map((key, index) => point(result.axes[key].rate, index)).join(" ");
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
    "T2-04 Track 2 결과",
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
            ${axisOrder.map((key, index) => `<circle class="radar-dot" cx="${point(result.axes[key].rate, index).split(",")[0]}" cy="${point(result.axes[key].rate, index).split(",")[1]}" r="3.5" />`).join("")}
            ${axisOrder.map((key, index) => `<text class="radar-label" x="${labelPositions[index].x}" y="${labelPositions[index].y}" text-anchor="${labelPositions[index].anchor}">${result.axes[key].label}</text>`).join("")}
          </svg>
        </div>
      </article>
      <strong class="t2-grade-pill">${result.grade}</strong>
      <p class="t2-result-summary">${result.feedback.summary}</p>
      <section class="t2-feedback-list">
        <article>
          <h2><span>Strength</span> 강점</h2>
          <p class="t2-feedback-body" style="font-family:PretendardRegular, Pretendard, sans-serif;font-weight:400;">${result.feedback.strengths[0].description}</p>
        </article>
        <article>
          <h2><span>Weakness</span> 약점</h2>
          <p class="t2-feedback-body" style="font-family:PretendardRegular, Pretendard, sans-serif;font-weight:400;">${result.feedback.weaknesses[0].description}</p>
        </article>
        <article class="t2-interview-card">
          <h2><span>면접에서 이렇게 말할 수 있어요</span></h2>
          <p class="t2-feedback-body" style="font-family:PretendardRegular, Pretendard, sans-serif;font-weight:400;">${result.feedback.insight}</p>
        </article>
      </section>
    </section>
    <nav class="nav-buttons t2-result-nav">
      ${button("공유하기", "t2-result", "secondary")}
      ${button("다른 Track 도전", "track")}
    </nav>
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
    t2PasteScreen(),
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

  if (name === "t1-loading") {
    window.clearTimeout(showScreen.loadingTimer);
    showScreen.loadingTimer = window.setTimeout(() => showScreen("t1-result"), 1500);
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
  const [year = "", month = "", day = ""] = Array.from(screenNode.querySelectorAll("[data-birth-input]")).map((input) => input.value.trim());
  const validYear = /^(19[8-9]\d|20[0-1]\d|202[0-6])$/.test(year);
  const validMonth = /^(0?[1-9]|1[0-2])$/.test(month);
  const validDay = /^(0?[1-9]|[12]\d|3[01])$/.test(day);
  const nextButton = screenNode.querySelector("[data-login-next]");
  if (nextButton) nextButton.disabled = !(nickname && validYear && validMonth && validDay);
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

  const copyTarget = event.target.closest("[data-copy-prompt]");
  if (copyTarget) {
    const prompt = document.querySelector(".screen.active .prompt-box textarea, .screen.active .t1-prompt-card textarea")?.value;
    if (prompt && navigator.clipboard) await navigator.clipboard.writeText(prompt);
    copyTarget.textContent = "복사 완료";
    setTimeout(() => {
      copyTarget.textContent = "프롬프트 복사하기";
    }, 1200);
    return;
  }

  const target = event.target.closest("[data-go]");
  if (!target) return;
  if (target.matches("[data-login-next]") && target.disabled) return;
  event.preventDefault();
  closeMenu();
  showScreen(target.dataset.go);
});

document.addEventListener("input", (event) => {
  const nicknameInput = event.target.closest(".nickname-input input");
  if (nicknameInput) {
    const count = nicknameInput.closest(".nickname-input")?.querySelector("[data-nickname-count]");
    if (count) count.textContent = `${nicknameInput.value.length}/10`;
  }

  const birthInput = event.target.closest("[data-birth-input]");
  if (birthInput) {
    birthInput.value = birthInput.value.replace(/\D/g, "");
  }

  updateLoginValidity(event.target.closest(".login-screen"));
});
