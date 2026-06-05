# Validation Contract: Roboto Slab Web Font Migration

## Source Search Contract

Run after implementation:

```bash
rg -n "Inter|Geist|JetBrains|Fira Code|Arial|Menlo|Monaco|Segoe UI|fonts.googleapis.com/css2\\?family=(?!Roboto\\+Slab)|font-family" apps/web theme.css
```

Expected:

- No legacy named fonts remain in `apps/web` or `theme.css`.
- Remaining `font-family` declarations use `var(--font-web)`, `var(--font-sans)`, `var(--font-mono)`, or generated SVG `Roboto Slab`.

## Build Contract

```bash
pnpm --filter @fallback-pics/web build
```

Expected:

- Build exits 0.
- No font/CSP-related build warnings are introduced.

## Visual Contract

Render `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, and `/404` at desktop and mobile widths.

Expected:

- No console errors related to blocked font or CSP loading.
- No document-level horizontal overflow on mobile.
- Long URLs, code blocks, buttons, inputs, and generated preview text remain readable and contained.
