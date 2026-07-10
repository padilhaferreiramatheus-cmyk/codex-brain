import { spawnSync } from "node:child_process";

export type CommandResult = {
  ok: boolean;
  status: number | null;
  stdout: string;
  stderr: string;
  error?: string;
};

export function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs = 5000,
): CommandResult {
  try {
    const result = spawnSync(command, args, {
      cwd,
      encoding: "utf8",
      timeout: timeoutMs,
      windowsHide: true,
      shell: false,
    });

    return {
      ok: result.status === 0,
      status: result.status,
      stdout: (result.stdout ?? "").trim(),
      stderr: (result.stderr ?? "").trim(),
      error: result.error?.message,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      stdout: "",
      stderr: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function platformCommand(name: string): string {
  if (process.platform === "win32" && ["npm", "npx"].includes(name)) {
    return `${name}.cmd`;
  }

  return name;
}

export function commandExists(command: string, cwd: string): boolean {
  const actualCommand = platformCommand(command);
  const result = runCommand(actualCommand, ["--version"], cwd, 3000);
  if (result.ok) {
    return true;
  }

  if (process.platform === "win32") {
    const whereResult = runCommand("where.exe", [command], cwd, 3000);
    return whereResult.ok && whereResult.stdout.length > 0;
  }

  return false;
}
