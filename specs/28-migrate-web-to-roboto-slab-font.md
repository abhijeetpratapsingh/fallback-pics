# Spec Kit Command Sequence: Migrate Web to Roboto Slab Font

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/028-migrate-web-to-roboto-slab-font
GIT_BRANCH_NAME=028-migrate-web-to-roboto-slab-font

Create a Spec Kit feature for migrating the fallback.pics web app typography to Roboto Slab.

Problem: The web app currently defines and references multiple font families across layout, Tailwind config, CSS, components, and generated SVG examples. This creates inconsistent typography and unnecessary font-loading surface.

User value: Visitors should see one consistent brand font across the web app, and maintainers should be able to change the web font from one source of truth.

Functional requirements:
- Use Roboto Slab as the single web UI font family across the Astro web app.
- Define the web font stack in one shared place and consume it everywhere in the web app.
- Remove Inter, Geist Mono, JetBrains Mono, Fira Code, and other hardcoded web font-family references from web UI styles and components.
- Preserve semantic code presentation while using the shared Roboto Slab font stack if the requirement is to remove all other web fonts.
- Optimize font loading by limiting requested weights to those actually used, using `display=swap`, and avoiding duplicate font imports.
- Keep font loading compatible with the existing Content Security Policy.
- Ensure generated SVG previews inside the web app use the same shared web font name where practical.
- Do not change Cloudflare Worker image generation unless explicitly required for web-preview consistency.

Out of scope:
- Rebranding colors, layout, spacing, or copy.
- Changing API routes or image generation behavior.
- Adding a second display, body, or monospace font.
- Changing non-web app packages unless they are required to remove web font references.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if "remove all other font" should apply to code blocks and generated web-preview SVG text. Default to Roboto Slab everywhere in the web UI, including code blocks, while leaving Worker runtime SVG generation unchanged unless it leaks into web UI.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a single-source Roboto Slab migration for the Astro web app, covering font loading, Tailwind theme config, CSS tokens, component-level font references, CSP compatibility, and visual regression checks.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for single-source font definition, removal of other web fonts, optimized font loading, CSP compatibility, responsive text wrapping, and visual consistency across homepage, docs, API, blog, and 404 pages.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing current font references, defining the Roboto Slab source of truth, updating font imports and CSS/Tailwind usage, removing hardcoded alternate fonts, checking CSP/font loading, and validating desktop/mobile rendering.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the typography migration artifacts for duplicate font definitions, remaining non-Roboto web font references, unnecessary font weights, CSP breakage, and text overflow regressions caused by the slab font.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the single source of truth, font loading method, code-block font behavior, and visual validation scope are explicit.
```

## Source Story

## Description

Migrate the fallback.pics web app to Roboto Slab as the only web font, with optimized loading and a single maintainable font definition.

## User Story

As a maintainer, I want Roboto Slab defined once and used everywhere in the web app so that the site has consistent typography and does not load unnecessary fonts.

## Acceptance Criteria

- Roboto Slab is the only font family used by the web app UI.
- The web app has one shared font source of truth used by global CSS, Tailwind, layouts, and components.
- Existing Inter, Geist Mono, JetBrains Mono, Fira Code, Arial, and generic hardcoded component font stacks are removed from web UI code unless required as browser fallbacks after Roboto Slab.
- The font import requests only the weights used by the site.
- Font loading uses `display=swap`.
- No duplicate Google Fonts imports or local font declarations remain.
- CSP still allows the chosen font-loading strategy.
- Homepage, docs, API, blog, content pages, and 404 remain readable on desktop and mobile.
- Code blocks, URLs, form inputs, buttons, headings, and generated preview text do not overflow their containers after the migration.

## Technical Details

- Likely files:
  - `apps/web/src/layouts/Layout.astro`
  - `apps/web/tailwind.config.mjs`
  - `theme.css`
  - `apps/web/src/styles/modern-ui.css`
  - `apps/web/src/components/CodeBlock.astro`
  - `apps/web/src/components/EnterpriseLanding.tsx`
  - `apps/web/public/_headers`
- Prefer one CSS custom property such as `--font-web` or `--font-sans`, then point Tailwind and global styles to it.
- If using Google Fonts, keep a single preconnect and single stylesheet request for Roboto Slab.
- If self-hosting is chosen later, store only required `.woff2` files and update CSP so `font-src 'self'` is sufficient.
- Because Roboto Slab is wider than Inter, inspect long labels, nav items, buttons, and code snippets for wrapping and overflow.

## Validation

- Run a repo search for `Inter`, `Geist`, `JetBrains`, `Fira Code`, `font-family`, and Google Fonts URLs in `apps/web`.
- Run the web build.
- Run visual checks at desktop and mobile for `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, and `/404`.
- Confirm no browser console errors related to blocked fonts or CSP.
- Confirm no horizontal overflow on mobile.

## Out of Scope

- Worker runtime typography unless explicitly requested.
- Broader visual redesign.
- New copy or SEO content.
- Analytics or route behavior changes.
