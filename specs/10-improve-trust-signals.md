# Spec Kit Command Sequence: Improve Trust Signals

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/010-improve-trust-signals
GIT_BRANCH_NAME=010-improve-trust-signals

Create a Spec Kit feature for improving verifiable trust signals across fallback.pics docs, API reference, and product pages.

Problem: fallback.pics should show production trust details without unsupported claims. The site already has a technical foundation around SVG, Cloudflare, caching, and privacy; these must be presented clearly and accurately.

User value: Developers evaluating fallback.pics for production use should understand caching, content types, privacy posture, and failure behavior before adopting it.

Functional requirements:
- Docs or API Reference must clearly document response headers for image routes.
- Product pages must show deterministic cache behavior with accurate examples.
- Privacy copy must explain that image delivery does not require cookies.
- Any uptime, latency, SLA, or enterprise claim must be worded as a posture or option unless supported by evidence.
- API error behavior must be documented.
- Security-relevant headers must be reviewed and documented where relevant.
- Trust copy must link to Docs, API Reference, Status, Privacy, and GitHub.

Out of scope:
- Creating a formal SLA.
- Adding a status page integration.
- Adding enterprise account management.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if a trust claim lacks evidence, if API error behavior is undefined, or if privacy wording materially changes user expectations.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan docs/API reference trust sections, claim-safety review, response header documentation, privacy copy, and validation against live or local API headers.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for trust claim evidence, header documentation, privacy wording, API error behavior, and link coverage.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for updating API reference, docs, product copy, privacy copy, trust links, and header/error behavior validation.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze trust-signal artifacts for unsupported claims, missing privacy/security requirements, conflicting docs, and missing validation tasks.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after all trust claims have evidence or safe wording.
```

## Source Story

## Description

fallback.pics should show verifiable production trust signals without unsupported claims. The site already has a strong technical foundation around SVG, Cloudflare, caching, and privacy. These should be presented clearly in docs, API reference, and product pages.

## User Story

As a developer evaluating fallback.pics for production use, I want clear technical trust details so that I can understand caching, content types, privacy posture, and failure behavior before adopting it.

## Acceptance Criteria

- Docs or API Reference clearly documents response headers for image routes.
- Product pages show deterministic cache behavior with accurate examples.
- Privacy copy explains that image delivery does not require cookies.
- Any uptime, latency, SLA, or enterprise claim is worded as a posture or option unless there is supporting evidence.
- API error behavior is documented.
- Security-relevant headers are reviewed and documented where relevant.
- Trust copy links to Docs, API Reference, Status, Privacy, and GitHub.

## Technical Details

- Update API Reference content in `apps/web/src/pages/api.astro`.
- Update Docs content in `apps/web/src/pages/docs.astro`.
- Review existing copy in `apps/web/src/components/EnterpriseLanding.tsx` for unsupported absolute claims.
- Ensure image API headers shown in docs match Worker responses from `apps/worker/src/index.ts`.
- Consider adding a small "Response behavior" section covering content type, cache control, CORS, and unsupported methods.

## Likely Files

- `apps/web/src/pages/api.astro`
- `apps/web/src/pages/docs.astro`
- `apps/web/src/components/EnterpriseLanding.tsx`
- `apps/web/src/pages/privacy.astro`
- `apps/worker/src/index.ts`

## Validation

- Compare documented headers against `curl -I` output for a valid API image URL.
- Verify trust claims are phrased accurately.
- Verify links to Privacy, Status, Docs, API Reference, and GitHub are present and functional.
- Verify no duplicate or conflicting privacy statements are introduced.

## Out of Scope

- Creating a formal SLA.
- Adding a status page integration.
- Adding enterprise account management.
