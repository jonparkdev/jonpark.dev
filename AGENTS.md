# jonpark.dev

## Docs map

Each kind of information has one home. Extend that file instead of creating a new one, and link to it rather than repeating what it says.

| Kind | Home |
|---|---|
| What the site is, who it's for, principles, capabilities, deferred work | `PRODUCT.md` |
| Domain vocabulary, including what each Stage requires | `GLOSSARY.md` |
| Visual design system | `DESIGN.md` (generated mirror: `.impeccable/design.json`) |
| Durable architecture decisions | `docs/adr/` |
| Hosting, deploy, writing vault | `docs/hosting.md` |
| Where the Hello Interview Curriculum comes from | `docs/curriculum-source.md` |
| Personal study routine and dates | `docs/study-plan.md` |
| Specs and issues | `.scratch/<feature>/` (finished work in `.scratch/archive/`) |
| Per-page design briefs (impeccable) | `.impeccable/surfaces/` |
| Agent-only setup | `.agents/` |

## Adding docs

- Before creating a doc, find its home above and add to that file.
- A new top-level doc or folder needs a row in this map in the same change.
- Root and `docs/` are for humans. Files only agents read go in a dot-folder.

## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/<feature>/`. See `.agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), recorded as a `Status:` line in each issue file. See `.agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `.agents/domain.md`.

### Design

`PRODUCT.md` and `DESIGN.md` at the repo root, plus `.impeccable/`, belong to the impeccable skill. Keep them at these paths.
