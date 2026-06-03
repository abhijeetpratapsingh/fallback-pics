# Story 04: Publish llms.txt

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

