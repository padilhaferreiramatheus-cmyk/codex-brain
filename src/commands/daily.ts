import { generateDailyReport, generateNextPrompt } from "../core/report-generator.js";
import { countEventsForDate, countPromptsForDate, listReportFiles, appendRawEvent } from "../core/event-store.js";
import { getBranch, getChangedFiles, getHeadCommit } from "../core/git.js";
import { getProjectRoot } from "../utils/paths.js";
import { nowIso, todayStamp } from "../utils/time.js";

type DailyOptions = {
  label?: string;
  commandName?: "daily" | "checkpoint";
};

export async function dailyCommand(options: DailyOptions = {}): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const date = todayStamp();
  const changedFiles = await getChangedFiles(root);
  const previousReport = listReportFiles(root).at(-1);
  const commandName = options.commandName ?? "daily";

  console.log(`Codex Brain ${commandName}`);
  console.log("");
  console.log("Status");
  console.log(`Projeto: ${root}`);
  console.log(`Branch: ${await getBranch(root)}`);
  console.log(`Commit: ${await getHeadCommit(root)}`);
  if (options.label) {
    console.log(`Checkpoint: ${options.label}`);
  }
  console.log(`Eventos de hoje: ${countEventsForDate(root, date)}`);
  console.log(`Prompts capturados hoje: ${countPromptsForDate(root, date)}`);
  console.log(`Arquivos alterados no Git: ${changedFiles.length}`);
  console.log(`Ultimo relatorio anterior: ${previousReport ?? "nenhum"}`);
  console.log("");

  const reportFile = await generateDailyReport(root, date, options.label);
  const nextPromptFile = await generateNextPrompt(root, date, options.label);

  appendRawEvent(root, {
    timestamp: nowIso(),
    event: commandName === "checkpoint" ? "CheckpointRun" : "DailyRun",
    cwd: process.cwd(),
    label: options.label,
    reportFile,
    nextPromptFile,
  });

  console.log("Arquivos gerados");
  console.log(`Report: ${reportFile}`);
  console.log(`Next prompt: ${nextPromptFile}`);
  console.log("");
  console.log("Proximo passo:");
  console.log("- Abra o arquivo de next prompt e cole no Codex quando quiser continuar.");
}
