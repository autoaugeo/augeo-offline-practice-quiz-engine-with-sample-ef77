function domainOf(item) {
  return String(item.tco_code).charAt(0);
}

function isCorrect(item, choice) {
  return choice === item.answer;
}

// answers: {itemId: "A".."D"}; an unanswered item counts as missed.
function scoreQuiz(items, answers) {
  var byDomain = {};
  var missed = [];
  var correct = 0;
  items.forEach(function (item) {
    var d = domainOf(item);
    if (!byDomain[d]) byDomain[d] = { correct: 0, total: 0 };
    byDomain[d].total += 1;
    var chosen = answers[item.id] || null;
    if (chosen !== null && isCorrect(item, chosen)) {
      correct += 1;
      byDomain[d].correct += 1;
    } else {
      missed.push({
        id: item.id,
        domain: d,
        stem: item.stem,
        chosen: chosen,
        chosenText: chosen ? item.options[chosen] : null,
        answer: item.answer,
        correctText: item.options[item.answer],
        rationale: item.rationale,
      });
    }
  });
  var total = items.length;
  return {
    total: total,
    correct: correct,
    percent: total ? Math.round((correct / total) * 100) : 0,
    byDomain: byDomain,
    missed: missed,
  };
}

if (typeof module !== "undefined") module.exports = { domainOf: domainOf, isCorrect: isCorrect, scoreQuiz: scoreQuiz };
