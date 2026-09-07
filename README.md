# Charlotte Kerrigan — Portfolio

A static portfolio (no build step or runtime dependencies) with a dedicated WashProof case study.
The homepage's CSS, project filter, and click-to-zoom lightbox live inside `index.html`.

**To host:** keep `index.html`, `washproof.html`, `washproof.css`, `images/`, and `media/` together.
The WashProof card's image, title, and link open `washproof.html` in the same tab.

## Project visuals
Four cards show **real screenshots of the actual running app** (marked "● Live screenshot",
click to enlarge): Token Trail, TFT Comp Optimizer, Rust Belt Relicworks, and the
MoviePy Video Editor. WashProof links to a case study with screenshots and video from an isolated
Docker demo using fictional records and withheld client identities. See
[`docs/washproof-case-study.md`](docs/washproof-case-study.md) for attribution and media privacy rules.
The remaining cards (CLI/agent tools, older Java/C++/Unity projects that
couldn't be easily run) use themed cover art. To add a real screenshot to any of those later,
drop a PNG into `images/` and swap its card's `<div class="thumb"><div class="cover …">…</div></div>`
for `<div class="thumb"><img class="shot" src="images/yourfile.png" alt="…" loading="lazy" data-cap="caption"></div>`.

## View it locally
Double-click `index.html`. It opens in your browser.

For HTTP preview, run `python -m http.server 5180 --bind 127.0.0.1` from this folder and open
`http://127.0.0.1:5180/washproof.html`. Run static publishing checks with
`python -m unittest discover -s tests -v`.

## Put it online (pick one — all free)

### Option A — GitHub Pages (recommended, you already have GitHub)
1. Create a new public repo, e.g. `portfolio` (or name it `Maikeeeb.github.io` to get a clean root URL).
2. Upload the HTML/CSS files and the `images/` and `media/` folders (keep their relative paths).
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
