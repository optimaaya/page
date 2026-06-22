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

  // --- CONTACT FORM - EMAILJS HANDLER ---
  emailjs.init("5fB6irNIKc806LulR");

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const submitLabel = document.getElementById("submitLabel");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim() || "Not provided";
      const service = document.getElementById("service").value || "Not provided";
      const budget = document.getElementById("budget").value || "Not provided";
      const message = document.getElementById("message").value.trim() || "No message provided";
      
      if (!name) {
        status.textContent = "Please enter your name.";
        status.className = "form-status error";
        document.getElementById("name").focus();
        return;
      }
      
      if (!email) {
        status.textContent = "Please enter your email address.";
        status.className = "form-status error";
        document.getElementById("email").focus();
        return;
      }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        status.textContent = "Please enter a valid email address.";
        status.className = "form-status error";
        document.getElementById("email").focus();
        return;
      }
      
      submitBtn.disabled = true;
      submitLabel.textContent = "Sending...";
      status.textContent = "";
      status.className = "form-status";
      
      const templateParams = {
        name: name,
        email: email,
        company: company,
        service: service,
        budget: budget,
        message: message,
        to_email: "optimaaya@gmail.com"
      };
      
      emailjs.send("service_o0kcmbr", "template_ai7g6oe", templateParams)
        .then(function(response) {
          console.log("Email sent successfully:", response);
          status.textContent = "✅ Thanks! We'll get back to you within 24 hours.";
          status.className = "form-status success";
          submitLabel.textContent = "Message Sent ✓";
          form.reset();
          submitBtn.disabled = false;
          setTimeout(() => {
            submitLabel.textContent = "Contact OPTIMAAYA";
          }, 3000);
        })
        .catch(function(error) {
          console.error("Email send error:", error);
          status.textContent = "❌ Something went wrong. Please try again or email us directly at optimaaya@gmail.com";
          status.className = "form-status error";
          submitLabel.textContent = "Contact OPTIMAAYA";
          submitBtn.disabled = false;
        });
    });
  }

  // --- OVERVIEW POPUP (MODAL) ---
  const overviewLinks = document.querySelectorAll('.js-overview');
  const modal = document.getElementById('overviewModal');
  const closeBtn = document.querySelector('.modal-close');
  const portfolioContent = document.getElementById('portfolioContent');
  const portfolioLoader = document.getElementById('portfolioLoader');

  // Function to load portfolio when modal opens
  function loadPortfolio() {
    // Only load once
    if (portfolioContent && portfolioContent.dataset.loaded === 'true') {
      return;
    }

    // Fetch the portfolio.html file
    fetch('/portfolio.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Portfolio not found');
        }
        return response.text();
      })
      .then(html => {
        // Extract only the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML;
        
        // Insert into portfolio content div
        if (portfolioContent) {
          portfolioContent.innerHTML = bodyContent;
          portfolioContent.style.display = 'block';
          portfolioContent.dataset.loaded = 'true';
        }
        if (portfolioLoader) {
          portfolioLoader.style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error loading portfolio:', error);
        if (portfolioLoader) {
          portfolioLoader.innerHTML = `
            <p style="color:#ff6b6b;text-align:center;padding:40px;">
              ❌ Could not load portfolio content. 
              <br><span style="font-size:14px;color:#a5a5ae;">Please check if portfolio.html exists.</span>
            </p>
          `;
        }
      });
  }

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      loadPortfolio(); // Load portfolio when modal opens
    }
  }
  
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  overviewLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside the content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- FOOTER YEAR ---
  document.querySelector("#year").textContent = new Date().getFullYear();
});
