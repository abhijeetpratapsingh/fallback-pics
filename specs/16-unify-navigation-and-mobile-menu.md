# Spec Kit Command Sequence: Unify Navigation and Mobile Menu

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/016-unify-navigation-mobile-menu
GIT_BRANCH_NAME=016-unify-navigation-mobile-menu

Create a Spec Kit feature for unifying fallback.pics navigation and mobile menu behavior.

Problem: Playwright visual review shows the homepage uses a landing navigation model, while content pages use a docs/product navigation model. On mobile, opening the menu pushes content down and duplicates the primary CTA pattern directly above the hero CTA.

User value: Users should have a predictable navigation system across the homepage, generator, docs, and API pages, with a mobile menu that feels intentional rather than like expanded desktop links.

Functional requirements:
- Desktop navigation labels and ordering must be consistent enough that users can move between Homepage, Docs, API, Generator, Features, Blog, GitHub, and primary CTA without context shifts.
- Active states must work consistently on content pages.
- Mobile menu must expose core destinations without duplicating excessive CTA weight.
- Mobile menu open/close affordance must be clear.
- Mobile menu must not create horizontal overflow.
- Header must remain accessible by role/name and keyboard navigation.

Visual review evidence:
- Playwright viewport: 390x844 on `/`.
- Mobile menu rendered `Product`, `API`, `Enterprise`, `Use cases`, `Status`, `Docs`, and `Start using API`, then the hero repeated `Start using API`.
- Desktop homepage navigation differs from content page navigation.

Out of scope:
- Creating new pages.
- Changing brand identity.
- SEO URL/canonical work.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the canonical global navigation labels or mobile menu behavior are ambiguous.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a navigation system refinement using existing header/navigation data, active-state logic, mobile menu layout, and accessibility checks.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for navigation consistency, mobile menu hierarchy, active states, keyboard access, no overflow, and CTA duplication.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing navigation data, aligning desktop nav models, refining mobile menu presentation, and validating routes with Playwright.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze navigation artifacts for inconsistent labels, missing active states, duplicated CTAs, accessibility regressions, and route coverage gaps.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after target desktop and mobile navigation models are explicit.
```

## Source Story

## Description

Navigation should feel like one product system across landing, docs, API, and generator surfaces. The mobile menu should be compact, clearly dismissible, and not compete with the hero CTA.

## User Story

As a visitor moving between product and documentation pages, I want navigation to feel consistent so that I can find the generator, docs, API reference, and GitHub quickly.

## Acceptance Criteria

- Desktop nav labels are consistent or intentionally variant with documented rationale.
- Mobile menu shows core destinations in a compact hierarchy.
- The primary CTA is not duplicated in a visually heavy way when the mobile menu is open.
- Menu button label/state changes clearly between open and closed states.
- Header links are keyboard-accessible.
- No horizontal overflow is present at 390px.

## Technical Details

- Likely files:
  - `apps/web/src/navigation.ts`
  - `apps/web/src/components/SiteHeader.astro`
  - `apps/web/src/components/EnterpriseLanding.tsx`, if landing-specific nav is embedded there
- Prefer a single source of truth for route labels where possible.
- Review active-state logic for trailing slash and section hash routes.
- Validate both closed and open menu states in Playwright.

## Validation

- Capture Playwright screenshots for `/`, `/docs/`, `/api/`, and `/placeholder-image-generator/` at 390x844 and 1440x1000.
- Open mobile menu and confirm no overflow, no clipping, and clear menu state.
- Confirm header has accessible names for brand, menu button, links, and CTA.

## Out of Scope

- SEO/canonical changes.
- New marketing sections.
- Authentication or account navigation.
