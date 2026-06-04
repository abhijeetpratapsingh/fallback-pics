# Spec Kit Command Sequence: Normalize Internal Link Trailing Slashes

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/024-normalize-internal-link-trailing-slashes
GIT_BRANCH_NAME=024-normalize-internal-link-trailing-slashes

Create a Spec Kit feature for normalizing fallback.pics internal links to final trailing-slash URLs.

Problem: The re-audit found that production redirects non-trailing URLs such as /docs, /api, /features, and /blog to trailing-slash URLs. Internal links should point directly to final URLs when the target is an HTML page.

User value: Users and crawlers should navigate through direct internal links without unnecessary redirect hops.

Functional requirements:
- Navigation, footer, body links, related-page cards, CTA links, and docs links must use final trailing-slash URLs for HTML pages.
- Links to hash fragments must preserve the fragment while using the correct base URL.
- Links to API image routes must keep /api/v1/... and must not receive trailing slashes.
- External links must not be modified.
- Email-obfuscated links and Cloudflare-managed links must not be broken.
- A repeatable check must identify internal HTML links that redirect.

Out of scope:
- Changing route generation behavior.
- Enabling non-trailing canonical URLs.
- Rewriting page copy unrelated to link targets.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the project should change canonical routing away from trailing slashes. Otherwise default to trailing-slash internal links for HTML pages.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan internal link normalization across shared navigation, footer, page data, CTAs, related-page cards, and docs content. Include route-type rules for HTML pages versus API image URLs.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for internal link coverage, route-type safety, hash preservation, external link preservation, and redirect-free validation.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for scanning internal links, updating shared link data, updating page-specific links, preserving API links, and validating no internal HTML links redirect.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the internal link normalization artifacts for broken hash links, accidental API URL rewrites, missed shared navigation links, and canonical conflicts.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after route-type rules for HTML pages, API images, hash links, and external links are explicit.
```

## Source Story

## Description

Update internal HTML links so they point directly at final trailing-slash URLs.

## User Story

As a user or crawler, I want internal links to resolve directly so that navigation is faster and canonical signals are cleaner.

## Acceptance Criteria

- Shared navigation links use final HTML page URLs.
- Footer links use final HTML page URLs.
- Related-page cards use final HTML page URLs.
- CTA links use final HTML page URLs.
- API image URLs remain `/api/v1/...`.
- Hash links still navigate to the intended section.
- A validation check confirms internal HTML links do not redirect.

## Technical Details

- Inspect shared navigation/footer components and page data.
- Normalize only internal HTML page links.
- Avoid adding trailing slashes to asset paths, API image paths, email links, and external URLs.

## Likely Files

- `apps/web/src/components/`
- `apps/web/src/layouts/`
- `apps/web/src/data/`
- `apps/web/src/pages/`
- `apps/web/scripts/`, if adding link validation

## Validation

- Crawl or extract internal links from rendered pages.
- Check internal HTML links return `200` without redirect.
- Manually smoke test navigation and hash links.

## Out of Scope

- Sitemap updates, unless needed for shared URL data.
- Route generation changes.
- External backlink work.
