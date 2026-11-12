# Static site ships as a container behind Cloudflare; Fly.io now, homelab later

The site is a static Astro build, but it ships as a plain static-server container image with nothing Fly-specific inside, served from Fly.io behind the Cloudflare proxy (Full strict SSL). The long-term home is a k8s homelab reached through a Cloudflare Tunnel, so the image and the Cloudflare edge are the parts that carry over. Moving off Fly then only changes where the DNS record points.

## Considered Options

- **Cloudflare Pages**: less setup, and DNS is already on Cloudflare, but it leaves nothing to carry over to the homelab. Kept only as the fallback if Fly isn't serving by the MVP deadline.
- **Proxy off (grey cloud) to Fly**: simpler certificates now, but the homelab move would then also change the edge.
