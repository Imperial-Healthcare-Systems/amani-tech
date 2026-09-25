/**
 * Amani Tech — end-to-end tests for the candidate journey.
 *
 *   npm run test:e2e            headless, against http://localhost:3000
 *   npm run test:e2e -- --show  same, with a visible browser window
 *   BASE_URL=https://… npm run test:e2e
 *
 * Covers: registration (3-step form with a real upload), duplicate email / duplicate phone rejection,
 * sign-in (wrong and right password), the candidate dashboard and profile save, applying to a job,
 * duplicate applications, sign-out, and admin/candidate separation.
 *
 * TEST DATA
 * Everything this run creates is tagged with a unique run id and recorded in `created`. The cleanup at the
 * end deletes exactly those rows and files — never a table, never "everything older than X". It then checks
 * the row counts it measured at the start are back where they were, and fails loudly if they are not, so a
 * broken cleanup can never quietly leave rubbish in a live database.
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, sleep } from './browser.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const SHOW = process.argv.includes('--show');

/* ---------- env ---------- */
const envFile = path.join(HERE, '..', '.env.local');
if (!fs.existsSync(envFile)) { console.error('No web/.env.local — cannot reach Supabase.'); process.exit(1); }
const env = Object.fromEntries(fs.readFileSync(envFile, 'utf8').split('\n')
  .filter(l => /^[A-Z_]+=/.test(l))
  .map(l => { const [k, ...v] = l.split('='); return [k, v.join('=').split(/\s+#/)[0].trim().replace(/^["']|["']$/g, '')]; }));
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

/* ---------- this run's identity ---------- */
const RUN = Date.now().toString(36);
// mailinator.com is a real domain with MX records (Supabase rejects addresses it cannot deliver to) and is
// disposable, so no confirmation mail ever reaches a person. Nothing is read from that inbox.
const T = {
  run: RUN,
  name: `E2E Test ${RUN}`,
  email: `amani.e2e.${RUN}@mailinator.com`,
  email2: `amani.e2e.${RUN}.second@mailinator.com`,
  password: 'E2e@Test12345',
  // 9-prefixed 10-digit numbers that no real candidate will hold; written differently each time on purpose,
  // so the normalisation (last 10 digits) is what gets tested, not the literal string.
  phoneDigits: `9${String(Date.now()).slice(-9)}`,
  location: 'Hyderabad',
};
T.phone = `+91 ${T.phoneDigits.slice(0, 5)} ${T.phoneDigits.slice(5)}`;
T.phoneOtherFormat = `0${T.phoneDigits}`;          // same person, different formatting
T.emailWalkIn = `amani.e2e.${RUN}.walkin@mailinator.com`;
T.phoneWalkIn = `9${String(Date.now() + 313131).slice(-9)}`;
T.phoneSecond = `9${String(Date.now() + 7777).slice(-9)}`;

const created = { authUsers: [], candidateIds: [], applicationIds: [], contactIds: [], storage: { resumes: [], photos: [] } };

/* ---------- tiny test harness ---------- */
const results = [];
let page;
async function test(name, fn) {
  const started = Date.now();
  try { await fn(); results.push({ name, state: 'pass', ms: Date.now() - started }); console.log(`  ✓ ${name} (${Date.now() - started}ms)`); }
  catch (e) {
    if (e?.blocked) { results.push({ name, state: 'blocked', reason: e.message }); console.log(`  ! ${name}\n      BLOCKED: ${e.message}`); return; }
    results.push({ name, state: 'fail', reason: e.message });
    console.log(`  ✗ ${name}\n      ${e.message}`);
    if (page) { const shot = path.join(HERE, `failure-${name.replace(/\W+/g, '-').slice(0, 40)}.png`); await page.screenshot(shot).catch(() => {}); console.log(`      screenshot: ${shot}`); }
  }
}
const blocked = msg => Object.assign(new Error(msg), { blocked: true });
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const assertEq = (a, b, msg) => assert(a === b, `${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
const contains = (hay, needle, msg) => assert(String(hay).toLowerCase().includes(needle.toLowerCase()), `${msg} — "${needle}" not found in: ${String(hay).replace(/\s+/g, ' ').slice(0, 300)}`);

/* ---------- fixtures ---------- */
const resumePath = path.join(HERE, 'fixtures', `resume-${RUN}.pdf`);
function writeFixtures() {
  fs.mkdirSync(path.dirname(resumePath), { recursive: true });
  // Smallest structurally valid PDF; the server checks extension + MIME + size, not the contents.
  fs.writeFileSync(resumePath, '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n');
}

/* ---------- form helpers (the register and apply forms share a 3-step shape) ---------- */
async function fillPersonalStep(p, { name, email, phone, location, password }) {
  await p.fill('#name', name); await p.fill('#email', email);
  await p.fill('#phone', phone); await p.fill('#location', location);
  if (password && await p.exists('#password')) await p.fill('#password', password);   // the apply form has no password
  await p.clickText('button', 'Continue');
}
async function fillProfessionalStep(p) {
  await p.select('#category_id', { index: 1 });
  await sleep(300);                                   // subcategories are populated from the chosen category
  await p.select('#subcategory_id', { index: 1 });
  await p.select('#experience', { index: 2 });
  await p.fill('#current_title', 'QA Engineer');
  await p.clickText('button', 'Continue');
}
/** The profile page will not submit until category, subcategory and experience are chosen. */
async function fillRequiredProfileFields(p) {
  if (!await p.evaluate(`return !!document.querySelector('#category_id')?.value`)) {
    await p.select('#category_id', { index: 1 }); await sleep(300);
    await p.select('#subcategory_id', { index: 1 });
  }
  if (!await p.evaluate(`return !!document.querySelector('#experience')?.value`)) await p.select('#experience', { index: 2 });
}

/** Fill and submit the login form, waiting for it to render first. */
async function signInAs(p, email, password) {
  await p.waitFor(`document.querySelector('#email') && document.querySelector('#password')`, { timeout: 20000, label: 'the login form' });
  await p.fill('#email', email); await p.fill('#password', password);
  await p.clickText('button', 'Sign in', { wait: 2000 });
}

async function fillResumeStep(p) {
  await p.setFile('input[type="file"]', resumePath);
  await p.check('input[name="consent"]');
}

/* ---------- baseline, so cleanup can prove it put everything back ---------- */
const countOf = async table => (await db.from(table).select('*', { count: 'exact', head: true })).count ?? 0;
let baseline;

async function run() {
  console.log(`\nAmani Tech end-to-end tests\n  target : ${BASE}\n  run id : ${RUN}\n  account: ${T.email}\n`);

  const ping = await fetch(BASE, { redirect: 'manual' }).catch(() => null);
  if (!ping) { console.error(`Cannot reach ${BASE}. Start the site first (npm run dev) or set BASE_URL.`); process.exit(1); }

  baseline = { candidates: await countOf('candidates'), applications: await countOf('applications'), contacts: await countOf('contact_messages'), profiles: await countOf('profiles') };
  console.log(`  baseline: ${baseline.candidates} candidates, ${baseline.applications} applications, ${baseline.profiles} profiles\n`);
  writeFixtures();

  page = await launch({ headless: !SHOW });
  const job = await pickPublishedJob();

  console.log('Public pages');
  await test('home page leads with the practices, not a job search, and shows no admin link', async () => {
    await page.goto(`${BASE}/`);
    const header = await page.text('.site-header');
    contains(header, 'Candidates', 'header should offer the Candidates menu');
    contains(header, 'Talk to us', 'header should offer the Talk to us action');
    assertEq(await page.count('a[href^="/admin"]'), 0, 'no admin link may appear on a public page');
    assertEq(await page.count('.hero form[role="search"]'), 0, 'the hero must not carry a job search — that belongs on /candidates');
    assertEq(await page.count('.site-header a[href="/services/it-consulting"]'), 1, 'the Services menu should link Technology Services');
  });

  console.log('\nRegistration');
  await test('a new candidate can register through the 3-step form', async () => {
    await page.goto(`${BASE}/register`);
    await fillPersonalStep(page, T);
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('button', 'Create my profile', { wait: 1500 });
    await page.waitFor(`document.body.innerText.includes('Registration completed') || document.querySelector('.form-status.error')`, { timeout: 25000, label: 'a result from the registration form' });

    const err = await page.text('.form-status.error');
    if (err && /rate limit/i.test(err)) throw blocked(`Supabase refused the signup: "${err.trim()}". Its built-in mailer allows only a couple of confirmation emails per hour. Turn OFF Authentication → Sign In / Providers → Email → "Confirm email", or configure custom SMTP.`);
    assert(!err, `registration failed: ${String(err).trim()}`);

    const { data: cand } = await db.from('candidates').select('*').eq('email', T.email).maybeSingle();
    assert(cand, 'no candidate row was created');
    created.candidateIds.push(cand.id);
    if (cand.resume_path) created.storage.resumes.push(cand.resume_path);
    assertEq(cand.phone_norm, T.phoneDigits, 'the phone should be stored normalised');
    assert(cand.resume_path, 'the resume should have been uploaded');
    assert(cand.user_id, 'the candidate should be linked to a login');
    created.authUsers.push(cand.user_id);
  });

  // Whatever happened above, the rest of the journey needs an account. If the UI path was blocked by the
  // mailer limit, make one directly so sign-in, profile and applications are still tested for real.
  await ensureAccount();

  await test('registering again with the same email is refused', async () => {
    await page.goto(`${BASE}/register`);
    await fillPersonalStep(page, { ...T, email: T.email, phone: T.phoneSecond });
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('button', 'Create my profile', { wait: 1800 });
    await page.waitFor(`document.querySelector('.form-status.error') || document.body.innerText.includes('Registration completed')`, { timeout: 20000, label: 'a result' });
    const err = await page.text('.form-status.error');
    assert(err, 'a second registration with the same email was accepted');
    contains(err, 'already exists', 'the duplicate email message');
    assertEq(await countCandidates(T.email), 1, 'there should still be exactly one record for this email');
  });

  await test('registering with a phone that belongs to someone else is refused', async () => {
    await page.goto(`${BASE}/register`);
    await fillPersonalStep(page, { ...T, email: T.email2, phone: T.phoneOtherFormat });   // same digits, written differently
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('button', 'Create my profile', { wait: 1800 });
    await page.waitFor(`document.querySelector('.form-status.error')`, { timeout: 20000, label: 'an error' });
    const err = await page.text('.form-status.error');
    contains(err, 'phone number is already registered', 'the duplicate phone message');
    assertEq(await countCandidates(T.email2), 0, 'no record may be created for the rejected signup');
    const { data: u } = await db.auth.admin.listUsers();
    assert(!u.users.some(x => x.email === T.email2), 'no login may be left behind by a rejected signup');
  });

  console.log('\nSign in');
  await test('signing in with the wrong password is refused', async () => {
    await page.goto(`${BASE}/login`);
    await signInAs(page, T.email, 'not-the-password');
    await page.waitFor(`document.querySelector('.form-status.error')`, { timeout: 15000, label: 'an error' });
    contains(await page.text('.form-status.error'), "couldn't sign you in", 'the sign-in error');
    assertEq(await page.url(), '/login', 'a failed sign-in should stay on the login page');
  });

  await test('signing in lands the candidate on their dashboard', async () => {
    await page.goto(`${BASE}/login`);
    await signInAs(page, T.email, T.password);
    await page.waitFor(`location.pathname.startsWith('/candidate') || document.querySelector('.form-status.error')`, { timeout: 20000, label: 'the dashboard' });
    const err = await page.text('.form-status.error');
    assert(!err, `sign-in failed: ${String(err).trim()}`);
    assertEq(await page.url(), '/candidate/dashboard', 'should land on the dashboard');
    contains(await page.text('main'), T.name.split(' ')[0], 'the dashboard should greet the candidate');
  });

  await test('the header shows the signed-in candidate, not an admin link', async () => {
    await page.goto(`${BASE}/`);
    const header = await page.text('.site-header');
    contains(header, 'E2E', 'the header should show the candidate name');
    assertEq(await page.count('a[href^="/admin"]'), 0, 'a candidate must never see an admin link');
  });

  console.log('\nProfile');
  await test('profile changes are saved', async () => {
    await page.goto(`${BASE}/candidate/settings`);
    await page.waitFor(`document.querySelector('#location')`, { timeout: 15000, label: 'the profile form' });
    await fillRequiredProfileFields(page);
    await page.fill('#location', 'Bengaluru');
    await page.fill('#summary', `Automated end-to-end check for run ${RUN}. This text is written by the test suite and removed afterwards.`);
    await page.clickText('button', 'Save profile', { wait: 2500 });
    // A successful save raises a toast; a rejected one fills the form status at the top of the form.
    await page.waitFor(`document.querySelector('.toast') || document.querySelector('.form-status.error')`, { timeout: 20000, label: 'a save result' });
    const saveErr = await page.text('.form-status.error');
    assert(!saveErr, `saving the profile failed: ${String(saveErr).trim()}`);
    const { data: cand } = await db.from('candidates').select('location,summary').eq('email', T.email).maybeSingle();
    assertEq(cand.location, 'Bengaluru', 'the new location should be stored');
    contains(cand.summary, RUN, 'the summary should be stored');
  });

  await test('changing a phone to one already in use is refused', async () => {
    const { data: other } = await db.from('candidates').insert({
      name: `E2E Other ${RUN}`, email: T.email2, phone: T.phoneSecond, location: 'Chennai', profile_type: 'IT',
    }).select('id').single();
    created.candidateIds.push(other.id);

    await page.goto(`${BASE}/candidate/settings`);
    await page.waitFor(`document.querySelector('#phone')`, { timeout: 15000, label: 'the profile form' });
    await fillRequiredProfileFields(page);
    await page.fill('#phone', `+91 ${T.phoneSecond.slice(0, 5)} ${T.phoneSecond.slice(5)}`);
    await page.clickText('button', 'Save profile', { wait: 2500 });
    await page.waitFor(`document.querySelector('.form-status.error') || document.querySelector('.toast')`, { timeout: 20000, label: 'a save result' });
    contains(await page.text('.form-status.error'), 'already', 'the duplicate phone message');
    const { data: mine } = await db.from('candidates').select('phone_norm').eq('email', T.email).maybeSingle();
    assertEq(mine.phone_norm, T.phoneDigits, 'the phone must not have changed');
  });

  console.log('\nApplying');
  await test('a signed-in candidate can apply to a job', async () => {
    assert(job, 'no published job to apply to');
    await page.goto(`${BASE}/jobs/${job.slug}`);
    await page.clickText('button', 'Apply', { wait: 800 });
    await page.waitFor(`document.querySelector('.dialog-body #name')`, { timeout: 15000, label: 'the apply form' });
    await fillPersonalStep(page, { ...T, location: 'Bengaluru' });
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('.dialog-body button', 'Submit application', { wait: 2500 });
    await page.waitFor(`document.body.innerText.includes('Application received') || document.querySelector('.dialog-body .form-status.error')`, { timeout: 25000, label: 'an application result' });
    const err = await page.text('.dialog-body .form-status.error');
    assert(!err, `the application failed: ${String(err).trim()}`);

    const { data: cand } = await db.from('candidates').select('id,resume_path').eq('email', T.email).maybeSingle();
    const { data: apps } = await db.from('applications').select('id,job_id,resume_path').eq('candidate_id', cand.id);
    assertEq(apps.length, 1, 'exactly one application should exist');
    assertEq(apps[0].job_id, job.id, 'the application should be for the job that was opened');
    created.applicationIds.push(apps[0].id);
    if (apps[0].resume_path) created.storage.resumes.push(apps[0].resume_path);
    assertEq(await countCandidates(T.email), 1, 'applying must not create a second candidate record');
  });

  await test('applying twice to the same job is refused', async () => {
    await page.goto(`${BASE}/jobs/${job.slug}`);
    await page.clickText('button', 'Apply', { wait: 800 });
    await page.waitFor(`document.querySelector('.dialog-body #name')`, { timeout: 15000, label: 'the apply form' });
    await fillPersonalStep(page, { ...T, location: 'Bengaluru' });
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('.dialog-body button', 'Submit application', { wait: 2500 });
    await page.waitFor(`document.querySelector('.dialog-body .form-status.error')`, { timeout: 25000, label: 'an error' });
    contains(await page.text('.dialog-body .form-status.error'), 'already applied', 'the duplicate application message');
    const { data: cand } = await db.from('candidates').select('id').eq('email', T.email).maybeSingle();
    const { count } = await db.from('applications').select('*', { count: 'exact', head: true }).eq('candidate_id', cand.id);
    assertEq(count, 1, 'a second application row must not be created');
  });

  await test('a visitor without an account can apply, and one record is created for them', async () => {
    await page.clearCookies();
    await page.goto(`${BASE}/jobs/${job.slug}`);
    await page.clickText('button', 'Apply', { wait: 800 });
    await page.waitFor(`document.querySelector('.dialog-body #name')`, { timeout: 15000, label: 'the apply form' });
    await fillPersonalStep(page, { name: `E2E Walkin ${RUN}`, email: T.emailWalkIn, phone: T.phoneWalkIn, location: 'Pune' });
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('.dialog-body button', 'Submit application', { wait: 2500 });
    await page.waitFor(`document.body.innerText.includes('Application received') || document.querySelector('.dialog-body .form-status.error')`, { timeout: 25000, label: 'an application result' });
    const err = await page.text('.dialog-body .form-status.error');
    assert(!err, `the application failed: ${String(err).trim()}`);
    const { data: cand } = await db.from('candidates').select('id,user_id,phone_norm,resume_path').eq('email', T.emailWalkIn).maybeSingle();
    assert(cand, 'a candidate record should be created for a first-time applicant');
    created.candidateIds.push(cand.id);
    if (cand.resume_path) created.storage.resumes.push(cand.resume_path);
    assertEq(cand.user_id, null, 'applying should not silently create a login');
    assertEq(cand.phone_norm, T.phoneWalkIn.replace(/\D/g, '').slice(-10), 'the phone should be stored normalised');
  });

  await test('applying with someone else\'s phone number is refused', async () => {
    await page.clearCookies();                                   // as an anonymous visitor
    await page.goto(`${BASE}/jobs/${job.slug}`);
    await page.clickText('button', 'Apply', { wait: 800 });
    await page.waitFor(`document.querySelector('.dialog-body #name')`, { timeout: 15000, label: 'the apply form' });
    await fillPersonalStep(page, { ...T, name: `E2E Stranger ${RUN}`, email: `amani.e2e.${RUN}.third@mailinator.com`, phone: T.phone });
    await fillProfessionalStep(page);
    await fillResumeStep(page);
    await page.clickText('.dialog-body button', 'Submit application', { wait: 2500 });
    await page.waitFor(`document.querySelector('.dialog-body .form-status.error')`, { timeout: 25000, label: 'an error' });
    contains(await page.text('.dialog-body .form-status.error'), 'already registered', 'the duplicate phone message');
    assertEq(await countCandidates(`amani.e2e.${RUN}.third@mailinator.com`), 0, 'no record may be created');
  });

  console.log('\nSessions and separation');
  await test('signing out returns the visitor header', async () => {
    await page.goto(`${BASE}/login`);
    await signInAs(page, T.email, T.password);
    await page.waitForPath('/candidate/dashboard', { timeout: 20000 });
    await page.clickText('button', 'Sign out', { wait: 2000 }).catch(async () => { await page.clickText('a', 'Sign out', { wait: 2000 }); });
    await page.goto(`${BASE}/`);
    contains(await page.text('.site-header'), 'Talk to us', 'the visitor header should be back');
  });

  await test('the candidate area requires a login', async () => {
    await page.clearCookies();
    await page.goto(`${BASE}/candidate/dashboard`);
    contains(await page.url(), '/login', 'an anonymous visitor should be sent to the login page');
  });

  await test('staff are kept out of the candidate area', async () => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL, adminPassword = process.env.E2E_ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) throw blocked('set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to include the admin checks');
    await page.clearCookies();
    await page.goto(`${BASE}/admin/login`);
    await signInAs(page, adminEmail, adminPassword);
    await page.waitForPath('/admin', { timeout: 20000 });
    await page.goto(`${BASE}/candidate/dashboard`);
    assertEq(await page.url(), '/admin', 'a staff account must be redirected away from the candidate area');
    await page.clearCookies();
  });

  page.close(); page = null;
  await cleanup();
  report();
}

/* ---------- support ---------- */
async function pickPublishedJob() {
  const { data } = await db.from('jobs').select('id,slug,title').eq('status', 'PUBLISHED').limit(1).maybeSingle();
  return data;
}
async function countCandidates(email) {
  const { count } = await db.from('candidates').select('*', { count: 'exact', head: true }).eq('email', email.toLowerCase());
  return count ?? 0;
}
/** The journey needs a usable login. If the UI could not make one (mailer limit), make one here and say so. */
async function ensureAccount() {
  const { data: cand } = await db.from('candidates').select('id,user_id,resume_path').eq('email', T.email).maybeSingle();
  if (cand?.user_id) {
    const { data: u } = await db.auth.admin.getUserById(cand.user_id);
    if (u?.user && !u.user.email_confirmed_at) {
      await db.auth.admin.updateUserById(cand.user_id, { email_confirm: true });
      console.log('  · the account needed confirming — "Confirm email" is ON in Supabase, so candidates cannot sign in until they click the emailed link');
    }
    return;
  }
  console.log('  · creating the test account directly so the rest of the journey can be tested');
  const { data: made, error } = await db.auth.admin.createUser({ email: T.email, password: T.password, email_confirm: true, user_metadata: { name: T.name } });
  if (error) throw new Error(`could not create the test account: ${error.message}`);
  created.authUsers.push(made.user.id);
  const { data: row, error: rErr } = await db.from('candidates').upsert({
    name: T.name, email: T.email, phone: T.phone, location: T.location, profile_type: 'IT', user_id: made.user.id,
  }, { onConflict: 'email' }).select('id').single();
  if (rErr) throw new Error(`could not create the test candidate: ${rErr.message}`);
  created.candidateIds.push(row.id);
}

/** Deletes exactly what this run made — by id, never by pattern or date. */
async function cleanup() {
  console.log('\nCleaning up test data');
  const { data: mine } = await db.from('candidates').select('id,email,resume_path,photo_path,user_id').in('email', [T.email, T.email2, T.emailWalkIn, `amani.e2e.${RUN}.third@mailinator.com`]);
  for (const c of mine || []) {
    created.candidateIds.push(c.id);
    if (c.user_id) created.authUsers.push(c.user_id);
    if (c.resume_path) created.storage.resumes.push(c.resume_path);
    if (c.photo_path) created.storage.photos.push(c.photo_path);
  }
  const ids = [...new Set(created.candidateIds)];
  if (ids.length) {
    const { data: apps } = await db.from('applications').select('id,resume_path').in('candidate_id', ids);
    for (const a of apps || []) { created.applicationIds.push(a.id); if (a.resume_path) created.storage.resumes.push(a.resume_path); }
    await db.from('applications').delete().in('candidate_id', ids);
    await db.from('candidates').delete().in('id', ids);
  }
  for (const uid of [...new Set(created.authUsers)].filter(Boolean)) {
    await db.auth.admin.deleteUser(uid).catch(() => {});
    await db.from('profiles').delete().eq('id', uid);
  }
  const resumes = [...new Set(created.storage.resumes)], photos = [...new Set(created.storage.photos)];
  if (resumes.length) await db.storage.from('resumes').remove(resumes);
  if (photos.length) await db.storage.from('photos').remove(photos);
  fs.rmSync(path.join(HERE, 'fixtures'), { recursive: true, force: true });
  console.log(`  removed ${ids.length} candidate record(s), ${created.applicationIds.length} application(s), ${[...new Set(created.authUsers)].length} login(s), ${resumes.length + photos.length} file(s)`);

  const after = { candidates: await countOf('candidates'), applications: await countOf('applications'), contacts: await countOf('contact_messages'), profiles: await countOf('profiles') };
  const drift = Object.keys(baseline).filter(k => after[k] !== baseline[k]);
  if (drift.length) {
    console.log(`  ✗ CLEANUP INCOMPLETE — ${drift.map(k => `${k}: ${baseline[k]} → ${after[k]}`).join(', ')}`);
    results.push({ name: 'test data is fully cleaned up', state: 'fail', reason: `row counts did not return to the baseline (${drift.join(', ')})` });
  } else {
    console.log('  ✓ database is back to its starting state');
    results.push({ name: 'test data is fully cleaned up', state: 'pass' });
  }
}

function report() {
  const pass = results.filter(r => r.state === 'pass').length;
  const fail = results.filter(r => r.state === 'fail');
  const block = results.filter(r => r.state === 'blocked');
  console.log(`\n${'—'.repeat(64)}\n${pass} passed · ${fail.length} failed · ${block.length} blocked\n`);
  for (const b of block) console.log(`BLOCKED  ${b.name}\n         ${b.reason}\n`);
  for (const f of fail) console.log(`FAILED   ${f.name}\n         ${f.reason}\n`);
  process.exit(fail.length ? 1 : 0);
}

run().catch(async e => {
  console.error('\nThe run stopped early:', e.message);
  if (page) { await page.screenshot(path.join(HERE, 'failure-run.png')).catch(() => {}); page.close(); }
  await cleanup().catch(err => console.error('Cleanup also failed — check the database for rows tagged', RUN, err.message));
  process.exit(1);
});
