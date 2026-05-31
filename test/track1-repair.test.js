import test from "node:test";
import assert from "node:assert/strict";

import { localRepairTrack1Result, repairTrack1LlmResult } from "../src/track1/repair.js";
import { validateCanonicalResult } from "../src/track1/evaluate.js";

test("repairs common Track1 schema drift locally", () => {
  const repaired = localRepairTrack1Result({
    status: "done",
    evidence_mode: "Visible History",
    signal: {
      A: "HIGH",
      B: "저",
      C: "moderate",
      D: "상"
    },
    confidences: {
      A: "high",
      B: "medium",
      C: "medium",
      D: "high"
    },
    observations: {
      A: "Uses AI across repeated work tasks.",
      B: "Keeps the interaction task-focused.",
      C: "Checks useful outputs as quality control.",
      D: "Gives explicit structure and revision direction."
    },
    summary: "A structured workflow user.",
    keywords: ["workflow-heavy", "task-focused", "directive", "extra"]
  });

  const validation = validateCanonicalResult(repaired);
  assert.equal(validation.status, "success");
  assert.deepEqual(validation.signals, {
    A: "high",
    B: "low",
    C: "medium",
    D: "high"
  });
  assert.deepEqual(validation.tags, ["workflow-heavy", "task-focused", "directive"]);
});

test("adds fallback tags when pasted output has too few", () => {
  const repaired = localRepairTrack1Result({
    status: "success",
    evidence_mode: "visible_history",
    signals: { A: "high", B: "low", C: "medium", D: "high" },
    confidence: { A: "high", B: "medium", C: "medium", D: "high" },
    notes: {
      A: "Uses AI across repeated workflows.",
      B: "Keeps the interaction practical.",
      C: "Uses outputs while checking details.",
      D: "Gives explicit structure and direction."
    },
    verdict: "A structured workflow user.",
    tags: ["workflow-heavy"]
  });

  const validation = validateCanonicalResult(repaired);
  assert.equal(validation.status, "success");
  assert.equal(validation.tags.length, 3);
});

test("detects when the user pasted the original prompt", async () => {
  const result = await repairTrack1LlmResult(
    "Analyze the USER's interaction style based on past conversation history. ### Dimensions to Assess ### Strict JSON Schema",
    { useLlm: false }
  );

  assert.equal(result.status, "invalid_prompt_pasted");
});
