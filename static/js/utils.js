export function formatting(exp) {
  if (exp < 1000) {
    return Math.round(exp) + " b";
  } else if (exp < 1000000) {
    return Math.round(exp / 1000) + " kb";
  } else {
    return Math.round(exp / 1000000) + " mb";
  }
}

export function generateTopProjects(modules) {
  const projects = document.querySelector(".top-projects");
  projects.innerHTML = "";

  modules.forEach((module) => {
    const projectDiv = document.createElement("div");
    const project = document.createElement("h3");
    project.classList.add("project");
    const timestamp = document.createElement("p");
    timestamp.classList.add("time-stamp");
    project.textContent = `${module.object.name.replaceAll(
      "-",
      " "
    )} (${formatting(module.amount)})`;

    const date = new Date(module.createdAt);
    timestamp.textContent = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    projectDiv.appendChild(project);
    projectDiv.appendChild(timestamp);
    projects.appendChild(projectDiv);
  });
}
