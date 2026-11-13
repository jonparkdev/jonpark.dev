# Hosting

The site is a static Astro build shipped as a plain static-file-server container, served from Fly.io behind the Cloudflare proxy with SSL mode Full (strict). See `docs/adr/0001-container-behind-cloudflare.md`.

- `Dockerfile`: packages the pre-built `dist/` into a static server on port 8080. Nothing Fly-specific.
- `fly.toml`: everything Fly-specific: one always-on `shared-cpu-1x` machine, no auto-stop.
- `.github/workflows/deploy.yml`: on every push to `main`, builds the site (full git history) and runs `flyctl deploy`. A newer run cancels one in progress. Needs the GitHub secret `FLY_API_TOKEN`.
- `scripts/setup-hosting.sh`: the wizard for the one-time manual steps (Fly login, app, deploy token secret, certificate, Cloudflare DNS and SSL, final `curl` check). Run it from anywhere in the repo: `scripts/setup-hosting.sh`.

## Writing vault

Notes are published from a dedicated writing clone of this repo at `~/vaults/jonpark.dev`, which stays on `main`. The Obsidian vault is its `garden/` folder. Code work happens in a separate checkout, so Obsidian Git's auto-sync never commits code changes or pushes to a feature branch.

- Obsidian Git: commit-and-sync every 30 minutes, only when something changed, pulling before it pushes. Every sync that pushes triggers the deploy. Sync only runs while Obsidian is open.
- Excalidraw: drawings live in `garden/assets/`, auto-export SVG next to them, and are embedded as `![[name.svg]]`.
- New Notes go to `garden/notes/`. A Note needs valid `stage` and `topic` frontmatter, or the deploy fails and the live site stays at its last good version.
- `garden/inbox.md` and `garden/.obsidian/workspace*.json` are gitignored and exist only in the writing clone.

Settings live in `garden/.obsidian/` (committed). To set up on a new machine: clone the repo to `~/vaults/jonpark.dev`, open `garden/` as a vault, trust the author, and enable community plugins. The committed plugin code and settings load as-is. Check the settings in the plugin UI rather than editing `data.json` while Obsidian is running, because the plugin overwrites the file.

## Local smoke run

```sh
npm run build
docker build -t jonpark-dev .
docker run --rm -p 8080:8080 jonpark-dev
curl localhost:8080
```

## Fallback: Cloudflare Pages

If https://jonpark.dev isn't serving the placeholder by around Saturday Nov 14 at noon, ship the same static build to Cloudflare Pages and defer the container work:

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this GitHub repo.
2. Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=24`.
3. Add `jonpark.dev` as the Pages project's custom domain (Cloudflare replaces the apex record).
4. Disable `.github/workflows/deploy.yml` so pushes don't also deploy to Fly.

Note: Pages does a shallow clone by default, so Tended dates from git history need a full fetch (for example `git fetch --unshallow` at the start of the build command).
