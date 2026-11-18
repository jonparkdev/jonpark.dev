---
name: jonpark.dev
description: A garden of system design Notes, each typeset as a short LaTeX article.
colors:
  page: "#ffffff"
  ink: "#111111"
  ink-soft: "#4d4d4d"
  ink-meta: "#6b6b6b"
  rule: "#111111"
  rule-soft: "#d6d6d6"
  grain: "color-mix(in srgb, #111111 16%, transparent)"
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
    lineHeight: 1.3
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
  label-sub:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    letterSpacing: "0.04em"
    fontFeature: "smcp"
  label-part:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
    fontFeature: "smcp"
  contents:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "lnum, tnum"
  abstract:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  margin-note:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  figure-label:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.06em"
    fontFeature: "smcp, lnum"
  table:
    fontFamily: "Garden Modern, Latin Modern Roman, CMU Serif, STIX Two Text, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "lnum, tnum"
  mono:
    fontFamily: "Garden Modern Mono, Latin Modern Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "lnum, tnum"
  listing:
    fontFamily: "Garden Modern Mono, Latin Modern Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
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
  4xl: "3.5rem"
  5xl: "4rem"
  section-open: "clamp(4rem, 10vh, 6.5rem)"
  page-end: "6rem"
  gutter: "clamp(1rem, 4vw, 4rem)"
  measure: "41rem"
  abstract-measure: "35rem"
  margin-note: "13rem"
  margin-gap: "2.5rem"
  band: "76rem"
components:
  link-ref:
    textColor: "{colors.ref}"
    typography: "{typography.body}"
  link-unwritten:
    textColor: "{colors.undefined}"
    typography: "{typography.body}"
  site-line:
    textColor: "{colors.ink-meta}"
    typography: "{typography.label}"
    padding: "1.5rem clamp(1rem, 4vw, 4rem) 0"
  site-line-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  stage-abstract:
    textColor: "{colors.ink-soft}"
    typography: "{typography.abstract}"
    width: "{spacing.abstract-measure}"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  section-rule:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    width: "{spacing.band}"
    padding: "1.25rem 0 0"
  section-number:
    textColor: "{colors.ink-meta}"
    typography: "{typography.headline}"
  contents:
    textColor: "{colors.ink}"
    typography: "{typography.contents}"
    padding: "0.625rem 0"
  contents-number:
    textColor: "{colors.ink-meta}"
    typography: "{typography.contents}"
    width: "2.5rem"
  margin-note:
    textColor: "{colors.ink-meta}"
    typography: "{typography.margin-note}"
    width: "{spacing.margin-note}"
  figure-frame:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.none}"
    padding: "2rem 2.75rem"
  figure-label:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink-meta}"
    typography: "{typography.figure-label}"
  figure-caption:
    textColor: "{colors.ink-meta}"
    typography: "{typography.small}"
  listing:
    textColor: "{colors.ink}"
    typography: "{typography.listing}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0"
  booktabs-table:
    textColor: "{colors.ink}"
    typography: "{typography.table}"
    rounded: "{rounded.none}"
    padding: "0.3rem 0.75rem"
  footnotes:
    textColor: "{colors.ink-soft}"
    typography: "{typography.small}"
  footnote-target:
    backgroundColor: "{colors.select}"
    textColor: "{colors.ink}"
  topic-index-part:
    textColor: "{colors.ink}"
    typography: "{typography.label-part}"
  topic-index-topic:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  note-list-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.875rem 0"
  note-list-meta:
    textColor: "{colors.ink-meta}"
    typography: "{typography.small}"
---

# Design System: jonpark.dev

## Overview

**Creative North Star: "The LaTeX Article"**

Every Note is typeset as a short LaTeX `article`, set with margins in the manner of tufte-latex: a centred `\maketitle` block, the Stage where the abstract sits, a ruled `\tableofcontents`, numbered sections each opened by a hairline, a wide outer margin where footnotes sit beside the line that calls them, figures framed on graph paper, booktabs rules, listings line numbers, and a bibliography of where to walk next. The page is plain white with near-black ink, set entirely in one family (Garden Modern, a subset and renamed New Computer Modern under the GUST Font License). It reads as a paper someone is still writing, which suits a garden that shows unfinished work honestly.

Density is that of a printed article: a single 41rem text column, justified and hyphenated body at 19px, generous space only between sections. Everything beside the text (section and contents numbers, margin notes, captions, dates, labels, rules) steps back into a short ladder of greys so the running text and its links stay the loudest thing on the page. Colour appears in exactly two places, as hyperref would set it: blue for a reference that resolves, maroon with a `??` mark for one that is not written yet. There are no cards, fills, shadows or rounded corners; structure comes from type, counters and hairline rules, and the only box is the figure frame.

Coverage: this system is evidenced by every page type: the Note page (`/notes/<slug>`), About Stages (`/about-stages`), the Course page (`/<course>`, its Topic index), the home page (the Note list, `/`), plus the base layout, the shared article layout that the Note page and About Stages both use, the Contents component, and the Markdown pipeline that produces margin notes and figures. The world is light only, by decision; there is no dark theme.

**Key Characteristics:**
- One serif family (Garden Modern) for everything, with its mono sibling for code; small caps for labels.
- White page, near-black ink, colour reserved for link state; greys for the apparatus beside the text.
- LaTeX's own devices carry structure: numbered ruled sections, a ruled Contents, `[n]` references, `??` for undefined, Figure counters, booktabs, listings numbers, margin notes.
- Flat, square, ruled: no shadows, no radius, and one box only, the figure frame.
- Stage is always emoji plus label; 🐇 marks Tangents.

## Colors

A black-on-white article palette where colour is a link-state signal and nothing else, with a ladder of greys for apparatus.

### Primary
- **Hyperref Blue** (`ref`): every resolved link, everywhere, margin notes included; the focus ring; footnote back-arrows; the hover state of a footnote mark. Underline drawn at 45% of the blue, 1px, offset 0.18em; on hover the underline goes full colour at 2px.

### Secondary
- **Undefined Maroon** (`undefined`): wikilinks to Notes not written yet, with a dashed 1px underline and a bold superscript `??`, as LaTeX prints for an undefined reference. Never used for anything but unwritten links.

### Neutral
- **Paper White** (`page`): the page, and the chip behind a figure's side labels. No off-white, no cream.
- **Ink** (`ink`): all running text, headings, the site name, the current page in the nav, Contents entries, the "Figure n" in a caption, Stage badges outside running text.
- **Soft Ink** (`ink-soft`): abstract text (its bold head stays in Ink), the References sub-heads ("Links to", "Linked from"), and the text of the end footnotes.
- **Meta Grey** (`ink-meta`): apparatus beside the text: margin notes, section and subsection numbers, Contents numbers and its [−]/[+] toggle, figure captions and side labels, footnote marks, `[n]` reference labels and the "🐇 Tangent" flag, the byline's "Tended" date, listings line numbers, inactive nav links, the home page's Stage and date.
- **Soft Rule** (`rule-soft`): every hairline that is not a table rule: section rules, the Contents rules, the figure frame, listings rules, `hr`, the Courses menu, the home page's row rules, the end-footnote rule, the restacked About Stages table's row separators.
- **Rule Ink** (`rule`): booktabs table rules only. Same value as Ink; kept as its own role.
- **Graph Grain** (`grain`): the dot grid inside the figure frame (Ink at 16%). Never used elsewhere.
- **Selection Blue** (`select`): text selection and the targeted footnote row.

### Named Rules
**The Hyperref Rule.** Colour means a link and its state: blue resolves, maroon plus `??` does not exist yet. Links stay blue wherever they sit, margin notes included. No decorative colour, no fills, no coloured badges.

**The Honest Link Rule.** An unwritten link is never styled as a working link and never hidden; it stays in the text, maroon, dashed, marked `??`, and announced as "(not written yet)" to assistive tech.

**The Apparatus Grey Rule.** Greys are for the apparatus beside the text (numbers, notes, captions, labels, dates, rules), never for body text and never for links. Ink is the text; Meta Grey is what annotates it; Soft Rule is what divides it.

## Typography

**Display Font:** Garden Modern (New Computer Modern Book, with Latin Modern Roman, CMU Serif, STIX Two Text, Georgia)
**Body Font:** Garden Modern
**Label/Mono Font:** Garden Modern Mono (NewCMMono10-Book, with Latin Modern Mono, ui-monospace)

**Character:** Computer Modern's thin, high-contrast book weight; the type of a maths paper. One family at book and bold, roman and italic; hierarchy comes from size, weight and small caps, never from a second face.

### Hierarchy
- **Display** (400, clamp 2rem to 2.5rem, 1.15): the page title, centred, regular weight as `\maketitle` sets it.
- **Headline** (700, 1.375rem, 1.25): numbered sections (`1`, `2` in Meta Grey in a 1.75em hanging slot) and the unnumbered References heading, each opening a ruled section.
- **Title** (700, 1.1875rem, 1.3): numbered subsections (`1.1` in Meta Grey in a 2.5em slot) and Topic heads on the Course page. Fourth-level headings are bold at body size, unnumbered.
- **Body** (400, 1.1875rem / 19px, 1.55): justified, auto-hyphenated, 41rem measure (about 66ch). Following paragraphs indent 1.5em; no gap-only paragraphing. Article paragraphs, list items and table cells use `text-wrap: pretty` so none ends on a lone word; headings use `balance`.
- **Label** (400, small caps, 0.04em tracking, 1.0625rem): site line, the Contents head, "Topic:" in the byline and "Figure n" in captions (both at 0.03em).
- **Label Part** (400, small caps, 0.04em tracking, 1.25rem, 1.3): a Course page's Part headings.
- **Label Sub** (400, small caps, 0.04em tracking, 1rem): References sub-heads ("Links to", "Linked from").
- **Contents** (400, 1.0625rem, 1.4, tabular lining figures): Contents rows; subsection rows at 1rem.
- **Small** (0.9375rem to 1.0625rem, 1.5): byline (1.0625rem), the bold abstract head (0.9375rem), figure captions (0.9375rem), end footnotes (0.9375rem), blockquotes (1.0625rem), the home page's Stage and date (0.9375rem).
- **Abstract** (400, 1rem, 1.5): abstract text on every article page.
- **Margin Note** (400, 0.875rem, 1.5): margin notes, ragged right, unhyphenated.
- **Figure Label** (400, small caps, 0.06em tracking, 0.8125rem, 1): the vertical "Fig. n" and "[ file name ]" labels on a figure frame.
- **Table** (400, 1rem, lining tabular figures): booktabs tables.
- **Mono** (0.875em, lining tabular figures): inline code, and the Contents [−]/[+] toggle at 0.875rem.
- **Listing** (0.875rem, 1.6, lining tabular figures): listings blocks, in the mono family.

### Named Rules
**The One Family Rule.** Garden Modern sets everything. Do not introduce a sans, a display face, or system UI type.

**The Small Caps Label Rule.** Labels are small caps in the same serif, never uppercase sans and never letter-spaced caps above a heading.

## Layout

A single centred text column of `measure` (41rem) inside a fluid side gutter (`clamp(1rem, 4vw, 4rem)`). Every page body is a flow: its children sit in the 41rem column, and flows nest. Section rules break out of the column to `min(100%, band)` (76rem, the column plus a margin each side), with inline padding that keeps the heading text aligned to the column. On viewports of at least 80rem the column gains a right margin: margin notes (13rem wide) float 2.5rem outside the column's right edge, beside the line that calls them; below 80rem there is no margin and the notes are set as end footnotes instead.

The site line spans the gutter edges: site name left, nav right, wrapping on narrow screens. The page starts `clamp(2rem, 6vw, 3.5rem)` below it and ends with 6rem of space.

Vertical rhythm: the title block sits 3rem above what follows (3.5rem on the home and Course pages); the abstract 3.5rem; the Contents 4rem. Sections open `section-open` (clamp(4rem, 10vh, 6.5rem)) above their rule, with 1.25rem from rule to heading and 1.75rem below it; subsections 2.5rem above, 0.625rem below. Paragraphs are 0.75rem apart; figures 3rem above and below; listings and tables 2rem above, 2.25rem below; `hr` 2.5rem; blockquotes 1.25rem; end footnotes 4rem above. On a Course page, Parts open clamp(3.5rem, 8vh, 5rem) above their rule and 1.25rem below; Topics are 1.5rem apart.

Order of a Note: centred title block, Stage abstract (narrower, 35rem, centred), Contents, body, References, end footnotes. Order of About Stages: centred title block (title only, no byline), the abstract, Contents, then the numbered body (1 The Stages, set as Table 1; 2 How Stages change, with Figure 1; 3 🐇 Tangents); no References or footnotes. Order of a Course page: centred title block (the Course title at Display size, its subtitle at 1.0625rem beneath), Contents of its Parts, then its Topic index. Order of the home page: centred title block ("jonpark.dev" at Display size, the tagline at 1.0625rem beneath, balanced), then the Note list.

### Named Rules
**The One Article Rule.** Every reading page is the same LaTeX article from one shared layout: centred title block, an abstract with a centred bold head, a Contents when earned, a numbered justified body in ruled sections. Only the abstract head's content changes by page; the shape never does.

**The Margin Rule.** One text column at every width, and the only thing ever set beside it is a margin note. No side-by-side panels, no sidebars; when the margin is too narrow to hold notes, the notes move to the end rather than squeezing the column.

Responsive (below 36rem): body switches from justified to ragged left with manual hyphenation; blockquote indent halves to 1rem; figure frames drop their side labels, tighten to 1.25rem 1rem padding, and keep Diagrams at their drawn size, scrolling sideways. Tables and listings scroll horizontally inside their rules rather than shrinking. On the home page's Note list, the Stage and date drop to their own line under each Note.

## Elevation & Depth

Flat. There are no shadows anywhere; depth and grouping come from hairline rules and white space, as on a printed page.

### Named Rules
**The Booktabs Rule.** Rules are horizontal only. Hairlines are 0.8px; the outer top and bottom of a table are 1.5px, in Rule Ink. No vertical rules and no background fills around code or tables.

**The One Box Rule.** The figure frame is the one box the system allows: a 0.8px Soft Rule hairline around a Diagram on a Graph Grain dot grid. Nothing else is boxed, framed or filled.

## Shapes

Square and ruled. No border radius on any surface, the figure frame and the focus outline included; there are no exceptions. Recurring geometry: section rules across the band; the Contents, ruled above, below and between rows; the figure frame with its dot grid (0.7px dots on a 9px grid); soft hairlines above and below listings; the booktabs three-rule table; a centred `hr` at `min(40%, 16rem)`; and a 10rem rule at the start of the end footnotes.

## Components

### Links
- **Resolved:** Hyperref Blue text, 1px underline at 45% strength, offset 0.18em; hover thickens to 2px at full colour.
- **Unwritten:** Undefined Maroon, dashed 1px underline, bold superscript `??` at 0.7em; not focusable, titled "Not written yet".
- **Focus:** 2px Hyperref Blue outline, 2px offset, on every focusable element.

### Navigation (site line)
Small caps, 1.0625rem, 0.04em tracking, no underline at rest, a 1px underline on hover. "jonpark.dev" left, always in Ink (it leads home); "Courses ▾" and "About Stages" right, in Meta Grey. The current page, a hovered link, and an open Courses menu turn Ink; on a Course page, "Courses" itself shows as current. "Courses" is a plain disclosure, always shown however many Courses there are: its list of Course links, ordered by title, drops below it right-aligned on the white page between two Soft Rule hairlines, with no box. The ▾ turns to ▴ while open. A skip link sits above it, revealed on focus.

### Title block and Stage abstract
One article shell serves the Note page and About Stages: a centred title block, an abstract in a 35rem column (Abstract style, 1rem, Soft Ink) under a bold centred Ink head at 0.9375rem, and the numbered body. On a Note the title is followed by a byline: small-caps "Topic:", the Topic (linked to its place on the Course page) · "Part N, Title" · the Course (linked to its page), line break, "Tended" plus a long date in Meta Grey. A Note with no Topic has no Topic line; the byline is just the Tended date. Below, the Stage sits where an abstract would: the head reads "Stage:" with the Stage badge, then one Stage-specific sentence. On About Stages there is no byline, and the head reads "Abstract", as LaTeX prints it. The page shape never changes by Stage.

### Section rule
`\section`, ruled: a 0.8px Soft Rule hairline across the band (`min(100%, 76rem)`), the heading set 1.25rem beneath it and aligned to the text column. Every numbered section of an article body opens this way, as do the References heading (unnumbered) and each Part on a Course page. A section rule clears any margin note above it.

### Contents
`\tableofcontents`, ruled and collapsible, closed by default (the head row alone, reading [+]). Soft Rule hairlines above and below, under the head while open, and between rows. The head row reads "Contents" in small caps (Label style) on the left and a mono [−] / [+] toggle in Meta Grey (0.875rem) on the right, 0.875rem padding. Each row is one Ink link with no underline (the label underlines on hover), 0.625rem padding, a hanging 2.5rem number column in Meta Grey with tabular figures. Subsections are indented one number column, set at 1rem, and numbered `n.m`. It is shown only when a page has at least three top-level sections. It appears on a Note (its body's sections and subsections), on About Stages (1 The Stages, 2 How Stages change, 3 🐇 Tangents), and on a Course page, where it lists the Parts by their Part number, with 🐇 as the number for Tangents; those rows link to `#part-N` and `#part-tangents`.

### Article body
Numbered ruled sections and subsections per the Typography hierarchy; justified, hyphenated paragraphs with a 1.5em indent on following paragraphs; lists indented 1.75em; blockquotes indented 2rem at 1.0625rem; a centred Soft Rule `hr`. Headings carry ids for the Contents. Defined terms are set in bold where they are introduced (**Recall**, **Demotion**, **Tangent**), and quotations use curly quotes. On About Stages the Stages are one booktabs table, captioned above ("Table 1 The Stages, from least to most understood"), with columns Stage | Means | Earned by, full measure, the Stage cell a bold, unwrapped row header carrying the Stage's anchor (`#seedling`, `#budding`, `#evergreen`); the row a visitor arrives at is filled with Selection Blue. Below 36rem the table restacks to one block per Stage, separated by Soft Rule hairlines, with small-caps bold "Means" and "Earned by" run-in labels. Section 2 carries Figure 1, the Stage ladder, in the same figure frame as a Diagram ("Fig. 1", "[ stage ladder ]", 2.25rem padding above and below, always centred): the three Stages in bold on one line, with a small-caps "Recall" over a hairline right arrow and a left arrow over "Demotion" between each pair, captioned "Figure 1 How a Note changes Stage" beneath; when its frame is narrower than 38rem the ladder runs top to bottom. Sections also carry `#how-stages-change` and `#tangents`.

### Stage badge
Emoji plus label ("🌱 Seedling", "🌿 Budding", "🌳 Evergreen"), linked to `/about-stages`, never wrapped. In the abstract, References, end footnotes and the Topic index it takes Ink with a soft 30% Ink underline at 0.875em. In a margin note it is a link like any other and keeps Hyperref Blue. On the home page's Note list it is unlinked metadata (see Note list). Stage is never shown by colour alone. The emoji is hidden from screen readers, so the Stage is announced once, by its label.

### Margin notes
`\sidenote`. The author's Obsidian footnotes (`[^id]` with its `[^id]:` definition, or `^[inline text]`) and each Tangent at its first mention become margin notes, numbered in order of first reference (author notes `n`, Tangents `🐇n`). On viewports of at least 80rem each note floats right, clear of the one before, 13rem wide and 2.5rem outside the column, beside the line that calls it: Margin Note style (0.875rem, 1.5) in Meta Grey, ragged right, no indent, no hyphenation, led by its number in Meta Grey. A Tangent's note reads "Tangent:", the Note link and its Stage badge. Links inside a note keep Hyperref Blue. In the text the mark is a 0.7em superscript in Meta Grey: on wide screens a plain number, since the note sits beside it; below 80rem a link (no underline, blue on hover) to the end footnote. Notes called from a table cell are set just after the table, so none floats over a column; a note inside a blockquote is offset by the quote's indent so it lines up with the rest.

### Figures
A Diagram standing alone on a line becomes a numbered figure: the Diagram centred in a frame (0.8px Soft Rule hairline, 2rem 2.75rem padding, at least 10rem tall) on a Graph Grain dot grid, with two vertical small-caps labels in Meta Grey (Figure Label style) set down its sides on a white chip: "Fig. n" on the left, "[ file name ]" on the right (the Diagram's file name without extension, hyphens and underscores as spaces, cut with an ellipsis if longer than the frame). The caption sits 0.75rem beneath, centred, 0.9375rem in Meta Grey: "Figure n" in small-caps Ink, then any words from the embed's alias (`![[x.svg|words]]`); a size alias such as `300` or `300x200` is ignored. The frame scrolls sideways when the Diagram is wider than it, so it takes keyboard focus. The Diagram artwork itself is the author's Excalidraw export and is not restyled, except that Excalidraw's white background is made transparent so the grid shows through. A Diagram embedded inside a sentence stays inline and unframed.

### Listings
Listing style (mono at 0.875rem), line height 1.6, between two 0.8px Soft Rule hairlines with 0.625rem padding; line numbers in Meta Grey, right-aligned in a 2.25rem gutter, unselectable. Tab size 4. Scrolls horizontally.

### Booktabs tables
Fit to content, Table style (1rem, tabular lining figures), left-aligned cells padded 0.3rem 0.75rem, bold header row; three horizontal Rule Ink rules per the Booktabs Rule. Scrolls horizontally when wider than the column.

### References (bibliography)
An unnumbered ruled section headed "References", then Label Sub sub-heads in Soft Ink, "Links to" and "Linked from"; one counter runs straight through both lists, printed as hanging `[n]` labels in Meta Grey in a 2.5em indent. Each entry is the Note link plus its Stage badge, and "🐇 Tangent" in Meta Grey when the target is a Tangent.

### End footnotes
Author footnotes and Tangent footnotes share one list at the end of a Note, shown only below 80rem (on wider screens the margin notes replace it). It sits 4rem below the body under a 10rem Soft Rule hairline, at 0.9375rem in Soft Ink: author footnotes first, each a superscript number, its text and a ↑ back-link; then Tangents, each a superscript 🐇n, "Tangent:", the Note link with its badge, and a ↑ back-link. Marks are Meta Grey at 0.75em. The targeted footnote gets a Selection Blue background.

### Topic index
A Course page's outline of what has been written in it, set like a LaTeX document's structure. Each Part is a ruled section whose heading is its small-caps label ("Part N, Title", Label Part style at 1.25rem), carrying `#part-N` (or `#part-tangents`); it is the Part's heading, not an eyebrow over a Topic. The first Part's rule sits 4rem under the Contents, with no extra opening space. Under it, each Topic is a bold `h3` (Title style) carrying its key as an anchor (`/hellointerview#caching`), and its Notes follow as an unmarked list indented 1.5em, each Note link followed by its Stage badge in Ink (0.875em, 30% Ink underline). Parts follow Curriculum order with 🐇 Tangents always last. Only Topics with at least one Note appear: no counts, no progress, no untouched rows.

Empty state: when the Course has no Notes, the index is the single centred line "No Notes yet."

### Note list
The home page's body, directly under the title block with no heading: every Note in the garden, whatever its Course or none, most recently Tended first. Ruled rows: Soft Rule hairlines above the first row, below the last, and between rows, each row padded 0.875rem. The Note title is the row's only link. On wide screens each row is a three-column tabular on a shared grid: the title (long titles wrap within their column, `text-wrap: pretty`), the Stage badge unlinked in small caps (0.04em), and the long-format Tended date ("13 November 2026") flush right; Stage and date are Meta Grey at 0.9375rem, columns 1.5rem apart, all on the first baseline. The badge isn't linked here because the site line already links About Stages, and a link on every row would compete with the title. No Topic or Course is shown; the home page doesn't care where a Note comes from. Below 36rem the Stage and date share their own line under the title, joined by a middle dot ("🌱 Seedling · 13 November 2026"). Empty state: the single centred line "No Notes yet."

## Do's and Don'ts

### Do:
- **Do** set every surface in Garden Modern on a white page with near-black ink.
- **Do** use LaTeX's own devices for structure: ruled section counters, the ruled Contents, `[n]` references, Figure counters, booktabs rules, listings numbers, margin notes and the footnote rule.
- **Do** keep colour to link state: Hyperref Blue for resolved links (in margin notes too), Undefined Maroon plus `??` for unwritten ones.
- **Do** set apparatus beside the text (numbers, notes, captions, labels, dates) in Meta Grey and its dividing hairlines in Soft Rule.
- **Do** put footnotes in the margin beside their line on wide screens and at the end below 80rem; never both at once.
- **Do** show Stage as emoji plus label, and 🐇 for Tangents, wherever a Note is referenced.
- **Do** justify and hyphenate body text on wide screens and fall back to ragged left below 36rem.

### Don't:
- **Don't** use cream or tinted paper, green pills, or a backlinks footer card; the garden defaults this world refused.
- **Don't** add shadows, rounded corners, filled boxes, or vertical table rules; the figure frame is the one box.
- **Don't** set body text or links in grey; greys are for apparatus only.
- **Don't** introduce a second typeface, uppercase sans labels, or eyebrow text above headings.
- **Don't** use colour for decoration or to signal Stage.
- **Don't** change a Note's page shape by Stage.
