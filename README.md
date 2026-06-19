# Charlotte Kerrigan — Portfolio

A self-contained `index.html` (no build step, no dependencies, no internet required) plus an
`images/` folder of real project screenshots. Everything else — CSS, the project filter, and the
click-to-zoom lightbox — lives inside `index.html`.

**To host, you only need two things:** `index.html` and the `images/` folder (keep them together).
`shot.mjs` is just the dev helper used to capture the screenshots — you don't need to upload it.

## Project visuals
Five cards show **real screenshots of the actual running app** (marked "● Live screenshot",
click to enlarge): WashProof, Token Trail, TFT Comp Optimizer, Rust Belt Relicworks, and the
MoviePy Video Editor. The remaining cards (CLI/agent tools, older Java/C++/Unity projects that
couldn't be easily run) use themed cover art. To add a real screenshot to any of those later,
drop a PNG into `images/` and swap its card's `<div class="thumb"><div class="cover …">…</div></div>`
for `<div class="thumb"><img class="shot" src="images/yourfile.png" alt="…" loading="lazy" data-cap="caption"></div>`.

## View it locally
Double-click `index.html`. It opens in your browser.

## Put it online (pick one — all free)

### Option A — GitHub Pages (recommended, you already have GitHub)
1. Create a new public repo, e.g. `portfolio` (or name it `Maikeeeb.github.io` to get a clean root URL).
2. Upload `index.html` to it (drag-and-drop on github.com works).
3. Repo **Settings → Pages → Source: `main` branch, `/root`** → Save.
4. Live in ~1 minute at:
   - `https://Maikeeeb.github.io/portfolio/`  (if repo is named `portfolio`), or
   - `https://Maikeeeb.github.io/`  (if repo is named `Maikeeeb.github.io`).

### Option B — Netlify Drop (fastest, no account setup needed to start)
1. Go to https://app.netlify.com/drop
2. Drag the whole `portfolio` folder onto the page.
3. You instantly get a shareable URL (rename the site in site settings for a tidy link).

### Option C — Cloudflare Pages / Vercel
Same idea: connect the repo or drag the folder. All serve a single static file with zero config.

## The link to put on job applications
Once hosted, paste the URL into the "Portfolio / Website" field on applications and into your
resume header. A GitHub Pages URL (Option A) is the most recognizable to recruiters.

## Updating it
Edit `index.html` directly. To add a project, copy one `<article class="proj">…</article>`
block inside `<div class="proj-grid" id="grid">` and change the text. The `data-tags`
attribute controls which filter buttons show it (e.g. `data-tags="backend qa"`).

## Notes
- Contact info shown publicly: email, GitHub, and city (Stoney Creek, ON). Phone and street
  address are intentionally left off the public page — keep those on the PDF resume you send directly.
- Project descriptions follow the honest framing in `charlotte.md` (e.g. prototypes labeled as
  prototypes, group/client contributions attributed). Keep that wording when you edit.
