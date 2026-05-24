import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * OpenAI로 한국어 총평 생성
 * API 실패 시 규칙 기반 템플릿으로 자동 fallback
 */
export async function generateFeedback({ grade, strengths, weaknesses, axes }) {
  try {
    const axisLines = axes
      .map((ax) => `- ${ax.name}: ${ax.finalScore}/${ax.maxScore} (빈도 부사: ${ax.freqWord})`)
      .join("\n");

    const prompt = `Track 2 AI 활용 역량 진단 결과를 바탕으로 2~3문장의 한국어 총평을 작성해줘.
가장 강한 점을 먼저 언급하고, 가장 약한 축에 대한 구체적이고 행동 가능한 개선 팁을 포함해.
막연한 칭찬("좋은 습관이에요" 등)은 금지.

등급: ${grade}
강점: ${strengths.join(", ")}
약점: ${weaknesses.join(", ")}
축별 점수:
${axisLines}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch {
    return buildTemplateFeedback({ strengths, weaknesses });
  }
}

/**
 * 규칙 기반 피드백 템플릿 (OpenAI 없이 동작하는 fallback)
 */
function buildTemplateFeedback({ strengths, weaknesses }) {
  return `${strengths[0]}과 ${strengths[1]} 측면에서 높은 역량을 보여줍니다. 반면 ${weaknesses[0]} 영역이 가장 약한 부분으로, 다음 프롬프트 작성 시 이 부분을 의식적으로 보완하면 AI 활용 수준을 한 단계 높일 수 있습니다.`;
}
