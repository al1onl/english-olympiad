// 🎯 Глобальна конфігурація системи
const CONFIG = {
    // --- Аутентифікація Адміна ---
    ADMIN_LOGIN: "admin",
    ADMIN_PASSWORD: "admin123", 
    ADMIN_CODE_WORD: "olympiad2024",

    // --- Параметри Олімпіади ---
    TASK_TIME: 20 * 60, // 20 хвилин у секундах на кожне завдання
    MAX_FULLSCREEN_EXITS: 7, // Максимально дозволена кількість виходів з повноекранного режиму
    MAX_SCORE: 34, // Максимально можлива кількість балів (12+12+10)

    // --- Правильні Відповіді (Ключі для автоматичної перевірки) ---
    // Всі відповіді у нижньому регістрі для нечутливості до регістру
    CORRECT_ANSWERS: {
        // Завдання 1: Лексичні трансформації (12 балів)
        task1: {
            t1s1: 'synthesis', t1s2: 'short-sighted', t1s3: 'sporadic',
            t1s4: 'limitations', t1s5: 'detached', t1s6: 'overly',
            t1s7: 'nuance', t1s8: 'clarify', t1s9: 'ambiguous',
            t1s10: 'spurious', t1s11: 'inequalities', t1s12: 'adaptive'
        },
        // Завдання 2: Читання (6 балів за вибір)
        task2: {
            r2q2: 'C', r2q4: 'A', r2q6: 'A', r2q8: 'A', r2q10: 'A', r2q12: 'A'
        }
        // Завдання 3: Перетворення ключових слів (10 балів) - не перевіряється автоматично.
    },
    
    // --- Структура завдань (шаблон HTML) ---
    TASKS_CONTENT: [
        null, // Індекс 0 порожній для відповідності номеру завдання 1, 2, 3
        { 
            title: "Завдання 1. Lexical and Grammatical Transformations (12 балів)",
            description: "Доповніть речення, змінивши слова у дужках на правильну форму.",
            html: `
                <div class="task-content">
                    <div class="question-block"><p class="question-text">1. The article requires a careful ____________ of all the sources. (SYNTHESIZE)</p><input type="text" id="t1s1" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">2. Her constant focus on minor details made her look ____________. (SHORT-SIGHT)</p><input type="text" id="t1s2" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">3. The sightings of the rare bird were ____________ and difficult to confirm. (SPORADICALLY)</p><input type="text" id="t1s3" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">4. Every technological advance brings with it certain ____________. (LIMIT)</p><input type="text" id="t1s4" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">5. He maintained a professional, almost ____________ attitude during the meeting. (DETACH)</p><input type="text" id="t1s5" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">6. We found the speaker to be ____________ concerned with public image. (OVER)</p><input type="text" id="t1s6" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">7. She spoke about the subtle ____________ of the poem. (NUANCED)</p><input type="text" id="t1s7" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">8. Could you please ____________ your position on this matter? (CLARITY)</p><input type="text" id="t1s8" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">9. His language was often ____________, leaving room for misinterpretation. (AMBIGUITY)</p><input type="text" id="t1s9" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">10. They dismissed the findings as ____________ data from a biased source. (SPUR)</p><input type="text" id="t1s10" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">11. The report highlighted growing social and economic ____________. (EQUAL)</p><input type="text" id="t1s11" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">12. An ____________ strategy is essential in a changing market. (ADAPT)</p><input type="text" id="t1s12" class="answer-input" placeholder="Ваша відповідь"></div>
                </div>
            `
        },
        { 
            title: "Завдання 2. Читання та розуміння тексту (12 балів)",
            description: "Прочитайте текст і дайте відповіді на 12 питань (6 - вибір відповіді, 6 - коротка відповідь).",
            html: `
                <div class="text-for-reading card-content">
                    <h3 style="margin-bottom: 15px; color: var(--accent);">The Curious Case of Collective Intelligence</h3>
                    <p>Collective intelligence, the ability of a group to make decisions or solve problems better than any single member, has long fascinated scientists. The classic example is the "wisdom of crowds," where the average guess of a large group is often startlingly close to the truth, even if individual guesses are wildly inaccurate. This phenomenon relies on three key elements: diversity of opinion, independence of members, and decentralization of knowledge. When these conditions are met, errors tend to cancel each other out.</p>
                    <p>However, collective intelligence is not foolproof. When crowds lack independence—for instance, if members influence each other's opinions, leading to herd mentality—the wisdom quickly turns into foolishness. Furthermore, groups often fail when the problem is complex or requires deep, specialized knowledge, rather than a simple aggregation of common sense. The challenge is not merely to gather people, but to structure their interaction in a way that maximizes diversity while ensuring constructive synthesis of ideas.</p>
                </div>

                <div class="task-content">
                    <div class="question-block"><p class="question-text">1. What is the classic example of collective intelligence mentioned in the text? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q1" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">3. What is the primary risk if crowds lack independence? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q3" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block"><p class="question-text">5. What does the text suggest is the main challenge of collective intelligence? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q5" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block">
                        <p class="question-text">2. What is the purpose of collective intelligence? (Вибір - 1 бал)</p>
                        <select id="r2q2" class="answer-select"><option value="">Оберіть варіант</option><option value="A">To simplify complex problems for a single member.</option><option value="B">To ensure individual guesses are always accurate.</option><option value="C">To solve problems better than any single member.</option></select>
                    </div>
                    <div class="question-block">
                        <p class="question-text">4. What is one of the key elements that collective intelligence relies on? (Вибір - 1 бал)</p>
                        <select id="r2q4" class="answer-select"><option value="">Оберіть варіант</option><option value="A">Diversity of opinion.</option><option value="B">Centralization of knowledge.</option><option value="C">Unanimity of thought.</option></select>
                    </div>
                    <div class="question-block">
                        <p class="question-text">6. What happens when members influence each other's opinions? (Вибір - 1 бал)</p>
                        <select id="r2q6" class="answer-select"><option value="">Оберіть варіант</option><option value="A">The wisdom of crowds turns into foolishness.</option><option value="B">The collective knowledge is deepened.</option><option value="C">Independence of members is maximized.</option></select>
                    </div>
                    <div class="question-block"><p class="question-text">7. What is required for the "wisdom of crowds" to work? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q7" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block">
                        <p class="question-text">8. The term 'decentralization' in the text refers to: (Вибір - 1 бал)</p>
                        <select id="r2q8" class="answer-select"><option value="">Оберіть варіант</option><option value="A">Spreading knowledge among many members.</option><option value="B">Giving power to a single, central leader.</option><option value="C">The process of making errors cancel out.</option></select>
                    </div>
                    <div class="question-block"><p class="question-text">9. When do groups often fail? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q9" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block">
                        <p class="question-text">10. The word 'foolproof' most closely means: (Вибір - 1 бал)</p>
                        <select id="r2q10" class="answer-select"><option value="">Оберіть варіант</option><option value="A">Infallible.</option><option value="B">Complicated.</option><option value="C">Transparent.</option></select>
                    </div>
                    <div class="question-block"><p class="question-text">11. What is the process that allows errors to cancel out? (Коротка відповідь - 1 бал)</p><input type="text" id="r2q11" class="answer-input" placeholder="Ваша відповідь"></div>
                    <div class="question-block">
                        <p class="question-text">12. What kind of problem is *not* easily solved by simple crowd aggregation? (Вибір - 1 бал)</p>
                        <select id="r2q12" class="answer-select"><option value="">Оберіть варіант</option><option value="A">One requiring deep, specialized knowledge.</option><option value="B">One requiring a simple common sense aggregation.</option><option value="C">One where opinions are diverse.</option></select>
                    </div>
                </div>
            `
        },
        { 
            title: "Завдання 3. Перетворення ключових слів (10 балів)",
            description: "Перефразуйте речення так, щоб воно мало те саме значення, використовуючи надане слово у незмінній формі (максимум 5 слів, включаючи надане).",
            html: `
                <div class="task-content">
                    <div class="question-block"><p class="question-text">1. The accident was caused by his failure to stop. (DID)</p><input type="text" id="t3q1" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">2. We won't be able to finish on time. (POSSIBLE)</p><input type="text" id="t3q2" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">3. It's difficult to see how we can proceed. (EASY)</p><input type="text" id="t3q3" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">4. They only started to cooperate after the crisis. (UNTIL)</p><input type="text" id="t3q4" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">5. She finally realized how serious the situation was. (CAME)</p><input type="text" id="t3q5" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">6. He regrets not having said goodbye to her. (WISHES)</p><input type="text" id="t3q6" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">7. They cancelled the match because of the bad weather. (CALLED)</p><input type="text" id="t3q7" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">8. I found the meeting rather boring. (DID)</p><input type="text" id="t3q8" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">9. It's impossible to finish on time without help. (ABLE)</p><input type="text" id="t3q9" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                    <div class="question-block"><p class="question-text">10. The teacher insisted on early submission. (DEMAND)</p><input type="text" id="t3q10" class="answer-input" placeholder="Напишіть перефразоване речення..."></div>
                </div>
            `
        }
    ]
};

// 🛠️ Утиліти для роботи з DOM та даними
class Utils {
    static getEl(id) { return document.getElementById(id); }
    static hide(element) { if(element) element.classList.add('hidden'); }
    static show(element) { if(element) element.classList.remove('hidden'); }

    static showError(elementId, message) {
        const element = Utils.getEl(elementId);
        if (element) {
            element.textContent = message;
            Utils.show(element);
            setTimeout(() => { Utils.hide(element); }, 5000);
        }
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const icon = icons[type] || icons.info;
        notification.innerHTML = `<div style="display: flex; align-items: center;"><span style="font-size: 1.2rem; margin-right: 10px;">${icon}</span><span>${message}</span></div>`;
        document.body.appendChild(notification);
        setTimeout(() => { notification.classList.add('show'); }, 50);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => { if (notification.parentNode) { notification.parentNode.removeChild(notification); } }, 400);
        }, 5000);
    }
    static showSuccess(message) { this.showNotification(message, 'success'); }
    static showWarning(message) { this.showNotification(message, 'warning'); }
    
    static generateLogin(name) {
        // Логін: перші 10 символів від об'єднаних слів імені у нижньому регістрі
        const base = name.toLowerCase().split(' ').filter(n => n).join('');
        const users = DataStorage.getUsers();
        let login = base.substring(0, 10);
        let counter = 1;
        while (users.find(user => user.login === login)) { 
            login = base.substring(0, 10 - counter.toString().length) + counter; 
            counter++; 
        }
        return login;
    }

    static generatePassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) { password += chars.charAt(Math.floor(Math.random() * chars.length)); }
        return password;
    }

    static generateStudentNumber() {
        // Генерація унікального 5-значного номера учня
        const users = DataStorage.getUsers();
        const usedNumbers = users.map(u => u.studentNumber).filter(n => n);
        let number;
        do { number = Math.floor(Math.random() * 90000) + 10000; } while (usedNumbers.includes(number));
        return number;
    }

    static formatTime(seconds) {
        const totalSeconds = Math.max(0, seconds); // Запобігаємо від'ємним числам
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    static calculate12PointScore(rawScore, maxScore) {
        // Переведення сирого балу у 12-бальну систему
        const score = Math.round((rawScore / maxScore) * 12);
        return Math.min(Math.max(score, 0), 12);
    }

    static createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) { ripple.remove(); }
        button.appendChild(circle);
    }
}

// 💾 Централізоване сховище даних (LocalStorage)
class DataStorage {
    static getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('olympiad_users')) || [];
            return users;
        } catch (error) { 
            console.error("Error retrieving users from localStorage:", error);
            return []; 
        }
    }

    static saveUsers(users) {
        try {
            localStorage.setItem('olympiad_users', JSON.stringify(users));
            return true;
        } catch (error) { 
            console.error("Error saving users to localStorage:", error);
            return false; 
        }
    }
    
    // --- НОВА ФУНКЦІОНАЛЬНІСТЬ ДЛЯ ЕКСПОРТУ/ІМПОРТУ (ВИПРАВЛЕННЯ БАГУ) ---
    static exportUsers() {
        return JSON.stringify(this.getUsers(), null, 2);
    }

    static importUsers(jsonString) {
        try {
            const importedUsers = JSON.parse(jsonString);
            // Проста перевірка формату
            if (Array.isArray(importedUsers) && importedUsers.every(u => typeof u.name === 'string' && typeof u.login === 'string')) {
                // Зберігаємо нові дані, повністю замінюючи старі
                this.saveUsers(importedUsers); 
                return true;
            }
            return false;
        } catch (error) {
            console.error("Import Error:", error);
            return false;
        }
    }
    // --------------------------------------------------------------------

    static getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('current_user')); } catch (error) { return null; }
    }

    static setCurrentUser(user) {
        // Якщо номер учня ще не згенеровано, генеруємо його тут
        if (!user.studentNumber) {
            user.studentNumber = Utils.generateStudentNumber();
            this.updateUserInDatabase(user);
        }
        localStorage.setItem('current_user', JSON.stringify(user));
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
        console.log("Session Status: Student user logged out."); // Personal touch
    }

    static getProgress() {
        try { return JSON.parse(localStorage.getItem('olympiad_progress')) || {}; } catch (error) { return {}; }
    }

    static saveProgress(progress) {
        try {
            localStorage.setItem('olympiad_progress', JSON.stringify(progress));
            return true;
        } catch (error) { 
            console.error("Error saving progress to localStorage:", error);
            return false; 
        }
    }

    static isAdminAuthenticated() { return localStorage.getItem('admin_authenticated') === 'true'; }

    static setAdminAuthenticated(value) {
        if (value) { 
            localStorage.setItem('admin_authenticated', 'true'); 
            console.log("Session Status: Admin logged in."); // Personal touch
        } else { 
            localStorage.removeItem('admin_authenticated'); 
            console.log("Session Status: Admin logged out."); // Personal touch
        }
    }
}

// 🌐 Маршрутизатор (Router) для SPA
class OlympiadRouter {
    constructor() {
        this.views = {
            main: Utils.getEl('mainView'),
            studentApp: Utils.getEl('studentAppView'),
            adminApp: Utils.getEl('adminAppView')
        };
        this.currentView = 'main';
    }

    renderView(viewName) {
        if (!this.views[viewName]) {
            console.error(`View ${viewName} not found.`);
            return;
        }
        
        // Сховати всі види
        Object.values(this.views).forEach(v => Utils.hide(v));
        
        // Показати потрібний вид
        Utils.show(this.views[viewName]);
        this.currentView = viewName;
    }
}

// ⏱️ Менеджер олімпіади (логіка, відокремлена від UI)
class OlympiadManager {
    constructor(router) {
        this.router = router;
        this.currentUser = DataStorage.getCurrentUser();
        this.currentTask = 1;
        this.totalTasks = CONFIG.TASKS_CONTENT.length - 1;
        this.timeRemaining = CONFIG.TASK_TIME;
        this.timerInterval = null;
        this.isFinished = false;
        this.viewMode = false; // Режим перегляду результатів
        this.fullscreenExitCount = 0;
        this.totalTimeSpent = 0;
        this.answers = {};
        
        // Завантаження прогресу або створення нового
        const progressData = DataStorage.getProgress()[this.currentUser.id] || {};
        this.progress = progressData;
        if (progressData.answers) {
            this.answers = progressData.answers;
            this.totalTimeSpent = progressData.timeSpent || 0;
            this.fullscreenExitCount = progressData.fullscreenExits || 0;
        }
        
        this.setupTaskEvents();
    }
    
    // --- Setup & Start ---
    startOlympiad() {
        const progress = DataStorage.getProgress()[this.currentUser.id];
        if (progress && progress.completed) {
            this.answers = progress.answers;
            this.displayResults();
            return;
        }

        Utils.hide(Utils.getEl('studentIntro'));
        Utils.show(Utils.getEl('studentTasks'));
        
        this.isFinished = false;
        this.currentTask = 1;
        this.timeRemaining = CONFIG.TASK_TIME;
        this.totalTimeSpent = 0;
        this.fullscreenExitCount = 0;
        
        this.showTask(1);
        this.startTimer();
        this.enterFullscreen();
        Utils.showSuccess('Олімпіаду розпочато! Увійдіть у повноекранний режим.');
    }
    
    setupTaskEvents() {
        // Кнопки навігації
        Utils.getEl('prevTaskBtn').addEventListener('click', () => this.previousTask());
        Utils.getEl('nextTaskBtn').addEventListener('click', () => this.nextTask());
        Utils.getEl('finishOlympiadBtn').addEventListener('click', () => this.finishOlympiad());

        // Додатковий професійний дотик: облік змін вхідних даних для збереження
        document.addEventListener('input', (e) => {
            if (e.target.closest('#taskContentContainer') && !this.viewMode) {
                // Зберігаємо відповіді при кожній зміні (на випадок збою)
                this.saveCurrentTaskAnswers();
            }
        });
    }

    // --- Task Navigation & Saving ---
    showTask(taskNumber) {
        this.currentTask = taskNumber;
        const container = Utils.getEl('taskContentContainer');
        const task = CONFIG.TASKS_CONTENT[taskNumber];
        
        if (!task || !container) return;
        
        container.innerHTML = `
            <h2 class="task-title">${task.title}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 30px;">${task.description}</p>
            ${task.html}
        `;
        
        Utils.getEl('currentTaskNum').textContent = taskNumber;
        
        // Оновлення кнопок
        const prevBtn = Utils.getEl('prevTaskBtn');
        const nextBtn = Utils.getEl('nextTaskBtn');
        const finishBtn = Utils.getEl('finishOlympiadBtn');
        
        // 1. Навігація в обох режимах завжди активна, якщо це не перше/останнє завдання
        prevBtn.disabled = (taskNumber === 1);
        
        if (taskNumber === this.totalTasks) {
            Utils.hide(nextBtn);
            Utils.show(finishBtn);

            // Режим перегляду: кнопка "На головну"
            if(this.viewMode) {
                finishBtn.textContent = "← На головну";
                finishBtn.classList.remove('btn-primary');
                finishBtn.classList.add('btn-secondary');
            } else { // Режим тестування: кнопка "Завершити"
                finishBtn.textContent = "Завершити олімпіаду";
                finishBtn.classList.remove('btn-secondary');
                finishBtn.classList.add('btn-primary');
            }
        } else {
            Utils.show(nextBtn);
            Utils.hide(finishBtn);
            
            // Встановлюємо стилі для навігаційних кнопок у режимі перегляду
            if (this.viewMode) {
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('btn-secondary');
            } else {
                nextBtn.classList.remove('btn-secondary');
                nextBtn.classList.add('btn-primary');
            }
        }
        
        this.loadTaskAnswers(taskNumber);
    }
    
    nextTask() {
        if (this.currentTask < this.totalTasks) {
            
            // --- Логіка для Режиму Тестування ---
            if (!this.viewMode) {
                this.saveCurrentTaskAnswers();
                this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);
                this.timeRemaining = CONFIG.TASK_TIME; // Скидаємо таймер
                this.startTimer();
                Utils.showSuccess(`Перехід до завдання ${this.currentTask + 1}`);
            }

            // --- Навігація в Обох Режимах ---
            this.currentTask++;
            this.showTask(this.currentTask);
            
        } else if (this.currentTask === this.totalTasks) {
            if (this.viewMode) {
                 // У режимі перегляду остання кнопка "Завершити" діє як "На головну"
                 DataStorage.clearCurrentUser();
                 Utils.getEl('studentTasks').classList.remove('view-mode');
                 this.router.renderView('main');
            } else {
                this.finishOlympiad();
            }
        }
    }

    previousTask() {
        if (this.currentTask > 1) {
            
            // --- Логіка для Режиму Тестування ---
            if (!this.viewMode) {
                this.saveCurrentTaskAnswers();
            }
            
            // --- Навігація в Обох Режимах ---
            this.currentTask--;
            this.showTask(this.currentTask);
            
            if (!this.viewMode) this.startTimer(); 
        }
    }
    
    saveCurrentTaskAnswers() {
        const answers = {};
        const taskElement = Utils.getEl('taskContentContainer');
        if (!taskElement) return;
        
        taskElement.querySelectorAll('select, input, textarea').forEach(element => {
            answers[element.id] = element.value.trim();
        });
        
        this.answers[`task${this.currentTask}`] = answers;
    }

    loadTaskAnswers(taskNumber) {
        const savedAnswers = this.answers[`task${taskNumber}`] || {};
        const taskElement = Utils.getEl('taskContentContainer');
        
        taskElement.querySelectorAll('select, input, textarea').forEach(element => {
            if (savedAnswers[element.id]) element.value = savedAnswers[element.id];
            
            // Блокування та візуалізація в режимі перегляду
            if (this.viewMode) { 
                element.disabled = true; 
                element.classList.add('view-mode-input');
                
                // Видаляємо попередні підказки та стилі
                element.classList.remove('correct-answer', 'wrong-answer');
                element.parentNode.classList.remove('correct-answer-block', 'wrong-answer-block', 'manual-check-block');
                const existingHint = element.parentNode.querySelector('.correct-hint');
                if (existingHint) existingHint.remove();

                const taskId = `task${taskNumber}`;
                if (CONFIG.CORRECT_ANSWERS[taskId]) {
                    const isSelect = element.tagName.toLowerCase() === 'select';
                    const isAutochecked = CONFIG.CORRECT_ANSWERS[taskId][element.id];
                    
                    if (isAutochecked) {
                         const userAnswer = (isSelect ? element.value.toUpperCase() : element.value.toLowerCase());
                         const correctAnswer = (isSelect ? isAutochecked.toUpperCase() : isAutochecked.toLowerCase());

                         if (userAnswer === correctAnswer) {
                            element.classList.add('correct-answer');
                            element.parentNode.classList.add('correct-answer-block');
                         } else if (userAnswer !== '') {
                            element.classList.add('wrong-answer');
                            element.parentNode.classList.add('wrong-answer-block');
                            
                            // Додаємо правильну відповідь під полем
                            const correctHint = document.createElement('span');
                            correctHint.className = 'correct-hint';
                            correctHint.textContent = `✅ Правильно: ${correctAnswer}`;
                            element.parentNode.appendChild(correctHint);
                         }
                    } else {
                         // Для коротких відповідей
                         element.parentNode.classList.add('manual-check-block');
                    }
                } else if (taskId === 'task3') {
                     // Для завдання 3
                     element.parentNode.classList.add('manual-check-block');
                }

            } else { 
                element.disabled = false; 
                element.classList.remove('view-mode-input');
            }
        });

        // Оновлення відображення таймера в режимі тесту
        if (!this.viewMode) {
             this.updateTimerDisplay();
        } else {
             // Сховати таймер в режимі перегляду
             Utils.hide(Utils.getEl('timerDisplay'));
             // Оновлюємо поведінку кнопки "На головну" (для останнього завдання)
             const finishBtn = Utils.getEl('finishOlympiadBtn');
             if (taskNumber === this.totalTasks && finishBtn && this.viewMode) {
                 finishBtn.onclick = () => {
                     DataStorage.clearCurrentUser();
                     Utils.getEl('studentTasks').classList.remove('view-mode');
                     this.router.renderView('main');
                 };
             }
        }
    }

    // --- Timer & Proctoring ---
    startTimer() {
        if (this.isFinished || this.viewMode) return; 
        
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimerDisplay();
            } else {
                Utils.showWarning(`Час на завдання ${this.currentTask} вийшов.`);
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
        const timerElement = Utils.getEl('timerDisplay');
        if (timerElement) {
            timerElement.textContent = Utils.formatTime(this.timeRemaining);
            // Візуальні попередження
            timerElement.classList.remove('critical', 'warning');
            if (this.timeRemaining < 300) { timerElement.classList.add('critical'); } 
            else if (this.timeRemaining < 600) { timerElement.classList.add('warning'); }
        }
    }
    
    enterFullscreen() {
        // Додаємо слухачі для прокторингу
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Запит на повноекранний режим
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => Utils.showWarning('Для початку олімпіади рекомендується увійти в повноекранний режим.'));
        }
    }

    handleFullscreenChange() {
        if (this.isFinished || this.viewMode) return;

        if (!document.fullscreenElement) { 
            this.handleFullscreenExit(); 
        } else {
            // Повернення до повноекрану
            const warning = Utils.getEl('fullscreenWarning');
            warning.textContent = '';
            Utils.hide(warning);
            this.startTimer();
        }
    }

    handleVisibilityChange() {
        if (this.isFinished || this.viewMode) return;
        
        if (document.hidden) {
             this.stopTimer();
             Utils.showWarning('Тест призупинено. Не перемикайте вкладки/додатки.');
        } else {
             this.startTimer();
             Utils.showSuccess('Тест відновлено.');
        }
    }

    handleFullscreenExit() {
        this.fullscreenExitCount++;
        this.stopTimer();
        
        const warning = Utils.getEl('fullscreenWarning');
        Utils.show(warning);
        warning.innerHTML = `⚠️ Увага! Ви вийшли з повноекранного режиму <span style="font-weight: bold; color: var(--danger);">${this.fullscreenExitCount}</span> разів. Тест призупинено.`;
        
        if (this.fullscreenExitCount >= CONFIG.MAX_FULLSCREEN_EXITS) {
            this.forceFinish();
        } else {
            // Спроба повернути у повноекранний режим через 2 секунди
            setTimeout(() => { 
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => {});
                }
            }, 2000);
        }
    }
    
    forceFinish() {
        this.isFinished = true;
        this.stopTimer();
        Utils.getEl('fullscreenWarning').innerHTML = '🔴 <span style="font-weight: bold;">ТЕСТ ПРИМУСОВО ЗАВЕРШЕНО!</span> Перевищено ліміт виходів.';
        this.finishOlympiad(true);
    }

    // --- Results & Scoring ---
    calculateScore() {
        let score = 0;
        const answers = this.answers;
        
        // Завдання 1 (12 балів - точна відповідність)
        if (answers.task1) {
            Object.keys(CONFIG.CORRECT_ANSWERS.task1).forEach(key => {
                const userAnswer = answers.task1[key];
                const correctAnswer = CONFIG.CORRECT_ANSWERS.task1[key];
                if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) { score += 1; }
            });
        }
        
        // Завдання 2 (6 балів за вибір - точна відповідність)
        if (answers.task2) {
            Object.keys(CONFIG.CORRECT_ANSWERS.task2).forEach(id => {
                const userAnswer = answers.task2[id];
                const correctAnswer = CONFIG.CORRECT_ANSWERS.task2[id];
                if (userAnswer && userAnswer.toUpperCase() === correctAnswer.toUpperCase()) { score += 1; }
            });
            // Завдання 2 (6 балів за коротку відповідь - перевірка лише на наявність тексту)
            const shortAnswers = ['r2q1', 'r2q3', 'r2q5', 'r2q7', 'r2q9', 'r2q11'];
            shortAnswers.forEach(id => {
                if (answers.task2[id] && answers.task2[id].trim().length > 2) { score += 1; }
            });
        }
        
        // Завдання 3 (10 балів - перевірка лише на наявність тексту)
        if (answers.task3) {
            for (let i = 1; i <= 10; i++) {
                const key = `t3q${i}`;
                if (answers.task3[key] && answers.task3[key].trim().length > 10) { score += 1; }
            }
        }
        
        return Math.min(score, CONFIG.MAX_SCORE);
    }
    
    finishOlympiad(forced = false) {
        if (this.isFinished) return;
        this.isFinished = true;
        this.stopTimer();
        this.saveCurrentTaskAnswers();
        
        // Вихід з повноекранного режиму при завершенні
        if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); }
        
        this.saveResults(forced);
        this.displayResults();
    }

    saveResults(forced = false) {
        // Якщо це останнє завдання і час ще залишився, додаємо його до загального часу
        if (!forced && this.currentTask === this.totalTasks && this.timeRemaining > 0) {
            this.totalTimeSpent += (CONFIG.TASK_TIME - this.timeRemaining);
        }
        
        const progress = DataStorage.getProgress();
        const score = this.calculateScore();
        const score12 = Utils.calculate12PointScore(score, CONFIG.MAX_SCORE);
        
        progress[this.currentUser.id] = {
            completed: true,
            timestamp: new Date().toISOString(),
            timeSpent: this.totalTimeSpent,
            fullscreenExits: this.fullscreenExitCount,
            score: score,
            score12: score12,
            answers: this.answers,
            forced: forced
        };
        DataStorage.saveProgress(progress);
        this.progress = progress[this.currentUser.id];
    }
    
    displayResults() {
        Utils.hide(Utils.getEl('studentTasks'));
        Utils.hide(Utils.getEl('studentIntro'));
        Utils.show(Utils.getEl('studentResults'));
        
        const userProgress = this.progress;
        const resultsContent = Utils.getEl('resultsContent');
        
        const forcedMessage = userProgress.forced 
            ? '<div class="forced-message card-content">🔴 Тест був примусово завершений через порушення правил (перевищено ліміт виходів з повноекрану).</div>' 
            : '';

        resultsContent.innerHTML = `
            <div class="header-section" style="text-align: center;">
                <h1>Олімпіаду завершено!</h1>
                <p class="subtitle">Ваші результати збережено в системі</p>
            </div>
            ${forcedMessage}
            <div class="stats-grid" style="margin: 40px 0;">
                <div class="stat-card card-content"><div class="stat-number">${userProgress.score}/${CONFIG.MAX_SCORE}</div><div class="stat-label">Сирі бали</div></div>
                <div class="stat-card card-content"><div class="stat-number score-final">${userProgress.score12}/12</div><div class="stat-label">12-бальна система</div></div>
                <div class="stat-card card-content"><div class="stat-number">${Utils.formatTime(userProgress.timeSpent)}</div><div class="stat-label">Витрачено часу</div></div>
                <div class="stat-card card-content"><div class="stat-number">${userProgress.fullscreenExits}</div><div class="stat-label">Виходи з повноекрану</div></div>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <button id="viewAnswersBtn" class="btn-primary ripple-effect" style="padding: 15px 30px; font-size: 1.1rem;">
                    📝 Переглянути свої відповіді
                </button>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <button id="backToHomeBtn" class="btn-secondary ripple-effect" style="padding: 12px 24px;">
                    ← Повернутися на головну
                </button>
            </div>
        `;

        Utils.getEl('viewAnswersBtn').addEventListener('click', () => { 
            this.viewMode = true;
            Utils.getEl('studentTasks').classList.add('view-mode'); // Додаємо клас для стилів перегляду
            Utils.hide(Utils.getEl('studentResults'));
            Utils.show(Utils.getEl('studentTasks'));
            this.showTask(1);
        });
        Utils.getEl('backToHomeBtn').addEventListener('click', () => { 
            DataStorage.clearCurrentUser();
            Utils.getEl('studentTasks').classList.remove('view-mode');
            this.router.renderView('main');
        });
    }
}

// 🚀 Головний клас додатку
class EnglishOlympiadApp {
    constructor() {
        this.router = new OlympiadRouter();
        this.olympiadManager = null;
    }

    init() {
        // --- Виправлення "Адмін-пастки": Скидаємо адмін-статус, якщо немає активного учня ---
        if (!DataStorage.getCurrentUser() && DataStorage.isAdminAuthenticated()) {
             DataStorage.setAdminAuthenticated(false);
             console.log("Status Reset: Admin session cleared to prevent 'stuck' login.");
        }
        
        this.setupEventListeners();
        this.checkAuthStatus();
        document.body.classList.add('fade-in');
        console.log("App Initialized. Current Status: ", DataStorage.isAdminAuthenticated() ? "Admin" : (DataStorage.getCurrentUser() ? "Student" : "Guest")); // Professional touch
    }
    
    checkAuthStatus() {
        if (DataStorage.isAdminAuthenticated()) {
            this.router.renderView('adminApp');
            this.initAdminApp();
        } else if (DataStorage.getCurrentUser()) {
            this.router.renderView('studentApp');
            this.initStudentApp();
        } else {
            this.router.renderView('main');
        }
    }

    setupEventListeners() {
        // --- Main View & Login ---
        Utils.getEl('mainView').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                Utils.createRipple(e);
                if (button.dataset.mode) {
                    this.showLoginForm(button.dataset.mode);
                } else if (button.dataset.action === 'backToMain') {
                    this.showMainMenu();
                }
            }
        });
        
        Utils.getEl('studentLoginForm').addEventListener('submit', (e) => { 
            e.preventDefault(); 
            this.handleStudentLogin(); 
        });
        
        Utils.getEl('adminLoginForm').addEventListener('submit', (e) => { 
            e.preventDefault(); 
            this.handleAdminLogin(); 
        });
        
        // Додаємо ріпл ефект до всіх кнопок (забезпечуємо, щоб працювало на всіх пристроях)
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', Utils.createRipple);
        });
    }
    
    showLoginForm(mode) {
        Utils.hide(Utils.getEl('modeSelector'));
        Utils.hide(Utils.getEl('studentLogin'));
        Utils.hide(Utils.getEl('adminLogin'));
        
        if (mode === 'student') {
            Utils.show(Utils.getEl('studentLogin'));
            Utils.getEl('studentLoginInput').focus();
        } else {
            Utils.show(Utils.getEl('adminLogin'));
            Utils.getEl('adminLoginInput').focus();
        }
    }
    
    showMainMenu() {
        Utils.show(Utils.getEl('modeSelector'));
        Utils.hide(Utils.getEl('studentLogin'));
        Utils.hide(Utils.getEl('adminLogin'));
    }

    // --- Authentication Handlers ---
    handleStudentLogin() {
        const login = Utils.getEl('studentLoginInput').value.trim();
        const password = Utils.getEl('studentPasswordInput').value.trim();
        
        const user = DataStorage.getUsers().find(u => u.login === login && u.password === password);
        
        if (user) {
            DataStorage.setCurrentUser(user);
            this.router.renderView('studentApp');
            this.initStudentApp();
        } else {
            Utils.showError('studentError', 'Невірний логін або пароль.');
        }
    }

    handleAdminLogin() {
        const login = Utils.getEl('adminLoginInput').value.trim();
        const password = Utils.getEl('adminPasswordInput').value.trim();
        const codeWord = Utils.getEl('adminCodeWord').value.trim();
        
        if (login === CONFIG.ADMIN_LOGIN && password === CONFIG.ADMIN_PASSWORD && codeWord === CONFIG.ADMIN_CODE_WORD) {
            DataStorage.setAdminAuthenticated(true);
            this.router.renderView('adminApp');
            this.initAdminApp();
            Utils.showSuccess('Вхід в адмін-панель успішний!');
        } else {
            Utils.showError('adminError', 'Неавторизований доступ. Перевірте облікові дані та кодове слово.');
        }
    }

    // --- Student App Initialization ---
    initStudentApp() {
        const currentUser = DataStorage.getCurrentUser();
        Utils.getEl('studentNameDisplay').textContent = `Користувач: ${currentUser.name}`;

        const progress = DataStorage.getProgress()[currentUser.id];
        
        // Відображення інформації про учня
        const infoHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 30px; text-align: center;">
                <div><span class="icon-text">🏫</span><div style="font-weight: 700;">${currentUser.class} клас</div></div>
                <div><span class="icon-text">🔢</span><div class="code-badge">${currentUser.studentNumber || 'N/A'}</div></div>
                <div><span class="icon-text">📊</span><div style="font-weight: 700; color: ${progress && progress.completed ? 'var(--success)' : 'var(--warning)'};">${progress && progress.completed ? 'ЗАВЕРШЕНО' : 'ОЧІКУЄ'}</div></div>
            </div>
        `;
        Utils.getEl('introUserInfo').innerHTML = infoHtml;
        Utils.getEl('introUserName').textContent = currentUser.name.split(' ')[0] || 'Учень';
        
        Utils.getEl('studentLogoutBtn').addEventListener('click', () => {
            DataStorage.clearCurrentUser();
            this.router.renderView('main');
        });
        
        Utils.getEl('startOlympiadBtn').addEventListener('click', () => {
            this.olympiadManager = new OlympiadManager(this.router);
            this.olympiadManager.startOlympiad();
        });

        // Показуємо інтро або результати, якщо вже завершено
        if (progress && progress.completed) {
            this.olympiadManager = new OlympiadManager(this.router); 
            Utils.hide(Utils.getEl('studentIntro'));
            this.olympiadManager.displayResults();
        } else {
            Utils.show(Utils.getEl('studentIntro'));
            Utils.hide(Utils.getEl('studentTasks'));
            Utils.hide(Utils.getEl('studentResults'));
        }
    }
    
    // --- Admin App Initialization & New Import/Export Methods ---
    initAdminApp() {
        this.updateStats();
        this.updateUsersList();
        this.updateResultsTable();
        
        // Dynamically inject Import/Export controls into the Users Panel
        const usersPanel = Utils.getEl('usersPanel');
        if (usersPanel && !Utils.getEl('importExportControls')) {
            const controlsHtml = `
                <div id="importExportControls" style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 25px;">
                    <button id="exportUsersBtn" class="btn-secondary ripple-effect" style="flex-grow: 1; min-width: 150px;">
                        ⬇️ Експортувати користувачів
                    </button>
                    <label for="importUsersFile" class="btn-secondary ripple-effect" style="flex-grow: 1; text-align: center; cursor: pointer; padding: 16px 20px; min-width: 150px; font-weight: 700; text-transform: uppercase;">
                        ⬆️ Імпортувати користувачів
                    </label>
                    <input type="file" id="importUsersFile" accept=".json" style="display: none;">
                </div>
                <p class="export-hint">⚠️ Використовуйте 'Експорт' та 'Імпорт' для перенесення списку учнів між різними пристроями.</p>
            `;
            usersPanel.insertAdjacentHTML('afterbegin', controlsHtml);
            
            // Add event listeners for the dynamically created elements
            Utils.getEl('exportUsersBtn').addEventListener('click', (e) => { Utils.createRipple(e); this.exportUsers(); });
            // Add ripple to the custom file input label
            document.querySelector('label[for="importUsersFile"]').addEventListener('click', Utils.createRipple); 

            Utils.getEl('importUsersFile').addEventListener('change', (e) => this.handleImportFile(e));
        }
        
        Utils.getEl('adminLogoutBtn').addEventListener('click', () => {
            DataStorage.setAdminAuthenticated(false);
            this.router.renderView('main');
        });
        
        document.querySelectorAll('.tabs .tab').forEach(tab => {
            tab.addEventListener('click', (e) => { this.switchAdminTab(e.target.dataset.tab); });
        });
        
        Utils.getEl('createUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
        
        Utils.getEl('userSearch').addEventListener('input', (e) => { this.filterUsers(e.target.value); });
    }
    
    // --- НОВІ МЕТОДИ ІМПОРТУ/ЕКСПОРТУ ---
    exportUsers() {
        const usersData = DataStorage.exportUsers();
        const blob = new Blob([usersData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `olympiad_users_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        Utils.showSuccess('Список користувачів експортовано.');
    }
    
    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonString = e.target.result;
            if (DataStorage.importUsers(jsonString)) {
                Utils.showSuccess('Користувачі успішно імпортовані та замінили старий список. Тепер вони доступні на цьому пристрої.');
                this.updateStats();
                this.updateUsersList();
                this.updateResultsTable();
                // Скидаємо інпут, щоб можна було імпортувати той самий файл повторно
                event.target.value = ''; 
            } else {
                Utils.showNotification('Помилка імпорту. Перевірте формат файлу.', 'error');
            }
        };
        reader.readAsText(file);
    }
    // ------------------------------------

    switchAdminTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(panel => Utils.hide(panel));
        
        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
        Utils.show(Utils.getEl(`${tabName}Panel`));
        
        if (tabName === 'users') this.updateUsersList();
        if (tabName === 'stats') {
            this.updateStats();
            this.updateResultsTable();
        }
    }

    createUser() {
        const name = Utils.getEl('newUserName').value.trim();
        const studentClass = Utils.getEl('newUserClass').value;
        
        if (!name) {
            Utils.showNotification('Будь ласка, введіть ПІБ учня.', 'error');
            return;
        }

        const login = Utils.generateLogin(name);
        const password = Utils.generatePassword();
        
        // Використовуємо Date.now() як унікальний ID
        const newUser = { id: Date.now(), name, class: studentClass, login, password, studentNumber: null };
        const users = DataStorage.getUsers();
        users.push(newUser);
        
        if (DataStorage.saveUsers(users)) {
            this.showCreatedCredentials(newUser);
            Utils.getEl('createUserForm').reset();
            this.updateStats();
            this.updateUsersList();
            Utils.showSuccess('Користувача створено успішно! Не забудьте експортувати список для інших пристроїв.');
        }
    }
    
    showCreatedCredentials(user) {
        const credentialsBox = Utils.getEl('createdCredentials');
        const credentialsInfo = Utils.getEl('credentialsInfo');
            
        credentialsInfo.innerHTML = `
            <p><strong>Ім'я:</strong> ${user.name} | <strong>Клас:</strong> ${user.class}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 15px 0; background: var(--input-bg); padding: 15px; border-radius: 4px; border: 1px solid var(--border-color);">
                <div><strong>Логін:</strong> <code class="code-badge">${user.login}</code></div>
                <div><strong>Пароль:</strong> <code class="code-badge">${user.password}</code></div>
            </div>
            <p style="color: var(--warning); font-size: 0.9rem;">Переконайтеся, що ці дані збережені або передані учневі. Вони знадобляться на будь-якому пристрої!</p>
        `;
        Utils.show(credentialsBox);
        
        Utils.getEl('copyCredentialsBtn').onclick = () => {
            // Копіювання у буфер обміну
            navigator.clipboard.writeText(`Логін: ${user.login}, Пароль: ${user.password}`);
            Utils.showSuccess('Дані скопійовано.');
        };
    }
    
    updateStats() {
        const users = DataStorage.getUsers();
        const progress = DataStorage.getProgress();
        const completedCount = Object.values(progress).filter(p => p.completed).length;

        const stats = {
            totalUsers: users.length,
            // Активні - ті, хто отримав номер учня (тобто коли вони вперше увійшли)
            activeUsers: users.filter(u => u.studentNumber !== null).length, 
            completedUsers: completedCount,
            class10Users: users.filter(u => u.class == 10).length // Приклад
        };
        Object.entries(stats).forEach(([id, value]) => {
            const element = Utils.getEl(id);
            if (element) { element.textContent = value; }
        });
    }
    
    updateUsersList(users = DataStorage.getUsers()) {
        const container = Utils.getEl('usersListContainer');
        const progress = DataStorage.getProgress();
        if (!container) return;
        
        if (users.length === 0) {
             container.innerHTML = `<div class="card-content" style="padding: 30px; text-align: center; color: var(--text-secondary);">Користувачів ще немає. Створіть їх або імпортуйте список.</div>`;
             return;
        }

        const header = `<div class="user-item header"><div>Ім'я</div><div>Клас</div><div>Номер</div><div>Логін</div><div>Статус</div><div>Дії</div></div>`;
        
        const listItems = users.map(user => {
            const userProgress = progress[user.id];
            
            let status = 'НЕАКТИВНИЙ';
            let statusClass = 'danger';
            
            if (user.studentNumber) {
                 status = 'АКТИВНИЙ';
                 statusClass = 'warning';
            }
            if (userProgress && userProgress.completed) {
                status = 'ЗАВЕРШЕНО';
                statusClass = 'success';
            }

            return `
                <div class="user-item card-content">
                    <div>${user.name}</div>
                    <div>${user.class}</div>
                    <div class="code-badge">${user.studentNumber || 'N/A'}</div>
                    <div><code class="code-badge">${user.login}</code></div>
                    <div class="status-badge ${statusClass}">${status}</div>
                    <div>
                        <button class="btn-icon btn-danger ripple-effect" onclick="window.app.deleteUser(${user.id})" title="Видалити користувача">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = header + listItems;
        // Робимо глобальною функцію видалення для onclick
        window.app = window.app || {};
        window.app.deleteUser = this.deleteUser.bind(this);
    }
    
    filterUsers(searchTerm) {
        const users = DataStorage.getUsers();
        const term = searchTerm.toLowerCase();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.login.toLowerCase().includes(term) ||
            (user.studentNumber && user.studentNumber.toString().includes(term))
        );
        this.updateUsersList(filtered);
    }

    deleteUser(userId) {
        if (!confirm('Ви впевнені, що хочете видалити цього користувача? Це також видалить його результати.')) return;
        
        const users = DataStorage.getUsers().filter(user => user.id !== userId);
        const progress = DataStorage.getProgress();
        delete progress[userId]; 

        if (DataStorage.saveUsers(users) && DataStorage.saveProgress(progress)) {
            this.updateUsersList();
            this.updateStats();
            this.updateResultsTable();
            Utils.showSuccess('Користувача та його результати видалено.');
        } else {
             Utils.showNotification('Помилка при видаленні користувача.', 'error');
        }
    }
    
    updateResultsTable() {
        const users = DataStorage.getUsers();
        const progress = DataStorage.getProgress();
        const tableBody = Utils.getEl('resultsTableBody');
        
        if (!tableBody) return;
        
        const completedUsers = users
            .map(user => ({ user, progress: progress[user.id] }))
            .filter(item => item.progress && item.progress.completed)
            .sort((a, b) => b.progress.score - a.progress.score); // Сортування за балами
            
        if (completedUsers.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 30px;">Жоден учень ще не завершив олімпіаду.</td></tr>`;
            return;
        }

        tableBody.innerHTML = completedUsers.map((item, index) => {
            const p = item.progress;
            const rank = index + 1;
            
            let statusHtml = p.forced 
                ? `<span class="status-badge danger">Примусово</span>` 
                : `<span class="status-badge success">Завершено</span>`;

            return `
                <tr>
                    <td>${rank}</td>
                    <td>${item.user.name}</td>
                    <td>${item.user.class}</td>
                    <td class="score-badge">${p.score} / ${CONFIG.MAX_SCORE}</td>
                    <td class="score-badge" style="color: var(--accent-primary);">${p.score12} / 12</td>
                    <td>${statusHtml}</td>
                </tr>
            `;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи існує головний елемент 'mainView', щоб уникнути помилок
    if (Utils.getEl('mainView')) {
        window.app = new EnglishOlympiadApp();
        window.app.init();
    } else {
        console.error("The 'mainView' element is missing. HTML structure might be incomplete.");
    }
});
