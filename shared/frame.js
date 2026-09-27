// Shared showcase behavior: status bar clock (not part of the app)

function initShowcase(){
  document.querySelectorAll('.status-clock').forEach(el => {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2,'0');
    el.textContent = `${h}:${m}`;
  });
}

document.addEventListener('DOMContentLoaded', initShowcase);
