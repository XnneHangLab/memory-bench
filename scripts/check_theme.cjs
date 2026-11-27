// Run: node scripts/check_theme.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../docs/theme.js"), "utf8");
function page(saved) {
  const attrs = {};
  const events = {};
  const root = {dataset: {}};
  const toggle = {
    hidden: true,
    setAttribute: (key, value) => { attrs[key] = value; },
    addEventListener: (name, callback) => { events[name] = callback; },
  };
  let ready;
  vm.runInNewContext(source, {
    localStorage: {
      getItem: () => saved,
      setItem: () => assert.fail("Theme changes should apply to the current page"),
    },
    document: {
      documentElement: root,
      getElementById: id => { assert.equal(id, "theme-toggle"); return toggle; },
      addEventListener: (name, callback) => { assert.equal(name, "DOMContentLoaded"); ready = callback; },
    },
  });
  assert.equal(root.dataset.theme, "light");
  ready();
  assert.equal(toggle.hidden, false);
  assert.equal(attrs["aria-pressed"], "false");
  return {root, attrs, click: events.click};
}
for (const saved of [null, "light", "dark", "invalid"]) {
  const current = page(saved);
  current.click();
  assert.equal(current.root.dataset.theme, "dark");
  assert.equal(current.attrs["aria-pressed"], "true");
  assert.equal(page(saved).root.dataset.theme, "light");
  current.click();
  assert.equal(current.root.dataset.theme, "light");
  assert.equal(current.attrs["aria-pressed"], "false");
}
console.log("PASS: every page load starts light, including with saved dark; manual toggle and accessible state work");
