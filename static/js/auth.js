import { userPage } from "./profile.js";
import { API_LOGIN } from "./variables.js";

let loginDiv = `<div class="login-container">
  <h2>Login</h2>
  <input type="text" id="username-email" placeholder="Enter your Username, Email" />
  <input type="password" id="password" placeholder="Enter your Password" />
  <button id="loginId">Login</button>
  <div class="error" id="error"></div>
</div>`;

const body = document.body;

let username, password, loginBtn, error;

function loginPage() {
  body.innerHTML = loginDiv;
  document.body.className = "login-page";
  username = document.getElementById("username-email");

  password = document.getElementById("password");
  loginBtn = document.getElementById("loginId");
  error = document.getElementById("error");
  loginBtn.addEventListener("click", loginHandler);
}

async function loginHandler() {
  if (username.value.length == 0 || password.value.length == 0) {
    error.innerHTML = "Username of Password can't be empty";
    return;
  }

  const token = await login();
  if (token) {
    localStorage.setItem("hasura-jwt-token", token);
    userPage();
  }
}

async function login() {
  const usernameInput = username.value;
  const passwordInput = password.value;

  const credentials = btoa(`${usernameInput}:${passwordInput}`);


  try {
    const response = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      const json = await response.json();
      error.innerHTML = json.error || "Invalid credentials, please try again!";
      return;
    }

    if (response.ok) {
      const token = await response.json();
      return token;
    }
  } catch (err) {
    console.log("Error during login:", err);
    
    error.innerHTML = err || "Error during login, please try again!";
    return;
  }
}

function logout() {
  localStorage.removeItem("hasura-jwt-token");
  location.reload();
}

export { loginPage, logout, login };
