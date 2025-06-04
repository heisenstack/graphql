import { drawCircleChart } from "./charts/circleChart.js";
import { drawSkillsGraph } from "./charts/skillChart.js";
import { logout } from "./auth.js";
import { formatting, totalXp } from "./utils.js";
import { API_Global, query } from "./variables.js";

let user = {};
const body = document.body;

async function userPage() {
  await graphQlUser();

  let profileDiv = `
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
    
    <div class="user-info-item highlight">
    <label>Total XP:</label>
    <span>${
      formatting(user.totalXp) || "0 B"
      //   user.totalXp > 1000
      //     ? Math.round(user.totalXp / 1000) + " kB"
      //     : Math.trunc(user.totalXp) + " B"
    }</span>
    </div>
    
    <div class="user-info-item highlight">
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
    <section class="card large skills-card">
    <h2>Skills</h2>
    <svg id="skillsGraph" width="100%" height="300"></svg>
    </section>
    
    
    <section class="card">
    <h2>Transaction History</h2>

    <ul>
    <li>
    ${user.lastProject[0]?.object.name}  
    <span style="color: ${user.lastProject[0]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[0]?.amount)}
    </span>
    </li>
    <li>
    ${user.lastProject[1]?.object.name}  
    <span style="color: ${user.lastProject[1]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[1]?.amount)}
    </span>
    </li>
    <li>
    ${user.lastProject[2]?.object.name}  
    <span style="color: ${user.lastProject[2]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[2]?.amount)}
    </span>
    </li>
    <li>
    ${user.lastProject[3]?.object.name}  
    <span style="color: ${user.lastProject[3]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[3]?.amount)}
    </span>
    </li>
    <li>
    ${user.lastProject[4]?.object.name}  
    <span style="color: ${user.lastProject[4]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[4]?.amount)}
    </span>
    </li>
        <li>
    ${user.lastProject[5]?.object.name}  
    <span style="color: ${user.lastProject[5]?.amount < 0 ? "red" : "green"};">
    ${formatting(user.lastProject[5]?.amount)}
    </span>
    </li>

    </ul>
    </section>
    
    <section id="audit-chart" class="card">
    <h2><span>Audits Ratio</span></h2>
            <div class="audit-ratio">
          <strong>Ratio: ${user.info.auditRatio?.toFixed(1) || "N/A"}</strong>
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

  body.innerHTML = profileDiv;
  document.body.className = "user-page";
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
  const response = await fetch(API_Global, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("hasura-jwt-token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });
  if (!response.ok) {
    alert("Error fetching user data. Please try again later.");
  }

  const data = await response.json();
  //   console.log("User Data:", data);
  //   console.log(data.data.transaction);

  if (data.errors) {
    logout();
  }
  generalUserInfos(data);
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
}

export { userPage };
