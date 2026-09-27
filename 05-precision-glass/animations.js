// Precision Glass motion layer — airy/floating glass personality. Wires
// up the blur-to-focus staggered reveal, the segment sliding-sheen thumb,
// real tab-panel switching, and the scroll-driven topbar condense.
// Scoped to this design only.

function initPrecisionGlassAnimations(){
  const screens = document.querySelectorAll('.phone-screen');

  screens.forEach((screen) => {
    initStaggerReveal(screen);
    initSegmentThumb(screen);
    initProfileTabs(screen);
    initTopbarShrink(screen);
  });
}

// ---------- 1. Staggered load-in ----------
function initStaggerReveal(screen){
  const selectors = [
    '.pg-topbar',
    '.pg-profile-hero',
    '.pg-segment',
    '.pg-profile-card',
    '.pg-tablist',
    '.pg-stats',
    '.pg-section-title',
    '.pg-card',
    '.pg-ward-card',
    '.pg-timeline-item',
    '.pg-alert',
    '.pg-quick',
    '.pg-field',
  ];
  // Skip content inside a not-yet-shown tab panel so it doesn't get stuck
  // at opacity:0 while hidden — the panel-swap animation handles its
  // entrance once the tab actually opens it.
  const nodes = Array.from(screen.querySelectorAll(selectors.join(','))).filter(
    (el) => !el.closest('.pg-panel[hidden]')
  );
  // Slightly more generous spacing than the other designs — glass panels
  // drift into focus rather than snapping into place.
  nodes.forEach((el, i) => {
    el.classList.add('pg-reveal');
    el.style.setProperty('--pg-delay', `${Math.min(i * 65, 520)}ms`);
  });
}

// ---------- 3. Sliding thumb for segment toggle ----------
function initSegmentThumb(screen){
  screen.querySelectorAll('.pg-segment').forEach((segment) => {
    const buttons = Array.from(segment.querySelectorAll('button'));
    if (buttons.length < 2) return;

    const thumb = document.createElement('div');
    thumb.className = 'pg-segment-thumb';
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
// Each tab owns a genuine content panel (.pg-panel[data-panel]); switching
// tabs shows/hides the matching panel and re-triggers a soft blur-focus-in
// on it, matching this design's airy glass personality.
function initProfileTabs(screen){
  const tablist = screen.querySelector('.pg-tablist');
  if (!tablist) return;
  const buttons = Array.from(tablist.querySelectorAll('button'));
  const panels = Array.from(screen.querySelectorAll('.pg-panel'));
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

// ---------- 6. Topbar shrink/condense on scroll ----------
function initTopbarShrink(screen){
  const viewport = screen.querySelector('.app-viewport');
  const topbar = screen.querySelector('.pg-topbar');
  if (!viewport || !topbar) return;

  viewport.addEventListener('scroll', () => {
    topbar.classList.toggle('is-condensed', viewport.scrollTop > 24);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initPrecisionGlassAnimations);
