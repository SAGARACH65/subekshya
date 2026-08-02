document.documentElement.classList.add('js');

const root = document.documentElement;
const INTRO_KEY = 'subekshya-intro-seen';

const getStoredIntroState = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === 'true';
  } catch {
    return true;
  }
};

const storeIntroState = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, 'true');
  } catch {
    // A private browsing policy may block storage; the page still proceeds.
  }
};

const finishIntro = (intro) => {
  root.classList.add('intro-complete');
  intro?.classList.remove('is-leaving');
  document.dispatchEvent(new CustomEvent('intro:complete'));
};

function initIntro(reducedMotion) {
  const intro = document.querySelector('[data-intro]');
  root.classList.add('motion-ready');

  if (!intro || reducedMotion.matches || getStoredIntroState()) {
    finishIntro(intro);
    return;
  }

  storeIntroState();
  window.setTimeout(() => intro.classList.add('is-leaving'), 940);
  window.setTimeout(() => finishIntro(intro), 1250);
}

function initReveals(reducedMotion) {
  const revealItems = [...document.querySelectorAll('.reveal')];
  const heroItems = revealItems.filter((item) => item.closest('[data-hero]'));
  const remainingItems = revealItems.filter((item) => !item.closest('[data-hero]'));

  const revealHero = () => {
    heroItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index, 3) * 80}ms`;
      item.classList.add('is-visible');
    });
  };

  if (root.classList.contains('intro-complete')) revealHero();
  else document.addEventListener('intro:complete', revealHero, { once: true });

  const staggerGroups = document.querySelectorAll('.project, .archive-grid, .process-list, .profile-grid, .profile-extras');
  staggerGroups.forEach((group) => {
    [...group.querySelectorAll('.reveal')].forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index, 3) * 70}ms`;
    });
  });

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    remainingItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  remainingItems.forEach((item) => observer.observe(item));
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-menu]');
  if (!toggle || !panel) return;

  root.classList.add('menu-ready');
  panel.inert = true;
  let restoreTarget = toggle;

  const focusableItems = () => [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = 'Menu';
    panel.setAttribute('aria-hidden', 'true');
    panel.classList.remove('is-open');
    panel.inert = true;
    document.body.classList.remove('menu-open');
    if (restoreFocus) restoreTarget?.focus();
  };

  const openMenu = () => {
    restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('span').textContent = 'Close';
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open');
    panel.inert = false;
    document.body.classList.add('menu-open');
    window.requestAnimationFrame(() => focusableItems()[0]?.focus());
  };

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) closeMenu({ restoreFocus: false });
  });

  document.addEventListener('keydown', (event) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;
    const items = focusableItems();
    const first = items[0];
    const last = items.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu({ restoreFocus: false });
  }, { passive: true });
}

function initPointerReticle(reducedMotion) {
  const reticle = document.querySelector('[data-reticle]');
  const finePointer = window.matchMedia('(pointer: fine)');
  if (!reticle || reducedMotion.matches || !finePointer.matches) return;

  root.classList.add('reticle-ready');
  let nextX = -48;
  let nextY = -48;
  let frameRequested = false;

  const renderPointer = () => {
    reticle.style.setProperty('--reticle-x', `${nextX}px`);
    reticle.style.setProperty('--reticle-y', `${nextY}px`);
    frameRequested = false;
  };

  document.addEventListener('pointermove', (event) => {
    nextX = event.clientX;
    nextY = event.clientY;
    reticle.classList.add('is-visible');
    reticle.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, [data-crosshair]')));

    const frame = event.target.closest('[data-crosshair]');
    if (frame) {
      const bounds = frame.getBoundingClientRect();
      frame.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      frame.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }

    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(renderPointer);
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => reticle.classList.remove('is-visible'));
}

function initScrollMotion(reducedMotion) {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-progress]');
  const datumLabel = document.querySelector('[data-datum-label]');
  const hero = document.querySelector('[data-hero]');
  const trackedSections = [
    ['top', 'Top'], ['work', 'Work'], ['archive', 'Archive'],
    ['profile', 'Profile'], ['contact', 'Contact']
  ].map(([id, label]) => ({ element: document.getElementById(id), label })).filter(({ element }) => element);

  let frameRequested = false;

  const renderScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    root.style.setProperty('--page-progress', ratio.toFixed(4));
    progress?.style.setProperty('transform', `scaleX(${ratio})`);
    header?.classList.toggle('is-scrolled', window.scrollY > 48);

    if (!reducedMotion.matches && hero) {
      const heroTravel = Math.min(window.scrollY, hero.offsetHeight);
      root.style.setProperty('--hero-grid-y', `${heroTravel * -0.035}px`);
      root.style.setProperty('--hero-image-y', `${heroTravel * -0.022}px`);
    }

    if (datumLabel) {
      const marker = window.scrollY + window.innerHeight * 0.42;
      const current = trackedSections.reduce((active, section) => (
        section.element.offsetTop <= marker ? section : active
      ), trackedSections[0]);
      datumLabel.textContent = current?.label ?? 'Top';
    }

    frameRequested = false;
  };

  const queueScrollRender = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(renderScroll);
  };

  queueScrollRender();
  window.addEventListener('scroll', queueScrollRender, { passive: true });
  window.addEventListener('resize', queueScrollRender, { passive: true });
}

function initSectionNavigation() {
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window)) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

function initArchiveFilter(reducedMotion) {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-project]')];
  const status = document.querySelector('[data-filter-status]');
  const grid = document.querySelector('.archive-grid');
  let filterTimer;

  const applyFilter = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.dataset.category?.split(' ') ?? [];
      const isVisible = filter === 'all' || categories.includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (status) status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
    grid?.classList.remove('is-filtering');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      window.clearTimeout(filterTimer);
      const filter = button.dataset.filter;

      if (reducedMotion.matches || !grid) {
        applyFilter(filter);
        return;
      }

      grid.classList.add('is-filtering');
      filterTimer = window.setTimeout(() => applyFilter(filter), 170);
    });
  });
}

function updateYear() {
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function initSite() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  initIntro(reducedMotion);
  initReveals(reducedMotion);
  initMobileMenu();
  initPointerReticle(reducedMotion);
  initScrollMotion(reducedMotion);
  initSectionNavigation();
  initArchiveFilter(reducedMotion);
  updateYear();
}

initSite();
