# Blog writing spec (fallback.pics)

## Output format

Each post is a TypeScript object matching `Omit<BlogPost, 'image' | 'date'>`:

```typescript
{
  title: string;           // 50-70 chars, primary keyword near front
  description: string;     // 140-160 chars, meta description, includes keyword
  slug: string;            // kebab-case, matches filename
  readTime: string;        // e.g. "9 min read" (estimate from word count)
  category: string;        // one of existing categories
  tags: string[];          // 4-6 tags, include primary keyword variant
  summary: string[];       // exactly 2 paragraphs, 2-3 sentences each
  sections: BlogSection[]; // 6-8 sections
  takeaways: string[];   // 5 bullet strings
  related: string[];     // 2-3 slugs from existing or new backlog posts
}
```

### Section structure

Each section needs:
- `eyebrow` (optional): short label, e.g. "Use case", "Syntax", "Safety"
- `title`: H2 heading, include secondary keyword naturally
- `body`: array of 2-3 paragraphs (3-5 sentences each, concrete not fluffy)
- `code` (optional): real fallback.pics URLs or framework snippets
- `cards` (optional): 3 cards max with title + body

## Voice (avoid AI tone)

- Write like a senior frontend engineer publishing internal playbooks
- Short declarative sentences mixed with longer explanatory ones
- No "In today's digital landscape", "delve", "leverage", "robust", "seamless", "game-changer"
- No numbered hype lists in prose; use bullets only in takeaways/cards
- Use specific dimensions, routes, and failure modes (404, CLS, onerror loop)
- Mention tradeoffs honestly (SVG vs raster, skeleton vs static fallback)
- First person plural sparingly ("we recommend"); prefer "you" and imperative

## SEO rules

1. Primary keyword in title, description, first summary paragraph, and one H2
2. Secondary keywords in 2+ section titles and body
3. Meta description 140-160 characters, active voice, no quotes
4. Internal links in final section `code` block as plain URLs to:
   - https://fallback.pics/docs/
   - https://fallback.pics/placeholder-image-api/
   - 1-2 related blog slugs: https://fallback.pics/blog/{slug}/
5. All image examples use `https://fallback.pics/api/v1/...`
6. Include width/height in HTML examples where relevant

## API examples

Base: `https://fallback.pics/api/v1`

Common routes:
- `/{w}x{h}/{bg}/{fg}?text=Label`
- `/avatar/{size}?text=JD`
- `/banner/{w}x{h}?text=Banner`
- `/thumbnail/1200x630?text=Title&style=soft&theme=purple&label=fallback.pics`
- `/animated/skeleton/{w}x{h}`
- `/blur/{w}x{h}`
- `/square/{size}?text=Label`

## Categories

API Guides | Implementation Guides | React Guides | Next.js Guides | Comparisons | Alternatives | Ecommerce | Performance | UX Patterns | Technical | Testing | CMS Workflows | Mobile UX | Trust | SaaS | Web Development

## Also create

For each slug, create `apps/web/src/pages/blog/{slug}.astro`:

```astro
---
import BlogArticle from '../../components/BlogArticle.astro';
import { blogPostsBySlug } from '../../data/blogPosts';

const post = blogPostsBySlug['{slug}'];
---

<BlogArticle post={post} />
```

## File output

Write batch to: `apps/web/src/data/blogContent/backlog-batch-{NN}.ts`

```typescript
import type { BlogPost } from '../blogPosts';

export const backlogBatchNN: Omit<BlogPost, 'image' | 'date'>[] = [
  // posts...
];
```
