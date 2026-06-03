# Quickstart: Normalize Internal Link Trailing Slashes

Run after implementation:

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/web seo:smoke
pnpm --filter @fallback-pics/web seo:priority
```

For API behavior, also run worker tests when route behavior may be affected:

```bash
pnpm --filter @fallback-pics/worker exec vitest run
pnpm --filter @fallback-pics/worker typecheck
```
