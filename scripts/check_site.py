"""Offline structural checks: python scripts/check_site.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.axes = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if "data-axis" in attrs:
            self.axes.append(attrs["data-axis"])
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])


def main():
    page = Page()
    page.feed((ROOT / "docs/index.html").read_text(encoding="utf-8"))
    assert len(page.ids) == len(set(page.ids)), "Duplicate HTML IDs"
    assert len(page.axes) == len(set(page.axes)) == 6, "Six distinct axes required"
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        if url.path:
            assert (ROOT / "docs" / unquote(url.path)).is_file(), link
        elif url.fragment:
            assert url.fragment in page.ids, link
    assert {"why", "dimensions", "protocol", "scoring", "efficiency", "references", "next"} <= set(page.ids)
    print("PASS: six axes, unique IDs, local assets, anchors and required sections")


if __name__ == "__main__":
    main()
