function drawSkillsGraph(skillsData = user.skills) {
  const svg = document.getElementById("skillsGraph");
  svg.innerHTML = "";

  const width = 1300;
  const height = 350;
  
  const barWidth = width / skillsData.length;
  const maxAmount = Math.max(...skillsData.map((skill) => skill.amount));
  const svgNamespace = "http://www.w3.org/2000/svg";

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "350");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`)

  skillsData.forEach((skill, index) => {
    const barHeight = (skill.amount / maxAmount) * (height - 50); 
    
    const rect = document.createElementNS(svgNamespace, "rect");
    rect.setAttribute("x", index * barWidth + 10);
    rect.setAttribute("y", height - barHeight - 30);
    rect.setAttribute("width", barWidth - 20);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", "#10b981");
    rect.setAttribute("rx", "12");



    const text = document.createElementNS(svgNamespace, "text");
    text.setAttribute("x", index * barWidth + barWidth / 2);
    text.setAttribute("y", height - barHeight - 10);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "16px");

    text.setAttribute("fill", "#475569");
    text.textContent = skill.amount;

    const label = document.createElementNS(svgNamespace, "text");
    label.setAttribute("x", index * barWidth + barWidth / 2);
    label.setAttribute("y", height - 5);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "16px");
    label.setAttribute("fill", "#475569");
    label.textContent = skill.type.replace("skill_", "");




    svg.appendChild(rect);
    
    svg.appendChild(text);
    svg.appendChild(label);
  });
}

export { drawSkillsGraph };
