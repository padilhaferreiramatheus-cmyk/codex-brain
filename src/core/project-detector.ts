import path from "node:path";
import { fileExists } from "../utils/fs.js";
import { BRAIN_DIR, CODEX_DIR, getProjectRoot } from "../utils/paths.js";
import { isGitRepo } from "./git.js";

export type ProjectInfo = {
  root: string;
  name: string;
  hasPackageJson: boolean;
  hasAgentBrain: boolean;
  hasCodexHooks: boolean;
  isGitRepo: boolean;
};

export async function detectProject(cwd = process.cwd()): Promise<ProjectInfo> {
  const root = getProjectRoot(cwd);

  return {
    root,
    name: path.basename(root),
    hasPackageJson: fileExists(path.join(root, "package.json")),
    hasAgentBrain: fileExists(path.join(root, BRAIN_DIR)),
    hasCodexHooks: fileExists(path.join(root, CODEX_DIR, "hooks.json")),
    isGitRepo: await isGitRepo(root),
  };
}
