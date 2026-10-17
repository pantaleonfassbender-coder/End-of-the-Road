/* End of the Road — the rules, without the page. Browser (window.EOR) and Node (module.exports).
   Yankeetown, Florida, in the six weeks of summer 1961 when a film company came to the end of State Road 40.

   Rules enforced here:
   - the film is made whatever the town decides: the choices change what the town lives through and keeps;
   - nobody gets hurt by chance: crowds cost the town its quiet, never a life or a limb;
   - the star is never a character: no words or deeds are invented for him;
   - there is no score: the end puts the town's six weeks beside what the reports and memories say. */
"use strict";
(function (root) {
  let D = null;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const T = () => D.tuning;
  const rngOf = S => { const r = mulberry32((S.seed + 0x9E3779B9 * (S.week + 1)) >>> 0); return () => r(); };
  const say = (S, kind, text, src) => S.log.push({ week: S.week, kind, text, src: src || "" });

  function newGame(opts) {
    opts = opts || {};
    const seed = opts.seed != null ? opts.seed >>> 0 : (Math.random() * 2 ** 32) >>> 0;
    const st = T().start;
    return { seed, week: 0, quiet: st.quiet, chance: st.chance, prod: st.prod, money: 0, visitors: 0, lostDays: 0, closedDays: 0,
      hires: 1, policy: "open", choices: {}, pending: D.prologue.map(p => p.id), history: [], log: [], ended: false };
  }
  const findQ = id => D.prologue.find(p => p.id === id) || (D.events[id] ? { id, ...D.events[id] } : null);
  function apply(S, o) {
    S.quiet = clamp(S.quiet + (o.quiet || 0), 0, 1); S.chance = clamp(S.chance + (o.chance || 0), 0, 1); S.prod = clamp(S.prod + (o.prod || 0), 0, 1);
    S.money += o.money || 0; if (o.hires) S.hires = o.hires;
  }
  function decide(S, id, value) {
    const q = findQ(id); if (!q || !S.pending.includes(id)) return;
    const o = q.options.find(x => x.value === value); if (!o) return;
    S.choices[id] = value; S.pending = S.pending.filter(x => x !== id); apply(S, o);
    say(S, "decision", `${q.short ? q.short + ": " : ""}${o.label.charAt(0).toLowerCase() + o.label.slice(1)}.`, o.src === "ass" ? "" : o.src);
  }
  function setPolicy(S, id) { if (D.policies.some(p => p.id === id)) S.policy = id; }

  /* start the next week: its text and its question */
  function begin(S) {
    const w = D.weeks[S.week - 1]; if (!w) return;
    say(S, "record", w.text, w.src);
    if (w.event) S.pending.push(w.event);
  }
  function endWeek(S) {
    if (S.ended || S.pending.length) return;
    if (S.week === 0) {                       // the prologue is answered; the summer starts
      S.week = 1; begin(S);
      if (S.choices.road === "no") say(S, "town", "The company films its road scenes on another stretch of highway, outside Yankeetown, and comes to the town only for the island.", "ass");
      return;
    }
    const r = rngOf(S), w = D.weeks[S.week - 1], tu = T(), pol = D.policies.find(p => p.id === S.policy);
    const draw = (S.choices.road === "no" ? 0.6 : 1) * (S.choices.press === "road" ? 1.1 : 1);
    const crowd = w.crowd * draw * (0.8 + 0.4 * r());
    const visitors = Math.round(tu.visitorsPerWeek * crowd);
    const here = 1 - w.away;
    // the crowds and the town's quiet
    const pressure = crowd * here * (1 - pol.manage);
    S.quiet = clamp(S.quiet - tu.quietLoss * pressure + tu.drift * (0.75 - S.quiet) * (1 - here), 0, 1);
    // what the town earns: visitors who stop, the people hired
    const spend = visitors * tu.visitorSpend * (pol.spend ?? 1) * here;
    const wages = S.week <= 4 ? tu.hireMoney * S.hires * here : 0;
    const cost = pol.cost;
    S.money += Math.round(spend + wages - cost);
    S.chance = clamp(S.chance + tu.chanceGain * crowd * here * (pol.spend ?? 1) - (S.choices.road === "no" ? 0.02 : 0), 0, 1);
    // summer storms: lost shooting days; the company's patience
    let lost = 0; if (r() < w.storm) lost = tu.stormDays[0] + Math.floor(r() * (tu.stormDays[1] - tu.stormDays[0] + 1));
    S.lostDays += lost;
    const closed = S.policy === "residents" ? Math.round(5 * here) : 0; S.closedDays += closed;
    S.prod = clamp(S.prod - tu.lostDayProd * lost + (S.policy === "deputies" ? 0.02 : 0) - (S.policy === "residents" ? 0.01 : 0), 0, 1);
    S.visitors += visitors;
    const parts = [`About ${visitors.toLocaleString("en-US")} visitors came to see${here < 0.6 ? ", though the company was away much of the week" : ""}`];
    parts.push(S.policy === "open" ? "the bridge stayed open between takes and the cars crept past the set" : S.policy === "residents" ? "the road beyond town was closed to all but residents while the cameras ran" : "deputies and volunteers kept the cars moving");
    if (lost) parts.push(`afternoon thunderstorms cost the company ${lost} shooting day${lost > 1 ? "s" : ""}`);
    parts.push(`the town and its people took in about $${Math.round(spend + wages).toLocaleString("en-US")}${cost ? `, and paid $${cost} for traffic duty` : ""}`);
    say(S, "town", parts.join("; ") + ".", "ass");
    S.history.push({ week: S.week, visitors, spend: Math.round(spend), wages: Math.round(wages), cost, lost, quiet: +S.quiet.toFixed(2), chance: +S.chance.toFixed(2), prod: +S.prod.toFixed(2), policy: S.policy });
    S.week++;
    if (S.week > D.weeks.length) { S.ended = true; say(S, "end", "The company has gone. The town counts what the summer left.", ""); return; }
    begin(S);
  }
  function status(S) { return { week: S.week, label: S.week ? D.weeks[S.week - 1].label : "June 1961 · the company's requests", quiet: S.quiet, chance: S.chance, prod: S.prod, money: S.money, visitors: S.visitors, pending: S.pending.slice(), policy: S.policy, last: S.history[S.history.length - 1] }; }
  function reckoning(S) { return { quiet: S.quiet, chance: S.chance, prod: S.prod, money: S.money, visitors: S.visitors, lostDays: S.lostDays, closedDays: S.closedDays, choices: S.choices }; }
  function question(id) { return findQ(id); }
  function init(deck) { D = deck; }
  const API = { init, newGame, decide, setPolicy, endWeek, status, reckoning, question };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.EOR = API;
})(typeof window !== "undefined" ? window : globalThis);
