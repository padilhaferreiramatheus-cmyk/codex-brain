import { baseEvent, conflictCheckForPrompt, pickString } from "./common.js";

export async function buildUserPromptSubmitEvent(payload: unknown, root: string, cwd: string) {
  const prompt = pickString(payload, ["prompt", "user_prompt", "message", "input", "text"]) ?? "";

  return {
    ...baseEvent("UserPromptSubmit", payload, cwd),
    prompt,
    conflict_check: conflictCheckForPrompt(root, prompt),
  };
}
