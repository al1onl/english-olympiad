// 🎯 Глобальна конфігурація системи
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    TASK_TIME: 20 * 60, // 20 хвилин у секундах
    MAX_FULLSCREEN_EXITS: 7,
    MAX_SCORE: 34,
    CORRECT_ANSWERS: {
        task1: {
            t1s1: 'synthesis', t1s2: 'short-sighted', t1s3: 'sporadic',
            t1s4: 'limitations', t1s5: 'detached', t1s6: 'overly',
            t1s7: 'nuance', t1s8: 'clarify', t1s9: 'ambiguous',
            t1s10: 'spurious', t1s11: 'inequalities', t1s12: 'adaptive'
        },
        task2: {
            r2q2: 'C', r2q4: 'A', r2q6: 'A', r2q8: 'A', r2q10: 'A', r2q12: 'A'
        }
    }
};

// 🛠️ Утиліти для роботи з даними
class Utils {
    static showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => { element.style.display = 'none'; }, 5000);
        }
    }

    static showSuccess(message) { this.showNotification(message, 'success'); }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<div class="notification-content"><span class="notification-icon">${this.getNotificationIcon(type)}</span><span class="notification-message">${message}</span></div>`;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${this.getNotificationColor(type)};
            color: white; padding: 16px 20px; border-radius: var(--border-radius); box-shadow: var(--glass-shadow);
            z-index: 10000; transform: translateX(400px); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px; backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2);
        `;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => { if (notification.parentNode) { notification.parentNode.removeChild(notification); } }, 400);
        }, 5000);
    }

    static getNotificationIcon(type) {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        return icons[type] || icons.info;
    }

    static getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, var(--success), var(--success-dark))',
            error: 'linear-gradient(135deg, var(--danger), var(--danger-dark))',
            warning: 'linear-gradient(135deg, var(--warning), var(--warning-dark))',
            info: 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
        };
        return colors[type] || colors.info;
    }

    static generateLogin(name) {
        const base = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9а-яіїєґ]/g, '').substring(0, 8);
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        let login = base;
        let counter = 1;
        while (users.find(user => user.login === login)) { login = base + counter; counter++; }
        return login;
    }

    static generatePassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) { password += chars.charAt(Math.floor(Math.random() * chars.length)); }
        return password;
    }

    static generateStudentNumber() {
        const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
        const usedNumbers = users.map(u => u.studentNumber).filter(n => n);
        let number;
        do { number = Math.floor(Math.random() * 10000) + 1; } while (usedNumbers.includes(number));
        return number;
    }

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static calculate12PointScore(rawScore, maxScore) {
        return Math.round((rawScore / maxScore) * 12);
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
        if (ripple) { ripple.remove(); }
        button.appendChild(circle);
    }
}

// 💾 Централізоване сховище даних
class DataStorage {
    static getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
            return users.map(user => ({
                ...user,
                studentNumber: user.studentNumber || null,
                status: user.studentNumber ? 'ACTIVE' : 'INACTIVE'
            }));
        } catch (error) { return []; }
    }

    static saveUsers(users) {
        try {
            localStorage.setItem('olympiad_users', JSON.stringify(users));
            return true;
        } catch (error) { return false; }
    }

    static getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('current_user'));
            if (user && !user.studentNumber) {
                user.studentNumber = Utils.generateStudentNumber();
                this.updateUserInDatabase(user);
                localStorage.setItem('current_user', JSON.stringify(user));
            }
            return user;
        } catch (error) { return null; }
    }

    static setCurrentUser(user) {
        try {
            if (!user.studentNumber) {
                user.studentNumber = Utils.generateStudentNumber();
                user.status = 'ACTIVE';
                this.updateUserInDatabase(user);
            }
            localStorage.setItem('current_user', JSON.stringify(user));
            return true;
        } catch (error) { return false; }
    }

    static updateUserInDatabase(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            this.saveUsers(users);
        }
    }

    static clearCurrentUser() { localStorage.removeItem('current_user'); }

    static getProgress() {
        try { return JSON.parse(localStorage.getItem('olympiad_progress')) || {}; } catch (error) { return {}; }
    }

    static saveProgress(progress) {
        try {
            localStorage.setItem('olympiad_progress', JSON.stringify(progress));
            return true;
        } catch (error) { return false; }
    }

    static isAdminAuthenticated() { return localStorage.getItem('admin_authenticated') === 'true'; }

    static setAdminAuthenticated(value) {
        if (value) { localStorage.setItem('admin_authenticated', 'true'); } else { localStorage.removeItem('admin_authenticated'); }
    }
}

// ⏱️ Менеджер олімпіади
class OlympiadManager {
    constructor() {
        this.currentTask = 1;
        this.totalTasks = 3;
        this.timeRemaining = CONFIG.TASK_TIME;
        this.timerInterval = null;
        this.isFinished = false;
        this.fullscreenExitCount = 0;
        this.startTime = null;
        this.totalTimeSpent = 0;
        this.viewMode = false;
        this.answers = {};
    }

    init() {
        this.setupEventListeners();
        this.startTimer();
        this.showTask(1);
        this.startTime = Date.now();
        Utils.showSuccess('Олімпіада розпочата! Гарної роботи! 🚀');
    }

    setupEventListeners() {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && !this.isFinished) { this.handleFullscreenExit(); }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.isFinished) { this.handleVisibilityChange(); }
        });
        window.addEventListener('beforeunload', (e) => {
            if (!this.isFinished) { e.preventDefault(); e.returnValue = 'Ви впевнені, що хочете покинути сторінку? Прогрес може бути втрачено.'; }
        });
    }

    handleFullscreenExit() {
        if (this.isFinished) return;
        this.fullscreenExitCount++;
        this.pauseTimer();
        
        if (this.fullscreenExitCount >= CONFIG.MAX_FULLSCREEN_EXITS) {
            this.forceFinish();
        } else {
            this.showFullscreenWarning();
            setTimeout(() => { this.enterFullscreen(); }, 2000);
        }
    }

    showFullscreenWarning() {
        const warning = document.getElementById('fullscreenWarning');
        if (warning) {
            warning.textContent = `Увага! Ви вийшли з повноекранного режиму ${this.fullscreenExitCount} разів. Після ${CONFIG.MAX_FULLSCREEN_EXITS} виходів тест буде автоматично завершено!`;
            warning.style.display = 'block';
            Utils.showNotification(`Ви вийшли з повноекранного режиму ${this.fullscreenExitCount}/${CONFIG.MAX_FULLSCREEN_EXITS} разів`, 'warning');
        }
    }

    forceFinish() {
        this.isFinished = true;
        this.stopTimer();
        Utils.showNotification(`Тест примусово завершено! Ви вийшли з повноекранного режиму ${this.fullscreenExitCount} разів.`, 'error');
        this.finishOlympiad();
    }

    handleVisibilityChange() {
        if (!this.isFinished) {
            this.pauseTimer();
            Utils.showNotification('Таймер призупинено. Поверніться на сторінку для продовження.', 'warning');
        }
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimerDisplay();
            } else {
                this.nextTask();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    pauseTimer() { this.stopTimer(); }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = Utils.formatTime(this.timeRemaining);
            if (this.timeRemaining < 300) {
                timerElement.style.background = 'linear-gradient(135deg, var(--danger), var(--danger-dark))';
                timerElement.classList.add('pulse');
            } else if (this.timeRemaining < 600) {
                timerElement.style.background = 'linear-gradient(135deg, var(--warning), var(--warning-dark))';
            }
        }
    }

    nextTask() {
        this.saveCurrentTaskAnswers();
        this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);
        
        if (this.currentTask < this.totalTasks) {
            this.currentTask++;
            this.timeRemaining = CONFIG.TASK_TIME;
            this.showTask(this.currentTask);
            this.startTimer();
            Utils.showSuccess(`Перехід до завдання ${this.currentTask}`);
        } else {
            this.finishOlympiad();
        }
    }

    showTask(taskNumber) {
        if (this.isFinished && !this.viewMode) return;
        
        this.currentTask = taskNumber;
        
        document.querySelectorAll('.task-section').forEach(task => { task.style.display = 'none'; });
        const currentTaskElement = document.getElementById(`task${taskNumber}`);
        if (currentTaskElement) {
            currentTaskElement.style.display = 'block';
            currentTaskElement.classList.add('active');
        }
        
        this.updateNavigation(taskNumber);
        this.loadTaskAnswers(taskNumber);
    }

    updateNavigation(taskNumber) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn1 = document.getElementById('nextBtn1');
        const nextBtn2 = document.getElementById('nextBtn2');
        const finishBtn = document.getElementById('finishBtn');

        // Глобальна кнопка "Назад"
        if (prevBtn) {
            prevBtn.style.display = taskNumber > 1 ? 'block' : 'none';
            prevBtn.onclick = () => this.previousTask();
        }

        // Кнопки для task1
        const task1Controls = document.getElementById('task1Controls');
        if (task1Controls) task1Controls.style.display = taskNumber === 1 ? 'flex' : 'none';
        
        // Кнопки для task2
        const task2Controls = document.getElementById('task2Controls');
        if (task2Controls) task2Controls.style.display = taskNumber === 2 ? 'flex' : 'none';

        // Кнопки для task3
        const task3Controls = document.getElementById('task3Controls');
        if (task3Controls) task3Controls.style.display = taskNumber === 3 ? 'flex' : 'none';

        if (finishBtn) {
            finishBtn.textContent = this.viewMode ? 'Завершити перегляд' : 'Завершити олімпіаду';
            finishBtn.onclick = () => this.finishOlympiad();
        }
    }

    previousTask() {
        if (this.currentTask > 1) {
            this.saveCurrentTaskAnswers();
            this.currentTask--;
            this.showTask(this.currentTask);
        }
    }

    saveCurrentTaskAnswers() {
        this.answers[`task${this.currentTask}`] = this.getTaskAnswers(this.currentTask);
    }

    loadTaskAnswers(taskNumber) {
        const savedAnswers = this.answers[`task${taskNumber}`] || {};
        const taskElement = document.getElementById(`task${taskNumber}`);
        if (!taskElement) return;

        taskElement.querySelectorAll('select, input, textarea').forEach(element => {
            const id = element.id;
            if (savedAnswers[id]) element.value = savedAnswers[id];
            
            if (this.viewMode) {
                element.disabled = true;
                element.style.opacity = '0.7';
                element.style.cursor = 'not-allowed';
            } else {
                element.disabled = false;
                element.style.opacity = '1';
                element.style.cursor = 'auto';
            }
        });
    }

    getTaskAnswers(taskNumber) {
        const answers = {};
        const taskElement = document.getElementById(`task${taskNumber}`);
        if (!taskElement) return answers;
        taskElement.querySelectorAll('select, input, textarea').forEach(element => {
            answers[element.id] = element.value;
        });
        return answers;
    }


    enterFullscreen() {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(error => {});
        }
    }

    finishOlympiad() {
        if (this.isFinished && !this.viewMode) return;
        
        if (this.viewMode) {
            this.showResults();
            Utils.showSuccess('Перегляд завершено.');
            return;
        }

        this.isFinished = true;
        this.stopTimer();
        this.saveCurrentTaskAnswers();
        
        if (document.fullscreenElement) { document.exitFullscreen().catch(console.log); }
        
        this.saveResults();
        this.showResults();
        
        Utils.showSuccess('Олімпіаду завершено! Результати збережено. 🎉');
    }

    saveResults() {
        const currentUser = DataStorage.getCurrentUser();
        if (!currentUser) return;

        const progress = DataStorage.getProgress();
        const score = this.calculateScore();
        const score12 = Utils.calculate12PointScore(score, CONFIG.MAX_SCORE);
        this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);

        progress[currentUser.id] = {
            completed: true,
            timestamp: new Date().toISOString(),
            timeSpent: this.totalTimeSpent,
            fullscreenExits: this.fullscreenExitCount,
            score: score,
            score12: score12,
            answers: this.answers
        };
        DataStorage.saveProgress(progress);
    }

    calculateScore() {
        let score = 0;
        const answers = this.answers;

        // Завдання 1: 12 питань (12 балів)
        if (answers.task1) {
            for (let i = 1; i <= 12; i++) {
                const key = `t1s${i}`;
                if (answers.task1[key] && answers.task1[key].toLowerCase() === CONFIG.CORRECT_ANSWERS.task1[key].toLowerCase()) {
                    score += 1;
                }
            }
        }
        
        // Завдання 2: 12 питань (12 балів)
        if (answers.task2) {
            // MC (6 питань)
            Object.keys(CONFIG.CORRECT_ANSWERS.task2).forEach(id => {
                if (answers.task2[id] && answers.task2[id].toUpperCase() === CONFIG.CORRECT_ANSWERS.task2[id].toUpperCase()) {
                    score += 1;
                }
            });
            // Короткі відповіді (6 питань) - Перевірка лише на наявність відповіді
            const shortAnswers = ['r2q1', 'r2q3', 'r2q5', 'r2q7', 'r2q9', 'r2q11'];
            shortAnswers.forEach(id => {
                if (answers.task2[id] && answers.task2[id].trim().length > 2) {
                    score += 1;
                }
            });
        }
        
        // Завдання 3: 10 питань (10 балів) - Перевірка лише на наявність відповіді
        if (answers.task3) {
            for (let i = 1; i <= 10; i++) {
                const key = `t3q${i}`;
                if (answers.task3[key] && answers.task3[key].trim().length > 10) {
                    score += 1;
                }
            }
        }
        
        return Math.min(score, CONFIG.MAX_SCORE);
    }

    showResults() {
        const resultsScreen = document.getElementById('resultsScreen');
        const tasksContainer = document.getElementById('tasks');
        
        if (resultsScreen && tasksContainer) {
            tasksContainer.style.display = 'none';
            resultsScreen.style.display = 'block';
            resultsScreen.classList.add('fade-in');
            this.displayResults();
        }
    }

    displayResults() {
        const resultsContent = document.getElementById('resultsContent');
        const currentUser = DataStorage.getCurrentUser();
        const progress = DataStorage.getProgress();
        const userProgress = progress[currentUser.id] || {score: 0, score12: 0, timeSpent: 0, fullscreenExits: 0, timestamp: new Date().toISOString()};
        
        if (!resultsContent) return;

        resultsContent.innerHTML = `
            <div class="header-section">
                <div class="logo">🎉</div>
                <h1>Олімпіаду завершено!</h1>
                <p class="subtitle">Ваші результати збережено в системі</p>
            </div>
            <div class="stats-grid" style="margin: 40px 0;">
                <div class="stat-card glass-card">
                    <div class="stat-number">${userProgress.score}/${CONFIG.MAX_SCORE}</div>
                    <div class="stat-label">Сирі бали</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-number">${userProgress.score12}/12</div>
                    <div class="stat-label">12-бальна система</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-number">${Utils.formatTime(userProgress.timeSpent)}</div>
                    <div class="stat-label">Витрачено часу</div>
                </div>
                <div class="stat-card glass-card">
                    <div class="stat-number">${userProgress.fullscreenExits}</div>
                    <div class="stat-label">Виходи з повноекрану</div>
                </div>
            </div>
            <div class="glass-card" style="padding: 30px; margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin-bottom: 20px; text-align: center;">📊 Детальна інформація</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div><strong>👤 Учень:</strong> ${currentUser.name}</div>
                    <div><strong>🏫 Клас:</strong> ${currentUser.class}</div>
                    <div><strong>🔢 Номер учня:</strong> ${currentUser.studentNumber}</div>
                    <div><strong>📅 Дата завершення:</strong> ${new Date(userProgress.timestamp).toLocaleString('uk-UA')}</div>
                </div>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <button id="viewAnswersBtn" class="btn-primary" style="padding: 15px 30px; font-size: 1.1rem;">
                    📝 Переглянути свої відповіді
                </button>
            </div>
            <div class="glass-card" style="padding: 30px; margin-top: 20px;">
                <h3 style="color: var(--accent); margin-bottom: 20px; text-align: center;">📞 Надішліть ваші результати</h3>
                <p style="text-align: center; color: var(--text-secondary); font-size: 0.95rem;">
                    Надішліть скріншот цієї сторінки або вкажіть ваш номер учня (<strong>${currentUser.studentNumber}</strong>) та результати.
                </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <button id="backToHomeBtn" class="btn-secondary" style="padding: 12px 24px;">
                    ← Повернутися на головну
                </button>
            </div>
        `;

        document.getElementById('viewAnswersBtn').addEventListener('click', () => { this.enableViewMode(); });
        document.getElementById('backToHomeBtn').addEventListener('click', () => { window.location.href = 'index.html'; });
    }

    enableViewMode() {
        this.viewMode = true;
        document.getElementById('tasks').style.display = 'block';
        document.getElementById('resultsScreen').style.display = 'none';
        this.showTask(1);
        this.addBackToResultsButton();
        Utils.showSuccess('Режим перегляду увімкнено. Відповіді заблоковані.');
        
        // Приховати всі кнопки навігації, окрім "Назад"
        document.querySelectorAll('.task-controls button').forEach(btn => {
            if (btn.id !== 'backToResultsBtn') {
                btn.style.display = 'none';
            }
        });

        // Показати стрілки переходу між завданнями
        document.getElementById('prevBtn').style.display = 'block';
        document.getElementById('task1Controls').style.display = 'flex';
        document.getElementById('task2Controls').style.display = 'flex';
        document.getElementById('task3Controls').style.display = 'flex';
    }

    addBackToResultsButton() {
        const taskHeader = document.querySelector('.task-navigation');
        if (taskHeader && !document.getElementById('backToResultsBtn')) {
            const backBtn = document.createElement('button');
            backBtn.id = 'backToResultsBtn';
            backBtn.textContent = '← До результатів';
            backBtn.className = 'btn-secondary';
            backBtn.style.padding = '12px 20px';
            backBtn.addEventListener('click', () => {
                this.viewMode = false;
                this.showResults();
            });
            taskHeader.querySelector('div:last-child').prepend(backBtn);
        }
    }
}

// 🚀 Головний клас додатку
class EnglishOlympiadApp {
    constructor() {
        this.olympiadManager = null;
    }

    init() {
        this.checkCurrentPage();
        this.setupGlobalEventListeners();
        console.log('🎯 English Olympiad App initialized');
    }

    checkCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('admin.html')) {
            this.initAdminPage();
        } else if (path.includes('student.html')) {
            this.initStudentPage();
        } else if (path.includes('index.html') || path === '/') {
            this.initMainPage();
        }
    }

    setupGlobalEventListeners() {
        document.body.classList.add('fade-in');
    }

    initMainPage() {
        this.setupModeSelection();
        this.setupLoginForms();
        this.addRippleEffects();
    }

    addRippleEffects() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                Utils.createRipple(e);
            });
        });
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                Utils.createRipple(e);
            });
        });
    }

    setupModeSelection() {
        document.querySelectorAll('.mode-card[data-mode]').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = card.getAttribute('data-mode');
                this.showLoginForm(mode);
            });
        });
    }

    setupLoginForms() {
        document.getElementById('studentLoginBtn').addEventListener('click', () => { this.handleStudentLogin(); });
        document.getElementById('adminLoginBtn').addEventListener('click', () => { this.handleAdminLogin(); });
        document.getElementById('backFromStudentBtn').addEventListener('click', () => { this.showMainMenu(); });
        document.getElementById('backFromAdminBtn').addEventListener('click', () => { this.showMainMenu(); });
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
    }

    showLoginForm(mode) {
        const modeSelector = document.getElementById('modeSelector');
        const studentLogin = document.getElementById('studentLogin');
        const adminLogin = document.getElementById('adminLogin');
        
        if (!modeSelector || !studentLogin || !adminLogin) {
            console.error("Критична помилка DOM: Не знайдено елементи modeSelector, studentLogin або adminLogin. Перевірте index.html!");
            return;
        }

        modeSelector.style.display = 'none';
        
        if (mode === 'student') {
            studentLogin.style.display = 'block';
            adminLogin.style.display = 'none';
            document.getElementById('studentLoginInput').focus();
        } else {
            adminLogin.style.display = 'block';
            studentLogin.style.display = 'none';
            document.getElementById('adminLoginInput').focus();
        }
    }

    handleStudentLogin() {
        const login = document.getElementById('studentLoginInput').value.trim();
        const password = document.getElementById('studentPasswordInput').value.trim();
        
        if (!login || !password) { Utils.showError('studentError', 'Будь ласка, заповніть всі обов\'язкові поля'); return; }
        
        const users = DataStorage.getUsers();
        const user = users.find(u => u.login === login && u.password === password);
        if (user) {
            DataStorage.setCurrentUser(user);
            Utils.showSuccess(`Ласкаво просимо, ${user.name}!`);
            setTimeout(() => { window.location.href = 'student.html'; }, 1000);
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
            
            DataStorage.setAdminAuthenticated(true);
            Utils.showSuccess('Адмін панель завантажується...');
            
            setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
        } else {
            Utils.showError('adminError', 'Неавторизований доступ. Перевірте облікові дані.');
        }
    }

    initAdminPage() {
        if (!DataStorage.isAdminAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }
        this.setupAdminPanel();
        Utils.showSuccess('Адмін панель активована');
    }

    setupAdminPanel() {
        this.addRippleEffects();
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => { this.switchAdminTab(tab.getAttribute('data-tab')); });
        });
        document.getElementById('createUserBtn').addEventListener('click', () => { this.createUser(); });
        document.getElementById('userSearch').addEventListener('input', (e) => { this.filterUsers(e.target.value); });
        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            DataStorage.setAdminAuthenticated(false);
            window.location.href = 'index.html';
        });
        this.updateUsersList();
        this.updateStats();
        // Робимо глобальною функцію видалення для onclick
        window.app.deleteUser = this.deleteUser.bind(this);
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
        const name = document.getElementById('newUserName').value.trim();
        const studentClass = document.getElementById('newUserClass').value;
        const group = document.getElementById('newUserGroup').value.trim();
        
        if (!name) { Utils.showNotification('Будь ласка, введіть ім\'я учня', 'warning'); return; }
        
        const login = Utils.generateLogin(name);
        const password = Utils.generatePassword();
        
        const newUser = { id: Date.now(), name, class: studentClass, group: group || '', login, password, studentNumber: null, created: new Date().toLocaleString('uk-UA') };
        const users = DataStorage.getUsers();
        users.push(newUser);
        
        if (DataStorage.saveUsers(users)) {
            this.showCreatedCredentials(newUser);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserGroup').value = '';
            this.updateStats();
            Utils.showSuccess('Користувача створено успішно!');
        } else {
            Utils.showNotification('Помилка при створенні користувача', 'error');
        }
    }

    showCreatedCredentials(user) {
        const credentialsBox = document.getElementById('createdCredentials');
        const credentialsInfo = document.getElementById('credentialsInfo');
        if (!credentialsBox || !credentialsInfo) return;
            
        credentialsInfo.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
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
                Utils.showSuccess('Дані скопійовано в буфер обміну');
            };
        }
    }

    updateUsersList(users = DataStorage.getUsers()) {
        const container = document.getElementById('usersListContainer');
        if (!container) return;
        
        if (users.length === 0) {
            container.innerHTML = `<div class="glass-card" style="text-align: center; padding: 50px; color: var(--text-secondary);"><div style="font-size: 4rem; margin-bottom: 20px;">📝</div><h3 style="margin-bottom: 15px; color: var(--text-primary);">Користувачів ще не створено</h3><p>Створіть першого користувача у вкладці "Створити користувача"</p></div>`;
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
                <div class="user-item glass-card">
                    <div>${user.name}</div>
                    <div>${user.class} клас</div>
                    <div>${user.studentNumber ? `<span class="student-number-badge">${user.studentNumber}</span>` : '<span class="status-badge inactive">НЕАКТИВНО</span>'}</div>
                    <div><code>${user.login}</code></div>
                    <div><code>${user.password}</code></div>
                    <div>${user.studentNumber ? '<span class="status-badge active">АКТИВНИЙ</span>' : '<span class="status-badge inactive">НЕАКТИВНИЙ</span>'}</div>
                    <div><button class="btn-danger" onclick="app.deleteUser(${user.id})">🗑️ Видалити</button></div>
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
        this.updateUsersList(filtered);
    }

    deleteUser(userId) {
        if (confirm('Ви впевнені, що хочете видалити цього користувача? Цю дію не можна скасувати.')) {
            const users = DataStorage.getUsers();
            const updatedUsers = users.filter(user => user.id !== userId);
            
            if (DataStorage.saveUsers(updatedUsers)) {
                this.updateUsersList();
                this.updateStats();
                Utils.showSuccess('Користувача видалено');
            } else {
                Utils.showNotification('Помилка при видаленні користувача', 'error');
            }
        }
    }

    updateStats() {
        const users = DataStorage.getUsers();
        const stats = {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.studentNumber !== null).length,
            class9Users: users.filter(u => u.class == 9).length,
            class10Users: users.filter(u => u.class == 10).length,
            class11Users: users.filter(u => u.class == 11).length
        };
        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) { element.textContent = value; }
        });
    }

    initStudentPage() {
        const currentUser = DataStorage.getCurrentUser();
        if (!currentUser) { window.location.href = 'index.html'; return; }

        this.updateStudentInterface(currentUser);
        this.setupStudentEventListeners();
        
        // Перевірка, чи олімпіада вже завершена
        const progress = DataStorage.getProgress();
        if (progress[currentUser.id] && progress[currentUser.id].completed) {
            this.olympiadManager = new OlympiadManager();
            this.olympiadManager.answers = progress[currentUser.id].answers || {};
            document.getElementById('intro').style.display = 'none';
            document.getElementById('tasks').style.display = 'none';
            this.olympiadManager.showResults();
        } else {
            Utils.showSuccess(`Ласкаво просимо, ${currentUser.name}! Готові до олімпіади?`);
        }
    }

    updateStudentInterface(user) {
        const studentInfo = document.getElementById('studentInfo');
        if (studentInfo) {
            studentInfo.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div style="text-align: center;"><div style="font-size: 3rem; margin-bottom: 10px;">👤</div><div style="font-weight: 700; color: var(--text-primary);">${user.name}</div><div style="color: var(--text-secondary); font-size: 0.9rem;">Учень</div></div>
                    <div style="text-align: center;"><div style="font-size: 3rem; margin-bottom: 10px;">🏫</div><div style="font-weight: 700; color: var(--text-primary);">${user.class}</div><div style="color: var(--text-secondary); font-size: 0.9rem;">Клас</div></div>
                    <div style="text-align: center;"><div style="font-size: 3rem; margin-bottom: 10px;">🔢</div><div style="font-weight: 700; color: var(--accent);">${user.studentNumber}</div><div style="color: var(--text-secondary); font-size: 0.9rem;">Номер</div></div>
                    <div style="text-align: center;"><div style="font-size: 3rem; margin-bottom: 10px;">📊</div><div style="font-weight: 700; color: var(--success);">Готовий</div><div style="color: var(--text-secondary); font-size: 0.9rem;">Статус</div></div>
                </div>
            `;
        }
    }

    setupStudentEventListeners() {
        this.addRippleEffects();
        
        document.getElementById('startBtn').addEventListener('click', () => { this.startOlympiad(); });
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Вийти з системи?')) {
                DataStorage.clearCurrentUser();
                window.location.href = 'index.html';
            }
        });

        // Навігація між завданнями
        const manager = () => this.olympiadManager;
        document.getElementById('nextBtn1').addEventListener('click', () => { if (manager()) manager().nextTask(); });
        document.getElementById('nextBtn2').addEventListener('click', () => { if (manager()) manager().nextTask(); });
        document.getElementById('prevBtn2').addEventListener('click', () => { if (manager()) manager().previousTask(); });
        document.getElementById('prevBtn3').addEventListener('click', () => { if (manager()) manager().previousTask(); });
        document.getElementById('finishBtn').addEventListener('click', () => { if (manager()) manager().finishOlympiad(); });
        document.getElementById('prevBtn').addEventListener('click', () => { if (manager()) manager().previousTask(); });
    }

    startOlympiad() {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('tasks').style.display = 'block';
        
        this.olympiadManager = new OlympiadManager();
        this.olympiadManager.init();
        this.olympiadManager.enterFullscreen();
    }
}

// 🚀 ІНІЦІАЛІЗАЦІЯ ДОДАТКУ (ФІНАЛЬНЕ ВИПРАВЛЕННЯ)
let app; 

document.addEventListener('DOMContentLoaded', () => {
    app = new EnglishOlympiadApp();
    app.init(); 
    window.app = app; // Робимо глобально доступним

    console.log('🎯 English Olympiad System loaded successfully!');
});
