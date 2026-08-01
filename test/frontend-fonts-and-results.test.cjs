const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(ROOT, "frontend/styles.css"), "utf8");

function between(text, start, end) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return text.slice(startIndex, endIndex);
}

function fontWeightClass(fontPath) {
  const buffer = fs.readFileSync(fontPath);
  const tableCount = buffer.readUInt16BE(4);
  for (let index = 0; index < tableCount; index += 1) {
    const offset = 12 + (index * 16);
    if (buffer.toString("ascii", offset, offset + 4) !== "OS/2") continue;
    const tableOffset = buffer.readUInt32BE(offset + 8);
    return buffer.readUInt16BE(tableOffset + 4);
  }
  throw new Error(`OS/2 table missing: ${fontPath}`);
}

test("Pretendard faces use one family with filenames and descriptors matching their real weights", () => {
  const expectedFaces = [
    ["Pretendard-Thin.ttf", 100],
    ["Pretendard-ExtraLight.ttf", 200],
    ["Pretendard-Medium.ttf", 500],
    ["Pretendard-Bold.ttf", 700],
    ["Pretendard-Black.ttf", 900],
  ];

  expectedFaces.forEach(([fileName, weight]) => {
    const fontPath = path.join(ROOT, "frontend/fonts/Pretendard", fileName);
    assert.equal(fs.existsSync(fontPath), true, `${fileName} should exist`);
    assert.equal(fontWeightClass(fontPath), weight, `${fileName} metadata should be ${weight}`);
    assert.match(
      stylesSource,
      new RegExp(`font-family: Pretendard;\\s*src: url\\("\\./fonts/Pretendard/${fileName}"\\)[\\s\\S]*?font-weight: ${weight};`),
    );
  });

  assert.doesNotMatch(appSource, /font-family:Pretendard(?:Regular|Bold)/);
});

test("Track 1 and Track 2 results keep only share and challenge actions", () => {
  const track1Result = between(appSource, "function t1ResultScreen", "function t2IntroScreen");
  const track2Result = between(appSource, "function t2ResultScreen", "function renderTrack2Radar");

  [track1Result, track2Result].forEach((resultSource) => {
    assert.match(resultSource, /data-share-open=/);
    assert.match(resultSource, /button\("다른 Track 도전", "track"\)/);
    assert.doesNotMatch(resultSource, /푸키 캐릭터 더 알아보기|character-link/);
  });
});

test("Track 2 intro titles explicitly use the Bold face while body typography remains unchanged", () => {
  assert.match(
    stylesSource,
    /\.t2-intro-screen \.intro-hero h1,\s*\.t2-intro-screen \.info-list article > strong\s*\{\s*font-weight: 700;/,
  );
  assert.match(appSource, /<strong>객관식 6문항<\/strong>/);
  assert.match(appSource, /<strong>AI 답변 활용<\/strong>/);
});
