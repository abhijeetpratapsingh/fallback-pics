# Quickstart Validation: Unify Navigation and Mobile Menu

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `apps/web/src/navigation.ts`
- Validate `apps/web/src/components/SiteHeader.astro`

```bash
pnpm --filter @fallback-pics/web build
```
