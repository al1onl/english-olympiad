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
    
    console.log('Спроба входу адміна:', { login, password, codeWord });
    
    if (login === CONFIG.ADMIN_LOGIN && 
        password === CONFIG.ADMIN_PASSWORD && 
        codeWord === CONFIG.ADMIN_CODE_WORD) {
        console.log('Вхід успішний!');
        showAdminPanel();
    } else {
        alert('Невірні облікові дані адміністратора');
        console.log('Помилка входу');
    }
}

// Показати адмін панель
function showAdminPanel() {
    console.log('showAdminPanel викликано');
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    initializeAdminPanel();
}

// Ініціалізація адмін панелі
function initializeAdminPanel() {
    console.log('initializeAdminPanel викликано');
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
        
        <!-- Статистика -->
        <div id="stats" class="panel active">
            <h3>Статистика системи</h3>
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
                <div class="stat-card">
                    <div class="stat-number">${CONFIG.MAX_USERS - users.length}</div>
                    <div class="stat-label">Залишилось місць</div>
                </div>
            </div>
        </div>
        
        <!-- Створення користувача -->
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
                    <option value="9">9 клас</option>
                </select>
            </div>
            <div class="form-group">
                <label>Група (опціонально):</label>
                <input type="text" id="newStudentGroup" placeholder="Назва групи або класу">
            </div>
            <button onclick="createUser()">Створити користувача</button>
            
            <div id="creationResult" style="margin-top: 20px;"></div>
        </div>
        
        <!-- Список користувачів -->
        <div id="users" class="panel">
            <h3>Список користувачів (${users.length})</h3>
            <div class="user-list">
                <div class="user-item header">
                    <div>Ім'я / Логін</div>
                    <div>Клас</div>
                    <div>Група</div>
                    <div>Прогрес</div>
                    <div>Дії</div>
                </div>
                ${generateUsersList()}
            </div>
        </div>
    `;
}

// Функції для адмін панелі
function showAdminTab(tabName) {
    console.log('showAdminTab викликано:', tabName);
    // Приховуємо всі вкладки
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показуємо обрану вкладку
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function createUser() {
    const name = document.getElementById('newStudentName').value.trim();
    const studentClass = document.getElementById('newStudentClass').value;
    const group = document.getElementById('newStudentGroup').value.trim();
    
    if (!name) {
        alert('Будь ласка, введіть ім\'я учня');
        return;
    }
    
    if (users.length >= CONFIG.MAX_USERS) {
        alert('Досягнуто максимальну кількість користувачів');
        return;
    }
    
    // Генеруємо унікальний логін та пароль
    const login = generateLogin(name);
    const password = generatePassword();
    
    const newUser = {
        id: Date.now(),
        name: name,
        login: login,
        password: password,
        class: studentClass,
        group: group,
        createdAt: new Date().toISOString(),
        progress: {}
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
            ${group ? `<p><strong>Група:</strong> ${group}</p>` : ''}
            <p><small>Запишіть ці дані! Вони знадобляться для входу.</small></p>
        </div>
    `;
    
    // Очищаємо форму
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentGroup').value = '';
}

function generateLogin(name) {
    const baseLogin = name.toLowerCase().replace(/\s+/g, '');
    let login = baseLogin;
    let counter = 1;
    
    // Перевіряємо унікальність логіна
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
    if (users.length === 0) {
        return '<div style="text-align: center; padding: 20px; color: #666;">Користувачі відсутні</div>';
    }
    
    return users.map(user => `
        <div class="user-item">
            <div>
                <strong>${user.name}</strong><br>
                <small style="color: #666;">Логін: <strong>${user.login}</strong></small><br>
                <small style="color: #888;">Пароль: ${user.password}</small>
            </div>
            <div>${user.class} клас</div>
            <div>${user.group || '-'}</div>
            <div>${getUserProgress(user.id)}</div>
            <div>
                <button onclick="deleteUser(${user.id})" class="danger-btn">Видалити</button>
            </div>
        </div>
    `).join('');
}

function getUserProgress(userId) {
    const progress = userProgress[userId];
    if (!progress) return 'Не розпочато';
    
    if (progress.finished) return 'Завершено';
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
        initializeAdminPanel(); // Оновлюємо інтерфейс
    }
}

// Показати олімпіаду
function showOlympiad() {
    document.getElementById('studentLogin').style.display = 'none';
    document.getElementById('olympiadApp').style.display = 'block';
    
    // Проста олімпіада для демонстрації
    document.getElementById('olympiadApp').innerHTML = `
        <div class="header">
            <h1>🏆 Олімпіада з англійської мови</h1>
            <p>Тестування системи</p>
        </div>
        <div class="login-form">
            <h2>Олімпіада успішно запущена!</h2>
            <p>Система готова до роботи. Тут буде повноцінна олімпіада.</p>
            <button onclick="showModeSelector()">Повернутися на головну</button>
        </div>
    `;
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

// Додаємо обробники Enter для форм
document.addEventListener('DOMContentLoaded', function() {
    // Для форми учня
    document.getElementById('studentLoginInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginStudent();
    });
    document.getElementById('studentPasswordInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginStudent();
    });
    
    // Для форми адміна
    document.getElementById('adminLoginInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('adminPasswordInput').focus();
    });
    document.getElementById('adminPasswordInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('adminCodeWord').focus();
    });
    document.getElementById('adminCodeWord')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginAdmin();
    });
});

// Робимо всі функції глобальними
window.showModeSelector = showModeSelector;
window.showLogin = showLogin;
window.loginStudent = loginStudent;
window.loginAdmin = loginAdmin;
window.showAdminPanel = showAdminPanel;
window.showAdminTab = showAdminTab;
window.createUser = createUser;
window.deleteUser = deleteUser;
window.showOlympiad = showOlympiad;
