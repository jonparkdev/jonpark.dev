# 04: Wikilinks and Diagram embeds

**What to build:** Wikilinks in a Note's body work the way they do in Obsidian. `[[Note title]]` links to that Note's page, matched by filename and case-insensitive; `[[Note title|label]]` shows the label. A link whose target Note doesn't exist yet renders as visibly unwritten text (styled, not an anchor) and does not fail the build. `[[Note#Heading]]` links to the Note page and ignores the heading. `![[name.svg]]` embeds that Diagram from the assets folder inline; a missing asset fails the build, naming the Note and the file.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 03 (Note pages with Stage badges)

**Status:** resolved

- [x] `[[Note title]]` renders as a link to that Note's page
- [x] Matching is by filename and ignores case
- [x] `[[Note title|label]]` shows the label and links to the Note
- [x] A link to a Note that doesn't exist renders as styled unwritten text, not a link, and the build succeeds
- [x] `[[Note#Heading]]` links to the Note page
- [x] `![[name.svg]]` shows the Diagram inline
- [x] A missing Diagram asset fails the build, naming the Note and the file
- [x] Each behaviour above is covered by a build-based test

## Comments

- Implemented on integration branch `site-mvp` (2026-11-12); all acceptance criteria covered by build-based tests.
