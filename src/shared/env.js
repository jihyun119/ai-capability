import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function loadEnv({ cwd = process.cwd(), filenames = [".env"] } = {}) {
  const loaded = [];
  for (const filePath of findEnvFiles(cwd, filenames)) {
    const values = parseEnvFile(readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(values)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    loaded.push(filePath);
  }
  return loaded;
}

export function getOpenAiApiKey() {
  return process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY || null;
}

function findEnvFiles(startDir, filenames) {
  const files = [];
  let current = resolve(startDir);

  while (true) {
    for (const filename of filenames) {
      const candidate = join(current, filename);
      if (existsSync(candidate)) files.push(candidate);
    }

    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return files;
}

function parseEnvFile(content) {
  const values = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    values[key] = unquote(rawValue.trim());
  }
  return values;
}

function unquote(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
