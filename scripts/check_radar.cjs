// Run: node scripts/check_radar.cjs — no browser or dependencies required.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
class Element {
  constructor(tag) { this.tag = tag; this.attrs = {}; this.children = []; this.events = {}; }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  append(...children) { this.children.push(...children); }
  addEventListener(event, callback) { this.events[event] = callback; }
}
const svg = new Element("svg");
const controls = new Element("div");
const reset = new Element("button");
const html = fs.readFileSync(path.join(__dirname, "../docs/index.html"), "utf8");
const axes = [...html.matchAll(/data-axis="([^"]+)"/g)].map(match => ({dataset: {axis: match[1]}}));
const document = {
  querySelectorAll: () => axes,
  getElementById: id => ({radar: svg, controls, reset})[id],
  createElementNS: (_, tag) => new Element(tag),
  createElement: tag => new Element(tag),
  createTextNode: text => text,
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../docs/radar.js"), "utf8"), {document, Math});
const shape = svg.children.at(-1);
const points = () => shape.attrs.points.split(" ").map(pair => pair.split(",").map(Number));
assert.equal(controls.children.length, 6);
assert.equal(points().length, 6);
assert(points().flat().every(Number.isFinite));
const input = controls.children[0].children[2];
const output = controls.children[0].children[1];
input.value = "0";
input.events.input();
assert.deepEqual(points()[0], [300, 235]);
assert.equal(output.value, "0 / 4");
input.value = "4";
input.events.input();
assert.deepEqual(points()[0], [300, 87]);
reset.events.click();
assert.equal(input.value, "2");
assert.equal(output.value, "2 / 4");
console.log("PASS: six radar axes, finite points, zero/max bounds, labels and reset");
