"""Screenshots for itch.io with headless Chrome from the local preview (port 8983):  python itch/make-shots.py"""
import subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SHOTS = [("1-title", "/", 1300, 1000), ("2-meeting", "/#demo-0", 1300, 1100), ("3-week3", "/#demo-3", 1300, 1200),
         ("4-summer", "/#demo-7", 1200, 1900)]
for name, url, w, h in SHOTS:
    out = ROOT / "itch" / f"screenshot-{name}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={w},{h}", f"--screenshot={out}",
                    "--virtual-time-budget=8000", "http://localhost:8983" + url], capture_output=True)
    print(out.name, out.stat().st_size // 1024 if out.exists() else "MISSING", "KB")
