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

function loadShareService({ share, canShare = () => true }) {
  const removed = [];
  const appended = [];
  const downloads = [];
  const revokedUrls = [];
  const loggedErrors = [];
  const loggedWarnings = [];
  const analyticsEvents = [];
  const analyticsErrors = [];
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
    PookieAnalytics: {
      sendGaEvent: (event, params) => analyticsEvents.push({ event, ...params }),
      trackError: (trackId, errorStage, error) => {
        analyticsErrors.push({ trackId, errorStage, errorCode: error?.name || "unknown" });
      },
    },
    open() {},
  };
  const link = {
    click: () => downloads.push(link),
    remove() {},
  };
  const document = {
    body: {
      appendChild: (node) => {
        if (node === card) appended.push(node);
      },
      removeChild() {},
    },
    querySelector: () => ({ querySelector: () => null }),
    createElement: () => link,
  };
  const navigator = {
    userAgent: "Android Mobile",
    maxTouchPoints: 1,
    canShare,
    share,
  };
  const URL = {
    createObjectURL: () => "blob:track3-share",
    revokeObjectURL: (url) => revokedUrls.push(url),
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
    {
      window,
      document,
      navigator,
      File: TestFile,
      Blob,
      URL,
      setTimeout: (callback) => callback(),
      console: {
        error: (...args) => loggedErrors.push(args),
        warn: (...args) => loggedWarnings.push(args),
      },
    },
  );
  return {
    service: window.ShareService,
    appended,
    removed,
    downloads,
    revokedUrls,
    loggedErrors,
    loggedWarnings,
    analyticsEvents,
    analyticsErrors,
  };
}

test("Track 3 share data keeps eight axes, three details, and clamps progress", () => {
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
      { label: "실무 적용", score: 88, percent: 88 },
    ],
    details: [
      { label: "목표 정의", score: 10, description: "첫 번째" },
      { label: "맥락 제공", score: 20, description: "두 번째" },
      { label: "정보 구조화", score: 30, description: "세 번째" },
    ],
  });

  assert.equal(data.axes.length, 8);
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

test("Track 3 shares an image/png File with its result text when file sharing is supported", async () => {
  let sharedData;
  const { service, appended, removed, downloads, analyticsEvents } = loadShareService({
    share: async (data) => {
      sharedData = data;
    },
  });
  service.configure({
    getTrack3ShareData: () => ({ total: 74, grade: "실무 적용형", axes: [], details: [] }),
    getShareUrl: () => "https://example.com",
  });

  const outcome = await service.shareResult("track3");

  assert.equal(outcome, "shared");
  assert.equal(sharedData.title, "푸키 AI 실무 활용 역량 진단");
  assert.match(sharedData.text, /실무 적용형, 74점/);
  assert.equal(sharedData.files.length, 1);
  assert.equal(sharedData.files[0].name, "pookie-track3-result.png");
  assert.equal(sharedData.files[0].type, "image/png");
  assert.equal(sharedData.files[0].parts[0].type, "image/png");
  assert.equal(downloads.length, 0);
  assert.deepEqual(analyticsEvents, [{
    event: "share_result",
    track_id: "track3",
    share_method: "native_share",
  }]);
  assert.equal(appended.length, 1);
  assert.equal(removed.length, 1);
});

test("Track 3 downloads PNG when file sharing is unsupported", async () => {
  let shareCalls = 0;
  const { service, downloads, revokedUrls, analyticsEvents } = loadShareService({
    canShare: () => false,
    share: async () => {
      shareCalls += 1;
    },
  });

  const outcome = await service.shareResult("track3");

  assert.equal(outcome, "downloaded");
  assert.equal(shareCalls, 0);
  assert.equal(downloads.length, 1);
  assert.deepEqual(revokedUrls, ["blob:track3-share"]);
  assert.deepEqual(analyticsEvents, [{
    event: "share_result",
    track_id: "track3",
    share_method: "image_download",
  }]);
});

test("Track 3 downloads PNG when file share capability detection throws", async () => {
  let shareCalls = 0;
  const { service, downloads, loggedWarnings } = loadShareService({
    canShare: () => {
      throw new Error("unsupported payload");
    },
    share: async () => {
      shareCalls += 1;
    },
  });

  const outcome = await service.shareResult("track3");

  assert.equal(outcome, "downloaded");
  assert.equal(shareCalls, 0);
  assert.equal(downloads.length, 1);
  assert.equal(loggedWarnings.length, 1);
});

test("Track 3 downloads PNG after a real native share error", async () => {
  const shareError = Object.assign(new Error("share failed"), { name: "NotAllowedError" });
  const { service, downloads, loggedErrors, analyticsEvents, analyticsErrors } = loadShareService({
    share: async () => {
      throw shareError;
    },
  });

  const outcome = await service.shareResult("track3");

  assert.equal(outcome, "downloaded");
  assert.equal(downloads.length, 1);
  assert.equal(loggedErrors.length, 1);
  assert.equal(analyticsErrors.length, 1);
  assert.deepEqual(analyticsEvents, [{
    event: "share_result",
    track_id: "track3",
    share_method: "image_download",
  }]);
});

test("Track 3 share card is removed and AbortError stays a cancellation without downloading", async () => {
  const abortError = Object.assign(new Error("cancelled"), { name: "AbortError" });
  const {
    service,
    appended,
    removed,
    downloads,
    analyticsEvents,
    analyticsErrors,
  } = loadShareService({ share: async () => { throw abortError; } });
  service.configure({
    getTrack3ShareData: () => ({ total: 74, grade: "실무 적용형", axes: [], details: [] }),
    getShareUrl: () => "https://example.com",
  });

  await assert.rejects(service.shareResult("track3"), (error) => error?.name === "AbortError");
  assert.equal(appended.length, 1);
  assert.equal(removed.length, 1);
  assert.equal(downloads.length, 0);
  assert.equal(analyticsEvents.length, 0);
  assert.equal(analyticsErrors.length, 0);
  assert.equal(typeof service.shareResult, "function");
  assert.equal(typeof service.saveResultImage, "function");
});

test("Track 3 result handler restores the button and suppresses AbortError UI", () => {
  const source = fs.readFileSync(path.join(ROOT, "frontend/track3-ui.js"), "utf8");
  const handlerStart = source.indexOf("async function shareT3Result");
  const handlerEnd = source.indexOf('document.addEventListener("click"', handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);

  assert.match(handler, /t3SharePending/);
  assert.match(handler, /button\.disabled = true/);
  assert.match(handler, /error\?\.name !== "AbortError"/);
  assert.doesNotMatch(handler, /alert\(/);
  assert.match(handler, /finally/);
  assert.match(handler, /button\.disabled = false/);
});

test("Track 1 and Track 2 still use the common native file share delivery", async () => {
  const sharedTracks = [];
  const { service, downloads } = loadShareService({
    share: async (data) => {
      sharedTracks.push(data.files[0].name);
    },
  });

  assert.equal(await service.shareResult("track1"), "shared");
  assert.equal(await service.shareResult("track2"), "shared");
  assert.deepEqual(sharedTracks, ["pookie-track1-result.png", "pookie-track2-result.png"]);
  assert.equal(downloads.length, 0);
});
