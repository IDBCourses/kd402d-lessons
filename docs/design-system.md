# Design system

The course's visual and verbal identity. Tokens are defined in `shared/tokens.css`; use the
CSS variables, never raw hex values in new code. The design system has a working name in its own files,
but **that name never appears on the site**.

## The idea

Early computing, bold and flat: a 1991 computer lab. Ice-blue paper, big Radio Canada headlines, chunky
navy outlines, hard offset shadows, mono uppercase control labels, and a flat electric-blue **band**
slide crossed by hard-edged diagonal beams. Code is always shown as real code.

The visual style is just a style. It is **not** a theatre theme, and the words on the slides never are
either (see Voice). Some CSS class and token names (`.stage`, `.beam`, `.billing`, `--curtain-*`,
`--applause-*`, `--spot-*`) are leftovers from an earlier working name: use them in code, but never let
their vocabulary leak into slide text, notes, outlines or messages to David.

## Colour

| Role | Token | Use |
|---|---|---|
| Paper | `--paper-100` (page), `--paper-000` (cards), `--paper-200/300/400` (rules, tints, muted numerals) | Content slides |
| Band | `--blue-600` | Band slides only (cover, big statements, section openers, break, recap) |
| Ink | `--ink-900` outlines, shadows, code ground; `--ink-700` body text; `--ink-500` muted | Never pure black |
| Action | `--curtain-600` (buttons, links, focus), `--curtain-700` hover, `--curtain-500` display fills only, never behind text | ≤ 15% of a slide |
| Highlight | `--spot-400` beams, chips, console header bars; `--spot-200` highlights | Light, not paint: never behind white text |
| Panels | `--cyan-400` code-panel header bars; `--applause-500` passing tests | |
| Status | `pass`, `err`, `warn`, `note` feedback (`.fb.*`) | Text on tints uses the dark `*-ink` colours |

No gradients, no glows, no glassmorphism, no purple-blue washes. Colour comes as flat blocks.
Two page grounds only: paper and band blue.

## Type

- **Radio Canada 700**: display only (hero, slide titles, big numerals). Tight tracking. Never below 27px.
  The magenta offset shadow (`text-shadow`) only on band-slide headlines ≥ 54px.
- **Work Sans**: all prose and UI text. 400 prose, 500 labels.
- **JetBrains Mono**: code, consoles, and every control label (buttons, panel bars, chips):
  700, uppercase, 0.06em tracking. Write button text in sentence case; CSS uppercases it.
- **Italic Radio Canada 500** (`.dir`): a short narration of what the computer is doing, e.g.
  *JavaScript works out the right-hand side first, then puts the result in the box.*
- **Kicker line** (`.billing`): the small uppercase dot-separated line above a slide title, with a rule
  under it. Format: `Section name · 10:35` on the first slide of a section (the Session Plan's own
  section name and start time), `Section name · Detail` elsewhere, `KD402D Programming · Week 41` on the
  cover. No numbering like "Scene 02" or "Act I". This and role-play speaker labels are the only
  all-caps text.
- Fixed scale on slides: hero 96 / 72, title 54, lede 22, body 20, small 16.

## Layout

- Slide canvas 1280×720, padding 56/80/48. Content left-aligned.
- Structure with hairline rules and rows, not nested boxes. A slide is usually: billing line, rule, title, content.
- Cards and controls: 2px navy outline, 2px radius, hard shadow `3px 3px 0 var(--ink-900)`.
  Panels have a mono header bar (cyan for code, yellow for console, paper for plain content).
- Radii: 0 for rules and bands, 2px for everything else, 999px only for chips like "Your turn".
- Numbered rows (`.num`) only for real sequences: running order, steps, objectives.
- Two beams maximum on a band slide (yellow, then narrower magenta), kept clear of the headline.

## Motion

- Slide entrance: content rises 10px and fades in (built into `deck.css`). Nothing else animates on its own.
- Feedback motion answers a student's action: a brief yellow flash on what changed.
- Everything respects `prefers-reduced-motion`.

## Interaction states

Hover darkens. Press collapses the shadow (moves 2px). Focus is always a visible 2px magenta outline.
Disabled uses paper fill and faint text, never opacity. Correct answers turn mint (`.right`), wrong
ones pink (`.wrong`).

## Voice

A teacher talking to a class of capable beginners: warm, specific, direct, a little playful, never
precious or cute. The reader is a capable beginner, not a child.

- "We" for the course and the room; "you" for the student's own work.
- Sentence case everywhere. Plain verbs. Active voice.
- Never "simply", "just", "obviously", "easy".
- No emoji anywhere. Unicode only where typographically right: `·` `—` `→` `✓` `×`.
- Errors are quoted verbatim, in code style: `TypeError: undefined is not a function`.
- Feedback explains what happened and what to try, in the interface's voice. Wrong answers get a hint,
  not the answer.

### Lengths

Slide titles ≤ 7 words. Card titles ≤ 5. Buttons 1–3 words, verb first ("Run the tests", "Put it in",
"New onion"). Ledes 1–2 sentences.

### Drama pedagogy, not theatre

The course uses **drama pedagogy** as a teaching method: students physically act out what a program
does (one student is a function, another holds the value it returns, someone reads a loop aloud) so the
abstract becomes bodily and social. That is a classroom activity, not a theme for the site.

So the slides talk about programming and about the activity in plain words. **Never** use theatre
metaphors: no acts, scenes, intermission, curtain call, applause, stage, spotlight, cast, cues, blocking,
director, rehearsal, performance or "the show".

| Say | Not |
|---|---|
| section, part (as the Session Plan names it) | scene, act |
| break | intermission |
| recap, wrap-up, summary | curtain call |
| correct, right, all tests pass | applause, applauded |
| act it out, play the function, take a role | perform, be on stage |
| role card (what the function you play does) | cast card |
| call, calling | cue |
| planning a program | blocking |
| the person running the program | director, interpreter |
| "what's running now", "waiting" | "on stage", "in the wings" |

### House examples

- Correct: "Correct. With `return`, the value travels back to line 5 and lands in `a`."
- Error: "The code stopped: there's no function called `double`. Check the spelling, capitals included."
- Empty: "Nothing put in yet. Try 0, 1 and 10."
- Nudge: "Your function gave back `undefined`. Did you `return` the answer, or only log it?"
- Activity: "Three volunteers: one of you is `chop`, one holds the result, one reads the code aloud."
