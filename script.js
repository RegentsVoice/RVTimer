// Таймер
const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const minutesInput = document.getElementById("minutesInput");
const setupPanel = document.getElementById("setupPanel");

let totalSeconds = 60;
let running = false;
let interval = null;

function format(s) {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${ss}`;
}

function render() {
    timer.textContent = format(totalSeconds);
}

function startTimer() {
    if (running) return;

    let mins = parseInt(minutesInput.value);
    if (isNaN(mins)) mins = 1;

    totalSeconds = Math.max(0, Math.min(720, mins)) * 60;

    if (totalSeconds <= 0) {
        timer.textContent = "COMING SOON";
        setupPanel.style.display = "none";
        return;
    }

    running = true;
    setupPanel.style.display = "none";
    render();

    interval = setInterval(() => {
        totalSeconds--;
        render();
        if (totalSeconds <= 0) {
            clearInterval(interval);
            timer.textContent = "COMING SOON";
            running = false;
        }
    }, 1000);
}

startBtn.addEventListener("click", startTimer);
render();

// Камера – текущее время
setInterval(() => {
    document.getElementById("camTime").textContent =
        new Date().toLocaleString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
}, 1000);

// Фоновые слова (используется глобальная переменная dictionary из words.js)
const bgContainer = document.getElementById("bgWords");
const placedWords = [];

function spawnWord() {
    const word = document.createElement("div");
    word.className = "bg-word";

    const text = dictionary[Math.floor(Math.random() * dictionary.length)];
    word.textContent = text;

    const size = Math.random() * 1.8 + 1.4;
    const w = text.length * size * 18 + 80;
    const h = size * 50 + 40;

    let x, y, safe = false, tries = 0;

    while (!safe && tries < 500) {
        x = Math.random() * (window.innerWidth - w);
        y = Math.random() * (window.innerHeight - h);
        safe = true;

        for (const p of placedWords) {
            const pad = 60;
            const overlap = !(
                x + w + pad < p.x ||
                x > p.x + p.w + pad ||
                y + h + pad < p.y ||
                y > p.y + p.h + pad
            );
            if (overlap) {
                safe = false;
                break;
            }
        }
        tries++;
    }

    if (!safe) {
        setTimeout(spawnWord, 1500);
        return;
    }

    placedWords.push({ x, y, w, h });

    const rotate = Math.random() * 20 - 10;
    const opacity = Math.random() * 0.03 + 0.03;
    const life = Math.random() * 15000 + 12000;

    word.style.left = x + "px";
    word.style.top = y + "px";
    word.style.fontSize = size + "rem";
    word.style.setProperty("--rotate", rotate + "deg");
    word.style.setProperty("--opacity", opacity);

    bgContainer.appendChild(word);

    setTimeout(() => {
        word.classList.add("visible");
    }, 80);

    setTimeout(() => {
        word.classList.remove("visible");
        setTimeout(() => {
            word.remove();
            const i = placedWords.findIndex(p => p.x === x && p.y === y);
            if (i !== -1) placedWords.splice(i, 1);
            spawnWord();
        }, 3800);
    }, life);
}

// Запуск фоновых слов
for (let i = 0; i < 18; i++) {
    spawnWord();
}