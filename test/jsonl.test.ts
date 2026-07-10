import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { appendJsonl, readJsonl } from "../src/utils/jsonl.js";

test("appends and reads jsonl", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codex-brain-jsonl-"));
  const file = path.join(dir, "events.jsonl");

  appendJsonl(file, { event: "A" });
  appendJsonl(file, { event: "B" });

  assert.deepEqual(readJsonl(file), [{ event: "A" }, { event: "B" }]);
});
