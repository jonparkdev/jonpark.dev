# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **The author (primary).** Jon, studying for system design interviews and planning to start applying around Jan 18, 2027. The garden is his learning tool and accountability record. He writes in Obsidian, and the site has to keep up with his study, never the other way round. When a design decision has to favour one reader, it favours him.
- **Fellow learners.** Other people preparing for system design interviews who read the Notes to learn. Jon wants to become a technical communicator and educator, so these readers should leave with something of value.
- **Evaluators.** Recruiters and interviewers may visit too. They are not the design target, but what they see has to be honest.

## Product Purpose

jonpark.dev is a public digital garden of system design Notes, organised around the Hello Interview Curriculum. It shows each Note at its honest Stage and how far through the Curriculum the author is, and it publishes itself whenever he writes.

Success: a visitor sees the quality of the author's thinking, but never at the cost of honesty. Unfinished, shaky, and untouched work stays visible as exactly what it is.

## Positioning

Every Stage is earned through Recall, never through polish (see `GLOSSARY.md`). The site is a truthful map of what one person is learning, how far they've got, and how well they understand it, untouched Topics included. Most "notes" sites curate their best work. This one shows the work in progress, labelled honestly.

## Operating Context

- Notes are written in Obsidian (vault: `garden/`). Diagrams are drawn in Excalidraw and auto-exported as SVG to `garden/assets/`.
- Obsidian Git auto-pushes every 30 minutes, and each push builds and deploys the static Astro site to Fly.io behind Cloudflare (`docs/hosting.md`, ADR 0001).
- Study rhythm: a tiered daily floor, a weekly 45-minute Gardening session, and solo and human Mocks (`docs/plans/PLAN-0001.md`).
- The Inbox and solo Mock recordings are private and never published.

## Capabilities and Constraints

- Note pages at `/notes/<slug>` with a Stage badge, Topic, wikilinks (links to unwritten Notes render as visibly unwritten text), embedded Diagrams, and "Linked from" backlinks.
- Home page = Progress map: every Part and Topic in Hello Interview order, each Topic marked with the Stage of its most advanced Note, plus per-Stage counts and "Recently tended".
- `/about-stages` explains the Stages publicly.
- Frontmatter is only `stage` and `topic` (plus `upgrades`). Invalid values fail the build, and the live site stays on its last good version.
- Upgrades (Diagram → Interactive → Explainer) are added only because of a felt gap, one at a time. Interactives come at most about once a month.
- Deferred (`LATER.md`, non-study days only): search, RSS, graph view, dark-mode polish, comments.
- Use the domain vocabulary in `GLOSSARY.md` (Note, Stage, Recall, Upgrade, Topic, Tangent…). Avoid its listed synonyms.

## Brand Commitments

- **Stage emoji are binding:** 🌱 Seedling, 🌿 Budding, 🌳 Evergreen, and 🐇 for Tangents.
- **Unpolished is fine:** Seedlings are rough by design. The site never makes a Note look more finished than its Stage.
- **Zero upkeep:** writing in Obsidian is the only input. Design must not add authoring steps, required frontmatter, curation flags, or manual work outside the vault.
- **Look preference (stated by the author during shape, 2026-11-13):** he has "always been a fan of the LaTeX aesthetic" and likes the plain simplicity of a standard digital garden. Prefer the familiar end over bold reinventions.
- Home page tagline: "A garden of system design notes, kept in service of interview prep." `scripts/setup-hosting.sh` checks for it, so change both together.

## Evidence on Hand

- Real Notes in `garden/notes/` (early, and still sparse).
- The Curriculum in `src/curriculum.json`: 12 Parts, 42 Topics, plus Tangents (`docs/curriculum-source.md`).
- No testimonials, readership numbers, or showcase pieces exist. Don't fabricate them.

## Product Principles

1. **The garden follows the study.** Nothing on the site may cost study time or add authoring work.
2. **Honesty before impressiveness.** Stage, progress, and gaps are shown as they are. Untouched Topics stay visible.
3. **Every Note should be worth a learner's time.** Teaching value comes through clear Notes and good Diagrams, not a showcase layer. Upgraded Notes are not singled out.
4. **Stage is the reader's trust signal.** A visitor should always know how far to trust what they're reading.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor: text contrast, Stage never shown by colour alone (emoji plus label), full keyboard use with visible focus, reflow at 200% zoom and on narrow screens, and semantic headings and landmarks. Diagrams need text alternatives, but these must come from existing content (for example the surrounding text), never from a new required authoring field.

## Open Decisions

- **Showcasing teaching work:** whether Upgraded Notes (especially Explainers) should later get a front door, such as an index or extra home-page weight, as evidence of teaching. Deferred until a few Explainers exist. For now, nothing is singled out.
