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
    title: 'Next.js Image Fallbacks Without Layout Shift',
    description:
      'Build Next.js image fallbacks that handle missing src values, failed remote images, SVG placeholders, width and height, fill layouts, and CLS-safe fallback URLs.',
    slug: 'nextjs-image-fallbacks-without-layout-shift',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Next.js+Image+Fallback',
    date: '2026-06-05',
    readTime: '14 min read',
    category: 'Next.js Guides',
    tags: ['Next.js image fallback', 'next/image', 'CLS', 'Placeholder images'],
    summary: [
      'Next.js image fallback work has two jobs: replace missing or failed media and keep the reserved image geometry stable.',
      'A good fallback component handles missing src values before render, failed remote images after render, Next.js remote image configuration, and SVG placeholder URLs without causing layout shift.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why Next.js image fallback is a layout problem',
        body: [
          'Developers search for Next.js image fallback when remote CMS, ecommerce, avatar, or API images fail. In Next.js, the fix is not only changing src. The fallback must keep the same width, height, or fill container so the page does not shift when the image state changes.',
          'The Next.js Image component uses width and height to infer aspect ratio and reserve space. If your fallback source has different dimensions or you remove the sizing contract, you can trade a broken image for a Core Web Vitals problem.',
        ],
        cards: [
          { title: 'Missing source data', body: 'Use a fallback URL before rendering Image when CMS or product data has no usable src.' },
          { title: 'Failed remote loads', body: 'Use a client component and state guard when an image URL exists but fails after render.' },
          { title: 'CLS control', body: 'Keep width, height, fill container, and aspect ratio stable when swapping to the fallback.' },
        ],
      },
      {
        eyebrow: 'Config',
        title: 'Allow fallback.pics as a remote image source',
        body: [
          'If you use next/image with remote fallback URLs, configure the fallback.pics hostname in next.config.js. Keep the pattern specific instead of allowing every remote hostname.',
          'fallback.pics returns generated SVG placeholders from the /api/v1 route. Use unoptimized on the Image component for these fallback URLs so Next.js serves the SVG source as-is.',
        ],
        code: `// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fallback.pics",
        pathname: "/api/v1/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/products/**",
      },
    ],
  },
};`,
      },
      {
        eyebrow: 'Baseline',
        title: 'Handle missing src before rendering next/image',
        body: [
          'Missing src values are a data problem, not a load-error problem. Resolve the fallback source before rendering Image so the component always receives a valid src.',
          'Match the fallback URL dimensions to the Image width and height. In a square product grid, use a square fallback URL.',
        ],
        code: `import Image from "next/image";

const productFallback =
  "https://fallback.pics/api/v1/800x800?text=Product+Image";

export function ProductImage({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  const imageSrc = src?.trim() ? src : productFallback;

  return (
    <Image
      src={imageSrc}
      width={800}
      height={800}
      alt={alt}
      unoptimized={imageSrc === productFallback}
    />
  );
}`,
      },
      {
        eyebrow: 'Client component',
        title: 'Handle failed remote images with onError',
        body: [
          'A remote image can still fail after render because the file was deleted, the CDN returned an invalid response, or the host blocked the request. In the App Router, put load-failure fallback logic in a client component.',
          'Guard the state update so the fallback does not retry forever if the fallback source is already active.',
        ],
        code: `"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  fallbackSrc: string;
  alt: string;
};

export function SafeImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={currentSrc === fallbackSrc}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Cards',
        title: 'Use width and height for fixed-ratio surfaces',
        body: [
          'For product cards, article thumbnails, user avatars, and dashboard previews, pass width and height even when CSS controls the rendered size. Next.js uses those values to infer aspect ratio and reserve the right space.',
          'Use CSS to scale the image responsively, but do not drop the intrinsic dimensions from the Image component.',
        ],
        code: `<SafeImage
  className="productImage"
  src={product.imageUrl}
  fallbackSrc="https://fallback.pics/api/v1/800x800?text=Product+Image"
  width={800}
  height={800}
  alt={product.name}
/>

/* CSS */
.productImage {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}`,
      },
      {
        eyebrow: 'Fill layouts',
        title: 'Use fill only inside a stable container',
        body: [
          'Use fill when the rendered size is controlled by the parent container. The parent must reserve space with position: relative and a stable aspect-ratio or fixed dimensions.',
          'The fallback URL should still match the intended aspect ratio. For a 3:2 card image, use a 600x400 fallback URL; for an Open Graph style preview, use 1200x630.',
        ],
        code: `<div className="mediaFrame">
  <SafeImage
    src={article.coverUrl}
    fallbackSrc="https://fallback.pics/api/v1/1200x630?text=Article+Image"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    alt={article.title}
  />
</div>

/* CSS */
.mediaFrame {
  position: relative;
  width: 100%;
  aspect-ratio: 1200 / 630;
  overflow: hidden;
}

.mediaFrame img {
  object-fit: cover;
}`,
      },
      {
        eyebrow: 'Surfaces',
        title: 'Choose fallback URLs by Next.js surface',
        body: [
          'A single fallback label can work for early development, but production interfaces scan better when each image surface has its own dimensions and message.',
          'Keep labels generic and public. Do not include email addresses, user names, order numbers, account IDs, tokens, or other private values in placeholder URL text.',
        ],
        code: `const fallbackBySurface = {
  product: "https://fallback.pics/api/v1/800x800?text=Product+Image",
  avatar: "https://fallback.pics/api/v1/avatar/96?text=User",
  article: "https://fallback.pics/api/v1/1200x630?text=Article+Image",
  banner: "https://fallback.pics/api/v1/1200x400?text=Banner",
  unavailable: "https://fallback.pics/api/v1/600x400?text=Image+Unavailable",
};`,
      },
      {
        eyebrow: 'Tradeoffs',
        title: 'When to use img instead of next/image',
        body: [
          'Use next/image when you need Next.js image optimization, responsive srcsets, priority handling, and consistent framework behavior. Use a plain img when the image is already a small generated SVG placeholder and you do not need Next.js to manage it.',
          'In mixed components, it is reasonable to use next/image for real product media and a plain img for a static SVG fallback if that keeps the implementation simpler. The important requirement is the same: reserve the dimensions before the image loads.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/600x400?text=Image+Unavailable"
  width="600"
  height="400"
  alt="Image unavailable"
  loading="lazy"
  decoding="async"
/>`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use this article when designing a layout-safe Next.js image fallback component. The shorter Next.js guide is useful for quick reference, and the API syntax guide covers dimensions, colors, avatars, and text labels.',
          'If your issue is plain HTML or React without next/image, use the HTML onerror and React fallback guides instead.',
        ],
        code: `Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
HTML onerror guide: https://fallback.pics/guides/img-onerror-fallback/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
API reference: https://fallback.pics/api/`,
      },
    ],
    takeaways: [
      'Resolve missing src values before rendering next/image.',
      'Use a client component with an onError state guard for failed remote image loads.',
      'Keep width and height, or a stable fill container, so fallbacks do not cause layout shift.',
      'Use unoptimized for fallback.pics SVG placeholder URLs rendered through next/image.',
      'Keep placeholder URL text generic and safe for logs, screenshots, and analytics.',
    ],
    related: [
      'react-image-fallback-patterns',
      'fix-broken-images-html-onerror',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'Placeholder Image Generator vs Dummy Image Generator: What Developers Actually Need',
    description:
      'Compare placeholder image generators and dummy image generators, then choose the right URL pattern for mockups, layout testing, production fallbacks, and missing media.',
    slug: 'placeholder-image-generator-vs-dummy-image-generator',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Placeholder+vs+Dummy+Image',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Comparisons',
    tags: ['Placeholder image generator', 'Dummy image generator', 'Dummy image', 'Developer tools'],
    summary: [
      'Placeholder image generator and dummy image generator are often used for the same tool category, but developers usually need different outputs depending on the job.',
      'Dummy images are useful for mockups and seed data. Placeholder images reserve layout space. Production fallback images replace missing or failed media with a controlled state.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Placeholder image generator vs dummy image generator',
        body: [
          'Search results for placeholder image generator and dummy image generator overlap heavily. Tools like DummyImage, Placehold, and other URL-based generators focus on quick dimensions, colors, text, and copyable image URLs.',
          'The practical difference is not the label on the tool. The difference is the job your image URL needs to do: fill a mockup, reserve layout space, or protect a production interface when real media is missing.',
        ],
        cards: [
          { title: 'Dummy image', body: 'A stand-in asset for mockups, fixtures, demos, seed data, and unfinished designs.' },
          { title: 'Placeholder image', body: 'A predictable visual that reserves space and communicates the intended image surface.' },
          { title: 'Fallback image', body: 'A production replacement shown when expected media is missing, invalid, blocked, or failed.' },
        ],
      },
      {
        eyebrow: 'Dummy images',
        title: 'Use a dummy image generator for mockups and test data',
        body: [
          'A dummy image generator is best when the real image does not exist yet. You might be building a card grid, a landing page mockup, a Storybook fixture, or a staging catalog before final assets are ready.',
          'In that case, the image URL should be fast to create, easy to scan, and dimensionally accurate. The label can be simple because the image is mostly a development stand-in.',
        ],
        code: `https://fallback.pics/api/v1/400x300?text=Dummy+Image
https://fallback.pics/api/v1/800x450?text=Hero+Mockup
https://fallback.pics/api/v1/600x600/F4F4F5/18181B?text=Product+Tile`,
      },
      {
        eyebrow: 'Placeholders',
        title: 'Use a placeholder image generator for layout-safe UI',
        body: [
          'A placeholder image generator is best when the shape of the image matters. Product cards, article previews, docs examples, dashboards, avatars, and banners all need stable dimensions so the surrounding UI does not jump.',
          'The placeholder should match the final image ratio and use text that describes the surface, not random filler. That makes the interface easier to review and safer for automated screenshots.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Article+Image"
  width="1200"
  height="630"
  alt="Article image placeholder"
/>`,
      },
      {
        eyebrow: 'Fallbacks',
        title: 'Use a fallback image when production media fails',
        body: [
          'Production fallback images are different from generic dummy images. They appear when a real image was expected but could not be shown: missing product photos, deleted uploads, broken CDN URLs, expired CMS media, or remote images that fail after render.',
          'For this job, choose a message that explains the state clearly, such as Product Image or Image Unavailable. Keep the URL deterministic so browsers, CDNs, tests, and logs see the same fallback repeatedly.',
        ],
        code: `<img
  src="/media/product-photo.jpg"
  width="800"
  height="800"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Decision guide',
        title: 'Choose by workflow, not by keyword',
        body: [
          'If you are designing a page before assets exist, use dummy images. If you are testing a layout or documenting a component, use placeholders. If users may see the image state in production, use a fallback image with context-specific text.',
          'The same fallback.pics URL API can support all three patterns. The difference is the dimensions, label, and where you wire the URL into the app.',
        ],
        cards: [
          { title: 'Mockup', body: 'Use Dummy Image, Preview, Hero Mockup, or Card Image labels in fixtures and design demos.' },
          { title: 'Layout', body: 'Use exact dimensions and aspect ratios for cards, banners, avatars, grids, and docs.' },
          { title: 'Production', body: 'Use clear missing-media labels and attach fallbacks in HTML, React, Next.js, or shared components.' },
        ],
      },
      {
        eyebrow: 'Competitor context',
        title: 'How common generator tools position the category',
        body: [
          'DummyImage popularized the direct dummy image URL pattern: dimensions first, then optional colors and text. Placehold uses a similar developer-friendly URL structure with sizes, formats, colors, and custom text. Placeholderimage.dev focuses on a client-side customizable generator.',
          'Those tools are useful for quick placeholder creation. fallback.pics focuses the same URL convenience on production-safe missing-media states as well as mockups: deterministic SVG URLs, avatars, skeleton states, branded labels, and implementation guides for HTML, React, and Next.js.',
        ],
      },
      {
        eyebrow: 'API examples',
        title: 'Copy URL patterns for each job',
        body: [
          'Use short, stable labels. Do not put secrets, tokens, email addresses, account IDs, order numbers, regulated data, or private customer details in placeholder URL text.',
          'URLs are visible in browser history, CDN logs, analytics tools, screenshots, and support tickets. Treat text parameters as public metadata.',
        ],
        code: `// Dummy image for a mockup
https://fallback.pics/api/v1/600x400?text=Dummy+Image

// Placeholder image for a card layout
https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Card+Image

// Production fallback for unavailable media
https://fallback.pics/api/v1/600x400?text=Image+Unavailable

// Avatar placeholder
https://fallback.pics/api/v1/avatar/96?text=User

// Loading skeleton
https://fallback.pics/api/v1/animated/skeleton/600x400`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the placeholder image generator when you want a copyable URL with dimensions, colors, and text. Use the dummy image generator when your immediate job is mockups, fixtures, or staging data.',
          'For production fallback behavior, pair the API URL with the HTML, React, or Next.js implementation guide that matches your stack.',
        ],
        code: `Placeholder image generator: https://fallback.pics/placeholder-image-generator/
Dummy image generator: https://fallback.pics/dummy-image-generator/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Use dummy images for mockups, demos, fixtures, and seed data.',
      'Use placeholder images to reserve layout space and document expected media surfaces.',
      'Use fallback images when production media is missing or fails after render.',
      'Keep dimensions and aspect ratios aligned with the final image slot.',
      'Keep placeholder URL text generic, public, and free of sensitive values.',
    ],
    related: [
      'placeholder-image-api-url-syntax-guide',
      'fix-broken-images-html-onerror',
      'react-image-fallback-patterns',
    ],
  },
  {
    title: 'Best Placeholder Image APIs for Developers: Feature-by-Feature Comparison',
    description:
      'Compare placeholder image APIs by route syntax, output type, custom text, colors, deterministic behavior, production fallback use, and developer workflow.',
    slug: 'best-placeholder-image-apis-for-developers',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Best+Placeholder+Image+APIs',
    date: '2026-06-05',
    readTime: '13 min read',
    category: 'Comparisons',
    tags: ['Best placeholder image API', 'Placeholder image API', 'Image placeholder service', 'Developer tools'],
    summary: [
      'The best placeholder image API depends on what you need the image to do: deterministic UI fallback, quick mockup image, random photo, rich visual placeholder, or classic dummy image URL.',
      'For production UI states, prioritize predictable URLs, stable dimensions, safe text labels, cache-friendly behavior, and framework implementation patterns over decorative effects.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'How to choose the best placeholder image API',
        body: [
          'Developers searching for the best placeholder image API usually want a URL they can paste into an img tag, framework component, CMS field, README, fixture, or visual test. The hard part is choosing the API behavior that matches the job.',
          'A photo-random API can make a mockup feel realistic, but it may be a poor fit for a production missing-media state. A richly customizable generator can be useful for design experiments, but a deterministic SVG URL may be easier to cache, test, and standardize across product surfaces.',
        ],
        cards: [
          { title: 'Production fallback', body: 'Use deterministic URLs, stable dimensions, and generic labels like Product Image or Image Unavailable.' },
          { title: 'Visual mockup', body: 'Use photo or decorative placeholders when realistic-looking design comps matter more than deterministic state messaging.' },
          { title: 'Developer fixtures', body: 'Use short, copyable URLs that work in HTML, React, Next.js, Markdown, test data, and docs.' },
        ],
      },
      {
        eyebrow: 'Comparison',
        title: 'Placeholder image API comparison table',
        body: [
          'This comparison focuses on developer workflow and production suitability rather than ranking every visual effect. Check each service directly before relying on a specific format, size limit, or parameter in a production system.',
          'The main question is whether you need a controlled placeholder state or a more visual stand-in image.',
        ],
        cards: [
          { title: 'fallback.pics', body: 'Best fit for deterministic SVG placeholders, broken-image fallbacks, avatars, skeleton states, docs, and framework examples using /api/v1 URLs.' },
          { title: 'placehold.co', body: 'Best fit for familiar URL placeholders with dimensions, formats, colors, text, fonts, and retina variants.' },
          { title: 'DummyImage', body: 'Best fit for classic dummy image URLs with dimensions, colors, ratios, and custom text in a long-standing format.' },
          { title: 'Picsum Photos', body: 'Best fit for random or seeded photo placeholders when realistic photography is useful in mockups.' },
          { title: 'MockImg', body: 'Best fit for highly customizable generated placeholders with many formats, fonts, icons, gradients, and visual effects.' },
        ],
      },
      {
        eyebrow: 'fallback.pics',
        title: 'fallback.pics for deterministic fallback states',
        body: [
          'fallback.pics is a strong fit when placeholder images are part of product reliability: missing product photos, empty avatar slots, unavailable CMS media, framework fallback components, and visual test fixtures.',
          'Use the canonical /api/v1 route for generated image URLs. Keep dimensions aligned with the final image slot and use public, generic text labels.',
        ],
        code: `https://fallback.pics/api/v1/600x400?text=Image+Unavailable
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/animated/skeleton/600x400`,
      },
      {
        eyebrow: 'placehold.co',
        title: 'placehold.co for broad placeholder URL syntax',
        body: [
          'placehold.co is a familiar placeholder image API with concise size syntax, optional formats, background and text colors, custom text, fonts, and retina variants. It is a practical choice for quick design and development placeholders.',
          'If your main need is a broad general-purpose placeholder URL, it is worth comparing placehold.co syntax against fallback.pics. If your main need is production fallback behavior and implementation guides, fallback.pics is more focused on that workflow.',
        ],
      },
      {
        eyebrow: 'DummyImage',
        title: 'DummyImage for classic dummy image URLs',
        body: [
          'DummyImage is useful when you want the older, widely recognized dummy image URL pattern: dimensions first, then optional colors, ratios, and text. It remains a simple choice for mockups, fixtures, and legacy snippets.',
          'For modern product UI, the limitation is not whether a dummy image can be generated. The question is whether the placeholder communicates the right state when real media is missing in production.',
        ],
      },
      {
        eyebrow: 'Picsum',
        title: 'Picsum Photos for random or seeded photos',
        body: [
          'Picsum Photos is useful when a design mockup needs real photography. It can return a random image by size, a specific image by ID, or a stable random image by seed.',
          'Random photo placeholders can hurt production fallback UX because the image content may not match the missing media state. Use photo placeholders when visual realism matters; use deterministic SVG placeholders when predictable state messaging matters.',
        ],
      },
      {
        eyebrow: 'MockImg',
        title: 'MockImg for rich visual placeholder generation',
        body: [
          'MockImg offers a broad visual-generation surface with formats, fonts, icons, gradients, effects, borders, radius, padding, and other styling controls. That can be useful for polished mockups or design-heavy placeholders.',
          'The tradeoff is complexity. For repeated production fallback states, simpler deterministic URLs are easier for teams to standardize, review, and test.',
        ],
      },
      {
        eyebrow: 'Decision guide',
        title: 'Which placeholder API should you use?',
        body: [
          'Use fallback.pics when you need production-safe, deterministic missing-media states and framework examples. Use placehold.co or DummyImage when you need familiar general placeholder URLs. Use Picsum when random or seeded photos help a design review. Use MockImg when visual customization is the main requirement.',
          'For production apps, make the decision at the component level. A shared image component can use one fallback URL pattern for product images, another for avatars, and a skeleton placeholder for temporary loading states.',
        ],
        code: `// Product fallback
https://fallback.pics/api/v1/800x800?text=Product+Image

// Avatar fallback
https://fallback.pics/api/v1/avatar/96?text=User

// Docs or article placeholder
https://fallback.pics/api/v1/1200x630?text=Article+Image

// Loading state
https://fallback.pics/api/v1/animated/skeleton/600x400`,
      },
      {
        eyebrow: 'Safety',
        title: 'Production checklist for placeholder image APIs',
        body: [
          'Before standardizing any placeholder image API, test the final URL in the exact place it will be used: HTML, React, Next.js, Markdown, CMS fields, Storybook, or screenshot tests.',
          'Confirm the response type works with your framework, dimensions reserve the right layout space, fallback labels are public and generic, and the URL behavior is deterministic enough for caching and QA.',
        ],
        cards: [
          { title: 'URL syntax', body: 'Can the team remember and copy the route without custom helper code?' },
          { title: 'Determinism', body: 'Does the same URL produce the same state when tests, docs, or production fallbacks rely on it?' },
          { title: 'Privacy', body: 'Can you use generic labels without exposing user names, emails, tokens, account IDs, or order numbers?' },
          { title: 'Framework fit', body: 'Does the URL work cleanly in HTML, React, Next.js, CMS fields, and docs?' },
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the placeholder image API page for fallback.pics route syntax and examples. Use the generator pages when you want copyable URLs for a specific surface.',
          'If you are wiring fallback behavior into an application, use the HTML, React, or Next.js guides rather than leaving fallback behavior as an ad hoc image URL.',
        ],
        code: `Placeholder image API: https://fallback.pics/placeholder-image-api/
Placeholder image generator: https://fallback.pics/placeholder-image-generator/
Dummy image generator: https://fallback.pics/dummy-image-generator/
Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Choose a placeholder image API by workflow: fallback state, mockup, test fixture, docs, or random photo.',
      'Use deterministic SVG placeholders when production UI needs predictable missing-media states.',
      'Use random or seeded photo services when visual realism matters more than state messaging.',
      'Keep placeholder URL text generic and free of private or regulated data.',
      'Standardize fallback URLs inside shared HTML, React, or Next.js image components.',
    ],
    related: [
      'placeholder-image-generator-vs-dummy-image-generator',
      'placeholder-image-api-url-syntax-guide',
      'nextjs-image-fallbacks-without-layout-shift',
    ],
  },
  {
    title: 'placehold.co Alternatives for Production Placeholder Images',
    description:
      'Compare placehold.co alternatives for production placeholder images, broken-image fallbacks, deterministic SVG URLs, avatars, skeletons, and framework workflows.',
    slug: 'placehold-co-alternatives-production-placeholder-images',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=placehold.co+Alternatives',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Alternatives',
    tags: ['placehold.co alternative', 'Placeholder image API', 'Fallback images', 'Developer tools'],
    summary: [
      'placehold.co is a strong general-purpose placeholder image service with simple URLs, formats, colors, text, fonts, and retina options.',
      'If your use case has moved from mockups into production fallback states, evaluate alternatives by deterministic behavior, implementation patterns, layout stability, privacy-safe labels, and missing-media workflows.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'When developers look for a placehold.co alternative',
        body: [
          'Most developers do not need a placehold.co alternative because placehold.co is hard to use. They need one because the job changed. A quick design placeholder became a production fallback, a CMS preview, a product-card empty state, or a design-system default.',
          'That shift changes the evaluation criteria. Format variety still matters, but consistency, safe URL text, framework examples, and repeated behavior across product surfaces become more important.',
        ],
        cards: [
          { title: 'Mockup need', body: 'A temporary image while design, layout, or test data is unfinished.' },
          { title: 'Fallback need', body: 'A controlled visual state when real media is expected but unavailable.' },
          { title: 'System need', body: 'A repeatable rule for HTML, React, Next.js, CMS previews, docs, and screenshot tests.' },
        ],
      },
      {
        eyebrow: 'Context',
        title: 'What placehold.co does well',
        body: [
          'placehold.co provides concise placeholder URLs with width and height, optional square shorthand, multiple output formats, background and text colors, custom text, font choices, and retina variants for supported raster formats.',
          'That makes it a useful general placeholder service for design examples, docs, and frontend experiments. If you need those broader format and font options, keep them in your comparison criteria.',
        ],
      },
      {
        eyebrow: 'Switching criteria',
        title: 'What to compare before switching',
        body: [
          'Do not switch placeholder services only because a route looks cleaner. Compare the production behavior that your app actually depends on.',
          'For product UI, the important questions are whether the same URL returns a predictable visual state, whether the fallback label is safe for logs, whether dimensions match the layout, and whether your framework can handle failed image loads without custom one-off code.',
        ],
        cards: [
          { title: 'Determinism', body: 'Will the same placeholder URL work predictably in QA, docs, screenshots, and production fallbacks?' },
          { title: 'Context', body: 'Can you create different placeholders for product images, avatars, banners, skeletons, and unavailable media?' },
          { title: 'Implementation', body: 'Are there clear examples for HTML onerror, React onError, and Next.js image fallback behavior?' },
          { title: 'Privacy', body: 'Can the team avoid putting user names, emails, order numbers, account IDs, or tokens into URL text?' },
        ],
      },
      {
        eyebrow: 'fallback.pics',
        title: 'fallback.pics as a production-focused alternative',
        body: [
          'fallback.pics is built around deterministic placeholder and fallback image states. It uses the canonical /api/v1 route for generated images and supports practical surfaces such as product cards, avatar placeholders, skeleton states, documentation examples, and broken-image fallbacks.',
          'The fit is clearest when the placeholder is not just decoration. If the image appears when real media is missing or failed, the URL should explain the state and preserve the layout.',
        ],
        code: `https://fallback.pics/api/v1/600x400?text=Image+Unavailable
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/animated/skeleton/600x400`,
      },
      {
        eyebrow: 'Migration',
        title: 'Map common placehold.co patterns to fallback.pics',
        body: [
          'The easiest migration is to keep the same dimensions and move the state label into a fallback.pics /api/v1 URL. Use colors when the placeholder needs to match a product theme or dashboard surface.',
          'Do not blindly replace every development placeholder. Start with production surfaces where broken or missing media would be visible to users.',
        ],
        code: `// Basic card placeholder
https://fallback.pics/api/v1/600x400?text=Card+Image

// Branded product fallback
https://fallback.pics/api/v1/800x800/18181B/FFFFFF?text=Product+Image

// Unavailable media state
https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Image+Unavailable

// Avatar slot
https://fallback.pics/api/v1/avatar/96?text=User`,
      },
      {
        eyebrow: 'Implementation',
        title: 'Use alternatives at the component level',
        body: [
          'A placeholder URL alone does not fix broken images. Wire fallback behavior into the component or template that owns the image surface.',
          'For plain HTML, use an onerror fallback and clear the handler before swapping src. For React and Next.js, centralize the behavior in a shared component so every product grid, avatar, and preview uses the same rules.',
        ],
        code: `<img
  src="/media/product-photo.jpg"
  width="800"
  height="800"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Alternatives',
        title: 'Other placehold.co alternatives to evaluate',
        body: [
          'The right alternative depends on the visual job. DummyImage is useful for classic dummy image URLs. Picsum Photos is useful for random or seeded photography. MockImg is useful when rich generated styling, icons, and many format options matter.',
          'For production missing-media states, compare those tools against the repeatability and implementation workflow you need, not only the visual output they can generate.',
        ],
        cards: [
          { title: 'DummyImage', body: 'Classic dummy image URL syntax for dimensions, colors, ratios, and text.' },
          { title: 'Picsum Photos', body: 'Random or seeded photo placeholders for realistic mockups.' },
          { title: 'MockImg', body: 'Highly customizable generated placeholders with broad styling controls.' },
          { title: 'fallback.pics', body: 'Deterministic SVG fallback states and implementation-focused developer docs.' },
        ],
      },
      {
        eyebrow: 'Safety',
        title: 'Keep alternative placeholder URLs production-safe',
        body: [
          'Treat placeholder URL text as public metadata. Do not put secrets, tokens, email addresses, user names, account IDs, order numbers, regulated data, or private customer details in fallback image URLs.',
          'Use generic labels like Product Image, User, Preview, Card Image, or Image Unavailable. These labels are enough for users and safe for logs, browser history, analytics tools, screenshots, and support tickets.',
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the dedicated placehold.co alternative page for a concise product overview, then use the API syntax guide and implementation guides when wiring fallback behavior into your app.',
          'If you are comparing the whole category rather than placehold.co specifically, start with the best placeholder image APIs comparison.',
        ],
        code: `Placehold.co alternative: https://fallback.pics/alternatives/placehold-co-alternative/
Best placeholder APIs: https://fallback.pics/blog/best-placeholder-image-apis-for-developers/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Use placehold.co when broad placeholder formats, text, colors, fonts, and retina options are the primary need.',
      'Evaluate alternatives when placeholders become production fallback states rather than temporary mockup assets.',
      'Use fallback.pics for deterministic /api/v1 placeholders, avatars, skeletons, and broken-image fallback workflows.',
      'Move fallback logic into HTML, React, or Next.js components instead of scattering one-off image URLs.',
      'Keep placeholder URL text generic and free of private or regulated data.',
    ],
    related: [
      'best-placeholder-image-apis-for-developers',
      'placeholder-image-api-url-syntax-guide',
      'fix-broken-images-html-onerror',
    ],
  },
  {
    title: 'DummyImage Alternatives: Modern Dummy Image URLs for Web Apps',
    description:
      'Compare DummyImage alternatives for modern web apps, including SVG dummy image URLs, branded placeholders, avatars, skeletons, and production fallbacks.',
    slug: 'dummyimage-alternatives-modern-dummy-image-urls',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=DummyImage+Alternatives',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Alternatives',
    tags: ['DummyImage alternative', 'Dummy image generator', 'Dummy image URL', 'Placeholder images'],
    summary: [
      'DummyImage.com is useful because it made dummy image URLs simple: dimensions first, optional colors, optional text, and a result you can paste into HTML.',
      'Modern web apps often need more than generic dummy images. Product cards, dashboards, avatars, CMS previews, and production broken-image states benefit from contextual SVG placeholders and framework-ready fallback patterns.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'When developers look for a DummyImage alternative',
        body: [
          'Most developers searching for a DummyImage alternative still want the core workflow: type a URL, get an image, keep building. The difference is that modern applications need more specific states than a generic gray dummy image.',
          'A staging catalog may need square product placeholders. A dashboard may need report thumbnails. A user table may need avatar fallbacks. A production UI may need a stable image unavailable state when remote media fails.',
        ],
        cards: [
          { title: 'Mockups', body: 'Use simple dummy image URLs while layout, copy, and final assets are unfinished.' },
          { title: 'Fixtures', body: 'Use deterministic URLs in seed data, Storybook examples, screenshots, docs, and tests.' },
          { title: 'Fallbacks', body: 'Use contextual placeholders when real product, avatar, CMS, or remote images are missing.' },
        ],
      },
      {
        eyebrow: 'Context',
        title: 'What DummyImage does well',
        body: [
          'DummyImage popularized a practical dimensions-first URL pattern. Its documentation covers width x height, optional square shorthand, ratios, background and text colors, GIF/JPG/PNG formats, custom text, and standard size shortcuts.',
          'That workflow is still useful. If all you need is a classic dummy image for a mockup or fixture, the category remains straightforward: choose the size, choose a label, paste the URL.',
        ],
      },
      {
        eyebrow: 'Modern needs',
        title: 'Why modern web apps need more contextual dummy image URLs',
        body: [
          'Modern product surfaces rarely have one generic image slot. They have product grids, profile avatars, article cards, social previews, uploaded documents, CMS blocks, report thumbnails, and skeleton loading states.',
          'Those surfaces need different dimensions and labels. They also need fallback logic in the component layer so a failed remote image turns into a readable state instead of a browser broken-image icon.',
        ],
        code: `https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/1200x630?text=Article+Image
https://fallback.pics/api/v1/animated/skeleton/600x400`,
      },
      {
        eyebrow: 'fallback.pics',
        title: 'fallback.pics as a DummyImage alternative',
        body: [
          'fallback.pics keeps the copy-paste URL workflow but focuses on deterministic SVG placeholders and production fallback states. Use /api/v1 URLs anywhere an image URL is accepted: HTML, React, Next.js, Markdown, CMS fields, fixtures, and docs.',
          'The value is not only generating a rectangle. It is giving each image surface a clear, repeatable state that matches the product workflow.',
        ],
        code: `// Classic dummy image style
https://fallback.pics/api/v1/400x300?text=Dummy+Image

// Branded dashboard preview
https://fallback.pics/api/v1/600x400/18181B/FFFFFF?text=Preview

// Product fallback
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image`,
      },
      {
        eyebrow: 'Migration',
        title: 'Map DummyImage-style URLs to fallback.pics',
        body: [
          'Start by preserving dimensions. If your old dummy image URL was 600 by 400, use a 600x400 fallback.pics URL. Then replace generic text with a safer label for the surface: Card Image, Product Image, Preview, or Image Unavailable.',
          'For production use, avoid labels that include private data. URLs can be logged by browsers, CDNs, analytics tools, and support systems.',
        ],
        code: `// Mockup image
https://fallback.pics/api/v1/600x400?text=Dummy+Image

// Card placeholder
https://fallback.pics/api/v1/600x400?text=Card+Image

// Missing product image
https://fallback.pics/api/v1/800x800?text=Product+Image

// Remote media failed
https://fallback.pics/api/v1/600x400?text=Image+Unavailable`,
      },
      {
        eyebrow: 'Implementation',
        title: 'Use dummy image URLs where your app owns the image state',
        body: [
          'For mockups and docs, a dummy image URL can be pasted directly into img src. For production interfaces, put fallback behavior in the component or template that owns the image.',
          'That lets the same rule handle missing source data before render and failed image loads after render.',
        ],
        code: `<img
  src="/media/product-photo.jpg"
  width="800"
  height="800"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Comparison',
        title: 'DummyImage alternatives to evaluate',
        body: [
          'If you need classic dummy image URLs, DummyImage remains a familiar reference point. If you need richer generated styling, compare tools such as MockImg or other modern placeholder generators. If you need random photography, compare Picsum-style services instead.',
          'If you need predictable placeholder states for real app surfaces, fallback.pics is designed around deterministic URL output, avatars, skeleton placeholders, and implementation guides for broken image fallback workflows.',
        ],
        cards: [
          { title: 'DummyImage', body: 'Classic dimensions-first dummy image URLs with colors, formats, ratios, and text.' },
          { title: 'MockImg', body: 'Rich generated placeholders with broader visual controls and many output options.' },
          { title: 'Picsum-style services', body: 'Photo placeholders when realistic visuals matter more than state messaging.' },
          { title: 'fallback.pics', body: 'Deterministic SVG placeholders for mockups, docs, avatars, skeletons, and fallback states.' },
        ],
      },
      {
        eyebrow: 'Safety',
        title: 'Keep dummy image URL text safe',
        body: [
          'Do not put secrets, tokens, email addresses, user names, account IDs, order numbers, regulated data, or private customer details in dummy image URL text.',
          'Use labels that describe the surface without exposing data: Product Image, Card Image, Preview, User, Article Image, or Image Unavailable.',
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the DummyImage alternative page for a concise product overview. Use the dummy image generator page when you want copyable URLs for mockups, fixtures, and staging data.',
          'For production fallback behavior, use the broken image fallback page and the HTML, React, or Next.js implementation guides.',
        ],
        code: `DummyImage alternative: https://fallback.pics/alternatives/dummyimage-alternative/
Dummy image generator: https://fallback.pics/dummy-image-generator/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Use classic dummy image URLs for mockups, docs, fixtures, and seed data.',
      'Use contextual placeholder URLs when product surfaces need specific dimensions and labels.',
      'Use production fallback URLs when expected media is missing or fails after render.',
      'Keep dummy image URL text generic and free of private or regulated data.',
      'Centralize fallback behavior in HTML, React, or Next.js image components.',
    ],
    related: [
      'placeholder-image-generator-vs-dummy-image-generator',
      'best-placeholder-image-apis-for-developers',
      'fix-broken-images-html-onerror',
    ],
  },
  {
    title: 'Lorem Picsum vs SVG Placeholder Images: When Random Photos Hurt UX',
    description:
      'Compare Lorem Picsum random photo placeholders with deterministic SVG placeholder images for product cards, docs, dashboards, screenshots, and fallback states.',
    slug: 'lorem-picsum-vs-svg-placeholder-images',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Lorem+Picsum+vs+SVG',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Comparisons',
    tags: ['Lorem Picsum alternative', 'Picsum Photos alternative', 'Random image placeholder', 'SVG placeholder image'],
    summary: [
      'Lorem Picsum is useful when a mockup needs real-looking photography from simple URLs, including random, seeded, specific-ID, grayscale, and blurred image options.',
      'Random photos become risky when the image is meant to communicate a controlled product state. For missing media, docs, dashboards, screenshot tests, and fallback components, deterministic SVG placeholder images are usually easier to reason about.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Lorem Picsum vs SVG placeholder images',
        body: [
          'Developers comparing Lorem Picsum with SVG placeholder images are usually deciding between visual realism and predictable state messaging. Lorem Picsum gives you real photos by URL. SVG placeholders give you controlled dimensions, labels, and colors.',
          'Neither approach is universally better. Use random or seeded photos when a design needs realistic image texture. Use deterministic SVG placeholders when users, QA, or docs need to understand what the image slot represents.',
        ],
        cards: [
          { title: 'Random photo placeholder', body: 'Good for visual mockups, galleries, and prototypes where realistic photography helps the design feel populated.' },
          { title: 'Seeded photo placeholder', body: 'Good when you want a stable photo result but still want photographic content.' },
          { title: 'SVG placeholder image', body: 'Good for explicit fallback states, product surfaces, docs, dashboards, and screenshot tests.' },
        ],
      },
      {
        eyebrow: 'Picsum strengths',
        title: 'What Lorem Picsum does well',
        body: [
          'Lorem Picsum makes photo placeholders easy: add width and height to the URL, request a square image, choose a specific image by ID, use a seed for stable random output, or add grayscale and blur parameters.',
          'That is valuable for early visual design. A grid of real photos can reveal spacing, cropping, object-fit behavior, and visual density better than flat boxes.',
        ],
      },
      {
        eyebrow: 'UX risk',
        title: 'When random photos hurt product UX',
        body: [
          'Random photos can make an interface look finished when the underlying media state is not finished. That can hide missing product images, incomplete CMS fields, broken imports, or avatar upload gaps during review.',
          'Random content can also mislead users. A product card should not show an unrelated landscape photo just because the real product image is unavailable. A dashboard report thumbnail should not imply content that does not exist.',
        ],
        cards: [
          { title: 'Wrong context', body: 'A random photo may visually conflict with the product, document, avatar, or report it represents.' },
          { title: 'False confidence', body: 'A realistic image can hide missing-media problems in QA and stakeholder reviews.' },
          { title: 'Unstable tests', body: 'Random image changes can make screenshot reviews noisy unless every image is pinned by ID or seed.' },
        ],
      },
      {
        eyebrow: 'SVG fit',
        title: 'Why SVG placeholder images are better for fallback states',
        body: [
          'A deterministic SVG placeholder can say exactly what happened: Product Image, User, Article Image, Preview, or Image Unavailable. The label communicates the state instead of pretending a real asset exists.',
          'SVG placeholders also work well for repeated UI surfaces because the same URL can produce the same visual result across docs, fixtures, tests, and production fallback components.',
        ],
        code: `https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/1200x630?text=Article+Image
https://fallback.pics/api/v1/600x400?text=Image+Unavailable`,
      },
      {
        eyebrow: 'Decision guide',
        title: 'Choose photos or SVG by job',
        body: [
          'Use Lorem Picsum when the placeholder should look like a real photo. Use fallback.pics when the placeholder should explain a missing, loading, preview, or fallback state.',
          'The decision gets clearer when you separate mockup visuals from production UI behavior. Mockups may benefit from random photos. Production fallbacks should be explicit and repeatable.',
        ],
        cards: [
          { title: 'Marketing mockup', body: 'Photo placeholders can help evaluate composition, cropping, and visual weight.' },
          { title: 'Product catalog', body: 'Use Product Image or Image Unavailable so missing supplier media is obvious.' },
          { title: 'Docs and tutorials', body: 'Use labeled SVG placeholders so readers understand the intended image role.' },
          { title: 'Visual regression tests', body: 'Use deterministic URLs so screenshots are easier to compare.' },
        ],
      },
      {
        eyebrow: 'Implementation',
        title: 'Replace random production fallbacks with explicit SVG URLs',
        body: [
          'If your app currently uses a random photo as a fallback image, start by replacing production fallback paths with labeled SVG URLs. Keep photo placeholders for mockups if they still help your design process.',
          'Match dimensions to the final image slot so the change does not introduce layout shift.',
        ],
        code: `<img
  src="/media/product-photo.jpg"
  width="800"
  height="800"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Patterns',
        title: 'Use stable labels instead of random content',
        body: [
          'For product cards, use Product Image. For CMS media, use Image Unavailable. For docs, use Article Image or Docs Preview. For account UI, use an avatar placeholder.',
          'Do not put secrets, tokens, email addresses, user names, account IDs, order numbers, regulated data, or private customer details in placeholder URL text.',
        ],
        code: `// Product card fallback
https://fallback.pics/api/v1/800x800?text=Product+Image

// CMS media fallback
https://fallback.pics/api/v1/600x400?text=Image+Unavailable

// Documentation preview
https://fallback.pics/api/v1/1200x630?text=Docs+Preview

// Account avatar
https://fallback.pics/api/v1/avatar/96?text=User`,
      },
      {
        eyebrow: 'Alternatives',
        title: 'Where PlaceholdPicsum fits',
        body: [
          'PlaceholdPicsum combines solid-color placeholder patterns with Lorem Picsum-style photo endpoints, including random, ID-based, and seeded photo routes. That can be useful when you want both generated placeholders and photo placeholders in one service.',
          'The same tradeoff still applies: photo placeholders are good for realistic mockups, while labeled SVG placeholders are clearer for missing-media states.',
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the placeholder image API page for fallback.pics route syntax, then use the relevant implementation guide for your stack.',
          'If you are comparing broader API options, use the best placeholder image APIs article. If you are choosing between dummy images and placeholders, use the generator comparison article.',
        ],
        code: `Placeholder image API: https://fallback.pics/placeholder-image-api/
Best placeholder APIs: https://fallback.pics/blog/best-placeholder-image-apis-for-developers/
Generator comparison: https://fallback.pics/blog/placeholder-image-generator-vs-dummy-image-generator/
Broken image fallback: https://fallback.pics/broken-image-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'Use Lorem Picsum when realistic photo placeholders help mockups, galleries, or visual design reviews.',
      'Use deterministic SVG placeholders when the image state needs to be explicit, stable, and testable.',
      'Avoid random photos for production missing-media states because they can mislead users and reviewers.',
      'Match fallback dimensions to the final image slot to preserve layout stability.',
      'Keep placeholder URL labels generic and free of private or regulated data.',
    ],
    related: [
      'best-placeholder-image-apis-for-developers',
      'placeholder-image-generator-vs-dummy-image-generator',
      'image-loading-best-practices-for-better-ux',
    ],
  },
  {
    title: 'Product Image Placeholder Strategy for Ecommerce Catalogs',
    description:
      'A practical ecommerce image placeholder strategy for missing supplier photos, failed CDN URLs, incomplete product imports, and stable product catalog layouts.',
    slug: 'product-image-placeholder-ecommerce-catalogs',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Product+Image+Placeholder',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Ecommerce',
    tags: ['Product image placeholder', 'Ecommerce image placeholder', 'Missing product image', 'Product photo fallback'],
    summary: [
      'Product image placeholders protect ecommerce layouts when supplier photos, imported media, variant images, or CDN-hosted assets are missing or fail to load.',
      'A good catalog strategy uses stable dimensions, safe generic labels, and centralized fallback behavior so product cards, PDPs, carts, checkout, and admin previews do not collapse or show broken-image icons.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'What a product image placeholder strategy solves',
        body: [
          'Developers searching for product image placeholders are usually past the mockup stage. They need a dependable missing-media state for catalog pages, product detail pages, carts, checkout thumbnails, admin previews, and staging data.',
          'The goal is not to make missing photos look finished. The goal is to keep the interface stable, communicate the media state clearly, and avoid letting a single broken image URL damage an otherwise usable shopping flow.',
        ],
        cards: [
          { title: 'Missing source media', body: 'Supplier feeds, CSV imports, PIM exports, and marketplace syncs can create products before photos are ready.' },
          { title: 'Failed remote URLs', body: 'Old CDN paths, expired signed URLs, deleted source files, or format support issues can break images after products go live.' },
          { title: 'Incomplete variants', body: 'A parent product may have media while color, size, bundle, or marketplace-specific variants are missing their own image.' },
        ],
      },
      {
        eyebrow: 'Catalog UX',
        title: 'Use placeholders to preserve product grid structure',
        body: [
          'Product grids depend on consistent image ratios. If one card loses its image height, the row can jump, product names can misalign, and calls to action can move. That is especially visible on mobile where catalog cards are narrow and stacked.',
          'A placeholder should reserve the same visual space as the real product photo. Use width and height attributes, CSS aspect-ratio, or framework image sizing so the browser can allocate space before either the real photo or fallback URL renders.',
        ],
        code: `<img
  src="/media/products/linen-shirt.jpg"
  width="800"
  height="800"
  alt="Linen shirt"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Surfaces',
        title: 'Map placeholder dimensions to ecommerce surfaces',
        body: [
          'Do not use one fallback URL for every ecommerce image. Product cards, product detail media, cart thumbnails, checkout thumbnails, order summaries, and admin import previews have different aspect ratios and information density.',
          'Start by documenting the image surfaces your storefront actually renders. Then give each surface a matching fallback URL and label.',
        ],
        cards: [
          { title: 'Product grid card', body: 'Use a square or catalog-ratio image that matches the final product card crop.' },
          { title: 'Product detail media', body: 'Use a larger square or portrait placeholder so the gallery does not resize when a source image fails.' },
          { title: 'Cart and checkout thumbnail', body: 'Use smaller fallback URLs with generic labels so totals and checkout actions stay aligned.' },
          { title: 'Admin preview', body: 'Use explicit labels like Product Image or Image Missing so data issues are visible before publish.' },
        ],
        code: `// Product grid
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// Product detail gallery
https://fallback.pics/api/v1/1200x1200/F4F4F5/18181B?text=Product+Image

// Cart or checkout thumbnail
https://fallback.pics/api/v1/300x300/F4F4F5/18181B?text=Product

// Admin import preview
https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Image+Missing`,
      },
      {
        eyebrow: 'Fallback logic',
        title: 'Handle missing src and failed loads separately',
        body: [
          'A missing product image can happen before render when the product record has no media URL. A failed product image can happen after render when the URL exists but returns an error, times out, or points to an unsupported resource.',
          'Production code should handle both states. Pick the fallback URL before rendering when the source is empty, and keep an onerror or component-level error state for network and CDN failures.',
        ],
        code: `const productImageFallback =
  'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image';

function productImageSrc(src?: string | null) {
  return src && src.trim() ? src : productImageFallback;
}`,
      },
      {
        eyebrow: 'React and Next.js',
        title: 'Centralize product photo fallback behavior',
        body: [
          'For React storefronts, put fallback behavior in a ProductImage component instead of repeating onError logic across every card and carousel. That makes missing-src handling, failed-load handling, alt text, width, height, and placeholder labels consistent.',
          'For Next.js, keep the same principle but account for image configuration. If the fallback is an SVG URL, teams often use an unoptimized image for the fallback path or a plain img wrapper for the fallback state, depending on their security and optimization policy.',
        ],
        code: `import { useState } from 'react';

const fallbackSrc =
  'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image';

export function ProductImage({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  const initialSrc = src && src.trim() ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  return (
    <img
      src={currentSrc}
      width="800"
      height="800"
      alt={alt}
      loading="lazy"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Data quality',
        title: 'Do not let placeholders hide catalog problems',
        body: [
          'A fallback image should protect the customer experience, not erase the operational issue. If a supplier feed is missing photos or a CDN migration broke product media, the storefront should stay usable while your team can still detect and fix the catalog data.',
          'Track missing-image counts in imports, CMS validation, product QA, or frontend monitoring. Treat placeholder usage as a signal that product content needs attention.',
        ],
        cards: [
          { title: 'Import validation', body: 'Flag products created without primary media before they are published.' },
          { title: 'CDN monitoring', body: 'Log repeated image load failures so broken source paths can be corrected.' },
          { title: 'Merchandising QA', body: 'Review placeholder-heavy categories before campaigns, launches, and feed exports.' },
        ],
      },
      {
        eyebrow: 'SEO and accessibility',
        title: 'Keep placeholder SEO and alt text honest',
        body: [
          'Real product images matter for ecommerce discovery and shopper trust. A placeholder should not claim to be a product photo when the photo is missing. Keep the alt text tied to the product when the product is identifiable, but do not use a placeholder to imply unavailable visual detail.',
          'If the product image is missing, a generic visual label such as Product Image or Image Unavailable is safer than a fake descriptive image. The page should still expose real product names, prices, descriptions, and structured content elsewhere in the UI.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep placeholder URL text generic',
        body: [
          'Placeholder URL text can appear in browser history, server logs, CDN logs, analytics tools, error reports, screenshots, support tickets, and referrer data. Do not put private catalog or customer values in the URL.',
          'Avoid secrets, tokens, email addresses, customer names, account IDs, order numbers, regulated data, internal SKUs, supplier-only codes, or private merchandising notes. Use generic surface labels instead.',
        ],
        code: `// Good
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/600x400?text=Image+Unavailable

// Avoid putting private values in placeholder URL text`,
      },
      {
        eyebrow: 'Implementation',
        title: 'Roll out ecommerce placeholders safely',
        body: [
          'Start with the most visible product surfaces: collection grids, search results, product detail galleries, cart thumbnails, and checkout thumbnails. These are the places where broken images create the most visible user-facing damage.',
          'Then add placeholders to lower-risk areas such as admin previews, staging seed data, docs, and visual regression fixtures. Keep the same labels and dimensions across environments so QA sees the same missing-media states developers see.',
        ],
        cards: [
          { title: 'Audit image surfaces', body: 'List every product image size and ratio before choosing fallback URLs.' },
          { title: 'Define labels', body: 'Use Product Image, Product, Image Missing, or Image Unavailable rather than data-rich labels.' },
          { title: 'Add component tests', body: 'Test empty src and failed load paths in your product image component.' },
          { title: 'Monitor usage', body: 'Treat fallback usage as a content-quality signal, not just a frontend fix.' },
        ],
      },
      {
        eyebrow: 'fallback.pics',
        title: 'Use fallback.pics for deterministic product placeholders',
        body: [
          'fallback.pics works well for ecommerce placeholders because the URL is deterministic, readable, and easy to cache. You can paste the same URL into HTML, React components, Next.js fallbacks, CMS defaults, seed data, and documentation examples.',
          'Use the product image placeholder page for a concise landing-page reference, then use the implementation guides when you need stack-specific fallback behavior.',
        ],
        code: `Product image placeholder: https://fallback.pics/product-image-placeholder/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/
Dummy image generator: https://fallback.pics/dummy-image-generator/`,
      },
    ],
    takeaways: [
      'Product image placeholders are production UI states, not only mockup assets.',
      'Match fallback dimensions to the product surface so catalog grids, PDPs, carts, and checkout layouts stay stable.',
      'Handle empty media URLs before render and failed media loads after render.',
      'Use placeholders to protect shoppers while still tracking missing catalog media as a data-quality issue.',
      'Keep placeholder URL labels generic and free of private product, supplier, order, or customer data.',
    ],
    related: [
      'lorem-picsum-vs-svg-placeholder-images',
      'fix-broken-images-html-onerror',
      'nextjs-image-fallbacks-without-layout-shift',
    ],
  },
  {
    title: 'How to Prevent Layout Shift from Missing Images',
    description:
      'A practical performance guide for preventing image layout shift with dimensions, aspect ratios, placeholders, and stable fallback image URLs.',
    slug: 'prevent-layout-shift-missing-images',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Prevent+Image+Layout+Shift',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'Performance',
    tags: ['Image layout shift', 'CLS images', 'Core Web Vitals', 'Image placeholders'],
    summary: [
      'Missing images cause layout shift when the browser does not know how much space the image slot should occupy before the image loads or fails.',
      'The fix is a layout contract: set dimensions or aspect ratio first, then swap the real image and fallback image inside the same reserved box.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why missing images cause layout shift',
        body: [
          'Image layout shift happens when content moves after the page has already painted. Missing dimensions are a common cause: the browser lays out nearby text, buttons, or cards, then has to recalculate when the image finally loads or fails.',
          'A broken image fallback does not automatically fix CLS. If the fallback appears after the layout has already collapsed, users still see the page jump. The placeholder or fallback needs to live inside a reserved image slot from the start.',
        ],
        cards: [
          { title: 'Slow image load', body: 'The image eventually appears, but the page had no reserved height while it was downloading.' },
          { title: 'Failed image URL', body: 'The real image never appears, and the browser broken-image state leaves an unstable or inconsistent slot.' },
          { title: 'Missing image src', body: 'The product, avatar, article, or CMS record has no media URL, so the component renders without a stable box.' },
        ],
      },
      {
        eyebrow: 'Rule one',
        title: 'Always reserve the image box first',
        body: [
          'The most important rule is simple: reserve the final image space before fetching the image. Use width and height attributes on img elements when you know the intrinsic dimensions or intended ratio.',
          'Modern browsers use width and height attributes to infer the aspect ratio early in layout. CSS can still make the image responsive while the attributes provide the sizing hint that prevents the initial jump.',
        ],
        code: `<img
  src="/media/dashboard-preview.jpg"
  width="1200"
  height="630"
  alt="Dashboard preview"
  style="max-width: 100%; height: auto;"
/>`,
      },
      {
        eyebrow: 'CSS',
        title: 'Use aspect-ratio when the container controls the size',
        body: [
          'Some layouts do not know the exact rendered pixel size because the image depends on the card width, viewport, grid track, or parent container. In those cases, use CSS aspect-ratio on the wrapper or image surface.',
          'The key is to keep the real image and fallback image inside the same reserved box. The source can change, but the dimensions should not.',
        ],
        code: `.media-slot {
  aspect-ratio: 16 / 9;
  width: 100%;
  overflow: hidden;
  background: #f4f4f5;
}

.media-slot > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`,
      },
      {
        eyebrow: 'Fallback URL',
        title: 'Make the fallback match the same ratio',
        body: [
          'A fallback image should use the same dimensions or aspect ratio as the real image slot. If a 16:9 article image fails, use a 1200x630 or 1600x900 fallback. If a square product card fails, use a square fallback.',
          'fallback.pics URLs make that easy because the dimensions are visible in the URL. The fallback source becomes part of the layout contract instead of an arbitrary replacement image.',
        ],
        code: `// 16:9 article or social preview
https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Image+Unavailable

// Square product card
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// Avatar slot
https://fallback.pics/api/v1/avatar/96?text=User`,
      },
      {
        eyebrow: 'HTML',
        title: 'Prevent failed-image jumps with onerror',
        body: [
          'The HTML onerror pattern works when you need a direct fallback image without a framework. Keep the width and height on the original img element so the fallback replaces the source without changing the layout slot.',
          'Set this.onerror to null before replacing the source so a failed fallback URL does not create a retry loop.',
        ],
        code: `<img
  src="/media/article-cover.jpg"
  width="1200"
  height="630"
  alt="Article cover"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Image+Unavailable'"
/>`,
      },
      {
        eyebrow: 'React',
        title: 'Handle missing src before render and failed loads after render',
        body: [
          'A stable image component should handle two different states. If src is empty, render the fallback immediately. If src exists but fails to load, swap to the fallback while keeping the same width, height, or aspect-ratio wrapper.',
          'This prevents a common bug where empty data renders no image slot at all, while failed network loads use a different code path.',
        ],
        code: `import { useState } from 'react';

const fallbackSrc =
  'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Image+Unavailable';

export function StableImage({
  src,
  alt,
}: {
  src?: string | null;
  alt: string;
}) {
  const initialSrc = src && src.trim() ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  return (
    <img
      src={currentSrc}
      width="1200"
      height="630"
      alt={alt}
      loading="lazy"
      style={{ maxWidth: '100%', height: 'auto' }}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Next.js',
        title: 'Use width and height or a sized fill container',
        body: [
          'In Next.js, use width and height when the image dimensions are known. For responsive card images that use fill, size the parent container with aspect-ratio, width, and position relative so the image has a stable box.',
          'If your fallback is an SVG URL from fallback.pics, check your image optimization policy. Some teams use unoptimized for SVG fallback URLs, while others render a plain img for the fallback state.',
        ],
        code: `// Known dimensions
<Image
  src={src || fallbackSrc}
  width={1200}
  height={630}
  alt="Article cover"
/>

// Fill mode requires a sized parent
<div className="media-slot">
  <Image
    src={src || fallbackSrc}
    alt="Article cover"
    fill
    sizes="(min-width: 768px) 50vw, 100vw"
  />
</div>`,
      },
      {
        eyebrow: 'Skeletons',
        title: 'Separate loading placeholders from missing-image fallbacks',
        body: [
          'A skeleton placeholder is useful while the app is still fetching data or waiting for an image to load. A fallback image is useful after the app knows the image is missing or the image request failed.',
          'Both can prevent layout shift if they occupy the same reserved image slot. The difference is the message: skeleton means wait, fallback means the expected media is unavailable.',
        ],
        cards: [
          { title: 'Loading state', body: 'Use a skeleton or neutral placeholder while the data or image request is still pending.' },
          { title: 'Missing state', body: 'Use a labeled fallback such as Image Unavailable, Product Image, Article Image, or User.' },
          { title: 'Error state', body: 'Swap to the fallback inside the same slot after onerror, framework error state, or CDN failure detection.' },
        ],
      },
      {
        eyebrow: 'Audit',
        title: 'How to find image CLS problems',
        body: [
          'Start with Lighthouse, PageSpeed Insights, or Chrome DevTools performance traces to identify layout shifts. Then inspect shifted image surfaces and look for missing width, missing height, missing aspect-ratio, or conditionally rendered image wrappers.',
          'Do not only test the happy path. Test slow networks, empty image data, failed remote URLs, responsive breakpoints, product grids, article cards, avatars, hero images, and checkout or dashboard thumbnails.',
        ],
        cards: [
          { title: 'Unsized img', body: 'The image has no width and height attributes and no stable CSS aspect ratio.' },
          { title: 'Conditional wrapper', body: 'The component renders no media box until image data exists.' },
          { title: 'Mismatched fallback', body: 'The fallback image has a different ratio from the real image slot.' },
          { title: 'Framework fill misuse', body: 'The image uses fill, but the parent container has no stable dimensions.' },
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep fallback URL labels public',
        body: [
          'Fallback image URLs can be logged by browsers, CDNs, analytics tools, error trackers, and support systems. Use generic labels in the text parameter.',
          'Do not put secrets, tokens, email addresses, account IDs, order IDs, regulated data, customer names, private file names, or internal identifiers in placeholder URL text.',
        ],
        code: `// Good
https://fallback.pics/api/v1/1200x630?text=Image+Unavailable
https://fallback.pics/api/v1/800x800?text=Product+Image

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the broken image fallback page for production fallback behavior, then choose the stack-specific guide for HTML, React, or Next.js implementation details.',
          'Use the skeleton placeholder generator when the state is still loading, and use static fallback URLs when the media is missing or has failed.',
        ],
        code: `Broken image fallback: https://fallback.pics/broken-image-fallback/
Placeholder image API: https://fallback.pics/placeholder-image-api/
HTML guide: https://fallback.pics/guides/img-onerror-fallback/
React guide: https://fallback.pics/guides/react-image-fallback/
Next.js guide: https://fallback.pics/guides/nextjs-image-fallback/
Skeleton placeholder generator: https://fallback.pics/skeleton-placeholder-generator/
Product image placeholder: https://fallback.pics/product-image-placeholder/`,
      },
    ],
    takeaways: [
      'Prevent image layout shift by reserving the image slot before the image loads or fails.',
      'Use width and height attributes when dimensions are known, and CSS aspect-ratio when the container controls the rendered size.',
      'Make fallback image URLs match the same dimensions or ratio as the real image slot.',
      'Handle empty src before render and failed image requests after render.',
      'Use skeletons for loading states and labeled fallback images for missing or failed media states.',
    ],
    related: [
      'nextjs-image-fallbacks-without-layout-shift',
      'fix-broken-images-html-onerror',
      'react-image-fallback-patterns',
    ],
  },
  {
    title: 'Skeleton Placeholder Images: When to Use Skeletons vs Static Fallbacks',
    description:
      'A developer guide to skeleton placeholder images, loading placeholders, and static fallback images, with practical rules for choosing the right UI state.',
    slug: 'skeleton-placeholder-images-vs-static-fallbacks',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Skeleton+vs+Fallback',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'UX Patterns',
    tags: ['Skeleton placeholder generator', 'Skeleton image placeholder', 'Loading placeholder image', 'Skeleton loader image'],
    summary: [
      'Skeleton placeholder images are loading states. Static fallback images are missing-media or failed-media states. Mixing them makes interfaces harder to understand.',
      'Use skeletons when the app is still waiting for data or media, and use labeled fallback images when the app knows the expected image is unavailable.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Skeleton placeholders vs static fallbacks',
        body: [
          'Developers searching for skeleton placeholder images are usually trying to improve loading perception, prevent blank spaces, or keep layouts stable while content arrives. That is a different job from replacing a broken or missing image.',
          'A skeleton says wait. A static fallback says this media is unavailable. The visual state should tell the truth about what the application knows.',
        ],
        cards: [
          { title: 'Skeleton placeholder', body: 'Use while content, product data, avatars, thumbnails, or article cards are still loading.' },
          { title: 'Static fallback image', body: 'Use after an image src is empty, invalid, blocked, deleted, or fails to load.' },
          { title: 'Neutral placeholder', body: 'Use for mockups, seed data, documentation examples, or reserved layout slots.' },
        ],
      },
      {
        eyebrow: 'Loading state',
        title: 'Use skeletons while the final content is unknown',
        body: [
          'A skeleton screen should approximate the final layout before the real content is available. It gives users a sense of structure: where the image, title, text, metadata, and actions will appear.',
          'The skeleton should be derived from the loaded UI, not invented as a separate decorative layout. If the final card has a square image and two text rows, the skeleton should reserve a square image area and two text rows.',
        ],
        code: `<article class="product-card" aria-busy="true">
  <div class="skeleton skeleton-image" aria-hidden="true"></div>
  <div class="skeleton skeleton-title" aria-hidden="true"></div>
  <div class="skeleton skeleton-price" aria-hidden="true"></div>
</article>`,
      },
      {
        eyebrow: 'Missing state',
        title: 'Use static fallbacks when media is unavailable',
        body: [
          'Once the app knows the image is missing or the image request failed, stop showing a loading skeleton. A skeleton implies the image may still arrive. A labeled fallback image communicates the actual state.',
          'This is where fallback.pics fits: generate a stable image URL with the same dimensions as the real image slot and a generic label such as Product Image, Image Unavailable, Article Image, or User.',
        ],
        code: `<img
  src="/media/product-photo.jpg"
  width="800"
  height="800"
  alt="Product photo"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Decision guide',
        title: 'Choose the state by what the app knows',
        body: [
          'The right placeholder depends on state, not visual preference. Before choosing a skeleton, ask whether the app is still waiting for something. Before choosing a fallback, ask whether the app already knows the image will not be available.',
          'This keeps the interface honest and prevents skeleton loaders from becoming permanent gray boxes.',
        ],
        cards: [
          { title: 'Data request pending', body: 'Use a skeleton or loading placeholder that mirrors the final content shape.' },
          { title: 'Image request pending', body: 'Use a reserved image slot, optional low-key skeleton, and stable dimensions.' },
          { title: 'Source URL missing', body: 'Render a static fallback immediately instead of a loader.' },
          { title: 'Image load failed', body: 'Swap to a static fallback inside the same reserved slot.' },
        ],
      },
      {
        eyebrow: 'Layout',
        title: 'Keep skeletons and fallbacks in the same slot',
        body: [
          'Skeletons can help perceived performance, but only if they preserve the same layout as the final UI. A skeleton that uses a different height, ratio, or card structure can create its own layout shift when the content appears.',
          'Use the same aspect ratio for the loading skeleton, the real image, and the static fallback image.',
        ],
        code: `.image-slot {
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
  background: #f4f4f5;
}

.image-slot > img,
.image-slot > .skeleton {
  width: 100%;
  height: 100%;
  display: block;
}`,
      },
      {
        eyebrow: 'Generator',
        title: 'Use fallback.pics skeleton URLs for image-shaped loading states',
        body: [
          'Some teams want a URL-based skeleton image instead of hand-authored CSS. That can be useful in docs, Markdown, CMS previews, email-safe mockups, static prototypes, or systems where an image URL is easier to pass around than component markup.',
          'Use the skeleton placeholder generator for loading states and regular labeled fallback URLs for missing-media states.',
        ],
        code: `// Loading skeleton image
https://fallback.pics/api/v1/skeleton/800x800

// Missing product image fallback
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// Missing article image fallback
https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image`,
      },
      {
        eyebrow: 'React',
        title: 'Model loading, missing, and error states separately',
        body: [
          'A component with a single imageUrl prop often conflates three states: loading, missing, and failed. Split those states explicitly so the UI can choose the right visual treatment.',
          'This example renders a skeleton while data is loading, a static fallback when src is empty, and the same static fallback if the image request fails.',
        ],
        code: `import { useState } from 'react';

const fallbackSrc =
  'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image';
const skeletonSrc =
  'https://fallback.pics/api/v1/skeleton/800x800';

export function ProductImage({
  src,
  isLoading,
  alt,
}: {
  src?: string | null;
  isLoading: boolean;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  const requestedSrc = src && src.trim() ? src : null;
  const currentSrc = isLoading ? skeletonSrc : failed || !requestedSrc ? fallbackSrc : requestedSrc;

  return (
    <img
      src={currentSrc}
      width="800"
      height="800"
      alt={isLoading ? '' : alt}
      aria-hidden={isLoading ? 'true' : undefined}
      onError={() => {
        if (!isLoading && currentSrc !== fallbackSrc) setFailed(true);
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Accessibility',
        title: 'Do not announce decorative skeletons as content',
        body: [
          'Skeleton blocks are usually decorative because they do not contain real content. Hide purely visual skeleton elements from assistive technology and use aria-busy on the region that is loading when appropriate.',
          'Do not move focus into skeleton UI. If the user is waiting for a section to load, keep focus behavior predictable and replace the skeleton with real content or a real fallback state when the state resolves.',
        ],
        code: `<section aria-busy="true" aria-label="Product recommendations">
  <div class="product-grid-skeleton" aria-hidden="true">
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  </div>
</section>`,
      },
      {
        eyebrow: 'Motion',
        title: 'Keep shimmer animation optional and lightweight',
        body: [
          'Skeletons do not need heavy animation. A static skeleton is often enough. If you use shimmer, keep it subtle and respect reduced-motion preferences.',
          'Avoid expensive animation on large lists, dashboards, and mobile pages. The loader should not become the slowest part of the experience.',
        ],
        code: `@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}`,
      },
      {
        eyebrow: 'Anti-patterns',
        title: 'Do not use skeletons as permanent empty states',
        body: [
          'A skeleton that stays on screen after loading has failed is misleading. Users may keep waiting for content that will never arrive.',
          'Use skeletons for temporary waiting, empty states for valid absence, and fallback images for missing or failed media.',
        ],
        cards: [
          { title: 'Wrong', body: 'A product image skeleton remains visible because the product has no image.' },
          { title: 'Better', body: 'The product image slot switches to a Product Image fallback once the missing-media state is known.' },
          { title: 'Wrong', body: 'Every card shows an animated shimmer even when content is already available in HTML.' },
          { title: 'Better', body: 'Skeletons only render for pending client-side or lazy-loaded content.' },
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep generated placeholder labels generic',
        body: [
          'Generated image URLs can appear in logs, analytics, browser history, screenshots, and support tickets. Keep fallback text generic and public.',
          'Do not put secrets, tokens, email addresses, account IDs, order IDs, customer names, regulated data, internal IDs, or private file names in placeholder URL text.',
        ],
        code: `// Good fallback labels
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/1200x630?text=Article+Image
https://fallback.pics/api/v1/avatar/96?text=User

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the skeleton placeholder generator for loading-state URLs. Use the broken image fallback page and implementation guides for failed-media handling.',
          'If layout stability is the main issue, use the image layout shift guide before deciding whether the visual state should be skeleton, fallback, or both.',
        ],
        code: `Skeleton placeholder generator: https://fallback.pics/skeleton-placeholder-generator/
Broken image fallback: https://fallback.pics/broken-image-fallback/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
Placeholder image API: https://fallback.pics/placeholder-image-api/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Product image placeholder: https://fallback.pics/product-image-placeholder/`,
      },
    ],
    takeaways: [
      'Use skeleton placeholder images only while content or media is still loading.',
      'Use static fallback images when the image source is missing or the image request fails.',
      'Mirror the final layout so skeletons do not introduce layout shift when content appears.',
      'Hide decorative skeletons from assistive technology and respect reduced-motion preferences.',
      'Keep generated placeholder labels generic and free of private or regulated data.',
    ],
    related: [
      'prevent-layout-shift-missing-images',
      'react-image-fallback-patterns',
      'product-image-placeholder-ecommerce-catalogs',
    ],
  },
  {
    title: 'Avatar Placeholder Generator: Initials, Colors, and Accessibility',
    description:
      'A practical guide to initials-based avatar placeholders, readable colors, alt text, privacy-safe labels, and profile image fallback behavior.',
    slug: 'avatar-placeholder-generator-initials-colors-accessibility',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Avatar+Placeholder+Guide',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'UX Patterns',
    tags: ['Avatar placeholder generator', 'Initials avatar generator', 'User avatar placeholder', 'Profile image fallback'],
    summary: [
      'Initials-based avatar placeholders keep user interfaces readable when people have not uploaded profile photos or when remote avatar images fail.',
      'A production avatar fallback needs stable sizing, readable color contrast, privacy-safe initials, meaningful accessibility text, and consistent behavior across lists, comments, teams, and account menus.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'What an avatar placeholder generator should solve',
        body: [
          'Avatar placeholders are not just decorative circles. In SaaS apps, communities, dashboards, marketplaces, and internal tools, they help users scan people, teams, comments, authors, assignees, and account menus when profile images are unavailable.',
          'The useful version is predictable: same user, same initials, same dimensions, same fallback behavior. A profile image fallback should not resize a row, expose private user data, or become unreadable because of low-contrast colors.',
        ],
        cards: [
          { title: 'Missing profile photo', body: 'The user never uploaded an image, deleted it, or joined before profile setup was complete.' },
          { title: 'Failed remote avatar', body: 'The avatar URL exists but fails because of CDN, permissions, moderation, migration, or format issues.' },
          { title: 'Seed and demo data', body: 'Test accounts, screenshots, docs, and staging environments need stable user visuals without real photos.' },
        ],
      },
      {
        eyebrow: 'URL pattern',
        title: 'Generate initials avatars with fallback.pics',
        body: [
          'The fallback.pics avatar route is built for simple copy-paste image URLs. Use the avatar preset with a size and short text label for initials or a generic user fallback.',
          'Keep the text short. One or two characters is usually easiest to read in small UI surfaces such as comments, tables, nav bars, and notification menus.',
        ],
        code: `https://fallback.pics/api/v1/avatar/96?text=JD
https://fallback.pics/api/v1/avatar/128?text=AP
https://fallback.pics/api/v1/avatar/200?text=User

<img
  src="https://fallback.pics/api/v1/avatar/96?text=JD"
  width="96"
  height="96"
  alt="Jane Doe"
/>`,
      },
      {
        eyebrow: 'Initials',
        title: 'Use initials carefully',
        body: [
          'Initials work best when they help users recognize a person in context. For a name like Jane Doe, JD is readable. For single-name accounts, teams often use one character or a generic User fallback.',
          'Avoid exposing full names, email addresses, usernames, customer IDs, employee IDs, account IDs, or private handles in generated avatar URLs. URLs can be logged and shared outside the UI.',
        ],
        cards: [
          { title: 'Two-letter initials', body: 'Good for names with clear first and last parts, such as JD or AP.' },
          { title: 'One-letter fallback', body: 'Useful for compact interfaces or accounts with one display-name token.' },
          { title: 'Generic fallback', body: 'Use User, Team, or Member when identity should not be encoded in the URL.' },
        ],
        code: `// Initials for a public display context
https://fallback.pics/api/v1/avatar/96?text=JD

// Generic profile fallback
https://fallback.pics/api/v1/avatar/96?text=User

// Team or workspace fallback
https://fallback.pics/api/v1/avatar/96?text=Team`,
      },
      {
        eyebrow: 'Colors',
        title: 'Pick colors for readability, not novelty',
        body: [
          'Avatar colors need enough contrast for the initials to remain legible at small sizes. WCAG guidance treats text contrast as a readability requirement, and initials inside an avatar are still text from the user perspective.',
          'Use a small approved palette instead of unlimited random colors. That makes the UI feel consistent and avoids combinations where white initials sit on a pale background or dark initials sit on a saturated dark color.',
        ],
        code: `// High-contrast avatar examples
https://fallback.pics/api/v1/avatar/96/18181B/FFFFFF?text=JD
https://fallback.pics/api/v1/avatar/96/7C3AED/FFFFFF?text=AP
https://fallback.pics/api/v1/avatar/96/065F46/FFFFFF?text=TM`,
      },
      {
        eyebrow: 'Consistency',
        title: 'Keep avatar colors deterministic',
        body: [
          'If you assign colors from user data, make the color deterministic. The same person should not get a different avatar color every time a list renders.',
          'Use a stable public key such as an internal database id in application code to choose from an approved palette, but do not put that private id into the generated image URL text.',
        ],
        code: `const avatarPalette = [
  { bg: '18181B', fg: 'FFFFFF' },
  { bg: '7C3AED', fg: 'FFFFFF' },
  { bg: '065F46', fg: 'FFFFFF' },
  { bg: '1D4ED8', fg: 'FFFFFF' },
] as const;

function avatarColor(index: number) {
  return avatarPalette[index % avatarPalette.length];
}`,
      },
      {
        eyebrow: 'Fallback logic',
        title: 'Handle missing avatar src and failed avatar loads',
        body: [
          'Avatar fallback logic needs to handle two states. If there is no profile image URL, render the generated avatar immediately. If the profile image URL fails after render, swap to the generated avatar inside the same size box.',
          'Keep width and height fixed. Avatar fallbacks commonly appear in dense tables and comment threads, where even small shifts are distracting.',
        ],
        code: `<img
  src="/media/users/jane.jpg"
  width="96"
  height="96"
  alt="Jane Doe"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/avatar/96?text=JD'"
/>`,
      },
      {
        eyebrow: 'React',
        title: 'Use one avatar component across the app',
        body: [
          'Centralize avatar fallback behavior in one component so comments, team lists, user tables, account menus, and notifications do not each invent a different rule.',
          'The component should choose the generated avatar before render when src is missing, and switch to it after render when the real profile image fails.',
        ],
        code: `import { useState } from 'react';

function initialsAvatar(text: string) {
  const safeText = text.trim() || 'User';
  return 'https://fallback.pics/api/v1/avatar/96?text=' + encodeURIComponent(safeText);
}

export function UserAvatar({
  src,
  initials,
  name,
}: {
  src?: string | null;
  initials: string;
  name: string;
}) {
  const fallbackSrc = initialsAvatar(initials);
  const requestedSrc = src && src.trim() ? src : null;
  const [failed, setFailed] = useState(false);
  const currentSrc = failed || !requestedSrc ? fallbackSrc : requestedSrc;

  return (
    <img
      src={currentSrc}
      width="96"
      height="96"
      alt={name}
      onError={() => {
        if (currentSrc !== fallbackSrc) setFailed(true);
      }}
    />
  );
}`,
      },
      {
        eyebrow: 'Accessibility',
        title: 'Write alt text for the person, not the initials',
        body: [
          'If the avatar represents a person and conveys identity, the accessible name should identify the person. Do not make a screen reader announce JD when the useful label is Jane Doe.',
          'If the avatar is purely decorative because the person name appears immediately next to it, use empty alt text on an img or hide the visual avatar from assistive technology, depending on your component structure.',
        ],
        code: `<!-- Avatar conveys identity -->
<img
  src="https://fallback.pics/api/v1/avatar/96?text=JD"
  width="96"
  height="96"
  alt="Jane Doe"
/>

<!-- Name is adjacent, avatar is decorative -->
<img
  src="https://fallback.pics/api/v1/avatar/96?text=JD"
  width="96"
  height="96"
  alt=""
/>
<span>Jane Doe</span>`,
      },
      {
        eyebrow: 'Shape and size',
        title: 'Match avatar size to the interface',
        body: [
          'Small avatars work well in tables, comments, activity feeds, and compact nav. Larger avatars work for profile headers, settings pages, and team directories.',
          'Use the same generated size as the displayed slot when possible. If the UI displays a 96px avatar, use a 96px avatar URL and set width and height attributes.',
        ],
        cards: [
          { title: '32-40px', body: 'Dense tables, assignee chips, compact menus, and message metadata.' },
          { title: '48-64px', body: 'Comments, activity feeds, team lists, and user search results.' },
          { title: '96-200px', body: 'Profile settings, account pages, member cards, and documentation examples.' },
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep avatar URL text safe',
        body: [
          'Avatar URLs are not private. They can appear in browser history, CDN logs, analytics, screenshots, referrers, test snapshots, and support tickets.',
          'Do not place full names, email addresses, account IDs, order IDs, employee IDs, customer IDs, tokens, regulated data, or private usernames in generated avatar URL text. Use initials only when they are safe for the context, otherwise use User or Member.',
        ],
        code: `// Safer public labels
https://fallback.pics/api/v1/avatar/96?text=JD
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/avatar/96?text=Team

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the avatar placeholder generator page for quick copy-paste URLs, then use the React and Next.js fallback guides when avatars need component-level failure handling.',
          'If the main problem is layout stability, use the layout shift guide. If the avatar is still loading, use skeleton placeholders until the final state is known.',
        ],
        code: `Avatar placeholder generator: https://fallback.pics/avatar-placeholder-generator/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Broken image fallback: https://fallback.pics/broken-image-fallback/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
Skeleton placeholder generator: https://fallback.pics/skeleton-placeholder-generator/
Placeholder image API: https://fallback.pics/placeholder-image-api/`,
      },
    ],
    takeaways: [
      'Use initials avatar placeholders for missing profile photos, failed avatar URLs, test users, docs, and staging data.',
      'Keep initials short, readable, and privacy-safe; use User or Member when initials should not be exposed.',
      'Choose avatar foreground and background colors for contrast, not novelty.',
      'Write alt text for the person or entity represented, not for the visual initials.',
      'Centralize avatar fallback behavior in one reusable component.',
    ],
    related: [
      'react-image-fallback-patterns',
      'prevent-layout-shift-missing-images',
      'skeleton-placeholder-images-vs-static-fallbacks',
    ],
  },
  {
    title: 'SVG Placeholder Images: Why They Are Fast, Cacheable, and Scalable',
    description:
      'A technical guide to SVG placeholder images, deterministic URLs, CDN caching, browser caching, and when SVG placeholders beat raster or photo placeholders.',
    slug: 'svg-placeholder-images-fast-cacheable-scalable',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=SVG+Placeholder+Images',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Technical',
    tags: ['SVG placeholder image', 'SVG image placeholder', 'Cacheable placeholder image', 'Lightweight placeholder image'],
    summary: [
      'SVG placeholder images work well for deterministic fallback states because they are resolution-independent, text-based, easy to generate, and easy to cache.',
      'For product cards, avatars, docs, dashboards, skeletons, and image-unavailable states, SVG placeholders usually provide more control than random photos or raster-first dummy images.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why SVG works for placeholder images',
        body: [
          'A placeholder image is usually a simple visual state: a rectangle, background color, label, avatar, skeleton, or missing-image message. SVG is a natural fit because those shapes can be described directly instead of encoded as pixels.',
          'That does not mean SVG is always the best image format. Photos, detailed product renders, and complex textures belong in raster formats. SVG shines when the image is a controlled interface state.',
        ],
        cards: [
          { title: 'Deterministic state', body: 'The same URL can return the same placeholder for product, avatar, article, docs, or unavailable-image surfaces.' },
          { title: 'Resolution independence', body: 'Vector output can scale across common display densities without generating separate 1x, 2x, and 3x raster files.' },
          { title: 'Readable parameters', body: 'Dimensions, colors, and labels can be expressed in the URL and reused across HTML, React, Next.js, docs, and tests.' },
        ],
      },
      {
        eyebrow: 'Vector output',
        title: 'SVG is scalable by design',
        body: [
          'SVG stands for Scalable Vector Graphics. Instead of storing a fixed pixel grid, an SVG document describes shapes, text, fills, and other drawing instructions. That makes it useful for UI elements that need to remain crisp at different sizes.',
          'For placeholders, this avoids a common raster problem: generating a 400x300 PNG and then stretching it in a 1200px hero slot. With SVG, the placeholder can stay sharp as long as the layout uses the right dimensions and aspect ratio.',
        ],
        code: `https://fallback.pics/api/v1/400x300?text=Preview
https://fallback.pics/api/v1/1200x630?text=Article+Image
https://fallback.pics/api/v1/800x800?text=Product+Image`,
      },
      {
        eyebrow: 'Performance',
        title: 'SVG placeholders are lightweight when the image is simple',
        body: [
          'Simple placeholders are made of a few primitives: a background, a label, maybe a skeleton shape or avatar treatment. SVG can represent that kind of image compactly because it does not need to encode every pixel.',
          'The tradeoff is complexity. Very detailed SVGs with filters, masks, many paths, animation, or embedded assets can become heavy. For placeholder images, keep the SVG simple and predictable.',
        ],
        cards: [
          { title: 'Good SVG fit', body: 'Solid backgrounds, labels, avatar initials, skeleton blocks, diagrams, icons, and UI-like fallback states.' },
          { title: 'Poor SVG fit', body: 'Photographs, detailed textures, realistic product photos, and complex illustrations that should use raster formats.' },
          { title: 'Best practice', body: 'Keep generated placeholder SVGs simple enough to cache, inspect, and render quickly.' },
        ],
      },
      {
        eyebrow: 'Caching',
        title: 'Deterministic URLs make placeholders cacheable',
        body: [
          'A generated image is only production-friendly if the same request keeps producing the same response. Deterministic placeholder URLs make caching straightforward because the URL itself is the cache key.',
          'For example, every request for an 800x800 Product Image placeholder can use the same URL. Browsers and CDNs can reuse that response instead of regenerating or refetching it repeatedly.',
        ],
        code: `// Stable cache key for a product placeholder
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// Stable cache key for an avatar fallback
https://fallback.pics/api/v1/avatar/96?text=User

// Stable cache key for a skeleton placeholder
https://fallback.pics/api/v1/skeleton/1200x630`,
      },
      {
        eyebrow: 'Headers',
        title: 'Use cache headers that match immutable placeholder URLs',
        body: [
          'When a placeholder URL is immutable, long cache lifetimes make sense. The URL encodes the dimensions, colors, and label, so changing the placeholder means changing the URL.',
          'A production placeholder service can use browser cache headers and CDN cache headers to keep generated images close to users while avoiding unnecessary origin work.',
        ],
        code: `Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: max-age=31536000
Content-Type: image/svg+xml`,
      },
      {
        eyebrow: 'CDN',
        title: 'CDN caching works best with bounded URL patterns',
        body: [
          'Caching does not help if every request creates a unique URL. Avoid unbounded placeholder text and random query strings in production. Prefer a small set of repeated labels and dimensions.',
          'That is also better for privacy. A URL like Product Image or Image Unavailable is safer and more cacheable than a URL that contains private product names, emails, account IDs, or request-specific values.',
        ],
        cards: [
          { title: 'Good cache behavior', body: 'Repeated URLs for common surfaces such as 800x800 Product Image or 1200x630 Article Image.' },
          { title: 'Poor cache behavior', body: 'Unique URLs per user, request, product name, error id, timestamp, or session.' },
          { title: 'Operational rule', body: 'Use generic labels and a small set of standard dimensions for production fallback states.' },
        ],
      },
      {
        eyebrow: 'Security',
        title: 'Treat generated SVG as image output',
        body: [
          'SVG is XML-based and can be complex when used as inline markup or embedded documents. For generated placeholders, keep the output constrained: text labels, safe colors, simple shapes, and an image/svg+xml response intended for img src usage.',
          'Do not accept arbitrary raw SVG from users for placeholder generation. Treat user-controlled inputs as data that must be escaped and constrained, not as markup.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image"
  width="800"
  height="800"
  alt="Product image placeholder"
/>`,
      },
      {
        eyebrow: 'Fallback UX',
        title: 'SVG placeholders explain state better than random photos',
        body: [
          'Random photo placeholders can make mockups look realistic, but they are often wrong for production fallback states. If a product image, avatar, article cover, or dashboard preview is missing, the UI should communicate that state clearly.',
          'A labeled SVG placeholder can say Product Image, User, Article Image, Preview, or Image Unavailable. That is more honest than showing an unrelated photo.',
        ],
        code: `// Production fallback states
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/1200x630?text=Article+Image
https://fallback.pics/api/v1/600x400?text=Image+Unavailable`,
      },
      {
        eyebrow: 'Frameworks',
        title: 'Use SVG placeholders consistently in frontend components',
        body: [
          'In HTML, React, and Next.js, the SVG placeholder should replace the missing or failed image inside the same reserved layout slot. Keep width and height attributes or a stable aspect-ratio wrapper so the fallback does not create layout shift.',
          'For frameworks with image optimization pipelines, check how external SVG images are handled. Some teams use unoptimized for SVG fallback URLs or render a normal img for the fallback state.',
        ],
        code: `<img
  src="/media/article-cover.jpg"
  width="1200"
  height="630"
  alt="Article cover"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/1200x630?text=Article+Image'"
/>`,
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep SVG placeholder URLs generic',
        body: [
          'SVG placeholder URLs can appear in browser history, CDN logs, analytics, referrers, support tickets, screenshots, and test snapshots. Keep URL text public and generic.',
          'Do not put secrets, tokens, email addresses, user names, account IDs, order IDs, customer details, private product names, regulated data, or request identifiers in placeholder URL text.',
        ],
        code: `// Good
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/1200x630?text=Image+Unavailable

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the placeholder image API page for route syntax, then use the comparison and implementation guides for practical use cases.',
          'If you are choosing between random photos and SVG placeholders, use the Lorem Picsum comparison. If you are implementing fallback behavior, use the broken image fallback and framework guides.',
        ],
        code: `Placeholder image API: https://fallback.pics/placeholder-image-api/
Lorem Picsum vs SVG: https://fallback.pics/blog/lorem-picsum-vs-svg-placeholder-images/
Broken image fallback: https://fallback.pics/broken-image-fallback/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Avatar placeholder generator: https://fallback.pics/avatar-placeholder-generator/
Skeleton placeholder generator: https://fallback.pics/skeleton-placeholder-generator/`,
      },
    ],
    takeaways: [
      'SVG placeholder images are best for simple, deterministic UI states, not photographic content.',
      'Vector output scales cleanly across display sizes when the layout reserves the right dimensions.',
      'Stable placeholder URLs are easy for browsers and CDNs to cache.',
      'Use long cache lifetimes only when the placeholder URL fully describes the immutable output.',
      'Keep generated SVG inputs constrained, escaped, and free of private URL text.',
    ],
    related: [
      'lorem-picsum-vs-svg-placeholder-images',
      'placeholder-image-api-url-syntax-guide',
      'prevent-layout-shift-missing-images',
    ],
  },
  {
    title: 'Cache-Control for Placeholder Images: CDN and Browser Best Practices',
    description:
      'A technical guide to Cache-Control for placeholder images, covering immutable URLs, CDN caching, browser caching, cache keys, and production debugging.',
    slug: 'cache-control-placeholder-images-cdn-browser',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Cache-Control+for+Placeholders',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Technical',
    tags: ['Cache placeholder images', 'Image cache control', 'CDN placeholder images', 'Immutable image URLs'],
    summary: [
      'Placeholder images are good cache candidates when their URLs are deterministic, immutable, and free of request-specific data.',
      'Use Cache-Control and CDN cache headers to keep fallback images fast, but avoid unbounded query strings that create endless unique cache keys.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why placeholder image caching matters',
        body: [
          'Placeholder images often appear in repeated UI surfaces: product grids, avatar lists, documentation examples, staging fixtures, skeleton states, and image-unavailable fallbacks. If every one of those requests misses cache, a simple fallback system becomes unnecessary infrastructure noise.',
          'A good cache strategy makes placeholder URLs behave like static assets. The URL describes the output, the output does not change unexpectedly, and browsers or CDNs can reuse the response safely.',
        ],
        cards: [
          { title: 'Browser cache', body: 'Avoid repeat downloads for the same placeholder during page navigation and revisits.' },
          { title: 'CDN cache', body: 'Serve common fallback images from edge locations instead of repeatedly invoking origin generation.' },
          { title: 'Operational control', body: 'Keep cache keys bounded so analytics, logs, and cache storage stay manageable.' },
        ],
      },
      {
        eyebrow: 'Rule one',
        title: 'Cache only immutable placeholder URLs aggressively',
        body: [
          'Long cache lifetimes are safe when the URL fully describes the generated image. If the URL contains dimensions, colors, and text, changing the image means changing the URL.',
          'Do not use long immutable caching for endpoints where the same URL can return different output over time. Random images, user-personalized images, signed assets, or moderation-dependent assets need different caching rules.',
        ],
        code: `// Good immutable placeholder URL
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// If the output changes, change the URL
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image`,
      },
      {
        eyebrow: 'Headers',
        title: 'Use browser and CDN cache headers intentionally',
        body: [
          'For deterministic SVG placeholders, a long browser max-age plus immutable is reasonable because the URL is the version. A CDN-specific header can separately control edge cache behavior where your platform supports it.',
          'The exact header strategy depends on the infrastructure, but the principle is stable: cache stable placeholders for a long time and change the URL when the output should change.',
        ],
        code: `Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: max-age=31536000
Content-Type: image/svg+xml`,
      },
      {
        eyebrow: 'Directives',
        title: 'What the common Cache-Control directives mean',
        body: [
          'public allows shared caches such as CDNs to store the response. private limits storage to the browser cache and should not be used for public placeholder images you want served from a CDN.',
          'max-age controls freshness duration in seconds. immutable tells supporting browsers that the resource does not need revalidation during that freshness window. no-store means do not store the response at all.',
        ],
        cards: [
          { title: 'public', body: 'Use for generic placeholder images that are safe for browser and shared cache storage.' },
          { title: 'max-age', body: 'Use a long value for deterministic URLs and shorter values for outputs that may change.' },
          { title: 'immutable', body: 'Use only when a changed image will use a changed URL.' },
          { title: 'no-store', body: 'Use when a response contains private or sensitive data; placeholder URLs should avoid that data.' },
        ],
      },
      {
        eyebrow: 'Cache keys',
        title: 'Avoid unbounded placeholder query strings',
        body: [
          'CDNs and browsers cache by URL. If every request includes unique text, timestamps, IDs, names, or tracking parameters, each response becomes a different cache entry.',
          'That lowers cache hit rate and increases risk. It can also leak private values into logs, screenshots, referrers, and support systems.',
        ],
        code: `// Cache-friendly
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User

// Avoid request-specific placeholder URL text
https://fallback.pics/api/v1/800x800?text=Product+Image`,
      },
      {
        eyebrow: 'Standardization',
        title: 'Standardize dimensions and labels',
        body: [
          'A small set of standard placeholder URLs performs better than hundreds of near-duplicates. Product cards can share one square fallback, article previews can share one 1200x630 fallback, and user avatars can share a generic User fallback when initials are not safe.',
          'Standardization also makes design reviews and QA easier. Teams can recognize fallback states quickly instead of decoding one-off labels.',
        ],
        code: `// Product cards
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

// Article previews
https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image

// Generic avatars
https://fallback.pics/api/v1/avatar/96?text=User

// Missing media
https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Image+Unavailable`,
      },
      {
        eyebrow: 'CDN behavior',
        title: 'Separate browser TTL from edge TTL when needed',
        body: [
          'Some CDN platforms let you control browser cache lifetime separately from edge cache lifetime. That is useful when you want the CDN to keep an object longer than the browser, or when you want edge behavior tuned independently.',
          'For fallback.pics-style deterministic image URLs, browser and CDN TTLs can both be long. For generated outputs that might change, shorten the browser TTL or remove immutable so clients can revalidate sooner.',
        ],
        code: `// Same long-lived browser and CDN policy
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: max-age=31536000

// Shorter browser freshness, longer shared cache freshness
Cache-Control: public, max-age=3600
CDN-Cache-Control: max-age=86400`,
      },
      {
        eyebrow: 'Debugging',
        title: 'How to debug placeholder image caching',
        body: [
          'Start with response headers. Check Cache-Control, CDN-Cache-Control, Content-Type, status code, and CDN-specific cache status headers. Then make the same request twice and confirm whether the second request is served from cache.',
          'When debugging CDN behavior, remember that existing cached responses may continue using old headers until they expire or are purged. Test with a new deterministic URL when you need to verify a header change quickly.',
        ],
        code: `curl -I "https://fallback.pics/api/v1/800x800?text=Product+Image"

# Inspect:
# Cache-Control
# CDN-Cache-Control
# Content-Type
# CF-Cache-Status or equivalent CDN cache status`,
      },
      {
        eyebrow: 'Anti-patterns',
        title: 'Do not cache private or personalized placeholder data',
        body: [
          'Placeholder images should not contain secrets, tokens, email addresses, account IDs, order IDs, customer names, private product names, regulated data, session identifiers, or request IDs.',
          'If a response is personalized or private, it should not be a shared CDN-cached placeholder image. Keep private data in application state and use generic visual labels in placeholder URLs.',
        ],
        cards: [
          { title: 'Bad cache key', body: 'A placeholder URL that includes a user name, account id, timestamp, or request id.' },
          { title: 'Better cache key', body: 'A generic label such as User, Product Image, Article Image, Preview, or Image Unavailable.' },
          { title: 'Bad header match', body: 'public immutable caching on a response that can change without a URL change.' },
          { title: 'Better header match', body: 'Long caching only for deterministic URLs where the URL is the version.' },
        ],
      },
      {
        eyebrow: 'fallback.pics',
        title: 'Use fallback.pics URLs as stable cache keys',
        body: [
          'fallback.pics generated URLs are designed to be readable and deterministic. That makes them useful in production fallback states, docs, tests, CMS defaults, and framework components.',
          'Use the same URL wherever the same visual state is needed. Avoid adding tracking parameters or private labels that fragment cache keys.',
        ],
        code: `// One URL reused across product fallback states
const productFallback =
  'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image';

// One URL reused across unavailable article images
const articleFallback =
  'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image';`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the SVG placeholder article for why deterministic SVG output works well for cacheable fallback states. Use the API syntax guide when standardizing dimensions, colors, labels, avatars, and skeletons.',
          'For implementation behavior, use the broken image fallback guide and the React or Next.js framework guides.',
        ],
        code: `SVG placeholder images: https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Skeleton placeholder generator: https://fallback.pics/skeleton-placeholder-generator/`,
      },
    ],
    takeaways: [
      'Use long Cache-Control lifetimes only for deterministic placeholder URLs whose output changes only when the URL changes.',
      'Use public caching for generic placeholder images and avoid shared caching for private or personalized responses.',
      'Keep placeholder URL labels generic to improve cache hit rate and reduce privacy risk.',
      'Standardize common dimensions and labels so repeated UI states reuse the same cache keys.',
      'Debug caching with response headers, repeated requests, CDN cache status, and fresh test URLs.',
    ],
    related: [
      'svg-placeholder-images-fast-cacheable-scalable',
      'placeholder-image-api-url-syntax-guide',
      'prevent-layout-shift-missing-images',
    ],
  },
  {
    title: 'Building a Self-Hosted Placeholder Image API with Cloudflare Workers',
    description:
      'A practical tutorial for building a self-hosted SVG placeholder image API on Cloudflare Workers, with routing, escaping, cache headers, and production tradeoffs.',
    slug: 'self-hosted-placeholder-image-api-cloudflare-workers',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Self-Hosted+Placeholder+API',
    date: '2026-06-05',
    readTime: '13 min read',
    category: 'Technical',
    tags: ['Self hosted placeholder image API', 'Cloudflare Workers image API', 'SVG placeholder API', 'Build placeholder image API'],
    summary: [
      'A self-hosted placeholder image API can be built with a Cloudflare Worker that parses dimensions, generates constrained SVG, escapes text, and returns cacheable image responses.',
      'Self-hosting gives infrastructure control, but it also means owning validation, caching, abuse prevention, compatibility, monitoring, and framework documentation that fallback.pics already handles.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Should you self-host a placeholder image API?',
        body: [
          'Developers searching for a self-hosted placeholder image API usually want control: internal URLs, private infrastructure, predictable SVG output, custom colors, or a simple service for staging and docs.',
          'That is a valid path if your team is prepared to own the operational details. A placeholder API looks small, but production use quickly involves URL parsing, cache behavior, input escaping, rate limiting, monitoring, and framework-specific usage patterns.',
        ],
        cards: [
          { title: 'Self-host when', body: 'You need internal-only infrastructure, custom routing, strict platform ownership, or a learning project.' },
          { title: 'Use fallback.pics when', body: 'You want copy-paste placeholder URLs without maintaining a Worker, cache policy, docs, and abuse controls.' },
          { title: 'Hybrid path', body: 'Use fallback.pics in product apps and keep a tiny self-hosted worker for experiments or internal tooling.' },
        ],
      },
      {
        eyebrow: 'Architecture',
        title: 'The moving parts of a Worker-based SVG API',
        body: [
          'A minimal Cloudflare Workers placeholder API has four jobs: parse the request URL, validate dimensions and colors, generate safe SVG, and return a Response with image and cache headers.',
          'Keep the first version small. Add formats, presets, avatars, skeletons, analytics, and custom domains only after the core route is safe and cacheable.',
        ],
        code: `Request URL
  -> parse /api/v1/800x600
  -> validate width, height, colors, and text
  -> generate escaped SVG
  -> return image/svg+xml with cache headers`,
      },
      {
        eyebrow: 'Route shape',
        title: 'Use a predictable URL format',
        body: [
          'Start with a single deterministic route shape. The fallback.pics canonical generated image route is /api/v1/[width]x[height], with optional colors and text.',
          'Readable URL segments make it easier to debug cache keys and reuse the same placeholder across docs, fixtures, tests, and production fallback components.',
        ],
        code: `https://fallback.pics/api/v1/800x600
https://fallback.pics/api/v1/800x600/F4F4F5/18181B?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/skeleton/1200x630`,
      },
      {
        eyebrow: 'Worker code',
        title: 'A minimal Cloudflare Worker placeholder API',
        body: [
          'Cloudflare Workers receive requests in a fetch handler and return Web standard Response objects. That is enough for a basic SVG placeholder endpoint.',
          'This example is intentionally small. It supports /api/v1/800x600 and optional text, then returns deterministic SVG with long-lived cache headers.',
        ],
        code: `const dimensionPattern = /^\\/(?:api\\/v1\\/)?(\\d+)x(\\d+)$/;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function svg(width: number, height: number, text: string) {
  const label = escapeXml(text || width + ' x ' + height);
  const fontSize = Math.max(14, Math.min(width, height) * 0.1);

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
    '<rect width="100%" height="100%" fill="#7C3AED"/>' +
    '<text x="50%" y="50%" fill="#FFFFFF" font-family="system-ui" font-size="' + fontSize + '" text-anchor="middle" dominant-baseline="middle">' + label + '</text>' +
    '</svg>';
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(dimensionPattern);

    if (!match) {
      return new Response('Invalid placeholder route', { status: 400 });
    }

    const width = Number(match[1]);
    const height = Number(match[2]);

    if (width < 10 || height < 10 || width > 4000 || height > 4000) {
      return new Response('Invalid dimensions', { status: 400 });
    }

    const body = svg(width, height, url.searchParams.get('text') || '');

    return new Response(body, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'max-age=31536000',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};`,
      },
      {
        eyebrow: 'Validation',
        title: 'Validate dimensions and colors before generating SVG',
        body: [
          'Do not let arbitrary path segments become SVG markup. Treat all request input as data. Validate dimensions, restrict colors to known formats, and escape text before inserting it into an SVG response.',
          'Dimension limits also protect your service. A request for a tiny or enormous SVG should fail before generation.',
        ],
        code: `const maxSize = 4000;
const hexColorPattern = /^[0-9A-Fa-f]{6}$/;

function normalizeColor(value: string, fallback: string) {
  const cleaned = value.replace('#', '');
  return hexColorPattern.test(cleaned) ? '#' + cleaned : fallback;
}

function isValidSize(value: number) {
  return Number.isInteger(value) && value >= 10 && value <= maxSize;
}`,
      },
      {
        eyebrow: 'Escaping',
        title: 'Escape text labels every time',
        body: [
          'The text query parameter is the highest-risk part of a basic SVG placeholder API because it is user-controlled and appears inside XML. Escape it every time, even if you also limit length.',
          'Do not accept raw SVG, HTML, scripts, event handlers, or arbitrary attributes as API input. A placeholder API should generate markup from a constrained template.',
        ],
        code: `function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}`,
      },
      {
        eyebrow: 'Cache headers',
        title: 'Return SVG with cacheable image headers',
        body: [
          'A deterministic placeholder URL is a good candidate for long-lived caching. Use the URL as the version: if dimensions, colors, or label change, the URL changes.',
          'Set Content-Type to image/svg+xml and include nosniff. Use Cache-Control and CDN-Cache-Control when you want both browser and CDN caches to keep stable placeholders.',
        ],
        code: `headers: {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'public, max-age=31536000, immutable',
  'CDN-Cache-Control': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff'
}`,
      },
      {
        eyebrow: 'Cache API',
        title: 'Use the Worker Cache API only when you need manual control',
        body: [
          'For many placeholder APIs, response cache headers and normal CDN behavior are enough. The Workers Cache API is useful when you need programmatic cache reads, writes, purges, or custom cache keys.',
          'Manual cache code adds complexity. If you use it, remember that cache keys include the URL, and unique query strings can fragment the cache just as they do in normal CDN caching.',
        ],
      },
      {
        eyebrow: 'URL cardinality',
        title: 'Avoid unlimited unique placeholder URLs',
        body: [
          'A self-hosted API can accidentally create an unbounded cache problem. If users put product names, emails, IDs, timestamps, or request-specific labels into text, every request becomes a new cache key.',
          'For production fallback states, prefer generic labels such as Product Image, User, Article Image, Preview, and Image Unavailable.',
        ],
        code: `// Good repeated cache keys
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User

// Avoid request-specific URL text`,
      },
      {
        eyebrow: 'Production concerns',
        title: 'What self-hosting makes you responsible for',
        body: [
          'The basic Worker is only the start. If the API becomes part of product UI, you need monitoring, abuse protection, route compatibility, cache policy, CORS behavior, tests, docs, and migration rules.',
          'You also need to decide how to handle unsupported formats, invalid dimensions, transparent backgrounds, color contrast, accessibility labels, and framework-specific behavior for React, Next.js, CMS fields, and static docs.',
        ],
        cards: [
          { title: 'Reliability', body: 'Fallback images should be boring and available because they appear when other media fails.' },
          { title: 'Compatibility', body: 'Document how URLs work in img tags, Markdown, CMS fields, React components, and Next.js images.' },
          { title: 'Abuse prevention', body: 'Limit dimensions, text length, request methods, formats, and dynamic input surface.' },
          { title: 'Observability', body: 'Track error rates, top routes, cache misses, and unexpected high-cardinality query patterns.' },
        ],
      },
      {
        eyebrow: 'Decision',
        title: 'Self-hosted Worker vs fallback.pics',
        body: [
          'Self-hosting is useful when infrastructure control is the main requirement. You can own the domain, code, routing, headers, and deployment pipeline.',
          'fallback.pics is useful when the goal is to stop showing broken images quickly. It gives you deterministic /api/v1 URLs, SVG placeholders, avatars, skeleton states, docs, and framework guides without maintaining a Worker.',
        ],
        cards: [
          { title: 'Choose self-hosting', body: 'For internal-only networks, custom compliance requirements, unusual routing, or platform-learning projects.' },
          { title: 'Choose fallback.pics', body: 'For production fallback states, docs, demos, tests, product placeholders, avatars, and quick integration.' },
          { title: 'Use both', body: 'Prototype self-hosting while keeping fallback.pics as the stable implementation path for product surfaces.' },
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the self-hosted landing page if you want the shorter product overview. Use the SVG and Cache-Control articles for the two most important technical foundations.',
          'For implementation in apps, use the HTML, React, and Next.js fallback guides.',
        ],
        code: `Self-hosted placeholder API: https://fallback.pics/self-hosted-placeholder-image-api/
SVG placeholder images: https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/
Cache-Control guide: https://fallback.pics/blog/cache-control-placeholder-images-cdn-browser/
Placeholder image API: https://fallback.pics/placeholder-image-api/
Broken image fallback: https://fallback.pics/broken-image-fallback/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/`,
      },
    ],
    takeaways: [
      'A self-hosted placeholder API needs routing, validation, XML escaping, SVG generation, and cache headers.',
      'Do not accept arbitrary raw SVG or unescaped user-controlled text.',
      'Use deterministic URLs and long cache headers only when the URL fully describes the immutable output.',
      'Self-hosting gives control but also creates maintenance, monitoring, documentation, and abuse-prevention responsibilities.',
      'fallback.pics is the lower-maintenance option when you just need reliable generated fallback image URLs.',
    ],
    related: [
      'svg-placeholder-images-fast-cacheable-scalable',
      'cache-control-placeholder-images-cdn-browser',
      'placeholder-image-api-url-syntax-guide',
    ],
  },
  {
    title: 'Placeholder Images in Storybook, Playwright, and Visual Regression Tests',
    description:
      'A testing workflow guide for deterministic placeholder image URLs in Storybook stories, Playwright screenshots, visual regression tests, fixtures, and CI.',
    slug: 'placeholder-images-storybook-playwright-visual-regression',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Test+Placeholder+Images',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Testing',
    tags: ['Test placeholder images', 'Storybook placeholder image', 'Playwright image placeholder', 'Visual regression placeholder'],
    summary: [
      'Visual tests are only useful when screenshots change because the UI changed, not because image fixtures, random photos, or remote media changed.',
      'Deterministic placeholder image URLs give Storybook, Playwright, and visual regression tests stable image surfaces for cards, avatars, product grids, docs, and fallback states.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why test placeholder images should be deterministic',
        body: [
          'Storybook stories and visual regression tests often need image content before real assets exist. The problem is not filling the box. The problem is filling it the same way every time the test runs.',
          'A random photo, expired CDN image, or fixture that changes between runs can create screenshot noise. A deterministic placeholder URL keeps the visual fixture stable so diffs point to real UI changes.',
        ],
        cards: [
          { title: 'Stable screenshots', body: 'The same placeholder renders across local runs, CI, branches, and baseline updates.' },
          { title: 'Layout coverage', body: 'Cards, avatars, grids, banners, and media slots still exercise real dimensions and aspect ratios.' },
          { title: 'Readable state', body: 'Labels such as Product Image, User, Article Image, or Preview explain what the slot represents.' },
        ],
      },
      {
        eyebrow: 'Storybook',
        title: 'Use placeholder URLs in Storybook args',
        body: [
          'Storybook stories should use stable data. Put deterministic placeholder URLs in args, fixtures, or mock data instead of relying on remote production images.',
          'Use dimensions that match the component. A product card story should use a square placeholder if the real product media is square. A blog card should use a 1200x630 placeholder if the component expects an OG-style image.',
        ],
        code: `export const ProductCardStory = {
  args: {
    title: 'Everyday Backpack',
    imageUrl: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  },
};

export const ArticleCardStory = {
  args: {
    title: 'Release notes',
    imageUrl: 'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image',
  },
};`,
      },
      {
        eyebrow: 'Fixtures',
        title: 'Standardize image fixtures by surface',
        body: [
          'Test data gets easier to maintain when each image surface has a standard placeholder URL. Use one product image URL, one avatar URL, one article image URL, and one dashboard preview URL instead of inventing new labels per test.',
          'This reduces screenshot churn and helps reviewers understand what a placeholder means at a glance.',
        ],
        code: `export const imageFixtures = {
  product: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  avatar: 'https://fallback.pics/api/v1/avatar/96?text=User',
  article: 'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image',
  dashboard: 'https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Preview',
};`,
      },
      {
        eyebrow: 'Playwright',
        title: 'Use deterministic placeholders before taking screenshots',
        body: [
          'Playwright visual comparisons create or compare screenshots. If image content varies, tests can fail even when layout and component behavior are correct.',
          'Use stable fixture data before calling toHaveScreenshot. For pages that load image URLs from APIs, mock the API response so the browser receives deterministic placeholder URLs.',
        ],
        code: `import { test, expect } from '@playwright/test';

test('product grid visual state', async ({ page }) => {
  await page.route('**/api/products', async route => {
    await route.fulfill({
      json: [
        {
          name: 'Everyday Backpack',
          imageUrl: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
        },
      ],
    });
  });

  await page.goto('/products');
  await expect(page).toHaveScreenshot('product-grid.png');
});`,
      },
      {
        eyebrow: 'Network mocking',
        title: 'Mock image requests when the app cannot change fixture URLs',
        body: [
          'Sometimes a page under test still points to production image URLs. If you cannot change the fixture data, intercept image requests in Playwright and fulfill them with a deterministic SVG body.',
          'This is useful for visual tests where layout matters but the real image content does not.',
        ],
        code: `const svgBody =
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">' +
  '<rect width="100%" height="100%" fill="#F4F4F5"/>' +
  '<text x="50%" y="50%" fill="#18181B" font-size="64" text-anchor="middle" dominant-baseline="middle">Product Image</text>' +
  '</svg>';

await page.route('**/*', async route => {
  if (route.request().resourceType() === 'image') {
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: svgBody,
    });
    return;
  }

  await route.continue();
});`,
      },
      {
        eyebrow: 'Visual regression',
        title: 'Reduce screenshot noise before tuning thresholds',
        body: [
          'Do not start by raising visual diff thresholds. First remove avoidable sources of noise: random images, timestamps, animations, inconsistent fonts, live remote media, ads, and user-specific data.',
          'Deterministic placeholder URLs help with one of the most common noise sources: image content that should not be part of the assertion.',
        ],
        cards: [
          { title: 'Control inputs', body: 'Mock API data, image URLs, dates, locale, theme, and feature flags before taking screenshots.' },
          { title: 'Freeze media', body: 'Use deterministic placeholders for image slots that are not the subject of the test.' },
          { title: 'Assert the right thing', body: 'Use visual snapshots for layout and appearance, not unpredictable remote content.' },
        ],
      },
      {
        eyebrow: 'States',
        title: 'Test loading, missing, and failed-image states separately',
        body: [
          'A component can look correct with a normal image and still break when the image is missing or fails to load. Add separate stories or tests for each state.',
          'Use skeleton placeholders for loading states, static labeled placeholders for known missing media, and failed-load tests to verify fallback behavior.',
        ],
        code: `export const Loading = {
  args: {
    imageUrl: 'https://fallback.pics/api/v1/skeleton/800x800',
  },
};

export const MissingImage = {
  args: {
    imageUrl: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  },
};

export const FailedImage = {
  args: {
    imageUrl: '/broken-product-image.jpg',
    fallbackUrl: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  },
};`,
      },
      {
        eyebrow: 'CI',
        title: 'Keep CI baselines portable',
        body: [
          'Visual tests can still vary by operating system, browser version, fonts, antialiasing, and viewport. Deterministic image placeholders do not solve every visual testing problem, but they remove one major source of variance.',
          'Run screenshot tests in a consistent environment and commit baseline updates intentionally. The placeholder URL should not change unless the visual state being tested changes.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep test placeholder URLs free of private data',
        body: [
          'Test artifacts are often shared widely: CI logs, HTML reports, trace files, screenshots, pull requests, and bug reports. Treat placeholder URLs in tests as public.',
          'Do not put secrets, tokens, email addresses, customer names, account IDs, order IDs, private product names, regulated data, or internal identifiers in placeholder URL text.',
        ],
        code: `// Good test labels
https://fallback.pics/api/v1/800x800?text=Product+Image
https://fallback.pics/api/v1/avatar/96?text=User
https://fallback.pics/api/v1/1200x630?text=Article+Image

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the placeholder image API guide for URL syntax, then use the layout shift and framework guides to make image states production-safe.',
          'Use the skeleton guide when deciding whether a visual state should represent loading, missing media, or a failed image.',
        ],
        code: `Placeholder image API: https://fallback.pics/placeholder-image-api/
Skeleton placeholder guide: https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
SVG placeholder images: https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/
Cache-Control guide: https://fallback.pics/blog/cache-control-placeholder-images-cdn-browser/`,
      },
    ],
    takeaways: [
      'Use deterministic placeholder URLs in Storybook stories, fixtures, and screenshot tests.',
      'Mock API responses or image requests in Playwright when live media would make screenshots noisy.',
      'Standardize placeholder URLs by surface: product, avatar, article, dashboard, skeleton, and missing media.',
      'Test normal, loading, missing, and failed-image states separately.',
      'Keep placeholder URL labels generic because screenshots, traces, and CI reports are often shared.',
    ],
    related: [
      'placeholder-image-api-url-syntax-guide',
      'skeleton-placeholder-images-vs-static-fallbacks',
      'prevent-layout-shift-missing-images',
    ],
  },
  {
    title: 'CSS Background Image Fallbacks: Practical Patterns and Limitations',
    description:
      'A practical guide to CSS background image fallbacks, including layered backgrounds, placeholder URLs, JavaScript detection, component state, and when to use img instead.',
    slug: 'css-background-image-fallbacks',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=CSS+Background+Fallbacks',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'Implementation',
    tags: ['CSS background image fallback', 'Background image placeholder', 'CSS image fallback', 'Broken background image'],
    summary: [
      'CSS background images do not have an onerror event, so fallback behavior is different from normal img elements.',
      'Use background color and layered backgrounds for visual backup, but use component state, JavaScript preloading, or an actual img element when you need to detect failed image URLs.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Why CSS background image fallbacks are different',
        body: [
          'Developers searching for CSS background image fallbacks usually want the same behavior they get with img onerror: if the main image fails, show another image. CSS does not expose that failure event directly.',
          'That means CSS-only patterns are limited. You can layer a fallback visual behind the main background or use a background color, but you cannot ask CSS to run logic when the first URL fails.',
        ],
        cards: [
          { title: 'CSS can layer backgrounds', body: 'Multiple background images can be stacked, with the first listed layer painted on top.' },
          { title: 'CSS can provide a color', body: 'A background color gives the element a visible base even when the image is unavailable.' },
          { title: 'CSS cannot handle errors', body: 'There is no background-image onerror event equivalent in CSS.' },
        ],
      },
      {
        eyebrow: 'CSS-only',
        title: 'Start with a fallback background color',
        body: [
          'The simplest fallback is a background color. It will not replace the missing image with another image, but it prevents transparent or visually broken empty space.',
          'This is useful for decorative hero sections, cards, profile headers, dashboard tiles, and any surface where the background image is not essential content.',
        ],
        code: `.hero-card {
  min-height: 320px;
  background-color: #f4f4f5;
  background-image: url('/media/hero.jpg');
  background-size: cover;
  background-position: center;
}`,
      },
      {
        eyebrow: 'Layering',
        title: 'Layer a placeholder behind the real background image',
        body: [
          'CSS supports multiple backgrounds. The first background is painted on top, and later backgrounds sit behind it. You can put the real image first and a placeholder URL behind it.',
          'This helps when the top image has transparency or fails to paint, but it is not a true error handler. Browsers still evaluate the declared background layers as CSS background images.',
        ],
        code: `.product-tile {
  aspect-ratio: 1 / 1;
  background-image:
    url('/media/products/backpack.jpg'),
    url('https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image');
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
}`,
      },
      {
        eyebrow: 'Limitations',
        title: 'Know what layered CSS fallbacks do not solve',
        body: [
          'Layered backgrounds are useful as a visual backup, but they do not give your app a reliable loaded or failed state. CSS does not tell your component whether the primary background URL succeeded.',
          'If the image state matters for analytics, accessibility, UI copy, skeleton transitions, retries, or error handling, move the image decision into JavaScript or component state.',
        ],
        cards: [
          { title: 'No error event', body: 'CSS cannot run fallback logic when a background URL returns 404 or fails to decode.' },
          { title: 'No alt text', body: 'Background images are not content images and do not provide image alt text.' },
          { title: 'No retry state', body: 'You cannot switch from loading to failed to fallback with CSS alone.' },
        ],
      },
      {
        eyebrow: 'Component pattern',
        title: 'Set the background URL from component state',
        body: [
          'For production UI, a better pattern is to decide the background image URL in the component. If the data has no image URL, use the fallback immediately.',
          'This handles missing source data before render. To detect failed loads after render, preload the image in JavaScript or use an actual img element when possible.',
        ],
        code: `const fallbackBackground =
  'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Image+Unavailable';

function backgroundImage(src?: string | null) {
  const imageUrl = src && src.trim() ? src : fallbackBackground;
  return { backgroundImage: 'url("' + imageUrl + '")' };
}`,
      },
      {
        eyebrow: 'Preload',
        title: 'Use JavaScript preloading when failure detection matters',
        body: [
          'If the design requires a CSS background but the app needs to know whether the image failed, preload the image with JavaScript. Set the CSS background to the real URL only after the image loads, and use the fallback URL on error.',
          'This adds complexity, so reserve it for cases where the image truly needs to remain a CSS background.',
        ],
        code: `function loadBackground(src: string, fallback: string, apply: (url: string) => void) {
  const image = new Image();
  image.onload = () => apply(src);
  image.onerror = () => apply(fallback);
  image.src = src;
}`,
      },
      {
        eyebrow: 'Prefer img',
        title: 'Use img when the image is content',
        body: [
          'If the image communicates product identity, article content, user identity, documentation meaning, or anything a user needs to understand, use an img element instead of a CSS background.',
          'An img can provide alt text, width and height, loading behavior, and an onerror fallback. CSS background images are better for decorative surfaces.',
        ],
        code: `<img
  src="/media/article-cover.jpg"
  width="1200"
  height="630"
  alt="Article cover"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Article+Image'"
/>`,
      },
      {
        eyebrow: 'Responsive layout',
        title: 'Reserve the background image slot',
        body: [
          'Background image fallbacks still need stable dimensions. Use aspect-ratio, min-height, or explicit layout constraints so the element does not collapse when the image is missing.',
          'A fallback color or placeholder URL cannot prevent layout shift if the element has no reserved size.',
        ],
        code: `.media-background {
  aspect-ratio: 16 / 9;
  width: 100%;
  background-color: #f4f4f5;
  background-image: url('https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Preview');
  background-size: cover;
  background-position: center;
}`,
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep background placeholder URLs generic',
        body: [
          'Background image URLs can appear in CSS, browser devtools, network logs, CDN logs, screenshots, referrers, and support tickets. Treat placeholder URL text as public.',
          'Do not put secrets, tokens, email addresses, customer names, account IDs, order IDs, private product names, regulated data, or internal identifiers in placeholder URL text.',
        ],
        code: `// Good
https://fallback.pics/api/v1/1200x630?text=Image+Unavailable
https://fallback.pics/api/v1/800x800?text=Product+Image

// Keep private values out of URL text`,
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the broken image fallback page for img onerror behavior, then use the framework guides when image fallback logic belongs in React or Next.js components.',
          'Use the layout shift guide when the main issue is reserving stable space for background or content images.',
        ],
        code: `Broken image fallback: https://fallback.pics/broken-image-fallback/
HTML img onerror guide: https://fallback.pics/guides/img-onerror-fallback/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Prevent image layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
Placeholder image API: https://fallback.pics/placeholder-image-api/
SVG placeholder images: https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/`,
      },
    ],
    takeaways: [
      'CSS background images do not have an onerror event like img elements.',
      'Use background-color and layered backgrounds for CSS-only visual backup.',
      'Use JavaScript or component state when you need to detect failed background image loads.',
      'Use img instead of background-image when the image is meaningful content or needs alt text.',
      'Keep background placeholder URL labels generic and free of private data.',
    ],
    related: [
      'fix-broken-images-html-onerror',
      'react-image-fallback-patterns',
      'prevent-layout-shift-missing-images',
    ],
  },
  {
    title: 'Responsive Placeholder Images for Cards, Banners, and Grids',
    description:
      'Use responsive placeholder images for cards, banners, hero slots, and grids without causing layout shift or inconsistent media boxes.',
    slug: 'responsive-placeholder-images-cards-banners-grids',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Responsive+Placeholders',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'Implementation',
    tags: ['Responsive placeholder image', 'Banner placeholder image', 'Card image placeholder', 'Image placeholder sizes'],
    summary: [
      'Responsive placeholders work best when the placeholder ratio matches the final media slot before the image loads or fails.',
      'Use width and height attributes, CSS aspect-ratio, and standardized fallback.pics URLs for cards, banners, heroes, and grids.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Responsive placeholders are layout contracts',
        body: [
          'A responsive placeholder image is not just a temporary graphic. It is a layout contract for the image slot while the real media is missing, loading, or unavailable.',
          'Cards, banners, hero slots, product grids, and related-post modules all need different image geometry. A single generic placeholder size will eventually crop badly, stretch, or create uneven rows.',
        ],
        cards: [
          { title: 'Cards', body: 'Use 16:9, 4:3, or square fallbacks that match the card design.' },
          { title: 'Banners', body: 'Use wide fallbacks that reserve the hero or campaign slot without pushing content around.' },
          { title: 'Grids', body: 'Use one ratio per repeated row so missing media does not make tiles uneven.' },
        ],
      },
      {
        eyebrow: 'Sizing',
        title: 'Choose the aspect ratio first',
        body: [
          'Start with the shape of the final media, then choose pixel dimensions. A product image grid usually wants square fallbacks. Article cards often use 16:9 or 1200x630. Marketplace previews may use 4:3.',
          'The fallback.pics URL should describe the rendered slot, not the original source asset. That keeps the UI stable even when upstream images come from different providers.',
        ],
        code: `Square product tile:
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

Article card:
https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Article+Image

Wide banner:
https://fallback.pics/api/v1/banner/1200x400/7C3AED/FFFFFF?text=Banner+Image`,
      },
      {
        eyebrow: 'Implementation',
        title: 'Reserve space in HTML and CSS',
        body: [
          'Browsers can infer image ratio from width and height attributes before the image finishes loading. For responsive cards and grids, add a CSS aspect-ratio box so the media area has stable geometry.',
          'Use the same dimensions on the real image and fallback image. The CSS can still scale the image fluidly while preserving the reserved ratio.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Article+Image"
  width="800"
  height="450"
  alt="Article image"
  loading="lazy"
  decoding="async"
/>

.card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`,
      },
      {
        eyebrow: 'Frameworks',
        title: 'Centralize responsive fallback URLs',
        body: [
          'Avoid inventing a fallback URL in every component. Define a small map by surface type so cards, banners, grids, avatars, and previews stay consistent.',
          'Use generic labels in the URL text. The visible page can still show the specific product, article, or account name next to the image when that is appropriate.',
        ],
        code: `const responsiveFallbacks = {
  product: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  article: 'https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Article+Image',
  banner: 'https://fallback.pics/api/v1/banner/1200x400/7C3AED/FFFFFF?text=Banner+Image',
} as const;`,
      },
      {
        eyebrow: 'QA',
        title: 'Test fallbacks across breakpoints',
        body: [
          'A responsive placeholder strategy is not finished until it has been checked on the layouts that use it. Test mobile cards, tablet grids, desktop banners, and wide hero slots.',
          'Watch for cropped labels, row height jumps, blurry stretched images, and fallback states that cover important content.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep responsive labels generic',
        body: [
          'Placeholder URLs can appear in markup, CMS fields, logs, analytics, screenshots, and bug reports. Use public-safe labels such as Product Image, Article Image, Preview, Banner Image, or Image Unavailable.',
          'Do not put secrets, tokens, email addresses, order IDs, account IDs, private customer values, private product names, or regulated data in URL text.',
        ],
      },
      {
        eyebrow: 'Internal links',
        title: 'Where to go next',
        body: [
          'Use the layout shift guide for the performance foundation, then use the framework guides when fallback behavior belongs in React or Next.js components.',
          'For product-heavy surfaces, pair this guide with the ecommerce placeholder strategy so catalog grids, detail pages, and recommendations all use consistent media geometry.',
        ],
        code: `Prevent layout shift: https://fallback.pics/blog/prevent-layout-shift-missing-images/
React image fallback: https://fallback.pics/guides/react-image-fallback/
Next.js image fallback: https://fallback.pics/guides/nextjs-image-fallback/
Product placeholders: https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
Skeleton placeholders: https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/`,
      },
    ],
    takeaways: [
      'Choose the placeholder aspect ratio before choosing pixel dimensions.',
      'Use width and height attributes or CSS aspect-ratio so the browser can reserve space.',
      'Standardize fallback URLs by surface type: product, article, preview, avatar, banner, and skeleton.',
      'Test placeholders on mobile, tablet, desktop, and failure states.',
      'Keep URL text generic and free of private data.',
    ],
    related: [
      'prevent-layout-shift-missing-images',
      'product-image-placeholder-ecommerce-catalogs',
      'skeleton-placeholder-images-vs-static-fallbacks',
    ],
  },
  {
    title: 'OG Image Placeholders for Blogs, Docs, and Social Sharing',
    description:
      'Use generated OG image placeholders for blog posts, documentation pages, changelogs, and social previews while final artwork is unavailable.',
    slug: 'og-image-placeholders-blogs-docs-social-sharing',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=OG+Image+Placeholders',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'Content Workflows',
    tags: ['OG image placeholder', 'Open Graph image placeholder', 'Social image placeholder', 'Blog image placeholder'],
    summary: [
      'An OG image placeholder gives blogs, docs, changelogs, and landing pages a reliable social preview before final artwork exists.',
      'Use an absolute HTTPS image URL, keep the default canvas near 1200x630, and keep the label readable at thumbnail sizes.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'OG placeholders keep publishing moving',
        body: [
          'Teams often publish useful pages before final artwork is ready. A documentation page may need a stable preview in Slack. A blog post may need a social card before design has time to create a custom image.',
          'An OG image placeholder solves that gap. It avoids blank, broken, misleading, or inconsistent link previews while keeping the page publishable.',
        ],
      },
      {
        eyebrow: 'Metadata',
        title: 'Set the preview image in page metadata',
        body: [
          'Open Graph metadata tells crawlers and social platforms which image to use when a URL is shared. The image URL should be absolute, public, and fetchable without authentication.',
          'Add width and height metadata when your template supports it so preview tools have a clear image contract.',
        ],
        code: `<meta property="og:title" content="API Release Notes" />
<meta property="og:description" content="New API routes and examples." />
<meta property="og:url" content="https://example.com/blog/api-release-notes/" />
<meta
  property="og:image"
  content="https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=API+Release+Notes"
/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />`,
      },
      {
        eyebrow: 'Size',
        title: 'Use 1200x630 as the default canvas',
        body: [
          'For general blog, docs, and social sharing pages, 1200x630 is a practical default. It is close to the common 1.91:1 link-preview ratio and gives enough resolution for high-density displays.',
          'Keep important text near the center because preview crops can vary by platform, app, and viewport.',
        ],
        code: `Article placeholder:
https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Article+Image

Release notes placeholder:
https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Release+Notes

Documentation placeholder:
https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Documentation`,
      },
      {
        eyebrow: 'Static sites',
        title: 'Generate OG placeholders from frontmatter',
        body: [
          'Static site generators usually store title, description, slug, and image in frontmatter or data files. A generated fallback.pics URL can be the default when a post does not define a custom image.',
          'Use a public-safe category or content type for the text parameter. Avoid automatically inserting private draft titles, customer names, or unreleased feature names into URLs.',
        ],
        code: `function socialImageForPost(post: { image?: string; category: string }) {
  if (post.image) return post.image;

  const label = encodeURIComponent(post.category + ' Article');
  return 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=' + label;
}`,
      },
      {
        eyebrow: 'Validation',
        title: 'Check the rendered link preview before launch',
        body: [
          'An OG image URL can be present and still fail in a real preview. The image might be blocked, too slow, redirected unexpectedly, cached from a previous version, or cropped poorly.',
          'Before launch, open the image URL directly, inspect the page metadata, and test the URL in the chat or social tools your audience actually uses.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Do not put private values in OG placeholder URLs',
        body: [
          'OG image URLs are public by design. Crawlers fetch them, social platforms cache them, and users can inspect them from page source, browser devtools, link previews, screenshots, and shared messages.',
          'Never put secrets, tokens, emails, customer names, account IDs, order IDs, private product names, unreleased sensitive roadmap details, regulated data, or internal identifiers in placeholder URL text.',
        ],
      },
    ],
    takeaways: [
      'Use OG image placeholders when final social artwork is unavailable but the page is ready to publish.',
      'Use an absolute HTTPS fallback.pics URL and a practical 1200x630 default canvas for blogs and docs.',
      'Keep placeholder text short, centered, high-contrast, and generic.',
      'Validate real link previews before launch because social and chat platforms fetch, crop, and cache previews differently.',
      'Replace generated placeholders with custom artwork for launches, campaigns, and high-value evergreen pages.',
    ],
    related: [
      'placeholder-image-api-url-syntax-guide',
      'responsive-placeholder-images-cards-banners-grids',
      'privacy-safe-placeholder-images-url-text-uploads',
    ],
  },
  {
    title: 'Placeholder Images for CMS Previews and Missing Media Fields',
    description:
      'Use placeholder images for CMS previews, empty media fields, draft content, editorial cards, and broken remote assets without blocking publication.',
    slug: 'placeholder-images-cms-previews-missing-media',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=CMS+Media+Placeholders',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'CMS Workflows',
    tags: ['CMS image placeholder', 'Missing media placeholder', 'CMS preview image', 'Image fallback CMS'],
    summary: [
      'CMS media fields are often optional, draft-only, deleted, migrated, or dependent on a remote asset pipeline. Placeholder images keep previews usable when media is missing.',
      'Use generic fallback.pics URLs by content type so editors, previews, and published pages get stable image states without leaking private draft values.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'CMS placeholders protect editorial workflows',
        body: [
          'CMS previews break easily because the content model and the published frontend do not always move at the same pace. Editors may save drafts without images, remove assets, migrate media libraries, or reference remote URLs that later fail.',
          'A CMS image placeholder gives every card, preview, and article cover a deliberate state while the real media is missing or unavailable.',
        ],
      },
      {
        eyebrow: 'Content model',
        title: 'Treat media as optional at render time',
        body: [
          'Even if the CMS marks an image field as required, production rendering should still handle missing data. Imports, migrations, permissions, deleted files, and API errors can all produce null or invalid media values.',
          'Use the CMS asset URL when it exists. Use a fallback.pics URL when it does not.',
        ],
        code: `function imageForEntry(entry: { imageUrl?: string | null; type: 'article' | 'docs' }) {
  if (entry.imageUrl) return entry.imageUrl;

  if (entry.type === 'docs') {
    return 'https://fallback.pics/api/v1/1200x630/F4F4F5/18181B?text=Documentation';
  }

  return 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Article+Image';
}`,
      },
      {
        eyebrow: 'Previews',
        title: 'Keep preview cards the same size as published cards',
        body: [
          'CMS preview UIs should use the same image ratio as the published frontend. If the preview card shows a square fallback but the live page uses a wide cover, editors cannot judge the actual layout.',
          'Standardize dimensions for content types: article covers, author avatars, product images, collection banners, and social previews.',
        ],
        code: `Article cover:
https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Article+Image

Author avatar:
https://fallback.pics/api/v1/avatar/128/7C3AED/FFFFFF?text=User

Collection banner:
https://fallback.pics/api/v1/banner/1200x400/F4F4F5/18181B?text=Collection`,
      },
      {
        eyebrow: 'Editorial UX',
        title: 'Use labels editors can understand',
        body: [
          'A good CMS placeholder describes the missing surface without pretending the final asset exists. Article Image, Author, Product Image, Collection, Documentation, and Preview are usually enough.',
          'Avoid long headlines in the placeholder itself. The title already appears in the card or preview metadata, and long URL text is more likely to wrap or crop badly.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Do not expose draft values in placeholder URLs',
        body: [
          'CMS previews often contain unpublished material. Placeholder URLs can still appear in logs, screenshots, browser history, preview tooling, and social unfurl caches.',
          'Keep placeholder text generic. Do not include private article titles, embargoed product names, customer data, internal campaign names, emails, tokens, order IDs, or regulated data in generated image URLs.',
        ],
      },
    ],
    takeaways: [
      'CMS image fields can be missing even when the content model expects media.',
      'Use placeholder dimensions that match the published frontend, not just the CMS editor view.',
      'Handle null media values before render and failed image loads after render.',
      'Keep placeholder labels generic and safe for logs, previews, and screenshots.',
      'Standardize fallback URLs by content type so editorial workflows stay predictable.',
    ],
    related: [
      'placeholder-image-api-url-syntax-guide',
      'fix-broken-images-html-onerror',
      'responsive-placeholder-images-cards-banners-grids',
    ],
  },
  {
    title: 'Mobile App Image Fallbacks: Avatars, Cards, and Offline States',
    description:
      'Design mobile image fallbacks for avatars, feed cards, thumbnails, unavailable media, and offline states without collapsing the app UI.',
    slug: 'mobile-app-image-fallbacks-avatars-cards-offline',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Mobile+Image+Fallbacks',
    date: '2026-06-05',
    readTime: '13 min read',
    category: 'Mobile UX',
    tags: ['Mobile image fallback', 'App image placeholder', 'Avatar fallback mobile', 'Offline image fallback'],
    summary: [
      'Mobile fallbacks should be designed by surface: avatars, feed cards, previews, products, and offline media states.',
      'Remote fallback.pics URLs are useful for stable app placeholders, but offline-critical screens should also have local bundled fallback assets.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Mobile image fallback is a product state',
        body: [
          'Mobile apps show images in compressed, repeated spaces: avatars, feed cards, product tiles, chat attachments, thumbnails, and saved previews. When those images fail, the app can quickly look broken or hard to scan.',
          'A useful mobile fallback separates loading, missing, failed, and offline states. Each state needs the right visual treatment and the right network assumption.',
        ],
      },
      {
        eyebrow: 'Avatars',
        title: 'Use compact avatar fallbacks',
        body: [
          'Avatar fallbacks should be stable, compact, and generic. Use initials only when they are public-safe; otherwise use a generic label such as User or Team.',
          'Keep the remote fallback URL aligned with any local offline avatar asset so profile menus, comments, and account switchers feel consistent.',
        ],
        code: `User avatar:
https://fallback.pics/api/v1/avatar/96/18181B/FFFFFF?text=User

Team avatar:
https://fallback.pics/api/v1/avatar/128/3B82F6/FFFFFF?text=Team`,
      },
      {
        eyebrow: 'Cards',
        title: 'Keep feed cards stable when thumbnails are missing',
        body: [
          'Feeds and card lists are highly sensitive to uneven media. If one thumbnail collapses, every text line below it can shift and tap targets can move.',
          'Match the fallback URL to the card ratio. Use 16:9 for article and video cards, 1:1 for product grids, and 4:3 for compact recommendations.',
        ],
        code: `Article feed card:
https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Article+Image

Product card:
https://fallback.pics/api/v1/800x800/18181B/FFFFFF?text=Product+Image

Recommendation card:
https://fallback.pics/api/v1/600x450/F3F4F6/18181B?text=Preview`,
      },
      {
        eyebrow: 'React Native',
        title: 'Use a fallback source when the image URL is empty or fails',
        body: [
          'In React Native, handle missing source data before rendering and use an error callback for failed remote images. The exact image component may vary by app, but the state model should stay the same.',
          'For critical offline experiences, ship a bundled local placeholder too. Remote fallback URLs are useful when the network is available; local assets are safer before the network or cache exists.',
        ],
        code: `const fallbackSrc = {
  uri: 'https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Image+Unavailable',
};

function MobileCardImage({ imageUrl }) {
  const [source, setSource] = useState(imageUrl ? { uri: imageUrl } : fallbackSrc);
  return <Image source={source} onError={() => setSource(fallbackSrc)} />;
}`,
      },
      {
        eyebrow: 'Offline',
        title: 'Design offline fallback as a cache-first flow',
        body: [
          'Offline states should prefer previously cached images when they are available. If the image has never been cached, show an intentional unavailable state instead of an empty rectangle.',
          'A remote fallback URL cannot load while the device is truly offline unless it is already cached. Use local assets for offline-critical screens.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep mobile fallback URLs safe for logs',
        body: [
          'Mobile apps produce crash reports, network logs, analytics events, proxy captures, support screenshots, app-store review videos, and QA recordings.',
          'Treat placeholder URLs as public values. Do not include secrets, access tokens, private customer values, health data, financial data, exact addresses, order IDs, account IDs, device identifiers, or unreleased business details in fallback URL text.',
        ],
      },
    ],
    takeaways: [
      'Separate loading, missing, failed, and offline image states.',
      'Use fallback.pics URLs for stable remote placeholders, CMS-driven content, web views, and shared preview surfaces.',
      'Use local bundled assets for screens that must work before the network or cache is available.',
      'Keep mobile placeholder URL text generic, public-safe, and reusable across logs and support screenshots.',
      'Centralize fallback behavior in shared mobile image primitives.',
    ],
    related: [
      'avatar-placeholder-generator-initials-colors-accessibility',
      'responsive-placeholder-images-cards-banners-grids',
      'prevent-layout-shift-missing-images',
    ],
  },
  {
    title: 'Privacy-Safe Placeholder Images: Why URL Text and Uploads Matter',
    description:
      'A practical privacy guide for placeholder image URLs, URL text parameters, no-upload placeholders, logs, referrers, caching, and safe production examples.',
    slug: 'privacy-safe-placeholder-images-url-text-uploads',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Privacy-Safe+Placeholders',
    date: '2026-06-05',
    readTime: '11 min read',
    category: 'Trust',
    tags: ['Privacy placeholder image API', 'Safe placeholder image', 'No upload placeholder image', 'Placeholder URL privacy'],
    summary: [
      'Placeholder image URLs can show up in browser history, server logs, CDN logs, analytics, referrers, screenshots, bug reports, and support tickets.',
      'Use generic labels such as Product Image, User, Preview, and Image Unavailable instead of names, emails, account IDs, order IDs, tokens, or regulated data.',
    ],
    sections: [
      {
        eyebrow: 'Search intent',
        title: 'Privacy-safe placeholders start with boring URL text',
        body: [
          'Developers use placeholder image APIs because a URL works anywhere: img tags, React components, Markdown documents, CMS fields, and dashboard previews. That same convenience is why URL text needs discipline.',
          'A placeholder URL is not private just because the page is behind authentication. The URL can pass through browsers, caches, proxies, logs, monitoring tools, screenshots, error reports, and support workflows.',
        ],
      },
      {
        eyebrow: 'URL exposure',
        title: 'Query strings are easy to leak by accident',
        body: [
          'OWASP documents information exposure through query strings as a real vulnerability pattern because URL parameters can appear in logs and other request records even when HTTPS protects the network transport.',
          'A safe placeholder URL should remain safe if it is copied into chat, saved in browser history, indexed in internal log search, or included in a frontend error report.',
        ],
        code: `Good:
https://fallback.pics/api/v1/800x600/F4F4F5/18181B?text=Product+Image
https://fallback.pics/api/v1/400x400/18181B/FFFFFF?text=User
https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Report+Preview

Avoid putting customer-specific, account-specific, private, regulated, or secret values in URL text.`,
      },
      {
        eyebrow: 'Uploads',
        title: 'No-upload placeholders reduce data handling',
        body: [
          'Some image workflows ask teams to upload a real image, screenshot, mockup, or generated asset before producing a placeholder. That can be useful for design work, but it is usually unnecessary for missing-media fallbacks.',
          'A no-upload placeholder image API works from dimensions, colors, and a generic label. The service does not need the failed customer asset, the real product image, a private dashboard screenshot, or an internal report preview.',
        ],
        code: `<img
  src="https://fallback.pics/api/v1/600x400/F4F4F5/18181B?text=Image+Unavailable"
  width="600"
  height="400"
  alt="Image unavailable"
/>`,
      },
      {
        eyebrow: 'Accessibility',
        title: 'URL text is not alt text',
        body: [
          'Alternative text describes the meaning or function of an image for users who cannot see it. The text inside a placeholder image URL is visual content, not an accessibility contract.',
          'Keep placeholder URL text short and generic, then write alt text based on the purpose of the image in the page.',
        ],
      },
      {
        eyebrow: 'Component pattern',
        title: 'Centralize safe fallback URLs in code',
        body: [
          'Privacy mistakes happen when every template builds its own fallback URL. A shared image component or helper can make safe labels the default and prevent ad hoc interpolation of private data into the text parameter.',
          'The component should accept the real image URL, dimensions, alt text, and a surface name from a controlled list.',
        ],
        code: `const fallbackBySurface = {
  product: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  avatar: 'https://fallback.pics/api/v1/400x400/18181B/FFFFFF?text=User',
  report: 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Report+Preview',
} as const;`,
      },
    ],
    takeaways: [
      'Treat placeholder URL text as public, even in authenticated products.',
      'Do not put secrets, emails, tokens, account IDs, order IDs, private customer values, private product values, or regulated data in placeholder URLs.',
      'Use no-upload deterministic placeholders for missing-media states when the service does not need the original image.',
      'Keep placeholder text generic and use alt text for accessibility meaning.',
      'Centralize fallback URLs in shared components so safe labels become the default.',
    ],
    related: [
      'cache-control-placeholder-images-cdn-browser',
      'svg-placeholder-images-fast-cacheable-scalable',
      'fix-broken-images-html-onerror',
    ],
  },
  {
    title: 'Branded Fallback Images for SaaS Dashboards and Internal Tools',
    description:
      'Use branded fallback images in dashboards, report previews, avatars, workspaces, admin panels, and internal tools without breaking layout or leaking private data.',
    slug: 'branded-fallback-images-saas-dashboards-internal-tools',
    image: 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Branded+Fallbacks',
    date: '2026-06-05',
    readTime: '12 min read',
    category: 'SaaS',
    tags: ['Fallback image service', 'Branded placeholder image', 'Dashboard image placeholder', 'SaaS image fallback'],
    summary: [
      'SaaS dashboards have repeated image surfaces: avatars, workspace logos, report previews, file thumbnails, integration icons, chart snapshots, and admin panels.',
      'A branded fallback image keeps those surfaces intentional when uploads are missing, remote URLs fail, screenshots are unavailable, or upstream systems are slow.',
    ],
    sections: [
      {
        eyebrow: 'Product UX',
        title: 'Dashboards need controlled image failure states',
        body: [
          'SaaS products often treat images as small supporting details until they fail. Then the product suddenly shows broken-image icons, empty rectangles, missing avatars, uneven cards, and preview tiles that no longer look trustworthy.',
          'Operational interfaces depend on scanning. Users compare accounts, reports, documents, workspaces, tickets, automations, and projects quickly. A branded fallback image keeps the layout readable when ideal media is unavailable.',
        ],
      },
      {
        eyebrow: 'Brand system',
        title: 'Branded fallback does not mean busy fallback',
        body: [
          'A branded fallback image should use the product system without turning every missing-media slot into a marketing banner. SaaS interfaces work best when fallbacks are quiet, legible, and predictable.',
          'Use a small set of brand colors, restrained labels, and dimensions that match the final media.',
        ],
        code: `Report preview:
https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Report+Preview

Workspace logo:
https://fallback.pics/api/v1/400x400/18181B/FFFFFF?text=Workspace

File thumbnail:
https://fallback.pics/api/v1/800x600/F4F4F5/18181B?text=File+Preview`,
      },
      {
        eyebrow: 'Surface map',
        title: 'Start by inventorying SaaS image surfaces',
        body: [
          'Before changing code, list every place the product displays a user-provided, system-generated, or remote image. The list is usually longer than expected because dashboards combine product UI, customer content, internal tooling, and third-party integrations.',
          'Map each surface to a fallback label, dimensions, background color, text color, and accessibility behavior. Repeated surfaces should share the same URL so QA, caching, and design review stay manageable.',
        ],
      },
      {
        eyebrow: 'Component pattern',
        title: 'Put branded fallback rules in one image component',
        body: [
          'Branded fallback images become maintainable when product teams stop hand-writing fallback URLs in each feature. A shared component can define the allowed surfaces, dimensions, brand colors, labels, and missing-image behavior.',
          'The component should handle missing source data before render and failed image load after render. It should never interpolate private record values into the fallback URL.',
        ],
        code: `const dashboardFallbacks = {
  avatar: 'https://fallback.pics/api/v1/400x400/18181B/FFFFFF?text=User',
  report: 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Report+Preview',
  file: 'https://fallback.pics/api/v1/800x600/F4F4F5/18181B?text=File+Preview',
} as const;`,
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep dashboard fallback labels generic',
        body: [
          'SaaS dashboards often display sensitive business context. Even when the image slot feels harmless, the label used in a placeholder URL can leak customer names, internal project names, private file names, or operational details.',
          'Use a generic surface label instead: User, Workspace, Report Preview, File Preview, Dashboard Preview, Image Unavailable.',
        ],
      },
      {
        eyebrow: 'QA',
        title: 'Test branded fallbacks as product states',
        body: [
          'Treat fallback images as product states, not edge-case accidents. QA should cover missing source data, failed image loads, slow images, blocked image domains, and unsupported formats.',
          'Visual regression tests are easier when placeholders are deterministic. The same fallback URL should render the same output in local development, CI, Storybook, and production.',
        ],
      },
    ],
    takeaways: [
      'Branded SaaS fallbacks should be calm, consistent, and tied to real dashboard surfaces.',
      'Standardize fallback dimensions and labels for avatars, reports, files, workspaces, and admin previews.',
      'Put fallback behavior in shared components so missing data and failed loads are handled consistently.',
      'Keep placeholder URL text generic and free of private customer or operational values.',
      'QA fallback states across responsive dashboard layouts, internal tools, and visual regression tests.',
    ],
    related: [
      'privacy-safe-placeholder-images-url-text-uploads',
      'placeholder-images-storybook-playwright-visual-regression',
      'responsive-placeholder-images-cards-banners-grids',
    ],
  },
  {
    title: 'From Broken Image Icon to Branded Fallback: A Production Rollout Checklist',
    description:
      'Audit broken image states, choose branded fallback URLs, update shared components, test image failures, and monitor rollout quality.',
    slug: 'broken-image-icon-to-branded-fallback-checklist',
    image: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Fallback+Rollout+Checklist',
    date: '2026-06-05',
    readTime: '13 min read',
    category: 'Implementation',
    tags: ['Broken image fallback', 'Broken image icon', 'Fallback image checklist', 'Image fallback rollout'],
    summary: [
      'Replacing browser broken-image icons is a production rollout, not a one-line onerror patch.',
      'Start with an image surface audit, then standardize fallback dimensions, labels, colors, components, accessibility behavior, testing, caching, and monitoring.',
    ],
    sections: [
      {
        eyebrow: 'Rollout mindset',
        title: 'Treat broken-image icons as production defects',
        body: [
          'The browser broken-image icon is a useful signal for developers, but it is a poor product state for users. It communicates that something failed without preserving the design system or keeping repeated layouts calm.',
          'A branded fallback rollout gives every important image slot a controlled state. The work includes product inventory, frontend implementation, accessibility, QA, performance, cache behavior, observability, and content rules.',
        ],
      },
      {
        eyebrow: 'Checklist 1',
        title: 'Audit every image surface',
        body: [
          'Start by listing image surfaces instead of jumping straight into code. Most apps have more image slots than one team remembers: product cards, avatars, logos, banners, article covers, file thumbnails, CMS previews, dashboards, support tools, admin pages, and emails.',
          'For each surface, capture the owner, route, component, final dimensions, aspect ratio, source system, alt text behavior, current failure behavior, and customer impact.',
        ],
      },
      {
        eyebrow: 'Checklist 2',
        title: 'Choose a fallback URL for each surface type',
        body: [
          'Use fallback URLs that match the real image shape. A product square should not fall back to a wide banner. A report preview should not fall back to an avatar square.',
          'Keep labels generic: Product Image, User, Article Image, File Preview, Report Preview, Workspace, Image Unavailable.',
        ],
        code: `Product card:
https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image

User avatar:
https://fallback.pics/api/v1/400x400/18181B/FFFFFF?text=User

Report preview:
https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Report+Preview`,
      },
      {
        eyebrow: 'Checklist 3',
        title: 'Reserve layout before images load or fail',
        body: [
          'Add width and height attributes for fixed media, or use a stable aspect-ratio container for responsive surfaces. The fallback should not introduce a second layout shift after the original image fails.',
          'Check card grids, dashboard rows, modals, side panels, and mobile breakpoints. A fallback rollout is incomplete if it works only on the happy-path desktop layout.',
        ],
        code: `<img
  src="/media/products/example.jpg"
  width="800"
  height="800"
  alt="Product image"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image'"
/>`,
      },
      {
        eyebrow: 'Checklist 4',
        title: 'Move fallback behavior into shared components',
        body: [
          'One-off onerror handlers are useful for quick fixes, but production rollouts need shared image primitives. The component should handle missing source data, failed loads, dimensions, alt text, and safe fallback labels.',
          'A shared component also gives design, QA, and engineering one place to update fallback color, text, and dimensions.',
        ],
        code: `const fallbackForSurface = {
  product: 'https://fallback.pics/api/v1/800x800/F4F4F5/18181B?text=Product+Image',
  avatar: 'https://fallback.pics/api/v1/avatar/128/18181B/FFFFFF?text=User',
  article: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=Article+Image',
} as const;`,
      },
      {
        eyebrow: 'Checklist 5',
        title: 'Test the failure paths deliberately',
        body: [
          'Do not wait for production media failures to validate the rollout. Create fixtures for missing URLs, empty strings, 404s, slow responses, blocked hosts, unsupported formats, and decode failures.',
          'Use Storybook, Playwright, visual regression tests, or manual QA to verify that each fallback preserves layout and remains readable.',
        ],
      },
      {
        eyebrow: 'Privacy',
        title: 'Keep rollout labels public-safe',
        body: [
          'Every fallback URL used in the rollout should be safe in logs, screenshots, browser history, support tickets, and analytics. Use generic surface labels only.',
          'Do not put secrets, emails, tokens, account IDs, order IDs, private customer values, private product values, or regulated data in placeholder URL text.',
        ],
      },
    ],
    takeaways: [
      'Audit image surfaces before writing fallback code.',
      'Choose fallback URLs that match each surface ratio and use generic public-safe labels.',
      'Reserve image layout with width and height attributes or CSS aspect-ratio.',
      'Move fallback behavior into shared image components.',
      'Test missing data, failed loads, slow networks, blocked domains, and responsive layouts before rollout.',
    ],
    related: [
      'fix-broken-images-html-onerror',
      'branded-fallback-images-saas-dashboards-internal-tools',
      'privacy-safe-placeholder-images-url-text-uploads',
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
