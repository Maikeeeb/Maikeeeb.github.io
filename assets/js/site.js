/* Page behaviour for the portfolio. Content lives in content.js; the WashProof replica and demos in their own files. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const P = id => PROJECTS.find(p => p.id === id);
  const img = f => "images/" + f, vid = f => "media/" + f;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------- theme ---------- */
  const root = document.documentElement;
  if (store.get("theme")) root.dataset.theme = store.get("theme");
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const syncTheme = () => $("#theme").setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  $("#theme").addEventListener("click", () => { const n = isDark() ? "light" : "dark"; root.dataset.theme = n; store.set("theme", n); syncTheme(); });
  syncTheme();

  /* ---------- phone menu ---------- */
  const menu = $("#menu"), mbtn = $("#menu-btn");
  const setMenu = on => { menu.classList.toggle("on", on); mbtn.setAttribute("aria-expanded", on); if (on) menu.querySelector("a").focus(); };
  mbtn.addEventListener("click", () => setMenu(!menu.classList.contains("on")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", e => { if (menu.classList.contains("on") && !e.target.closest("#menu,#menu-btn")) setMenu(false); });

  /* ---------- hero ---------- */
  $("#stack3").innerHTML = ["relicworks", "tft", "washproof"].map(id => { const p = P(id);
    return `<a href="${id === "washproof" ? "#washproof" : "#work/" + id}" aria-label="${esc(p.title)}"><img src="${img(p.visual.img)}" alt="Screenshot of ${esc(p.title)}"></a>`; }).join("");
  $("#ticker").innerHTML = [[String(PROJECTS.length), "projects, each with how it was built"], ["693", "WashProof commits of mine"], ["1,505", "backend tests on it"], ["2026", "B.Sc. Computer Science"]]
    .map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");

  /* ---------- WashProof replica ---------- */
  const wp = P("washproof");
  const app = WashProofApp.mount($("#wp"), { height: "min(620px, 80vh)" });
  const RULES = {
    start: ["Live replica", "Tap a bus to start.", "This copies WashProof's real screens and rules with fictional data. Pick a button to trigger a rule, or work a bus from queue to invoice."],
    "staged:stale": ["Set up", "Someone else just saved this record.", "Your screen is now out of date. Press Edit, then Save, or the invoice button, and watch what happens."],
    "staged:freeze": ["Set up", "It's now 24 hours later.", "This record has frozen. Press Edit, then Save, and see how the system handles a late change."],
    conflict: ["Optimistic concurrency", "Stale saves get a 409, not an overwrite.", "Every update carries the version it was loaded at. EF Core checks it on write, so two supervisors can't silently erase each other's changes."],
    rejected: ["Forward-only states", "You can't invoice what nobody reviewed.", "Unreviewed → Reviewed → Invoiced → Locked. The API rejects skipped steps, so billing can't bypass review."],
    frozen: ["24-hour freeze", "Old records don't change. They get corrections.", "Completed records freeze a day later. Edits become append-only corrections with a reason, recorded in a SHA-256 hash-chained audit log that a database trigger protects."],
    forbidden: ["Server-side role checks", "Hiding a button isn't security.", "The kiosk never shows invoice controls, and the API refuses anyway. Lock is Admin-only."],
    replay: ["Idempotency keys", "Two taps, one record.", "A retried request with the same key gets the stored response back. The record, its audit entry and the replay are saved in one transaction."],
    submitted: ["Attributed sign-off", "Completion records who and when.", "The record now waits in the supervisor's review queue. Switch user to review it."],
    partial: ["Complete means complete", "A skipped service keeps the record open.", "Every required service has to be Done before a record can enter review."],
    saved: ["Version check passed", "Saved, version bumped.", "The save carried the current version, so it went through and the history gained an update event."],
    reviewed: ["Review step", "Reviewed by a supervisor.", "Next comes invoicing. Locking is Admin-only, so try that too."],
    invoiced: ["Review before billing", "Invoiced, with every step in history.", "Open History to see each transition, who made it and when."],
    history: ["Audit trail", "Every change is an event.", "In production the log is a per-company SHA-256 hash chain, verifiable through an admin endpoint."],
    reloaded: ["Recovered", "Reloaded the latest version.", "After a conflict the user reloads and retries. Nothing was merged silently."],
  };
  const ruleEl = $("#rule");
  function rule(k) { const r = RULES[k]; if (!r) return; ruleEl.innerHTML = `<span class="k">${r[0]}</span><h4>${r[1]}</h4><p>${r[2]}</p>`; ruleEl.classList.remove("flash"); void ruleEl.offsetWidth; ruleEl.classList.add("flash"); }
  rule("start");
  const done = new Set();
  const drawSteps = () => { $("#steps").innerHTML = WP_TRY.map(t => `<li class="${done.has(t.id) ? "done" : ""}"><span><b>${t.label}.</b> ${t.hint}${done.has(t.id) ? '<span class="sr"> (done)</span>' : ""}</span></li>`).join(""); };
  drawSteps();
  app.on((t, d) => { rule(t === "staged" ? "staged:" + d : t); WP_TRY.forEach(x => x.done.includes(t) && done.add(x.id)); drawSteps(); });
  $("#brk").innerHTML = WP_BREAK.map(b => `<button data-act="${b.act}">${b.label}<i aria-hidden="true">→</i></button>`).join("");
  $("#brk").addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (!b) return; app.act(b.dataset.act); b.classList.add("hit"); if (innerWidth < 1040) $(".device").scrollIntoView({ block: "center", behavior: "smooth" }); });
  $("#big").innerHTML = [["766", "commits · 693 mine"], ["248", "merged pull requests"], ["1,505", "backend tests"], ["96%", "line-coverage floor in CI"]].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");
  $("#credit").textContent = wp.credit + " Counted October 15, 2026.";

  /* ---------- covers: drawn art for projects without a capture ---------- */
  const TINT = { twitchclipper: "#d5fb45", agents: "#e3d1ff", riftbound: "#ffe9a8", tlibuilding: "#ffd6c9" };
  const ART = {
    twitchclipper: `<svg viewBox="0 0 320 180" preserveAspectRatio="none" aria-hidden="true">${Array.from({ length: 46 }, (_, i) => { const hh = 14 + 30 * Math.abs(Math.sin(i * 1.3)) + (i % 11 === 3 ? 90 : 0) + (i % 15 === 9 ? 70 : 0); return `<rect x="${8 + i * 6.8}" y="${170 - hh}" width="4.4" height="${hh}" rx="2" fill="#0f1012" opacity="${hh > 80 ? 1 : .3}"/>`; }).join("")}</svg>`,
    agents: `<svg viewBox="0 0 320 180" aria-hidden="true">${[0, 1, 2].map(r => `<g transform="translate(24 ${26 + r * 48})">${[0, 1, 2, 3, 4].map(k => `<rect x="${k * 56}" y="0" width="46" height="26" rx="13" fill="${k <= 3 - r ? "#0f1012" : "none"}" stroke="#0f1012" stroke-width="2"/>`).join("")}</g>`).join("")}</svg>`,
    riftbound: `<svg viewBox="0 0 320 180" aria-hidden="true">${[[60, 50], [130, 40], [200, 60], [260, 45], [90, 120], [170, 130], [240, 125]].map(([x, y], i, a) => a.slice(i + 1, i + 3).map(([x2, y2]) => `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#0f1012" stroke-width="${i % 3 ? 1.5 : 4}" opacity=".7"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${i % 3 ? 10 : 16}" fill="${i % 3 ? "#fff" : "#0f1012"}" stroke="#0f1012" stroke-width="2"/>`).join("")}</svg>`,
    tlibuilding: `<svg viewBox="0 0 320 180" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<rect x="30" y="${22 + i * 28}" width="${70 + ((i * 61) % 200)}" height="16" rx="8" fill="#0f1012" opacity="${i === 2 ? 1 : .3}"/>`).join("")}<path d="M222 72 l14 -10 l14 10" stroke="#0f1012" stroke-width="3" fill="none"/></svg>`,
  };
  const cover = p => p.visual.img ? `<img src="${img(p.visual.img)}" alt="" loading="lazy">` : ART[p.id] || "";
  const how = p => `<span class="how" data-b="${p.built}">${BUILT[p.built]}</span>`;

  /* ---------- work grid ---------- */
  const WIDE = { twitchclipper: 1, tft: 1 };
  const FL = [["all", "All"], ["backend", "Backend"], ["qa", "Testing"], ["ai", "AI tooling"], ["algorithms", "Algorithms"], ["fullstack", "Full-stack"]];
  let filt = "all";
  $("#seg").innerHTML = FL.map(([k, l]) => `<button data-f="${k}" aria-pressed="${k === "all"}">${l}</button>`).join("");
  $("#seg").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (!b) return; filt = b.dataset.f; $$("#seg button").forEach(x => x.setAttribute("aria-pressed", x === b)); drawBento(); });
  function drawBento() {
    const list = PROJECTS.slice(1).filter(p => filt === "all" || p.tags.includes(filt));
    $("#bento").innerHTML = list.map(p => `<a class="pc ${WIDE[p.id] && filt === "all" ? "w" : ""}" href="#work/${p.id}" data-p="${p.id}" style="--tint:${TINT[p.id] || "var(--surface-2)"}">
      <div class="cv">${cover(p)}</div>
      <div class="pb"><div class="m">${how(p)}${p.visual.widget ? `<span class="livechip">● Live demo</span>` : ""}<span>${p.kind} · ${p.year}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.tagline)}</p></div></a>`).join("")
      || `<p>No projects match this filter.</p>`;
  }
  drawBento();

  /* ---------- project sheet, addressable as #work/<id> ---------- */
  const sheet = $("#sheet"), scrim = $("#scrim");
  let returnFocus = null, order = [];
  function sheetHtml(p) {
    const i = order.indexOf(p.id);
    const media = p.visual.widget
      ? `<div data-widget="${p.visual.widget}"></div>${p.visual.img ? `<p class="stamp"><a href="${img(p.visual.img)}" target="_blank" rel="noopener">Real app screenshot ↗</a>${p.visual.video ? ` · <a href="${vid(p.visual.video)}" target="_blank" rel="noopener">recording ↗</a>` : ""}</p>` : ""}`
      : p.visual.video ? `<div class="media"><video src="${vid(p.visual.video)}" poster="${img(p.visual.img)}" controls preload="metadata" playsinline aria-label="Recording of ${esc(p.title)}"></video></div>${p.visual.imgNote ? `<p class="stamp">${esc(p.visual.imgNote)}</p>` : ""}`
      : p.visual.img ? `<div class="media"><img src="${img(p.visual.img)}" alt="Screenshot of ${esc(p.title)}"></div>`
      : `<div class="media" style="border-radius:14px;overflow:hidden;position:relative;aspect-ratio:16/9;background:${TINT[p.id] || "var(--surface-2)"}">${ART[p.id] || ""}</div><p class="stamp">No public capture yet. Walkthrough on request.</p>`;
    return `<div class="x"><nav aria-label="Other projects"><button aria-label="Previous project" data-nav="${order[(i - 1 + order.length) % order.length]}">←</button><button aria-label="Next project" data-nav="${order[(i + 1) % order.length]}">→</button></nav><span class="eyebrow">${i + 1} / ${order.length}</span><button aria-label="Close" id="sx">×</button></div>
      <div class="in"><div style="display:flex;gap:8px;flex-wrap:wrap">${how(p)}<span class="how" data-b="x" style="--c:var(--ink-3)">${esc(p.status)}</span></div>
      <h3 id="sheet-title">${esc(p.title)}</h3><p class="tl">${esc(p.tagline)}</p>${media}
      <p style="font-size:17px;margin:22px 0 0">${esc(p.summary)}</p>
      <ul class="pts">${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <dl style="margin:0"><div class="row"><dt>Role</dt><dd>${esc(p.role)}</dd></div><div class="row"><dt>Credit</dt><dd>${esc(p.credit)}</dd></div><div class="row"><dt>Stack</dt><dd>${p.stack.map(esc).join(" · ")}</dd></div></dl>
      <div class="cta">${p.repo ? `<a class="btn primary" href="${p.repo}" target="_blank" rel="noopener">Source on GitHub ↗</a>` : `<span class="how" data-b="x" style="--c:var(--ink-3)">${esc(p.repoNote || "Private repository")}</span>`}<a class="btn ghost" href="mailto:${PROFILE.email}?subject=${encodeURIComponent(p.title)}">Ask me about it</a></div></div>`;
  }
  function openSheet(id) {
    const p = P(id); if (!p || id === "washproof") return false;
    if (!sheet.classList.contains("on")) returnFocus = document.activeElement;
    order = $$("#bento [data-p]").map(b => b.dataset.p); if (!order.includes(id)) order = PROJECTS.slice(1).map(x => x.id);
    sheet.innerHTML = sheetHtml(p);
    sheet.classList.add("on"); scrim.classList.add("on"); sheet.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; sheet.scrollTop = 0;
    $$("[data-widget]", sheet).forEach(el => Widgets.mount(el, el.dataset.widget));
    document.title = `${p.title} — Charlotte Kerrigan`;
    $("#sx").focus();
    return true;
  }
  function closeSheet() {
    if (!sheet.classList.contains("on")) return;
    sheet.classList.remove("on"); scrim.classList.remove("on"); sheet.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    document.title = "Charlotte Kerrigan — Software Developer";
    const back = returnFocus && returnFocus !== document.body && document.contains(returnFocus) ? returnFocus : $(`#bento [data-p]`);
    back?.focus({ preventScroll: true }); returnFocus = null;
  }
  function route() {
    const m = location.hash.match(/^#work\/([a-z0-9-]+)$/);
    if (m && openSheet(m[1])) return;
    closeSheet();
  }
  const leaveSheet = () => { if (/^#work\//.test(location.hash)) history.pushState(null, "", "#work"); closeSheet(); };
  addEventListener("hashchange", route);
  addEventListener("popstate", route);
  document.addEventListener("click", e => {
    const n = e.target.closest("[data-nav]"); if (n) { location.hash = "#work/" + n.dataset.nav; return; }
    if (e.target.closest("#sx") || e.target === scrim) leaveSheet();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("on")) { setMenu(false); mbtn.focus(); return; }
    if (!sheet.classList.contains("on")) return;
    if (e.key === "Escape") { leaveSheet(); return; }
    const typing = /INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
    if (!typing && e.key === "ArrowRight" && !e.target.closest(".xw")) $$("[data-nav]", sheet)[1]?.click();
    if (!typing && e.key === "ArrowLeft" && !e.target.closest(".xw")) $$("[data-nav]", sheet)[0]?.click();
    if (e.key === "Tab") { // keep focus inside the open sheet
      const f = $$('a[href],button:not([disabled]),input,select,textarea,video,canvas,[tabindex]:not([tabindex="-1"])', sheet).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- play ---------- */
  const PLAY = [["astar", "Pathfinding", "2023 Java, rebuilt"], ["ddmin", "Delta debugging", "COSC 3P95"], ["beam", "Beam search", "TFT optimizer"], ["spikes", "Highlight finder", "TwitchClipper"]];
  let ptab = 0;
  $("#ptabs").innerHTML = PLAY.map(([, t, s], i) => `<button role="tab" id="ptab-${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}" aria-controls="ppanel" data-i="${i}">${t}<small>${s}</small></button>`).join("");
  function showPlay(i) {
    ptab = i; $$("#ptabs button").forEach((b, j) => { b.setAttribute("aria-selected", i === j); b.tabIndex = i === j ? 0 : -1; });
    $("#ppanel").setAttribute("aria-labelledby", "ptab-" + i);
    $("#ppanel").innerHTML = `<div data-widget="${PLAY[i][0]}"></div>`; Widgets.mount($("#ppanel [data-widget]"), PLAY[i][0]);
  }
  $("#ptabs").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) showPlay(+b.dataset.i); });
  $("#ptabs").addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const n = (ptab + (e.key === "ArrowRight" ? 1 : PLAY.length - 1)) % PLAY.length; showPlay(n); $("#ptabs").children[n].focus(); } });
  showPlay(0);

  /* ---------- stack explorer ---------- */
  const freq = {}; PROJECTS.forEach(p => p.stack.forEach(s => (freq[s] = freq[s] || []).push(p)));
  const techs = Object.keys(freq).sort((a, b) => freq[b].length - freq[a].length || a.localeCompare(b)); const max = freq[techs[0]].length; let tech = techs[0];
  function drawStack() {
    $("#cloud").innerHTML = techs.map(t => `<button style="--w:${((freq[t].length - 1) / Math.max(max - 1, 1) * 6).toFixed(2)}" aria-pressed="${t === tech}" data-t="${esc(t)}">${esc(t)}<sup>${freq[t].length}</sup></button>`).join("");
    const l = freq[tech].slice().sort((a, b) => b.sort - a.sort);
    $("#hits").innerHTML = `<p class="eyebrow">Used in ${l.length} project${l.length > 1 ? "s" : ""}</p><h3>${esc(tech)}</h3><ul>${l.map(p => `<li><a href="${p.id === "washproof" ? "#washproof" : "#work/" + p.id}">${esc(p.title)}<small>${BUILT[p.built]}</small></a></li>`).join("")}</ul>`;
  }
  $("#cloud").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) { tech = b.dataset.t; drawStack(); $(`#cloud [data-t="${CSS.escape(tech)}"]`).focus(); } });
  drawStack();

  /* ---------- path + contact ---------- */
  $("#exp").innerHTML = EXPERIENCE.map(x => `<div><em>${x.dates}</em><span><b>${esc(x.role)}</b>${esc(x.org)}${x.text ? ". " + esc(x.text) : ""}</span></div>`).join("");
  $("#earlier").innerHTML = EARLIER.map(([y, t, d]) => `<div><em>${y}</em><span><b>${esc(t)}.</b> ${esc(d)}</span></div>`).join("");
  $("#ainote").innerHTML = `<b>On AI-assisted work.</b> ${esc(PROFILE.ai)}`;
  $("#year").textContent = new Date().getFullYear();
  $("#copy").addEventListener("click", async () => {
    const b = $("#copy"); try { await navigator.clipboard.writeText(PROFILE.email); b.textContent = "Copied ✓"; } catch (e) { b.textContent = PROFILE.email; }
    setTimeout(() => (b.textContent = "Copy email"), 1600);
  });

  route();
})();
