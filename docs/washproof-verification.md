# WashProof portfolio verification — September 7, 2026

## Feature Summary

- Added a dedicated static case study and linked the homepage's WashProof image, title, and CTA.
- Recorded the real application in a separate Docker Compose project with an ephemeral PostgreSQL
  database. Fictional employees and vehicles were configured before recording; client identifiers
  were replaced in that database. No production data or original client media is included.
- Added five screenshots and two silent MP4 clips: checklist/sign-off (14.96 s) and
  review/invoice/history/export (17.56 s). Both clips are under 500 KB.
- Preserved collaborator attribution and separated implemented capabilities from ongoing work.
- Removed the previous WashProof image and client-identifying homepage attribution.

## Comprehension Check

The homepage uses ordinary links to `washproof.html`; the WashProof image is excluded from the
homepage's image-lightbox handler. The case study uses local CSS, image links, native `details`
disclosures, and native video controls. It does not call the client API or need JavaScript.
Videos load only on user request, and full-size image links provide a closer view.

Plain HTML/CSS fits the existing GitHub Pages site and avoids adding a framework or build step.
Native disclosures and video controls provide keyboard interaction without a second state layer.
The tradeoff is that shared styling and content are maintained manually across two pages.

Assets must remain beside the HTML at their relative paths. Main failure points are renamed or
missing assets, stale claims after product changes, and identifying content in future recordings.
Start follow-up edits in `washproof.html` and `washproof.css`; use the capture/privacy checklist
in `washproof-case-study.md` when refreshing media. The local-asset test catches missing-file
regressions first. Visual redaction and factual attribution still require human review.

Most likely incomplete: the case study cannot independently measure adoption or business impact,
and it intentionally makes no claim about those outcomes or a completed production rollout.

## Test Change Report

### 1) What changed (per file)

- `tests/test_portfolio.py`
  - Added: `test_washproof_entry_points_open_dedicated_case_study`
  - Added: `test_detail_page_local_assets_and_navigation_resolve`
  - Added: `test_real_media_has_controls_descriptions_and_safe_loading`
  - Added: `test_case_study_preserves_attribution_and_privacy_disclosure`
  - Changed: none. Removed: none.

### 2) Why each test exists

| Test | Type | Protects / would catch | Key assertions |
| --- | --- | --- | --- |
| `test_washproof_entry_points_open_dedicated_case_study` | Validation, regression | Lost detail navigation or restored lightbox interception | Three entry links, correct thumbnail, no `shot` class, anonymized credit |
| `test_detail_page_local_assets_and_navigation_resolve` | Defect, boundary | Broken direct entry, image/video paths, fragments, empty links, duplicate IDs | Local files exist; fragments resolve; IDs are unique |
| `test_real_media_has_controls_descriptions_and_safe_loading` | Validation, boundary | Missing native controls, autoplay, missing alt text, incorrect media references | Two MP4 sources, controls, no autoplay, preload none, accessible descriptions and image dimensions |
| `test_case_study_preserves_attribution_and_privacy_disclosure` | Regression | Lost team credit, missing status caveats, restored original screenshot | Required disclosures, no old media or illustration reference, no embedded video payload or script |

### 3) Weak-test check (per test)

| Test | Hardcoded return would still pass? | No-op would still pass? |
| --- | --- | --- |
| `test_washproof_entry_points_open_dedicated_case_study` | No | No |
| `test_detail_page_local_assets_and_navigation_resolve` | No | No |
| `test_real_media_has_controls_descriptions_and_safe_loading` | No | No |
| `test_case_study_preserves_attribution_and_privacy_disclosure` | No | No |

These inspect actual source files and assets rather than a mocked return value. Because the
product is static HTML, authored fixed content is expected; these checks do not prove visual
quality or media privacy. Browser and capture inspection supplement them.

### 4) Coverage + how to run

- Command: `python -B -m unittest discover -s tests -v`
- Result: all four tests pass. No skips.
- Coverage: no runtime JS was added; statement coverage is not applicable to static HTML/CSS.
  WashProof application code, tests, and coverage configuration are unchanged.

## How to Run

- Preview: `python -m http.server 5180 --bind 127.0.0.1`, then open
  `http://127.0.0.1:5180/washproof.html`.
- Static tests: `python -B -m unittest discover -s tests -v` — passed.
- Formatting: `python -m black --line-length 100 tests/test_portfolio.py` — passed.
- Pre-commit: ran `python -m pre_commit run --config <source-project>/.pre-commit-config.yaml
  --all-files` using the source project's existing hook configuration — passed. YAML/JSON/TOML
  checks skipped because there are no matching tracked files in this portfolio.
- Browser: a temporary Playwright check verified homepage entry and return links, screenshot
  navigation, project filtering, keyboard disclosures, both video decoders/playback, no script
  or HTTP errors, no horizontal overflow at 1440/768/390/320 px, and disclosures without JS.
- Capture verification: inspected screenshots and video contact sheets. All visible records and
  people belong to the fictional demo. The device badge is also from that disposable instance.

## Notes

No runtime dependencies added. The existing source application's client database and unrelated
working-tree changes were left unchanged. The captures demonstrate actual UI actions and a real
spreadsheet download, not real client operations. Old public Git history and third-party caches
are unaffected by replacing the current site's files.

## Artifact Verification

- [x] Only intended source, documentation, tests, and reviewed media are staged.
- [x] Each new published asset is under 500 KB; raw recordings are excluded by `.gitignore`.
- [x] Isolated capture containers stopped; the local portfolio preview remains available.
- [ ] Temporary capture files deleted: automatic approval review blocked the removal request
  with “blocked by policy.” Ignored `.runtime/` files and the Python test cache remain locally.
  These are not part of the published site or Git commit.
