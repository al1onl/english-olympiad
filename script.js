/**
 * =====================================
 * ФАЙЛ: script.js (ФІНАЛЬНА ВЕРСІЯ 3.0)
 * =====================================
 * Виправлено критичні помилки: 
 * 1. TypeError: this.showLoginForm is not a function.
 * 2. TypeError: Cannot read properties of undefined (reading 'bind') на методах адмін-панелі.
 * 3. Вся логіка (студента, адміністратора, пагінація) тепер повністю включена.
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
        
        // КРИТИЧНЕ ВИПРАВЛЕННЯ #1: Тимчасове зберігання даних адміна для відновлення сесії
        this._adminEmail = null; 
        this._adminPassword = null; 
        this.adminUID = null; 
        
        this.PAGE_SIZE = 10;
        this.paginationState = {
            currentPage: 1,
            pageHistory: [null] 
        };

        this.OLYMPIAD_DATA = this.getOlympiadData();
        this.MAX_RAW_SCORE = this.calculateMaxScore();

        this.dom = this.getDOMElements();

        this.initEventListeners();
        this.setupAuthListener();
    }

    getOlympiadData() {
        // Контент завдань (залишається без змін)
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
        // ВИПРАВЛЕННЯ ПОМИЛКИ #1: this.showLoginForm is not a function
        this.dom.showStudentLoginBtn?.addEventListener('click', () => this.showLoginForm('student'));
        this.dom.showAdminLoginBtn?.addEventListener('click', () => this.showLoginForm('admin'));
        this.dom.backToMainStudent?.addEventListener('click', () => this.resetToMain());
        this.dom.backToMainAdmin?.addEventListener('click', () => this.resetToMain());

        this.dom.studentLoginForm?.addEventListener('submit', this.handleStudentLogin.bind(this));
        this.dom.adminLoginForm?.addEventListener('submit', this.handleAdminLogin.bind(this));

        this.dom.studentLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.adminLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.resultsLogoutBtn?.addEventListener('click', this.logout.bind(this));

        // ВИПРАВЛЕННЯ ПОМИЛКИ #2: Cannot read properties of undefined (reading 'bind') - через відсутність handleAdminTabSwitch
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
     * ЧАСТИНА 2: АВТЕНТИФІКАЦІЯ ТА ПЕРЕНАПРАВЛЕННЯ (Фікси)
     * ====================================================
     */

    // ВИПРАВЛЕННЯ: Додано відсутній метод
    showLoginForm(mode) {
        if (!this.dom.modeSelector) return;
        this.dom.modeSelector.classList.add('hidden');
        if (mode === 'student') {
            this.dom.studentLogin?.classList.remove('hidden');
        } else {
            this.dom.adminLogin?.classList.remove('hidden');
        }
    }

    // ВИПРАВЛЕННЯ: Додано відсутній метод
    resetToMain() {
         if (window.location.pathname.includes('index.html') && this.dom.modeSelector) {
            this.dom.modeSelector.classList.remove('hidden');
             this.dom.studentLogin?.classList.add('hidden');
             this.dom.adminLogin?.classList.add('hidden');
        } else {
             window.location.href = 'index.html';
        }
    }

    setupAuthListener() {
        if (typeof auth === 'undefined') return;

        auth.onAuthStateChanged(user => {
            if (user) {
                this.loadUserProfileAndRedirect(user);
            } else {
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
                    this.adminUID = user.uid;
                    if (!currentPath.includes('admin.html')) {
                        window.location.href = 'admin.html';
                    } else if (this.dom.adminTabs) {
                        this.loadAdminData(); // Викликаємо завантаження даних адміна
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
            // Зберігаємо дані адміна для відновлення сесії
            this._adminEmail = email; 
            this._adminPassword = password; 
        } catch (error) {
            this.dom.adminError.textContent = "Невірний логін або пароль адміністратора.";
            this.dom.adminError.classList.remove('hidden');
        }
    }

    logout() {
        this._adminEmail = null;
        this._adminPassword = null;
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
     * ЧАСТИНА 3: ЛОГІКА УЧНЯ (Відновлені методи)
     * ====================================================
     */

    renderStudentIntro(userData) {
        this.dom.introUserName.textContent = `Ласкаво просимо, ${userData.name}!`;
        this.dom.introUserInfo.innerHTML = `
            <p><strong>Клас:</strong> ${userData.class}</p>
            <p><strong>Логін:</strong> ${userData.email}</p>
            <p><strong>Тривалість:</strong> 40 хвилин</p>
            <p><strong>Завдань:</strong> ${this.OLYMPIAD_DATA.length}</p>
        `;

        if (userData.completed) {
            this.dom.startOlympiadBtn.disabled = true;
            this.dom.startOlympiadBtn.textContent = 'Олімпіада вже завершена';
            this.showResultsScreen(userData.finalScore, userData.rawScore);
            this.dom.studentIntro.classList.add('hidden');
            this.dom.studentTasks.classList.add('hidden');
            this.dom.studentResults.classList.remove('hidden');
        } else {
            this.timeRemaining = userData.timeRemaining || this.totalDuration;
            // Якщо є збережені відповіді, завантажуємо їх
            if (Object.keys(userData.answers || {}).length > 0) {
                this.studentAnswers = userData.answers;
                this.dom.startOlympiadBtn.textContent = 'Продовжити олімпіаду';
            }
        }
    }

    startOlympiad() {
        this.dom.studentIntro.classList.add('hidden');
        this.dom.studentTasks.classList.remove('hidden');
        this.dom.totalTasksNumber.textContent = this.OLYMPIAD_DATA.length;
        
        this.startTaskTimer();
        this.currentTaskIndex = 0;
        this.loadTaskContent();
    }

    startTaskTimer() {
        if (this.timer) clearInterval(this.timer);
        
        const updateTimer = () => {
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.showNotification("Час вичерпано! Автоматичне завершення олімпіади.", "danger");
                this.finishOlympiad();
                return;
            }

            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.dom.timerDisplay.textContent = display;

            this.dom.timerDisplay.classList.remove('warning', 'critical');
            if (this.timeRemaining <= 5 * 60) {
                this.dom.timerDisplay.classList.add('critical');
            } else if (this.timeRemaining <= 10 * 60) {
                this.dom.timerDisplay.classList.add('warning');
            }
            
            this.timeRemaining--;

            // Зберігаємо час кожні 30 секунд
            if (this.timeRemaining % 30 === 0) {
                 this.saveProgress();
            }
        };

        updateTimer();
        this.timer = setInterval(updateTimer, 1000);
    }
    
    async saveProgress() {
        try {
            const user = auth.currentUser;
            if (!user) return;
            
            this.saveCurrentAnswer(); // Зберігаємо поточну відповідь перед збереженням прогресу
            
            await db.collection('users').doc(user.uid).update({
                answers: this.studentAnswers,
                timeRemaining: this.timeRemaining,
                lastActivity: firebase.firestore.FieldValue.serverTimestamp()
            });
            // console.log("Прогрес збережено.");
        } catch (error) {
            console.error("Помилка збереження прогресу:", error);
        }
    }

    saveCurrentAnswer() {
        const currentTask = this.OLYMPIAD_DATA[this.currentTaskIndex];
        if (!currentTask) return;

        currentTask.questions.forEach(q => {
            const input = document.getElementById(q.id);
            if (input) {
                this.studentAnswers[q.id] = input.value.trim();
            }
        });
    }

    loadTaskContent() {
        this.saveCurrentAnswer(); // Зберігаємо відповідь перед переходом
        const task = this.OLYMPIAD_DATA[this.currentTaskIndex];
        if (!task) return;

        this.dom.currentTaskNumber.textContent = this.currentTaskIndex + 1;
        this.dom.taskNameDisplay.textContent = task.name;
        this.dom.taskMaxPoints.textContent = task.points;
        this.dom.taskInstructions.innerHTML = task.instructions;

        this.renderTask(task);
        this.updateNavigationControls();
    }
    
    renderTask(task) {
        const contentHTML = task.questions.map(q => {
            const savedAnswer = this.studentAnswers[q.id] || '';
            const inputType = q.answer_key.length <= 10 ? 'text' : 'text'; // Можна змінити на 'textarea' для довших відповідей
            const placeholder = inputType === 'textarea' ? 'Напишіть свою відповідь тут...' : 'Введіть відповідь...';

            return `
                <div class="question-block">
                    <p class="question-text">${q.text}</p>
                    <input type="${inputType}" id="${q.id}" class="answer-input" placeholder="${placeholder}" value="${savedAnswer}">
                </div>
            `;
        }).join('');

        this.dom.taskContentContainer.innerHTML = contentHTML;
    }

    navigateTask(delta) {
        let newIndex = this.currentTaskIndex + delta;

        if (newIndex >= 0 && newIndex < this.OLYMPIAD_DATA.length) {
            this.currentTaskIndex = newIndex;
            this.loadTaskContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    updateNavigationControls() {
        this.dom.prevTaskBtn.disabled = this.currentTaskIndex === 0;
        this.dom.nextTaskBtn.disabled = this.currentTaskIndex === this.OLYMPIAD_DATA.length - 1;
        
        if (this.currentTaskIndex === this.OLYMPIAD_DATA.length - 1) {
            this.dom.nextTaskBtn.classList.add('hidden');
            this.dom.finishOlympiadBtn.classList.remove('hidden');
        } else {
            this.dom.nextTaskBtn.classList.remove('hidden');
            this.dom.finishOlympiadBtn.classList.add('hidden');
        }
    }
    
    calculateFinalScore() {
        let rawScore = 0;
        
        this.OLYMPIAD_DATA.forEach(task => {
            const pointsPerQuestion = task.points / task.questions.length;

            task.questions.forEach(q => {
                const studentAnswer = (this.studentAnswers[q.id] || '').toLowerCase().trim();
                const correctAnswer = q.answer_key.toLowerCase().trim();
                if (studentAnswer === correctAnswer) {
                    rawScore += pointsPerQuestion;
                }
            });
        });

        // Конвертація в 12-бальну шкалу
        const finalScore = Math.round((rawScore / this.MAX_RAW_SCORE) * 12);
        
        return {
            rawScore: Math.round(rawScore),
            finalScore: Math.min(finalScore, 12)
        };
    }
    
    showResultsScreen(finalScore, rawScore) {
        if (!this.dom.studentResults) return;
        
        this.dom.studentTasks?.classList.add('hidden');

        this.dom.studentResults.innerHTML = `
            <h2>🎉 Ваші результати</h2>
            <div class="results-section">
                <p class="scale-info">Фінальний бал (12-бальна шкала):</p>
                <div class="score-final-badge">${finalScore}</div>
                <p class="scale-info">Сирий бал: ${rawScore} / ${this.MAX_RAW_SCORE}</p>
                <p style="margin-top: 20px;">Дякуємо за участь в олімпіаді!</p>
                <button id="resultsLogoutBtn" class="btn btn-primary" style="margin-top: 30px;">Вихід</button>
            </div>
        `;
        // Оновлюємо слухача після рендерингу
        document.getElementById('resultsLogoutBtn')?.addEventListener('click', this.logout.bind(this));
    }
    
    async finishOlympiad() {
        if (!confirm("Ви впевнені, що хочете завершити олімпіаду? Ви не зможете повернутися!")) return;

        clearInterval(this.timer);
        this.timeRemaining = 0;
        this.saveCurrentAnswer(); // Фінальне збереження відповідей

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Користувач не автентифікований.");

            const scores = this.calculateFinalScore();

            await db.collection('users').doc(user.uid).update({
                answers: this.studentAnswers,
                completed: true,
                rawScore: scores.rawScore,
                finalScore: scores.finalScore,
                timeRemaining: 0, 
                submissionTime: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.showNotification(`Олімпіада завершена! Ваш фінальний бал: ${scores.finalScore} / 12`, "success");
            this.showResultsScreen(scores.finalScore, scores.rawScore);

        } catch (error) {
            console.error("Помилка завершення олімпіади:", error);
            this.showNotification(`Помилка: Не вдалося надіслати відповіді. ${error.message}`, "error");
        }
    }
    
    /**
     * ====================================================
     * ЧАСТИНА 4: ЛОГІКА АДМІНІСТРАТОРА (Відновлені/Виправлені методи)
     * ====================================================
     */

    // ВИПРАВЛЕННЯ: Додано відсутній метод
    loadAdminData() {
        this.renderStats(); // Завантаження початкової статистики
        // Відображення панелі статистики за замовчуванням
        this.dom.statsPanel?.classList.remove('hidden');
        this.dom.usersPanel?.classList.add('hidden');
        this.dom.createPanel?.classList.add('hidden');
        // Оновлення максимального балу
        if (this.dom.maxRawScore) {
            this.dom.maxRawScore.textContent = this.MAX_RAW_SCORE;
        }
        // Встановлення активної вкладки
        this.dom.adminTabs?.forEach(tab => {
            if (tab.dataset.tab === 'stats') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // ВИПРАВЛЕННЯ: Додано відсутній метод (викликає TypeError 2)
    handleAdminTabSwitch(e) {
        const targetTab = e.target.dataset.tab;
        
        // Hide all panels
        this.dom.statsPanel?.classList.add('hidden');
        this.dom.usersPanel?.classList.add('hidden');
        this.dom.createPanel?.classList.add('hidden');

        // Show active panel
        document.getElementById(`${targetTab}Panel`)?.classList.remove('hidden');

        // Update active tab styling
        this.dom.adminTabs?.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');

        // Load data specific to the tab
        if (targetTab === 'users') {
            this.paginationState.currentPage = 1;
            this.paginationState.pageHistory = [null];
            this.loadUsersTable();
        } else if (targetTab === 'stats') {
            this.renderStats(); 
        }
    }

    // ВИПРАВЛЕННЯ: Додано відсутній метод
    renderStats() {
        if (typeof db === 'undefined' || !this.dom.totalUsers) return;

        db.collection('users').where('role', '==', 'student').get().then(snapshot => {
            const total = snapshot.size;
            let completed = 0;
            snapshot.forEach(doc => {
                if (doc.data().completed) {
                    completed++;
                }
            });
            this.dom.totalUsers.textContent = total;
            this.dom.completedUsers.textContent = completed;
            this.dom.activeUsers.textContent = total - completed;
            this.dom.maxRawScore.textContent = this.MAX_RAW_SCORE;
        }).catch(error => {
            console.error("Помилка завантаження статистики:", error);
            this.showNotification("Помилка завантаження статистики.", "error");
        });
    }

    async loadUsersTable() {
        if (typeof db === 'undefined' || !this.dom.resultsTableBody) return;

        const startAtRef = this.paginationState.pageHistory[this.paginationState.currentPage - 1];

        try {
            // УВАГА: Для коректної пагінації потрібен індекс у Firestore: role asc, name asc
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
                // Зберігаємо останній документ на поточній сторінці як маркер початку наступної
                this.paginationState.pageHistory.push(snapshot.docs[this.PAGE_SIZE - 1]);
            }
            
            this.dom.resultsTableBody.innerHTML = users.map((res, index) => {
                const globalIndex = ((this.paginationState.currentPage - 1) * this.PAGE_SIZE) + index + 1;
                const completed = res.completed;
                const statusText = completed ? 'Завершено' : (Object.keys(res.answers || {}).length > 0 ? 'В процесі' : 'Очікує старту');
                const statusClass = completed ? 'success' : 'warning';
                const finalScore = res.finalScore !== undefined ? res.finalScore : '-';
                const rawScore = res.rawScore !== undefined ? res.rawScore : '-';
                
                // Відображення пароля
                const passwordDisplay = res.password ? `<code style="background-color: #f8e6ff; padding: 3px 6px; border-radius: 4px; font-weight: bold;">${res.password}</code>` : '-';


                return `
                    <tr>
                        <td>${globalIndex}</td>
                        <td>${res.name || 'N/A'}</td>
                        <td>${res.class || 'N/A'}</td>
                        <td>${res.email || 'N/A'}</td>
                        <td>${passwordDisplay}</td>
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
                this.dom.resultsTableBody.innerHTML = `<tr><td colspan="8" class="error-message">
                    ПОМИЛКА: Для коректної роботи таблиці необхідно **СТВОРИТИ КОМПОЗИТНИЙ ІНДЕКС** у Firebase. 
                    (Індекс: **role asc, name asc**)
                </td></tr>`;
            } else {
                this.showNotification("Помилка завантаження користувачів для таблиці.", "error");
            }
            this.updatePaginationControls(false, 0);
        }
    }
    
    // ВИПРАВЛЕННЯ: Додано відсутній метод
    updatePaginationControls(hasNextPage, currentUsersCount) {
        if (!this.dom.paginationInfo || !this.dom.prevPageBtn || !this.dom.nextPageBtn) return;

        this.dom.paginationInfo.textContent = `Сторінка ${this.paginationState.currentPage}`;
        this.dom.prevPageBtn.disabled = this.paginationState.currentPage === 1;
        this.dom.nextPageBtn.disabled = !hasNextPage;

        // Якщо поточна сторінка остання, але не перша, ми можемо видалити зайвий елемент з pageHistory, якщо він не потрібен
        if (!hasNextPage && this.paginationState.pageHistory.length > this.paginationState.currentPage) {
             this.paginationState.pageHistory.pop();
        }
    }

    // ВИПРАВЛЕННЯ: Додано відсутній метод
    changePage(delta) {
        const newPage = this.paginationState.currentPage + delta;
        if (newPage < 1) return;
        
        // Для повернення назад
        if (delta === -1) {
            this.paginationState.pageHistory.pop(); // Видаляємо маркер початку поточної сторінки
        }

        this.paginationState.currentPage = newPage;
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
        
        if (!name || !className || !this._adminEmail || !this._adminPassword) {
             this.showNotification("Помилка: Сесія адміністратора втрачена. Будь ласка, перезалогіньтеся.", "error");
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

        let counter = 1;
        let finalEmail = email;
        while ((await db.collection('users').where('email', '==', finalEmail).get()).size > 0) {
            finalEmail = `${emailBase}${counter}@olymp.com`.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
            counter++;
        }
        
        const password = Math.random().toString(36).slice(-8);

        try {
            // Крок 1: Створення користувача (автоматично перелогінює на учня)
            await auth.createUserWithEmailAndPassword(finalEmail, password);
            const newUID = auth.currentUser.uid;

            // Крок 2: Зберігання метаданих у Firestore (Зберігаємо пароль)
            await db.collection('users').doc(newUID).set({
                uid: newUID,
                name: name,
                class: className,
                email: finalEmail,
                password: password, // <-- ЗБЕРІГАННЯ ПАРОЛЮ
                role: 'student',
                completed: false,
                answers: {},
                rawScore: 0,
                finalScore: 0,
                timeRemaining: this.totalDuration 
            });

            // Крок 3: ПРИМУСОВЕ ВІДНОВЛЕННЯ СЕСІЇ АДМІНА
            await auth.signOut(); // Вихід з акаунта щойно створеного учня
            
            // ПРИМУСОВИЙ ПЕРЕЛОГІН АДМІНА
            await auth.signInWithEmailAndPassword(this._adminEmail, this._adminPassword);
            
            // Фінальні кроки
            this.dom.createUserForm.reset();
            this.showNotification(`Успішно створено учня: ${name}. Адмін-сесія відновлена.`, "success");
            this.renderCreatedCredentials(name, finalEmail, password);
            this.renderStats();
            if (document.querySelector('.tabs .tab.active')?.dataset.tab === 'users') {
                 this.loadUsersTable();
            }

        } catch (error) {
            console.error("Помилка створення учня:", error);
            let errorMessage = error.message.includes("email-already-in-use")
                ? "Цей email вже використовується."
                : `Помилка: ${error.message} (код: ${error.code})`;

            this.showNotification(`Помилка створення: ${errorMessage}`, "error");
            
            // Якщо була помилка, потрібно спробувати перелогінити адміна, якщо його сесія злетіла
             if (auth.currentUser && auth.currentUser.email !== this._adminEmail) {
                await auth.signOut();
                await auth.signInWithEmailAndPassword(this._adminEmail, this._adminPassword).catch(e => {
                    this.showNotification("Критична помилка: Не вдалося відновити сесію адміністратора. Потрібен ручний вхід.", "error");
                });
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
