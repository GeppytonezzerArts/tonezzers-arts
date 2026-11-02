/* Tonezzer Racers (© Tonezzer's Arts) — v3.4 anonymous visit counter (O.Visit). docs/ONLINE.md §2.6, docs/SUPABASE-SETUP-IT.md.
   Shared by the game (index.html, after js/online.js) and the studio site (tools/build-site.js copies this file and
   js/online-config.js to site/js/: same origin, same anonymous id). One call per page load, fire and forget:
     O.Visit.log(app 'game' | 'site', lang 'it' | 'en', ver) → POST <url>/rest/v1/rpc/log_visit {p_id, p_app, p_lang, p_dev, p_ver}
   What is sent: the anonymous random id of this browser (localStorage 'ors3d-player-v1', the same uuid as the leaderboard's player;
   created here when the site is opened first), the app, the language, the game version and a coarse device class (desktop /
   phone / tablet, from the pointer and the screen size). The server stores only the day, an id derived from the uuid (md5 with
   its own salt: never the uuid), the app, language, device, version and how many times it was opened that day. No IP, no
   cookie, no user agent, no screen size, no time of day.
   Never: without a configuration, offline, with Do Not Track / Global Privacy Control on, for automated browsers and bots
   (navigator.webdriver, crawler user agents: tests set window.ORS_STATS_TEST to run it anyway), with window.ORS_NO_STATS, or a
   second time on the same page. Silent: no console output, no exception, 8 s time-out, credentials omitted. */
'use strict';
(function (G) {
  const O = (G.ORS = G.ORS || {});
  const PKEY = 'ors3d-player-v1', UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  let sent = false, last = null;
  function newId() {
    const c = G.crypto;
    try { if (c && c.randomUUID) return c.randomUUID(); } catch (e) { /* insecure context */ }
    const b = new Uint8Array(16);
    try { c.getRandomValues(b); } catch (e) { for (let i = 0; i < 16; i++) b[i] = (Math.random() * 256) | 0; }
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = Array.from(b, (x) => (x + 256).toString(16).slice(1)).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  // the browser's anonymous id: the game's leaderboard player when there is one (same record format, so the game keeps it)
  function id() {
    try { if (O.Online && O.Online.player) return O.Online.player().id; } catch (e) { /* fall through */ }
    let p = null;
    try { p = JSON.parse(G.localStorage.getItem(PKEY)); } catch (e) { p = null; }
    if (p && typeof p.id === 'string' && UUID_RE.test(p.id)) return p.id;
    const v = newId();
    try { G.localStorage.setItem(PKEY, JSON.stringify({ id: v, name: '', named: 0 })); } catch (e) { /* storage blocked: a new id per visit */ }
    return v;
  }
  function device() {
    try {
      const coarse = G.matchMedia && G.matchMedia('(pointer:coarse)').matches, s = G.screen ? Math.min(G.screen.width || 0, G.screen.height || 0) : 0;
      return !coarse ? 'desktop' : s >= 600 ? 'tablet' : 'phone';
    } catch (e) { return 'desktop'; }
  }
  // why a page is not counted ('' = it is)
  function skip() {
    const c = O.ONLINE_CONFIG || {}, n = G.navigator || {};
    if (String(c.provider || '').toLowerCase() !== 'supabase' || !/^https:\/\/[^\s/]+$/.test(String(c.url || '').trim().replace(/\/+$/, '')) || String(c.anonKey || '').trim().length < 20) return 'off';
    if (G.ORS_NO_STATS) return 'flag';
    if (n.onLine === false) return 'offline';
    if (n.doNotTrack === '1' || n.doNotTrack === 'yes' || G.doNotTrack === '1' || n.msDoNotTrack === '1' || n.globalPrivacyControl === true) return 'dnt';
    if (!G.ORS_STATS_TEST && (n.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(n.userAgent || ''))) return 'bot';
    if (typeof G.fetch !== 'function') return 'nofetch';
    return '';
  }
  function log(app, lang, ver) {
    const why = skip();
    if (why || sent) return Promise.resolve({ ok: false, why: why || 'again' });
    sent = true;
    const c = O.ONLINE_CONFIG, key = String(c.anonKey).trim(), url = String(c.url).trim().replace(/\/+$/, '') + '/rest/v1/rpc/log_visit';
    const body = { p_id: id(), p_app: app === 'site' ? 'site' : 'game', p_lang: lang === 'en' ? 'en' : 'it', p_dev: device(), p_ver: /^\d{1,2}\.\d{1,2}(\.\d{1,2})?$/.test(ver || '') ? ver : '' };
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json', apikey: key };
    if (/^eyJ/.test(key)) headers.Authorization = 'Bearer ' + key; // (a legacy anon JWT; publishable keys go in apikey only)
    let ctl = null, timer = 0;
    try { ctl = new G.AbortController(); timer = G.setTimeout(() => { try { ctl.abort(); } catch (e) { /* ignore */ } }, 8000); } catch (e) { ctl = null; }
    last = body;
    let p;
    try { p = G.fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined, cache: 'no-store', credentials: 'omit' }); }
    catch (e) { p = Promise.reject(e); }
    return p.then((r) => (r && r.ok ? r.json().catch(() => null) : null)).then((j) => ({ ok: !!(j && j.ok === true), why: j && j.err ? String(j.err).slice(0, 20) : '' }), () => ({ ok: false, why: 'net' }))
      .then((r) => { G.clearTimeout(timer); return r; });
  }
  O.Visit = { log, skip, device, _last: () => last, _reset() { sent = false; last = null; } };
})(typeof window !== 'undefined' ? window : globalThis);
