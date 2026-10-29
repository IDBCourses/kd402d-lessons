#!/usr/bin/env python3
"""Check KD402D lecture decks.

Serves the repo over HTTP, opens each lecture in headless Chromium, steps through every slide, and reports:
  - content that overflows the 1280x720 slide (decorative .beam/.scan elements and editors' coloured copies are ignored)
  - JavaScript errors and failed requests (Google Fonts failures are reported separately)
  - slides missing speaker notes, duplicate slide ids, exercises without a "Your turn" chip
Screenshots of every slide go to tools/out/<lecture>/NN-<id>.png.

Usage:
  python3 tools/check_deck.py              # every lecture folder
  python3 tools/check_deck.py functions    # one or more lectures by folder name

Needs: pip install playwright && playwright install chromium
"""
import asyncio, functools, http.server, os, socketserver, sys, threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tools" / "out"
SKIP = {"shared", "tools", "docs", ".claude", ".git", "_template"}

def lectures(names):
    if names:
        return names
    return sorted(p.name for p in ROOT.iterdir()
                  if p.is_dir() and p.name not in SKIP and (p / "index.html").exists()
                  and 'id="deck"' in (p / "index.html").read_text(encoding="utf-8"))

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def serve():
    handler = functools.partial(Quiet, directory=str(ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, httpd.server_address[1]

SLIDE_INFO = """() => {
  const s=[...document.querySelectorAll('#deck .slide')].find(x=>!x.hidden);
  const r=s.getBoundingClientRect(), k=r.width/1280, bad=[];
  s.querySelectorAll('*').forEach(el=>{
    if(el.closest('.beam,.scan,.nt,.ed-hl')) return;   // .ed-hl: an editor's coloured copy, clipped and scrolled like its textarea
    const b=el.getBoundingClientRect();
    if(!b.width||!b.height) return;
    if(b.bottom>r.bottom+1||b.right>r.right+1||b.left<r.left-1)
      bad.push((el.id?'#'+el.id:el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\\s+/).join('.'):''))
        +' by '+Math.round(Math.max(b.bottom-r.bottom,b.right-r.right,r.left-b.left)/k)+'px');
  });
  return {id:s.id, overflow:[...new Set(bad)].slice(0,5),
          notes:!!s.querySelector('.nt'), ex:!!s.dataset.ex, chip:!!s.querySelector('.turn')};
}"""

async def check(page, base, name):
    problems, fonts = [], False
    errors = []
    page.on("pageerror", lambda e: errors.append(f"JS error: {e}"))
    def on_response(r):
        nonlocal fonts
        if r.status >= 400:
            if "fonts.g" in r.url: fonts = True
            elif not r.url.endswith("favicon.ico"): errors.append(f"HTTP {r.status}: {r.url}")
    page.on("response", on_response)
    def on_fail(req):
        nonlocal fonts
        if "fonts.g" in req.url: fonts = True
        else: errors.append(f"request failed: {req.url}")
    page.on("requestfailed", on_fail)

    await page.goto(f"{base}/{name}/")
    await page.wait_for_function("window.Deck !== undefined", timeout=10000)
    n = await page.evaluate("document.querySelectorAll('#deck .slide').length")
    ids = await page.evaluate("[...document.querySelectorAll('#deck .slide')].map(s=>s.id)")
    dupes = {i for i in ids if ids.count(i) > 1 or not i}
    if dupes: problems.append(f"missing or duplicate slide ids: {sorted(dupes)}")
    outdir = OUT / name; outdir.mkdir(parents=True, exist_ok=True)
    for old in outdir.glob("*.png"): old.unlink()
    for i in range(n):
        await page.evaluate(f"Deck.go({i})")
        await page.wait_for_timeout(400)
        info = await page.evaluate(SLIDE_INFO)
        label = f"{i+1:02d} #{info['id']}"
        if info["overflow"]: problems.append(f"{label}: overflows: {', '.join(info['overflow'])}")
        if not info["notes"]: problems.append(f"{label}: no speaker notes")
        if info["ex"] and not info["chip"]: problems.append(f"{label}: data-ex but no .turn chip")
        await page.screenshot(path=str(outdir / f"{i+1:02d}-{info['id']}.png"))
    return n, problems + errors, fonts

async def main(names):
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright is missing: pip install playwright && playwright install chromium")
    names = lectures(names)
    if not names: sys.exit("No lecture folders found.")
    httpd, port = serve()
    failed = False
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for name in names:
            if not (ROOT / name / "index.html").exists():
                print(f"✗ {name}: no {name}/index.html"); failed = True; continue
            page = await browser.new_page(viewport={"width": 1328, "height": 800})
            n, problems, fonts = await check(page, f"http://127.0.0.1:{port}", name)
            await page.close()
            print(f"{'✓' if not problems else '✗'} {name}: {n} slides, screenshots in tools/out/{name}/")
            for pr in problems: print(f"    {pr}")
            if fonts: print("    (Google Fonts didn't load here; fallback fonts were used, so line breaks may differ slightly)")
            failed |= bool(problems)
        await browser.close()
    httpd.shutdown()
    sys.exit(1 if failed else 0)

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))
