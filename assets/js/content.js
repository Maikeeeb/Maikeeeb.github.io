/* Portfolio content. Facts were re-gathered from each project's source on 2026-10-15; counts are
   source inventories at that date (see docs/content-sources.md). Edit this file to update the site. */
const PROFILE = {
  name: "Charlotte Kerrigan",
  role: "Software developer",
  line: "Backend, full-stack and test engineering. I build systems that hold up, and I can show the evidence.",
  intro: "Computer Science graduate (Brock, 2026). I lead WashProof, a records platform for a fleet-service client, and I build tooling that lets AI coding agents work under tests, reviews and human approval.",
  email: "ckerrigan789@gmail.com",
  github: "https://github.com/Maikeeeb",
  location: "Mississauga, ON",
  open: "Open to junior backend, full-stack, QA and automation roles.",
  education: { degree: "B.Sc. Computer Science", school: "Brock University", dates: "2021 – 2026", note: "Graduated June 2026" },
  ai: "Several projects were built with AI coding agents. I write the spec, set the gates (tests, coverage, review, human approval) and review what ships. Each project says how it was built.",
};

const BUILT = {
  hand: "Hand-written",
  ai: "AI-assisted, I directed",
  team: "Team project",
  mixed: "Lead + AI agents",
};

const PROJECTS = [
  {
    id: "washproof", title: "WashProof", tagline: "Tamper-evident wash records for a fleet operator", year: "2026", sort: 2026.9,
    kind: "Client", built: "mixed", tier: "feature", status: "Pre-production · beta rehearsal",
    role: "Lead developer & architect", tags: ["backend", "fullstack", "qa", "security"],
    stack: ["ASP.NET Core 8", "EF Core", "PostgreSQL", "React 19", "TypeScript", "Tailwind", "Playwright", "xUnit", "Vitest", "Stryker", "Azure Bicep"],
    summary: "I worked the wash bay, saw daily service logged on paper, and proposed the replacement. WashProof runs the kiosk queue, staff sign-off, supervisor review and billing preparation, with records that freeze and an audit log that can prove it wasn't edited.",
    points: [
      "Records freeze 24 h after completion; changes become append-only corrections with a reason",
      "Per-company SHA-256 audit hash chain, with a database trigger that blocks edits and deletes",
      "CSRF filter, hashed sessions and device codes, PBKDF2 portal passwords, lockouts",
      "CI ratchets coverage at 96% lines / 94% branches; mutation floors on the invoice and permission rules",
    ],
    stats: [["693", "of 766 commits mine"], ["248", "merged PRs"], ["1,505", "backend tests"], ["19", "Playwright specs"]],
    credit: "I wrote about 90% of commits. One collaborator built early kiosk and portal flows (Apr–Jun 2026). Coding agents worked under my review.",
    visual: { img: "washproof-records.png", video: "washproof-kiosk.mp4", widget: "washproof" },
    repo: null, repoNote: "Private client repo",
  },
  {
    id: "twitchclipper", title: "TwitchClipper", tagline: "Highlight reels from chat activity", year: "2026", sort: 2026.2,
    kind: "Solo", built: "ai", tier: "main", status: "Working prototype",
    role: "Design, architecture, review", tags: ["backend", "automation", "qa"],
    stack: ["Python", "FastAPI", "SQLite", "ffmpeg", "pytest", ".NET 8 WPF", "xUnit"],
    summary: "Fetches a stream's chat replay, finds message-rate spikes, ranks the moments and cuts a montage with ffmpeg. A FastAPI job API with SQLite persistence sits behind a CLI and a WPF desktop client.",
    points: ["Pure, deterministic spike → segment → score pipeline with a 5-level tie-break", "Chat fetcher with pagination, retries and 429 handling", "310 pytest tests pass; 54 xUnit tests on the desktop client"],
    credit: "Solo repo. Built with AI coding agents under ticketed rules. The idea started as a 2023 prototype.",
    visual: { widget: "spikes" }, repo: "https://github.com/Maikeeeb/TwitchClipper",
  },
  {
    id: "tft", title: "TFT Comp Optimizer", tagline: "Beam-search team builder with a React UI", year: "2026", sort: 2026.05,
    kind: "Solo", built: "ai", tier: "main", status: "Set 16 snapshot",
    role: "Design, solver, review", tags: ["fullstack", "algorithms", "qa"],
    stack: ["Python", "FastAPI", "React", "TypeScript", "MUI", "JSON Schema", "pytest", "Vitest", "GitHub Actions"],
    summary: "Finds the strongest Teamfight Tactics lineup under team-size limits, trait blacklists and emblem caps. A beam-search solver prunes teams that can no longer meet their constraints; a JSON-schema config drives the React form.",
    points: ["Vertical-trait seeds keep far breakpoints from being pruned early", "Feasibility and score bounds cut dead branches each round", "About 270 tests; CI on Python 3.10–3.12 and Node"],
    credit: "Solo repo (135 commits), built with AI coding agents. Game data is Riot's; stats from MetaTFT.",
    visual: { img: "tft-results.png", video: "tft-solver.mp4", widget: "beam" }, repo: "https://github.com/Maikeeeb/tftcalcs",
  },
  {
    id: "agents", title: "Agent orchestration", tagline: "Coding agents that can't approve themselves", year: "2026", sort: 2026.7,
    kind: "Solo", built: "ai", tier: "main", status: "Simulated + offline tests; live runs pending",
    role: "Spec, safety rules, review", tags: ["ai", "backend", "qa"],
    stack: ["Python", "SQLite", "FastAPI", "React", "Git worktrees", "GitHub CLI", "systemd"],
    summary: "Two tools for running coding agents safely. AI Kanban is a board where agents implement and review tickets but only a human approves merges. agentq is its headless follow-up: implementer and reviewer lanes on one Linux worker that deliver only the exact commit a reviewer approved.",
    points: ["Version-checked SQLite transitions, so a late agent result can't override a cancel", "Delivery refuses if the branch moved after approval; never merges to main", "Agent processes run in their own process group so cancellation kills children", "71 tests (agentq) and 207 pytest + 36 Vitest (Kanban)"],
    credit: "I wrote the specs and safety rules; coding agents wrote most of the code under my review. Also: a stdlib-Python deep-research workflow with claim tracing (109 checks).",
    visual: { widget: "lanes" }, repo: null, repoNote: "Not yet public",
  },
  {
    id: "tokentrail", title: "Token Trail", tagline: "Instructor APIs for a code-similarity tool", year: "2026", sort: 2026.3,
    kind: "Team", built: "team", tier: "main", status: "Capstone, 6 people",
    role: "Backend & API testing", tags: ["backend", "qa"],
    stack: ["FastAPI", "MongoDB", "Docker Compose", "pytest", "React"],
    summary: "A plagiarism-detection tool for programming courses. I built the backend instructors use to review results and most of the API contract tests. Teammates built the similarity engine and the UI.",
    points: ["Ranked-pair and side-by-side comparison endpoints with ownership checks", "Hashing service for student IDs, 30-day retention purge, sliding-window rate limiter", "34 of 49 HTTP contract tests, plus a regression and evaluation harness"],
    credit: "26 of 135 non-merge commits. Teammates built the similarity engine and the UI.",
    visual: { img: "token-report.png", video: "token-comparison.mp4", imgNote: "Team-built UI" }, repo: "https://github.com/Ikechukwu-Okogwu/token-trail",
  },
  {
    id: "riftbound", title: "Deck Insights", tagline: "Card-synergy mining for a trading card game", year: "2026", sort: 2026.5,
    kind: "Solo", built: "ai", tier: "main", status: "Exploratory analysis",
    role: "Method, pipeline, review", tags: ["algorithms", "data"],
    stack: ["Python", "pytest", "Static HTML dashboards"],
    summary: "Ingests 132 tournament decklists for one Riftbound legend, mines card packages with Apriori, scores them by win-rate lift with uncertainty, and recommends a 40-card list in an interactive dashboard.",
    points: ["Apriori from scratch: 90,595 packages at ≥20 co-occurrences", "Synergy = both − A − B + neither, with Welch SE shrunk toward the pooled variance", "Placement-to-win-rate model documented with its limits; 39 tests"],
    credit: "Solo, built with AI coding agents. Results are correlational and exploratory.",
    visual: { widget: "apriori" }, repo: null, repoNote: "Private until card art and scraped pages are removed",
  },
  {
    id: "relicworks", title: "Rust Belt Relicworks", tagline: "Typed, tested idle-game prototype", year: "2026", sort: 2026.4,
    kind: "Solo", built: "ai", tier: "main", status: "Validation prototype",
    role: "Design, architecture, review", tags: ["fullstack", "qa", "games"],
    stack: ["Svelte 5", "TypeScript", "Vite", "Vitest", "Playwright"],
    summary: "A browser idle game about restoring a workshop. The game rules are a pure reducer; saves are versioned and validated; offline progress is capped; telemetry stays local and needs consent.",
    points: ["Pure reducer: invalid actions return the same state", "Offline progress capped at min(10 min, 25% of active play)", "41 Vitest + 11 Playwright tests and a first-session pacing simulator"],
    credit: "Solo, built in a week with AI coding agents under my direction.",
    visual: { img: "relicworks-workshop.jpg", video: "relicworks-workshop.mp4" }, repo: null, repoNote: "Private",
  },
  {
    id: "tlibuilding", title: "TLIBuilding", tagline: "Damage calculator features for a teammate's app", year: "2026", sort: 2026.55,
    kind: "Collab", built: "ai", tier: "main", status: "Collaboration",
    role: "Feature layer in my fork", tags: ["backend", "algorithms", "qa"],
    stack: ["Python", "PyQt6", "pytest", "mypy"],
    summary: "A Torchlight: Infinite damage calculator started by a friend and frequent collaborator. I added a game-log importer, a damage-based best-in-slot crafting optimizer, versioned build files and calibration tests.",
    points: ["Best-in-slot search under crafting limits, with background-threaded previews", "~1k-line importer from game log to character state", "13 of the repo's 54 test files"],
    credit: "Base app by my collaborator. The features above are my July 2026 work, AI-assisted.",
    visual: {}, repo: null, repoNote: "Private fork",
  },
  {
    id: "moviepy", title: "MoviePy Video Editor", tagline: "A 2020 project, refactored and tested in 2026", year: "2020 → 2026", sort: 2025,
    kind: "Solo", built: "hand", tier: "main", status: "Refactored",
    role: "Solo", tags: ["automation", "qa"],
    stack: ["Python", "Pygame", "MoviePy", "pytest"],
    summary: "My first desktop app, from 2020. In 2026 I split the one-file UI into tested modules and fixed real bugs, including an import that deleted the user's original file.",
    points: ["21 pytest tests behind a 90% coverage gate (UI script excluded)", "Fixed data loss: move → copy on import", "Fixed a drag-reorder index bug and text overlays that never rendered"],
    credit: "Solo.",
    visual: { img: "moviepy-editor.png", video: "moviepy-export.mp4" }, repo: "https://github.com/Maikeeeb/Moviepy-Video-Editor",
  },
];

const LAB = [
  { id: "astar", title: "Pathfinding", from: "2023 Java experiment", built: "hand", widget: "astar", text: "My original was greedy best-first search, not true A*. Compare it with the textbook version." },
  { id: "ddmin", title: "Delta debugging", from: "COSC 3P95 · 2023", built: "hand", widget: "ddmin", text: "Shrink a failing input to the character that causes it. My linear pass against real ddmin." },
];

const EARLIER = [
  ["2023", "Project TD", "Python damage calculator with a teammate; reverse-engineered an armour formula."],
  ["2023", "TCP chatroom", "Threaded socket chat with a fixed-header protocol, packaged with PyInstaller."],
  ["2022", "Short-form video pipeline", "gTTS narration and MoviePy compositing to 1080×1920, NVENC export."],
  ["2022", "Recursive maze walk", "COSC 1P03: depth-first search that marks the path with arrows."],
  ["2022", "Sudoku model", "Row, column and box validation in Java; solver unfinished."],
  ["2020", "Unity endless runner", "Procedural road of straight and curved pieces, lane-switching state machine."],
  ["2020", "C++ / SFML engine", "ECS-based 2D engine with AABB collision and a tile-map editor."],
  ["2020", "Twitch clip compiler", "Selenium, threading and MoviePy; my first automation project."],
];

const SKILLS = [
  ["Languages", ["C#", "Python", "TypeScript", "Java", "SQL", "C++"]],
  ["Backend", ["ASP.NET Core", "EF Core", "FastAPI", "PostgreSQL", "SQLite", "MongoDB", "REST", "OpenAPI"]],
  ["Frontend", ["React", "Svelte", "Tailwind", "Vite", "TanStack Query"]],
  ["Testing", ["xUnit", "pytest", "Vitest", "Playwright", "Stryker", "MSW", "contract tests", "coverage gates"]],
  ["Security", ["CSRF", "session hardening", "RBAC tests", "audit hash chains", "Trivy"]],
  ["Delivery", ["GitHub Actions", "Docker", "Azure Bicep", "migrations rehearsal", "restore drills"]],
  ["AI-assisted dev", ["Claude Code", "Codex", "Cursor", "review gates", "git worktrees"]],
];

const EXPERIENCE = [
  { dates: "2024 – now", role: "Coach bus wash bay attendant", org: "Confidential fleet-service company", text: "Daily service lists across a commercial fleet. Spotted the paper-records gap that became WashProof." },
  { dates: "2021 – 2026", role: "B.Sc. Computer Science", org: "Brock University", text: "Capstone: Token Trail. Courses in testing and analysis, languages, systems and algorithms." },
  { dates: "2019", role: "Retail assistant", org: "Shoppers Drug Mart, Grimsby", text: "" },
  { dates: "2018", role: "Dishwasher", org: "Casa Toscana, Grimsby", text: "" },
  { dates: "2016 – 2020", role: "Real Programming for Kids", org: "Oakville", text: "Four summers building games in Java and C++/C#." },
];

const WP_TRY = [
  { id: "flow", label: "Sign off a bus", hint: "Tap DEMO-101, mark each service Done, enter mileage, submit.", done: ["submitted"] },
  { id: "review", label: "Review and invoice it", hint: "Switch user, open the record, Mark reviewed, then Mark invoiced.", done: ["invoiced"] },
  { id: "history", label: "Read its history", hint: "Open History on any record.", done: ["history"] },
];
const WP_BREAK = [
  { act: "stale", label: "Save from a stale tab", rule: "Optimistic concurrency → 409" },
  { act: "skip", label: "Invoice before review", rule: "Forward-only state machine" },
  { act: "freeze", label: "Edit a day-old record", rule: "24 h freeze, corrections only" },
  { act: "washer", label: "Washer tries to invoice", rule: "Role checks on the server" },
  { act: "double", label: "Double-tap Submit", rule: "Idempotency key replay" },
];
