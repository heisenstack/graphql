import { login, logout } from "./auth.js";
import { loadProfile } from "./profile.js";

const loginForm = document.querySelector(".login-form");
const userProfile = document.querySelector(".user-profile");
const logoutBtn = document.querySelector("#logout-btn");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = await login(loginForm);
  if (token) {
    loginForm.style.display = "none";
    userProfile.style.display = "flex";
    loadProfile(token);
  }
});

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt");
  if (token) {
    loginForm.style.display = "none";
    userProfile.style.display = "flex";
    loadProfile(token);
  }
});
