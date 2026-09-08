# Portfolio case studies — evidence and verification

## Feature Summary

All 19 homepage projects now open a dedicated page through their image/cover, title, and CTA.
The 18 new pages share the existing WashProof visual language and add problem context,
contribution, a three-step workflow, evidence, expandable engineering tradeoffs, and limitations.
The homepage filter remains intact. Its obsolete image lightbox was removed because cards now
navigate to case studies; images inside case studies link directly to full-size captures.

Main files: `index.html`, the 18 root project HTML files, `project-case-studies.css`,
`tests/test_portfolio.py`, and the new image/video assets. Existing `washproof.html` remains intact.

## Evidence register

| Page | Evidence obtained | Practical limit |
| --- | --- | --- |
| WashProof | Five screenshots and two videos from an isolated Docker demo | Fictional records; client identity withheld; existing verification report applies |
| Token Trail | Docker API, worker, MongoDB, and React; three fictional uploads; ranked results, pair and comparison captures | Tiny fixtures returned zero matches; proves the demonstrated flow, not detection accuracy |
| TFT optimizer | Local React + FastAPI solver; configuration/result screenshots and interaction video | Bundled TFT16 data; no current-patch or optimality claim |
| Relicworks | Svelte runtime screenshots and resource-loop video | Prototype's time-advance buttons used; first-session scope |
| TwitchClipper | Original bucket/spike functions, invalid-window rejection | Component run with fictional timestamps; no Twitch download |
| Deep Research | Original init/status commands | Initialized artifacts only; no completed research claimed |
| Issue orchestration | Local skill and reference source | No remote issue mutations or manufactured productivity metrics |
| Twitch compilation | Original compile function in a sandbox copy | Two generated test-pattern clips; two-second output; no scraping/upload |
| Reddit video | Collection/composition source review | Original external inputs and legacy dependencies; no fresh video |
| MoviePy editor | Existing reviewed UI capture; original Clip/export code executed in sandbox | Four-second generated-input export; fresh native interaction recording unavailable while desktop locked |
| A* | Original Java classes compiled and one 50×50 search run | Route found; no shortest-path or performance guarantee |
| SFML engine | Original C++ source and legacy build inspected | No usable fresh runtime capture |
| Unity runner | C# source and Unity 2017.4.36f1 project reviewed | Compatible editor unavailable; no fresh playtest |
| Software testing | Original DeltaDebugging.py executed | Reduction example, not global minimality; oracle limitations disclosed |
| Sudoku | Original Java model compiled; regional validation and rejected-update checks | Incomplete solver; no new BasicIO capture |
| Maze | Original portfolio description retained | Source not located; explicitly an unverified archive note |
| TCP transfer | Original sender/receiver on localhost; 3,600-byte fixture; SHA-256 comparison | One successful transfer; framing and interruption limitations disclosed |
| Console input | Original ask function with invalid text, both bounds, then accepted integer | Controlled input stream; invalid restriction combinations remain |
| Languages/systems | Archived study repository reviewed | Coursework overview; instructor material not republished |

Recordings and screenshots are actual software/output, not AI-created mockups. The compiler and
editor input patterns were generated solely for the demonstration; captions identify them.
All seven MP4 files are below 500 KB, use native controls, avoid autoplay, and preload no data.
The site never calls the source applications or exposes their API credentials.

## Comprehension Check

1. A homepage anchor navigates to a static HTML file. Relative links resolve at the GitHub Pages
   root and in a local HTTP preview. Every new page links back and to neighboring projects.
2. The browser loads shared CSS and screenshots. Clicking a video starts its media fetch;
   native controls handle playback. A fallback link exposes the same downloadable file.
3. Native `details` elements provide keyboard-accessible technical notes without a framework or
   client script. The only remaining homepage script updates the year and filters cards.

Static pages were chosen over a router/framework because this portfolio already uses GitHub
Pages without a build step. The tradeoff is repeated page markup: cross-page changes need a
deliberate consistency pass. Edit the affected HTML for content and shared CSS for layout.
Temporary authoring/capture scripts are not runtime dependencies or publishing inputs.

Assumptions: all HTML/CSS/assets deploy together; public repository URLs remain available;
the supplied role/contribution accounts are accurate. Local source inspection grounds technical
details, but does not independently prove sole authorship. Explicit group/library credit remains.
Likely failure points are stale source links, lost media files, changed captions, and unsupported
video decoding. Full-size image links and download fallbacks remain available.

The most incomplete part is runtime evidence for legacy applications and the missing maze source.
These pages disclose that directly. Do not upgrade their wording without restoring and verifying
the original software. New captures should use fictional/owned inputs and be reviewed visually.

## Test Change Report

### 1) What changed (per file)

`tests/test_portfolio.py` added:

- `test_every_project_has_three_links_to_its_own_case_study`
- `test_all_case_study_assets_fragments_and_direct_entry_links_resolve`
- `test_all_videos_have_native_controls_and_download_fallbacks`
- `test_attribution_and_evidence_limits_survive_content_edits`

Changed: formatting only for existing code. Removed: none. The four WashProof tests remain.
The test file's Test Plan covers valid navigation, relative/fragment boundaries, missing assets,
empty links, duplicate IDs, inaccessible media, and attribution/privacy limits.

### 2) Why each test exists

| Test | Type | Protects / would catch | Key assertions |
| --- | --- | --- | --- |
| every_project_has_three_links | Validation, partition | Cover, title, and CTA behavior across all cards; lightbox interception or a missing detail page | 19 unique destinations; exactly three matching links per card; actual target files |
| all_case_study_assets_fragments | Defect, boundary | Missing assets, empty URLs, duplicate IDs, broken cross-page anchors | Local target exists; fragment exists in the target; IDs unique |
| all_videos_have_native_controls | Validation, failure boundary | Script-dependent playback, autoplay, missing download fallback, wrong media files | Seven players; controls/playsinline; no preload/autoplay; accessible captions; MP4 signature; fallback href |
| attribution_and_evidence_limits | Regression | Team credit or prototype/source-only evidence becoming inflated claims | Required contribution, fixture, data-version, legacy/runtime, and archive disclosures |

### 3) Weak-test check (per test)

For each of the four added tests: a hardcoded production return would not satisfy the assertions;
there is no application return value to stub. Removing navigation/media/disclosures would fail
the associated test. A no-op test implementation would remove the assertions and is not considered
valid coverage. These are publishing-contract checks on real files, not proof of app correctness.

### 4) Coverage + how to run

- Command: `python -B -m unittest discover -s tests -v`
- Result: 8 tests pass, no skips. Four existing tests retained and four added.
- No JS/application coverage percentage is claimed for static HTML. No source-application tests
  or coverage settings were changed; this task did not rerun all underlying product suites.
- Formatting/quality command:
  `python -m pre_commit run --config D:/projects/KTS-Washlist/.pre-commit-config.yaml --all-files`
- Black reformatted the extended test file; subsequent checks passed. YAML/JSON/TOML hooks skip
  because this static repository has no applicable tracked files.

## Browser verification

Local server: `python -m http.server 5180 --bind 127.0.0.1`.
Temporary Playwright harness: `node .runtime/verify-all-pages.mjs` using the existing local
Playwright installation. Checks cover 19 pages at 1440/768/390/320 pixels, real card and return
navigation, keyboard disclosure toggling, all seven video decoders, no-JavaScript navigation,
and a failed-media-request fallback. Desktop/mobile captures were visually inspected.
Result: 19 pages, 76 responsive checks, seven decodable videos, keyboard toggling, real card
navigation, no-JavaScript navigation, and media-failure fallback all passed; zero page errors.
The initial keyboard test assumed every disclosure started closed; WashProof deliberately opens
its first note. The harness now checks toggling from the actual initial state.

## Notes and artifact verification

- No portfolio runtime dependencies added. Capture-only tools live in an ignored isolated venv.
- Source repositories were inspected/run; this feature changes only the portfolio checkout.
- Token Trail used a separate Compose project/database/volume and fictional identities.
- Original client containers were not modified or stopped by the new portfolio capture work.
- Temporary captures, inputs, fixture outputs, and demo credentials remain under ignored
  `.runtime/`; none are staged. Earlier recursive cleanup was rejected by automatic approval
  review, so that directory has not been recursively deleted or moved as a workaround.
- Unused new image candidates were moved into `.runtime/media-review/` after verifying both
  absolute paths stayed inside this workspace. Only selected publication media remains in assets.
- `.gitignore` already covers `.runtime/` and Python cache. No additional pattern was required.
- Publication media is intentional source content. Every new selected file is under 500 KB.

Artifact checklist: temporary files **not fully deleted** (ignored and excluded); git changes
limited to the task's pages/docs/tests/publication media; no large raw downloads staged;
existing ignore rules verified. Do not report the temporary directory as cleaned.
