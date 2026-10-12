import { describe, it, expect } from "vitest";
import { isCorrect, answerText, createSession } from "./quiz.js";

const MC = { type: "mc", q: "객관식", options: ["가", "나", "다", "라"], answer: 2, explain: "" };
const OX = { type: "ox", q: "OX", answer: false, explain: "" };
const QS = [MC, OX, MC];

describe("isCorrect", () => {
  it("객관식은 정답 인덱스와 같을 때만 정답이다", () => {
    expect(isCorrect(MC, 2)).toBe(true);
    expect(isCorrect(MC, 0)).toBe(false);
  });

  it("OX는 boolean으로 판정한다", () => {
    expect(isCorrect(OX, false)).toBe(true);
    expect(isCorrect(OX, true)).toBe(false);
  });
});

describe("answerText", () => {
  it("객관식은 정답 보기 문구를, OX는 O 또는 X를 돌려준다", () => {
    expect(answerText(MC)).toBe("다");
    expect(answerText(OX)).toBe("X");
  });
});

describe("createSession", () => {
  it("문제를 순서대로 진행하고 마지막 문제를 알려준다", () => {
    const s = createSession(QS, [0, 1, 2]);
    expect(s.total).toBe(3);
    expect(s.current()).toBe(MC);
    expect(s.isLast()).toBe(false);

    s.answer(2);
    expect(s.next()).toBe(true);
    expect(s.position()).toBe(1);
    expect(s.current()).toBe(OX);

    s.answer(false);
    s.next();
    expect(s.isLast()).toBe(true);
    s.answer(2);
    expect(s.next()).toBe(false);
  });

  it("틀린 문제의 원래 인덱스를 결과에 모은다", () => {
    const s = createSession(QS, [0, 1, 2]);
    expect(s.answer(0)).toBe(false);
    s.next();
    expect(s.answer(false)).toBe(true);
    s.next();
    expect(s.answer(1)).toBe(false);

    expect(s.result()).toEqual({ correct: 1, total: 3, wrong: [0, 2] });
  });

  it("같은 문제에 두 번 답해도 한 번만 기록한다", () => {
    const s = createSession(QS, [0]);
    s.answer(0);
    expect(s.answer(1)).toBeUndefined();
    expect(s.result().wrong).toEqual([0]);
  });

  it("오답 다시 풀기 세션은 넘겨받은 문제만 진행한다", () => {
    const s = createSession(QS, [2], true);
    expect(s.retry).toBe(true);
    expect(s.total).toBe(1);
    expect(s.current()).toBe(MC);
  });
});
