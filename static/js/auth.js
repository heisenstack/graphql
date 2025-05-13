const API_LOGIN = "https://learn.zone01oujda.ma/api/auth/signin";

export async function login(loginForm) {
  const usernameInput = document.querySelector("#username").value;
  const passwordInput = document.querySelector("#password").value;
  loginForm.reset();

  const credentials = btoa(`${usernameInput}:${passwordInput}`);

  try {
    const response = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({ credentials }),
    });

    if (!response.ok) {
      const errorMsg = document.querySelector(".error-message");
      errorMsg.textContent = "Invalid credentials, please try again!";
      throw new Error(response.message);
    }

    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("jwt", token);
      return token;
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

export function logout() {
  localStorage.removeItem("jwt");
  location.reload();
}
