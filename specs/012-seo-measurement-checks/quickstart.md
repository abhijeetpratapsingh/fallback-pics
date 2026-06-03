# Quickstart Validation: Add SEO Measurement Checks

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `apps/web/scripts/seo-smoke-check.mjs`
- Validate `apps/web/package.json`
- Validate `package.json`
- Validate `README.md`

```bash
pnpm --filter @fallback-pics/web build
```

```bash
pnpm --filter @fallback-pics/web seo:smoke
```
