// Конфігурація системи
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    MAX_USERS: 1000
};

// Сховище даних
let users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
let userProgress = JSON.parse(localStorage.getItem('olympiad_progress')) || {};

// Глобальні змінні для олімпіади
let remaining = {1: 1200, 2: 1200, 3: 1200};
let activeTask = null;
let timerInterval = null;
let prevTarget = 1;

// Функції для роботи з інтерфейсом
function showModeSelector() {
    document.querySelector('.mode-selector').style.display = 'grid';
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'none';
}

function showLogin(mode) {
    document.querySelector('.mode-selector').style.display = 'none';
    if (mode === 'student') {
        document.getElementById('studentLogin').style.display = 'block';
        document.getElementById('studentLoginInput').value = '';
        document.getElementById('studentPasswordInput').value = '';
    } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminLoginInput').value = '';
        document.getElementById('adminPasswordInput').value = '';
        document.getElementById('adminCodeWord').value = '';
    }
}

// Вхід для учня
function loginStudent() {
    const login = document.getElementById('studentLoginInput').value.trim();
    const password = document.getElementById('studentPasswordInput').value.trim();
    
    if (!login || !password) {
        alert('Будь ласка, заповніть всі поля');
        return;
    }
    
    const user = users.find(u => u.login === login && u.password === password);
    
    if (user) {
        localStorage.setItem('current_user', JSON.stringify(user));
        showOlympiad();
    } else {
        alert('Невірний логін або пароль');
    }
}

// Вхід для адміна
function loginAdmin() {
    const login = document.getElementById('adminLoginInput').value.trim();
    const password = document.getElementById('adminPasswordInput').value.trim();
    const codeWord = document.getElementById('adminCodeWord').value.trim();
    
    if (login === CONFIG.ADMIN_LOGIN && 
        password === CONFIG.ADMIN_PASSWORD && 
        codeWord === CONFIG.ADMIN_CODE_WORD) {
        showAdminPanel();
    } else {
        alert('Невірні облікові дані адміністратора');
    }
}

// Показати олімпіаду
function showOlympiad() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'block';
    
    initializeOlympiad();
}

// Ініціалізація олімпіади
function initializeOlympiad() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const progress = userProgress[currentUser.id];
    
    // Вставляємо HTML олімпіади
    document.getElementById('olympiadApp').innerHTML = getOlympiadHTML();
    
    // Ініціалізуємо олімпіаду
    setTimeout(() => {
        initOlympiadLogic(currentUser, progress);
    }, 100);
}

// HTML олімпіади
function getOlympiadHTML() {
    return `
    <div class="olympiad-container">
        <header>
            <div class="brand">
                <h1>Олімпіада з Англійської мови — 10 клас</h1>
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
                        <div><button class="btn btn-primary" onclick="goTo(2)">Далі →</button></div>
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
                        <div><button class="btn btn-ghost" onclick="goTo(1)">← Назад</button></div>
                        <div><button class="btn btn-primary" onclick="goTo(3)">Далі →</button></div>
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
                        </ol>
                    </div>
                    <div class="controls">
                        <div><button class="btn btn-ghost" onclick="goTo(2)">← Назад</button></div>
                        <div><button class="btn btn-danger" onclick="finishTest()">Завершити</button></div>
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
}

// Логіка олімпіади
function initOlympiadLogic(currentUser, progress) {
    // Оновлюємо кнопку "Повернутись"
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.onclick = function() { goTo(prevTarget); };
    }
    
    // Відновлюємо прогрес якщо є
    if (progress && progress.answers) {
        loadProgress(progress.answers);
    }
    
    // Відновлюємо поточне завдання або починаємо з першого
    if (progress && progress.currentTask && !progress.finished) {
        goTo(progress.currentTask);
    } else {
        goTo(1);
    }
}

function goTo(n) {
    if (activeTask === n) return;
    
    if (activeTask) {
        pauseTimer();
        const currentScreen = document.getElementById('task' + activeTask);
        if (currentScreen) currentScreen.classList.remove('active');
    }
    
    const newScreen = document.getElementById('task' + n);
    if (newScreen) {
        newScreen.classList.add('active');
        activeTask = n;
        prevTarget = n-1 >= 1 ? n-1 : 1;
        
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.style.display = n > 1 ? 'inline-block' : 'none';
        }
        
        startTimerFor(n);
        window.scrollTo({top: 0, behavior: 'smooth'});
        
        // Зберігаємо прогрес
        saveCurrentProgress();
    }
}

function startTimerFor(n) {
    pauseTimer();
    
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    
    timerInterval = setInterval(() => {
        if (remaining[n] > 0) {
            remaining[n]--;
            updateTimerDisplay(remaining[n]);
        } else {
            clearInterval(timerInterval);
            if (n < 3) goTo(n + 1);
        }
    }, 1000);
    
    updateTimerDisplay(remaining[n]);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay(sec) {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;
    
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

function saveCurrentProgress() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) return;
    
    const answers = getCurrentAnswers();
    
    userProgress[currentUser.id] = {
        currentTask: activeTask,
        answers: answers,
        finished: false
    };
    
    saveProgress();
}

function getCurrentAnswers() {
    const answers = {};
    
    // Збираємо відповіді з усіх завдань
    for (let i = 1; i <= 3; i++) {
        // Task 1
        if (i === 1) {
            for (let j = 1; j <= 2; j++) {
                const el = document.getElementById(`t1s${j}`);
                if (el) answers[`t1s${j}`] = el.value;
            }
        }
        // Task 2  
        else if (i === 2) {
            for (let j = 1; j <= 2; j++) {
                const el = document.getElementById(`r2q${j}`);
                if (el) answers[`r2q${j}`] = el.value;
            }
        }
        // Task 3
        else if (i === 3) {
            for (let j = 1; j <= 2; j++) {
                const el = document.getElementById(`t3q${j}`);
                if (el) answers[`t3q${j}`] = el.value;
            }
        }
    }
    
    return answers;
}

function loadProgress(answers) {
    for (const [key, value] of Object.entries(answers)) {
        const el = document.getElementById(key);
        if (el) el.value = value;
    }
}

function finishTest() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const answers = getCurrentAnswers();
    
    // Розрахунок балів
    let score = 0;
    if (answers.t1s1 === 'synthesis') score++;
    if (answers.t1s2 === 'short-sighted') score++;
    if (answers.r2q2 === 'C') score++;
    if (answers.t3q1 && answers.t3q1.length > 5) score++;
    if (answers.t3q2 && answers.t3q2.length > 5) score++;
    
    // Зберігаємо завершений тест
    userProgress[currentUser.id] = {
        currentTask: null,
        answers: answers,
        finished: true,
        score: score,
        finishedAt: new Date().toISOString()
    };
    
    saveProgress();
    
    // Показуємо результати
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    const timeSummary = document.getElementById('timeSummary');
    
    if (resultPanel && scoreText) {
        scoreText.innerHTML = `Ваш результат: <strong>${score} з 5 балів</strong>`;
        timeSummary.textContent = 'Тест завершено!';
        resultPanel.style.display = 'block';
        
        // Ховаємо завдання
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
    }
    
    pauseTimer();
}

// АДМІН ПАНЕЛЬ (залишається без змін)
function showAdminPanel() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    initializeAdminPanel();
}

function initializeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.innerHTML = `
        <div class="admin-header">
            <h2>Панель адміністратора</h2>
            <button onclick="showModeSelector()" class="btn-secondary">Вийти</button>
        </div>
        
        <div class="tabs">
            <button class="tab active" onclick="showAdminTab('stats')">Статистика</button>
            <button class="tab" onclick="showAdminTab('create')">Створити користувача</button>
            <button class="tab" onclick="showAdminTab('users')">Користувачі</button>
        </div>
        
        <div id="stats" class="panel active">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${users.length}</div>
                    <div class="stat-label">Всього користувачів</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${getActiveUsersCount()}</div>
                    <div class="stat-label">Активні користувачі</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${getCompletedTestsCount()}</div>
                    <div class="stat-label">Завершені тести</div>
                </div>
            </div>
        </div>
        
        <div id="create" class="panel">
            <h3>Створити нового користувача</h3>
            <div class="form-group">
                <label>Ім'я учня:</label>
                <input type="text" id="newStudentName" placeholder="Введіть ім'я учня">
            </div>
            <div class="form-group">
                <label>Клас:</label>
                <select id="newStudentClass">
                    <option value="10">10 клас</option>
                    <option value="11">11 клас</option>
                </select>
            </div>
            <button onclick="createUser()">Створити користувача</button>
            <div id="creationResult" style="margin-top: 20px;"></div>
        </div>
        
        <div id="users" class="panel">
            <h3>Список користувачів (${users.length})</h3>
            <div class="user-list">
                <div class="user-item header">
                    <div>Ім'я / Логін</div>
                    <div>Клас</div>
                    <div>Прогрес</div>
                    <div>Дії</div>
                </div>
                ${generateUsersList()}
            </div>
        </div>
    `;
}

function showAdminTab(tabName) {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function createUser() {
    const name = document.getElementById('newStudentName').value.trim();
    const studentClass = document.getElementById('newStudentClass').value;
    
    if (!name) {
        alert('Будь ласка, введіть ім\'я учня');
        return;
    }
    
    const login = generateLogin(name);
    const password = generatePassword();
    
    const newUser = {
        id: Date.now(),
        name: name,
        login: login,
        password: password,
        class: studentClass,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    document.getElementById('creationResult').innerHTML = `
        <div class="user-credentials">
            <h4>✅ Користувача створено!</h4>
            <p><strong>Ім'я:</strong> ${name}</p>
            <p><strong>Логін:</strong> ${login}</p>
            <p><strong>Пароль:</strong> ${password}</p>
            <p><strong>Клас:</strong> ${studentClass}</p>
        </div>
    `;
    
    document.getElementById('newStudentName').value = '';
}

function generateLogin(name) {
    let baseLogin = name.toLowerCase().replace(/\s+/g, '').substring(0, 10);
    if (baseLogin.length < 3) baseLogin += 'user';
    
    let login = baseLogin;
    let counter = 1;
    
    while (users.find(u => u.login === login)) {
        login = `${baseLogin}${counter}`;
        counter++;
    }
    
    return login;
}

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateUsersList() {
    if (users.length === 0) return '<div style="text-align: center; padding: 20px; color: #666;">Користувачі відсутні</div>';
    
    return users.map(user => `
        <div class="user-item">
            <div><strong>${user.name}</strong><br><small>Логін: ${user.login}</small><br><small>Пароль: ${user.password}</small></div>
            <div>${user.class} клас</div>
            <div>${getUserProgress(user.id)}</div>
            <div><button onclick="deleteUser(${user.id})" class="danger-btn">Видалити</button></div>
        </div>
    `).join('');
}

function getUserProgress(userId) {
    const progress = userProgress[userId];
    if (!progress) return 'Не розпочато';
    if (progress.finished) return `Завершено (${progress.score} балів)`;
    if (progress.currentTask) return `Завдання ${progress.currentTask}`;
    return 'В процесі';
}

function getActiveUsersCount() {
    return Object.keys(userProgress).length;
}

function getCompletedTestsCount() {
    return Object.values(userProgress).filter(p => p.finished).length;
}

function deleteUser(userId) {
    if (confirm('Видалити цього користувача?')) {
        users = users.filter(u => u.id !== userId);
        delete userProgress[userId];
        saveUsers();
        saveProgress();
        initializeAdminPanel();
    }
}

function saveUsers() {
    localStorage.setItem('olympiad_users', JSON.stringify(users));
}

function saveProgress() {
    localStorage.setItem('olympiad_progress', JSON.stringify(userProgress));
}

// Запуск при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    showModeSelector();
});
