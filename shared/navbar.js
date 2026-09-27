// Injects the shared showcase top navbar (design switcher) into every page.
// This navbar belongs to the SHOWCASE SITE, not the app being previewed —
// the app itself uses a bottom nav inside the phone frame.

const DESIGNS = [
  { id:'index',                 label:'الرئيسية',                 file:'../index.html' },
  { id:'clinical-trust',        label:'١ · طبي كلاسيكي',           file:'../01-clinical-trust/index.html' },
  { id:'soft-clinical',         label:'٢ · دافئ',             file:'../02-soft-clinical/index.html' },
  { id:'dark-clinical-pro',     label:'٣ · احترافي داكن',          file:'../03-dark-clinical-pro/index.html' },
  { id:'structured-enterprise', label:'٤ · كثافة بيانات',          file:'../04-structured-enterprise/index.html' },
  { id:'precision-glass',       label:'٥ · زجاجي عصري',            file:'../05-precision-glass/index.html' },
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
    <div class="showcase-tabs">${tabs}</div>
  `;
  document.body.prepend(nav);

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
