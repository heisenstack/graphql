export function generateSkillChart(skills) {
  function generateHexColor() {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  }

  const width = 1200;
  const height = 300;
  const barWidth = width / skills.length;
  const maxAmount = Math.max(...skills.map((skill) => skill.amount));
  const svgNamespace = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "300");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.classList.add("responsive-skills-chart");

  skills.forEach((skill, index) => {
    const barHeight = (skill.amount / maxAmount) * (height - 50);

    const rect = document.createElementNS(svgNamespace, "rect");
    rect.setAttribute("x", index * barWidth + 10);
    rect.setAttribute("y", height - barHeight - 30);
    rect.setAttribute("width", barWidth - 20);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", generateHexColor());
    rect.setAttribute("class", "skill-bar");

    const text = document.createElementNS(svgNamespace, "text");
    text.setAttribute("x", index * barWidth + barWidth / 2);
    text.setAttribute("y", height - barHeight);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "16px");
    text.setAttribute("fill", "#fff");
    text.textContent = skill.amount;

    const label = document.createElementNS(svgNamespace, "text");
    label.setAttribute("x", index * barWidth + barWidth / 2);
    label.setAttribute("y", height - 50);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "16px");
    label.setAttribute("fill", "#fff");
    label.textContent = skill.type.replace("skill_", "");

    svg.appendChild(rect);
    svg.appendChild(text);
    svg.appendChild(label);
  });

  return svg;
}
