# Spec Kit Command Sequence: Centralize Web Color Tokens

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/029-centralize-web-color-tokens
GIT_BRANCH_NAME=029-centralize-web-color-tokens

Create a Spec Kit feature for centralizing fallback.pics web app color usage into one semantic token system.

Problem: The web app currently defines color values in multiple places and also references colors directly through Tailwind utility palette names, inline CSS hex values, CSS variables, and generated SVG strings. This makes future theme updates slow and risky because a brand or theme color change requires edits across many files.

User value: Maintainers should be able to update the web app theme from one canonical color definition without hunting through components, pages, layouts, and styles.

Functional requirements:
- Define the web app color palette once using semantic tokens.
- Use semantic token names for brand, brand-hover, brand-soft, surface, surface-muted, text, text-muted, text-soft, border, focus, success, warning, danger, info, code-surface, and code-text.
- Configure Tailwind to consume the same semantic color tokens instead of raw violet/zinc/emerald/blue/orange/red palette references.
- Replace direct web UI color references with semantic token usage where practical.
- Remove duplicated or conflicting color definitions from legacy theme files if they are no longer used by the web app.
- Keep color usage compatible with Astro component styles, React class names, global CSS, and existing CSP.
- Preserve current visual appearance as much as possible while changing the implementation model.
- Keep generated preview SVG colors configurable, but avoid hardcoded brand/theme colors in web UI SVG strings unless they reference the shared tokens.
- Do not change API behavior, SEO content, layout structure, or typography.

Out of scope:
- Full visual redesign.
- Dark mode implementation unless already required by existing tokens.
- Brand palette changes beyond mapping current colors into semantic tokens.
- Worker runtime image generation palette changes unless a web UI component embeds those values.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if semantic tokens should support dark mode in this story. Default to a light-theme token system that can be extended later, preserving current visuals.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a centralized semantic color token migration for the Astro web app, covering CSS custom properties, Tailwind theme mapping, component/page replacements, legacy token cleanup, and visual regression checks.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for single-source color definitions, semantic token coverage, removal of hardcoded web colors, Tailwind token usage, visual preservation, contrast, focus states, and future theme-change readiness.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing current color references, defining canonical semantic tokens, mapping Tailwind colors to CSS variables, replacing hardcoded component/page colors, removing duplicate legacy tokens, and validating visual consistency.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the color-token migration artifacts for remaining direct color references, duplicated palette definitions, token naming gaps, contrast regressions, broken Tailwind classes, and incomplete future theme-change readiness.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after canonical token names, Tailwind mapping strategy, legacy theme cleanup scope, and validation pages are explicit.
```

## Source Story

## Description

Centralize fallback.pics web color usage into one semantic token system so future theme changes can be made smoothly.

## User Story

As a maintainer, I want colors defined once and referenced consistently throughout the web app so that changing the theme in the future does not require manual edits across many files.

## Acceptance Criteria

- There is one canonical web color token definition.
- Tailwind colors are mapped to the canonical tokens rather than independent raw hex values.
- Components, layouts, pages, and global styles use semantic token references instead of raw hex values wherever practical.
- Existing direct uses of `violet`, `purple`, `zinc`, `gray`, `emerald`, `blue`, `orange`, `red`, and hardcoded hex colors are reviewed and migrated when they represent theme colors.
- Remaining direct colors, if any, are documented as intentional non-theme values such as transparent overlays, chart-specific colors, or user-configurable generated preview values.
- Current visual appearance is preserved closely after migration.
- Focus states, buttons, cards, borders, code blocks, badges, alerts, and links are covered by semantic tokens.
- Future brand/theme change can be made primarily by editing the canonical token values.

## Technical Details

- Likely files:
  - `apps/web/src/styles/modern-ui.css`
  - `apps/web/tailwind.config.mjs`
  - `theme.css`
  - `apps/web/src/layouts/Layout.astro`
  - `apps/web/src/layouts/ContentLayout.astro`
  - `apps/web/src/layouts/DocsLayout.astro`
  - `apps/web/src/components/SiteHeader.astro`
  - `apps/web/src/components/SiteFooter.astro`
  - `apps/web/src/components/CodeBlock.astro`
  - `apps/web/src/components/BlogArticle.astro`
  - `apps/web/src/components/EnterpriseLanding.tsx`
  - `apps/web/src/components/LiveDemoEnhanced.tsx`
  - `apps/web/src/pages/*.astro`
- Prefer CSS custom properties as the canonical source, with Tailwind colors reading from those variables.
- Prefer semantic names such as `brand`, `brand-hover`, `surface`, `surface-muted`, `text`, `text-muted`, `border`, `success`, `warning`, `danger`, and `code`.
- Avoid component-specific token names unless they represent reusable roles.
- Preserve accessible contrast for text, focus rings, and controls.

## Validation

- Run a repo search for raw hex colors and direct Tailwind palette classes in `apps/web`.
- Run the web build.
- Visually inspect `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, key content pages, and `/404`.
- Confirm primary/secondary buttons, navigation, footer, code blocks, badges, cards, tables, forms, and focus states still render correctly.
- Confirm no horizontal overflow or unreadable text introduced by token changes.

## Out of Scope

- Full dark mode rollout.
- New design direction or color palette selection.
- API route changes.
- Worker image-generation color behavior unless directly embedded in web UI.
- Typography migration, which is covered by story 28.
