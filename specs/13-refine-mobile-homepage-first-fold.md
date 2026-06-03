# Spec Kit Command Sequence: Refine Mobile Homepage First Fold

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/013-refine-mobile-homepage-first-fold
GIT_BRANCH_NAME=013-refine-mobile-homepage-first-fold

Create a Spec Kit feature for refining the fallback.pics mobile homepage first fold.

Problem: Playwright visual review at 390x844 shows the homepage hero CTAs stack cleanly, but the live fallback builder starts mostly below the first viewport. The first fold communicates the promise, but it does not show enough of the core interactive product.

User value: Mobile visitors should understand that fallback.pics is both an API and an interactive placeholder generator without needing to scroll past a long CTA stack.

Functional requirements:
- The mobile homepage first viewport must show the brand, headline, supporting copy, primary CTA, and a clear visible signal of the live builder.
- Secondary CTAs must remain available without consuming excessive vertical space.
- The popular page links must stay visible or discoverable without creating a tall link stack before the builder.
- The first fold must not introduce horizontal overflow at 390px width.
- The desktop hero layout must preserve the current two-column product-builder presentation.
- The live builder must remain usable after the layout changes.

Visual review evidence:
- Playwright viewport: 390x844 on /
- The live builder header starts near the bottom of the first viewport.
- Horizontal overflow was 0.
- Console warnings/errors were 0.

Out of scope:
- Rewriting SEO copy.
- Changing API route behavior.
- Adding new paid/pricing sections.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the preferred mobile first-fold composition is ambiguous: compact CTA row, builder preview teaser, or full builder above the fold.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a mobile-first homepage hero refinement using the existing Astro/React components. Include viewport checks for 390x844, 768x1024, and 1440x1000.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a visual-quality checklist for mobile first fold hierarchy, CTA density, builder visibility, no overflow, and desktop preservation.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for refining mobile hero spacing, CTA grouping, popular link presentation, builder placement, and Playwright screenshot validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the mobile homepage artifacts for visual hierarchy gaps, duplicated CTA behavior, responsive regressions, and missing screenshot validation.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after mobile first-fold acceptance criteria and viewport checks are explicit.
```

## Source Story

## Description

The mobile homepage should reveal the actual product experience sooner. Keep the strong headline, but reduce vertical friction before the live builder so the page feels like a usable developer tool rather than a long landing page.

## User Story

As a mobile visitor, I want to see the promise and the live builder quickly so that I understand what fallback.pics does before scrolling.

## Acceptance Criteria

- At 390x844, the first viewport shows a visible builder preview, builder header, or compact builder affordance.
- Primary CTA remains visually dominant.
- Secondary actions are grouped compactly and do not create a long vertical stack.
- Popular page links do not push the builder out of view.
- At 1440x1000, the current two-column hero and builder layout remains visually balanced.
- No horizontal overflow is present at 390px, 768px, or desktop widths.

## Technical Details

- Likely component: `apps/web/src/components/EnterpriseLanding.tsx`.
- Review hero CTA layout, popular links block, and `Live fallback builder` placement.
- Prefer responsive CSS/layout changes over duplicating markup.
- Consider compact mobile treatments such as a two-column CTA grid, horizontal link chips, or a builder teaser above detailed controls.
- Validate with Playwright screenshots before and after implementation.

## Validation

- Run the web dev server and capture Playwright screenshots for `/` at 390x844 and 1440x1000.
- Confirm first-fold builder visibility at 390x844.
- Confirm `document.documentElement.scrollWidth - innerWidth === 0`.
- Confirm no console warnings/errors.

## Out of Scope

- SEO copy changes.
- Worker/API changes.
- Pricing or monetization changes.
