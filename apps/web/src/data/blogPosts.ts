export type BlogCard = {
  title: string;
  body: string;
};

export type BlogSection = {
  eyebrow?: string;
  title: string;
  body: string[];
  code?: string;
  cards?: BlogCard[];
};

export type BlogPost = {
  title: string;
  description: string;
  slug: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  summary: string[];
  sections: BlogSection[];
  takeaways: string[];
  related: string[];
};

export const blogPosts: BlogPost[] = [
  {
    title: 'Placeholder Image API: Complete URL Syntax Guide for Developers',
    description:
      'A practical URL syntax guide for using fallback.pics as a placeholder image API, with examples for dimensions, colors, text, avatars, and skeleton states.',
    slug: 'placeholder-image-api-url-syntax-guide',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Placeholder+Image+API',
    date: '2026-06-05',
    readTime: '10 min read',
    category: 'API Guides',
    tags: ['Placeholder image API', 'URL syntax', 'Developer tools', 'Fallback images'],
    summary: [
      'Placeholder image APIs give developers a fast way to reserve image space, test layouts, and handle missing media without sourcing final assets first.',
      'fallback.pics uses a simple /api/v1 route so you can generate deterministic SVG placeholders, avatars, banners, and skeleton states from copy-paste URLs.',
    ],
    sections: [
      {
        eyebrow: 'Foundation',
        title: 'What is a placeholder image API?',
        body: [
          'A placeholder image API generates images on demand from URL parameters. Developers use these URLs in product cards, avatar slots, docs, mockups, test fixtures, CMS previews, and fallback states where the final image is missing or not ready yet.',
          'The important difference for production work is predictability. A stable URL can reserve the right layout space, keep visual states consistent, and avoid showing the browser broken-image icon when upstream media fails.',
        ],
      },
      {
        eyebrow: 'Why fallback.pics',
        title: 'Why use fallback.pics?',
        body: [
          'fallback.pics is built for developers who need more than a temporary mockup image. It provides readable URLs for dimensions, colors, text labels, avatars, and skeleton states while keeping the output deterministic and easy to cache.',
          'Alternatives like placehold.co, dummyimage.com, and placeholderimage.dev are useful in the broader placeholder category. fallback.pics is positioned around production fallback states: missing product photos, empty avatar slots, documentation examples, and UI surfaces that should never collapse when media is unavailable.',
        ],
        cards: [
          { title: 'Simple URL API', body: 'Use one image URL anywhere an img src, CSS background, Markdown image, or CMS media URL is accepted.' },
          { title: 'Production states', body: 'Use placeholders for mockups and fallback images for real missing or failed media.' },
          { title: 'Deterministic output', body: 'Stable URLs are easier to cache, test, log, and reuse across repeated UI surfaces.' },
        ],
      },
      {
        eyebrow: 'Syntax',
        title: 'Basic URL syntax',
        body: [
          'The canonical fallback.pics image route starts with /api/v1. The most common format is a single dimensions segment using width x height.',
          'Use this pattern when you need a fixed-size placeholder for a card, banner, preview, or product image slot.',
        ],
        code: `https://fallback.pics/api/v1/300x200

<img
  src="https://fallback.pics/api/v1/300x200"
  width="300"
  height="200"
  alt="Placeholder image"
/>`,
      },
      {
        eyebrow: 'Dimensions',
        title: 'Set dimensions',
        body: [
          'Dimensions are specified directly in the URL as width x height. Match these values to the final image surface so your layout remains stable before the real image is available.',
          'For responsive layouts, combine a correctly dimensioned placeholder URL with CSS aspect-ratio or explicit width and height attributes.',
        ],
        code: `https://fallback.pics/api/v1/600x400
https://fallback.pics/api/v1/1200x400
https://fallback.pics/api/v1/1920x1080`,
      },
      {
        eyebrow: 'Colors',
        title: 'Set background and text colors',
        body: [
          'You can add background and text colors after the dimensions. Use hex values without the # character so the URL stays clean and copy-paste friendly.',
          'This is useful when placeholders need to match a brand palette, dark UI, documentation theme, or product-card style.',
        ],
        code: `https://fallback.pics/api/v1/600x400/18181B/FFFFFF
https://fallback.pics/api/v1/600x400/7C3AED/FFFFFF
https://fallback.pics/api/v1/600x400/F3F4F6/18181B`,
      },
      {
        eyebrow: 'Text',
        title: 'Add custom text',
        body: [
          'Add readable text with the text query parameter. Keep labels generic and safe because URLs can appear in logs, analytics tools, browser history, and support screenshots.',
          'Good placeholder labels describe the media state without exposing private data.',
        ],
        code: `https://fallback.pics/api/v1/600x400?text=Product+Image
https://fallback.pics/api/v1/1200x400/18181B/FFFFFF?text=Hero+Banner
https://fallback.pics/api/v1/400x300?text=Image+Unavailable`,
      },
      {
        eyebrow: 'Avatars',
        title: 'Generate avatar placeholders',
        body: [
          'Avatar placeholders are useful for profiles, comments, team lists, account menus, and dashboards where a user has not uploaded a photo.',
          'Use initials or short labels instead of full names when you want a safer fallback that still communicates the user slot.',
        ],
        code: `https://fallback.pics/api/v1/avatar/50?text=JD
https://fallback.pics/api/v1/avatar/96?text=AP

<img
  src="https://fallback.pics/api/v1/avatar/96?text=JD"
  width="96"
  height="96"
  alt="User avatar placeholder"
/>`,
      },
      {
        eyebrow: 'Loading states',
        title: 'Generate skeleton placeholders',
        body: [
          'Skeleton placeholders are better for temporary loading states, while static fallback images are better when media is missing or has failed permanently.',
          'Use skeleton URLs for loading cards, previews, and image frames where you want the interface to communicate that content is still on the way.',
        ],
        code: `https://fallback.pics/api/v1/animated/skeleton/600x400
https://fallback.pics/api/v1/animated/skeleton/1200x400`,
      },
      {
        eyebrow: 'Safety',
        title: 'Use production-safe URL values',
        body: [
          'Do not place secrets, tokens, email addresses, order IDs, regulated data, or customer-specific private values in placeholder URL text. Treat URL text as public metadata.',
          'For repeated UI states, prefer stable labels like Product Image, Image Unavailable, User, Preview, or Report Thumbnail.',
        ],
      },
      {
        eyebrow: 'Reference',
        title: 'Where to go next',
        body: [
          'Use this syntax guide as a quick reference, then move to the main API and docs pages when you need implementation details for production components.',
          'Start with the placeholder image API page for route examples, then use the framework guides for HTML, React, and Next.js fallback behavior.',
        ],
        code: `API landing page: https://fallback.pics/placeholder-image-api/
Docs: https://fallback.pics/docs/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Use the canonical /api/v1 route for every generated fallback.pics image URL.',
      'Specify dimensions as width x height to keep layouts stable.',
      'Use hex colors without # when customizing placeholder background and text colors.',
      'Add custom labels with the text query parameter, but keep URL text public and generic.',
      'Use avatar placeholders for missing profile photos and skeleton placeholders for loading states.',
    ],
    related: [
      'complete-guide-to-image-placeholders-in-web-development',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'How to Fix Broken Images in HTML with onerror',
    description:
      'Use the HTML img onerror fallback pattern to replace broken images with stable fallback.pics URLs while preserving layout, alt text, and production safety.',
    slug: 'fix-broken-images-html-onerror',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=HTML+Image+Fallback',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'Implementation Guides',
    tags: ['img onerror fallback', 'Broken image fallback', 'HTML image fallback', 'Frontend'],
    summary: [
      'The HTML img onerror fallback pattern is the fastest way to replace a failed image request with a controlled visual state.',
      'A production-ready fallback needs more than a replacement URL: clear the error handler, keep dimensions stable, preserve useful alt text, and avoid putting private values in URL text.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'What the img onerror fallback actually fixes',
        body: [
          'Developers search for img onerror fallback when an image URL can be empty, deleted, blocked, corrupted, or unavailable at render time. The browser fires the image error handler after the resource fails, giving your markup one chance to swap in a safer source.',
          'The goal is not to hide every media problem. The goal is to keep the interface readable while logs, monitoring, or CMS workflows handle the upstream issue.',
        ],
        cards: [
          { title: 'Product grids', body: 'Replace missing catalog photos without collapsing card height or pushing prices out of alignment.' },
          { title: 'CMS previews', body: 'Keep editorial previews usable when a media field is empty or a remote asset has been removed.' },
          { title: 'Dashboards', body: 'Use consistent report, user, and workspace preview states instead of browser broken-image icons.' },
        ],
      },
      {
        eyebrow: 'One-line fix',
        title: 'Basic img onerror fallback pattern',
        body: [
          'Start with the real image URL in src. If that request fails, clear the handler and set src to a fallback.pics URL that matches the expected image slot.',
          'Clearing this.onerror matters. If the fallback URL ever fails, the image will not keep retrying the same error handler in a loop.',
        ],
        code: `<img
  src="/images/product-photo.jpg"
  width="600"
  height="400"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/600x400?text=Image+Unavailable'"
/>`,
      },
      {
        eyebrow: 'Layout',
        title: 'Keep the fallback image the same size',
        body: [
          'Broken images often create a second UX problem: layout shift. If the original image was expected to be 600 by 400, the fallback URL should use 600x400 and the img element should keep width and height attributes.',
          'For responsive cards, keep the same fallback aspect ratio as the final media and let CSS scale the rendered element.',
        ],
        code: `<article class="product-card">
  <img
    class="product-card__image"
    src="/products/jacket.jpg"
    width="800"
    height="800"
    alt="Product photo"
    loading="lazy"
    decoding="async"
    onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image'"
  />
  <h2>Everyday Jacket</h2>
</article>

<style>
  .product-card__image {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
</style>`,
      },
      {
        eyebrow: 'Accessibility',
        title: 'Do not let the fallback URL replace alt text',
        body: [
          'The fallback image is a visual state. The alt attribute should still describe the content or purpose of the image slot, not the implementation detail that a fallback service is being used.',
          'For decorative images, an empty alt can still be correct. For product images, avatars, article thumbnails, and CMS media, keep the alt text meaningful to the surrounding content.',
        ],
        code: `<!-- Better: describes the image slot -->
<img
  src="/team/profile-photo.jpg"
  width="96"
  height="96"
  alt="Team member profile photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/avatar/96?text=User'"
/>

<!-- Avoid: exposes implementation instead of meaning -->
<img
  src="/team/profile-photo.jpg"
  width="96"
  height="96"
  alt="fallback.pics placeholder"
/>`,
      },
      {
        eyebrow: 'Data safety',
        title: 'Keep placeholder URL text public and generic',
        body: [
          'The text query parameter is useful for labels like Image Unavailable, Product Image, Avatar, or Preview. Do not put secrets, tokens, email addresses, order IDs, regulated data, or private customer details in the URL.',
          'Image URLs can appear in browser history, CDN logs, analytics tools, screenshots, support tickets, and referrer data. Treat every placeholder label as public metadata.',
        ],
        code: `<!-- Good: generic public label -->
https://fallback.pics/api/v1/600x400?text=Image+Unavailable

<!-- Good: useful UI context without private data -->
https://fallback.pics/api/v1/800x800?text=Product+Image

<!-- Avoid: private identifiers or customer-specific values in URL text -->`,
      },
      {
        eyebrow: 'Reusable pattern',
        title: 'Add the handler with JavaScript when markup is generated',
        body: [
          'Inline onerror is convenient for static HTML, CMS templates, Markdown renderers, and quick fixes. If your application generates image nodes from JavaScript, attach the same behavior as an event handler.',
          'This keeps the fallback URL centralized and makes it easier to update colors, dimensions, or labels later.',
        ],
        code: `<img
  id="catalog-image"
  src="/products/source-image.jpg"
  width="600"
  height="400"
  alt="Catalog product image"
/>

<script>
  const image = document.querySelector("#catalog-image");
  const fallbackSrc =
    "https://fallback.pics/api/v1/600x400/18181B/FFFFFF?text=Image+Unavailable";

  image.addEventListener("error", () => {
    image.src = fallbackSrc;
  }, { once: true });
</script>`,
      },
      {
        eyebrow: 'Framework path',
        title: 'When to move beyond inline HTML',
        body: [
          'The HTML onerror pattern is a good baseline, but larger products should move fallback behavior into shared components. React, Next.js, CMS templates, and design systems all benefit from one place that handles missing src values and failed image loads.',
          'Use the HTML guide for the immediate fix, then standardize the same fallback.pics URL rules in your framework layer.',
        ],
        code: `HTML guide: https://fallback.pics/guides/img-onerror-fallback/
Broken image fallback page: https://fallback.pics/broken-image-fallback/
Placeholder image API: https://fallback.pics/placeholder-image-api/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
      {
        eyebrow: 'Checklist',
        title: 'Production checklist for broken image fallback',
        body: [
          'Before shipping, test the failure path directly by pointing src at a missing local file or a blocked test URL. Confirm the fallback appears, the layout does not jump, and the error handler does not loop.',
          'Use the same fallback dimensions as the intended image, keep alt text tied to the content, lazy load non-critical images, and keep fallback labels generic enough for public logs.',
        ],
      },
    ],
    takeaways: [
      'Use img onerror fallback when a real image URL can fail after the page renders.',
      'Clear this.onerror before replacing src to prevent retry loops.',
      'Use fallback.pics URLs with the canonical /api/v1 route and matching dimensions.',
      'Keep alt text meaningful and independent from the fallback image implementation.',
      'Treat placeholder URL text as public metadata and avoid sensitive values.',
    ],
    related: [
      'placeholder-image-api-url-syntax-guide',
      'image-loading-best-practices-for-better-ux',
      'complete-guide-to-image-placeholders-in-web-development',
    ],
  },
  {
    title: 'React Image Fallback Patterns: Missing Src, Failed Loads, and Placeholders',
    description:
      'Build a React image fallback component that handles missing src values, failed image loads, layout-safe placeholders, and production-safe fallback.pics URLs.',
    slug: 'react-image-fallback-patterns',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=React+Image+Fallback',
    date: '2026-06-05',
    readTime: '13 min read',
    category: 'React Guides',
    tags: ['React image fallback', 'React img onerror', 'React placeholder image', 'Broken images'],
    summary: [
      'React image fallback work has two separate paths: missing image data before render and failed network loads after render.',
      'A reliable component should handle both paths, preserve layout dimensions, avoid error loops, and use generic fallback URL text that is safe for logs and screenshots.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why React image fallback needs more than onError',
        body: [
          'Most React snippets solve only one case: an image request fails and onError swaps the src. Real applications also receive empty strings, null media fields, deleted CMS assets, expired CDN URLs, and product records without photos.',
          'Treat missing src and failed loads as separate states. Missing data can use the fallback before React renders the img. Failed loads need an onError handler after the browser tries the source.',
        ],
        cards: [
          { title: 'Missing src', body: 'Use the fallback URL before render when the API, CMS, or product record has no image value.' },
          { title: 'Failed load', body: 'Use onError when the browser receives a URL but the resource fails, times out, or returns unusable image data.' },
          { title: 'Stable UI', body: 'Keep width, height, and aspect ratio consistent so the fallback does not introduce layout shift.' },
        ],
      },
      {
        eyebrow: 'Baseline',
        title: 'Basic React img onError fallback',
        body: [
          'The shortest React image fallback pattern uses onError to replace the current src. Clear the handler first so a failed fallback image cannot trigger a retry loop.',
          'Use currentTarget instead of target in TypeScript examples. React types currentTarget as the img element that owns the handler.',
        ],
        code: `const fallbackSrc =
  "https://fallback.pics/api/v1/600x400?text=Image+Unavailable";

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      width={600}
      height={400}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallbackSrc;
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Missing data',
        title: 'Handle missing src before the image renders',
        body: [
          'If the src prop is undefined, null, or an empty string, the browser may not fire the failure path you expect. Decide on the fallback source before rendering the img.',
          'This is the common path for CMS previews, ecommerce imports, user profiles, and API records where media is optional.',
        ],
        code: `type ProductImageProps = {
  src?: string | null;
  alt: string;
};

const productFallback =
  "https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image";

export function ProductImage({ src, alt }: ProductImageProps) {
  const imageSrc = src?.trim() ? src : productFallback;

  return (
    <img
      src={imageSrc}
      width={800}
      height={800}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}`,
      },
      {
        eyebrow: 'Reusable component',
        title: 'Create a reusable React image fallback component',
        body: [
          'For production React apps, centralize fallback behavior in one component. That keeps product cards, avatars, article thumbnails, and dashboard previews from each inventing slightly different error handling.',
          'The component below covers missing src values and failed loads while preserving normal img attributes.',
        ],
        code: `import type { ImgHTMLAttributes } from "react";

type FallbackImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
};

const defaultFallback =
  "https://fallback.pics/api/v1/600x400?text=Image+Unavailable";

export function FallbackImage({
  src,
  fallbackSrc = defaultFallback,
  alt,
  ...props
}: FallbackImageProps) {
  const resolvedSrc =
    typeof src === "string" && src.trim().length > 0 ? src : fallbackSrc;

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallbackSrc;
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Use cases',
        title: 'Use different placeholders by image surface',
        body: [
          'One generic fallback is easy to start with, but repeated UI surfaces usually need different dimensions and labels. A product photo fallback should not look like an avatar fallback.',
          'Use deterministic fallback.pics URLs that match the final surface. That makes the UI easier to scan and keeps screenshot tests stable.',
        ],
        code: `<FallbackImage
  src={product.imageUrl}
  fallbackSrc="https://fallback.pics/api/v1/800x800?text=Product+Image"
  width={800}
  height={800}
  alt="Product photo"
/>

<FallbackImage
  src={user.avatarUrl}
  fallbackSrc="https://fallback.pics/api/v1/avatar/96?text=User"
  width={96}
  height={96}
  alt="User avatar"
/>

<FallbackImage
  src={article.coverUrl}
  fallbackSrc="https://fallback.pics/api/v1/1200x630?text=Article+Image"
  width={1200}
  height={630}
  alt="Article cover"
/>`,
      },
      {
        eyebrow: 'Layout',
        title: 'Prevent layout shift in React image fallbacks',
        body: [
          'React fallback logic should not change the geometry of the image slot. Keep width and height attributes on the img, and pair them with CSS when the rendered size is responsive.',
          'If the original image slot is square, use a square fallback URL. If it is a social card, use 1200x630. The fallback should preserve the same aspect ratio as the intended image.',
        ],
        code: `<FallbackImage
  className="cardImage"
  src={item.imageUrl}
  fallbackSrc="https://fallback.pics/api/v1/600x400?text=Card+Image"
  width={600}
  height={400}
  alt={item.title}
/>

/* CSS */
.cardImage {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}`,
      },
      {
        eyebrow: 'State',
        title: 'When to use state instead of mutating currentTarget',
        body: [
          'Directly setting event.currentTarget.src is fine for a small img wrapper. Use React state when the fallback affects other UI, such as showing a badge, changing copy, or reporting the failed source to a logging function.',
          'Avoid setting state repeatedly on every error. Guard against retry loops by checking whether the current source is already the fallback.',
        ],
        code: `import { useState } from "react";

const fallbackSrc =
  "https://fallback.pics/api/v1/600x400?text=Image+Unavailable";

export function TrackedImage({ src, alt }: { src?: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);
  const [usedFallback, setUsedFallback] = useState(!src);

  return (
    <figure>
      <img
        src={imageSrc}
        width={600}
        height={400}
        alt={alt}
        onError={() => {
          if (imageSrc === fallbackSrc) return;
          setImageSrc(fallbackSrc);
          setUsedFallback(true);
        }}
      />
      {usedFallback ? <figcaption>Image unavailable</figcaption> : null}
    </figure>
  );
}`,
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep React fallback URL labels safe',
        body: [
          'It is tempting to include product names, user names, account identifiers, or request IDs in placeholder text. Do not do that. Image URLs can end up in browser history, CDN logs, analytics tools, error reports, and screenshots.',
          'Use generic labels like Product Image, User, Article Image, Preview, or Image Unavailable. Keep private data in your application state, not in the fallback image URL.',
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use this article when designing the component pattern. Use the shorter React image fallback guide when you need a quick implementation reference, and the API syntax guide when choosing dimensions, colors, avatars, and text labels.',
          'For Next.js applications, use the Next.js fallback guide instead of assuming every img pattern maps directly to next/image behavior.',
        ],
        code: `React guide: https://fallback.pics/guides/react-image-fallback/
HTML onerror guide: https://fallback.pics/guides/img-onerror-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
API reference: https://fallback.pics/api/`,
      },
    ],
    takeaways: [
      'Handle missing src values before render and failed loads with onError.',
      'Clear the image error handler or guard state updates to prevent fallback loops.',
      'Centralize React image fallback behavior in a shared component.',
      'Match fallback URL dimensions to the final image slot to avoid layout shift.',
      'Use generic placeholder text and keep private data out of fallback URLs.',
    ],
    related: [
      'fix-broken-images-html-onerror',
      'placeholder-image-api-url-syntax-guide',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'Complete Guide to Image Placeholders in Web Development',
    description:
      'Learn how image placeholders protect perceived performance, preserve layout, and keep product interfaces professional when media is missing or delayed.',
    slug: 'complete-guide-to-image-placeholders-in-web-development',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Image+Placeholder+Guide',
    date: '2025-01-15',
    readTime: '15 min read',
    category: 'Web Development',
    tags: ['Placeholders', 'UX', 'Loading states', 'Frontend'],
    summary: [
      'Image placeholders are not just development scaffolding. In production products, they preserve layout, reduce visual noise, and make missing media feel intentional.',
      'A good placeholder strategy gives every image surface a predictable fallback: product cards, avatars, previews, dashboards, CMS content, and documentation examples.',
    ],
    sections: [
      {
        eyebrow: 'Foundation',
        title: 'What image placeholders actually solve',
        body: [
          'Placeholders reserve the final media dimensions before the real asset is ready. That protects layout stability and prevents surrounding content from jumping as images load.',
          'They also give users a clear visual state when upstream image data is missing. Instead of a broken icon or collapsed card, the interface presents a controlled fallback that matches the product system.',
        ],
        cards: [
          { title: 'Layout stability', body: 'Reserve aspect ratio and prevent content shift across dense grids and feeds.' },
          { title: 'Perceived speed', body: 'Show an intentional loading or fallback state while real media catches up.' },
          { title: 'Brand control', body: 'Replace browser broken-image chrome with a consistent, production-safe visual.' },
        ],
      },
      {
        eyebrow: 'Implementation',
        title: 'Start with a deterministic URL',
        body: [
          'The simplest pattern is a dimensioned URL that can be used anywhere an image URL is accepted. Keep the dimensions aligned with the final surface and use a readable label when the fallback needs context.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/600x400/18181B/FFFFFF?text=Product+Image"
  width="600"
  height="400"
  alt="Product image fallback"
/>`,
      },
      {
        eyebrow: 'Patterns',
        title: 'Choose the placeholder type by surface',
        body: [
          'Static placeholders work well for product cards and documentation. Skeletons work better for temporary loading states. Initials-based avatars help user interfaces stay readable when profile photos are not available.',
          'The important decision is consistency: each repeated product surface should use the same placeholder rules so QA snapshots and real user sessions remain predictable.',
        ],
      },
    ],
    takeaways: [
      'Reserve space with explicit dimensions or aspect ratio.',
      'Use deterministic URLs for repeatable caching and predictable QA.',
      'Never put private customer data, secrets, or tokens in placeholder URL text.',
      'Standardize fallbacks inside design-system image components where possible.',
    ],
    related: [
      'why-every-developer-needs-fallback-images-case-studies',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'Why Every Developer Needs Fallback Images',
    description:
      'Production examples showing how fallback images protect ecommerce, SaaS, social, and marketplace interfaces when media systems fail.',
    slug: 'why-every-developer-needs-fallback-images-case-studies',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Fallback+Image+Case+Studies',
    date: '2025-01-15',
    readTime: '12 min read',
    category: 'Case Studies',
    tags: ['Reliability', 'Ecommerce', 'Marketplaces', 'Product UX'],
    summary: [
      'Broken images are small failures with outsized product impact. They reduce trust, disrupt scanning, and make otherwise polished interfaces feel incomplete.',
      'Fallback images turn those failures into controlled states that product, design, and engineering teams can reason about.',
    ],
    sections: [
      {
        eyebrow: 'Commerce',
        title: 'Ecommerce grids depend on stable media',
        body: [
          'A missing product photo can collapse visual hierarchy across an entire catalog row. Fallback images preserve card dimensions, keep price and title alignment intact, and make the missing-media state clear.',
          'For teams working with supplier feeds or marketplace sellers, a deterministic fallback is often safer than waiting for every upstream media source to be perfect.',
        ],
        cards: [
          { title: 'Catalog integrity', body: 'Product grids remain scannable even when vendor assets are incomplete.' },
          { title: 'Conversion protection', body: 'A controlled fallback is less disruptive than a broken image icon.' },
        ],
      },
      {
        eyebrow: 'Applications',
        title: 'SaaS dashboards need predictable previews',
        body: [
          'Dashboards often show thumbnails for reports, charts, uploads, workspaces, and users. When any of those previews fail, the interface can become noisy and harder to scan.',
          'Fallback URLs let teams standardize preview states without building a custom image generation service for every product surface.',
        ],
      },
      {
        eyebrow: 'Engineering',
        title: 'Put fallback behavior close to the component',
        body: [
          'The most maintainable approach is to centralize fallback behavior in an image component. The component can handle missing source data before render and failed network loads after render.',
        ],
        code: `const fallbackSrc =
  "https://fallback.pics/api/v1/600x400/18181B/FFFFFF?text=Image+Unavailable";

<img
  src={imageUrl || fallbackSrc}
  onError={(event) => {
    event.currentTarget.src = fallbackSrc;
  }}
  alt={alt}
/>`,
      },
    ],
    takeaways: [
      'Fallbacks protect trust in high-volume product surfaces.',
      'Use the same dimensions as the final image to avoid layout shift.',
      'Centralize fallback rules in shared components.',
      'Keep fallback labels generic and safe for logs.',
    ],
    related: [
      'complete-guide-to-image-placeholders-in-web-development',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'Image Loading Best Practices for Better UX',
    description:
      'Practical image loading patterns for faster perceived performance, lower layout shift, and cleaner fallback states in production interfaces.',
    slug: 'image-loading-best-practices-for-better-ux',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Image+Loading+Best+Practices',
    date: '2025-01-15',
    readTime: '18 min read',
    category: 'Performance',
    tags: ['Performance', 'Core Web Vitals', 'Lazy loading', 'UX'],
    summary: [
      'Image loading is part performance engineering and part interface design. The goal is not only faster bytes, but a calmer loading experience.',
      'The right combination of dimensions, lazy loading, placeholders, and fallbacks keeps the UI stable even when image delivery is imperfect.',
    ],
    sections: [
      {
        eyebrow: 'Core vitals',
        title: 'Reserve the final image shape',
        body: [
          'Always provide width and height attributes or an aspect-ratio container. This is the first line of defense against layout shift and unstable scrolling.',
          'Fallback images should follow the same geometry as the final image so error states do not introduce a second layout jump.',
        ],
      },
      {
        eyebrow: 'Loading',
        title: 'Lazy load below-the-fold media',
        body: [
          'Native lazy loading is the simplest baseline for long pages and image-heavy grids. Use eager loading only for media that is likely to be part of the first meaningful viewport.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/600x400?text=Preview"
  width="600"
  height="400"
  loading="lazy"
  decoding="async"
  alt="Preview image"
/>`,
      },
      {
        eyebrow: 'Fallbacks',
        title: 'Handle missing data and failed loads separately',
        body: [
          'Missing data can be handled before render. Failed loads need an error handler. Treat them as separate paths so each state is explicit and testable.',
          'For React or Next.js applications, a small wrapper component can keep this logic consistent across product surfaces.',
        ],
      },
      {
        eyebrow: 'Operations',
        title: 'Make fallback URLs cache-friendly',
        body: [
          'Stable fallback URLs are easier for browsers, CDNs, logs, and QA snapshots to reason about. Avoid random labels or unbounded query strings in repeated UI states.',
        ],
      },
    ],
    takeaways: [
      'Set dimensions or aspect ratio on every image surface.',
      'Lazy load non-critical media and eager load primary content.',
      'Use placeholders for temporary loading and fallbacks for missing or failed media.',
      'Prefer deterministic fallback URLs for caching and debugging.',
    ],
    related: [
      'complete-guide-to-image-placeholders-in-web-development',
      'why-every-developer-needs-fallback-images-case-studies',
    ],
  },
];

export const blogPostsBySlug = Object.fromEntries(blogPosts.map((post) => [post.slug, post])) as Record<string, BlogPost>;
