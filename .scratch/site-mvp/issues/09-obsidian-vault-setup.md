# 09: Obsidian vault setup

**What to build:** The `garden/` folder works as the author's Obsidian vault, and writing in it publishes the site with no other steps. Obsidian Git commits and syncs every 30 minutes when something changed. Excalidraw auto-exports SVGs into the assets folder. The vault configuration (plugins and settings) is committed, but not the workspace layout files. The Inbox exists and stays out of git. This is mostly clicking through Obsidian, so the author does it; an agent can help by preparing settings files and checking the result.

Spec: `.scratch/site-mvp/spec.md`

**Blocked by:** 02 (Placeholder live at https://jonpark.dev), 03 (Note pages with Stage badges)

**Status:** ready-for-human

- [ ] The vault opens in Obsidian with the notes folder, the assets folder and the Inbox
- [ ] Obsidian Git auto commit-and-sync is set to 30 minutes and only commits when there are changes
- [ ] Excalidraw auto-exports SVG into the assets folder
- [ ] Vault configuration is committed; workspace layout files and the Inbox are not
- [ ] A Note written in Obsidian appears live on jonpark.dev after the next sync and deploy, with no manual steps
