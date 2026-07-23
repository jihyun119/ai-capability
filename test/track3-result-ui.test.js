const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
const cssSource = fs.readFileSync(path.join(ROOT, "frontend/track3-desktop.css"), "utf8");

function between(start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return source.slice(startIndex, endIndex);
}

const resultScreen = between('"T3-05 결과 화면",', '"T3-08 상세 리포트",');
const reportScreen = between('"T3-08 상세 리포트",', '].join("");');

test("Track 3 result keeps shared summary and detail data with responsive actions", () => {
  assert.match(resultScreen, /상세 리포트 보기/);
  assert.match(resultScreen, /t3-detail-open/);
  assert.match(resultScreen, /공유하기/);
  assert.match(resultScreen, /t3-result-share/);
  assert.match(resultScreen, /다른 Track 도전/);
  assert.match(resultScreen, /t3-result-home/);
  assert.match(resultScreen, /t3-result-report/);
  assert.match(resultScreen, /t3ResultHeadline\(\)/);
  assert.match(resultScreen, /t3ResultSummary\(\)/);
  assert.match(resultScreen, /makeT3DetailRows\(\)/);
});

test("Track 3 detail report renders summary, weakest areas, and return actions", () => {
  assert.match(reportScreen, /t3ResultHeadline\(\)/);
  assert.match(reportScreen, /t3ResultSummary\(\)/);
  assert.match(reportScreen, /makeT3DetailRows\(\)/);
  assert.match(reportScreen, /다른 Track 도전/);
  assert.match(reportScreen, /t3-result-home/);
  assert.match(reportScreen, /이전/);
  assert.match(reportScreen, /"t3-result"/);
});

test("Track 3 detail rows keep the three lowest scored areas", () => {
  const detailRows = between("function t3DetailRowsFromEvaluation()", "function makeT3ScoreRows()");
  assert.match(detailRows, /sort\(\(a, b\) => a\.score - b\.score\)/);
  assert.match(detailRows, /slice\(0, 3\)/);
});

test("Track 3 desktop result is two columns without mobile navigation actions", () => {
  assert.match(cssSource, /grid-template-columns:\s*609px 591px/);
  assert.match(cssSource, /\.t3-result-screen \.t3-detail-open\s*\{\s*display:\s*none !important/);
  assert.match(cssSource, /\.t3-result-screen \.t3-result-home\s*\{\s*display:\s*flex !important/);
});

test("Track 3 mobile result separates summary and detail views at the existing breakpoint", () => {
  assert.match(source, /matchMedia\("\(max-width: 1180px\)"\)/);
  assert.match(source, /name === "t3-report" && !t3MobileResultMedia\.matches/);
  assert.match(source, /addEventListener\?\.\("change"/);
  assert.match(cssSource, /\.t3-result-screen \.t3-result-report\s*\{\s*display:\s*none !important/);
  assert.match(cssSource, /\.t3-result-screen \.t3-result-home\s*\{\s*display:\s*none !important/);
  assert.match(cssSource, /\.t3-result-screen \.t3-detail-open\s*\{\s*display:\s*flex !important/);
});

test("Track 3 share handler and Track 1/2 result renderers remain available", () => {
  assert.match(source, /closest\("\.t3-result-share"\)/);
  const appSource = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
  assert.match(appSource, /function t1ResultScreen\(/);
  assert.match(appSource, /function t2ResultScreen\(/);
});
