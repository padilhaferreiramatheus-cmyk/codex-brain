import { analyzePromptForConflicts } from "../core/conflict-detector.js";
import { memoryPath, getProjectRoot } from "../utils/paths.js";
import { readTextIfExists } from "../utils/fs.js";

export async function conflictCheckCommand(prompt: string): Promise<void> {
  const root = getProjectRoot(process.cwd());
  const memoryTexts = ["DONT_DO.md", "DECISIONS.md", "CONFLICTS.md"].map((file) =>
    readTextIfExists(memoryPath(root, file)),
  );
  const result = analyzePromptForConflicts(prompt, memoryTexts);

  console.log(`Severity: ${result.severity}`);

  if (result.matchedTerms.length > 0) {
    console.log(`Matched terms: ${result.matchedTerms.join(", ")}`);
  }

  if (result.reasons.length > 0) {
    console.log("Reasons:");
    for (const reason of result.reasons) {
      console.log(`- ${reason}`);
    }
  }

  if (result.suggestions.length > 0) {
    console.log("Suggestions:");
    for (const suggestion of result.suggestions) {
      console.log(`- ${suggestion}`);
    }
  }
}
