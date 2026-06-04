const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const hostArgIndex = process.argv.indexOf("--host");
const host =
  hostArgIndex >= 0 && process.argv[hostArgIndex + 1]
    ? process.argv[hostArgIndex + 1]
    : process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/track1/submit") {
    handleJson(req, res, handleTrack1Submit);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/track2/submit") {
    handleJson(req, res, handleTrack2Submit);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/respondents") {
    handleJson(req, res, handleRespondentCreate);
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}/`);
});

function handleJson(req, res, handler) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const payload = body ? JSON.parse(body) : {};
      const result = await handler(payload);
      writeJson(res, result.statusCode || 200, result.body);
    } catch (error) {
      writeJson(res, 400, {
        status: "error",
        error: {
          code: "INVALID_INPUT",
          message: error.message || "요청을 처리할 수 없습니다.",
          retryable: true,
        },
      });
    }
  });
}

async function handleTrack1Submit(payload) {
  const { evaluateTrack1 } = await import("../src/track1/evaluate.js");
  const { repairTrack1LlmResult } = await import("../src/track1/repair.js");
  const repaired = await repairTrack1LlmResult(payload.llmResult);
  if (repaired.status === "invalid_prompt_pasted") {
    return {
      statusCode: 400,
      body: {
        status: "error",
        track: "track1",
        version: "track1-v1",
        error: {
          code: "PROMPT_PASTED",
          message: repaired.reason,
          retryable: true,
        },
      },
    };
  }

  const shouldPersist = Boolean(payload.respondentId && payload.accessToken);
  const body = evaluateTrack1({
    llmResult: repaired.result ?? payload.llmResult,
    questionnaire: payload.questionnaire,
    tieBreaks: payload.tieBreaks,
    includeInternal: shouldPersist,
  });

  if (shouldPersist && body.status === "success") {
    body.resultId = body.resultId || `demo_track1_${Date.now()}`;
    body.shareSlug = body.shareSlug || body.resultId;
    persistTrack1Result(payload, body);
  }

  return {
    statusCode: body.status === "success" ? 200 : 400,
    body,
  };
}

async function handleTrack2Submit(payload) {
  const { looksLikeTrack2Prompt } = await import("../backend/validate.js");
  if (looksLikeTrack2Prompt(payload.freeText)) {
    return {
      statusCode: 400,
      body: {
        status: "error",
        track: "track2",
        version: "track2-v1",
        error: {
          code: "PROMPT_PASTED",
          message: "복사한 프롬프트 원문이 아니라 AI가 작성한 답변을 붙여넣어 주세요.",
          retryable: true,
        },
      },
    };
  }

  const { score } = await import("../src/track2/scorer.js");
  const scoringResult = score(payload.freeText, payload.answers);
  const body = buildTrack2DemoResponse(scoringResult);

  if (payload.respondentId && payload.accessToken) {
    persistTrack2Result(payload, scoringResult, body);
  }

  return {
    statusCode: 200,
    body,
  };
}

async function persistTrack1Result(payload, evaluationResult) {
  try {
    const { validateRespondent, saveTrack1Result } = await import("../backend/db.js");
    const respondent = await validateRespondent(payload.respondentId, payload.accessToken);
    await saveTrack1Result({
      respondentId: payload.respondentId,
      nicknameSnapshot: respondent.nickname,
      birthYear: payload.birthYear,
      questionnaireVersion: payload.questionnaireVersion || "track1-12",
      questionnaire: payload.questionnaire,
      llmResult: payload.llmResult,
      evaluationResult,
    });
  } catch (error) {
    console.error("[preview track1 persist]", error.message || error);
  }
}

async function persistTrack2Result(payload, scoringResult, body) {
  try {
    const { validateRespondent, saveTrack2Result } = await import("../backend/db.js");
    const respondent = await validateRespondent(payload.respondentId, payload.accessToken);
    await saveTrack2Result({
      respondentId: payload.respondentId,
      nicknameSnapshot: respondent.nickname,
      birthYear: payload.birthYear,
      answers: payload.answers,
      freeText: payload.freeText,
      scoringResult,
      feedbackResult: body.result.feedback,
    });
  } catch (error) {
    console.error("[preview track2 persist]", error.message || error);
  }
}

async function handleRespondentCreate(payload) {
  const nickname = String(payload.nickname || "").trim();
  if (!nickname) {
    return {
      statusCode: 400,
      body: {
        status: "error",
        error: { code: "INVALID_INPUT", message: "nickname이 필요합니다.", retryable: true },
      },
    };
  }

  const { createRespondent } = await import("../backend/db.js");
  const respondent = await createRespondent(nickname, payload.birthYear);
  return {
    statusCode: 201,
    body: {
      status: "success",
      respondentId: respondent.id,
      accessToken: respondent.access_token,
      nickname: respondent.nickname,
      birthYear: Number(payload.birthYear) || null,
    },
  };
}

function buildTrack2DemoResponse(scoringResult) {
  const axes = Object.fromEntries(
    scoringResult.axes.map((axis) => [
      axis.key,
      {
        label: axis.name,
        score: axis.finalScore,
        max: axis.maxScore,
        rate: Math.round((axis.finalScore / axis.maxScore) * 100) / 100,
        evidence: axis.evidence,
      },
    ])
  );

  return {
    status: "success",
    track: "track2",
    version: "track2-v1",
    resultId: `demo_${Date.now()}`,
    createdAt: new Date().toISOString(),
    result: {
      total: scoringResult.total,
      grade: scoringResult.grade,
      axes,
      feedback: {
        summary: `${scoringResult.grade} 수준입니다. ${scoringResult.strengths.join(", ")}은 비교적 안정적으로 활용하고 있습니다.`,
        strengths: scoringResult.strengths.map((name) => ({
          name,
          description: `${name}을 프롬프트에 자연스럽게 반영하는 편입니다.`,
        })),
        weaknesses: scoringResult.weaknesses.map((name) => ({
          name,
          description: `요청을 보내기 전 ${name}이 드러나는 문장을 한 줄 더 추가해보세요.`,
        })),
        insight: `저는 AI를 활용할 때 ${scoringResult.strengths.join("과 ")}을 먼저 정리해 결과의 방향을 잡는 편입니다.`,
      },
    },
  };
}

function writeJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}
