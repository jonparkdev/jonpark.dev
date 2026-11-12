# Spec: Site MVP

Status: ready-for-agent

## Problem Statement

I'm preparing for system design interviews and want to start applying around Jan 18, 2027. I write Notes in Obsidian as I work through the Hello Interview Curriculum, but they only exist on my laptop. I need a public garden at jonpark.dev that shows each Note at its honest Stage and how far through the Curriculum I am, and that publishes itself whenever I write, so running the site never takes time away from studying.

## Solution

A static site built from the Obsidian vault and published automatically whenever Obsidian Git pushes:

- Every Note gets its own page with a Stage badge, working wikilinks, embedded Diagrams, and the Notes that link back to it.
- The home page is the Progress map: every Part and Topic of the Curriculum, each Topic marked with the Stage of its most advanced Note, followed by the five most recently Tended Notes.
- A page at `/about-stages` explains the three Stages to visitors.
- The site runs as a portable container on Fly.io behind Cloudflare, so it can later move to the homelab without visitors noticing (see ADR 0001).

## User Stories

### Publishing

1. As the author, I want a Note I write in the vault to appear on the site without me running anything, so that publishing never competes with studying.
2. As the author, I want Obsidian Git to sync every 30 minutes and only when something changed, so that I don't trigger pointless deploys.
3. As the author, I want every push to main to build and deploy the site, so that the live site always reflects main.
4. As the author, I want a newer push to cancel a deploy that's still running, so that bursts of syncs don't queue up stale deploys.
5. As the author, I want a Note with a missing or invalid `stage` to fail the build, so that I find out immediately instead of publishing a wrong badge.
6. As the author, I want a Note whose `topic` isn't in the Curriculum to fail the build, so that no Note ends up outside the Progress map.
7. As the author, I want an invalid `upgrades` value to fail the build, so that typos don't go unnoticed.
8. As the author, I want a failed build's error message to name the offending Note and field, so that I can fix it from Obsidian in seconds.
9. As the author, I want a failed build to leave the live site at its last good version, so that visitors never see a broken garden.
10. As the author, I want my Inbox never to reach the public repo or the site, so that quick captures stay private.
11. As the author, I want the vault's Obsidian configuration (plugins, Excalidraw export, Obsidian Git settings) committed, except workspace layout, so that I can set the vault up again on another machine.
12. As the author, I want every Note in the notes folder to be public, with no draft flag, so that frontmatter stays minimal.

### Note pages

13. As a visitor, I want each Note at its own URL, `/notes/<slug>`, where the slug is the kebab-case filename, so that I can link to and share a single idea.
14. As the author, I want the Note's title to be its filename, so that I never maintain a separate title field.
15. As a visitor, I want a Stage badge (🌱 Seedling, 🌿 Budding, 🌳 Evergreen) at the top of each Note, so that I know how much to trust what I'm reading.
16. As a visitor, I want the Stage badge to link to `/about-stages`, so that I can learn what the Stages mean.
17. As a visitor, I want to see which Topic a Note belongs to, so that I can place it in the Curriculum.
18. As a visitor, I want `[[Note title]]` wikilinks to become links to that Note's page, so that I can follow ideas through the garden.
19. As the author, I want `[[Note title|label]]` to show the label text while linking to the Note, so that my prose reads naturally.
20. As the author, I want wikilinks to resolve by filename the way Obsidian resolves them, so that a link that works in Obsidian works on the site.
21. As a visitor, I want a wikilink to a Note that doesn't exist yet to appear as visibly unwritten text rather than a broken link, so that I can see ideas the author plans to write about without hitting a 404.
22. As the author, I want links to unwritten Notes to be allowed in the build, so that I can link ahead of my writing.
23. As a visitor, I want Diagrams embedded with `![[name.svg]]` to show inline in the Note, so that I see the sketch alongside the text.
24. As a visitor, I want a "Linked from" list at the bottom of each Note showing every Note that links to it, so that I can discover related ideas.
25. As a visitor, I want each entry in "Linked from" to show its Stage badge, so that I can choose where to go next.
26. As a visitor, I want a Note with no backlinks to simply have no "Linked from" list, so that the page doesn't show an empty section.

### Home page / Progress map

27. As a visitor, I want the home page to be the Progress map, so that the first thing I see is how far through the Curriculum the author is.
28. As a visitor, I want the Progress map to show every Part of the Curriculum in Hello Interview's order, so that it matches the syllabus.
29. As a visitor, I want each Part to list its Topics in order, so that I can see the shape of the syllabus.
30. As a visitor, I want each Topic marked with the Stage of its most advanced Note, so that I can see how well each area is understood.
31. As a visitor, I want each Topic to show how many 🌱, 🌿 and 🌳 Notes it has, so that I can see breadth as well as depth.
32. As a visitor, I want Topics with no Notes to stay visible as untouched, so that the remaining work is visible.
33. As a visitor, I want to reach every Note of a Topic from the Progress map, so that every Note can be found from the home page.
34. As a visitor, I want 🐇 Tangents to appear as the last Part, so that rabbit-hole Topics are visible without mixing into the syllabus.
35. As a visitor, I want the five most recently Tended Notes listed below the Progress map, with their Stage badges and dates, so that I can see what's currently growing.
36. As the author, I want "Tended" to come from each Note's last git commit date, so that I never maintain a date by hand.
37. As the author, I want the Curriculum to come pre-filled with every Hello Interview Part and Topic, so that the Progress map is meaningful from day one.

### About stages

38. As a visitor, I want a page at `/about-stages` explaining Seedling, Budding and Evergreen in plain language, so that I understand the badges.
39. As the author, I want `/about-stages` to explain that Stages change only through Recall and that Demotion is expected, so that visitors read Seedlings as honest rather than unfinished.

### Hosting

40. As a visitor, I want the site at https://jonpark.dev with a valid certificate, so that it loads without warnings.
41. As a visitor, I want the site to load quickly on the first visit, so that the first impression isn't a cold start.
42. As the author, I want the site served through the Cloudflare proxy with Full (strict) SSL, so that moving to the homelab later is only a DNS change.
43. As the author, I want the leftover DNS record that currently causes a 520 error replaced, so that jonpark.dev stops showing an error page.
44. As the author, I want the site to ship as a plain static-file-server container with nothing Fly-specific inside, so that the same image can run in my k8s homelab later.
45. As the author, I want one always-on smallest Fly machine, so that hosting costs about $2 a month with no cold starts.
46. As the author, I want the deploy pipeline working end to end with a placeholder page before any garden features, so that hosting problems surface on day one.
47. As the author, I want a fallback rule (switch to Cloudflare Pages if the placeholder isn't live over HTTPS by around Saturday Nov 14, noon), so that hosting can't eat the MVP weekend.

## Implementation Decisions

- **Stack:** Astro, producing a fully static build. MDX and React are installed only when the first Interactive Upgrade arrives, not in this MVP.
- **Content source:** the build reads Notes directly from the vault's notes folder and Diagrams from the vault's assets folder. The vault is the `garden/` directory at the repo root, alongside the site code; both share one repo and one `main` branch.
- **Note frontmatter schema** (validated at build time; any violation fails the build, naming the Note and field):
  - `stage`: required; one of `seedling`, `budding`, `evergreen`.
  - `topic`: required; must be a Topic key defined in the Curriculum.
  - `upgrades`: optional; list of `diagram`, `interactive`, `explainer`. Validated but not rendered in the MVP.
  - No other fields.
- **Curriculum module:** a single typed definition of ordered Parts, each with ordered Topics (stable key + display title), with Tangents as the final Part. The implementer drafts it from Hello Interview's public table of contents; the author reviews it once.
- **Garden model** (internal; not a test entry point): from all Notes plus the Curriculum, it derives slugs, resolved wikilinks, backlinks, each Topic's Stage and per-Stage counts, and the Tended ordering. Pages render from it.
- **Slugs:** kebab-case of the filename. Two Notes that produce the same slug fail the build.
- **Wikilink resolution:** by filename, case-insensitive, as Obsidian does. `|label` sets the link text. An unresolved target renders as styled unwritten text (not an anchor) and does not fail the build.
- **Diagram embeds:** `![[name.svg]]` renders the SVG from the assets folder inline. A missing asset fails the build.
- **Tended date:** the date of the last git commit touching the Note's file. A Note with no commit yet (local development only) is treated as tended now.
- **Configurable inputs:** the notes folder, assets folder and Curriculum used by the build can be overridden when the build is run (for example via environment variables). The defaults point at the real vault. This is what lets tests build a fixture garden.
- **Container:** a minimal static-file-server image that only serves the pre-built output on one port. No Fly-specific code or configuration inside the image.
- **Build location:** the GitHub Action builds the site with full git history (for Tended dates), then packages the output into the container and deploys to Fly. Fly's remote builder does not run the site build.
- **Deploy workflow:** triggers on every push to `main`; uses a concurrency group so a newer run cancels an in-progress one; authenticates to Fly with a GitHub secret.
- **Fly:** one machine, smallest shared CPU size, always running (no auto-stop to zero).
- **Edge/DNS:** jonpark.dev's DNS is on Cloudflare. The proxied record points at Fly, SSL mode is Full (strict), and Fly holds a certificate for the domain validated through DNS. The current leftover record that causes the 520 error is replaced. Per ADR 0001, Cloudflare stays as the edge permanently.
- **Fallback:** if the placeholder page isn't live on https://jonpark.dev by around Saturday Nov 14 at noon (a soft target), the same static build goes to Cloudflare Pages instead and the container work is deferred.
- **Obsidian setup:** Obsidian Git auto commit-and-sync every 30 minutes when there are changes; Excalidraw auto-exports SVG into the assets folder. Vault configuration is committed except workspace layout files. The Inbox is gitignored.

## Testing Decisions

- **One test entry point: the site build.** Each test writes a small fixture garden (Notes, Diagrams, a small fixture Curriculum, and a real git history so Tended dates are genuine) into a temp directory, runs the real build against it using the configurable inputs, and then asserts on either the generated HTML or the build's exit status and error output.
- **What makes a good test here:** it checks only what a visitor would see in the built pages, or what the author would see when a build fails. Tests never call the garden model or other internals directly, so internals can be reorganised freely. If build-based tests become too slow, a second, faster entry point at the garden model can be added later. Not now.
- **Behaviours covered by tests:**
  - Note page: title, Stage badge and its link to `/about-stages`, Topic, rendered body.
  - Wikilinks: resolved, `|label`, case-insensitive, unwritten target rendered as unwritten text.
  - Diagram embed renders; a missing asset fails the build.
  - "Linked from" lists the right Notes with badges; absent when there are none.
  - Progress map: Part and Topic order, the most advanced Stage per Topic, per-Stage counts, untouched Topics visible, every Note reachable, Tangents last.
  - Recently Tended: the five latest by commit date, in order.
  - Build failures with Note-naming messages: missing or invalid `stage`, unknown `topic`, invalid `upgrades`, duplicate slug.
  - `/about-stages` exists.
- **Checked by hand, not automated:** the container serves the built files on its port (local smoke run); the live site answers over HTTPS at jonpark.dev through Cloudflare (`curl`); the deploy fires on push.
- **Prior art:** none. The repo has no code yet, so these tests set the pattern.

## Out of Scope

- Search, RSS, graph view, dark-mode polish, comments. These go to `LATER.md`.
- Rendering Upgrades: Interactive pieces (MDX + React islands) and Explainer video embeds. The `upgrades` field is validated only.
- Redirects when a Note is renamed.
- Showing unwritten Notes (dangling wikilink targets) on the Progress map.
- Separate Topic pages.
- Heading anchors in wikilinks (`[[Note#Heading]]` links to the Note page; the heading part is ignored).
- Notes in subfolders of the notes folder.
- The homelab deployment and Cloudflare Tunnel (ADR 0001 covers the direction only).
- The DSA and behavioral tracks, the solo Mock recordings, and the Inbox, none of which are ever published.

## Further Notes

- The MVP now comes before the first Seedling, starting Thursday Nov 12. Target: Sunday Nov 15, evening. Dates are soft targets, not strict deadlines. The author still has to update `docs/plans/PLAN-0001.md` to match (Dates section, the Normal-day diagram, and Promotions → Upgrades).
- Defaults the agent chose, not discussed in grilling (change them if wrong): duplicate slugs and missing Diagram assets fail the build; wikilink heading anchors are ignored; the notes folder is flat; every Topic on the Progress map lists its Notes (story 33), since with no Topic pages that's the only way to reach every Note from the home page.
- Steps only the author can do: the `flyctl` login and creating the app, the Fly API token as a GitHub secret, and the Cloudflare DNS, SSL and certificate-validation records. These get a `/wizard` during the hosting ticket.
- Vocabulary follows `GLOSSARY.md`; hosting direction follows `docs/adr/0001-container-behind-cloudflare.md`.
