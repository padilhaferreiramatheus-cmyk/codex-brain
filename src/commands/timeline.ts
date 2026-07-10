import { getTodayEvents } from "../core/session-store.js";
import { getProjectRoot } from "../utils/paths.js";
import { todayStamp } from "../utils/time.js";

function describeEvent(event: Record<string, unknown>): string {
  if (event.event === "SessionStart") {
    return "sessao iniciada";
  }

  if (event.event === "UserPromptSubmit") {
    const conflict = event.conflict_check as { severity?: string } | undefined;
    const suffix = conflict?.severity && conflict.severity !== "none" ? ` - alerta ${conflict.severity}` : "";
    return `prompt enviado${suffix}`;
  }

  if (event.event === "PostToolUse") {
    return `ferramenta usada: ${String(event.tool_name ?? "desconhecida")}`;
  }

  if (event.event === "Stop") {
    const changed = Array.isArray(event.changed_files) ? event.changed_files.length : 0;
    return `resposta final / stop - arquivos alterados: ${changed}`;
  }

  if (event.event === "ReportGenerated") {
    return "relatorio gerado";
  }

  return String(event.event ?? "evento desconhecido");
}

export async function timelineCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const events = getTodayEvents(root, todayStamp());

  console.log(`Timeline de hoje (${todayStamp()})`);

  if (events.length === 0) {
    console.log("- Nenhum evento capturado.");
    return;
  }

  for (const event of events) {
    console.log(`- ${event.timestamp}: ${describeEvent(event)}`);
  }
}
