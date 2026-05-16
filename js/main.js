/* ============================================================
   YASSER ATHOUMANI — main.js
   ============================================================ */

/* === ELEMENTS === */
const progressBar   = document.getElementById('progressBar');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const backToTop     = document.getElementById('backToTop');
const typewriterEl  = document.getElementById('typewriter');
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');
const formError     = document.getElementById('formError');
const submitBtn     = document.getElementById('submitBtn');

/* === TYPEWRITER === */
const phrases = [
  'Community Manager',
  'Chargé de Marketing Digital',
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
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close overlay on outside click
mobileOverlay.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) closeMenu();
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

/* === CONTACT FORM === */
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Envoi en cours…</span>';
    submitBtn.disabled  = true;
    formSuccess.hidden  = true;
    formError.hidden    = true;

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.reset();
        formSuccess.hidden = false;
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      } else {
        formError.hidden = false;
      }
    } catch {
      formError.hidden = false;
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled  = false;
    }
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

/* === INIT === */
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
typeWrite();
