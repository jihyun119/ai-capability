import OpenAI from "openai";

/**
 * OpenAI로 한국어 피드백 생성
 * 반환: { summary, strengths: [{name, description}], weaknesses: [{name, description}], insight }
 * API 실패 시 규칙 기반 템플릿으로 자동 fallback
 */
export async function generateFeedback({ grade, total, strengths, weaknesses, axes }) {
  if (process.env.ENABLE_OPENAI_FEEDBACK !== "true") {
    return buildTemplateFeedback({ grade, strengths, weaknesses });
  }

  const topAxes    = strengths.map((name) => {
    const ax = axes.find((a) => a.name === name);
    return `${name}(${ax?.finalScore ?? "?"}/${ax?.maxScore ?? "?"}점)`;
  }).join(", ");

  const bottomAxes = weaknesses.map((name) => {
    const ax = axes.find((a) => a.name === name);
    return `${name}(${ax?.finalScore ?? "?"}/${ax?.maxScore ?? "?"}점)`;
  }).join(", ");

  const axisLines = axes
    .map((ax) => `- ${ax.name}: ${ax.finalScore}/${ax.maxScore}점 (빈도 부사: ${ax.freqWord})`)
    .join("\n");

  const prompt = `Track 2 AI 활용 역량 진단 결과를 바탕으로 아래 JSON을 한국어로 작성해줘. 반드시 JSON만 반환하고 다른 텍스트는 쓰지 마.

등급: ${grade} (${total}점)
강점 축: ${topAxes}
약점 축: ${bottomAxes}
축별 점수:
${axisLines}

{
  "summary": "전반적인 2~3문장 요약. 막연한 칭찬('좋은 습관이에요' 등) 금지. 수치 기반으로 구체적으로.",
  "strengths": [
    {"name": "강점 축 이름1", "description": "이 축에서 잘하고 있는 점 구체적으로 1문장"},
    {"name": "강점 축 이름2", "description": "이 축에서 잘하고 있는 점 구체적으로 1문장"}
  ],
  "weaknesses": [
    {"name": "약점 축 이름1", "description": "이 축이 왜 낮은지 + 지금 당장 실천할 수 있는 구체적 개선 팁 1문장"},
    {"name": "약점 축 이름2", "description": "이 축이 왜 낮은지 + 지금 당장 실천할 수 있는 구체적 개선 팁 1문장"}
  ],
  "insight": "면접에서 말할 수 있는 나의 AI 활용 스타일 1~2문장. '저는 AI를...' 으로 시작하는 1인칭 문장. 강점을 중심으로 실무에서 어떻게 활용하는지 구체적으로."
  }`;

  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const openai = new OpenAI({ apiKey });
    const response = await withTimeout(openai.chat.completions.create({
      model:           "gpt-4o-mini",
      messages:        [{ role: "user", content: prompt }],
      max_tokens:      500,
      temperature:     0.7,
      response_format: { type: "json_object" }
    }), 3500);

    const parsed = JSON.parse(response.choices[0].message.content.trim());
    return {
      summary:    parsed.summary    ?? buildTemplateSummary({ grade, strengths, weaknesses }),
      strengths:  Array.isArray(parsed.strengths)  ? parsed.strengths  : buildTemplateStrengths(strengths),
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : buildTemplateWeaknesses(weaknesses),
      insight:    parsed.insight    ?? buildTemplateInsight(strengths)
    };
  } catch {
    return buildTemplateFeedback({ grade, strengths, weaknesses });
  }
}

// ── 규칙 기반 fallback ────────────────────────────────────────────────────────

function buildTemplateFeedback({ grade, strengths, weaknesses }) {
  return {
    summary:    buildTemplateSummary({ grade, strengths, weaknesses }),
    strengths:  buildTemplateStrengths(strengths),
    weaknesses: buildTemplateWeaknesses(weaknesses),
    insight:    buildTemplateInsight(strengths)
  };
}

function buildTemplateSummary({ grade, strengths, weaknesses }) {
  return `${grade} 수준입니다. ${strengths[0]}과 ${strengths[1]}은 비교적 안정적으로 활용하고 있지만, ${weaknesses[0]}과 ${weaknesses[1]}은 프롬프트에 더 의식적으로 넣어볼 필요가 있습니다.`;
}

function buildTemplateStrengths(strengths) {
  return strengths.map((name) => ({
    name,
    description: `${name}을 프롬프트에 자연스럽게 반영하는 편입니다.`
  }));
}

function buildTemplateWeaknesses(weaknesses) {
  return weaknesses.map((name) => ({
    name,
    description: `요청을 보내기 전 ${name}이 드러나는 문장을 한 줄 더 추가해보세요.`
  }));
}

function buildTemplateInsight(strengths) {
  return `저는 AI를 활용할 때 ${strengths[0]}과 ${strengths[1]}을 먼저 정리해 결과의 방향을 잡는 편입니다. 필요한 결과를 빠르게 얻기보다, 원하는 기준에 맞게 좁혀가는 방식으로 AI를 씁니다.`;
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`OpenAI feedback timeout after ${timeoutMs}ms.`)), timeoutMs);
    })
  ]);
}
