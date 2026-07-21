const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function extractFunctionBlock(source, startMarker, endMarker, names) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `함수 블록을 찾을 수 없습니다: ${startMarker}`);
  const sandbox = {};
  vm.runInNewContext(`${source.slice(start, end)}\nthis.api = { ${names.join(", ")} };`, sandbox);
  return sandbox.api;
}

function loadProgressHelpers() {
  const source = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
  return extractFunctionBlock(
    source,
    "function progressPercent",
    "function progress(",
    ["progressPercent", "syncProgressBars"],
  );
}

function loadTrack3ProgressHelper() {
  const source = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
  return extractFunctionBlock(
    source,
    "function t3TurnProgressCount",
    "function getT3TurnCount",
    ["t3TurnProgressCount"],
  );
}

test("Track 1 and Track 2 progress calculations preserve their question counts", () => {
  const { progressPercent } = loadProgressHelpers();

  assert.ok(Math.abs(progressPercent(1, 12) - (100 / 12)) < 1e-10);
  assert.ok(Math.abs(progressPercent(2, 12) - (200 / 12)) < 1e-10);
  assert.equal(progressPercent(12, 12), 100);
  assert.equal(progressPercent(1, 4), 25);
  assert.equal(progressPercent(4, 4), 100);
});

test("progress calculation clamps its minimum and maximum", () => {
  const { progressPercent } = loadProgressHelpers();

  assert.equal(progressPercent(-1, 12), 0);
  assert.equal(progressPercent(13, 12), 100);
  assert.equal(progressPercent(1, 0), 0);
});

test("all progress fills receive the same state and decrease on previous navigation", () => {
  const { syncProgressBars } = loadProgressHelpers();
  const createFill = () => ({
    dataset: { progressCurrent: "3", progressTotal: "12" },
    style: { setProperty(_name, value) { this.width = value; } },
  });
  const fills = [createFill(), createFill()];
  const root = { querySelectorAll: () => fills };

  syncProgressBars(root);
  assert.deepEqual(fills.map((fill) => fill.style.width), ["25%", "25%"]);

  fills.forEach((fill) => { fill.dataset.progressCurrent = "2"; });
  syncProgressBars(root);
  fills.forEach((fill) => {
    assert.ok(Math.abs(Number.parseFloat(fill.style.width) - (200 / 12)) < 1e-10);
  });
});

test("Track 3 turn progress uses user turns and clamps at five", () => {
  const { t3TurnProgressCount } = loadTrack3ProgressHelper();
  const turns = Array.from({ length: 7 }, (_, index) => ({ role: "user", content: `질문 ${index}` }));

  assert.equal(t3TurnProgressCount([], 5), 0);
  assert.equal(t3TurnProgressCount(turns.slice(0, 2), 5), 2);
  assert.equal(t3TurnProgressCount(turns, 5), 5);
});

test("Track 3 brief, workspace, and chat titles reuse the common title class", () => {
  const source = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
  const titleUses = source.match(/<h2 class="t3-step-title">/g) || [];

  assert.equal(titleUses.length, 4);
  assert.match(source, /data-t3-turn-progress/);
});
