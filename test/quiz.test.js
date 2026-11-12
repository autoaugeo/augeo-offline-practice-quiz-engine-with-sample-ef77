"use strict";
var assert = require("assert");
var core = require("../quiz-core.js");
var items = require("../data/sample.json");

// Data shape
assert.strictEqual(items.length, 20, "20 items");
var ids = {};
items.forEach(function (it) {
  assert.ok(/^S-\d{3}$/.test(it.id), "id format " + it.id);
  assert.ok(!ids[it.id], "unique id " + it.id);
  ids[it.id] = true;
  assert.ok(/^[A-F]\.\d+$/.test(it.tco_code), "tco_code " + it.id);
  assert.deepStrictEqual(Object.keys(it.options), ["A", "B", "C", "D"], "options " + it.id);
  assert.ok(it.options[it.answer], "answer is an option " + it.id);
  assert.ok(it.stem.length > 10 && it.rationale.length > 10, "text " + it.id);
  var texts = Object.keys(it.options).map(function (k) { return it.options[k]; });
  assert.strictEqual(new Set(texts).size, 4, "distinct options " + it.id);
});

// domainOf / isCorrect
assert.strictEqual(core.domainOf({ tco_code: "C.11" }), "C");
assert.strictEqual(core.isCorrect(items[0], "C"), true);
assert.strictEqual(core.isCorrect(items[0], "A"), false);

// Perfect score
var all = {};
items.forEach(function (it) { all[it.id] = it.answer; });
var perfect = core.scoreQuiz(items, all);
assert.strictEqual(perfect.total, 20);
assert.strictEqual(perfect.correct, 20);
assert.strictEqual(perfect.percent, 100);
assert.strictEqual(perfect.missed.length, 0);

// Nothing answered: every item is missed
var none = core.scoreQuiz(items, {});
assert.strictEqual(none.correct, 0);
assert.strictEqual(none.percent, 0);
assert.strictEqual(none.missed.length, 20);
assert.strictEqual(none.missed[0].chosen, null);
assert.strictEqual(none.missed[0].chosenText, null);

// Content-area breakdown: totals add up to 20 and cover A-F
var totalSum = 0;
"ABCDEF".split("").forEach(function (d) {
  assert.ok(perfect.byDomain[d], "domain " + d);
  assert.strictEqual(perfect.byDomain[d].correct, perfect.byDomain[d].total);
  totalSum += perfect.byDomain[d].total;
});
assert.strictEqual(totalSum, 20);
assert.strictEqual(perfect.byDomain.A.total, 3);
assert.strictEqual(perfect.byDomain.C.total, 5);

// Partial score: miss the first item (domain A) and answer one wrong
var partial = {};
items.forEach(function (it) { partial[it.id] = it.answer; });
partial["S-001"] = "A";
delete partial["S-020"];
var r = core.scoreQuiz(items, partial);
assert.strictEqual(r.correct, 18);
assert.strictEqual(r.percent, 90);
assert.strictEqual(r.byDomain.A.correct, 2);
assert.strictEqual(r.byDomain.F.correct, 3);
assert.strictEqual(r.missed.length, 2);
assert.strictEqual(r.missed[0].id, "S-001");
assert.strictEqual(r.missed[0].chosen, "A");
assert.strictEqual(r.missed[0].chosenText, "Duration of the whole run");
assert.strictEqual(r.missed[0].correctText, "Latency to start running");
assert.strictEqual(r.missed[1].id, "S-020");

// Empty list
var empty = core.scoreQuiz([], {});
assert.strictEqual(empty.total, 0);
assert.strictEqual(empty.percent, 0);

console.log("all quiz tests passed");
