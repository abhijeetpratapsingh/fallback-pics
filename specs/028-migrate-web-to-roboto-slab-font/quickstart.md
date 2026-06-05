# Quickstart: Validate Roboto Slab Web Font Migration

1. Install dependencies if needed:

```bash
pnpm install
```

2. Build the web app:

```bash
pnpm --filter @fallback-pics/web build
```

3. Search for legacy web fonts:

```bash
rg -n "Inter|Geist|JetBrains|Fira Code|Arial|Menlo|Monaco|Segoe UI" apps/web theme.css
```

4. Preview and visually check representative pages:

```bash
pnpm --filter @fallback-pics/web preview
```

Check `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, and `/404` on desktop and mobile. Confirm no CSP font errors and no horizontal overflow.
