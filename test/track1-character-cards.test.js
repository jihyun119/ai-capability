const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(ROOT, "frontend/app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(ROOT, "frontend/styles.css"), "utf8");

function between(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return appSource.slice(startIndex, endIndex);
}

const mappingSource = between(
  "const TRACK1_CHARACTER_RESULT_CARDS",
  "const characterGallery",
);
const gallerySource = between(
  "const characterGallery",
  "const characterFilesByType",
);
const dialogSource = between(
  "function openCharacterResultDialog",
  "function updateLoginValidity",
);
const expectedMappings = {
  ai_unknown: "01-ai-unknown.png",
  minimal_request: "02-minimal-request.png",
  searcher: "03-searcher.png",
  cold_trainer: "04-cold-trainer.png",
  chatty: "05-chatty.png",
  skeptic_regular: "06-skeptic-regular.png",
  friend: "07-friend.png",
  warm_perfectionist: "08-warm-perfectionist.png",
  anxious_client: "09-anxious-client.png",
  nitpicker: "10-nitpicker.png",
  business: "11-business.png",
  boss: "12-boss.png",
  emotion_bin: "13-emotion-bin.png",
  boundary_love: "14-boundary-love.png",
  partner: "15-partner.png",
  clingy_lover: "16-clingy-lover.png",
};

test("Track 1 character result card mapping contains 16 unique existing PNG assets", () => {
  const mappedPaths = {};
  for (const match of mappingSource.matchAll(
    /^\s{2}([a-z_]+): \{[\s\S]*?resultCardSrc: "\.\/assets\/track1-result-cards\/([^"]+)"/gm,
  )) {
    mappedPaths[match[1]] = match[2];
  }

  assert.deepEqual(mappedPaths, expectedMappings);
  assert.equal(new Set(Object.values(mappedPaths)).size, 16);
  Object.values(mappedPaths).forEach((fileName) => {
    assert.equal(
      fs.existsSync(path.join(ROOT, "frontend/assets/track1-result-cards", fileName)),
      true,
      `missing ${fileName}`,
    );
  });
});

test("character gallery uses fixed keys rather than card display indexes", () => {
  Object.keys(expectedMappings).forEach((characterKey) => {
    assert.match(gallerySource, new RegExp(`"${characterKey}"`));
  });
  assert.doesNotMatch(gallerySource, /resultCardSrc|\.map\(\([^)]*index/);
  assert.match(appSource, /data-character-card-open="\$\{characterKey\}"/);
});

test("character result dialog supports accessible open and close interactions", () => {
  assert.match(appSource, /aria-haspopup="dialog"/);
  assert.match(appSource, /role="dialog"/);
  assert.match(appSource, /aria-modal="true"/);
  assert.match(appSource, /data-character-card-close/);
  assert.match(appSource, /event\.key === "Escape"[\s\S]*closeCharacterResultDialog\(\)/);
  assert.match(dialogSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(dialogSource, /document\.body\.style\.overflow = characterResultDialogBodyOverflow/);
  assert.match(dialogSource, /requestAnimationFrame\(\(\) => closeButton\.focus\(\)\)/);
  assert.match(dialogSource, /requestAnimationFrame\(\(\) => trigger\.focus\(\)\)/);
  assert.match(dialogSource, /image\.onerror = showImageError/);
  assert.match(stylesSource, /\.character-result-dialog-image[\s\S]*object-fit: contain/);
});

test("character card open analytics uses only its fixed key and source screen", () => {
  assert.match(dialogSource, /sendGaEvent\("character_card_open"/);
  assert.match(dialogSource, /track_id: "track1"/);
  assert.match(dialogSource, /character_type: characterKey/);
  assert.match(dialogSource, /source_screen: "character_guide"/);
  assert.doesNotMatch(dialogSource, /resultCardSrc[\s\S]*sendGaEvent\("character_card_open"[\s\S]*resultCardSrc/);
});

test("Track 1 result and shared image code paths remain available", () => {
  assert.match(appSource, /function t1ResultScreen\(/);
  assert.match(appSource, /function t1ShareScreen\(/);
  assert.match(appSource, /ShareService\.shareResult/);
  assert.match(appSource, /characterSrcByType/);
});
