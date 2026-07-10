import path from "node:path";
import { CODEX_DIR, getProjectRoot } from "../utils/paths.js";
import { ensureDir, readTextIfExists, writeJson, writeText } from "../utils/fs.js";

type HookHandler = {
  type?: string;
  command?: string;
  commandWindows?: string;
  statusMessage?: string;
  [key: string]: unknown;
};

type HookGroup = {
  matcher?: string;
  hooks?: HookHandler[];
  [key: string]: unknown;
};

type HooksJson = {
  hooks?: Record<string, HookGroup[]>;
  [key: string]: unknown;
};

const HOOK_FILES: Record<string, string> = {
  SessionStart: "codex-brain-session-start.js",
  UserPromptSubmit: "codex-brain-user-prompt-submit.js",
  PostToolUse: "codex-brain-post-tool-use.js",
  Stop: "codex-brain-stop.js",
};

function commandFor(file: string): string {
  return `node "${file}"`;
}

function buildHooksJson(root: string): HooksJson {
  const hookPath = (event: keyof typeof HOOK_FILES) =>
    path.join(root, CODEX_DIR, "hooks", HOOK_FILES[event]);

  return {
    hooks: {
      SessionStart: [
        {
          matcher: "startup|resume|clear|compact",
          hooks: [
            {
              type: "command",
              command: commandFor(hookPath("SessionStart")),
              commandWindows: commandFor(hookPath("SessionStart")),
              timeout: 30,
              statusMessage: "Codex Brain: registrando inicio de sessao",
            },
          ],
        },
      ],
      UserPromptSubmit: [
        {
          hooks: [
            {
              type: "command",
              command: commandFor(hookPath("UserPromptSubmit")),
              commandWindows: commandFor(hookPath("UserPromptSubmit")),
              timeout: 30,
              statusMessage: "Codex Brain: registrando prompt",
            },
          ],
        },
      ],
      PostToolUse: [
        {
          matcher: "*",
          hooks: [
            {
              type: "command",
              command: commandFor(hookPath("PostToolUse")),
              commandWindows: commandFor(hookPath("PostToolUse")),
              timeout: 30,
              statusMessage: "Codex Brain: registrando ferramenta",
            },
          ],
        },
      ],
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: commandFor(hookPath("Stop")),
              commandWindows: commandFor(hookPath("Stop")),
              timeout: 30,
              statusMessage: "Codex Brain: registrando fechamento",
            },
          ],
        },
      ],
    },
  };
}

function isCodexBrainHandler(handler: HookHandler): boolean {
  const haystack = [
    handler.command,
    handler.commandWindows,
    handler.statusMessage,
  ]
    .filter(Boolean)
    .join("\n");

  return haystack.includes("codex-brain-") || haystack.includes("Codex Brain:");
}

function normalizeHooksJson(value: unknown): HooksJson {
  if (!value || typeof value !== "object") {
    return { hooks: {} };
  }

  const candidate = value as HooksJson;
  if (!candidate.hooks || typeof candidate.hooks !== "object") {
    return { ...candidate, hooks: {} };
  }

  return candidate;
}

export function mergeHooksJson(existingValue: unknown, codexBrainValue: HooksJson): HooksJson {
  const existing = normalizeHooksJson(existingValue);
  const mergedHooks: Record<string, HookGroup[]> = {};

  for (const [eventName, groups] of Object.entries(existing.hooks ?? {})) {
    mergedHooks[eventName] = (Array.isArray(groups) ? groups : [])
      .map((group) => ({
        ...group,
        hooks: (Array.isArray(group.hooks) ? group.hooks : []).filter(
          (handler) => !isCodexBrainHandler(handler),
        ),
      }))
      .filter((group) => (group.hooks ?? []).length > 0);
  }

  for (const [eventName, codexBrainGroups] of Object.entries(codexBrainValue.hooks ?? {})) {
    mergedHooks[eventName] = [
      ...(mergedHooks[eventName] ?? []),
      ...(Array.isArray(codexBrainGroups) ? codexBrainGroups : []),
    ];
  }

  return {
    ...existing,
    hooks: mergedHooks,
  };
}

function readExistingHooksJson(file: string): unknown {
  const text = readTextIfExists(file);
  if (!text.trim()) {
    return { hooks: {} };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { hooks: {} };
  }
}

function buildHookScript(eventName: string): string {
  return `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const EVENT_NAME = ${JSON.stringify(eventName)};
const MAX_FIELD_LENGTH = 12000;
const MAX_EVENT_BYTES = 200000;

function nowIso() {
  return new Date().toISOString();
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function exists(file) {
  return fs.existsSync(file);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function findRoot(start) {
  let current = path.resolve(start);
  const parsed = path.parse(current);
  while (true) {
    if (exists(path.join(current, ".agent-brain")) || exists(path.join(current, ".codex"))) {
      return current;
    }
    if (current === parsed.root) {
      return path.resolve(start);
    }
    current = path.dirname(current);
  }
}

function appendJsonl(file, value) {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, JSON.stringify(value) + "\\n", "utf8");
}

function maskSecrets(value) {
  return String(value)
    .replace(/OPENAI_API_KEY\\s*=\\s*[^\\s"']+/gi, "OPENAI_API_KEY=[REDACTED]")
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-[REDACTED]")
    .replace(/ghp_[A-Za-z0-9_]{8,}/g, "ghp_[REDACTED]")
    .replace(/github_pat_[A-Za-z0-9_]{8,}/g, "github_pat_[REDACTED]")
    .replace(/(password|senha|token|api_key)\\s*=\\s*([^\\s\\"'&]+)/gi, "$1=[REDACTED]");
}

function sanitize(value, depth) {
  if (depth > 6) return "[max-depth]";
  if (typeof value === "string") {
    const masked = maskSecrets(value);
    if (masked.length <= MAX_FIELD_LENGTH) return masked;
    return { truncated: true, originalLength: masked.length, value: masked.slice(0, MAX_FIELD_LENGTH) };
  }
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitize(item, depth + 1));
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) out[key] = sanitize(value[key], depth + 1);
    return out;
  }
  return value;
}

function runGit(root, args) {
  try {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8", timeout: 2000, windowsHide: true });
    return result.status === 0 ? String(result.stdout || "").trim() : "";
  } catch {
    return "";
  }
}

function isGitRepo(root) {
  return runGit(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
}

function gitSnapshot(root) {
  if (!isGitRepo(root)) {
    return { branch: "not-a-git-repo", commit: "not-a-git-repo", git_status_short: "" };
  }
  return {
    branch: runGit(root, ["branch", "--show-current"]) || "detached-head",
    commit: runGit(root, ["rev-parse", "--short", "HEAD"]) || "unknown",
    git_status_short: runGit(root, ["status", "--short"]),
  };
}

function stopGitSnapshot(root) {
  const status = gitSnapshot(root);
  const changed = status.git_status_short
    ? status.git_status_short.split(/\\r?\\n/).map((line) => line.slice(3).trim()).filter(Boolean)
    : [];
  return {
    ...status,
    git_diff_stat: isGitRepo(root) ? runGit(root, ["diff", "--stat"]) : "",
    changed_files: changed,
  };
}

function getPath(obj, key) {
  return key.split(".").reduce((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return current[part];
  }, obj);
}

function pickString(obj, keys) {
  for (const key of keys) {
    const value = getPath(obj, key);
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "boolean") return String(value);
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
}

function conflictCheck(prompt) {
  const terms = [
    ["refazer do zero", "high"],
    ["refazer tudo do zero", "high"],
    ["reescrever tudo", "high"],
    ["trocar arquitetura", "medium"],
    ["ignora decisao anterior", "high"],
    ["sem teste", "medium"],
    ["remove validacao", "medium"],
    ["bypass", "medium"],
    ["yolo", "high"],
    ["dangerously", "high"],
    ["danger-full-access", "high"],
    ["apagar historico", "high"],
    ["limpar tudo", "medium"],
    ["remover seguranca", "high"],
    ["desativar permissao", "high"],
    ["--dangerously-bypass-approvals-and-sandbox", "high"],
    ["--dangerously-bypass-hook-trust", "high"]
  ];
  const ranks = { none: 0, low: 1, medium: 2, high: 3 };
  let severity = "none";
  const matchedTerms = [];
  const reasons = [];
  const normalized = normalize(prompt);
  for (const [term, termSeverity] of terms) {
    if (normalized.includes(normalize(term))) {
      matchedTerms.push(term);
      reasons.push("termo perigoso detectado: " + term);
      if (ranks[termSeverity] > ranks[severity]) severity = termSeverity;
    }
  }
  return {
    severity,
    matchedTerms,
    reasons,
    suggestions: severity === "none" ? [] : ["Reformule o prompt para preservar historico, seguranca, decisoes e testes."]
  };
}

function summarizePayload(payload) {
  const json = JSON.stringify(payload || {});
  return {
    payload_original_bytes: Buffer.byteLength(json, "utf8"),
    payload_summary: json.length > 2000 ? json.slice(0, 2000) + "..." : json,
  };
}

function baseEvent(payload, cwd) {
  return {
    timestamp: nowIso(),
    event: EVENT_NAME,
    cwd,
    session_id: pickString(payload, ["session_id", "sessionId", "session.id"]),
    turn_id: pickString(payload, ["turn_id", "turnId", "turn.id"]),
    model: pickString(payload, ["model", "model_name", "modelName"]),
  };
}

function buildEvent(payload, root, cwd) {
  if (EVENT_NAME === "SessionStart") {
    return { ...baseEvent(payload, cwd), ...gitSnapshot(root) };
  }
  if (EVENT_NAME === "UserPromptSubmit") {
    const prompt = pickString(payload, ["prompt", "user_prompt", "message", "input", "text"]) || "";
    return { ...baseEvent(payload, cwd), prompt, conflict_check: conflictCheck(prompt) };
  }
  if (EVENT_NAME === "PostToolUse") {
    return {
      ...baseEvent(payload, cwd),
      tool_name: pickString(payload, ["tool_name", "toolName", "tool.name", "name"]),
      command: pickString(payload, ["command", "tool_input.command", "input.command", "args.command"]),
      success: pickString(payload, ["success", "status", "result.status"]),
      ...summarizePayload(payload),
    };
  }
  if (EVENT_NAME === "Stop") {
    return {
      ...baseEvent(payload, cwd),
      last_assistant_message: pickString(payload, ["last_assistant_message", "lastAssistantMessage", "assistant_message", "message", "output"]) || "",
      ...stopGitSnapshot(root),
    };
  }
  return baseEvent(payload, cwd);
}

function writeHookError(root, error, inputLength) {
  appendJsonl(path.join(root, ".agent-brain", "events", "raw", "hook-errors.jsonl"), {
    timestamp: nowIso(),
    event: "HookError",
    hook: EVENT_NAME,
    error: error && error.message ? error.message : String(error),
    inputLength,
  });
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const cwd = process.cwd();
  const root = findRoot(cwd);
  try {
    const payload = input.trim() ? JSON.parse(input) : {};
    let event = buildEvent(payload, root, cwd);
    event = sanitize(event, 0);
    const serialized = JSON.stringify(event);
    if (serialized.length > MAX_EVENT_BYTES) {
      event = {
        timestamp: nowIso(),
        event: EVENT_NAME,
        cwd,
        truncated: true,
        originalBytes: Buffer.byteLength(serialized, "utf8"),
        summary: "evento excedeu MAX_EVENT_BYTES e foi resumido",
      };
    }
    appendJsonl(path.join(root, ".agent-brain", "events", "raw", todayStamp() + ".jsonl"), event);
  } catch (error) {
    try {
      writeHookError(root, error, input.length);
    } catch {}
  } finally {
    process.exit(0);
  }
});
`;
}

export async function installHooksCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const hooksDir = path.join(root, CODEX_DIR, "hooks");
  ensureDir(hooksDir);
  writeJson(path.join(hooksDir, "package.json"), {
    type: "commonjs",
    private: true,
  });
  writeText(
    path.join(hooksDir, "README.md"),
    `# Codex Brain hooks

This directory was created intentionally by Codex Brain.

Do not delete it as a cleanup task unless Matheus explicitly asks to uninstall Codex Brain.

These scripts are local Codex command hooks. They read JSON from stdin, record local JSONL events under .agent-brain/, avoid stdout noise, and exit 0 so they do not break Codex.
`,
  );

  for (const [eventName, filename] of Object.entries(HOOK_FILES)) {
    writeText(path.join(hooksDir, filename), buildHookScript(eventName));
  }

  const hooksJsonPath = path.join(root, CODEX_DIR, "hooks.json");
  const existingHooks = readExistingHooksJson(hooksJsonPath);
  const mergedHooks = mergeHooksJson(existingHooks, buildHooksJson(root));
  writeJson(hooksJsonPath, mergedHooks);

  console.log("Hooks do Codex Brain instalados/atualizados.");
  console.log(`Arquivo: ${hooksJsonPath}`);
  console.log("Hooks existentes de terceiros foram preservados.");
  console.log("Revise e confie nesses hooks dentro da interface do Codex usando /hooks.");
  console.log("Nao digite /hooks no PowerShell. Para ajuda, rode codex-brain hooks-help.");
}
