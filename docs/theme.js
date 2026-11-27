"use strict";

(() => {
  const root = document.documentElement;
  const key = "memory-bench-theme";
  let theme = "light";
  try {
    if (localStorage.getItem(key) === "dark") theme = "dark";
  } catch { /* The toggle also works when browser storage is unavailable. */ }
  root.dataset.theme = theme;

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    const render = () => toggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    toggle.hidden = false;
    render();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      render();
      try {
        localStorage.setItem(key, root.dataset.theme);
      } catch { /* Keep the selected theme for the current page. */ }
    });
  });
})();
