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

// Змінні для олімпіади
let olympiadRemaining = {1: 1200, 2: 1200, 3: 1200};
let olympiadActiveTask = null;
let olympiadTimerInterval = null;

// Функції для роботи з інтерфейсом
function showModeSelector() {
    document.getElementById('modeSelector').style.display = 'grid';
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'none';
}

function showLogin(mode) {
    document.getElementById('modeSelector').style.display = 'none';
    if (mode === 'student') {
        document.getElementById('studentLogin').style.display = 'block';
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('studentLoginInput').value = '';
        document.getElementById('studentPasswordInput').value = '';
    } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('studentLogin').style.display = 'none';
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

// Показати адмін панель
function showAdminPanel() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    document.getElementById('adminPanel').innerHTML = `
        <div class="admin-header">
            <h2>Адмін панель</h2>
            <button class="btn-secondary" onclick="showModeSelector()">Вийти</button>
        </div>
        <div class="tabs">
            <button class="tab active" onclick="showAdminTab('users')">Користувачі</button>
            <button class="tab" onclick="showAdminTab('stats')">Статистика</button>
        </div>
        <div id="adminUsers" class="panel active">
            <h3>Управління користувачами</h3>
            <div class="form-group">
                <input type="text" id="newUserName" placeholder="Ім'я учня">
                <select id="newUserClass">
                    <option value="9">9 клас</option>
                    <option value="10">10 клас</option>
                    <option value="11">11 клас</option>
                </select>
                <button onclick="createUser()">Створити користувача</button>
            </div>
            <div id="usersList"></div>
        </div>
        <div id="adminStats" class="panel">
            <h3>Статистика</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${users.length}</div>
                    <div class="stat-label">Користувачів</div>
                </div>
            </div>
        </div>
    `;
    
    updateUsersList();
}

function showAdminTab(tabName) {
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');
    event.target.classList.add('active');
}

function createUser() {
    const name = document.getElementById('newUserName').value.trim();
    const studentClass = document.getElementById('newUserClass').value;
    
    if (!name) {
        alert('Введіть ім\'я учня');
        return;
    }
    
    const login = generateLogin(name);
    const password = generatePassword();
    
    const newUser = {
        id: Date.now(),
        name: name,
        class: studentClass,
        login: login,
        password: password,
        created: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    localStorage.setItem('olympiad_users', JSON.stringify(users));
    
    document.getElementById('newUserName').value = '';
    updateUsersList();
    
    alert(`Користувача створено!\nЛогін: ${login}\nПароль: ${password}`);
}

function generateLogin(name) {
    const base = name.toLowerCase().replace(/\s+/g, '');
    let login = base;
    let counter = 1;
    
    while (users.find(u => u.login === login)) {
        login = base + counter;
        counter++;
    }
    
    return login;
}

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

function updateUsersList() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    usersList.innerHTML = `
        <div class="user-list">
            <div class="user-item header">
                <div>Ім'я</div>
                <div>Клас</div>
                <div>Логін</div>
                <div>Пароль</div>
                <div>Дії</div>
            </div>
            ${users.map(user => `
                <div class="user-item">
                    <div>${user.name}</div>
                    <div>${user.class} клас</div>
                    <div>${user.login}</div>
                    <div>${user.password}</div>
                    <div>
                        <button class="danger-btn" onclick="deleteUser(${user.id})">Видалити</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function deleteUser(userId) {
    if (confirm('Видалити цього користувача?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('olympiad_users', JSON.stringify(users));
        updateUsersList();
    }
}

// Показати олімпіаду
function showOlympiad() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'block';
    
    // Спрощена версія олімпіади для прикладу
    document.getElementById('olympiadApp').innerHTML = `
        <div class="olympiad-container">
            <div class="olympiad-header">
                <div class="olympiad-brand">
                    <h1>Олімпіада з Англійської мови</h1>
                    <div class="olympiad-subtitle">Тестова версія</div>
                </div>
                <div>
                    <button onclick="showModeSelector()" style="background: #e74c3c; padding: 8px 16px; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: 600;">Вийти</button>
                </div>
            </div>

            <div class="olympiad-card">
                <div class="olympiad-tasks">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
                        <div style="font-weight:700; color: var(--primary);">Олімпіадні завдання</div>
                        <div class="top-right">
                            <div class="prev-pill" id="prevBtn" style="display:none">← Назад</div>
                            <div class="timer" id="timer">20:00</div>
                        </div>
                    </div>

                    <section id="task1" class="olympiad-screen active">
                        <div class="task-head">
                            <div><strong>Завдання 1</strong> — Тестове завдання</div>
                            <div class="hint">Виберіть правильну відповідь</div>
                        </div>
                        <div class="task-box">
                            <p class="question">She ___ to school every day.</p>
                            <select class="olympiad-select" id="answer1">
                                <option value="">—</option>
                                <option value="go">go</option>
                                <option value="goes">goes</option>
                                <option value="going">going</option>
                            </select>
                        </div>
                        <div class="controls">
                            <div></div>
                            <div><button class="olympiad-btn btn-primary" onclick="goToOlympiad(2)">Далі →</button></div>
                        </div>
                    </section>

                    <section id="task2" class="olympiad-screen">
                        <div class="task-head">
                            <div><strong>Завдання 2</strong> — Друге завдання</div>
                            <div class="hint">Напишіть відповідь</div>
                        </div>
                        <div class="task-box">
                            <p class="question">Як буде "яблуко" англійською?</p>
                            <input class="olympiad-input" id="answer2" placeholder="Ваша відповідь">
                        </div>
                        <div class="controls">
                            <div><button class="olympiad-btn btn-ghost" onclick="goToOlympiad(1)">← Назад</button></div>
                            <div><button class="olympiad-btn btn-primary" onclick="finishOlympiad()">Завершити</button></div>
                        </div>
                    </section>

                    <div id="resultPanel" class="result">
                        <h3>Результат</h3>
                        <div id="scoreText"></div>
                        <button onclick="showModeSelector()" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); color: white; border: none; border-radius: 5px; cursor: pointer;">Повернутися на головну</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    initOlympiad();
}

// Логіка олімпіади
function initOlympiad() {
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.onclick = function() { 
            if (olympiadActiveTask > 1) {
                goToOlympiad(olympiadActiveTask - 1);
            }
        };
    }
    
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
            if (n < 2) goToOlympiad(n + 1);
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
    let score = 0;
    
    if (document.getElementById('answer1')?.value === 'goes') score++;
    if (document.getElementById('answer2')?.value?.toLowerCase() === 'apple') score++;
    
    const resultPanel = document.getElementById('resultPanel');
    const scoreText = document.getElementById('scoreText');
    
    if (resultPanel && scoreText) {
        scoreText.innerHTML = `Ваш результат: <strong>${score} з 2 балів</strong>`;
        resultPanel.style.display = 'block';
        
        document.querySelectorAll('.olympiad-screen').forEach(screen => {
            screen.style.display = 'none';
        });
    }
    
    pauseOlympiadTimer();
}

// Додаємо функції в глобальну область
window.showModeSelector = showModeSelector;
window.showLogin = showLogin;
window.loginStudent = loginStudent;
window.loginAdmin = loginAdmin;
window.showAdminPanel = showAdminPanel;
window.showAdminTab = showAdminTab;
window.createUser = createUser;
window.deleteUser = deleteUser;
window.showOlympiad = showOlympiad;
window.goToOlympiad = goToOlympiad;
window.finishOlympiad = finishOlympiad;
