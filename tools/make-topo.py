"""Plate from the USGS 1:24,000 Yankeetown quadrangle, 1955 edition (public domain, US government work):
the town, the Withlacoochee, Bird Creek and Pumpkin Island. Source PDF in tools/src (USGS TopoView, id 349174).
Run from the repository root:  python tools/make-topo.py"""
from pathlib import Path
import pymupdf
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent
d = pymupdf.open(ROOT / "tools" / "src" / "yt_349174.pdf")
pix = d[0].get_pixmap(dpi=160)
im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
W, H = im.size
im = im.crop((int(0.03 * W), int(0.62 * H), int(0.66 * W), int(0.90 * H)))
if im.width > 1600:
    im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
im.save(ROOT / "assets" / "plates" / "topo1955.jpg", quality=86, optimize=True)
print(im.size)
