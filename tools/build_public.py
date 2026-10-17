"""Build public/: the free game for Netlify (netlify.toml publishes only this folder): the page, the rules, the study
reader, the data, the plates, the guide and the legal page. Sources and tools stay in the repository.
Files are overwritten in place (OneDrive may lock folders against deletion); stale files are removed one by one.
Run:  python tools/build_public.py"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
FILES = ["index.html", "engine.js", "game.js", "style.css", "guide.html", "legal.html", "_headers",
         "data/deck.json", "data/plates.json"]
want = set(FILES) | {f"assets/plates/{p.name}" for p in (ROOT / "assets" / "plates").glob("*") if p.is_file()}
for f in want:
    (PUB / f).parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(ROOT / f, PUB / f)
for p in PUB.rglob("*"):
    if p.is_file() and p.relative_to(PUB).as_posix() not in want:
        p.unlink()
print("public/:", sum(1 for _ in PUB.rglob("*") if _.is_file()), "files,", sum(f.stat().st_size for f in PUB.rglob("*") if f.is_file()) // 1024, "KB")
