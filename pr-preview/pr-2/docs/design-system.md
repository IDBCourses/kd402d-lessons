# Design system

The course's visual and verbal identity. Tokens are defined in `shared/tokens.css`; use the
CSS variables, never raw hex values in new code. The design system has a working name in its own files,
but **that name never appears on the site**.

## The idea

Theatre meets early computing: a 1991 computer lab that happens to be a stage. Ice-blue paper, big
Radio Canada headlines, chunky navy outlines, hard offset shadows, mono uppercase control labels, and a
flat electric-blue **stage band** crossed by hard-edged light beams. Code is always shown as real code.

## Colour

| Role | Token | Use |
|---|---|---|
| Paper | `--paper-100` (page), `--paper-000` (cards), `--paper-200/300/400` (rules, tints, muted numerals) | Content slides |
| Stage | `--blue-600` | Stage-band slides only (cover, big statements, break, curtain call) |
| Ink | `--ink-900` outlines, shadows, code ground; `--ink-700` body text; `--ink-500` muted | Never pure black |
| Action | `--curtain-600` (buttons, links, focus), `--curtain-700` hover, `--curtain-500` display fills only, never behind text | ≤ 15% of a slide |
| Spotlight | `--spot-400` beams, chips, console header bars; `--spot-200` highlights | Light, not paint: never behind white text |
| Panels | `--cyan-400` code-panel header bars; `--applause-500` passing tests | |
| Status | `pass`, `err`, `warn`, `note` feedback (`.fb.*`) | Text on tints uses the dark `*-ink` colours |

No gradients, no glows, no glassmorphism, no purple-blue washes. Colour comes as flat blocks.
Two page grounds only: paper and stage blue.

## Type

- **Radio Canada 700**: display only (hero, slide titles, scene numbers). Tight tracking. Never below 27px.
  The magenta offset shadow (`text-shadow`) only on stage-band headlines ≥ 54px.
- **Work Sans**: all prose and UI text. 400 prose, 500 labels.
- **JetBrains Mono**: code, consoles, and every control label (buttons, panel bars, chips):
  700, uppercase, 0.06em tracking. Write button text in sentence case; CSS uppercases it.
- **Italic Radio Canada 500** (`.dir`): stage directions only.
- **Billing line** (`.billing`): the small uppercase dot-separated line above a slide title, with a rule
  under it. Format: `Scene 02 · Section name · 10:25` or `Section · Detail`. This and script speaker
  cues are the only all-caps text.
- Fixed scale on slides: hero 96 / 72, title 54, lede 22, body 20, small 16.

## Layout

- Slide canvas 1280×720, padding 56/80/48. Content left-aligned.
- Structure with hairline rules and rows, not nested boxes. A slide is usually: billing line, rule, title, content.
- Cards and controls: 2px navy outline, 2px radius, hard shadow `3px 3px 0 var(--ink-900)`.
  Panels have a mono header bar (cyan for code, yellow for console, paper for plain content).
- Radii: 0 for rules and bands, 2px for everything else, 999px only for chips like "Your turn".
- Numbered rows (`.num`) only for real sequences: running order, steps, objectives.
- Two light beams maximum on a stage slide (yellow, then narrower magenta), kept clear of the headline.

## Motion

- Slide entrance: content rises 10px and fades in (built into `deck.css`). Nothing else animates on its own.
- Feedback motion answers a student's action: a brief yellow flash on what changed.
- Everything respects `prefers-reduced-motion`.

## Interaction states

Hover darkens. Press collapses the shadow (moves 2px). Focus is always a visible 2px magenta outline.
Disabled uses paper fill and faint text, never opacity. Correct answers turn mint (`.right`), wrong
ones pink (`.wrong`).

## Voice

A director talking to a company of actors: warm, specific, a little theatrical, never precious.
The reader is a capable beginner, not a child.

- "We" for the course and the room; "you" for the student's own work.
- Sentence case everywhere. Plain verbs. Active voice.
- Never "simply", "just", "obviously", "easy".
- No emoji anywhere. Unicode only where typographically right: `·` `—` `→` `✓` `×`.
- Errors are quoted verbatim, in code style: `TypeError: undefined is not a function`.
- Feedback explains what happened and what to try, in the interface's voice. Wrong answers get a hint,
  not the answer.

### Lengths

Slide titles ≤ 7 words. Card titles ≤ 5. Buttons 1–3 words, verb first ("Run the tests", "Put it in",
"New machine"). Ledes 1–2 sentences.

### Theatre vocabulary

Use where it earns its keep, gloss it once on first use, and never bend technical accuracy to fit:

| Term | Means |
|---|---|
| Act | a module of the course |
| Scene | a section of a lecture |
| Cue / calling | invoking a function |
| Cast card | a student's description of the function they play |
| Stage direction | italic note on what the machine does |
| Blocking | planning a program before writing it |
| Curtain call | the recap at the end |
| Applause | a passing test or correct answer ("All tests applauded.") |
| Director / Interpreter | whoever is running the program in a role-play |

Format on first use: theatre term, then the real one: "Curtain call (a.k.a. the recap)".

### House examples

- Correct: "Applause. With `return`, the value travels back to line 5 and lands in `a`."
- Error: "The scene stopped: there's no function called `double`. Check the spelling, capitals included."
- Empty: "Nothing put in yet. Try 0, 1 and 10."
- Nudge: "Your function gave back `undefined`. Did you `return` the answer, or only log it?"
