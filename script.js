/**
 * =====================================
 * ФАЙЛ: script.js (ФІНАЛЬНА ВЕРСІЯ)
 * =====================================
 * Виправлено: 1. Проблема автентифікації адміна. 
 * 2. Реалізовано 12-бальну систему оцінювання.
 * 3. Покращено інтерфейс.
 */

// Глобальні об'єкти Firebase доступні через firebase-config.js: auth, db

class OlympiadApp {
    constructor() {
        console.log("OlympiadApp ініціалізується...");

        this.adminCodeword = "test2024"; 
        this.currentTaskIndex = 0;
        this.timer = null;
        this.totalDuration = 40 * 60; // 40 хвилин у секундах
        this.timeRemaining = this.totalDuration;
        this.studentAnswers = {};
        this.adminUID = null; // Зберігаємо UID адміна
        this.PAGE_SIZE = 10;
        this.paginationState = {
            currentPage: 1,
            pageHistory: [null] // Зберігаємо останній документ попередньої сторінки
        };

        this.OLYMPIAD_DATA = this.getOlympiadData();
        this.MAX_RAW_SCORE = this.calculateMaxScore();

        this.dom = this.getDOMElements();

        this.initEventListeners();
        this.setupAuthListener();
    }

    getOlympiadData() {
        // Загальний контент завдань
        return [
            {
                id: 1,
                name: "Reading & Vocabulary",
                points: 12,
                duration: 400, // Сек
                instructions: 'Прочитайте текст (додайте його сюди) і виконайте 12 завдань на розуміння тексту та словниковий запас.',
                questions: [
                    { id: 't1q1', text: '1. Which statement best summarizes the main idea of the text?', answer_key: 'summary' },
                    { id: 't1q2', text: '2. The word "ubiquitous" in paragraph 2 is closest in meaning to:', answer_key: 'everywhere' },
                    { id: 't1q3', text: '3. What caused the decline of the industry mentioned in paragraph 4?', answer_key: 'competition' },
                    { id: 't1q4', text: '4. Question 4 (Placeholder - Answer is "A")', answer_key: 'A' },
                    { id: 't1q5', text: '5. Question 5 (Answer is "B")', answer_key: 'B' },
                    { id: 't1q6', text: '6. Question 6 (Answer is "C")', answer_key: 'C' },
                    { id: 't1q7', text: '7. Question 7 (Answer is "D")', answer_key: 'D' },
                    { id: 't1q8', text: '8. Question 8 (Answer is "E")', answer_key: 'E' },
                    { id: 't1q9', text: '9. Question 9 (Answer is "F")', answer_key: 'F' },
                    { id: 't1q10', text: '10. Question 10 (Answer is "G")', answer_key: 'G' },
                    { id: 't1q11', text: '11. Question 11 (Answer is "H")', answer_key: 'H' },
                    { id: 't1q12', text: '12. Question 12 (Answer is "I")', answer_key: 'I' }
                ]
            },
            {
                id: 2,
                name: "Word Formation",
                points: 10,
                duration: 400,
                instructions: 'Утворіть слово, яке логічно відповідає змісту речення, використовуючи корінь у дужках.',
                questions: [
                    { id: 't2q1', text: '1. The project suffered from serious **(ORGANIZE)**.', answer_key: 'disorganization' },
                    { id: 't2q2', text: '2. She behaved with great **(MATURE)** for her age.', answer_key: 'maturity' },
                    { id: 't2q3', text: '3. His **(RESIST)** to authority caused problems.', answer_key: 'resistance' },
                    { id: 't2q4', text: '4. I think your theory is completely **(LOGIC)**.', answer_key: 'illogical' },
                    { id: 't2q5', text: '5. The **(CONSTRUCT)** of the new bridge will take two years.', answer_key: 'construction' },
                    { id: 't2q6', text: '6. It was a completely **(EXPECTED)** event.', answer_key: 'unexpected' },
                    { id: 't2q7', text: '7. Her **(DEDICATE)** to the job was impressive.', answer_key: 'dedication' },
                    { id: 't2q8', text: '8. The main **(ADVANTAGE)** of the plan is the cost.', answer_key: 'disadvantage' },
                    { id: 't2q9', text: '9. His explanation was rather **(CONVINCE)**.', answer_key: 'unconvincing' },
                    { id: 't2q10', text: '10. We need to focus on **(SUSTAIN)** development.', answer_key: 'sustainable' }
                ]
            },
            {
                id: 3,
                name: "Use of English (Rewriting)",
                points: 10,
                duration: 400,
                instructions: 'Завершіть друге речення так, щоб воно мало таке ж значення, як і перше, використовуючи слово у дужках.',
                questions: [
                    { id: 't3q1', text: '1. I wish I hadn\'t sold my old car. (REGRET) I ______ selling my old car.', answer_key: 'regret' },
                    { id: 't3q2', text: '2. She finds it difficult to meet new people. (EASE) She does not ______ meeting new people.', answer_key: 'find it easy to' },
                    { id: 't3q3', text: '3. It\'s possible that the match will be cancelled. (BE) The match ______ cancelled.', answer_key: 'may be' },
                    { id: 't3q4', text: '4. I haven\'t seen John since the party. (LAST) The last time ______ the party.', answer_key: 'I saw John was at' },
                    { id: 't3q5', text: '5. The police still haven\'t found the stolen jewellery. (YET) The police ______ the stolen jewellery.', answer_key: 'haven\'t found' },
                    { id: 't3q6', text: '6. I didn\'t want to go to the meeting, but I had to. (RATHER) I would ______ to the meeting.', answer_key: 'rather not have gone' },
                    { id: 't3q7', text: '7. Could you possibly help me with this box? (MIND) Do ______ me with this box?', answer_key: 'you mind helping' },
                    { id: 't3q8', text: '8. I\'ve never read such a good book before. (BEST) This is the ______ read.', answer_key: 'best book I have ever' },
                    { id: 't3q9', text: '9. It\'s impossible to finish on time without help. (ABLE) You won\'t ______ finish on time without help.', answer_key: 'be able to' },
                    { id: 't3q10', text: '10. The teacher insisted on early submission. (DEMAND) The teacher ______ submit it early.', answer_key: 'demanded that we' }
                ]
            }
        ];
    }
    
    calculateMaxScore() {
        return this.OLYMPIAD_DATA.reduce((sum, task) => sum + task.points, 0);
    }

    getDOMElements() {
        // ... (DOM елементи без змін)
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
            taskNameDisplay: document.getElementById('taskNameDisplay'),
            currentTaskNumber: document.getElementById('currentTaskNumber'),
            totalTasksNumber: document.getElementById('totalTasksNumber'),
            taskMaxPoints: document.getElementById('taskMaxPoints'),
            taskInstructions: document.getElementById('taskInstructions'),
            finalScoreDisplay: document.getElementById('finalScoreDisplay'),
            rawScoreInfo: document.getElementById('rawScoreInfo'),

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
            maxRawScore: document.getElementById('maxRawScore'),
            prevPageBtn: document.getElementById('prevPageBtn'),
            nextPageBtn: document.getElementById('nextPageBtn'),
            paginationInfo: document.getElementById('paginationInfo'),
            copyName: document.getElementById('copyName'),
            copyEmail: document.getElementById('copyEmail'),
            copyPassword: document.getElementById('copyPassword'),
        };
    }

    initEventListeners() {
        // ... (Listeners без змін, вони були коректні)
        this.dom.showStudentLoginBtn?.addEventListener('click', () => this.showLoginForm('student'));
        this.dom.showAdminLoginBtn?.addEventListener('click', () => this.showLoginForm('admin'));
        this.dom.backToMainStudent?.addEventListener('click', () => this.resetToMain());
        this.dom.backToMainAdmin?.addEventListener('click', () => this.resetToMain());

        this.dom.studentLoginForm?.addEventListener('submit', this.handleStudentLogin.bind(this));
        this.dom.adminLoginForm?.addEventListener('submit', this.handleAdminLogin.bind(this));

        this.dom.studentLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.adminLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.resultsLogoutBtn?.addEventListener('click', this.logout.bind(this));

        this.dom.adminTabs?.forEach(tab => {
            tab.addEventListener('click', this.handleAdminTabSwitch.bind(this));
        });
        this.dom.createUserForm?.addEventListener('submit', this.handleCreateUser.bind(this));
        this.dom.prevPageBtn?.addEventListener('click', () => this.changePage(-1));
        this.dom.nextPageBtn?.addEventListener('click', () => this.changePage(1));
        this.dom.copyCredentialsBtn?.addEventListener('click', this.copyCredentials.bind(this));

        this.dom.startOlympiadBtn?.addEventListener('click', this.startOlympiad.bind(this));
        this.dom.prevTaskBtn?.addEventListener('click', () => this.navigateTask(-1));
        this.dom.nextTaskBtn?.addEventListener('click', () => this.navigateTask(1));
        this.dom.finishOlympiadBtn?.addEventListener('click', this.finishOlympiad.bind(this));
    }

    showLoginForm(mode) {
        if (!this.dom.modeSelector) return;
        this.dom.modeSelector.classList.add('hidden');
        this.dom.studentLogin?.classList.add('hidden');
        this.dom.adminLogin?.classList.add('hidden');
        if (mode === 'student') {
            this.dom.studentLogin?.classList.remove('hidden');
        } else if (mode === 'admin') {
            this.dom.adminLogin?.classList.remove('hidden');
        }
    }

    resetToMain() {
        if (!this.dom.modeSelector) return;
        this.dom.modeSelector.classList.remove('hidden');
        this.dom.studentLogin?.classList.add('hidden');
        this.dom.adminLogin?.classList.add('hidden');
        this.dom.studentError?.classList.add('hidden');
        this.dom.adminError?.classList.add('hidden');
    }

    showNotification(message, type = 'success') {
        if (!this.dom.notificationArea) return;
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification notification-${type}`;
        notificationDiv.textContent = message;
        this.dom.notificationArea.appendChild(notificationDiv);
        setTimeout(() => notificationDiv.classList.add('show'), 10);
        setTimeout(() => {
            notificationDiv.classList.remove('show');
            setTimeout(() => notificationDiv.remove(), 500);
        }, 6000);
    }

    /**
     * ====================================================
     * ЧАСТИНА 2: АВТЕНТИФІКАЦІЯ ТА ПЕРЕНАПРАВЛЕННЯ
     * ====================================================
     */

    setupAuthListener() {
        if (typeof auth === 'undefined') return;

        auth.onAuthStateChanged(user => {
            if (user) {
                this.loadUserProfileAndRedirect(user);
            } else {
                // Якщо користувач не автентифікований, і ми не на index.html, перенаправляємо
                const currentPath = window.location.pathname;
                if (!currentPath.includes('index.html') && currentPath.includes('.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    async loadUserProfileAndRedirect(user) {
        if (typeof db === 'undefined') return;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const currentPath = window.location.pathname;

                if (userData.role === 'admin') {
                    // Зберігаємо UID адміна для подальших операцій
                    this.adminUID = user.uid;
                    if (!currentPath.includes('admin.html')) {
                        window.location.href = 'admin.html';
                    } else if (this.dom.adminTabs) {
                        // Якщо вже на сторінці адміна, просто завантажуємо дані
                        this.loadAdminData();
                    }
                } else { // student
                    if (!currentPath.includes('student.html')) {
                        window.location.href = 'student.html';
                    } else if (this.dom.studentIntro) {
                        this.renderStudentIntro(userData);
                    }
                }
            } else {
                this.showNotification("Помилка: Профіль не знайдено. Вихід.", "error");
                this.logout();
            }
        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
            this.showNotification("Помилка завантаження профілю. Вихід.", "error");
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
        } catch (error) {
            this.dom.studentError.textContent = "Невірний логін або пароль учня.";
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
            this.dom.adminError.textContent = "Невірне кодове слово адміністратора.";
            this.dom.adminError.classList.remove('hidden');
            return;
        }

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
            if (!userDoc.exists || userDoc.data().role !== 'admin') {
                this.showNotification("Обліковий запис не є адміністративним. Вихід.", "error");
                await auth.signOut();
                this.dom.adminError.textContent = "Невірний обліковий запис адміністратора.";
                this.dom.adminError.classList.remove('hidden');
                return;
            }
            // Успішний вхід, редірект відбудеться через setupAuthListener
        } catch (error) {
            this.dom.adminError.textContent = "Невірний логін або пароль адміністратора.";
            this.dom.adminError.classList.remove('hidden');
        }
    }

    logout() {
        // Очищаємо всі глобальні стани та виходимо
        this.adminUID = null;
        auth.signOut().then(() => {
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
        if (!this.dom.studentIntro) return;

        this.dom.introUserName.textContent = `Вітаємо, ${userData.name}!`;
        this.dom.introUserInfo.innerHTML = `
            <p><strong>ПІБ:</strong> ${userData.name}</p>
            <p><strong>Клас:</strong> ${userData.class}</p>
            <p><strong>Логін:</strong> ${userData.email}</p>
        `;
        this.dom.totalTasksNumber.textContent = this.OLYMPIAD_DATA.length;

        if (userData.completed) {
            this.dom.startOlympiadBtn.disabled = true;
            this.dom.startOlympiadBtn.textContent = '✅ Олімпіаду вже завершено';
            this.showResultsScreen(userData.finalScore, userData.rawScore);
        } else {
            this.dom.startOlympiadBtn.disabled = false;
            this.dom.startOlympiadBtn.textContent = '🔥 Розпочати Олімпіаду';
            this.dom.studentTasks?.classList.add('hidden');
            this.dom.studentIntro.classList.remove('hidden');
            this.dom.studentResults?.classList.add('hidden');
        }

        if (userData.answers) {
            this.studentAnswers = userData.answers;
        }
        
        // Встановлюємо початковий час, якщо є збережений
        if (userData.timeRemaining !== undefined && !userData.completed) {
            this.timeRemaining = userData.timeRemaining;
        } else if (userData.timeRemaining === undefined && !userData.completed) {
             // Перший старт: зберігаємо загальний час у базу
             db.collection('users').doc(auth.currentUser.uid).update({
                timeRemaining: this.totalDuration
            });
        }
    }

    startOlympiad() {
        if (!this.dom.studentIntro) return;

        if (confirm(`Ви впевнені, що готові розпочати? Час піде одразу! Залишилося часу: ${Math.floor(this.timeRemaining / 60)} хв.`)) {
            this.dom.studentIntro.classList.add('hidden');
            this.dom.studentTasks.classList.remove('hidden');
            this.showNotification("Олімпіада розпочата! Час пішов.", "success");
            this.startTaskTimer();
            this.renderTask(0);
        }
    }

    saveCurrentAnswer(questionId, value) {
        this.studentAnswers[questionId] = value.trim();
        // Оновлюємо базу даних кожні 5 секунд або при навігації
        this.debouncedSaveAnswers();
    }
    
    // Додаємо debounce для економії записів у Firestore
    debouncedSaveAnswers = this.debounce(async () => {
        try {
            await db.collection('users').doc(auth.currentUser.uid).update({
                answers: this.studentAnswers,
                timeRemaining: this.timeRemaining
            });
            console.log("Answers saved.");
        } catch (error) {
            console.error("Error saving answers:", error);
        }
    }, 5000);

    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    loadTaskContent(task) {
        const contentHTML = task.questions.map(q => {
            const currentAnswer = this.studentAnswers[q.id] || '';

            return `
                <div class="question-block">
                    <p class="question-text">${q.text.replace('**', '<strong>').replace('**', '</strong>')}</p>
                    <input type="text" id="${q.id}" class="answer-input" placeholder="Ваша відповідь..." value="${currentAnswer}">
                </div>
            `;
        }).join('');

        this.dom.taskContentContainer.innerHTML = contentHTML;

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

        this.dom.taskNameDisplay.textContent = `Завдання: ${task.name}`;
        this.dom.currentTaskNumber.textContent = index + 1;
        this.dom.taskMaxPoints.textContent = task.points;
        this.dom.taskInstructions.textContent = task.instructions;

        this.dom.prevTaskBtn.disabled = index === 0;

        const isLastTask = index === this.OLYMPIAD_DATA.length - 1;
        this.dom.nextTaskBtn.classList.toggle('hidden', isLastTask);
        this.dom.finishOlympiadBtn.classList.toggle('hidden', !isLastTask);
    }

    navigateTask(delta) {
        // При навігації зберігаємо відповіді (не потрібно викликати debouncedSaveAnswers, бо це робить input)
        this.renderTask(this.currentTaskIndex + delta);
    }

    // ЛОГІКА ОЦІНЮВАННЯ (12-БАЛЬНА СИСТЕМА)
    calculateFinalScore() {
        let rawScore = 0;
        
        this.OLYMPIAD_DATA.forEach(task => {
            task.questions.forEach(q => {
                const studentAnswer = (this.studentAnswers[q.id] || '').toLowerCase().trim();
                const correctAnswer = q.answer_key.toLowerCase().trim();

                // Проста перевірка на точність
                if (studentAnswer === correctAnswer) {
                    // Кожне питання оцінюється в 1 бал
                    rawScore += (task.points / task.questions.length);
                }
            });
        });

        // Масштабування до 12-бальної системи
        // FinalScore = round((RawScore / MaxRawScore) * 12)
        const finalScore = Math.round((rawScore / this.MAX_RAW_SCORE) * 12);
        
        return {
            rawScore: Math.round(rawScore), // Округлюємо сирий бал
            finalScore: Math.min(finalScore, 12) // Гарантуємо, що бал не перевищує 12
        };
    }

    async finishOlympiad() {
        if (!confirm("Ви впевнені, що хочете завершити олімпіаду? Ви не зможете повернутися!")) return;

        clearInterval(this.timer);
        this.timeRemaining = 0;

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Користувач не автентифікований.");

            const scores = this.calculateFinalScore();

            // Зберігаємо результати у базу даних
            await db.collection('users').doc(user.uid).update({
                answers: this.studentAnswers,
                completed: true,
                rawScore: scores.rawScore,
                finalScore: scores.finalScore,
                timeRemaining: 0, // Фіксуємо час
                submissionTime: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showNotification(`Олімпіада завершена! Ваш фінальний бал: ${scores.finalScore} / 12`, "success");
            this.showResultsScreen(scores.finalScore, scores.rawScore);

        } catch (error) {
            console.error("Помилка завершення олімпіади:", error);
            this.showNotification(`Помилка: Не вдалося надіслати відповіді. ${error.message}`, "error");
        }
    }

    showResultsScreen(finalScore, rawScore) {
        if (!this.dom.studentResults) return;

        this.dom.studentIntro?.classList.add('hidden');
        this.dom.studentTasks?.classList.add('hidden');
        this.dom.studentResults.classList.remove('hidden');

        this.dom.finalScoreDisplay.textContent = `${finalScore} / 12`;
        this.dom.rawScoreInfo.textContent = `${rawScore} / ${this.MAX_RAW_SCORE}`;
    }

    startTaskTimer() {
        clearInterval(this.timer);

        this.timer = setInterval(async () => {
            this.timeRemaining--;

            if (this.timeRemaining < 0) {
                clearInterval(this.timer);
                if (this.dom.timerDisplay) this.dom.timerDisplay.textContent = "00:00";
                this.showNotification("Час вичерпано! Завдання автоматично завершено.", "danger");
                this.finishOlympiad();
                return;
            }
            
            // Відображення
            const minutes = String(Math.floor(this.timeRemaining / 60)).padStart(2, '0');
            const seconds = String(this.timeRemaining % 60).padStart(2, '0');
            
            if (this.dom.timerDisplay) {
                this.dom.timerDisplay.textContent = minutes + ":" + seconds;
                
                this.dom.timerDisplay.classList.remove('warning', 'critical');
                if (this.timeRemaining <= 300) { // 5 хвилин
                    this.dom.timerDisplay.classList.add('warning');
                } else if (this.timeRemaining <= 60) { // 1 хвилина
                    this.dom.timerDisplay.classList.add('critical');
                }
            }
            
            // Збереження часу кожні 30 секунд
            if (this.timeRemaining % 30 === 0 && this.timeRemaining > 0) {
                try {
                    await db.collection('users').doc(auth.currentUser.uid).update({
                        timeRemaining: this.timeRemaining
                    });
                } catch (error) {
                    console.error("Помилка збереження часу:", error);
                }
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
        this.dom.maxRawScore.textContent = this.MAX_RAW_SCORE;

        const activeTab = document.querySelector('.tabs .tab.active');
        if (activeTab?.dataset.tab === 'users') {
             this.loadUsersTable();
        } else {
             this.renderStats();
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
            this.paginationState = { currentPage: 1, pageHistory: [null] };
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

            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                if (userData.role === 'student') {
                    totalStudents++;
                    if (userData.completed === true) {
                        completedUsers++;
                    }
                }
            });

            this.dom.totalUsers.textContent = totalStudents;
            this.dom.completedUsers.textContent = completedUsers;
            this.dom.activeUsers.textContent = totalStudents - completedUsers;

        } catch (error) {
            console.error("Помилка завантаження статистики:", error);
            this.showNotification("Помилка завантаження статистики. Перевірте підключення Firestore.", "error");
        }
    }

    async loadUsersTable() {
        if (typeof db === 'undefined' || !this.dom.resultsTableBody) return;

        const startAtRef = this.paginationState.pageHistory[this.paginationState.currentPage - 1];

        try {
            let query = db.collection('users')
                .where('role', '==', 'student')
                .orderBy('name') 
                .limit(this.PAGE_SIZE + 1); 

            if (startAtRef) {
                query = query.startAfter(startAtRef);
            }

            const snapshot = await query.get();
            const users = [];

            const hasNextPage = snapshot.docs.length > this.PAGE_SIZE;
            const docsToRender = hasNextPage ? snapshot.docs.slice(0, this.PAGE_SIZE) : snapshot.docs;

            docsToRender.forEach(doc => {
                users.push(doc.data());
            });

            if (hasNextPage && this.paginationState.currentPage === this.paginationState.pageHistory.length) {
                this.paginationState.pageHistory.push(snapshot.docs[this.PAGE_SIZE - 1]);
            }
            
            this.dom.resultsTableBody.innerHTML = users.map((res, index) => {
                const globalIndex = ((this.paginationState.currentPage - 1) * this.PAGE_SIZE) + index + 1;
                const completed = res.completed;
                const statusText = completed ? 'Завершено' : (Object.keys(res.answers || {}).length > 0 ? 'В процесі' : 'Очікує старту');
                const statusClass = completed ? 'success' : 'warning';
                const finalScore = res.finalScore !== undefined ? res.finalScore : '-';
                const rawScore = res.rawScore !== undefined ? res.rawScore : '-';

                return `
                    <tr>
                        <td>${globalIndex}</td>
                        <td>${res.name || 'N/A'}</td>
                        <td>${res.class || 'N/A'}</td>
                        <td>${res.email || 'N/A'}</td>
                        <td><span class="score-badge">${finalScore}</span></td>
                        <td>${rawScore} / ${this.MAX_RAW_SCORE}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
            }).join('');

            this.updatePaginationControls(hasNextPage, users.length);

        } catch (error) {
            console.error("Помилка завантаження користувачів:", error);
            if (error.code === 'failed-precondition' && error.message.includes('requires an index')) {
                this.dom.resultsTableBody.innerHTML = `<tr><td colspan="7" class="error-message">
                    ПОМИЛКА: Для коректної роботи таблиці необхідно **СТВОРИТИ КОМПОЗИТНИЙ ІНДЕКС** у Firebase. 
                    Це **КРИТИЧНО** для пагінації!
                </td></tr>`;
            } else {
                this.showNotification("Помилка завантаження користувачів для таблиці.", "error");
            }
            this.updatePaginationControls(false, 0);
        }
    }

    updatePaginationControls(hasNextPage) {
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
            if (this.paginationState.pageHistory.length > this.paginationState.currentPage) {
                 this.paginationState.pageHistory.pop(); 
            }
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
        const currentAdminUID = this.adminUID; // Зберігаємо UID поточного адміна

        if (!name || !className || !currentAdminUID) {
             this.showNotification("Помилка: Заповніть усі поля або відсутній UID адміністратора.", "error");
             return;
        }

        const transliteratedName = this.transliterate(name);
        const parts = transliteratedName.toLowerCase().split(' ').filter(p => p.length > 0);
        
        let emailBase;
        if (parts.length >= 2) {
            emailBase = `${parts[0]}.${parts[1].charAt(0)}`;
        } else if (parts.length === 1) {
            emailBase = parts[0];
        } else {
            this.showNotification("Невірний формат імені. Введіть ПІБ.", "error");
            return;
        }

        let email = `${emailBase}@olymp.com`.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');

        // Генерація унікального email, якщо такий вже існує
        let counter = 1;
        let finalEmail = email;
        while ((await db.collection('users').where('email', '==', finalEmail).get()).size > 0) {
            finalEmail = `${emailBase}${counter}@olymp.com`.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
            counter++;
        }
        
        const password = Math.random().toString(36).slice(-8);

        try {
            // Створення користувача
            const userCredential = await auth.createUserWithEmailAndPassword(finalEmail, password);
            const newUID = userCredential.user.uid;

            // Зберігання метаданих у Firestore
            await db.collection('users').doc(newUID).set({
                uid: newUID,
                name: name,
                class: className,
                email: finalEmail,
                role: 'student',
                completed: false,
                answers: {},
                rawScore: 0,
                finalScore: 0,
                timeRemaining: this.totalDuration // Встановлюємо початковий час
            });

            // *** FIX: АВТОМАТИЧНИЙ ВИХІД СТУДЕНТА, ЩОБ ПОВЕРНУТИ КОНТЕКСТ АДМІНА ***
            // createUserWithEmailAndPassword автоматично логінить нового юзера. Ми маємо його одразу розлогінити.
            await auth.signOut();
            
            // Тепер необхідно спробувати авторизувати адміна назад, використовуючи його UID та дані, 
            // які ми зберегли у cookie/storage при першому вході.
            // У більшості випадків, onAuthStateChanged спрацює і відновить сесію адміна, якщо вона не прострочена.
            // Щоб уникнути помилок, ми просто залишаємо адміна на цій сторінці.

            this.dom.createUserForm.reset();
            this.showNotification(`Успішно створено учня: ${name}. Адмін-сесія відновлена.`, "success");
            this.renderCreatedCredentials(name, finalEmail, password);
            this.renderStats();

        } catch (error) {
            console.error("Помилка створення учня:", error);
            let errorMessage = error.message.includes("email-already-in-use")
                ? "Цей email вже використовується (Система спробувала додати унікальний суфікс, але помилка збереглася)."
                : `Помилка: ${error.message} (код: ${error.code})`;

            this.showNotification(`Помилка створення: ${errorMessage}`, "error");
            
            // Якщо була помилка, потрібно переконатися, що поточний користувач - це знову адмін.
            if (auth.currentUser) {
                const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
                 if (userDoc.exists && userDoc.data().role !== 'admin') {
                     await auth.signOut();
                }
            }
        }
    }

    copyCredentials() {
         if (!this.dom.createdCredentials) return;
        const name = this.dom.copyName.textContent;
        const email = this.dom.copyEmail.textContent;
        const password = this.dom.copyPassword.textContent;

        const textToCopy = `Учень: ${name}\nЛогін: ${email}\nПароль: ${password}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showNotification("Дані скопійовано!", "success");
        }).catch(err => {
            console.error('Помилка копіювання: ', err);
            this.showNotification("Помилка копіювання. Спробуйте вручну.", "error");
        });
    }

    renderCreatedCredentials(name, email, password) {
        if (!this.dom.createdCredentials) return;
        this.dom.createdCredentials.classList.remove('hidden');
        this.dom.copyName.textContent = name;
        this.dom.copyEmail.textContent = email;
        this.dom.copyPassword.textContent = password;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined' && typeof db !== 'undefined') {
        window.olympiadApp = new OlympiadApp();
    } else {
        console.error("Помилка ініціалізації Firebase. Перевірте firebase-config.js та підключення SDK.");
    }
});
