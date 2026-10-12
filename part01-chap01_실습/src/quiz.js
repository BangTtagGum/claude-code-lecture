export function isCorrect(item, value) {
  return value === item.answer;
}

export function answerText(item) {
  return item.type === "ox" ? (item.answer ? "O" : "X") : item.options[item.answer];
}

// indices: 이번 회차에 풀 문제의 QUESTIONS 인덱스. retry: 오답 다시 풀기 회차인지
export function createSession(questions, indices, retry = false) {
  let pos = 0;
  let answered = false;
  const wrong = [];

  return {
    retry,
    total: indices.length,
    position: () => pos,
    current: () => questions[indices[pos]],
    isLast: () => pos + 1 >= indices.length,

    // 정답 여부를 돌려준다. 이미 답한 문제면 기록하지 않고 undefined
    answer(value) {
      if (answered) return undefined;
      answered = true;
      const ok = isCorrect(questions[indices[pos]], value);
      if (!ok) wrong.push(indices[pos]);
      return ok;
    },

    // 다음 문제로 넘어간다. 남은 문제가 없으면 false
    next() {
      pos += 1;
      answered = false;
      return pos < indices.length;
    },

    result: () => ({ correct: indices.length - wrong.length, total: indices.length, wrong: [...wrong] })
  };
}
