// Показати олімпіаду
function showOlympiad() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'block';
    
    // Повноцінна олімпіада
    document.getElementById('olympiadApp').innerHTML = `
        <div class="olympiad-container">
            <header>
                <div class="brand">
                    <h1>Олімпіада з Англійської мови — 10 клас (Hard)</h1>
                    <div class="subtitle">Фінальна версія</div>
                </div>
                <div style="color:#fff;font-size:13px">
                    <button onclick="showModeSelector()" style="background: #666; padding: 5px 10px; border: none; border-radius: 5px; color: white; cursor: pointer;">Вийти</button>
                </div>
            </header>

            <div class="card">
                <div id="tasks">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                        <div style="font-weight:700">Олімпіадні завдання — працюйте уважно</div>
                        <div class="top-right">
                            <div class="prev-pill" id="prevBtn">← Повернутись</div>
                            <div class="timer" id="timer">20:00</div>
                        </div>
                    </div>

                    <!-- Task 1 -->
                    <section id="task1" class="screen">
                        <div class="task-head">
                            <div><strong>Завдання 1</strong> — Advanced Use of English</div>
                            <div class="hint">Вставте правильні слова у пропуски.</div>
                        </div>
                        <div class="task-box">
                            <p style="line-height:1.6">
                            Contemporary urban studies increasingly emphasize the need for 
                            <select id="t1s1">
                                <option value="">—</option>
                                <option value="synthesis">synthesis</option>
                                <option value="fragmentation">fragmentation</option>
                                <option value="isolation">isolation</option>
                            </select> 
                            of cross-disciplinary methods. Historically, approaches that privileged narrow disciplinary perspectives resulted in policies that were 
                            <select id="t1s2">
                                <option value="">—</option>
                                <option value="resilient">resilient</option>
                                <option value="short-sighted">short-sighted</option>
                                <option value="comprehensive">comprehensive</option>
                            </select> 
                            and lacked long-term viability.
                            </p>
                        </div>
                        <div class="controls">
                            <div></div>
                            <div><button class="btn btn-primary" onclick="goToOlympiad(2)">Далі →</button></div>
                        </div>
                    </section>

                    <!-- Task 2 -->
                    <section id="task2" class="screen">
                        <div class="task-head">
                            <div><strong>Завдання 2</strong> — Reading</div>
                            <div class="hint">Прочитайте текст та дайте відповіді.</div>
                        </div>
                        <div class="task-box">
                            <p style="font-size:14px;line-height:1.7">Over the last half-century, urbanization has proceeded at an unprecedented rate, compelling scholars to reassess traditional paradigms of growth and governance. Initially, urban theory emphasized industrial expansion and spatial planning as the dominant variables; however, contemporary perspectives integrate social capital, environmental integrity and digital infrastructure into cohesive frameworks.</p>
                            <ol style="margin-top:12px">
                                <li>Define path-dependent outcomes: <input id="r2q1" placeholder="your answer" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>Which is NOT listed? 
                                    <select id="r2q2">
                                        <option value="">—</option>
                                        <option value="A">social capital</option>
                                        <option value="B">digital infrastructure</option>
                                        <option value="C">agrarian reform</option>
                                    </select>
                                </li>
                            </ol>
                        </div>
                        <div class="controls">
                            <div><button class="btn btn-ghost" onclick="goToOlympiad(1)">← Назад</button></div>
                            <div><button class="btn btn-primary" onclick="goToOlympiad(3)">Далі →</button></div>
                        </div>
                    </section>

                    <!-- Task 3 -->
                    <section id="task3" class="screen">
                        <div class="task-head">
                            <div><strong>Завдання 3</strong> — Transformations</div>
                            <div class="hint">Перепишіть речення.</div>
                        </div>
                        <div class="task-box">
                            <ol>
                                <li>It was unnecessary to wake him. (NEED) — <input id="t3q1" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>She completed the task despite the difficulties. (MANAGED) — <input id="t3q2" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>They started the project two years ago. (BEEN) — <input id="t3q3" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                            </ol>
                        </div>
                        <div class="controls">
                            <div><button class="btn btn-ghost" onclick="goToOlympiad(2)">← Назад</button></div>
                            <div><button class="btn btn-danger" onclick="finishOlympiad()">Завершити</button></div>
                        </div>
                    </section>

                    <div id="resultPanel" class="result">
                        <h3>Результат</h3>
                        <div id="scoreText"></div>
                        <div id="timeSummary" style="margin-top:8px;color:#444"></div>
                        <button onclick="showModeSelector()" style="margin-top: 20px; padding: 10px 20px; background: #6aa84f; color: white; border: none; border-radius: 5px; cursor: pointer;">Повернутися на головну</button>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .olympiad-container {
                max-width: 100%;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                margin-bottom: 14px;
                background: #424242;
                padding: 15px;
                border-radius: 10px;
            }
            .brand h1 {
                font-size: 20px;
                margin: 0;
            }
            .subtitle {
                font-size: 13px;
                color: #ddd;
            }
            .card {
                background: linear-gradient(180deg, #ffffffee, #fbfbfb);
                border-radius: 12px;
                padding: 18px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            }
            #tasks {
                margin-top: 14px;
            }
            .screen {
                display: none;
                padding: 12px;
                border-radius: 10px;
            }
            .screen.active {
                display: block;
            }
            .task-head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .task-box {
                background: #999;
                padding: 18px;
                border-radius: 10px;
                box-shadow: 0 6px 18px rgba(0,0,0,0.08);
                color: #111;
            }
            .hint {
                font-size: 13px;
                color: #222;
                background: #eee;
                padding: 8px;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            .top-right {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .timer {
                background: #222;
                color: #fff;
                padding: 8px 12px;
                border-radius: 8px;
                font-weight: 700;
                min-width: 140px;
                text-align: center;
            }
            .prev-pill {
                background: #fff;
                padding: 6px 8px;
                border-radius: 8px;
                border: 1px solid #ddd;
                cursor: pointer;
            }
            .controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 12px;
            }
            .btn {
                padding: 10px 16px;
                border-radius: 10px;
                border: none;
                font-weight: 700;
                cursor: pointer;
            }
            .btn-primary {
                background: #6aa84f;
                color: white;
            }
            .btn-danger {
                background: #d9534f;
                color: white;
            }
            .btn-ghost {
                background: transparent;
                border: 1px solid rgba(0,0,0,0.06);
            }
            .result {
                display: none;
                background: #fff;
                padding: 16px;
                border-radius: 10px;
                margin-top: 12px;
                text-align: center;
            }
            select, input {
                padding: 8px;
                border-radius: 6px;
                border: 1px solid #ddd;
                margin: 2px 0;
            }
        </style>
    `;
    
    // Ініціалізуємо олімпіаду
    setTimeout(() => {
        initOlympiad();
    }, 100);
}

// Логіка олімпіади
let olympiadRemaining = {1: 1200, 2: 1200, 3: 1200};
let olympiadActiveTask = null;
let olympiadTimerInterval = null;

function initOlympiad() {
    // Оновлюємо кнопку "Повернутись"
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.onclick = function() { 
            if (olympiadActiveTask > 1) {
                goToOlympiad(olympiadActiveTask - 1);
            }
        };
    }
    
    // Починаємо з першого завдання
    goToOlympiad(1);
}

function goToOlympiad(n) {
    if (olympiadActiveTask === n) return;
    
    if (olympiadActiveTask) {
        pauseOlympiadTimer();
        const currentScreen = document.getElementById('task' + olympiadActiveTask);
        if (currentScreen) currentScreen.classList.remove('active');
    }
    
    const newScreen = document.getElementById('task' + n);
    if (newScreen) {
        newScreen.classList.add('active');
        olympiadActiveTask = n;
        
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.style.display = n > 1 ? 'inline-block' : 'none';
        }
        
        startOlympiadTimerFor(n);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function startOlympiadTimerFor(n) {
    pauseOlympiadTimer();
    
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    
    olympiadTimerInterval = setInterval(() => {
        if (olympiadRemaining[n] > 0) {
            olympiadRemaining[n]--;
            updateOlympiadTimerDisplay(olympiadRemaining[n]);
        } else {
            clearInterval(olympiadTimerInterval);
            if (n < 3) goToOlympiad(n + 1);
        }
    }, 1000);
    
    updateOlympiadTimerDisplay(olympiadRemaining[n]);
}

function pauseOlympiadTimer() {
    if (olympiadTimerInterval) {
        clearInterval(olympiadTimerInterval);
        olympiadTimerInterval = null;
    }
}

function updateOlympiadTimerDisplay(sec) {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

function finishOlympiad() {
    // Розрахунок балів
    let score = 0;
    
    // Перевірка завдання 1
    if (document.getElementById('t1s1')?.value === 'synthesis') score++;
    if (document.getElementById('t1s2')?.value === 'short-sighted') score++;
    
    // Перевірка завдання 2
    if (document.getElementById('r2q2')?.value === 'C') score++;
    
    // Перевірка завдання 3 (просто за наявність відповідей)
    for (let i = 1; i <= 3; i++) {
        const answer = document.getElementById('t3q' + i)?.value;
        if (answer && answer.trim().length > 3) score++;
    }
    
    // Показуємо результати
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    
    if (resultPanel && scoreText) {
        scoreText.innerHTML = `Ваш результат: <strong>${score} з 6 балів</strong>`;
        resultPanel.style.display = 'block';
        
        // Ховаємо завдання
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
    }
    
    pauseOlympiadTimer();
}

// Додаємо функції в глобальну область
window.goToOlympiad = goToOlympiad;
window.finishOlympiad = finishOlympiad;
