---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/layouts/Base.astro"]
---

# Home page: Topic index

**Mode:** Read. The author returns to his Notes; learners look for something worth reading. The page shows what has been learned and where curiosity led, Topic by Topic. It does not track progress: no untouched Topics, no per-Stage counts.

**Scope:** `src/pages/index.astro`, the Topic index model replacing `progressMap` in `src/garden/`, the site line's "Progress map" link renamed "Topics", home tests rewritten. Out of scope: `/about-stages`, the Note page.

**Decisions:** Only Topics with at least one Note, plus Tangents, in Curriculum order, grouped under their Part. Each Note listed with its Stage badge, by title. Recently tended (five newest) below the outline. One column at every width. Empty garden shows "No Notes yet."

**Open:** whether Recently tended stays once the outline is long (keep for now).

## Direction contract

THESIS: The home page is the garden's outline of what has actually been written, set like a LaTeX document's structure: small-caps Part labels, bold Topic heads, Notes indented beneath. It refuses the dashboard default: progress bars, counts, untouched rows, side-by-side panels.

OWN-WORLD: Inherits DESIGN.md: white page, Garden Modern, small caps for labels, hyperref blue links, Stage badges in ink, hairline rule before Recently tended. No new colours, boxes, or shadows.

STORY: The visitor reads the title block and tagline, scans Parts and Topics for something they care about, opens a Note, or jumps to the newest work from Recently tended.

FIRST VIEWPORT: Site line; centred title block (jonpark.dev at about 40px, the tagline beneath); then the 41rem column: PART N, TITLE in small caps, Topic in bold, Notes indented with Stage badges; 🐇 Tangents last; a hairline rule and Recently tended with long dates.

FORM: Outline by Part, dealt candidate 1 of surface re-roll round 2 (user steer: no side-by-side, no unfinished Topic lines, no progress tracking; "about my learning and curiosity per topic"). seed:0430fa9eb34d009f

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
