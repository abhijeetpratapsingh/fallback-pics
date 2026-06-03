# Story 11: Improve GitHub and Link Foundation

## Description

Semrush reports that fallback.pics has a weak backlink profile compared with visible competitors. Repo-level discoverability and developer-facing assets should be improved so legitimate external links point to useful pages and examples.

## User Story

As a developer discovering fallback.pics through GitHub or technical content, I want clear examples, topics, and documentation links so that I can evaluate and reference the project accurately.

## Acceptance Criteria

- README clearly describes fallback.pics as a placeholder image API and fallback image service.
- README includes copy-paste examples for image URLs, HTML, React, and Next.js.
- README links to the homepage, Docs, API Reference, and the main SEO pages.
- README includes suggested GitHub topics for repository metadata.
- Contributing or docs copy encourages accurate references and examples.
- Any "awesome list" or directory submission checklist is documented in the repo without low-quality link tactics.
- External outreach guidance prioritizes developer-relevant sources and excludes spammy SEO domains.

## Technical Details

- Update `README.md` with keyword-aligned but natural positioning.
- Add a small "Reference links" or "Useful links" section with canonical URLs.
- Add a repository metadata checklist in a docs/spec file if GitHub topics cannot be changed from code.
- Include the target topic list:
  - `placeholder-image`
  - `placeholder-image-api`
  - `dummy-image-generator`
  - `cloudflare-workers`
  - `svg-placeholder`
- Keep README examples aligned with Story 02 route strategy.

## Likely Files

- `README.md`
- `CONTRIBUTING.md`
- `DEPLOYMENT.md`
- `specs/link-foundation-checklist.md`, if a separate checklist is useful

## Validation

- README examples return working image responses.
- README links resolve to canonical final URLs.
- Keyword usage reads naturally and does not feel stuffed.
- Link-building guidance does not recommend low-quality directory spam.

## Out of Scope

- Submitting to external directories from this repo.
- Changing GitHub repository settings through automation.
- Creating social launch posts.

