# 09: Obsidian vault setup

**What to build:** The `garden/` folder works as the author's Obsidian vault, and writing in it publishes the site with no other steps. Obsidian Git commits and syncs every 30 minutes when something changed. Excalidraw auto-exports SVGs into the assets folder. The vault configuration (plugins and settings) is committed, but not the workspace layout files. The Inbox exists and stays out of git. This is mostly clicking through Obsidian, so the author does it; an agent can help by preparing settings files and checking the result.

Spec: `.scratch/archive/site-mvp/spec.md`

**Blocked by:** 02 (Placeholder live at https://jonpark.dev), 03 (Note pages with Stage badges)

**Status:** resolved

- [x] The vault opens in Obsidian with the notes folder, the assets folder and the Inbox
- [x] Obsidian Git auto commit-and-sync is set to 30 minutes and only commits when there are changes
- [x] Excalidraw auto-exports SVG into the assets folder
- [x] Vault configuration is committed; workspace layout files and the Inbox are not
- [x] A Note written in Obsidian appears live on jonpark.dev after the next sync and deploy, with no manual steps

## Comments

- 2026-11-12: the vault lives in a dedicated writing clone at `~/vaults/jonpark.dev` that stays on `main` (vault = its `garden/`), so auto-sync never picks up code work or feature branches. Vault config (app, Obsidian Git, Excalidraw settings) is committed there locally, not yet pushed; `garden/inbox.md` is created there and gitignored. Still open for the author: open the vault, install the two plugins, run the first sync, publish a test Note.
- 2026-11-13: first Note live at https://jonpark.dev/notes/test-note (deploy run 43515184160, after a failed run for an invalid `topic`). Config, plugins and the Note are on `main`; `workspace.json` and `inbox.md` stay ignored. Installing the plugins moved the prepared settings to `data.json.bak`, so both plugins run on defaults (Obsidian Git auto-sync off; Excalidraw folder `Excalidraw`, no SVG export); the `.bak` files are deleted in the clone. Still open: set both plugins in the settings UI, then see a Note go live from auto-sync alone.
- Resolved 2026-11-13: author reviewed and confirmed; both plugins now carry the intended settings. The first automatic 30-minute sync had not yet run at resolution.
