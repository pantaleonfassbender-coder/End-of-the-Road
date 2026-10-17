"""Build itch/end-of-the-road-itch.zip from public/ (run tools/build_public.py first):  python itch/build-itch.py"""
import zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PUB, OUT = ROOT / "public", ROOT / "itch" / "end-of-the-road-itch.zip"
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for f in PUB.rglob("*"):
        if f.is_file() and f.name != "_headers":
            z.write(f, f.relative_to(PUB).as_posix())
print(OUT.name, OUT.stat().st_size // 1024, "KB")
