# Spec Kit Command Sequence: Add Priority SEO Page Recheck Workflow

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/023-add-priority-seo-page-recheck-workflow
GIT_BRANCH_NAME=023-add-priority-seo-page-recheck-workflow

Create a Spec Kit feature for adding a repeatable SEO recheck workflow for priority fallback.pics pages.

Problem: The re-audit identified a fixed set of priority pages that need consistent checks for status, canonical tags, metadata, headings, schema, route examples, and internal links after SEO changes.

User value: Maintainers should be able to verify critical SEO pages with a repeatable process instead of rediscovering checks manually after every change.

Functional requirements:
- Provide a documented command, script, or checklist for priority SEO page checks.
- The workflow must cover homepage, placeholder image API page, placeholder image generator page, dummy image generator page, broken image fallback page, and the three implementation guides.
- For each page, verify HTTP status, canonical URL, title, meta description, H1, indexability, structured data presence, and internal links.
- Check that generated-image examples use /api/v1/... URLs.
- Check that target pages do not emit FAQPage or HowTo JSON-LD unless a future policy explicitly allows it.
- Report failures clearly enough for another agent to act on them.
- The workflow must not require paid external services.

Out of scope:
- Semrush API automation.
- Google Search Console API integration.
- Visual QA screenshots.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only whether the workflow should be a script, markdown checklist, package.json command, or a combination.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a repeatable SEO page recheck workflow covering route matrix, metadata checks, schema checks, canonical checks, API example checks, and failure reporting.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for route coverage, metadata extraction, canonical matching, schema validation, route-example correctness, and actionable failure output.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for adding the page matrix, implementing or documenting checks, validating output, and wiring a local command if appropriate.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the SEO recheck workflow artifacts for missing priority pages, vague pass/fail criteria, dependency on paid services, and overlap with visual QA tooling.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after workflow format and page matrix are explicit.
```

## Source Story

## Description

Add a repeatable SEO page recheck workflow for the priority pages called out in the re-audit action plan.

## User Story

As a maintainer, I want one repeatable SEO recheck workflow so that critical page regressions are caught before release.

## Acceptance Criteria

- The workflow covers:
  - `/`
  - `/placeholder-image-api/`
  - `/placeholder-image-generator/`
  - `/dummy-image-generator/`
  - `/broken-image-fallback/`
  - `/guides/react-image-fallback/`
  - `/guides/nextjs-image-fallback/`
  - `/guides/img-onerror-fallback/`
- The workflow checks status, canonical, title, meta description, H1, indexability, structured data, and internal links.
- The workflow checks `/api/v1/...` example usage.
- The workflow can be run locally against production or a local dev server.
- Failures are easy to map back to a route and field.

## Technical Details

- Prefer a lightweight script if current tooling supports it.
- If a script is not added, document exact commands and expected evidence.
- Do not require Semrush, GSC, or paid services for this local check.

## Likely Files

- `apps/web/scripts/`
- `apps/web/package.json`
- `README.md`
- `specs/`

## Validation

- Run the documented workflow or command.
- Confirm all target pages are included.
- Confirm a failed check produces a clear route and field name.

## Out of Scope

- Ranking checks.
- Backlink checks.
- Visual screenshot review.
