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
  const electricCanvas = document.getElementById("electricCanvas");
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

  // Electric finger trail: visual only, passive touch listeners preserve native page scrolling.
  const moveTouchGlow = (x, y) => {
    if (!touchGlow || reduceMotion) return;
    touchGlow.style.left = `${x}px`;
    touchGlow.style.top = `${y}px`;
    touchGlow.classList.add("active");
    window.clearTimeout(touchFadeTimer);
    touchFadeTimer = window.setTimeout(() => touchGlow.classList.remove("active"), 260);
  };

  if (touchMode && electricCanvas && !reduceMotion) {
    const ctx = electricCanvas.getContext("2d", { alpha: true });
    const particles = [];
    const arcs = [];
    const maxParticles = 180;
    const maxArcs = 16;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let electricFrame = 0;
    let lastTouch = null;

    const resizeElectricCanvas = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      electricCanvas.width = Math.round(canvasWidth * pixelRatio);
      electricCanvas.height = Math.round(canvasHeight * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resizeElectricCanvas();
    window.addEventListener("resize", resizeElectricCanvas, { passive: true });

    const randomBetween = (min, max) => min + Math.random() * (max - min);

    const requestElectricFrame = () => {
      if (!electricFrame) electricFrame = window.requestAnimationFrame(drawElectricFrame);
    };

    const addSpark = (x, y, power = 1) => {
      const angle = randomBetween(0, Math.PI * 2);
      const speed = randomBetween(0.7, 3.2) * power;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomBetween(0.1, 1.1),
        life: randomBetween(16, 30),
        maxLife: 30,
        size: randomBetween(0.7, 2.2),
        color: Math.random() > 0.45 ? "200,255,97" : "112,222,255"
      });
      if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    };

    const addBurst = (x, y, count = 12) => {
      for (let i = 0; i < count; i++) addSpark(x, y, randomBetween(0.7, 1.5));
      arcs.push({
        points: Array.from({ length: 5 }, (_, i) => ({
          x: x + Math.cos(i * Math.PI / 2) * randomBetween(2, 16),
          y: y + Math.sin(i * Math.PI / 2) * randomBetween(2, 16)
        })),
        life: 12,
        maxLife: 12,
        color: "200,255,97"
      });
      if (arcs.length > maxArcs) arcs.shift();
      requestElectricFrame();
    };

    const addElectricArc = (from, to) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 5) return;

      const segments = Math.max(4, Math.min(10, Math.round(distance / 15)));
      const points = [{ x: from.x, y: from.y }];
      for (let i = 1; i < segments; i++) {
        const ratio = i / segments;
        const offset = randomBetween(-8, 8);
        const length = Math.max(1, distance);
        points.push({
          x: from.x + dx * ratio + (-dy / length) * offset,
          y: from.y + dy * ratio + (dx / length) * offset
        });
      }
      points.push({ x: to.x, y: to.y });
      arcs.push({
        points,
        life: 10,
        maxLife: 10,
        color: Math.random() > 0.35 ? "112,222,255" : "200,255,97"
      });
      if (arcs.length > maxArcs) arcs.shift();

      const sparkCount = Math.min(9, Math.max(3, Math.round(distance / 12)));
      for (let i = 0; i < sparkCount; i++) {
        const ratio = (i + Math.random()) / sparkCount;
        addSpark(from.x + dx * ratio, from.y + dy * ratio, 0.85);
      }
      requestElectricFrame();
    };

    const drawElectricFrame = () => {
      electricFrame = 0;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        const alpha = Math.max(0, arc.life / arc.maxLife);
        const points = arc.points;
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length; j++) ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(${arc.color},${alpha * 0.28})`;
          ctx.lineWidth = 7;
          ctx.shadowColor = `rgba(${arc.color},${alpha})`;
          ctx.shadowBlur = 15;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length; j++) ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(${arc.color},${alpha * 0.9})`;
          ctx.lineWidth = 1.7;
          ctx.shadowBlur = 8;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length; j++) ctx.lineTo(points[j].x, points[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.7})`;
          ctx.lineWidth = 0.65;
          ctx.shadowBlur = 3;
          ctx.stroke();
        }
        arc.life -= 1;
        if (arc.life <= 0) arcs.splice(i, 1);
      }

      ctx.shadowBlur = 10;
      for (let i = particles.length - 1; i >= 0; i--) {
        const spark = particles[i];
        const alpha = Math.max(0, spark.life / spark.maxLife);
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.965;
        spark.vy = spark.vy * 0.965 + 0.035;

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${spark.color},${alpha})`;
        ctx.shadowColor = `rgba(${spark.color},${alpha})`;
        ctx.fill();

        spark.life -= 1;
        if (spark.life <= 0) particles.splice(i, 1);
      }

      ctx.restore();
      if (arcs.length || particles.length) electricFrame = window.requestAnimationFrame(drawElectricFrame);
    };

    const getTouchPoint = touch => ({ x: touch.clientX, y: touch.clientY });

    document.addEventListener("touchstart", event => {
      const finger = event.changedTouches && event.changedTouches[0];
      if (!finger) return;
      lastTouch = getTouchPoint(finger);
      moveTouchGlow(lastTouch.x, lastTouch.y);
      addBurst(lastTouch.x, lastTouch.y, 15);
    }, { passive: true });

    document.addEventListener("touchmove", event => {
      const finger = event.touches && event.touches[0];
      if (!finger) return;
      const point = getTouchPoint(finger);
      moveTouchGlow(point.x, point.y);
      if (lastTouch) addElectricArc(lastTouch, point);
      lastTouch = point;
    }, { passive: true });

    document.addEventListener("touchend", event => {
      const finger = event.changedTouches && event.changedTouches[0];
      const point = finger ? getTouchPoint(finger) : lastTouch;
      if (point) addBurst(point.x, point.y, 10);
      lastTouch = null;
      window.clearTimeout(touchFadeTimer);
      touchFadeTimer = window.setTimeout(() => touchGlow?.classList.remove("active"), 220);
    }, { passive: true });

    document.addEventListener("touchcancel", () => {
      lastTouch = null;
      window.clearTimeout(touchFadeTimer);
      touchFadeTimer = window.setTimeout(() => touchGlow?.classList.remove("active"), 120);
    }, { passive: true });
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
