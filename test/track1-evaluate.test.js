import test from "node:test";
import assert from "node:assert/strict";
import { evaluateTrack1, scoreQuestionnaire } from "../src/track1/evaluate.js";

test("scores 12-question questionnaire by axis", () => {
  const scores = scoreQuestionnaire({
    answers: {
      Q1: 5,
      Q2: 5,
      Q3: 5,
      Q4: 1,
      Q5: 1,
      Q6: 1,
      Q7: 3,
      Q8: 3,
      Q9: 3,
      Q10: 5,
      Q11: 5,
      Q12: 5
    }
  });

  assert.deepEqual(scores, {
    A: 100,
    B: 0,
    C: 50,
    D: 100
  });
});

test("maps high dependence, low closeness, active trust, high control to type 12", () => {
  const result = evaluateTrack1({
    llmResult: {
      status: "success",
      evidence_mode: "visible_history",
      signals: {
        A: "high",
        B: "low",
        C: "medium",
        D: "high"
      },
      confidence: {
        A: "high",
        B: "medium",
        C: "medium",
        D: "high"
      },
      notes: {
        A: "Frequently integrates AI into ongoing task workflows.",
        B: "Uses a task-focused tone with limited emotional engagement.",
        C: "Builds on useful AI outputs while checking details as quality control.",
        D: "Consistently specifies goals, structure, format, and revision direction."
      },
      tags: ["workflow-heavy", "task-focused", "directive"],
      verdict: "A structured user who treats AI as a productivity tool."
    },
    questionnaire: {
      answers: {
        Q1: 5,
        Q2: 4,
        Q3: 5,
        Q4: 2,
        Q5: 2,
        Q6: 2,
        Q7: 3,
        Q8: 3,
        Q9: 4,
        Q10: 5,
        Q11: 5,
        Q12: 4
      }
    }
  });

  assert.equal(result.status, "success");
  assert.equal(result.type_id, 12);
  assert.equal(result.type_name, "선긋는 상사형");
  assert.equal(result.result_card.core_keywords.length, 3);
});

test("returns retry state for insufficient history", () => {
  const result = evaluateTrack1({
    llmResult: {
      status: "insufficient_history",
      reason: "Not enough observable past interaction behavior.",
      signals: null,
      confidence: null,
      notes: null,
      tags: [],
      verdict: "Not enough evidence to diagnose."
    }
  });

  assert.equal(result.decision_state, "insufficient_history");
  assert.equal(result.retry_prompt_needed, true);
});
