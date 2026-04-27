export interface SeoSection {
  heading: string;
  body: string[];
  bullets?: string[];
  code?: string;
}

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  keywords: string[];
  exampleUrl: string;
  sections: SeoSection[];
  cta: string;
  links: Array<{ href: string; label: string }>;
}

export const seoPages: SeoPage[] = [
  {
    slug: 'placeholder-image-api',
    title: 'Placeholder Image API for Developers | fallback.pics',
    description:
      'Generate production-safe SVG placeholder images from simple URLs. Use fallback.pics for UI mockups, docs, ecommerce states, SaaS dashboards, and broken image fallbacks.',
    h1: 'Placeholder Image API Built for Real Product Interfaces',
    eyebrow: 'Placeholder image API',
    intro:
      'fallback.pics gives developers a simple URL-based placeholder image API for layouts, fallback states, documentation, seed data, and production UI edge cases.',
    keywords: ['placeholder image api', 'image placeholder api', 'svg placeholder image', 'placeholder image generator'],
    exampleUrl: 'https://fallback.pics/api/v1/600x400?text=Product+Image',
    sections: [
      {
        heading: 'A URL API your frontend can use anywhere',
        body: [
          'Drop a fallback.pics URL into an img tag, React component, Next.js page, Markdown doc, CMS field, or product catalog. Start with dimensions, then add custom text or colors when the placeholder needs to match the surrounding UI.'
        ],
        code: '<img src="https://fallback.pics/api/v1/600x400?text=Product+Image" alt="Product image" />'
      },
      {
        heading: 'Production-safe placeholder states',
        body: [
          'Many placeholder services are designed only for throwaway mockups. fallback.pics is positioned for real product interfaces where image URLs can fail, inventory media can be missing, avatars may not exist yet, and docs still need readable visuals.'
        ],
        bullets: [
          'Product cards without final photography',
          'User avatars without uploaded profile images',
          'Dashboard widgets while media is unavailable',
          'Documentation screenshots and tutorial examples',
          'Design-system examples with stable dimensions'
        ]
      },
      {
        heading: 'SVG-first output',
        body: [
          'fallback.pics generates lightweight SVG placeholders that scale cleanly and work well for layout-safe UI states. The API is a good fit when you need dependable generated placeholders without maintaining a raster image generation service.'
        ]
      }
    ],
    cta: 'Start with one URL and replace broken or missing images with predictable SVG placeholders.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/dummy-image-generator', label: 'Dummy image generator' },
      { href: '/product-image-placeholder', label: 'Product image placeholder' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' }
    ]
  },
  {
    slug: 'broken-image-fallback',
    title: 'Broken Image Fallback API | Stop Showing Missing Images',
    description:
      'Replace broken images with production-safe SVG fallbacks. fallback.pics helps frontend teams keep layouts clean when product, avatar, CMS, or remote images fail.',
    h1: 'Never Let a Broken Image Break the Interface',
    eyebrow: 'Broken image fallback',
    intro:
      'Broken images make polished products feel unfinished. fallback.pics gives you a simple fallback image URL for failed remote assets, missing uploads, and unavailable CMS media.',
    keywords: ['broken image fallback', 'fallback image service', 'img onerror fallback', 'fallback image url'],
    exampleUrl: 'https://fallback.pics/api/v1/600x400?text=Image+Unavailable',
    sections: [
      {
        heading: 'A safer default for image failure',
        body: [
          'Images fail for normal reasons: deleted media, expired CDN URLs, missing product photos, bad imports, blocked third-party assets, and incomplete test data. A fallback image gives the UI a controlled state instead of a broken browser icon.'
        ]
      },
      {
        heading: 'Works with plain HTML and modern frameworks',
        body: [
          'Use fallback.pics directly in an onerror handler, a React onError callback, a Next.js image wrapper, or a design-system image component. Teams can standardize fallback behavior once and reuse it across product surfaces.'
        ],
        code: '<img src="/product.jpg" onerror="this.onerror=null;this.src=\'https://fallback.pics/api/v1/600x400?text=Image+Unavailable\'" alt="Product image" />'
      },
      {
        heading: 'Keep layouts stable',
        body: [
          'Dimensioned placeholder URLs help preserve the intended space so product grids, cards, avatars, banners, and docs keep their structure when real images are missing.'
        ]
      }
    ],
    cta: 'Create a broken image fallback URL that communicates the missing media state clearly.',
    links: [
      { href: '/guides/img-onerror-fallback', label: 'img onerror fallback guide' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' },
      { href: '/guides/nextjs-image-fallback', label: 'Next.js image fallback' },
      { href: '/product-image-placeholder', label: 'Product image placeholder' }
    ]
  },
  {
    slug: 'dummy-image-generator',
    title: 'Dummy Image Generator for Apps, Docs, and Mockups | fallback.pics',
    description:
      'Create SVG dummy images with custom sizes, text, and colors. Use fallback.pics for mockups, seed data, design systems, tutorials, and production fallback states.',
    h1: 'Dummy Image Generator for Developers Who Need Predictable UI States',
    eyebrow: 'Dummy image generator',
    intro:
      'Generate clean SVG dummy images from readable URLs and use them in prototypes, test data, documentation, ecommerce catalogs, and fallback flows.',
    keywords: ['dummy image generator', 'dummy images', 'placeholder image generator', 'mockup image generator'],
    exampleUrl: 'https://fallback.pics/api/v1/400x300?text=Preview',
    sections: [
      {
        heading: 'Generate dummy images from the URL',
        body: [
          'Use dimensions directly in the path to generate an image with the exact layout size you need. Add text when the placeholder should explain the intended asset.'
        ],
        code: 'https://fallback.pics/api/v1/1200x400?text=Hero+Banner'
      },
      {
        heading: 'Useful beyond mockups',
        body: [
          'Dummy images are useful in storybooks, staging environments, documentation, empty states, onboarding flows, CMS previews, and automated test fixtures.'
        ]
      },
      {
        heading: 'Predictable instead of random',
        body: [
          'Generated dummy images avoid visual surprises, keep screenshots consistent, and communicate the role of missing content clearly.'
        ]
      }
    ],
    cta: 'Generate a dummy image now and use it anywhere an image URL is accepted.',
    links: [
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/alternatives/dummyimage-alternative', label: 'DummyImage alternative' },
      { href: '/avatar-placeholder-generator', label: 'Avatar placeholder generator' },
      { href: '/skeleton-placeholder-generator', label: 'Skeleton placeholder generator' }
    ]
  },
  {
    slug: 'product-image-placeholder',
    title: 'Product Image Placeholder API for Ecommerce Teams | fallback.pics',
    description:
      'Use fallback.pics to generate clean SVG product image placeholders for ecommerce catalogs, product cards, staging data, and missing product media.',
    h1: 'Product Image Placeholders That Keep Ecommerce Layouts Clean',
    eyebrow: 'Product image placeholder',
    intro:
      'Missing product media should not make a storefront, admin panel, or catalog preview look broken. fallback.pics creates consistent product placeholders with simple, dimensioned URLs.',
    keywords: ['product image placeholder', 'ecommerce placeholder image', 'product image fallback', 'catalog image placeholder'],
    exampleUrl: 'https://fallback.pics/api/v1/600x600?text=Product+Image',
    sections: [
      {
        heading: 'Designed for product cards and catalog grids',
        body: [
          'Product grids depend on consistent image ratios. Use fallback.pics to reserve the right space for square, portrait, landscape, and banner-style product images while your real assets load or when they are unavailable.'
        ]
      },
      {
        heading: 'A better missing image state',
        body: [
          'Instead of a browser broken-image icon, show a branded placeholder that says exactly what is missing. This keeps collection pages, product detail pages, admin tools, and internal catalogs readable.'
        ]
      },
      {
        heading: 'Useful for staging and seed data',
        body: [
          'URL-generated placeholders are easy to put into fixtures, CSV imports, CMS entries, and demo stores before final merchandising assets are ready.'
        ]
      }
    ],
    cta: 'Use a dependable product image placeholder for missing catalog media.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' },
      { href: '/guides/nextjs-image-fallback', label: 'Next.js image fallback' }
    ]
  },
  {
    slug: 'avatar-placeholder-generator',
    title: 'Avatar Placeholder Generator for User Profiles | fallback.pics',
    description:
      'Generate SVG avatar placeholders and initials-based profile images with simple URLs. Use fallback.pics for apps, dashboards, comments, teams, and account pages.',
    h1: 'Avatar Placeholder Generator for Profiles, Teams, and Dashboards',
    eyebrow: 'Avatar placeholder generator',
    intro:
      'Not every user uploads a profile photo. fallback.pics gives your app a clean avatar placeholder generator for user lists, account pages, comments, team directories, dashboards, and onboarding flows.',
    keywords: ['avatar placeholder generator', 'profile placeholder image', 'initials avatar placeholder', 'user avatar fallback'],
    exampleUrl: 'https://fallback.pics/api/v1/avatar/200?text=JD',
    sections: [
      {
        heading: 'Initials-based avatar placeholders',
        body: [
          'Use the avatar preset with short text to generate simple initials-based placeholders for SaaS apps, internal tools, marketplaces, communities, and dashboards.'
        ]
      },
      {
        heading: 'Consistent profile UI',
        body: [
          'Avatar placeholders prevent empty profile areas and inconsistent list rows. Use the same pattern across nav bars, tables, comments, activity feeds, user cards, and settings pages.'
        ]
      },
      {
        heading: 'Useful for real users and test data',
        body: [
          'fallback.pics works for production missing-avatar states as well as test users in local development, staging, screenshots, demos, and docs.'
        ]
      }
    ],
    cta: 'Generate an avatar placeholder with initials in one URL.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/dummy-image-generator', label: 'Dummy image generator' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' },
      { href: '/guides/nextjs-image-fallback', label: 'Next.js image fallback' }
    ]
  },
  {
    slug: 'skeleton-placeholder-generator',
    title: 'Skeleton Placeholder Generator for Loading States | fallback.pics',
    description:
      'Create SVG skeleton placeholders for loading UI, docs, demos, and design-system examples. Use fallback.pics for predictable skeleton image states from simple URLs.',
    h1: 'Skeleton Placeholder Generator for Loading and Empty Media States',
    eyebrow: 'Skeleton placeholder generator',
    intro:
      'Skeleton placeholders help interfaces communicate loading without shifting layout. fallback.pics provides simple SVG skeleton placeholder URLs for product cards, media frames, docs, demos, and design-system examples.',
    keywords: ['skeleton placeholder generator', 'skeleton loader placeholder', 'loading placeholder image', 'svg skeleton placeholder'],
    exampleUrl: 'https://fallback.pics/api/v1/skeleton/400x300',
    sections: [
      {
        heading: 'Skeleton placeholders from a URL',
        body: [
          'Generate a skeleton-style placeholder by choosing dimensions that match the final media area.'
        ]
      },
      {
        heading: 'Layout stability for loading media',
        body: [
          'When images load after the rest of the page, a fixed-size placeholder helps preserve the intended layout. Skeleton placeholders are especially useful in cards, feeds, galleries, dashboards, and ecommerce grids.'
        ]
      },
      {
        heading: 'Use skeletons deliberately',
        body: [
          'Skeletons work best for temporary loading states. For permanent missing images, use a direct fallback message such as Image unavailable or Product image so users understand what happened.'
        ]
      }
    ],
    cta: 'Create a skeleton placeholder URL for your loading media state.',
    links: [
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/product-image-placeholder', label: 'Product image placeholder' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' }
    ]
  },
  {
    slug: 'guides/img-onerror-fallback',
    title: 'img onerror Fallback Guide | fallback.pics',
    description:
      'Copy-paste HTML examples for using fallback.pics as an img onerror fallback when product, avatar, CMS, or remote images fail to load.',
    h1: 'How to Add an img onerror Fallback',
    eyebrow: 'HTML fallback guide',
    intro:
      'The HTML img onerror attribute is the fastest way to replace a failed image with a controlled fallback URL. fallback.pics gives that fallback a stable, readable SVG placeholder.',
    keywords: ['img onerror fallback', 'html image fallback', 'broken image fallback html', 'fallback image url'],
    exampleUrl: 'https://fallback.pics/api/v1/600x400?text=Image+Unavailable',
    sections: [
      {
        heading: 'Basic img onerror pattern',
        body: [
          'Clear the error handler before changing the source. That prevents an error loop if the fallback URL ever fails.'
        ],
        code: '<img src="/photo.jpg" alt="Product image" onerror="this.onerror=null;this.src=\'https://fallback.pics/api/v1/600x400?text=Image+Unavailable\'" />'
      },
      {
        heading: 'Choose fallback copy by context',
        body: [
          'Use Product image for catalog cards, Avatar for profile photos, Image unavailable for failed CMS media, and a skeleton placeholder only for temporary loading states.'
        ]
      },
      {
        heading: 'Keep alt text meaningful',
        body: [
          'The fallback URL is a visual replacement. Your alt text should still describe the content the image represents.'
        ]
      }
    ],
    cta: 'Use fallback.pics as your default HTML image fallback URL.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' },
      { href: '/guides/nextjs-image-fallback', label: 'Next.js image fallback' },
      { href: '/placeholder-image-api', label: 'Placeholder image API' }
    ]
  },
  {
    slug: 'guides/react-image-fallback',
    title: 'React Image Fallback Guide | Handle Broken Images with fallback.pics',
    description:
      'Learn how to handle broken images in React with a simple onError fallback. Use fallback.pics SVG placeholders for product images, avatars, cards, and docs.',
    h1: 'How to Add a React Image Fallback for Broken or Missing Images',
    eyebrow: 'React image fallback',
    intro:
      'React apps often depend on remote images from uploads, CMS entries, ecommerce catalogs, and third-party APIs. This guide shows how to replace failed image loads with a fallback.pics placeholder URL.',
    keywords: ['react image fallback', 'react broken image fallback', 'react img onerror', 'react fallback image component'],
    exampleUrl: 'https://fallback.pics/api/v1/600x400?text=Image+Unavailable',
    sections: [
      {
        heading: 'Basic React image fallback',
        body: [
          'Use onError to swap the failed image source for a placeholder. Clear the error handler first to avoid a loop if the fallback URL is ever unavailable.'
        ],
        code: `function ProductImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src =
          "https://fallback.pics/api/v1/600x400?text=Product+Image";
      }}
    />
  );
}`
      },
      {
        heading: 'Create a reusable component',
        body: [
          'For production apps, put fallback behavior in one shared image component. That keeps product pages, profile cards, dashboards, and content previews consistent.'
        ]
      },
      {
        heading: 'Use different fallbacks by context',
        body: [
          'Product images, avatars, banners, and article thumbnails should not all use the same message. Choose a fallback URL that matches the role of the image.'
        ],
        bullets: [
          'Product: /api/v1/600x600?text=Product+Image',
          'Avatar: /api/v1/avatar/200?text=JD',
          'Banner: /api/v1/banner/1200x400',
          'Missing media: /api/v1/600x400?text=Image+Unavailable'
        ]
      }
    ],
    cta: 'Add a React fallback image today with a stable fallback.pics URL.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/product-image-placeholder', label: 'Product image placeholder' },
      { href: '/avatar-placeholder-generator', label: 'Avatar placeholder generator' },
      { href: '/guides/nextjs-image-fallback', label: 'Next.js image fallback' }
    ]
  },
  {
    slug: 'guides/nextjs-image-fallback',
    title: 'Next.js Image Fallback Guide | Missing Image Placeholders',
    description:
      'Handle missing images in Next.js with fallback.pics. Learn practical patterns for fallback placeholders in product cards, avatars, CMS pages, and app UI.',
    h1: 'How to Handle Missing Images in Next.js',
    eyebrow: 'Next.js image fallback',
    intro:
      'Next.js apps often render images from CMS data, ecommerce catalogs, user uploads, and remote APIs. fallback.pics gives you stable SVG placeholder URLs for missing image states.',
    keywords: ['nextjs image fallback', 'next image fallback', 'nextjs broken image fallback', 'missing image placeholder nextjs'],
    exampleUrl: 'https://fallback.pics/api/v1/600x600?text=Product+Image',
    sections: [
      {
        heading: 'Use a fallback URL when source data is missing',
        body: [
          'Before rendering an image, check whether the source exists. If it does not, use a fallback.pics URL that matches the expected dimensions.'
        ],
        code: `const imageSrc =
  product.imageUrl ||
  "https://fallback.pics/api/v1/600x600?text=Product+Image";`
      },
      {
        heading: 'Handle failed loads in a client component',
        body: [
          'If remote images can fail after render, use a client component with local state and an error handler.'
        ],
        code: `"use client";

import { useState } from "react";

export function SafeImage({ src, fallbackSrc, alt }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return <img src={currentSrc} alt={alt} onError={() => setCurrentSrc(fallbackSrc)} />;
}`
      },
      {
        heading: 'Choose placeholders by surface',
        body: [
          'Use product placeholders for commerce pages, avatar placeholders for account UI, skeleton placeholders for temporary loading states, and Image unavailable copy when a final asset cannot be displayed.'
        ]
      }
    ],
    cta: 'Use fallback.pics as your default missing-image URL in Next.js.',
    links: [
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/guides/react-image-fallback', label: 'React image fallback' },
      { href: '/product-image-placeholder', label: 'Product image placeholder' },
      { href: '/skeleton-placeholder-generator', label: 'Skeleton placeholder generator' }
    ]
  },
  {
    slug: 'alternatives/placehold-co-alternative',
    title: 'Placehold.co Alternative for Production Fallback Images | fallback.pics',
    description:
      'Looking for a Placehold.co alternative? fallback.pics focuses on production-safe SVG placeholders, broken image fallbacks, ecommerce states, avatars, and developer-friendly URLs.',
    h1: 'A Placehold.co Alternative Focused on Production Fallback States',
    eyebrow: 'Placehold.co alternative',
    intro:
      'Placehold.co is a familiar placeholder image tool for developers. fallback.pics serves a related need with a stronger focus on production-safe fallback states and missing media experiences.',
    keywords: ['placehold.co alternative', 'placehold alternative', 'placeholder image api alternative', 'fallback image service'],
    exampleUrl: 'https://fallback.pics/api/v1/400x300?text=Fallback',
    sections: [
      {
        heading: 'Similar URL simplicity',
        body: [
          'fallback.pics lets you generate placeholders from readable URLs. You can define dimensions, text, and colors without installing a package or uploading assets.'
        ]
      },
      {
        heading: 'Built around broken image fallbacks',
        body: [
          'fallback.pics is positioned for teams that need more than development placeholders. It supports real UI states where product photos, user avatars, CMS images, or remote media may be unavailable.'
        ]
      },
      {
        heading: 'SVG-first and self-hostable',
        body: [
          'fallback.pics currently focuses on generated SVG output and has a Cloudflare Workers implementation that teams can self-host or adapt.'
        ]
      }
    ],
    cta: 'Try a production-focused placeholder API built around fallback states.',
    links: [
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/alternatives/dummyimage-alternative', label: 'DummyImage alternative' },
      { href: '/self-hosted-placeholder-image-api', label: 'Self-hosted placeholder API' }
    ]
  },
  {
    slug: 'alternatives/dummyimage-alternative',
    title: 'DummyImage Alternative for Modern Placeholder Images | fallback.pics',
    description:
      'Need a DummyImage alternative? Generate SVG placeholders, avatars, product image fallbacks, skeleton states, and branded dummy images with fallback.pics.',
    h1: 'A DummyImage Alternative for Product Teams and Modern Frontends',
    eyebrow: 'DummyImage alternative',
    intro:
      'DummyImage.com helped popularize simple URL-based image generation. fallback.pics follows that practical developer workflow while focusing on modern product use cases.',
    keywords: ['dummyimage alternative', 'dummy image alternative', 'dummy image generator', 'modern placeholder images'],
    exampleUrl: 'https://fallback.pics/api/v1/400x300?text=Preview',
    sections: [
      {
        heading: 'Simple dummy images from URLs',
        body: [
          'Generate predictable placeholder images by putting the dimensions in the URL. Use custom text to make the purpose clear in UI screenshots, design-system examples, and staging data.'
        ]
      },
      {
        heading: 'More contextual fallbacks',
        body: [
          'Modern apps need different placeholders for different surfaces. Product media, avatars, banners, loading states, and missing images each benefit from their own placeholder style and copy.'
        ]
      },
      {
        heading: 'Good for production edge cases',
        body: [
          'fallback.pics is positioned for interfaces where images may fail in production, not only for early mockups.'
        ]
      }
    ],
    cta: 'Replace generic dummy images with contextual fallback URLs from fallback.pics.',
    links: [
      { href: '/dummy-image-generator', label: 'Dummy image generator' },
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/avatar-placeholder-generator', label: 'Avatar placeholder generator' },
      { href: '/skeleton-placeholder-generator', label: 'Skeleton placeholder generator' }
    ]
  },
  {
    slug: 'self-hosted-placeholder-image-api',
    title: 'Self-Hosted Placeholder Image API on Cloudflare Workers | fallback.pics',
    description:
      'Deploy a self-hosted SVG placeholder image API with fallback.pics and Cloudflare Workers. Keep fallback URLs simple while controlling your own infrastructure.',
    h1: 'Self-Hosted Placeholder Image API for Teams That Want Control',
    eyebrow: 'Self-hosted placeholder API',
    intro:
      'fallback.pics is built on Cloudflare Workers and can be adapted by teams that want their own placeholder image API for internal tools, docs, staging, or product fallback states.',
    keywords: ['self hosted placeholder image api', 'cloudflare workers placeholder image api', 'open source placeholder image service'],
    exampleUrl: 'https://fallback.pics/api/v1/400x300?text=Self+Hosted',
    sections: [
      {
        heading: 'Own the fallback layer',
        body: [
          'Self-hosting is useful when teams want branded defaults, internal-only routes, custom presets, or control over deployment and caching behavior.'
        ]
      },
      {
        heading: 'Simple Worker architecture',
        body: [
          'The project keeps image generation dependency-light by producing SVG responses from URL parameters, which is a practical fit for edge runtimes.'
        ]
      },
      {
        heading: 'Good for platform and design-system teams',
        body: [
          'A shared placeholder service can keep internal apps, examples, docs, and staging environments consistent without storing throwaway image files.'
        ]
      }
    ],
    cta: 'Use fallback.pics directly or deploy your own placeholder image API from the open-source project.',
    links: [
      { href: '/placeholder-image-api', label: 'Placeholder image API' },
      { href: '/broken-image-fallback', label: 'Broken image fallback' },
      { href: '/alternatives/placehold-co-alternative', label: 'Placehold.co alternative' },
      { href: '/docs', label: 'Documentation' }
    ]
  }
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((page) => page.slug === slug);
}
