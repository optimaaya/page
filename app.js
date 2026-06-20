document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }));

  if (!prefersReduced && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(".hero-copy > *", { opacity: 0, y: 28 });
    gsap.set(".hero-visual", { opacity: 0, scale: .94, rotation: -1 });
    const intro = gsap.timeline({ defaults: { ease: "power3.out" }});
    intro.to(".hero-copy > *", { opacity: 1, y: 0, duration: .8, stagger: .09 })
      .to(".hero-visual", { opacity: 1, scale: 1, rotation: 0, duration: 1.2 }, "-=.9");

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    gsap.to(".timeline-progress", {
      width: window.innerWidth <= 760 ? "1px" : "100%",
      height: window.innerWidth <= 760 ? "100%" : "1px",
      ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 55%", scrub: 1 }
    });

    gsap.to(".campaign-card", {
      y: -35, rotation: -1,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
    });
  } else {
    document.querySelectorAll(".reveal").forEach(el => {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", e.clientX - rect.left + "px");
      card.style.setProperty("--y", e.clientY - rect.top + "px");
    });
  });

  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      const target = Number(entry.target.dataset.counter);
      const suffix = entry.target.dataset.suffix || "";
      const decimals = String(target).includes(".") ? 1 : 0;
      const start = performance.now();
      const duration = 1300;
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        entry.target.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .6 });
  counters.forEach(c => counterObserver.observe(c));

  const glow = document.querySelector(".cursor-glow");
  if (glow && !prefersReduced) {
    window.addEventListener("pointermove", e => {
      glow.animate({ left: e.clientX + "px", top: e.clientY + "px" }, { duration: 700, fill: "forwards" });
    });
  }

  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    const button = form.querySelector("button[type=submit]");
    const label = button.querySelector(".submit-label");
    const data = Object.fromEntries(new FormData(form).entries());
    button.disabled = true; label.textContent = "Sending…";
    status.textContent = ""; status.classList.remove("error");
    try {
      const response = await fetch((window.__HATCHABLE__?.api || "/api") + "/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Something went wrong.");
      status.textContent = result.message;
      form.reset(); label.textContent = "Brief received ✓";
      setTimeout(() => { label.textContent = "Contact OPTIMAAYA"; }, 3500);
    } catch (error) {
      status.textContent = error.message || "Could not send your message. Please try again.";
      status.classList.add("error"); label.textContent = "Contact OPTIMAAYA";
    } finally { button.disabled = false; }
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
});