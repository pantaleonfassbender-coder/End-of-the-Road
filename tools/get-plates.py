"""Plates: downloads originals from Wikimedia Commons once into tools/src/plates and writes assets/plates/<id>.jpg
(at most 1400 px wide). Licences in data/plates.json. No image of the film or of its star is used.
Run from the repository root:  python tools/get-plates.py   (the 1955 map: python tools/make-topo.py)"""
import time, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "tools" / "src" / "plates", ROOT / "assets" / "plates"
UA = {"User-Agent": "EndOfTheRoad/1.0 (local history game)"}
URL = "https://commons.wikimedia.org/wiki/Special:FilePath/{}?width=2000"
PLATES = {
    "courthouse": "Citrus County Courthouse- Inverness, Florida (7493919056).jpg",
    "road": "Yankeetown west01.jpg",
    "townsign": "Yankeetown sign01.jpg",
    "inglis": "Inglis from Yankeetown.jpg",
    "lodge": "Yankeetown Izaak Walton Lodge01.jpg",
    "marion": "Marion Hotel from Florida SR 40.jpg",
}
for pid, name in PLATES.items():
    p = SRC / f"{pid}.jpg"
    if not p.exists():
        SRC.mkdir(parents=True, exist_ok=True)
        url = URL.format(urllib.parse.quote(name.replace(" ", "_")))
        for k in range(5):
            try:
                p.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA)).read()); break
            except urllib.error.HTTPError as e:
                if e.code != 429: raise
                time.sleep(20 * (k + 1))
        time.sleep(2)
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    if im.width > 1400:
        im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{pid}.jpg", quality=84, optimize=True)
    print(pid, im.size)
