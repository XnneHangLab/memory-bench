"""Offline structural checks across all docs pages: python scripts/check_site.py."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
REQUIRED_PAGES = ("index.html", "design.html", "protocol.html", "references.html")


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


def parse_page(path: Path) -> Page:
    page = Page()
    page.feed(path.read_text(encoding="utf-8"))
    assert len(page.ids) == len(set(page.ids)), f"Duplicate HTML IDs in {path.name}"
    return page


def main():
    pages = {name: parse_page(DOCS / name) for name in REQUIRED_PAGES}
    assert len(pages["index.html"].axes) == len(set(pages["index.html"].axes)) == 6, "Six distinct axes required on index.html"
    assert {"why", "stance", "dimensions", "explore"} <= set(pages["index.html"].ids)
    assert {"coverage", "scale", "schema", "example", "roadmap"} <= set(pages["design.html"].ids)
    assert {"protocol", "baselines", "scoring", "efficiency"} <= set(pages["protocol.html"].ids)
    assert {"scale-ref", "provenance"} <= set(pages["references.html"].ids)

    for name, page in pages.items():
        for link in page.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            target_page = name
            if url.path:
                target_file = DOCS / unquote(url.path)
                assert target_file.is_file(), f"Missing target {link} in {name}"
                target_page = unquote(url.path)
            if url.fragment:
                assert target_page in pages, f"Unknown HTML page {target_page} for fragment #{url.fragment}"
                assert url.fragment in pages[target_page].ids, f"Missing anchor #{url.fragment} in {target_page} (linked from {name})"

    print("PASS: multi-page docs, six axes, unique IDs, local assets, cross-page anchors and required sections")


if __name__ == "__main__":
    main()
