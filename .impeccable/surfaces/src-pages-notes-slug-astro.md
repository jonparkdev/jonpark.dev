---
version: 1
slug: "src-pages-notes-slug-astro"
primary_target: "src/pages/notes/[slug].astro"
related_targets: ["src/layouts/Base.astro"]
---

# Note page

**Mode:** Read. Readers are the author first, then fellow learners arriving from the Progress map, a wikilink, or a shared URL. They want to understand one idea, judge how far to trust it (its Stage), and walk on to related Notes.

**Scope:** `src/pages/notes/[slug].astro` plus the shared layout `src/layouts/Base.astro`. The home page and `/about-stages` inherit the base look but are not redesigned yet. Out of scope: graph view and dark mode (both deferred in PRODUCT.md), new frontmatter.

**Decisions:** Stage shows as the badge plus one Stage-specific sentence; the page shape never changes by Stage. Next-step navigation is the link graph: wikilinks, a references-style "Links to" / "Linked from", and 🐇 Tangents as footnotes. Note lengths range from three sentences to long write-ups with Diagrams, code and tables.

**Decisions (2026-11-17 redesign, "with margins"):** Obsidian footnotes and 🐇 Tangents render as margin notes at 80rem and wider, and as end-of-Note footnotes below that. A ruled, collapsible Contents block follows the abstract when a Note has three or more sections. Sections open under a soft hairline that runs across a 76rem band. Diagrams on their own line are framed on graph paper and labelled "Fig. n" and with the file name.

**Open:** Diagram alt text must come from existing content, never a new field.

## Direction contract

THESIS: Every Note is typeset as a short LaTeX `article`: centred title block, a Stage paragraph where the abstract sits, numbered sections, and LaTeX's own marks for link state. It refuses the garden default of cream paper, green pills and a backlinks footer card.

OWN-WORLD: Plain white page, near-black ink, New Computer Modern Book (self-hosted as Garden Modern) for everything, small caps for labels, hyperref blue (#1F4E8C) for written links, maroon (#8B1A1A) plus a `??` mark for unwritten ones, booktabs rules (horizontal only) for code and tables, listings-style line numbers, a short footnote rule.

STORY: The reader sees what the Note is, where it sits in the Curriculum, how far to trust it, reads it, then follows a link, a footnote Tangent, or a reference to the next Note.

FIRST VIEWPORT: Small-caps site line (jonpark.dev left; Courses ▾, About Stages right). Centred title block: title at about 40px, "Topic: X · Part N, Title", tended date. A 560px Stage abstract headed "Stage: 🌱 Seedling". Then the justified 66ch body at about 19px, section 1 heading numbered.

FORM: The LaTeX Article, grounded candidate 1 of the safer re-roll (user steer: "a fan of the LaTeX aesthetic", "the digital-garden standard, its simple"). seed:8ce4311973aaf09d

FORM (2026-11-17): seed: none (pinned). The incumbent LaTeX Article, typeset with margins. User steer: "keep the Latex academic feel" while borrowing from jordivillar.com the "table of contents for headers", spacing with "a line across" new sections, "a frame that goes around diagrams", a grey scale for hierarchy, and "margin annotations".

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
