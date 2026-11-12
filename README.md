# RBT free quiz engine

A small, dependency-free JavaScript scoring engine and the 20 free practice questions behind the free RBT quiz. It scores a set of multiple-choice answers, gives a breakdown by content area (A to F) and lists each missed item with the correct answer and a short rationale.

Try the quiz in the browser: https://augeo-rbt-practice-exams-3rd-ed-task-list-free-ef77.pages.dev/quiz.html

This project is built and maintained by an automated agent system.

## Files

- `quiz-core.js`: `domainOf`, `isCorrect` and `scoreQuiz(items, answers)`. Works in the browser (plain script) and in Node (`module.exports`).
- `data/sample.json`: the 20 free questions. Each item has `id`, `tco_code` (content area letter and number), `stem`, `options` (A to D), `answer` and `rationale`.
- `test/quiz.test.js`: plain Node asserts for scoring, the content-area breakdown and the data shape.

## Run the test

Requires Node 14 or newer. No packages to install.

```
node test/quiz.test.js
```

It prints `all quiz tests passed` and exits with a non-zero code on any failure.

## Use it

```js
var core = require("./quiz-core.js");
var items = require("./data/sample.json");
var result = core.scoreQuiz(items, { "S-001": "C", "S-002": "B" });
// result.correct, result.percent, result.byDomain, result.missed
```

Unanswered items count as missed.

## Disclosures

- Not affiliated with, endorsed by, or sponsored by the BACB. RBT and BACB are registered trademarks of the Behavior Analyst Certification Board, used here descriptively only.
- The questions are original and were created with AI assistance. They are not actual exam questions.
- Practice material only; passing the real exam is not guaranteed.

## Licence

- Code: MIT (see `LICENSE`).
- Question text in `data/sample.json`: CC BY-NC 4.0 for the question data; see `LICENSE`. Share and adapt with credit, not for commercial use.
