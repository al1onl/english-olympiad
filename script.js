/**
 * =====================================
 * ФАЙЛ: script.js (ПОВНИЙ ТА ВИПРАВЛЕНИЙ КОД З КОНТЕНТОМ ОЛІМПІАДИ)
 * =====================================
 */

// Глобальні об'єкти Firebase ініціалізовані в index.html: app, auth, db

class OlympiadApp {
    constructor() {
        console.log("OlympiadApp ініціалізується...");

        // 1. DOM Елементи
        this.dom = this.getDOMElements();
        
        // 2. Змінні стану
        this.adminCodeword = "test2024"; // КОДОВЕ СЛОВО АДМІНА!
        this.currentTaskIndex = 0;
        this.timer = null;
        this.studentAnswers = {}; // Тут зберігаємо відповіді студента

        // 3. СТРУКТУРА ДАНИХ ОЛІМПІАДИ (На основі наданого контенту)
        // Всього 3 завдання. Сумарний час: 400 * 3 = 1200 секунд (20 хвилин)
        this.OLYMPIAD_DATA = [
            { 
                id: 1, 
                name: "Reading & Vocabulary", 
                points: 12, 
                type: 'reading_comprehension',
                duration: 400, // Час в секундах
                instructions: 'Прочитайте текст і виконайте 12 завдань на розуміння тексту та словниковий запас. (Контент заглушка)',
                questions: [
                    { id: 't1q1', text: '1. Which statement best summarizes the main idea of the text?', placeholder: 'Ваша відповідь...' },
                    { id: 't1q2', text: '2. The word "ubiquitous" in paragraph 2 is closest in meaning to:', placeholder: 'Ваш варіант...' },
                    { id: 't1q3', text: '3. What caused the decline of the industry mentioned in paragraph 4?', placeholder: 'Ваша відповідь...' },
                    { id: 't1q4', text: '4. Question 4 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q5', text: '5. Question 5 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q6', text: '6. Question 6 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q7', text: '7. Question 7 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q8', text: '8. Question 8 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q9', text: '9. Question 9 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q10', text: '10. Question 10 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q11', text: '11. Question 11 (Placeholder)', placeholder: 'Ваша відповідь...' },
                    { id: 't1q12', text: '12. Question 12 (Placeholder)', placeholder: 'Ваша відповідь...' }
                ]
            },
            { 
                id: 2, 
                name: "Word Formation (Prefixes/Suffixes)", 
                points: 10,
                type: 'word_formation',
                duration: 400,
                instructions: 'Утворіть слово, яке логічно відповідає змісту речення, використовуючи корінь у дужках.',
                questions: [
                    { id: 't2q1', text: '1. The project suffered from serious **(ORGANIZE)**.', placeholder: 'Ваше слово (наприклад, DISORGANIZATION)' },
                    { id: 't2q2', text: '2. She behaved with great **(MATURE)** for her age.', placeholder: 'Ваше слово...' },
                    { id: 't2q3', text: '3. His **(RESIST)** to authority caused problems.', placeholder: 'Ваше слово...' },
                    { id: 't2q4', text: '4. I think your theory is completely **(LOGIC)**.', placeholder: 'Ваше слово...' },
                    { id: 't2q5', text: '5. The **(CONSTRUCT)** of the new bridge will take two years.', placeholder: 'Ваше слово...' },
                    { id: 't2q6', text: '6. It was a completely **(EXPECTED)** event.', placeholder: 'Ваше слово...' },
                    { id: 't2q7', text: '7. Her **(DEDICATE)** to the job was impressive.', placeholder: 'Ваше слово...' },
                    { id: 't2q8', text: '8. The main **(ADVANTAGE)** of the plan is the cost.', placeholder: 'Ваше слово...' },
                    { id: 't2q9', text: '9. His explanation was rather **(CONVINCE)**.', placeholder: 'Ваше слово...' },
                    { id: 't2q10', text: '10. We need to focus on **(SUSTAIN)** development.', placeholder: 'Ваше слово...' }
                ] 
            },
            { 
                id: 3, 
                name: "Use of English (Sentence Rewriting)", 
                points: 10,
                type: 'sentence_rewriting',
                duration: 400,
                instructions: 'Завершіть друге речення так, щоб воно мало таке ж значення, як і перше, використовуючи слово у дужках, і не змінюючи його. Використовуйте від 2 до 5 слів.',
                questions: [
                    { id: 't3q1', text: '1. I wish I hadn\'t sold my old car. (REGRET)', placeholder: 'I ______ selling my old car.' },
                    { id: 't3q2', text: '2. She finds it difficult to meet new people. (EASE)', placeholder: 'She does not ______ meeting new people.' },
                    { id: 't3q3', text: '3. It\'s possible that the match will be cancelled. (BE)', placeholder: 'The match ______ cancelled.' },
                    { id: 't3q4', text: '4. I haven\'t seen John since the party. (LAST)', placeholder: 'The last time ______ the party.' },
                    { id: 't3q5', text: '5. The police still haven\'t found the stolen jewellery. (YET)', placeholder: 'The police ______ the stolen jewellery.' },
                    { id: 't3q6', text: '6. I didn\'t want to go to the meeting, but I had to. (RATHER)', placeholder: 'I would ______ to the meeting.' },
                    { id: 't3q7', text: '7. Could you possibly help me with this box? (MIND)', placeholder: 'Do ______ me with this box?' },
                    { id: 't3q8', text: '8. I\'ve never read such a good book before. (BEST)', placeholder: 'This is the ______ read.' },
                    { id: 't3q9', text: '9. It\'s impossible to finish on time without help. (ABLE)', placeholder: 'You won\'t ______ finish on time without help.' },
                    { id: 't3q10', text: '10. The teacher insisted on early submission. (DEMAND)', placeholder: 'The teacher ______ submit it early.' }
                ]
            }
        ];

        // 4. Ініціалізація слухачів подій
        this.initEventListeners();
        
        // 5. Перевірка статусу автентифікації Firebase
        this.setupAuthListener();

        // Початковий вигляд
        this.showView('mainView');
    }

    /**
     * ====================================================
     * ЧАСТИНА 1: ІНІЦІАЛІЗАЦІЯ ТА ПЕРЕМИКАННЯ ВИГЛЯДІВ
     * ====================================================
     */

    getDOMElements() {
        return {
            // Основні View
            mainView: document.getElementById('mainView'),
            studentAppView: document.getElementById('studentAppView'),
            adminAppView: document.getElementById('adminAppView'),

            // Селектор режиму
            modeSelector: document.getElementById('modeSelector'),

            // Вхід
            studentLogin: document.getElementById('studentLogin'),
            adminLogin: document.getElementById('adminLogin'),
            studentLoginForm: document.getElementById('studentLoginForm'),
            adminLoginForm: document.getElementById('adminLoginForm'),
            studentError: document.getElementById('studentError'),
            adminError: document.getElementById('adminError'),
            
            // Студентський додаток
            studentLogoutBtn: document.getElementById('studentLogoutBtn'),
            startOlympiadBtn: document.getElementById('startOlympiadBtn'),
            studentIntro: document.getElementById('studentIntro'),
            studentTasks: document.getElementById('studentTasks'),
            studentResults: document.getElementById('studentResults'),
            introUserName: document.getElementById('introUserName'),
            introUserInfo: document.getElementById('introUserInfo'),
            
            // Таймер та навігація завдань
            timerDisplay: document.getElementById('timerDisplay'),
            prevTaskBtn: document.getElementById('prevTaskBtn'),
            nextTaskBtn: document.getElementById('nextTaskBtn'),
            finishOlympiadBtn: document.getElementById('finishOlympiadBtn'),
            taskContentContainer: document.getElementById('taskContentContainer'),

            // Адмін-панель
            adminLogoutBtn: document.getElementById('adminLogoutBtn'),
            adminTabs: document.querySelectorAll('.tabs .tab'),
            statsPanel: document.getElementById('statsPanel'),
            usersPanel: document.getElementById('usersPanel'),
            createPanel: document.getElementById('createPanel'),
            createUserForm: document.getElementById('createUserForm'),
            createdCredentials: document.getElementById('createdCredentials'),
            copyCredentialsBtn: document.getElementById('copyCredentialsBtn'),
            resultsTableBody: document.getElementById('resultsTableBody'),
            
            // Статистика
            totalUsers: document.getElementById('totalUsers'),
            completedUsers: document.getElementById('completedUsers'),
            activeUsers: document.getElementById('activeUsers'),
            class10Users: document.getElementById('class10Users'),

            // Загальне
            allViews: [
                document.getElementById('mainView'),
                document.getElementById('studentAppView'),
                document.getElementById('adminAppView')
            ].filter(el => el !== null), 
            notificationArea: document.getElementById('notificationArea')
        };
    }

    initEventListeners() {
        this.dom.modeSelector?.addEventListener('click', this.handleModeSelection.bind(this));

        document.querySelectorAll('[data-action="backToMain"]').forEach(button => {
            button.addEventListener('click', this.resetToMain.bind(this));
        });

        this.dom.studentLoginForm?.addEventListener('submit', this.handleStudentLogin.bind(this));
        this.dom.adminLoginForm?.addEventListener('submit', this.handleAdminLogin.bind(this));

        this.dom.studentLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.adminLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.studentResults?.querySelector('#resultsLogoutBtn')?.addEventListener('click', this.logout.bind(this));
        
        this.dom.adminTabs?.forEach(tab => {
            tab.addEventListener('click', this.handleAdminTabSwitch.bind(this));
        });

        this.dom.createUserForm?.addEventListener('submit', this.handleCreateUser.bind(this));
        
        this.dom.startOlympiadBtn?.addEventListener('click', this.startOlympiad.bind(this));

        this.dom.prevTaskBtn?.addEventListener('click', () => this.navigateTask(-1));
        this.dom.nextTaskBtn?.addEventListener('click', () => this.navigateTask(1));
        this.dom.finishOlympiadBtn?.addEventListener('click', this.finishOlympiad.bind(this));
    }
    
    showView(viewId) {
        this.dom.allViews.forEach(view => {
            view.classList.add('hidden');
        });
        
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    }
    
    resetToMain() {
        this.showView('mainView');
        this.dom.studentLogin.classList.add('hidden');
        this.dom.adminLogin.classList.add('hidden');
        this.dom.studentError.classList.add('hidden');
        this.dom.adminError.classList.add('hidden');
        if (this.timer) {
             clearInterval(this.timer);
             this.timer = null;
        }
    }

    handleModeSelection(e) {
        const modeButton = e.target.closest('button');
        if (!modeButton) return;

        const mode = modeButton.dataset.mode;
        if (mode) {
            this.showLoginForm(mode);
        }
    }

    showLoginForm(mode) {
        this.dom.mainView.classList.add('hidden');
        this.dom.studentLogin.classList.add('hidden');
        this.dom.adminLogin.classList.add('hidden');
        
        if (mode === 'student') {
            this.dom.studentLogin.classList.remove('hidden');
        } else if (mode === 'admin') {
            this.dom.adminLogin.classList.remove('hidden');
        }
    }

    showNotification(message, type = 'success') {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification notification-${type}`;
        notificationDiv.textContent = message;
        
        this.dom.notificationArea.appendChild(notificationDiv);
        
        setTimeout(() => {
            notificationDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notificationDiv.classList.remove('show');
            setTimeout(() => {
                notificationDiv.remove();
            }, 500);
        }, 4000);
    }

    /**
     * ====================================================
     * ЧАСТИНА 2: АВТЕНТИФІКАЦІЯ 
     * ====================================================
     */
    
    setupAuthListener() {
        if (typeof auth === 'undefined') {
            console.error("Firebase Auth не визначено. Перевірте конфігурацію в index.html.");
            return;
        }
        auth.onAuthStateChanged(user => {
            if (user) {
                this.loadUserProfile(user);
            } else {
                this.showView('mainView');
                this.dom.studentAppView.classList.add('hidden');
                this.dom.adminAppView.classList.add('hidden');
            }
        });
    }

    async loadUserProfile(user) {
        if (typeof db === 'undefined') return;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    this.showView('adminAppView');
                    this.loadAdminData();
                } else {
                    this.showView('studentAppView');
                    this.renderStudentIntro(userData);
                }
            } else {
                this.showNotification("Помилка: Профіль не знайдено. Зверніться до адміністратора.", "error");
                this.logout();
            }
        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
            this.showNotification("Помилка завантаження профілю.", "error");
            this.logout();
        }
    }

    async handleStudentLogin(e) {
        e.preventDefault();
        const email = this.dom.studentLoginForm.querySelector('#studentLoginInput').value;
        const password = this.dom.studentLoginForm.querySelector('#studentPasswordInput').value;
        
        this.dom.studentError.classList.add('hidden');
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            let message = "Невірний логін або пароль.";
            this.dom.studentError.textContent = message;
            this.dom.studentError.classList.remove('hidden');
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        const email = this.dom.adminLoginForm.querySelector('#adminLoginInput').value;
        const password = this.dom.adminLoginForm.querySelector('#adminPasswordInput').value;
        const codeword = this.dom.adminLoginForm.querySelector('#adminCodeWord').value;
        
        this.dom.adminError.classList.add('hidden');
        
        if (codeword !== this.adminCodeword) {
            this.dom.adminError.textContent = "Невірне кодове слово.";
            this.dom.adminError.classList.remove('hidden');
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            let message = "Невірний логін або пароль адміністратора.";
            this.dom.adminError.textContent = message;
            this.dom.adminError.classList.remove('hidden');
        }
    }

    logout() {
        auth.signOut().then(() => {
            this.showNotification("Ви успішно вийшли.", "success");
            this.resetToMain();
        }).catch(error => {
            console.error("Помилка виходу:", error);
            this.showNotification("Помилка виходу.", "error");
        });
    }


    /**
     * ====================================================
     * ЧАСТИНА 3: СТУДЕНТСЬКИЙ ДОДАТОК (ОЛІМПІАДА)
     * ====================================================
     */

    renderStudentIntro(userData) {
        this.dom.introUserName.textContent = `Вітаємо, ${userData.name}!`;
        this.dom.introUserInfo.innerHTML = `
            <p><strong>ПІБ:</strong> ${userData.name}</p>
            <p><strong>Клас:</strong> ${userData.class}</p>
            <p><strong>Логін:</strong> ${userData.email}</p>
            <p style="margin-top: 15px; color: var(--warning); font-weight: bold;">
                Статус: ${userData.completed ? 'Завершено' : 'Очікує старту'}
            </p>
        `;
        
        if (userData.completed) {
            this.dom.startOlympiadBtn.disabled = true;
            this.dom.startOlympiadBtn.textContent = '✅ Олімпіаду вже завершено';
            this.showResultsScreen(userData.rawScore);
        } else {
            this.dom.startOlympiadBtn.disabled = false;
            this.dom.startOlympiadBtn.textContent = '🔥 Розпочати Олімпіаду';
            this.dom.studentTasks.classList.add('hidden');
            this.dom.studentIntro.classList.remove('hidden');
            this.dom.studentResults.classList.add('hidden');
        }
    }
    
    startOlympiad() {
        if (confirm("Ви впевнені, що готові розпочати? Час піде одразу!")) {
            this.dom.studentIntro.classList.add('hidden');
            this.dom.studentTasks.classList.remove('hidden');
            
            this.showNotification("Олімпіада розпочата! Час пішов.", "success");
            
            // Ініціалізація відповідей
            this.studentAnswers = {};
            this.OLYMPIAD_DATA.forEach(task => {
                task.questions.forEach(q => {
                    this.studentAnswers[q.id] = "";
                });
            });

            this.loadTasksAndStartTimer();
        }
    }
    
    loadTasksAndStartTimer() {
        const totalDuration = this.OLYMPIAD_DATA.reduce((sum, task) => sum + task.duration, 0); 
        
        this.renderTask(0); 
        this.startTaskTimer(totalDuration); 
    }

    saveCurrentAnswer(questionId, value) {
        this.studentAnswers[questionId] = value.trim(); 
    }

    loadTaskContent(task) {
        const contentHTML = task.questions.map(q => {
            const currentAnswer = this.studentAnswers[q.id] || '';
            
            let inputTag = `<input type="text" id="${q.id}" class="answer-input" placeholder="${q.placeholder}" value="${currentAnswer}">`;
            
            return `
                <div class="question-block">
                    <p class="question-text">${q.text}</p>
                    ${inputTag}
                </div>
            `;
        }).join('');

        this.dom.taskContentContainer.innerHTML = `
            <div class="task-info">
                <p class="subtitle" style="text-align: left; margin-bottom: 5px;">
                    Завдання №${task.id}: ${task.name}
                </p>
                <p class="subtitle" style="text-align: left; font-style: italic; margin-bottom: 20px;">
                    Інструкції: ${task.instructions}
                </p>
                <p style="text-align: left; margin-bottom: 15px;">
                    Балів за завдання: <strong>${task.points}</strong> (${task.questions.length} питань)
                </p>
            </div>
            ${contentHTML}
        `;
        
        task.questions.forEach(q => {
            const inputElement = document.getElementById(q.id);
            if (inputElement) {
                inputElement.addEventListener('input', (e) => {
                    this.saveCurrentAnswer(q.id, e.target.value);
                });
            }
        });
    }
    
    renderTask(index) {
        if (index < 0 || index >= this.OLYMPIAD_DATA.length) return;

        const task = this.OLYMPIAD_DATA[index];
        this.loadTaskContent(task);
        
        this.currentTaskIndex = index;

        this.dom.studentTasks.querySelector('h2').textContent = `Завдання ${index + 1} / ${this.OLYMPIAD_DATA.length}`;

        this.dom.prevTaskBtn.disabled = index === 0;
        
        const isLastTask = index === this.OLYMPIAD_DATA.length - 1;
        this.dom.nextTaskBtn.classList.toggle('hidden', isLastTask);
        this.dom.finishOlympiadBtn.classList.toggle('hidden', !isLastTask);
    }
    
    navigateTask(delta) {
        this.renderTask(this.currentTaskIndex + delta);
    }

    async finishOlympiad() {
        if (!confirm("Ви впевнені, що хочете завершити олімпіаду? Ви не зможете повернутися!")) return;
        
        clearInterval(this.timer);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Користувач не автентифікований.");

            const totalScore = 0; 
            
            await db.collection('users').doc(user.uid).update({
                answers: this.studentAnswers,
                completed: true,
                rawScore: totalScore, 
                submissionTime: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showNotification("Олімпіада завершена. Ваші відповіді надіслані.", "success");
            this.showResultsScreen(totalScore);

        } catch (error) {
            console.error("Помилка завершення олімпіади:", error);
            this.showNotification(`Помилка: Не вдалося надіслати відповіді. ${error.message}`, "error");
        }
    }

    showResultsScreen(finalScore) {
        this.dom.studentIntro.classList.add('hidden');
        this.dom.studentTasks.classList.add('hidden');
        this.dom.studentResults.classList.remove('hidden');
        
        const totalMaxScore = this.OLYMPIAD_DATA.reduce((sum, task) => sum + task.points, 0);

        this.dom.studentResults.querySelector('#resultsContent').innerHTML = `
            <h2>Ваші попередні результати</h2>
            <div class="stats-grid" style="grid-template-columns: 1fr;">
                 <div class="stat-card" style="border-top-color: var(--warning);">
                    <div class="stat-number score-final">${finalScore} / ${totalMaxScore}</div>
                    <div class="stat-label">Отриманий Бал (Очікує фінальної перевірки)</div>
                </div>
            </div>
            <p style="margin-top: 30px;">
                Ваші відповіді були успішно збережені. Фінальні результати будуть затверджені адміністратором після перевірки.
            </p>
        `;
    }
    
    startTaskTimer(durationSeconds) {
        let timer = durationSeconds, minutes, seconds;
        clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.dom.timerDisplay.textContent = minutes + ":" + seconds;
            
            this.dom.timerDisplay.classList.remove('warning', 'critical');
            if (timer <= 300) { 
                this.dom.timerDisplay.classList.add('warning');
            } else if (timer <= 60) {
                 this.dom.timerDisplay.classList.add('critical');
            }
            
            if (--timer < 0) {
                clearInterval(this.timer);
                this.dom.timerDisplay.textContent = "00:00";
                this.showNotification("Час вичерпано! Завдання автоматично завершено.", "danger");
                this.finishOlympiad();
            }
        }, 1000);
    }
    
    /**
     * ====================================================
     * ЧАСТИНА 4: АДМІН-ПАНЕЛЬ (ЗАГЛУШКИ)
     * ====================================================
     */
     
    async loadAdminData() {
        this.showNotification("Дані адміністратора завантажено.", "success");
        this.renderStatsPlaceholder();
        this.loadResultsTable();
    }
    
    handleAdminTabSwitch(e) {
        const tab = e.target.closest('.tab');
        if (!tab) return;
        const tabId = tab.dataset.tab;
        
        this.dom.adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        this.dom.statsPanel.classList.add('hidden');
        this.dom.usersPanel.classList.add('hidden');
        this.dom.createPanel.classList.add('hidden');
        
        document.getElementById(`${tabId}Panel`).classList.remove('hidden');
        
        if (tabId === 'users') {
            this.loadResultsTable();
        }
    }
    
    renderStatsPlaceholder() {
        this.dom.totalUsers.textContent = 55;
        this.dom.activeUsers.textContent = 12;
        this.dom.completedUsers.textContent = 23;
        this.dom.class10Users.textContent = 30;
    }
    
    loadResultsTable() {
        const placeholderResults = [
            { id: 1, name: "Іванов Іван", class: 11, email: "ivanov.i@olymp.com", final: 12, status: 'Completed' },
            { id: 2, name: "Петренко Катерина", class: 10, email: "petr.k@olymp.com", final: 11, status: 'Completed' },
            { id: 3, name: "Сидорук Олег", class: 10, email: "syd.o@olymp.com", final: 8, status: 'Completed' },
            { id: 4, name: "Ковальчук Вікторія", class: 11, email: "kov.v@olymp.com", final: '-', status: 'In Progress' },
        ];
        
        this.dom.resultsTableBody.innerHTML = placeholderResults.map((res) => `
            <tr>
                <td>${res.id}</td>
                <td>${res.name}</td>
                <td>${res.class}</td>
                <td>${res.email}</td>
                <td><span class="score-badge">${res.final}</span></td>
                <td><span class="status-badge ${res.status === 'Completed' ? 'success' : 'warning'}">${res.status}</span></td>
            </tr>
        `).join('');
    }

    async handleCreateUser(e) {
        e.preventDefault();
        const name = this.dom.createUserForm.querySelector('#newUserName').value;
        const className = this.dom.createUserForm.querySelector('#newUserClass').value;
        
        const baseEmail = name.toLowerCase().replace(/ /g, '.');
        const parts = baseEmail.split('.');
        const email = `${parts[0]}.${parts.length > 1 ? parts[1].charAt(0) : ''}@olymp.com`.replace('..', '.');
        const password = Math.random().toString(36).slice(-8);

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            await db.collection('users').doc(uid).set({
                uid: uid,
                name: name,
                class: className,
                email: email,
                role: 'student',
                completed: false,
                answers: {},
                rawScore: 0
            });

            this.dom.createUserForm.reset();
            this.showNotification(`Успішно створено учня: ${name}`, "success");
            this.renderCreatedCredentials(name, email, password);

        } catch (error) {
            console.error("Помилка створення учня:", error);
            this.showNotification(`Помилка створення: ${error.message}`, "error");
        }
    }
    
    renderCreatedCredentials(name, email, password) {
        this.dom.createdCredentials.classList.remove('hidden');
        document.getElementById('credentialsInfo').innerHTML = `
            <p><strong>Ім'я:</strong> ${name}</p>
            <p><strong>Логін (Email):</strong> <code id="copyEmail">${email}</code></p>
            <p><strong>Пароль:</strong> <code id="copyPassword">${password}</code></p>
        `;
        
        this.dom.copyCredentialsBtn.onclick = () => {
            const textToCopy = `Учень: ${name}\nЛогін: ${email}\nПароль: ${password}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification("Дані скопійовано!", "success");
            }).catch(err => {
                console.error('Помилка копіювання: ', err);
            });
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof firebase !== 'undefined' && typeof firebase.initializeApp !== 'undefined') {
        window.olympiadApp = new OlympiadApp();
    } else {
        console.error("Firebase не ініціалізовано. Перевірте <script> теги в index.html.");
    }
});
