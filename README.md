# KD402D Programming: course site

Lecture slides and in-class exercises for KD402D Programming (Malmö University, HT2026).
Plain HTML, CSS and JavaScript: no build step, no dependencies to install.

## Layout

```
index.html            course home: list of lectures and course links
shared/
  tokens.css          colours, type and motion from the course style guide
  deck.css            slide frame, panels, buttons, feedback, chrome, workspace
  deck.js             navigation, slide index, speaker notes, scaling, helpers (window.Deck)
  workspace.js        in-browser code editor + console, and the code runner
  vendor/sval.min.js  fallback JavaScript interpreter (MIT, see sval.LICENSE)
functions/            one folder per lecture; index.html is the deck
_template/            starting point for a new lecture (not linked from the home page)
tools/check_deck.py   checks every slide fits and nothing errors; screenshots to tools/out/
CLAUDE.md             brief for Claude Code (read automatically)
docs/                 design system and slide-pattern reference
.claude/commands/     /new-lecture command for Claude Code
```

## Working with Claude Code

Open the repo in Claude Code and run `/new-lecture loops` (or any topic). It reads the lecture plan from
Notion (or asks you to paste it), proposes a slide outline for you to approve, builds the deck from
`_template/`, runs `tools/check_deck.py`, and adds the lecture to the home page. `CLAUDE.md` holds the
project rules; `docs/` holds the design and component reference it builds from.

## Adding a lecture

1. Copy `_template/` to a new folder named after the lecture, e.g. `data/`.
2. In its `index.html`, set the `<title>` and `data-lecture="data"` on `<body>`.
3. Write slides as `<section class="slide">` inside `#deck`. `functions/index.html` has every pattern.
4. Add a `<li>` for it to the list in the root `index.html`.

## Slide conventions

- `id="..."` on a slide becomes its link: `.../functions/#machine`.
- `data-sec="..."` is the section name shown in the bottom bar.
- `data-ex="..."` marks an exercise: it gets "Your turn" in the index, and `E` jumps to it.
- `data-demo="..."` marks a demo (`Try it`).
- `<aside class="nt">` holds speaker notes, shown with `N`.
- Anything with class `ws-open` opens the workspace.

## Keys

`←` `→` move · `E` next exercise · `W` workspace · `I` slide index · `N` notes · `F` full screen · `Esc` closes panels

## Saved data

Everything is stored in the student's own browser (localStorage); nothing is sent anywhere.

- `kd402d:workspace`: the workspace, shared by every lecture, so code carries over between sessions.
- `kd402d:<lecture>:...`: anything specific to one lecture (e.g. `kd402d:functions:card`).

## Running student code

`workspace.js` runs code with the browser's own engine. If a page is ever served with a security
policy that forbids that, it loads `vendor/sval.min.js` and runs the same code in an interpreter instead.
Code runs on the page itself, so an infinite loop will freeze the tab until it is reloaded.

## Checking a deck

```
pip install playwright && playwright install chromium   # once
python3 tools/check_deck.py            # all lectures
python3 tools/check_deck.py functions  # one lecture
```

## Previewing locally

```
python3 -m http.server
```
then open http://localhost:8000/. (Opening the files directly also works, but the
fallback interpreter only loads over http.)

## Publishing on GitHub Pages

Every push to `main` is copied to the `gh-pages` branch by `.github/workflows/deploy.yml`, and GitHub
Pages serves that branch. The `.nojekyll` file makes GitHub serve the files as they are.

Repository setting this needs (once): Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`.
Both workflows ask for write access in their own `permissions:` block, so the repository's default
workflow permissions (set by the IDBCourses organisation) can stay read-only.

### PR previews

Every pull request is published to `https://<site>/pr-preview/pr-<number>/` by
`.github/workflows/preview.yml`, which comments the link (with a QR code) on the PR and updates it on each
push. The preview is deleted when the PR is merged or closed. Previews share the live site's origin, so a
preview sees the same saved workspace as the live decks in that browser.

At the end of a term, tag it (`git tag ht26`) so that run can always be recovered.
