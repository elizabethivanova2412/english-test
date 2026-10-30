https://script.google.com/macros/s/AKfycby0OTj26GXKa3e8n5t2yPmtFnTdoFtRcceL_iNP9rK5nhzkntl1-hNUass8K9Er9zh5/exec
const SCRIPT_URL = 'ВАШ_URL_ЗДЕСЬ';

const QUIZ = [
  { q: '1. Если друг говорит вам "Let\'s just chill", что он предлагает сделать?', options: ['Расслабиться, отдохнуть', 'Пойти на пробежку', 'Выпить ледяной воды', 'Заняться уборкой'], correct: 0 },
  { q: '2. Что означает сленговое слово "Bail"?', options: ['Слить, отменить планы', 'Прыгнуть с парашютом', 'Взять деньги в долг', 'Громко смеяться'], correct: 0 },
  { q: '3. Что значит "My bad"?', options: ['Моя вина, прошу прощения', 'Я плохой человек', 'У меня плохое настроение', 'Мне плохо'], correct: 0 },
  { q: '4. Если кто-то "Freaked out", то он...', options: ['Испугался, запаниковал', 'Очень обрадовался', 'Сделал селфи', 'Заказал пиццу'], correct: 0 },
  { q: '5. Что означает фраза "Hit the road"?', options: ['Отправиться в путь, уехать', 'Ударить машину', 'Помыть дорогу', 'Сойти с ума'], correct: 0 },
  { q: '6. Если кто-то говорит "I\'m broke", это значит...', options: ['У меня нет денег', 'Я сломал ногу', 'Я разбил телефон', 'Я разорвал контракт'], correct: 0 },
  { q: '7. Что означает "To have a blast"?', options: ['Отлично провести время', 'Устроить взрыв', 'Громко включить музыку', 'Поругаться с кем-то'], correct: 0 },
  { q: '8. Какой русский аналог у английского слова "Hyped"?', options: ['В восторге, в предвкушении', 'В депрессии', 'Спящий на ходу', 'Голодный'], correct: 0 },
  { q: '9. Что означает "Piece of cake"?', options: ['Проще простого, пустяки', 'Вкусный десерт', 'Маленькая проблема', 'Кусочек чего-то большого'], correct: 0 },
  { q: '10. Если вас просят "Take it easy", что вам советуют?', options: ['Не напрягаться, успокоиться', 'Взять тяжелую сумку', 'Поторопиться', 'Быстро все сделать'], correct: 0 }
];

const form = document.getElementById('quizForm');
const questionsDiv = document.getElementById('questions');
const statusMsg = document.getElementById('statusMsg');
const submitBtn = document.getElementById('submitBtn');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

QUIZ.forEach((item, idx) => {
  const div = document.createElement('div');
  div.className = 'question';
  let html = `<p>${item.q}</p>`;
  let optionsWithStatus = item.options.map((opt, optIdx) => ({ text: opt, isCorrect: optIdx === item.correct }));
  optionsWithStatus = shuffleArray(optionsWithStatus);
  const correctIndex = optionsWithStatus.findIndex(o => o.isCorrect);
  optionsWithStatus.forEach((optObj, i) => {
    html += `<label><input type="radio" name="q${idx + 1}" value="${i}" required> ${optObj.text}</label>`;
  });
  div.innerHTML = html;
  div.dataset.correctIndex = correctIndex;
  questionsDiv.appendChild(div);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  statusMsg.textContent = 'Отправка данных...';
  statusMsg.className = 'status';
  const formData = new FormData(form);
  let score = 0;
  const payload = new URLSearchParams();
  payload.append('student_name', formData.get('student_name'));
  payload.append('student_group', formData.get('student_group'));
  document.querySelectorAll('.question').forEach((qDiv, idx) => {
    const answer = formData.get(`q${idx + 1}`);
    payload.append(`q${idx + 1}`, answer !== null ? answer : '');
    if (parseInt(answer) === parseInt(qDiv.dataset.correctIndex)) score++;
  });
  payload.append('score', score);
  payload.append('total', QUIZ.length);

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString()
    });
    statusMsg.textContent = `Тест завершен! Твой результат: ${score} из ${QUIZ.length}.`;
    statusMsg.className = 'status ok';
    form.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    statusMsg.textContent = 'Ошибка при отправке.';
    statusMsg.className = 'status err';
  } finally {
    submitBtn.disabled = false;
  }
});