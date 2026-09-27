// Structured Data Enterprise motion layer — functional/data-grid
// personality. Wires up the row-populate reveal, segment sliding thumb,
// real tab-panel switching, numeric count-up on stat figures, and the
// scroll-driven sticky-header condense. Scoped to this design only.

function initStructuredEnterpriseAnimations(){
  const screens = document.querySelectorAll('.phone-screen');

  screens.forEach((screen) => {
    initStaggerReveal(screen);
    initSegmentThumb(screen);
    initProfileTabs(screen);
    initCountUp(screen);
    initTopbarShrink(screen);
  });
}

// ---------- 1. Staggered load-in ----------
function initStaggerReveal(screen){
  const selectors = [
    '.se-sync-strip',
    '.se-segment',
    '.se-stat',
    '.se-section-title',
    '.se-table-head',
    '.se-row',
    '.se-ward-row',
    '.se-quick-item',
    '.se-log-row',
    '.se-alert',
    '.se-field',
    '.se-profile-hero',
    '.se-profile-stats',
    '.se-tablist',
  ];
  // Skip content inside a not-yet-shown tab panel — it has no layout box
  // to animate into yet, and would otherwise get stuck at opacity:0 since
  // its "forwards" reveal animation runs while display is suppressed.
  // Those panels get their own populate animation when the tab opens them.
  const nodes = Array.from(screen.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.closest('.se-panel[hidden]')
  );
  // Tight, near-mechanical spacing — a data grid populates fast, not
  // dramatically.
  nodes.forEach((el, i) => {
    el.classList.add('se-reveal');
    el.style.setProperty('--se-delay', `${Math.min(i * 30, 280)}ms`);
  });
}

// ---------- 3. Sliding thumb for segment toggle ----------
function initSegmentThumb(screen){
  screen.querySelectorAll('.se-segment').forEach((segment) => {
    const buttons = Array.from(segment.querySelectorAll('button'));
    if (buttons.length < 2) return;

    const thumb = document.createElement('div');
    thumb.className = 'se-segment-thumb';
    segment.prepend(thumb);

    const moveThumb = (btn) => {
      const isFirst = btn === buttons[0];
      thumb.style.transform = isFirst ? 'translateX(0)' : `translateX(${segment.dir === 'ltr' ? '100%' : '-100%'})`;
    };

    const activeBtn = segment.querySelector('button.active') || buttons[0];
    moveThumb(activeBtn);

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        moveThumb(btn);
      });
    });
  });
}

// ---------- 3b. Patient-profile tabs — real panel swap ----------
// Each tab owns a genuine content panel (.se-panel[data-panel]); switching
// re-triggers a row-by-row "populate" animation on the newly shown panel,
// matching the grid/table-driven feel of this design.
function initProfileTabs(screen){
  const tablist = screen.querySelector('.se-tablist');
  if (!tablist) return;
  const buttons = Array.from(tablist.querySelectorAll('button'));
  const panels = Array.from(screen.querySelectorAll('.se-panel'));
  if (buttons.length < 2 || !panels.length) return;

  const showPanel = (key) => {
    panels.forEach((p) => {
      const isMatch = p.dataset.panel === key;
      p.hidden = !isMatch;
      if (isMatch) {
        p.classList.remove('is-swapping');
        void p.offsetWidth;
        p.classList.add('is-swapping');
      }
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      showPanel(btn.dataset.panel);
    });
  });
}

// ---------- 5. Numeric count-up on stat figures ----------
// Purely cosmetic on load: each .se-stat .num counts up from 0 (or from
// the low end for percentages) to its real value, reinforcing the
// "live dashboard just refreshed" read established by the sync strip.
function initCountUp(screen){
  screen.querySelectorAll('.se-stat .num').forEach((el, i) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(%?)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 420;
    const delay = 120 + i * 40;
    const start = performance.now() + delay;

    el.textContent = `0${suffix}`;

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.textContent = `${val}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ---------- 6. Topbar shrink/condense on scroll ----------
function initTopbarShrink(screen){
  const viewport = screen.querySelector('.app-viewport');
  const topbar = screen.querySelector('.se-topbar');
  if (!viewport || !topbar) return;

  viewport.addEventListener('scroll', () => {
    topbar.classList.toggle('is-condensed', viewport.scrollTop > 24);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initStructuredEnterpriseAnimations);
