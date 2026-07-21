import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendSource = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
const scenarioSource = fs.readFileSync(path.join(ROOT, "src/track3/scenarios.js"), "utf8");
const track3Styles = fs.readFileSync(path.join(ROOT, "frontend/track3-desktop.css"), "utf8");

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
  assert.match(track3Styles, /\.t3-artifact-body\s*>\s*article\s*\{[^}]*min-width:\s*0\s*!important;[^}]*max-width:\s*100%\s*!important;/s);
  assert.match(track3Styles, /\.t3-artifact-doc\s*\{[^}]*overflow:\s*hidden\s*!important;/s);
});
