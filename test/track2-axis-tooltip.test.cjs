const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
const track3Source = fs.readFileSync(path.join(ROOT, "frontend/track3-ui.js"), "utf8");
const shareCardSource = fs.readFileSync(path.join(ROOT, "frontend/share/share-cards.js"), "utf8");

function between(text, start, end) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return text.slice(startIndex, endIndex);
}

const axisInfo = between(source, "const TRACK_AXIS_INFO", "function renderTrack2TypeDistribution");
const radarRenderer = between(source, "function renderTrack2Radar", "function t3Screens");
const tooltipState = between(source, "function renderAxisInfoButton", "function t3Screens");
const track1Result = between(source, "function t1ResultScreen", "function t2IntroScreen");
const track1Share = between(source, "function t1ShareScreen", "function t2ShareScreen");
const track2Share = between(source, "function t2ShareScreen", "function t1ResultScreen");
const track3ScoreRows = between(track3Source, "function makeT3ScoreRows", "function makeT3DetailRows");
const track3DetailRows = between(track3Source, "function makeT3DetailRows", "function normalizedT3Turns");

const expectedAxisInfo = {
  track1: [
    ["dependency", "의존도", "AI가 일상·학습·업무 흐름에 얼마나 깊게 활용되고 있는가"],
    ["intimacy", "친밀도", "AI를 단순한 도구가 아닌 대화 상대처럼 느끼는가"],
    ["trust", "신뢰도", "AI의 답변을 얼마나 믿고 실제 판단과 행동에 활용하는가"],
    ["control", "통제욕구", "AI에게 맡기기보다 방향·조건·형식을 직접 설계하고 주도하는가"],
  ],
  track2: [
    ["task_clarity", "작업 명확성", "원하는 작업을 목표·조건·범위까지 구체적으로 정의하는가"],
    ["context", "배경·맥락 설명", "요청 전에 목적·배경·대상을 충분히 설명하는가"],
    ["role", "역할 지정", "AI에게 구체적인 전문가 역할이나 페르소나를 부여하는가"],
    ["output_format", "출력 형식 지정", "원하는 형식·길이·톤을 사전에 명시하는가"],
    ["iteration", "반복 개선 능력", "답변이 기대와 다를 때 정확히 짚어 수정 요청하는가"],
    ["critical_review", "비판적 검토", "AI 답변을 그대로 수용하지 않고 검증·반박하는가"],
  ],
  track3: [
    ["goal_definition", "목표 정의 능력", "수행해야 할 과업의 목적과 기대 결과를 구체적으로 명시하는가"],
    ["context", "맥락 제공 능력", "과업 수행에 필요한 배경정보, 참고자료 및 제약조건을 충분히 제공하는가"],
    ["information_structure", "정보 구조화 능력", "지시사항과 본문을 구분하고, 내용을 논리적인 구조와 우선순위로 제시하는가"],
    ["task_decomposition", "작업 분해 능력", "복합적인 과업을 실행 가능한 하위 단계로 체계적으로 분해하는가"],
    ["output_design", "출력 설계 능력", "결과물의 형식, 분량, 어조, 구성 및 예시를 명확히 지정하는가"],
    ["interaction_control", "상호작용 조율 능력", "AI의 응답을 바탕으로 핵심 방향을 신속하고 구체적으로 조정하는가"],
    ["verification", "검증 유도 능력", "오류 가능성, 반대 근거, 누락 요소 및 보완점을 점검하도록 요청하는가"],
    ["practical_application", "실무 적용 능력", "산출물이 실제 업무·학습 맥락에서 즉시 활용 가능한 수준으로 완성되었는가"],
  ],
};

test("common axis mapping keeps all Track 1, Track 2, and Track 3 descriptions", () => {
  Object.entries(expectedAxisInfo).forEach(([trackId, axes]) => {
    assert.match(axisInfo, new RegExp(`${trackId}:\\s*\\{`));
    axes.forEach(([key, label, description]) => {
      assert.match(axisInfo, new RegExp(`${key}:\\s*\\{`));
      assert.match(axisInfo, new RegExp(`label: "${label}"`));
      assert.match(axisInfo, new RegExp(`description: "${description}"`));
      assert.ok(label.length > 0);
      assert.ok(description.length > 0);
    });
  });
});

test("Track 1 and Track 3 full score lists render accessible axis buttons", () => {
  assert.match(track1Result, /renderAxisInfoButton\("track1", axisInfoKeys\[key\]\)/);
  assert.match(track1Result, /A: "dependency"[\s\S]*D: "control"/);
  assert.match(track3ScoreRows, /renderAxisInfoButton\("track3", key\)/);
  assert.match(tooltipState, /class="axis-info-button"/);
  assert.match(tooltipState, /type="button"/);
  assert.match(tooltipState, /aria-label=/);
  assert.match(tooltipState, /aria-expanded="false"/);
  assert.match(tooltipState, /aria-describedby=/);
  assert.match(tooltipState, /role="tooltip"/);
});

test("Track 2 reuses the common renderer and keeps its share radar free of controls", () => {
  assert.match(radarRenderer, /renderAxisInfoButton\("track2", key\)/);
  assert.match(track2Share, /renderTrack2Radar\(result, false\)/);
  assert.doesNotMatch(track1Share, /axis-info-button|axis-info-tooltip/);
  assert.doesNotMatch(track2Share, /axis-info-button|axis-info-tooltip/);
  assert.doesNotMatch(shareCardSource, /axis-info-button|axis-info-tooltip/);
  assert.doesNotMatch(track3DetailRows, /renderAxisInfoButton/);
});

test("common tooltip state toggles one item and closes on outside click, Escape, and navigation", () => {
  assert.match(tooltipState, /buttonNode !== exceptButton/);
  assert.match(tooltipState, /getAttribute\("aria-expanded"\) !== "true"/);
  assert.match(tooltipState, /closeAxisInfoTooltips\(\)/);
  assert.match(source, /!event\.target\.closest\("\.axis-info-tooltip"\)/);
  assert.match(source, /event\.key === "Escape"[\s\S]*closeAxisInfoTooltips\(\)/);
  assert.match(source, /function showScreen\(name\)[\s\S]*closeAxisInfoTooltips\(\)/);
});

test("opening an axis tooltip emits only fixed analytics identifiers", () => {
  assert.match(tooltipState, /sendGaEvent\("axis_info_open"/);
  assert.match(tooltipState, /track_id: buttonNode\.dataset\.axisInfoTrack/);
  assert.match(tooltipState, /axis_id: buttonNode\.dataset\.axisInfoId/);
  assert.doesNotMatch(tooltipState, /description:/);
});
