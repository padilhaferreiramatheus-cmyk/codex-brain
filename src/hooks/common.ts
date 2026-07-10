import { appendHookError, appendRawEvent, BrainEvent } from "../core/event-store.js";
import { analyzePromptForConflicts } from "../core/conflict-detector.js";
import { getBranch, getChangedFiles, getDiffStat, getHeadCommit, getStatusShort } from "../core/git.js";
import { memoryPath } from "../utils/paths.js";
import { readTextIfExists } from "../utils/fs.js";
import { nowIso } from "../utils/time.js";

export function pickString(payload: unknown, keys: string[]): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;

  for (const key of keys) {
    const value = key.split(".").reduce<unknown>((current, part) => {
      if (!current || typeof current !== "object") {
        return undefined;
      }

      return (current as Record<string, unknown>)[part];
    }, record);

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

export function baseEvent(event: string, payload: unknown, cwd: string): BrainEvent {
  return {
    timestamp: nowIso(),
    event,
    cwd,
    session_id: pickString(payload, ["session_id", "sessionId", "session.id"]),
    turn_id: pickString(payload, ["turn_id", "turnId", "turn.id"]),
    model: pickString(payload, ["model", "model_name", "modelName"]),
  };
}

export function summarizePayload(payload: unknown): { originalBytes: number; summary: string } {
  const serialized = JSON.stringify(payload ?? {});
  return {
    originalBytes: Buffer.byteLength(serialized, "utf8"),
    summary: serialized.length > 2000 ? `${serialized.slice(0, 2000)}...` : serialized,
  };
}

export async function addGitSnapshot(event: BrainEvent, root: string): Promise<BrainEvent> {
  return {
    ...event,
    branch: await getBranch(root),
    commit: await getHeadCommit(root),
    git_status_short: await getStatusShort(root),
  };
}

export async function addStopGitSnapshot(event: BrainEvent, root: string): Promise<BrainEvent> {
  return {
    ...(await addGitSnapshot(event, root)),
    git_diff_stat: await getDiffStat(root),
    changed_files: await getChangedFiles(root),
  };
}

export function readConflictMemory(root: string): string[] {
  return ["DONT_DO.md", "DECISIONS.md", "CONFLICTS.md"].map((file) =>
    readTextIfExists(memoryPath(root, file)),
  );
}

export async function persistHookEvent(root: string, event: BrainEvent): Promise<void> {
  appendRawEvent(root, event);
}

export function persistHookError(root: string, error: unknown, context: Record<string, unknown>): void {
  appendHookError(root, error, context);
}

export function conflictCheckForPrompt(root: string, prompt: string) {
  return analyzePromptForConflicts(prompt, readConflictMemory(root));
}
