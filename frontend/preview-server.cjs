const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

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

server.listen(port, "127.0.0.1", () => {
  console.log(`Preview server running at http://127.0.0.1:${port}/`);
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
  const body = evaluateTrack1({
    llmResult: payload.llmResult,
    questionnaire: payload.questionnaire,
    tieBreaks: payload.tieBreaks,
  });
  return {
    statusCode: body.status === "success" ? 200 : 400,
    body,
  };
}

async function handleTrack2Submit(payload) {
  const { score } = await import("../src/track2/scorer.js");
  const body = buildTrack2DemoResponse(score(payload.freeText, payload.answers));
  return {
    statusCode: 200,
    body,
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
