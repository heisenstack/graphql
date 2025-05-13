import { generateSkillChart } from "./charts/skillChart.js";
import { generateCircleChart } from "./charts/circleChart.js";
import { formatting, generateTopProjects } from "./utils.js";

const API_GRAPHQL =
  "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function loadProfile(token) {
  const query = `{
        user {
            id
            login
            firstName
            lastName
            email
            campus
            auditRatio
            totalUp
            totalDown
            modules: transactions(
                where: { 
                    event: { object: { type: { _eq: "module" } } }, 
                    type: { _eq: "xp" } 
                }
                order_by: { amount: desc}
                limit: 5
            ) {
                object {
                    name
                }
                type
                createdAt
                amount
            }
            levels: transactions(
                where: {eventId: {_eq: 41}, type: {_eq: "level"}}
                order_by: {amount: desc}
                limit: 1
            ) {
                amount
            }
            skills: transactions(
                where: { type: { _like: "skill_%" } }
                order_by: { amount: desc }
                limit: 5
            ) {
                id
                type
                amount
                createdAt
            }
                    }
    }`;

  try {
    const response = await fetch(API_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
      throw new Error(response.message);
    }

    const data = await response.json();
    updateUI(data.data.user[0]);
    console.log("Data: ", data.data.user[0]);
  } catch (error) {
    console.error("Profile loading error:", error);
  }
}

function updateUI(userData) {
  document.querySelector(
    "#welcome-message"
  ).textContent = `Hey ${userData.login}, Welcome back!`;
  document.querySelector(
    "#full-name"
  ).textContent = `${userData.firstName} ${userData.lastName}`;
  document.querySelector(
    "#level-display"
  ).textContent = `Your current level is: ${userData.levels[0]?.amount || "0"}`;

  const auditRatioElement = document.querySelector("#audit-ratio");
  const auditRatioNote = document.querySelector("#audit-ratio-note");
  const userAuditRatio = userData.auditRatio?.toFixed(1);

  auditRatioElement.textContent = userAuditRatio;
  updateAuditRatioStyle(userAuditRatio, auditRatioElement, auditRatioNote);

  document.querySelector("#totaldown").textContent = formatting(
    userData.totalDown
  );
  document.querySelector("#totalup").textContent = formatting(userData.totalUp);

  const skills = [...userData.skills];
  const skillChart = generateSkillChart(skills);
  const circleChart = generateCircleChart(userData.totalUp, userData.totalDown);

  document.querySelector(".skills-set").innerHTML = "";
  document.querySelector(".skills-set").appendChild(skillChart);
  document.querySelector(".circle").innerHTML = "";
  document.querySelector(".circle").appendChild(circleChart);

  generateTopProjects(userData.modules);
}

function updateAuditRatioStyle(ratio, element, noteElement) {
  console.log("Ratio: ", ratio);

  if (!ratio) {
    noteElement.display = "none";
  } else if (ratio >= 1.3) {
    element.style.color = "green";
    noteElement.textContent = "Perfect";
    noteElement.style.color = "green";
  } else if (ratio < 1.3 && ratio >= 1) {
    element.style.color = "orange";
    noteElement.textContent = "You can do better";
    noteElement.style.color = "orange";
  } else {
    element.style.color = "crimson";
    noteElement.textContent = "Careful buddy";
    noteElement.style.color = "crimson";
  }
}
