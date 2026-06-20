document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- SCROLL HEADER ---
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- MOBILE MENU ---
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }));

  // --- GSAP ANIMATIONS ---
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

  // --- SERVICE CARD HOVER EFFECT ---
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", e.clientX - rect.left + "px");
      card.style.setProperty("--y", e.clientY - rect.top + "px");
    });
  });

  // --- COUNTER ANIMATIONS ---
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

  // --- CURSOR GLOW ---
  const glow = document.querySelector(".cursor-glow");
  if (glow && !prefersReduced) {
    window.addEventListener("pointermove", e => {
      glow.animate({ left: e.clientX + "px", top: e.clientY + "px" }, { duration: 700, fill: "forwards" });
    });
  }

  // --- CONTACT FORM - MAILTO: HANDLER ---
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function(e) {
      // Prevent default form submission
      e.preventDefault();

      // Get all form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim() || "Not provided";
      const service = document.getElementById("service").value || "Not provided";
      const budget = document.getElementById("budget").value || "Not provided";
      const message = document.getElementById("message").value.trim() || "No message provided";

      // Validate required fields
      if (!name) {
        alert("Please enter your name.");
        document.getElementById("name").focus();
        return false;
      }

      if (!email) {
        alert("Please enter your email address.");
        document.getElementById("email").focus();
        return false;
      }

      // Simple email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        document.getElementById("email").focus();
        return false;
      }

      // Build the email body
      const bodyLines = [
        "New Enquiry from OPTIMAAYA Website",
        "",
        "Name: " + name,
        "Email: " + email,
        "Company: " + company,
        "Service Required: " + service,
        "Monthly Budget: " + budget,
        "",
        "Message:",
        message,
        "",
        "---",
        "This email was sent from the OPTIMAAYA website contact form."
      ];

      const body = bodyLines.join("\n");

      // Build the mailto: URL
      const subject = "Enquiry from " + encodeURIComponent(name);
      const mailtoLink = "mailto:optimaaya@gmail.com?subject=" + subject + "&body=" + encodeURIComponent(body);

      // Open the user's email client
      window.location.href = mailtoLink;
    });
  }

  // --- FOOTER YEAR ---
  document.querySelector("#year").textContent = new Date().getFullYear();
});
