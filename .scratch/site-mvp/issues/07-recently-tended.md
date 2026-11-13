# 07: Recently Tended

**What to build:** Below the Progress map, the home page lists the five most recently Tended Notes, newest first, each with its Stage badge and Tended date. A Note's Tended date is the date of the last git commit that touched its file. A Note with no commit yet (local development only) counts as tended now. The deploy Action checks out full git history so production dates are real.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 02 (Placeholder live at https://jonpark.dev), 06 (Progress map home page)

**Status:** resolved

- [x] The home page shows the five most recently Tended Notes below the Progress map, newest first, with badges and dates
- [x] Tended dates come from each Note's last git commit
- [x] An uncommitted Note counts as tended now
- [x] Fewer than five Notes shows all of them
- [x] Build-based tests use fixture gardens with real git history and control the commit dates
- [x] The deploy Action checks out full history, and the live site shows real Tended dates

## Comments

- Implemented on `site-mvp` with build-based tests (Tended uses the author date). Still open: confirm the live site shows real Tended dates once ticket 02 is live.
- Deployed with the site on 2026-11-12; the Action checks out full history. Still open: `garden/notes/` has no Notes yet, so real Tended dates can be checked live only after the first Note is committed.
- Resolved 2026-11-13: author reviewed and confirmed; the live site shows a real Tended date for the first Note.
