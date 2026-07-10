import { addStopGitSnapshot, baseEvent, pickString } from "./common.js";

export async function buildStopEvent(payload: unknown, root: string, cwd: string) {
  const event = {
    ...baseEvent("Stop", payload, cwd),
    last_assistant_message:
      pickString(payload, [
        "last_assistant_message",
        "lastAssistantMessage",
        "assistant_message",
        "message",
        "output",
      ]) ?? "",
  };

  return addStopGitSnapshot(event, root);
}
