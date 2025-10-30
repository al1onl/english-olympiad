/**
 * =====================================
 * ФАЙЛ: script.js (ФІНАЛЬНА ВЕРСІЯ ДЛЯ СТРУКТУРИ MPA - index.html, student.html, admin.html)
 * =====================================
 * * ВИПРАВЛЕННЯ: 
 * 1. Фікс помилки `Cannot read properties of undefined (reading 'bind')` шляхом використання 
 * опціонального ланцюжка (`?.`) та перевірок існування DOM-елементів.
 * 2. Рефакторинг логіки для роботи в трьох окремих HTML-файлах (MPA).
 * 3. Повна інтеграція динамічної пагінації та завантаження даних у Адмін-панелі (admin.html).
 * 4. Логіка перенаправлення після входу.
 */

// Глобальні об'єкти Firebase доступні через firebase-config.js: auth, db

class OlympiadApp {
    constructor() {
        console.log("OlympiadApp ініціалізується...");

        this.adminCodeword = "test2024"; // КОДОВЕ СЛОВО АДМІНА!
        this.currentTaskIndex = 0;
        this.timer = null;
        this.studentAnswers = {};
        this.PAGE_SIZE = 10;
        this.paginationState = {
            currentPage: 1,
            lastVisible: null,
            pageHistory: [null]
        };

        this.OLYMPIAD_DATA = this.getOlympiadData();

        // 1. DOM Елементи (Завантажуємо лише ті, що є на поточній сторінці)
        this.dom = this.getDOMElements();

        // 2. Ініціалізація слухачів подій (з перевірками)
        this.initEventListeners();

        // 3. Перевірка статусу автентифікації та запуск логіки
        this.setupAuthListener();
    }

    getOlympiadData() {
        // Контент завдань
        return [
            {
                id: 1,
                name: "Reading & Vocabulary",
                points: 12,
                type: 'reading_comprehension',
                duration: 400,
                instructions: 'Прочитайте текст і виконайте 12 завдань на розуміння тексту та словниковий запас.',
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
                name: "Word Formation",
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
                name: "Use of English (Rewriting)",
                points: 10,
                type: 'sentence_rewriting',
                duration: 400,
                instructions: 'Завершіть друге речення так, щоб воно мало таке ж значення, як і перше, використовуючи слово у дужках.',
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
    }

    /**
     * ====================================================
     * ЧАСТИНА 1: ІНІЦІАЛІЗАЦІЯ ТА СЛУХАЧІ ПОДІЙ
     * ====================================================
     */

    getDOMElements() {
        // Збираємо всі можливі елементи. Якщо елемент відсутній на поточній сторінці, буде null.
        return {
            // General
            notificationArea: document.getElementById('notificationArea'),

            // Index.html elements
            modeSelector: document.getElementById('modeSelector'),
            studentLogin: document.getElementById('studentLogin'),
            adminLogin: document.getElementById('adminLogin'),
            studentLoginForm: document.getElementById('studentLoginForm'),
            adminLoginForm: document.getElementById('adminLoginForm'),
            studentError: document.getElementById('studentError'),
            adminError: document.getElementById('adminError'),
            showStudentLoginBtn: document.getElementById('showStudentLoginBtn'),
            showAdminLoginBtn: document.getElementById('showAdminLoginBtn'),
            backToMainStudent: document.getElementById('backToMainStudent'),
            backToMainAdmin: document.getElementById('backToMainAdmin'),

            // Student.html elements
            studentLogoutBtn: document.getElementById('studentLogoutBtn'),
            startOlympiadBtn: document.getElementById('startOlympiadBtn'),
            studentIntro: document.getElementById('studentIntro'),
            studentTasks: document.getElementById('studentTasks'),
            studentResults: document.getElementById('studentResults'),
            introUserName: document.getElementById('introUserName'),
            introUserInfo: document.getElementById('introUserInfo'),
            timerDisplay: document.getElementById('timerDisplay'),
            prevTaskBtn: document.getElementById('prevTaskBtn'),
            nextTaskBtn: document.getElementById('nextTaskBtn'),
            finishOlympiadBtn: document.getElementById('finishOlympiadBtn'),
            taskContentContainer: document.getElementById('taskContentContainer'),
            resultsLogoutBtn: document.getElementById('resultsLogoutBtn'),

            // Admin.html elements
            adminLogoutBtn: document.getElementById('adminLogoutBtn'),
            adminTabs: document.querySelectorAll('.tabs .tab'),
            statsPanel: document.getElementById('statsPanel'),
            usersPanel: document.getElementById('usersPanel'),
            createPanel: document.getElementById('createPanel'),
            createUserForm: document.getElementById('createUserForm'),
            createdCredentials: document.getElementById('createdCredentials'),
            copyCredentialsBtn: document.getElementById('copyCredentialsBtn'),
            resultsTableBody: document.getElementById('resultsTableBody'),
            totalUsers: document.getElementById('totalUsers'),
            completedUsers: document.getElementById('completedUsers'),
            activeUsers: document.getElementById('activeUsers'),
            class10Users: document.getElementById('class10Users'),
            prevPageBtn: document.getElementById('prevPageBtn'),
            nextPageBtn: document.getElementById('nextPageBtn'),
            paginationInfo: document.getElementById('paginationInfo'),
        };
    }

    initEventListeners() {
        // Index.html listeners
        this.dom.showStudentLoginBtn?.addEventListener('click', () => this.showLoginForm('student'));
        this.dom.showAdminLoginBtn?.addEventListener('click', () => this.showLoginForm('admin'));
        this.dom.backToMainStudent?.addEventListener('click', () => this.resetToMain());
        this.dom.backToMainAdmin?.addEventListener('click', () => this.resetToMain());

        this.dom.studentLoginForm?.addEventListener('submit', this.handleStudentLogin.bind(this));
        this.dom.adminLoginForm?.addEventListener('submit', this.handleAdminLogin.bind(this));

        // Global Logout listeners
        this.dom.studentLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.adminLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.resultsLogoutBtn?.addEventListener('click', this.logout.bind(this));

        // Admin.html listeners
        this.dom.adminTabs?.forEach(tab => {
            tab.addEventListener('click', this.handleAdminTabSwitch.bind(this));
        });
        this.dom.createUserForm?.addEventListener('submit', this.handleCreateUser.bind(this));
        this.dom.prevPageBtn?.addEventListener('click', () => this.changePage(-1));
        this.dom.nextPageBtn?.addEventListener('click', () => this.changePage(1));
        this.dom.copyCredentialsBtn?.addEventListener('click', this.copyCredentials.bind(this));

        // Student.html listeners
        this.dom.startOlympiadBtn?.addEventListener('click', this.startOlympiad.bind(this));
        this.dom.prevTaskBtn?.addEventListener('click', () => this.navigateTask(-1));
        this.dom.nextTaskBtn?.addEventListener('click', () => this.navigateTask(1));
        this.dom.finishOlympiadBtn?.addEventListener('click', this.finishOlympiad.bind(this));
    }

    showLoginForm(mode) {
        // Працює лише на index.html
        if (!document.getElementById('modeSelector')) return;

        document.getElementById('modeSelector').classList.add('hidden');
        this.dom.studentLogin.classList.add('hidden');
        this.dom.adminLogin.classList.add('hidden');

        if (mode === 'student') {
            this.dom.studentLogin.classList.remove('hidden');
        } else if (mode === 'admin') {
            this.dom.adminLogin.classList.remove('hidden');
        }
    }

    resetToMain() {
        // Працює лише на index.html
        if (!document.getElementById('modeSelector')) return;

        document.getElementById('modeSelector').classList.remove('hidden');
        this.dom.studentLogin.classList.add('hidden');
        this.dom.adminLogin.classList.add('hidden');
        this.dom.studentError.classList.add('hidden');
        this.dom.adminError.classList.add('hidden');
    }

    showNotification(message, type = 'success') {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification notification-${type}`;
        notificationDiv.textContent = message;

        this.dom.notificationArea?.appendChild(notificationDiv);

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
     * ЧАСТИНА 2: АВТЕНТИФІКАЦІЯ ТА ПЕРЕНАПРАВЛЕННЯ
     * ====================================================
     */

    setupAuthListener() {
        if (typeof auth === 'undefined') {
            console.error("Firebase Auth не визначено.");
            return;
        }

        auth.onAuthStateChanged(user => {
            if (user) {
                this.loadUserProfileAndRedirect(user);
            } else {
                // Якщо користувач не автентифікований, і ми не на головній, перенаправляємо на index.html
                const currentPath = window.location.pathname;
                if (!currentPath.includes('index.html') && currentPath !== '/') {
                    window.location.href = 'index.html';
                }
            }
        });

        // Додаткова перевірка ролі, якщо користувач вже на сторінці
        if (document.getElementById('studentAppView')) {
            auth.currentUser?.getIdTokenResult().then(token => {
                // Тут мала б бути перевірка через claims, але ми використовуємо Firestore
                if (!auth.currentUser) return;
                this.loadUserProfileAndRedirect(auth.currentUser);
            });
        } else if (document.getElementById('adminAppView')) {
            auth.currentUser?.getIdTokenResult().then(token => {
                if (!auth.currentUser) return;
                this.loadUserProfileAndRedirect(auth.currentUser);
            });
        }
    }

    async loadUserProfileAndRedirect(user) {
        if (typeof db === 'undefined') return;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const currentPath = window.location.pathname;

                if (userData.role === 'admin') {
                    if (!currentPath.includes('admin.html')) {
                        window.location.href = 'admin.html';
                    } else if (this.dom.adminTabs) {
                        // Якщо ми вже на admin.html, рендеримо дані
                        this.loadAdminData();
                    }
                } else { // student
                    if (!currentPath.includes('student.html')) {
                        window.location.href = 'student.html';
                    } else if (this.dom.studentIntro) {
                        // Якщо ми вже на student.html, рендеримо дані
                        this.renderStudentIntro(userData);
                    }
                }
            } else {
                this.showNotification("Помилка: Профіль не знайдено.", "error");
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

        this.dom.studentError?.classList.add('hidden');

        try {
            await auth.signInWithEmailAndPassword(email, password);
            // Перенаправлення відбудеться через setupAuthListener
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

        this.dom.adminError?.classList.add('hidden');

        if (codeword !== this.adminCodeword) {
            this.dom.adminError.textContent = "Невірне кодове слово.";
            this.dom.adminError.classList.remove('hidden');
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            // Перенаправлення відбудеться через setupAuthListener
        } catch (error) {
            let message = "Невірний логін або пароль адміністратора.";
            this.dom.adminError.textContent = message;
            this.dom.adminError.classList.remove('hidden');
        }
    }

    logout() {
        auth.signOut().then(() => {
            this.showNotification("Ви успішно вийшли.", "success");
            window.location.href = 'index.html';
        }).catch(error => {
            console.error("Помилка виходу:", error);
            this.showNotification("Помилка виходу.", "error");
        });
    }

    /**
     * ====================================================
     * ЧАСТИНА 3: СТУДЕНТСЬКИЙ ДОДАТОК (student.html)
     * ====================================================
     */

    renderStudentIntro(userData) {
        // Логіка працює лише на student.html
        if (!this.dom.studentIntro) return;

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

        if (!userData.completed && userData.answers) {
            this.studentAnswers = userData.answers;
        }
    }

    startOlympiad() {
        if (!this.dom.studentIntro) return;

        if (confirm("Ви впевнені, що готові розпочати? Час піде одразу!")) {
            this.dom.studentIntro.classList.add('hidden');
            this.dom.studentTasks.classList.remove('hidden');

            this.showNotification("Олімпіада розпочата! Час пішов.", "success");

            this.OLYMPIAD_DATA.forEach(task => {
                task.questions.forEach(q => {
                    if (this.studentAnswers[q.id] === undefined) {
                        this.studentAnswers[q.id] = "";
                    }
                });
            });

            this.loadTasksAndStartTimer();
        }
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
        if (!this.dom.studentTasks) return;
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
        if (!this.dom.studentResults) return;

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

            if (this.dom.timerDisplay) {
                this.dom.timerDisplay.textContent = minutes + ":" + seconds;

                this.dom.timerDisplay.classList.remove('warning', 'critical');
                if (timer <= 300) {
                    this.dom.timerDisplay.classList.add('warning');
                } else if (timer <= 60) {
                    this.dom.timerDisplay.classList.add('critical');
                }
            }


            if (--timer < 0) {
                clearInterval(this.timer);
                if (this.dom.timerDisplay) this.dom.timerDisplay.textContent = "00:00";
                this.showNotification("Час вичерпано! Завдання автоматично завершено.", "danger");
                this.finishOlympiad();
            }
        }, 1000);
    }

    /**
     * ====================================================
     * ЧАСТИНА 4: АДМІН-ПАНЕЛЬ (admin.html)
     * ====================================================
     */

    async loadAdminData() {
        if (!this.dom.statsPanel) return;

        this.showNotification("Дані адміністратора завантажено.", "success");
        await this.renderStats();
        
        const activeTab = document.querySelector('.tabs .tab.active');
        if (activeTab?.dataset.tab === 'users') {
             this.loadUsersTable();
        } else {
             this.dom.statsPanel.classList.remove('hidden');
        }
    }

    handleAdminTabSwitch(e) {
        const tab = e.target.closest('.tab');
        if (!tab) return;
        const tabId = tab.dataset.tab;

        this.dom.adminTabs?.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.dom.statsPanel?.classList.add('hidden');
        this.dom.usersPanel?.classList.add('hidden');
        this.dom.createPanel?.classList.add('hidden');

        document.getElementById(`${tabId}Panel`)?.classList.remove('hidden');

        if (tabId === 'users') {
            this.paginationState = { currentPage: 1, lastVisible: null, pageHistory: [null] };
            this.loadUsersTable();
        } else if (tabId === 'stats') {
             this.renderStats();
        }
    }

    async renderStats() {
        if (typeof db === 'undefined' || !this.dom.totalUsers) return;

        try {
            const usersSnapshot = await db.collection('users').get();
            let totalStudents = 0;
            let completedUsers = 0;
            let class10Users = 0;

            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                if (userData.role === 'student') {
                    totalStudents++;
                    if (userData.completed === true) {
                        completedUsers++;
                    }
                    if (userData.class === '10') {
                        class10Users++;
                    }
                }
            });

            this.dom.totalUsers.textContent = totalStudents;
            this.dom.completedUsers.textContent = completedUsers;
            this.dom.activeUsers.textContent = totalStudents - completedUsers;
            this.dom.class10Users.textContent = class10Users;

        } catch (error) {
            console.error("Помилка завантаження статистики:", error);
            this.showNotification("Помилка завантаження статистики.", "error");
        }
    }

    async loadUsersTable() {
        if (typeof db === 'undefined' || !this.dom.resultsTableBody) return;

        const startAt = this.paginationState.pageHistory[this.paginationState.currentPage - 1];

        try {
            let query = db.collection('users')
                .where('role', '==', 'student')
                .orderBy('name')
                .limit(this.PAGE_SIZE + 1);

            if (startAt) {
                query = query.startAfter(startAt);
            }

            const snapshot = await query.get();
            const users = [];
            let lastVisibleDoc = null;

            const hasNextPage = snapshot.docs.length > this.PAGE_SIZE;
            const currentDocs = hasNextPage ? snapshot.docs.slice(0, this.PAGE_SIZE) : snapshot.docs;

            currentDocs.forEach((doc, index) => {
                users.push(doc.data());
                lastVisibleDoc = doc; 
            });

            if (this.paginationState.currentPage === this.paginationState.pageHistory.length && hasNextPage) {
                this.paginationState.pageHistory.push(snapshot.docs[this.PAGE_SIZE]);
            } else if (!hasNextPage && this.paginationState.pageHistory.length > this.paginationState.currentPage) {
                 this.paginationState.pageHistory = this.paginationState.pageHistory.slice(0, this.paginationState.currentPage);
            }

            this.dom.resultsTableBody.innerHTML = users.map((res, index) => {
                const globalIndex = ((this.paginationState.currentPage - 1) * this.PAGE_SIZE) + index + 1;
                const statusText = res.completed ? 'Завершено' : (Object.keys(res.answers || {}).length > 0 ? 'В процесі' : 'Очікує старту');
                const statusClass = res.completed ? 'success' : 'warning';

                return `
                    <tr>
                        <td>${globalIndex}</td>
                        <td>${res.name || 'N/A'}</td>
                        <td>${res.class || 'N/A'}</td>
                        <td>${res.email || 'N/A'}</td>
                        <td><span class="score-badge">${res.rawScore !== undefined ? res.rawScore : '-'}</span></td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            }).join('');

            this.updatePaginationControls(hasNextPage, users.length);

        } catch (error) {
            console.error("Помилка завантаження користувачів:", error);
            this.showNotification("Помилка завантаження користувачів для таблиці.", "error");
        }
    }

    updatePaginationControls(hasNextPage, currentCount) {
        this.dom.prevPageBtn.disabled = this.paginationState.currentPage === 1;
        this.dom.nextPageBtn.disabled = !hasNextPage;
        this.dom.paginationInfo.textContent = `Сторінка ${this.paginationState.currentPage}`;
    }

    changePage(direction) {
        if (direction === 1) { 
            if (this.dom.nextPageBtn.disabled) return;
            this.paginationState.currentPage++;
        } else if (direction === -1 && this.paginationState.currentPage > 1) { 
            this.paginationState.currentPage--;
        }

        this.loadUsersTable();
    }


    transliterate(text) {
        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
            'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh',
            'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
            'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
            'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya'
        };
        let result = '';
        for (const char of text) {
            result += map[char] || char;
        }
        return result.replace(/[^a-zA-Z0-9.-@_]/g, '');
    }

    async handleCreateUser(e) {
        e.preventDefault();
        const name = this.dom.createUserForm.querySelector('#newUserName').value.trim();
        const className = this.dom.createUserForm.querySelector('#newUserClass').value;

        if (!name || !className) {
             this.showNotification("Заповніть усі поля.", "warning");
             return;
        }

        const transliteratedName = this.transliterate(name);
        const parts = transliteratedName.toLowerCase().split(' ').filter(p => p.length > 0);

        let email;
        if (parts.length >= 2) {
            email = `${parts[0]}.${parts[1].charAt(0)}@olymp.com`;
        } else if (parts.length === 1) {
            email = `${parts[0]}@olymp.com`;
        } else {
            this.showNotification("Невірний формат імені. Введіть ПІБ.", "error");
            return;
        }

        email = email.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');

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
            this.renderStats();
            this.loadUsersTable();

        } catch (error) {
            console.error("Помилка створення учня:", error);
            let errorMessage = error.message.includes("email-already-in-use")
                ? "Цей email вже використовується (Спробуйте інше ім'я)."
                : `Помилка: ${error.message} (код: ${error.code})`;

            this.showNotification(`Помилка створення: ${errorMessage}`, "error");
        }
    }

    copyCredentials() {
         if (!this.dom.createdCredentials) return;
        const name = this.dom.createdCredentials.querySelector('#credentialsInfo p:nth-child(1)').textContent.replace('Ім\'я: ', '');
        const email = this.dom.createdCredentials.querySelector('#copyEmail').textContent;
        const password = this.dom.createdCredentials.querySelector('#copyPassword').textContent;

        const textToCopy = `Учень: ${name}\nЛогін: ${email}\nПароль: ${password}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showNotification("Дані скопійовано!", "success");
        }).catch(err => {
            console.error('Помилка копіювання: ', err);
            this.showNotification("Помилка копіювання.", "error");
        });
    }

    renderCreatedCredentials(name, email, password) {
        if (!this.dom.createdCredentials) return;
        this.dom.createdCredentials.classList.remove('hidden');
        document.getElementById('credentialsInfo').innerHTML = `
            <p><strong>Ім'я:</strong> ${name}</p>
            <p><strong>Логін (Email):</strong> <code id="copyEmail">${email}</code></p>
            <p><strong>Пароль:</strong> <code id="copyPassword">${password}</code></p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined' && typeof db !== 'undefined') {
        window.olympiadApp = new OlympiadApp();
    } else {
        console.error("Помилка ініціалізації Firebase. Перевірте firebase-config.js та підключення SDK.");
    }
});
