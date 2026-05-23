function isInView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.top < (window.innerHeight || document.documentElement.clientHeight) - 20 && r.bottom > 0;
}

function reveal(el: Element) {
  el.classList.add('is-revealed');
}

function init() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach(reveal);
    return;
  }

  targets.forEach(el => { if (isInView(el)) reveal(el); });

  const remaining = Array.from(targets).filter(el => !el.classList.contains('is-revealed'));
  if (!remaining.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        reveal(entry.target);
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
  remaining.forEach(el => io.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
