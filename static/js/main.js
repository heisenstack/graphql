import { loginPage } from "./auth.js";
import { userPage } from "./profile.js";


addEventListener("DOMContentLoaded", () => {
  
  const jwt = localStorage.getItem("hasura-jwt-token");
  if (!jwt) {
    loginPage();
  } else {
    userPage();
  }
});
