import { appendRawEvent } from "../core/event-store.js";
import { generateDailyReport } from "../core/report-generator.js";
import { getProjectRoot } from "../utils/paths.js";
import { nowIso } from "../utils/time.js";

export async function reportCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const file = await generateDailyReport(root);
  appendRawEvent(root, {
    timestamp: nowIso(),
    event: "ReportGenerated",
    cwd: process.cwd(),
    file,
  });
  console.log(`Relatorio gerado: ${file}`);
}
