import path from "node:path";
import { countEventsForDate, countPromptsForDate, listReportFiles } from "../core/event-store.js";
import { getBranch, getChangedFiles, getHeadCommit } from "../core/git.js";
import { fileExists } from "../utils/fs.js";
import { getProjectRoot } from "../utils/paths.js";
import { todayStamp } from "../utils/time.js";

export async function statusCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const date = todayStamp();
  const changedFiles = await getChangedFiles(root);
  const reports = listReportFiles(root);
  const lastReport = reports.at(-1);
  const lastReportLabel = lastReport ? path.relative(root, lastReport) : "nenhum";

  console.log("Codex Brain status");
  console.log(`Projeto: ${root}`);
  console.log(`Branch: ${await getBranch(root)}`);
  console.log(`Commit: ${await getHeadCommit(root)}`);
  console.log(`.agent-brain: ${fileExists(path.join(root, ".agent-brain")) ? "sim" : "nao"}`);
  console.log(`Eventos de hoje: ${countEventsForDate(root, date)}`);
  console.log(`Prompts capturados hoje: ${countPromptsForDate(root, date)}`);
  console.log(`Arquivos alterados no Git: ${changedFiles.length}`);
  console.log(`Ultimo relatorio: ${lastReportLabel}`);
  console.log("");
  console.log("Proximos comandos sugeridos:");
  console.log("- codex-brain hooks-help");
  console.log("- codex-brain timeline");
  console.log("- codex-brain checkpoint");
  console.log("- codex-brain checkpoint --label fechamento");
}
