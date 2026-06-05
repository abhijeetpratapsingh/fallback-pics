# Validation Contract: Centralized Web Color Tokens

## Source Audit

Run:

```bash
rg -n "#[0-9A-Fa-f]{3,8}|\\b(violet|purple|zinc|gray|emerald|blue|orange|red)-[0-9]{2,3}\\b" apps/web/src apps/web/tailwind.config.mjs theme.css
```

Expected:

- Canonical token definitions remain in `theme.css`.
- Tailwind config maps palette keys to `var(--color-...)`.
- Remaining direct colors are generated preview values, metadata, transparent overlays, shadows, or visual effects.

## Build

```bash
pnpm --filter @fallback-pics/web build
```

Expected: exits 0.

## Browser QA

Inspect `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, one content page, and `/404` at desktop and mobile widths.

Expected:

- No framework overlay.
- No relevant console errors.
- No document-level horizontal overflow.
- Buttons, cards, badges, links, forms, code blocks, focus states, header, and footer remain readable.
