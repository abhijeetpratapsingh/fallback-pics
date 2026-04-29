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
