# Slide patterns

Copy-paste reference for building decks. Everything here is styled by `shared/deck.css` unless marked
**lecture-local** (those live in `functions/index.html`'s `<style>`; copy them into your lecture, or
promote them to `deck.css` if a second lecture needs them).

The lectures built before week 41's Data lecture (`intro/`, `functions/`, `functions-group/`,
`tools-of-the-trade/`) still use theatre wording ("Scene 02", "Intermission", "Curtain call",
"Applause"). Copy their markup and scripts, not their words: follow the Voice rules in
`design-system.md`.

## Page skeleton

Start from `_template/index.html`. The parts that matter:

```html
<link rel="stylesheet" href="../shared/tokens.css">
<link rel="stylesheet" href="../shared/deck.css">
<body data-lecture="loops" data-home="../">
<main id="stage"><div id="deck">
  … <section class="slide"> … one per slide …
</div></main>
<script src="../shared/deck.js"></script>
<script src="../shared/workspace.js"></script>   <!-- only if the lecture runs code -->
<script> (function(){ var D=Deck, $=D.$; … })(); </script>
```

`deck.js` builds the bottom bar, slide index, notes panel, keyboard and touch navigation, and scaling.
Don't add your own.

## Slide attributes

```html
<section class="slide" id="mystery" data-sec="What functions are for" data-ex="Mystery machine">
```

| Attribute | Effect |
|---|---|
| `id` | Required, unique, short. Becomes the link `…/functions/#mystery`. |
| `data-sec` | Section name shown in the bar. Use the Session Plan's section names. |
| `data-ex` | Exercise: index shows "Your turn", `E` jumps here. Add `<span class="turn">Your turn</span>`. |
| `data-demo` | Demo the presenter drives. Add `<span class="turn try">Try it</span>`. |

Every slide ends with `<aside class="nt">speaker notes</aside>`.

## Slide types

### Band slide (cover, section openers, big statements, break, recap)

```html
<section class="slide stage" id="cover" data-sec="Opening">
  <div class="beam y"></div><div class="beam m"></div><div class="scan"></div>
  <div class="inner">
    <div class="billing">KD402D Programming · Week 41</div>
    <h1 class="hero">Give it a name. Call it again.</h1>      <!-- .hero.md for longer lines -->
    <p class="lede">One or two sentences.</p>
  </div>
  <aside class="nt">…</aside>
</section>
```

### Content slide

```html
<section class="slide" id="roles" data-sec="What functions are for">
  <div class="billing">What functions are for · 10:25</div><hr class="rule">
  <h2 class="h1">Five jobs a function does</h2>
  … content …
</section>
```

Put the section name and start time in the kicker line (`.billing`) of the first slide of each section.
Don't number sections ("Scene 02"); write "Part 2" only where the Session Plan itself does.

## Layout helpers

| Class | Use |
|---|---|
| `.cols` | Two equal columns. `.cols.wide-l` / `.cols.wide-r` for 1.15:0.85 splits. |
| `.stack` | Vertical flex, 16px gap. |
| `.row` | Horizontal flex, wraps, 12px gap. `.grow` fills remaining space. |
| `.rows` | Rule-separated rows (set `grid-template-columns` on `.rows>div`). Variants below. |

## Text

| Class | Use |
|---|---|
| `.lede` | Intro paragraph, 22px, ≤ 52ch. |
| `.dir` | Narration of what the computer does, italic display face. |
| `.small`, `.muted` | 16px; muted colour. |
| `<code>` inside `p`, `li`, `.dir`, `.lede` | Inline code with a yellow highlight. |
| `.rows.lab` + `.num` + `.tx` | Numbered steps (objectives, lab briefs). `.lab.big` for few, large items. |
| `.rows.script` + `.cue.a` / `.cue.b` + `.line` | A role-play script with speaker labels. |
| `ol.plain` | Plain list inside a panel, rule between items. |
| `.named` (`.nm` + `.rl`) | A yellow "named thing" card: a packaged recipe, a rule, a role card. |
| `.terms` | Row of outlined term chips on a band slide. |
| `.timer` | Huge countdown numerals on a band slide (see the break slide). |

## Panels, code and consoles

```html
<div class="panel">
  <div class="bar"><span>greet.js</span><span>type along</span></div>   <!-- .bar.y yellow, .bar.p paper, .bar.m magenta -->
  <pre class="code" id="x-code"></pre>                                 <!-- .sm 17px, .lg 23px -->
</div>
<div class="panel">
  <div class="bar y"><span>console</span></div>
  <div class="console" id="x-con"></div>
</div>
<div class="panel"><div class="bar p"><span>a recipe</span></div><div class="pbody">…</div></div>
```

```js
D.code($("#x-code"), 'function greet(name) {\n  return "Hello, " + name;\n}', [1]); // highlight + spotlight line 1
D.flash($("#x-code"), [3]);                                                 // flash line 3 after a change
D.conLines($("#x-con"), [{c:"in",t:"run greet.js"}, "Hello, Ana", {c:"ok",t:"1 passing"}]);
// console classes: in (command), ok (green), bad (pink), dim (italic grey)
```

Hand-marked code (for clickable parts) uses the syntax classes directly: `.k` keyword, `.s` string,
`.n` number, `.c` comment, `.fn` function name, `.pl` plain. See the anatomy slide in `functions/`.

## Buttons and inputs

```html
<button class="btn">Run the code</button>        <!-- primary (magenta) -->
<button class="btn alt">Open the workspace</button> <!-- yellow -->
<button class="btn ghost">Start over</button>       <!-- white -->
<button class="btn cy">double( )</button>           <!-- cyan, for "tools" -->
<div class="seg"><button class="btn ghost sel">24-hour</button><button class="btn ghost">12-hour</button></div>
<label class="f">A number to put in<input class="t" type="number"></label>
<textarea class="code-ed" rows="10" spellcheck="false"></textarea>   <!-- dark code editor -->
```

## Feedback

```html
<div class="fb" id="q-fb"></div>
```
```js
D.fb($("#q-fb"), "pass", "Correct. …");   // pass | err | warn | note; D.fb(el) clears it
```

## Interaction recipes

All interactive code goes in the lecture's own script, one small IIFE per slide, labelled with the slide.
Look at `functions/index.html` for the full version of each.

### Multiple choice (`.opt`)

```js
var answered=false;
[["Nothing at all",true],["Hello!",false]].forEach(function(o){
  var b=document.createElement("button");b.className="opt";b.textContent=o[0];
  b.addEventListener("click",function(){
    if(answered)return;
    if(o[1]){b.classList.add("right");answered=true;D.fb($("#q-fb"),"pass","Right. …")}
    else{b.classList.add("wrong");D.fb($("#q-fb"),"note","Look again: …")}   // a hint, not the answer
  });
  $("#q-opts").appendChild(b);
});
```

Use `.chip` buttons for compact options in a grid of questions (see "Which job is it doing?").

### Reveal on click (`.rows.reveal`)

Rows of `.opt` buttons that each reveal an `.ans` span. See the debrief slide.

### Step-through (Back / Next / Start again)

Keep an array of states and a `render()` that draws state `i`. Used for the stage/call-stack replay.
Disable Back at the start and Next at the end.

### Simulated output (no code execution)

For "what happens when…" demos, compute the output in the slide's own script and show it with
`D.code` and `D.conLines`. Only run real code where students write it.

### Hidden-rule machine

Student feeds inputs, sees outputs in a `table.io`, then guesses the rule from `.opt` buttons. Wrong guesses
name an input where that rule would have given a different answer.

### Running student code

```js
var r = D.run(src);               // {logs:[...], error?, blocked?}
var r = D.run(src, "double");     // also returns the student's function as r.value
var r = D.run(src, null, {Tone: Tone});  // extra globals for the code (a library, helpers)
D.edKeys(textarea, runFn);        // Tab indents, Ctrl/⌘+Enter runs
// Every textarea.code-ed is colour-coded automatically (workspace.js draws a highlighted copy under it).
// Set code with ta.value = …: the colours follow. D.colourEditor(ta) exists for editors made some other way.
```

Pass libraries through `env` rather than relying on `window`, so the fallback interpreter (which is
sandboxed) sees them too.

`r.blocked` means the fallback interpreter is still loading: show `r.error.message` as a note.
Otherwise report `r.error` as "The code stopped: `Name: message`".

### Tested challenges

See the "Five small functions" slide: tabs (`.tabs`), an editor, `Run the tests`, results list (`.res`).
Each challenge is `{f: name, task: html, start: code, tests: [[args, expected], …], check?: fn(src)}`.
Call `r.value` with each test's arguments, compare with `===`, list ✓ / ×, and if the function returned
`undefined`, ask whether they returned or only logged. Save code per challenge with `D.store`.

### The workspace

Any element with class `ws-open` opens the workspace drawer; `W` toggles it. Put this on follow-along slides:

```html
<div class="ws-cta"><button class="btn alt ws-open">Open the workspace</button><p>Type it in yourself and run it.</p></div>
```
`D.workspace.append(src)` adds starter code to the end of the student's workspace (it never replaces what's there).
`D.workspace.env.Tone = Tone` makes a library available to workspace code; `D.workspace.onRun(fn)` runs `fn`
before each workspace run (e.g. stopping sound that is still playing).

## Storage

```js
D.store.get("card"); D.store.set("card", JSON.stringify(card));   // kd402d:<lecture>:card
D.courseStore.get("workspace");                                   // kd402d:workspace (shared)
```
Strings only. Wrap `JSON.parse` in try/catch.

## Sound (Tone.js)

`shared/vendor/tone.min.js` is Tone.js, loaded before `deck.js` by lectures that make sound. `functions-group/`
has the sound editor (`soundEd`: editor, Play/Stop, a piano roll of what played, optional pads and tests),
a recorder that sees every `triggerAttackRelease` (with a dry mode for testing a student's function silently),
and `stopAll()`, bound to S. Copy them from there; promote to `shared/` if a third lecture needs them.

`conditionals/` adds a song player (`songPlayer`: runs code on Tone's clock and fills an 8-bar beat grid as it plays).
Two traps it works around:
- `Tone.Transport` is fixed to the audio context that existed when Tone.js loaded. `stopAll()` swaps contexts, so after
  the first stop, student code calling `Tone.Transport.start()` starts a dead clock. Pass student code a `Tone` whose
  `Transport` is a getter for `Tone.getTransport()` (see `ToneEnv` in `conditionals/`).
- JetBrains Mono draws `===`, `!==`, `<=`, `>=` as ligatures. Decks that teach these operators turn ligatures off
  (`font-variant-ligatures:none`), so students see the characters they type.

## Lecture-local components in `functions/` worth reusing

`.card` (role card), `.stagebox` + `.actor` (what's running, who's waiting), `.nest` (nested-request boxes),
`.part` (clickable code parts), `.prompt` (big question text), `.expr` + `.trace` (expression builder),
`.chat` (a chat-app mock), `.map` (four-column mapping strip), `.order` (running order).

## Helpers on `window.Deck`

| | |
|---|---|
| `$`, `$$`, `esc` | Query helpers; HTML-escape |
| `hl(src)`, `code(el, src, spotlightLines)`, `flash(el, lines)` | Syntax highlighting |
| `fb(el, kind, html)`, `conLines(el, lines)`, `fmt(value)` | Feedback, console output |
| `store`, `courseStore` | Per-viewer storage |
| `go(i)`, `scale()`, `addButton({label, key, onClick})`, `onEscape(fn)` | Deck control |
| `run`, `edKeys`, `workspace.show(bool)`, `workspace.append(src)`, `workspace.env`, `workspace.onRun(fn)` | Added by `workspace.js` |
