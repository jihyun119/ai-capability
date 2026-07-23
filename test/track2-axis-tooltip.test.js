const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");

function between(start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return source.slice(startIndex, endIndex);
}

const axisInfo = between("const TRACK2_AXIS_INFO", "function renderTrack2TypeDistribution");
const radarRenderer = between("function renderTrack2Radar", "function t3Screens");
const tooltipState = between("function closeTrack2AxisTooltips", "function t3Screens");

test("Track 2 defines all six axis labels and descriptions in one mapping", () => {
  [
    ["task_clarity", "작업 명확성", "원하는 작업을 목표·조건·범위까지 구체적으로 정의하는가"],
    ["context", "배경·맥락 설명", "요청 전에 목적·배경·대상을 충분히 설명하는가"],
    ["role", "역할 지정", "AI에게 구체적인 전문가 역할이나 페르소나를 부여하는가"],
    ["output_format", "출력 형식 지정", "원하는 형식·길이·톤을 사전에 명시하는가"],
    ["iteration", "반복 개선 능력", "답변이 기대와 다를 때 정확히 짚어 수정 요청하는가"],
    ["critical_review", "비판적 검토", "AI 답변을 그대로 수용하지 않고 검증·반박하는가"],
  ].forEach(([key, label, description]) => {
    assert.match(axisInfo, new RegExp(`${key}:`));
    assert.match(axisInfo, new RegExp(`label: "${label}"`));
    assert.match(axisInfo, new RegExp(`description: "${description}"`));
  });
});

test("Track 2 axis controls use accessible buttons without changing share rendering", () => {
  const shareScreen = between("function t2ShareScreen", "function t1ResultScreen");
  assert.match(radarRenderer, /class="track2-axis-info-button"/);
  assert.match(radarRenderer, /type="button"/);
  assert.match(radarRenderer, /aria-label=/);
  assert.match(radarRenderer, /aria-expanded="false"/);
  assert.match(radarRenderer, /aria-describedby=/);
  assert.match(radarRenderer, /role="tooltip"/);
  assert.match(shareScreen, /renderTrack2Radar\(result, false\)/);
  assert.doesNotMatch(shareScreen, /track2-axis-info-button/);
});

test("Track 2 tooltip state closes siblings, toggles itself, and supports outside click and Escape", () => {
  assert.match(tooltipState, /buttonNode !== exceptButton/);
  assert.match(tooltipState, /getAttribute\("aria-expanded"\) !== "true"/);
  assert.match(tooltipState, /closeTrack2AxisTooltips\(\)/);
  assert.match(source, /!event\.target\.closest\("\.track2-axis-tooltip"\)/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /function showScreen\(name\)[\s\S]*closeTrack2AxisTooltips\(\)/);
});

test("Track 1 and Track 3 result renderers remain separate from Track 2 axis controls", () => {
  const track1Result = between("function t1ResultScreen", "function t2IntroScreen");
  const track3Screens = between("function t3Screens", "function myReportScreen");
  assert.doesNotMatch(track1Result, /track2-axis-/);
  assert.doesNotMatch(track3Screens, /track2-axis-/);
});
