import test from "node:test";
import assert from "node:assert/strict";

import { score } from "../src/track2/scorer.js";

const essay = `
I always define the goal and constraints before asking.
I consistently provide the background, purpose, and audience.
I frequently assign an expert role when needed.
I always specify the output format, length, structure, and tone.
I consistently follow up with a revision when a response is missing details.
I frequently verify unclear claims instead of accepting them without question.
`.trim();

test("scores all six Track 2 multiple-choice questions without exceeding axis maximums", () => {
  const answers = { Q1: "D", Q2: "D", Q3: "D", Q4: "D", Q5: "D", Q6: "D" };
  const result = score(essay, answers);

  assert.deepEqual(result.mcAnswers, answers);
  assert.equal(result.axes.length, 6);
  assert.ok(result.total <= 100);
  assert.ok(result.axes.every((axis) => axis.mcNormalized <= axis.maxScore));
});

test("caps every six-question answer combination at 100 points", () => {
  const choices = ["A", "B", "C", "D", "E"];

  for (const Q1 of choices) {
    for (const Q2 of choices) {
      for (const Q3 of choices) {
        for (const Q4 of choices) {
          for (const Q5 of choices) {
            for (const Q6 of choices) {
              const result = score(essay, { Q1, Q2, Q3, Q4, Q5, Q6 });
              assert.ok(result.total >= 0 && result.total <= 100, JSON.stringify({ Q1, Q2, Q3, Q4, Q5, Q6, total: result.total }));
            }
          }
        }
      }
    }
  }
});

test("new source-verification and error-diagnosis answers affect Track 2 scores", () => {
  const baseAnswers = { Q1: "A", Q2: "A", Q3: "A", Q4: "A", Q5: "A", Q6: "A" };
  const strongerAnswers = { ...baseAnswers, Q5: "D", Q6: "D" };

  const base = score(essay, baseAnswers);
  const stronger = score(essay, strongerAnswers);

  const baseByKey = Object.fromEntries(base.axes.map((axis) => [axis.key, axis]));
  const strongerByKey = Object.fromEntries(stronger.axes.map((axis) => [axis.key, axis]));

  assert.ok(strongerByKey.task_clarity.mcRaw > baseByKey.task_clarity.mcRaw);
  assert.ok(strongerByKey.critical_review.mcRaw > baseByKey.critical_review.mcRaw);
});
