import path from "node:path";
import { commandExists } from "../utils/shell.js";
import { fileExists } from "../utils/fs.js";
import { getProjectRoot } from "../utils/paths.js";
import { isGitRepo } from "../core/git.js";

function check(label: string, ok: boolean, detail = ""): void {
  console.log(`${ok ? "[ok]" : "[!!]"} ${label}${detail ? ` - ${detail}` : ""}`);
}

export async function doctorCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const gitRepo = await isGitRepo(root);
  const hookFiles = [
    "codex-brain-session-start.js",
    "codex-brain-user-prompt-submit.js",
    "codex-brain-post-tool-use.js",
    "codex-brain-stop.js",
  ];
  const memoryFiles = [
    "PROJECT_MEMORY.md",
    "DECISIONS.md",
    "DONT_DO.md",
    "ROADMAP.md",
    "OPEN_QUESTIONS.md",
    "CONFLICTS.md",
  ];

  console.log("Codex Brain doctor");
  console.log(`Projeto detectado: ${root}`);
  check("Node instalado", true, process.version);
  check("npm instalado", commandExists("npm", root));
  check("Git instalado", commandExists("git", root));
  check("Dentro de repo Git", gitRepo);
  check("Codex CLI disponivel", commandExists("codex", root));
  check(".agent-brain existe", fileExists(path.join(root, ".agent-brain")));
  check(".codex/hooks.json existe", fileExists(path.join(root, ".codex", "hooks.json")));

  for (const file of hookFiles) {
    check(`hook ${file}`, fileExists(path.join(root, ".codex", "hooks", file)));
  }

  for (const file of memoryFiles) {
    check(`memory ${file}`, fileExists(path.join(root, ".agent-brain", "memory", file)));
  }

  console.log("");
  console.log("Proximos comandos sugeridos:");
  if (!fileExists(path.join(root, ".agent-brain"))) {
    console.log("- codex-brain quickstart");
    console.log("- codex-brain selftest");
  } else if (!fileExists(path.join(root, ".codex", "hooks.json"))) {
    console.log("- codex-brain install-hooks");
    console.log("- codex-brain selftest");
  } else {
    console.log("- codex-brain hooks-help");
    console.log("- codex-brain selftest");
    console.log("- codex-brain timeline");
    console.log("- codex-brain report");
    console.log("- codex-brain next");
  }
}
