let questions = [];
let current = 0;
let score = 0;

// 🔀 перемешивание
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.v);
}

// 📥 загрузка теста
function loadTest(fileName) {
  const old = document.getElementById("questions-script");
  if (old) old.remove();

  window.questionBank = null;

  const script = document.createElement("script");
  script.src = fileName;
  script.id = "questions-script";

  script.onload = () => {
    if (!Array.isArray(window.questionBank)) {
      alert("Вопросы не загрузились");
      return;
    }

    questions = shuffle(window.questionBank);
    current = 0;
    score = 0;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("test").classList.remove("hidden");

    loadQuestion();
  };

  script.onerror = () => alert(`Файл ${fileName} не найден`);
  document.body.appendChild(script);
}

function loadQuestion() {
  const q = questions[current];
  const answersEl = document.getElementById("answers");

  document.getElementById("progress").textContent =
    `Вопрос ${current + 1} / ${questions.length}`;
  document.getElementById("question").textContent = q.question;
  answersEl.innerHTML = "";

  const shuffledAnswers = shuffle(
    q.answers.map((text, index) => ({ text, index }))
  );

  shuffledAnswers.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.text;
    btn.onclick = () => selectAnswer(a.index);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (index === questions[current].correct) score++;
  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("progress").textContent = "";
  document.getElementById("question").textContent =
    `Result: ${score} / ${questions.length}`;
  document.getElementById("answers").innerHTML = "";
}

function backToMenu() {
  document.getElementById("test").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}
