import { doctorCommand } from "./doctor.js";
import { initCommand } from "./init.js";
import { installHooksCommand } from "./install-hooks.js";

export async function quickstartCommand(): Promise<void> {
  console.log("Codex Brain quickstart");
  console.log("");
  console.log("1. Criando memoria local...");
  await initCommand();
  console.log("");
  console.log("2. Instalando hooks locais do Codex...");
  await installHooksCommand();
  console.log("");
  console.log("3. Conferindo instalacao...");
  await doctorCommand();
  console.log("");
  console.log("Pronto.");
  console.log("");
  console.log("Como usar no dia a dia:");
  console.log("- Abra o Codex neste projeto.");
  console.log("- Dentro da interface do Codex, digite /hooks e confie nos hooks do Codex Brain.");
  console.log("- Nao digite /hooks no PowerShell; isso nao e comando de terminal.");
  console.log("- Trabalhe normalmente.");
  console.log("- Depois rode: codex-brain report");
  console.log("- Para continuar depois rode: codex-brain next");
  console.log("");
  console.log("Se ainda estiver confuso, rode: codex-brain hooks-help");
  console.log("");
  console.log("No modo dev deste repo, use npm.cmd run dev -- antes do comando.");
}
