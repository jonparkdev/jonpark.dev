# 03: Note pages with Stage badges, plus /about-stages

**What to build:** Every Note in the notes folder becomes a page at `/notes/<slug>` (the slug is the kebab-case filename), titled with its filename, showing its Stage badge (🌱 Seedling, 🌿 Budding, 🌳 Evergreen) linking to `/about-stages`, its Topic, and its rendered body. Frontmatter is validated at build time, and any violation fails the build with a message naming the Note and the field. This ticket introduces the typed Curriculum structure (ordered Parts of ordered Topics, each Topic with a stable key and display title, and Tangents as the last Part), populated with only a few Topics for now; ticket 08 fills it in.

`/about-stages` explains the three Stages in plain language, and that Stages change only through Recall and Demotion is expected (vocabulary per `GLOSSARY.md`).

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 01 (Site skeleton and build tests)

**Status:** resolved

- [x] Each Note renders at `/notes/<slug>` with its filename as the title, Stage badge, Topic and body
- [x] The Stage badge links to `/about-stages`
- [x] `/about-stages` exists and explains Seedling, Budding, Evergreen, Recall and Demotion
- [x] A missing or invalid `stage` fails the build, naming the Note
- [x] A `topic` not in the Curriculum fails the build, naming the Note
- [x] An `upgrades` value other than `diagram`, `interactive` or `explainer` fails the build, naming the Note; valid `upgrades` are accepted but not rendered
- [x] Any other frontmatter field fails the build
- [x] Two Notes that produce the same slug fail the build, naming both
- [x] Each behaviour above is covered by a build-based test

## Comments

- Implemented on integration branch `site-mvp` (2026-11-12); all acceptance criteria covered by build-based tests.
