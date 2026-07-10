import { appendRawEvent, ensureBrainConfig, ensureBrainDirectories } from "../core/event-store.js";
import { generateDailyReport, generateNextPrompt } from "../core/report-generator.js";
import { getTodayEvents } from "../core/session-store.js";
import { handleHook } from "../hooks/handle.js";
import { getProjectRoot } from "../utils/paths.js";
import { nowIso, todayStamp } from "../utils/time.js";

export async function selftestCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const sessionId = `codex-brain-selftest-${Date.now()}`;

  ensureBrainDirectories(root);
  ensureBrainConfig(root);

  await handleHook("SessionStart", {
    session_id: sessionId,
    model: "selftest",
  });

  await handleHook("UserPromptSubmit", {
    session_id: sessionId,
    turn_id: "1",
    model: "selftest",
    prompt: "refazer tudo do zero sem teste",
  });

  await handleHook("PostToolUse", {
    session_id: sessionId,
    turn_id: "1",
    tool_name: "SelfTest",
    command: "codex-brain selftest",
    success: true,
  });

  await handleHook("Stop", {
    session_id: sessionId,
    turn_id: "1",
    model: "selftest",
    last_assistant_message: "Selftest do Codex Brain concluido.",
  });

  const reportFile = await generateDailyReport(root);
  const nextPromptFile = await generateNextPrompt(root);

  appendRawEvent(root, {
    timestamp: nowIso(),
    event: "SelfTestRun",
    cwd: process.cwd(),
    reportFile,
    nextPromptFile,
  });

  const events = getTodayEvents(root, todayStamp());

  console.log("Codex Brain selftest concluido.");
  console.log(`Projeto: ${root}`);
  console.log(`Eventos de hoje: ${events.length}`);
  console.log(`Report gerado: ${reportFile}`);
  console.log(`Next prompt gerado: ${nextPromptFile}`);
  console.log("");
  console.log("Agora rode:");
  console.log("- codex-brain timeline");
  console.log("- codex-brain status");
  console.log("");
  console.log("No modo dev deste repo:");
  console.log("- npm.cmd run dev -- timeline");
  console.log("- npm.cmd run dev -- status");
}
