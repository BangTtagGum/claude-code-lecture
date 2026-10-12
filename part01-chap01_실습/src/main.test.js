// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import html from "../quiz.html?raw";
import { mount } from "./main.js";
import { QUESTIONS } from "./questions.js";

// 실제 quiz.html의 <body> 마크업을 그대로 쓴다 (innerHTML이라 <script>는 실행되지 않음)
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];

const $ = (id) => document.getElementById(id);
const isHidden = (id) => $(id).classList.contains("hidden");

function wrongValue(item) {
  return item.type === "ox" ? !item.answer : (item.answer + 1) % 4;
}

function click(value) {
  [...document.querySelectorAll(".opt")]
    .find((btn) => btn.dataset.value === String(value))
    .click();
}

// indices 순서대로 풀면서 wrongSet에 든 문제만 틀린다
function solve(indices, wrongSet = new Set()) {
  for (const i of indices) {
    const item = QUESTIONS[i];
    click(wrongSet.has(i) ? wrongValue(item) : item.answer);
    $("next").click();
  }
}

const ALL = QUESTIONS.map((_, i) => i);

beforeEach(() => {
  document.body.innerHTML = body;
  mount(document);
});

describe("quiz 화면", () => {
  it("첫 문제를 객관식 4지선다로 보여준다", () => {
    expect($("count").textContent).toBe("1 / 15");
    expect($("type").textContent).toBe("객관식");
    expect(document.querySelectorAll(".opt")).toHaveLength(4);
    expect(isHidden("next")).toBe(true);
  });

  it("오답을 고르면 보기를 잠그고 정답·오답 색과 해설을 보여준다", () => {
    const item = QUESTIONS[0];
    click(wrongValue(item));

    const opts = [...document.querySelectorAll(".opt")];
    expect(opts.every((btn) => btn.disabled)).toBe(true);
    expect(opts[item.answer].classList.contains("correct")).toBe(true);
    expect(opts[wrongValue(item)].classList.contains("wrong")).toBe(true);
    expect($("explain").classList.contains("no")).toBe(true);
    expect($("explain").textContent).toContain("오답");
    expect($("next").textContent).toBe("다음 문제");
  });

  it("OX 문제는 O와 X 버튼 두 개를 보여준다", () => {
    solve([0, 1]);
    expect($("type").textContent).toBe("OX");
    expect([...document.querySelectorAll(".opt")].map((b) => b.textContent)).toEqual(["O", "X"]);
  });

  it("마지막 문제에서는 버튼이 '결과 보기'로 바뀌고 점수와 오답 목록을 보여준다", () => {
    solve(ALL.slice(0, -1), new Set([0, 6]));
    click(QUESTIONS[14].answer);
    expect($("next").textContent).toBe("결과 보기");
    $("next").click();

    expect(isHidden("quiz")).toBe(true);
    expect(isHidden("result")).toBe(false);
    expect($("score").textContent).toBe("13 / 15");
    expect(document.querySelectorAll("#wrong-list li")).toHaveLength(2);
    expect(isHidden("retry")).toBe(false);
  });

  it("오답 다시 풀기는 틀린 문제만 내고, 다 맞히면 버튼을 숨긴다", () => {
    solve(ALL, new Set([0, 6]));
    $("retry").click();

    expect($("count").textContent).toBe("1 / 2");
    expect($("mode").textContent).toBe("오답 다시 풀기");

    solve([0, 6]);
    expect($("score").textContent).toBe("2 / 2");
    expect($("score-text").textContent).toBe("오답을 모두 잡았어요!");
    expect(isHidden("retry")).toBe(true);
  });

  it("처음부터 다시를 누르면 15문제로 돌아간다", () => {
    solve(ALL, new Set([3]));
    $("restart").click();
    expect(isHidden("quiz")).toBe(false);
    expect($("count").textContent).toBe("1 / 15");
    expect($("mode").textContent).toBe("");
  });
});
