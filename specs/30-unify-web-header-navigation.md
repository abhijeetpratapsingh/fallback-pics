# Spec Kit Command Sequence: Unify Web Header Navigation

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/030-unify-web-header-navigation
GIT_BRANCH_NAME=030-unify-web-header-navigation

Create a Spec Kit feature for unifying the fallback.pics web header across all pages.

Problem: The web app currently renders one SiteHeader component, but it uses different navigation variants across page types. The homepage uses a landing navigation with Generator first plus GitHub and Status links, while docs and other pages use a different order and include Blog instead. This creates a visibly inconsistent header between pages and makes navigation changes harder to maintain.

User value: Visitors should see one consistent header and navigation model across the site, and maintainers should update header links from one place.

Functional requirements:
- Use one reusable SiteHeader implementation across homepage, docs, API, features, blog, content pages, legal pages, and 404.
- Use one canonical desktop navigation list unless a route-specific item is explicitly justified.
- Use one canonical mobile navigation list derived from the same source as desktop navigation.
- Preserve active-current behavior for internal pages.
- Preserve homepage section linking for the Generator item without changing the header into a separate landing variant.
- Keep GitHub and Status placement consistent across pages.
- Avoid duplicated nav arrays that can drift over time.
- Keep header layout, spacing, active states, focus states, and mobile menu behavior consistent.
- Do not change footer navigation, page content, API behavior, typography, or color tokens as part of this story.

Out of scope:
- Full navigation redesign.
- Adding new pages.
- Changing footer structure.
- Implementing color-token or font migrations, which are covered by other stories.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the canonical header should include Blog, GitHub, and Status simultaneously on desktop. Default to one consistent list across pages with overflow handled responsively rather than different per-page variants.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a unified header navigation model for the Astro web app, covering canonical nav data, homepage Generator anchor behavior, active states, external links, mobile menu parity, and responsive validation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for header consistency, nav ordering, active states, mobile parity, external link behavior, focus states, responsive fit, and single-source navigation data.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing current header variants, choosing the canonical nav list, consolidating nav data, updating SiteHeader props/behavior, updating layouts/pages, and validating desktop/mobile rendering across major routes.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the header unification artifacts for remaining variant drift, duplicated nav definitions, missing active states, broken homepage anchor behavior, mobile menu mismatch, and responsive overflow.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the canonical nav list, external link placement, homepage Generator behavior, and validation routes are explicit.
```

## Source Story

## Description

Unify the fallback.pics header so every page uses the same navigation source, ordering, layout behavior, and active-state rules.

## User Story

As a visitor, I want the header to stay consistent as I move between pages so that I can orient myself and navigate without the menu changing unexpectedly.

As a maintainer, I want header links defined once so that updates do not require variant-specific edits.

## Acceptance Criteria

- Header navigation is visually consistent across homepage, docs, API, features, blog, generated SEO pages, legal pages, and 404.
- Desktop and mobile menus are generated from the same canonical navigation data.
- There is no separate landing/header nav list that can drift from the main nav.
- Internal links use final trailing-slash URLs where applicable.
- Active nav item behavior works for `/docs/`, `/api/`, `/features/`, `/blog/`, generator page, and content pages with mapped active sections.
- The Generator link works correctly from the homepage and from non-homepage routes.
- GitHub and Status links are consistently present or consistently moved to a documented secondary action area.
- Header fits without overflow at desktop widths and collapses cleanly on mobile.
- Keyboard focus, Escape close behavior, and ARIA menu state remain correct.

## Technical Details

- Likely files:
  - `apps/web/src/navigation.ts`
  - `apps/web/src/components/SiteHeader.astro`
  - `apps/web/src/layouts/Layout.astro`
  - `apps/web/src/layouts/DocsLayout.astro`
  - `apps/web/src/layouts/ContentLayout.astro`
  - `apps/web/src/pages/index.astro`
  - `apps/web/src/pages/[...slug].astro`
- Current issue:
  - `primaryNav` and `landingNav` have different ordering and different items.
  - `Layout.astro` passes a `header` variant into `SiteHeader`, which changes the nav list.
  - Docs pages use `header="docs"` even though `SiteHeader` only changes nav data for `landing` vs non-landing.
- Prefer one canonical `siteNav` array and optional metadata for active matching, external link behavior, and homepage anchor behavior.
- If Generator should point to `#hero-demo` on the homepage and `/placeholder-image-generator/` elsewhere, implement that as link resolution logic rather than a separate nav list.

## Validation

- Inspect header on `/`, `/docs/`, `/api/`, `/features/`, `/blog/`, `/placeholder-image-generator/`, one SEO content page, `/privacy/`, and `/404`.
- Verify desktop nav item order is identical across pages.
- Verify mobile nav item order is identical across pages.
- Verify active states on major internal routes.
- Verify external links open with `target="_blank"` and `rel="noopener noreferrer"`.
- Verify the mobile menu opens, closes, closes on link click, and closes on Escape.
- Confirm no horizontal overflow at mobile and tablet widths.

## Out of Scope

- Footer navigation changes.
- Color token migration.
- Font migration.
- Page content or route changes.
