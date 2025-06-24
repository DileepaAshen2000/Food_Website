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
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    let msg = '';
    switch (error.code) {
      case 'auth/email-already-in-use':
        msg = 'This email is already registered.';
        break;
      case 'auth/invalid-email':
        msg = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        msg = 'Password is too weak. Use at least 6 characters.';
        break;
      default:
        msg = 'Signup failed. Please try again.';
    }
    return { success: false, error: msg };
  }
}

//! Email/Password Login
export async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let msg = '';
    switch (error.code) {
      case 'auth/user-not-found':
        msg = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        msg = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
        msg = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        msg = 'Too many failed attempts. Please try again later.';
        break;
      default:
        msg = 'Please try again.';
    }
    return { success: false, error: msg };
  }
}

//! Password Reset
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    let msg = '';
    switch (error.code) {
      case 'auth/missing-email':
        msg = 'Please enter your email address.';
        break;
      case 'auth/user-not-found':
        msg = 'No account found with this email.';
        break;
      case 'auth/invalid-email':
        msg = 'Invalid email format.';
        break;
      default:
        msg = 'Failed to send reset email. Please try again.';
    }
    return { success: false, error: msg };
  }
}

//! Google Sign-In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    let msg = '';
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        msg = 'Google sign-in was canceled.';
        break;
      case 'auth/cancelled-popup-request':
        msg = 'Another sign-in popup is already open.';
        break;
      case 'auth/popup-blocked':
        msg = 'Popup was blocked by the browser. Please allow popups.';
        break;
      default:
        msg = 'Google sign-in failed. Please try again.';
    }
    return { success: false, error: msg };
  }
}

//! LOGOUT FUNCTION
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Logout failed. Please try again.' };
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
    let msg = '';
    switch (error.code) {
      case 'auth/requires-recent-login':
        msg = 'You must re-login before deleting your account.';
        break;
      default:
        msg = 'Failed to delete account. Please try again.';
    }
    return { success: false, error: msg };
  }
}
