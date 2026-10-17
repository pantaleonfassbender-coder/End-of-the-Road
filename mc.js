/* End of the Road — bots for calibration (node mc.js [games]). Not a score. */
"use strict";
const E = require("./engine.js"); E.init(require("./data/deck.json"));
const BOTS = {
  record: { road: "yes", island: "welcome", hire: "scout", beach: "yes", fishing: "residents", press: "company", lunch: "yes", set: "ranch", policy: "open" },
  guarded: { road: "terms", island: "restore", hire: "notice", beach: "no", fishing: "residents", press: "company", lunch: "no", set: "ranch", policy: "residents" },
  booster: { road: "yes", island: "welcome", hire: "notice", beach: "yes", fishing: "residents", press: "road", lunch: "yes", set: "keep", policy: "deputies" },
  refuse: { road: "no", island: "object", hire: "none", beach: "no", fishing: "anyone", press: "company", lunch: "no", set: "ranch", policy: "residents" },
};
function play(b, seed) { const S = E.newGame({ seed }), o = BOTS[b]; for (let i = 0; i < 20 && !S.ended; i++) { E.setPolicy(S, o.policy); for (const q of S.pending.slice()) E.decide(S, q, o[q]); E.endWeek(S); } return S; }
function bench(n) { const out = {}; for (const b of Object.keys(BOTS)) { const rs = []; for (let k = 1; k <= n; k++) rs.push(E.reckoning(play(b, k * 29 + b.length)));
  const avg = f => Math.round(rs.reduce((a, R) => a + f(R), 0) / n * 100) / 100; out[b] = { quiet: avg(R => R.quiet), chance: avg(R => R.chance), prod: avg(R => R.prod), money: avg(R => R.money), visitors: avg(R => R.visitors), lostDays: avg(R => R.lostDays) }; } return out; }
if (require.main === module) { const r = bench(+(process.argv[2] || 200)); for (const k in r) console.log(k, JSON.stringify(r[k])); }
module.exports = { play, bench };
