import { describe, it, expect } from "vitest";
import { QUESTIONS } from "./questions.js";

describe("QUESTIONS", () => {
  it("객관식 10문제와 OX 5문제, 총 15문제로 구성된다", () => {
    expect(QUESTIONS).toHaveLength(15);
    expect(QUESTIONS.filter((q) => q.type === "mc")).toHaveLength(10);
    expect(QUESTIONS.filter((q) => q.type === "ox")).toHaveLength(5);
  });

  it("객관식은 보기 4개와 범위 안의 정답 인덱스를 가진다", () => {
    for (const q of QUESTIONS.filter((item) => item.type === "mc")) {
      expect(q.options).toHaveLength(4);
      expect(Number.isInteger(q.answer)).toBe(true);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
  });

  it("OX는 boolean 정답을 가진다", () => {
    for (const q of QUESTIONS.filter((item) => item.type === "ox")) {
      expect(typeof q.answer).toBe("boolean");
    }
  });

  it("모든 문제에 문제 문장과 해설이 있다", () => {
    for (const q of QUESTIONS) {
      expect(q.q.trim()).not.toBe("");
      expect(q.explain.trim()).not.toBe("");
    }
  });
});
