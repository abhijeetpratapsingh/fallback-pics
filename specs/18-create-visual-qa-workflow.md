# Spec Kit Command Sequence: Create Visual QA Workflow

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/018-create-visual-qa-workflow
GIT_BRANCH_NAME=018-create-visual-qa-workflow

Create a Spec Kit feature for adding a repeatable visual QA workflow for fallback.pics UI changes.

Problem: The visual review found layout issues that are easiest to catch with screenshots: mobile first-fold composition, sidebar/code overlap, mobile menu behavior, and content-page typography. These checks should be repeatable for future UI refinements.

User value: Maintainers should be able to verify visual quality before shipping UI changes without manually rediscovering the same pages and breakpoints.

Functional requirements:
- Provide a documented visual QA command or workflow using Playwright.
- The workflow must cover homepage, placeholder generator page, placeholder API page, docs page, and mobile menu open state.
- The workflow must capture or inspect desktop and mobile viewport states.
- The workflow must check for horizontal overflow.
- The workflow must document expected manual review points for screenshots.
- The workflow must not require paid external services.

Visual review evidence:
- Playwright reviewed `/`, `/placeholder-image-generator/`, `/placeholder-image-api/`, and `/docs/`.
- Viewports used: 1440x1000 and 390x844.
- Console warnings/errors were 0.
- Horizontal overflow was 0 in measured routes, but visual overlap still occurred inside page content.

Out of scope:
- Pixel-perfect baseline approval tooling.
- CI screenshot hosting.
- SEO audit automation.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the workflow should be a documented manual checklist, a script, or both.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a repeatable Playwright visual QA workflow covering target routes, viewports, screenshots, overflow checks, console checks, and review documentation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for route coverage, viewport coverage, screenshot evidence, overflow detection, console health, and manual review criteria.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for adding or documenting the visual QA workflow, route matrix, viewport matrix, screenshot storage guidance, and validation instructions.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the visual QA workflow artifacts for missing route coverage, vague pass/fail criteria, screenshot storage risk, and missing mobile menu validation.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after workflow type, route matrix, and screenshot handling are explicit.
```

## Source Story

## Description

Add a repeatable visual QA workflow so future UI changes can be checked against the same pages and breakpoints used in this review.

## User Story

As a maintainer, I want a repeatable visual QA workflow so that homepage, docs, generator, and mobile-menu layout regressions are caught before release.

## Acceptance Criteria

- A documented command or script covers the route and viewport matrix.
- The workflow includes `/`, `/placeholder-image-generator/`, `/placeholder-image-api/`, `/docs/`, and mobile menu open state.
- The workflow captures or references screenshots for desktop and mobile.
- The workflow checks horizontal overflow and console warnings/errors.
- The workflow documents manual review points: first fold, CTA density, sidebar overlap, code block containment, mobile menu clarity, and builder usability.
- The workflow does not require paid external tools.

## Technical Details

- Likely files:
  - `README.md`
  - `apps/web/package.json`, if adding a command
  - `apps/web/scripts/`, if adding a script
  - `specs/`, if documenting as a review checklist
- If screenshots are generated, document where they should be saved and whether they are committed.
- Prefer deterministic routes and fixed viewport sizes.

## Validation

- Run the documented workflow locally.
- Confirm it produces actionable output or screenshots.
- Confirm it exits or reports clearly when the local dev server is unavailable.

## Out of Scope

- SEO checks.
- Paid visual regression services.
- Full browser matrix testing.
