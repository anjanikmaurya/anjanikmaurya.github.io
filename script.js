/* ============================================================
   Anjani K. Maurya: site interactions
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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ----------
     Cards fade and lift in as they enter the viewport, staggered within
     each group. Tagging is done here so the markup stays clean.        */
  const REVEAL_SELECTOR = [
    '.pub-card', '.conf-list > li', '.research-card', '.schematic',
    '.tl-item', '.award', '.metric', '.beamtime', '.skill-group',
    '.reason-list > li', '.facility-tags span', '.service-list > li',
    '#resources ul > li'
    // .contact-card is position:sticky; animating transform on it fights
    // the sticky behaviour, so it is deliberately left out.
  ].join(', ');

  let revealObserver = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => el.classList.add('reveal'));

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger by position among its siblings, capped so long lists
          // never wait noticeably.
          const sibs = Array.from(el.parentElement.children).filter((n) =>
            n.classList.contains('reveal')
          );
          const i = Math.min(sibs.indexOf(el), 5);
          el.style.transitionDelay = i * 40 + 'ms';
          el.classList.add('in');
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.02, rootMargin: '0px 0px -10px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  }

  // Sections are tabs, so replay the reveal for whichever one is shown.
  function replayReveals(section) {
    if (!revealObserver || !section) return;
    section.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('in');
      el.style.transitionDelay = '';
      revealObserver.unobserve(el);
      revealObserver.observe(el);
    });
  }

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
    replayReveals(document.getElementById(id));
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

  /* ---------- Publication artwork cascade ----------
     Order of preference per card:
       1. Live journal cover (only some publishers serve these openly)
       2. The paper's graphical abstract
       3. A styled cover tile drawn in CSS
     Publishers such as ACS and Wiley block hotlinked images, so any
     step can fail; each failure quietly falls through to the next.     */

  // Resolves with the first URL that actually loads, else null.
  function firstThatLoads(urls) {
    return urls.reduce(
      (chain, url) =>
        chain.then(
          (found) =>
            found ||
            new Promise((resolve) => {
              const probe = new Image();
              probe.onload = () => resolve(probe.naturalWidth > 1 ? url : null);
              probe.onerror = () => resolve(null);
              probe.src = url;
              setTimeout(() => resolve(null), 8000);
            })
        ),
      Promise.resolve(null)
    );
  }

  document.querySelectorAll('.pub-thumb').forEach((thumb) => {
    const figure = thumb.querySelector('img');
    const covers = (thumb.dataset.covers || '').split('|').filter(Boolean);

    // Step 3 is the default state: mark as failed so the tile shows
    // unless something better loads.
    const showTile = () => thumb.classList.add('img-failed');

    const tryFigure = () => {
      if (!figure) return showTile();
      if (figure.complete) {
        if (figure.naturalWidth === 0) showTile();
      } else {
        figure.addEventListener('error', showTile);
        setTimeout(() => {
          if (!figure.complete || figure.naturalWidth === 0) showTile();
        }, 8000);
      }
    };

    if (!covers.length) return tryFigure();

    firstThatLoads(covers).then((url) => {
      if (!url) return tryFigure();

      // A live cover loaded, so show it and label it as a cover.
      let img = figure;
      if (!img) {
        img = document.createElement('img');
        img.loading = 'lazy';
        thumb.insertBefore(img, thumb.firstChild);
      }
      img.src = url;
      img.alt = 'Cover of ' + (thumb.dataset.journal || 'the journal');
      thumb.classList.remove('img-failed');
      thumb.classList.add('is-cover');
    });
  });

  /* ---------- Live citation metrics (OpenAlex) ---------- */
  const metricsBox = document.getElementById('metrics');
  if (metricsBox) {
    const orcid = metricsBox.dataset.orcid;
    const note = document.getElementById('metrics-note');
    // Count up to the value so the numbers feel alive on arrival.
    const countTo = (el, target) => {
      if (reduceMotion || target < 2) {
        el.textContent = target.toLocaleString();
        return;
      }
      const duration = 700;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);      // ease-out cubic
        el.textContent = Math.round(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const set = (key, value) => {
      const el = metricsBox.querySelector(`[data-metric="${key}"]`);
      if (!el) return;
      if (value === null || value === undefined) { el.textContent = 'n/a'; return; }
      countTo(el, value);
    };

    // OpenAlex asks for a mailto in the query for the polite pool.
    const url = `https://api.openalex.org/authors/orcid:${orcid}?mailto=akmaurya@slac.stanford.edu`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        const stats = data.summary_stats || {};
        set('citations', data.cited_by_count);
        set('hindex', stats.h_index);
        set('i10', stats.i10_index);
        set('works', data.works_count);
      })
      .catch(() => {
        // Graceful fallback: hide the number cards, point to the profiles.
        metricsBox.style.display = 'none';
        if (note) {
          note.innerHTML =
            'View citation metrics on ' +
            '<a href="https://scholar.google.co.uk/citations?user=yzQ25SwAAAAJ&hl=en" target="_blank" rel="noopener">Google Scholar</a>.';
        }
      });
  }

  /* ---------- Header lift on scroll ----------
     The bar is near-white like the page, so a faint shadow once the
     user scrolls keeps it visually separate from the content.        */
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress span');

  if (header || progress) {
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 8);
        if (progress && !reduceMotion) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
          progress.style.transform = `scaleX(${pct})`;
        }
        queued = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------- Copy email to clipboard ---------- */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for browsers without clipboard permission
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const icon = btn.querySelector('i');
      const original = icon.className;
      icon.className = 'fas fa-check';
      btn.classList.add('copied');
      btn.setAttribute('aria-label', 'Email address copied');
      setTimeout(() => {
        icon.className = original;
        btn.classList.remove('copied');
        btn.setAttribute('aria-label', 'Copy email address');
      }, 1800);
    });
  });

  /* ---------- Replay the entrance animation on tab change ---------- */
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      target.style.animation = 'none';
      void target.offsetWidth;
      target.style.animation = '';
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
