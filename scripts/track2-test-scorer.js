#!/usr/bin/env node
/**
 * 로컬 채점 테스트 스크립트
 * 사용: node scripts/test-scorer.js
 */
import { score } from "../src/track2/scorer.js";

const sampleEssay = `
I usually give the AI my goal, audience, and constraints before asking for an output.
I frequently provide background context about the project and the situation upfront.
When the AI's answer falls short, I always revise my prompt by pointing out exactly what's wrong and why.
I sometimes ask the AI to act as a senior product manager or domain expert when working on strategy.
I occasionally challenge the AI when its suggestions seem inconsistent with my data or goals.
I always specify the format I want — usually a table or bullet points with a specific length.
`.trim();

const sampleAnswers = { Q1: "D", Q2: "D", Q3: "B", Q4: "C", Q5: "D", Q6: "D" };

const result = score(sampleEssay, sampleAnswers);

console.log("\n" + "=".repeat(55));
console.log("  Track 2 AI 활용 역량 진단 결과");
console.log("=".repeat(55));
console.log(`  객관식 답변: ${JSON.stringify(sampleAnswers)}`);
console.log("-".repeat(55));
console.log(`  ${"축".padEnd(12)} ${"빈도부사".padEnd(14)} ${"줄글".padStart(5)} ${"객관식".padStart(6)} ${"최종".padStart(6)} ${"만점".padStart(5)}`);
console.log("-".repeat(55));

for (const ax of result.axes) {
  const mcStr = result.hasMC ? ax.mcNormalized.toFixed(1) : "-";
  console.log(
    `  ${ax.name.padEnd(12)} ${ax.freqWord.padEnd(14)} ${ax.essayScore.toFixed(1).padStart(5)} ${mcStr.padStart(6)} ${ax.finalScore.toFixed(1).padStart(6)} ${String(ax.maxScore).padStart(5)}`
  );
}

console.log("-".repeat(55));
console.log(`  ${"총점".padEnd(30)} ${result.total.toFixed(1).padStart(6)} / 100`);
console.log(`  ${"등급".padEnd(30)} ${result.grade}`);
console.log("=".repeat(55));

console.log("\n[Evidence 상세]");
for (const ax of result.axes) {
  const ev = ax.evidence.length > 80 ? ax.evidence.slice(0, 80) + "..." : ax.evidence;
  console.log(`  ${ax.name}: [${ax.freqWord}] ${ev}`);
}

console.log(`\n  강점: ${result.strengths.join(", ")}`);
console.log(`  약점: ${result.weaknesses.join(", ")}\n`);
