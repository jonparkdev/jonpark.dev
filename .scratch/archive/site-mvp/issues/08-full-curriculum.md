# 08: Full Curriculum

**What to build:** The Curriculum lists every Hello Interview Part and Topic in their published order, drafted from Hello Interview's public table of contents, plus an empty 🐇 Tangents Part last. Each Topic gets a stable kebab-case key (what Note frontmatter `topic` refers to) and its display title. The author reviews the draft once before it's considered done.

Spec: `.scratch/archive/site-mvp/spec.md`

**Blocked by:** 03 (Note pages with Stage badges)

**Status:** resolved

- [x] Every Hello Interview Part and Topic is present, in published order, with the source cited where the draft is reviewed
- [x] Each Topic has a stable kebab-case key and a display title
- [x] An empty Tangents Part comes last
- [x] Any Topics used by existing Notes still exist, or those Notes are updated so the build passes
- [x] The author has reviewed and approved the list

## Comments

- Author chose the System Design Course sidebar with its 12 modules as Parts (2026-11-12); `src/curriculum.json` now has 12 Parts / 42 Topics, see `docs/curriculum-source.md`. Still open: author confirms the list matches their logged-in course view.
- Resolved 2026-11-13: author reviewed and approved the list.
