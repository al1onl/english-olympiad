// Глобальна конфігурація
const CONFIG = {
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",
    TASK_TIME: 20 * 60, // 20 хвилин у секундах
    MAX_FULLSCREEN_EXITS: 7,
    MAX_SCORE: 34
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

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static calculate12PointScore(rawScore, maxScore) {
        return Math.round((rawScore / maxScore) * 12);
    }
}

// Клас для управління олімпіадою
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
    }

    startTimer() {
        this.stopTimer();
        this.startTime = Date.now();
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

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = Utils.formatTime(this.timeRemaining);
            
            if (this.timeRemaining < 300) {
                timerElement.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
            }
        }
    }

    nextTask() {
        if (this.currentTask < this.totalTasks) {
            this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);
            this.currentTask++;
            this.timeRemaining = CONFIG.TASK_TIME;
            this.showTask(this.currentTask);
            this.startTimer();
        } else {
            this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);
            this.finishOlympiad();
        }
    }

    showTask(taskNumber) {
        if (this.isFinished && !this.viewMode) return;
        
        // Приховати всі завдання
        for (let i = 1; i <= this.totalTasks; i++) {
            const taskElement = document.getElementById(`task${i}`);
            if (taskElement) {
                taskElement.style.display = 'none';
            }
        }
        
        // Показати поточне завдання
        const currentTaskElement = document.getElementById(`task${taskNumber}`);
        if (currentTaskElement) {
            currentTaskElement.style.display = 'block';
        }
        
        // Оновити навігацію
        this.updateNavigation(taskNumber);
    }

    updateNavigation(taskNumber) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn1 = document.getElementById('nextBtn1');
        const nextBtn2 = document.getElementById('nextBtn2');
        
        if (prevBtn) {
            prevBtn.style.display = taskNumber > 1 ? 'block' : 'none';
        }

        // Оновити текст кнопок "Далі"
        if (nextBtn1 && taskNumber === 1) {
            nextBtn1.textContent = 'Перейти до наступного завдання →';
        }
        if (nextBtn2 && taskNumber === 2) {
            nextBtn2.textContent = 'Перейти до наступного завдання →';
        }
    }

    handleFullscreenExit() {
        if (this.isFinished) return;
        
        this.fullscreenExitCount++;
        this.stopTimer();
        
        if (this.fullscreenExitCount >= CONFIG.MAX_FULLSCREEN_EXITS) {
            this.forceFinish();
        } else {
            this.showFullscreenWarning();
            // Автоматично повернути в повноекранний режим
            setTimeout(() => {
                this.enterFullscreen();
            }, 2000);
        }
    }

    showFullscreenWarning() {
        const warning = document.getElementById('fullscreenWarning');
        if (warning) {
            warning.textContent = `Увага! Ви вийшли з повноекранного режиму ${this.fullscreenExitCount} разів. Після ${CONFIG.MAX_FULLSCREEN_EXITS} виходів тест буде автоматично завершено!`;
            warning.style.display = 'block';
            setTimeout(() => {
                warning.style.display = 'none';
            }, 5000);
        }
    }

    enterFullscreen() {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.log);
        }
    }

    forceFinish() {
        this.isFinished = true;
        this.stopTimer();
        alert(`Тест примусово завершено! Ви вийшли з повноекранного режиму ${this.fullscreenExitCount} разів.`);
        this.finishOlympiad();
    }

    finishOlympiad() {
        this.isFinished = true;
        this.stopTimer();
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Зберегти результати
        this.saveResults();
        
        // Показати результати
        this.showResults();
    }

    saveResults() {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) return;

        const progress = JSON.parse(localStorage.getItem('olympiad_progress')) || {};
        const score = this.calculateScore();
        const score12 = Utils.calculate12PointScore(score, CONFIG.MAX_SCORE);
        
        progress[currentUser.id] = {
            completed: true,
            timestamp: new Date().toISOString(),
            timeSpent: this.totalTimeSpent,
            fullscreenExits: this.fullscreenExitCount,
            score: score,
            score12: score12,
            answers: this.collectAnswers(),
            tasks: {
                task1: this.getTaskAnswers(1),
                task2: this.getTaskAnswers(2),
                task3: this.getTaskAnswers(3)
            }
        };
        
        localStorage.setItem('olympiad_progress', JSON.stringify(progress));
    }

    calculateScore() {
        let score = 0;
        
        // Завдання 1: 12 питань
        const correctTask1 = {
            t1s1: 'synthesis', t1s2: 'short-sighted', t1s3: 'sporadic',
            t1s4: 'limitations', t1s5: 'detached', t1s6: 'overly',
            t1s7: 'nuance', t1s8: 'clarify', t1s9: 'ambiguous',
            t1s10: 'spurious', t1s11: 'inequalities', t1s12: 'adaptive'
        };
        
        for (let i = 1; i <= 12; i++) {
            const select = document.getElementById(`t1s${i}`);
            if (select && select.value === correctTask1[`t1s${i}`]) {
                score += 1;
            }
        }
        
        // Завдання 2: 12 питань
        const correctTask2 = {
            r2q2: 'C', r2q4: 'A', r2q6: 'A', r2q8: 'A', r2q10: 'A', r2q12: 'A'
        };
        
        Object.keys(correctTask2).forEach(id => {
            const element = document.getElementById(id);
            if (element && element.value === correctTask2[id]) {
                score += 1;
            }
        });
        
        // Короткі відповіді завдання 2
        const shortAnswers = ['r2q1', 'r2q3', 'r2q5', 'r2q7', 'r2q9', 'r2q11'];
        shortAnswers.forEach(id => {
            const input = document.getElementById(id);
            if (input && input.value.trim().length > 5) {
                score += 1;
            }
        });
        
        // Завдання 3: 10 питань
        for (let i = 1; i <= 10; i++) {
            const input = document.getElementById(`t3q${i}`);
            if (input && input.value.trim().length > 10) {
                score += 1;
            }
        }
        
        return Math.min(score, CONFIG.MAX_SCORE);
    }

    collectAnswers() {
        const answers = {};
        
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
        const tasksContainer = document.getElementById('tasks');
        
        if (resultsScreen && tasksContainer) {
            tasksContainer.style.display = 'none';
            resultsScreen.style.display = 'block';
            this.displayResults();
        }
    }

    displayResults() {
        const resultsContent = document.getElementById('resultsContent');
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const progress = JSON.parse(localStorage.getItem('olympiad_progress')) || {};
        const userProgress = progress[currentUser.id];
        
        if (!resultsContent || !userProgress) return;
        
        resultsContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">🎉 Ваші результати 🎉</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0;">
                    <div class="stat-card" style="background: var(--primary-light); padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--accent);">${userProgress.score}/${CONFIG.MAX_SCORE}</div>
                        <div style="color: var(--text-secondary);">Сирі бали</div>
                    </div>
                    <div class="stat-card" style="background: var(--primary-light); padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--accent);">${userProgress.score12}/12</div>
                        <div style="color: var(--text-secondary);">12-бальна система</div>
                    </div>
                    <div class="stat-card" style="background: var(--primary-light); padding: 20px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--accent);">${Utils.formatTime(userProgress.timeSpent)}</div>
                        <div style="color: var(--text-secondary);">Витрачено часу</div>
                    </div>
                </div>
                
                <div style="background: var(--primary-dark); padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Учень:</strong> ${currentUser.name}</p>
                    <p><strong>Клас:</strong> ${currentUser.class}</p>
                    <p><strong>Номер учня:</strong> ${currentUser.studentNumber}</p>
                    <p><strong>Дата завершення:</strong> ${new Date(userProgress.timestamp).toLocaleString('uk-UA')}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
                <button id="viewAnswersBtn" class="btn-primary" style="padding: 12px 24px;">
                    📝 Переглянути свої відповіді
                </button>
            </div>
            
            <div style="background: var(--primary-light); padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid var(--border);">
                <h4 style="margin-bottom: 15px; color: var(--accent);">📞 Надішліть ваші результати організатору:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div>
                        <p><strong>Telegram:</strong></p>
                        <code style="background: var(--primary-dark); padding: 8px 12px; border-radius: 6px; display: inline-block;">@nacodexx</code>
                    </div>
                    <div>
                        <p><strong>Discord:</strong></p>
                        <code style="background: var(--primary-dark); padding: 8px 12px; border-radius: 6px; display: inline-block;">in.kyiv</code>
                    </div>
                </div>
                <p style="margin-top: 15px; color: var(--text-secondary); font-size: 0.9rem;">
                    Надішліть скріншот цієї сторінки або вкажіть ваш номер учня (${currentUser.studentNumber}) та результати.
                </p>
            </div>
        `;

        // Додати обробник для перегляду відповідей
        document.getElementById('viewAnswersBtn').addEventListener('click', () => {
            this.enableViewMode();
        });
    }

    enableViewMode() {
        this.viewMode = true;
        this.isFinished = true;
        
        // Блокуємо всі поля введення
        document.querySelectorAll('input, select').forEach(element => {
            element.disabled = true;
        });
        
        // Показуємо навігацію для перегляду
        document.getElementById('tasks').style.display = 'block';
        document.getElementById('resultsScreen').style.display = 'none';
        
        // Показуємо перше завдання
        this.showTask(1);
        
        // Оновлюємо кнопки навігації для режиму перегляду
        this.updateNavigationForViewMode();
        
        // Додаємо кнопку повернення до результатів
        this.addBackToResultsButton();
    }

    updateNavigationForViewMode() {
        const nextBtn1 = document.getElementById('nextBtn1');
        const nextBtn2 = document.getElementById('nextBtn2');
        const finishBtn = document.getElementById('finishBtn');
        
        if (nextBtn1) nextBtn1.textContent = 'Наступне завдання →';
        if (nextBtn2) nextBtn2.textContent = 'Наступне завдання →';
        if (finishBtn) finishBtn.textContent = 'Завершити перегляд';
    }

    addBackToResultsButton() {
        const taskHeader = document.querySelector('.task-header');
        if (taskHeader) {
            const backBtn = document.createElement('button');
            backBtn.textContent = '← До результатів';
            backBtn.className = 'btn-secondary';
            backBtn.style.marginRight = '15px';
            backBtn.addEventListener('click', () => {
                this.showResults();
            });
            
            taskHeader.querySelector('div').prepend(backBtn);
        }
    }
}

// Головний клас додатку
class EnglishOlympiadApp {
    constructor() {
        this.olympiadManager = null;
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
            if (!user.studentNumber) {
                user.studentNumber = Utils.generateStudentNumber();
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

        this.updateStudentInterface(currentUser);
        this.setupStudentEventListeners();
    }

    updateStudentInterface(user) {
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

    setupStudentEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startOlympiad());
        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('Вийти з системи?')) {
                localStorage.removeItem('current_user');
                window.location.href = 'index.html';
            }
        });

        // Навігація між завданнями
        document.getElementById('nextBtn1').addEventListener('click', () => this.olympiadManager.nextTask());
        document.getElementById('nextBtn2').addEventListener('click', () => this.olympiadManager.nextTask());
        document.getElementById('prevBtn2').addEventListener('click', () => this.olympiadManager.showTask(1));
        document.getElementById('prevBtn3').addEventListener('click', () => this.olympiadManager.showTask(2));
        document.getElementById('finishBtn').addEventListener('click', () => this.olympiadManager.finishOlympiad());
        document.getElementById('backToHomeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Глобальна кнопка "Назад"
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.olympiadManager && this.olympiadManager.currentTask > 1) {
                this.olympiadManager.showTask(this.olympiadManager.currentTask - 1);
            }
        });

        // Відстеження повноекранного режиму
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && this.olympiadManager && !this.olympiadManager.isFinished) {
                this.olympiadManager.handleFullscreenExit();
            }
        });
    }

    startOlympiad() {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('tasks').style.display = 'block';
        
        // Ініціалізація менеджера олімпіади
        this.olympiadManager = new OlympiadManager();
        this.olympiadManager.showTask(1);
        this.olympiadManager.startTimer();
        
        // Запуск повноекранного режиму
        this.olympiadManager.enterFullscreen();
    }
}

// Ініціалізація додатку
let app = new EnglishOlympiadApp();
window.app = app;
