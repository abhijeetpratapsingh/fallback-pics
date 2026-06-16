# Epics: Product Expansion Roadmap

Quick reference for acceptance criteria per epic. Full context in [plan.md](./plan.md).

---

## Phase A

### A1 — Expose hidden generator presets (→ spec 032)

**Problem**: Chart, the existing Gradient route, and thumbnail styles exist in the API surface but are not fully exposed in UI/docs.

**Scope**:
- `LiveDemoEnhanced.tsx`, `EnterpriseLanding.tsx`
- API docs

**Acceptance**:
- [ ] Chart: 8 types selectable; preview loads `/api/v1/chart/{type}/{w}x{h}`
- [ ] Gradient: preview loads `/api/v1/gradient/{w}x{h}`
- [ ] Thumbnail: 4 styles + 5 themes in both generators
- [ ] Random documented as pattern stub, not Unsplash

**Out of scope**: New chart types, new thumbnail art

---

### A2 — Format & DPR parity (→ spec 033)

**Problem**: placehold.co supports AVIF and `@2x`; we reject AVIF and only support DPR through the `?retina=` query path today. GIF should remain an explicit rejection unless demand justifies static GIF output.

**Scope**:
- `router.ts`, `raster.ts`
- Docs/tests for existing color-name and transparent-background behavior
- Generator format picker

**Acceptance**:
- [ ] `400x300.avif` returns valid AVIF
- [ ] `400x300@2x` doubles pixel dimensions (or documented logical vs physical behavior)
- [ ] `bg=transparent` renders correctly in SVG and raster and has regression coverage
- [ ] CSS color names already supported by `normalizeColor` are documented and covered by regression tests
- [ ] 400 on unsupported format includes actionable message

**Out of scope**: GIF output, animated GIF

---

### A3 — Semantic size presets (→ spec 034)

**Problem**: Developers think in `og`, `product`, `hero` — not raw pixels.

**Scope**:
- Worker routing for keyword presets
- Generator chips + 3 SEO pages

**Acceptance**:
- [ ] `/api/v1/preset/og` (or `/api/v1/og`) → 1200×630
- [ ] `/api/v1/preset/product` → 800×800
- [ ] `/api/v1/preset/hero` → 1920×1080
- [ ] `/api/v1/preset/email` → 600×400 (jpeg-friendly defaults)
- [ ] `/api/v1/preset/story` → 1080×1920
- [ ] `/api/v1/preset/ad/300x250` → IAB size
- [ ] `text`, `bg`, `fg` query params still work

**Out of scope**: Full IAB catalog (add incrementally)

---

### A4 — Fallback kit export (→ spec 035)

**Problem**: Raw URL copy is not enough; devs need production-ready snippets.

**Scope**:
- Shared snippet builder util
- Generator UI tabs

**Acceptance**:
- [ ] HTML tab: `width`, `height`, `aspect-ratio`, `loading`, `onerror` fallback
- [ ] React tab: component with `onError` state swap
- [ ] Next.js tab: `<Image unoptimized />` or documented pattern
- [ ] CSS tab: `background-image` + `aspect-ratio`
- [ ] curl tab: `curl -I` with current URL
- [ ] Snippets update live when preset/dimensions change

**Out of scope**: Vue/Svelte tabs (add if requested)

---

## Phase B

### B1 — Aspect-ratio URLs (→ spec 036)

**Acceptance**:
- [ ] `800x16:9` → 800×450
- [ ] `4:3x600` → 800×600
- [ ] Invalid ratios return 400
- [ ] Documented in API reference with 3 examples

---

### B2 — Error-state presets (→ spec 037)

**Acceptance**:
- [ ] 5 states with distinct visuals and default labels
- [ ] Deterministic: same URL → same SVG
- [ ] Generator can select state; maps to route or `?state=`
- [ ] Linked from `/broken-image-fallback/` page

---

### B3 — Worker fallback middleware (→ spec 038)

**Acceptance**:
- [ ] `examples/worker-image-fallback` runs with `wrangler dev`
- [ ] 404 upstream → 200 fallback image from fallback.pics
- [ ] Dimensions extracted from request path or query
- [ ] Docs page with architecture diagram

---

### B4 — React fallback component (→ spec 039)

**Acceptance**:
- [ ] `<FallbackImage src={url} width={} height={} preset="product" />`
- [ ] Falls back on error without infinite loop
- [ ] TypeScript types exported
- [ ] README with Next.js example

---

### B5 — A11y generator warnings (→ spec 040)

**Acceptance**:
- [ ] Contrast ratio shown when colors editable
- [ ] Warning if below WCAG AA 4.5:1 (normal text)
- [ ] Animated preset respects `prefers-reduced-motion` request header or query `reducedMotion=1`

---

## Phase C

### C1 — Dominant color API (→ spec 041)

**Acceptance**:
- [ ] JSON `{ hex, rgb }` for `/api/v1/color/7C3AED`
- [ ] Swatch JSON from `?seed=` is deterministic
- [ ] Cache headers: immutable where deterministic

---

### C2 — BlurHash endpoint (→ spec 042)

**Acceptance**:
- [ ] JSON `{ blurhash, width, height }` from dimension + color route
- [ ] No remote image fetch in v1
- [ ] Decode example in docs (client-side)

---

### C3 — LQIP preset (→ spec 043)

**Acceptance**:
- [ ] Tiny WebP/JPEG output (&lt;2KB typical)
- [ ] Visually blurred; dimensions in response headers
- [ ] Documented src + lqip pairing pattern

---

### C4 — Brand kits Pro (→ spec 044)

**Acceptance**:
- [ ] `/api/v1/brand/{slug}/avatar/128` uses brand palette
- [ ] Unknown slug → 404
- [ ] Config documented for self-hosted enterprise

---

### C5 — Pro analytics & custom domain (→ spec 045)

**Acceptance**:
- [ ] Analytics schema published; no `text` field
- [ ] Custom domain guide complete
- [ ] Rate limit behavior documented for free vs pro
