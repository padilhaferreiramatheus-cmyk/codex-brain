import fs from "node:fs";
import path from "node:path";

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function fileExists(file: string): boolean {
  return fs.existsSync(file);
}

export function readText(file: string): string {
  return fs.readFileSync(file, "utf8");
}

export function readTextIfExists(file: string): string {
  return fileExists(file) ? readText(file) : "";
}

export function writeText(file: string, content: string): void {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

export function writeFileIfMissing(file: string, content: string): boolean {
  if (fileExists(file)) {
    return false;
  }

  writeText(file, content);
  return true;
}

export function writeJson(file: string, value: unknown): void {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeJsonIfMissing(file: string, value: unknown): boolean {
  if (fileExists(file)) {
    return false;
  }

  writeJson(file, value);
  return true;
}

export function listFiles(dir: string): string[] {
  if (!fileExists(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dir, entry.name));
}

export function uniqueFilePath(file: string): string {
  if (!fileExists(file)) {
    return file;
  }

  const parsed = path.parse(file);
  let counter = 2;

  while (true) {
    const candidate = path.join(parsed.dir, `${parsed.name}-${counter}${parsed.ext}`);
    if (!fileExists(candidate)) {
      return candidate;
    }
    counter += 1;
  }
}
