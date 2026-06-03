# Quickstart Validation: Improve GitHub and Link Foundation

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `README.md`
- Validate `CONTRIBUTING.md`

```bash
pnpm --filter @fallback-pics/web build
```
