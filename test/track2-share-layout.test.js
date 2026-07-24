import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const shareCardsSource = fs.readFileSync(
  new URL("../frontend/share/share-cards.js", import.meta.url),
  "utf8",
);

function createTrack2Harness() {
  const drawnText = [];
  const roundedRects = [];
  const context2d = {
    beginPath() {},
    moveTo() {},
    arcTo() {},
    closePath() {},
    fill() {},
    stroke() {},
    fillRect() {},
    ellipse() {},
    arc() {},
    lineTo() {},
    save() {},
    restore() {},
    fillText(text, x, y) {
      drawnText.push({ text, x, y });
    },
    measureText(text) {
      return { width: String(text).length * 12 };
    },
    set fillStyle(value) {},
    set strokeStyle(value) {},
    set lineWidth(value) {},
    set lineCap(value) {},
    set font(value) {},
    set textAlign(value) {},
  };
  const canvas = {
    width: 1080,
    height: 1440,
    getContext() {
      return context2d;
    },
  };

  const linesByText = {
    SUMMARY: ["요약 1", "요약 2", "요약 3", "요약 4"],
    STRENGTH: ["강점 1", "강점 2", "강점 3"],
    WEAKNESS: ["약점 1", "약점 2"],
  };
  const canvasKit = {
    roundRect(ctx, x, y, width, height) {
      roundedRects.push({ x, y, width, height });
    },
    drawPolygonPath() {},
    drawText(ctx, text, x, y) {
      ctx.fillText(text, x, y);
    },
    drawCenteredText(ctx, text, x, y) {
      ctx.fillText(text, x, y);
    },
    wrapText(ctx, text) {
      return linesByText[text] || [text];
    },
  };
  const theme = {
    canvas: { width: 1080, height: 1440, centerX: 540 },
    color: {
      brand: "#7737eb",
      accent: "#baff1f",
      ink: "#000",
      inkSoft: "#111",
      muted: "#777",
      grid: "#ddd",
      surface: "#fff",
    },
    font: {
      body: "sans-serif",
      display: "sans-serif",
      numeric: "sans-serif",
    },
  };

  const sandbox = {
    window: {
      CanvasKit: canvasKit,
      ShareTheme: theme,
    },
  };
  vm.runInNewContext(shareCardsSource, sandbox);

  return {
    canvas,
    drawnText,
    roundedRects,
    draw() {
      sandbox.window.ShareCards.drawTrack2Card(context2d, canvas, {
        total: 84,
        grade: "실무 적용형",
        summary: "SUMMARY",
        strength: "STRENGTH",
        weakness: "WEAKNESS",
        axes: {},
      });
    },
  };
}

test("Track 2 share card expands vertically without overlapping long content", () => {
  const harness = createTrack2Harness();
  harness.draw();

  const feedbackCards = harness.roundedRects
    .filter((rect) => rect.width === 968)
    .filter(
      (rect, index, rects) =>
        index === rects.findIndex((candidate) => candidate.y === rect.y),
    );
  const [, strengthCard, weaknessCard] = feedbackCards;

  assert.ok(strengthCard.y > 1062, "strength card must start below summary");
  assert.ok(
    weaknessCard.y >= strengthCard.y + strengthCard.height + 36,
    "weakness card must start below strength card",
  );
  assert.ok(
    harness.canvas.height >= weaknessCard.y + weaknessCard.height + 80,
    "canvas must expand to contain the final card",
  );

  for (const line of ["강점 1", "강점 2", "강점 3"]) {
    assert.ok(
      harness.drawnText.some((entry) => entry.text === line),
      `${line} must be rendered`,
    );
  }
});
