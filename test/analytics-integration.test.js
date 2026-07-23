const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
const track3Source = fs.readFileSync(path.join(ROOT, "frontend/track3-content-fix.js"), "utf8");
const shareSource = fs.readFileSync(path.join(ROOT, "frontend/share/share-service.js"), "utf8");
const indexSource = fs.readFileSync(path.join(ROOT, "frontend/index.html"), "utf8");

test("analytics loads once before the shared service and application scripts", () => {
  const analyticsIndex = indexSource.indexOf("./analytics.js");
  const shareIndex = indexSource.indexOf("./share/share-service.js");
  const appIndex = indexSource.indexOf("./app.js");
  const track3Index = indexSource.indexOf("./track3-content-fix.js");

  assert.notEqual(analyticsIndex, -1);
  assert.ok(analyticsIndex < shareIndex);
  assert.ok(analyticsIndex < appIndex);
  assert.ok(analyticsIndex < track3Index);
  assert.equal((indexSource.match(/googletagmanager\.com\/gtm\.js/g) || []).length, 1);
  assert.equal(indexSource.includes("googletagmanager.com/gtag/js"), false);
});

test("Track 1 and Track 2 funnel events are connected at success and navigation points", () => {
  assert.match(appSource, /trackSelected\(selectedTrackId, analyticsEntryScreen\(\)\)/);
  assert.match(appSource, /profileSubmitted\(trackId\)/);
  assert.match(appSource, /name === "t1-q-1"[\s\S]*trackStarted\("track1"\)/);
  assert.match(appSource, /name === "t2-q-1"[\s\S]*trackStarted\("track2"\)/);
  assert.match(appSource, /trackSubmitted\("track1"\)/);
  assert.match(appSource, /trackSubmitted\("track2"\)/);
  assert.match(appSource, /resultViewed\("track1"/);
  assert.match(appSource, /resultViewed\("track2"/);
  assert.match(appSource, /sendGaEvent\("share_open"/);
  assert.match(appSource, /otherTrackClicked\(analyticsTrackId\(activeScreenName\)\)/);
  assert.match(appSource, /trackError\("track1", "track_submit"/);
  assert.match(appSource, /trackError\("track2", "track_submit"/);
});

test("Track 3 emits scenario, chat, message, submit, result, share, and error events", () => {
  assert.match(track3Source, /sendGaEvent\("scenario_select"/);
  assert.match(track3Source, /chatStarted\(scenarioId\)/);
  assert.match(track3Source, /sendGaEvent\("message_send"/);
  assert.match(track3Source, /input_method: inputMethod/);
  assert.doesNotMatch(track3Source, /message:\s*userMessage/);
  assert.match(track3Source, /trackSubmitted\("track3"/);
  assert.match(track3Source, /resultViewed\("track3"/);
  assert.match(track3Source, /sendGaEvent\("share_open", \{ track_id: "track3" \}\)/);
  assert.match(track3Source, /otherTrackClicked\("track3"\)/);
  assert.match(track3Source, /trackError\("track3", "scenario_load"/);
  assert.match(track3Source, /trackError\("track3", "chat_send"/);
  assert.match(track3Source, /trackError\("track3", "track_submit"/);
});

test("shared delivery emits exactly one success method and excludes AbortError", () => {
  assert.match(shareSource, /share_method: "native_share"/);
  assert.match(shareSource, /share_method: "image_download"/);
  const abortIndex = shareSource.indexOf('error?.name === "AbortError"');
  const nativeEventIndex = shareSource.indexOf('share_method: "native_share"');
  const downloadEventIndex = shareSource.indexOf('share_method: "image_download"');

  assert.ok(nativeEventIndex < abortIndex);
  assert.ok(abortIndex < downloadEventIndex);
});
