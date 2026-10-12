import { QUESTIONS } from "./questions.js";
import { answerText, createSession } from "./quiz.js";

export function mount(doc) {
  const $ = (id) => doc.getElementById(id);
  const ALL = QUESTIONS.map((_, i) => i);
  let session;

  function start(indices, retry) {
    session = createSession(QUESTIONS, indices, retry);
    $("result").classList.add("hidden");
    $("quiz").classList.remove("hidden");
    render();
  }

  function render() {
    const item = session.current();
    const pos = session.position();
    $("bar").style.width = (pos / session.total * 100) + "%";
    $("count").textContent = `${pos + 1} / ${session.total}`;
    $("mode").textContent = session.retry ? "오답 다시 풀기" : "";
    $("type").textContent = item.type === "ox" ? "OX" : "객관식";
    $("question").innerHTML = item.q;
    $("explain").className = "explain hidden";
    $("next").classList.add("hidden");

    const box = $("options");
    box.innerHTML = "";
    box.className = "options" + (item.type === "ox" ? " ox" : "");

    const choices = item.type === "ox"
      ? [{ label: "O", value: true }, { label: "X", value: false }]
      : item.options.map((label, i) => ({ label, value: i }));

    choices.forEach((c) => {
      const btn = doc.createElement("button");
      btn.className = "opt";
      btn.innerHTML = c.label;
      btn.dataset.value = String(c.value);
      btn.onclick = () => choose(c.value);
      box.appendChild(btn);
    });
  }

  function choose(value) {
    const item = session.current();
    const ok = session.answer(value);
    if (ok === undefined) return;

    doc.querySelectorAll(".opt").forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.value === String(item.answer)) btn.classList.add("correct");
      else if (btn.dataset.value === String(value)) btn.classList.add("wrong");
    });

    const ex = $("explain");
    ex.className = "explain " + (ok ? "ok" : "no");
    ex.innerHTML = `<strong>${ok ? "정답이에요!" : "아쉬워요, 오답이에요."}</strong>${item.explain}`;

    const next = $("next");
    next.textContent = session.isLast() ? "결과 보기" : "다음 문제";
    next.classList.remove("hidden");
    next.focus();
  }

  function showResult() {
    $("quiz").classList.add("hidden");
    $("result").classList.remove("hidden");

    const { correct, total, wrong } = session.result();
    $("score").textContent = `${correct} / ${total}`;
    $("score-text").textContent = wrong.length === 0
      ? (session.retry ? "오답을 모두 잡았어요!" : "만점이에요! 🎉")
      : `${wrong.length}문제를 틀렸어요. 아래에서 정답을 확인해 보세요.`;

    $("wrong-list").innerHTML = wrong.map((i) => {
      const item = QUESTIONS[i];
      return `<li>${item.q}<br>정답: <span class="ans">${answerText(item)}</span></li>`;
    }).join("");

    $("retry").classList.toggle("hidden", wrong.length === 0);
  }

  $("next").onclick = () => {
    if (session.next()) render();
    else showResult();
  };
  $("retry").onclick = () => start(session.result().wrong, true);
  $("restart").onclick = () => start(ALL, false);

  start(ALL, false);
}
