// Глобальна конфігурація системи
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    MAX_STUDENT_NUMBER: 10000,
    OLYMPIAD_TIME: 60 * 60,
    MAX_PARTICIPANTS: 1000
};

// Централізоване сховище даних з поліпшеною обробкою помилок
class DataStorage {
    static getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
            // Забезпечуємо сумісність зі старими даними
            return users.map(user => ({
                ...user,
                studentNumber: user.studentNumber || null,
                status: user.studentNumber ? 'ACTIVE' : 'INACTIVE'
            }));
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
            const user = JSON.parse(localStorage.getItem('current_user'));
            if (user && !user.studentNumber) {
                // Генеруємо номер для існуючих користувачів
                user.studentNumber = this.generateStudentNumber();
                this.updateUserInDatabase(user);
                localStorage.setItem('current_user', JSON.stringify(user));
            }
            return user;
        } catch (error) {
            console.error('Помилка завантаження поточного користувача:', error);
            return null;
        }
    }

    static setCurrentUser(user) {
        try {
            // Генеруємо номер учня при першому вході
            if (!user.studentNumber) {
                user.studentNumber = this.generateStudentNumber();
                user.status = 'ACTIVE';
                this.updateUserInDatabase(user);
            }
            
            localStorage.setItem('current_user', JSON.stringify(user));
            return true;
        } catch (error) {
            console.error('Помилка збереження поточного користувача:', error);
            return false;
        }
    }

    static generateStudentNumber() {
        const users = this.getUsers();
        const usedNumbers = users.map(u => u.studentNumber).filter(n => n);
        let number;
        
        do {
            number = Math.floor(Math.random() * CONFIG.MAX_STUDENT_NUMBER) + 1;
        } while (usedNumbers.includes(number));
        
        return number;
    }

    static updateUserInDatabase(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            this.saveUsers(users);
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

    static isAdminAuthenticated() {
        return localStorage.getItem('admin_authenticated') === 'true';
    }

    static setAdminAuthenticated(value) {
        if (value) {
            localStorage.setItem('admin_authenticated', 'true');
        } else {
            localStorage.removeItem('admin_authenticated');
        }
    }
}

// Утиліти для роботи з даними та анімаціями
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

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static showNotification(message, type = 'info', duration = 5000) {
        // Створюємо красиве сповіщення
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Додаємо стилі
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // Анімація появи
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматичне приховування
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, duration);
        
        return notification;
    }

    static getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    static getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #00b09b, #96c93d)',
            error: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
            warning: 'linear-gradient(135deg, #f7971e, #ffd200)',
            info: 'linear-gradient(135deg, #4facfe, #00f2fe)'
        };
        return colors[type] || colors.info;
    }

    static animateElement(element, animationName, duration = 1000) {
        element.style.animation = `${animationName} ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    static createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
}

// Система управління олімпіадою з поліпшеною логікою
class OlympiadManager {
    constructor() {
        this.currentTask = 1;
        this.totalTasks = 3;
        this.timeRemaining = CONFIG.OLYMPIAD_TIME;
        this.timerInterval = null;
        this.isFinished = false;
        this.startTime = null;
        this.fullscreenExitCount = 0;
    }

    init() {
        this.setupEventListeners();
        this.startTimer();
        this.updateTaskDisplay();
        this.startTime = Date.now();
    }

    setupEventListeners() {
        // Відстеження повноекранного режиму
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.handleFullscreenExit();
            }
        });

        // Відстеження видимості сторінки
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimer();
                Utils.showNotification('Таймер призупинено', 'warning');
            } else {
                this.startTimer();
            }
        });

        // Запобігання виходу зі сторінки
        window.addEventListener('beforeunload', (e) => {
            if (!this.isFinished) {
                e.preventDefault();
                e.returnValue = 'Ви впевнені, що хочете покинути сторінку? Прогрес може бути втрачено.';
            }
        });
    }

    handleFullscreenExit() {
        this.fullscreenExitCount++;
        this.pauseTimer();
        
        let message = '';
        if (this.fullscreenExitCount === 1) {
            message = 'Будь ласка, поверніться в повноекранний режим для продовження.';
        } else if (this.fullscreenExitCount <= 3) {
            message = `Увага! Ви вийшли з повноекранного режиму ${this.fullscreenExitCount} рази.`;
        } else {
            message = `КРИТИЧНО! ${this.fullscreenExitCount} виходів. Тест може бути завершено!`;
        }
        
        Utils.showNotification(message, 'warning');
        
        if (this.fullscreenExitCount >= 10) {
            this.forceFinish();
        }
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

    pauseTimer() {
        this.stopTimer();
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = Utils.formatTime(this.timeRemaining);
            
            // Зміна кольору при малому часі
            if (this.timeRemaining < 300) { // 5 хвилин
                timerElement.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
                timerElement.classList.add('pulse');
            } else if (this.timeRemaining < 600) { // 10 хвилин
                timerElement.style.background = 'linear-gradient(135deg, #f7971e, #ffd200)';
            }
        }
    }

    goToTask(taskNumber) {
        if (taskNumber < 1 || taskNumber > this.totalTasks || this.isFinished) return;
        
        this.currentTask = taskNumber;
        this.updateTaskDisplay();
        
        // Плавна прокрутка до верху
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Анімація переходу
        const currentTaskElement = document.getElementById(`task${this.currentTask}`);
        if (currentTaskElement) {
            Utils.animateElement(currentTaskElement, 'fadeIn');
        }
    }

    updateTaskDisplay() {
        // Приховати всі завдання
        for (let i = 1; i <= this.totalTasks; i++) {
            const taskElement = document.getElementById(`task${i}`);
            if (taskElement) {
                taskElement.style.display = 'none';
                taskElement.classList.remove('active');
            }
        }
        
        // Показати поточне завдання
        const currentTaskElement = document.getElementById(`task${this.currentTask}`);
        if (currentTaskElement) {
            currentTaskElement.style.display = 'block';
            currentTaskElement.classList.add('active');
        }
        
        // Оновити навігацію
        this.updateNavigation();
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentTask > 1 ? 'block' : 'none';
            prevBtn.onclick = () => this.goToTask(this.currentTask - 1);
        }
        
        if (nextBtn) {
            if (this.currentTask < this.totalTasks) {
                nextBtn.style.display = 'block';
                nextBtn.textContent = 'Наступне завдання →';
                nextBtn.onclick = () => this.goToTask(this.currentTask + 1);
            } else {
                nextBtn.style.display = 'block';
                nextBtn.textContent = 'Завершити олімпіаду';
                nextBtn.onclick = () => this.finishOlympiad();
            }
        }
    }

    finishOlympiad() {
        if (this.isFinished) return;
        
        this.isFinished = true;
        this.stopTimer();
        
        // Вийти з повноекранного режиму
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error);
        }
        
        this.saveResults();
        this.showResults();
        
        Utils.showNotification('Олімпіаду завершено! Результати збережено.', 'success');
    }

    forceFinish() {
        Utils.showNotification('Тест примусово завершено через порушення правил!', 'error');
        this.finishOlympiad();
    }

    saveResults() {
        const progress = DataStorage.getProgress();
        const currentUser = DataStorage.getCurrentUser();
        const timeSpent = CONFIG.OLYMPIAD_TIME - this.timeRemaining;
        
        if (currentUser) {
            progress[currentUser.id] = {
                completed: true,
                timestamp: new Date().toISOString(),
                timeSpent: timeSpent,
                fullscreenExits: this.fullscreenExitCount,
                score: this.calculateScore(),
                tasks: this.collectAnswers()
            };
            
            DataStorage.saveProgress(progress);
        }
    }

    calculateScore() {
        // Базова логіка підрахунку балів
        // Можна розширити за потребою
        let score = 0;
        
        // Завдання 1: 12 питань
        for (let i = 1; i <= 12; i++) {
            const select = document.getElementById(`t1s${i}`);
            if (select && select.value) score += 1;
        }
        
        // Завдання 2: 12 питань
        for (let i = 1; i <= 12; i++) {
            const element = document.getElementById(`r2q${i}`);
            if (element && element.value) score += 1;
        }
        
        // Завдання 3: 10 питань
        for (let i = 1; i <= 10; i++) {
            const input = document.getElementById(`t3q${i}`);
            if (input && input.value.trim().length > 3) score += 1;
        }
        
        return score;
    }

    collectAnswers() {
        const answers = {};
        
        // Збираємо відповіді з усіх завдань
        for (let task = 1; task <= 3; task++) {
            answers[`task${task}`] = this.getTaskAnswers(task);
        }
        
        return answers;
    }

    getTaskAnswers(taskNumber) {
        const answers = {};
        
        switch (taskNumber) {
            case 1:
                for (let i = 1; i <= 12; i++) {
                    const select = document.getElementById(`t1s${i}`);
                    if (select) answers[`q${i}`] = select.value;
                }
                break;
                
            case 2:
                for (let i = 1; i <= 12; i++) {
                    const element = document.getElementById(`r2q${i}`);
                    if (element) answers[`q${i}`] = element.value;
                }
                break;
                
            case 3:
                for (let i = 1; i <= 10; i++) {
                    const input = document.getElementById(`t3q${i}`);
                    if (input) answers[`q${i}`] = input.value;
                }
                break;
        }
        
        return answers;
    }

    showResults() {
        const resultsScreen = document.getElementById('resultsScreen');
        const olympiadContent = document.getElementById('olympiadContent');
        
        if (resultsScreen && olympiadContent) {
            olympiadContent.style.display = 'none';
            resultsScreen.style.display = 'block';
            
            this.displayResults();
        }
    }

    displayResults() {
        const currentUser = DataStorage.getCurrentUser();
        const progress = DataStorage.getProgress();
        const userProgress = progress[currentUser.id];
        
        if (!userProgress) return;
        
        const resultsContent = document.getElementById('resultsContent');
        if (resultsContent) {
            const timeSpentFormatted = Utils.formatTime(userProgress.timeSpent);
            const maxScore = 34; // 12 + 12 + 10
            
            resultsContent.innerHTML = `
                <div class="results-header">
                    <h2>🎉 Олімпіаду завершено!</h2>
                    <div class="student-info">
                        <strong>${currentUser.name}</strong> | Клас: ${currentUser.class} | Номер: ${currentUser.studentNumber}
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${userProgress.score}/${maxScore}</div>
                        <div class="stat-label">Бали</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${timeSpentFormatted}</div>
                        <div class="stat-label">Час</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${userProgress.fullscreenExits}</div>
                        <div class="stat-label">Виходи</div>
                    </div>
                </div>
                
                <div class="contact-info">
                    <h3>📞 Контакти для результатів:</h3>
                    <p>Telegram: <code>@nacodexx</code></p>
                    <p>Discord: <code>in.kyiv</code></p>
                </div>
            `;
        }
    }
}

// Головний клас додатку з повним перезаписом
class EnglishOlympiadApp {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.olympiadManager = null;
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('admin.html')) return 'admin';
        if (path.includes('student.html')) return 'student';
        return 'main';
    }

    init() {
        try {
            switch (this.currentPage) {
                case 'main':
                    this.initMainPage();
                    break;
                case 'admin':
                    this.initAdminPage();
                    break;
                case 'student':
                    this.initStudentPage();
                    break;
            }
            
            this.setupGlobalEventListeners();
            console.log('🏆 English Olympiad App initialized successfully');
        } catch (error) {
            console.error('Помилка ініціалізації додатку:', error);
            Utils.showNotification('Помилка завантаження додатку', 'error');
        }
    }

    setupGlobalEventListeners() {
        // Глобальні обробники подій
        document.addEventListener('DOMContentLoaded', () => {
            this.onPageLoaded();
        });
    }

    onPageLoaded() {
        Utils.animateElement(document.body, 'fadeIn');
    }

    initMainPage() {
        // Ініціалізація головної сторінки
        this.setupModeSelection();
        this.setupLoginForms();
        this.updateUserCounters();
    }

    setupModeSelection() {
        const modeCards = document.querySelectorAll('.mode-card[data-mode]');
        modeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                Utils.createRipple(e);
                const mode = card.getAttribute('data-mode');
                setTimeout(() => this.showLoginForm(mode), 300);
            });
        });
    }

    setupLoginForms() {
        // Обробник входу для учня
        const studentLoginBtn = document.getElementById('studentLoginBtn');
        if (studentLoginBtn) {
            studentLoginBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                this.handleStudentLogin();
            });
        }

        // Обробник входу для адміна
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                this.handleAdminLogin();
            });
        }

        // Обробники повернення
        ['backFromStudentBtn', 'backFromAdminBtn'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    Utils.createRipple(e);
                    this.showMainMenu();
                });
            }
        });

        // Enter для форм
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (document.getElementById('studentLogin').style.display !== 'none') {
                    this.handleStudentLogin();
                } else if (document.getElementById('adminLogin').style.display !== 'none') {
                    this.handleAdminLogin();
                }
            }
        });
    }

    showMainMenu() {
        document.getElementById('modeSelector').style.display = 'grid';
        document.getElementById('studentLogin').style.display = 'none';
        document.getElementById('adminLogin').style.display = 'none';
        
        Utils.animateElement(document.getElementById('modeSelector'), 'slideInFromTop');
    }

    showLoginForm(mode) {
        document.getElementById('modeSelector').style.display = 'none';
        
        if (mode === 'student') {
            document.getElementById('studentLogin').style.display = 'block';
            document.getElementById('adminLogin').style.display = 'none';
            Utils.animateElement(document.getElementById('studentLogin'), 'fadeIn');
        } else {
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('studentLogin').style.display = 'none';
            Utils.animateElement(document.getElementById('adminLogin'), 'fadeIn');
        }
    }

    handleStudentLogin() {
        const login = document.getElementById('studentLoginInput')?.value.trim();
        const password = document.getElementById('studentPasswordInput')?.value.trim();
        
        if (!login || !password) {
            Utils.showNotification('Будь ласка, заповніть всі поля', 'warning');
            return;
        }
        
        const users = DataStorage.getUsers();
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            DataStorage.setCurrentUser(user);
            Utils.showNotification(`Ласкаво просимо, ${user.name}!`, 'success');
            
            // Затримка для анімації
            setTimeout(() => {
                window.location.href = 'student.html';
            }, 1000);
        } else {
            Utils.showNotification('Невірний логін або пароль', 'error');
        }
    }

    handleAdminLogin() {
        const login = document.getElementById('adminLoginInput')?.value.trim();
        const password = document.getElementById('adminPasswordInput')?.value.trim();
        const codeWord = document.getElementById('adminCodeWord')?.value.trim();
        
        if (login === CONFIG.ADMIN_LOGIN && 
            password === CONFIG.ADMIN_PASSWORD && 
            codeWord === CONFIG.ADMIN_CODE_WORD) {
            
            DataStorage.setAdminAuthenticated(true);
            Utils.showNotification('Адмін панель завантажується...', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            Utils.showNotification('Неавторизований доступ', 'error');
        }
    }

    initAdminPage() {
        if (!DataStorage.isAdminAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        this.setupAdminPanel();
        Utils.showNotification('Адмін панель активована', 'success');
    }

    setupAdminPanel() {
        // Вкладки
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                Utils.createRipple(e);
                const tabName = tab.getAttribute('data-tab');
                this.switchAdminTab(tabName);
            });
        });

        // Створення користувача
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                this.createUser();
            });
        }

        // Пошук
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Вихід
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                DataStorage.setAdminAuthenticated(false);
                window.location.href = 'index.html';
            });
        }

        // Завантажити дані
        this.updateUsersList();
        this.updateStats();
    }

    switchAdminTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        
        const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        const activePanel = document.getElementById(`${tabName}Panel`);
        
        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
        
        if (tabName === 'users') this.updateUsersList();
        if (tabName === 'stats') this.updateStats();
    }

    createUser() {
        const name = document.getElementById('newUserName')?.value.trim();
        const studentClass = document.getElementById('newUserClass')?.value;
        const group = document.getElementById('newUserGroup')?.value.trim();
        
        if (!name) {
            Utils.showNotification('Будь ласка, введіть ім\'я учня', 'warning');
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
            studentNumber: null,
            created: new Date().toLocaleString('uk-UA'),
            status: 'INACTIVE'
        };
        
        const users = DataStorage.getUsers();
        users.push(newUser);
        
        if (DataStorage.saveUsers(users)) {
            this.showCreatedCredentials(newUser);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserGroup').value = '';
            this.updateStats();
            Utils.showNotification('Користувача створено успішно!', 'success');
        } else {
            Utils.showNotification('Помилка при створенні користувача', 'error');
        }
    }

    showCreatedCredentials(user) {
        const credentialsBox = document.getElementById('createdCredentials');
        const credentialsInfo = document.getElementById('credentialsInfo');
        
        if (credentialsBox && credentialsInfo) {
            credentialsInfo.innerHTML = `
                <div class="credentials-grid">
                    <div><strong>Ім'я:</strong> ${user.name}</div>
                    <div><strong>Клас:</strong> ${user.class}</div>
                    <div><strong>Логін:</strong> <code>${user.login}</code></div>
                    <div><strong>Пароль:</strong> <code>${user.password}</code></div>
                    <div><strong>Номер учня:</strong> <span style="color: var(--danger);">НЕАКТИВОВАНО</span></div>
                    <div><strong>Статус:</strong> <span style="color: var(--danger);">ОЧІКУЄ АКТИВАЦІЇ</span></div>
                </div>
            `;
            
            credentialsBox.style.display = 'block';
            
            const copyBtn = document.getElementById('copyCredentialsBtn');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    const text = `Ім'я: ${user.name}\nКлас: ${user.class}\nЛогін: ${user.login}\nПароль: ${user.password}\n\nНомер учня буде присвоєний автоматично при першому вході.`;
                    navigator.clipboard.writeText(text);
                    Utils.showNotification('Дані скопійовано в буфер обміну', 'success');
                };
            }
        }
    }

    updateUsersList() {
        const container = document.getElementById('usersListContainer');
        const users = DataStorage.getUsers();
        
        if (!container) return;
        
        if (users.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📝</div>
                    <h3>Користувачів ще не створено</h3>
                    <p>Створіть першого користувача у вкладці "Створити користувача"</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="user-item header">
                <div>Ім'я</div>
                <div>Клас</div>
                <div>Номер учня</div>
                <div>Логін</div>
                <div>Статус</div>
                <div>Дії</div>
            </div>
            ${users.map(user => `
                <div class="user-item">
                    <div>${user.name}</div>
                    <div>${user.class} клас</div>
                    <div>${user.studentNumber ? 
                        `<span class="student-number-badge">${user.studentNumber}</span>` : 
                        '<span class="status-badge inactive">НЕАКТИВНО</span>'
                    }</div>
                    <div><code>${user.login}</code></div>
                    <div>${user.studentNumber ? 
                        '<span class="status-badge active">АКТИВНИЙ</span>' : 
                        '<span class="status-badge inactive">НЕАКТИВНИЙ</span>'
                    }</div>
                    <div>
                        <button class="btn-danger" onclick="app.deleteUser(${user.id})">
                            🗑️ Видалити
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    }

    filterUsers(searchTerm) {
        const users = DataStorage.getUsers();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.studentNumber && user.studentNumber.toString().includes(searchTerm))
        );
        
        const container = document.getElementById('usersListContainer');
        if (!container) return;
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">Користувачів не знайдено</div>';
        } else {
            container.innerHTML = `
                <div class="user-item header">
                    <div>Ім'я</div>
                    <div>Клас</div>
                    <div>Номер учня</div>
                    <div>Логін</div>
                    <div>Статус</div>
                    <div>Дії</div>
                </div>
                ${filtered.map(user => `
                    <div class="user-item">
                        <div>${user.name}</div>
                        <div>${user.class} клас</div>
                        <div>${user.studentNumber ? 
                            `<span class="student-number-badge">${user.studentNumber}</span>` : 
                            '<span class="status-badge inactive">НЕАКТИВНО</span>'
                        }</div>
                        <div><code>${user.login}</code></div>
                        <div>${user.studentNumber ? 
                            '<span class="status-badge active">АКТИВНИЙ</span>' : 
                            '<span class="status-badge inactive">НЕАКТИВНИЙ</span>'
                        }</div>
                        <div>
                            <button class="btn-danger" onclick="app.deleteUser(${user.id})">
                                🗑️ Видалити
                            </button>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    deleteUser(userId) {
        if (confirm('Ви впевнені, що хочете видалити цього користувача? Цю дію не можна скасувати.')) {
            const users = DataStorage.getUsers();
            const updatedUsers = users.filter(user => user.id !== userId);
            
            if (DataStorage.saveUsers(updatedUsers)) {
                this.updateUsersList();
                this.updateStats();
                Utils.showNotification('Користувача видалено', 'success');
            } else {
                Utils.showNotification('Помилка при видаленні користувача', 'error');
            }
        }
    }

    updateStats() {
        const users = DataStorage.getUsers();
        const activeUsers = users.filter(u => u.studentNumber !== null);
        
        const elements = {
            totalUsers: users.length,
            activeUsers: activeUsers.length,
            class9Users: users.filter(u => u.class == 9).length,
            class10Users: users.filter(u => u.class == 10).length,
            class11Users: users.filter(u => u.class == 11).length
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                Utils.animateElement(element, 'pulse');
            }
        });
    }

    initStudentPage() {
        const currentUser = DataStorage.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupStudentPage(currentUser);
        Utils.showNotification(`Ласкаво просимо, ${currentUser.name}! Готові до олімпіади?`, 'success');
    }

    setupStudentPage(currentUser) {
        // Оновити інформацію про учня
        this.updateStudentInfo(currentUser);
        
        // Налаштування кнопки початку
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                this.startOlympiad();
            });
        }

        // Налаштування виходу
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                Utils.createRipple(e);
                DataStorage.clearCurrentUser();
                window.location.href = 'index.html';
            });
        }
    }

    updateStudentInfo(user) {
        const studentInfo = document.getElementById('studentInfo');
        if (studentInfo) {
            studentInfo.innerHTML = `
                <div class="student-profile">
                    <div class="profile-header">
                        <div class="avatar">👤</div>
                        <div class="profile-info">
                            <h3>${user.name}</h3>
                            <p>Клас: ${user.class} | Номер: <span class="student-number">${user.studentNumber}</span></p>
                        </div>
                    </div>
                    <div class="profile-stats">
                        <div class="stat">
                            <div class="stat-value">${user.status === 'ACTIVE' ? 'Активний' : 'Новий'}</div>
                            <div class="stat-label">Статус</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    startOlympiad() {
        // Приховати вступний екран
        document.getElementById('intro').style.display = 'none';
        document.getElementById('tasks').style.display = 'block';
        
        // Запустити повноекранний режим
        this.enterFullscreen();
        
        // Ініціалізувати менеджер олімпіади
        this.olympiadManager = new OlympiadManager();
        this.olympiadManager.init();
        
        Utils.showNotification('Олімпіада розпочата! Гарної роботи! 🚀', 'success');
    }

    enterFullscreen() {
        try {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        } catch (error) {
            console.log('Повноекранний режим не підтримується:', error);
        }
    }

    updateUserCounters() {
        const users = DataStorage.getUsers();
        const counter = document.getElementById('participantCounter');
        
        if (counter) {
            counter.textContent = `Зареєстровано учасників: ${users.length}`;
        }
    }
}

// Ініціалізація додатку при завантаженні
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EnglishOlympiadApp();
});

// Глобальний доступ для HTML подій
window.app = app;

console.log('🏆 English Olympiad System loaded successfully!');
