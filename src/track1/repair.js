import { getOpenAiApiKey, loadEnv } from "../shared/env.js";
import { parseTrack1Input, validateCanonicalResult } from "./evaluate.js";

const TRACK1_PROMPT_MARKERS = [
  "analyze the user's interaction style",
  "dimensions to assess",
  "strict json schema",
  "output a light, non-clinical ai-relationship profile"
];

const FIELD_ALIASES = {
  signal: "signals",
  levels: "signals",
  profile_signals: "signals",
  confidences: "confidence",
  confidence_levels: "confidence",
  note: "notes",
  observations: "notes",
  summary: "verdict",
  overall: "verdict",
  tag: "tags",
  keywords: "tags"
};

const STATUS_ALIASES = {
  ok: "success",
  valid: "success",
  complete: "success",
  completed: "success",
  done: "success",
  insufficient: "insufficient_history",
  minimal_history: "insufficient_history"
};

export async function repairTrack1LlmResult(raw, { useLlm = true } = {}) {
  if (looksLikeOriginalPrompt(raw)) {
    return {
      status: "invalid_prompt_pasted",
      reason: "복사한 프롬프트 원문이 아니라 AI가 반환한 JSON 답변을 붙여넣어 주세요."
    };
  }

  const local = localRepairTrack1Result(raw);
  const localValidation = validateCanonicalResult(local);
  if (localValidation.status === "success" || localValidation.status === "insufficient_history") {
    return {
      status: "success",
      result: local,
      source: "local_repair"
    };
  }

  if (!useLlm) {
    return {
      status: "unrepaired",
      result: local,
      source: "local_repair",
      validation: localValidation
    };
  }

  const llm = await llmRepairTrack1Result(raw, localValidation);
  if (!llm) {
    return {
      status: "unrepaired",
      result: local,
      source: "local_repair",
      validation: localValidation
    };
  }

  const repaired = localRepairTrack1Result(llm);
  const repairedValidation = validateCanonicalResult(repaired);
  if (repairedValidation.status === "success" || repairedValidation.status === "insufficient_history") {
    return {
      status: "success",
      result: repaired,
      source: "llm_repair"
    };
  }

  return {
    status: "unrepaired",
    result: repaired,
    source: "llm_repair",
    validation: repairedValidation
  };
}

export function localRepairTrack1Result(raw) {
  const parsed = parseTrack1Input(softenJsonText(raw));
  if (!parsed || typeof parsed !== "object") return parsed;

  const repaired = {};
  for (const [key, value] of Object.entries(parsed)) {
    repaired[FIELD_ALIASES[key] || key] = value;
  }

  repaired.status = normalizeStatus(repaired.status, repaired);
  repaired.evidence_mode = normalizeEvidenceMode(repaired.evidence_mode);
  repaired.signals = normalizeAxisObject(repaired.signals);
  repaired.confidence = normalizeAxisObject(repaired.confidence);
  repaired.notes = normalizeNotes(repaired.notes);
  repaired.tags = normalizeTags(repaired.tags, repaired);

  if (typeof repaired.verdict !== "string" || !repaired.verdict.trim()) {
    repaired.verdict = "A generic AI interaction pattern was observed.";
  }

  return repaired;
}

function looksLikeOriginalPrompt(raw) {
  const text = String(raw || "").toLowerCase();
  if (!text.trim()) return false;
  return TRACK1_PROMPT_MARKERS.filter((marker) => text.includes(marker)).length >= 2;
}

function softenJsonText(raw) {
  if (typeof raw !== "string") return raw;
  let text = raw.trim();
  text = text.replace(/```(?:json)?/gi, "```");
  text = text.replace(/[“”]/g, "\"").replace(/[‘’]/g, "'");
  text = text.replace(/,\s*([}\]])/g, "$1");
  return text;
}

function normalizeStatus(status, parsed) {
  const value = String(status || "").trim().toLowerCase();
  if (STATUS_ALIASES[value]) return STATUS_ALIASES[value];
  if (value === "success" || value === "insufficient_history") return value;
  if (!value && parsed?.signals && parsed?.confidence && parsed?.notes) return "success";
  return status;
}

function normalizeEvidenceMode(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["visible_history", "memory_or_impression", "self_report", "minimal"].includes(normalized)) return normalized;
  if (normalized.includes("visible")) return "visible_history";
  if (normalized.includes("memory") || normalized.includes("impression")) return "memory_or_impression";
  if (normalized.includes("self")) return "self_report";
  return "minimal";
}

function normalizeAxisObject(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    A: normalizeLevel(source.A ?? source.a),
    B: normalizeLevel(source.B ?? source.b),
    C: normalizeLevel(source.C ?? source.c),
    D: normalizeLevel(source.D ?? source.d)
  };
}

function normalizeLevel(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["low", "l", "낮음", "저", "하"].includes(normalized)) return "low";
  if (["medium", "mid", "moderate", "m", "중간", "보통", "중"].includes(normalized)) return "medium";
  if (["high", "h", "높음", "고", "상"].includes(normalized)) return "high";
  return normalized;
}

function normalizeNotes(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    A: normalizeNote(source.A ?? source.a),
    B: normalizeNote(source.B ?? source.b),
    C: normalizeNote(source.C ?? source.c),
    D: normalizeNote(source.D ?? source.d)
  };
}

function normalizeNote(value) {
  const text = String(value || "").trim();
  return text || "Generic behavioral signal inferred from the provided output.";
}

function normalizeTags(tags, repaired) {
  let values = [];
  if (Array.isArray(tags)) values = tags;
  else if (typeof tags === "string") values = tags.split(/[,/|]/);

  values = values.map((tag) => String(tag).trim()).filter(Boolean);
  if (values.length < 3) {
    values.push(...fallbackTags(repaired).slice(0, 3 - values.length));
  }
  return values.slice(0, 3);
}

function fallbackTags(repaired) {
  const tags = [];
  const signals = repaired.signals || {};
  if (signals.A === "high") tags.push("workflow-heavy");
  if (signals.B === "high") tags.push("relational");
  if (signals.C === "low") tags.push("verification-focused");
  if (signals.D === "high") tags.push("directive");
  tags.push("task-focused", "structured", "iterative");
  return [...new Set(tags)];
}

async function llmRepairTrack1Result(raw, validation) {
  try {
    loadEnv();
    const apiKey = getOpenAiApiKey();
    if (!apiKey) return null;

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const response = await withTimeout(openai.chat.completions.create({
      model: process.env.TRACK1_REPAIR_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: REPAIR_SYSTEM_PROMPT },
        { role: "user", content: buildRepairUserPrompt(raw, validation) }
      ],
      temperature: 0,
      max_tokens: 700,
      response_format: { type: "json_object" }
    }), Number(process.env.TRACK1_REPAIR_TIMEOUT_MS || 4500));

    return response.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

function buildRepairUserPrompt(raw, validation) {
  const errors = validation?.errors?.join("; ") || validation?.reason || "unknown";
  return `Validation error: ${errors}\n\nPasted output:\n${String(raw || "").slice(0, 6000)}`;
}

const REPAIR_SYSTEM_PROMPT = `You are a Track1 JSON repair agent. Convert pasted text into the exact Track1 schema. Do not score, classify, or create a final type. Return only one valid JSON object.

Rules:
- If the pasted text is the original prompt, return {"status":"invalid_prompt_pasted","reason":"prompt pasted"}.
- If A/B/C/D cannot be inferred, return {"status":"insufficient_history","reason":"not enough evidence"}.
- Otherwise normalize status to "success".
- Normalize A/B/C/D values to low, medium, or high.
- Keep exactly 3 short English tags.
- Remove names, direct quotes, and sensitive details.

Schema:
{"status":"success","evidence_mode":"visible_history | memory_or_impression | self_report | minimal","evidence_notice":"short generic sentence","signals":{"A":"low/medium/high","B":"low/medium/high","C":"low/medium/high","D":"low/medium/high"},"confidence":{"A":"low/medium/high","B":"low/medium/high","C":"low/medium/high","D":"low/medium/high"},"notes":{"A":"short generic note","B":"short generic note","C":"short generic note","D":"short generic note"},"verdict":"brief generic summary","tags":["tag1","tag2","tag3"]}`;

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Track1 repair timeout after ${timeoutMs}ms.`)), timeoutMs);
    })
  ]);
}
