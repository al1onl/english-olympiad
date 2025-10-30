// firebase-config.js
// Цей файл містить ваші облікові дані та ініціалізує Firebase

const firebaseConfig = {
    apiKey: "AIzaSyAPnJFF03dqUF6hc9J4i5sL-K02LjavA5Q",
    authDomain: "olympiad-app-2024-591ee.firebaseapp.com",
    projectId: "olympiad-app-2024-591ee",
    storageBucket: "olympiad-app-2024-591ee.firebasestorage.app",
    messagingSenderId: "421657499179",
    appId: "1:421657499179:web:95a510e9d9fc146c6dfc6e"
};

// Ініціалізація Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Глобальні об'єкти для доступу в script.js
const auth = firebase.auth();
const db = firebase.firestore();
