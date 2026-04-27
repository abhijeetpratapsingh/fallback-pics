# Deployment Guide

Fallback.pics uses two Cloudflare services:

- Cloudflare Pages for the Astro website in `apps/web`
- Cloudflare Workers for the image API in `apps/worker`

The preferred website deployment flow is now Cloudflare Pages Git integration with GitHub. Pushes to `main` deploy production, and pull requests/branches create preview deployments.

## Important Cloudflare Pages Note

If the existing `fallback-pics-web` Pages project was created with Wrangler Direct Upload, Cloudflare does not let you convert that same Pages project to Git integration later.

Use this migration path:

1. Create a new Pages project using Git integration.
2. Deploy and verify the new project.
3. Move the `fallback.pics` custom domain from the old Pages project to the new one.
4. Keep or delete the old Direct Upload project after the domain is moved.

## GitHub-Connected Pages Setup

In Cloudflare Dashboard:

1. Go to Workers & Pages.
2. Select Create application.
3. Select Pages.
4. Select Connect to Git.
5. Authorize GitHub if prompted.
6. Pick the repository:

```text
abhijeetpratapsingh/fallback-pics
```

Use these build settings:

| Setting | Value |
| --- | --- |
| Project name | `fallback-pics-web` or a new name if the old Direct Upload project still exists |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `pnpm web:build` |
| Build output directory | `apps/web/dist` |
| Framework preset | `Astro` |

Recommended environment variables:

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `20` |
| `PNPM_VERSION` | `8.12.0` |

Cloudflare will install dependencies, run the build command, and deploy `apps/web/dist`.

## Production Domain Cutover

After the new Git-connected Pages project builds successfully:

1. Open the old Pages project that currently owns `fallback.pics`.
2. Remove the `fallback.pics` custom domain from that project.
3. Open the new Git-connected Pages project.
4. Add `fallback.pics` under Custom domains.
5. Wait for Cloudflare to validate the domain and certificate.
6. Visit `https://fallback.pics` and confirm the site is served from the new project.

Do the cutover only after the new Pages preview URL works.

## Worker API Deployment

The API Worker is still deployed from Wrangler:

```bash
pnpm worker:deploy
```

Current Worker config lives in:

```text
apps/worker/wrangler.toml
```

The Worker account ID configured locally is:

```text
04f1fbe6c8a63cd40173f5958866906d
```

If you later want the Worker to deploy from GitHub too, set up Cloudflare Workers Builds or a GitHub Action with a scoped Cloudflare API token.

## Local Build Check

Before pushing:

```bash
pnpm install
pnpm web:build
```

GitHub also runs `.github/workflows/pages-build-check.yml` on pushes and pull requests to catch website build failures before you rely on the Cloudflare deployment logs.

## Manual Fallback Deploy

Manual deployment is still available for emergencies:

```bash
# Website Direct Upload fallback
cd apps/web
pnpm build
npx wrangler pages deploy dist --project-name fallback-pics-web --branch main

# Full legacy deployment script
./deploy.sh --production
```

Prefer the GitHub-connected Pages project for normal website changes.

## Useful URLs

- Production: `https://fallback.pics`
- Pages preview domain: `https://fallback-pics-web.pages.dev`
- Worker fallback URL: `https://fallback-pics.billing-04f.workers.dev`
- Cloudflare Dashboard: `https://dash.cloudflare.com`
