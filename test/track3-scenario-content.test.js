import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendSource = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
const scenarioSource = fs.readFileSync(path.join(ROOT, "src/track3/scenarios.js"), "utf8");
const track3Styles = fs.readFileSync(path.join(ROOT, "frontend/track3-desktop.css"), "utf8");
const shareCardSource = fs.readFileSync(path.join(ROOT, "frontend/share/share-cards.js"), "utf8");

test("Track 3 workspace explains that the artifact keeps updating", () => {
  assert.match(frontendSource, /작업 영역은 대화 진행에 따라 지속적으로 업데이트됩니다\./);
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

test("artifact cards stay within the workspace instead of inheriting a fixed placeholder height", () => {
  assert.doesNotMatch(track3Styles, /\.t3-workspace\s*>\s*div\s*\{[^}]*height:\s*132px/s);
  assert.match(track3Styles, /\.t3-artifact-body\s*>\s*article\s*\{[^}]*height:\s*auto\s*!important;[^}]*max-width:\s*100%\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-artifact-doc\s*\{[^}]*height:\s*auto\s*!important;[^}]*overflow:\s*visible\s*!important;/s);
  assert.match(track3Styles, /\.t3-artifact-body\s*\{[^}]*grid-auto-rows:\s*max-content\s*!important;/s);
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
  assert.match(track3Styles, /\.t3-artifact-change[\s\S]*color: inherit !important;[\s\S]*font-weight: 700 !important/);
  assert.doesNotMatch(track3Styles, /\.t3-artifact-change[\s\S]{0,180}color: var\(--t3-violet\) !important/);
  assert.match(track3Styles, /\.t3-markdown p,[\s\S]*font-weight: 400 !important/);
  assert.match(track3Styles, /\.t3-markdown strong,[\s\S]*font-weight: 400 !important/);
  assert.match(track3Styles, /\.t3-artifact-change[\s\S]*font-family: "Pretendard", sans-serif !important;[\s\S]*font-weight: 700 !important/);
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
