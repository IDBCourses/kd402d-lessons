# KD402D Programming: course site

This repo is the public site for **KD402D Programming**, a first-year course in the Interaction Design
bachelor's programme at Malmö University (K3), autumn 2026 (HT2026-KD402D-K3028, Canvas course 22858).
It holds one interactive slide deck per lecture, published with GitHub Pages.

The course teaches JavaScript to beginners using **drama pedagogy** as a method: students physically act
out what the computer does (one student is a function, another holds the value it returns, someone reads
the loop aloud), alongside rigorous basics: syntax, debugging, and planning a program before typing it.

Drama pedagogy is how the room learns. It is **not** a theatre theme. Slides, notes, outlines and messages
use plain teaching language: sections, break, recap, correct. Never theatre metaphors: no acts, scenes,
intermission, curtain call, applause, stage, cast, cues, blocking, director. The lectures built before the
Data lecture still contain such wording; copy their code, not their words.

Read these before building anything:
- `docs/design-system.md`: colours, type, layout, voice and copy rules. Follow it exactly.
- `docs/slide-patterns.md`: markup and JavaScript for every slide type and interactive component.
- `functions/index.html`: the reference lecture. When unsure how to do something, copy what it does.

## Repo layout

```
index.html          course home: lecture list (add each new lecture here)
shared/             tokens.css, deck.css, deck.js, workspace.js, vendor/: used by every lecture
<lecture>/index.html  one folder per lecture, named after the topic: functions/, data/, loops/ …
_template/          copy this to start a lecture
tools/check_deck.py   verifies decks (run it before saying a deck is done)
docs/               reference for you; not linked from the site
```

Plain HTML, CSS and JavaScript. **No build step, no frameworks, no npm packages, no CDNs** for code.
Everything must work by opening the files from a static server.

## Where lecture content comes from

Lecture plans live in David's Notion workspace, on the page **🗓️ Programming HT26 Course Plan**
(the **Course Elements** database, rows where **Course = Programming**). Find it by searching for that title.
Each lecture row has Learning Objectives, Materials & Resources, a timed **Session Plan**, and
Preparation Notes. The deck follows the Session Plan's sections and timings.

- If a Notion connector is available, read the lecture row from there. Otherwise ask David to paste it.
- Never modify Notion rows for other courses. Use Stockholm time for any dates.
- Use the Canvas module link from the row's "Canvas URL" property for resources slides.

## Working on a lecture

Use `/new-lecture <topic>` for a new deck. The workflow it follows:

1. **Read the plan** in Notion (or as pasted).
2. **Propose an outline before building**: one line per slide, grouped by the plan's sections with times,
   saying which slides are interactive and what the student does on each. Ask about anything the plan
   leaves open, especially:
   - Where code may first appear. In Functions, the first half was strictly conceptual: no code, no
     syntax, no identifiers, no `fn()` notation until after the break. Ask whether the new lecture
     follows the same rule.
   - Whether students have VS Code yet. In week 41 they didn't (set-up was the Wednesday TA session),
     so all coding happened in the in-browser workspace. Don't send students to VS Code or vscode.dev
     unless David says so.
3. **Build** in `<topic>/index.html`, copied from `_template/`. Set `<title>` and `data-lecture="<topic>"`.
4. **Check**: run `python3 tools/check_deck.py <topic>` and look at the screenshots it writes. Fix any
   slide that overflows or errors. Click through the interactive slides in a browser if you can.
5. **List it** on the home page (`index.html`): add an `<li>` with the week, title, one-line summary, date.

## Rules that are easy to get wrong

- Don't put the name of the design system ("Rehearsal") anywhere on the site.
- No theatre vocabulary in anything you write (see above and `docs/design-system.md` → Voice). CSS names
  like `.stage` or `--curtain-600` are fine in code; their words never go on a slide.
- Kicker lines (`.billing`) read `Section name · 10:35`, never `Scene 02 · …`.
- Slides are a fixed 1280×720 canvas, scaled to fit. Everything must fit at that size; never rely on scrolling a slide.
- Interactive slides need both a presenter use (David drives it on the projector) and a student use
  (each student on their own laptop with the same link). Keep state per viewer; never require a server.
- Code runs through `Deck.run()`, never `eval` directly, so the fallback interpreter keeps working.
- Save per-viewer data only with `Deck.store` (this lecture) or `Deck.courseStore` (shared). Never store
  anything about the student beyond what they type into the deck.
- Escape anything a student types before putting it in HTML (`Deck.esc`), or use `textContent`.
- Every slide gets speaker notes (`<aside class="nt">`): what to say, what to ask, timing, common mistakes.
- Keep JavaScript ES5-compatible in style (`var`, `function`) to match the existing files.

## Changing shared files

`shared/` affects every lecture. Prefer lecture-local CSS in the page's `<style>` block. If a component is
needed by a second lecture, move it from the lecture into `shared/deck.css` and update
`docs/slide-patterns.md`. After any change to `shared/`, run `python3 tools/check_deck.py` (all lectures).

## Previewing

```
python3 -m http.server 8000      # then open http://localhost:8000/<topic>/
python3 tools/check_deck.py      # all lectures; or pass one folder name
```
`check_deck.py` needs Playwright: `pip install playwright && playwright install chromium`.
