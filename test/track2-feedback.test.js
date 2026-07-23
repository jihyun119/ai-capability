import test from "node:test";
import assert from "node:assert/strict";

import { generateFeedback } from "../backend/feedback.js";

test("Track 2 fallback feedback keeps axis names free of mismatched Korean particles", async () => {
  const previous = process.env.ENABLE_OPENAI_FEEDBACK;
  process.env.ENABLE_OPENAI_FEEDBACK = "false";

  try {
    const feedback = await generateFeedback({
      grade: "AI 전략가",
      strengths: ["작업 명확성", "비판적 검토"],
      weaknesses: ["역할 지정", "비판적 검토"],
      axes: [],
    });
    const text = [
      feedback.summary,
      ...feedback.strengths.map((item) => item.description),
      ...feedback.weaknesses.map((item) => item.description),
      feedback.insight,
    ].join(" ");

    assert.match(feedback.summary, /보완할 항목은 역할 지정 및 비판적 검토입니다/);
    assert.doesNotMatch(text, /비판적 검토[은이을를가]/);
  } finally {
    if (previous === undefined) delete process.env.ENABLE_OPENAI_FEEDBACK;
    else process.env.ENABLE_OPENAI_FEEDBACK = previous;
  }
});
