# Quickstart: Validate Centralized Web Color Tokens

1. Build the web app:

```bash
pnpm --filter @fallback-pics/web build
```

2. Audit remaining color references:

```bash
rg -n "#[0-9A-Fa-f]{3,8}|\\b(violet|purple|zinc|gray|emerald|blue|orange|red)-[0-9]{2,3}\\b" apps/web/src apps/web/tailwind.config.mjs theme.css
```

3. Preview and visually inspect representative pages:

```bash
pnpm --filter @fallback-pics/web preview
```

Check desktop and mobile for `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, one content page, and `/404`.
