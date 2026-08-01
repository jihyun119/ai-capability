const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.resolve(__dirname, "../frontend/analytics.js"),
  "utf8",
);

function loadAnalytics(window = {}) {
  const errors = [];
  vm.runInNewContext(source, {
    window,
    console: { error: (...args) => errors.push(args) },
    Set,
    Object,
    String,
    Number,
    Array,
  });
  return { analytics: window.PookieAnalytics, window, errors };
}

test("sendGaEvent initializes dataLayer and keeps only allowed scalar parameters", () => {
  const { analytics, window } = loadAnalytics();

  assert.equal(analytics.sendGaEvent("track_select", {
    track_id: "track1",
    scenario_index: 0,
    score: 0,
    debug: true,
    entry_screen: "home",
    result_type: null,
    grade: undefined,
    scenario_id: { private: true },
    error_code: ["private"],
  }), true);

  assert.deepEqual(
    JSON.parse(JSON.stringify(window.dataLayer)),
    [{
      event: "track_select",
      track_id: "track1",
      scenario_index: 0,
      score: 0,
      entry_screen: "home",
    }],
  );
});

test("sendGaEvent preserves false, rejects long strings, and never throws analytics failures", () => {
  const brokenDataLayer = [];
  brokenDataLayer.push = () => { throw new Error("blocked"); };
  const { analytics, window, errors } = loadAnalytics({
    dataLayer: brokenDataLayer,
  });

  assert.doesNotThrow(() => analytics.sendGaEvent("track_submit", {
    track_id: "track1",
    score: 1,
  }));
  assert.equal(errors.length, 1);

  window.dataLayer = [];
  analytics.sendGaEvent("track_submit", {
    track_id: "track1",
    input_method: false,
    grade: "x".repeat(101),
  });
  assert.equal(window.dataLayer[0].input_method, false);
  assert.equal("grade" in window.dataLayer[0], false);
});

test("analytics state prevents duplicate starts, submits, result views, and chat starts", () => {
  const { analytics, window } = loadAnalytics();

  assert.equal(analytics.trackStarted("track1"), true);
  assert.equal(analytics.trackStarted("track1"), false);
  assert.equal(analytics.trackSubmitted("track1"), true);
  assert.equal(analytics.trackSubmitted("track1"), false);
  assert.equal(analytics.resultViewed("track1", "result-1", { result_type: "테스트" }), true);
  assert.equal(analytics.resultViewed("track1", "result-1", { result_type: "테스트" }), false);
  assert.equal(analytics.chatStarted("pm_001"), true);
  assert.equal(analytics.chatStarted("pm_001"), false);
  assert.equal(window.dataLayer.length, 4);
});

test("resetTrack permits a new attempt without exposing private payload fields", () => {
  const { analytics, window } = loadAnalytics();

  analytics.trackStarted("track3");
  analytics.trackSubmitted("track3", {
    scenario_id: "pm_001",
    nickname: "비공개",
    user_id: "secret",
  });
  analytics.resetTrack("track3");
  analytics.trackStarted("track3");

  assert.equal(window.dataLayer.length, 3);
  assert.equal(window.dataLayer.some((event) => "nickname" in event || "user_id" in event), false);
});

test("message_send payload never includes the original message", () => {
  const { analytics, window } = loadAnalytics();

  analytics.sendGaEvent("message_send", {
    track_id: "track3",
    scenario_id: "pm_001",
    turn_number: 1,
    message_length: 15,
    input_method: "enter",
    message: "원문은 전송하면 안 됩니다",
  });

  assert.equal(window.dataLayer[0].message_length, 15);
  assert.equal("message" in window.dataLayer[0], false);
});

test("character_card_open keeps the fixed character key without image details", () => {
  const { analytics, window } = loadAnalytics();

  analytics.sendGaEvent("character_card_open", {
    track_id: "track1",
    character_type: "ai_unknown",
    source_screen: "character_guide",
    image_file: "01-ai-unknown.png",
  });

  assert.deepEqual(
    JSON.parse(JSON.stringify(window.dataLayer[0])),
    {
      event: "character_card_open",
      track_id: "track1",
      character_type: "ai_unknown",
      source_screen: "character_guide",
    },
  );
});

test("axis_info_open keeps only fixed track and axis identifiers", () => {
  const { analytics, window } = loadAnalytics();

  analytics.sendGaEvent("axis_info_open", {
    track_id: "track3",
    axis_id: "goal_definition",
    description: "설명 전문은 전송하지 않습니다",
  });

  assert.deepEqual(
    JSON.parse(JSON.stringify(window.dataLayer[0])),
    {
      event: "axis_info_open",
      track_id: "track3",
      axis_id: "goal_definition",
    },
  );
});
