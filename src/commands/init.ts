import { ensureBrainConfig, ensureBrainDirectories } from "../core/event-store.js";
import { createMemoryFiles, updateAgentsMd } from "../core/memory-writer.js";
import { getProjectRoot } from "../utils/paths.js";
import { todayStamp } from "../utils/time.js";

export async function initCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  ensureBrainDirectories(root);
  ensureBrainConfig(root);
  const createdMemoryFiles = createMemoryFiles(root, todayStamp());
  const agentsStatus = updateAgentsMd(root);

  console.log("Codex Brain inicializado.");
  console.log(`Projeto: ${root}`);
  console.log(`Arquivos de memoria criados: ${createdMemoryFiles.length}`);
  console.log(`AGENTS.md: ${agentsStatus}`);
}
