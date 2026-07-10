import { getProjectRoot } from "../utils/paths.js";
import { buildSessionStartEvent } from "./session-start.js";
import { buildUserPromptSubmitEvent } from "./user-prompt-submit.js";
import { buildPostToolUseEvent } from "./post-tool-use.js";
import { buildStopEvent } from "./stop.js";
import { persistHookError, persistHookEvent } from "./common.js";

export async function handleHook(eventName: string, payload: unknown, cwd = process.cwd()): Promise<void> {
  const root = getProjectRoot(cwd);

  try {
    const event =
      eventName === "SessionStart"
        ? await buildSessionStartEvent(payload, root, cwd)
        : eventName === "UserPromptSubmit"
          ? await buildUserPromptSubmitEvent(payload, root, cwd)
          : eventName === "PostToolUse"
            ? await buildPostToolUseEvent(payload, root, cwd)
            : eventName === "Stop"
              ? await buildStopEvent(payload, root, cwd)
              : undefined;

    if (!event) {
      throw new Error(`Unsupported hook event: ${eventName}`);
    }

    await persistHookEvent(root, event);
  } catch (error) {
    persistHookError(root, error, { eventName, cwd });
  }
}
