/* Tanjet Hawlader Portfolio — thoughtful, lightweight interactions */
(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".header");
  const brandMark = document.querySelector(".brand-mark");
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const progress = document.getElementById("scrollProgress");
  const scrollRail = document.getElementById("scrollRail");
  const touchGlow = document.getElementById("touchGlow");
  const backToTop = document.getElementById("backToTop");
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const portraitCard = document.querySelector(".portrait-card");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchMode = window.matchMedia("(pointer: coarse)").matches;
  let scrollFrame = false;
  let brandPulseTimer = 0;
  let touchFadeTimer = 0;
  let scrollIdleTimer = 0;

  body.classList.add("js-enabled");

  // Remember the visitor's theme when browser storage is available.
  let savedTheme = null;
  try { savedTheme = window.localStorage.getItem("tanjet-portfolio-theme"); } catch (_) {}
  if (savedTheme === "light") body.classList.add("light-theme");

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const theme = body.classList.contains("light-theme") ? "light" : "dark";
    try { window.localStorage.setItem("tanjet-portfolio-theme", theme); } catch (_) {}
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content", theme === "light" ? "#f5f7fa" : "#0b1220"
    );
  });

  const closeMenu = () => {
    mainNav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open menu");
    header?.classList.remove("menu-open");
  };
  menuToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    header?.classList.toggle("menu-open", open);
  });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (mainNav?.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle?.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mainNav?.classList.contains("open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  const updateScrollUI = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

    if (progress) progress.style.width = `${ratio * 100}%`;
    if (scrollRail) scrollRail.style.setProperty("--rail-y", `${ratio * Math.max(0, scrollRail.clientHeight - 8)}px`);
    backToTop?.classList.toggle("visible", y > 520);
    header?.classList.toggle("is-scrolled", y > 24);

    // Keep the monogram visible and let it respond softly while the page moves.
    if (touchMode && window.innerWidth <= 800 && brandMark) {
      brandMark.classList.add("is-scrolling");
      window.clearTimeout(brandPulseTimer);
      brandPulseTimer = window.setTimeout(() => brandMark.classList.remove("is-scrolling"), 420);

      // A tiny scroll-linked drift gives the portrait life without shifting the page layout.
      if (portraitCard && y < window.innerHeight * 1.5) {
        const amount = Math.min(1, y / 520);
        portraitCard.style.setProperty("--portrait-shift", `${-8 * amount}px`);
        portraitCard.style.setProperty("--portrait-rotate", `${-2 + 1.4 * amount}deg`);
      }
    }

    body.classList.add("is-scrolling");
    window.clearTimeout(scrollIdleTimer);
    scrollIdleTimer = window.setTimeout(() => body.classList.remove("is-scrolling"), 180);
    scrollFrame = false;
  };

  window.addEventListener("scroll", () => {
    if (!scrollFrame) {
      window.requestAnimationFrame(updateScrollUI);
      scrollFrame = true;
    }
  }, { passive: true });
  updateScrollUI();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Reveal sections as they enter the screen, respecting reduced-motion preferences.
  const revealItems = [...document.querySelectorAll(".reveal")];
  revealItems.forEach((item, index) => item.style.setProperty("--reveal-delay", `${(index % 5) * 55}ms`));
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Highlight the section currently being read.
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle(
            "active", link.getAttribute("href") === `#${entry.target.id}`
          ));
        }
      });
    }, { rootMargin: "-30% 0px -58% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
  }

  // On phones, a soft light follows the finger during a swipe or scroll.
  const moveTouchGlow = (x, y) => {
    if (!touchGlow || reduceMotion) return;
    touchGlow.style.left = `${x}px`;
    touchGlow.style.top = `${y}px`;
    touchGlow.classList.add("active");
    window.clearTimeout(touchFadeTimer);
    touchFadeTimer = window.setTimeout(() => touchGlow.classList.remove("active"), 260);
  };
  if (touchMode && touchGlow && !reduceMotion) {
    document.addEventListener("pointermove", event => {
      if (event.pointerType === "touch") moveTouchGlow(event.clientX, event.clientY);
    }, { passive: true });
    // touchmove is retained as a fallback for browsers that cancel pointer events when native scrolling starts.
    document.addEventListener("touchmove", event => {
      const finger = event.touches && event.touches[0];
      if (finger) moveTouchGlow(finger.clientX, finger.clientY);
    }, { passive: true });
    document.addEventListener("touchend", () => {
      window.clearTimeout(touchFadeTimer);
      touchFadeTimer = window.setTimeout(() => touchGlow.classList.remove("active"), 180);
    }, { passive: true });
    document.addEventListener("pointercancel", () => touchGlow.classList.remove("active"), { passive: true });
  }

  // Desktop-only pointer tilt; phones use the calmer scroll-linked movement above.
  if (portraitCard && window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    portraitCard.addEventListener("pointermove", event => {
      const rect = portraitCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 5;
      portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(-2deg)`;
    });
    portraitCard.addEventListener("pointerleave", () => { portraitCard.style.transform = ""; });
  }

  // Small tap feedback on controls and links, without changing their layout.
  if (!reduceMotion) {
    const rippleTargets = document.querySelectorAll(".brand, .btn, .nav-link, .theme-toggle, .menu-toggle, .text-link, .contact-list a, .back-to-top");
    rippleTargets.forEach(target => {
      target.classList.add("ripple-target");
      target.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "click-ripple";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        target.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      });
    });
  }

  // The form prepares an email in the visitor's email app; it does not pretend to send to a server.
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
    if (note) note.textContent = "Opening your email app with the message ready to send…";
    window.location.href = url;
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
})();
