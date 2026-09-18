/* Amani Tech prototype — admin behaviour. Requires data.js + app.js (helpers via window.AT). */
(function () {
  'use strict';
  const D = window.AT_DATA, A = window.AT;
  const { $, $$, esc, icon, toast, fmtDate } = A;
  const ROOT = '../';
  const jobById = id => D.jobs.find(j => j.id === id) || {};
  const fmtDT = iso => { const d = new Date(iso); return `${fmtDate(iso)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const label = s => s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ');
  const statusBadge = s => `<span class="status status-${s}">${label(s)}</span>`;

  /* ---------- Chrome ---------- */
  const NAV = [
    { g: '' }, ['index.html', 'Dashboard', 'home', 'dashboard'],
    { g: 'Recruitment' },
    ['jobs.html', 'Jobs', 'briefcase', 'jobs', [['jobs.html', 'All Jobs', 'jobs'], ['job-form.html', 'Create Job', 'job-form'], ['categories.html', 'Categories', 'categories']]],
    ['applications.html', 'Applications', 'file', 'applications', null, D.applications.filter(a => a.status === 'SUBMITTED').length],
    ['candidates.html', 'Candidates', 'users', 'candidates'],
    { g: 'Leads' },
    ['employers.html', 'Employers', 'building', 'employers', null, D.employerEnquiries.filter(e => e.status === 'NEW').length],
    ['vendors.html', 'Vendors', 'globe', 'vendors', null, D.vendorEnquiries.filter(v => v.status === 'PENDING').length],
    { g: 'Content' },
    ['testimonials.html', 'Testimonials', 'star', 'testimonials', null, D.testimonials.filter(t => t.status === 'PENDING').length],
    ['blog.html', 'Blog', 'message', 'blog'],
    ['careers.html', 'Careers', 'graduation', 'careers'],
    ['cms.html', 'Website CMS', 'grid', 'cms', [['cms.html#hero', 'Hero', 'cms'], ['cms.html#trust', 'Trust Band', 'cms'], ['cms.html#services', 'Services', 'cms'], ['cms.html#stats', 'Statistics', 'cms'], ['cms.html#faq', 'FAQ', 'cms'], ['cms.html#footer', 'Footer', 'cms']]],
    { g: 'System' },
    ['settings.html', 'Settings', 'settings', 'settings']
  ];
  function chrome() {
    const page = document.body.dataset.page, title = document.body.dataset.title || 'Dashboard';
    const side = document.createElement('aside'); side.className = 'a-side'; side.id = 'a-side';
    side.innerHTML = `<a class="brand" href="index.html"><svg class="logo-mark" viewBox="0 0 36 36" aria-hidden="true"><rect width="36" height="36" rx="9" fill="#0E9F6E"/><path d="M10 26 18 9l8 17" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13.5 20h9" stroke="#0F172A" stroke-width="3" stroke-linecap="round"/></svg><span>Amani Tech<small>Admin</small></span></a>
      <nav class="a-nav" aria-label="Admin">${NAV.map(n => n.g !== undefined ? (n.g ? `<div class="group">${n.g}</div>` : '') : `<a href="${n[0]}" class="${page === n[3] || (n[4] && n[4].some(s => s[2] === page)) ? 'is-active' : ''}">${icon(n[2])}${n[1]}${n[5] ? `<span class="count">${n[5]}</span>` : ''}</a>${n[4] && (page === n[3] || n[4].some(s => s[2] === page)) ? `<div class="sub">${n[4].map(s => `<a href="${s[0]}">${s[1]}</a>`).join('')}</div>` : ''}`).join('')}</nav>
      <div class="foot"><div class="avatar">AK</div><div><strong>Admin User</strong><small>admin@amanitech.in</small></div><a href="login.html" aria-label="Sign out">${icon('external')}</a></div>`;
    const bd = document.createElement('div'); bd.className = 'a-backdrop';
    const top = document.createElement('header'); top.className = 'a-top';
    top.innerHTML = `<button class="menu-btn" type="button" aria-label="Open navigation">${icon('menu')}</button><h1>${esc(title)}</h1>
      <div class="search">${icon('search')}<input type="search" placeholder="Search jobs, candidates, leads…" aria-label="Global search"></div>
      <a class="btn btn-ghost btn-sm view-site" href="${ROOT}index.html" target="_blank">${icon('external')}View site</a>
      <button class="bell" type="button" aria-label="Notifications">${icon('alert')}<span class="dot"></span></button>`;
    const main = $('.a-main'); main.prepend(top); document.body.prepend(bd); document.body.prepend(side);
    const open = o => { side.classList.toggle('is-open', o); bd.classList.toggle('is-open', o); };
    $('.menu-btn', top).addEventListener('click', () => open(true)); bd.addEventListener('click', () => open(false));
    $('.search input', top).addEventListener('keydown', e => { if (e.key === 'Enter') location.href = `jobs.html?q=${encodeURIComponent(e.target.value)}`; });
    $('.bell', top).addEventListener('click', () => toast(`${D.testimonials.filter(t => t.status === 'PENDING').length} testimonials pending · ${D.employerEnquiries.filter(e => e.status === 'NEW').length} new employer leads`));
  }

  /* ---------- Shared UI ---------- */
  function confirm({ title, text, ok = 'Confirm', danger = false }) {
    return new Promise(res => {
      let m = $('#confirm-modal');
      if (!m) { m = document.createElement('div'); m.className = 'modal'; m.id = 'confirm-modal'; m.setAttribute('role', 'alertdialog'); document.body.append(m); }
      m.innerHTML = `<div class="backdrop" data-close></div><div class="dialog"><div class="dialog-head"><div><h2 style="font-size:1.05rem">${esc(title)}</h2></div></div><div class="dialog-body"><p>${esc(text)}</p></div><div class="dialog-foot row" style="justify-content:flex-end"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button><button type="button" class="btn ${danger ? 'btn-secondary' : 'btn-primary'} btn-sm" data-ok style="${danger ? 'background:var(--red-600)' : ''}">${esc(ok)}</button></div></div>`;
      const mm = A.modal('confirm-modal'); $$('[data-close]', m).forEach(b => b.addEventListener('click', () => res(false)));
      $('[data-ok]', m).addEventListener('click', () => { mm.close(); res(true); }); mm.open(); $('[data-ok]', m).focus();
    });
  }
  function drawer(id) {
    const d = $('#' + id); const open = () => { d.classList.add('is-open'); document.body.classList.add('modal-open'); }; const close = () => { d.classList.remove('is-open'); document.body.classList.remove('modal-open'); };
    $$('[data-close]', d).forEach(b => b.addEventListener('click', close)); document.addEventListener('keydown', e => e.key === 'Escape' && close());
    return { open, close, el: d };
  }
  function csv(rows, filename) {
    if (!rows.length) return toast('Nothing to export.', 'error');
    const head = Object.keys(rows[0]); const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const blob = new Blob(['﻿' + [head.join(','), ...rows.map(r => head.map(h => q(r[h])).join(','))].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
    toast(`Exported ${rows.length} rows to ${filename}`);
  }
  function menus(root) {
    $$('.menu > button', root).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const m = b.parentElement; const was = m.classList.contains('is-open'); $$('.menu.is-open').forEach(x => x.classList.remove('is-open')); m.classList.toggle('is-open', !was); }));
    document.addEventListener('click', () => $$('.menu.is-open').forEach(x => x.classList.remove('is-open')));
  }
  const empty = (t, s) => `<div class="a-empty"><div class="ico">${icon('search')}</div><strong>${esc(t)}</strong>${esc(s)}</div>`;
  const tagInput = el => {
    const input = $('input', el), get = () => $$('.tag', el).map(t => t.dataset.v);
    const add = v => { v = v.trim(); if (!v || get().includes(v)) return; const t = document.createElement('span'); t.className = 'tag'; t.dataset.v = v; t.innerHTML = `${esc(v)}<button type="button" aria-label="Remove ${esc(v)}">${icon('x', 'icon-sm')}</button>`; $('button', t).addEventListener('click', () => t.remove()); el.insertBefore(t, input); };
    input.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input.value); input.value = ''; } if (e.key === 'Backspace' && !input.value) { const last = $$('.tag', el).pop(); last && last.remove(); } });
    (el.dataset.values || '').split('|').filter(Boolean).forEach(add);
    return { get, add };
  };
  const unsavedGuard = form => { const u = $('.unsaved'); if (!u) return; form.addEventListener('input', () => u.classList.add('is-visible')); form.addEventListener('submit', () => u.classList.remove('is-visible')); };

  /* ---------- Pages ---------- */
  const pages = {};

  pages.dashboard = () => {
    const pubJobs = D.jobs.filter(j => j.status === 'PUBLISHED').length;
    $('#stats').innerHTML = [
      ['jobs.html', 'briefcase', '', pubJobs, 'Active jobs'], ['applications.html', 'file', 'green', D.applications.length, 'Total applications'], ['candidates.html', 'users', 'blue', D.candidates.length, 'Total candidates'], ['testimonials.html', 'star', 'amber', D.testimonials.filter(t => t.status === 'PENDING').length, 'Pending testimonials'],
      ['employers.html', 'building', '', D.employerEnquiries.length, 'Employer enquiries'], ['vendors.html', 'globe', '', D.vendorEnquiries.length, 'Vendor enquiries'], ['blog.html', 'message', '', D.blogs.filter(b => b.status === 'PUBLISHED').length, 'Published blogs'], ['careers.html', 'graduation', '', D.careers.filter(c => c.status === 'PUBLISHED').length, 'Career openings']
    ].map(s => `<a class="a-stat" href="${s[0]}"><div class="ico ${s[2]}">${icon(s[1])}</div><div><b>${s[3]}</b><span>${s[4]}</span></div></a>`).join('');
    $('#recent-apps').innerHTML = D.applications.slice(0, 5).map(a => `<tr><td><span class="primary">${esc(a.name)}</span><span class="sub">${esc(a.title)}</span></td><td>${esc(jobById(a.job).title || '')}</td><td class="nowrap">${fmtDate(a.date)}</td><td>${statusBadge(a.status)}</td></tr>`).join('');
    $('#recent-emp').innerHTML = D.employerEnquiries.slice(0, 5).map(e => `<tr><td><span class="primary">${esc(e.company)}</span><span class="sub">${esc(e.name)} · ${esc(e.designation)}</span></td><td>${esc(e.title)} × ${e.positions}</td><td>${statusBadge(e.status)}</td></tr>`).join('');
    $('#pending-t').innerHTML = D.testimonials.filter(t => t.status === 'PENDING').map(t => `<tr><td><span class="primary">${esc(t.name)}</span><span class="sub">${esc(t.designation)} · ${esc(t.company)}</span></td><td><span class="rating-sm">${A.stars(t.rating).replace('class="stars"', 'class="rating-sm"')}</span></td><td><a class="btn btn-sm btn-outline" href="testimonials.html">Review</a></td></tr>`).join('') || `<tr><td colspan="3" class="muted">No pending testimonials.</td></tr>`;
    $('#recent-jobs').innerHTML = D.jobs.slice(0, 5).map(j => `<tr><td><span class="primary">${esc(j.title)}</span><span class="sub">${esc(j.company)} · ${esc(j.location)}</span></td><td>${D.applications.filter(a => a.job === j.id).length}</td><td>${statusBadge(j.status)}</td></tr>`).join('');
  };

  pages.jobs = () => {
    const state = { q: new URLSearchParams(location.search).get('q') || '', status: '', cat: '' };
    $('#q').value = state.q;
    $('#f-cat').innerHTML = '<option value="">All categories</option>' + D.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const render = () => {
      const rows = D.jobs.filter(j => (!state.q || [j.title, j.company, j.location, j.id].join(' ').toLowerCase().includes(state.q.toLowerCase())) && (!state.status || j.status === state.status) && (!state.cat || j.category === state.cat));
      $('#count').textContent = `${rows.length} of ${D.jobs.length} jobs`;
      $('#rows').innerHTML = rows.length ? rows.map(j => `<tr data-id="${j.id}"><td><input class="row-check" type="checkbox" aria-label="Select ${esc(j.title)}"></td><td><a class="primary" href="job-form.html?id=${j.id}">${esc(j.title)}</a><span class="sub">${esc(j.company)} · ${j.id}</span></td><td>${esc(A.catName(j.category))}<span class="sub">${esc(A.subName(j.subcategory))}</span></td><td>${esc(j.location)}<span class="sub">${esc(j.workMode)}</span></td><td class="num">${D.applications.filter(a => a.job === j.id).length}</td><td>${j.featured ? '<span class="badge badge-featured">Featured</span>' : '—'}</td><td>${statusBadge(j.status)}</td><td><span class="sub">${fmtDate(j.posted)}</span></td>
        <td><div class="actions"><a class="icon-btn" href="${ROOT}job-detail.html?slug=${j.slug}" target="_blank" aria-label="View">${icon('eye')}</a><a class="icon-btn" href="job-form.html?id=${j.id}" aria-label="Edit">${icon('settings')}</a><div class="menu"><button class="icon-btn" type="button" aria-label="More actions">${icon('sliders')}</button><div class="menu-list">
          ${j.status !== 'PUBLISHED' ? `<button data-act="PUBLISHED">${icon('check')}Publish</button>` : `<button data-act="DRAFT">${icon('eye')}Unpublish</button>`}
          ${j.status === 'PUBLISHED' ? `<button data-act="PAUSED">${icon('clock')}Pause</button>` : ''}${j.status === 'PAUSED' ? `<button data-act="PUBLISHED">${icon('zap')}Resume</button>` : ''}
          ${j.status !== 'CLOSED' ? `<button data-act="CLOSED">${icon('x')}Close job</button>` : ''}
          <button data-act="feature">${icon('star')}${j.featured ? 'Remove from featured' : 'Feature job'}</button><hr><button class="danger" data-act="delete">${icon('x')}Delete</button></div></div></div></td></tr>`).join('') : `<tr><td colspan="9">${empty('No jobs match', 'Try a different search or clear the filters.')}</td></tr>`;
      menus($('#rows'));
      $$('[data-act]', $('#rows')).forEach(b => b.addEventListener('click', async () => {
        const j = jobById(b.closest('tr').dataset.id), act = b.dataset.act;
        if (act === 'delete') { if (!await confirm({ title: 'Delete this job?', text: `“${j.title}” will be archived and removed from the site. Applications are kept.`, ok: 'Delete', danger: true })) return; j.status = 'ARCHIVED'; toast('Job archived.'); }
        else if (act === 'feature') { j.featured = !j.featured; toast(j.featured ? 'Job featured on homepage.' : 'Removed from featured.'); }
        else if (act === 'CLOSED') { if (!await confirm({ title: 'Close this job?', text: 'Candidates will no longer be able to apply. You can reopen it later.', ok: 'Close job' })) return; j.status = 'CLOSED'; toast('Job closed.'); }
        else { j.status = act; toast(act === 'PUBLISHED' ? 'Job published.' : act === 'PAUSED' ? 'Job paused.' : 'Job unpublished (saved as draft).'); }
        render();
      }));
    };
    $('#q').addEventListener('input', e => { state.q = e.target.value; render(); });
    $('#f-status').addEventListener('change', e => { state.status = e.target.value; render(); });
    $('#f-cat').addEventListener('change', e => { state.cat = e.target.value; render(); });
    $('#export').addEventListener('click', () => csv(D.jobs.map(j => ({ ID: j.id, Title: j.title, Company: j.company, Category: A.catName(j.category), Subcategory: A.subName(j.subcategory), Location: j.location, 'Work Mode': j.workMode, Type: j.type, 'Experience': A.expText(j), Salary: A.salary(j), Status: j.status, Featured: j.featured ? 'Yes' : 'No', Posted: j.posted, Deadline: j.deadline })), 'amani-jobs.csv'));
    render();
  };

  pages['job-form'] = () => {
    const id = new URLSearchParams(location.search).get('id'), j = id ? jobById(id) : null;
    const f = $('#job-form');
    if (j) { $('.a-top h1').textContent = 'Edit Job'; $('#form-title').textContent = j.title; $('#form-sub').textContent = `${j.id} · ${label(j.status)}`; $('#status-badge').innerHTML = statusBadge(j.status);
      const set = (n, v) => { const el = f.elements[n]; if (el) el.value = v; };
      set('title', j.title); set('company', j.company); set('location', j.location); set('expMin', j.expMin); set('expMax', j.expMax); set('salaryMin', j.salaryMin); set('salaryMax', j.salaryMax); set('workMode', j.workMode); set('type', j.type); set('qualification', j.qualification); set('description', j.description); set('responsibilities', j.responsibilities.join('\n')); set('requirements', j.requirements.join('\n')); set('benefits', j.benefits.join('\n')); set('source', j.source); set('deadline', j.deadline); f.elements.featured.checked = j.featured;
      $('.tag-input').dataset.values = j.skills.join('|');
    } else { $('#status-badge').innerHTML = statusBadge('DRAFT'); }
    A.fillCategorySelects(f, j && j.category, j && j.subcategory);
    const skills = tagInput($('.tag-input'));
    unsavedGuard(f);
    $$('input,select,textarea', f).forEach(i => { i.addEventListener('blur', () => A.validate && A.setError && (i.closest('.field') && validateOne(i))); });
    const validateOne = i => { const fld = i.closest('.field'); if (i.required && !i.value.trim()) { A.setError(fld, 'This field is required.'); return false; } A.setError(fld, ''); return true; };
    const save = status => {
      let ok = true; $$('[required]', f).forEach(i => { if (!validateOne(i)) ok = false; });
      if (status === 'PUBLISHED' && skills.get().length === 0) { A.setError($('.tag-input').closest('.field'), 'Add at least one skill before publishing.'); ok = false; } else A.setError($('.tag-input').closest('.field'), '');
      if (!ok) { toast('Please fix the highlighted fields.', 'error'); $('.field.is-invalid') && $('.field.is-invalid').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      const btn = status === 'PUBLISHED' ? $('#publish') : $('#save-draft'); btn.classList.add('is-loading');
      setTimeout(() => { btn.classList.remove('is-loading'); $('#status-badge').innerHTML = statusBadge(status); $('.unsaved').classList.remove('is-visible'); toast(status === 'PUBLISHED' ? 'Job published. It is now live on the site.' : 'Draft saved.'); if (j) j.status = status; }, 900);
    };
    $('#save-draft').addEventListener('click', () => save('DRAFT'));
    $('#publish').addEventListener('click', () => save('PUBLISHED'));
    f.addEventListener('submit', e => { e.preventDefault(); save('DRAFT'); });
    $('#preview').addEventListener('click', () => window.open(`${ROOT}job-detail.html?slug=${j ? j.slug : D.jobs[0].slug}`, '_blank'));
  };

  pages.categories = () => {
    const render = () => {
      $('#cat-list').innerHTML = D.categories.sort((a, b) => a.order - b.order).map((c, i) => `<li class="${c.active ? '' : 'is-inactive'}" data-id="${c.id}"><span class="handle">${icon('menu')}</span><div style="flex:1"><div class="row between" style="gap:8px"><span class="name">${esc(c.name)}</span><span class="sub small muted">${D.jobs.filter(j => j.category === c.id).length} jobs · ${c.subs.length} subcategories</span></div>
        <ul class="sub-list">${c.subs.map(s => `<li data-sub="${s.id}"><span class="name">${esc(s.name)}</span><span class="small muted">${D.jobs.filter(j => j.subcategory === s.id).length} jobs</span><button class="icon-btn" type="button" data-edit-sub aria-label="Rename">${icon('settings')}</button><button class="icon-btn danger" type="button" data-del-sub aria-label="Delete">${icon('x')}</button></li>`).join('')}
        <li><button type="button" class="btn btn-ghost btn-sm" data-add-sub>${icon('plus')}Add subcategory</button></li></ul></div>
        <div class="actions"><button class="icon-btn" type="button" data-up ${i === 0 ? 'disabled' : ''} aria-label="Move up">${icon('chevron')}</button><button class="icon-btn" type="button" data-down ${i === D.categories.length - 1 ? 'disabled' : ''} aria-label="Move down" style="transform:rotate(180deg)">${icon('chevron')}</button><label class="switch" title="Active"><input type="checkbox" data-active ${c.active ? 'checked' : ''}><span class="track"></span></label><button class="icon-btn" type="button" data-edit aria-label="Rename">${icon('settings')}</button><button class="icon-btn danger" type="button" data-del aria-label="Delete">${icon('x')}</button></div></li>`).join('');
      $$('#cat-list > li').forEach(li => {
        const c = D.categories.find(x => x.id === li.dataset.id);
        $('[data-up]', li).addEventListener('click', () => { const prev = D.categories.find(x => x.order === c.order - 1); if (prev) { prev.order++; c.order--; render(); toast('Order updated.'); } });
        $('[data-down]', li).addEventListener('click', () => { const nx = D.categories.find(x => x.order === c.order + 1); if (nx) { nx.order--; c.order++; render(); toast('Order updated.'); } });
        $('[data-active]', li).addEventListener('change', e => { c.active = e.target.checked; render(); toast(c.active ? `${c.name} activated.` : `${c.name} deactivated — hidden from the site.`); });
        $('[data-edit]', li).addEventListener('click', () => { const n = prompt('Rename category', c.name); if (n) { c.name = n; render(); toast('Category renamed.'); } });
        $('[data-del]', li).addEventListener('click', async () => { const n = D.jobs.filter(j => j.category === c.id).length; if (n) return toast(`Cannot delete: ${n} jobs use this category. Deactivate it instead.`, 'error'); if (await confirm({ title: 'Delete category?', text: `“${c.name}” and its subcategories will be removed.`, ok: 'Delete', danger: true })) { D.categories.splice(D.categories.indexOf(c), 1); render(); toast('Category deleted.'); } });
        $('[data-add-sub]', li).addEventListener('click', () => { const n = prompt('New subcategory name'); if (n) { c.subs.push({ id: n.toLowerCase().replace(/\W+/g, '-'), name: n }); render(); toast('Subcategory added.'); } });
        $$('[data-edit-sub]', li).forEach(b => b.addEventListener('click', () => { const s = c.subs.find(x => x.id === b.closest('li').dataset.sub); const n = prompt('Rename subcategory', s.name); if (n) { s.name = n; render(); toast('Subcategory renamed.'); } }));
        $$('[data-del-sub]', li).forEach(b => b.addEventListener('click', async () => { const s = c.subs.find(x => x.id === b.closest('li').dataset.sub); const n = D.jobs.filter(j => j.subcategory === s.id).length; if (n) return toast(`Cannot delete: ${n} jobs use this subcategory.`, 'error'); if (await confirm({ title: 'Delete subcategory?', text: `“${s.name}” will be removed.`, ok: 'Delete', danger: true })) { c.subs.splice(c.subs.indexOf(s), 1); render(); toast('Subcategory deleted.'); } }));
      });
    };
    $('#add-cat').addEventListener('submit', e => { e.preventDefault(); const n = $('#new-cat').value.trim(); if (!n) return; D.categories.push({ id: n.toLowerCase().replace(/\W+/g, '-'), name: n, slug: n.toLowerCase().replace(/\W+/g, '-'), order: D.categories.length + 1, active: true, subs: [] }); $('#new-cat').value = ''; render(); toast('Category created.'); });
    render();
  };

  pages.applications = () => {
    const state = { q: '', status: '', job: '', cat: '' }; const dr = drawer('app-drawer');
    $('#f-job').innerHTML = '<option value="">All jobs</option>' + D.jobs.map(j => `<option value="${j.id}">${esc(j.title)}</option>`).join('');
    $('#f-cat').innerHTML = '<option value="">All categories</option>' + D.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const filtered = () => D.applications.filter(a => (!state.q || [a.name, a.email, a.phone, a.title, a.location].join(' ').toLowerCase().includes(state.q.toLowerCase())) && (!state.status || a.status === state.status) && (!state.job || a.job === state.job) && (!state.cat || a.category === state.cat));
    const open = a => {
      const j = jobById(a.job);
      $('.panel-head h2', dr.el).textContent = a.name; $('.panel-head p', dr.el).textContent = `${a.id} · Applied ${fmtDT(a.date)}`;
      $('.panel-body', dr.el).innerHTML = `<dl class="kv"><div><dt>Email</dt><dd><a href="mailto:${esc(a.email)}">${esc(a.email)}</a></dd></div><div><dt>Phone</dt><dd><a href="tel:${esc(a.phone)}">${esc(a.phone)}</a></dd></div><div><dt>Location</dt><dd>${esc(a.location)}</dd></div><div><dt>Profile type</dt><dd>${esc(a.profile)}</dd></div><div><dt>Category</dt><dd>${esc(A.catName(a.category))}</dd></div><div><dt>Subcategory</dt><dd>${esc(A.subName(a.subcategory))}</dd></div><div><dt>Experience</dt><dd>${a.exp} years</dd></div><div><dt>Current / last title</dt><dd>${esc(a.title)}</dd></div></dl>
        <h4>Applied job</h4><div class="note"><strong>${esc(j.title)}</strong> · ${esc(j.company)}<small>${esc(j.location)} · ${A.salary(j)} · ${j.id}</small></div>
        <h4>Resume</h4><span class="file-chip">${icon('file')}${esc(a.resume)}<button type="button" class="icon-btn" data-dl aria-label="Download resume">${icon('download')}</button></span>
        <h4>Status</h4><select class="select status-select" data-status>${['SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'CLOSED'].map(s => `<option ${a.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
        <h4>Internal note</h4><textarea class="textarea" style="min-height:80px" placeholder="Visible to admins only" data-note></textarea>`;
      $('[data-dl]', dr.el).addEventListener('click', () => toast(`Downloading ${a.resume} (signed URL in production).`));
      $('[data-status]', dr.el).addEventListener('change', e => { a.status = e.target.value; render(); toast(`Status updated to ${label(a.status)}.`); });
      dr.open();
    };
    const render = () => {
      const rows = filtered(); $('#count').textContent = `${rows.length} of ${D.applications.length} applications`;
      $('#rows').innerHTML = rows.length ? rows.map(a => `<tr data-id="${a.id}"><td><span class="primary">${esc(a.name)}</span><span class="sub">${esc(a.email)} · ${esc(a.phone)}</span></td><td>${esc(jobById(a.job).title || '')}<span class="sub">${esc(jobById(a.job).company || '')}</span></td><td>${esc(A.catName(a.category))}<span class="sub">${esc(A.subName(a.subcategory))}</span></td><td>${a.exp} yrs<span class="sub">${esc(a.title)}</span></td><td>${esc(a.location)}</td><td><span class="sub">${fmtDT(a.date)}</span></td><td>${statusBadge(a.status)}</td><td><div class="actions"><button class="icon-btn" type="button" data-view aria-label="View">${icon('eye')}</button><button class="icon-btn" type="button" data-dl aria-label="Download resume">${icon('download')}</button></div></td></tr>`).join('') : `<tr><td colspan="8">${empty('No applications found', 'Try a different search or clear the filters.')}</td></tr>`;
      $$('[data-view]', $('#rows')).forEach(b => b.addEventListener('click', () => open(D.applications.find(a => a.id === b.closest('tr').dataset.id))));
      $$('[data-dl]', $('#rows')).forEach(b => b.addEventListener('click', () => toast('Downloading resume (signed URL in production).')));
    };
    ['q'].forEach(k => $('#q').addEventListener('input', e => { state.q = e.target.value; render(); }));
    $('#f-status').addEventListener('change', e => { state.status = e.target.value; render(); }); $('#f-job').addEventListener('change', e => { state.job = e.target.value; render(); }); $('#f-cat').addEventListener('change', e => { state.cat = e.target.value; render(); });
    $('#export').addEventListener('click', () => csv(filtered().map(a => ({ Name: a.name, Email: a.email, Phone: a.phone, Location: a.location, Category: A.catName(a.category), Subcategory: A.subName(a.subcategory), Experience: a.exp, 'Current Job Title': a.title, 'Applied Job': jobById(a.job).title, 'Application Date': fmtDT(a.date), Status: a.status })), 'amani-applications.csv'));
    render();
  };

  pages.candidates = () => {
    const state = { q: '', cat: '' };
    $('#f-cat').innerHTML = '<option value="">All categories</option>' + D.categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const filtered = () => D.candidates.filter(c => (!state.q || [c.name, c.email, c.phone, c.title, c.location].join(' ').toLowerCase().includes(state.q.toLowerCase())) && (!state.cat || c.category === state.cat));
    const render = () => { const rows = filtered(); $('#count').textContent = `${rows.length} candidates`; $('#rows').innerHTML = rows.length ? rows.map(c => `<tr><td><span class="primary">${esc(c.name)}</span><span class="sub">${esc(c.email)}</span></td><td>${esc(c.phone)}</td><td>${esc(c.location)}</td><td>${esc(c.profile)}<span class="sub">${esc(A.catName(c.category))} · ${esc(A.subName(c.subcategory))}</span></td><td>${c.exp} yrs<span class="sub">${esc(c.title)}</span></td><td class="num">${c.applications}</td><td><span class="sub">${fmtDate(c.registered)}</span></td><td><div class="actions"><a class="icon-btn" href="applications.html?q=${encodeURIComponent(c.email)}" aria-label="View applications">${icon('file')}</a><button class="icon-btn" type="button" data-dl aria-label="Download resume">${icon('download')}</button></div></td></tr>`).join('') : `<tr><td colspan="8">${empty('No candidates found', 'Try a different search.')}</td></tr>`; $$('[data-dl]', $('#rows')).forEach(b => b.addEventListener('click', () => toast('Downloading resume (signed URL in production).'))); };
    $('#q').addEventListener('input', e => { state.q = e.target.value; render(); }); $('#f-cat').addEventListener('change', e => { state.cat = e.target.value; render(); });
    $('#export').addEventListener('click', () => csv(filtered().map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, Location: c.location, 'Profile Type': c.profile, Category: A.catName(c.category), Subcategory: A.subName(c.subcategory), Experience: c.exp, 'Current Job Title': c.title, Applications: c.applications, Registered: fmtDate(c.registered) })), 'amani-candidates.csv'));
    render();
  };

  function leadsPage({ list, statuses, drawerId, cols, rowFn, detailFn, exportFn, filename }) {
    const state = { q: '', status: '' }; const dr = drawer(drawerId);
    const filtered = () => list().filter(e => (!state.q || cols(e).join(' ').toLowerCase().includes(state.q.toLowerCase())) && (!state.status || e.status === state.status));
    const open = e => {
      $('.panel-body', dr.el).innerHTML = detailFn(e) + `<h4>Status</h4><select class="select status-select" data-status>${statuses.map(s => `<option value="${s}" ${e.status === s ? 'selected' : ''}>${label(s)}</option>`).join('')}</select>
        <h4>Internal notes</h4><div data-notes>${e.notes.map(n => `<div class="note">${esc(n.text)}<small>${esc(n.by)} · ${fmtDT(n.at)}</small></div>`).join('') || '<p class="small muted">No notes yet.</p>'}</div>
        <div class="row" style="gap:8px;flex-wrap:nowrap;margin-top:8px"><input class="input" placeholder="Add a note…" data-note-input><button type="button" class="btn btn-secondary btn-sm" data-note-add>Add</button></div>`;
      $('[data-status]', dr.el).addEventListener('change', ev => { e.status = ev.target.value; render(); toast(`Status updated to ${label(e.status)}.`); });
      const addNote = () => { const i = $('[data-note-input]', dr.el); if (!i.value.trim()) return; e.notes.unshift({ by: 'Admin User', at: new Date().toISOString(), text: i.value.trim() }); open(e); toast('Note added.'); };
      $('[data-note-add]', dr.el).addEventListener('click', addNote); $('[data-note-input]', dr.el).addEventListener('keydown', ev => ev.key === 'Enter' && addNote());
      $$('[data-approve],[data-reject]', dr.el).forEach(b => b.addEventListener('click', () => { e.status = 'approve' in b.dataset ? 'APPROVED' : 'REJECTED'; render(); open(e); toast(`Partner ${label(e.status).toLowerCase()}.`); }));
      dr.open();
    };
    const render = () => { const rows = filtered(); $('#count').textContent = `${rows.length} of ${list().length}`; $('#rows').innerHTML = rows.length ? rows.map(e => rowFn(e)).join('') : `<tr><td colspan="8">${empty('No records found', 'Try a different search or clear the filters.')}</td></tr>`; $$('[data-view]', $('#rows')).forEach(b => b.addEventListener('click', () => open(list().find(x => x.id === b.closest('tr').dataset.id)))); };
    $('#q').addEventListener('input', e => { state.q = e.target.value; render(); }); $('#f-status').addEventListener('change', e => { state.status = e.target.value; render(); });
    $('#export').addEventListener('click', () => csv(filtered().map(exportFn), filename));
    render();
  }
  pages.employers = () => leadsPage({
    list: () => D.employerEnquiries, statuses: ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'CONVERTED', 'CLOSED'], drawerId: 'lead-drawer', filename: 'amani-employer-enquiries.csv',
    cols: e => [e.company, e.name, e.email, e.title, e.location, e.id],
    rowFn: e => `<tr data-id="${e.id}"><td><span class="primary">${esc(e.company)}</span><span class="sub">${esc(e.name)} · ${esc(e.designation)}</span></td><td>${esc(e.title)}<span class="sub">${e.positions} position${e.positions > 1 ? 's' : ''} · ${esc(e.type)}</span></td><td>${esc(e.location)}<span class="sub">${esc(e.workMode)}</span></td><td>${esc(e.timeline)}</td><td><span class="sub">${fmtDT(e.date)}</span></td><td>${statusBadge(e.status)}</td><td><div class="actions"><button class="icon-btn" type="button" data-view aria-label="View">${icon('eye')}</button><a class="icon-btn" href="mailto:${esc(e.email)}" aria-label="Email">${icon('mail')}</a></div></td></tr>`,
    detailFn: e => { $('.panel-head h2', $('#lead-drawer')).textContent = e.company; $('.panel-head p', $('#lead-drawer')).textContent = `${e.id} · Received ${fmtDT(e.date)}`; return `<dl class="kv"><div><dt>Contact</dt><dd>${esc(e.name)} · ${esc(e.designation)}</dd></div><div><dt>Email</dt><dd><a href="mailto:${esc(e.email)}">${esc(e.email)}</a></dd></div><div><dt>Phone</dt><dd>${esc(e.phone)}</dd></div><div><dt>Requirement type</dt><dd>${esc(e.type)}</dd></div><div><dt>Position</dt><dd>${esc(e.title)} × ${e.positions}</dd></div><div><dt>Location</dt><dd>${esc(e.location)} · ${esc(e.workMode)}</dd></div><div><dt>Experience</dt><dd>${esc(e.experience)}</dd></div><div><dt>Timeline</dt><dd>${esc(e.timeline)}</dd></div></dl><h4>Job description</h4><p class="small">Submitted via the requirement form. Full JD text and any uploaded file appear here.</p><span class="file-chip">${icon('file')}JD-${e.id}.pdf<button type="button" class="icon-btn" aria-label="Download">${icon('download')}</button></span>`; },
    exportFn: e => ({ ID: e.id, Company: e.company, Contact: e.name, Designation: e.designation, Email: e.email, Phone: e.phone, 'Requirement Type': e.type, Position: e.title, Positions: e.positions, Location: e.location, 'Work Mode': e.workMode, Experience: e.experience, Timeline: e.timeline, Received: fmtDT(e.date), Status: e.status })
  });
  pages.vendors = () => leadsPage({
    list: () => D.vendorEnquiries, statuses: ['PENDING', 'APPROVED', 'REJECTED'], drawerId: 'lead-drawer', filename: 'amani-vendor-enquiries.csv',
    cols: v => [v.company, v.contact, v.email, v.specialization, v.location, v.id],
    rowFn: v => `<tr data-id="${v.id}"><td><span class="primary">${esc(v.company)}</span><span class="sub">${esc(v.contact)} · ${esc(v.email)}</span></td><td>${v.services.map(s => `<span class="tag">${esc(s)}</span>`).join(' ')}</td><td>${esc(v.specialization)}</td><td>${esc(v.location)}</td><td class="num">${v.years} yrs</td><td><span class="sub">${fmtDT(v.date)}</span></td><td>${statusBadge(v.status)}</td><td><div class="actions"><button class="icon-btn" type="button" data-view aria-label="View">${icon('eye')}</button></div></td></tr>`,
    detailFn: v => { $('.panel-head h2', $('#lead-drawer')).textContent = v.company; $('.panel-head p', $('#lead-drawer')).textContent = `${v.id} · Received ${fmtDT(v.date)}`; return `<dl class="kv"><div><dt>Contact person</dt><dd>${esc(v.contact)}</dd></div><div><dt>Email</dt><dd><a href="mailto:${esc(v.email)}">${esc(v.email)}</a></dd></div><div><dt>Phone</dt><dd>${esc(v.phone)}</dd></div><div><dt>Location</dt><dd>${esc(v.location)}</dd></div><div><dt>Services</dt><dd>${v.services.join(', ')}</dd></div><div><dt>Specialisation</dt><dd>${esc(v.specialization)}</dd></div><div><dt>Years of experience</dt><dd>${v.years}</dd></div><div><dt>Website</dt><dd>${v.website ? `<a href="https://${esc(v.website)}" target="_blank">${esc(v.website)}</a>` : '—'}</dd></div></dl>${v.status === 'PENDING' ? `<div class="row" style="gap:8px"><button type="button" class="btn btn-primary btn-sm" data-approve>${icon('check')}Approve partner</button><button type="button" class="btn btn-outline btn-sm" data-reject>Reject</button></div>` : ''}`; },
    exportFn: v => ({ ID: v.id, Company: v.company, Contact: v.contact, Email: v.email, Phone: v.phone, Location: v.location, Services: v.services.join('; '), Specialisation: v.specialization, 'Years of Experience': v.years, Website: v.website, Received: fmtDT(v.date), Status: v.status })
  });

  pages.testimonials = () => {
    let filter = 'PENDING';
    const render = () => {
      $$('[data-f]').forEach(b => b.classList.toggle('is-active', b.dataset.f === filter));
      const rows = D.testimonials.filter(t => filter === 'ALL' || t.status === filter);
      $('#cards').innerHTML = rows.length ? rows.map(t => `<div class="a-card" data-id="${t.id}"><div class="row between" style="margin-bottom:10px"><div class="row" style="gap:10px"><div class="t-card" style="padding:0;border:0;display:contents"><div class="avatar" style="width:40px;height:40px;border-radius:50%;background:var(--navy-100);color:var(--navy-800);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">${esc(A.initials(t.name))}</div></div><div><strong style="font-size:14px">${esc(t.name)}</strong><div class="small muted">${esc(t.designation)} · ${esc(t.company)}</div></div></div><div class="row" style="gap:8px"><span class="rating-sm">${[1, 2, 3, 4, 5].map(i => `<svg class="icon" viewBox="0 0 24 24" style="opacity:${i <= t.rating ? 1 : .25}"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>`).join('')}</span>${statusBadge(t.status)}${t.featured ? '<span class="badge badge-featured">Featured</span>' : ''}</div></div>
        <p style="font-size:14px;margin:0 0 14px" data-text>${esc(t.review)}</p>
        <div class="row" style="gap:6px">${t.status !== 'APPROVED' ? `<button class="btn btn-primary btn-sm" data-act="APPROVED">${icon('check')}Approve</button>` : ''}${t.status !== 'REJECTED' ? `<button class="btn btn-outline btn-sm" data-act="REJECTED">Reject</button>` : ''}${t.status === 'APPROVED' ? `<button class="btn btn-ghost btn-sm" data-act="feature">${icon('star')}${t.featured ? 'Unfeature' : 'Feature on homepage'}</button>` : ''}<button class="btn btn-ghost btn-sm" data-act="edit">Edit</button><button class="btn btn-ghost btn-sm" data-act="delete" style="color:var(--red-600)">Delete</button></div></div>`).join('') : `<div class="a-card">${empty('Nothing here', filter === 'PENDING' ? 'No testimonials waiting for review.' : 'No testimonials with this status.')}</div>`;
      $$('[data-act]', $('#cards')).forEach(b => b.addEventListener('click', async () => {
        const t = D.testimonials.find(x => x.id === b.closest('[data-id]').dataset.id), act = b.dataset.act;
        if (act === 'delete') { if (!await confirm({ title: 'Delete this testimonial?', text: 'This cannot be undone.', ok: 'Delete', danger: true })) return; D.testimonials.splice(D.testimonials.indexOf(t), 1); toast('Testimonial deleted.'); }
        else if (act === 'feature') { t.featured = !t.featured; toast(t.featured ? 'Now featured on the homepage.' : 'Removed from homepage.'); }
        else if (act === 'edit') { const n = prompt('Edit review text', t.review); if (n) { t.review = n; toast('Testimonial updated.'); } }
        else { t.status = act; if (act === 'REJECTED') t.featured = false; toast(act === 'APPROVED' ? 'Approved — now live on the site.' : 'Rejected.'); }
        render();
      }));
    };
    $$('[data-f]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; render(); }));
    render();
  };

  pages.blog = () => {
    const render = () => { $('#rows').innerHTML = D.blogs.map(b => `<tr data-s="${b.slug}"><td><a class="primary" href="blog-editor.html?slug=${b.slug}">${esc(b.title)}</a><span class="sub">/blog/${b.slug}</span></td><td>${esc(b.category)}</td><td>${esc(b.author)}</td><td><span class="sub">${fmtDate(b.date)}</span></td><td>${b.featured ? '<span class="badge badge-featured">Featured</span>' : '—'}</td><td>${statusBadge(b.status)}</td><td><div class="actions"><a class="icon-btn" href="${ROOT}blog-post.html?slug=${b.slug}" target="_blank" aria-label="Preview">${icon('eye')}</a><a class="icon-btn" href="blog-editor.html?slug=${b.slug}" aria-label="Edit">${icon('settings')}</a><div class="menu"><button class="icon-btn" type="button" aria-label="More">${icon('sliders')}</button><div class="menu-list">${b.status === 'PUBLISHED' ? `<button data-act="UNPUBLISHED">Unpublish</button>` : `<button data-act="PUBLISHED">${icon('check')}Publish</button>`}<button data-act="feature">${icon('star')}${b.featured ? 'Unfeature' : 'Feature'}</button><hr><button class="danger" data-act="delete">Delete</button></div></div></div></td></tr>`).join(''); menus($('#rows'));
      $$('[data-act]', $('#rows')).forEach(x => x.addEventListener('click', async () => { const b = D.blogs.find(y => y.slug === x.closest('tr').dataset.s), act = x.dataset.act; if (act === 'delete') { if (!await confirm({ title: 'Delete this post?', text: `“${b.title}” will be permanently removed.`, ok: 'Delete', danger: true })) return; D.blogs.splice(D.blogs.indexOf(b), 1); toast('Post deleted.'); } else if (act === 'feature') { b.featured = !b.featured; toast(b.featured ? 'Post featured.' : 'Post unfeatured.'); } else { b.status = act; toast(act === 'PUBLISHED' ? 'Post published.' : 'Post unpublished.'); } render(); })); };
    render();
  };
  pages['blog-editor'] = () => {
    const slug = new URLSearchParams(location.search).get('slug'), b = slug && D.blogs.find(x => x.slug === slug); const f = $('#post-form');
    if (b) { $('.a-top h1').textContent = 'Edit Post'; f.elements.title.value = b.title; f.elements.slug.value = b.slug; f.elements.category.value = b.category; f.elements.author.value = b.author; f.elements.excerpt.value = b.excerpt; f.elements.date.value = b.date; f.elements.seoTitle.value = b.title + ' | Amani Tech'; f.elements.seoDesc.value = b.excerpt.slice(0, 155); f.elements.featured.checked = b.featured; $('#status-badge').innerHTML = statusBadge(b.status); $('.tag-input').dataset.values = b.tags.join('|'); f.elements.content.value = `## Start with the reader, not with yourself\n\nMost resumes are written for the person writing them…`; } else $('#status-badge').innerHTML = statusBadge('DRAFT');
    tagInput($('.tag-input')); unsavedGuard(f); $$('.upload', f).forEach(A.upload);
    f.elements.title.addEventListener('input', () => { if (!b) f.elements.slug.value = f.elements.title.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); $('#seo-preview-title').textContent = f.elements.seoTitle.value || (f.elements.title.value + ' | Amani Tech'); });
    f.elements.seoDesc.addEventListener('input', () => { $('#seo-count').textContent = `${f.elements.seoDesc.value.length}/160`; $('#seo-preview-desc').textContent = f.elements.seoDesc.value; });
    $('#seo-preview-title').textContent = f.elements.seoTitle.value || 'Post title | Amani Tech'; $('#seo-preview-desc').textContent = f.elements.seoDesc.value || 'Meta description preview.'; $('#seo-count').textContent = `${f.elements.seoDesc.value.length}/160`;
    $$('.editor-toolbar button').forEach(btn => btn.addEventListener('click', () => { const ta = f.elements.content, w = { B: '**', I: '_', H2: '\n## ', UL: '\n- ', LINK: '[text](https://)' }[btn.dataset.w]; ta.setRangeText(w, ta.selectionStart, ta.selectionEnd, 'end'); ta.focus(); }));
    const save = status => { if (!f.elements.title.value.trim()) { A.setError(f.elements.title.closest('.field'), 'Title is required.'); return; } A.setError(f.elements.title.closest('.field'), ''); const btn = status === 'PUBLISHED' ? $('#publish') : $('#save-draft'); btn.classList.add('is-loading'); setTimeout(() => { btn.classList.remove('is-loading'); $('#status-badge').innerHTML = statusBadge(status); $('.unsaved').classList.remove('is-visible'); if (b) b.status = status; toast(status === 'PUBLISHED' ? 'Post published.' : 'Draft saved.'); }, 900); };
    $('#save-draft').addEventListener('click', () => save('DRAFT')); $('#publish').addEventListener('click', () => save('PUBLISHED')); f.addEventListener('submit', e => { e.preventDefault(); save('DRAFT'); });
    $('#preview').addEventListener('click', () => window.open(`${ROOT}blog-post.html?slug=${b ? b.slug : D.blogs[0].slug}`, '_blank'));
  };

  pages.careers = () => {
    const render = () => { $('#rows').innerHTML = D.careers.map(c => `<tr data-s="${c.slug}"><td><a class="primary" href="career-editor.html?slug=${c.slug}">${esc(c.position)}</a><span class="sub">${esc(c.department)}</span></td><td>${esc(c.location)}<span class="sub">${esc(c.workMode)}</span></td><td>${esc(c.experience)}</td><td><span class="sub">${fmtDate(c.posted)}</span></td><td>${statusBadge(c.status)}</td><td><div class="actions"><a class="icon-btn" href="${ROOT}career-detail.html?slug=${c.slug}" target="_blank" aria-label="Preview">${icon('eye')}</a><a class="icon-btn" href="career-editor.html?slug=${c.slug}" aria-label="Edit">${icon('settings')}</a><div class="menu"><button class="icon-btn" type="button" aria-label="More">${icon('sliders')}</button><div class="menu-list">${c.status === 'PUBLISHED' ? `<button data-act="CLOSED">Close opening</button>` : `<button data-act="PUBLISHED">${icon('check')}Publish</button>`}<hr><button class="danger" data-act="delete">Delete</button></div></div></div></td></tr>`).join(''); menus($('#rows'));
      $$('[data-act]', $('#rows')).forEach(x => x.addEventListener('click', async () => { const c = D.careers.find(y => y.slug === x.closest('tr').dataset.s), act = x.dataset.act; if (act === 'delete') { if (!await confirm({ title: 'Delete this opening?', text: `“${c.position}” will be permanently removed.`, ok: 'Delete', danger: true })) return; D.careers.splice(D.careers.indexOf(c), 1); toast('Opening deleted.'); } else { c.status = act; toast(act === 'PUBLISHED' ? 'Opening published.' : 'Opening closed.'); } render(); })); };
    render();
  };
  pages['career-editor'] = () => {
    const slug = new URLSearchParams(location.search).get('slug'), c = slug && D.careers.find(x => x.slug === slug); const f = $('#career-form');
    if (c) { $('.a-top h1').textContent = 'Edit Opening'; ['position', 'department', 'location', 'workMode', 'experience', 'description', 'howToApply'].forEach(k => f.elements[k].value = c[k]); f.elements.responsibilities.value = c.responsibilities.join('\n'); f.elements.requirements.value = c.requirements.join('\n'); f.elements.benefits.value = c.benefits.join('\n'); $('#status-badge').innerHTML = statusBadge(c.status); } else $('#status-badge').innerHTML = statusBadge('DRAFT');
    unsavedGuard(f);
    const save = status => { let ok = true; $$('[required]', f).forEach(i => { const fld = i.closest('.field'); if (!i.value.trim()) { A.setError(fld, 'This field is required.'); ok = false; } else A.setError(fld, ''); }); if (!ok) return toast('Please fix the highlighted fields.', 'error'); const btn = status === 'PUBLISHED' ? $('#publish') : $('#save-draft'); btn.classList.add('is-loading'); setTimeout(() => { btn.classList.remove('is-loading'); $('#status-badge').innerHTML = statusBadge(status); $('.unsaved').classList.remove('is-visible'); if (c) c.status = status; toast(status === 'PUBLISHED' ? 'Opening published on the careers page.' : 'Draft saved.'); }, 900); };
    $('#save-draft').addEventListener('click', () => save('DRAFT')); $('#publish').addEventListener('click', () => save('PUBLISHED')); f.addEventListener('submit', e => { e.preventDefault(); save('DRAFT'); });
  };

  pages.cms = () => {
    const sections = ['hero', 'trust', 'services', 'stats', 'faq', 'footer'];
    const show = id => { sections.forEach(s => { $('#sec-' + s).hidden = s !== id; $(`[data-sec="${s}"]`).classList.toggle('is-active', s === id); }); history.replaceState(null, '', '#' + id); };
    $$('[data-sec]').forEach(b => b.addEventListener('click', () => show(b.dataset.sec)));
    show(sections.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'hero');
    window.addEventListener('hashchange', () => sections.includes(location.hash.slice(1)) && show(location.hash.slice(1)));
    // Services list
    $('#svc-list').innerHTML = D.services.map((s, i) => `<li><span class="handle">${icon('menu')}</span><span class="name">${esc(s.title)}</span><label class="switch"><input type="checkbox" checked><span class="track"></span></label><button class="icon-btn" type="button" aria-label="Edit" data-edit="${i}">${icon('settings')}</button></li>`).join('');
    $$('[data-edit]', $('#svc-list')).forEach(b => b.addEventListener('click', () => { const s = D.services[+b.dataset.edit]; $('#svc-editor').hidden = false; $('#svc-title').value = s.title; $('#svc-short').value = s.short; $('#svc-editor').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
    $('#stat-list').innerHTML = D.stats.map(s => `<li><span class="handle">${icon('menu')}</span><input class="input" style="width:110px;min-height:36px" value="${s.number}${s.suffix}" aria-label="Number"><input class="input" style="flex:1;min-height:36px" value="${esc(s.label)}" aria-label="Label"><label class="switch"><input type="checkbox" checked><span class="track"></span></label></li>`).join('');
    $('#faq-list').innerHTML = D.faqs.slice(0, 6).map(f => `<li style="align-items:flex-start"><span class="handle" style="margin-top:8px">${icon('menu')}</span><div style="flex:1;display:grid;gap:6px"><input class="input" style="min-height:36px" value="${esc(f.q)}" aria-label="Question"><textarea class="textarea" style="min-height:60px">${esc(f.a)}</textarea></div><button class="icon-btn danger" type="button" aria-label="Remove">${icon('x')}</button></li>`).join('');
    $('#logo-list').innerHTML = D.industries.slice(0, 5).map(i => `<li><span class="handle">${icon('menu')}</span><div style="width:36px;height:24px;border-radius:4px;background:var(--navy-100)"></div><span class="name">${esc(i)} — logo.svg</span><button class="icon-btn danger" type="button" aria-label="Remove">${icon('x')}</button></li>`).join('');
    $$('.upload').forEach(A.upload);
    $$('form[data-cms]').forEach(f => { unsavedGuard(f); f.addEventListener('submit', e => { e.preventDefault(); const btn = $('[type=submit]', f); btn.classList.add('is-loading'); setTimeout(() => { btn.classList.remove('is-loading'); toast(`${f.dataset.cms} saved and live.`); }, 800); }); });
    $$('.sortable .icon-btn.danger').forEach(b => b.addEventListener('click', () => { b.closest('li').remove(); $('.unsaved').classList.add('is-visible'); }));
    $('#hero-heading').addEventListener('input', e => $('#hp-heading').textContent = e.target.value); $('#hero-sub').addEventListener('input', e => $('#hp-sub').textContent = e.target.value); $('#hero-cta').addEventListener('input', e => $('#hp-cta').textContent = e.target.value);
  };

  pages.settings = () => { $$('form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const btn = $('[type=submit]', f); btn.classList.add('is-loading'); setTimeout(() => { btn.classList.remove('is-loading'); toast('Settings saved.'); }, 800); })); };

  pages.login = () => { A.form($('#admin-login'), { onSuccess: () => location.href = 'index.html' }); };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'login') chrome();
    const p = document.body.dataset.page; pages[p] && pages[p]();
    A.icons();
  });
})();
