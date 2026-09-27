// Shared showcase behavior: status bar clock (not part of the app) +
// neutralizing mock links inside phone screens.

function initShowcase(){
  document.querySelectorAll('.status-clock').forEach(el => {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    el.textContent = `${h}:${m}`;
  });

  // Every mock app screen uses <a href="javascript:void(0)"> / <a href="#"> as placeholder
  // buttons/nav items. Those are real links to a real browser, so clicking
  // one reloads or jumps the whole showcase page. None of them are meant
  // to navigate anywhere — they're just styled as links — so swallow the
  // click at the document level rather than editing every anchor tag.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.phone-screen a[href]');
    if (link) e.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', initShowcase);
