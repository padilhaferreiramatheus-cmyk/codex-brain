import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { readJsonl, appendJsonl } from "../utils/jsonl.js";
import { todayStamp, nowIso } from "../utils/time.js";
import { brainPath, hookErrorsPath, rawEventsPath } from "../utils/paths.js";
import { ensureDir, fileExists, readTextIfExists, writeJsonIfMissing } from "../utils/fs.js";
import { maskSecrets } from "../utils/secrets.js";

export const AgentBrainConfigSchema = z.object({
  version: z.literal(1),
  maxFieldLength: z.number().int().positive().default(12000),
  maxEventBytes: z.number().int().positive().default(200000),
  saveFullDiff: z.boolean().default(false),
  maskSecrets: z.boolean().default(true),
});

export type AgentBrainConfig = z.infer<typeof AgentBrainConfigSchema>;

export const DEFAULT_CONFIG: AgentBrainConfig = {
  version: 1,
  maxFieldLength: 12000,
  maxEventBytes: 200000,
  saveFullDiff: false,
  maskSecrets: true,
};

export type BrainEvent = {
  timestamp: string;
  event: string;
  cwd?: string;
  session_id?: string;
  turn_id?: string;
  model?: string;
  [key: string]: unknown;
};

export function ensureBrainDirectories(root: string): void {
  for (const dir of [
    brainPath(root),
    brainPath(root, "events", "raw"),
    brainPath(root, "events", "normalized"),
    brainPath(root, "sessions"),
    brainPath(root, "reports"),
    brainPath(root, "memory"),
  ]) {
    ensureDir(dir);
  }
}

export function ensureBrainConfig(root: string): void {
  writeJsonIfMissing(brainPath(root, "config.json"), DEFAULT_CONFIG);
}

export function readBrainConfig(root: string): AgentBrainConfig {
  const configPath = brainPath(root, "config.json");
  if (!fileExists(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const parsed = JSON.parse(readTextIfExists(configPath));
    return AgentBrainConfigSchema.parse({ ...DEFAULT_CONFIG, ...parsed });
  } catch {
    return DEFAULT_CONFIG;
  }
}

function sanitizeValue(value: unknown, config: AgentBrainConfig, depth = 0): unknown {
  if (depth > 6) {
    return "[max-depth]";
  }

  if (typeof value === "string") {
    const masked = config.maskSecrets ? maskSecrets(value) : value;
    if (masked.length <= config.maxFieldLength) {
      return masked;
    }

    return {
      truncated: true,
      originalLength: masked.length,
      value: masked.slice(0, config.maxFieldLength),
    };
  }

  if (Array.isArray(value)) {
    return value.slice(0, 100).map((item) => sanitizeValue(item, config, depth + 1));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sanitizeValue(item, config, depth + 1),
      ]),
    );
  }

  return value;
}

export function sanitizeEvent(event: BrainEvent, config: AgentBrainConfig): BrainEvent {
  const sanitized = sanitizeValue(event, config) as BrainEvent;
  const serialized = JSON.stringify(sanitized);

  if (serialized.length <= config.maxEventBytes) {
    return sanitized;
  }

  return {
    timestamp: event.timestamp ?? nowIso(),
    event: event.event,
    cwd: event.cwd,
    truncated: true,
    originalBytes: Buffer.byteLength(serialized, "utf8"),
    summary: "evento excedeu maxEventBytes e foi resumido",
  };
}

export function appendRawEvent(root: string, event: BrainEvent, date = todayStamp()): void {
  ensureBrainDirectories(root);
  ensureBrainConfig(root);
  const config = readBrainConfig(root);
  appendJsonl(rawEventsPath(root, date), sanitizeEvent(event, config));
}

export function appendHookError(root: string, error: unknown, context: Record<string, unknown> = {}): void {
  ensureBrainDirectories(root);
  appendJsonl(hookErrorsPath(root), {
    timestamp: nowIso(),
    event: "HookError",
    error: error instanceof Error ? error.message : String(error),
    ...context,
  });
}

export function readEventsForDate(root: string, date = todayStamp()): BrainEvent[] {
  return readJsonl<BrainEvent>(rawEventsPath(root, date));
}

export function countEventsForDate(root: string, date = todayStamp()): number {
  return readEventsForDate(root, date).length;
}

export function countPromptsForDate(root: string, date = todayStamp()): number {
  return readEventsForDate(root, date).filter((event) => event.event === "UserPromptSubmit").length;
}

export function listReportFiles(root: string): string[] {
  const dir = brainPath(root, "reports");
  if (!fileExists(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file.includes("-report"))
    .map((file) => path.join(dir, file))
    .sort((left, right) => fs.statSync(left).mtimeMs - fs.statSync(right).mtimeMs);
}
