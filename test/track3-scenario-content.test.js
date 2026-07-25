import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { TRACK3_SCENARIOS } from "../src/track3/scenarios.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendSource = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
const scenarioSource = fs.readFileSync(path.join(ROOT, "src/track3/scenarios.js"), "utf8");
const track3Styles = fs.readFileSync(path.join(ROOT, "frontend/track3-desktop.css"), "utf8");
const shareCardSource = fs.readFileSync(path.join(ROOT, "frontend/share/share-cards.js"), "utf8");

test("Track 3 workspace explains that the artifact keeps updating", () => {
  assert.match(frontendSource, /작업 영역은 대화 진행에 따라 지속적으로 업데이트됩니다\./);
  assert.match(frontendSource, /class="t3-workspace-guide"/);
  assert.match(frontendSource, /최종 제출 시, 작업 영역 전체가 하나의 결과물로 평가됩니다\./);
  assert.doesNotMatch(frontendSource, /최종 제출물 작업 영역/);
  assert.match(track3Styles, /\.t3-workspace \.t3-workspace-guide/);
});

test("PM scenario consistently uses product team wording", () => {
  assert.match(frontendSource, /키키오 선물하기 프로덕트 팀의 PM/);
  assert.match(scenarioSource, /키키오 선물하기 프로덕트 팀의 PM/);
  assert.doesNotMatch(frontendSource, /키키오 선물하기 서비스 개선 팀의 PM/);
});

test("data analysis scenario exposes compact schemas for all available datasets", () => {
  assert.match(frontendSource, /class="t3-data-schema"/);
  for (const value of ["가입자 정보", "구매 로그", "고객 문의 로그", "user_id", "payment_amount", "satisfaction_score"]) {
    assert.match(frontendSource, new RegExp(value));
    assert.match(scenarioSource, new RegExp(value));
  }
});

test("frontend fallbacks stay aligned with canonical backend scenario displays", () => {
  for (const scenario of TRACK3_SCENARIOS) {
    const displayValues = [
      scenario.display.summary,
      ...scenario.display.tags,
      ...scenario.display.situation,
      ...scenario.display.mission,
      ...(scenario.display.news || []),
      ...(scenario.display.metrics || []).flat(),
      ...(scenario.display.dataSources || []),
      ...(scenario.display.dataSchemas || []).flatMap((schema) => [schema.name, ...schema.columns])
    ];

    for (const value of displayValues) {
      assert.ok(
        frontendSource.includes(value),
        `${scenario.scenario_id} frontend fallback is missing canonical value: ${value}`
      );
    }
  }
});

test("scenario sources do not contain unsupported PM staffing assumptions", () => {
  assert.doesNotMatch(scenarioSource, /개발자 2명|디자이너 1명|영업팀 제안/);
  assert.match(scenarioSource, /개발자 제안: 쿠폰함 알림 기능/);
});

test("artifact cards stay within the workspace instead of inheriting a fixed placeholder height", () => {
  assert.doesNotMatch(track3Styles, /\.t3-workspace\s*>\s*div\s*\{[^}]*height:\s*132px/s);
  assert.match(track3Styles, /\.t3-artifact-body\s*>\s*article\s*\{[^}]*height:\s*auto\s*!important;[^}]*max-width:\s*100%\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-artifact-doc\s*\{[^}]*height:\s*auto\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-artifact-body\s*\{[^}]*grid-auto-rows:\s*max-content\s*!important;/s);
});

test("Track 3 mobile chat uses document scrolling instead of nested viewport locks", () => {
  assert.match(track3Styles, /\.screen\.active\.t3-chat-screen\s*\{[^}]*min-height:\s*100dvh\s*!important;[^}]*height:\s*auto\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-chat-layout\s*\{[^}]*flex:\s*0 0 auto\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-chat-layout\s*>\s*\.t3-chat-brief,[\s\S]*?overflow:\s*visible\s*!important;/);
  assert.match(track3Styles, /\.t3-chat-brief\s*\{[^}]*overflow-y:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-workspace\s*\{[^}]*overflow-y:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\[data-t3-tab="chat"\]\s*\.t3-chat-messages\s*\{[^}]*overflow-y:\s*visible\s*!important;/s);
});

test("sending a Track 3 message clears the composer while the request is pending", () => {
  const sendStart = frontendSource.indexOf("async function sendTrack3Chat()");
  const sendEnd = frontendSource.indexOf("function persistTrack3Result", sendStart);
  const sendSource = frontendSource.slice(sendStart, sendEnd);

  assert.match(sendSource, /state\.t3Draft = "";\s*state\.t3Turns = \[\.\.\.turnsBeforeRequest/);
  assert.doesNotMatch(sendSource, /pendingInput\.value = rawMessage/);
  assert.match(frontendSource, /input\.disabled = t3ChatPending \|\| turnComplete/);
  assert.match(sendSource, /catch \(error\)[\s\S]*state\.t3Draft = rawMessage/);
});

test("Track 3 highlights only latest artifact changes with typography", () => {
  assert.match(frontendSource, /state\.t3PreviousArtifact = state\.t3Artifact \|\| "";/);
  assert.match(frontendSource, /renderT3Markdown\(content, previousContentBySection\.get\(title\) \|\| ""\)/);
  assert.match(frontendSource, /function highlightT3MarkdownChanges\(currentHtml, previousHtml\)/);
  assert.match(frontendSource, /element\.classList\.add\("t3-artifact-change"\)/);
  assert.match(frontendSource, /element\.setAttribute\("data-t3-change", "latest"\)/);
  assert.match(frontendSource, /bodySelector = "p, li, blockquote, pre, td"/);
  assert.match(frontendSource, /element\.style\.setProperty\("font-weight", "400", "important"\)/);
  assert.match(frontendSource, /changedNode\.style\.setProperty\("font-weight", "700", "important"\)/);
  assert.doesNotMatch(track3Styles, /\.t3-artifact-change[\s\S]{0,220}font-weight/);
  assert.doesNotMatch(track3Styles, /\.t3-artifact-change[\s\S]{0,180}color: var\(--t3-violet\) !important/);
  assert.match(track3Styles, /\.t3-markdown p,[\s\S]*font-weight: 400 !important/);
  assert.match(track3Styles, /\.t3-markdown strong,[\s\S]*font-weight: 400 !important/);
  assert.match(frontendSource, /changedNode\.style\.setProperty\("color", "inherit", "important"\)/);
});

test("Track 3 artifact assets use their current cache versions", () => {
  const indexSource = fs.readFileSync(path.join(ROOT, "frontend/index.html"), "utf8");
  assert.match(indexSource, /track3-desktop\.css\?v=20260725-t3-mobile-scroll/);
  assert.match(indexSource, /track3-content-fix\.js\?v=20260723-weakness-title/);
});

test("Track 3 displays five-level axis labels while preserving numeric progress", () => {
  assert.match(frontendSource, /const labels = \["최하", "하", "중", "상", "최상"\]/);
  assert.match(frontendSource, /level: t3AxisLevel\(percent\)/);
  assert.match(frontendSource, /<strong>\$\{escapeHtml\(level\)\}<\/strong><i><span style="width:\$\{percent\}%"/);
  assert.doesNotMatch(frontendSource, /<strong>\$\{score\}점<\/strong><i><span style="width:\$\{percent\}%"/);
  assert.match(frontendSource, /key: "practical_application"[\s\S]*label: "실무 적용"/);
  assert.match(shareCardSource, /"검증 유도",\s*"실무 적용"/);
  assert.match(shareCardSource, /K\.drawText\(ctx, row\.level/);
});

test("Track 3 report separates the headline and constrains detailed feedback", () => {
  const summaryStart = frontendSource.indexOf("function t3ResultSummary()");
  const summaryEnd = frontendSource.indexOf("const T3_SHARE_AXES", summaryStart);
  const summarySource = frontendSource.slice(summaryStart, summaryEnd);

  assert.doesNotMatch(summarySource, /feedback\.summary_strengths/);
  assert.match(summarySource, /headlineSentences\.has\(normalized\)/);
  assert.match(summarySource, /next\.length > 140/);
  assert.match(frontendSource, /comment\.length < 70/);
  assert.match(frontendSource, /comment\.length > 140/);
  assert.match(frontendSource, /t3UsesPoliteYoStyle\(comment\)/);
});
