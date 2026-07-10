import { commandExists } from "../utils/shell.js";
import { AgentProvider } from "./provider.js";

export const codexProvider: AgentProvider = {
  name: "codex",
  async detect(): Promise<boolean> {
    return commandExists("codex", process.cwd());
  },
};
