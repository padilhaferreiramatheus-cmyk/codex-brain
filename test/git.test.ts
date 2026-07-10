import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getBranch, getChangedFiles, isGitRepo } from "../src/core/git.js";

test("git layer has safe fallback outside a repo", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codex-brain-non-git-"));

  assert.equal(await isGitRepo(dir), false);
  assert.equal(await getBranch(dir), "not-a-git-repo");
  assert.deepEqual(await getChangedFiles(dir), []);
});
