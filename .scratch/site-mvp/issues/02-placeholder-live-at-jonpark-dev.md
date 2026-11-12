# 02: Placeholder live at https://jonpark.dev

**What to build:** The tracer bullet for hosting: every push to `main` builds the site and puts it live at https://jonpark.dev. The site ships as a plain static-file-server container image with nothing Fly-specific inside (ADR 0001), runs on one always-on smallest Fly machine, and sits behind the Cloudflare proxy with Full (strict) SSL. The leftover DNS record that currently causes a 520 error gets replaced.

The build runs in the GitHub Action, not in Fly's remote builder; the image only packages the built output. Steps only the author can do (the `flyctl` login, creating the app, the Fly API token as a GitHub secret, Cloudflare DNS, SSL mode and certificate-validation records) go into a `/wizard` the author runs.

**Fallback (soft target):** if the placeholder isn't live over HTTPS by around Saturday Nov 14 at noon, deploy the same static build to Cloudflare Pages instead and defer the container work.

Spec: `.scratch/site-mvp/spec.md` · ADR: `docs/adr/0001-container-behind-cloudflare.md`

**Blocked by:** 01 (Site skeleton and build tests)

**Status:** ready-for-agent

- [ ] The container image serves the built site on one port; a local smoke run returns the placeholder page
- [ ] The image contains no Fly-specific code or configuration
- [ ] The Fly app runs one machine at the smallest shared-CPU size and never stops to zero
- [ ] The GitHub Action builds and deploys on every push to `main`; a newer run cancels one still in progress
- [ ] A wizard walks the author through every manual step, and every secret it sets matches a secret the Action references
- [ ] Cloudflare proxies jonpark.dev to Fly with SSL mode Full (strict); the record causing the 520 error is gone
- [ ] `curl https://jonpark.dev` returns the placeholder page with a valid certificate
