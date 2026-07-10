import assert from "node:assert/strict";
import test from "node:test";
import { analyzePromptForConflicts } from "../src/core/conflict-detector.js";

test("detects high severity dangerous prompt", () => {
  const result = analyzePromptForConflicts("refazer tudo do zero sem teste");

  assert.equal(result.severity, "high");
  assert.ok(result.matchedTerms.includes("refazer tudo do zero"));
  assert.ok(result.matchedTerms.includes("sem teste"));
});

test("returns none for ordinary prompt", () => {
  const result = analyzePromptForConflicts("adicione teste unitario pequeno para o scorer");

  assert.equal(result.severity, "none");
  assert.deepEqual(result.matchedTerms, []);
});
