# WashProof case study maintenance

The dedicated page is `washproof.html`, with `washproof.css`, reviewed screenshots in
`images/washproof-*.png`, and recordings in `media/washproof-*.mp4`. The homepage's WashProof
image, title, and case-study link all navigate to it. Other project lightboxes remain unchanged.

## Content and attribution

This is a two-developer client project. Preserve the collaborator's kiosk/washlist and customer
portal credit. Charlotte's primary-contributor / architect role follows the existing portfolio.
Do not convert shared product capabilities into claims of sole authorship.

The case study describes implemented capabilities, not a completed production rollout. Avoid
invented adoption figures, revenue claims, saved-hours figures, or unverified coverage totals.
Photo proof and customer flows are described as ongoing because implementation does not resolve
all storage, authorization, and verification follow-up work.

Technical descriptions were checked against the private project's architecture, current issue
states, record services, concurrency validator, session policy, and test suites. In particular,
`WashRecordRelationalConcurrencyTests` uses two EF contexts against SQLite; most domain tests
use EF InMemory. Do not describe this as PostgreSQL integration coverage.

## Capture and privacy requirements

Use the actual running software in an isolated Docker instance with a separate disposable
database. Configure the demo company and staff with fictional labels before browser recording.
Never record a production session or reset a client database for a portfolio capture.

Capture queue/checklist/sign-off and record/review/invoice/history/export workflows. Retain real
UI behavior. Do not substitute an illustration or synthetic UI for an actual software capture.
Remove identifying data from the source demo database. If any sensitive pixels remain, apply
opaque redaction to the exported media itself, never a removable webpage overlay. Check every
screen transition, menus, notices, device codes, downloads, and visible record history.

Publish only the final reviewed screenshots and silent MP4 clips, without original captures,
audio, embedded metadata, or client assets. Keep raw recordings, compose overrides, demo SQL,
capture helpers, and downloaded spreadsheets in ignored `.runtime/` and clean them up after
verification. Old public repository history is separate from the current site; changing a page
does not remove previously published files from Git history or third-party caches.

## Verification

Run `python -m unittest discover -s tests -v` for links, assets, navigation, player markup, and
content disclosures. These are static publishing checks, not proof that the WashProof backend
passes its suites or that every frame is anonymous. Inspect the actual media before publishing.
Check the page at desktop and mobile widths, keyboard navigation, expandable engineering
sections, video playback/seeking, full-size screenshot links, and the homepage return path.

The new page uses plain HTML/CSS and native video/details controls. It has no runtime dependencies
and works without JavaScript. Only deployment to the existing GitHub Pages repository is needed;
there is no separate hosting service or build step.
