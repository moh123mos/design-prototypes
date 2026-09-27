// Clinical Trust motion layer — wires up the staggered reveal, the
// segment-toggle sliding thumb, and the scroll-driven topbar shrink.
// Scoped to this design only (experimental animation pass).

function initClinicalTrustAnimations(){
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
  // Pick the direct "sections" worth animating in sequence: the topbar,
  // the segment toggle, the stats row, each list card/timeline item, and
  // the quick-actions row / bottom action bar. We tag them generically by
  // selector rather than requiring markup changes.
  const selectors = [
    '.ct-topbar',
    '.ct-profile-hero',
    '.ct-segment',
    '.ct-profile-card',
    '.ct-tablist',
    '.ct-stats',
    '.ct-section-title',
    '.ct-card',
    '.ct-ward-card',
    '.ct-timeline-item',
    '.ct-alert',
    '.ct-quick',
    '.ct-field',
  ];
  const nodes = Array.from(screen.querySelectorAll(selectors.join(',')));
  nodes.forEach((el, i) => {
    el.classList.add('ct-reveal');
    el.style.setProperty('--ct-delay', `${Math.min(i * 55, 480)}ms`);
  });
}

// ---------- 3. Sliding thumb for segment toggle ----------
function initSegmentThumb(screen){
  screen.querySelectorAll('.ct-segment').forEach((segment) => {
    const buttons = Array.from(segment.querySelectorAll('button'));
    if (buttons.length < 2) return;

    const thumb = document.createElement('div');
    thumb.className = 'ct-segment-thumb';
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
// Each tab owns a genuine content panel (.ct-panel[data-panel]); switching
// tabs shows/hides the matching panel and re-triggers a crisp reveal on it,
// matching this design's fast/precise personality.
function initProfileTabs(screen){
  const tablist = screen.querySelector('.ct-tablist');
  if (!tablist) return;
  const buttons = Array.from(tablist.querySelectorAll('button'));
  const panels = Array.from(screen.querySelectorAll('.ct-panel'));
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

// ---------- 6. Topbar shrink/blur on scroll ----------
function initTopbarShrink(screen){
  const viewport = screen.querySelector('.app-viewport');
  const topbar = screen.querySelector('.ct-topbar');
  if (!viewport || !topbar) return;

  viewport.addEventListener('scroll', () => {
    topbar.classList.toggle('is-condensed', viewport.scrollTop > 24);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initClinicalTrustAnimations);
