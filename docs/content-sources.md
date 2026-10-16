# Content sources

Every fact on the page was re-gathered from the project's own source on **2026-10-15**:
git history (`git shortlog -sne`, `git log --numstat`, `git blame`), test files, CI workflows
and, where it was safe, by running the test suites. Counts are source inventories at that date,
not live numbers. When you update a project, re-count and change the date next to the figure.

| Project | Source | Key facts and how they were counted |
| --- | --- | --- |
| WashProof | Private client repository, `integration` branch | 766 commits, 693 by Charlotte across two git identities; 248 merged PRs (`gh pr list --state merged`); 1,505 `[Fact]`/`[Theory]` in 189 files; 133 frontend test files; 19 Playwright specs; 49 migrations; 8 CI jobs plus mutation, release and restore-drill workflows. Pre-production: the go-live tracker is open. |
| TwitchClipper | github.com/Maikeeeb/TwitchClipper | 24 commits, solo, AI-assisted; 310 pytest passed, 3 skipped (run); 54 xUnit tests (counted, not run). |
| TFT Comp Optimizer | github.com/Maikeeeb/tftcalcs | 135 commits, solo, AI-assisted; 136 pytest + about 134 Vitest tests (counted); Set 16 data. |
| Agent orchestration | Local repositories (not yet public) | agentq: 71 tests passed (run), never run live. AI Kanban: 207 pytest + 36 Vitest (counted). Deep-research scripts: 109 checks passed (run). |
| Token Trail | github.com/Ikechukwu-Okogwu/token-trail | 26 of 135 non-merge commits; 34 of 49 API contract tests; engine and UI by teammates (`git blame`). |
| Deck Insights | Private repository | 132 valid decks of 174; 90,595 packages at ≥20 co-occurrences (from a build run); 39 tests passed (run). |
| Rust Belt Relicworks | Private repository | 13 commits, AI-assisted; 41 Vitest + 11 Playwright tests (counted). |
| TLIBuilding | Private fork of a collaborator's repository | 10 of 35 commits; best-in-slot optimizer, log importer, build files; 13 of 54 test files. |
| MoviePy Video Editor | github.com/Maikeeeb/Moviepy-Video-Editor | 2026 refactor of the 2020 original; 21 pytest tests passed, 93.5% branch coverage with the UI script excluded (run). |

## Media

Screenshots and recordings in `images/` and `media/` are captures of the real software. WashProof
captures come from a separate Docker demo instance with fictional records; client identity,
branding and staff are withheld. Check every frame for identifying details before adding media.

## Demos

The WashProof replica and the demos in `widgets.js` are browser re-implementations written for this
site with illustrative data. They mirror the projects' rules and algorithms; they are not the
original code. The pathfinding demo ports the 2023 Java experiment's exact rules (4-way moves,
priority = trunc(g×cost + euclidean×distance), early goal test) next to textbook A*.
