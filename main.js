/* Tanjet Hawlader Portfolio — interactive behaviour */
(() => {
  "use strict";
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const progress = document.getElementById("scrollProgress");
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  // Keep all page content visible if JavaScript is unavailable; animate only when JS runs.
  body.classList.add("js-enabled");

  // Restore the visitor's last selected theme (safe for local file:// previews).
  let savedTheme = null;
  try { savedTheme = window.localStorage.getItem("tanjet-portfolio-theme"); } catch (_) {}
  if (savedTheme === "light") body.classList.add("light-theme");
  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const theme = body.classList.contains("light-theme") ? "light" : "dark";
    try { window.localStorage.setItem("tanjet-portfolio-theme", theme); } catch (_) {}
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} theme`);
  });

  // Responsive navigation.
  menuToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Reading progress bar.
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? window.scrollY / max * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Highlight the current section in the navigation.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle(
            "active", link.getAttribute("href") === `#${entry.target.id}`
          ));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
  }

  // Static contact form: prepares an email in the visitor's email application.
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const bodyText = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const url = `mailto:tanjethoulader@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    note.textContent = "Opening your email application with the message prepared…";
    window.location.href = url;
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
})();
