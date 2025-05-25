
import { 
  signUpWithEmail, 
  signInWithEmail, 
  sendPasswordReset, 
  signInWithGoogle ,
  logoutUser,
  deleteAccount
} from './firebase-service.js';

document.addEventListener("DOMContentLoaded", function () {
  // !Signup Form Submission
  document.getElementById("signupFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullname = this.querySelector("input[name='fullname']").value;
    const email = this.querySelector("input[name='email']").value;
    const password = this.querySelector("input[name='password']").value;
    const confirmPassword = this.querySelector("input[name='confirmPassword']").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = await signUpWithEmail(email, password, fullname);
    if (result.success) {
      alert("Signup successful! You can now login.");
      showLogin();
    } else {
      alert("Signup error: " + result.error);
    }
  });

  // !Login Form Submission
  document.getElementById("loginFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const result = await signInWithEmail(email, password);
    if (result.success) {
      alert("Login successful!");
      // Redirect to dashboard or home page
      window.location.href = "/index.html";
    } else {
      alert("Login failed: " + result.error);
    }
  });

  //! Forgot Password Form Submission
  document.getElementById("forgotPasswordFormElement")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    const result = await sendPasswordReset(email);
    if (result.success) {
      alert("Password reset email sent! Check your inbox.");
      showLogin();
    } else {
      alert("Error: " + result.error);
    }
  });

  //! Google Login Button
  document.getElementById("googleLoginBtn")?.addEventListener("click", async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      alert("Google Sign-In Successful!");
      // Redirect to dashboard or home page
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


window.toggleForms = toggleForms;
window.showForgotPassword = showForgotPassword;
window.showLogin = showLogin;