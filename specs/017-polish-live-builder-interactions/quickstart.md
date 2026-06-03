# Quickstart Validation: Polish Live Builder Interactions

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `apps/web/src/components/EnterpriseLanding.tsx`

```bash
pnpm --filter @fallback-pics/web build
```
