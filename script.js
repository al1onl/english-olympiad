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
    
    // Тимчасово: завжди успішний вхід для демонстрації
    const user = {
        id: Date.now(),
        name: 'Учень',
        login: login,
        class: '10'
    };
    
    appState.currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
    startOlympiad();
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
                        <div class="olympiad-subtitle">Тестова версія</div>
                    </div>
                    <div>
                        <button id="olympiadExitBtn" style="background: #e74c3c; padding: 8px 16px; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: 600;">Вийти</button>
                    </div>
                </div>

                <div class="olympiad-card">
                    <div style="text-align: center; padding: 40px;">
                        <h2>Олімпіада розпочнеться найближчим часом</h2>
                        <p style="margin: 20px 0; color: #666;">Функціонал олімпіади знаходиться в розробці</p>
                        <button onclick="showMainMenu()" style="padding: 12px 24px; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer;">Повернутися на головну</button>
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

// Адмін панель
function showAdminPanel() {
    hideAllScreens();
    const adminPanel = document.getElementById('adminPanel');
    
    if (adminPanel) {
        adminPanel.style.display = 'block';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h2>Адмін панель</h2>
                <button id="adminPanelExitBtn" class="btn-secondary">Вийти</button>
            </div>
            <div style="text-align: center; padding: 40px;">
                <h3>Панель адміністратора</h3>
                <p style="margin: 20px 0; color: #666;">Функціонал адмін панелі знаходиться в розробці</p>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${appState.users.length}</div>
                        <div class="stat-label">Зареєстрованих користувачів</div>
                    </div>
                </div>
            </div>
        `;
        
        // Додаємо обробник для кнопки виходу
        const exitBtn = document.getElementById('adminPanelExitBtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', showMainMenu);
        }
    }
}

// Глобальні функції для HTML
window.showMainMenu = showMainMenu;
