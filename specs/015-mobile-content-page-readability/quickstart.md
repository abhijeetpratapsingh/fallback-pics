# Quickstart Validation: Refine Mobile Content Page Readability

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `apps/web/src/layouts/ContentLayout.astro`
- Validate `apps/web/src/pages/docs.astro`

```bash
pnpm --filter @fallback-pics/web build
```
