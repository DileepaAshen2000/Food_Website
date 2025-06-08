
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpAmPGgRt3gtjTAHOldZKdj-_iAd6IQag",
  authDomain: "mensa-foods.firebaseapp.com",
  databaseURL: "https://mensa-foods-default-rtdb.firebaseio.com",
  projectId: "mensa-foods",
  storageBucket: "mensa-foods.firebasestorage.app",
  messagingSenderId: "397172133190",
  appId: "1:397172133190:web:e8df9ff4c89de623e8a947",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  googleProvider,
  signInWithPopup,
  signOut,
  deleteUser
};
