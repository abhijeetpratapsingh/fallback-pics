# Validation Contract: Unified Web Header Navigation

## Source Contract

Run:

```bash
rg -n "landingNav|primaryNav|HeaderVariant|variant=|header=\\\"(landing|docs|default)\\\"" apps/web/src
```

Expected: no header nav variant drift remains.

## Build Contract

```bash
pnpm --filter @fallback-pics/web build
```

Expected: exits 0.

## Browser Contract

Inspect `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, `/guides/react-image-fallback/`, `/privacy/`, and `/404`.

Expected:

- Desktop and mobile nav labels match: Generator, Docs, API, Features, Blog, GitHub, Status.
- Active states match the current route where applicable.
- Generator href is `#hero-demo` on `/` and `/placeholder-image-generator/` elsewhere.
- GitHub and Status use `target="_blank"` and `rel="noopener noreferrer"`.
- Mobile menu opens, closes on link click, closes on Escape, and updates `aria-expanded`.
- No relevant console errors or document-level horizontal overflow.
