import fs from "node:fs";
import path from "node:path";
import { ensureDir, fileExists } from "./fs.js";

export function appendJsonl(file: string, value: unknown): void {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, `${JSON.stringify(value)}\n`, "utf8");
}

export function readJsonl<T = unknown>(file: string): T[] {
  if (!fileExists(file)) {
    return [];
  }

  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as T];
      } catch {
        return [];
      }
    });
}
