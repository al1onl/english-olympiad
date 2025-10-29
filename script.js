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
                    <div class="subtitle">Фінальна версія — режим перегляду відповідей доступний після завершення.</div>
                </div>
                <div style="color:#fff;font-size:13px">
                    <button onclick="showModeSelector()" style="background: #666; padding: 5px 10px; border: none; border-radius: 5px; color: white; cursor: pointer;">Вийти</button>
                </div>
            </header>

            <div class="card">
                <!-- Security Warning -->
                <div class="security-warning">
                    🔒 <strong>Безпека тесту:</strong> Обмежена кількість учасників. Заборонено виходити з повноекранного режиму.
                </div>

                <!-- Tasks -->
                <div id="tasks">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                        <div style="font-weight:700">Олімпіадні завдання — працюйте уважно</div>
                        <div class="top-right">
                            <div class="prev-pill" id="prevBtn">← Повернутись</div>
                            <div class="timer" id="timer">20:00</div>
                        </div>
                    </div>

                    <!-- Task 1: big (12 gaps) -->
                    <section id="task1" class="screen">
                        <div class="task-head"><div><strong>Завдання 1</strong> — Advanced Use of English (Gapped Text — 12 gaps)</div><div class="hint">Вставте правильні слова у пропуски. Кожен пропуск — випадаючий список. Це великий текст: оцініть кожен варіант уважно.</div></div>
                        <div class="task-box">
                            <p class="question">Read the extended academic extract and choose the correct option for each numbered gap (12 gaps). Each gap may require subtle lexical choice.</p>

                            <p style="line-height:1.6">
                            Contemporary urban studies increasingly emphasize the need for <select id="t1s1"><option value="">—</option><option value="synthesis">synthesis</option><option value="fragmentation">fragmentation</option><option value="isolation">isolation</option></select> of cross-disciplinary methods. Historically, approaches that privileged narrow disciplinary perspectives resulted in policies that were <select id="t1s2"><option value="">—</option><option value="resilient">resilient</option><option value="short-sighted">short-sighted</option><option value="comprehensive">comprehensive</option></select> and lacked long-term viability. The complexity arises not only from the multiplicity of variables but also from the uneven availability of reliable data, which in many contexts is <select id="t1s3"><option value="">—</option><option value="abundant">abundant</option><option value="sporadic">sporadic</option><option value="redundant">redundant</option></select>. Consequently, models must be designed with an awareness of their inherent <select id="t1s4"><option value="">—</option><option value="limitations">limitations</option><option value="perfections">perfections</option><option value="magnitudes">magnitudes</option></select>, and stakeholders should participate to ensure that outputs are not <select id="t1s5"><option value="">—</option><option value="detached">detached</option><option value="aligned">aligned</option><option value="abstracted">abstracted</option></select> from lived experience.
                            </p>

                            <p style="line-height:1.6;margin-top:10px">
                            Several authors have argued that the standard metrics for resilience are often <select id="t1s6"><option value="">—</option><option value="overly">overly</option><option value="rigorously">rigorously</option><option value="carefully">carefully</option></select> simplified, thereby obscuring context-specific vulnerabilities. To mitigate this, it is advisable to incorporate qualitative assessments that capture <select id="t1s7"><option value="">—</option><option value="nuance">nuance</option><option value="uniformity">uniformity</option><option value="redundancy">redundancy</option></select> and local perceptions. Moreover, when presenting findings to policymakers, researchers need to <select id="t1s8"><option value="">—</option><option value="obfuscate">obfuscate</option><option value="clarify">clarify</option><option value="complicate">complicate</option></select> the implications and offer practicable recommendations rather than abstract generalities.
                            </p>

                            <p style="line-height:1.6;margin-top:10px">
                            A further complication is the tendency to conflate correlation with causation, especially in datasets where temporal sequences are <select id="t1s9"><option value="">—</option><option value="ambiguous">ambiguous</option><option value="obvious">obvious</option><option value="immutable">immutable</option></select>. Robust inference thus demands careful longitudinal analysis and sensitivity testing to avoid <select id="t1s10"><option value="">—</option><option value="spurious">spurious</option><option value="conclusive">conclusive</option><option value="definitive">definitive</option></select> conclusions. Finally, the ethical dimension requires that any interventions respect community autonomy and do not exacerbate pre-existing <select id="t1s11"><option value="">—</option><option value="inequalities">inequalities</option><option value="advantages">advantages</option><option value="privileges">privileges</option></select>. In summary, the framing of urban resilience must remain both critically reflexive and <select id="t1s12"><option value="">—</option><option value="adaptive">adaptive</option><option value="static">static</option><option value="naive">naive</option></select>.
                            </p>

                        </div>

                        <div class="controls">
                            <div></div>
                            <div><button class="btn btn-primary" onclick="goToOlympiad(2)">Перейти до наступного завдання</button></div>
                        </div>
                    </section>

                    <!-- Task 2: long reading + 12 questions -->
                    <section id="task2" class="screen">
                        <div class="task-head"><div><strong>Завдання 2</strong> — Long Reading & Analysis (12 items)</div><div class="hint">Прочитайте текст уважно. Після тексту — 12 завдань: поєднання multiple choice і коротких відповідей.</div></div>
                        <div class="task-box">
                            <p class="question">Passage (extended):</p>
                            <p style="font-size:14px;line-height:1.7">Over the last half-century, urbanization has proceeded at an unprecedented rate, compelling scholars to reassess traditional paradigms of growth and governance. Initially, urban theory emphasized industrial expansion and spatial planning as the dominant variables; however, contemporary perspectives integrate social capital, environmental integrity and digital infrastructure into cohesive frameworks. Notably, the spatial distribution of services and economic opportunity often mirrors historical inequalities, producing path-dependent outcomes. Policymakers must therefore navigate the tension between top-down planning and grassroots mobilization, leveraging participatory mechanisms without sacrificing strategic coherence. Moreover, the climatic imperative adds a new layer of complexity: mitigation policies must be equitable, financially viable and technically feasible. As cities adapt, adaptive governance — characterized by iterative policymaking, transparent data practices and inclusive stakeholder engagement — becomes central. Yet, the translation of evidence into policy frequently founders on institutional inertia, budgetary constraints and competing political priorities. Ultimately, resilient urban futures require a synthesis of robust data, normative commitments to justice, and pragmatic implementation pathways.</p>

                            <ol style="margin-top:12px">
                                <li>(short) Define in one sentence what is meant by <em>path-dependent outcomes</em> in the passage. <input id="r2q1" placeholder="one sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) Which of the following is NOT listed as part of contemporary frameworks? <select id="r2q2"><option value="">—</option><option value="A">social capital</option><option value="B">digital infrastructure</option><option value="C">agrarian reform</option></select></li>
                                <li>(short) Give two barriers mentioned that impede translation of evidence into policy. <input id="r2q3" placeholder="two items" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) Adaptive governance includes: <select id="r2q4"><option value="">—</option><option value="A">iterative policymaking</option><option value="B">opaque data practices</option><option value="C">exclusionary stakeholder engagement</option></select></li>
                                <li>(short) What does the passage suggest about climate mitigation policies? <input id="r2q5" placeholder="short answer" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) The passage implies that policymaking must balance: <select id="r2q6"><option value="">—</option><option value="A">top-down planning and grassroots mobilization</option><option value="B">only top-down directives</option><option value="C">only grassroots mobilization</option></select></li>
                                <li>(short) Provide one example of a normative commitment mentioned. <input id="r2q7" placeholder="one word/phrase" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) What becomes central for resilient urban futures? <select id="r2q8"><option value="">—</option><option value="A">adaptive governance</option><option value="B">institutional inertia</option><option value="C">budgetary constraints</option></select></li>
                                <li>(short) Explain briefly why inclusive stakeholder engagement is important according to the text. <input id="r2q9" placeholder="short answer" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) Which is listed as characteristic of adaptive governance? <select id="r2q10"><option value="">—</option><option value="A">transparent data practices</option><option value="B">political opacity</option><option value="C">reliance on randomness</option></select></li>
                                <li>(short) Summarize in one phrase what is required for resilient urban futures. <input id="r2q11" placeholder="one phrase" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>(MC) Which of these is presented as a challenge to implementing policies? <select id="r2q12"><option value="">—</option><option value="A">budgetary constraints</option><option value="B">robust data</option><option value="C">normative commitments</option></select></li>
                            </ol>

                        </div>

                        <div class="controls">
                            <div><button class="btn btn-ghost" onclick="goToOlympiad(1)">Повернутись</button></div>
                            <div><button class="btn btn-primary" onclick="goToOlympiad(3)">Перейти до наступного завдання</button></div>
                        </div>
                    </section>

                    <!-- Task 3: 10 transformation tasks -->
                    <section id="task3" class="screen">
                        <div class="task-head"><div><strong>Завдання 3</strong> — Transformations (10 items)</div><div class="hint">Перепишіть речення, використовуючи слово в дужках — зберегти значення.</div></div>
                        <div class="task-box">
                            <ol>
                                <li>It was unnecessary to wake him. (NEED) — <input id="t3q1" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>She completed the task despite the difficulties. (MANAGED) — <input id="t3q2" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>They started the project two years ago. (BEEN) — <input id="t3q3" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>He didn't need to bring any tools. (WAS) — <input id="t3q4" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>It's illegal to drive without a license. (PERMITTED) — <input id="t3q5" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>They regret not applying earlier. (WISH) — <input id="t3q6" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>I prefer tea to coffee. (RATHER) — <input id="t3q7" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>She hasn't seen him for months. (LAST) — <input id="t3q8" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>It's impossible to finish on time without help. (ABLE) — <input id="t3q9" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                                <li>The teacher insisted on early submission. (DEMAND) — <input id="t3q10" placeholder="Your sentence" style="width:100%;padding:6px;border-radius:6px;border:1px solid #ddd"></li>
                            </ol>
                        </div>

                        <div class="controls">
                            <div><button class="btn btn-ghost" onclick="goToOlympiad(2)">Повернутись</button></div>
                            <div><button class="btn btn-danger" onclick="finishOlympiad()">Завершити</button></div>
                        </div>
                    </section>

                    <div id="resultPanel" class="result">
                        <h3>Результат та підсумки часу</h3>
                        <div id="scoreText"></div>
                        <div id="timeSummary" style="margin-top:8px;color:#444"></div>
                        <div style="margin-top:10px"><button id="viewAnswersBtn" class="btn btn-ghost" style="font-weight:700;">Переглянути відповіді</button></div>
                        <p style="margin-top:8px;font-size:13px;color:#666">Надішліть ваші результати організатору за контактами з вступної сторінки.</p>
                        <div style="margin-top:6px;font-size:14px"><strong>Контакти і номер учня:</strong><div id="contactBlock" style="margin-top:6px"></div></div>
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
            .security-warning {
                background: #ffeb3b;
                color: #333;
                padding: 8px 12px;
                border-radius: 6px;
                margin: 10px 0;
                text-align: center;
                font-size: 12px;
                border-left: 4px solid #ff9800;
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
            .question {
                font-size: 16px;
                margin: 0 0 8px 0;
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
        prevBtn.onclick = function() { goToOlympiad(olympiadActiveTask - 1); };
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
    if (document.getElementById('t1s3')?.value === 'sporadic') score++;
    if (document.getElementById('t1s4')?.value === 'limitations') score++;
    if (document.getElementById('t1s5')?.value === 'detached') score++;
    if (document.getElementById('t1s6')?.value === 'overly') score++;
    if (document.getElementById('t1s7')?.value === 'nuance') score++;
    if (document.getElementById('t1s8')?.value === 'clarify') score++;
    if (document.getElementById('t1s9')?.value === 'ambiguous') score++;
    if (document.getElementById('t1s10')?.value === 'spurious') score++;
    if (document.getElementById('t1s11')?.value === 'inequalities') score++;
    if (document.getElementById('t1s12')?.value === 'adaptive') score++;
    
    // Перевірка завдання 2
    if (document.getElementById('r2q2')?.value === 'C') score++;
    if (document.getElementById('r2q4')?.value === 'A') score++;
    if (document.getElementById('r2q6')?.value === 'A') score++;
    if (document.getElementById('r2q8')?.value === 'A') score++;
    if (document.getElementById('r2q10')?.value === 'A') score++;
    if (document.getElementById('r2q12')?.value === 'A') score++;
    
    // Перевірка завдання 3 (просто за наявність відповідей)
    for (let i = 1; i <= 10; i++) {
        const answer = document.getElementById('t3q' + i)?.value;
        if (answer && answer.trim().length > 3) score++;
    }
    
    // Показуємо результати
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    
    if (resultPanel && scoreText) {
        const maxScore = 12 + 6 + 10; // 12+6+10 = 28 максимальний бал
        scoreText.innerHTML = `Ваш результат: <strong>${score} з ${maxScore} балів</strong>`;
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
