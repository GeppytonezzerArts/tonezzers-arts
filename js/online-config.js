/* Tonezzer Racers (© Tonezzer's Arts) — online leaderboard: configuration (docs/ONLINE.md, docs/SUPABASE-SETUP-IT.md).
   v3.4: ACTIVE (owner decision 2026-11-02): the Supabase project «ahqjofhlyvborqqpsopf». Its database is the whole of
   supabase/schema.sql, pasted in the project's SQL Editor (run it again after a game update that changes courses or rallies).
   The key below is the project's PUBLISHABLE key: public by design (it ships in every copy of the game). It goes in the `apikey`
   header only (js/online.js); the database only accepts scores through the submit_score function (checks, rate limits) and only
   shows public columns. Never put the secret / service_role key or the database password here.
   Empty url / anonKey = the online leaderboard is off (the v3.0–v3.3 releases): local boards only, no network request at all,
   nothing about "online" on screen — the menu tile «Record» opens «I tuoi record». */
'use strict';
window.ORS = window.ORS || {};
window.ORS.ONLINE_CONFIG = {
  provider: 'supabase',
  url: 'https://ahqjofhlyvborqqpsopf.supabase.co',
  anonKey: 'sb_publishable_LBbBU5ZtGEJQEQJEP9xWAQ_3Sq9U6qi',
};
