# 🚀 Production Configuration Summary

## Current Deployment Status

### ✅ Deployed Services

1. **Worker API**
   - Production URL: `https://fallback.pics/api/v1` (pending DNS setup)
   - Fallback URL: `https://fallback-pics.billing-04f.workers.dev`
   - Version: `e1251bad-1597-42b0-bb40-0cc0aa92550e`

2. **Website**
   - Production URL: `https://fallback.pics`
   - Pages URL: `https://fallback-pics.pages.dev`
   - Deployment approach: migrate to Cloudflare Pages Git integration with GitHub

## Configuration Files Updated

### 1. `apps/worker/wrangler.toml`
```toml
# Production configuration
[vars]
ALLOWED_ORIGIN = "https://fallback.pics"
GOOGLE_ANALYTICS_ENABLED = "true"
```

### 2. `apps/worker/src/index.ts`
- Added CORS preflight handling
- Environment-aware CORS headers
- Support for `ALLOWED_ORIGIN` environment variable

### 3. `apps/web/src/config.ts`
```typescript
export const API_URL = import.meta.env.DEV 
  ? 'http://localhost:8787' 
  : 'https://fallback.pics/api/v1';
```

### 4. Cloudflare Pages API proxy
The Pages Function at `/api/v1/*` forwards requests to the Worker configured by the Pages runtime variable:

```text
WORKER_ORIGIN=https://fallback-pics.billing-04f.workers.dev
```

Do not include `/api/v1` in `WORKER_ORIGIN`; the proxy appends the incoming path and query string.

## DNS Configuration Required

Add these DNS records in Cloudflare Dashboard:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| A | api | 192.0.2.1 | ✅ |
| AAAA | api | 100:: | ✅ |

Or use CNAME:
| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | api | fallback-pics.billing-04f.workers.dev | ✅ |

## Custom Domain Setup

1. **DNS Records**: Create `api` subdomain (see above)
2. **Worker Custom Domain**: 
   - Go to Workers & Pages → fallback-pics
   - Settings → Triggers → Custom Domains
   - Add `https://fallback.pics/api/v1`

## Environment Variables

### Production Worker
- `ALLOWED_ORIGIN`: `https://fallback.pics` (set in wrangler.toml)
- `GOOGLE_ANALYTICS_ENABLED`: `true` (set in wrangler.toml)
- `GOOGLE_ANALYTICS_MEASUREMENT_ID`: GA4 measurement ID (set as Worker secret)
- `GOOGLE_ANALYTICS_API_SECRET`: GA4 Measurement Protocol API secret (set as Worker secret)
- `GOOGLE_ANALYTICS_CLIENT_ID_SALT`: Salt used for pseudonymous Worker client IDs when no `_ga` cookie is present (set as Worker secret)

### Production Website
- `PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID (set in Cloudflare Pages build environment)
- `WORKER_ORIGIN`: Worker origin for the Pages `/api/v1/*` proxy, for example `https://fallback-pics.billing-04f.workers.dev`

### Local Development
- Worker runs on: `http://localhost:8787`
- Website runs on: `http://localhost:4321`
- Pages Functions use `apps/web/.dev.vars`; copy `apps/web/.dev.vars.example` and set `WORKER_ORIGIN=http://localhost:8787`

## Website Deployment Approach

The website should deploy through Cloudflare Pages Git integration:

| Setting | Value |
| --- | --- |
| Git repository | `abhijeetpratapsingh/fallback-pics` |
| Production branch | `main` |
| Root directory | `/` |
| Build command | `pnpm web:build` |
| Build output directory | `apps/web/dist` |
| Node version | `20` |
| pnpm version | `8.12.0` |

If the current Pages project was created with Wrangler Direct Upload, create a new Git-connected Pages project and then move the `fallback.pics` custom domain to it after verification.

## Deployment Commands

```bash
# Worker deploy still uses Wrangler
pnpm worker:deploy

# Local website build check before pushing
pnpm web:build

# Pages Direct Upload runtime variable
wrangler pages secret put WORKER_ORIGIN --project-name fallback-pics
```

## Testing Production

```bash
# Test Worker API
curl https://fallback.pics/api/v1/400x300
curl -I "https://fallback.pics/api/v1/400x300?text=Head+Check"
curl -X OPTIONS -I https://fallback.pics/api/v1/400x300
curl https://fallback.pics/api/v1/chart/bar/600x400
curl https://fallback.pics/api/v1/animated/pulse/200x200

# Test Website
curl https://fallback.pics
```

## Next Steps

1. ✅ Worker deployed
2. ✅ Website deployed  
3. ✅ Main domain configured (fallback.pics)
4. ⏳ Configure DNS for https://fallback.pics/api/v1
5. ⏳ Add https://fallback.pics/api/v1 custom domain to Worker

## Monitoring

- Worker Analytics: [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → fallback-pics → Analytics
- Pages Analytics: [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → fallback-pics → Analytics
- Google Analytics: website page views and engagement events, plus Worker `fallback_worker_request` events when GA environment variables are configured

## Support URLs

- Worker Logs: https://dash.cloudflare.com/workers-and-pages/view/fallback-pics
- Pages Logs: https://dash.cloudflare.com/workers-and-pages/view/fallback-pics
