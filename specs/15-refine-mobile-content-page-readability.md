# Spec Kit Command Sequence: Refine Mobile Content Page Readability

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/015-mobile-content-page-readability
GIT_BRANCH_NAME=015-mobile-content-page-readability

Create a Spec Kit feature for refining mobile readability on fallback.pics content pages.

Problem: Playwright mobile screenshots at 390x844 show content page headlines using very large display sizing. Pages are readable, but the hero consumes most of the first viewport and delays access to practical examples, navigation, and copyable snippets.

User value: Mobile developers should quickly understand the page topic and reach examples without feeling like the page is dominated by oversized hero typography.

Functional requirements:
- Mobile content page H1 sizing must be reduced or fluidly constrained for long titles.
- Hero spacing must keep the first viewport focused and scannable.
- Example preview cards must remain visible without overwhelming the viewport.
- In-page navigation or key links must be easy to access on mobile.
- Desktop hero typography must remain strong and brand-consistent.
- No text may overlap or clip at 390px width.

Visual review evidence:
- Playwright viewport: 390x844 on `/placeholder-image-generator/`, `/placeholder-image-api/`, and `/docs/`.
- Long H1s wrap into multiple large lines and dominate the first viewport.
- Horizontal overflow was 0.
- Console warnings/errors were 0.

Out of scope:
- Changing keyword targeting or SEO copy.
- Removing examples or FAQ sections.
- Changing API docs content semantics.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the preferred mobile title scale or first-fold content priority is ambiguous.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan mobile typography and spacing refinements for shared content layouts, preserving desktop visual strength while improving mobile scan speed.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a visual-quality checklist for mobile H1 scale, first-fold density, preview card balance, no clipping, and desktop preservation.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing content hero CSS, setting responsive type limits, adjusting mobile spacing, and validating representative content pages.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the mobile readability artifacts for inconsistent typography, missing breakpoints, content-priority conflicts, and insufficient screenshot coverage.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after representative long-title pages and target breakpoints are explicit.
```

## Source Story

## Description

The content page template should feel more practical on mobile. Keep the brand impact, but tighten hero sizing and spacing so users can reach examples and navigation faster.

## User Story

As a mobile developer, I want content pages to be easy to scan so that I can reach the relevant example or documentation section quickly.

## Acceptance Criteria

- At 390x844, long H1s are readable without dominating nearly the entire viewport.
- Intro copy remains legible with comfortable line length and spacing.
- Preview cards do not visually crowd the hero.
- The first practical section or navigation affordance appears sooner on mobile.
- Desktop 1440x1000 screenshots remain visually polished.
- No horizontal overflow or text clipping appears.

## Technical Details

- Likely files:
  - `apps/web/src/pages/[...slug].astro`
  - `apps/web/src/layouts/ContentLayout.astro`
  - `apps/web/src/pages/docs.astro`
  - shared content CSS
- Avoid viewport-width font scaling.
- Prefer responsive `clamp()` with conservative mobile max values, or breakpoint-specific typography tokens.
- Review spacing around `.content-hero`, `.content-preview-card`, and docs hero sections.

## Validation

- Capture mobile and desktop Playwright screenshots for:
  - `/placeholder-image-generator/`
  - `/placeholder-image-api/`
  - `/docs/`
- Confirm no overflow and no console warnings.
- Confirm the first viewport contains page identity plus a practical next action or section cue.

## Out of Scope

- SEO rewrites.
- New documentation sections.
- API behavior changes.
