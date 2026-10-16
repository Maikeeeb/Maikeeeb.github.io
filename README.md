# Charlotte Kerrigan — portfolio

The source for <https://maikeeb.github.io/>. A single static page with no build step, no
framework and no trackers. GitHub Pages serves the root of `main`.

## What's on the page

- **WashProof**: an interactive browser replica of the client app's kiosk and records screens,
  with fictional data and the real rules (version conflicts, forward-only invoice states,
  24-hour record freeze, role checks, idempotent submits). Real recordings sit below it.
- **Work**: project cards that open a detail panel. Every project has a shareable link,
  e.g. `/#work/tft`. Some panels include a live demo.
- **Play**: browser rebuilds of algorithms from my projects and coursework (pathfinding,
  delta debugging, beam search, chat-spike detection).
- **Stack, Path, Contact**: where each tool was used, experience, earlier work.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page structure and the text that doesn't need JavaScript |
| `assets/js/content.js` | **All project content.** Edit this to change cards, panels, stats and experience |
| `assets/js/site.js` | Page behaviour: cards, detail panels, routing, filters, theme |
| `assets/js/washproof-replica.js`, `assets/css/washproof-replica.css` | The WashProof replica, styled to match the real product |
| `assets/js/widgets.js`, `assets/css/widgets.css` | The interactive demos |
| `assets/css/site.css` | Page styles; colours are tokens on `:root` with a dark theme |
| `images/`, `media/` | Real application screenshots and silent recordings |
| `404.html` | Sends old case-study URLs (e.g. `/washproof.html`) to the right part of the page |
| `docs/content-sources.md` | Where each fact on the page came from, and how to refresh it |

## Edit and preview

1. Change `assets/js/content.js` (or the HTML/CSS).
2. Preview: `python -m http.server 5180 --bind 127.0.0.1`, then open <http://127.0.0.1:5180/>.
3. Run the checks: `python -B -m unittest discover -s tests -v`.
4. Commit and push to `main`; GitHub Pages updates in about a minute.

The tests check links and media, script syntax, video settings, required credit and honesty
lines, and that confidential client details, personal IDs and credentials never get published.
They don't prove the source applications work.

## Content rules

- Say how each project was built: hand-written, AI-assisted (directed by me), or team work.
- Credit teammates' parts; don't name people without their OK.
- Keep the WashProof client anonymous. Captures use a separate demo instance with fictional data.
- Quote counts with the date they were taken. Don't invent adoption, revenue or time-saved figures.
