/* Amani Tech prototype — public site behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';
  const D = window.AT_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const param = n => new URLSearchParams(location.search).get(n);
  const TODAY = new Date('2026-09-16T12:00:00');
  const ROOT = document.body.dataset.root || '';

  /* ---------- Icons ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    rupee: '<path d="M6 4h12M6 9h12M6 4c6 0 8 2 8 5s-2 5-8 5l8 6"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 7"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    upload: '<path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    usercheck: '<circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 14-3M16 11l2 2 4-4"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5M3 17l9 5 9-5"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.5M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.5"/>',
    twitter: '<path d="M4 4l16 16M20 4 4 20"/>',
    youtube: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 4v12m0 0 4-4m-4 4-4-4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    zap: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
    message: '<path d="M4 5h16v11H8l-4 4z"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3.9a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 2.4a7 7 0 0 0-1.7 1L5.1 5.5l-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-.9a7 7 0 0 0 1.7 1L9.5 21h5l.4-2.4a7 7 0 0 0 1.7-1l2.3.9 2-3.5-2-1.5c.1-.3.1-.7.1-1z"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" aria-hidden="true" viewBox="0 0 24 24">${ICONS[n] || ''}</svg>`;

  /* ---------- Formatting helpers ---------- */
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = iso => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const daysAgo = iso => Math.floor((TODAY - new Date(iso)) / 86400000);
  const timeAgo = iso => { const n = daysAgo(iso); return n <= 0 ? 'Today' : n === 1 ? 'Yesterday' : n < 7 ? `${n} days ago` : n < 30 ? `${Math.floor(n / 7)} wk ago` : fmtDate(iso); };
  const salary = j => j.salaryMin ? `₹${j.salaryMin}–${j.salaryMax} LPA` : 'Not disclosed';
  const expText = j => j.expMax <= 1 ? 'Fresher – 1 yr' : `${j.expMin}–${j.expMax} yrs`;
  const initials = n => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const catName = id => (D.categories.find(c => c.id === id) || {}).name || id;
  const subName = id => { for (const c of D.categories) { const s = c.subs.find(x => x.id === id); if (s) return s.name; } return id; };
  const published = () => D.jobs.filter(j => j.status === 'PUBLISHED');

  /* ---------- Header & footer ---------- */
  const NAV = [
    ['index.html', 'Home', 'home'], ['about.html', 'About', 'about'], ['services.html', 'Services', 'services'],
    ['jobs.html', 'Find Jobs', 'jobs'], ['employers.html', 'Employers', 'employers'], null, ['careers.html', 'Careers', 'careers'], ['contact.html', 'Contact', 'contact']
  ];
  const RESOURCES = [['blog.html', 'Blog', 'Insights and career advice'], ['blog.html?category=insights', 'Insights', 'Hiring trends and industry views'], ['blog.html?category=career-advice', 'Career Advice', 'Resumes, interviews, growth'], ['faqs.html', 'FAQs', 'Answers for candidates and employers']];
  const LOGO = `<a class="logo" href="${ROOT}index.html" aria-label="Amani Tech home"><svg class="logo-mark" viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#0B2545"/><path d="M10 26 18 9l8 17" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13.5 20h9" stroke="#0E9F6E" stroke-width="3" stroke-linecap="round"/></svg><span>Amani<em>Tech</em></span></a>`;

  function renderHeader() {
    const page = document.body.dataset.page;
    const items = NAV.map(n => n ? `<li><a href="${ROOT}${n[0]}" class="${page === n[2] ? 'is-active' : ''}">${n[1]}</a></li>`
      : `<li class="has-dropdown"><button type="button" aria-expanded="false" aria-haspopup="true">Resources ${icon('chevron')}</button><div class="dropdown">${RESOURCES.map(r => `<a href="${ROOT}${r[0]}">${r[1]}<small>${r[2]}</small></a>`).join('')}</div></li>`).join('');
    const mobileItems = NAV.map(n => n ? `<li><a href="${ROOT}${n[0]}" class="${page === n[2] ? 'is-active' : ''}">${n[1]}</a></li>`
      : `<li><a href="#" data-sub-toggle>Resources ${icon('chevron', 'icon-sm')}</a><ul class="sub">${RESOURCES.map(r => `<li><a href="${ROOT}${r[0]}">${r[1]}</a></li>`).join('')}</ul></li>`).join('');
    const h = document.createElement('header');
    h.className = 'site-header';
    h.innerHTML = `<div class="container header-inner">${LOGO}
      <nav class="nav" aria-label="Main"><ul>${items}</ul></nav>
      <div class="header-actions">
        <a class="btn btn-ghost btn-sm" href="${ROOT}login.html">Candidate Login</a>
        <a class="btn btn-primary btn-sm" href="${ROOT}register.html">Register</a>
        <a class="btn btn-outline btn-sm" href="${ROOT}employers.html#request-talent">Request Talent</a>
      </div>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded="false">${icon('menu')}</button>
    </div>
    <div class="mobile-nav" id="mobile-nav" aria-hidden="true"><div class="backdrop" data-close></div>
      <div class="panel" role="dialog" aria-label="Menu"><div class="panel-head">${LOGO}<button class="close-btn" type="button" aria-label="Close menu" data-close>${icon('x')}</button></div>
      <ul>${mobileItems}</ul>
      <div class="panel-foot"><a class="btn btn-primary" href="${ROOT}register.html">Register as a candidate</a><a class="btn btn-outline" href="${ROOT}employers.html#request-talent">Request Talent</a><a class="btn btn-ghost" href="${ROOT}login.html">Candidate Login</a></div></div></div>`;
    document.body.prepend(h);
    const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = '#main'; skip.textContent = 'Skip to content'; document.body.prepend(skip);

    // Sticky shadow
    const onScroll = () => h.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    // Dropdown
    const dd = $('.has-dropdown', h);
    if (dd) {
      const btn = $('button', dd);
      const set = o => { dd.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o); };
      btn.addEventListener('click', () => set(!dd.classList.contains('is-open')));
      dd.addEventListener('mouseenter', () => set(true)); dd.addEventListener('mouseleave', () => set(false));
      document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    }
    // Mobile
    const mnav = $('#mobile-nav', h), mbtn = $('.menu-btn', h);
    const open = o => { mnav.classList.toggle('is-open', o); mnav.setAttribute('aria-hidden', !o); mbtn.setAttribute('aria-expanded', o); document.body.classList.toggle('modal-open', o); if (o) $('.close-btn', mnav).focus(); };
    mbtn.addEventListener('click', () => open(true));
    $$('[data-close]', mnav).forEach(el => el.addEventListener('click', () => open(false)));
    $$('[data-sub-toggle]', mnav).forEach(a => a.addEventListener('click', e => { e.preventDefault(); a.nextElementSibling.classList.toggle('is-open'); }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) open(false); });
  }

  function renderFooter() {
    const f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML = `<div class="container"><div class="footer-grid">
      <div>${LOGO}<p class="small mt-16" style="max-width:320px">Amani Tech helps job seekers find genuine opportunities and helps employers hire the right people — across IT and non-IT roles.</p>
        <div class="footer-contact">
          <div>${icon('pin')}<span>4th Floor, Tech Park Tower, HITEC City,<br>Hyderabad 500081, India</span></div>
          <div>${icon('phone')}<a href="tel:+914000000000">+91 40 0000 0000</a></div>
          <div>${icon('mail')}<a href="mailto:hello@amanitech.in">hello@amanitech.in</a></div>
          <div>${icon('clock')}<span>Mon–Sat, 9:30 AM – 6:30 PM IST</span></div>
        </div>
        <div class="social"><a href="#" aria-label="LinkedIn">${icon('linkedin')}</a><a href="#" aria-label="Instagram">${icon('instagram')}</a><a href="#" aria-label="X">${icon('twitter')}</a><a href="#" aria-label="YouTube">${icon('youtube')}</a></div>
      </div>
      <div><h4>For job seekers</h4><ul><li><a href="${ROOT}jobs.html">Find Jobs</a></li><li><a href="${ROOT}jobs.html#categories">Browse Categories</a></li><li><a href="${ROOT}register.html">Register</a></li><li><a href="${ROOT}login.html">Candidate Login</a></li><li><a href="${ROOT}blog.html?category=career-advice">Career Advice</a></li><li><a href="${ROOT}faqs.html">FAQs</a></li></ul></div>
      <div><h4>For employers</h4><ul><li><a href="${ROOT}employers.html#request-talent">Request Talent</a></li><li><a href="${ROOT}services.html">Staffing Services</a></li><li><a href="${ROOT}vendor-registration.html">Become a Partner</a></li><li><a href="${ROOT}contact.html">Contact Us</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="${ROOT}about.html">About Amani Tech</a></li><li><a href="${ROOT}careers.html">Careers</a></li><li><a href="${ROOT}blog.html">Blog</a></li><li><a href="${ROOT}write-a-review.html">Write a Review</a></li><li><a href="${ROOT}contact.html">Contact</a></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Amani Tech. All rights reserved.</span><div class="row"><a href="${ROOT}privacy.html">Privacy Policy</a><a href="${ROOT}terms.html">Terms of Use</a><a href="${ROOT}admin/login.html">Admin</a></div></div></div>`;
    document.body.append(f);
    const tw = document.createElement('div'); tw.className = 'toast-wrap'; tw.id = 'toasts'; document.body.append(tw);
  }

  /* ---------- Generic UI ---------- */
  function toast(msg, type = 'ok') {
    const t = document.createElement('div'); t.className = `toast ${type === 'error' ? 'error' : ''}`; t.setAttribute('role', 'status');
    t.innerHTML = `${icon(type === 'error' ? 'alert' : 'check')}<span>${esc(msg)}</span>`;
    $('#toasts').append(t); setTimeout(() => t.remove(), 4000);
  }
  function reveal() {
    const els = $$('.reveal'); if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return; }
    const io = new IntersectionObserver(en => en.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }
  function counters() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('[data-count]').forEach(el => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target.toLocaleString('en-IN') + suffix; return; }
      const io = new IntersectionObserver(en => { if (!en[0].isIntersecting) return; io.disconnect(); const t0 = performance.now();
        const tick = now => { const p = Math.min(1, (now - t0) / 1400), v = Math.round(target * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString('en-IN') + suffix; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      io.observe(el);
    });
  }
  function tabs() {
    $$('[role="tablist"]').forEach(tl => {
      const tabsEls = $$('[role="tab"]', tl);
      tabsEls.forEach(t => t.addEventListener('click', () => {
        tabsEls.forEach(x => { x.setAttribute('aria-selected', x === t); $('#' + x.getAttribute('aria-controls')).classList.toggle('is-active', x === t); });
      }));
    });
  }
  function modal(id) {
    const m = $('#' + id); if (!m) return null;
    const open = () => { m.classList.add('is-open'); document.body.classList.add('modal-open'); m.setAttribute('aria-hidden', 'false'); const f = $('input,select,textarea,button', $('.dialog-body', m) || m); f && f.focus(); };
    const close = () => { m.classList.remove('is-open'); document.body.classList.remove('modal-open'); m.setAttribute('aria-hidden', 'true'); };
    $$('[data-close]', m).forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('is-open')) close(); });
    return { open, close, el: m };
  }

  /* ---------- Forms ---------- */
  const FILE_OK = { resume: ['pdf', 'doc', 'docx'], doc: ['pdf', 'doc', 'docx'], image: ['jpg', 'jpeg', 'png', 'webp'] };
  function setError(field, msg) { field.classList.toggle('is-invalid', !!msg); const e = $('.error-msg', field); if (e) e.textContent = msg || ''; }
  function validateField(input) {
    const field = input.closest('.field'); if (!field) return true;
    const v = (input.value || '').trim();
    if (input.type === 'file') return true; // handled by upload()
    if (input.type === 'checkbox' && input.required && !input.checked) { setError(field, 'Please confirm to continue.'); return false; }
    if (input.required && !v) { setError(field, input.dataset.msg || 'This field is required.'); return false; }
    if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError(field, 'Enter a valid email address.'); return false; }
    if (v && input.type === 'tel' && !/^[+\d][\d\s-]{7,}$/.test(v)) { setError(field, 'Enter a valid phone number.'); return false; }
    if (v && input.dataset.minLen && v.length < +input.dataset.minLen) { setError(field, `Please add at least ${input.dataset.minLen} characters.`); return false; }
    if (v && input.type === 'url' && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(v)) { setError(field, 'Enter a valid website address.'); return false; }
    setError(field, ''); return true;
  }
  function validate(scope) {
    let ok = true, first = null;
    $$('input,select,textarea', scope).forEach(i => { if (i.disabled || i.closest('.form-step:not(.is-active)')) return; if (!validateField(i)) { ok = false; first = first || i; } });
    $$('.upload', scope).forEach(u => { const inp = $('input[type=file]', u); if (inp && inp.required && !u.dataset.file) { setError(u.closest('.field'), 'Please upload a file.'); ok = false; first = first || inp; } });
    if (first) first.focus();
    return ok;
  }
  function upload(u) {
    const inp = $('input[type=file]', u), field = u.closest('.field'), fileRow = $('.upload-file', field), prog = $('.progress', field);
    const kind = u.dataset.kind || 'resume', maxMb = +(u.dataset.max || 5);
    const setFile = f => {
      if (!f) return;
      const ext = f.name.split('.').pop().toLowerCase();
      if (!FILE_OK[kind].includes(ext)) { setError(field, `Unsupported file type. Please upload ${FILE_OK[kind].map(x => x.toUpperCase()).join(', ')}.`); inp.value = ''; return; }
      if (f.size > maxMb * 1024 * 1024) { setError(field, `File is too large. Maximum size is ${maxMb} MB.`); inp.value = ''; return; }
      setError(field, '');
      $('.name', fileRow).textContent = `${f.name} · ${(f.size / 1024).toFixed(0)} KB`;
      // simulate upload progress
      prog.classList.add('is-visible'); const bar = $('span', prog); bar.style.width = '0'; fileRow.classList.remove('is-visible');
      let p = 0; const iv = setInterval(() => { p += 18; bar.style.width = Math.min(100, p) + '%'; if (p >= 100) { clearInterval(iv); prog.classList.remove('is-visible'); fileRow.classList.add('is-visible'); u.dataset.file = f.name; } }, 90);
    };
    inp.addEventListener('change', () => setFile(inp.files[0]));
    ['dragenter', 'dragover'].forEach(ev => u.addEventListener(ev, e => { e.preventDefault(); u.classList.add('is-drag'); }));
    ['dragleave', 'drop'].forEach(ev => u.addEventListener(ev, e => { e.preventDefault(); u.classList.remove('is-drag'); }));
    u.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) { try { inp.files = e.dataTransfer.files; } catch (_) { } setFile(f); } });
    const rm = $('.remove', fileRow); rm && rm.addEventListener('click', () => { inp.value = ''; delete u.dataset.file; fileRow.classList.remove('is-visible'); });
  }
  /* Generic form: validates, shows loading, simulates a request, swaps to success panel.
     Add ?fail=1 to the URL to simulate a server error. */
  function form(el, { onSuccess } = {}) {
    if (!el) return;
    $$('input,select,textarea', el).forEach(i => { i.addEventListener('blur', () => validateField(i)); i.addEventListener('input', () => { if (i.closest('.field.is-invalid')) validateField(i); }); });
    $$('.upload', el).forEach(upload);
    const status = $('.form-status', el);
    el.addEventListener('submit', e => {
      e.preventDefault();
      if (status) status.classList.remove('is-visible');
      if (!validate(el)) return;
      const btn = $('[type=submit]', el); btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy');
        if (param('fail')) { if (status) { status.className = 'form-status error is-visible'; status.innerHTML = `${icon('alert')}<span>${esc(el.dataset.error || "We couldn't submit this right now. Please check your connection and try again.")}</span>`; status.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return; }
        const success = $(el.dataset.success || '.success-panel', el.parentElement) || $(el.dataset.success);
        if (success) { if (!('keep' in el.dataset)) el.hidden = true; success.hidden = false; success.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
        const em = $('[type=email]', el); const slot = success && $('[data-email]', success); if (em && slot) slot.textContent = em.value;
        onSuccess && onSuccess(el);
      }, 1200);
    });
  }
  function stepper(el) {
    const steps = $$('.form-step', el), bars = $$('.stepper span', el); let i = 0;
    const show = n => { i = n; steps.forEach((s, k) => s.classList.toggle('is-active', k === n)); bars.forEach((b, k) => { b.classList.toggle('is-done', k < n); b.classList.toggle('is-active', k === n); }); $('[data-step-label]', el) && ($('[data-step-label]', el).textContent = `Step ${n + 1} of ${steps.length}`); };
    $$('[data-next]', el).forEach(b => b.addEventListener('click', () => { if (validate(steps[i])) show(i + 1); }));
    $$('[data-prev]', el).forEach(b => b.addEventListener('click', () => show(i - 1)));
    show(0);
    return { show };
  }

  /* ---------- Renderers ---------- */
  function jobCard(j) {
    return `<article class="job-card ${j.featured ? 'is-featured' : ''}">
      <div class="top"><div class="co-mark" aria-hidden="true">${esc(initials(j.company))}</div>
        <div><h3><a href="${ROOT}job-detail.html?slug=${j.slug}">${esc(j.title)}</a></h3><div class="co">${esc(j.company)}</div></div>
        <div class="badges">${j.featured ? '<span class="badge badge-featured">Featured</span>' : ''}${daysAgo(j.posted) <= 2 && !j.featured ? '<span class="badge badge-new">New</span>' : ''}</div></div>
      <div class="meta"><span>${icon('pin')}${esc(j.location)}${j.workMode !== 'On-site' && j.workMode !== j.location ? ` · ${esc(j.workMode)}` : ''}</span><span>${icon('briefcase')}${expText(j)}</span><span>${icon('rupee')}${salary(j)}</span><span>${icon('clock')}${esc(j.type)}</span></div>
      <div class="skills">${j.skills.slice(0, 4).map(s => `<span class="tag">${esc(s)}</span>`).join('')}${j.skills.length > 4 ? `<span class="tag">+${j.skills.length - 4}</span>` : ''}</div>
      <div class="foot"><span>Posted ${timeAgo(j.posted)}</span><a class="btn btn-outline btn-sm" href="${ROOT}job-detail.html?slug=${j.slug}">View Job</a></div></article>`;
  }
  const CAT_ICON = { it: 'code', finance: 'rupee', engineering: 'settings', operations: 'layers', sales: 'trend', hr: 'users' };
  function catTile(c, count) {
    return `<a class="cat-tile" href="${ROOT}jobs.html?category=${c.id}"><div class="ico">${icon(CAT_ICON[c.id] || 'briefcase')}</div><div><strong>${esc(c.name)}</strong><small>${count} open ${count === 1 ? 'role' : 'roles'} · ${c.subs.length} specialisations</small></div>${icon('arrow', 'icon-arrow')}</a>`;
  }
  const stars = n => `<div class="stars" aria-label="${n} out of 5 stars">${[1, 2, 3, 4, 5].map(i => `<svg class="icon" viewBox="0 0 24 24" style="opacity:${i <= n ? 1 : .25}">${ICONS.star}</svg>`).join('')}</div>`;
  function tCard(t) {
    return `<div class="t-card">${stars(t.rating)}<blockquote>“${esc(t.review)}”</blockquote><div class="who"><div class="avatar" aria-hidden="true">${esc(initials(t.name))}</div><div><strong>${esc(t.name)}</strong><small>${esc(t.designation)} · ${esc(t.company)}</small></div></div></div>`;
  }
  function blogCard(b, featured = false) {
    return `<article class="card blog-card card-hover ${featured ? 'featured' : ''}"><a class="thumb" href="${ROOT}blog-post.html?slug=${b.slug}" aria-hidden="true" tabindex="-1"><span class="tag">${esc(b.category)}</span></a>
      <div class="body"><h3><a href="${ROOT}blog-post.html?slug=${b.slug}">${esc(b.title)}</a></h3><p>${esc(b.excerpt)}</p><div class="meta"><span>${fmtDate(b.date)}</span><span>·</span><span>${b.readTime} min read</span></div></div></article>`;
  }
  function careerCard(c) {
    return `<article class="card career-card card-hover"><div class="row between"><span class="badge badge-neutral">${esc(c.department)}</span><span class="small muted">Posted ${timeAgo(c.posted)}</span></div>
      <h3><a href="${ROOT}career-detail.html?slug=${c.slug}">${esc(c.position)}</a></h3>
      <div class="meta"><span>${icon('pin')}${esc(c.location)} · ${esc(c.workMode)}</span><span>${icon('briefcase')}${esc(c.experience)}</span></div>
      <p class="muted small" style="margin:0">${esc(c.description)}</p><div><a class="link" href="${ROOT}career-detail.html?slug=${c.slug}">View role ${icon('arrow')}</a></div></article>`;
  }
  function faqItem(f) { return `<details><summary>${esc(f.q)} ${icon('plus')}</summary><p>${esc(f.a)}</p></details>`; }

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = () => {
    const jobs = published();
    $('#cat-tiles').innerHTML = D.categories.filter(c => c.active).sort((a, b) => a.order - b.order).map(c => catTile(c, jobs.filter(j => j.category === c.id).length)).join('');
    const feat = jobs.filter(j => j.featured).slice(0, 6);
    $('#featured-jobs').innerHTML = feat.length ? feat.map(jobCard).join('') : `<div class="empty" style="grid-column:1/-1"><div class="ico">${icon('briefcase')}</div><h3>No featured jobs at the moment</h3><p>Browse all open positions.</p><a class="btn btn-secondary" href="jobs.html">View all jobs</a></div>`;
    $('#testimonials-track').innerHTML = D.testimonials.filter(t => t.status === 'APPROVED' && t.featured).map(tCard).join('');
    $('#blog-preview').innerHTML = D.blogs.slice(0, 3).map(b => blogCard(b)).join('');
    $('#faq-home').innerHTML = D.faqs.slice(0, 6).map(faqItem).join('');
    $('#stats').innerHTML = D.stats.map(s => `<div class="stat"><b data-count="${s.number}" data-suffix="${s.suffix}">0</b><span>${esc(s.label)}</span></div>`).join('');
    const chips = D.industries.map(i => `<span class="chip">${esc(i)}</span>`).join('');
    $('#marquee-track').innerHTML = chips + chips;
    $('#hv-count').textContent = jobs.length;
    $('#hero-search').addEventListener('submit', e => { e.preventDefault(); const q = $('#hero-q').value.trim(), l = $('#hero-l').value.trim(); location.href = `jobs.html?${new URLSearchParams({ ...(q && { q }), ...(l && { location: l }) })}`; });
    carousel($('#testimonials'));
  };

  function carousel(root) {
    if (!root) return; const track = $('.carousel-track', root);
    $$('[data-dir]', root).forEach(b => b.addEventListener('click', () => track.scrollBy({ left: (+b.dataset.dir) * (track.firstElementChild.offsetWidth + 16), behavior: 'smooth' })));
  }

  /* ---- Jobs search ---- */
  pages.jobs = () => {
    const EXP_BANDS = [['0-1', 'Fresher (0–1 yr)', 0, 1], ['1-3', '1–3 years', 1, 3], ['3-5', '3–5 years', 3, 5], ['5-8', '5–8 years', 5, 8], ['8+', '8+ years', 8, 99]];
    const POSTED = [['', 'Any time'], ['1', 'Last 24 hours'], ['3', 'Last 3 days'], ['7', 'Last 7 days'], ['30', 'Last 30 days']];
    const PER_PAGE = 8;
    const state = { q: '', location: '', category: [], sub: [], loc: [], exp: [], salary: '', mode: [], type: [], posted: '', sort: 'relevance', page: 1 };
    const sp = new URLSearchParams(location.search);
    for (const k of Object.keys(state)) if (sp.has(k)) state[k] = Array.isArray(state[k]) ? sp.get(k).split(',').filter(Boolean) : sp.get(k);
    state.page = +state.page || 1;
    const jobs = published();

    // Filter rail
    const counts = (fn) => jobs.filter(fn).length;
    const rail = $('#filters');
    rail.innerHTML = `
      <details class="filter-group" open><summary>Category ${icon('chevron')}</summary><div class="fg-body">${D.categories.filter(c => c.active).map(c => `
        <label class="check"><input type="checkbox" name="category" value="${c.id}"><span>${esc(c.name)}</span><span class="count">${counts(j => j.category === c.id)}</span></label>
        <div class="sub-list" data-cat="${c.id}">${c.subs.map(s => `<label class="check"><input type="checkbox" name="sub" value="${s.id}"><span>${esc(s.name)}</span><span class="count">${counts(j => j.subcategory === s.id)}</span></label>`).join('')}</div>`).join('')}</div></details>
      <details class="filter-group" open><summary>Location ${icon('chevron')}</summary><div class="fg-body">${D.locations.map(l => `<label class="check"><input type="checkbox" name="loc" value="${l}"><span>${l}</span><span class="count">${counts(j => j.location === l)}</span></label>`).join('')}</div></details>
      <details class="filter-group" open><summary>Experience ${icon('chevron')}</summary><div class="fg-body">${EXP_BANDS.map(b => `<label class="check"><input type="checkbox" name="exp" value="${b[0]}"><span>${b[1]}</span></label>`).join('')}</div></details>
      <details class="filter-group"><summary>Salary ${icon('chevron')}</summary><div class="fg-body"><select class="select" name="salary" aria-label="Minimum salary"><option value="">Any salary</option>${[3, 5, 8, 10, 15, 20, 25].map(v => `<option value="${v}">₹${v} LPA and above</option>`).join('')}</select></div></details>
      <details class="filter-group"><summary>Work mode ${icon('chevron')}</summary><div class="fg-body">${['On-site', 'Hybrid', 'Remote'].map(m => `<label class="check"><input type="checkbox" name="mode" value="${m}"><span>${m}</span><span class="count">${counts(j => j.workMode === m)}</span></label>`).join('')}</div></details>
      <details class="filter-group"><summary>Employment type ${icon('chevron')}</summary><div class="fg-body">${['Full-time', 'Contract', 'Part-time', 'Internship'].map(m => `<label class="check"><input type="checkbox" name="type" value="${m}"><span>${m}</span><span class="count">${counts(j => j.type === m)}</span></label>`).join('')}</div></details>
      <details class="filter-group"><summary>Date posted ${icon('chevron')}</summary><div class="fg-body">${POSTED.map(p => `<label class="check"><input type="radio" name="posted" value="${p[0]}"><span>${p[1]}</span></label>`).join('')}</div></details>`;

    const syncInputs = () => {
      $$('input[type=checkbox]', rail).forEach(i => i.checked = state[i.name].includes(i.value));
      $$('input[name=posted]', rail).forEach(i => i.checked = state.posted === i.value);
      $('select[name=salary]', rail).value = state.salary;
      $$('.sub-list', rail).forEach(s => s.classList.toggle('is-open', state.category.includes(s.dataset.cat)));
      $('#q').value = state.q; $('#loc').value = state.location; $('#sort').value = state.sort;
    };
    rail.addEventListener('change', e => {
      const i = e.target; if (!i.name) return;
      if (i.type === 'checkbox') { const arr = state[i.name]; i.checked ? arr.push(i.value) : arr.splice(arr.indexOf(i.value), 1);
        if (i.name === 'category' && !i.checked) { const c = D.categories.find(c => c.id === i.value); state.sub = state.sub.filter(s => !c.subs.some(x => x.id === s)); } }
      else state[i.name] = i.value;
      state.page = 1; run();
    });
    $('#jobs-search').addEventListener('submit', e => { e.preventDefault(); state.q = $('#q').value.trim(); state.location = $('#loc').value.trim(); state.page = 1; run(); });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; state.page = 1; run(); });
    $$('[data-clear]').forEach(b => b.addEventListener('click', () => { Object.assign(state, { q: '', location: '', category: [], sub: [], loc: [], exp: [], salary: '', mode: [], type: [], posted: '', page: 1 }); run(); }));

    // Mobile filter drawer
    const railWrap = $('#filter-rail');
    const openRail = o => { railWrap.classList.toggle('is-open', o); document.body.classList.toggle('modal-open', o && innerWidth < 768); };
    $('#filter-toggle').addEventListener('click', () => openRail(true));
    $$('[data-close-rail]').forEach(b => b.addEventListener('click', () => openRail(false)));
    railWrap.addEventListener('click', e => { if (e.target === railWrap) openRail(false); });

    const apply = () => {
      const q = state.q.toLowerCase(), l = state.location.toLowerCase();
      let out = jobs.filter(j => {
        const hay = [j.title, j.company, j.location, ...j.skills, catName(j.category), subName(j.subcategory)].join(' ').toLowerCase();
        if (q && !q.split(/\s+/).every(w => hay.includes(w))) return false;
        if (l && !(j.location.toLowerCase().includes(l) || (l === 'remote' && j.workMode === 'Remote'))) return false;
        if (state.category.length && !state.category.includes(j.category)) return false;
        if (state.sub.length && !state.sub.includes(j.subcategory)) return false;
        if (state.loc.length && !state.loc.includes(j.location)) return false;
        if (state.exp.length && !state.exp.some(b => { const [, , lo, hi] = EXP_BANDS.find(x => x[0] === b); return j.expMin <= hi && j.expMax >= lo; })) return false;
        if (state.salary && !(j.salaryMax >= +state.salary)) return false;
        if (state.mode.length && !state.mode.includes(j.workMode)) return false;
        if (state.type.length && !state.type.includes(j.type)) return false;
        if (state.posted && daysAgo(j.posted) > +state.posted) return false;
        return true;
      });
      const score = j => (q ? (j.title.toLowerCase().includes(q) ? 3 : 0) + (j.skills.some(s => s.toLowerCase().includes(q)) ? 2 : 0) : 0) + (j.featured ? 1 : 0) - daysAgo(j.posted) / 100;
      if (state.sort === 'newest') out.sort((a, b) => new Date(b.posted) - new Date(a.posted));
      else if (state.sort === 'salary') out.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
      else out.sort((a, b) => score(b) - score(a));
      return out;
    };

    const chips = () => {
      const c = [];
      if (state.q) c.push(['q', '', `“${state.q}”`]); if (state.location) c.push(['location', '', state.location]);
      state.category.forEach(v => c.push(['category', v, catName(v)])); state.sub.forEach(v => c.push(['sub', v, subName(v)]));
      state.loc.forEach(v => c.push(['loc', v, v])); state.exp.forEach(v => c.push(['exp', v, EXP_BANDS.find(x => x[0] === v)[1]]));
      if (state.salary) c.push(['salary', '', `₹${state.salary} LPA+`]); state.mode.forEach(v => c.push(['mode', v, v])); state.type.forEach(v => c.push(['type', v, v]));
      if (state.posted) c.push(['posted', '', POSTED.find(p => p[0] === state.posted)[1]]);
      const el = $('#applied-chips');
      el.innerHTML = c.map(([k, v, label]) => `<span class="chip">${esc(label)}<button type="button" class="chip-remove" data-k="${k}" data-v="${esc(v)}" aria-label="Remove ${esc(label)}">${icon('x', 'icon-sm')}</button></span>`).join('') + (c.length ? `<button type="button" class="chip" data-clear>Clear all</button>` : '');
      $$('.chip-remove', el).forEach(b => b.addEventListener('click', () => { const k = b.dataset.k; Array.isArray(state[k]) ? state[k] = state[k].filter(x => x !== b.dataset.v) : state[k] = ''; if (k === 'category') { const c = D.categories.find(c => c.id === b.dataset.v); state.sub = state.sub.filter(s => !c.subs.some(x => x.id === s)); } state.page = 1; run(); }));
      $$('[data-clear]', el).forEach(b => b.addEventListener('click', () => { Object.assign(state, { q: '', location: '', category: [], sub: [], loc: [], exp: [], salary: '', mode: [], type: [], posted: '', page: 1 }); run(); }));
    };

    let first = true;
    const run = () => {
      syncInputs(); chips();
      const params = new URLSearchParams(); for (const [k, v] of Object.entries(state)) { if (Array.isArray(v) ? v.length : (v && !(k === 'sort' && v === 'relevance') && !(k === 'page' && v === 1))) params.set(k, Array.isArray(v) ? v.join(',') : v); }
      history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : ''));
      const res = $('#results');
      res.innerHTML = Array(first ? 4 : 2).fill(`<div class="skeleton"><div class="sk h-20 w-60"></div><div class="sk w-40"></div><div class="sk w-80"></div><div class="sk w-60"></div></div>`).join('');
      $('#results-count').innerHTML = 'Searching…';
      setTimeout(() => {
        const all = apply(), pages = Math.max(1, Math.ceil(all.length / PER_PAGE)); state.page = Math.min(state.page, pages);
        const slice = all.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
        $('#results-count').innerHTML = `<b>${all.length}</b> ${all.length === 1 ? 'job' : 'jobs'} found${state.q ? ` for <b>“${esc(state.q)}”</b>` : ''}${state.location ? ` in <b>${esc(state.location)}</b>` : ''}`;
        res.innerHTML = slice.length ? slice.map(jobCard).join('') : `<div class="empty"><div class="ico">${icon('search')}</div><h3>No jobs match your search</h3><p>Try fewer filters, a broader location, or browse all categories.</p><button type="button" class="btn btn-secondary" data-clear>Clear filters</button></div>`;
        $$('[data-clear]', res).forEach(b => b.addEventListener('click', () => { Object.assign(state, { q: '', location: '', category: [], sub: [], loc: [], exp: [], salary: '', mode: [], type: [], posted: '', page: 1 }); run(); }));
        const pg = $('#pagination');
        pg.innerHTML = pages > 1 ? `<button type="button" ${state.page === 1 ? 'disabled' : ''} data-p="${state.page - 1}" aria-label="Previous page">‹</button>${Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}" ${state.page === i + 1 ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('')}<button type="button" ${state.page === pages ? 'disabled' : ''} data-p="${state.page + 1}" aria-label="Next page">›</button>` : '';
        $$('button', pg).forEach(b => b.addEventListener('click', () => { state.page = +b.dataset.p; run(); $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
        first = false;
      }, first ? 450 : 180);
    };
    run();
  };

  /* ---- Job detail ---- */
  pages['job-detail'] = () => {
    const j = D.jobs.find(x => x.slug === param('slug')) || D.jobs[0];
    document.title = `${j.title} at ${j.company} — ${j.location} | Amani Tech`;
    const list = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    $('#job-head').innerHTML = `<ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="jobs.html">Jobs</a></li><li><a href="jobs.html?category=${j.category}">${esc(catName(j.category))}</a></li><li aria-current="page">${esc(j.title)}</li></ol>
      <div class="top"><div class="co-mark" aria-hidden="true">${esc(initials(j.company))}</div><div style="flex:1"><div class="row" style="gap:8px;margin-bottom:6px">${j.featured ? '<span class="badge badge-featured">Featured</span>' : ''}<span class="badge badge-neutral">${esc(subName(j.subcategory))}</span></div><h1>${esc(j.title)}</h1><div class="co">${esc(j.company)}</div>
      <div class="meta"><span>${icon('pin')}${esc(j.location)} · ${esc(j.workMode)}</span><span>${icon('briefcase')}${expText(j)}</span><span>${icon('rupee')}${salary(j)}</span><span>${icon('clock')}${esc(j.type)}</span></div>
      <div class="actions"><button type="button" class="btn btn-primary btn-lg" data-apply>Apply Now</button><span class="dates">Posted ${timeAgo(j.posted)} · Apply by ${fmtDate(j.deadline)}</span></div></div></div>`;
    $('#job-body').innerHTML = `<h2>About the role</h2><p>${esc(j.description)}</p><h2>Responsibilities</h2>${list(j.responsibilities)}<h2>Requirements</h2>${list(j.requirements)}<h2>Qualification</h2><p>${esc(j.qualification)}</p><h2>Benefits</h2>${list(j.benefits)}<h2>Skills</h2><div class="row" style="gap:8px">${j.skills.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>`;
    $('#job-overview').innerHTML = `<div><dt>Category</dt><dd>${esc(catName(j.category))}</dd></div><div><dt>Specialisation</dt><dd>${esc(subName(j.subcategory))}</dd></div><div><dt>Experience</dt><dd>${expText(j)}</dd></div><div><dt>Salary</dt><dd>${salary(j)}</dd></div><div><dt>Work mode</dt><dd>${esc(j.workMode)}</dd></div><div><dt>Employment type</dt><dd>${esc(j.type)}</dd></div><div><dt>Job source</dt><dd>${esc(j.source)}</dd></div><div><dt>Apply by</dt><dd>${fmtDate(j.deadline)}</dd></div><div><dt>Job ID</dt><dd>${j.id}</dd></div>`;
    const sim = published().filter(x => x.id !== j.id && (x.subcategory === j.subcategory || x.category === j.category)).slice(0, 4);
    $('#similar').innerHTML = sim.length ? sim.map(s => `<a href="job-detail.html?slug=${s.slug}"><strong>${esc(s.title)}</strong><small>${esc(s.company)} · ${esc(s.location)} · ${salary(s)}</small></a>`).join('') : '<p class="muted small">No similar roles right now.</p>';
    $('#sticky-title').textContent = j.title; $('#sticky-co').textContent = `${j.company} · ${j.location}`;
    // sticky apply appears after header scrolls out
    const sticky = $('#sticky-apply'); const io = new IntersectionObserver(en => sticky.classList.toggle('is-visible', !en[0].isIntersecting)); io.observe($('#job-head'));
    // apply modal
    const m = modal('apply-modal'); $('#apply-job-title').textContent = j.title; $('#apply-job-co').textContent = `${j.company} · ${j.location}`;
    $$('[data-apply]').forEach(b => b.addEventListener('click', m.open));
    const f = $('#apply-form'); const st = stepper(f);
    form(f);
    // populate category selects
    fillCategorySelects(f, j.category, j.subcategory);
    // JSON-LD (demonstrates structured data)
    const ld = { '@context': 'https://schema.org', '@type': 'JobPosting', title: j.title, description: j.description, datePosted: j.posted, validThrough: j.deadline, employmentType: j.type.toUpperCase().replace('-', '_'), hiringOrganization: { '@type': 'Organization', name: j.company }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location, addressCountry: 'IN' } }, baseSalary: j.salaryMin ? { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', minValue: j.salaryMin * 100000, maxValue: j.salaryMax * 100000, unitText: 'YEAR' } } : undefined };
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.append(s);
  };

  function fillCategorySelects(scope, cat, sub) {
    const cs = $('select[name=category]', scope), ss = $('select[name=subcategory]', scope); if (!cs) return;
    cs.innerHTML = '<option value="">Select category</option>' + D.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const fill = () => { const c = D.categories.find(x => x.id === cs.value); ss.innerHTML = '<option value="">Select subcategory</option>' + (c ? c.subs.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('') : ''); ss.disabled = !c; };
    cs.addEventListener('change', fill);
    if (cat) { cs.value = cat; fill(); if (sub) ss.value = sub; } else fill();
  }

  pages.register = () => { const f = $('#register-form'); stepper(f); form(f); fillCategorySelects(f); };
  pages.login = () => form($('#login-form'), { onSuccess: () => location.href = 'candidate-dashboard.html' });
  pages.employers = () => { form($('#employer-form')); if (location.hash === '#request-talent') setTimeout(() => $('#request-talent').scrollIntoView({ behavior: 'smooth' }), 50); $('#emp-faq').innerHTML = D.faqs.filter(f => f.group === 'Employers').map(faqItem).join(''); };
  pages.vendor = () => form($('#vendor-form'));
  pages.contact = () => form($('#contact-form'));
  pages.review = () => {
    const wrap = $('#rating'); const inp = $('#rating-value');
    // reversed DOM order for the hover trick; values 5..1
    wrap.innerHTML = [5, 4, 3, 2, 1].map(v => `<button type="button" data-v="${v}" aria-label="${v} star${v > 1 ? 's' : ''}">${icon('star')}</button>`).join('');
    $$('button', wrap).forEach(b => b.addEventListener('click', () => { inp.value = b.dataset.v; $$('button', wrap).forEach(x => x.classList.toggle('is-on', +x.dataset.v <= +b.dataset.v)); setError(wrap.closest('.field'), ''); }));
    form($('#review-form'));
  };
  pages.faqs = () => {
    const groups = [...new Set(D.faqs.map(f => f.group))];
    $('#faq-groups').innerHTML = groups.map(g => `<section class="faq-group"><h2>${esc(g)}</h2><div class="faq">${D.faqs.filter(f => f.group === g).map(faqItem).join('')}</div></section>`).join('');
  };
  pages.blog = () => {
    const cats = ['All', 'Insights', 'Career Advice', 'Company News'];
    const slug = s => s.toLowerCase().replace(/\s+/g, '-');
    let active = slug(param('category') || 'all');
    const render = () => {
      $('#blog-filters').innerHTML = cats.map(c => `<button type="button" class="chip ${slug(c) === active ? 'is-active' : ''}" data-c="${slug(c)}" aria-pressed="${slug(c) === active}">${c}</button>`).join('');
      $$('button', $('#blog-filters')).forEach(b => b.addEventListener('click', () => { active = b.dataset.c; history.replaceState(null, '', active === 'all' ? 'blog.html' : `blog.html?category=${active}`); render(); }));
      const posts = D.blogs.filter(b => active === 'all' || slug(b.category) === active);
      $('#blog-grid').innerHTML = posts.length ? posts.map((b, i) => blogCard(b, i === 0 && active === 'all' && b.featured)).join('') : `<div class="empty" style="grid-column:1/-1"><div class="ico">${icon('file')}</div><h3>No posts in this category yet</h3><p>Check back soon or browse all posts.</p></div>`;
    };
    render();
  };
  pages['blog-post'] = () => {
    const b = D.blogs.find(x => x.slug === param('slug')) || D.blogs[0];
    document.title = `${b.title} | Amani Tech`;
    $('#post-head').innerHTML = `<span class="tag">${esc(b.category)}</span><h1 class="mt-16">${esc(b.title)}</h1><div class="meta"><span>By ${esc(b.author)}</span><span>·</span><span>${fmtDate(b.date)}</span><span>·</span><span>${b.readTime} min read</span></div>`;
    $('#post-tags').innerHTML = b.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('');
    $('#post-intro').textContent = b.excerpt;
    $('#related').innerHTML = D.blogs.filter(x => x.slug !== b.slug && x.category === b.category).slice(0, 3).map(x => blogCard(x)).join('');
  };
  pages.careers = () => { const o = D.careers.filter(c => c.status === 'PUBLISHED'); $('#openings-grid').innerHTML = o.length ? o.map(careerCard).join('') : `<div class="empty" style="grid-column:1/-1"><div class="ico">${icon('briefcase')}</div><h3>No openings right now</h3><p>Send your resume to careers@amanitech.in and we will keep it on file.</p></div>`; };
  pages['career-detail'] = () => {
    const c = D.careers.find(x => x.slug === param('slug')) || D.careers[0]; document.title = `${c.position} — Careers | Amani Tech`;
    const list = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    $('#opening-head').innerHTML = `<ol class="breadcrumb"><li><a href="index.html">Home</a></li><li><a href="careers.html">Careers</a></li><li aria-current="page">${esc(c.position)}</li></ol><span class="badge badge-neutral">${esc(c.department)}</span><h1 class="mt-16" style="font-size:var(--fs-3xl)">${esc(c.position)}</h1><div class="meta" style="display:flex;flex-wrap:wrap;gap:8px 20px;color:var(--muted);font-size:var(--fs-sm)"><span>${icon('pin', 'icon-sm')} ${esc(c.location)} · ${esc(c.workMode)}</span><span>${icon('briefcase', 'icon-sm')} ${esc(c.experience)}</span><span>${icon('calendar', 'icon-sm')} Posted ${fmtDate(c.posted)}</span></div>`;
    $('#opening-body').innerHTML = `<h2>About the role</h2><p>${esc(c.description)}</p><h2>Responsibilities</h2>${list(c.responsibilities)}<h2>Requirements</h2>${list(c.requirements)}<h2>Benefits</h2>${list(c.benefits)}`;
    $('#how-to-apply').innerHTML = `<h3>How to apply</h3><p class="small">${esc(c.howToApply)}</p><a class="btn btn-primary btn-block" href="mailto:careers@amanitech.in?subject=${encodeURIComponent(c.position)}">Email your application</a>`;
  };
  pages['service-detail'] = () => {
    const s = D.services.find(x => x.slug === param('s')) || D.services[0]; document.title = `${s.title} | Amani Tech`;
    $('#svc-title').textContent = s.title; $('#svc-short').textContent = s.short; $('#svc-crumb').textContent = s.title;
    $('#svc-related').innerHTML = D.services.filter(x => x.slug !== s.slug).slice(0, 3).map(x => `<a class="cat-tile" href="service-detail.html?s=${x.slug}"><div class="ico">${icon(x.icon)}</div><div><strong>${esc(x.title)}</strong><small>${esc(x.short.slice(0, 60))}…</small></div>${icon('arrow', 'icon-arrow')}</a>`).join('');
    const roles = { 'it-staffing': D.categories[0].subs.map(x => x.name), 'non-it-staffing': ['Accounting', 'Financial Analysis', 'Mechanical', 'Electrical', 'Procurement', 'Logistics', 'Inside Sales', 'HR Operations'], 'contract-staffing': ['Developers', 'QA', 'Site engineers', 'Support staff', 'Analysts'], 'permanent-recruitment': ['Leadership', 'Specialists', 'Managers', 'Individual contributors'], 'bulk-project-hiring': ['Sales teams', 'Plant staff', 'Support centres', 'Field engineers'], 'fresher-hiring': ['Graduate engineers', 'Trainee analysts', 'Associate recruiters', 'Sales trainees'] };
    $('#svc-roles').innerHTML = (roles[s.slug] || []).map(r => `<span class="chip">${esc(r)}</span>`).join('');
  };
  pages.services = () => { $('#service-grid').innerHTML = D.services.map(s => `<article class="card service-card card-hover"><div class="ico">${icon(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.short)}</p><a class="link" href="service-detail.html?s=${s.slug}">Learn more ${icon('arrow')}</a></article>`).join(''); };
  pages.dashboard = () => {
    const apps = [{ job: D.jobs[2], date: '2026-09-15T10:24:00', status: 'SUBMITTED' }, { job: D.jobs[11], date: '2026-09-09T14:00:00', status: 'REVIEWING' }, { job: D.jobs[0], date: '2026-08-28T09:30:00', status: 'SHORTLISTED' }];
    $('#my-apps').innerHTML = apps.map(a => `<tr><td><a href="job-detail.html?slug=${a.job.slug}">${esc(a.job.title)}</a><div class="small muted">${esc(a.job.company)}</div></td><td>${esc(a.job.location)}</td><td>${fmtDate(a.date)}</td><td><span class="status status-${a.status}">${a.status.charAt(0) + a.status.slice(1).toLowerCase()}</span></td></tr>`).join('');
    $$('.upload').forEach(upload);
    form($('#profile-form'), { onSuccess: () => toast('Profile updated.') });
  };

  /* ---------- Boot ---------- */
  const icons = (root = document) => $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon, el.dataset.iconClass || ''); el.removeAttribute('data-icon'); });
  document.addEventListener('DOMContentLoaded', () => {
    if ('admin' in document.body.dataset) { // admin pages: helpers only, admin.js renders its own chrome
      const tw = document.createElement('div'); tw.className = 'toast-wrap'; tw.id = 'toasts'; document.body.append(tw); tabs(); icons(); return;
    }
    renderHeader(); renderFooter(); tabs();
    const mod = document.body.dataset.module || document.body.dataset.page;
    pages[mod] && pages[mod]();
    if ($('#service-grid') && mod !== 'services') pages.services();
    reveal(); counters(); icons();
  });
  window.AT = { icon, icons, toast, modal, form, stepper, upload, validate, setError, fillCategorySelects, esc, fmtDate, timeAgo, salary, expText, catName, subName, initials, stars, $, $$ };
})();
