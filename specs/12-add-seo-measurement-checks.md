# Spec Kit Command Sequence: Add SEO Measurement Checks

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/012-seo-measurement-checks
GIT_BRANCH_NAME=012-seo-measurement-checks

Create a Spec Kit feature for adding repeatable SEO measurement checks to fallback.pics.

Problem: The SEO audit identified regressions that are easy to reintroduce: soft 404s, bad content types on image URLs, canonical mismatches, and sitemap drift.

User value: Maintainers should have repeatable checks so routing, sitemap, canonical, and image-response behavior stay correct after changes.

Functional requirements:
- A local script or test must check known valid web pages for expected status and content type.
- A local script or test must check known valid API image URLs for image content type and cache headers.
- A local script or test must check unknown web paths for 404.
- A sitemap check must verify URLs resolve directly and do not redirect.
- A canonical check must verify selected pages declare the same final URL they are served from.
- A command must be documented for running the checks.
- The checks must run without requiring paid external services.

Representative routes:
- /
- /placeholder-image-api/
- /dummy-image-generator/
- /broken-image-fallback/
- /api/v1/400x300
- /api/v1/avatar/200
- /not-a-real-seo-test-page

Out of scope:
- Integrating paid Semrush data into CI.
- Running Lighthouse or full browser performance audits.
- Tracking rankings inside the repo.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the base URL, required route list, or pass/fail behavior for local versus production checks is ambiguous.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a local SEO smoke-check command with configurable base URL, route/status/content-type/header checks, sitemap/canonical checks, and documentation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for measurable SEO checks, route coverage, canonical/sitemap coverage, local/prod configurability, and external-service independence.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for the SEO smoke-check script, package command, representative route fixtures, sitemap/canonical parsing, documentation, and validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze SEO measurement artifacts for missing route coverage, vague pass/fail criteria, unmapped documentation tasks, and constitution issues.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after route coverage and pass/fail criteria are explicit.
```

## Source Story

## Description

The audit identified issues that can regress easily: soft 404s, bad content types on image URLs, canonical mismatches, and sitemap drift. Add lightweight local checks so future changes can catch these problems before deployment.

## User Story

As a maintainer, I want repeatable SEO checks so that routing, sitemap, canonical, and image-response behavior stays correct after changes.

## Acceptance Criteria

- A local script or test checks known valid web pages for expected status and content type.
- A local script or test checks known valid API image URLs for image content type and cache headers.
- A local script or test checks unknown web paths for `404`.
- A sitemap check verifies URLs resolve directly and do not redirect.
- A canonical check verifies selected pages declare the same final URL they are served from.
- A command is documented for running the checks.
- The checks can run without requiring paid external services.

## Technical Details

- Prefer a small Node.js script using built-in `fetch` if project runtime supports it.
- Put scripts under a clear location such as `apps/web/scripts/` or `scripts/`.
- Add a package script only if it fits the existing package structure.
- Use a configurable base URL so checks can run against local preview or production.
- Avoid brittle checks for exact page copy; focus on status, content type, redirects, canonical, and headers.
- Include a fixed list of representative routes:
  - `/`
  - `/placeholder-image-api/`
  - `/dummy-image-generator/`
  - `/broken-image-fallback/`
  - `/api/v1/400x300`
  - `/api/v1/avatar/200`
  - `/not-a-real-seo-test-page`

## Likely Files

- `package.json`
- `apps/web/package.json`
- `apps/web/scripts/seo-smoke-check.mjs`
- `apps/web/public/sitemap.xml`
- `README.md`

## Validation

- Running the documented command exits non-zero when a known regression is present.
- Running the documented command exits zero when expected routes and headers are correct.
- The check output identifies the failing route and expected condition.
- The command works against a configurable base URL.

## Out of Scope

- Integrating paid Semrush data into CI.
- Running Lighthouse or full browser performance audits.
- Tracking rankings inside the repo.
