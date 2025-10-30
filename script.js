// Глобальна конфігурація системи
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    MAX_USERS: 1000,
    OLYMPIAD_TIME: 60 * 60, // 60 хвилин у секундах
    MAX_PARTICIPANTS: 100
};

// Централізоване сховище даних
class DataStorage {
    static getUsers() {
        try {
            return JSON.parse(localStorage.getItem('olympiad_users')) || [];
        } catch (error) {
            console.error('Помилка завантаження користувачів:', error);
            return [];
        }
    }

    static saveUsers(users) {
        try {
            localStorage.setItem('olympiad_users', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Помилка збереження користувачів:', error);
            return false;
        }
    }

    static getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('current_user'));
        } catch (error) {
            console.error('Помилка завантаження поточного користувача:', error);
            return null;
        }
    }

    static setCurrentUser(user) {
        try {
            localStorage.setItem('current_user', JSON.stringify(user));
            return true;
        } catch (error) {
            console.error('Помилка збереження поточного користувача:', error);
            return false;
        }
    }

    static clearCurrentUser() {
        localStorage.removeItem('current_user');
    }

    static getProgress() {
        try {
            return JSON.parse(localStorage.getItem('olympiad_progress')) || {};
        } catch (error) {
            console.error('Помилка завантаження прогресу:', error);
            return {};
        }
    }

    static saveProgress(progress) {
        try {
            localStorage.setItem('olympiad_progress', JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('Помилка збереження прогресу:', error);
            return false;
        }
    }
}

// Утиліти для роботи з даними
class Utils {
    static generateLogin(name) {
        const base = name.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9а-яіїєґ]/g, '')
            .substring(0, 8);
        
        const users = DataStorage.getUsers();
        let login = base;
        let counter = 1;
        
        while (users.find(user => user.login === login)) {
            login = base + counter;
            counter++;
            
            if (counter > 100) {
                login = base + Date.now().toString().slice(-3);
                break;
            }
        }
        
        return login;
    }

    static generatePassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

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

    static showSuccess(message) {
        alert(message); // Можна замінити на кращу систему сповіщень
    }
}

// Клас для управління олімпіадою
class OlympiadManager {
    constructor() {
        this.currentTask = 1;
        this.totalTasks = 3;
        this.timeRemaining = CONFIG.OLYMPIAD_TIME;
        this.timerInterval = null;
        this.isFinished = false;
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimerDisplay();
            } else {
                this.finishOlympiad();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = Utils.formatTime(this.timeRemaining);
        }
    }

    goToTask(taskNumber) {
        if (taskNumber < 1 || taskNumber > this.totalTasks) return;
        
        this.currentTask = taskNumber;
        this.updateTaskDisplay();
    }

    updateTaskDisplay() {
        // Приховати всі завдання
        for (let i = 1; i <= this.totalTasks; i++) {
            const taskElement = document.getElementById(`task${i}`);
            if (taskElement) {
                taskElement.style.display = 'none';
            }
        }
        
        // Показати поточне завдання
        const currentTaskElement = document.getElementById(`task${this.currentTask}`);
        if (currentTaskElement) {
            currentTaskElement.style.display = 'block';
        }
    }

    finishOlympiad() {
        this.stopTimer();
        this.isFinished = true;
        
        // Зберегти результати
        this.saveResults();
        
        // Показати екран результатів
        this.showResults();
    }

    saveResults() {
        const progress = DataStorage.getProgress();
        const currentUser = DataStorage.getCurrentUser();
        
        if (currentUser) {
            progress[currentUser.id] = {
                completed: true,
                timestamp: new Date().toISOString(),
                timeSpent: CONFIG.OLYMPIAD_TIME - this.timeRemaining,
                score: this.calculateScore()
            };
            
            DataStorage.saveProgress(progress);
        }
    }

    calculateScore() {
        // Тут буде логіка підрахунку балів
        // Поки що повертаємо 0
        return 0;
    }

    showResults() {
        const resultsScreen = document.getElementById('resultsScreen');
        const olympiadContent = document.getElementById('olympiadContent');
        
        if (resultsScreen && olympiadContent) {
            olympiadContent.style.display = 'none';
            resultsScreen.style.display = 'block';
            
            const currentUser = DataStorage.getCurrentUser();
            const resultsContent = document.getElementById('resultsContent');
            
            if (resultsContent && currentUser) {
                resultsContent.innerHTML = `
                    <h3>Результати для ${currentUser.name}</h3>
                    <p>Клас: ${currentUser.class}</p>
                    <p>Час виконання: ${Utils.formatTime(CONFIG.OLYMPIAD_TIME - this.timeRemaining)}</p>
                    <p style="margin-top: 20px; font-size: 1.2em;">
                        <strong>Олімпіаду завершено!</strong>
                    </p>
                    <p style="color: var(--text-light); margin-top: 10px;">
                        Дякуємо за участь! Результати будуть опубліковані пізніше.
                    </p>
                `;
            }
        }
    }
}

// Головний клас додатку
class EnglishOlympiadApp {
    constructor() {
        this.olympiadManager = new OlympiadManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkCurrentPage();
    }

    setupEventListeners() {
        // Глобальні обробники подій
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePageLoad();
        });
    }

    handlePageLoad() {
        console.log('Додаток олімпіади завантажено');
        this.updateUserCounters();
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
        console.log('Ініціалізація головної сторінки');
        
        // Обробники для карток вибору режиму
        document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('data-mode');
                this.showLoginForm(mode);
            });
        });

        // Обробники для форми учня
        const studentLoginBtn = document.getElementById('studentLoginBtn');
        if (studentLoginBtn) {
            studentLoginBtn.addEventListener('click', () => this.handleStudentLogin());
        }

        const backFromStudentBtn = document.getElementById('backFromStudentBtn');
        if (backFromStudentBtn) {
            backFromStudentBtn.addEventListener('click', () => this.showMainMenu());
        }

        // Обробники для форми адміна
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', () => this.handleAdminLogin());
        }

        const backFromAdminBtn = document.getElementById('backFromAdminBtn');
        if (backFromAdminBtn) {
            backFromAdminBtn.addEventListener('click', () => this.showMainMenu());
        }

        // Enter для форми входу
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const studentLogin = document.getElementById('studentLogin');
                const adminLogin = document.getElementById('adminLogin');
                
                if (studentLogin && studentLogin.style.display !== 'none') {
                    this.handleStudentLogin();
                } else if (adminLogin && adminLogin.style.display !== 'none') {
                    this.handleAdminLogin();
                }
            }
        });
    }

    initAdminPage() {
        console.log('Ініціалізація адмін панелі');
        
        // Перевірка авторизації адміна
        if (!this.isAdminAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        this.setupAdminPanel();
    }

    initStudentPage() {
        console.log('Ініціалізація сторінки учня');
        
        // Перевірка авторизації учня
        const currentUser = DataStorage.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupStudentPage(currentUser);
    }

    isAdminAuthenticated() {
        // Перевірка, чи адмін вже авторизований
        // Можна реалізувати більш надійну перевірку
        return localStorage.getItem('admin_authenticated') === 'true';
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
            
            // Очистити поля
            document.getElementById('studentLoginInput').value = '';
            document.getElementById('studentPasswordInput').value = '';
        } else if (mode === 'admin') {
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('studentLogin').style.display = 'none';
            
            // Очистити поля
            document.getElementById('adminLoginInput').value = '';
            document.getElementById('adminPasswordInput').value = '';
            document.getElementById('adminCodeWord').value = '';
        }
    }

    handleStudentLogin() {
        const login = document.getElementById('studentLoginInput').value.trim();
        const password = document.getElementById('studentPasswordInput').value.trim();
        
        if (!login || !password) {
            Utils.showError('studentError', 'Будь ласка, заповніть всі поля');
            return;
        }
        
        const users = DataStorage.getUsers();
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            DataStorage.setCurrentUser(user);
            window.location.href = 'student.html';
        } else {
            Utils.showError('studentError', 'Невірний логін або пароль');
        }
    }

    handleAdminLogin() {
        const login = document.getElementById('adminLoginInput').value.trim();
        const password = document.getElementById('adminPasswordInput').value.trim();
        const codeWord = document.getElementById('adminCodeWord').value.trim();
        
        if (login === CONFIG.ADMIN_LOGIN && 
            password === CONFIG.ADMIN_PASSWORD && 
            codeWord === CONFIG.ADMIN_CODE_WORD) {
            
            localStorage.setItem('admin_authenticated', 'true');
            window.location.href = 'admin.html';
        } else {
            Utils.showError('adminError', 'Невірні облікові дані адміністратора');
        }
    }

    setupAdminPanel() {
        // Обробники вкладок
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchAdminTab(tabName);
            });
        });

        // Обробник створення користувача
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.addEventListener('click', () => this.createUser());
        }

        // Обробник пошуку
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Обробник експорту
        const exportUsersBtn = document.getElementById('exportUsersBtn');
        if (exportUsersBtn) {
            exportUsersBtn.addEventListener('click', () => this.exportUsers());
        }

        // Обробник виходу
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', () => {
                localStorage.removeItem('admin_authenticated');
                window.location.href = 'index.html';
            });
        }

        // Завантажити початкові дані
        this.updateUsersList();
        this.updateStats();
    }

    switchAdminTab(tabName) {
        // Деактивувати всі вкладки
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        
        // Активувати обрану вкладку
        const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        const activePanel = document.getElementById(`${tabName}Panel`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
        
        // Оновити дані при переключенні
        if (tabName === 'users') {
            this.updateUsersList();
        } else if (tabName === 'stats') {
            this.updateStats();
        }
    }

    createUser() {
        const name = document.getElementById('newUserName').value.trim();
        const studentClass = document.getElementById('newUserClass').value;
        const group = document.getElementById('newUserGroup').value.trim();
        
        if (!name) {
            Utils.showSuccess('Будь ласка, введіть ім\'я учня');
            return;
        }
        
        const login = Utils.generateLogin(name);
        const password = Utils.generatePassword();
        
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
        
        const users = DataStorage.getUsers();
        users.push(newUser);
        
        if (DataStorage.saveUsers(users)) {
            this.showCreatedCredentials(newUser);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserGroup').value = '';
            this.updateStats();
        } else {
            Utils.showSuccess('Помилка при створенні користувача');
        }
    }

    showCreatedCredentials(user) {
        const credentialsBox = document.getElementById('createdCredentials');
        const credentialsInfo = document.getElementById('credentialsInfo');
        const copyBtn = document.getElementById('copyCredentialsBtn');
        
        if (credentialsBox && credentialsInfo) {
            credentialsInfo.innerHTML = `
                <p><strong>Ім'я:</strong> ${user.name}</p>
                <p><strong>Клас:</strong> ${user.class}</p>
                <p><strong>Логін:</strong> ${user.login}</p>
                <p><strong>Пароль:</strong> ${user.password}</p>
                <p><strong>Дата створення:</strong> ${user.created}</p>
            `;
            
            credentialsBox.style.display = 'block';
            
            // Обробник копіювання
            if (copyBtn) {
                copyBtn.onclick = () => {
                    const text = `Ім'я: ${user.name}\nКлас: ${user.class}\nЛогін: ${user.login}\nПароль: ${user.password}`;
                    navigator.clipboard.writeText(text).then(() => {
                        Utils.showSuccess('Дані скопійовано в буфер обміну');
                    });
                };
            }
            
            // Автоматично сховати через 30 секунд
            setTimeout(() => {
                credentialsBox.style.display = 'none';
            }, 30000);
        }
    }

    updateUsersList() {
        const container = document.getElementById('usersListContainer');
        if (!container) return;
        
        const users = DataStorage.getUsers();
        
        if (users.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-light);">
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
            ${users.map(user => `
                <div class="user-item">
                    <div>${user.name}</div>
                    <div>${user.class} клас</div>
                    <div>${user.login}</div>
                    <div>${user.password}</div>
                    <div>${user.created}</div>
                    <div>
                        <button class="btn-danger" onclick="app.deleteUser(${user.id})">Видалити</button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    filterUsers(searchTerm) {
        const users = DataStorage.getUsers();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.login.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const container = document.getElementById('usersListContainer');
        if (container) {
            if (filteredUsers.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-light);">Користувачів не знайдено</div>';
            } else {
                container.innerHTML = `
                    <div class="user-item header">
                        <div>Ім'я</div>
                        <div>Клас</div>
                        <div>Логін</div>
                        <div>Пароль</div>
                        <div>Дата створення</div>
                        <div>Дії</div>
                    </div>
                    ${filteredUsers.map(user => `
                        <div class="user-item">
                            <div>${user.name}</div>
                            <div>${user.class} клас</div>
                            <div>${user.login}</div>
                            <div>${user.password}</div>
                            <div>${user.created}</div>
                            <div>
                                <button class="btn-danger" onclick="app.deleteUser(${user.id})">Видалити</button>
                            </div>
                        </div>
                    `).join('')}
                `;
            }
        }
    }

    deleteUser(userId) {
        if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
            const users = DataStorage.getUsers();
            const updatedUsers = users.filter(user => user.id !== userId);
            
            if (DataStorage.saveUsers(updatedUsers)) {
                this.updateUsersList();
                this.updateStats();
                Utils.showSuccess('Користувача видалено');
            } else {
                Utils.showSuccess('Помилка при видаленні користувача');
            }
        }
    }

    updateStats() {
        const users = DataStorage.getUsers();
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('class9Users').textContent = users.filter(u => u.class == 9).length;
        document.getElementById('class10Users').textContent = users.filter(u => u.class == 10).length;
        document.getElementById('class11Users').textContent = users.filter(u => u.class == 11).length;
    }

    exportUsers() {
        const users = DataStorage.getUsers();
        const csvContent = this.convertToCSV(users);
        this.downloadCSV(csvContent, 'olympiad_users.csv');
    }

    convertToCSV(users) {
        const headers = ['Ім\'я', 'Клас', 'Група', 'Логін', 'Пароль', 'Дата створення'];
        const rows = users.map(user => [
            user.name,
            user.class,
            user.group || '',
            user.login,
            user.password,
            user.created
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    setupStudentPage(currentUser) {
        // Оновити інформацію про учня
        const studentInfo = document.getElementById('studentInfo');
        if (studentInfo) {
            studentInfo.textContent = `Учень: ${currentUser.name} | Клас: ${currentUser.class}`;
        }

        // Обробник виходу
        const olympiadLogoutBtn = document.getElementById('olympiadLogoutBtn');
        if (olympiadLogoutBtn) {
            olympiadLogoutBtn.addEventListener('click', () => {
                DataStorage.clearCurrentUser();
                window.location.href = 'index.html';
            });
        }

        // Обробник повернення на головну
        const backToHomeBtn = document.getElementById('backToHomeBtn');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Завантажити олімпіаду
        this.loadOlympiadContent();
    }

    loadOlympiadContent() {
        const loadingScreen = document.getElementById('loadingScreen');
        const olympiadContent = document.getElementById('olympiadContent');
        
        // Імітація завантаження
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (olympiadContent) olympiadContent.style.display = 'block';
            
            // Запустити таймер
            this.olympiadManager.startTimer();
            
            // Завантажити завдання
            this.loadTasks();
        }, 2000);
    }

    loadTasks() {
        // Тут буде завантаження завдань олімпіади
        // Поки що просто показуємо повідомлення
        const olympiadContent = document.getElementById('olympiadContent');
        if (olympiadContent) {
            olympiadContent.innerHTML = `
                <div class="olympiad-card">
                    <div style="text-align: center; padding: 40px;">
                        <h2>Ласкаво просимо до олімпіади!</h2>
                        <p style="margin: 20px 0; color: var(--text-light);">
                            Олімпіада розпочнеться найближчим часом.
                        </p>
                        <p style="color: var(--text-light);">
                            Функціонал проходження олімпіади знаходиться в розробці.
                        </p>
                    </div>
                </div>
            `;
        }
    }

    updateUserCounters() {
        const users = DataStorage.getUsers();
        const participantCounter = document.getElementById('participantCounter');
        
        if (participantCounter) {
            participantCounter.textContent = `Зареєстровано користувачів: ${users.length}`;
        }
    }
}

// Файл 6: `manifest.json` (PWA маніфест)
```json
{
  "name": "Олімпіада з Англійської мови",
  "short_name": "EnglishOlympiad",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#2c3e50",
  "background_color": "#2c3e50",
  "description": "Онлайн олімпіада з англійської мови для учнів 9-11 класів",
  "orientation": "portrait",
  "categories": ["education", "productivity"],
  "lang": "uk-UA",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
