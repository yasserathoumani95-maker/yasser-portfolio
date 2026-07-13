/* ============================================================
   YASSER ATHOUMANI — main.js
   ============================================================ */

/* === ELEMENTS === */
const progressBar   = document.getElementById('progressBar');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const backToTop     = document.getElementById('backToTop');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const mobileClose    = document.getElementById('mobileClose');
const typewriterEl  = document.getElementById('typewriter');
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');
const formError     = document.getElementById('formError');
const submitBtn     = document.getElementById('submitBtn');

/* === TYPEWRITER === */
const phrases = [
  'Consultant en Marketing Digital',
  'Social Media Manager',
  "Fondateur d'ORRENT"
];
let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;
let typeTimer  = null;

function typeWrite() {
  const current = phrases[phraseIdx];

  if (isDeleting) {
    charIdx--;
    typewriterEl.textContent = current.slice(0, charIdx);
  } else {
    charIdx++;
    typewriterEl.textContent = current.slice(0, charIdx);
  }

  let delay = isDeleting ? 55 : 110;

  if (!isDeleting && charIdx === current.length) {
    delay      = 2200;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx  = (phraseIdx + 1) % phrases.length;
    delay      = 380;
  }

  typeTimer = setTimeout(typeWrite, delay);
}

/* === SCROLL HANDLER === */
function onScroll() {
  const scrollY    = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar
  progressBar.style.width = ((scrollY / docHeight) * 100) + '%';

  // Back to top
  backToTop.classList.toggle('visible', scrollY > 500);
}

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* === LANGUAGE BARS === */
const langObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-bar').forEach((bar) => {
          bar.classList.add('animated');
        });
        langObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const langSection = document.querySelector('.languages-section');
if (langSection) langObserver.observe(langSection);

/* === HAMBURGER / MOBILE MENU === */
function openMenu() {
  hamburger.classList.add('open');
  mobileOverlay.classList.add('open');
  mobileBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileOverlay.classList.remove('open');
  mobileBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

if (mobileClose) mobileClose.addEventListener('click', closeMenu);
mobileBackdrop.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) closeMenu();
});

/* === ACTIVE NAV LINK === */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.45 }
);

sections.forEach((s) => activeObserver.observe(s));

/* === BACK TO TOP === */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* === CONTACT FORM — mailto === */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const sujet   = document.getElementById('sujet').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`[Portfolio] ${sujet} — ${name}`);
    const body    = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);

    formSuccess.hidden = false;
    setTimeout(() => { formSuccess.hidden = true; }, 5000);

    window.location.href = `mailto:athoumaniyas@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* === SMOOTH ANCHOR SCROLL (offset for fixed nav) === */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 24;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* === STATS COUNTERS === */
function animateCounter(el, target, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10), 1500);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* === CHAR COUNTER === */
const textarea    = document.getElementById('message');
const charCounter = document.getElementById('charCounter');
if (textarea && charCounter) {
  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCounter.textContent = `${len} / 500`;
    charCounter.style.color = len > 450 ? '#dc2626' : 'rgba(0,0,0,0.3)';
  });
}

/* === DARK / LIGHT MODE TOGGLE === */
const themeToggle = document.getElementById('themeToggle');
const htmlEl      = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Restore saved preference, fallback to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* === INIT === */
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
typeWrite();
