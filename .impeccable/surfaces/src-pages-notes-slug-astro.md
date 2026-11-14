---
version: 1
slug: "src-pages-notes-slug-astro"
primary_target: "src/pages/notes/[slug].astro"
related_targets: ["src/layouts/Base.astro"]
---

# Note page

**Mode:** Read. Readers are the author first, then fellow learners arriving from the Progress map, a wikilink, or a shared URL. They want to understand one idea, judge how far to trust it (its Stage), and walk on to related Notes.

**Scope:** `src/pages/notes/[slug].astro` plus the shared layout `src/layouts/Base.astro`. The home page and `/about-stages` inherit the base look but are not redesigned yet. Out of scope: graph view and dark mode (both in `LATER.md`), new frontmatter, sidenotes.

**Decisions:** Stage shows as the badge plus one Stage-specific sentence; the page shape never changes by Stage. Next-step navigation is the link graph: wikilinks, a references-style "Links to" / "Linked from", and 🐇 Tangents as footnotes. Note lengths range from three sentences to long write-ups with Diagrams, code and tables.

**Open:** a contents list for long Notes (show only at three or more sections) is deferred until a Note needs it. Diagram alt text must come from existing content, never a new field.

## Direction contract

THESIS: Every Note is typeset as a short LaTeX `article`: centred title block, a Stage paragraph where the abstract sits, numbered sections, and LaTeX's own marks for link state. It refuses the garden default of cream paper, green pills and a backlinks footer card.

OWN-WORLD: Plain white page, near-black ink, New Computer Modern Book (self-hosted as Garden Modern) for everything, small caps for labels, hyperref blue (#1F4E8C) for written links, maroon (#8B1A1A) plus a `??` mark for unwritten ones, booktabs rules (horizontal only) for code and tables, listings-style line numbers, a short footnote rule.

STORY: The reader sees what the Note is, where it sits in the Curriculum, how far to trust it, reads it, then follows a link, a footnote Tangent, or a reference to the next Note.

FIRST VIEWPORT: Small-caps site line (jonpark.dev left; Progress map, About Stages right). Centred title block: title at about 40px, "Topic: X · Part N, Title", tended date. A 560px Stage abstract headed "Stage: 🌱 Seedling". Then the justified 66ch body at about 19px, section 1 heading numbered.

FORM: The LaTeX Article, grounded candidate 1 of the safer re-roll (user steer: "a fan of the LaTeX aesthetic", "the digital-garden standard, its simple"). seed:8ce4311973aaf09d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
