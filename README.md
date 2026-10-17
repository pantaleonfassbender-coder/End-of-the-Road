# End of the Road

**A free documentary game: Yankeetown, Florida, in the summer of 1961.** A Hollywood film company came to the town at the end of State Road 40 to shoot *Follow That Dream*. You are the town: its council and the people who speak for it. First the company's three requests (paint the road, build a beach on Pumpkin Island, find local help), then six weeks of crowds, storms and questions. Each choice is marked as the record, a later account, a memory or a game assumption. Two voices, the town's quiet and the town's chance, are measured and neither wins. The star of the film is never a character.

**Live:** https://end-of-the-road-the-game.netlify.app/ · **On itch.io:** https://leofassb.itch.io/end-of-the-road

A short, independent local-history game; not affiliated with the film's makers, the estate of its star or any trademark holder. No image, music or text from the film is used.

## Sources

- J. Kunerth, report in the *Orlando Sentinel*, 14 August 1987 (Yankeetown people remembering the summer; reprinted online by Elvis Australia, 2011). Summarized, not quoted.
- *Ocala Gazette*, "The summer of Elvis" (Ocala bank scenes, security, the 1962 premiere). Summarized.
- Reference works on the film (dates, locations); Visit Florida and Nature Coast accounts (Pumpkin Island, the parkway of 1996).

## Files

- `index.html`, `game.js` (the page), `engine.js` (the rules, also for Node), `style.css`, `guide.html`, `legal.html`.
- `data/deck.json`: weeks, requests, questions, record, readings, epilogue, tuning; `data/plates.json`.
- `mc.js`: bots (`node mc.js 200`). `tools/get-plates.py`, `tools/make-topo.py` (USGS 1955 map), `tools/build_public.py` (builds `public/`, which Netlify publishes); `itch/` for the itch.io page.

## Licences

Code and texts © 2026 Pantaleon Fassbender, free to play. Plates as credited in `data/plates.json` (USGS and State Archives of Florida, public domain; three photographs CC BY 2.5).
