// Dark Clinical Pro motion layer — technical/glowing "night monitor"
// personality. Wires up the staggered power-on reveal, the segment
// sliding-glow thumb, the profile tabs' sliding underline, and the
// scroll-driven topbar condense. Scoped to this design only.

function initDarkClinicalProAnimations(){
  const screens = document.querySelectorAll('.phone-screen');

  screens.forEach((screen) => {
    initStaggerReveal(screen);
    initSegmentThumb(screen);
    initTabUnderline(screen);
    initTopbarShrink(screen);
  });
}

// ---------- 1. Staggered load-in ----------
function initStaggerReveal(screen){
  const selectors = [
    '.dp-topbar',
    '.dp-profile-hero',
    '.dp-segment',
    '.dp-profile-card',
    '.dp-tablist',
    '.dp-stats',
    '.dp-section-title',
    '.dp-card',
    '.dp-ward-card',
    '.dp-timeline-item',
    '.dp-alert',
    '.dp-quick',
    '.dp-field',
  ];
  const nodes = Array.from(screen.querySelectorAll(selectors.join(',')));
  // Tighter spacing than the other designs — a HUD powers up fast.
  nodes.forEach((el, i) => {
    el.classList.add('dp-reveal');
    el.style.setProperty('--dp-delay', `${Math.min(i * 40, 360)}ms`);
  });
}

// ---------- 3. Sliding thumb for segment toggle ----------
// This design's .dp-segment IS a single padded track (unlike Soft
// Clinical's gapped pills), so an absolute overlay thumb is the right
// shape here.
function initSegmentThumb(screen){
  screen.querySelectorAll('.dp-segment').forEach((segment) => {
    const buttons = Array.from(segment.querySelectorAll('button'));
    if (buttons.length < 2) return;

    const thumb = document.createElement('div');
    thumb.className = 'dp-segment-thumb';
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

// ---------- 3b. Patient-profile tabs — sliding underline + real panel swap ----------
// Buttons here are variable-width text (not equal pills), so the
// underline's width/position must be measured against each button's
// actual rendered box rather than assumed at 50%/33%. Each tab also owns
// a real content panel (.dp-panel[data-panel]) that gets shown/hidden —
// not just a cosmetic re-trigger of the same fixed content.
function initTabUnderline(screen){
  const tablist = screen.querySelector('.dp-tablist');
  if (!tablist) return;
  const buttons = Array.from(tablist.querySelectorAll('button'));
  const panels = Array.from(screen.querySelectorAll('.dp-panel'));
  if (buttons.length < 2) return;

  const underline = document.createElement('div');
  underline.className = 'dp-tab-underline';
  tablist.appendChild(underline);

  const moveUnderline = (btn) => {
    // offsetLeft/offsetWidth are LTR-agnostic (physical, not logical), so
    // this works the same whether the tablist renders RTL or LTR.
    underline.style.width = `${btn.offsetWidth}px`;
    underline.style.transform = `translateX(${btn.offsetLeft}px)`;
  };

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

  const activeBtn = tablist.querySelector('button.active') || buttons[0];
  // Measure after layout has settled (fonts loaded, reveal animation
  // doesn't affect layout size, but do it on next frame to be safe).
  requestAnimationFrame(() => moveUnderline(activeBtn));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      moveUnderline(btn);
      if (panels.length) showPanel(btn.dataset.panel);
    });
  });
}

// ---------- 6. Topbar shrink/condense on scroll ----------
function initTopbarShrink(screen){
  const viewport = screen.querySelector('.app-viewport');
  const topbar = screen.querySelector('.dp-topbar');
  if (!viewport || !topbar) return;

  viewport.addEventListener('scroll', () => {
    topbar.classList.toggle('is-condensed', viewport.scrollTop > 24);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initDarkClinicalProAnimations);
