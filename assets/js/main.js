/* ==========================================================================
   4Constructions — Interactions
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ---------- Sticky header state ---------- */
  const header = $("#header");
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = $("#navToggle");
  const nav = $("#nav");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeNav());

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  /* ---------- Contact form tabs ---------- */
  const tabs = $$(".form-tab");
  const panels = $$(".form-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      $(`.form-panel[data-panel="${tab.dataset.tab}"]`).classList.add("is-active");
    });
  });

  /* ---------- Testimonials slider ---------- */
  const track = $("#testiTrack");
  if (track) {
    const slides = $$(".testi__slide", track);
    const dotsWrap = $("#testiDots");
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "testi__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      dot.addEventListener("click", () => go(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$(".testi__dot", dotsWrap);

    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      render();
      restart();
    };
    const next = () => go(index + 1);
    const prev = () => go(index - 1);
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    };

    $("#testiNext").addEventListener("click", next);
    $("#testiPrev").addEventListener("click", prev);
    restart();

    // Pause on hover
    const testi = $(".testi");
    testi.addEventListener("mouseenter", () => clearInterval(timer));
    testi.addEventListener("mouseleave", restart);

    // Basic swipe support
    let startX = 0;
    track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = $("#toTop");
  const onScrollTop = () => toTop.classList.toggle("is-visible", window.scrollY > 600);
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
