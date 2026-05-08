// Shared site-wide behavior: nav active state, scroll progress
(function () {
  const page = document.body.dataset.page;
  const group = document.body.dataset.group;
  document.querySelectorAll('.topbar a, .nav-secondary a').forEach(a => {
    if (a.dataset.page && a.dataset.page === page) a.classList.add('active');
    if (a.dataset.group && a.dataset.group === group) a.classList.add('active');
  });

  const bar = document.querySelector('.progress');
  if (bar) {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.setProperty('--p', pct + '%');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
