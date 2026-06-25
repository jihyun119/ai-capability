import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateTrack1,
  mapScoresToBinary,
  scoreQuestionnaire,
  validateCanonicalResult
} from "../src/track1/evaluate.js";

const baseSuccess = {
  status: "success",
  evidence_mode: "visible_history",
  evidence_notice: "Assessment based on repeated observable interaction patterns.",
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
    B: "Uses a task-focused tone with limited emotional or social engagement.",
    C: "Builds on useful AI outputs while checking details as normal quality control.",
    D: "Consistently specifies goals, structure, formatting, and revision directions."
  },
  verdict: "A structured user who treats AI as an active productivity tool.",
  tags: ["workflow-heavy", "task-focused", "directive"]
};

test("validates the final signals-based user LLM schema", () => {
  const canonical = validateCanonicalResult(baseSuccess);

  assert.equal(canonical.status, "success");
  assert.deepEqual(canonical.tags, ["workflow-heavy", "task-focused", "directive"]);
});

test("rejects numeric profile output from the external user LLM", () => {
  const result = validateCanonicalResult({
    ...baseSuccess,
    profile: {
      A: 84,
      B: 34,
      C: 63,
      D: 96
    }
  });

  assert.equal(result.status, "invalid");
  assert.match(result.errors.join("\n"), /profile 숫자 점수는 허용하지 않습니다/);
});

test("trims extra source tags to three", () => {
  const result = validateCanonicalResult({
    ...baseSuccess,
    tags: ["one", "two", "three", "four"]
  });

  assert.equal(result.status, "success");
  assert.deepEqual(result.tags, ["one", "two", "three"]);
});

test("requires at least three source tags", () => {
  const result = validateCanonicalResult({
    ...baseSuccess,
    tags: ["one", "two"]
  });

  assert.equal(result.status, "invalid");
  assert.match(result.errors.join("\n"), /tags는 핵심 키워드가 최소 3개/);
});

test("scores 12-question questionnaire answers by axis", () => {
  const scores = scoreQuestionnaire({
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
  });

  assert.deepEqual(scores, {
    A: 92,
    B: 25,
    C: 58,
    D: 92
  });
});

test("uses LLM Judge tie break before questionnaire fallback", () => {
  const result = mapScoresToBinary(
    {
      A: 80,
      B: 42,
      C: 51,
      D: 90
    },
    {
      questionnaireScores: {
        A: 80,
        B: 80,
        C: 80,
        D: 80
      },
      tieBreaks: {
        C: "저"
      }
    }
  );

  assert.deepEqual(result.binaryProfile, {
    A: "고",
    B: "저",
    C: "저",
    D: "고"
  });
  assert.equal(result.tieResolution.C.source, "llm_judge");
});

test("falls back to questionnaire direction when no LLM Judge tie break exists", () => {
  const result = mapScoresToBinary(
    {
      A: 80,
      B: 42,
      C: 51,
      D: 90
    },
    {
      questionnaireScores: {
        A: 80,
        B: 80,
        C: 25,
        D: 80
      }
    }
  );

  assert.equal(result.binaryProfile.C, "저");
  assert.equal(result.tieResolution.C.source, "questionnaire_fallback");
});

test("returns the schema-aligned Track 1 API response shape", () => {
  const result = evaluateTrack1({
    llmResult: baseSuccess,
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
    },
    tieBreaks: {
      C: "high"
    },
    resultId: "res_test123",
    createdAt: "2026-05-24T12:00:00.000Z"
  });

  assert.equal(result.status, "success");
  assert.equal(result.track, "track1");
  assert.equal(result.version, "track1-v1");
  assert.equal(result.resultId, "res_test123");
  assert.equal(result.createdAt, "2026-05-24T12:00:00.000Z");
  assert.equal(result.decisionState, "diagnosable");
  assert.deepEqual(result.type, {
    id: 12,
    name: "선긋는 상사형"
  });
  assert.deepEqual(result.binaryProfile, {
    A: "고",
    B: "저",
    C: "고",
    D: "고"
  });
  assert.deepEqual(result.axisScores.C, {
    label: "신뢰도",
    score: 57,
    level: "중간",
    gauge: "■■■■■■░░░░"
  });
  assert.equal(result.resultCard.title, "선긋는 상사형");
  assert.deepEqual(result.resultCard.keywords, ["업무형", "거리두기", "명확한지시"]);
  assert.equal(result.resultCard.evidenceNotice, "확인된 대화 기록 기반 결과입니다.");
  assert.equal(result.scoreBreakdown, undefined);
});

test("can include DB/debug fields when requested", () => {
  const result = evaluateTrack1({
    llmResult: baseSuccess,
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
    },
    includeInternal: true
  });

  assert.deepEqual(result.scoreBreakdown.final, {
    A: 92,
    B: 26,
    C: 57,
    D: 92
  });
  assert.deepEqual(result.sourceTags, ["workflow-heavy", "task-focused", "directive"]);
  assert.deepEqual(result.inputSummary, {
    hasQuestionnaire: true,
    evidenceMode: "visible_history",
    evidenceNotice: "Assessment based on repeated observable interaction patterns."
  });
});

test("guards all-high type when intimacy and active trust evidence is weak", () => {
  const result = evaluateTrack1({
    llmResult: {
      ...baseSuccess,
      signals: {
        A: "high",
        B: "high",
        C: "high",
        D: "high"
      },
      notes: {
        A: "Frequently uses AI across workflows.",
        B: "Uses AI in a functional task-focused and output-focused way.",
        C: "Checks, validates, and revises outputs as quality control.",
        D: "Gives explicit structure, format, tone, constraints, and revision direction."
      }
    },
    includeInternal: true
  });

  assert.notEqual(result.type.id, 16);
  assert.ok(result.internalNotes.some((note) => note.includes("집착하는 애인형")));
});

test("returns common error schema for invalid LLM output", () => {
  const result = evaluateTrack1({
    llmResult: {
      ...baseSuccess,
      profile: {
        A: 84,
        B: 34,
        C: 63,
        D: 96
      }
    },
    resultId: "res_error123",
    createdAt: "2026-05-24T12:00:00.000Z"
  });

  assert.equal(result.status, "error");
  assert.equal(result.track, "track1");
  assert.equal(result.resultId, "res_error123");
  assert.equal(result.error.code, "INVALID_LLM_RESULT");
  assert.equal(result.error.retryable, true);
});
