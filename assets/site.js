// Shared site-wide behaviour: version, nav active state, scroll progress,
// mega-nav dropdowns, chapter position indicator.
//
// ───────── BRAND BOOK VERSION — single source of truth ─────────
const BRAND_VERSION      = "1.2";
const BRAND_VERSION_DATE = "May 2026";
// ────────────────────────────────────────────────────────────────

// ───────── CHAPTER MAP — single source of truth ─────────
// Order = the sequential "Next →" chain throughout the book.
const CHAPTERS = {
  expression: [
    { href: 'story.html',             page: 'story',              label: 'Story' },
    { href: 'voice.html',             page: 'voice',              label: 'Voice' },
    { href: 'photography.html',       page: 'photography',        label: 'Photography' },
  ],
  form: [
    { href: 'logo.html',              page: 'logo',               label: 'Logo & Monogram' },
    { href: 'color.html',             page: 'color',              label: 'Color' },
    { href: 'type.html',              page: 'type',               label: 'Typography' },
    { href: 'pattern.html',           page: 'pattern',            label: 'Pattern' },
    { href: 'anchor.html',            page: 'anchor',             label: 'Brand Anchor' },
  ],
  frame: [
    { href: 'capsules.html',          page: 'capsules',           label: 'Capsules' },
    { href: 'layout.html',            page: 'layout',             label: 'Layout' },
    { href: 'motion.html',            page: 'motion',             label: 'Motion' },
  ],
  practice: [
    { href: 'stationery.html',        page: 'stationery',         label: 'Stationery' },
    { href: 'packaging.html',         page: 'packaging',          label: 'Packaging' },
    { href: 'merchandise.html',       page: 'merchandise',        label: 'Merchandise' },
    { href: 'print-goods.html',       page: 'print-goods',        label: 'Print Goods' },
    { href: 'digital-exhibition.html',page: 'digital-exhibition', label: 'Digital & Exhibition' },
  ],
};

// Flat ordered list for global chapter position
const ALL_CHAPTERS = [
  ...CHAPTERS.expression,
  ...CHAPTERS.form,
  ...CHAPTERS.frame,
  ...CHAPTERS.practice,
];
// ────────────────────────────────────────────────────────────────

(function () {

  // --- 1. Version injection ---
  document.querySelectorAll('[data-version]').forEach(el => {
    const mode = el.dataset.version;
    if (mode === 'topbar')      el.textContent = `v ${BRAND_VERSION} · 2026`;
    else if (mode === 'footer') el.textContent = `— Brand System v ${BRAND_VERSION} —`;
    else if (mode === 'meta')   el.textContent = `${BRAND_VERSION} — ${BRAND_VERSION_DATE}`;
    else                        el.textContent = BRAND_VERSION;
  });

  // --- 2. Nav active states (original anchors) ---
  const page  = document.body.dataset.page;
  const group = document.body.dataset.group;
  document.querySelectorAll('.topbar a, .nav-secondary a').forEach(a => {
    if (a.dataset.page  && a.dataset.page  === page)  a.classList.add('active');
    if (a.dataset.group && a.dataset.group === group) a.classList.add('active');
  });

  // --- 3. Mega-nav dropdowns ---
  // Wraps each data-group anchor in a .nav-item div and appends a
  // .nav-drop panel listing every chapter in that group.
  // No HTML files need changing — this runs on every page load.
  function buildMegaNav() {
    const nav = document.querySelector('.nav-primary');
    if (!nav) return;

    nav.querySelectorAll('a[data-group]').forEach(a => {
      const groupKey = a.dataset.group;
      const pages    = CHAPTERS[groupKey];
      if (!pages) return;

      // Wrap the group anchor in a .nav-item
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-item';
      a.parentNode.insertBefore(wrapper, a);
      wrapper.appendChild(a);
      a.classList.add('has-drop');

      // Build the dropdown panel
      const drop = document.createElement('div');
      drop.className = 'nav-drop';

      // Group label row
      const groupLabel = document.createElement('div');
      groupLabel.className = 'nav-drop-group';
      groupLabel.textContent = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
      drop.appendChild(groupLabel);

      pages.forEach(pg => {
        const link = document.createElement('a');
        link.href = pg.href;
        link.textContent = pg.label;
        if (pg.page === page) link.classList.add('active');
        drop.appendChild(link);
      });

      wrapper.appendChild(drop);
    });
  }

  // --- 4. Chapter position in topbar meta ---
  // Replaces "— Photography" with "Expression · 03 / 16"
  function updateChapterMeta() {
    if (!page || page === 'index') return;

    const totalChapters = ALL_CHAPTERS.length;
    const globalIdx     = ALL_CHAPTERS.findIndex(c => c.page === page);
    if (globalIdx < 0) return;

    const globalNum    = String(globalIdx + 1).padStart(2, '0');
    const groupLabel   = group
      ? group.charAt(0).toUpperCase() + group.slice(1)
      : '';

    const metaEl = document.querySelector('.topbar .meta');
    if (metaEl) {
      metaEl.classList.add('meta-position');
      metaEl.textContent = `${groupLabel} · ${globalNum} / ${totalChapters}`;
    }
  }

  buildMegaNav();
  updateChapterMeta();

  // --- 5. Scroll-progress bar ---
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
