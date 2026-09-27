// Injects the shared showcase top navbar (design switcher) into every page.
// This navbar belongs to the SHOWCASE SITE, not the app being previewed —
// the app itself uses a bottom nav inside the phone frame.

const DESIGNS = [
  { id:'index',                 label:'الرئيسية',                 file:'../index.html' },
  { id:'clinical-trust',        label:'١ · طبي كلاسيكي',           file:'../01-clinical-trust/index.html' },
  { id:'soft-clinical',         label:'٢ · دافئ',             file:'../02-soft-clinical/index.html' },
  { id:'dark-clinical-pro',     label:'٣ · احترافي داكن',          file:'../03-dark-clinical-pro/index.html' },
  { id:'precision-glass',       label:'٤ · زجاجي عصري',            file:'../05-precision-glass/index.html' },
  { id:'structured-enterprise', label:'٥ · كثافة بيانات',          file:'../04-structured-enterprise/index.html' },
];

function renderShowcaseNav(activeId, fromRoot){
  const tabs = DESIGNS.map(d => {
    const href = fromRoot ? d.file.replace('../','./') : d.file;
    const cls = d.id === activeId ? 'active' : '';
    return `<a href="${href}" class="${cls}">${d.label}</a>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.className = 'showcase-nav';
  nav.innerHTML = `
    <a href="${fromRoot ? './index.html' : '../index.html'}" class="brand">
      <span class="dot"></span>
      <span class="brand-text">عيادة · معرض التصاميم</span>
    </a>
    <div class="showcase-tabs" id="showcaseTabs">${tabs}</div>
    <button class="showcase-menu-btn" id="showcaseMenuBtn" type="button" aria-label="فتح قائمة التصاميم" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  `;
  document.body.prepend(nav);

  const menuBtn = nav.querySelector('#showcaseMenuBtn');
  const tabsEl = nav.querySelector('#showcaseTabs');

  menuBtn.addEventListener('click', () => {
    const isOpen = tabsEl.classList.toggle('open');
    menuBtn.classList.toggle('active', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the dropdown if the viewport grows past the small-screen
  // breakpoint (the tabs become an inline row again at that width).
  const closeIfWide = () => {
    if (window.innerWidth > 767) {
      tabsEl.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  };
  window.addEventListener('resize', closeIfWide);

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      tabsEl.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Design pages size the phone gallery to fill the exact remaining
  // viewport height below this navbar (see html.design-page rules in
  // frame.css), so we measure the real rendered navbar height here
  // instead of relying on a guessed fallback.
  if(document.documentElement.classList.contains('design-page')){
    const setNavHeight = () => {
      document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    };
    setNavHeight();
    window.addEventListener('resize', setNavHeight);
  }
}
