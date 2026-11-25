// Initialize local storage arrays if they don't exist
if (!localStorage.getItem("sr_users")) localStorage.setItem("sr_users", JSON.stringify([]));
if (!localStorage.getItem("sr_session")) localStorage.setItem("sr_session", JSON.stringify(null));

// UI Elements
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

// Tab Switching
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.hidden = false;
  signupForm.hidden = true;
  loginError.hidden = true;
  signupError.hidden = true;
});

tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.hidden = false;
  loginForm.hidden = true;
  loginError.hidden = true;
  signupError.hidden = true;
});

// Handle Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;

  const users = JSON.parse(localStorage.getItem("sr_users"));

  // Check if email exists
  if (users.find(u => u.email === email)) {
    signupError.textContent = "An account with this email already exists.";
    signupError.hidden = false;
    return;
  }

  // Save user (Note: storing plain text passwords is bad practice, but okay for a frontend demo)
  const newUser = { name, email, password, profile: null };
  users.push(newUser);
  localStorage.setItem("sr_users", JSON.stringify(users));

  // Auto login
  localStorage.setItem("sr_session", JSON.stringify(newUser));
  window.location.href = "profile.html";
});

// Handle Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("sr_users"));
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    loginError.textContent = "Invalid email or password.";
    loginError.hidden = false;
    return;
  }

  // Save session and redirect
  localStorage.setItem("sr_session", JSON.stringify(user));
  window.location.href = "profile.html";
});