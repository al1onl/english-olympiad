// Конфігурація системи
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    MAX_USERS: 1000
};

// Стан програми
let appState = {
    users: JSON.parse(localStorage.getItem('olympiad_users')) || [],
    currentUser: null,
    olympiadActiveTask: null,
    olympiadTimerInterval: null
};

// Ініціалізація додатку
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ініціалізація додатку олімпіади...');
    initializeApplication();
});

function initializeApplication() {
    // Приховуємо всі екрани крім головного меню
    hideAllScreens();
    document.getElementById('modeSelector').style.display = 'grid';
    
    // Додаємо обробники подій
    setupEventListeners();
    
    console.log('Додаток успішно ініціалізовано');
    console.log('Завантажено користувачів:', appState.users.length);
}

function hideAllScreens() {
    const screens = [
        'modeSelector',
        'studentLogin', 
        'adminLogin',
        'adminPanel',
        'olympiadApp'
    ];
    
    screens.forEach(screenId => {
        const element = document.getElementById(screenId);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function setupEventListeners() {
    // Картки вибору режиму
    const studentCard = document.querySelector('[data-mode="student"]');
    const adminCard = document.querySelector('[data-mode="admin"]');
    
    if (studentCard) {
        studentCard.addEventListener('click', function() {
            showLoginForm('student');
        });
    }
    
    if (adminCard) {
        adminCard.addEventListener('click', function() {
            showLoginForm('admin');
        });
    }
    
    // Кнопки форми учня
    const studentLoginBtn = document.getElementById('studentLoginBtn');
    const backFromStudentBtn = document.getElementById('backFromStudentBtn');
    
    if (studentLoginBtn) {
        studentLoginBtn.addEventListener('click', handleStudentLogin);
    }
    
    if (backFromStudentBtn) {
        backFromStudentBtn.addEventListener('click', showMainMenu);
    }
    
    // Кнопки форми адміна
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const backFromAdminBtn = document.getElementById('backFromAdminBtn');
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', handleAdminLogin);
    }
    
    if (backFromAdminBtn) {
        backFromAdminBtn.addEventListener('click', showMainMenu);
    }
}

// Навігація між екранами
function showMainMenu() {
    hideAllScreens();
    document.getElementById('modeSelector').style.display = 'grid';
}

function showLoginForm(mode) {
    hideAllScreens();
    
    if (mode === 'student') {
        document.getElementById('studentLogin').style.display = 'block';
    } else if (mode === 'admin') {
        document.getElementById('adminLogin').style.display = 'block';
    }
}

// Обробка входу
function handleStudentLogin() {
    const login = document.getElementById('studentLoginInput').value.trim();
    const password = document.getElementById('studentPasswordInput').value.trim();
    
    if (!login || !password) {
        alert('Будь ласка, заповніть всі поля');
        return;
    }
    
    // Пошук користувача в базі
    const user = appState.users.find(u => u.login === login && u.password === password);
    
    if (user) {
        appState.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        startOlympiad();
    } else {
        alert('Невірний логін або пароль. Зверніться до адміністратора для отримання облікових даних.');
    }
}

function handleAdminLogin() {
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

// АДМІН ПАНЕЛЬ - ПОВНИЙ ФУНКЦІОНАЛ
function showAdminPanel() {
    hideAllScreens();
    const adminPanel = document.getElementById('adminPanel');
    
    if (adminPanel) {
        adminPanel.style.display = 'block';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h2>Адмін панель - Управління користувачами</h2>
                <button id="adminPanelExitBtn" class="btn-secondary">Вийти</button>
            </div>
            
            <div class="tabs">
                <button class="tab active" id="usersTab">Користувачі</button>
                <button class="tab" id="createUserTab">Створити користувача</button>
                <button class="tab" id="statsTab">Статистика</button>
            </div>
            
            <!-- Панель створення користувача -->
            <div id="createUserPanel" class="panel">
                <h3>Створити нового користувача</h3>
                <div class="form-group">
                    <label>Ім'я учня:</label>
                    <input type="text" id="newUserName" placeholder="Введіть ім'я учня">
                </div>
                <div class="form-group">
                    <label>Клас:</label>
                    <select id="newUserClass">
                        <option value="9">9 клас</option>
                        <option value="10" selected>10 клас</option>
                        <option value="11">11 клас</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Група (опціонально):</label>
                    <input type="text" id="newUserGroup" placeholder="Назва групи або класу">
                </div>
                <button id="createUserBtn" class="btn-primary">Створити користувача</button>
                
                <div id="createdCredentials" style="display: none; margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
                    <h4>✅ Користувача створено!</h4>
                    <div id="credentialsInfo"></div>
                </div>
            </div>
            
            <!-- Панель списку користувачів -->
            <div id="usersPanel" class="panel active">
                <h3>Список користувачів</h3>
                <div class="user-list" id="usersListContainer">
                    <!-- Список буде динамічно заповнений -->
                </div>
            </div>
            
            <!-- Панель статистики -->
            <div id="statsPanel" class="panel">
                <h3>Статистика системи</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${appState.users.length}</div>
                        <div class="stat-label">Всього користувачів</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${countUsersByClass(9)}</div>
                        <div class="stat-label">9 клас</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${countUsersByClass(10)}</div>
                        <div class="stat-label">10 клас</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${countUsersByClass(11)}</div>
                        <div class="stat-label">11 клас</div>
                    </div>
                </div>
            </div>
        `;
        
        // Ініціалізація адмін панелі
        setupAdminPanel();
        
        // Додаємо обробник для кнопки виходу
        const exitBtn = document.getElementById('adminPanelExitBtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', showMainMenu);
        }
    }
}

function setupAdminPanel() {
    // Завантажуємо список користувачів
    updateUsersList();
    
    // Обробники вкладок
    document.getElementById('usersTab').addEventListener('click', () => switchAdminTab('users'));
    document.getElementById('createUserTab').addEventListener('click', () => switchAdminTab('createUser'));
    document.getElementById('statsTab').addEventListener('click', () => switchAdminTab('stats'));
    
    // Обробник створення користувача
    document.getElementById('createUserBtn').addEventListener('click', createNewUser);
}

function switchAdminTab(tabName) {
    // Деактивуємо всі вкладки
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    
    // Активуємо обрану вкладку
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.getElementById(tabName + 'Panel').classList.add('active');
    
    // Оновлюємо дані при переключенні
    if (tabName === 'users') {
        updateUsersList();
    } else if (tabName === 'stats') {
        // Оновлюємо статистику
        document.querySelectorAll('.stat-number')[0].textContent = appState.users.length;
        document.querySelectorAll('.stat-number')[1].textContent = countUsersByClass(9);
        document.querySelectorAll('.stat-number')[2].textContent = countUsersByClass(10);
        document.querySelectorAll('.stat-number')[3].textContent = countUsersByClass(11);
    }
}

function countUsersByClass(className) {
    return appState.users.filter(user => user.class == className).length;
}

function createNewUser() {
    const name = document.getElementById('newUserName').value.trim();
    const studentClass = document.getElementById('newUserClass').value;
    const group = document.getElementById('newUserGroup').value.trim();
    
    if (!name) {
        alert('Будь ласка, введіть ім\'я учня');
        return;
    }
    
    // Генеруємо унікальний логін
    const login = generateUniqueLogin(name);
    const password = generatePassword();
    
    const newUser = {
        id: Date.now(),
        name: name,
        class: studentClass,
        group: group || '',
        login: login,
        password: password,
        created: new Date().toLocaleString('uk-UA'),
        progress: {}
    };
    
    // Додаємо користувача
    appState.users.push(newUser);
    saveUsersToStorage();
    
    // Показуємо облікові дані
    showCreatedCredentials(newUser);
    
    // Очищаємо форму
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserGroup').value = '';
    
    console.log('Створено нового користувача:', newUser);
}

function generateUniqueLogin(name) {
    const baseLogin = name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9а-яіїєґ]/g, '')
        .substring(0, 8);
    
    let login = baseLogin;
    let counter = 1;
    
    // Перевіряємо унікальність логіна
    while (appState.users.find(user => user.login === login)) {
        login = baseLogin + counter;
        counter++;
        
        if (counter > 100) {
            login = baseLogin + Date.now().toString().slice(-3);
            break;
        }
    }
    
    return login;
}

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function showCreatedCredentials(user) {
    const credentialsDiv = document.getElementById('createdCredentials');
    const credentialsInfo = document.getElementById('credentialsInfo');
    
    credentialsInfo.innerHTML = `
        <p><strong>Ім'я:</strong> ${user.name}</p>
        <p><strong>Клас:</strong> ${user.class}</p>
        <p><strong>Логін:</strong> ${user.login}</p>
        <p><strong>Пароль:</strong> ${user.password}</p>
        <p><strong>Дата створення:</strong> ${user.created}</p>
    `;
    
    credentialsDiv.style.display = 'block';
    
    // Автоматично ховаємо через 10 секунд
    setTimeout(() => {
        credentialsDiv.style.display = 'none';
    }, 10000);
}

function updateUsersList() {
    const container = document.getElementById('usersListContainer');
    if (!container) return;
    
    if (appState.users.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>Користувачів ще не створено</p>
                <p>Перейдіть у вкладку "Створити користувача"</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="user-item header">
            <div>Ім'я</div>
            <div>Клас</div>
            <div>Логін</div>
            <div>Пароль</div>
            <div>Дата створення</div>
            <div>Дії</div>
        </div>
        ${appState.users.map(user => `
            <div class="user-item">
                <div>${user.name}</div>
                <div>${user.class} клас</div>
                <div>${user.login}</div>
                <div>${user.password}</div>
                <div>${user.created}</div>
                <div>
                    <button class="danger-btn" data-user-id="${user.id}">Видалити</button>
                </div>
            </div>
        `).join('')}
    `;
    
    // Додаємо обробники для кнопок видалення
    container.querySelectorAll('.danger-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-user-id'));
            deleteUser(userId);
        });
    });
}

function deleteUser(userId) {
    if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
        appState.users = appState.users.filter(user => user.id !== userId);
        saveUsersToStorage();
        updateUsersList();
        alert('Користувача видалено');
    }
}

function saveUsersToStorage() {
    localStorage.setItem('olympiad_users', JSON.stringify(appState.users));
}

// Олімпіада
function startOlympiad() {
    hideAllScreens();
    const olympiadApp = document.getElementById('olympiadApp');
    
    if (olympiadApp) {
        olympiadApp.style.display = 'block';
        olympiadApp.innerHTML = `
            <div class="olympiad-container">
                <div class="olympiad-header">
                    <div class="olympiad-brand">
                        <h1>Олімпіада з Англійської мови</h1>
                        <div class="olympiad-subtitle">Учень: ${appState.currentUser.name} | Клас: ${appState.currentUser.class}</div>
                    </div>
                    <div>
                        <button id="olympiadExitBtn" style="background: #e74c3c; padding: 8px 16px; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: 600;">Вийти</button>
                    </div>
                </div>

                <div class="olympiad-card">
                    <div style="text-align: center; padding: 40px;">
                        <h2>Ласкаво просимо до олімпіади!</h2>
                        <p style="margin: 20px 0; color: #666;">Ви успішно увійшли в систему</p>
                        <p style="margin: 10px 0; color: #666;">Функціонал проходження олімпіади знаходиться в розробці</p>
                        <button onclick="showMainMenu()" style="padding: 12px 24px; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 20px;">Повернутися на головну</button>
                    </div>
                </div>
            </div>
        `;
        
        // Додаємо обробник для кнопки виходу
        const exitBtn = document.getElementById('olympiadExitBtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', showMainMenu);
        }
    }
}

// Глобальні функції для HTML
window.showMainMenu = showMainMenu;
