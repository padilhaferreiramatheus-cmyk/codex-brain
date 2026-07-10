import { baseEvent, pickString, summarizePayload } from "./common.js";

export async function buildPostToolUseEvent(payload: unknown, _root: string, cwd: string) {
  const payloadSummary = summarizePayload(payload);

  return {
    ...baseEvent("PostToolUse", payload, cwd),
    tool_name: pickString(payload, ["tool_name", "toolName", "tool.name", "name"]),
    command: pickString(payload, ["command", "tool_input.command", "input.command", "args.command"]),
    success: pickString(payload, ["success", "status", "result.status"]) ?? undefined,
    payload_summary: payloadSummary.summary,
    payload_original_bytes: payloadSummary.originalBytes,
  };
}
