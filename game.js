/* End of the Road — the page. Rules in engine.js (window.EOR); texts and numbers in data/. Nothing is stored. */
"use strict";
(function () {
  const ITCH_URL = "https://leofassb.itch.io/end-of-the-road";
  let D = null, PL = [], S = null;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const usd = v => "$" + Math.round(v).toLocaleString("en-US");
  const plate = (id, cls) => {
    const p = PL.find(x => x.id === id); if (!p) return "";
    return `<figure class="plate ${cls || ""}"><img src="${esc(p.src)}" alt="${esc(p.title.en)}" loading="lazy"><figcaption><b>${esc(p.title.en)}.</b> ${esc(p.caption.en)}<br><span class="cite">${esc(p.credit)}${p.licenseUrl ? ` · <a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener">licence</a>` : ""} · <a href="${esc(p.commons)}" target="_blank" rel="noopener">source</a></span></figcaption></figure>`;
  };
  const srcLabel = s => s === "ass" ? "game assumption" : s;
  const donate = () => ITCH_URL ? `<a class="buy" href="${ITCH_URL}" target="_blank" rel="noopener">Support this free game on itch.io</a>` : "";
  const meter = (label, v, note) => `<div class="meter"><span>${label}</span><div class="bar"><i style="width:${Math.round(v * 100)}%"></i></div><span class="fine">${note}</span></div>`;
  const word = v => v >= 0.8 ? "high" : v >= 0.6 ? "fair" : v >= 0.4 ? "uneasy" : v >= 0.2 ? "low" : "very low";
  const tag = s => s === "ass" ? "game assumption" : s === "memory" ? "a memory" : s === "secondary" ? "a later account" : "the record";

  function title() {
    S = null;
    $("#app").innerHTML = `<section class="title"><p class="tag">Yankeetown, Florida · summer 1961 · a free documentary game</p>
      <h1>End of the Road</h1><p class="sub">Six weeks when Hollywood came to a fishing town at the end of State Road 40.</p>
      <p>In July 1961 a film company arrived in Yankeetown, a town of a few hundred people on the Withlacoochee River where the only road ends at the Gulf. It was there to shoot <i>Follow That Dream</i>, a comedy about a family that settles on a strip of new highway nobody has opened yet, and its star was the most famous young man in America. The company painted the road, built a white beach on Pumpkin Island, hired local people to fish from the Bird Creek bridge with rubber fish, and brought crowds from all over Florida.</p>
      <p class="fine">You are the town: its council and the people who speak for it. First the company's requests, then six weeks of crowds, storms and questions, each with the answer the record gives and others it does not. Two voices are measured and neither wins: the town's quiet, and the town's chance. The film is made whatever you decide; what changes is what Yankeetown lives through and keeps. At the end your summer stands beside what the reports and memories say. The star of the film is never a character in this game: nobody puts words in his mouth.</p>
      <div class="row"><button class="big" id="go">Open the council meeting, June 1961</button><a href="guide.html">How to play</a><a href="#" id="watch">Watch the places today</a></div><p>${donate()}</p>
      ${plate("topo1955", "titleplate")}</section>`;
    $("#go").onclick = () => { S = EOR.newGame({}); render(); };
    $("#watch").onclick = e => { e.preventDefault(); watchPage(); };
  }

  function questionCard(id) {
    const q = EOR.question(id);
    return `<div class="panel decision"><span class="tag">${S.week ? "This week" : "The company asks"}</span><h3>${esc(q.prompt)}</h3>${q.note ? `<p class="fine">${esc(q.note)}</p>` : ""}
      ${q.options.map(o => `<button class="opt" data-q="${id}" data-v="${o.value}"><b>${esc(o.label)}</b><br><span class="fine">${esc(o.detail)} <i>(${tag(o.src)})</i></span></button>`).join("")}</div>`;
  }
  function render() {
    if (S.ended) return end();
    const st = EOR.status(S);
    const log = S.log.slice().reverse().slice(0, 14).map(l => `<p class="lg ${l.kind}"><span class="fine">${l.week ? "Week " + l.week : "June"}</span> ${esc(l.text)} ${l.src ? `<span class="src">${esc(srcLabel(l.src))}</span>` : ""}</p>`).join("");
    const pol = D.policies.map(p => `<label class="choice ${st.policy === p.id ? "on" : ""}"><input type="radio" name="pol" value="${p.id}" ${st.policy === p.id ? "checked" : ""}><b>${esc(p.label)}</b><br><span class="fine">${esc(p.detail)} <i>(${tag(p.src === "ass" ? "ass" : "rec")})</i></span></label>`).join("");
    const plates = ["road", "townsign", "inglis", "topo1955", "courthouse", "road"];
    $("#app").innerHTML = `<div class="top"><div><p class="tag">${esc(st.label)} · Yankeetown, Levy County</p><h2>The town and the film company</h2>
        <div class="stats"><span>visitors so far <b>${st.visitors.toLocaleString("en-US")}</b></span><span>taken in by the town and its people <b>${usd(st.money)}</b></span>${st.last ? `<span>last week <b>${st.last.visitors.toLocaleString("en-US")}</b> visitors</span>` : ""}</div>
        ${meter("The town's quiet", S.quiet, `the fishing town it was: ${word(S.quiet)}`)}${meter("The town's chance", S.chance, `what the summer can do for it: ${word(S.chance)}`)}
        <p class="fine">The company's patience with the town: ${word(S.prod)}.</p></div>
        <div class="row"><button id="tt" class="small">Title</button><button id="next" class="big" ${st.pending.length ? "disabled" : ""}>${S.week ? "On to the next week" : "Close the meeting: the company may come"}</button></div></div>
      ${st.pending.length ? questionCard(st.pending[0]) : ""}
      <div class="main"><div><div class="panel log"><h3>The summer so far</h3>${log || `<p class="fine">The council meets. The company's man has three requests.</p>`}</div></div>
        <div>${S.week ? `<div class="panel"><h3>The road to the Gulf this week</h3>${pol}</div>` : ""}
          ${plate(plates[S.week % plates.length])}</div></div>`;
    document.querySelectorAll("[data-q]").forEach(b => b.onclick = () => { EOR.decide(S, b.dataset.q, b.dataset.v); render(); });
    document.querySelectorAll("input[name=pol]").forEach(r => r.onchange = () => { EOR.setPolicy(S, r.value); render(); });
    $("#next").onclick = () => { EOR.endWeek(S); render(); window.scrollTo(0, 0); };
    $("#tt").onclick = () => title();
  }

  function end() {
    const R = EOR.reckoning(S);
    const yours = Object.entries(R.choices).map(([id, v]) => { const q = EOR.question(id), o = q.options.find(x => x.value === v); return `<li>${esc(o.label)}${o.src === "ass" ? ` <span class="fine">(not what the record shows)</span>` : ""}</li>`; }).join("");
    const rec = D.record.map(r => `<tr><td><b>${esc(r.what)}</b></td><td>${esc(r.text)}<br><span class="fine">${esc(r.src)}</span></td></tr>`).join("");
    $("#app").innerHTML = `<section class="end"><p class="tag">August 1961 · the company has gone</p><h1>What the summer left</h1>
      <div class="panel"><h3>Your six weeks</h3>
        <p>About <b>${R.visitors.toLocaleString("en-US")}</b> visitors came to the end of the road. The town and its people took in about <b>${usd(R.money)}</b>. Thunderstorms cost the company <b>${R.lostDays}</b> shooting days.${R.closedDays ? ` The road beyond town was closed to visitors on about ${R.closedDays} days.` : ""}</p>
        ${meter("The town's quiet", R.quiet, word(R.quiet))}${meter("The town's chance", R.chance, word(R.chance))}
        <p class="fine">The two voices are not added together and neither is a score. Visitors, money and storms are this game's assumptions; the record gives no counts for them.</p>
        <h4>What you decided</h4><ul>${yours}</ul></div>
      <div class="panel"><h3>What the reports and memories say</h3><table class="ttab">${rec}</table></div>
      <div class="panel"><h3>Readings</h3>${D.readings.map(r => `<h4>${esc(r.title)}</h4><p>${esc(r.text)}</p>`).join("")}</div>
      <div class="panel readable"><h3>Watch and listen</h3>${D.watch.groups.map(g => `<h4>${esc(g.label)}</h4><ul class="links">${g.links.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.t)}</a> <span class="fine">· ${esc(l.by)} · YouTube</span></li>`).join("")}</ul>`).join("")}<p class="fine">${esc(D.watch.note)}</p></div>
      <div class="panel readable"><h3>Afterwards</h3>${D.epilogue.map(p => `<p>${esc(p)}</p>`).join("")}${plate("courthouse")}</div>
      <div class="row"><button class="big" id="again">Hold the meeting again</button><button id="tt">Title page</button>${donate()}</div></section>`;
    $("#again").onclick = () => { S = EOR.newGame({}); render(); window.scrollTo(0, 0); };
    $("#tt").onclick = () => title();
    window.scrollTo(0, 0);
  }
  function watchPage() {
    $("#app").innerHTML = `<section class="end"><p class="tag">End of the Road</p><h1>Watch and listen</h1><div class="panel readable">${D.watch.groups.map(g => `<h4>${esc(g.label)}</h4><ul class="links">${g.links.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.t)}</a> <span class="fine">· ${esc(l.by)} · YouTube</span></li>`).join("")}</ul>`).join("")}<p class="fine">${esc(D.watch.note)}</p></div><div class="row"><button id="tt">Title page</button></div></section>`;
    $("#tt").onclick = () => title(); window.scrollTo(0, 0);
  }
  function foot() { $("#foot").innerHTML = `<p>End of the Road · free · © 2026 Pantaleon Fassbender. An independent local-history game; not affiliated with the film's makers or the estate of its star. Sources as cited; plates as credited. <a href="legal.html">Legal notice and privacy</a>${ITCH_URL ? ` · <a href="${ITCH_URL}" target="_blank" rel="noopener">itch.io</a>` : ""}</p>`; }

  Promise.all(["deck", "plates"].map(n => fetch(`data/${n}.json`).then(r => r.json()))).then(([d, p]) => {
    D = d; PL = p; EOR.init(D); foot();
    const demo = location.hash.match(/^#demo-(\d+)/);
    if (demo) { const rec = { road: "yes", island: "welcome", hire: "scout", beach: "yes", fishing: "residents", press: "company", lunch: "yes", set: "ranch" };
      S = EOR.newGame({ seed: 5 }); for (let i = 0; i < +demo[1] && !S.ended; i++) { for (const q of S.pending.slice()) EOR.decide(S, q, rec[q]); EOR.endWeek(S); } return S.ended ? end() : render(); }
    title();
  }).catch(e => { $("#app").innerHTML = `<p>Could not load the data: ${esc(e.message)}</p>`; });
})();
