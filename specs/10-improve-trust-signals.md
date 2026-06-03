# Story 10: Improve Trust Signals

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

