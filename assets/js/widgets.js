/* Interactive project widgets. Browser re-implementations of ideas from Charlotte's projects, with illustrative data. */
(function () {
  const h = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rng = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const css = (el, v, d) => getComputedStyle(el).getPropertyValue(v).trim() || d;
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  class Heap { constructor(cmp) { this.a = []; this.c = cmp; } get size() { return this.a.length; }
    push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.c(a[i], a[p]) >= 0) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
    pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && this.c(a[l], a[m]) < 0) m = l; if (r < a.length && this.c(a[r], a[m]) < 0) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; } }

  /* ---------------- A* / weighted greedy (TwitchClipper-era Java A_Star port) ---------------- */
  function astar(el) {
    const W = 34, H = 20;
    let seed = 1113333, walls, start, end, mode = "mine", cw = 0, dw = 1, density = 0.3, anim = null, res = null, drag = null, paint = null;
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Pathfinding playground <small>port of my 2023 Java experiment</small></span>
      <span class="seg" role="group" aria-label="Algorithm"><button data-m="mine" aria-pressed="true">My 2023 rules</button><button data-m="astar" aria-pressed="false">Textbook A*</button></span></div>
      <div class="xh" style="background:none"><label class="sl">Cost weight <input type="range" min="0" max="1" step="0.1" value="0" data-k="cw"><output>0</output></label>
      <label class="sl">Distance weight <input type="range" min="0" max="2" step="0.1" value="1" data-k="dw"><output>1</output></label>
      <label class="sl">Walls <input type="range" min="0" max="0.45" step="0.05" value="0.3" data-k="density"><output>30%</output></label>
      <span style="margin-left:auto;display:flex;gap:6px"><button class="b" data-a="new">New board</button><button class="b" data-a="cmp">Compare both</button><button class="b p" data-a="run">Run ▶</button></span></div>
      <div class="xb"><canvas width="${W * 24}" height="${H * 24}" aria-label="Grid. Drag to draw walls, drag the start or goal to move them."></canvas></div>
      <div class="xf" aria-live="polite"></div>
      <div class="note">Drag on the grid to draw or erase walls; drag the green start or orange goal. “My 2023 rules” mirrors the original Java: 4-way moves, priority = trunc(g×cost + euclidean×distance), cells marked when discovered, early goal test. With cost 0 that is greedy best-first search: fast, not always shortest.</div></div>`;
    const cv = el.querySelector("canvas"), ctx = cv.getContext("2d"), foot = el.querySelector(".xf");
    function gen() {
      const r = rng(seed); walls = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) walls[i] = r() < density ? 1 : 0;
      const pick = () => { let i; do i = Math.floor(r() * W * H); while (walls[i]); return i; };
      start = pick(); do end = pick(); while (end === start); res = null; draw(); stats();
    }
    const nb = i => { const x = i % W, y = (i / W) | 0, o = []; if (x + 1 < W) o.push(i + 1); if (x > 0) o.push(i - 1); if (y > 0) o.push(i - W); if (y + 1 < H) o.push(i + W); return o; };
    const euc = (a, b) => Math.hypot(a % W - b % W, ((a / W) | 0) - ((b / W) | 0));
    const man = (a, b) => Math.abs(a % W - b % W) + Math.abs(((a / W) | 0) - ((b / W) | 0));
    function solve(m) {
      const order = [], prev = new Int32Array(W * H).fill(-1), g = new Float64Array(W * H).fill(Infinity);
      if (m === "mine") {
        const seen = new Uint8Array(W * H), q = new Heap((a, b) => a.f - b.f); g[start] = 0; seen[start] = 1; q.push({ i: start, f: 0 });
        while (q.size) { const n = q.pop(); order.push(n.i);
          for (const j of nb(n.i)) { if (walls[j] || seen[j]) continue; seen[j] = 1; prev[j] = n.i; g[j] = g[n.i] + 1;
            if (j === end) return { order, path: trace(prev), found: true };
            q.push({ i: j, f: Math.trunc(g[j] * cw + euc(j, end) * dw) }); } }
        return { order, path: [], found: false };
      }
      const closed = new Uint8Array(W * H), q = new Heap((a, b) => a.f - b.f || a.h - b.h); g[start] = 0; q.push({ i: start, f: man(start, end), h: man(start, end) });
      while (q.size) { const n = q.pop(); if (closed[n.i]) continue; closed[n.i] = 1; order.push(n.i); if (n.i === end) return { order, path: trace(prev), found: true };
        for (const j of nb(n.i)) { if (walls[j] || closed[j]) continue; const ng = g[n.i] + 1; if (ng < g[j]) { g[j] = ng; prev[j] = n.i; const hh = man(j, end); q.push({ i: j, f: ng + hh, h: hh }); } } }
      return { order, path: [], found: false };
    }
    function trace(prev) { const p = []; let c = end; while (c !== -1 && c !== start) { p.push(c); c = prev[c]; } return p.reverse(); }
    function draw(k = Infinity) {
      const s = cv.width / W, ink = css(el, "--x-ink", "#151515"), line = css(el, "--x-line", "#ddd"), acc = css(el, "--x-accent", "#2a44f5"), acc2 = css(el, "--x-accent2", "#e9572b"), good = css(el, "--x-good", "#1f8a4c"), bg = css(el, "--x-bg", "#fff");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height);
      if (res) { ctx.globalAlpha = 0.2; ctx.fillStyle = acc; res.order.slice(0, k).forEach(i => ctx.fillRect((i % W) * s, ((i / W) | 0) * s, s, s)); ctx.globalAlpha = 1; }
      if (res && k >= res.order.length) { ctx.fillStyle = acc; res.path.forEach(i => { ctx.beginPath(); ctx.arc((i % W) * s + s / 2, ((i / W) | 0) * s + s / 2, s * 0.26, 0, 7); ctx.fill(); }); }
      ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x++) { ctx.moveTo(x * s + .5, 0); ctx.lineTo(x * s + .5, cv.height); } for (let y = 0; y <= H; y++) { ctx.moveTo(0, y * s + .5); ctx.lineTo(cv.width, y * s + .5); } ctx.stroke();
      ctx.fillStyle = ink; for (let i = 0; i < W * H; i++) if (walls[i]) ctx.fillRect((i % W) * s + 1, ((i / W) | 0) * s + 1, s - 1, s - 1);
      const dot = (i, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect((i % W) * s + 3, ((i / W) | 0) * s + 3, s - 6, s - 6, 5); ctx.fill(); };
      dot(start, good); dot(end, acc2);
    }
    function stats(extra = "") {
      foot.innerHTML = res ? `<span>Cells explored <b>${res.order.length}</b></span><span>Path length <b>${res.found ? res.path.length + 1 : "—"}</b></span><span>${res.found ? "Goal reached" : "No route: the goal is walled off"}</span>${extra}` : `<span>Press <b>Run</b> to search. ${mode === "mine" ? "Cost weight 0 = greedy best-first." : "Textbook A*: f = g + Manhattan, closed set."}</span>`;
    }
    function run() {
      cancelAnimationFrame(anim); res = solve(mode);
      if (reduce()) { draw(); stats(); return; }
      let k = 0; const step = Math.max(2, Math.ceil(res.order.length / 70));
      const tick = () => { k += step; draw(k); if (k < res.order.length) anim = requestAnimationFrame(tick); else { draw(); stats(); } };
      tick();
    }
    el.querySelector(".xw").addEventListener("click", e => {
      const b = e.target.closest("[data-m],[data-a]"); if (!b) return;
      if (b.dataset.m) { mode = b.dataset.m; el.querySelectorAll("[data-m]").forEach(x => x.setAttribute("aria-pressed", x === b)); el.querySelectorAll("[data-k=cw],[data-k=dw]").forEach(x => x.disabled = mode !== "mine"); res = null; draw(); stats(); }
      if (b.dataset.a === "new") { seed = (seed * 7 + 13) >>> 0; gen(); }
      if (b.dataset.a === "run") run();
      if (b.dataset.a === "cmp") { cancelAnimationFrame(anim); const a = solve("mine"), t = solve("astar"); res = mode === "mine" ? a : t; draw(); stats(`<span style="flex-basis:100%">My rules: <b>${a.order.length}</b> cells, path <b>${a.found ? a.path.length + 1 : "—"}</b> · Textbook A*: <b>${t.order.length}</b> cells, shortest path <b>${t.found ? t.path.length + 1 : "—"}</b></span>`); }
    });
    el.querySelectorAll("input[type=range]").forEach(inp => inp.addEventListener("input", () => {
      const v = +inp.value; inp.nextElementSibling.textContent = inp.dataset.k === "density" ? Math.round(v * 100) + "%" : v;
      if (inp.dataset.k === "cw") cw = v; if (inp.dataset.k === "dw") dw = v; if (inp.dataset.k === "density") { density = v; gen(); } else if (res) run();
    }));
    const cell = e => { const r = cv.getBoundingClientRect(); const x = Math.floor((e.clientX - r.left) / r.width * W), y = Math.floor((e.clientY - r.top) / r.height * H); return x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x; };
    cv.addEventListener("pointerdown", e => { const i = cell(e); if (i < 0) return; cv.setPointerCapture(e.pointerId); if (i === start) drag = "s"; else if (i === end) drag = "e"; else { paint = walls[i] ? 0 : 1; walls[i] = paint; } res = null; draw(); stats(); });
    cv.addEventListener("pointermove", e => { if (!drag && paint === null) return; const i = cell(e); if (i < 0 || walls[i] && drag) return;
      if (drag === "s" && i !== end) start = i; else if (drag === "e" && i !== start) end = i; else if (paint !== null && i !== start && i !== end) walls[i] = paint; draw(); });
    addEventListener("pointerup", () => { drag = null; paint = null; });
    gen();
    new MutationObserver(() => draw()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------------- TwitchClipper chat spikes ---------------- */
  function spikes(el) {
    const N = 180, BUCKET = 10, r = rng(42);
    const bumps = [[22, 46, 2], [51, 30, 0], [88, 58, 4], [97, 26, 1], [131, 40, 3], [160, 34, 0]];
    const counts = [], kw = [];
    for (let i = 0; i < N; i++) { let c = 7 + r() * 7 + Math.sin(i / 9) * 2; let k = 0; for (const [at, amp, kwp] of bumps) { const d = i - at; c += amp * Math.exp(-d * d / 5); if (Math.abs(d) <= 1) k += kwp; } counts.push(Math.round(c)); kw.push(k); }
    let thr = 28, useKw = true, sel = -1;
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Highlight finder <small>TwitchClipper's chat-spike rules</small></span>
      <label class="sl">Spike threshold <input type="range" min="14" max="60" value="28" data-k="thr"><output>28</output></label>
      <label class="sl"><input type="checkbox" checked data-k="kw" style="width:auto"> Keyword bonus</label></div>
      <div class="xb"><canvas width="900" height="230" aria-label="Chat messages per 10-second window across a 30-minute stream"></canvas><div class="segs" aria-live="polite"></div></div>
      <div class="note">Illustrative chat data for a 30-minute stream. The backend buckets messages per window, flags windows at or above the threshold, pads them into segments, merges overlaps (capped at 120 s), then ranks by spike strength plus a capped keyword bonus.</div></div>`;
    const cv = el.querySelector("canvas"), ctx = cv.getContext("2d");
    function compute() {
      const hits = counts.map((c, i) => c >= thr ? i : -1).filter(i => i >= 0);
      let segs = hits.map(i => ({ a: (i - 2) * BUCKET, b: (i + 2) * BUCKET, peak: counts[i], kw: kw[i] }));
      segs.sort((x, y) => x.a - y.a); const m = [];
      for (const s of segs) { const l = m[m.length - 1]; if (l && s.a <= l.b && Math.max(l.b, s.b) - l.a <= 120) { l.b = Math.max(l.b, s.b); l.peak = Math.max(l.peak, s.peak); l.kw += s.kw; } else m.push({ ...s }); }
      m.forEach(s => s.score = s.peak + (useKw ? Math.min(s.kw * 3, 12) : 0));
      return m.sort((x, y) => y.score - x.score || x.a - y.a);
    }
    const fmt = t => `${Math.floor(Math.max(t, 0) / 60)}:${String(Math.max(t, 0) % 60).padStart(2, "0")}`;
    function draw() {
      const segs = compute(), w = cv.width, hgt = cv.height, pad = 22, bw = (w - pad) / N, max = 75;
      const ink3 = css(el, "--x-ink3", "#888"), acc = css(el, "--x-accent", "#2a44f5"), acc2 = css(el, "--x-accent2", "#e9572b"), line = css(el, "--x-line", "#ddd"), bg = css(el, "--x-bg", "#fff");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, hgt);
      segs.slice(0, 5).forEach((s, i) => { ctx.globalAlpha = i === sel ? 0.22 : 0.1; ctx.fillStyle = i === sel ? acc2 : acc; ctx.fillRect(pad + s.a / BUCKET * bw, 0, (s.b - s.a) / BUCKET * bw, hgt - 18); }); ctx.globalAlpha = 1;
      counts.forEach((c, i) => { const y = (hgt - 18) * (1 - c / max); ctx.globalAlpha = c >= thr ? 1 : 0.45; ctx.fillStyle = c >= thr ? acc : ink3; ctx.fillRect(pad + i * bw + .5, y, Math.max(bw - 1, 1), hgt - 18 - y); ctx.globalAlpha = 1; if (kw[i] && useKw) { ctx.fillStyle = acc2; ctx.fillRect(pad + i * bw, y - 5, Math.max(bw - 1, 2), 3); } });
      const ty = (hgt - 18) * (1 - thr / max); ctx.strokeStyle = acc2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(pad, ty); ctx.lineTo(w, ty); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ink3; ctx.font = "11px ui-monospace,monospace"; for (let m = 0; m <= 30; m += 5) ctx.fillText(m + "m", pad + m * 6 * bw - 6, hgt - 4);
      ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(pad, hgt - 18.5); ctx.lineTo(w, hgt - 18.5); ctx.stroke();
      el.querySelector(".segs").innerHTML = segs.length ? segs.slice(0, 5).map((s, i) => `<span tabindex="0" data-i="${i}" style="cursor:pointer">#${i + 1} ${fmt(s.a)}–${fmt(s.b)} · score <b>${s.score}</b></span>`).join("") + (segs.length > 5 ? `<span>+${segs.length - 5} more</span>` : "") : `<span>No windows reach the threshold. Lower it.</span>`;
    }
    el.addEventListener("input", e => { if (e.target.dataset.k === "thr") { thr = +e.target.value; e.target.nextElementSibling.textContent = thr; sel = -1; draw(); } if (e.target.dataset.k === "kw") { useKw = e.target.checked; draw(); } });
    el.addEventListener("click", e => { const s = e.target.closest("[data-i]"); if (s) { sel = +s.dataset.i; draw(); } });
    el.addEventListener("mouseover", e => { const s = e.target.closest("[data-i]"); if (s && +s.dataset.i !== sel) { sel = +s.dataset.i; draw(); } });
    draw(); new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------------- agentq review-gated lanes ---------------- */
  function lanes(el) {
    const STAGES = ["queued", "implementing", "checks", "reviewing", "approved", "delivered"];
    let jobs, logs, nextFinding, auto = null, n = 0;
    const sha = () => Math.random().toString(16).slice(2, 9);
    function reset() {
      jobs = [{ id: 12, t: "Add CSV export", lane: "A", st: 0, round: 1, sha: null, ver: 1 }, { id: 14, t: "Fix pagination bounds", lane: "B", st: 0, round: 1, sha: null, ver: 1 }, { id: 17, t: "Rate-limit login", lane: "A", st: -1, round: 1, sha: null, ver: 1 }];
      logs = [["", "Two lanes ready. Each alternates its own implementer and reviewer."]]; nextFinding = false; draw();
    }
    const log = (c, m) => { logs.unshift([c, m]); logs = logs.slice(0, 40); };
    function step() {
      for (const j of jobs) {
        if (j.st === -1) { if (!jobs.some(o => o.lane === j.lane && o !== j && o.st >= 0 && o.st < 5 && !o.paused && !o.refused)) { j.st = 0; log("", `lane ${j.lane} · #${j.id} claimed from queue`); } continue; }
        if (j.paused || j.refused || j.st >= 5) continue;
        if (j.st === 0) { j.st = 1; log("", `lane ${j.lane} · #${j.id} implementer started (round ${j.round})`); }
        else if (j.st === 1) { j.sha = sha(); j.st = 2; log("", `lane ${j.lane} · #${j.id} implementer pushed ${j.sha}`); }
        else if (j.st === 2) { j.st = 3; log("g", `lane ${j.lane} · #${j.id} harness checks passed on ${j.sha}`); }
        else if (j.st === 3) {
          if (nextFinding) { nextFinding = false; if (j.round >= 3) { j.paused = true; log("w", `lane ${j.lane} · #${j.id} paused: 3-round review budget used, needs a human`); } else { j.round++; j.st = 1; log("w", `lane ${j.lane} · #${j.id} reviewer requested changes, back to implementer (round ${j.round})`); } }
          else { j.st = 4; j.approved = j.sha; log("g", `lane ${j.lane} · #${j.id} reviewer approved exactly ${j.sha}`); }
        }
        else if (j.st === 4) {
          if (j.sha !== j.approved) { j.refused = true; log("r", `lane ${j.lane} · #${j.id} delivery refused: branch is ${j.sha}, reviewer approved ${j.approved}`); }
          else { j.st = 5; log("g", `lane ${j.lane} · #${j.id} PR opened for reviewed commit ${j.sha} (never main directly)`); }
        }
      }
      draw();
    }
    function draw() {
      const card = j => `<div class="job ${j.paused ? "paused" : j.refused ? "refused" : j.st >= 5 ? "done" : ""}"><b>#${j.id} ${h(j.t)}</b>
        <div class="st">${STAGES.slice(1).map((s, i) => `<i class="${j.refused && i === 3 ? "bad" : j.st > i + 1 || j.st >= 5 ? "ok" : j.st === i + 1 ? "on" : ""}" title="${s}"></i>`).join("")}</div>
        <div class="meta"><span>${j.st < 0 ? "waiting" : j.paused ? "paused for human" : j.refused ? "delivery refused" : STAGES[j.st]}</span><span>${j.sha || "—"} · r${j.round}/3</span></div></div>`;
      el.querySelector(".lanes").innerHTML = ["A", "B"].map(l => `<div class="lane"><h5><span>lane ${l}</span><span>implementer ⇄ reviewer</span></h5>${jobs.filter(j => j.lane === l).map(card).join("")}</div>`).join("");
      el.querySelector(".log").innerHTML = logs.map(([c, m]) => `<div class="${c}">${h(m)}</div>`).join("");
      el.querySelector("[data-a=finding]").textContent = nextFinding ? "Finding queued ✓" : "Reviewer finds an issue";
    }
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Review-gated agent lanes <small>agentq's delivery rules</small></span>
      <span style="display:flex;gap:6px;flex-wrap:wrap"><button class="b" data-a="finding">Reviewer finds an issue</button><button class="b" data-a="tamper">Push after approval</button><button class="b" data-a="reset">Reset</button><button class="b" data-a="auto">Auto ▶</button><button class="b p" data-a="step">Next step</button></span></div>
      <div class="xb"><div class="lanes"></div><div class="log" aria-live="polite"></div></div>
      <div class="note">Simulated in the browser. In agentq every transition is a version-checked SQLite transaction, agent processes run in their own process group so cancellation kills children, and errors never count as approval.</div></div>`;
    el.addEventListener("click", e => {
      const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
      if (a === "step") step();
      if (a === "reset") { clearInterval(auto); auto = null; el.querySelector("[data-a=auto]").textContent = "Auto ▶"; reset(); }
      if (a === "finding") { nextFinding = true; draw(); }
      if (a === "auto") { if (auto) { clearInterval(auto); auto = null; e.target.textContent = "Auto ▶"; } else { auto = setInterval(step, 900); e.target.textContent = "Pause ❚❚"; } }
      if (a === "tamper") { const j = jobs.find(x => x.st === 4); if (!j) { log("", "Nothing approved yet. Step until a reviewer approves, then try this."); draw(); return; } j.sha = sha(); log("w", `lane ${j.lane} · #${j.id} someone pushed ${j.sha} after approval`); draw(); }
    });
    reset();
  }

  /* ---------------- delta debugging (COSC 3P95) ---------------- */
  function ddmin(el) {
    const presets = ["abcdefG1", "1234567b", "8665", "pr0mpt-x9z"];
    const fails = s => /\d/.test(s); // the handed-out bug: any digit changes the output
    let input = presets[0], mode = "linear", steps = [], k = 0, timer = null;
    function linear(s) { const st = []; let cur = s, i = 0; while (i < cur.length) { const cand = cur.slice(0, i) + cur.slice(i + 1); const f = fails(cand); st.push({ cur, cand, rm: [i], f }); if (f) cur = cand; else i++; } st.push({ cur, done: true }); return st; }
    function dd(s) { const st = []; let cur = [...s].map((c, i) => ({ c, i })), n = 2;
      while (cur.length >= 2) { const size = Math.ceil(cur.length / n), parts = []; for (let i = 0; i < cur.length; i += size) parts.push(cur.slice(i, i + size)); let reduced = false;
        for (const p of parts) { const f = fails(p.map(x => x.c).join("")); st.push({ cur: cur.map(x => x.c).join(""), keep: p.map(x => x.i), all: cur.map(x => x.i), f, kind: "subset" }); if (f) { cur = p; n = 2; reduced = true; break; } }
        if (!reduced) for (const p of parts) { const comp = cur.filter(x => !p.includes(x)); const f = fails(comp.map(x => x.c).join("")); st.push({ cur: cur.map(x => x.c).join(""), keep: comp.map(x => x.i), all: cur.map(x => x.i), f, kind: "complement" }); if (f) { cur = comp; n = Math.max(n - 1, 2); reduced = true; break; } }
        if (!reduced) { if (n >= cur.length) break; n = Math.min(n * 2, cur.length); } }
      st.push({ cur: cur.map(x => x.c).join(""), done: true, keepIdx: cur.map(x => x.i) }); return st; }
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Delta debugging <small>shrink a failing input</small></span>
      <span class="seg" role="group" aria-label="Algorithm"><button data-m="linear" aria-pressed="true">My 2023 linear pass</button><button data-m="dd" aria-pressed="false">ddmin</button></span></div>
      <div class="xh" style="background:none"><span style="display:flex;gap:6px;flex-wrap:wrap">${presets.map(p => `<button class="b mono" data-p="${p}">${p}</button>`).join("")}</span><input class="txt" aria-label="Custom input" placeholder="your own…" maxlength="16"><span style="margin-left:auto;display:flex;gap:6px"><button class="b" data-a="step">Step</button><button class="b p" data-a="run">Run ▶</button></span></div>
      <div class="xb"><div class="chips"></div><div class="steps" aria-live="polite"></div></div>
      <div class="xf"></div><div class="note">The buggy function from the assignment misbehaves on any digit. Delta debugging keeps removing characters while the bug still reproduces. My original was a single left-to-right pass; ddmin (Zeller &amp; Hildebrandt) removes chunks first and refines.</div></div>`;
    function show() {
      const s = steps[Math.min(k, steps.length - 1)]; const chips = el.querySelector(".chips");
      if (!s) { chips.innerHTML = [...input].map(c => `<span>${h(c)}</span>`).join(""); el.querySelector(".xf").innerHTML = `<span>Input <b>${h(input)}</b> ${fails(input) ? `<span class="verdict f">fails</span>` : `<span class="verdict p">passes, nothing to shrink</span>`}</span>`; el.querySelector(".steps").innerHTML = ""; return; }
      if (mode === "linear") chips.innerHTML = s.done ? [...s.cur].map(c => `<span class="try">${h(c)}</span>`).join("") : [...s.cur].map((c, i) => `<span class="${s.rm.includes(i) ? "cut" : ""}">${h(c)}</span>`).join("");
      else { const keep = new Set(s.done ? s.keepIdx : s.keep); chips.innerHTML = [...input].map((c, i) => `<span class="${s.done ? (keep.has(i) ? "try" : "gone") : !s.all.includes(i) ? "gone" : keep.has(i) ? "try" : "cut"}">${h(c)}</span>`).join(""); }
      el.querySelector(".steps").innerHTML = steps.slice(0, k + 1).filter(x => !x.done).map((x, i) => `<div>${String(i + 1).padStart(2, "0")} test “${h(mode === "linear" ? x.cand : x.keep.map(j => input[j]).join(""))}” → ${x.f ? "still fails, keep it" : "passes, undo"}</div>`).reverse().join("");
      el.querySelector(".xf").innerHTML = `<span>Oracle calls <b>${steps.slice(0, k + 1).filter(x => !x.done).length}</b></span><span>${s.done ? `Minimal failing input <b>${h(s.cur)}</b>` : `Current <b>${h(s.cur)}</b>`}</span>`;
    }
    function load(s) { clearInterval(timer); input = s; steps = fails(s) ? (mode === "linear" ? linear(s) : dd(s)) : []; k = -1; show(); }
    el.addEventListener("click", e => {
      const p = e.target.closest("[data-p]"); if (p) { load(p.dataset.p); return; }
      const m = e.target.closest("[data-m]"); if (m) { mode = m.dataset.m; el.querySelectorAll("[data-m]").forEach(x => x.setAttribute("aria-pressed", x === m)); load(input); return; }
      const a = e.target.closest("[data-a]")?.dataset.a;
      if (a === "step" && steps.length) { k = Math.min(k + 1, steps.length - 1); show(); }
      if (a === "run" && steps.length) { clearInterval(timer); if (k >= steps.length - 1) k = -1; timer = setInterval(() => { k++; show(); if (k >= steps.length - 1) clearInterval(timer); }, reduce() ? 0 : 420); }
    });
    el.querySelector(".txt").addEventListener("change", e => { if (e.target.value) load(e.target.value.slice(0, 16)); });
    load(input);
  }

  /* ---------------- Apriori (Riftbound deck insights) ---------------- */
  function apriori(el) {
    const CARDS = [["Spark", "#e9572b"], ["Ward", "#2a44f5"], ["Echo", "#7a4fd6"], ["Drift", "#1f8a4c"], ["Rally", "#b77700"], ["Flare", "#c43d6b"], ["Anchor", "#3b7f86"], ["Veil", "#555"]];
    const DECKS = [[0, 1, 2, 4], [0, 1, 2, 5], [0, 1, 4, 6], [0, 2, 4, 7], [1, 2, 3, 6], [0, 1, 2, 4, 6], [0, 3, 5, 7], [0, 1, 2, 6], [1, 3, 4, 5], [0, 1, 2, 4, 7], [0, 2, 4, 6], [2, 3, 6, 7]];
    let minSup = 4, sel = null;
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Synergy mining <small>Apriori, as in my deck-insights tool</small></span>
      <label class="sl">Min. decks <input type="range" min="2" max="8" value="4" data-k="s"><output>4</output></label></div>
      <div class="xb ap"><div class="decks" aria-label="Twelve illustrative decks"></div><div><div class="levels"></div><p class="mono" style="font-size:12px;margin:10px 0 0;color:var(--_ink2)" aria-live="polite"></p></div></div>
      <div class="note">Twelve made-up decks. Apriori counts card sets level by level: a pair can only be frequent if both cards are, a triple only if all its pairs are, so most candidates are pruned before counting. The real tool mined 90,595 packages from 132 tournament decks, then scored them by win-rate lift.</div></div>`;
    const sup = set => DECKS.filter(d => set.every(c => d.includes(c))).length;
    function mine() {
      const L = [], pruned = [];
      let cur = CARDS.map((_, i) => [i]).map(s => ({ s, n: sup(s) }));
      L.push(cur); pruned.push([]);
      for (let k = 2; k <= 3; k++) {
        const freq = L[k - 2].filter(x => x.n >= minSup).map(x => x.s), key = s => s.join(","), fset = new Set(freq.map(key)), cands = [], pr = [];
        for (let i = 0; i < freq.length; i++) for (let j = i + 1; j < freq.length; j++) {
          const a = freq[i], b = freq[j]; if (a.slice(0, -1).join() !== b.slice(0, -1).join()) continue;
          const c = [...a, b[b.length - 1]].sort((x, y) => x - y);
          const subsOk = c.every((_, d) => fset.has(key(c.filter((__, e) => e !== d))));
          (subsOk ? cands : pr).push(c);
        }
        L.push(cands.map(s => ({ s, n: sup(s) }))); pruned.push(pr);
      }
      return { L, pruned };
    }
    function draw() {
      const { L, pruned } = mine(), name = s => s.map(i => CARDS[i][0]).join("+");
      el.querySelector(".decks").innerHTML = DECKS.map((d, i) => `<div class="deck ${sel && sel.every(c => d.includes(c)) ? "hit" : ""}"><em>D${i + 1}</em>${d.map(c => `<i style="background:${CARDS[c][1]}" title="${CARDS[c][0]}">${CARDS[c][0][0]}</i>`).join("")}</div>`).join("");
      el.querySelector(".levels").innerHTML = ["Singles", "Pairs", "Triples"].map((t, k) => `<div><h6>${t}</h6>${(() => { const all = L[k].sort((a, b) => b.n - a.n), fq = all.filter(x => x.n >= minSup), lo = all.filter(x => x.n < minSup); return [...fq, ...lo.slice(0, 3)]; })().map(x => `<button data-s="${x.s.join(",")}" class="${x.n < minSup ? "pr" : ""} ${sel && sel.join() === x.s.join() ? "on" : ""}" title="${name(x.s)} in ${x.n} decks"><span>${k ? x.s.map(i => CARDS[i][0].slice(0, 2)).join("+") : CARDS[x.s[0]][0]}</span><span>${x.n}</span></button>`).join("")}${L[k].filter(x => x.n < minSup).length > 3 ? `<div class="mono" style="font-size:11px;color:var(--_ink3)">+${L[k].filter(x => x.n < minSup).length - 3} below threshold</div>` : ""}${pruned[k].length ? `<div class="mono" style="font-size:11px;color:var(--_ink3)">${pruned[k].length} pruned unseen</div>` : ""}</div>`).join("");
      const freqAll = L.flat().filter(x => x.n >= minSup).length, counted = L.flat().length, skipped = pruned.flat().length;
      el.querySelector("p").textContent = sel ? `${name(sel)} appears together in ${sup(sel)} of ${DECKS.length} decks.` : `${freqAll} frequent sets · ${counted} counted · ${skipped} skipped without counting. Select a set to see its decks.`;
    }
    el.addEventListener("input", e => { if (e.target.dataset.k === "s") { minSup = +e.target.value; e.target.nextElementSibling.textContent = minSup; draw(); } });
    el.addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b && !b.classList.contains("pr")) { const s = b.dataset.s.split(",").map(Number); sel = sel && sel.join() === s.join() ? null : s; draw(); } });
    draw();
  }

  /* ---------------- Beam search (TFT comp optimizer) ---------------- */
  function beam(el) {
    const T = ["Guard", "Arcane", "Swift", "Forge", "Wild"];
    const U = [["Bastion", [0, 3], 9], ["Mira", [1, 2], 8], ["Kael", [1, 4], 7], ["Thorn", [0, 4], 6], ["Vex", [2, 3], 6], ["Oro", [3, 4], 5], ["Lumi", [1, 0], 5], ["Pike", [2, 4], 4], ["Sable", [3, 1], 4], ["Rook", [0, 2], 3]];
    const SIZE = 4; let width = 2, rows = [];
    const score = team => { const c = Array(T.length).fill(0); team.forEach(u => U[u][1].forEach(t => c[t]++)); return { active: c.filter(x => x >= 2).length, power: team.reduce((s, u) => s + U[u][2], 0) }; };
    const cmp = (a, b) => b.sc.active - a.sc.active || b.sc.power - a.sc.power;
    function run() {
      rows = []; let bm = [{ team: [], sc: score([]) }];
      for (let r = 0; r < SIZE; r++) { const seen = new Set(), cands = [];
        for (const s of bm) for (let u = 0; u < U.length; u++) { if (s.team.includes(u)) continue; const team = [...s.team, u].sort((a, b) => a - b), k = team.join(); if (seen.has(k)) continue; seen.add(k); cands.push({ team, sc: score(team) }); }
        cands.sort(cmp); bm = cands.slice(0, width); rows.push({ cands, kept: width }); }
      let best = null; const all = []; const rec = (i, t) => { if (t.length === SIZE) { all.push({ team: t, sc: score(t) }); return; } for (let u = i; u < U.length; u++) rec(u + 1, [...t, u]); }; rec(0, []); all.sort(cmp); best = all[0];
      return { found: bm[0], best, total: all.length };
    }
    el.innerHTML = `<div class="xw"><div class="xh"><span class="ttl">Beam search <small>how the comp optimizer explores</small></span>
      <label class="sl">Beam width <input type="range" min="1" max="8" value="2" data-k="w"><output>2</output></label></div>
      <div class="xb"><div class="beam"></div></div><div class="xf" aria-live="polite"></div>
      <div class="note">Ten made-up units, five traits, team of four. A trait is active at two units. Each round extends every team in the beam by one unit and keeps only the best few (active traits first, then unit power). The real solver adds constraint pruning, emblem choices and vertical-trait seeds.</div></div>`;
    function draw() {
      const { found, best, total } = run(), nm = t => t.map(u => U[u][0]).join(" ");
      el.querySelector(".beam").innerHTML = rows.map((r, i) => `<div class="row"><em>round ${i + 1}</em>${r.cands.slice(0, 12).map((c, j) => `<span class="${j < r.kept ? "keep" : "drop"}" title="${nm(c.team)}: ${c.sc.active} traits, power ${c.sc.power}">${c.team.map(u => U[u][0].slice(0, 2)).join("·")} <b>${c.sc.active}</b></span>`).join("")}${r.cands.length > 12 ? `<span class="drop">+${r.cands.length - 12}</span>` : ""}</div>`).join("");
      const ok = found.sc.active === best.sc.active && found.sc.power === best.sc.power;
      el.querySelector(".xf").innerHTML = `<span>Beam found <b>${nm(found.team)}</b> · ${found.sc.active} active traits</span><span>Exhaustive best of ${total}: <b>${best.sc.active}</b> traits</span><span class="verdict ${ok ? "p" : "f"}">${ok ? "optimal here" : "missed the best team"}</span>`;
    }
    el.addEventListener("input", e => { if (e.target.dataset.k === "w") { width = +e.target.value; e.target.nextElementSibling.textContent = width; draw(); } });
    draw();
  }

  const REG = { astar, spikes, lanes, ddmin, apriori, beam };
  window.Widgets = { mount(el, name) { if (!el || el.dataset.mounted) return; el.dataset.mounted = "1"; REG[name](el); }, names: Object.keys(REG),
    auto(root = document) { const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); window.Widgets.mount(e.target, e.target.dataset.widget); } }), { rootMargin: "300px" }) : null;
      root.querySelectorAll("[data-widget]").forEach(el => io ? io.observe(el) : window.Widgets.mount(el, el.dataset.widget)); } };
})();
