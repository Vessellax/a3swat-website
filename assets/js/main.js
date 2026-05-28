// ── PASTE YOUR APPS SCRIPT DEPLOYMENT URL HERE ──────────────
// After deploying: Deploy → Manage deployments → copy Web App URL
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxXptNqZ_vNJrej8r1n3WlQ_FObLsyz820Zfm0YVR-4fxffM4qz6zMusdKKPvA3Ca2q/exec';

// ── Nav: sticky + hamburger ──────────────────────────────────
const nav    = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Nav active state ─────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
  a.classList.toggle('active', a.getAttribute('href') === page);
});

// ── Scroll reveal ─────────────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ── Contact form (homepage inquiry — no Sheets logging needed)
function wireContactForm(formId, successId) {
  const form = document.getElementById(formId);
  const ok   = document.getElementById(successId);
  if (!form || !ok) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    ok.classList.add('show');
  });
}

wireContactForm('contactForm', 'contactOk');

// ── Registration form → Google Sheets ────────────────────────
function wireRegForm(formId, successId) {
  const form = document.getElementById(formId);
  const ok   = document.getElementById(successId);
  const btn  = form ? form.querySelector('button[type="submit"]') : null;
  if (!form || !ok) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // If URL hasn't been set yet, just show success (dev mode)
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      form.style.display = 'none';
      ok.classList.add('show');
      return;
    }

    // Disable button while submitting
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

    try {
      // GET avoids CORS preflight — doGet on Apps Script side handles it
      const params = new URLSearchParams(new FormData(form));
      await fetch(`${SHEETS_URL}?${params.toString()}`, { mode: 'no-cors' });
    } catch (_) {
      // no-cors fetch may throw on response read — expected
    }

    form.style.display = 'none';
    ok.classList.add('show');
  });
}

wireRegForm('regForm', 'regOk');
