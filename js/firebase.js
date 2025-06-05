// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwmb3Kkp-LI5ZgL3Dgk6zuEJkKCQ4cv3A",
  authDomain: "chwilaskupienia-4a66d.firebaseapp.com",
  projectId: "chwilaskupienia-4a66d",
  storageBucket: "chwilaskupienia-4a66d.firebasestorage.app",
  messagingSenderId: "270040164845",
  appId: "1:270040164845:web:4a3c3b2c10566be8689fe4",
  measurementId: "G-KS1VB5ZX1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);