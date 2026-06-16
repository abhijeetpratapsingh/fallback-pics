# Research Summary: Product Expansion Inputs

**Date**: 2026-06-15 | **Source**: Market review conversation

## Market lanes

1. **Deterministic fallback APIs** — placehold.co, ImageNow, fallback.pics
2. **Photo mock APIs** — Lorem Picsum, PicSUM.dev, Mockly stock
3. **Loading primitives** — BlurHash, ThumbHash, LQIP, dominant color

**Our lane**: #1, with optional bridge to #3. Avoid competing in #2.

## Competitor gaps (fallback.pics opportunity)

| Gap | Competitor has it | We have it |
|-----|-------------------|------------|
| Chart / animated / skeleton presets | No | Yes (underexposed) |
| Broken-image narrative | Weak | Strong |
| AVIF / `@2x` URL | placehold.co | Partial / missing |
| Aspect ratio URLs | ImageNow | No |
| Semantic presets (`og`, `product`) | ImageNow keywords | No |
| BlurHash / color JSON | No | No |
| Framework kits (`onError` snippets) | No | No |

## 2025–2026 dynamics

- **CLS / Core Web Vitals**: dimension-correct fallbacks &gt; pretty random photos
- **Cloudflare ecosystem**: Worker image-fallback pattern is documented; we fit natively
- **AI mockups**: different buyer (merchants); not core
- **Framework recipes**: Next.js, React, WooCommerce search demand — productize snippets
- **Privacy**: URL `text=` can leak PII; analytics must exclude it

## Top 5 ROI (prioritized)

1. Expose Chart + Gradient + thumbnail styles in UI
2. Fallback kit export (`onError` + dimensions + aspect-ratio)
3. Semantic size presets (`/product/`, `/og/`, `/hero/`)
4. AVIF + DPR URLs
5. Cloudflare Worker middleware example

## Explicitly deferred

- Unsplash integration (non-deterministic)
- AI product photography
- Image transform CDN features
- WordPress/Shopify plugins until React package proves demand
