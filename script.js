/**
 * =====================================
 * ФАЙЛ: script.js (ФІНАЛЬНА ВЕРСІЯ З ПАГІНАЦІЄЮ)
 * =====================================
 */

// Глобальні об'єкти Firebase ініціалізовані в index.html: app, auth, db

class OlympiadApp {
    constructor() {
        console.log("OlympiadApp ініціалізується...");

        // 1. DOM Елементи
        this.dom = this.getDOMElements();
        
        // 2. Змінні стану
        this.adminCodeword = "test2024"; 
        this.currentTaskIndex = 0;
        this.timer = null;
        this.studentAnswers = {}; 

        // Налаштування пагінації для Адмін-панелі
        this.PAGE_SIZE = 10; // Кількість записів на сторінку
        this.paginationState = {
            currentPage: 1,
            lastVisible: null, // Останній елемент поточної сторінки
            pageHistory: [null] // Зберігаємо початкові елементи кожної сторінки
        };

        // 3. СТРУКТУРА ДАНИХ ОЛІМПІАДИ (Не змінена)
        this.OLYMPIAD_DATA = [
             // ... ВАШ КОНТЕНТ ЗАВДАНЬ ... 
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
        // ... (Попередні DOM елементи)
        const elements = {
            // ... (Всі DOM елементи, як і раніше)
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

            // Пагінація
            prevPageBtn: document.getElementById('prevPageBtn'),
            nextPageBtn: document.getElementById('nextPageBtn'),
            paginationInfo: document.getElementById('paginationInfo'),


            // Загальне
            allViews: [
                document.getElementById('mainView'),
                document.getElementById('studentAppView'),
                document.getElementById('adminAppView')
            ].filter(el => el !== null), 
            notificationArea: document.getElementById('notificationArea')
        };
        return elements;
    }

    initEventListeners() {
        // ... (Попередні слухачі подій)
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
        
        // НОВІ: Слухачі для пагінації
        this.dom.prevPageBtn?.addEventListener('click', () => this.changePage(-1));
        this.dom.nextPageBtn?.addEventListener('click', () => this.changePage(1));
    }
    
    // ... (Методи showView, resetToMain, handleModeSelection, showLoginForm, showNotification, setupAuthListener, loadUserProfile, handleStudentLogin, handleAdminLogin, logout)
    // ... (Методи Student App: renderStudentIntro, startOlympiad, loadTasksAndStartTimer, saveCurrentAnswer, loadTaskContent, renderTask, navigateTask, finishOlympiad, showResultsScreen, startTaskTimer)
    
    /**
     * ====================================================
     * ЧАСТИНА 4: АДМІН-ПАНЕЛЬ (Пагінація)
     * ====================================================
     */
     
    async loadAdminData() {
        this.showNotification("Дані адміністратора завантажено.", "success");
        await this.renderStats();
        // Запускаємо завантаження таблиці на першій сторінці
        this.loadUsersTable(); 
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
            // При перемиканні на вкладку "Користувачі" скидаємо пагінацію і завантажуємо першу сторінку
            this.paginationState = { currentPage: 1, lastVisible: null, pageHistory: [null] };
            this.loadUsersTable();
        }
    }
    
    // ... (renderStats - без змін)
    async renderStats() { 
        if (typeof db === 'undefined') return;

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

    // НОВИЙ МЕТОД: Завантаження даних користувачів з пагінацією
    async loadUsersTable() {
        if (typeof db === 'undefined') return;

        const startAt = this.paginationState.pageHistory[this.paginationState.currentPage - 1];
        
        try {
            let query = db.collection('users')
                            .where('role', '==', 'student')
                            .orderBy('name') // Сортування за ім'ям (обов'язково для пагінації)
                            .limit(this.PAGE_SIZE);

            if (startAt) {
                query = query.startAfter(startAt);
            }
            
            // Щоб визначити, чи є наступна сторінка, запитуємо на 1 елемент більше
            const snapshot = await query.get();
            
            const users = [];
            let lastVisibleDoc = null;
            
            // Якщо є більше, ніж PAGE_SIZE, значить, є наступна сторінка
            const hasNextPage = snapshot.docs.length > this.PAGE_SIZE;
            
            snapshot.docs.forEach((doc, index) => {
                // Додаємо лише в межах PAGE_SIZE
                if (index < this.PAGE_SIZE) {
                    users.push(doc.data());
                }
                // Зберігаємо останній видимий документ для наступного запиту (якщо він не останній)
                if (index === this.PAGE_SIZE - 1 && !hasNextPage) {
                    lastVisibleDoc = doc;
                } else if (index === this.PAGE_SIZE - 1 && hasNextPage) {
                     // Якщо є наступна сторінка, останній видимий документ - це елемент на межі
                     lastVisibleDoc = doc;
                }
            });
            
            // Оновлюємо стан пагінації
            if (this.paginationState.currentPage === this.paginationState.pageHistory.length) {
                // Додаємо елемент, з якого почнеться наступна сторінка
                this.paginationState.pageHistory.push(lastVisibleDoc); 
            }
            this.paginationState.lastVisible = lastVisibleDoc;

            // Рендер таблиці
            this.dom.resultsTableBody.innerHTML = users.map((res, index) => {
                const globalIndex = ((this.paginationState.currentPage - 1) * this.PAGE_SIZE) + index + 1;
                const statusText = res.completed ? 'Завершено' : (res.answers && Object.keys(res.answers).length > 0 ? 'В процесі' : 'Очікує старту');
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
            
            // Оновлення елементів керування пагінацією
            this.updatePaginationControls(hasNextPage, users.length);

        } catch (error) {
            console.error("Помилка завантаження користувачів:", error);
            this.showNotification("Помилка завантаження користувачів для таблиці.", "error");
        }
    }
    
    updatePaginationControls(hasNextPage, currentCount) {
        // Кнопка "Попередня" доступна, якщо ми не на першій сторінці
        this.dom.prevPageBtn.disabled = this.paginationState.currentPage === 1; 

        // Кнопка "Наступна" доступна, якщо Firebase повернув більше елементів, ніж PAGE_SIZE,
        // АБО якщо ми не на останній завантаженій сторінці в історії.
        this.dom.nextPageBtn.disabled = !hasNextPage;
        
        // Відображення інформації про поточну сторінку
        this.dom.paginationInfo.textContent = `Сторінка ${this.paginationState.currentPage}`;
    }

    changePage(direction) {
        if (direction === 1) { // Наступна
            this.paginationState.currentPage++;
            // Якщо ми перейшли на нову сторінку, чистимо історію, якщо вона довша
            if (this.paginationState.pageHistory.length > this.paginationState.currentPage) {
                 this.paginationState.pageHistory.pop(); 
            }

        } else if (direction === -1 && this.paginationState.currentPage > 1) { // Попередня
            this.paginationState.currentPage--;
        }

        // Перезавантажуємо таблицю з новими параметрами
        this.loadUsersTable();
    }


    // Допоміжна функція для транслітерації (не змінена)
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
        return result.replace(/[^a-zA-Z0-9.-@_]/g, ''); // Залишаємо лише латинські символи, цифри та . - @ _
    }

    async handleCreateUser(e) {
        // ... (Метод створення учня - без змін)
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
            this.loadUsersTable(); // Оновлюємо таблицю

        } catch (error) {
            console.error("Помилка створення учня:", error);
            let errorMessage = error.message.includes("email-already-in-use") 
                ? "Цей email вже використовується (Спробуйте інше ім'я)."
                : `Помилка: ${error.message}`;

            this.showNotification(`Помилка створення: ${errorMessage}`, "error");
        }
    }
    
    // ... (renderCreatedCredentials та решта коду - без змін)
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
