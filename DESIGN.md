---
name: Habits
description: A local-first habit tracker — tick today, read the month.
colors:
  bg: "oklch(1 0 0)"
  surface: "oklch(0.985 0.003 260)"
  sunken: "oklch(0.955 0.005 260)"
  line: "oklch(0.905 0.008 260)"
  line-strong: "oklch(0.82 0.012 260)"
  ink: "oklch(0.24 0.02 260)"
  muted: "oklch(0.45 0.018 260)"
  primary: "oklch(0.48 0.155 260)"
  primary-hover: "oklch(0.42 0.155 260)"
  primary-ink: "oklch(1 0 0)"
  primary-wash: "oklch(0.94 0.03 260)"
  danger: "oklch(0.52 0.17 25)"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: "-0.011em"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: "-0.011em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tabular-nums"
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  micro:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  cell: "5px"
  control: "6px"
  box: "7px"
  md: "10px"
  pill: "99px"
spacing:
  hair: "4px"
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  section: "36px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "38px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "38px"
  button-secondary-hover:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink}"
  input-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "38px"
  tick-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px 8px 14px"
    height: "44px"
  tick-row-checked:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.ink}"
  day-cell:
    backgroundColor: "{colors.sunken}"
    rounded: "{rounded.cell}"
    size: "19px"
  day-cell-done:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.cell}"
    size: "19px"
---

# Design System: Habits

## 1. Overview

**Creative North Star: "The Kept Ledger"**

A ledger is trusted because it is dull. It does not editorialise, congratulate, or
scold; it records what happened on the date it happened, in the same hand every
time, and its authority comes from being complete. This system is built to feel
like a well-kept book that happens to live on a screen — pale paper by day, the
same page under a lamp at night, ruled into thirty-one columns.

The interface is therefore almost entirely neutral. Exactly one colour has a job:
a cobalt indigo (hue 260) that marks a day as done and drives the single primary
action. Everything else is a tinted grey. That restraint is what lets a filled row
read as evidence at a glance — if the page were colourful, a run of ticks would be
just more colour. The month grid is the product; the summary line beneath it is a
sentence, not a scoreboard, because the grid already said it better.

It rejects, by name, the two shapes this category defaults to: the streak-guilt
app that dramatises a missed day, and the SaaS metrics dashboard that restates the
data as a row of big-number tiles over a gradient. A gap here is rendered as
absence and nothing more.

**Key Characteristics:**
- One working colour; every other surface is a neutral tinted 0.003–0.025 chroma toward hue 260.
- Flat by default — depth comes from three tonal surface levels, not shadows.
- One type family (system-ui) at four sizes; no display face anywhere.
- Tabular numerals throughout, so counts never jitter as the grid re-renders.
- Light and dark are equal citizens, following the system with a manual override.
- The daily ticking path is ≥44px; the review grid may be dense.

## 2. Colors

A near-achromatic system: pure white paper, ink that is almost black, and one
saturated indigo that means "done".

### Primary
- **Working Indigo** (`{colors.primary}`): the only saturated colour in the system.
  It fills a completed day cell, fills a checked tick row's box, and backs the single
  primary button. In dark mode it lightens to `oklch(0.70 0.145 260)` so it stays
  legible against the darker ground.
- **Indigo Wash** (`{colors.primary-wash}`): the pale tint behind a *today* row that
  has been ticked. Its job is to make a completed row read as complete at arm's
  length without adding a second hue. Dark counterpart: `oklch(0.30 0.045 260)`.

### Neutral
- **Paper** (`{colors.bg}`): pure white, chroma exactly 0. Not off-white, not warm.
  Dark counterpart: `oklch(0.175 0.012 260)`.
- **Surface** (`{colors.surface}`) and **Sunken** (`{colors.sunken}`): the two other
  tonal levels. Surface lifts a tick row off the page; sunken is the resting state of
  an unticked day cell. Dark counterparts: `oklch(0.215 0.015 260)`, `oklch(0.255 0.016 260)`.
- **Ink** (`{colors.ink}`): all primary text, and the ring that marks today's column.
  Dark counterpart: `oklch(0.96 0.006 260)`.
- **Muted** (`{colors.muted}`): secondary text — day numbers, counts, the summary
  sentence, placeholders. 4.9:1 on paper. Dark counterpart `oklch(0.72 0.02 260)`, 6.3:1.
- **Line** / **Line Strong** (`{colors.line}`, `{colors.line-strong}`): hairline dividers
  and control borders respectively.

### Tertiary
- **Danger** (`{colors.danger}`): the delete affordance on hover, and nothing else.
  It never appears in the record itself.

### Named Rules

**The Working Colour Rule.** Indigo is permitted in exactly three places: a completed
day, a checked control, and the primary button. It is forbidden as a heading colour,
a border accent, a background wash for emphasis, or an icon tint. If a new element
wants indigo and does not encode "done" or "act", it gets a neutral.

**The Neutral Gap Rule.** A missed day is absence — the sunken surface, unmodified.
Never red, never amber, never a warning glyph, never a dimmed "failed" state. The
record reports; it does not judge. Colour-coding a gap is prohibited.

**The Zero-Chroma Paper Rule.** The light background is `oklch(1 0 0)` — literal
white. Warm-tinting the page toward cream, sand, bone, or parchment is forbidden;
warmth belongs to nothing in this product, and a tinted near-white is the current
generative default.

## 3. Typography

**Display Font:** none. Prohibited.
**Body Font:** system-ui (fallbacks: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif)
**Label/Mono Font:** none distinct — tabular numerals from the body face carry all data.

**Character:** deliberately anonymous. The system font is the one face a logbook can
wear without commenting on its contents; it also renders instantly and matches the
host OS, which suits a tool opened for ten seconds a day. Hierarchy is built from
four sizes and two weights, never from a change of family.

### Hierarchy
- **Headline** (600, 1.25rem/1.55, -0.011em): the two section anchors — today's date
  and "The month". The largest type on the page.
- **Title** (600, 1.0625rem/1.55, -0.011em): the app name in the top bar. Intentionally
  barely larger than body; the product name is not the point.
- **Body** (400, 1rem/1.55, tabular): habit names in the ticking list. The only text a
  user reads at speed.
- **Label** (400, 0.875rem/1.55): the summary sentence, button text, run counts, the
  "n of m habits done" tally.
- **Micro** (400, 0.6875rem/1.4): day numbers along the grid ruler. Below this size,
  nothing.

### Named Rules

**The One Family Rule.** system-ui at 400/550/600/650. Adding a second family — serif
display, mono for data, a variable "brand" face — is forbidden. There is no surface in
this product that a display font would improve.

**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set on `body` and inherited
everywhere. Every count, date, and tally re-renders in place on each tick; proportional
figures would make the whole grid shift by a fraction and read as instability.

## 4. Elevation

Flat. The system has three tonal surface levels — paper, surface, sunken — and depth
is expressed by moving between them, never by casting a shadow. A tick row sits on
`surface` above `bg`; an untouched day cell sits on `sunken`. This is a deliberate
choice: shadows on a 19px grid cell would be noise at the exact density where the
record needs to be readable.

Exactly two shadows exist, and both are functional rather than hierarchical.

### Shadow Vocabulary
- **Sticky edge** (`box-shadow: 7px 0 7px -7px oklch(0 0 0/.16)`): on the pinned habit-name
  column only, so day cells visibly pass *under* it while the grid scrolls sideways.
  It communicates an overlap that is otherwise invisible.
- **Toast lift** (`box-shadow: 0 6px 24px oklch(0 0 0/.22)`): on the transient status
  message, the one element that genuinely floats above the page.

### Named Rules

**The Flat Ledger Rule.** A shadow must earn its place by explaining an overlap or a
float. Shadows for emphasis, for "card-ness", or to make a button look pressable are
forbidden. If a new element wants a shadow and nothing is physically passing beneath
it, use a tonal step instead.

## 5. Components

Every interactive element is a rectangle with a 5–10px radius, a 1px border, and a
140–220ms transition on colour only. Nothing scales, lifts, or bounces on hover.

### Buttons
- **Shape:** gently rounded (10px), 38px tall, 1px border always present.
- **Primary:** indigo fill, white text, weight 550. Exactly one exists per screen — the
  Add button. Hover deepens to `{colors.primary-hover}`; in dark mode it *lightens*, since
  deepening against a dark ground reads as disabled.
- **Secondary:** surface fill, ink text, `line-strong` border. Used for month arrows,
  Export, Import, and the theme toggle. Hover fills to `sunken`; active fills to `line`.
- **Icon variant:** same shell, square (38×38), holds a 16px stroked SVG at 1.8–2px weight.
- **Focus:** 2px indigo ring at 2px offset, from the global `:focus-visible` rule. Never removed.

### Inputs / Fields
- **Style:** paper fill (not surface — a field is a hole in the page, not a raised
  object), `line-strong` 1px border, 10px radius, 38px tall.
- **Focus:** border goes transparent and a 2px indigo ring is drawn *inset* (`outline-offset: -1px`)
  so the control does not grow and shift the row beside it.
- **Placeholder:** `muted` at full opacity — the browser default grey fails contrast.

### Tick Row (signature component)
The primary affordance of the product: a full-width label wrapping a visually-hidden
native checkbox.
- **Shape:** 10px radius, minimum height 44px, surface fill, hairline border.
- **Checked:** background becomes `primary-wash`, border goes transparent, the 24px box
  fills indigo and a white check draws itself in via `stroke-dashoffset` over 220ms.
- **Why a real checkbox:** keyboard operation, screen-reader semantics, and label-click
  forwarding come free. The input is 1px and transparent, never `display: none`, so it
  stays focusable; `.tick:has(:focus-visible)` puts the ring on the whole row.

### Day Cell (signature component)
- **Shape:** a 19px minimum square (`aspect-ratio: 1`), 5px radius, one per habit per day.
- **States:** sunken when empty; indigo fill when done (`aria-pressed="true"`); dashed
  1px outline when the date is in the future and untouched; 1.5px **ink** ring at 1.5px
  offset when it is today.
- **Press:** scales to 0.88 for 140ms — the only transform in the system, and the one
  place tactile feedback is worth it, because the target is small.
- **Today's ring is ink, not indigo**, so a *filled* today cell still reads as filled.
  An indigo ring around an indigo fill reads as hollow at this size.

### Grid / Record
- **Structure:** CSS grid, `clamp(150px, 26vw, 230px)` for names then `repeat(days, minmax(19px, 1fr))`.
- **Sticky name column:** `position: sticky; left: 0` with an opaque page-coloured
  background, so on a phone — where the grid is always wider than the screen — a row is
  never unlabelled.
- **Overflow:** the grid scrolls inside its own container. The page body never scrolls sideways.

### Monthly pie
A two-slice pie — done vs remaining — at 84px, sitting inline beside the month's summary
sentence rather than above it.
- **Slices:** completed ticks in `primary`, the remainder in `sunken`, hairline `line` ring.
  Two slices only; a slice per habit would demand a colour per habit and break the
  single-accent rule.
- **Geometry:** hand-built SVG arc from 12 o'clock clockwise. A full circle is drawn as a
  single arc closing 0.01 short of its start — a 360° arc with identical endpoints renders
  as nothing, which shows up as an empty chart at exactly 100%.
- **Why this is not the banned hero-metric:** it is one chart of one number, inline with a
  sentence, at the same scale as the text around it. The prohibition stands against a *row*
  of big-number tiles standing in for the record. Sizing this up, or growing it into a tile
  row, re-enters the ban.

### Progress tallies
Two rows pinned to the bottom of the record, sharing its columns so every figure sits
directly under the days it counts.
- **Per day:** a 26px column chart, one bar per day, height = habits done ÷ habits. A day
  with nothing gets a 2px `line` stub, not an empty gap, so the axis stays readable.
  `aria-hidden` — it restates the grid directly above it.
- **Per week:** one segment per fixed 7-day block counted from the 1st (the final block is
  the month's remainder), spanning its own columns via `grid-column: span n`. Percentage
  reads at the block's **start**, then a 6px track. Each segment is `role="img"` with a
  full label, since the bar is the only thing carrying the number.
- **Aggregates use the same indigo as a tick, at smaller scale.** An individual tick must
  stay the loudest mark on the page; a summary never outweighs the record.

### Navigation
- Month movement is two secondary icon buttons flanking the month name (minimum 9.5ch,
  centred, so the arrows do not shift between "May 2026" and "September 2026").

### Empty state
- A dashed 1px `line-strong` rule at 10px radius, max 52ch, centred. It teaches the
  loop in one sentence rather than saying "no data".

## 6. Do's and Don'ts

### Do:
- **Do** keep indigo (`oklch(0.48 0.155 260)` light / `oklch(0.70 0.145 260)` dark) on
  completed days, checked controls, and the one primary button. Nothing else.
- **Do** render a missed day as plain `sunken` absence.
- **Do** state a tick with fill *and* shape *and* an accessible label — `aria-pressed` on
  cells, a native checkbox on rows. Colour alone is never the signal.
- **Do** keep every control in the daily ticking path at 44px or taller.
- **Do** put page background on any sticky element before shipping it; a transparent
  sticky column lets content bleed through beside it.
- **Do** define both themes for every new colour, and check the dark value separately —
  a hover that deepens in light must lighten in dark.
- **Do** verify body text at 4.5:1 and large text at 3:1 in *both* themes.
- **Do** give every transition a `prefers-reduced-motion` alternative.

### Don't:
- **Don't** dramatise a lapse. No **streak-guilt** patterns: no lost-streak grief, no
  badge shelves, no confetti, no flame icons, no "you broke your run" copy.
- **Don't** restate the grid as a **SaaS metrics dashboard** — a row of big-number stat
  tiles over a gradient accent. The record is the interface; the summary stays a sentence.
- **Don't** introduce **gamification vocabulary**: levels, XP, trophies, streak flames.
- **Don't** warm-tint the background toward **cream, sand, beige, bone, or parchment**.
  Paper is `oklch(1 0 0)`, chroma zero.
- **Don't** add a second type family, or any display face, for any reason.
- **Don't** add a shadow that is not explaining a physical overlap. See The Flat Ledger Rule.
- **Don't** reuse a class name that already carries layout — `.today` styled a section
  *and* a grid marker once, and every today cell silently inherited a 36px margin.
  Modifier classes on grid children are `.now`, `.future`, `.corner`.
- **Don't** use `border-left` or `border-right` above 1px as a coloured accent stripe.
- **Don't** let the page body scroll horizontally. Wide content scrolls inside its own container.
- **Don't** trust a screenshot for alignment. If two things should share a baseline,
  measure `getBoundingClientRect()` — the class-collision bug above was invisible in a
  scaled screenshot and obvious in 18px of measured offset.
