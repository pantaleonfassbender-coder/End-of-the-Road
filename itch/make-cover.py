"""itch/cover-630x500.png from Linschoten's view of Angra on Terceira (1595–96, public domain)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
ROOT = Path(__file__).resolve().parent.parent
im = Image.open(ROOT / "assets" / "plates" / "angra.jpg").convert("RGB")
im = ImageOps.fit(im, (630, 500), Image.LANCZOS, centering=(0.5, 0.45))
d = ImageDraw.Draw(im, "RGBA")
d.rectangle((0, 350, 630, 500), fill=(34, 28, 18, 235))
serif = lambda s: ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", s)
d.text((26, 360), "A Great Lottery", font=serif(46), fill=(246, 238, 220))
d.text((28, 422), "The Spanish silver fleets in the war with England, 1585–1604", font=serif(18), fill=(222, 204, 160))
d.text((28, 452), "Free · from the Casa de Contratación · with a study", font=serif(15), fill=(186, 174, 150))
im.save(ROOT / "itch" / "cover-630x500.png")
print("cover-630x500.png")
