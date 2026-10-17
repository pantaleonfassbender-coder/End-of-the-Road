"""Screenshots for itch.io with headless Chrome from the local preview (port 8977):  python itch/make-shots.py"""
import subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SHOTS = [("1-title", "/", 1300, 1000), ("2-1591", "/#demo-6", 1300, 1250), ("3-1597", "/#demo-12", 1300, 1250),
         ("4-reckoning", "/#demo-20", 1200, 1800), ("5-study", "/#study-6", 1300, 1100),
         ("6-london", "/#england-8", 1300, 1250), ("7-account", "/#england-19", 1200, 1700)]
for name, url, w, h in SHOTS:
    out = ROOT / "itch" / f"screenshot-{name}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={w},{h}", f"--screenshot={out}",
                    "--virtual-time-budget=8000", "http://localhost:8977" + url], capture_output=True)
    print(out.name, out.stat().st_size // 1024 if out.exists() else "MISSING", "KB")
