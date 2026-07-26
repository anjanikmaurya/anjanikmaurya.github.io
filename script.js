/* ============================================================
   Anjani K. Maurya — site interactions
   - Tab-style navigation (one section visible at a time)
   - Mobile nav toggle
   - Beamtime image slideshow
   - Current year in footer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.navigation a');
  const sections = document.querySelectorAll('main section');
  const nav = document.querySelector('.navigation');
  const navToggle = document.querySelector('.nav-toggle');

  /* ---------- Tab-style navigation ---------- */
  function showSection(id) {
    sections.forEach((section) => {
      section.style.display = section.id === id ? 'block' : 'none';
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
    // Reset scroll to top of content area
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // Default to the first section (About), or a hash target if present.
  const initialId = (window.location.hash || '#about').substring(1);
  const validInitial = Array.from(sections).some((s) => s.id === initialId)
    ? initialId
    : 'about';
  showSection(validInitial);

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.getAttribute('href').substring(1);
      showSection(id);
      history.replaceState(null, '', '#' + id);
      // Close mobile menu after selection
      nav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Logo also returns to About
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      showSection('about');
      history.replaceState(null, '', '#about');
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---------- Beamtime slideshow ---------- */
  document.querySelectorAll('.slide-container').forEach((container) => {
    const wrapper = container.querySelector('.slide-wrapper');
    const images = wrapper.querySelectorAll('img');
    if (images.length < 2) return;

    let index = 0;
    setInterval(() => {
      index = (index + 1) % images.length;
      wrapper.style.transform = `translateX(${-index * 100}%)`;
    }, 6000);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
