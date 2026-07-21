const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function loadShareCards() {
  const window = {
    ShareTheme: {
      canvas: { width: 1080, height: 1440, centerX: 540 },
      color: { brand: "#7d39eb", accent: "#c6ff33", ink: "#000", inkSoft: "#111", muted: "#777", grid: "#d9d9d9", surface: "#fff" },
      font: { body: "Pretendard", display: "Paperlogy", numeric: "Unbounded" },
    },
    CanvasKit: {},
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(ROOT, "frontend/share/share-cards.js"), "utf8"),
    { window, document: {} },
  );
  return window.ShareCards;
}

function loadShareService({ share }) {
  const removed = [];
  const appended = [];
  const card = { remove: () => removed.push(card) };
  const window = {
    CanvasKit: {},
    ShareCards: {
      createTrack3ShareCard: () => card,
      drawTrack1Card() {},
      drawTrack2Card() {},
      drawTrack3Card() {},
    },
    DomCapture: {
      captureElementAsPng: async () => new Blob(["png"], { type: "image/png" }),
    },
    open() {},
  };
  const document = {
    body: { appendChild: (node) => appended.push(node) },
    querySelector: () => null,
    createElement: () => ({ click() {}, remove() {} }),
  };
  const navigator = {
    userAgent: "Android Mobile",
    maxTouchPoints: 1,
    canShare: () => true,
    share,
  };
  class TestFile {
    constructor(parts, name, options) {
      this.parts = parts;
      this.name = name;
      this.type = options.type;
    }
  }
  vm.runInNewContext(
    fs.readFileSync(path.join(ROOT, "frontend/share/share-service.js"), "utf8"),
    { window, document, navigator, File: TestFile, Blob, URL, setTimeout, console },
  );
  return { service: window.ShareService, appended, removed };
}

test("Track 3 share data keeps seven axes, three details, and clamps progress", () => {
  const cards = loadShareCards();
  const data = cards.normalizeTrack3ShareData({
    total: 74,
    grade: "실무 적용형",
    axes: [
      { label: "목표 정의", score: -5, percent: -5 },
      { label: "맥락 제공", score: 46, percent: 46 },
      { label: "정보 구조화", score: 50, percent: 50 },
      { label: "작업 분해", score: 78, percent: 78 },
      { label: "출력 설계", score: 78, percent: 78 },
      { label: "상호작용 조율", score: 78, percent: 78 },
      { label: "검증 유도", score: 120, percent: 120 },
    ],
    details: [
      { label: "목표 정의", score: 10, description: "첫 번째" },
      { label: "맥락 제공", score: 20, description: "두 번째" },
      { label: "정보 구조화", score: 30, description: "세 번째" },
    ],
  });

  assert.equal(data.axes.length, 7);
  assert.equal(data.details.length, 3);
  assert.equal(data.axes[0].percent, 0);
  assert.equal(data.axes[6].percent, 100);
  assert.equal(typeof cards.drawTrack1Card, "function");
  assert.equal(typeof cards.drawTrack2Card, "function");
});

test("Track 3 share text contains the grade and score", () => {
  const { service } = loadShareService({ share: async () => {} });
  const text = service.buildTrack3ShareText({ grade: "실무 적용형", total: 74 }, "https://example.com");

  assert.match(text, /실무 적용형/);
  assert.match(text, /74점/);
  assert.match(text, /https:\/\/example\.com/);
});

test("Track 3 share card is removed and AbortError stays a cancellation", async () => {
  const abortError = Object.assign(new Error("cancelled"), { name: "AbortError" });
  const { service, appended, removed } = loadShareService({ share: async () => { throw abortError; } });
  service.configure({
    getTrack3ShareData: () => ({ total: 74, grade: "실무 적용형", axes: [], details: [] }),
    getShareUrl: () => "https://example.com",
  });

  await assert.rejects(service.shareResult("track3"), (error) => error?.name === "AbortError");
  assert.equal(appended.length, 1);
  assert.equal(removed.length, 1);
  assert.equal(typeof service.shareResult, "function");
  assert.equal(typeof service.saveResultImage, "function");
});
