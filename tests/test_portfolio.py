"""Static publishing checks for the portfolio; run with python -m unittest discover -s tests -v."""

# Test Plan
# - Valid partitions: every local href/src/poster in the HTML and every image/video named in
#   content.js resolves to a real file; each project has the fields the page renders.
# - Boundaries: no external scripts at all; stylesheets only from Google Fonts; videos never
#   autoplay with sound and always show controls; ids unique; 404 page routes old URLs home.
# - Privacy/honesty: confidential client identifiers, the student number and credentials never
#   appear in published files; required disclosures (pre-production, fictional replica data,
#   AI-assisted credit, team credit) survive content edits; old case-study pages stay retired.
# These check the published files, not the behaviour of the source applications.

from html.parser import HTMLParser
from pathlib import Path
import json
import re
import shutil
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
PUBLISHED = [ROOT / "index.html", ROOT / "404.html", *sorted((ROOT / "assets").rglob("*.*"))]
CONTENT = (ROOT / "assets/js/content.js").read_text(encoding="utf-8")


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.elements = []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


def project_ids():
    return re.findall(r'^\s*id: "([a-z0-9-]+)", title:', CONTENT, re.M)


class PortfolioTests(unittest.TestCase):
    def test_local_links_and_assets_resolve(self):
        # Why: a missing image, video, stylesheet or script breaks the page silently on GitHub Pages.
        for path in (ROOT / "index.html", ROOT / "404.html"):
            page = Page(path)
            ids = [a["id"] for _, a in page.elements if "id" in a]
            self.assertEqual(len(ids), len(set(ids)), f"duplicate ids in {path.name}")
            for _, attrs in page.elements:
                for key in ("href", "src", "poster"):
                    value = attrs.get(key)
                    if value is None:
                        continue
                    with self.subTest(page=path.name, ref=value):
                        self.assertTrue(value.strip())
                        if re.match(r"^(https?:|mailto:|#)", value):
                            continue
                        rel = value.lstrip("/").split("#")[0]
                        target = ROOT / (rel if rel and not rel.endswith("/") else rel + "index.html")
                        self.assertTrue(target.is_file(), value)

    def test_content_media_and_widgets_exist(self):
        # Why: project cards and sheets build file paths from content.js at runtime.
        for name in re.findall(r'(?:img|video): "([^"]+)"', CONTENT):
            with self.subTest(file=name):
                folder = "media" if name.endswith(".mp4") else "images"
                self.assertTrue((ROOT / folder / name).is_file(), name)
        widgets = (ROOT / "assets/js/widgets.js").read_text(encoding="utf-8")
        registry = re.search(r"const REG = \{([^}]+)\}", widgets).group(1)
        for name in set(re.findall(r'widget: "([a-z]+)"', CONTENT)) - {"washproof"}:
            with self.subTest(widget=name):
                self.assertIn(name, registry)

    def test_every_project_has_the_fields_the_page_renders(self):
        ids = project_ids()
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual("washproof", ids[0], "WashProof must stay the featured first project")
        blocks = re.split(r'\n  \{\n    id: "', CONTENT.split("const PROJECTS = [", 1)[1].split("\n];", 1)[0])[1:]
        self.assertEqual(len(ids), len(blocks))
        for block in blocks:
            with self.subTest(project=block[:20]):
                for field in ("title:", "tagline:", "kind:", "built:", "status:", "summary:", "points:", "credit:", "stack:", "visual:"):
                    self.assertIn(field, block)
                self.assertRegex(block, r'built: "(hand|ai|team|mixed)"')

    def test_noscript_summary_lists_every_project(self):
        # Why: visitors without JavaScript (and crawlers) still see the full project list.
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        noscript = home.split("<noscript>", 1)[1].split("</noscript>", 1)[0]
        for title in re.findall(r'^\s*id: "[a-z0-9-]+", title: "([^"]+)"', CONTENT, re.M):
            with self.subTest(title=title):
                self.assertIn(f"<b>{title}</b>", noscript)

    def test_no_external_scripts_and_only_google_font_styles(self):
        for path in (ROOT / "index.html", ROOT / "404.html"):
            for tag, attrs in Page(path).elements:
                with self.subTest(page=path.name, tag=tag, attrs=attrs):
                    if tag == "script" and "src" in attrs:
                        self.assertFalse(re.match(r"^(https?:)?//", attrs["src"]))
                    if tag == "link" and attrs.get("rel") == "stylesheet":
                        href = attrs["href"]
                        self.assertTrue(href.startswith("assets/") or href.startswith("https://fonts.googleapis.com/"), href)

    def test_videos_show_controls_and_never_autoplay_on_load(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        for tag in re.findall(r"<video[^>]*>", home):
            with self.subTest(video=tag[:60]):
                self.assertIn("controls", tag)
                self.assertIn("playsinline", tag)
                self.assertIn('preload="none"', tag)
                self.assertNotIn("autoplay", tag)
                self.assertIn("aria-label=", tag)
        for path in PUBLISHED:
            if path.suffix == ".js":
                for tag in re.findall(r"<video[^>]*autoplay[^>]*>", path.read_text(encoding="utf-8")):
                    with self.subTest(file=path.name, video=tag[:60]):
                        self.assertIn("muted", tag, "autoplay is only allowed muted, after a click")

    def test_confidential_and_personal_data_never_publish(self):
        # Why: the client is confidential; the student number and old credentials must not leak again.
        forbidden = [r"\bKTS\b", r"Washlist", r"7266117", r"autocompilations", r"hk21ne", r"leaguehomey",
                     r"BEGIN [A-Z ]*PRIVATE KEY", r"AKIA[0-9A-Z]{16}", r"ghp_[A-Za-z0-9]{20,}", r"(?i)password\s*[:=]\s*['\"][^'\"]+"]
        for path in [*PUBLISHED, ROOT / "README.md", *(ROOT / "docs").glob("*.md")]:
            text = path.read_text(encoding="utf-8", errors="replace") if path.suffix not in {".png", ".jpg", ".mp4"} else ""
            for pattern in forbidden:
                with self.subTest(file=path.name, pattern=pattern):
                    self.assertIsNone(re.search(pattern, text))

    def test_honesty_disclosures_survive_edits(self):
        # Why: these lines keep the portfolio's claims accurate; deleting one should fail loudly.
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        for needle in ("Pre-production", "fictional data", "the client is confidential"):
            with self.subTest(needle=needle):
                self.assertIn(needle, home)
        for needle in ("AI-assisted, I directed", "Teammates built the similarity engine", "Base app by my collaborator",
                       "One collaborator built early kiosk and portal flows", "correlational and exploratory", "I write the spec",
                       "Card art masked", "test-fixture character, renamed"):
            with self.subTest(needle=needle):
                self.assertIn(needle, CONTENT)
        site = (ROOT / "assets/js/site.js").read_text(encoding="utf-8")
        self.assertIn("Counted October 15, 2026", site)

    def test_old_case_study_pages_are_retired_and_redirected(self):
        # Why: the retired pages carried outdated counts; old links must land somewhere useful.
        html = sorted(p.name for p in ROOT.glob("*.html"))
        self.assertEqual(["404.html", "index.html"], html)
        not_found = (ROOT / "404.html").read_text(encoding="utf-8")
        for old in ("washproof", "token-trail", "tft-optimizer", "twitchclipper"):
            with self.subTest(old=old):
                self.assertRegex(not_found, rf'"?{re.escape(old)}"?\s*:\s*"#')
        for path in PUBLISHED:
            if path.suffix in {".html", ".js"}:
                with self.subTest(file=path.name):
                    self.assertNotIn("403 commits", path.read_text(encoding="utf-8"))

    @unittest.skipUnless(shutil.which("node"), "node not installed")
    def test_scripts_parse(self):
        for path in sorted((ROOT / "assets/js").glob("*.js")):
            with self.subTest(file=path.name):
                result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
                self.assertEqual(0, result.returncode, result.stderr)

    def test_structured_data_is_valid_json(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        data = json.loads(home.split('<script type="application/ld+json">', 1)[1].split("</script>", 1)[0])
        self.assertEqual("Person", data["@type"])
        self.assertEqual("https://github.com/Maikeeeb", data["sameAs"][0])


if __name__ == "__main__":
    unittest.main()
