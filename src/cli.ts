#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { installHooksCommand } from "./commands/install-hooks.js";
import { doctorCommand } from "./commands/doctor.js";
import { statusCommand } from "./commands/status.js";
import { timelineCommand } from "./commands/timeline.js";
import { reportCommand } from "./commands/report.js";
import { nextCommand } from "./commands/next.js";
import { conflictCheckCommand } from "./commands/conflict-check.js";
import { quickstartCommand } from "./commands/quickstart.js";
import { selftestCommand } from "./commands/selftest.js";
import { hooksHelpCommand } from "./commands/hooks-help.js";
import { dailyCommand } from "./commands/daily.js";
import { handleHook } from "./hooks/handle.js";

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => resolve(input));
    process.stdin.on("error", reject);
  });
}

const program = new Command();

program
  .name("codex-brain")
  .description("Local-first technical memory and reporting CLI for Codex sessions.")
  .version("0.1.0");

program.command("init").description("Create .agent-brain memory and config files.").action(initCommand);

program
  .command("quickstart")
  .description("Run init, install-hooks, and doctor with usage guidance.")
  .action(quickstartCommand);

program
  .command("install-hooks")
  .description("Install project-local Codex hooks for Codex Brain.")
  .action(installHooksCommand);

program.command("doctor").description("Check local Codex Brain setup.").action(doctorCommand);
program.command("status").description("Show project/session status.").action(statusCommand);
program.command("timeline").description("Show today's event timeline.").action(timelineCommand);
program.command("report").description("Generate today's progress report.").action(reportCommand);
program.command("next").description("Generate the next best prompt.").action(nextCommand);
program
  .command("daily")
  .description("Run status, report, and next in one workflow.")
  .option("-l, --label <label>", "Optional checkpoint label for generated files.")
  .action((options: { label?: string }) => dailyCommand({ label: options.label, commandName: "daily" }));

program
  .command("checkpoint")
  .description("Create a named or unnamed progress checkpoint.")
  .option("-l, --label <label>", "Optional checkpoint label for generated files.")
  .action((options: { label?: string }) =>
    dailyCommand({ label: options.label, commandName: "checkpoint" }),
  );
program.command("selftest").description("Run a local end-to-end smoke test.").action(selftestCommand);
program.command("hooks-help").description("Explain how to review Codex hooks safely.").action(hooksHelpCommand);

program
  .command("conflict-check <prompt>")
  .description("Check a prompt against memory and dangerous terms.")
  .action(conflictCheckCommand);

program
  .command("hook <event>")
  .description("Internal hook entrypoint.")
  .action(async (eventName: string) => {
    try {
      const input = await readStdin();
      const payload = input.trim() ? JSON.parse(input) : {};
      await handleHook(eventName, payload);
    } catch {
      await handleHook(eventName, {});
    }
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
