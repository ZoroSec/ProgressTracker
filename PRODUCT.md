# Product

## Register

product

## Users

One person — the owner of the file — tracking their own daily habits. Two distinct
contexts, confirmed with the user, and the design has to serve both without favouring
either:

- **Phone, any time of day.** Ticking off what got done. Ten seconds, one hand,
  frequently in poor light. Input has to be thumb-sized and reachable without
  horizontal scrolling.
- **Desktop, less often.** Looking at the month as a whole — what's holding, what
  lapsed, how long the current run is. Density is welcome here; the full grid should
  be legible at a glance.

No accounts, no sharing, no second user. Data belongs to the person and stays on
their machine.

## Product Purpose

Record which habits were done on which days, and make the shape of that record
legible — runs, gaps, and how the current month is going.

Success is that opening it is frictionless enough to survive an unmotivated day. A
tracker that is any effort to update stops being updated, and a tracker with holes in
it is worse than none, because the record stops being trustworthy.

Explicitly not: a coach, a social network, or a system that judges. It records; the
user draws the conclusions.

## Brand Personality

Quiet, exact, unhurried. The voice of a well-kept logbook — it states what happened
and gets out of the way. No praise, no nagging, no exclamation marks. Dates and
numbers are the loudest thing on the page.

Emotional goal: the small satisfaction of a filled-in row. Earned by accumulated
evidence, never by the interface congratulating you.

## Anti-references

- **Streak-guilt apps** (Duolingo's lost-streak grief, badge shelves, confetti). Missing
  a day is information, not a failure to be dramatised.
- **The SaaS metrics dashboard**: a row of big-number stat tiles over a gradient
  accent. The month grid already shows the whole story; restating it as four
  hero numbers is decoration pretending to be insight.
- **Cream / sand / beige "warm minimal"** surfaces, the current generative default.
- Gamification vocabulary generally: levels, XP, trophies, streak flames.

## Design Principles

1. **The record is the interface.** The grid of days is the product. Summary numbers
   support it; they never replace it or outrank it visually.
2. **Ticking is the fast path.** The most common action — marking today — is reachable
   in one tap from open, on the smallest screen, without scrolling or zooming.
3. **A gap is neutral.** Missed days are rendered as absence, never as warning colour
   or corrective copy.
4. **Both contexts are first-class.** Phone and desktop each get a layout that suits
   them, not one layout tolerated at the other size.
5. **The data is the user's.** Local-first, legible on disk, exportable in one click,
   never silently lost.

## Accessibility & Inclusion

- WCAG 2.2 AA. Body text ≥ 4.5:1, large text ≥ 3:1, verified in both themes.
- Light and dark both designed deliberately, following the system preference with a
  manual override — the phone-at-night and desktop-in-daylight contexts are equally
  real.
- Full keyboard operation: native checkbox semantics for today's ticks, visible focus
  rings everywhere, no mouse-only affordances.
- Tap targets ≥ 44px in the ticking path.
- State is never carried by colour alone — a ticked day also changes shape and
  carries an accessible label.
- `prefers-reduced-motion` honoured; every transition has a still alternative.
