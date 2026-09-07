"""Static site regression checks; run with python -m unittest discover -s tests -v."""

# Test Plan
# - Valid partitions: homepage links, detail-page anchors, local image/video/style assets.
# - Boundaries: relative paths and fragments, direct entry to the case study, empty links.
# - Misuse/failure: missing assets, duplicate IDs, autoplay, unlabeled media, hidden payloads.
# - Privacy: the entry card is anonymized and uses the reviewed media set.
#   Visual privacy still requires inspecting the actual captures before publication.

from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.elements = []
        self.text = path.read_text(encoding="utf-8")
        self.feed(self.text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


class PortfolioTests(unittest.TestCase):
    def test_washproof_entry_points_open_dedicated_case_study(self):
        # Why: an image lightbox must not swallow navigation to the requested project page.
        home = Page(ROOT / "index.html")
        links = [attrs for tag, attrs in home.elements if tag == "a"]
        self.assertEqual(3, sum(link.get("href") == "washproof.html" for link in links))
        image = next(
            attrs
            for tag, attrs in home.elements
            if tag == "img" and attrs.get("src") == "images/washproof-records.png"
        )
        self.assertNotIn("shot", image.get("class", "").split())
        self.assertIn("confidential fleet-service client", home.text)
        self.assertNotIn("images/washproof-demo.png", home.text)

    def test_detail_page_local_assets_and_navigation_resolve(self):
        # Why: catches direct-entry failures, broken return navigation, and missing media.
        page = Page(ROOT / "washproof.html")
        ids = [attrs["id"] for _, attrs in page.elements if "id" in attrs]
        self.assertEqual(len(ids), len(set(ids)), "Duplicate navigation targets")
        for tag, attrs in page.elements:
            for attribute in ("href", "src", "poster"):
                if attribute not in attrs:
                    continue
                value = attrs[attribute]
                self.assertTrue(value.strip(), f"Empty {tag}.{attribute}")
                url = urlsplit(value)
                if url.scheme or url.netloc:
                    continue
                target = ROOT / (unquote(url.path) or "washproof.html")
                with self.subTest(target=value):
                    self.assertTrue(target.is_file(), value)
                    if url.fragment:
                        target_page = Page(target)
                        self.assertIn(url.fragment, [a.get("id") for _, a in target_page.elements])

    def test_real_media_has_controls_descriptions_and_safe_loading(self):
        # Why: video must remain usable without scripts, and must not download or play on arrival.
        page = Page(ROOT / "washproof.html")
        videos = [attrs for tag, attrs in page.elements if tag == "video"]
        self.assertEqual(2, len(videos))
        for video in videos:
            with self.subTest(video=video["poster"]):
                self.assertIn("controls", video)
                self.assertIn("playsinline", video)
                self.assertNotIn("autoplay", video)
                self.assertEqual("none", video.get("preload"))
                self.assertIn("Silent", video["aria-label"])
                self.assertIn("aria-describedby", video)
        for tag, attrs in page.elements:
            if tag == "img":
                self.assertGreater(len(attrs.get("alt", "")), 20)
                self.assertIn("width", attrs)
                self.assertIn("height", attrs)
        sources = [attrs["src"] for tag, attrs in page.elements if tag == "source"]
        self.assertEqual(["media/washproof-kiosk.mp4", "media/washproof-review.mp4"], sources)

    def test_case_study_preserves_attribution_and_privacy_disclosure(self):
        # Why: publishing the work must retain team credit, honest status, and anonymization context.
        page = Page(ROOT / "washproof.html")
        for required in (
            "two-person project",
            "My collaborator contributed",
            "Ongoing development",
            "separate Docker demo instance",
            "all records and staff identities are fictional",
            "authorization boundaries",
            "not a finished rollout",
        ):
            with self.subTest(disclosure=required):
                self.assertIn(required, page.text)
        self.assertNotIn("data:video", page.text)
        self.assertNotIn("washproof-workflow.svg", page.text)
        self.assertNotIn("<script", page.text)
        self.assertFalse((ROOT / "images/washproof-demo.png").exists())


if __name__ == "__main__":
    unittest.main()
