import assert from "node:assert/strict";
import test from "node:test";
import { scoreProgress } from "../src/core/progress-scorer.js";

test("scores useful progress signals", () => {
  const result = scoreProgress({
    promptCount: 2,
    toolUseCount: 3,
    changedFileCount: 4,
    hasReport: true,
    conflictCount: 0,
  });

  assert.equal(result.score, 84);
  assert.ok(result.reasons.includes("Git mostra arquivos alterados"));
});

test("penalizes conflicts without going below zero", () => {
  const result = scoreProgress({
    promptCount: 0,
    toolUseCount: 0,
    changedFileCount: 0,
    hasReport: false,
    conflictCount: 10,
  });

  assert.equal(result.score, 0);
});
