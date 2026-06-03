# Spec Kit Command Sequence: Publish llms.txt

Run these one at a time, in order.

## 1. `$speckit-specify`

```text
$speckit-specify
SPECIFY_FEATURE_DIRECTORY=specs/004-publish-llms-txt
GIT_BRANCH_NAME=004-publish-llms-txt

Create a Spec Kit feature for publishing a real llms.txt file for fallback.pics.

Problem: /llms.txt currently returns homepage HTML. The site should either publish a real llms.txt or return a clean not-found response. Publishing is preferred because fallback.pics has developer documentation and API surfaces that can be summarized for AI-assisted discovery.

User value: AI search and assistant crawlers should receive concise product, API, docs, and guide context without parsing unrelated homepage HTML.

Functional requirements:
- /llms.txt must return 200 and content-type text/plain; charset=utf-8 if published.
- The file must include a short product summary.
- The file must link to the homepage, docs, API reference, GitHub repository, and primary guides.
- The file must reference placeholder image API, placeholder image generator, dummy image generator, broken image fallback, React image fallback, and Next.js image fallback.
- The file must not include unsupported claims.
- If the file is intentionally not published, /llms.txt must return 404 rather than homepage HTML.

Preferred default: Publish llms.txt as a static text file.

Out of scope:
- Changing Cloudflare managed crawler restrictions.
- Publishing additional AI crawler policy pages.
- Creating new guides only for llms.txt.
```

## 2. `$speckit-clarify`

```text
$speckit-clarify
Clarify only if the spec does not clearly choose whether to publish llms.txt or return 404. Prefer publishing a static text file.
```

## 3. `$speckit-plan`

```text
$speckit-plan
Plan a static llms.txt file, route behavior, content ownership, robots policy compatibility, canonical link choices, and text/plain validation.
```

## 4. `$speckit-checklist`

```text
$speckit-checklist
Generate a requirements-quality checklist for llms.txt scope, link coverage, claim safety, robots consistency, and text/plain serving behavior.
```

## 5. `$speckit-tasks`

```text
$speckit-tasks
Generate tasks for creating llms.txt, verifying content type, validating links, checking robots policy consistency, and preventing homepage HTML fallback.
```

## 6. `$speckit-analyze`

```text
$speckit-analyze
Analyze llms.txt artifacts for unsupported claims, missing link coverage, route fallback conflicts, and unmapped validation tasks.
```

## 7. `$speckit-implement`

```text
$speckit-implement
Implement only after llms.txt publishing behavior and validation checks are complete.
```

## Source Story

## Description

`/llms.txt` currently returns homepage HTML. The site should either publish a real `llms.txt` or return a clean not-found response. Publishing the file is preferred because fallback.pics has developer documentation and API surfaces that can be summarized clearly for AI-assisted discovery.

## User Story

As an AI search or assistant crawler, I want a concise `llms.txt` file so that I can understand fallback.pics, its API, docs, and key implementation guides without parsing unrelated homepage HTML.

## Acceptance Criteria

- `https://fallback.pics/llms.txt` returns `200` and `content-type: text/plain; charset=utf-8` if published.
- The file includes a short product summary.
- The file links to the homepage, docs, API reference, GitHub repository, and primary guides.
- The file references the main target topics: placeholder image API, placeholder image generator, dummy image generator, broken image fallback, React image fallback, and Next.js image fallback.
- The file does not include unsupported claims.
- If the file is intentionally not published, `/llms.txt` returns `404` rather than homepage HTML.

## Technical Details

- Add `apps/web/public/llms.txt` for static publishing.
- Keep content concise and stable.
- Link only to canonical final URLs.
- If Cloudflare Pages routing interferes, update route config so static `llms.txt` is served before fallback routing.
- Make sure `robots.txt` and `llms.txt` policies do not contradict each other.

## Likely Files

- `apps/web/public/llms.txt`
- `apps/web/public/robots.txt`
- `apps/web/public/_routes.json`, if needed

## Validation

- `curl -I https://fallback.pics/llms.txt` returns `200` and `text/plain`.
- `curl -L https://fallback.pics/llms.txt` returns plain text, not HTML.
- All links in `llms.txt` resolve to canonical page URLs.

## Out of Scope

- Changing Cloudflare managed crawler restrictions.
- Publishing additional AI crawler policy pages.
- Creating new guides only for `llms.txt`.
