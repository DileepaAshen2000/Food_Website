// firebase-auth.js

// Import Firebase SDK modules (use via CDN or with module bundler if using a build system)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpAmPGgRt3gtjTAHOldZKdj-_iAd6IQag",
  authDomain: "mensa-foods.firebaseapp.com",
  databaseURL: "https://mensa-foods-default-rtdb.firebaseio.com",
  projectId: "mensa-foods",
  storageBucket: "mensa-foods.firebasestorage.app",
  messagingSenderId: "397172133190",
  appId: "1:397172133190:web:e8df9ff4c89de623e8a947"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login function
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Forgot password function
export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}
