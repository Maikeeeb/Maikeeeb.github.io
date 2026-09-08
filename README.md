# Charlotte Kerrigan — Portfolio

A static portfolio with 19 dedicated project pages, no build step, and no runtime dependencies.
Every project card's image, title, and case-study link opens its own page. The homepage's
CSS and project filter live inside `index.html`.

**To host:** keep all root HTML/CSS files, `images/`, and `media/` together. The existing
GitHub Pages site serves the root of `main` at <https://maikeeeb.github.io/>.

## Project visuals
WashProof, Token Trail, TFT Comp Optimizer, and Rust Belt Relicworks show actual application
captures. MoviePy includes an existing desktop capture and a freshly executed export.
Seven videos cover real interactions or clearly labeled output from original media-processing
code. Test-pattern inputs are disclosed; no third-party footage was used for export demos.
WashProof uses an isolated Docker demo with fictional records and withheld client identities. See
[`docs/washproof-case-study.md`](docs/washproof-case-study.md) for attribution and media privacy rules.
CLI projects show recorded program output. Legacy projects and course notes explicitly identify
source-only or unavailable evidence. The themed card icons are navigation artwork, not screenshots.
Case-study images link to their original full-size files. Keep media captions, contribution credit,
and prototype limitations when updating content. See [verification and evidence notes](docs/project-case-studies.md).

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
