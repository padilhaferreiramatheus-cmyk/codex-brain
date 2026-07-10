import { runCommand } from "../utils/shell.js";

export async function isGitRepo(cwd = process.cwd()): Promise<boolean> {
  const result = runCommand("git", ["rev-parse", "--is-inside-work-tree"], cwd);
  return result.ok && result.stdout === "true";
}

export async function getBranch(cwd = process.cwd()): Promise<string> {
  if (!(await isGitRepo(cwd))) {
    return "not-a-git-repo";
  }

  const result = runCommand("git", ["branch", "--show-current"], cwd);
  if (result.ok && result.stdout) {
    return result.stdout;
  }

  return "detached-head";
}

export async function getHeadCommit(cwd = process.cwd()): Promise<string> {
  if (!(await isGitRepo(cwd))) {
    return "not-a-git-repo";
  }

  const result = runCommand("git", ["rev-parse", "--short", "HEAD"], cwd);
  return result.ok && result.stdout ? result.stdout : "unknown";
}

export async function getStatusShort(cwd = process.cwd()): Promise<string> {
  if (!(await isGitRepo(cwd))) {
    return "";
  }

  const result = runCommand("git", ["status", "--short"], cwd);
  return result.ok ? result.stdout : "";
}

export async function getDiffStat(cwd = process.cwd()): Promise<string> {
  if (!(await isGitRepo(cwd))) {
    return "";
  }

  const result = runCommand("git", ["diff", "--stat"], cwd, 8000);
  return result.ok ? result.stdout : "";
}

export async function getDiff(cwd = process.cwd(), maxLength = 20000): Promise<string> {
  if (!(await isGitRepo(cwd))) {
    return "";
  }

  const result = runCommand("git", ["diff"], cwd, 10000);
  if (!result.ok) {
    return "";
  }

  if (result.stdout.length <= maxLength) {
    return result.stdout;
  }

  return `${result.stdout.slice(0, maxLength)}\n\n[diff truncado: ${result.stdout.length - maxLength} caracteres omitidos]`;
}

export async function getChangedFiles(cwd = process.cwd()): Promise<string[]> {
  const status = await getStatusShort(cwd);
  if (!status) {
    return [];
  }

  return status
    .split(/\r?\n/)
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((file) => file.replace(/^"|"$/g, ""));
}
