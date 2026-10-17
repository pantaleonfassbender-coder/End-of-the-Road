"""itch/cover-630x500.png from the USGS Yankeetown quadrangle of 1955 (public domain): the end of State Road 40."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
ROOT = Path(__file__).resolve().parent.parent
im = Image.open(ROOT / "assets" / "plates" / "topo1955.jpg").convert("RGB")
im = im.crop((0, 0, 1000, 800))
im = ImageOps.fit(im, (630, 500), Image.LANCZOS, centering=(0.3, 0.4))
d = ImageDraw.Draw(im, "RGBA")
d.rectangle((0, 350, 630, 500), fill=(18, 52, 58, 236))
serif = lambda s: ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", s)
d.text((26, 360), "End of the Road", font=serif(46), fill=(246, 244, 236))
d.text((28, 422), "Yankeetown, Florida, and the film company · summer 1961", font=serif(18), fill=(190, 230, 232))
d.text((28, 452), "Free · you are the town · the record and local memories", font=serif(15), fill=(170, 196, 198))
im.save(ROOT / "itch" / "cover-630x500.png")
print("cover-630x500.png")
