# Tasks: Product Expansion Roadmap

**Input**: `specs/031-product-expansion-roadmap/plan.md`

**Horizon**: 90 days | **Execution model**: One Spec Kit feature branch per epic (032–045)

## Phase A — Parity & Expose (Weeks 1–4)

### Sprint A1 (Week 1–2): Expose & document

- [ ] T001 Create spec `032-expose-hidden-generator-presets` from epic A1
- [ ] T002 Add Chart preset UI: type picker (bar, pie, line, area, donut, scatter, radar, heatmap) in `LiveDemoEnhanced.tsx`
- [ ] T003 Add Chart preset UI to `EnterpriseLanding.tsx` customize panel
- [ ] T004 Add Gradient preset to both generators
- [ ] T005 Add Thumbnail style picker (soft, rings, lines, pattern) to `EnterpriseLanding.tsx` (parity with `LiveDemoEnhanced.tsx`)
- [ ] T006 Document `random` route as pattern placeholder (not photos) in API reference; hide or label honestly in UI
- [ ] T007 UI URL-builder tests for chart + gradient generator routes
- [ ] T008 Visual QA: all exposed preset types render correct preview shape (square ≠ circle regression)

### Sprint A2 (Week 2–3): Format parity

- [ ] T010 Create spec `033-format-and-dpr-parity` from epic A2
- [ ] T011 Enable AVIF in `apps/worker/src/raster.ts` and `router.ts` validation
- [ ] T012 Keep GIF explicitly rejected with helpful 400 copy; defer static GIF unless demand is proven
- [ ] T013 Parse `@2x` / `@3x` suffix in dimension segments (`400x300@2x`)
- [ ] T014 Map path DPR to existing retina scaling in generator
- [ ] T015 Add/verify docs and regression tests for existing `bg=transparent` and CSS color name support
- [ ] T016 Add format selector to generators (svg, png, webp, jpeg; avif only after Worker support lands)
- [ ] T017 Vitest + curl contract tests for AVIF, unsupported GIF, DPR, transparent, and color-name behavior
- [ ] T018 Update `apps/web` API docs and llms.txt

### Sprint A3 (Week 3–4): Semantic presets & fallback kit

- [ ] T020 Create spec `034-semantic-size-presets` from epic A3
- [ ] T021 Implement keyword routes: `og`, `product`, `hero`, `email`, `story`, `ad/{size}`
- [ ] T022 Add quick-pick chips in both generators
- [ ] T023 Add SEO landing entries in `seoPages.ts` for `og`, `product`, `hero` (minimum)
- [ ] T024 Create spec `035-fallback-kit-export` from epic A4
- [ ] T025 Build `FallbackKit` snippet generator (HTML, React, Next, CSS, curl)
- [ ] T026 Include `onerror` handler, `width`/`height`, `aspect-ratio`, `alt` in HTML export
- [ ] T027 Wire kit tabs into `LiveDemoEnhanced` and `EnterpriseLanding`
- [ ] T028 Phase A validation: full build, worker tests, generator Playwright smoke

---

## Phase B — Production Fallback Niche (Weeks 5–8)

### Sprint B1 (Week 5–6): URL power & error states

- [ ] T030 Create spec `036-aspect-ratio-urls` from epic B1
- [ ] T031 Parse `WxH:W` and `W:HxH` ratio syntax in `router.ts`
- [ ] T032 Ratio resolution tests + max dimension guards
- [ ] T033 Create spec `037-error-state-presets` from epic B2
- [ ] T034 Implement state presets: unavailable, processing, restricted, deleted, offline
- [ ] T035 Add `?state=` query support on standard routes (optional shortcut)
- [ ] T036 Generator UI: "Error state" sub-menu or dedicated chips
- [ ] T037 SEO page: `/broken-image-fallback/` links to state examples

### Sprint B2 (Week 6–7): Integration

- [ ] T040 Create spec `038-worker-fallback-middleware` from epic B3
- [ ] T041 Add `examples/worker-image-fallback/` with wrangler.toml
- [ ] T042 Implement fetch → fallback proxy handler with dimension passthrough
- [ ] T043 Docs page: Cloudflare Worker image fallback guide
- [ ] T044 Create spec `039-react-fallback-component` from epic B4
- [ ] T045 Scaffold `packages/fallback-react` with `<FallbackImage />` and `useImageFallback`
- [ ] T046 Next.js App Router example in `apps/web` guides or examples folder
- [ ] T047 Publish package to npm or document monorepo install path

### Sprint B3 (Week 7–8): A11y polish

- [ ] T050 Create spec `040-a11y-generator-warnings` from epic B5
- [ ] T051 Contrast ratio calculator in generator (WCAG AA warning badge)
- [ ] T052 Honor `prefers-reduced-motion` for animated preset responses (Worker `reducedMotion` param exists — wire UI)
- [ ] T053 Phase B validation: middleware example deploy test, React component unit tests

---

## Phase C — Modern Loading & Monetization (Weeks 9–12)

### Sprint C1 (Week 9–10): Color primitives

- [ ] T060 Create spec `041-dominant-color-api` from epic C1
- [ ] T061 `GET /api/v1/color/{hex}` — JSON and 1×1 PNG variants
- [ ] T062 `GET /api/v1/swatches?seed=` — deterministic palette JSON
- [ ] T063 Docs: CLS container pattern with dominant color
- [ ] T064 Create spec `043-lqip-preset` from epic C3 (can parallel after T061)
- [ ] T065 LQIP route: tiny blurred raster, WebP default
- [ ] T066 HTML pairing example in docs

### Sprint C2 (Week 10–11): Hash endpoint

- [ ] T070 Create spec `042-blurhash-endpoint` from epic C2
- [ ] T071 Research Worker-compatible blurhash encode (bundle size budget)
- [ ] T072 `GET /api/v1/blurhash/...` returns JSON `{ hash, width, height }`
- [ ] T073 Client decode snippet in docs (no server-side decode required v1)

### Sprint C3 (Week 11–12): Pro foundations

- [ ] T080 Create spec `044-brand-kits-pro` from epic C4
- [ ] T081 Brand slug routing `/api/v1/brand/{slug}/...` with KV or config map
- [ ] T082 Create spec `045-pro-analytics-custom-domain` from epic C5
- [ ] T083 Analytics event schema: preset, w, h, format — exclude text params
- [ ] T084 Custom domain setup guide (Cloudflare for SaaS)
- [ ] T085 Pro pricing page copy aligned with roadmap (no watermark, custom domain, analytics)
- [ ] T086 Phase C validation: privacy review of analytics, load test JSON routes

---

## Cross-Cutting (All Phases)

- [ ] T900 Update `AGENTS.md` / agent context with new preset catalog after each phase
- [ ] T901 Blog posts: one per epic shipped (SEO flywheel)
- [ ] T902 Telemetry: `preset`, `format`, `route` dimensions — never log `text`
- [ ] T903 Changelog or releases.md entry per phase

---

## Dependencies & Execution Order

```
032 (expose UI) ──┬──► 035 (fallback kit)
033 (formats)  ───┘
034 (semantic) ──────► 037 (error states)
035 ─────────────────► 039 (React package)
038 (middleware) ────► 039
033 ─────────────────► 043 (LQIP)
041 (color) ─────────► 044 (brand kits)
```

**Parallel safe**:
- 032 + 033 (different files: web vs worker)
- 034 + 035 (after 032 URL builder stable)
- 041 + 042 (independent JSON endpoints)

---

## First Sprint Recommendation (Start Here)

| Order | Spec | Why first |
|-------|------|-----------|
| 1 | 032 | Zero API risk; immediate UI value |
| 2 | 035 | Highest developer adoption lever |
| 3 | 034 | SEO + semantic URLs |
| 4 | 033 | Competitive parity; unblocks email/modern stacks |

**Estimated effort**: 2–3 weeks for all four with one developer.

---

## Definition of Done (Program)

- [ ] All Phase A exit criteria in plan.md met
- [ ] At least 3 Phase B epics shipped
- [ ] At least 2 Phase C epics shipped OR Pro spec approved for post-90-day
- [ ] No public URL truth regressions (SEO smoke passes)
- [ ] Worker test suite green; p95 latency within 10% of baseline
