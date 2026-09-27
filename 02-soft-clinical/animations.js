// Soft Clinical motion layer — gentle/organic personality. Wires up the
// staggered melt-in reveal, the segment/tab color-morph + pop toggling,
// and the scroll-driven topbar settle. Scoped to this design only.

function initSoftClinicalAnimations(){
  const screens = document.querySelectorAll('.phone-screen');

  screens.forEach((screen) => {
    initStaggerReveal(screen);
    initToggleGroup(screen, '.sc-segment');
    initProfileTabs(screen);
    initTopbarShrink(screen);
  });
}

// ---------- 1. Staggered load-in ----------
function initStaggerReveal(screen){
  const selectors = [
    '.sc-topbar',
    '.sc-profile-hero',
    '.sc-segment',
    '.sc-profile-card',
    '.sc-tablist',
    '.sc-stats',
    '.sc-section-title',
    '.sc-card',
    '.sc-ward-card',
    '.sc-timeline-item',
    '.sc-alert',
    '.sc-quick',
    '.sc-field',
  ];
  const nodes = Array.from(screen.querySelectorAll(selectors.join(',')));
  // Slightly wider spacing between steps than a "crisp" reveal, to match
  // the slower, breathing pace of this design's motion.
  nodes.forEach((el, i) => {
    el.classList.add('sc-reveal');
    el.style.setProperty('--sc-delay', `${Math.min(i * 70, 560)}ms`);
  });
}

// ---------- 3. Segment toggle (عيادة خارجية / أجنحة داخلية) ----------
// Plain active-class switching — the "thumb" idea doesn't fit this
// design's two-independent-pill layout, so the animation lives entirely
// in CSS as a color morph + settle bounce on whichever pill gains
// .active (see animations.css).
function initToggleGroup(screen, selector){
  screen.querySelectorAll(selector).forEach((group) => {
    const buttons = Array.from(group.querySelectorAll('button'));
    if (buttons.length < 2) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// ---------- 3b. Patient-profile tabs (السجل الطبي / الجلسات / المرفقات) ----------
// Same active-class toggle as the segment. Each tab owns a real content
// panel (.sc-panel[data-panel]) — switching tabs shows/hides the matching
// panel and re-triggers a gentle melt-in on it, so the content genuinely
// changes rather than just re-fading the same block.
function initProfileTabs(screen){
  const tablist = screen.querySelector('.sc-tablist');
  if (!tablist) return;
  const buttons = Array.from(tablist.querySelectorAll('button'));
  const panels = Array.from(screen.querySelectorAll('.sc-panel'));
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

// ---------- 6. Topbar shrink/settle on scroll ----------
function initTopbarShrink(screen){
  const viewport = screen.querySelector('.app-viewport');
  const topbar = screen.querySelector('.sc-topbar');
  if (!viewport || !topbar) return;

  viewport.addEventListener('scroll', () => {
    topbar.classList.toggle('is-condensed', viewport.scrollTop > 24);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initSoftClinicalAnimations);
