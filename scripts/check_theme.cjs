// Run: node scripts/check_theme.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../docs/theme.js"), "utf8");
function page(saved, blocked = false) {
  const attrs = {};
  const events = {};
  const root = {dataset: {}};
  const toggle = {
    hidden: true,
    setAttribute: (key, value) => { attrs[key] = value; },
    addEventListener: (name, callback) => { events[name] = callback; },
  };
  let ready;
  const storage = {
    getItem() { if (blocked) throw Error("Storage disabled"); return saved; },
    setItem(key, value) {
      if (blocked) throw Error("Storage disabled");
      assert.equal(key, "memory-bench-theme");
      saved = value;
    },
  };
  vm.runInNewContext(source, {
    localStorage: storage,
    document: {
      documentElement: root,
      getElementById: id => { assert.equal(id, "theme-toggle"); return toggle; },
      addEventListener: (name, callback) => { assert.equal(name, "DOMContentLoaded"); ready = callback; },
    },
  });
  assert.equal(root.dataset.theme, saved === "dark" && !blocked ? "dark" : "light");
  ready();
  assert.equal(toggle.hidden, false);
  assert.equal(attrs["aria-pressed"], String(root.dataset.theme === "dark"));
  return {root, attrs, click: events.click, saved: () => saved};
}
for (const saved of [null, "light", "invalid"]) assert.equal(page(saved).root.dataset.theme, "light");
const first = page(null);
first.click();
assert.equal(first.root.dataset.theme, "dark");
assert.equal(first.attrs["aria-pressed"], "true");
const reload = page(first.saved());
assert.equal(reload.root.dataset.theme, "dark");
reload.click();
assert.equal(reload.root.dataset.theme, "light");
assert.equal(reload.attrs["aria-pressed"], "false");
assert.equal(page(reload.saved()).root.dataset.theme, "light");
const blocked = page(null, true);
blocked.click();
assert.equal(blocked.root.dataset.theme, "dark");
console.log("PASS: light default, manual toggle, persistence, restored light, invalid value and blocked storage");
