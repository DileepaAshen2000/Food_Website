
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
  apiKey: "AIzaSyC-t81O4bJYxOXnva52ZfJhIZBO7KQn7F8",
  authDomain: "mensa-admin.firebaseapp.com",
  projectId: "mensa-admin",
  storageBucket: "mensa-admin.firebasestorage.app",
  messagingSenderId: "851049381206",
  appId: "1:851049381206:web:d714fac45a2073a6332af7",
  databaseURL: "https://mensa-admin-default-rtdb.firebaseio.com/",
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
