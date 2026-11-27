"use strict";

(() => {
  const root = document.documentElement;
  root.dataset.theme = "light";

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    const render = () => toggle.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
    toggle.hidden = false;
    render();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      render();
    });
  });
})();
