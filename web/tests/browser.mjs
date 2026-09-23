/**
 * Minimal browser driver over the Chrome DevTools Protocol.
 *
 * Edge (or Chrome) is already installed on every machine this project is developed on, so the end-to-end tests
 * drive it directly instead of pulling in a browser-automation framework and its 300 MB of downloads.
 * Only what the tests actually need: navigate, read, type, click, upload a file, wait.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function launch({ headless = true, width = 1280, height = 900 } = {}) {
  const exe = CANDIDATES.find(existsSync);
  if (!exe) throw new Error('No Chromium-based browser found. Install Microsoft Edge or Google Chrome.');
  const port = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(exe, [
    headless ? '--headless=new' : '--new-window', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP || '/tmp'}/amani-e2e-${port}`, 'about:blank',
  ], { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch { /* not up yet */ }
  }
  if (!target) { proc.kill(); throw new Error('Browser did not start'); }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const consoleErrors = [];
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
    if (m.method === 'Runtime.exceptionThrown') consoleErrors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') consoleErrors.push(m.params.args.map(a => a.value || a.description).join(' '));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });

  await send('Runtime.enable'); await send('Page.enable'); await send('DOM.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });

  /** Evaluate in the page; the expression's value is returned by value. */
  const evaluate = async expr => {
    const r = await send('Runtime.evaluate', { expression: `(() => { ${expr} })()`, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(`Page error: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
    return r.result.value;
  };

  const page = {
    consoleErrors,
    async goto(url, { wait = 900 } = {}) { await send('Page.navigate', { url }); await sleep(wait); await page.settle(); },
    /** Wait until the document is interactive and React has flushed. */
    async settle(ms = 250) { await evaluate(`return document.readyState`); await sleep(ms); },
    evaluate,
    url: () => evaluate('return location.pathname + location.search'),
    text: (sel = 'body') => evaluate(`const e = document.querySelector(${JSON.stringify(sel)}); return e ? e.innerText : null`),
    exists: sel => evaluate(`return !!document.querySelector(${JSON.stringify(sel)})`),
    count: sel => evaluate(`return document.querySelectorAll(${JSON.stringify(sel)}).length`),
    /** Set a value the way a user would, so React's onChange/onInput handlers run. */
    async fill(sel, value) {
      const ok = await evaluate(`
        const el = document.querySelector(${JSON.stringify(sel)});
        if (!el) return false;
        const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : el instanceof HTMLSelectElement ? HTMLSelectElement : HTMLInputElement;
        Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, ${JSON.stringify(String(value))});
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;`);
      if (!ok) throw new Error(`fill: no element for ${sel}`);
    },
    /** Pick an <option> by its visible text (values are generated ids in most of these selects). */
    async select(sel, { index = 1, label } = {}) {
      const ok = await evaluate(`
        const el = document.querySelector(${JSON.stringify(sel)});
        if (!el || !el.options.length) return false;
        const opts = [...el.options].filter(o => o.value);
        const opt = ${label ? `opts.find(o => o.textContent.trim() === ${JSON.stringify(label)})` : `opts[${index - 1}]`};
        if (!opt) return false;
        Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, opt.value);
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return opt.value;`);
      if (!ok) throw new Error(`select: no option for ${sel}${label ? ` (${label})` : ''}`);
      return ok;
    },
    async check(sel) { await evaluate(`const el = document.querySelector(${JSON.stringify(sel)}); if (el && !el.checked) el.click(); return true`); },
    async click(sel, { wait = 400 } = {}) {
      const ok = await evaluate(`const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; el.click(); return true`);
      if (!ok) throw new Error(`click: no element for ${sel}`);
      await sleep(wait);
    },
    /** Click the first element whose text matches — buttons in this app are labelled, not id'd. */
    async clickText(sel, text, { wait = 400 } = {}) {
      const ok = await evaluate(`
        const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(e => e.innerText.trim().toLowerCase().includes(${JSON.stringify(text.toLowerCase())}));
        if (!el) return false; el.click(); return true;`);
      if (!ok) throw new Error(`clickText: nothing matching "${text}" for ${sel}`);
      await sleep(wait);
    },
    async setFile(sel, path) {
      const { root } = await send('DOM.getDocument', { depth: -1 });
      const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
      if (!nodeId) throw new Error(`setFile: no element for ${sel}`);
      await send('DOM.setFileInputFiles', { nodeId, files: [path] });
      await sleep(200);
    },
    /** Poll until `expr` returns truthy, or fail with what the page showed instead. */
    async waitFor(expr, { timeout = 15000, label = expr } = {}) {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        if (await evaluate(`return !!(${expr})`)) return true;   // coerce: a DOM node cannot be returned by value
        await sleep(250);
      }
      throw new Error(`Timed out waiting for: ${label}`);
    },
    waitForText: (text, opts) => page.waitFor(`document.body.innerText.toLowerCase().includes(${JSON.stringify(text.toLowerCase())})`, { ...opts, label: `text "${text}"` }),
    waitForPath: (path, opts) => page.waitFor(`location.pathname === ${JSON.stringify(path)}`, { ...opts, label: `url ${path}` }),
    async cookies() { return (await send('Network.getCookies')).cookies; },
    async clearCookies() { await send('Network.clearBrowserCookies'); },
    async screenshot(file) { const s = await send('Page.captureScreenshot', { format: 'png' }); const { writeFileSync } = await import('node:fs'); writeFileSync(file, Buffer.from(s.data, 'base64')); },
    close() { try { ws.close(); } catch { /* already gone */ } proc.kill(); },
  };
  return page;
}
