/* WashProof browser replica: fictional data, mirrors the real screens and rules for portfolio demonstration. */
(function () {
  const h = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SVC = [["interior", "Interior"], ["exterior", "Exterior"], ["dump", "Dump"]];
  const NEXT = { Unreviewed: ["Reviewed", "Mark reviewed"], Reviewed: ["Invoiced", "Mark invoiced"], Invoiced: ["Locked", "Lock record"] };
  const stamp = () => { const d = new Date(); return `9/7/26, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}`; };

  function seed() {
    const mk = (n, arr, dep, mi, done, inv) => ({
      id: "DEMO-" + n, arr, dep, mileage: mi, preset: "Full", archived: false, version: done ? 3 : 1,
      svc: { interior: done ? "done" : null, exterior: done ? "done" : null, dump: done ? "done" : null },
      fluid: done ? 2 : "", def: done ? 3 : "", notes: "Fictional portfolio demonstration.",
      complete: done, partial: false, frozen: false, invoice: inv, by: done ? "Demo Operator" : null,
      history: [{ e: "wash-record-create", t: "9/7/26, 4:07:25 AM", by: "Demo Operator" }].concat(done ? [{ e: "wash-record-update", t: "9/7/26, 4:07:40 AM", by: "Demo Operator" }] : []).concat(inv === "Invoiced" ? [{ e: "wash-record-invoice-status-transition", t: "9/7/26, 4:07:48 AM", by: "Demo Supervisor" }, { e: "wash-record-invoice-status-transition", t: "9/7/26, 4:07:49 AM", by: "Demo Supervisor" }] : []),
    });
    return [mk(101, "07:00", "10:30", 25000, false, "Unreviewed"), mk(102, "08:00", "11:30", 26200, false, "Unreviewed"), mk(103, "09:00", "12:30", 27400, false, "Unreviewed"), mk(104, "10:00", "13:30", 28600, true, "Unreviewed"), mk(105, "11:00", "14:30", 29800, true, "Invoiced")];
  }

  function mount(root, opts = {}) {
    let S, listeners = [];
    const emit = (type, detail) => listeners.forEach(f => f(type, detail));
    function reset(view = opts.start || "queue") {
      S = { recs: seed(), mode: view === "records" || view === "details" ? "admin" : "kiosk", view, cur: null, draft: null, edit: false, banner: null, stale: false, modal: false, archived: false, q: "", nav: "Records", lastKey: null, err: null };
      if (view === "details") S.cur = "DEMO-104";
      draw();
    }
    const rec = id => S.recs.find(r => r.id === id);
    function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; root.querySelector(".wp")?.appendChild(t); setTimeout(() => t.remove(), 2700); }
    function go(view, extra = {}) { Object.assign(S, { view, banner: null, edit: false, err: null }, extra); draw(); emit("view", view); root.querySelector(".scroll") && (root.querySelector(".scroll").scrollTop = 0); }

    /* ---------- kiosk ---------- */
    function kioskHead(title, sub, back) {
      return `<div class="k-head"><div class="t"><small>${sub}</small><b>${h(title)}</b></div>
        <div class="who">Signed in<b>Demo Operator</b></div>
        ${back ? `<button class="btn dk" data-a="back">← Back</button>` : ""}
        <button class="btn dk" data-a="switch">Switch user</button><button class="btn dk" data-a="exit">Exit kiosk</button></div>`;
    }
    function queueView() {
      const q = S.recs.filter(r => !r.complete), done = S.recs.filter(r => r.complete).slice().reverse();
      return kioskHead("Client withheld", "KIOSK") + `<div class="scroll"><div class="k-main">
        ${S.banner ? `<div class="banner ${S.banner.k}">${S.banner.m}</div>` : ""}
        <div class="k-top"><div><h3>Queue</h3><p>Tap a bus to start its checklist. ${q.length} pending.</p></div><button class="btn p" data-a="newbus">+ New bus</button></div>
        ${q.map(r => `<button class="busc${r.partial ? " prog" : ""}" data-open="${r.id}"><div><b>Bus #${r.id}</b><span class="m">Client withheld · 09/07/2026 · Arr: ${r.arr} • Dep: ${r.dep}</span></div><span class="pills"><span class="pill">Full</span>${r.partial ? `<span class="pill y">In progress</span>` : `<span class="pill">Queued</span>`}</span></button>`).join("") || `<div class="empty">Queue is clear. Nice work.</div>`}
        <div class="k-sub"><h4>Recently completed</h4><p>Recently signed-off records stay visible here for quick confirmation.</p></div>
        ${done.map(r => `<div class="busc done"><div><b>Bus #${r.id}</b><span class="m">Client withheld · 09/07/2026 · ${r.mileage} mi · Arr: ${r.arr} • Dep: ${r.dep}</span></div><span class="pills"><span class="pill g">Completed</span></span></div>`).join("")}
      </div></div>`;
    }
    function checklistView() {
      const r = rec(S.cur), d = S.draft;
      const svc = SVC.map(([k, l]) => `<div class="svc"><div class="lbl">${l} <span class="pill">Required</span></div><div class="tog">
        <button class="s" data-svc="${k}" data-v="skipped" aria-pressed="${d.svc[k] === "skipped"}">Skipped</button>
        <button class="d" data-svc="${k}" data-v="done" aria-pressed="${d.svc[k] === "done"}">Done</button></div></div>`).join("");
      const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-key="${n}" aria-pressed="${String(d.fluid) === String(n)}">${n}</button>`).join("");
      return kioskHead(`Bus #${r.id} · Client withheld`, "KIOSK · CHECKLIST", true) + `<div class="scroll"><div class="k-main">
        <div class="card"><p class="lbl">Basic information</p><div class="grid2">
          <div><p class="lbl">Date (MM/DD/YYYY)</p><input value="09/07/2026" readonly></div>
          <div><p class="lbl">Bus company</p><select disabled><option>Client withheld</option></select></div>
          <div><p class="lbl">Bus number</p><input value="${r.id}" readonly></div>
          <div><p class="lbl">Mileage</p><input data-f="mileage" inputmode="numeric" value="${h(d.mileage)}" aria-label="Mileage"></div></div></div>
        <div class="card"><p class="lbl">Checklist</p><div class="lbl" style="display:flex;gap:8px;align-items:center">Services <span class="pill" style="font-size:11px;letter-spacing:0">Full</span></div>${svc}</div>
        <div class="card"><div class="grid2"><div><p class="lbl">Washer fluid</p><input data-f="fluid" value="${h(d.fluid)}" aria-label="Washer fluid"><div class="keys">${keys}</div></div>
          <div><p class="lbl">DEF</p><input data-f="def" value="${h(d.def)}" aria-label="DEF"></div></div>
          <p class="lbl" style="margin-top:12px">Extra notes</p><textarea data-f="notes" rows="2" aria-label="Extra notes">${h(d.notes)}</textarea></div>
        ${S.err ? `<div class="banner bad">${S.err}</div>` : ""}
        <button class="btn p submit" data-a="submit">Submit &amp; sign off</button>
      </div></div>`;
    }

    /* ---------- admin ---------- */
    const pill = v => v === "done" ? `<span class="pill g">Done</span>` : v === "skipped" ? `<span class="pill n">Skipped</span>` : `<span class="pill r">Required</span>`;
    function adminShell(title, body) {
      const unrev = S.recs.filter(r => r.complete && r.invoice === "Unreviewed" && !r.archived).length;
      return `<div class="a-wrap"><aside class="side"><div class="brand">Wash<i>Proof</i></div><nav>
        ${["Records", "Review Queue", "Customer Requests", "Defect Review", "Settings"].map(n => `<button data-nav="${n}" ${S.nav === n ? 'aria-current="page"' : ""}>${n}${n === "Review Queue" && unrev ? `<span class="cnt">${unrev}</span>` : ""}</button>`).join("")}
        </nav><div class="me"><span class="av">D</span><div><b>Demo Supervisor</b><span>Supervisor</span></div></div></aside>
        <div class="a-main"><div class="a-top"><h3>${title}</h3><div class="r"><button class="btn" data-a="export">Export .xlsx</button><span class="nm">Demo Supervisor</span><span class="av">D</span><button class="btn" data-a="switch" title="Switch to the wash-bay kiosk">Switch user</button></div></div>
        <div class="scroll"><div class="a-body">${body}</div></div></div></div>`;
    }
    function recordsView() {
      const rows = S.recs.filter(r => S.archived || !r.archived).filter(r => !S.q || r.id.toLowerCase().includes(S.q.toLowerCase()));
      const body = `<div class="a-head"><div><h3>Buses Washed Today</h3><p>Tap a row to open bus wash details.</p></div><div class="acts"><input data-f="q" placeholder="Search bus # or company..." value="${h(S.q)}" style="width:180px;padding:7px 9px;font-size:12px" aria-label="Search bus number"><button class="btn p" data-a="newbus">+ Create</button><button class="btn" data-a="export">Export .xlsx</button></div></div>
        <div class="filters"><div><p class="lbl">Bus company contains</p><input></div><div><p class="lbl">Bus number contains</p><input data-f="q" value="${h(S.q)}"></div><div><p class="lbl">From date (MM/DD/YYYY)</p><input placeholder="MM/DD/YYYY"></div><div><p class="lbl">To date (MM/DD/YYYY)</p><input placeholder="MM/DD/YYYY"></div><label class="ck"><input type="checkbox" data-f="archived" ${S.archived ? "checked" : ""}> Include archived</label></div>
        <div class="pager"><span>1-${rows.length} of ${rows.length}</span><span style="display:flex;gap:6px;align-items:center"><button class="btn" disabled>Previous</button>Page 1 of 1<button class="btn" disabled>Next</button></span></div>
        <div class="tbl"><table><thead><tr><th>Date ↑</th><th>Bus Company</th><th>Bus Number</th><th>Arrival</th><th>Departure</th><th>Mileage</th><th>Interior</th><th>Exterior</th><th>Dump</th><th>Preset</th><th>Complete</th></tr></thead><tbody>
        ${rows.map(r => `<tr data-open="${r.id}" class="${S.flash === r.id ? "flash" : ""}" tabindex="0"><td>09/07/2026</td><td>Client withheld</td><td><b>${r.id}</b>${r.archived ? ` <span class="pill n">Archived</span>` : ""}</td><td>${r.arr}</td><td>${r.dep}</td><td>${Number(r.mileage).toLocaleString()}</td>${SVC.map(([k]) => `<td>${pill(r.svc[k])}</td>`).join("")}<td><span class="pill">Full</span></td><td>${r.complete ? `<span class="pill g">Complete</span>` : `<span class="pill r">Incomplete</span>`}</td></tr>`).join("")}
        </tbody></table></div>`;
      S.flash = null;
      return adminShell("Buses Washed Today", body);
    }
    function reviewView() {
      const rows = S.recs.filter(r => r.complete && r.invoice === "Unreviewed" && !r.archived);
      return adminShell("Review Queue", `<div class="a-head"><div><h3>Review Queue</h3><p>Completed washes waiting for a supervisor.</p></div></div>` +
        (rows.length ? rows.map(r => `<button class="busc" data-open="${r.id}"><div><b>Bus #${r.id}</b><span class="m">Signed off by ${h(r.by)} · ${Number(r.mileage).toLocaleString()} mi · Arr ${r.arr} • Dep ${r.dep}</span></div><span class="pills"><span class="pill g">Complete</span><span class="pill r">Unreviewed</span></span></button>`).join("") : `<div class="empty">Nothing waiting for review.</div>`));
    }
    function otherView() {
      return adminShell(S.nav, `<div class="empty"><b>${h(S.nav)}</b><br>Exists in the real product; not part of this portfolio replica.</div>`);
    }
    function detailsView() {
      const r = rec(S.cur), nx = NEXT[r.invoice];
      const val = (k, v) => S.edit && (k === "mileage") ? `<input data-f="e-mileage" value="${h(S.editMileage)}" aria-label="Mileage">` : `<div class="ro">${h(v)}</div>`;
      const body = `<button class="crumb" data-a="toRecords">&lt;- Buses Washed Today</button>
        <div class="a-head"><div><h3>Bus Wash Details</h3><p>${S.edit ? "Editing. Save keeps a version check." : "Tap Edit to make changes."}</p></div><div class="acts">
          <button class="btn" data-a="history">History</button><button class="btn" data-a="archive">${r.archived ? "Unarchive" : "Archive"}</button>
          ${S.edit ? `<button class="btn" data-a="cancel">Cancel</button><button class="btn p" data-a="save">Save</button>` : `<button class="btn p" data-a="edit">Edit</button>`}</div></div>
        ${S.banner ? `<div class="banner ${S.banner.k}">${S.banner.m}</div>` : ""}
        <div class="inv"><b>Invoice status:</b> ${r.complete ? r.invoice : "Not complete"} ${r.complete && nx ? `<button class="btn" data-a="advance">${nx[1]}</button>` : ""}${r.frozen ? `<span class="pill pu">Frozen</span>` : ""}<span style="margin-left:auto;color:#888;font-size:11px">v${r.version}</span></div>
        ${r.complete ? `<div class="banner">Record marked complete by ${h(r.by)} — ${r.invoice.toLowerCase()}.</div>` : r.partial ? `<div class="banner warn">Saved by ${h(r.by)} but incomplete: a required service was skipped.</div>` : `<div class="banner info">Waiting for the wash bay to sign off. Invoice status unlocks after completion.</div>`}
        <div class="card"><div class="grid2">
          <div><p class="lbl">Date</p><div class="ro">09/07/2026</div></div><div><p class="lbl">Bus company</p><div class="ro">Client withheld</div></div>
          <div><p class="lbl">Bus number</p><div class="ro">${r.id}</div></div><div><p class="lbl">Mileage</p>${val("mileage", r.mileage)}</div>
          <div><p class="lbl">Arrival</p><div class="ro">${r.arr}</div></div><div><p class="lbl">Departure</p><div class="ro">${r.dep}</div></div></div>
          <p class="lbl" style="margin-top:12px">Service preset</p><span class="pill">Full</span></div>
        <div class="card"><p class="lbl">Checklist</p><div class="grid3">${SVC.map(([k, l]) => `<div><p class="lbl">${l}</p>${r.svc[k] || "required"}</div>`).join("")}</div></div>
        <div class="card"><div class="grid2"><div><p class="lbl">Washer fluid</p><div class="ro">${h(r.fluid)}</div></div><div><p class="lbl">DEF</p><div class="ro">${h(r.def)}</div></div></div></div>
        <div class="card"><p class="lbl">Extra notes</p><div class="ro" style="min-height:52px">${h(r.notes)}</div></div>`;
      return adminShell("Bus Wash Details", body);
    }
    function historyModal() {
      const r = rec(S.cur);
      return `<div class="modal" data-a="closeModal"><div role="dialog" aria-modal="true" aria-label="Record history"><h4>Record history <button class="btn" data-a="closeModal">Close</button></h4>
        ${r.history.slice().reverse().map(e => `<div class="ev"><b>${e.e}</b><span>${e.t} - ${h(e.by)}</span></div>`).join("")}</div></div>`;
    }

    function draw() {
      const v = S.view;
      let inner = v === "queue" ? queueView() : v === "checklist" ? checklistView() : v === "records" ? recordsView() : v === "review" ? reviewView() : v === "details" ? detailsView() : otherView();
      const focusF = document.activeElement?.dataset?.f, selS = document.activeElement?.selectionStart;
      root.innerHTML = `<div class="wp" style="${opts.height ? `--wp-h:${opts.height}` : ""}">${inner}${S.modal ? historyModal() : ""}<div class="device">Device WP-749910</div></div>`;
      if (focusF) { const el = root.querySelector(`[data-f="${focusF}"]`); if (el) { el.focus(); try { el.setSelectionRange(selS, selS); } catch (e) {} } }
    }

    /* ---------- actions ---------- */
    function submit() {
      const d = S.draft, r = rec(S.cur);
      const missing = SVC.filter(([k]) => !d.svc[k]).map(([, l]) => l);
      if (!/^\d+$/.test(String(d.mileage).trim())) { S.err = "Mileage is required and must be a whole number."; draw(); emit("invalid"); return; }
      if (+d.mileage < 0 || +d.mileage > 2000000) { S.err = "Mileage is outside the allowed range."; draw(); emit("invalid"); return; }
      if (missing.length) { S.err = `Mark each required service as Done or Skipped: ${missing.join(", ")}.`; draw(); emit("invalid"); return; }
      const skipped = SVC.filter(([k]) => d.svc[k] === "skipped").map(([, l]) => l);
      const key = r.id + ":" + r.version;
      if (S.lastKey === key) { toast("Same idempotency key: stored response replayed, no duplicate record."); emit("replay"); return; }
      S.lastKey = key;
      Object.assign(r, { svc: { ...d.svc }, mileage: +d.mileage, fluid: d.fluid, def: d.def, notes: d.notes, complete: !skipped.length, partial: !!skipped.length, by: "Demo Operator", invoice: "Unreviewed" });
      r.version++; r.history.push({ e: "wash-record-update", t: stamp(), by: "Demo Operator" });
      go("queue", { banner: skipped.length ? { k: "warn", m: `Bus #${r.id} saved but <b>not complete</b>: ${skipped.join(", ")} skipped. Every required service must be Done before review.` } : { k: "", m: `Bus #${r.id} signed off. It now waits for supervisor review.` } });
      emit(skipped.length ? "partial" : "submitted", r.id);
    }
    function conflict() {
      const r = rec(S.cur);
      S.banner = { k: "bad", m: `<b>409 Conflict.</b> This record was changed by Demo Admin while you had it open (you loaded v${r.version - 1}, it is now v${r.version}). Nothing was overwritten. <button class="btn" data-a="reload" style="margin-left:6px;font-size:11px;padding:3px 8px">Reload</button>` };
      S.stale = false; draw(); emit("conflict");
    }
    function advance() {
      const r = rec(S.cur), nx = NEXT[r.invoice]; if (!nx) return;
      if (S.stale) return conflict();
      if (nx[0] === "Locked") { S.banner = { k: "bad", m: "<b>403 Forbidden.</b> Locking is Admin-only. Supervisors review and invoice; an Admin locks the record." }; draw(); emit("forbidden"); return; }
      r.invoice = nx[0]; r.version++; r.history.push({ e: "wash-record-invoice-status-transition", t: stamp(), by: "Demo Supervisor" });
      S.banner = null; draw(); emit(nx[0].toLowerCase(), r.id);
    }
    root.addEventListener("click", e => {
      const t = e.target.closest("[data-a],[data-open],[data-nav],[data-svc],[data-key]"); if (!t) return;
      if (t.dataset.a === "closeModal" && t.classList.contains("modal") && e.target !== t) return;
      const a = t.dataset.a;
      if (t.dataset.open) {
        const r = rec(t.dataset.open);
        if (S.mode === "kiosk") { if (r.complete) return; S.cur = r.id; S.draft = { svc: { ...r.svc }, mileage: "", fluid: "", def: "", notes: "" }; go("checklist"); emit("opened", r.id); }
        else { S.cur = r.id; go("details"); emit("details", r.id); }
        return;
      }
      if (t.dataset.nav) { S.nav = t.dataset.nav; go(S.nav === "Records" ? "records" : S.nav === "Review Queue" ? "review" : "other"); return; }
      if (t.dataset.svc) { S.draft.svc[t.dataset.svc] = t.dataset.v; S.err = null; draw(); return; }
      if (t.dataset.key) { S.draft.fluid = t.dataset.key; draw(); return; }
      if (a === "back") go("queue");
      else if (a === "switch") { if (S.mode === "kiosk") { S.mode = "admin"; S.nav = "Records"; go("records"); emit("supervisor"); } else { S.mode = "kiosk"; go("queue"); emit("operator"); } }
      else if (a === "exit") toast("Exit kiosk returns the device to its setup screen. The device registration is kept.");
      else if (a === "newbus") { const n = 101 + S.recs.length; const r = seed()[0]; Object.assign(r, { id: "DEMO-" + n, arr: "13:00", dep: "16:30", mileage: 31000 + n }); S.recs.push(r); if (S.mode === "admin") S.flash = r.id; draw(); toast(`Bus #${r.id} added to today's queue.`); }
      else if (a === "submit") submit();
      else if (a === "toRecords") { S.nav = "Records"; go("records"); }
      else if (a === "history") { S.modal = true; draw(); emit("history"); }
      else if (a === "closeModal") { S.modal = false; draw(); }
      else if (a === "edit") { S.edit = true; S.editMileage = rec(S.cur).mileage; S.banner = null; draw(); }
      else if (a === "cancel") { S.edit = false; draw(); }
      else if (a === "save") {
        const r = rec(S.cur); if (S.stale) { S.edit = false; return conflict(); }
        if (r.frozen) { S.edit = false; S.banner = { k: "bad", m: "<b>409 Record frozen.</b> Completed records freeze 24 hours after completion. Changes go in as an append-only correction with a reason, and the original stays in the audit chain." }; r.history.push({ e: "wash-record-update-rejected-frozen", t: stamp(), by: "Demo Supervisor" }); draw(); emit("frozen"); return; }
        if (!/^\d+$/.test(String(S.editMileage).trim())) { S.banner = { k: "bad", m: "Mileage must be a whole number." }; draw(); return; }
        r.mileage = +S.editMileage; r.version++; r.history.push({ e: "wash-record-update", t: stamp(), by: "Demo Supervisor" });
        S.edit = false; S.banner = { k: "", m: `Saved. Version ${r.version}.` }; draw(); emit("saved");
      }
      else if (a === "advance") advance();
      else if (a === "reload") { S.banner = { k: "info", m: "Reloaded the latest version. You can try again." }; draw(); emit("reloaded"); }
      else if (a === "archive") { const r = rec(S.cur); r.archived = !r.archived; r.history.push({ e: r.archived ? "wash-record-archive" : "wash-record-unarchive", t: stamp(), by: "Demo Supervisor" }); r.version++; draw(); toast(r.archived ? "Archived. Hidden from the list unless “Include archived” is ticked." : "Restored to the list."); }
      else if (a === "export") { toast("Export prepared: cells starting with = + - @ are escaped so they can't run as formulas. (Demo: no file.)"); emit("export"); }
    });
    root.addEventListener("input", e => {
      const f = e.target.dataset.f; if (!f) return;
      if (S.view === "checklist" && ["mileage", "fluid", "def", "notes"].includes(f)) { S.draft[f] = e.target.value; if (f === "fluid") draw(); return; }
      if (f === "q") { S.q = e.target.value; draw(); }
      if (f === "e-mileage") S.editMileage = e.target.value;
    });
    root.addEventListener("change", e => { if (e.target.dataset.f === "archived") { S.archived = e.target.checked; draw(); } });
    root.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("tr[data-open]")) e.target.click(); if (e.key === "Escape" && S.modal) { S.modal = false; draw(); } });

    reset();
    return {
      on(f) { listeners.push(f); },
      reset,
      state: () => S,
      /* "Try to break it" hooks, each a real rule from the product */
      act(kind) {
        if (kind === "stale") {
          if (S.view !== "details") { S.mode = "admin"; S.nav = "Records"; S.cur = S.recs.find(r => r.complete && r.invoice !== "Invoiced")?.id || "DEMO-104"; go("details"); }
          const r = rec(S.cur); r.version++; r.history.push({ e: "wash-record-update", t: stamp(), by: "Demo Admin" }); S.stale = true;
          S.banner = { k: "info", m: "Another user (Demo Admin) just saved this record in a different tab. Now press <b>Edit → Save</b> or the invoice button." }; draw(); emit("staged", "stale");
        } else if (kind === "skip") {
          const target = S.recs.find(r => r.complete && r.invoice === "Unreviewed" && !r.archived);
          if (target) S.cur = target.id; else S.cur = S.cur || "DEMO-104";
          S.mode = "admin"; S.nav = "Records"; go("details");
          const r = rec(S.cur);
          S.banner = r.invoice === "Unreviewed" && r.complete
            ? { k: "bad", m: "<b>400 Invalid transition.</b> Unreviewed → Invoiced is not allowed. A completed wash must be reviewed before it can be invoiced." }
            : { k: "bad", m: `<b>400 Invalid transition.</b> The API only accepts the next state in order (currently ${r.complete ? r.invoice : "not complete"}).` };
          draw(); emit("rejected");
        } else if (kind === "washer") {
          S.mode = "kiosk"; go("queue", { banner: { k: "bad", m: "<b>403 Forbidden.</b> The washer role cannot change invoice status. The kiosk never shows that button, and the API refuses it anyway." } }); emit("forbidden");
        } else if (kind === "freeze") {
          if (S.view !== "details") { S.mode = "admin"; S.nav = "Records"; S.cur = "DEMO-104"; go("details"); }
          const r = rec(S.cur); if (!r.complete) { toast("Only completed records freeze."); return; }
          r.frozen = true; r.history.push({ e: "wash-record-frozen", t: stamp(), by: "System" });
          S.banner = { k: "info", m: "Fast-forwarded 24 hours: this record is now <b>frozen</b>. Try <b>Edit → Save</b>." }; draw(); emit("staged", "freeze");
        } else if (kind === "double") {
          if (S.view !== "checklist") { S.mode = "kiosk"; const r = S.recs.find(x => !x.complete); if (!r) { toast("Add a bus first (+ New bus)."); return; } S.cur = r.id; S.draft = { svc: { interior: "done", exterior: "done", dump: "done" }, mileage: String(r.mileage + 120), fluid: "2", def: "1", notes: "" }; go("checklist"); }
          submit(); setTimeout(() => { toast("Second tap sent the same idempotency key: stored response replayed, one record only."); emit("replay"); }, 350);
        }
      },
    };
  }
  window.WashProofApp = { mount };
})();
