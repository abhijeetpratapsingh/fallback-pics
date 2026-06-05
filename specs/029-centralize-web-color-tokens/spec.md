# Feature Specification: Centralize Web Color Tokens

**Feature Branch**: `029-centralize-web-color-tokens`

**Created**: 2026-06-05

**Status**: Ready for implementation

**Input**: User description: "Centralize fallback.pics web color usage into one semantic token system so future theme changes can be made smoothly."

## User Scenarios & Testing

### User Story 1 - Theme Changes From One Place (Priority: P1)

As a maintainer, I want the web app theme colors defined once so that future brand/theme changes do not require hunting through layouts, components, pages, and global CSS.

**Why this priority**: The current color model mixes root tokens, design-system tokens, raw hex values, and Tailwind palette classes, making theme updates risky.

**Independent Test**: Change a semantic token in the canonical CSS source and verify Tailwind-generated UI and global CSS surfaces inherit the change.

**Acceptance Scenarios**:

1. **Given** the canonical color token file, **When** a maintainer updates `--color-brand`, **Then** primary Tailwind utilities and shared CSS brand surfaces resolve from that token.
2. **Given** shared web CSS and layouts, **When** the app builds, **Then** shared colors resolve through semantic token aliases instead of independent hardcoded theme values.

---

### User Story 2 - Tailwind Uses Tokens (Priority: P2)

As a maintainer, I want Tailwind color utilities used by the app to compile to semantic token references so existing components do not drift from the canonical palette.

**Why this priority**: Most React UI colors are expressed as Tailwind classes; replacing all markup is high-risk, but mapping the used palettes to tokens centralizes the implementation model.

**Independent Test**: Inspect the built CSS or Tailwind config and confirm used palette keys map to `var(--color-...)`.

**Acceptance Scenarios**:

1. **Given** classes such as `bg-violet-700`, `text-zinc-950`, or `border-zinc-200`, **When** Tailwind builds, **Then** those classes use semantic CSS variables.
2. **Given** token names such as `brand`, `surface`, `text`, `border`, `success`, `warning`, `danger`, `info`, `code-surface`, and `code-text`, **When** developers add UI, **Then** they can use token-backed Tailwind utilities.

---

### User Story 3 - Visual Preservation (Priority: P3)

As a visitor, I want the site to look the same after the token migration.

**Why this priority**: This story changes implementation, not the brand palette or visual design.

**Independent Test**: Build and inspect representative pages at desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** the homepage, docs, API, features, blog, content pages, and 404, **When** they render, **Then** buttons, links, cards, focus states, code blocks, badges, and forms remain readable and visually close to the prior design.
2. **Given** mobile widths, **When** pages render, **Then** there is no horizontal overflow caused by token migration.

### Edge Cases

- User-configurable generated preview SVG colors remain dynamic and may keep direct hex string handling.
- Transparent overlays, shadows, dotted/radial backgrounds, and pattern effects may keep direct `rgba`, `transparent`, or generated color values when they are not theme roles.
- Meta theme-color values may remain literal because they are document metadata, not reusable UI styling.

## Requirements

### Functional Requirements

- **FR-001**: The web app MUST define canonical semantic color tokens in one shared CSS source.
- **FR-002**: The token system MUST include roles for brand, brand-hover, brand-soft, surface, surface-muted, text, text-muted, text-soft, border, focus, success, warning, danger, info, code-surface, and code-text.
- **FR-003**: Tailwind color utilities used by the web app MUST map to the canonical tokens instead of independent raw hex values.
- **FR-004**: Shared CSS and layout/component CSS SHOULD reference semantic token variables or aliases instead of raw theme hex values where practical.
- **FR-005**: Legacy web color variables MUST become aliases of canonical tokens or be removed if unused.
- **FR-006**: The migration MUST preserve the current light-theme visual appearance as closely as possible.
- **FR-007**: The migration MUST NOT change API behavior, SEO content, layout structure, typography, or Worker runtime image generation.
- **FR-008**: Remaining direct color values MUST be limited to intentional non-theme values, generated/user-configurable preview colors, metadata, shadows, overlays, or one-off visual effects.

## Constitution Alignment

- **Public URLs**: Visual implementation change only for `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, content pages, legal pages, and `/404`. Status, content type, canonical, robots, sitemap, and API behavior are unchanged.
- **Expected HTTP behavior**: No route behavior changes. Validate with web build and browser rendering.
- **Edge delivery impact**: N/A. Worker image API, cache behavior, and storage are unchanged.
- **Documentation/SEO updates**: Spec index updates only. No public SEO copy change.
- **Privacy/security/observability**: No telemetry, secret, CSP, or external dependency changes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Canonical color roles exist in `theme.css`.
- **SC-002**: Tailwind app palettes and semantic colors resolve to CSS variables.
- **SC-003**: `pnpm --filter @fallback-pics/web build` completes successfully.
- **SC-004**: Representative desktop/mobile pages render without console errors or document-level horizontal overflow.

## Assumptions

- This story implements a light-theme token system that can be extended later.
- Tailwind class names can remain when their generated values are token-backed.
- Generated preview SVG defaults and user-configurable colors are intentionally not forced through static theme tokens.
