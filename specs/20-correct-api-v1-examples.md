# Spec Kit Command Sequence: Correct API v1 Examples

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/020-correct-api-v1-examples
GIT_BRANCH_NAME=020-correct-api-v1-examples

Create a Spec Kit feature for making all fallback.pics public examples use the canonical /api/v1 image route.

Problem: The SEO re-audit confirmed that root image routes such as /400x300 now correctly return 404, while /api/v1/400x300 returns image/svg+xml. The homepage still contains at least one root-style API example: GET /800x450/18181B/FFFFFF?text=Product+Image.

User value: Developers should be able to copy every visible fallback.pics example and receive a working image response without guessing which route prefix is supported.

Functional requirements:
- All visible code examples for generated images must use /api/v1/... URLs.
- Homepage examples must not show root image paths such as GET /800x450/....
- Docs, API reference, README, llms.txt, SEO landing pages, and guides must be scanned for root image examples.
- Rendered image src attributes for generated fallback images must use /api/v1/... unless they are data URLs intentionally used for static UI illustration.
- The project must not reintroduce root image URLs as the recommended public API route.
- Copy buttons and generated snippets must output working /api/v1/... examples.

Out of scope:
- Enabling root image routes.
- Changing image generator behavior.
- Rewriting unrelated marketing copy.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if there is a product decision to support root image routes again. Otherwise default to /api/v1 as the only documented public image route.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a content and component scan for root-style image route examples, then update all examples to /api/v1 while preserving current page layout and copy-button behavior.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for example correctness, copy-button output, rendered image src behavior, README/docs consistency, llms.txt consistency, and regression checks against root image examples.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for finding root image examples, updating content/component data, testing copy snippets, validating live image responses, and adding a repeatable grep or unit check.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the API example cleanup artifacts for missed root-route examples, accidental changes to valid data URLs, stale README guidance, and broken copy-button outputs.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the canonical public image route is confirmed as /api/v1.
```

## Source Story

## Description

Correct every developer-facing image URL example so it uses the supported `/api/v1/...` route.

## User Story

As a developer, I want every example URL to work when copied so that I can adopt fallback.pics without route confusion.

## Acceptance Criteria

- No homepage code block recommends `GET /800x450/...` without `/api/v1`.
- No docs, guide, landing page, README, or `llms.txt` example recommends a root image path as the public API.
- Copy buttons output `/api/v1/...` image URLs.
- Rendered example images load successfully.
- `/api/v1/400x300` returns `200` and `content-type: image/svg+xml`.
- `/400x300` may continue to return `404` without conflicting with docs.

## Technical Details

- Search for examples matching root image route patterns:
  - `GET /[0-9]+x`
  - `https://fallback.pics/[0-9]+x`
  - `/avatar/`, `/banner/`, `/square/`, `/blur/`, `/skeleton/` when not under `/api/v1/`
- Update source data and rendered snippets, not only static markdown.
- Avoid changing data URLs used as inline decorative examples unless they claim to be public API paths.

## Likely Files

- `apps/web/src/`
- `apps/web/public/llms.txt`
- `README.md`
- `ACTION-PLAN.md`, only if the plan itself is being kept current

## Validation

- Run `rg` for root image route examples and confirm only intentional non-public examples remain.
- `curl -I https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Product+Image` returns an image response.
- Browser review confirms homepage and docs snippets still fit visually.

## Out of Scope

- Root route support.
- New image presets.
- SEO keyword rewrites unrelated to route correctness.
