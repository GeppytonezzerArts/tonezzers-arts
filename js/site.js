/* Tonezzer's Arts — homepage behaviour: hero gallery (crossfade, dots, pause), soundtrack preview (only on click),
   gallery lightbox. Everything degrades gracefully: without JS the first hero image and the gallery thumbnails still show. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- hero gallery ---------------- */
  const slides = $$('#slides .slide'), dots = $('#dots'), cap = $('#slide-cap'), pp = $('#slide-pp');
  let cur = 0, timer = 0, paused = reduce;
  const load = (i) => { const im = slides[i] && $('img', slides[i]); if (im && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute('data-src'); } };
  function show(i) {
    i = (i + slides.length) % slides.length; load(i); load((i + 1) % slides.length);
    slides[cur].classList.remove('on'); slides[i].classList.add('on'); cur = i;
    $$('button', dots).forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    const fc = $('figcaption', slides[i]); if (fc && cap) cap.textContent = fc.textContent;
  }
  function arm() { clearTimeout(timer); if (!paused && !document.hidden) timer = setTimeout(() => { show(cur + 1); arm(); }, 6000); }
  if (slides.length > 1 && dots) {
    slides.forEach((s, k) => {
      const b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-label', 'Immagine ' + (k + 1) + ': ' + ($('figcaption', s) || {}).textContent);
      b.addEventListener('click', () => { show(k); arm(); }); dots.appendChild(b);
    });
    show(0);
    const setPaused = (p) => { paused = p; pp.classList.toggle('paused', p); pp.setAttribute('aria-pressed', p ? 'true' : 'false'); pp.setAttribute('aria-label', p ? 'Riprendi le immagini' : 'Metti in pausa le immagini'); arm(); };
    pp.addEventListener('click', () => setPaused(!paused));
    setPaused(paused);
    document.addEventListener('visibilitychange', arm);
    window.addEventListener('load', () => setTimeout(() => slides.forEach((s, k) => load(k)), 1500)); // the rest, after the page
  } else if (pp) pp.hidden = true;

  /* ---------------- soundtrack preview ---------------- */
  const audio = $('#theme'), mbtns = $$('[data-music]'), bar = $('#music-bar'), song = $('.feat.song');
  const LBL = new Map(mbtns.map((b) => [b, $('.lbl', b).textContent]));
  function sync() {
    const on = audio && !audio.paused && !audio.ended;
    mbtns.forEach((b) => { b.classList.toggle('playing', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); $('.lbl', b).textContent = on ? 'Pausa' : LBL.get(b); });
    if (song) song.classList.toggle('playing', on);
  }
  if (audio) {
    mbtns.forEach((b) => b.addEventListener('click', () => {
      if (audio.paused) { audio.volume = 0.8; const p = audio.play(); if (p && p.catch) p.catch(() => {}); } else audio.pause();
    }));
    ['play', 'pause', 'ended'].forEach((e) => audio.addEventListener(e, sync));
    audio.addEventListener('timeupdate', () => { if (bar && audio.duration) bar.style.width = (100 * audio.currentTime / audio.duration).toFixed(2) + '%'; });
    audio.addEventListener('error', () => mbtns.forEach((b) => { b.disabled = true; b.classList.remove('playing'); $('.lbl', b).textContent = 'Colonna sonora non disponibile'; }));
  }

  /* ---------------- gallery lightbox ---------------- */
  const lb = $('#lightbox'), items = $$('#gallery button');
  let li = 0;
  function open(i) {
    li = (i + items.length) % items.length;
    const b = items[li], im = $('img', b);
    $('#lb-img').src = b.dataset.full; $('#lb-img').alt = im.alt; $('#lb-cap').textContent = im.alt;
    if (!lb.open) lb.showModal();
  }
  if (lb && typeof lb.showModal === 'function') {
    items.forEach((b, k) => b.addEventListener('click', () => open(k)));
    lb.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lb]'); if (a) { const v = a.dataset.lb; if (v === 'close') lb.close(); else open(li + (v === 'next' ? 1 : -1)); return; }
      if (e.target === lb) lb.close(); // backdrop
    });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') open(li + 1); else if (e.key === 'ArrowLeft') open(li - 1); });
  } else items.forEach((b) => b.addEventListener('click', () => { location.href = b.dataset.full; }));

  const y = $('#year'); if (y) y.textContent = String(Math.max(2026, new Date().getFullYear()));
})();
