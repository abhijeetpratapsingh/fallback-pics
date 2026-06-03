# Spec Kit Command Sequence: Refresh README Authority Signals

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/025-refresh-readme-authority-signals
GIT_BRANCH_NAME=025-refresh-readme-authority-signals

Create a Spec Kit feature for strengthening fallback.pics GitHub README authority and discoverability signals.

Problem: Semrush still reports 28 backlinks, 21 referring domains, and 0 follow links for fallback.pics. The action plan calls for improving the GitHub README with exact product keyword language and working /api/v1 examples.

User value: Developers landing on GitHub should immediately understand fallback.pics as a placeholder image API, placeholder image generator, dummy image generator, and broken image fallback service.

Functional requirements:
- README intro must clearly describe fallback.pics using the current target terms.
- README examples must use working /api/v1/... image URLs.
- README must link to the homepage, docs, API reference, generator page, and core SEO pages using final URLs.
- README must explain the canonical API route strategy.
- README must avoid outdated root image examples.
- README must avoid unsupported performance, uptime, pricing, or ranking claims.
- Include recommended GitHub repository topics in a maintainer-facing section or checklist if topics cannot be set from the repo.

Recommended keyword language:
- placeholder image API
- placeholder image generator
- dummy image generator
- broken image fallback
- Cloudflare Workers SVG placeholder API

Out of scope:
- Publishing outreach.
- Changing GitHub repository settings through the API.
- Rewriting the whole documentation site.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if README positioning should favor fallback-image language over placeholder-image language. Default to using both, with placeholder-image terms in the lead.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan README updates that improve developer clarity, keyword alignment, working examples, internal links, and maintainer guidance for repository topics.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a checklist for README keyword coverage, working /api/v1 examples, final URL links, claim safety, and repository topic guidance.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for auditing README content, updating intro/examples/links, adding route strategy guidance, documenting suggested topics, and validating example URLs.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze the README authority artifacts for stale route examples, unsupported claims, keyword stuffing, broken links, and missing developer adoption context.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after the README audience and claim boundaries are explicit.
```

## Source Story

## Description

Refresh the GitHub README so it supports developer discovery and authority around the current SEO target terms.

## User Story

As a developer evaluating fallback.pics on GitHub, I want clear positioning and working examples so that I can understand and try the service quickly.

## Acceptance Criteria

- README lead copy includes the current target product terms naturally.
- README examples use `/api/v1/...` URLs.
- README links to key fallback.pics pages using final URLs.
- README documents that `/api/v1/...` is the canonical image route.
- README contains no stale root image examples.
- README avoids unsupported claims.
- Suggested repository topics are documented for maintainers.

## Technical Details

- Treat README as an authority and adoption surface, not only internal setup docs.
- Keep examples copy-pasteable.
- Prefer concise code examples over broad marketing copy.

## Likely Files

- `README.md`
- `docs/`, if the repo has supporting docs
- `apps/web/public/llms.txt`, only if README links need to stay aligned

## Validation

- `rg` confirms README has no stale root image examples.
- `curl -I` confirms README example URLs return image responses.
- Link check confirms key fallback.pics links resolve directly.

## Out of Scope

- External outreach.
- GitHub API topic mutation.
- Website redesign.
