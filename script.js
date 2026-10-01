const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});

mobileMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});

const counters = [...document.querySelectorAll('.count-value[data-count-to]')];
const counterGrid = document.querySelector('.numbers-grid');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (counterGrid && counters.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
  const formatCount = (element, value) => String(value).padStart(Number(element.dataset.countPad || 1), '0');

  const startCounters = () => {
    const duration = 1500;
    const stagger = 90;
    let startTime;

    const tick = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;
      let complete = true;

      counters.forEach((element, index) => {
        const progress = Math.min(Math.max((timestamp - startTime - index * stagger) / duration, 0), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const target = Number(element.dataset.countTo);
        element.textContent = formatCount(element, Math.round(target * eased));
        if (progress < 1) complete = false;
      });

      if (!complete) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    startCounters();
  }, { threshold: 0.2 });

  observer.observe(counterGrid);
}
