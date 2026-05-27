#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { evaluateTrack1, parseTrack1Input } from "../src/track1/evaluate.js";
import { loadEnv } from "../src/shared/env.js";

async function main() {
  const args = process.argv.slice(2);
  const inputPath = args[0];
  loadEnv();

  if (!inputPath || inputPath === "--help" || inputPath === "-h") {
    printHelp();
    process.exit(inputPath ? 0 : 1);
  }

  const questionnairePath = getFlagValue(args, "--questionnaire");
  const tieBreaksPath = getFlagValue(args, "--tie-breaks");
  const rawInput = await readFile(inputPath, "utf8");
  const llmResult = parseTrack1Input(rawInput);
  const questionnaire = questionnairePath
    ? parseTrack1Input(await readFile(questionnairePath, "utf8"))
    : null;
  const tieBreaks = tieBreaksPath
    ? parseTrack1Input(await readFile(tieBreaksPath, "utf8"))
    : null;

  const result = evaluateTrack1({ llmResult, questionnaire, tieBreaks, includeInternal: true });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

function getFlagValue(args, flag) {
  const index = args.indexOf(flag);
  if (index < 0) return null;
  return args[index + 1] || null;
}

function printHelp() {
  process.stdout.write(`Usage:
  npm run track1:backend -- <llm-result.json> [--questionnaire <answers.json>] [--tie-breaks <tie-breaks.json>]

Examples:
  npm run track1:backend:sample
  npm run track1:backend -- examples/track1/sample_success.json --questionnaire examples/track1/sample_questionnaire_answers.json
`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
