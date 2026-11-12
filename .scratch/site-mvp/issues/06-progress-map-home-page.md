# 06: Progress map home page

**What to build:** The home page becomes the Progress map, replacing the placeholder. Every Part of the Curriculum appears in order, each listing its Topics in order, with 🐇 Tangents as the last Part. Each Topic is marked with the Stage of its most advanced Note and shows its 🌱/🌿/🌳 counts. Topics with no Notes stay visible and are marked untouched. Each Topic lists its Notes (title plus Stage badge, linking to the Note), so every Note can be reached from the home page.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 03 (Note pages with Stage badges)

**Status:** resolved

- [ ] Parts and Topics appear in Curriculum order, with Tangents last
- [ ] Each Topic is marked with its most advanced Note's Stage
- [ ] Each Topic shows correct per-Stage counts
- [ ] Topics with no Notes are visible and marked untouched
- [ ] Each Topic lists its Notes with Stage badges and links
- [ ] Each behaviour above is covered by a build-based test

## Comments

- Implemented on integration branch `site-mvp` (2026-11-12); all acceptance criteria covered by build-based tests.
