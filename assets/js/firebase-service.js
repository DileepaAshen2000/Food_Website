
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  googleProvider,
  signInWithPopup,
  signOut,
  deleteUser
} from './firebase-config.js';

//! Email/Password Sign Up
export async function signUpWithEmail(email, password, fullname) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // You can add additional user info here if needed
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//! Email/Password Login
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//! Password Reset
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//! Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// !LOGOUT FUNCTION
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//! DELETE ACCOUNT FUNCTION
export async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
      return { success: true };
    } else {
      return { success: false, error: "No user is currently signed in." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}