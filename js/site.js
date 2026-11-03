/* Tonezzer's Arts — homepage behaviour: IT / EN language switch, hero gallery (crossfade, dots, pause), soundtrack preview
   (only on click), gallery lightbox. Everything degrades gracefully: without JS the page is the Italian original, the first
   hero image and the gallery thumbnails still show.

   Languages: index.html holds the Italian text; every translatable piece carries data-i18n="key" (its innerHTML) or
   data-i18n-attr="attr=key;attr2=key2" (attributes: alt, aria-label, meta content, ...). The Italian dictionary is read
   from the page itself at start-up, the English one is EN below: add a key in both places and they stay in sync.
   Choice: ?lang=it|en in the URL > the visitor's saved choice (localStorage) > browser language (Italian -> it, else en).
   The game (games/tonezzer-racers/, Italian and English) follows the same rule and the same 'ta-lang' key; every "Play now"
   link carries ?lang= of the current page language. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- languages ---------------- */
  const EN = {
    'meta.title': 'Tonezzer’s Arts — Games',
    'meta.locale': 'en_US', 'meta.localeAlt': 'it_IT',
    'meta.ogTitle': 'Tonezzer Racers — play free in your browser',
    'meta.ogAlt': 'Tonezzer’s Arts presents Tonezzer Racers',
    'meta.twDesc': 'Off-road racing in HD voxel art by Tonezzer’s Arts.',
    'skip': 'Skip to content',
    'brand.aria': 'Tonezzer’s Arts, back to top',
    'nav.aria': 'Sections', 'nav.new': 'What’s new', 'nav.games': 'Games', 'nav.studio': 'The studio', 'nav.credits': 'Credits', 'nav.controls': 'Controls',
    'lang.aria': 'Language',
    'play': 'Play now',
    'play.xl': '<b>Play now</b><small>free in your browser</small>',
    'play.note': 'Available in English and Italian',
    'hero.carousel': 'carousel', 'hero.slidesAria': 'Tonezzer Racers gameplay images',
    'hero.presents': '<b>Tonezzer’s Arts</b> presents',
    'music.listenTheme': 'Listen to the soundtrack',
    'music.listen': 'Listen',
    'hero.hint': 'No install, no sign-up. House tip: <span class="desk"><kbd>F11</kbd> for full screen, and turn the volume up.</span><span class="mob">phone in landscape, and turn the volume up.</span>',
    'motto': 'The world’s greatest games, since forever',
    'tick.free': 'Play free in your browser',
    'cup': 'Tonezzer Cup',
    'tick.v35': 'Version 3.5 · Ups and downs',
    'r.kicker': 'The game',
    'r.h': 'The world’s greatest <span class="nw">off-road</span> game<sup>*</sup>',
    'r.fine': '<sup>*</sup> According to an independent study conducted by Giacomo Tonezzer.',
    'f1.tag': 'Mode',
    'f1.h': 'Hill Climb (Cronoscalata)',
    'f3.h': '2 players',
    'f3.p': 'Split screen on the same computer: shared keyboard or two gamepads. The strongest friendships end right here, at the first hairpin.',
    'f5.alt': 'A night race in the Tonezzer Ring stadium',
    'f5.h': 'Tonezzer’s Arts Grand Prix',
    'song': 'Soundtrack',
    'song.p': 'The game’s official song, written by <b>Giacomo Tonezzer</b> and created with Suno. Best enjoyed with the windows rolled down.',
    'tr.desert': 'Desert', 'tr.night': 'Night', 'tr.swamp': 'Swamp', 'tr.alpine': 'Alpine forest', 'tr.canyon': 'Canyon', 'tr.snow': 'Snow',
    'g.kicker': 'Gallery',
    'g.h': 'Postcards from the mud',
    'c.kicker': 'The catalogue',
    'c.h': 'The games of Tonezzer’s Arts',
    'c.lead': 'A small but perfect catalogue: for now it contains masterpieces exclusively.',
    'c.avail': 'Available · Free',
    'c.meta': 'Off-road racing · 1–2 players · Browser',
    'c.more': 'Learn more',
    'c.soon': 'Coming soon<sup>*</sup>',
    'c.s1.alt': 'A red tractor in voxel art',
    'c.s1.meta': 'Competitive farming · 1–4 players',
    'c.s1.p': 'The first ploughing simulator at 140 km/h. Same mud physics, now with clods. The Agricultural Federation has already asked for it to be banned.',
    'c.s2.alt': 'A white and red rocket in voxel art',
    'c.s2.meta': 'Lunar racing · low gravity',
    'c.s2.p': 'The first pick-up on the Moon. Forty-second jumps, craters for banked turns and nowhere to hide from the Baron.',
    'c.fine': '<sup>*</sup> “Coming soon” is a unit of time patented by Tonezzer’s Arts. It equals: whenever Giacomo says it’s ready.',
    'st.h': 'A world-famous production house',
    'st.lead': '<b>Tonezzer’s Arts</b> is the world-famous video game production house founded by <b>Giacomo Tonezzer</b>. Historians disagree on its founding date; they do agree, however, that it has simply existed <i>since forever</i>.',
    'st.p1': 'Legend has it that young Giacomo learned to steer before he could walk, to draw race tracks before he could write, and to win the Tonezzer Cup before he had even invented it. His first pick-up was a shopping trolley. He won anyway.',
    'st.p2': 'Ever since, the studio’s mission has never changed: make the world’s greatest games, one at a time, with no rush and not the slightest trace of modesty. Every project starts as one of Giacomo’s ideas, grows under his art direction, is personally play-tested (setting the record on every track, obviously) and reaches you <b>for free</b>, because greatness is meant to be shared.',
    'st.quote': '“A game is finished when the mud splashes just right.”',
    'st.quoteBy': 'Giacomo Tonezzer, founder, director and chief test driver',
    'st.sheet': 'Studio fact sheet',
    'st.crest': 'The Tonezzer’s Arts crest: a golden crown above a red and blue shield with the letters TA and a chequered band',
    'st.founded': 'Founded', 'st.foundedV': 'Since forever',
    'st.founder': 'Founder',
    'st.hq': 'Headquarters', 'st.hqV': 'Wherever there’s mud',
    'st.games': 'Games released', 'st.gamesV': '1 <small>(a masterpiece)</small>',
    'st.trucks': 'Pick-ups mistreated', 'st.trucksV': '0 <small>(except the Baron’s)</small>',
    'st.budgetV': 'Unlimited',
    'st.motto': 'Motto',
    'cr.h': 'Who’s behind the mud',
    'cr1.role': 'Concept, direction and production',
    'cr1.p': 'Concept and direction, art direction, executive production, test driving, chief jump tester and record holder on every track.',
    'cr2.role': 'Development and programming',
    'cr2.p': 'Development, programming, pick-up physics, synthesized engines and choirs, and every single voxel: Claude, Anthropic’s AI assistant, under the direction of Giacomo Tonezzer.',
    'cr3.p': 'A song by Giacomo Tonezzer, created with Suno. Engine roar approved by: Giacomo Tonezzer.',
    'cr4.h': 'Thanks to',
    'cr4.role': 'Tools and inspiration',
    'cr4.p': 'three.js (3D engine, MIT licence), the Bungee and Barlow Condensed typefaces, the Official Tonezzer Fan Club, the arcades of yesteryear and Saturday-night mud.',
    'k.kicker': 'How to play',
    'k.h': 'Controls and requirements',
    'k.p1': 'Keyboard · Player 1', 'k.p2': 'Keyboard · Player 2',
    'k.acc': 'accelerate', 'k.brakeRev': 'brake / reverse', 'k.steer': 'steer', 'k.space': 'Space', 'k.reset': 'reset truck', 'k.brake': 'brake',
    'k.p1note': 'Playing solo, you can also drive with <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>. <kbd>P</kbd> pause, <kbd>C</kbd> camera, <kbd>V</kbd> zoom, <kbd>F</kbd> photo mode, <kbd>H</kbd> horn, <kbd>M</kbd> audio.',
    'k.stick': 'Stick',
    'k.padNote': 'With two gamepads, one per player.',
    'k.lpad': 'Left pad', 'k.pedals': 'Right pedals', 'k.gas': 'throttle and brake', 'k.osb': 'On-screen buttons', 'k.osbV': 'nitro, reset, pause',
    'k.touchNote': 'On phones and tablets, play in landscape.',
    'q.h': 'Requirements',
    'q.1': '<b>A modern browser</b> with WebGL: an up-to-date Chrome, Edge, Firefox or Safari.',
    'q.2': '<b>Best on a computer</b>, with keyboard or gamepad. Also runs on recent tablets and phones.',
    'q.3': '<b>An internet connection</b> at startup: the 3D engine and the fonts load from the web, the online leaderboards whenever you’re connected.',
    'q.4': '<b>Nothing to install</b>: records and progress are saved in your browser.',
    'q.5': '<b>Graphics card</b>: a dedicated one is recommended. On laptops with two graphics chips, choose “High performance” for your browser; <kbd>F3</kbd> in the game shows the performance stats.',
    'fin.h': 'Ready to get your wheels dirty?',
    'fin.p': 'The Baron is waiting for you on the starting line. So is the Tonezzer Cup.',
    'ft.rights': 'All rights reserved to Giacomo Tonezzer.',
    'ft.trucks': 'No pick-ups were harmed in the making of this production. Except the Baron’s.',
    'ft.up': 'Back to top ↑',
    'lb.aria': 'Enlarged image', 'lb.close': 'Close', 'lb.prev': 'Previous image', 'lb.next': 'Next image',
    'meta.desc': 'Tonezzer’s Arts, the world-famous production house of Giacomo Tonezzer, presents Tonezzer Racers 3.5: off-road racing in HD voxel art with 7 vehicles, the Tonezzer Garage, 12 circuits full of ups and downs, 11 hill climbs, Stage Rally, Elimination, Demolition Derby, online leaderboards, 55 trophies, a photo mode and 2 players. Free in your browser, in English and Italian.',
    'meta.ogDesc': 'Off-road racing in HD voxel art, version 3.5 “Ups and downs”: 12 reworked circuits, Stage Rally, Elimination, Demolition Derby, online leaderboards and the Tonezzer Cup ceremony, with a real night, weather, 7 vehicles, the Tonezzer Garage, 11 hill climbs and 2 players on one screen. The world’s greatest games, since forever.',
    'meta.ogImg': 'https://geppytonezzerarts.github.io/tonezzers-arts/img/og-en.jpg',
    's1.alt': 'Cima delle Nuvole (Cloud Peak) at sunset: the Tonezzer Special climbs toward the summit above the sea of clouds',
    's1.cap': 'Cima delle Nuvole · at sunset',
    's2.alt': 'Il Vulcano Tonezzer: the Monster Bestione races along the crater rim, past the grandstand and Tonezzer’s statue',
    's2.cap': 'Tonezzer’s Volcano · the crater',
    's3.alt': 'Rallycross del Lago (Lakeside Rallycross): the pick-up flying off the Ski Jump, sixty metres toward the lake',
    's3.cap': 'Lakeside Rallycross · the Ski Jump',
    's4.alt': 'Il Passo del Ghiacciaio (Glacier Pass): the Rally Saetta jumps the crevasse between walls of ice',
    's4.cap': 'Glacier Pass · the crevasse',
    's5.alt': 'The Grand Prix award ceremony: three cars on the podium and the Tonezzer Cup rising over the winner',
    's5.cap': 'Grand Prix · the Tonezzer Cup',
    's6.alt': 'Tonezzer Ring at night: four pick-ups drifting under the Neon Tower and the packed grandstands',
    's6.cap': 'Tonezzer Ring · night stadium',
    's7.alt': 'Canyon del Fuoco (Fire Canyon): the pack drops through the hairpins of the Lava Circle, past the banked wall',
    's7.cap': 'Fire Canyon · the Lava Circle',
    's8.alt': 'Passo della Neve: the Rally Saetta flying off the snowy ramp',
    's8.cap': 'Passo della Neve · snow',
    'hero.tagline': 'Mud, jumps and nitro in <b>HD voxel art</b>. Seven vehicles to upgrade in the Tonezzer Garage, twelve circuits full of ups and downs, eleven hill climbs, stage rallies, elimination races, a demolition derby and head-to-head duels on the same screen.',
    'tv.link': 'Watch the trailer',
    'tv.kicker': 'Trailer · version 3',
    'tv.h': 'Night, rain and living terrain',
    'tv.lead': 'Headlights and floodlights in a real night, rain with thunder and lightning, snow and fog, ruts that grow lap after lap and the daily challenge. Turn the volume up.',
    'tv.aria': 'Tonezzer Racers trailer preview (muted)',
    'tv.play': 'Watch the trailer',
    'tv.sound': '1:19 · with sound · “Toh-NAY-tser Racers”',
    'tv.dl': 'Download the trailer (MP4, 1080p)', 'tv.dlHref': 'video/tonezzer-racers-trailer-en.mp4',
    'tv.dlv': '15 s vertical cut',
    'tv.v3': 'the v3 trailer', 'tv.v3Href': 'video/tonezzer-racers-trailer-v3-en.mp4',
    'tv.kit': 'press kit',
    'r.lead': 'Seven vehicles, one mud track and zero mercy. <b>Tonezzer Racers</b> is the spiritual heir to the off-road arcade racers of yesteryear, rebuilt voxel by voxel in high definition. <b>Version 3.5</b> reshapes all twelve circuits and adds stage rallies, elimination races, online leaderboards and a proper Cup ceremony, on top of version 3’s real night, weather, living terrain and Demolition Derby. Play instantly, in your browser, for free.',
    'f1.alt': 'The Cima delle Nuvole hill climb at sunset, with distant mountains and a pink sky',
    'f1.p': 'From valley to summit against the clock: <b>eleven climbs</b>, split times, the <b>ghost</b> of your record to beat, challenges with rewards, medals up to <b>Platinum</b> and an online leaderboard. Cloud Peak above a sea of clouds, Tonezzer’s Volcano, the Glacier Pass and the legendary <b>Trento–Bondone</b>, every hairpin of it. Missed a bend? Hit <kbd>R</kbd> and you’re off again.',
    'f2.alt': 'The Ski Jump of Lakeside Rallycross: a pick-up flying toward the lake',
    'f2.h': '12 circuits',
    'f2.p': 'Deserts, canyons at sunset, swamps, alpine forests, snow and floodlit stadiums, now all <b>ups and downs</b>: hairpins stacked one above the other, steep dives and crests you really fly off. By day or by night, in rain, snow or fog.',
    'f3.alt': 'Two-player split screen at Rallycross del Lago: the Buggy against the Monster',
    'f4.alt': 'The 3D Tonezzer Garage: the Tonezzer Special on the turntable',
    'f4.h': '7 vehicles and the Tonezzer Garage',
    'f4.p': 'Pick-up, Vintage Jeep, Buggy, Rally, Trophy Truck, Monster and the legendary Tonezzer Special. Engine, turbo, tyres, suspension, paints, decals and horns (yes, a rubber duck too).',
    'f5.p': 'Twelve back-to-back races against the Baron, prize money, and one token less for whoever finishes last. Then the award ceremony: whoever banks the most lifts the <b>Tonezzer Cup</b>. The championship stays saved between races.',
    'f6.alt': 'Photo mode, postcard style: Greetings from Cima delle Nuvole',
    'f6.h': 'Trophies and photo mode',
    'f6.p': '55 Tonezzer Trophies to unlock, some of them secret. Press <kbd>F</kbd> in a race, fly the drone and take your postcard. Dents and flying parts? Tonezzer pays the bill.',
    'tr.h': 'The 12 circuits',
    'tr.hills': 'The 11 hill climbs',
    'tr.new': 'New', 'tr.v35': 'Reworked in 3.5', 'tr.legend': 'The legendary', 'tr.modes': 'The modes',
    'md.gp': 'Grand Prix <small>12 races and the Cup</small>', 'md.hill': 'Hill Climb', 'md.rally': 'Stage Rally <em class="new">3.4</em>', 'md.elim': 'Elimination <em class="new">3.4</em>',
    'md.derby': 'Demolition Derby <small>3 arenas</small>', 'md.daily': 'Daily challenge', 'md.boards': 'Online leaderboards', 'md.2p': '2 players', 'md.school': 'Driving school', 'md.photo': 'Photo mode',
    'n.kicker': 'What’s new · version 3.5',
    'n.h': 'Ups and downs, rallies and the Cup',
    'n.lead': 'Version 3.5 gives all twelve circuits a new character and wraps up the first season of updates in style: <b>Stage Rally</b>, <b>Elimination</b>, <b>online leaderboards</b>, the <b>Tonezzer Cup</b> award ceremony and the <b>Demolition Derby</b>. And the hill climbs run smoother, just because.',
    'n1.alt': 'Fire Canyon: the pack in the downhill hairpins of the Lava Circle',
    'n1.tag': 'Version 3.5',
    'n1.h': 'Ups and downs: 12 reworked circuits',
    'n1.p': 'More climbs and dives, crests you really fly off and five tracks with a brand-new layout. The <b>Wolf Hairpins</b> and the <b>Wolf Leap</b> in the woods, <b>Le Forcelle</b> and the 60–70 metre <b>Ski Jump</b> of Lakeside Rallycross, the <b>Lava Circle</b> of Fire Canyon, the <b>Neon Tower</b> of Tonezzer Ring and the three 22-metre arches of Three Arches. Lap records start from zero, online too.',
    'n2.alt': 'The Stage Rally service park: stage times, overall standings and the repair choice',
    'n2.h': 'Stage Rally',
    'n2.p': 'Three rallies of hill climbs back to back against five rivals: the total time counts. Damage carries over from stage to stage and at the <b>service park</b> it’s your call: repair, quick fix or drive on as you are. The Grand Rally ends on the legendary Trento–Bondone.',
    'n3.alt': 'Elimination at Mesa Grande: the pack on the finish line and the YOU’RE LAST warning on the board',
    'n3.h': 'Elimination',
    'n3.p': '4 to 6 cars on any circuit: at the end of every lap <b>the last car is out</b>, until only one is left. The board spells it out: “YOU’RE LAST!”. Two players too, in split screen.',
    'n4.alt': 'The Rankings page: the best times of players from all over the world',
    'n4.h': 'Online leaderboards',
    'n4.p': 'Hill climbs, best laps, the daily challenge and rallies against everyone’s times. Pick your leaderboard name: the game only sends an anonymous id, the name and the times. No account, no sign-up.',
    'n5.alt': 'The Tonezzer Cup ceremony on the podium, with confetti and fireworks',
    'n5.h': 'The Tonezzer Cup',
    'n5.p': 'The Grand Prix gets a proper ending: an <b>award ceremony</b> on the podium, the Cup rising over the winner, fanfare and fireworks, then the final standings. Between races you can leave the Garage and resume whenever you like.',
    'n6.alt': 'Demolition Derby in the Mud Pit: eight battered cars crash into each other in the arena',
    'n6.p': '6 to 8 cars locked in three arenas, the last one standing wins. Real damage, T-bones, flying parts and sudden death after three minutes. Two players too.',
    'g.lead': 'Captured in the real game, version 3.5, no retouching. All mud is 100% original, and so is the rain (the leaderboard names aren’t: they’re made up).',
    'g16': 'Lakeside Rallycross: a pick-up flying off the Ski Jump, sixty metres above the woods toward the lake',
    'g17': 'Fire Canyon: the pack in the downhill hairpins of the Lava Circle, past the banked wall',
    'g18': 'Tonezzer Ring at night: the hairpins of the Neon Tower under the floodlights',
    'g19': 'Elimination at Mesa Grande: a car is out and the board warns YOU’RE LAST',
    'g20': 'Alpine Rally: the Snow Pass stage with the timing board and the fastest rival’s benchmark',
    'g21': 'The Grand Prix award ceremony: the podium, the Tonezzer Cup and the confetti',
    'g22': 'The Rankings page: every player’s best hill-climb times',
    'g23': 'Demolition Derby in the Mud Pit: battered cars crashing in front of the grandstands',
    'g24': 'Trento–Bondone: the Sardagna hairpins, stacked one above the other',
    'g25': 'Three Arches: the pack races across the top of one of the three 22-metre rock arches',
    'g26': 'Tonezzer Stadium at night: the banked bends raised like bowls under the floodlights',
    'g27': 'Devil’s Gorge: the downhill Return Hairpins toward the bridge',
    'g1': 'Rallycross del Lago for two players: Buggy against Monster in split screen, with the race interface',
    'g2': 'Cima delle Nuvole: the Tonezzer Special on the Sky Sprint at sunset',
    'g3': 'Tonezzer’s Volcano: the Monster on the crater rim, with times and medals on screen',
    'g4': 'Gorge Road: the Vintage Jeep on the cliff road above the lake',
    'g5': 'Glacier Pass: the Rally Saetta jumps the crevasse',
    'g6': 'Tonezzer Stadium at night with fireworks',
    'g7': 'Palude Nera: the Vintage Jeep in the mud, with the race interface',
    'g8': 'Valle della Morte: the Desert Trophy Truck over the whoops',
    'g9': 'Passo della Neve: the Rally Saetta on the snowy ramp',
    'g10': 'The Tonezzer Garage: performance, workshop and bodywork of the Tonezzer Special',
    'g11': 'A real night in Bosco del Lupo: headlights, floodlight towers and pools of light on the dirt',
    'g12': 'Mesa Grande at night in the rain: a wet track and headlights glinting in the puddles',
    'g13': 'Bosco del Lupo in the snow: the track and the forest turn white',
    'g14': 'Living terrain at Mesa Grande: ruts dug by the wheels lap after lap',
    'g15': 'Tonezzer’s Volcano at night: the lava lake in the crater',
    'c.p': 'The flagship game, now at version 3.5 “Ups and downs”: twelve reworked circuits, eleven hill climbs, Stage Rally, Elimination, Demolition Derby and online leaderboards, with a real night, weather, seven vehicles and the Tonezzer Garage. The Tonezzer Cup won’t win itself.',
    'ft.press': 'Press kit',
    'ft.pressNote': 'ZIP · images, logos, trailer, texts',
    // strings used only by this script
    'js.img': 'Image', 'js.pause': 'Pause the images', 'js.resume': 'Resume the images',
    'js.musicPause': 'Pause', 'js.musicNA': 'Soundtrack unavailable'
  };
  const IT = { 'js.img': 'Immagine', 'js.pause': 'Metti in pausa le immagini', 'js.resume': 'Riprendi le immagini',
    'js.musicPause': 'Pausa', 'js.musicNA': 'Colonna sonora non disponibile' };
  const LANGS = ['it', 'en'], STORE = 'ta-lang', root = document.documentElement;
  const tNodes = $$('[data-i18n]'), aNodes = $$('[data-i18n-attr]'), hooks = [];
  const attrs = (el) => el.dataset.i18nAttr.split(';').map((p) => p.split('=').map((x) => x.trim())).filter((p) => p.length === 2 && p[0] && p[1]);
  tNodes.forEach((el) => { const k = el.dataset.i18n; if (!(k in IT)) IT[k] = el.tagName === 'TITLE' ? el.textContent : el.innerHTML; });
  aNodes.forEach((el) => attrs(el).forEach(([a, k]) => { if (!(k in IT)) IT[k] = el.getAttribute(a) || ''; }));
  let lang = 'it';
  const t = (k) => { const d = lang === 'en' ? EN : IT; return k in d ? d[k] : k in IT ? IT[k] : k; };

  function pick() {
    let q = null; try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* old browser */ }
    if (LANGS.includes(q)) return q;
    let s = null; try { s = localStorage.getItem(STORE); } catch (e) { /* storage blocked */ }
    if (LANGS.includes(s)) return s;
    const nl = (navigator.languages && navigator.languages[0]) || navigator.language || 'it';
    return /^it\b/i.test(nl) ? 'it' : 'en';
  }
  function apply(l) {
    lang = LANGS.includes(l) ? l : 'it';
    root.lang = lang;
    tNodes.forEach((el) => {
      const v = t(el.dataset.i18n);
      if (el.tagName === 'TITLE') document.title = v; else if (el.innerHTML !== v) el.innerHTML = v;
    });
    aNodes.forEach((el) => attrs(el).forEach(([a, k]) => el.setAttribute(a, t(k))));
    $$('.lang [data-lang]').forEach((a) => a.setAttribute('aria-current', a.dataset.lang === lang ? 'true' : 'false'));
    // "Play now" opens the game in the page's language (the game reads ?lang=, then the same 'ta-lang' choice)
    $$('a[href^="games/tonezzer-racers/"]').forEach((a) => a.setAttribute('href', 'games/tonezzer-racers/?lang=' + lang));
    hooks.forEach((f) => f());
    root.classList.remove('i18n-wait');
  }
  apply(pick());
  $$('.lang [data-lang]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const l = a.dataset.lang;
    try { localStorage.setItem(STORE, l); } catch (err) { /* not saved, still switches */ }
    try { // keep an explicit ?lang= in the address in step with the choice
      const u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); history.replaceState(history.state, '', u.href); }
    } catch (err) { /* ignore */ }
    if (l !== lang) apply(l);
  }));

  /* ---------------- hero gallery ---------------- */
  const slides = $$('#slides .slide'), dots = $('#dots'), cap = $('#slide-cap'), pp = $('#slide-pp');
  let cur = 0, timer = 0, paused = reduce;
  const load = (i) => { const im = slides[i] && $('img', slides[i]); if (im && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute('data-src'); } };
  const capOf = (i) => ($('figcaption', slides[i]) || {}).textContent || '';
  function show(i) {
    i = (i + slides.length) % slides.length; load(i); load((i + 1) % slides.length);
    slides[cur].classList.remove('on'); slides[i].classList.add('on'); cur = i;
    $$('button', dots).forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    if (cap) cap.textContent = capOf(i);
  }
  function arm() { clearTimeout(timer); if (!paused && !document.hidden) timer = setTimeout(() => { show(cur + 1); arm(); }, 6000); }
  if (slides.length > 1 && dots) {
    slides.forEach((s, k) => {
      const b = document.createElement('button'); b.type = 'button';
      b.addEventListener('click', () => { show(k); arm(); }); dots.appendChild(b);
    });
    const labelPP = () => pp.setAttribute('aria-label', t(paused ? 'js.resume' : 'js.pause'));
    const relabel = () => {
      $$('button', dots).forEach((b, k) => b.setAttribute('aria-label', t('js.img') + ' ' + (k + 1) + ': ' + capOf(k)));
      if (cap) cap.textContent = capOf(cur);
      labelPP();
    };
    show(0);
    const setPaused = (p) => { paused = p; pp.classList.toggle('paused', p); pp.setAttribute('aria-pressed', p ? 'true' : 'false'); labelPP(); arm(); };
    pp.addEventListener('click', () => setPaused(!paused));
    setPaused(paused);
    relabel(); hooks.push(relabel);
    document.addEventListener('visibilitychange', arm);
    window.addEventListener('load', () => setTimeout(() => slides.forEach((s, k) => load(k)), 1500)); // the rest, after the page
  } else if (pp) pp.hidden = true;

  /* ---------------- soundtrack preview ---------------- */
  const audio = $('#theme'), mbtns = $$('[data-music]'), bar = $('#music-bar'), song = $('.feat.song');
  let musicNA = false;
  function sync() {
    const on = !musicNA && audio && !audio.paused && !audio.ended;
    mbtns.forEach((b) => {
      const l = $('.lbl', b);
      b.classList.toggle('playing', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      l.textContent = musicNA ? t('js.musicNA') : on ? t('js.musicPause') : t(l.dataset.i18n);
    });
    if (song) song.classList.toggle('playing', on);
  }
  if (audio) {
    mbtns.forEach((b) => b.addEventListener('click', () => {
      if (audio.paused) { audio.volume = 0.8; const p = audio.play(); if (p && p.catch) p.catch(() => {}); } else audio.pause();
    }));
    ['play', 'pause', 'ended'].forEach((e) => audio.addEventListener(e, sync));
    audio.addEventListener('timeupdate', () => { if (bar && audio.duration) bar.style.width = (100 * audio.currentTime / audio.duration).toFixed(2) + '%'; });
    audio.addEventListener('error', () => { musicNA = true; mbtns.forEach((b) => { b.disabled = true; }); sync(); });
    hooks.push(sync);
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

  /* ---------------- trailer: a muted preview loop (loaded only near the viewport, never with reduced motion), the full
     trailer with sound on click ---------------- */
  const tv = $('#tv'), tvv = $('#tv-video'), tvb = $('#tv-play');
  if (tv && tvv && tvb) {
    let full = false, armed = false;
    const arm = () => { if (armed) return; armed = true; const vp9 = tvv.canPlayType && tvv.canPlayType('video/webm; codecs="vp9"'); tvv.src = vp9 ? tvv.dataset.loopWebm : tvv.dataset.loopMp4; };
    const playLoop = () => { if (full || reduce) return; arm(); const p = tvv.play(); if (p && p.catch) p.catch(() => {}); };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => { if (full) return; if (e.isIntersecting) playLoop(); else if (armed && !tvv.paused) tvv.pause(); }), { rootMargin: '150px 0px' }).observe(tv);
    }
    tvb.addEventListener('click', () => {
      full = true; tv.classList.add('full');
      tvv.loop = false; tvv.removeAttribute('loop'); tvv.muted = false; tvv.controls = true; tvv.preload = 'auto';
      tvv.poster = tvv.dataset.fullPoster; tvv.src = (lang === 'en' && tvv.dataset.fullEn) || tvv.dataset.full; // English cards in the English trailer tvv.setAttribute('aria-label', t('tv.play'));
      if (audio && !audio.paused) audio.pause();
      const p = tvv.play(); if (p && p.catch) p.catch(() => {});
      try { tvv.focus({ preventScroll: true }); } catch (e) { /* old browser */ }
    });
    tvv.addEventListener('play', () => { if (full && audio && !audio.paused) audio.pause(); });
    if (audio) audio.addEventListener('play', () => { if (full && !tvv.paused) tvv.pause(); });
  }

  const y = $('#year'); if (y) y.textContent = String(Math.max(2026, new Date().getFullYear()));

  /* v3.4: the anonymous visit counter (js/visit.js, copied here by tools/build-site.js with the game's js/online-config.js): one
     call per page load with the page language; nothing without a configuration, offline, with Do Not Track, for bots */
  try { if (window.ORS && window.ORS.Visit) window.ORS.Visit.log('site', lang, ''); } catch (e) { /* silent */ }
})();
