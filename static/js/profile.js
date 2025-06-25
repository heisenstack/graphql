import { drawCircleChart } from "./charts/circleChart.js";
import { drawSkillsGraph } from "./charts/skillChart.js";
import { logout } from "./auth.js";
import { formatting, totalXp } from "./utils.js";
import { API_Global, query } from "./variables.js";

let user = {};
let profileDiv = "";
const body = document.body;

async function userPage() {
  const success = await graphQlUser();
  if (!success) return;

  profileDiv = `
    <div class="app-container">
    <div class="sidebar">
    <div class="sidebar-header">
    <div class="user-avatar">
    <span>${user.info.firstName.charAt(0)}${user.info.lastName.charAt(0)}</span>
    </div>
    </div>
    
    <div class="sidebar-content">
    <div class="user-info-item">
    <label>Login:</label>
    <span>${user.info.login}</span>
    </div>
    
    <div class="user-info-item">
    <label>First Name:</label>
    <span>${user.info.firstName} ${user.info.lastName}</span>
    </div>

    
    <div class="user-info-item">
    <label>Campus:</label>
    <span>${user.info.campus || ""}</span>
    </div>
    
    <div class="user-info-item">
    <label>Total XP:</label>
    <span>${formatting(user.totalXp) || "0 B"}</span>
    </div>
    
    <div class="user-info-item">
    <label>Current Level:</label>
    <span>${user.level || ""}</span>
    </div>
    </div>
    
    <button id="logoutBtn" class="logout-btn">
    <img src="./static/js/icons/logout.png" alt="logout"/>
    Logout
    </button>
    </div>

    <main class="main-content">

    
    <div id="dashboard" class="dashboard">
    <section class="card skills-card">
    <h2>Skills</h2>
    <svg id="skillsGraph"></svg>
    </section>
    
    
    <section class="card">
  <h2>Last activity</h2>
  <ul>
    ${user.lastProject
      .map(
        (project) => `
        <li>
          ${project?.object.name}
          <span style="color: ${project?.amount < 0 ? "red" : "green"};">
            ${formatting(project?.amount)}
          </span>
        </li>`
      )
      .join("")}
  </ul>
    </section>
    
    <section id="audit-chart" class="card">
    <h2><span>Audits Ratio</span></h2>
            <div class="audit-ratio">
          <strong>Ratio: ${user.info.auditRatio?.toFixed(2) || "N/A"}</strong>
        </div>
    <div class="chart-container" style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <div id="circleChart" style="display: flex; justify-content: center;"></div>
      <div class="chart-legend">
        <div class="legend-item">
          <span style="color: #10b981;">Done: ${formatting(
            user.info.totalUp
          )} &uarr;</span>
        </div>
        <div class="legend-item">
          <span style="color: #ef4444;">Received: ${formatting(
            user.info.totalDown
          )} 	&darr;</span>
        </div>

      </div>
    </div>
    </section>
    </div>
    </main>
    </div>
  `;
  body.innerHTML = "";

  body.innerHTML = profileDiv;
  if (user.info.totalUp != null || user.info.campus != null) {
    drawCircleChart(user);
    drawSkillsGraph(user.skills);
  } else {
    document.getElementById("dashboard").innerHTML = `<div class="alert-box">
    <div>
    Your profile is missing some information. Complete the remaining fields to keep progressing on your tasks!
    </div>
    </div>`;
  }

  document.getElementById("logoutBtn").addEventListener("click", logout);
}

async function graphQlUser() {
  try {
    const response = await fetch(API_Global, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hasura-jwt-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      body.innerHTML = `<div class="alert-box">
      <div>
      An error occurred while fetching user data. Please try again later.
      </div>
      </div>`;
      logout();
      return false;
    }

    const data = await response.json();

    if (data.errors) {
      logout();
      return false;
    }

    generalUserInfos(data);
    return true;
  } catch (err) {
    body.innerHTML = `<div class="alert-box">
    <div>
    An error occurred while fetching user data. Please check your internet connection or try again later.
    </div>
    </div>`;
    return false;
  }
}

function generalUserInfos(data) {
  user.info = data.data.user[0];
  user.level = user.info.levels[0]?.amount;
  user.totalXp = totalXp(data.data.transaction);
  user.lastProject = data.data.user[0].modules;
  user.skills = data.data.user[0].skills;
  user.skills.sort((a, b) => {
    return b.amount - a.amount;
  });

  user.transaction = data.data.transaction;
  console.log(data);
  
}

export { userPage };
