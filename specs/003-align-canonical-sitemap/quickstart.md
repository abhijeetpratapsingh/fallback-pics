# Quickstart Validation: Align Canonical and Sitemap URLs

Run after implementation and after deployment when production HTTP behavior is required.

## Local Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Public URL Checks

```bash
curl -I https://fallback.pics/placeholder-image-api/ canonical self URL
```
```bash
curl -I https://fallback.pics/dummy-image-generator/ canonical self URL
```
```bash
curl -I https://fallback.pics/broken-image-fallback/ canonical self URL
```

## Source Checks

```bash
rg -n "<link rel="canonical"|og:url|FAQPage|HowTo|noindex|/api/v1" apps/web/dist
rg -n "https://fallback.pics/(400x300|square/400|avatar/200)" apps/web/public/sitemap.xml
```
