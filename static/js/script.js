/* ============================================================
   LEICHT & BLITZSAUBER — script.js
   Premium German Cleaning Company Website
   ============================================================ */

'use strict';

/* ---- UTILITY ---- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   PAGE LOADER
   ============================================================ */
/* ============================================================
   NAVIGATION — sticky + hamburger + active link
   ============================================================ */
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const links = $$('.nav-link', navLinks);

  if (!navbar) return;

  // Sticky on scroll
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('no-scroll');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // Active link on scroll
  const sections = $$('section[id], div[id]');

  const setActiveLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) currentId = section.id;
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });

  // ← SHTO KETU parallax hero background
  const heroBg = document.querySelector('.hero-photo-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const rate = window.scrollY * 0.4;
      heroBg.style.backgroundPosition = `center ${rate}px`;
    }, { passive: true });
  }
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initAnimations() {
  const elements = $$('[data-animate]');
  if (!elements.length) return;

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
function initSlider() {
  const slider = $('#testimonialSlider');
  const prevBtn = $('#sliderPrev');
  const nextBtn = $('#sliderNext');
  const dotsContainer = $('#sliderDots');

  if (!slider) return;

  const slides = $$('.testimonial-slide', slider);
  const total = slides.length;
  let current = 0;
  let autoplayTimer = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = $$('.slider-dot', dotsContainer);

  function goTo(index) {
    current = (index + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    isDragging = false;
  }, { passive: true });

  // Pause on hover
  slider.closest('.testimonial-slider-wrap')?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  slider.closest('.testimonial-slider-wrap')?.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = $$('.faq-item');

  items.forEach(item => {
    const question = $('.faq-question', item);
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const q = $('.faq-question', i);
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if wasn't open)
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const fields = {
    fullName: {
      el: $('#fullName'),
      error: $('#fullNameError'),
      validate: (v) => v.trim().length >= 2 ? '' : 'Bitte geben Sie Ihren vollständigen Namen ein.'
    },
    email: {
      el: $('#email'),
      error: $('#emailError'),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    },
    service: {
      el: $('#service'),
      error: $('#serviceError'),
      validate: (v) => v ? '' : 'Bitte wählen Sie eine Dienstleistung aus.'
    },
    message: {
      el: $('#message'),
      error: $('#messageError'),
      validate: (v) => v.trim().length >= 10 ? '' : 'Bitte geben Sie eine Nachricht ein (mindestens 10 Zeichen).'
    }
  };

  function showError(field, msg) {
    if (!field.el || !field.error) return;
    field.error.textContent = msg;
    field.el.classList.toggle('error', !!msg);
  }

  function validateField(key) {
    const field = fields[key];
    if (!field.el) return true;
    const msg = field.validate(field.el.value);
    showError(field, msg);
    return !msg;
  }

  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (!field.el) return;
    field.el.addEventListener('blur', () => validateField(key));
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    let valid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) valid = false;
    });

    if (!valid) {
      e.preventDefault(); // blloko vetëm nëse ka error
    }
    // nëse valid = true, forma dërgohet normalisht tek Django
  });
}
/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const el = $('#footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   STAT COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const items = $$('.stat-big');
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function animateCounter(el) {
    const raw = el.textContent.trim();
    const isPercent = raw.endsWith('%');
    const isPlus = raw.endsWith('+');
    const numStr = raw.replace(/[^0-9.]/g, '');
    const target = parseFloat(numStr);
    if (isNaN(target)) return;

    const duration = 1400;
    const start = performance.now();

    function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      let display = value.toString();
      if (isPlus) display += '+';
      if (isPercent) display += '%';
      el.textContent = display;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  items.forEach(el => observer.observe(el));
}

/* ============================================================
   PARALLAX subtle effect on hero glows
   ============================================================ */
function initHeroParallax() {
  const glow1 = $('.hero-glow-1');
  const glow2 = $('.hero-glow-2');
  if (!glow1 || !glow2) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    glow1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
    glow2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  }, { passive: true });
}

/* ============================================================
   CARD TILT (subtle on desktop)
   ============================================================ */
function initCardTilt() {
  const cards = $$('.service-card, .why-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   INITIALISE ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimations();
  initSlider();
  initFAQ();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
  initCounters();
  initHeroParallax();
  initCardTilt();
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  /* ============================================================
   HERO VIDEO — hero-video.js
   Paste this block inside your existing script.js,
   or load it as a separate <script defer> before </body>.
   ============================================================ */

(function () {
  'use strict';

  const video = document.getElementById('heroBgVideo');
  if (!video) return; // not on the homepage — bail silently

  // ----------------------------------------------------------
  // 1. AUTOPLAY FALLBACK
  //    Some browsers block autoplay even with `muted`.
  //    We attempt to play manually and swallow any rejection.
  // ----------------------------------------------------------
  function tryPlay() {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay blocked — video stays on poster frame, which is fine.
        // Optionally: show a muted play button here if you want UX control.
      });
    }
  }

  // Play as soon as the browser has buffered enough data
  if (video.readyState >= 3) {
    tryPlay();
  } else {
    video.addEventListener('canplay', tryPlay, { once: true });
  }

  // ----------------------------------------------------------
  // 2. PERFORMANCE: pause video when hero is off-screen,
  //    resume when it scrolls back into view.
  //    Saves CPU/battery on long pages.
  // ----------------------------------------------------------
  const heroSection = document.getElementById('home');

  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.01 } // trigger as soon as 1 % is visible
    );
    observer.observe(heroSection);
  }

  // ----------------------------------------------------------
  // 3. REDUCED MOTION: honour prefers-reduced-motion at runtime
  //    (the CSS already hides the element; this also stops it
  //     from downloading/decoding in the background).
  // ----------------------------------------------------------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    video.pause();
    video.removeAttribute('autoplay');
    video.src = ''; // stop network request
  }

  // Also react if the user changes the system setting mid-session
  prefersReduced.addEventListener('change', function (e) {
    if (e.matches) {
      video.pause();
      video.src = '';
    } else {
      // Restore src from the <source> child
      const src = video.querySelector('source');
      if (src) {
        video.src = src.src;
        video.load();
        tryPlay();
      }
    }
  });

})();
});