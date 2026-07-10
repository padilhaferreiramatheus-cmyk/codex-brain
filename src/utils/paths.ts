import path from "node:path";
import { existsSync } from "node:fs";

export const BRAIN_DIR = ".agent-brain";
export const CODEX_DIR = ".codex";
export const RAW_EVENTS_DIR = path.join(BRAIN_DIR, "events", "raw");
export const NORMALIZED_EVENTS_DIR = path.join(BRAIN_DIR, "events", "normalized");
export const SESSIONS_DIR = path.join(BRAIN_DIR, "sessions");
export const REPORTS_DIR = path.join(BRAIN_DIR, "reports");
export const MEMORY_DIR = path.join(BRAIN_DIR, "memory");

export function findUp(start: string, marker: string): string | null {
  let current = path.resolve(start);
  const parsed = path.parse(current);

  while (true) {
    if (existsSync(path.join(current, marker))) {
      return current;
    }

    if (current === parsed.root) {
      return null;
    }

    current = path.dirname(current);
  }
}

export function getProjectRoot(cwd = process.cwd()): string {
  return (
    findUp(cwd, BRAIN_DIR) ??
    findUp(cwd, ".git") ??
    findUp(cwd, "package.json") ??
    cwd
  );
}

export function brainPath(root: string, ...parts: string[]): string {
  return path.join(root, BRAIN_DIR, ...parts);
}

export function memoryPath(root: string, filename: string): string {
  return brainPath(root, "memory", filename);
}

export function reportPath(root: string, filename: string): string {
  return brainPath(root, "reports", filename);
}

export function rawEventsPath(root: string, date: string): string {
  return brainPath(root, "events", "raw", `${date}.jsonl`);
}

export function hookErrorsPath(root: string): string {
  return brainPath(root, "events", "raw", "hook-errors.jsonl");
}
