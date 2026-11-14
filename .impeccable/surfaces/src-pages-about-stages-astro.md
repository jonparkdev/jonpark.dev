---
version: 1
slug: "src-pages-about-stages-astro"
primary_target: "src/pages/about-stages.astro"
related_targets: ["src/layouts/Article.astro"]
---

# About Stages

**Mode:** Read. A reader who clicked a Stage badge or "About Stages" wants to know how far to trust a Note and what the 🐇 marks mean, then return to the Note.

**Scope:** `src/pages/about-stages.astro`; shared article styles move into `src/layouts/Article.astro`, used by this page and the Note page (whose look must not change). Copy: light edits allowed without changing claims. Out of scope: home page; per-Stage badge anchors.

**Decisions:** Sections: 1 The Stages (1.1 🌱 Seedling, 1.2 🌿 Budding, 1.3 🌳 Evergreen), 2 How Stages change (Recall, Demotion), 3 🐇 Tangents (new). Anchors #seedling, #budding, #evergreen, #how-stages-change, #tangents.

## Direction contract

THESIS: About Stages is a short LaTeX article in the same form as a Note: title block, the definition of a Stage where the abstract sits, numbered sections. It refuses a help-page layout of cards, icons or FAQ accordions.

OWN-WORLD: Inherits DESIGN.md unchanged: white page, Garden Modern, small caps, hyperref blue, ink Stage badges, numbered section heads, justified body.

STORY: The reader learns what each Stage means and what earns it, that Stages move only through Recall and can be demoted, and what a Tangent is, then goes back to the Note they came from.

FIRST VIEWPORT: Site line; centred title "About Stages"; the abstract paragraph (Stage = honest mark of understanding, not polish) at 35rem; then "1 The Stages" with "1.1 🌱 Seedling" and its paragraph in the 41rem justified column.

FORM: Shaped directly inside the established LaTeX Article world, no structure roll (single fixed article, user confirmed "the same LaTeX article as a Note page"). seed: none (pinned) "the same LaTeX article as a Note page"

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
