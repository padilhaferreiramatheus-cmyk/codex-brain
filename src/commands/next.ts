import { generateNextPrompt } from "../core/report-generator.js";
import { getProjectRoot } from "../utils/paths.js";

export async function nextCommand(): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const file = await generateNextPrompt(root);
  console.log(`Proximo prompt gerado: ${file}`);
}
