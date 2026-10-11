const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-faq-category]'));
const groups = links.map(link => document.getElementById(link.hash.slice(1)));
if (links.length) {
  const update = () => {
    const line = (document.querySelector('.nav')?.getBoundingClientRect().bottom ?? 80) + 24;
    let selected = 0;
    groups.forEach((group, i) => { if (group && group.getBoundingClientRect().top <= line) selected = i; });
    links.forEach((link, i) => {
      link.classList.toggle('on', i === selected);
      if (i === selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}
