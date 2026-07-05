import test from "node:test";
import assert from "node:assert/strict";

import { looksLikeTrack2Prompt, validateSubmitInput } from "../backend/validate.js";

const promptText = `Look back at our entire conversation history and write a single cohesive paragraph describing this user's interaction habits.

Weave all six of the following observations naturally into the paragraph.

For every one of these six behaviors, you must use at least one frequency word.`;

test("detects pasted Track2 prompt text", () => {
  assert.equal(looksLikeTrack2Prompt(promptText), true);
});

test("rejects Track2 prompt text as freeText", () => {
  const result = validateSubmitInput(
    {
      respondentId: "res",
      accessToken: "token",
      answers: { Q1: "A", Q2: "B", Q3: "C", Q4: "D" },
      freeText: promptText
    },
    { requireRespondent: true }
  );

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /프롬프트 원문/);
});
