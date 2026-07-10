import { baseEvent, addGitSnapshot } from "./common.js";

export async function buildSessionStartEvent(payload: unknown, root: string, cwd: string) {
  return addGitSnapshot(baseEvent("SessionStart", payload, cwd), root);
}
