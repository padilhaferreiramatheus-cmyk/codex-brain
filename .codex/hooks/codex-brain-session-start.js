#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const EVENT_NAME = "SessionStart";
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
  fs.appendFileSync(file, JSON.stringify(value) + "\n", "utf8");
}

function maskSecrets(value) {
  return String(value)
    .replace(/OPENAI_API_KEY\s*=\s*[^\s"']+/gi, "OPENAI_API_KEY=[REDACTED]")
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-[REDACTED]")
    .replace(/ghp_[A-Za-z0-9_]{8,}/g, "ghp_[REDACTED]")
    .replace(/github_pat_[A-Za-z0-9_]{8,}/g, "github_pat_[REDACTED]")
    .replace(/(password|senha|token|api_key)\s*=\s*([^\s\"'&]+)/gi, "$1=[REDACTED]");
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
    ? status.git_status_short.split(/\r?\n/).map((line) => line.slice(3).trim()).filter(Boolean)
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
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
