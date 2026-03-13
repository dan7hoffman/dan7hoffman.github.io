/* ================================================================
   Daniel J. Hoffman — site.js
   Shared behavior: hamburger, scroll-to-top, scroll spy
   ================================================================ */

// ── Hamburger toggle ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('overlay');

if (hamburger && overlay) {
  const toggle = () => document.body.classList.toggle('open');
  hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);
}

// ── Scroll-to-top button ────────────────────────────────
const scrollBtn = document.getElementById('scroll-top');

if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Scroll spy with click-lock ──────────────────────────
// Works on any page that has .section[id] and .sidebar-nav a[href^="#"]
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

if (sections.length && navLinks.length) {
  let locked = false;
  let lockTimer;

  function setActive(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  function spy() {
    if (locked) return;

    let current = '';
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= 80) current = s.id;
    }

    // bottom-of-page: last section wins
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      current = sections[sections.length - 1].id;
    }

    if (current) setActive(current);
  }

  // click: lock spy, highlight immediately, smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;

      e.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      locked = true;
      setActive(href.slice(1));
      target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', href);

      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { locked = false; }, 1000);
    });
  });

  // unlock when scroll animation finishes (modern browsers)
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', () => {
      clearTimeout(lockTimer);
      locked = false;
    });
  }

  window.addEventListener('scroll', spy, { passive: true });
  spy();
}
