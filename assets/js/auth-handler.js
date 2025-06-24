import {
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
  signInWithGoogle,
  logoutUser,
  deleteAccount
} from './firebase-service.js';

document.addEventListener("DOMContentLoaded", function () {

  //! SIGNUP FORM SUBMISSION
  document.getElementById("signupFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullname = this.querySelector("input[name='fullname']").value.trim();
    const email = this.querySelector("input[name='email']").value.trim();
    const password = this.querySelector("input[name='password']").value;
    const confirmPassword = this.querySelector("input[name='confirmPassword']").value;

    // ✅ VALIDATIONS
    if (!fullname) {
      alert("Name is required.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and include at least one number and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 🔐 Firebase Signup
    const result = await signUpWithEmail(email, password, fullname);
    if (result.user) {
      alert("Signup successful! You can now login.");
      showLogin();
    } else {
      alert("Signup error: " + JSON.stringify(result.error));
    }
  });

  //! LOGIN FORM SUBMISSION
  document.getElementById("loginFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value.trim();
    const password = e.target.querySelector('input[type="password"]').value;

    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!password) {
      alert("Password is required.");
      return;
    }

    const result = await signInWithEmail(email, password);
    if (result.success) {
      alert("Login successful!");
      window.location.href = "/index.html";
    } else {
      alert("Login failed: " + result.error);
    }
  });

  //! FORGOT PASSWORD
  document.getElementById("forgotPasswordFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value.trim();
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const result = await sendPasswordReset(email);
    if (result.success) {
      alert("Password reset email sent! Check your inbox.");
      showLogin();
    } else {
      alert("Error: " + result.error);
    }
  });

  //! GOOGLE LOGIN
  document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      alert("Google Sign-In Successful!");
      window.location.href = "/index.html";
    } else {
      alert("Google login error: " + result.error);
    }
  });

  //! LOGOUT
  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    const result = await logoutUser();
    if (result.success) {
      alert("Logged out successfully!");
      window.location.href = "/index.html";
    } else {
      alert("Logout error: " + result.error);
    }
  });

  //! DELETE ACCOUNT
  document.getElementById("confirmDeleteBtn")?.addEventListener("click", async () => {
    const result = await deleteAccount();
    if (result.success) {
      alert("Account deleted successfully!");
      window.location.href = "/index.html";
    } else {
      alert("Delete error: " + result.error);
    }
  });
});

// 🔍 UTIL: EMAIL VALIDATOR
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 🔁 FORM SWITCHERS
function toggleForms() {
  document.getElementById('loginForm').classList.toggle('active');
  document.getElementById('signupForm').classList.toggle('active');
  document.getElementById('forgotPasswordForm').classList.remove('active');
}

function showForgotPassword() {
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('signupForm').classList.remove('active');
  document.getElementById('forgotPasswordForm').classList.add('active');
}

function showLogin() {
  document.getElementById('forgotPasswordForm').classList.remove('active');
  document.getElementById('signupForm').classList.remove('active');
  document.getElementById('loginForm').classList.add('active');
}

// Expose to window if needed
window.toggleForms = toggleForms;
window.showForgotPassword = showForgotPassword;
window.showLogin = showLogin;
