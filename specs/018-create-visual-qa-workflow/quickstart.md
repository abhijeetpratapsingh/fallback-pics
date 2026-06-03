# Quickstart Validation: Create Visual QA Workflow

## Build

```bash
pnpm --filter @fallback-pics/web build
pnpm --filter @fallback-pics/worker typecheck
pnpm --filter @fallback-pics/worker exec vitest run
```

## Story Checks

- Validate `apps/web/scripts/visual-qa.mjs`
- Validate `apps/web/package.json`
- Validate `package.json`
- Validate `README.md`

```bash
pnpm --filter @fallback-pics/web build
```

```bash
pnpm --filter @fallback-pics/web visual:qa
```
