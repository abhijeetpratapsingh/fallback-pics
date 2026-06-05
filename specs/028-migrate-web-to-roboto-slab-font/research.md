# Research: Migrate Web to Roboto Slab Font

## Decision: Use Google Fonts with one Roboto Slab stylesheet

Use the existing Google Fonts loading strategy in `Layout.astro`, replacing Inter with Roboto Slab. Keep the existing `fonts.googleapis.com` and `fonts.gstatic.com` CSP allowances in `_headers`.

**Rationale**: The site already uses Google Fonts and CSP is already configured for it. This minimizes implementation scope and avoids adding font assets to the repo.

**Rejected Alternatives**: Self-hosting `.woff2` files would allow `font-src 'self'` only, but it adds asset management that the story does not require.

## Decision: Define `--font-web` once and map all font utilities to it

Define the stack as `--font-web: 'Roboto Slab', serif;` and set `--font-sans` and `--font-mono` aliases to the same value for existing CSS and Tailwind utility compatibility.

**Rationale**: Existing pages already use Tailwind `font-mono` and CSS variables. Mapping both Tailwind families to the same CSS variable removes the second font while avoiding a large markup churn.

**Rejected Alternatives**: Replacing every `font-mono` class with `font-sans` increases risk without adding user value, since the class can resolve to the shared font.

## Decision: Keep Worker runtime SVG generation unchanged

Only web-generated previews in `EnterpriseLanding.tsx` should reference Roboto Slab. Worker output remains out of scope.

**Rationale**: Acceptance criteria target web app UI. Worker SVG generation is API output and changing it would alter public image behavior.

## Decision: Preserve code semantics with layout, spacing, wrapping, and color

Code blocks and URL snippets use Roboto Slab but retain code containers, `code`/`pre` semantics, wrapping, and contrast.

**Rationale**: The story explicitly removes second monospace fonts, so code semantics must be visual/semantic rather than font-family based.
