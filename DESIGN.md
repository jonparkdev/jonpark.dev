---
name: jonpark.dev
description: A garden of system design Notes, each typeset as a short LaTeX article.
colors:
  page: "#ffffff"
  ink: "#111111"
  ink-soft: "#4d4d4d"
  rule: "#111111"
  ref: "#1f4e8c"
  undefined: "#8b1a1a"
  select: "#d6e2f2"
typography:
  display:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.15
  headline:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "lnum, pnum, kern"
  small:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    letterSpacing: "0.04em"
    fontFeature: "smcp"
  mono:
    fontFamily: "Garden Modern Mono, Latin Modern Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "lnum, tnum"
rounded:
  none: "0px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1.25rem"
  xl: "1.75rem"
  2xl: "2.25rem"
  3xl: "3rem"
  page-end: "5rem"
  gutter: "clamp(1rem, 4vw, 4rem)"
  measure: "41rem"
  abstract-measure: "35rem"
components:
  link-ref:
    textColor: "{colors.ref}"
    typography: "{typography.body}"
  link-unwritten:
    textColor: "{colors.undefined}"
    typography: "{typography.body}"
  site-line:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "1.5rem clamp(1rem, 4vw, 4rem) 0"
  stage-abstract:
    textColor: "{colors.ink}"
    width: "35rem"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  listing:
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0"
  booktabs-table:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.75rem"
  footnote-target:
    backgroundColor: "{colors.select}"
    textColor: "{colors.ink}"
  topic-index-part:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  topic-index-topic:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  recently-tended-date:
    textColor: "{colors.ink-soft}"
    typography: "{typography.small}"
---

# Design System: jonpark.dev

## Overview

**Creative North Star: "The LaTeX Article"**

Every Note is typeset as a short LaTeX `article`: a centred `\maketitle` block, the Stage where the abstract sits, numbered sections, booktabs rules, listings line numbers, a bibliography of where to walk next, and a short footnote rule. The page is plain white with near-black ink, set entirely in one family (Garden Modern, a subset and renamed New Computer Modern under the GUST Font License). It reads as a paper someone is still writing, which suits a garden that shows unfinished work honestly.

Density is that of a printed article: a single 41rem column, justified and hyphenated body at 19px, generous space only between sections. Colour appears in exactly two places, as hyperref would set it: blue for a reference that resolves, maroon with a `??` mark for one that is not written yet. There are no cards, fills, shadows or rounded corners; structure comes from type, counters and hairline rules.

Coverage: this system is evidenced by the Note page (`/notes/<slug>`), the home page (Topic index, `/`) and the shared layout. `/about-stages` only inherits the base layout and is not yet designed; its composition is not recorded here. The world is light only, by decision; there is no dark theme.

**Key Characteristics:**
- One serif family (Garden Modern) for everything, with its mono sibling for code; small caps for labels.
- White page, near-black ink, colour reserved for link state.
- LaTeX's own devices carry structure: numbered sections, `[n]` references, `??` for undefined, Figure counters, booktabs, listings numbers, footnote rule.
- Flat, square, ruled: no shadows, no radius, no boxes.
- Stage is always emoji plus label; 🐇 marks Tangents.

## Colors

A black-on-white article palette where colour is a link-state signal and nothing else.

### Primary
- **Hyperref Blue** (`ref`): every resolved link, the focus ring, and footnote back-arrows. Underline drawn at 45% of the blue, 1px, offset 0.18em; on hover the underline goes full colour at 2px.

### Secondary
- **Undefined Maroon** (`undefined`): wikilinks to Notes not written yet, with a dashed 1px underline and a bold superscript `??`, as LaTeX prints for an undefined reference. Never used for anything but unwritten links.

### Neutral
- **Paper White** (`page`): the page. No off-white, no cream.
- **Ink** (`ink`): all text, headings, site line, Stage badges outside running text.
- **Rule Ink** (`rule`): horizontal rules (listings, booktabs, footnote rule, `hr`). Same value as ink; kept as its own role.
- **Soft Ink** (`ink-soft`): listings line numbers and Recently tended dates only.
- **Selection Blue** (`select`): text selection and the targeted footnote row.

### Named Rules
**The Hyperref Rule.** Colour means a link and its state: blue resolves, maroon plus `??` does not exist yet. No decorative colour, no fills, no coloured badges.

**The Honest Link Rule.** An unwritten link is never styled as a working link and never hidden; it stays in the text, maroon, dashed, marked `??`, and announced as "(not written yet)" to assistive tech.

## Typography

**Display Font:** Garden Modern (New Computer Modern Book, with Latin Modern Roman, CMU Serif, STIX Two Text, Georgia)
**Body Font:** Garden Modern
**Label/Mono Font:** Garden Modern Mono (NewCMMono10-Book, with Latin Modern Mono, ui-monospace)

**Character:** Computer Modern's thin, high-contrast book weight; the type of a maths paper. One family at book and bold, roman and italic; hierarchy comes from size, weight and small caps, never from a second face.

### Hierarchy
- **Display** (400, clamp 2rem to 2.5rem, 1.15): the Note title, centred, regular weight as `\maketitle` sets it.
- **Headline** (700, 1.375rem, 1.25): numbered sections (`1`, `2` in a 1.75em hanging slot) and the References heading.
- **Title** (700, 1.1875rem): numbered subsections (`1.1` in a 2.5em slot). Fourth-level headings are bold at body size, unnumbered.
- **Body** (400, 1.1875rem / 19px, 1.55): justified, auto-hyphenated, 41rem measure (about 66ch). Following paragraphs indent 1.5em; no gap-only paragraphing.
- **Label** (400, small caps, 0.04em tracking): site line, References sub-heads ("Links to", "Linked from"), "Topic:" in the byline, Figure captions (0.9375rem, 0.03em), the home page's Part labels and "Recently tended" label (1.0625rem).
- **Small** (0.9375rem to 1.0625rem, 1.5): byline, Stage abstract text (1rem), footnotes (0.9375rem), blockquotes (1.0625rem).
- **Mono** (0.875em, lining tabular figures): inline code and listings.

### Named Rules
**The One Family Rule.** Garden Modern sets everything. Do not introduce a sans, a display face, or system UI type.

**The Small Caps Label Rule.** Labels are small caps in the same serif, never uppercase sans and never letter-spaced caps above a heading.

## Layout

A single centred column of `measure` (41rem) inside a fluid side gutter (`clamp(1rem, 4vw, 4rem)`). The site line spans the gutter edges: site name left, nav right, wrapping on narrow screens. The article starts `clamp(2rem, 6vw, 3.5rem)` below it and the page ends with 5rem of space.

Order of a Note: centred title block, Stage abstract (narrower, 35rem, centred), body, References, footnotes. Vertical rhythm uses the spacing scale: paragraphs 0.75rem apart, sections open 2.25rem above, subsections 1.75rem, listings and tables 1.25rem above and 1.5rem below, References and footnotes 3rem above.

Order of the home page: centred title block ("jonpark.dev" at Display size, the tagline at 1.0625rem beneath, 2.5rem below), the Topic index (Parts 2rem apart), then Recently tended 3rem below after a hairline. One column at every width; no side-by-side panels.

Responsive (below 36rem): body switches from justified to ragged left with manual hyphenation; blockquote indent halves to 1em; Diagrams keep their drawn size and scroll sideways with a sticky centred caption. Tables and listings scroll horizontally inside their rules rather than shrinking. Recently tended dates drop to their own line under each Note.

## Elevation & Depth

Flat. There are no shadows anywhere; depth and grouping come from hairline rules and white space, as on a printed page.

### Named Rules
**The Booktabs Rule.** Rules are horizontal only. Hairlines are 0.8px; the outer top and bottom of a table are 1.5px. No vertical rules, no boxes, no background fills around code or tables.

## Shapes

Square and ruled. No border radius on any surface, the focus outline included; there are no exceptions. Recurring geometry: full-width hairlines above and below listings, the booktabs three-rule table, a centred 40%-width `hr`, and a 10rem footnote rule at the start of the footnotes.

## Components

### Links
- **Resolved:** Hyperref Blue text, 1px underline at 45% strength, offset 0.18em; hover thickens to 2px at full colour.
- **Unwritten:** Undefined Maroon, dashed 1px underline, bold superscript `??` at 0.7em; not focusable, titled "Not written yet".
- **Focus:** 2px Hyperref Blue outline, 2px offset, on every focusable element.

### Navigation (site line)
Small caps, 1.0625rem, 0.04em tracking, ink colour with no underline at rest, a 1px underline on hover. "jonpark.dev" left; "Topics" and "About Stages" right. A skip link sits above it, revealed on focus.

### Title block and Stage abstract
Centred title, then a byline: small-caps "Topic:", Topic · "Part N, Title", line break, "Tended" plus a long date. Below, the Stage sits where an abstract would: a bold centred head "Stage:" with the Stage badge, then one Stage-specific sentence at 1rem in a 35rem column. The page shape never changes by Stage.

### Stage badge
Emoji plus label ("🌱 Seedling", "🌿 Budding", "🌳 Evergreen"), linked to `/about-stages`, never wrapped. In the abstract and lists it takes ink colour with a soft 30% ink underline at 0.875em; Stage is never shown by colour alone.

### Listings
Mono at 0.875rem, line height 1.6, between two 0.8px rules with 0.5rem padding; line numbers in Soft Ink, right-aligned in a 2.25rem gutter, unselectable. Tab size 4. Scrolls horizontally.

### Booktabs tables
Centred, fit to content, 1rem, tabular lining figures, left-aligned cells padded 0.3rem 0.75rem, bold header row; three horizontal rules per the Booktabs Rule.

### Figures
Diagrams are centred, numbered by a counter, and captioned "Figure n" in small caps beneath. The Diagram artwork itself is the author's Excalidraw export and is not restyled.

### References (bibliography)
A "References" headline, then small-caps sub-heads "Links to" and "Linked from"; one counter runs straight through both lists, printed as hanging `[n]` labels in a 2.5em indent. Each entry is the Note link plus its Stage badge, and "🐇 Tangent" when the target is a Tangent.

### Tangent footnotes
In text, a Tangent link carries a superscript 🐇n mark (0.7em, no underline) linking to its footnote. Footnotes sit under a 10rem hairline at 0.9375rem: superscript 🐇n, "Tangent:", the Note link with its badge, and a ↑ back-link. The targeted footnote gets a Selection Blue background.

### Topic index
The home page's outline of what has been written, set like a LaTeX document's structure. Each Part opens with a small-caps label as its `h2` ("Part N, Title", Label style at 1.0625rem, 0.04em); it is the Part's heading, not an eyebrow over a Topic. Under it, each Topic is a bold `h3` (1.1875rem, 700, line height 1.3), and its Notes follow as an unmarked list indented 1.5em, each Note link followed by its Stage badge in ink (0.875em, 30% ink underline). Parts follow Curriculum order with 🐇 Tangents always last. Only Topics with at least one Note appear: no counts, no progress, no untouched rows. One column at every width.

Empty state: when the garden has no Notes, the index is the single centred line "No Notes yet."

### Recently tended
Below the Topic index, after a 0.8px ink hairline across the column (3rem above, 1rem below), a small-caps "Recently tended" label heads the five newest Notes, newest first. Each row is the Note link plus its Stage badge, with the long-format Tended date ("13 November 2026") in Soft Ink at 0.9375rem pushed to the right on the same baseline. Below 36rem the date drops to its own line under the Note.

## Do's and Don'ts

### Do:
- **Do** set every surface in Garden Modern on a white page with near-black ink.
- **Do** use LaTeX's own devices for structure: section counters, `[n]` references, Figure counters, booktabs rules, listings numbers, the footnote rule.
- **Do** keep colour to link state: Hyperref Blue for resolved links, Undefined Maroon plus `??` for unwritten ones.
- **Do** show Stage as emoji plus label, and 🐇 for Tangents, wherever a Note is referenced.
- **Do** justify and hyphenate body text on wide screens and fall back to ragged left below 36rem.

### Don't:
- **Don't** use cream or tinted paper, green pills, or a backlinks footer card; the garden defaults this world refused.
- **Don't** add shadows, rounded corners, filled boxes, or vertical table rules.
- **Don't** introduce a second typeface, uppercase sans labels, or eyebrow text above headings.
- **Don't** use colour for decoration or to signal Stage.
- **Don't** change a Note's page shape by Stage.
