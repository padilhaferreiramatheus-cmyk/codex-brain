import assert from "node:assert/strict";
import test from "node:test";
import { mergeHooksJson } from "../src/commands/install-hooks.js";

test("mergeHooksJson preserves third-party hooks while adding Codex Brain hooks", () => {
  const existing = {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: "graphify hook-check",
            },
          ],
        },
      ],
    },
  };

  const codexBrain = {
    hooks: {
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: 'node "C:\\project\\.codex\\hooks\\codex-brain-stop.js"',
              statusMessage: "Codex Brain: registrando fechamento",
            },
          ],
        },
      ],
    },
  };

  const merged = mergeHooksJson(existing, codexBrain);

  assert.equal(merged.hooks?.PreToolUse?.[0]?.hooks?.[0]?.command, "graphify hook-check");
  assert.equal(
    merged.hooks?.Stop?.[0]?.hooks?.[0]?.command,
    'node "C:\\project\\.codex\\hooks\\codex-brain-stop.js"',
  );
});

test("mergeHooksJson replaces previous Codex Brain handlers without duplicating them", () => {
  const previous = {
    hooks: {
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: 'node "old\\.codex\\hooks\\codex-brain-stop.js"',
              statusMessage: "Codex Brain: registrando fechamento",
            },
          ],
        },
      ],
    },
  };

  const current = {
    hooks: {
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: 'node "new\\.codex\\hooks\\codex-brain-stop.js"',
              statusMessage: "Codex Brain: registrando fechamento",
            },
          ],
        },
      ],
    },
  };

  const merged = mergeHooksJson(previous, current);

  assert.equal(merged.hooks?.Stop?.length, 1);
  assert.equal(
    merged.hooks?.Stop?.[0]?.hooks?.[0]?.command,
    'node "new\\.codex\\hooks\\codex-brain-stop.js"',
  );
});
