---
description: Plan and build a new lecture deck from its Notion lecture plan
argument-hint: <topic, e.g. "data" or "loops">
---

Build a new lecture deck for: **$ARGUMENTS**

Follow CLAUDE.md, `docs/design-system.md` and `docs/slide-patterns.md` throughout.

## 1. Gather the plan

- Find the lecture in the Notion Course Elements database (Course = Programming, Type = Lecture) whose
  name or topic matches "$ARGUMENTS". If there are several (e.g. a lecture and its follow-up session),
  list them and ask which one. If no Notion connector is available, ask David to paste the plan.
- Note: date and time (Stockholm), week, Learning Objectives, the timed Session Plan, Materials, Canvas URL,
  Preparation Notes.
- Skim `functions/index.html` and any other lecture folders so the new deck continues the same style and
  can refer back to what students have already seen.

## 2. Propose an outline and wait for approval

Write a slide-by-slide outline, grouped by the Session Plan's sections with their start times:

```
<section> · 10:25
  07 <slide id>: <title (≤ 7 words)>: <what's on it>  [Try it | Your turn: what the student does]
```

Include: cover, running order, objectives, a band-slide opener per section where it helps, a break slide
with timer if the plan has a break, a recap, and a resources slide with the plan's links.
Use plain words in the outline and on the slides: sections, break, recap. No theatre vocabulary (see
"Drama pedagogy, not theatre" in `docs/design-system.md`).

Then ask, in one message:
- Where may code first appear? (In Functions: nothing before the break.)
- Do students have VS Code yet, or does everything run in the browser workspace?
- Anything in the plan to drop or expand.

Do not start building until David answers.

## 3. Build

- `cp -r _template $ARGUMENTS` (folder name: short, lowercase, the topic), then set `<title>` and
  `data-lecture`.
- Build slide by slide. Every slide gets speaker notes. Interactive slides work both for the presenter on
  the projector and for a student on their own laptop.
- Reuse components from `shared/deck.css`. Copy lecture-local ones from `functions/` if needed
  (its markup, not its theatre wording).

## 4. Check

- Run `python3 tools/check_deck.py $ARGUMENTS`. Fix every overflow and error it reports.
- Open the screenshots in `tools/out/$ARGUMENTS/` and look at each one: text fitting, nothing clipped,
  nothing overlapping the "Your turn" chip, band-slide beams clear of headlines.
- Exercise each interactive slide at least once (click the options, run the code, step through).

## 5. Finish

- Add the lecture to the list in the root `index.html`.
- Summarise for David: the slide list, what each interactive slide does, and anything you assumed.
