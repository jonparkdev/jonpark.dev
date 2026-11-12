# 05: "Linked from" backlinks

**What to build:** At the bottom of each Note page, a "Linked from" list shows every Note that wikilinks to it, each with its Stage badge, linking to that Note. A Note that nothing links to has no "Linked from" section at all. Links to unwritten Notes produce no backlinks.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 04 (Wikilinks and Diagram embeds)

**Status:** ready-for-agent

- [ ] Each Note lists every Note that links to it, each with its Stage badge and a link
- [ ] A Note linked several times from the same Note appears once in the list
- [ ] A Note with no backlinks shows no "Linked from" section
- [ ] Each behaviour above is covered by a build-based test
