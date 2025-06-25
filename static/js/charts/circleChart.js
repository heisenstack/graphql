function drawCircleChart(user) {
  const chartContainer = document.getElementById("circleChart");
  const circleChart = generateCircleChart(
    user.info.totalUp,
    user.info.totalDown
  );
  chartContainer.innerHTML = "";
  chartContainer.appendChild(circleChart);
}
function generateCircleChart(totalUp, totalDown) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const svgNamespace = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", 180);
  svg.setAttribute("height", 180);

  const total = totalUp + totalDown;
  if (total === 0) return svg;

  const upPercentage = (totalUp / total) * circumference;
  const downPercentage = (totalDown / total) * circumference;

  const bgCircle = document.createElementNS(svgNamespace, "circle");
  bgCircle.setAttribute("cx", 90);
  bgCircle.setAttribute("cy", 90);
  bgCircle.setAttribute("r", radius);
  bgCircle.setAttribute("stroke", "#ddd");
  bgCircle.setAttribute("stroke-width", 20);
  bgCircle.setAttribute("fill", "transparent");
  // svg.appendChild(bgCircle);

  const downCircle = document.createElementNS(svgNamespace, "circle");
  downCircle.setAttribute("cx", 90);
  downCircle.setAttribute("cy", 90);
  downCircle.setAttribute("r", radius);
  downCircle.setAttribute("stroke", "#ef4444");
  downCircle.setAttribute("stroke-width", 20);
  downCircle.setAttribute("fill", "transparent");

  downCircle.setAttribute(
    "stroke-dasharray",
    `${downPercentage} ${circumference - downPercentage}`
  );
  downCircle.setAttribute("stroke-dashoffset", 0);
  svg.appendChild(downCircle);

  const upCircle = document.createElementNS(svgNamespace, "circle");
  upCircle.setAttribute("cx", 90);
  upCircle.setAttribute("cy", 90);
  upCircle.setAttribute("r", radius);
  upCircle.setAttribute("stroke", "#10b981");
  upCircle.setAttribute("stroke-width", 20);
  upCircle.setAttribute("fill", "transparent");

  upCircle.setAttribute(
    "stroke-dasharray",
    `${upPercentage} ${circumference - upPercentage}`
  );
  upCircle.setAttribute("stroke-dashoffset", -downPercentage);
  svg.appendChild(upCircle);

  return svg;
}

export { drawCircleChart };
