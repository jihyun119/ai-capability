import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const shareServiceSource = fs.readFileSync(
  new URL("../frontend/share/share-service.js", import.meta.url),
  "utf8",
);

function createTouchFallbackHarness() {
  const links = [];
  const openedUrls = [];
  const revokedUrls = [];
  const captureNode = {};
  const document = {
    querySelector() {
      return {
        querySelector() {
          return captureNode;
        },
      };
    },
    createElement() {
      const link = {
        clickCount: 0,
        click() {
          this.clickCount += 1;
        },
      };
      links.push(link);
      return link;
    },
    body: {
      appendChild() {},
      removeChild() {},
    },
  };
  const window = {
    CanvasKit: {},
    ShareCards: {},
    DomCapture: {
      async captureElementAsPng() {
        return new Blob(["png"], { type: "image/png" });
      },
    },
    PookieAnalytics: {
      sendGaEvent() {},
      trackError() {},
    },
    open(...args) {
      openedUrls.push(args);
    },
  };
  const navigator = {
    userAgent: "Mozilla/5.0 (iPhone) Mobile Safari",
    maxTouchPoints: 1,
    canShare() {
      return false;
    },
    async share() {
      throw new Error("native share must not run");
    },
  };
  const URL = {
    createObjectURL() {
      return "blob:track2-result";
    },
    revokeObjectURL(url) {
      revokedUrls.push(url);
    },
  };
  class TestFile {
    constructor(parts, name, options) {
      this.parts = parts;
      this.name = name;
      this.type = options.type;
    }
  }

  vm.runInNewContext(shareServiceSource, {
    window,
    document,
    navigator,
    URL,
    File: TestFile,
    Blob,
    setTimeout(callback) {
      callback();
    },
    console,
  });

  return {
    service: window.ShareService,
    links,
    openedUrls,
    revokedUrls,
  };
}

test("touch fallback delivers a Track 2 result image exactly once", async () => {
  const harness = createTouchFallbackHarness();

  const outcome = await harness.service.shareResult("track2");

  assert.equal(outcome, "downloaded");
  assert.equal(harness.links.length, 1);
  assert.equal(harness.links[0].clickCount, 1);
  assert.equal(harness.links[0].target, "_blank");
  assert.equal(harness.links[0].rel, "noopener noreferrer");
  assert.equal(harness.openedUrls.length, 0);
  assert.deepEqual(harness.revokedUrls, ["blob:track2-result"]);
});
