/**
 * =====================================
 * ФАЙЛ: script.js (ВИПРАВЛЕНИЙ ТА ПОВНИЙ КОД)
 * ЛОГІКА: English Olympiad - Cloud Edition
 * =====================================
 */

// Глобальні об'єкти Firebase вже ініціалізовані в index.html: app, auth, db

class OlympiadApp {
    constructor() {
        console.log("OlympiadApp ініціалізується...");

        // 1. DOM Елементи (викликається тут, щоб забезпечити, що DOM завантажено)
        this.dom = this.getDOMElements();
        
        // 2. Змінні стану
        this.adminCodeword = "test2024"; // Кодове слово для адміна
        this.currentTaskIndex = 0;
        this.timer = null;

        // 3. Ініціалізація слухачів подій (Виправлено помилку 'null')
        this.initEventListeners();
        
        // 4. Перевірка статусу автентифікації Firebase
        this.setupAuthListener();

        // Початковий вигляд: тільки mainView
        this.showView('mainView');
    }

    /**
     * ====================================================
     * ЧАСТИНА 1: ІНІЦІАЛІЗАЦІЯ ТА ПЕРЕМИКАННЯ ВИГЛЯДІВ
     * ====================================================
     */

    getDOMElements() {
        // У цьому методі збираємо всі потрібні елементи з DOM
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
            currentTaskNum: document.getElementById('currentTaskNum'),
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
            ],
            notificationArea: document.getElementById('notificationArea')
        };
    }

    initEventListeners() {
        // ВИПРАВЛЕННЯ ПОМИЛКИ: this.dom.modeSelector більше не null!
        if (this.dom.modeSelector) {
            this.dom.modeSelector.addEventListener('click', this.handleModeSelection.bind(this));
        }

        // Кнопки "Назад" (на головну)
        document.querySelectorAll('[data-action="backToMain"]').forEach(button => {
            button.addEventListener('click', this.resetToMain.bind(this));
        });

        // Форми логіну
        this.dom.studentLoginForm?.addEventListener('submit', this.handleStudentLogin.bind(this));
        this.dom.adminLoginForm?.addEventListener('submit', this.handleAdminLogin.bind(this));

        // Вихід (додаємо перевірку на існування)
        this.dom.studentLogoutBtn?.addEventListener('click', this.logout.bind(this));
        this.dom.adminLogoutBtn?.addEventListener('click', this.logout.bind(this));
        
        // Адмін-панель: Перемикання вкладок
        this.dom.adminTabs?.forEach(tab => {
            tab.addEventListener('click', this.handleAdminTabSwitch.bind(this));
        });

        // Адмін-панель: Створення учня
        this.dom.createUserForm?.addEventListener('submit', this.handleCreateUser.bind(this));
        
        // Студент: Старт олімпіади
        this.dom.startOlympiadBtn?.addEventListener('click', this.startOlympiad.bind(this));

        // Студент: Навігація завдань
        this.dom.prevTaskBtn?.addEventListener('click', () => this.navigateTask(-1));
        this.dom.nextTaskBtn?.addEventListener('click', () => this.navigateTask(1));
        this.dom.finishOlympiadBtn?.addEventListener('click', this.finishOlympiad.bind(this));
    }
    
    // Хелпер для перемикання головних View
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
        // Очищення помилок
        this.dom.studentError.classList.add('hidden');
        this.dom.adminError.classList.add('hidden');
    }

    /**
     * Обробка натискання кнопок "Я - Учень" / "Я - Адміністратор"
     * @param {Event} e 
     */
    handleModeSelection(e) {
        const modeButton = e.target.closest('button');
        if (!modeButton) return;

        const mode = modeButton.dataset.mode;
        if (mode) {
            this.showLoginForm(mode);
        }
    }

    /**
     * Відображає потрібну форму логіну
     * @param {string} mode - 'student' або 'admin'
     */
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
        
        // Показ
        setTimeout(() => {
            notificationDiv.classList.add('show');
        }, 10);
        
        // Приховування
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
        auth.onAuthStateChanged(user => {
            if (user) {
                // Користувач увійшов
                this.loadUserProfile(user);
            } else {
                // Користувач вийшов
                this.showView('mainView');
                this.dom.studentAppView.classList.add('hidden');
                this.dom.adminAppView.classList.add('hidden');
            }
        });
    }

    async loadUserProfile(user) {
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
                // Якщо даних користувача немає, можливо, це новий користувач або помилка
                this.showNotification("Помилка: Профіль не знайдено. Перевірте роль.", "error");
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
            // Успішний вхід. Далі спрацює setupAuthListener
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
            // Успішний вхід. Далі спрацює setupAuthListener і перевірить роль.
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
            this.showResultsScreen();
        } else {
            this.dom.startOlympiadBtn.disabled = false;
            this.dom.startOlympiadBtn.textContent = '🔥 Розпочати Олімпіаду';
            this.dom.studentTasks.classList.add('hidden');
            this.dom.studentIntro.classList.remove('hidden');
            this.dom.studentResults.classList.add('hidden'); // Приховуємо результати, якщо не завершено
        }
    }
    
    startOlympiad() {
        if (confirm("Ви впевнені, що готові розпочати? Час піде одразу!")) {
            this.dom.studentIntro.classList.add('hidden');
            this.dom.studentTasks.classList.remove('hidden');
            
            // Тут має бути логіка завантаження завдань та старту таймера
            this.showNotification("Олімпіада розпочата! Час пішов.", "success");
            this.loadTasksAndStartTimer();
        }
    }
    
    loadTasksAndStartTimer() {
        // ... (Тут буде логіка для завантаження контенту завдань)
        // Для демонстрації просто показуємо перше завдання
        this.renderTask(0);
        this.startTaskTimer(1200); // 20 хвилин = 1200 секунд
    }
    
    navigateTask(delta) {
        const newIndex = this.currentTaskIndex + delta;
        if (newIndex >= 0 && newIndex < 5) { // Припустимо, у нас 5 завдань (індекси 0-4)
            this.renderTask(newIndex);
        }
    }

    finishOlympiad() {
        if (confirm("Ви впевнені, що хочете завершити олімпіаду? Ви не зможете повернутися!")) {
            clearInterval(this.timer);
            this.showNotification("Олімпіада завершена. Очікуйте на результати.", "success");
            this.showResultsScreen();
        }
    }

    renderTask(index) {
        // TODO: Тут має бути реальна логіка відображення контенту завдання з пам'яті або БД
        document.getElementById('currentTaskNum').textContent = index + 1;
        this.dom.taskContentContainer.innerHTML = `
            <h2>Завдання №${index + 1}: Приклад завдання</h2>
            <p>Оберіть правильний варіант, або напишіть слово/фразу.</p>
            <div class="question-block">
                <p class="question-text">Що є столицею Великобританії?</p>
                <input type="text" id="task${index}q1" placeholder="Ваша відповідь">
            </div>
            <p style="margin-top: 20px; color: var(--text-secondary);">Цей контент є заглушкою. Ваш код тут буде завантажувати реальні питання.</p>
        `;
        
        this.currentTaskIndex = index;

        // Оновлення кнопок навігації
        this.dom.prevTaskBtn.disabled = index === 0;
        this.dom.nextTaskBtn.classList.toggle('hidden', index === 4); // Якщо 5 завдань
        this.dom.finishOlympiadBtn.classList.toggle('hidden', index !== 4); // Кнопка "Завершити" на останньому завданні
    }
    
    showResultsScreen() {
        this.dom.studentIntro.classList.add('hidden');
        this.dom.studentTasks.classList.add('hidden');
        this.dom.studentResults.classList.remove('hidden');
        
        // TODO: Відобразити реальні бали
        this.dom.studentResults.querySelector('#resultsContent').innerHTML = `
            <h2>Ваші результати</h2>
            <div class="stats-grid" style="grid-template-columns: 1fr;">
                 <div class="stat-card" style="border-top-color: var(--success);">
                    <div class="stat-number score-final">... / 60</div>
                    <div class="stat-label">Отриманий Бал</div>
                </div>
            </div>
            <p style="margin-top: 30px;">Результати будуть остаточно затверджені адміністратором.</p>
        `;
    }
    
    startTaskTimer(durationSeconds) {
        // Реалізація простого таймера
        let timer = durationSeconds, minutes, seconds;
        clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.dom.timerDisplay.textContent = minutes + ":" + seconds;
            
            this.dom.timerDisplay.classList.remove('warning', 'critical');
            if (timer <= 300) { // 5 хвилин
                this.dom.timerDisplay.classList.add('warning');
            } else if (timer <= 60) { // 1 хвилина
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
     * ЧАСТИНА 4: АДМІН-ПАНЕЛЬ
     * ====================================================
     */
     
    async loadAdminData() {
        this.showNotification("Дані адміністратора завантажено.", "success");
        this.renderStatsPlaceholder();
        this.loadResultsTable();
    }
    
    handleAdminTabSwitch(e) {
        const tab = e.target;
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
        // Приклад заповнення даних
        this.dom.totalUsers.textContent = 55;
        this.dom.activeUsers.textContent = 12;
        this.dom.completedUsers.textContent = 23;
        this.dom.class10Users.textContent = 30;
    }
    
    loadResultsTable() {
        // ... (Логіка завантаження завершених результатів)
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
        
        // Генеруємо логін (email) та простий пароль
        const baseEmail = name.toLowerCase().replace(/ /g, '.');
        const email = `${baseEmail.split('.')[0]}.${baseEmail.split('.')[1]}@olymp.com`.replace('..', '.');
        const password = Math.random().toString(36).slice(-8);

        try {
            // 1. Створення користувача в Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            // 2. Збереження даних користувача в Firestore
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

// Ініціалізація додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи ініціалізовано Firebase у <script> в index.html
    if (typeof firebase !== 'undefined' && typeof firebase.initializeApp !== 'undefined') {
        window.olympiadApp = new OlympiadApp();
    } else {
        console.error("Firebase не ініціалізовано. Перевірте <script> теги в index.html.");
    }
});
