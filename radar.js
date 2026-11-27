"use strict";

// These values illustrate the axes only; no benchmark has been run.
const axes = [...document.querySelectorAll("[data-axis]")].map(row => row.dataset.axis);
const demo = [2, 2, 2, 2, 2, 2];
const svg = document.getElementById("radar");
const controls = document.getElementById("controls");
const ns = "http://www.w3.org/2000/svg";
function element(tag, attrs, text) {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  svg.append(node);
  return node;
}
function point(index, radius) {
  const angle = -Math.PI / 2 + index * 2 * Math.PI / axes.length;
  return [300 + radius * Math.cos(angle), 235 + radius * Math.sin(angle)];
}
for (let level = 1; level <= 4; level++) {
  element("polygon", {points: axes.map((_, i) => point(i, level * 37).join(",")).join(" "), fill: "none", stroke: "var(--line)"});
  element("text", {x: 307, y: 235 - level * 37 + 13, fill: "var(--muted)", "font-size": 12}, level);
}
axes.forEach((name, i) => {
  const [x, y] = point(i, 148);
  element("line", {x1: 300, y1: 235, x2: x, y2: y, stroke: "var(--line)"});
  const [tx, ty] = point(i, 190);
  element("text", {x: tx, y: ty, "text-anchor": "middle", "dominant-baseline": "middle", fill: "var(--ink)", "font-size": 17}, name);
});
const shape = element("polygon", {fill: "var(--chart-fill)", stroke: "var(--accent)", "stroke-width": 2.5});
const inputs = axes.map((name, i) => {
  const label = document.createElement("label");
  const output = document.createElement("output");
  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = "4";
  input.step = "0.5";
  input.value = String(demo[i]);
  input.id = `axis-${i}`;
  label.htmlFor = input.id;
  output.htmlFor = input.id;
  label.append(document.createTextNode(name), output, input);
  controls.append(label);
  input.addEventListener("input", draw);
  return {input, output};
});
function draw() {
  shape.setAttribute("points", inputs.map(({input, output}, i) => {
    output.value = `${input.value} / 4`;
    input.setAttribute("aria-valuetext", `${input.value} 分，满分 4 分，手动演示`);
    return point(i, Number(input.value) * 37).join(",");
  }).join(" "));
}
document.getElementById("reset").addEventListener("click", () => {
  inputs.forEach(({input}, i) => { input.value = String(demo[i]); });
  draw();
});
draw();
