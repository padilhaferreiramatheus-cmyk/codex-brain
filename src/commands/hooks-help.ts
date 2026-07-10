export async function hooksHelpCommand(): Promise<void> {
  console.log("Codex Brain hooks-help");
  console.log("");
  console.log("/hooks nao e comando do PowerShell.");
  console.log("");
  console.log("Use assim:");
  console.log("");
  console.log("1. Abra o Codex no projeto onde o Codex Brain foi instalado.");
  console.log("2. Dentro da conversa/interface do Codex, digite:");
  console.log("   /hooks");
  console.log("3. Revise os hooks listados.");
  console.log("4. Confie nos hooks do Codex Brain se os caminhos apontarem para .codex/hooks/.");
  console.log("");
  console.log("No PowerShell, use apenas comandos assim:");
  console.log('  & "C:\\Projetos\\CODEX BRAIN\\codex-brain.cmd" status');
  console.log('  & "C:\\Projetos\\CODEX BRAIN\\codex-brain.cmd" report');
  console.log('  & "C:\\Projetos\\CODEX BRAIN\\codex-brain.cmd" next');
  console.log("");
  console.log("Se o Codex disser que vai apagar .codex/hooks/ ou restaurar .codex/hooks.json, pare.");
  console.log("Esses arquivos fazem parte da instalacao do Codex Brain.");
}
