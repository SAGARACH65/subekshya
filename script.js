document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

const revealItems = document.querySelectorAll('.reveal');
if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealItems.forEach((item, index) => {
    if (index < 4) item.style.transitionDelay = `${index * 90}ms`;
    revealObserver.observe(item);
  });
}

if (finePointer.matches && !prefersReducedMotion.matches) {
  document.querySelectorAll('[data-crosshair]').forEach((frame) => {
    frame.addEventListener('pointermove', (event) => {
      const bounds = frame.getBoundingClientRect();
      frame.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      frame.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    });
  });
}

const header = document.querySelector('[data-header]');
const progress = document.querySelector('[data-progress]');

const updateScrollState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  header?.classList.toggle('is-scrolled', window.scrollY > 48);
  progress?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, ratio))})`);
};

updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });

const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
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

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-project]')];
const filterStatus = document.querySelector('[data-filter-status]');

const applyProjectFilter = (filter) => {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.category?.split(' ') ?? [];
    const isVisible = filter === 'all' || categories.includes(filter);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (filterStatus) {
    filterStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
  }
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyProjectFilter(button.dataset.filter));
});
