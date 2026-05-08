// Shared site-wide behavior: version injection, nav active state, scroll progress.
//
// ───────── BRAND BOOK VERSION — single source of truth ─────────
// Bump this string when you ship changes. Every page that contains
// data-version="topbar" or data-version="footer" or data-version="meta"
// will update automatically — never edit version text in HTML by hand.
const BRAND_VERSION = "1.2";
const BRAND_VERSION_DATE = "May 2026";
// ────────────────────────────────────────────────────────────────

(function () {
  // --- inject version everywhere it's marked ---
  document.querySelectorAll('[data-version]').forEach(el => {
    const mode = el.dataset.version;
    if (mode === 'topbar')      el.textContent = `v ${BRAND_VERSION} · 2026`;
    else if (mode === 'footer') el.textContent = `— Brand System v ${BRAND_VERSION} —`;
    else if (mode === 'meta')   el.textContent = `${BRAND_VERSION} — ${BRAND_VERSION_DATE}`;
    else                        el.textContent = BRAND_VERSION;
  });

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
