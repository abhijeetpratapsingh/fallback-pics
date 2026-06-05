# Quickstart: Validate Unified Web Header Navigation

1. Build:

```bash
pnpm --filter @fallback-pics/web build
```

2. Search for variant drift:

```bash
rg -n "landingNav|primaryNav|HeaderVariant|variant=|header=\\\"(landing|docs|default)\\\"" apps/web/src
```

3. Preview:

```bash
pnpm --filter @fallback-pics/web preview
```

4. Check `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, `/guides/react-image-fallback/`, `/privacy/`, and `/404` at desktop and mobile widths.
