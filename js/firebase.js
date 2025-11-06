const firebaseConfig = {
  apiKey: "AIzaSyDwmb3Kkp-LI5ZgL3Dgk6zuEJkKCQ4cv3A",
  authDomain: "chwilaskupienia-4a66d.firebaseapp.com",
  projectId: "chwilaskupienia-4a66d",
  storageBucket: "chwilaskupienia-4a66d.appspot.com",
  messagingSenderId: "270040164845",
  appId: "1:270040164845:web:4a3c3b2c10566be8689fe4",
  measurementId: "G-KS1VB5ZX1K"
};

// Inicjalizacja Firebase
firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();
window.db = firebase.database();

