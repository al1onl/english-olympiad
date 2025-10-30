// Глобальна конфігурація
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024"
};

// Утиліти
class Utils {
    static showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    static generateLogin(name) {
        const base = name.toLowerCase().replace(/\s+/g, '').substring(0, 8);
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        let login = base;
        let counter = 1;
        
        while (users.find(user => user.login === login)) {
            login = base + counter;
            counter++;
        }
        return login;
    }

    static generatePassword() {
        return Math.random().toString(36).slice(-8);
    }

    static generateStudentNumber() {
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        const usedNumbers = users.map(u => u.studentNumber).filter(n => n);
        let number;
        
        do {
            number = Math.floor(Math.random() * 10000) + 1;
        } while (usedNumbers.includes(number));
        
        return number;
    }
}

// Головний клас додатку
class EnglishOlympiadApp {
    constructor() {
        this.init();
    }

    init() {
        this.checkCurrentPage();
    }

    checkCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('admin.html')) {
            this.initAdminPage();
        } else if (path.includes('student.html')) {
            this.initStudentPage();
        } else {
            this.initMainPage();
        }
    }

    initMainPage() {
        this.setupModeSelection();
        this.setupLoginForms();
    }

    setupModeSelection() {
        document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
            card.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                app.showLoginForm(mode);
            });
        });
    }

    setupLoginForms() {
        document.getElementById('studentLoginBtn').addEventListener('click', () => this.handleStudentLogin());
        document.getElementById('adminLoginBtn').addEventListener('click', () => this.handleAdminLogin());
        document.getElementById('backFromStudentBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backFromAdminBtn').addEventListener('click', () => this.showMainMenu());

        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (document.getElementById('studentLogin').style.display !== 'none') {
                    app.handleStudentLogin();
                } else if (document.getElementById('adminLogin').style.display !== 'none') {
                    app.handleAdminLogin();
                }
            }
        });
    }

    showMainMenu() {
        document.getElementById('modeSelector').style.display = 'grid';
        document.getElementById('studentLogin').style.display = 'none';
        document.getElementById('adminLogin').style.display = 'none';
    }

    showLoginForm(mode) {
        document.getElementById('modeSelector').style.display = 'none';
        
        if (mode === 'student') {
            document.getElementById('studentLogin').style.display = 'block';
            document.getElementById('adminLogin').style.display = 'none';
        } else {
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('studentLogin').style.display = 'none';
        }
    }

    handleStudentLogin() {
        const login = document.getElementById('studentLoginInput').value.trim();
        const password = document.getElementById('studentPasswordInput').value.trim();
        
        if (!login || !password) {
            Utils.showError('studentError', 'Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            // Генеруємо номер учня при першому вході
            if (!user.studentNumber) {
                user.studentNumber = Utils.generateStudentNumber();
                // Оновлюємо користувача в базі
                const updatedUsers = users.map(u => u.id === user.id ? user : u);
                localStorage.setItem('olympiad_users', JSON.stringify(updatedUsers));
            }
            
            localStorage.setItem('current_user', JSON.stringify(user));
            window.location.href = 'student.html';
        } else {
            Utils.showError('studentError', 'Невірні облікові дані. Перевірте логін та пароль.');
        }
    }

    handleAdminLogin() {
        const login = document.getElementById('adminLoginInput').value.trim();
        const password = document.getElementById('adminPasswordInput').value.trim();
        const codeWord = document.getElementById('adminCodeWord').value.trim();
        
        if (login === CONFIG.ADMIN_LOGIN && password === CONFIG.ADMIN_PASSWORD && codeWord === CONFIG.ADMIN_CODE_WORD) {
            localStorage.setItem('admin_authenticated', 'true');
            window.location.href = 'admin.html';
        } else {
            Utils.showError('adminError', 'Неавторизований доступ. Перевірте облікові дані.');
        }
    }

    initAdminPage() {
        if (localStorage.getItem('admin_authenticated') !== 'true') {
            window.location.href = 'index.html';
            return;
        }

        this.setupAdminPanel();
    }

    setupAdminPanel() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                app.switchAdminTab(tabName);
            });
        });

        document.getElementById('createUserBtn').addEventListener('click', () => this.createUser());
        document.getElementById('userSearch').addEventListener('input', (e) => this.filterUsers(e.target.value));
        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            localStorage.removeItem('admin_authenticated');
            window.location.href = 'index.html';
        });

        this.updateUsersList();
        this.updateStats();
    }

    switchAdminTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Panel`).classList.add('active');
        
        if (tabName === 'users') this.updateUsersList();
        if (tabName === 'stats') this.updateStats();
    }

    createUser() {
        const name = document.getElementById('newUserName').value.trim();
        const studentClass = document.getElementById('newUserClass').value;
        const group = document.getElementById('newUserGroup').value.trim();
        
        if (!name) {
            alert('Будь ласка, введіть ім\'я учня');
            return;
        }
        
        const login = Utils.generateLogin(name);
        const password = Utils.generatePassword();
        
        const newUser = {
            id: Date.now(),
            name: name,
            class: studentClass,
            group: group,
            login: login,
            password: password,
            studentNumber: null,
            created: new Date().toLocaleString('uk-UA')
        };
        
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        users.push(newUser);
        localStorage.setItem('olympiad_users', JSON.stringify(users));
        
        this.showCreatedCredentials(newUser);
        document.getElementById('newUserName').value = '';
        document.getElementById('newUserGroup').value = '';
        this.updateStats();
    }

    showCreatedCredentials(user) {
        const credentialsBox = document.getElementById('createdCredentials');
        const credentialsInfo = document.getElementById('credentialsInfo');
        
        credentialsInfo.innerHTML = `
            <p><strong>Ім'я:</strong> ${user.name}</p>
            <p><strong>Клас:</strong> ${user.class}</p>
            <p><strong>Логін:</strong> ${user.login}</p>
            <p><strong>Пароль:</strong> ${user.password}</p>
            <p><strong>Номер учня:</strong> <span style="color: var(--danger);">НЕАКТИВОВАНО (буде присвоєний при першому вході)</span></p>
            <p><strong>Дата створення:</strong> ${user.created}</p>
        `;
        
        credentialsBox.style.display = 'block';
        
        document.getElementById('copyCredentialsBtn').onclick = function() {
            const text = `Ім'я: ${user.name}\nКлас: ${user.class}\nЛогін: ${user.login}\nПароль: ${user.password}\nНомер учня: НЕАКТИВОВАНО (буде присвоєний при першому вході)`;
            navigator.clipboard.writeText(text);
            alert('Дані скопійовано!');
        };
    }

    updateUsersList() {
        const container = document.getElementById('usersListContainer');
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        
        if (users.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Користувачів ще не створено</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="user-item header">
                <div>Ім'я</div>
                <div>Клас</div>
                <div>Номер учня</div>
                <div>Логін</div>
                <div>Пароль</div>
                <div>Статус</div>
                <div>Дії</div>
            </div>
            ${users.map(user => `
                <div class="user-item">
                    <div>${user.name}</div>
                    <div>${user.class} клас</div>
                    <div>${user.studentNumber ? `<span class="student-number-badge">${user.studentNumber}</span>` : '<span style="color: var(--danger);">НЕАКТИВОВАНО</span>'}</div>
                    <div>${user.login}</div>
                    <div>${user.password}</div>
                    <div>${user.studentNumber ? '<span class="status-badge active">АКТИВНИЙ</span>' : '<span class="status-badge inactive">НЕАКТИВНИЙ</span>'}</div>
                    <div>
                        <button class="btn-danger" onclick="app.deleteUser(${user.id})">Видалити</button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    filterUsers(searchTerm) {
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.studentNumber && user.studentNumber.toString().includes(searchTerm))
        );
        
        const container = document.getElementById('usersListContainer');
        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Користувачів не знайдено</div>';
        } else {
            container.innerHTML = `
                <div class="user-item header">
                    <div>Ім'я</div>
                    <div>Клас</div>
                    <div>Номер учня</div>
                    <div>Логін</div>
                    <div>Пароль</div>
                    <div>Статус</div>
                    <div>Дії</div>
                </div>
                ${filtered.map(user => `
                    <div class="user-item">
                        <div>${user.name}</div>
                        <div>${user.class} клас</div>
                        <div>${user.studentNumber ? `<span class="student-number-badge">${user.studentNumber}</span>` : '<span style="color: var(--danger);">НЕАКТИВОВАНО</span>'}</div>
                        <div>${user.login}</div>
                        <div>${user.password}</div>
                        <div>${user.studentNumber ? '<span class="status-badge active">АКТИВНИЙ</span>' : '<span class="status-badge inactive">НЕАКТИВНИЙ</span>'}</div>
                        <div>
                            <button class="btn-danger" onclick="app.deleteUser(${user.id})">Видалити</button>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    deleteUser(userId) {
        if (confirm('Видалити цього користувача?')) {
            const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
            const updatedUsers = users.filter(user => user.id !== userId);
            localStorage.setItem('olympiad_users', JSON.stringify(updatedUsers));
            this.updateUsersList();
            this.updateStats();
        }
    }

    updateStats() {
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        const activeUsers = users.filter(u => u.studentNumber !== null);
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('activeUsers').textContent = activeUsers.length;
        document.getElementById('class9Users').textContent = users.filter(u => u.class == 9).length;
        document.getElementById('class10Users').textContent = users.filter(u => u.class == 10).length;
        document.getElementById('class11Users').textContent = users.filter(u => u.class == 11).length;
    }

    initStudentPage() {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // Оновлюємо інтерфейс учня
        this.updateStudentInterface(currentUser);
    }

    updateStudentInterface(user) {
        // Оновлюємо інформацію про учня на сторінці
        const studentInfo = document.getElementById('studentInfo');
        if (studentInfo) {
            studentInfo.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div><strong>👤 Учень:</strong> ${user.name}</div>
                    <div><strong>🏫 Клас:</strong> ${user.class}</div>
                    <div><strong>🔢 Номер:</strong> <span style="color: var(--accent); font-weight: bold;">${user.studentNumber}</span></div>
                    <div><strong>📊 Статус:</strong> <span style="color: var(--success);">Готовий до олімпіади</span></div>
                </div>
            `;
        }
    }
}

// Ініціалізація додатку
let app = new EnglishOlympiadApp();
window.app = app;
