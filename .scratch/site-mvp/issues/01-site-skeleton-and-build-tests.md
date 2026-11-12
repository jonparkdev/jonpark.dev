# 01: Site skeleton and build tests

**What to build:** A static Astro site that builds and shows a placeholder home page, plus the test setup every later ticket uses: a test writes a fixture garden (Notes, Diagrams, a fixture Curriculum) into a temp folder, runs the real build against it, and checks the generated pages or the build's exit status. The notes folder, assets folder and Curriculum the build reads can be overridden at build time, and default to the real `garden/` vault and Curriculum. See the spec's Testing Decisions: tests only look at the built site, never at internals.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** None (can start immediately)

**Status:** resolved

- [ ] The site builds to fully static output with one command
- [ ] The home page shows a placeholder
- [ ] The build reads its notes folder, assets folder and Curriculum from overridable inputs, defaulting to the real vault
- [ ] A test helper creates a fixture garden in a temp folder, runs the build against it, and exposes the generated pages and the build's exit status and error output
- [ ] One passing test builds a fixture garden and checks the placeholder page
- [ ] A single command runs the test suite

## Comments

- Implemented on integration branch `site-mvp` (2026-11-12); all acceptance criteria covered by build-based tests.
