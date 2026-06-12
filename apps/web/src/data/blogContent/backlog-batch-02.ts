import type { BlogPost } from '../blogPosts';

export const backlogBatch02: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── POST 1 ────────────────────────────────────────────────────────────────
  {
    title: "Twitter Card and X Image Fallbacks for Missing Social Images",
    description:
      "Set reliable twitter:image fallbacks for X and Twitter Cards so posts never share a broken preview. Covers correct sizes, fallback URLs, and og: tag order.",
    slug: "twitter-card-image-fallbacks",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "twitter card image size",
      "X social image",
      "og image fallback",
      "open graph",
      "social meta tags",
    ],
    summary: [
      "Twitter Card and X previews pull from twitter:image, falling back to og:image when the dedicated tag is absent. When neither resolves to a valid image, most clients render a link-only card with no thumbnail — which tanks click-through rates on shared posts.",
      "Reliable social image fallbacks require the correct raster dimensions, an absolute https:// URL, and a consistent fallback chain you can drop into any template or CMS without relying on manual per-post uploads.",
    ],
    sections: [
      {
        eyebrow: "Background",
        title: "How Twitter Card image resolution actually works",
        body: [
          "X reads twitter:image first. If that tag is absent or the URL fails, it falls back to og:image. If neither resolves to a valid image, the card renders as a plain text link — no thumbnail, no preview.",
          "The crawler fetches the image at share time, not at page-load time. A 404 from a deleted CDN asset, a missing S3 object, or an incorrect absolute URL will silently break the preview hours or days after the page went live.",
          "The most common failure mode is a relative URL in the meta tag. The Twitter/X crawler does not resolve relative paths. Use absolute https:// URLs or the card will never render correctly.",
        ],
      },
      {
        eyebrow: "Dimensions",
        title: "Twitter card image size requirements and limits",
        body: [
          "summary_large_image cards require a minimum of 300×157 pixels and support up to 4096×4096. The recommended production size is 1200×628 or 1200×630 — the same as OG images — because most CMS templates share one image field for both.",
          "Images must be under 5MB and in JPG, PNG, GIF, or WebP format. SVG is not supported by the X crawler. If your placeholder service returns SVG by default, request a raster format explicitly by appending a file extension to the URL.",
          "The aspect ratio for summary_large_image should be close to 2:1. Cards outside that ratio get letterboxed or cropped, which makes text-heavy images unreadable.",
        ],
        code: `<!-- Twitter/X Card meta tags with fallback.pics -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://fallback.pics/api/v1/1200x630.jpg?text=Post+Title" />
<meta name="twitter:image:alt" content="Blog post preview for: Post Title" />

<!-- Shared og:image covers LinkedIn, Slack, Discord -->
<meta property="og:image" content="https://fallback.pics/api/v1/1200x630.jpg?text=Post+Title" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Fallback chain",
        title: "Set a fallback URL when the post image is missing",
        body: [
          "The safest pattern is to always have a twitter:image value — the real image when one exists, or a deterministic generated URL when it does not. Relying on og:image as an implicit fallback works, but gives you one fewer level of control.",
          "For CMS templates, check whether the featured image field is populated and substitute a generated URL when it is empty. Keep the generated URL deterministic so social preview tools and crawlers cache the same image on repeat visits.",
        ],
        code: `// Next.js / React metadata example
const twitterImage = post.featuredImage
  ? post.featuredImage
  : \`https://fallback.pics/api/v1/1200x630.jpg?text=\${encodeURIComponent(post.title)}\`;

export const metadata = {
  twitter: {
    card: 'summary_large_image',
    images: [twitterImage],
  },
  openGraph: {
    images: [{ url: twitterImage, width: 1200, height: 630 }],
  },
};`,
      },
      {
        eyebrow: "Template",
        title: "Complete meta tag template for Twitter and X",
        body: [
          "Put twitter:card first. Some parsers short-circuit after reading that declaration, and a missing or misspelled card type causes the rest of the tags to be ignored.",
          "Always set both twitter:image and og:image. Slack, Discord, and LinkedIn use og:image; X uses twitter:image. Sharing the same resolved URL for both reduces the number of distinct cache entries and CDN origin hits.",
        ],
        code: `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Post Title" />
<meta name="twitter:description" content="Under 200 characters." />
<meta name="twitter:image" content="https://fallback.pics/api/v1/1200x630.jpg?text=Your+Post+Title" />
<meta name="twitter:image:alt" content="Decorative blog preview: Your Post Title" />

<meta property="og:title" content="Your Post Title" />
<meta property="og:description" content="Your post description." />
<meta property="og:image" content="https://fallback.pics/api/v1/1200x630.jpg?text=Your+Post+Title" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Testing",
        title: "Validate cards before publishing",
        body: [
          "Use the X Card Validator at cards-dev.twitter.com to preview how a URL renders before it is shared. The validator re-fetches meta tags on demand, so it bypasses cached versions — useful for checking freshly deployed changes.",
          "If your URL is behind authentication or only accessible on localhost, the validator will fail. Use a staging URL or a tunnel tool. The crawler cannot reach private network addresses.",
          "Check that your image URL returns a 200 status and the correct Content-Type header. A URL that redirects to an error page with a 200 status still breaks the card because the crawler receives HTML instead of image data.",
        ],
      },
      {
        eyebrow: "CMS integration",
        title: "Add fallbacks in WordPress, Ghost, and headless CMS",
        body: [
          "In WordPress with Yoast or Rank Math, the OG image field maps directly to the featured image. When the featured image is absent, the plugin renders an empty tag. Override this by adding a filter that substitutes a fallback URL when the field is empty.",
          "In Ghost, the {{og_image}} helper returns an empty string for posts with no feature image. Wrap the tag output in a conditional and supply a generated URL as the else branch.",
          "In headless CMS platforms like Contentful or Sanity, image fields are nullable. Query them with a null-check and compute the fallback URL server-side before the page response is serialized.",
        ],
        code: `{{! Ghost theme — Handlebars }}
<meta name="twitter:image" content="{{#if feature_image}}{{feature_image}}{{else}}https://fallback.pics/api/v1/1200x630.jpg?text={{url_encode title}}{{/if}}" />`,
      },
      {
        eyebrow: "Further reading",
        title: "Social image and OG patterns",
        body: [
          "The og:image spec and twitter:image fallback behavior share most of the same constraints. The fallback.pics thumbnail route is purpose-built for social-image use cases and produces readable previews with post titles embedded.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/generate-blog-thumbnails-from-text/`,
      },
    ],
    takeaways: [
      "Use summary_large_image card type with a 1200×630 JPEG or WebP — SVG is not supported by the X crawler.",
      "Always use absolute https:// URLs in twitter:image; relative paths are not resolved by the crawler.",
      "Supply a generated fallback URL when the post has no featured image so the card never renders as plain text.",
      "Set both twitter:image and og:image to cover X, Slack, Discord, and LinkedIn in one pass.",
      "Validate new templates with the X Card Validator before publishing to catch encoding or redirect issues.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "linkedin-post-image-placeholders",
      "generate-blog-thumbnails-from-text",
    ],
  },

  // ─── POST 2 ────────────────────────────────────────────────────────────────
  {
    title: "LinkedIn Post Image Placeholders for Blogs and Docs",
    description:
      "Get the correct LinkedIn image size for post links and articles, and set reliable og:image fallbacks so LinkedIn always shows a preview card when content is shared.",
    slug: "linkedin-post-image-placeholders",
    readTime: "6 min read",
    category: "Content Workflows",
    tags: [
      "linkedin image size",
      "linkedin og image",
      "social preview fallback",
      "open graph",
      "content workflows",
    ],
    summary: [
      "LinkedIn link previews pull from og:image. When that tag is missing or the image URL fails, LinkedIn renders a plain link card with no visual — making shared blog posts and docs look unfinished and hurting engagement.",
      "Getting LinkedIn previews right requires the correct dimensions, an absolute URL returning a raster image, and a fallback strategy in your CMS or templating layer for posts that lack a dedicated featured image.",
    ],
    sections: [
      {
        eyebrow: "How it works",
        title: "How LinkedIn reads og:image for link previews",
        body: [
          "LinkedIn's crawler reads og:image from the HTML at the shared URL. Unlike X/Twitter, LinkedIn does not support a LinkedIn-specific image meta tag — og:image is the only hook you have.",
          "The crawler fetches and caches the image at share time. If the URL is not publicly accessible, returns an error status, or points to an SVG, LinkedIn will not display a preview image. Cached previews persist until you manually refresh them through LinkedIn's Post Inspector tool.",
          "One frequent failure: images behind a CDN that requires a signed URL or a session cookie. LinkedIn's crawler has no session context, so any image requiring authentication silently fails.",
        ],
      },
      {
        eyebrow: "Dimensions",
        title: "LinkedIn image size for posts and articles",
        body: [
          "For shared link previews — the kind generated when you paste a URL into a LinkedIn post — the recommended image size is 1200×627 pixels. LinkedIn crops images to approximately 1.91:1 in the card display.",
          "For LinkedIn Articles, the cover image displays at 744×400 in the editor preview, but upload at least 1200×644 for sharp display on high-DPI screens.",
          "PNG and JPEG are the safe choices. WebP works in most cases but has had inconsistent support across LinkedIn's crawler versions. Avoid GIF (only the first frame is used) and avoid SVG entirely.",
        ],
        code: `<meta property="og:image" content="https://fallback.pics/api/v1/1200x627.jpg?text=Your+Post+Title" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627" />
<meta property="og:image:type" content="image/jpeg" />`,
      },
      {
        eyebrow: "Fallback strategy",
        title: "Generate og:image fallbacks when no featured image exists",
        body: [
          "Most blog and documentation platforms allow you to skip the featured image field. The result on LinkedIn is a card with no visual. Prevent that by substituting a generated URL whenever the field is empty.",
          "Use the fallback.pics thumbnail route for blog posts to get a preview that includes the post title. For technical documentation pages, a plain dimension URL with a branded color is sufficient.",
        ],
        code: `// Astro / Next.js / any template
const ogImage = post.featuredImage
  ?? \`https://fallback.pics/api/v1/1200x627.jpg?text=\${encodeURIComponent(post.title)}\`;

// Docs pages without a meaningful title
const ogImage = page.coverImage
  ?? 'https://fallback.pics/api/v1/1200x627/7C3AED/FFFFFF?text=Documentation';`,
      },
      {
        eyebrow: "CMS workflows",
        title: "LinkedIn fallbacks in WordPress, Ghost, and headless CMS",
        body: [
          "In WordPress with Yoast SEO, the Social tab lets you override the OG image per post. For a global fallback, set a default image in SEO > Social > Facebook settings — LinkedIn uses the same og:image tag.",
          "In Ghost, the {{facebook_image}} helper provides the og:image value for social sharing. Wrap it in an #if conditional and substitute a generated URL when no image is set.",
          "In Contentful or a similar headless CMS, query the image field with optional chaining and compute the fallback server-side before rendering the page head.",
        ],
      },
      {
        eyebrow: "Debugging",
        title: "Use LinkedIn Post Inspector to refresh stale previews",
        body: [
          "LinkedIn caches og:image at first-share time. If you update the image after the URL has already been shared, the cached version persists. LinkedIn's Post Inspector (linkedin.com/post-inspector/) lets you re-fetch the URL and clear the preview cache.",
          "Common reasons a preview fails: the URL returns an HTTP redirect chain before the final image, the image is served with a Cache-Control: no-store header, or the og:image URL is relative rather than absolute.",
          "If the Post Inspector shows the correct image but LinkedIn posts still show a broken card, check whether your page returns a 200 status. A redirect to a login wall or a maintenance page causes the crawler to read the wrong HTML head.",
        ],
      },
      {
        eyebrow: "Quick reference",
        title: "LinkedIn image sizes at a glance",
        body: [
          "Reference these when setting up LinkedIn og:image templates across different content types.",
        ],
        cards: [
          {
            title: "Shared link preview",
            body: "1200×627 px, JPEG or PNG, 1.91:1 ratio, under 5 MB.",
          },
          {
            title: "LinkedIn Article cover",
            body: "Minimum 1200×644 px for sharp display. 744×400 shown in editor preview.",
          },
          {
            title: "Company page banner",
            body: "1128×191 px for the company cover photo — separate from og:image.",
          },
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related social image patterns",
        body: [
          "Twitter Cards and LinkedIn previews share most of the same og:image constraints. A single well-formed og:image tag handles LinkedIn, X, Slack, and Discord in most cases.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/twitter-card-image-fallbacks/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "LinkedIn uses og:image exclusively — there is no linkedin-specific image meta tag.",
      "Use 1200×627 pixels, JPEG or PNG, for shared link preview cards.",
      "Always use an absolute https:// URL; relative paths and SVGs will not render in LinkedIn previews.",
      "Substitute a generated fallback URL for posts that lack a dedicated featured image.",
      "Use LinkedIn Post Inspector to refresh stale cached previews after an image URL changes.",
    ],
    related: [
      "twitter-card-image-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
      "generate-blog-thumbnails-from-text",
    ],
  },

  // ─── POST 3 ────────────────────────────────────────────────────────────────
  {
    title: "Astro Image Fallbacks for Content Sites and Docs",
    description:
      "Handle missing and broken images in Astro using onerror handlers, the Image component, and fallback.pics placeholder URLs in content collections and layouts.",
    slug: "astro-image-fallback-patterns",
    readTime: "8 min read",
    category: "Implementation Guides",
    tags: [
      "astro image fallback",
      "astro image component",
      "content collections",
      "placeholder image",
      "astro",
    ],
    summary: [
      "Astro handles images at two distinct layers: the built-in Image component for locally processed assets and plain img tags or frontmatter URLs for external or CMS-sourced media. Fallback handling differs between the two, and mixing them up is the most common source of broken images in Astro projects.",
      "For content collections and docs sites, the most common failure is a missing or mistyped image path in frontmatter. A fallback URL pattern catches those errors before they reach production.",
    ],
    sections: [
      {
        eyebrow: "Context",
        title: "Where Astro image fallbacks are actually needed",
        body: [
          "Astro's Image component processes local images at build time. If the source file is missing, the build fails with an error — which is often the right behavior in development. The failure mode you need to handle is runtime: remote images that return 404, CMS media fields that are empty, or blog post frontmatter with optional image fields.",
          "The two main fallback surfaces in Astro are the img src attribute in .astro component templates and the image field in content collection schemas. Both need a different approach.",
        ],
      },
      {
        eyebrow: "Basic fallback",
        title: "onerror fallback on an img tag in Astro",
        body: [
          "For remote images rendered with a plain img tag, the onerror attribute handles the failure case client-side. This fires when the browser cannot load the image from the given src.",
          "Use this pattern in card components, author avatars, and blog post thumbnails that display remote URLs from a CMS or external API.",
          "Be careful not to create an infinite loop. If the fallback URL itself fails, onerror fires again. Setting this.onerror=null before changing the src prevents that.",
        ],
        code: `<!-- In an Astro component -->
<img
  src={post.image}
  alt={post.imageAlt ?? post.title}
  width="1200"
  height="630"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=Post+Image'"
/>`,
      },
      {
        eyebrow: "Content collections",
        title: "Handle optional image fields in content collection schemas",
        body: [
          "When you define an image field in a content collection schema with z.string().optional(), any post without an image field returns undefined. Resolve a fallback at the template level.",
          "The cleanest pattern is a utility function that accepts the post entry and returns either the declared image or a generated fallback URL. This keeps template logic minimal and testable.",
        ],
        code: `// src/utils/postImage.ts
import type { CollectionEntry } from 'astro:content';

export function postImage(entry: CollectionEntry<'blog'>) {
  if (entry.data.image) return entry.data.image;
  const text = encodeURIComponent(entry.data.title);
  return \`https://fallback.pics/api/v1/1200x630.jpg?text=\${text}\`;
}

// In an Astro page
---
import { getCollection } from 'astro:content';
import { postImage } from '../utils/postImage';
const posts = await getCollection('blog');
---
{posts.map(post => (
  <img src={postImage(post)} alt={post.data.title} width="1200" height="630" />
))}`,
      },
      {
        eyebrow: "Astro Image component",
        title: "Fallback with Astro's built-in Image component",
        body: [
          "Astro's Image component does not support an onerror prop or a fallback src. If you need client-side fallback behavior on a processed image, render an unprocessed img tag alongside it, or use a client-side React or Svelte island.",
          "For remote images you want to optimize through Astro's image pipeline, add the domain to the image configuration and use a null-check to skip optimization for URLs from less-reliable origins.",
          "In practice, most Astro docs and blog sites benefit from using Image for locally stored assets and plain img with an onerror for all externally sourced media.",
        ],
        code: `// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['images.example.com', 'cdn.example.com'],
  },
});

<!-- Reliable local asset — use Image -->
<Image src={localImage} alt="Post thumbnail" width={1200} height={630} />

<!-- Remote CMS image — use img + onerror -->
<img
  src={cmsImageUrl}
  alt="Post thumbnail"
  width="1200"
  height="630"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/1200x630?text=Missing+Image'"
/>`,
      },
      {
        eyebrow: "OG image",
        title: "Set og:image fallbacks in Astro layouts",
        body: [
          "Blog posts built from content collections should always have an og:image in the page head, even if no featured image was set. Compute the fallback URL in the layout component before it is used in the meta tag.",
          "The thumbnail route produces an image that renders well in social link previews because it places the post title in a readable text zone. Request .jpg from the thumbnail route for maximum platform compatibility.",
        ],
        code: `---
// src/layouts/BlogLayout.astro
const { post } = Astro.props;
const ogImage = post.data.image
  ?? \`https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=\${encodeURIComponent(post.data.title)}&label=Blog\`;
---
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Performance",
        title: "Always declare width, height, and loading attributes",
        body: [
          "A missing width and height on an img tag causes layout shift when the image loads. Always include explicit dimensions, especially for fallback images that may not match the dimensions of the original.",
          "Set loading='lazy' on below-the-fold images and loading='eager' on hero images. For placeholder fallback images in a grid, lazy loading prevents unnecessary network requests for cards that never enter the viewport.",
        ],
        code: `<img
  src={postImage(post)}
  alt={post.data.title}
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/800x450?text=Image+Unavailable'"
/>`,
      },
      {
        eyebrow: "Further reading",
        title: "Docs and related patterns",
        body: [
          "The fallback.pics docs cover all URL parameters for generating placeholders and thumbnails. For the broader onerror pattern in plain HTML, see the fix-broken-images guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/nextjs-image-fallbacks-without-layout-shift/`,
      },
    ],
    takeaways: [
      "Set this.onerror=null before updating this.src to prevent infinite fallback loops on broken fallback URLs.",
      "Resolve optional content collection image fields in a utility function, not inline in template markup.",
      "Astro's Image component does not accept onerror; use a plain img tag for externally sourced media.",
      "Always set width and height on img tags — including fallback images — to prevent layout shift.",
      "Compute og:image fallback URLs in the layout component so every page has a valid social preview image.",
    ],
    related: [
      "nextjs-image-fallbacks-without-layout-shift",
      "react-image-fallback-patterns",
      "fix-broken-images-html-onerror",
    ],
  },

  // ─── POST 4 ────────────────────────────────────────────────────────────────
  {
    title: "Nuxt 3 Image Component Fallbacks and Error Handling",
    description:
      "Handle failed and missing images in Nuxt 3 with NuxtImg error events, composables, and fallback.pics placeholder URLs for dynamic image slots and CMS data.",
    slug: "nuxt-image-fallback-patterns",
    readTime: "8 min read",
    category: "Implementation Guides",
    tags: [
      "nuxt image fallback",
      "nuxt image component",
      "@nuxt/image",
      "placeholder image",
      "vue image fallback",
    ],
    summary: [
      "Nuxt 3 projects that use @nuxt/image get optimized image delivery through NuxtImg and NuxtPicture components. Both emit an error event when the source URL fails — that is the primary hook for client-side fallback.",
      "For Nuxt apps pulling dynamic content from APIs or a headless CMS, server-side fallback resolution in useAsyncData prevents broken image slots from reaching the browser in the first place.",
    ],
    sections: [
      {
        eyebrow: "Setup",
        title: "Configure @nuxt/image for external domains",
        body: [
          "@nuxt/image is installed separately from Nuxt core and requires a provider configured in nuxt.config.ts. For simple external URLs and fallback.pics, the ipx provider or no provider at all works fine — the URLs are fully formed public endpoints.",
          "Add fallback.pics and any other external image domains to the image.domains array so @nuxt/image can proxy or optimize them if needed.",
        ],
        code: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    domains: ['fallback.pics', 'your-cdn.example.com'],
  },
});`,
      },
      {
        eyebrow: "Error event",
        title: "Handle NuxtImg load errors with the error event",
        body: [
          "NuxtImg emits an error event when the image fails to load. Bind a handler to swap src to a fallback URL. Use a ref to track the resolved source and prevent repeated error triggers.",
          "The error event receives a native Event object. Use it to log which URL failed — useful for monitoring broken media in production dashboards.",
        ],
        code: `<script setup>
const props = defineProps<{ imageSrc: string; alt: string }>();
const fallbackSrc = 'https://fallback.pics/api/v1/800x450/7C3AED/FFFFFF?text=Image+Unavailable';
const src = ref(props.imageSrc);

function onImageError() {
  if (src.value !== fallbackSrc) src.value = fallbackSrc;
}
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt"
    width="800"
    height="450"
    @error="onImageError"
  />
</template>`,
      },
      {
        eyebrow: "Composable",
        title: "Create a useImageFallback composable",
        body: [
          "Wrapping the fallback logic in a composable keeps components clean and makes the behavior testable in isolation. The composable returns a reactive src ref and an onError handler.",
          "Accept the fallback URL as an optional parameter so the same composable covers different image slot sizes across the app.",
        ],
        code: `// composables/useImageFallback.ts
export function useImageFallback(initial: string, fallback?: string) {
  const DEFAULT = 'https://fallback.pics/api/v1/800x450?text=Not+Found';
  const src = ref(initial);
  const resolvedFallback = fallback ?? DEFAULT;

  function onError() {
    if (src.value !== resolvedFallback) src.value = resolvedFallback;
  }

  return { src, onError };
}

// In a component
const { src, onError } = useImageFallback(props.imageSrc);`,
      },
      {
        eyebrow: "Server-side",
        title: "Resolve fallbacks server-side in useAsyncData",
        body: [
          "When fetching content from an API, check for null or missing image fields during the useAsyncData call and substitute a fallback URL before the page renders. This prevents the broken-image icon from flashing on first paint.",
          "Computing the fallback on the server also means social crawlers and link-preview bots see the correct og:image value — a client-side error handler does not help those cases.",
        ],
        code: `// pages/blog/[slug].vue
const { data: post } = await useAsyncData('post', () =>
  $fetch(\`/api/posts/\${route.params.slug}\`)
);

const postImage = computed(() => {
  if (!post.value) return 'https://fallback.pics/api/v1/1200x630?text=Loading';
  return post.value.image
    ?? \`https://fallback.pics/api/v1/1200x630.jpg?text=\${encodeURIComponent(post.value.title)}\`;
});`,
      },
      {
        eyebrow: "Avatar fallbacks",
        title: "User avatars with initials from the avatar route",
        body: [
          "Avatar slots in user profiles, comment sections, and admin dashboards fail when no profile photo is set. The fallback.pics avatar route accepts a text parameter for initials.",
          "Generate initials from the user's name server-side and embed them in the fallback URL. For consistent visual output, derive a background color from the user ID.",
        ],
        code: `function avatarUrl(user: { name: string; image?: string }) {
  if (user.image) return user.image;
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return \`https://fallback.pics/api/v1/avatar/80?text=\${initials}\`;
}`,
      },
      {
        eyebrow: "Performance",
        title: "Prevent CLS with explicit dimensions on NuxtImg",
        body: [
          "Nuxt 3 with @nuxt/image injects width and height attributes automatically when you supply them as props. Always set these on NuxtImg — even when the image source might change to a fallback.",
          "Keep fallback URL dimensions consistent with the main image dimensions. If the fallback.pics URL produces a different aspect ratio, you will get layout shift even after the error state is resolved.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Docs and related patterns",
        body: [
          "The fallback.pics API reference covers all URL parameters. For Vue-specific onerror patterns without Nuxt, see the implementation guides.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/react-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Bind @error on NuxtImg and swap src via a ref; guard against infinite retries by comparing current src to the fallback first.",
      "Extract fallback logic into a useImageFallback composable to keep components clean and the behavior testable.",
      "Resolve null image fields server-side in useAsyncData so social crawlers receive a valid og:image on first fetch.",
      "Use /api/v1/avatar/{size}?text=JD for user avatars without a profile photo.",
      "Match fallback image dimensions to the slot dimensions to avoid layout shift after error recovery.",
    ],
    related: [
      "astro-image-fallback-patterns",
      "react-image-fallback-patterns",
      "fix-broken-images-html-onerror",
    ],
  },

  // ─── POST 5 ────────────────────────────────────────────────────────────────
  {
    title: "Remix Image Loading and Broken URL Fallbacks",
    description:
      "Implement image fallback patterns in Remix using loader functions, React onError handlers, and fallback.pics URLs for missing media in full-stack React routes.",
    slug: "remix-image-fallback-patterns",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "remix image fallback",
      "remix loader",
      "react image error",
      "placeholder image",
      "full-stack react",
    ],
    summary: [
      "Remix routes fetch data in loader functions on the server — that is the right place to resolve fallback image URLs before they reach the browser. Missing media fields in the loader response should never reach an img tag as undefined or null.",
      "For images that can fail after the initial render — user-uploaded content or third-party CDN URLs — an onError handler on the img element provides the client-side safety net.",
    ],
    sections: [
      {
        eyebrow: "Loader pattern",
        title: "Resolve fallback images in Remix loader functions",
        body: [
          "Remix loaders run on the server for every navigation. They are the cleanest place to resolve a missing image field because the fallback URL ends up in the serialized JSON response and is available before the component renders.",
          "This approach also ensures that social crawlers, which parse server-rendered HTML, see the correct og:image meta tag rather than an empty or null value.",
        ],
        code: `// app/routes/products.$slug.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const product = await db.product.findUnique({ where: { slug: params.slug } });
  if (!product) throw new Response('Not Found', { status: 404 });

  return json({
    ...product,
    image: product.image
      ?? \`https://fallback.pics/api/v1/800x800/7C3AED/FFFFFF?text=\${encodeURIComponent(product.name)}\`,
  });
}`,
      },
      {
        eyebrow: "Client fallback",
        title: "onError handler for Remix route components",
        body: [
          "Loader-resolved fallbacks cover missing fields in the database. But an image URL that exists in the database can still return a 404 if the original file was deleted from a CDN or S3 bucket. onError handles that case.",
          "In React, set the handler via the onError prop (camelCase). Update a piece of state to swap the displayed src rather than mutating the DOM directly.",
        ],
        code: `// app/components/ProductImage.tsx
export function ProductImage({ src, name }: { src: string; name: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback = \`https://fallback.pics/api/v1/800x800?text=\${encodeURIComponent(name)}\`;

  return (
    <img
      src={imgSrc}
      alt={name}
      width={800}
      height={800}
      onError={() => { if (imgSrc !== fallback) setImgSrc(fallback); }}
    />
  );
}`,
      },
      {
        eyebrow: "Meta function",
        title: "Set og:image in the Remix meta export",
        body: [
          "Remix uses the meta export to set per-route meta tags. The loader data is available as an argument, so you can use the resolved image URL (including fallback) directly in the og:image tag.",
          "Return og:image:width and og:image:height as separate meta entries. Facebook and LinkedIn crawlers use these values to decide whether to show the image or fall back to a no-image card.",
        ],
        code: `// app/routes/blog.$slug.tsx
export function meta({ data }: MetaArgs) {
  return [
    { title: data.post.title },
    { property: 'og:image', content: data.post.image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
  ];
}`,
      },
      {
        eyebrow: "Error boundary",
        title: "When to use ErrorBoundary vs component onError",
        body: [
          "If an entire route crashes because an image fetch throws, an ErrorBoundary component can render a fallback UI rather than a full error page. This is uncommon for image-only failures but worth knowing.",
          "For most image fallback cases, individual component state with onError is the right granularity. Use ErrorBoundary at the route level for data fetching failures, not for individual img load errors.",
        ],
      },
      {
        eyebrow: "Avatar example",
        title: "User avatar fallbacks in Remix apps",
        body: [
          "User profile images are one of the most common fallback cases in Remix apps. Resolve the avatar URL in the loader and use the avatar route with initials when the user has not uploaded a photo.",
          "Initials-based avatars are more readable than a blank square and require no additional assets or client-side logic.",
        ],
        code: `// In loader
const avatarUrl = user.avatar
  ?? \`https://fallback.pics/api/v1/avatar/64?text=\${getInitials(user.name)}\`;

// Helper
function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}`,
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "The general onerror pattern for any HTML context is documented in the HTML fallback guide. For Next.js-specific image fallback patterns, the next/image guide covers similar ground.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/react-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Resolve missing image fields in Remix loader functions so the fallback URL is in the page before client hydration.",
      "Use React's onError prop (not HTML onerror) in Remix route components to handle CDN failures post-render.",
      "Guard against infinite error loops: check whether imgSrc already equals the fallback before calling setImgSrc.",
      "Use resolved loader data in the meta export to set og:image so social crawlers see the correct URL.",
      "Avatar fallbacks with /api/v1/avatar/{size}?text= are more informative than generic placeholder squares.",
    ],
    related: [
      "nextjs-image-fallbacks-without-layout-shift",
      "react-image-fallback-patterns",
      "fix-broken-images-html-onerror",
    ],
  },

  // ─── POST 6 ────────────────────────────────────────────────────────────────
  {
    title: "Gatsby Image Fallback When gatsby-plugin-image Fails",
    description:
      "Handle broken and missing images in Gatsby with GatsbyImage null checks, onError handlers, and fallback.pics URLs for empty CMS media fields and external product photos.",
    slug: "gatsby-image-fallback-patterns",
    readTime: "8 min read",
    category: "Implementation Guides",
    tags: [
      "gatsby image fallback",
      "gatsby-plugin-image",
      "GatsbyImage",
      "cms image missing",
      "placeholder image",
    ],
    summary: [
      "gatsby-plugin-image processes images at build time and creates optimized responsive variants. When a CMS returns null for an image field, or when the source file is missing, the build either fails or renders an empty slot depending on how the query is structured.",
      "Fallback patterns for Gatsby split into two cases: build-time null handling for GraphQL image nodes, and runtime onError handling for external images loaded outside the Gatsby image pipeline.",
    ],
    sections: [
      {
        eyebrow: "Two failure modes",
        title: "Build-time null vs runtime 404 in Gatsby images",
        body: [
          "gatsby-plugin-image optimizes images during gatsby build by processing source nodes from GraphQL. If a CMS image field returns null and your query treats it as required, the build fails. If it is nullable, the image slot renders nothing.",
          "The second failure mode is runtime: an img tag whose src is an external URL that returns 404 after the page loads. This is common for product catalogs, user content, and any image URL stored as a plain string in a CMS rather than as a processed media node.",
          "Most Gatsby projects need both approaches: null-checks on processed image fields and onError handlers on plain img tags.",
        ],
      },
      {
        eyebrow: "Null handling",
        title: "Handle null CMS image fields in Gatsby page templates",
        body: [
          "In a Gatsby page template, use optional chaining when accessing the image node. The GatsbyImage component requires a valid gatsbyImageData prop — passing null or undefined causes a runtime error.",
          "When the CMS field is null, fall back to a plain img tag with a generated fallback URL. This keeps the page rendering without crashing and still shows something useful.",
        ],
        code: `// templates/post.tsx
export default function PostTemplate({ data }) {
  const { post } = data;
  const image = post.frontmatter.coverImage;

  return (
    <article>
      {image ? (
        <GatsbyImage
          image={image.childImageSharp.gatsbyImageData}
          alt={post.frontmatter.title}
        />
      ) : (
        <img
          src={\`https://fallback.pics/api/v1/1200x630?text=\${encodeURIComponent(post.frontmatter.title)}\`}
          alt={post.frontmatter.title}
          width={1200}
          height={630}
        />
      )}
    </article>
  );
}`,
      },
      {
        eyebrow: "GraphQL query",
        title: "Mark image fields as optional in GraphQL queries",
        body: [
          "In Gatsby's GraphQL layer, image fields sourced from local files or a CMS can be null if the file is missing. Mark the entire image block as optional so that a missing image does not fail the entire page build.",
          "For Contentful or Sanity-sourced images, the childImageSharp node is only available when Gatsby has processed the file. A remote URL stored as a plain string will not have a childImageSharp node at all.",
        ],
        code: `query PostQuery($id: String!) {
  post: mdx(id: { eq: $id }) {
    frontmatter {
      title
      coverImage {
        childImageSharp {
          gatsbyImageData(width: 1200, height: 630, placeholder: BLURRED)
        }
      }
    }
  }
}`,
      },
      {
        eyebrow: "External images",
        title: "onError fallback for externally sourced images",
        body: [
          "Any image loaded via a plain img tag — product photos from an API, user-uploaded content, or CMS URLs not processed by gatsby-plugin-image — can fail at runtime. Add an onError handler.",
          "In React (which Gatsby uses), use the onError prop. Update state to swap to the fallback URL and prevent retries by checking the current src value before setting the fallback.",
        ],
        code: `// components/ProductCard.tsx
export function ProductCard({ product }) {
  const [src, setSrc] = useState(product.imageUrl);
  const fallback = \`https://fallback.pics/api/v1/400x400?text=\${encodeURIComponent(product.name)}\`;

  return (
    <img
      src={src}
      alt={product.name}
      width={400}
      height={400}
      onError={() => { if (src !== fallback) setSrc(fallback); }}
    />
  );
}`,
      },
      {
        eyebrow: "OG image",
        title: "Set og:image fallbacks in Gatsby Head API",
        body: [
          "Gatsby's Head API lets you export a Head function from any page or template. Use it to compute a fallback og:image when the page has no featured image.",
          "The thumbnail route is a good fit here because it produces a blog-card style image with the post title embedded — better for social previews than a plain color block.",
        ],
        code: `// templates/post.tsx
export function Head({ data }) {
  const { post } = data;
  const ogImage = post.frontmatter.coverImage
    ? post.frontmatter.coverImage.publicURL
    : \`https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=\${encodeURIComponent(post.frontmatter.title)}\`;

  return (
    <>
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}`,
      },
      {
        eyebrow: "Tradeoffs",
        title: "Static fallback image vs generated URL",
        body: [
          "A static fallback image — a single file committed to the repo — is simpler to manage and guarantees availability. It breaks down when posts benefit from different visual treatment by category or topic.",
          "A generated URL from fallback.pics is more dynamic: it embeds the post title, supports category labels and color themes, and requires no additional assets. The tradeoff is a dependency on the external service, though for a last-resort fallback that dependency is acceptable.",
        ],
        cards: [
          {
            title: "Static file fallback",
            body: "Zero external dependency. Same image for all posts. Easy to serve from CDN.",
          },
          {
            title: "Generated URL fallback",
            body: "Per-post title and category. No asset management. Depends on external API.",
          },
          {
            title: "Build-time check",
            body: "Fail the build on missing images to catch content errors before deploy.",
          },
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "Next.js handles similar build-time and runtime image fallback concerns. The React image fallback patterns post covers component-level onError handling for any React framework.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/nextjs-image-fallbacks-without-layout-shift/
https://fallback.pics/blog/react-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Render GatsbyImage when the image node exists; fall back to a plain img with a generated URL when the CMS field is null.",
      "Mark image fields as optional in GraphQL queries to prevent build failures when media is missing.",
      "Add onError handlers to plain img tags for externally sourced images that gatsby-plugin-image does not process.",
      "Use the Gatsby Head API to set og:image fallbacks so social crawlers receive a valid URL for every page.",
      "A generated URL with title and category parameters provides per-post visual variety without managing static fallback files.",
    ],
    related: [
      "nextjs-image-fallbacks-without-layout-shift",
      "react-image-fallback-patterns",
      "fix-broken-images-html-onerror",
    ],
  },

  // ─── POST 7 ────────────────────────────────────────────────────────────────
  {
    title: "SvelteKit Image Fallback Component Pattern",
    description:
      "Build a reusable SvelteKit image fallback component using on:error events and fallback.pics placeholder URLs for broken images and missing CMS media fields.",
    slug: "sveltekit-image-fallback",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "sveltekit image fallback",
      "svelte on:error",
      "placeholder image",
      "svelte component",
      "image error handling",
    ],
    summary: [
      "SvelteKit provides a clean way to handle image failures using Svelte's on:error directive on img elements. Combined with a reactive let variable for the src, you can build a drop-in fallback component that handles broken URLs and missing CMS media.",
      "For server-rendered pages, resolve fallback URLs in SvelteKit's load function before the component renders so social crawlers and first-paint users never see broken image slots.",
    ],
    sections: [
      {
        eyebrow: "Core pattern",
        title: "on:error fallback in a Svelte component",
        body: [
          "Svelte makes image fallback straightforward with the on:error directive. Bind the src attribute to a let variable and update it in the error handler.",
          "Keep the fallback value separate from the reactive src so you can check whether the error handler has already triggered — preventing an infinite loop if the fallback URL itself fails.",
        ],
        code: `<!-- src/lib/components/FallbackImage.svelte -->
<script>
  export let src;
  export let alt;
  export let width = 800;
  export let height = 450;

  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}?text=Image+Not+Found\`;
  let currentSrc = src;

  function handleError() {
    if (currentSrc !== fallback) currentSrc = fallback;
  }
</script>

<img
  src={currentSrc}
  {alt}
  {width}
  {height}
  on:error={handleError}
/>`,
      },
      {
        eyebrow: "Load function",
        title: "Resolve missing images in SvelteKit load functions",
        body: [
          "SvelteKit's load function runs on the server for the initial request and on the client for subsequent navigation. Resolving fallback URLs here ensures the correct src reaches the template before the component mounts.",
          "This is especially valuable for blog post pages and product detail pages where CMS data may have empty image fields.",
        ],
        code: `// src/routes/blog/[slug]/+page.server.ts
export async function load({ params }) {
  const post = await fetchPost(params.slug);
  if (!post) error(404, 'Post not found');

  return {
    post: {
      ...post,
      image: post.image
        ?? \`https://fallback.pics/api/v1/1200x630.jpg?text=\${encodeURIComponent(post.title)}\`,
    },
  };
}`,
      },
      {
        eyebrow: "Reusable component",
        title: "Parameterize the fallback with props",
        body: [
          "A parameterized FallbackImage component accepts custom fallback dimensions and text for different use cases: blog thumbnails, product images, and user avatars each have different size requirements.",
          "Make the fallback reactive with a $: computed declaration so it updates if width or height props change.",
        ],
        code: `<!-- src/lib/components/FallbackImage.svelte (extended) -->
<script>
  export let src;
  export let alt;
  export let width = 800;
  export let height = 450;
  export let fallbackText = 'Image+Not+Available';

  $: fallback = \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${fallbackText}\`;
  let currentSrc = src;

  $: currentSrc = src; // reset when prop changes

  function handleError() {
    if (currentSrc !== fallback) currentSrc = fallback;
  }
</script>

<img src={currentSrc} {alt} {width} {height} on:error={handleError} />`,
      },
      {
        eyebrow: "Avatar pattern",
        title: "User avatar fallback with initials",
        body: [
          "User avatar slots are a common fallback case. When no profile image is set, display initials in a colored circle. The fallback.pics avatar route handles this without any additional component markup.",
        ],
        code: `<!-- src/lib/components/Avatar.svelte -->
<script>
  export let src;
  export let name;
  export let size = 48;

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const fallback = \`https://fallback.pics/api/v1/avatar/\${size}?text=\${initials}\`;
  let currentSrc = src ?? fallback;

  function handleError() {
    if (currentSrc !== fallback) currentSrc = fallback;
  }
</script>

<img
  src={currentSrc}
  alt="{name} avatar"
  width={size}
  height={size}
  on:error={handleError}
  style="border-radius: 50%"
/>`,
      },
      {
        eyebrow: "OG image",
        title: "Set og:image fallbacks in SvelteKit layouts",
        body: [
          "Use SvelteKit's page meta handling in +page.server.ts to pass og:image data down to the head. Resolve the fallback URL in the load function and use it in a +layout.svelte svelte:head block.",
          "This ensures social crawlers and link preview bots receive a valid og:image on the server-rendered response.",
        ],
        code: `<!-- +layout.svelte -->
<svelte:head>
  {#if data.ogImage}
    <meta property="og:image" content={data.ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}
</svelte:head>`,
      },
      {
        eyebrow: "Performance",
        title: "Always declare width and height on img elements",
        body: [
          "Svelte does not add implicit width and height to img elements. An img without explicit dimensions causes layout shift when the image loads or when it is replaced by a fallback.",
          "Pass width and height as props to your FallbackImage component and forward them to the img element. For content where dimensions vary, use aspect-ratio CSS to reserve space.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Docs and related patterns",
        body: [
          "For the general on:error pattern in plain HTML, see the fallback.pics guide on fixing broken images. The React patterns guide covers the equivalent hook-based approach.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/react-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Use on:error in Svelte to swap src to a fallback URL when the image fails to load.",
      "Guard against infinite error loops by comparing currentSrc to the fallback value before updating.",
      "Resolve missing CMS image fields in the load function so fallback URLs are ready before the component mounts.",
      "Make FallbackImage a parameterized component with width, height, and fallbackText props for reuse across contexts.",
      "Always forward width and height props to the img element to prevent layout shift.",
    ],
    related: [
      "astro-image-fallback-patterns",
      "fix-broken-images-html-onerror",
      "react-image-fallback-patterns",
    ],
  },

  // ─── POST 8 ────────────────────────────────────────────────────────────────
  {
    title: "SolidJS Image onerror Fallback for Fast UIs",
    description:
      "Add image onerror fallback handling in SolidJS using signals and createEffect, with fallback.pics placeholder URLs for missing and broken media in fast reactive UIs.",
    slug: "solidjs-image-fallback",
    readTime: "6 min read",
    category: "Implementation Guides",
    tags: [
      "solidjs image fallback",
      "solid js onerror",
      "solid signal",
      "placeholder image",
      "solidjs",
    ],
    summary: [
      "SolidJS fine-grained reactivity makes image fallback logic clean and efficient. A signal for the image src, updated in an onError handler, triggers a targeted DOM update without re-rendering the full component tree.",
      "For SolidJS apps with dynamic content or user-generated media, a small fallback component built with createSignal and createEffect covers both missing-at-load-time and failed-to-load scenarios.",
    ],
    sections: [
      {
        eyebrow: "Core pattern",
        title: "createSignal fallback for broken img src",
        body: [
          "In SolidJS, bind the img src to a signal. In the onError handler, update the signal to the fallback URL. SolidJS updates only the src attribute — not the entire component tree.",
          "Check the current signal value before setting the fallback to prevent an infinite loop if the fallback URL itself returns an error.",
        ],
        code: `// components/FallbackImage.tsx (SolidJS)
import { createSignal } from 'solid-js';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackText?: string;
}

export function FallbackImage(props: Props) {
  const fallback = () =>
    \`https://fallback.pics/api/v1/\${props.width}x\${props.height}?text=\${props.fallbackText ?? 'Not+Found'}\`;

  const [src, setSrc] = createSignal(props.src);

  return (
    <img
      src={src()}
      alt={props.alt}
      width={props.width}
      height={props.height}
      onError={() => { if (src() !== fallback()) setSrc(fallback()); }}
    />
  );
}`,
      },
      {
        eyebrow: "Reactive props",
        title: "Handle prop changes with createEffect",
        body: [
          "SolidJS signals do not automatically track prop changes from the parent. If the parent changes the src prop — for example, when navigating between items in a gallery — the signal stays at its last value.",
          "Use createEffect to watch the incoming src prop and reset the signal when it changes. This ensures the fallback resets correctly for new images.",
        ],
        code: `import { createSignal, createEffect } from 'solid-js';

export function FallbackImage(props: Props) {
  const [src, setSrc] = createSignal(props.src);
  const fallback = \`https://fallback.pics/api/v1/\${props.width}x\${props.height}?text=Not+Found\`;

  // Reset when src prop changes (e.g., navigating a gallery)
  createEffect(() => { setSrc(props.src); });

  return (
    <img
      src={src()}
      alt={props.alt}
      width={props.width}
      height={props.height}
      onError={() => { if (src() !== fallback) setSrc(fallback); }}
    />
  );
}`,
      },
      {
        eyebrow: "Resource pattern",
        title: "Resolve fallbacks with createResource",
        body: [
          "When fetching image data from an API, use createResource to handle async state. Derive the image URL from the resource state, substituting a fallback when the resource returns null.",
          "This pattern works well for product pages where the image URL is fetched separately, or for user dashboards where profile data may have an empty avatar field.",
        ],
        code: `import { createResource } from 'solid-js';

const [user] = createResource(() => fetchUser(userId));

const avatarSrc = () => {
  const u = user();
  if (!u) return 'https://fallback.pics/api/v1/avatar/64?text=...';
  return u.avatar
    ?? \`https://fallback.pics/api/v1/avatar/64?text=\${getInitials(u.name)}\`;
};`,
      },
      {
        eyebrow: "Skeleton state",
        title: "Show a skeleton placeholder while loading",
        body: [
          "For images loaded via createResource, display a skeleton placeholder while the resource is loading. Use the fallback.pics animated skeleton URL for a CSS-free loading animation.",
        ],
        code: `<Show
  when={!user.loading}
  fallback={
    <img
      src="https://fallback.pics/api/v1/animated/skeleton/64x64"
      alt="Loading..."
      width="64"
      height="64"
    />
  }
>
  <img src={avatarSrc()} alt={user()?.name} width="64" height="64" />
</Show>`,
      },
      {
        eyebrow: "Performance note",
        title: "Why SolidJS fine-grained reactivity matters for fallbacks",
        body: [
          "In React, updating state in an onError handler re-runs the whole component function. In SolidJS, updating a signal updates only the bound DOM attribute. For pages with many image slots — product grids, dashboards, comment threads — fallback updates are cheaper.",
          "The practical difference is usually negligible for small pages, but in a virtualized list with hundreds of items, SolidJS's targeted DOM updates prevent unnecessary work across the entire component tree.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "The React image fallback patterns guide covers the same pattern with useState and useEffect. The general onerror guide covers plain HTML.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/react-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Bind img src to a createSignal and update the signal in onError to trigger a targeted DOM update.",
      "Use createEffect to watch the src prop and reset the signal when the parent navigates to a new image.",
      "Guard against infinite error loops by comparing the signal value to the fallback before calling setSrc.",
      "Use createResource to resolve fallback URLs from async data and Show to display a skeleton during loading.",
      "SolidJS's fine-grained updates make fallback handling in large image grids cheaper than React re-renders.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "react-image-fallback-patterns",
      "astro-image-fallback-patterns",
    ],
  },

  // ─── POST 9 ────────────────────────────────────────────────────────────────
  {
    title: "Qwik Image Placeholders for Resumable Apps",
    description:
      "Handle missing and broken images in Qwik using QwikImg, useSignal, and fallback.pics placeholder URLs with server-side resolution for resumable page loads.",
    slug: "qwik-image-placeholders",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "qwik image placeholder",
      "qwik image component",
      "qwik resumability",
      "placeholder image",
      "qwik",
    ],
    summary: [
      "Qwik's resumability model serializes component state at server render time and resumes it in the browser without re-running component code. Image fallback patterns need to fit this model — state mutations on the client must be resumable from the serialized snapshot.",
      "For Qwik City routes, resolving fallback image URLs in routeLoader functions is both the simplest and most SEO-friendly approach, covering the null-field case with zero client-side JavaScript.",
    ],
    sections: [
      {
        eyebrow: "Qwik context",
        title: "Why image fallback needs to fit Qwik's resumability model",
        body: [
          "In a traditional React app, an onerror handler is wired up as part of the initial hydration pass. In Qwik, component code does not run at page load — it is downloaded and executed lazily when the user interacts.",
          "For image elements, a plain string onerror attribute in serialized HTML fires immediately on image load failure without waiting for Qwik to activate the component. The img element's onerror is a native browser event that does not need Qwik's runtime.",
          "For state-based fallback patterns — where a signal stores the current src — you need useSignal and Qwik's event handling so the state update is captured in the resumable snapshot.",
        ],
      },
      {
        eyebrow: "routeLoader",
        title: "Resolve fallback URLs in routeLoader$",
        body: [
          "For Qwik City pages and layouts, routeLoader$ runs on the server. Resolve missing image fields here so the serialized HTML already contains the correct fallback URL.",
          "This approach works well with Qwik's resumability because the image src is static — it never needs updating in the browser unless the original URL returns a runtime 404.",
        ],
        code: `// src/routes/product/[id]/index.tsx
export const useProductData = routeLoader$(async ({ params }) => {
  const product = await db.product.findById(params.id);
  return {
    ...product,
    image: product.image
      ?? \`https://fallback.pics/api/v1/800x800?text=\${encodeURIComponent(product.name)}\`,
  };
});`,
      },
      {
        eyebrow: "Signal pattern",
        title: "Client-side fallback with useSignal for runtime failures",
        body: [
          "For images whose URLs exist in the database but may return 404 from a CDN (because the file was deleted, moved, or the signed URL expired), add a client-side fallback using useSignal and an onError$ handler.",
          "Qwik serializes the signal value into the HTML snapshot. When onerror fires, Qwik downloads the minimal code needed to update the signal and re-render only the affected DOM node.",
        ],
        code: `// components/ProductImage.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';

interface Props { src: string; name: string; width: number; height: number; }

export const ProductImage = component$((props: Props) => {
  const fallback =
    \`https://fallback.pics/api/v1/\${props.width}x\${props.height}?text=\${encodeURIComponent(props.name)}\`;
  const src = useSignal(props.src);

  const onError = $(() => {
    if (src.value !== fallback) src.value = fallback;
  });

  return (
    <img
      src={src.value}
      alt={props.name}
      width={props.width}
      height={props.height}
      onError$={onError}
    />
  );
});`,
      },
      {
        eyebrow: "Inline fallback",
        title: "Inline onError$ for static pages without reactive state",
        body: [
          "For static content pages, documentation, or places where you do not need the fallback src tracked in component state, a plain inline onError$ attribute is simpler and adds no JavaScript payload.",
          "The native onerror fires without Qwik's runtime because it is a standard HTML event attribute — the lowest-overhead approach for pages where image failures are rare.",
        ],
        code: `{/* In a Qwik component JSX */}
<img
  src={product.image}
  alt={product.name}
  width={800}
  height={800}
  onError$={(ev) => {
    const img = ev.target as HTMLImageElement;
    const fallback = 'https://fallback.pics/api/v1/800x800?text=Not+Found';
    if (img.src !== fallback) img.src = fallback;
  }}
/>`,
      },
      {
        eyebrow: "OG meta",
        title: "Set og:image in Qwik City head",
        body: [
          "Qwik City's useDocumentHead hook lets you set meta tags from route data. Use the loader data to set a valid og:image URL, including the fallback when the content field is empty.",
        ],
        code: `export default component$(() => {
  const product = useProductData();
  useDocumentHead(() => ({
    meta: [
      { property: 'og:image', content: product.value.image },
      { property: 'og:image:width', content: '800' },
      { property: 'og:image:height', content: '800' },
    ],
  }));
  return <div>...</div>;
});`,
      },
      {
        eyebrow: "Tradeoffs",
        title: "routeLoader vs signal vs inline onError",
        body: [
          "The right choice depends on when the failure occurs: at query time (null field), at render time (CDN 404), or rarely (static page). Use the lightest-weight approach that covers your actual failure mode.",
        ],
        cards: [
          {
            title: "routeLoader$",
            body: "Server-side resolution. Best for nullable CMS fields. Zero JS overhead on client.",
          },
          {
            title: "useSignal + onError$",
            body: "Client reactive state. Best for CDN images that can fail post-render. Minimal lazy JS.",
          },
          {
            title: "Inline onError$",
            body: "Native browser event. No state tracking. Best for static docs pages where failures are rare.",
          },
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Docs and guides",
        body: [
          "Qwik City's routeLoader$ and useDocumentHead are documented at qwik.dev. For the general fallback pattern in any context, see the fallback.pics guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/astro-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Resolve nullable CMS image fields in routeLoader$ so fallback URLs are baked into the serialized server HTML.",
      "Use useSignal and onError$ for CDN images that can return 404 after initial page load.",
      "Inline onError$ is simpler and lower-overhead for static content where image failures are rare.",
      "Guard against infinite error loops: check the current src value before setting the fallback in any handler.",
      "Set og:image using useDocumentHead with loader data so social crawlers see the correct resolved URL.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "astro-image-fallback-patterns",
      "nextjs-image-fallbacks-without-layout-shift",
    ],
  },

  // ─── POST 10 ───────────────────────────────────────────────────────────────
  {
    title: "Laravel Blade img Fallback for User Avatars",
    description:
      "Add image fallback patterns to Laravel Blade templates using null-coalescing, onerror attributes, and fallback.pics placeholder URLs for empty avatars and missing media.",
    slug: "laravel-blade-image-fallback",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "laravel image placeholder",
      "laravel blade template",
      "php onerror image",
      "user avatar fallback",
      "laravel",
    ],
    summary: [
      "Laravel Blade templates handle image rendering server-side, which is the right layer to resolve fallback URLs for null or empty database fields before the HTML reaches the browser.",
      "For user avatars, product thumbnails, and CMS media fields, a combination of Blade conditionals for null checks and HTML onerror attributes for CDN failures covers the most common failure modes without requiring any JavaScript.",
    ],
    sections: [
      {
        eyebrow: "Server-side null check",
        title: "Handle null image fields in Blade templates",
        body: [
          "The simplest fallback pattern in Laravel is a null-coalescing operator in the img src attribute. Resolve the fallback URL at render time when the model field is null or empty.",
          "This ensures the correct src reaches the browser on first render — no JavaScript required for the null case.",
        ],
        code: `{{-- resources/views/users/show.blade.php --}}
<img
  src="{{ $user->avatar ?? 'https://fallback.pics/api/v1/avatar/80?text=' . strtoupper(substr($user->name, 0, 2)) }}"
  alt="{{ $user->name }}"
  width="80"
  height="80"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/avatar/80?text=??'"
/>`,
      },
      {
        eyebrow: "Blade component",
        title: "Encapsulate fallback logic in a Blade component",
        body: [
          "Repeating the fallback logic across multiple templates creates maintenance problems. A reusable Blade component centralizes the fallback URL computation and keeps individual templates clean.",
          "Create an anonymous component in resources/views/components/ and pass the model and size as props.",
        ],
        code: `{{-- resources/views/components/user-avatar.blade.php --}}
@props(['user', 'size' => 80])

@php
  $initials = collect(explode(' ', $user->name))
    ->map(fn($word) => strtoupper(substr($word, 0, 1)))
    ->take(2)
    ->implode('');
  $fallback = "https://fallback.pics/api/v1/avatar/{$size}?text={$initials}";
  $src = $user->avatar ?? $fallback;
@endphp

<img
  src="{{ $src }}"
  alt="{{ $user->name }}"
  width="{{ $size }}"
  height="{{ $size }}"
  onerror="this.onerror=null; this.src='{{ $fallback }}'"
/>

{{-- Usage --}}
<x-user-avatar :user="$user" :size="64" />`,
      },
      {
        eyebrow: "Product images",
        title: "Product image fallbacks for catalog views",
        body: [
          "Product catalogs are the other common fallback case. A product record may have no image attached — especially for newly imported SKUs or draft products.",
          "Use the product name in the fallback URL text parameter so the placeholder shows something more informative than a blank square with dimensions.",
        ],
        code: `@php
  $imgSrc = $product->image_url
    ?? 'https://fallback.pics/api/v1/400x400?text=' . urlencode($product->name);
@endphp

<img
  src="{{ $imgSrc }}"
  alt="{{ $product->name }}"
  width="400"
  height="400"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x400?text=No+Image'"
  loading="lazy"
/>`,
      },
      {
        eyebrow: "Eloquent accessor",
        title: "Add an image_url accessor to Eloquent models",
        body: [
          "Centralizing the fallback logic in an Eloquent model accessor keeps Blade templates clean and makes the fallback URL available everywhere the model is used — API responses, queue jobs, and notification templates.",
          "Accessors in Laravel 9+ use the Attribute::make pattern. For older versions, use getImageUrlAttribute().",
        ],
        code: `// app/Models/Product.php
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function imageUrl(): Attribute
{
    return Attribute::make(
        get: function () {
            if ($this->image) return $this->image;
            return 'https://fallback.pics/api/v1/400x400?text=' . urlencode($this->name);
        }
    );
}`,
      },
      {
        eyebrow: "Storage fallback",
        title: "Handle Laravel Storage URLs that return 403 or 404",
        body: [
          "Laravel's Storage::url() can return paths that are not publicly accessible — for example, files on a private S3 disk. The generated URL returns a 403, triggering the browser's onerror event.",
          "Check whether the file exists before generating the URL. For large catalogs, avoid per-request existence checks; instead, use a background job to audit and flag missing files.",
        ],
        code: `$imageUrl = $product->image && Storage::disk('public')->exists($product->image)
    ? Storage::url($product->image)
    : 'https://fallback.pics/api/v1/400x400?text=' . urlencode($product->name);`,
      },
      {
        eyebrow: "Social meta",
        title: "Set og:image fallbacks in Laravel layouts",
        body: [
          "Laravel apps with blog or product pages need og:image tags in the HTML head. Resolve the fallback in the controller and pass it to the view as a variable.",
        ],
        code: `{{-- In a Blade layout --}}
<meta property="og:image" content="{{ $ogImage ?? 'https://fallback.pics/api/v1/1200x630?text=Default' }}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "The PHP-specific onerror pattern without a framework is covered separately. For the full onerror loop prevention pattern, see the base HTML guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/placeholder-images-cms-previews-missing-media/`,
      },
    ],
    takeaways: [
      "Resolve null image fields with null-coalescing in Blade src attributes for zero-JS fallback on first render.",
      "Encapsulate avatar fallback logic in a reusable Blade component to avoid repeating URL construction.",
      "Add an image_url accessor to Eloquent models so the fallback URL is available everywhere the model is used.",
      "Use PHP's urlencode() when embedding product names in fallback.pics text parameters.",
      "Add an onerror attribute for CDN failures that occur after render, guarded with this.onerror=null.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "placeholder-images-cms-previews-missing-media",
      "php-img-onerror-fallback",
    ],
  },

  // ─── POST 11 ───────────────────────────────────────────────────────────────
  {
    title: "Django Template Image Fallback for Media Fields",
    description:
      "Handle empty ImageField and broken media URLs in Django templates using model properties, custom template tags, and fallback.pics placeholder URLs for missing files.",
    slug: "django-template-image-fallback",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "django placeholder image",
      "django ImageField",
      "django template fallback",
      "placeholder image",
      "python web",
    ],
    summary: [
      "Django's ImageField stores a relative path to a file. When the field is blank or the file has been deleted from media storage, the resulting URL either points to an empty string or to a path that returns a 404. Template logic that does not handle this case shows a broken image icon.",
      "The fix combines Python model properties for server-side null resolution with HTML onerror attributes for files that exist in the database but are missing from storage.",
    ],
    sections: [
      {
        eyebrow: "ImageField behavior",
        title: "How Django ImageField handles empty and missing files",
        body: [
          "An ImageField stores the file path relative to MEDIA_ROOT. If the field is blank, accessing field.url raises a ValueError. If the file was deleted from storage but the path remains in the database, the URL is valid but returns a 404.",
          "Always check the field before accessing field.url in templates. The template tag {{ object.photo.url }} raises an exception if photo is blank.",
          "The safest pattern is a model property that returns a fallback URL when the ImageField is empty or the file does not exist.",
        ],
      },
      {
        eyebrow: "Model property",
        title: "Add a get_photo_url model property",
        body: [
          "A model property that returns the ImageField URL or a fallback URL is the cleanest approach. The property centralizes the logic and makes it available in templates, views, serializers, and API responses.",
        ],
        code: `# models.py
import urllib.parse
from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=200)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        initials = ''.join(word[0] for word in self.name.split()[:2]).upper()
        return f'https://fallback.pics/api/v1/avatar/80?text={urllib.parse.quote(initials)}'`,
      },
      {
        eyebrow: "Template usage",
        title: "Use the model property in Django templates",
        body: [
          "With the model property in place, the template simply references the property. No conditional logic is needed in the template itself.",
          "Add an onerror attribute for the case where the file path exists in the database but the file is missing from storage — a common situation after S3 cleanup, manual file deletion, or CMS imports.",
        ],
        code: `{# templates/users/profile.html #}
<img
  src="{{ user_profile.avatar_url }}"
  alt="{{ user_profile.name }}"
  width="80"
  height="80"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/avatar/80?text=??'"
/>`,
      },
      {
        eyebrow: "Template tag",
        title: "Create a custom template tag for generic image fallback",
        body: [
          "For cases where you cannot add a property to the model — third-party models, or simple URL fields rather than ImageFields — a custom template tag generates the fallback URL.",
          "Register it in a templatetags module and use it across templates that display external or optional image URLs.",
        ],
        code: `# templatetags/image_fallback.py
from django import template
import urllib.parse

register = template.Library()

@register.simple_tag
def image_url(src, fallback_text='Image', width=400, height=400):
    if src:
        return src
    text = urllib.parse.quote(fallback_text)
    return f'https://fallback.pics/api/v1/{width}x{height}?text={text}'

{# In template #}
{% load image_fallback %}
<img
  src="{% image_url product.image_url product.name 400 400 %}"
  alt="{{ product.name }}"
  width="400"
  height="400"
/>`,
      },
      {
        eyebrow: "OG image",
        title: "Resolve og:image in Django views",
        body: [
          "For blog posts and product detail pages, compute the og:image URL in the view function and pass it to the template context. This avoids putting fallback logic in the head template.",
        ],
        code: `# views.py
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    og_image = (
        product.image.url if product.image
        else f'https://fallback.pics/api/v1/1200x630.jpg?text={urllib.parse.quote(product.name)}'
    )
    return render(request, 'products/detail.html', {
        'product': product,
        'og_image': og_image,
    })`,
      },
      {
        eyebrow: "Storage check",
        title: "Check file existence for S3 and remote storage",
        body: [
          "If your media files are stored on S3 or another remote backend via django-storages, checking the ImageField's truthiness only tells you whether the path is stored — not whether the file actually exists.",
          "For production apps with user-uploaded content, run a periodic management command to audit image fields and pre-populate a fallback_image_url field. This is cheaper than hitting S3 for an existence check on every page request.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related patterns",
        body: [
          "For Rails and PHP server-side image fallback patterns, similar approaches apply. The fallback.pics docs cover all available API routes.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/rails-image-tag-fallback/`,
      },
    ],
    takeaways: [
      "Never call field.url in a template without checking the field first — it raises ValueError when blank.",
      "A model property that returns the field URL or a generated fallback is the cleanest server-side approach.",
      "A custom template tag handles fallback for models you cannot modify or for simple URL string fields.",
      "Add an onerror attribute for files that exist in the database but are missing from storage after cleanup.",
      "Compute og:image in the view function and pass it to the template context rather than resolving it in a head partial.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "rails-image-tag-fallback",
      "placeholder-images-cms-previews-missing-media",
    ],
  },

  // ─── POST 12 ───────────────────────────────────────────────────────────────
  {
    title: "Ruby on Rails image_tag Fallback for Missing Attachments",
    description:
      "Handle missing ActiveStorage attachments and broken image URLs in Rails using model methods, image_tag helpers, and fallback.pics placeholder URLs for user content.",
    slug: "rails-image-tag-fallback",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "rails image placeholder",
      "active storage fallback",
      "rails image_tag",
      "ruby on rails",
      "placeholder image",
    ],
    summary: [
      "Rails applications using ActiveStorage face a specific challenge: has_one_attached and has_many_attached associations return proxy objects even when no file is attached — you must call .attached? before generating a URL, or you will hit an error.",
      "The right pattern is a model method that checks attachment presence and returns either the ActiveStorage URL or a generated fallback, keeping ERB templates clean and the fallback behavior consistent.",
    ],
    sections: [
      {
        eyebrow: "ActiveStorage behavior",
        title: "How ActiveStorage handles missing attachments",
        body: [
          "ActiveStorage associations return a proxy object regardless of whether a file is attached. Calling url_for on an unattached file raises an ActiveStorage::FileNotFoundError or a similar error depending on the Rails version.",
          "Always call .attached? before generating URLs for ActiveStorage attachments. Do not rely on nil checks — the association object is not nil even when no file is attached.",
          "Files that were attached but later deleted from the storage backend (S3, GCS, or disk) will have valid metadata in the database but return a 404 or 403 from the storage service. The .attached? check returns true in this case.",
        ],
      },
      {
        eyebrow: "Model method",
        title: "Add an image_url model method",
        body: [
          "Encapsulate the fallback logic in the model. The method checks attachment presence and returns the ActiveStorage URL or a generated fallback URL.",
          "Accept size parameters so the method produces fallback URLs that match different slot sizes across the app.",
        ],
        code: `# app/models/product.rb
class Product < ApplicationRecord
  has_one_attached :image

  def image_url(width: 400, height: 400)
    if image.attached?
      Rails.application.routes.url_helpers.url_for(image)
    else
      "https://fallback.pics/api/v1/#{width}x#{height}?text=#{CGI.escape(name)}"
    end
  end
end`,
      },
      {
        eyebrow: "ERB template",
        title: "Use image_tag with the model method",
        body: [
          "Rails' image_tag helper accepts any URL string. Pass the model method result and add an onerror attribute for runtime CDN failures.",
          "The onerror attribute in image_tag is passed as part of the html_options hash.",
        ],
        code: `<%# app/views/products/_card.html.erb %>
<%= image_tag(
  product.image_url(width: 400, height: 400),
  alt: product.name,
  width: 400,
  height: 400,
  loading: "lazy",
  onerror: "this.onerror=null; this.src='https://fallback.pics/api/v1/400x400?text=No+Image'"
) %>`,
      },
      {
        eyebrow: "User avatars",
        title: "User avatar fallback in Rails with initials",
        body: [
          "User avatar slots are a common ActiveStorage use case. Use initials from the user's name in the fallback URL to create a more informative placeholder than a blank square.",
        ],
        code: `# app/models/user.rb
def avatar_url(size: 64)
  if avatar.attached?
    Rails.application.routes.url_helpers.url_for(
      avatar.variant(resize_to_fill: [size, size])
    )
  else
    initials = name.split.map { |w| w[0] }.join.upcase.first(2)
    "https://fallback.pics/api/v1/avatar/#{size}?text=#{CGI.escape(initials)}"
  end
end`,
      },
      {
        eyebrow: "OG image",
        title: "Resolve og:image in Rails controllers",
        body: [
          "Set an og_image instance variable in the controller before rendering. Use the model method with OG-appropriate dimensions.",
        ],
        code: `# app/controllers/products_controller.rb
def show
  @product = Product.find_by!(slug: params[:slug])
  @og_image = @product.image_url(width: 1200, height: 630)
end

<%# In layout %>
<%= tag.meta property: 'og:image', content: @og_image %>
<%= tag.meta property: 'og:image:width', content: '1200' %>
<%= tag.meta property: 'og:image:height', content: '630' %>`,
      },
      {
        eyebrow: "Variant fallback",
        title: "Handle ActiveStorage variant processing failures",
        body: [
          "ActiveStorage variants are processed on first access. If processing fails — for example, because the original file is corrupt — the variant URL returns a 500 error.",
          "Wrap variant generation in a begin/rescue block and return the fallback URL if it raises. Log the failure so you can investigate corrupt source files separately.",
        ],
        code: `def thumbnail_url(width: 200, height: 200)
  return "https://fallback.pics/api/v1/#{width}x#{height}?text=No+Image" unless image.attached?

  begin
    Rails.application.routes.url_helpers.url_for(
      image.variant(resize_to_fill: [width, height]).processed
    )
  rescue => e
    Rails.logger.warn("Image variant failed for Product##{id}: #{e.message}")
    "https://fallback.pics/api/v1/#{width}x#{height}?text=Image+Error"
  end
end`,
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "For Django and PHP image fallback patterns, the same server-side resolution approach applies with framework-specific syntax. The full onerror guide covers browser-side handling in any context.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/django-template-image-fallback/`,
      },
    ],
    takeaways: [
      "Always call .attached? before generating ActiveStorage URLs — the association is not nil even without a file.",
      "Encapsulate fallback URL logic in a model method so templates, serializers, and API responses all behave consistently.",
      "Add an onerror attribute in image_tag html_options for files that pass .attached? but return a CDN error.",
      "Wrap .variant(...).processed in begin/rescue to handle corrupt source files gracefully.",
      "Use CGI.escape() when embedding model attributes in fallback.pics text parameters.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "django-template-image-fallback",
      "placeholder-images-cms-previews-missing-media",
    ],
  },

  // ─── POST 13 ───────────────────────────────────────────────────────────────
  {
    title: "PHP img onerror Fallback Pattern (No Framework)",
    description:
      "Add reliable image fallbacks in plain PHP using server-side null checks, HTML onerror attributes, and fallback.pics placeholder URLs without any framework dependency.",
    slug: "php-img-onerror-fallback",
    readTime: "6 min read",
    category: "Implementation Guides",
    tags: [
      "php image fallback",
      "php onerror img",
      "php placeholder image",
      "html img fallback",
      "vanilla php",
    ],
    summary: [
      "Plain PHP applications and themes can add reliable image fallbacks without any framework. Server-side null checks in PHP echo statements resolve empty database fields before the HTML is sent, and HTML onerror attributes catch CDN or file-system failures after the page loads.",
      "The combination covers the two main failure modes: a null or empty image field in the database, and an image URL that exists but returns a 404 because the file was moved or deleted.",
    ],
    sections: [
      {
        eyebrow: "Server-side null check",
        title: "Resolve null image fields before HTML output",
        body: [
          "The simplest PHP image fallback pattern uses the null coalescing operator or a ternary to substitute a fallback URL when the database field is empty.",
          "Handle this before the HTML tag, not inside the src attribute. Inline PHP in attributes gets messy and hard to audit as fallback logic grows.",
          "Always escape output with htmlspecialchars() to prevent XSS if any user-controlled data ends up in the URL.",
        ],
        code: `<?php
// Resolve at top of template or in a helper
$image_src = !empty($product['image'])
  ? $product['image']
  : 'https://fallback.pics/api/v1/400x400?text=' . urlencode($product['name']);
?>

<img
  src="<?= htmlspecialchars($image_src) ?>"
  alt="<?= htmlspecialchars($product['name']) ?>"
  width="400"
  height="400"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x400?text=No+Image'"
  loading="lazy"
/>`,
      },
      {
        eyebrow: "Helper function",
        title: "Create a reusable image_url() helper",
        body: [
          "Repeating the fallback URL construction across multiple templates creates maintenance problems. Extract it into a helper function that accepts the image field value, the fallback text, and the dimensions.",
          "The function handles empty string, null, and false values from a database query — all common return types depending on PHP version and the database driver.",
        ],
        code: `<?php
function image_url($src, string $text = 'Image', int $w = 400, int $h = 400): string
{
    if (!empty($src)) return htmlspecialchars($src);
    return 'https://fallback.pics/api/v1/' . $w . 'x' . $h . '?text=' . urlencode($text);
}

// Usage
<img
  src="<?= image_url($row['photo'], $row['name'], 400, 400) ?>"
  alt="<?= htmlspecialchars($row['name']) ?>"
  width="400"
  height="400"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x400?text=No+Image'"
/>`,
      },
      {
        eyebrow: "Avatar pattern",
        title: "User avatar fallback with initials",
        body: [
          "User profile pages frequently show an avatar that may not be set. Use the fallback.pics avatar route with initials derived from the user's name.",
          "Generate initials server-side in PHP so the fallback URL is embedded in the HTML before any JavaScript runs.",
        ],
        code: `<?php
function avatar_url(?string $avatar, string $name, int $size = 64): string
{
    if (!empty($avatar)) return htmlspecialchars($avatar);

    $words = explode(' ', trim($name));
    $initials = '';
    foreach ($words as $word) {
        $initials .= strtoupper(mb_substr($word, 0, 1));
        if (strlen($initials) >= 2) break;
    }
    return 'https://fallback.pics/api/v1/avatar/' . $size . '?text=' . urlencode($initials);
}

// In template
<img
  src="<?= avatar_url($user['avatar'], $user['name'], 64) ?>"
  alt="<?= htmlspecialchars($user['name']) ?>"
  width="64"
  height="64"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/avatar/64?text=??'"
/>`,
      },
      {
        eyebrow: "File existence check",
        title: "Check local file existence before generating URLs",
        body: [
          "When images are stored on the local file system in an uploads/ directory, a database path can point to a file that no longer exists. Check existence with file_exists() when performance allows.",
          "For frequently accessed pages, avoid calling file_exists() on every request for every image. Use a cached boolean in the database or a background task to validate stored paths periodically.",
        ],
        code: `<?php
function local_image_url(string $path, string $fallback_text): string
{
    $full_path = $_SERVER['DOCUMENT_ROOT'] . $path;
    if (!empty($path) && file_exists($full_path)) {
        return htmlspecialchars($path);
    }
    return 'https://fallback.pics/api/v1/400x400?text=' . urlencode($fallback_text);
}`,
      },
      {
        eyebrow: "OG image",
        title: "Resolve og:image in PHP head output",
        body: [
          "Set og:image in the page head using the same helper function. Compute it before the HTML output starts so the meta tag uses the resolved URL.",
          "Append a raster file extension when the URL points to fallback.pics, since social crawlers do not support SVG.",
        ],
        code: `<?php
$og_image = image_url($post['featured_image'], $post['title'], 1200, 630);
// Ensure raster format for social crawlers
if (strpos($og_image, 'fallback.pics') !== false) {
    $og_image = str_replace('/api/v1/1200x630', '/api/v1/1200x630.jpg', $og_image);
}
?>
<meta property="og:image" content="<?= htmlspecialchars($og_image) ?>" />`,
      },
      {
        eyebrow: "Security note",
        title: "Always escape output and avoid user input in onerror",
        body: [
          "Any value from a database field echoed into an HTML attribute must be escaped with htmlspecialchars(). This applies to both the real image URL and any fallback URL that contains user-controlled text.",
          "For the onerror attribute specifically, the value is a JavaScript string. Never put user-controlled data inside the onerror handler. The fallback URL in onerror should be a hard-coded string.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "For framework-based PHP image fallbacks, the Laravel Blade guide covers similar patterns with Eloquent accessors. For the browser-side onerror behavior in any context, see the base HTML guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/laravel-blade-image-fallback/`,
      },
    ],
    takeaways: [
      "Resolve empty database fields server-side before echoing the src attribute — prevents the broken-image flash on first render.",
      "Wrap fallback URL logic in a helper function to avoid repeating it across templates.",
      "Pass user-controlled strings through urlencode() in URLs and htmlspecialchars() before outputting to HTML.",
      "The onerror fallback URL should be a hard-coded string — never constructed from user input.",
      "Use the avatar route with server-generated initials for a more informative fallback than a blank placeholder.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "laravel-blade-image-fallback",
      "express-ejs-image-fallback",
    ],
  },

  // ─── POST 14 ───────────────────────────────────────────────────────────────
  {
    title: "Express and EJS Image Fallbacks for Server-Rendered Apps",
    description:
      "Handle missing and broken images in Express.js EJS templates using route handlers, res.locals helpers, and fallback.pics placeholder URLs for empty media fields.",
    slug: "express-ejs-image-fallback",
    readTime: "7 min read",
    category: "Implementation Guides",
    tags: [
      "express ejs image placeholder",
      "express image fallback",
      "ejs template",
      "nodejs image fallback",
      "express.js",
    ],
    summary: [
      "Express apps using EJS for server-rendered HTML can resolve image fallbacks at two layers: in route handlers before passing data to templates, and in EJS template helpers registered on res.locals that handle null or empty image fields.",
      "Server-side resolution ensures that social crawlers, email clients, and first-paint users see correct images. Client-side onerror is a secondary safety net for CDN failures after the page loads.",
    ],
    sections: [
      {
        eyebrow: "Route handler",
        title: "Resolve fallback URLs in Express route handlers",
        body: [
          "The route handler that queries the database is the right place to resolve null image fields. Add a fallback URL to the data object before passing it to res.render().",
          "This keeps EJS templates free of conditional logic and ensures every downstream consumer of the data — email notifications, JSON API responses, scheduled jobs — gets the same resolved URL.",
        ],
        code: `// routes/products.js
router.get('/products/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).render('404');

  const imageUrl = product.imageUrl
    ?? \`https://fallback.pics/api/v1/800x800?text=\${encodeURIComponent(product.name)}\`;

  res.render('products/show', { product, imageUrl });
});`,
      },
      {
        eyebrow: "EJS template",
        title: "Render fallback URLs in EJS templates",
        body: [
          "With the fallback URL resolved in the route handler, EJS templates simply reference the variable. Add an onerror attribute for files that pass the null check but return a CDN error.",
          "EJS escapes HTML in <%= %> tags by default. That behavior protects against XSS in URL values without additional effort.",
        ],
        code: `<%-- views/products/show.ejs --%>
<img
  src="<%= imageUrl %>"
  alt="<%= product.name %>"
  width="800"
  height="800"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/800x800?text=Not+Found'"
  loading="lazy"
/>`,
      },
      {
        eyebrow: "Middleware helper",
        title: "Register an imageUrl helper on res.locals",
        body: [
          "For fallback logic used across many routes, register a helper function on res.locals in middleware. EJS templates can call it directly, avoiding repetition in individual route handlers.",
        ],
        code: `// middleware/templateHelpers.js
app.use((req, res, next) => {
  res.locals.imageUrl = function(src, text, w = 400, h = 400) {
    if (src) return src;
    return \`https://fallback.pics/api/v1/\${w}x\${h}?text=\${encodeURIComponent(text)}\`;
  };
  next();
});

// In EJS template
<img
  src="<%= imageUrl(product.imageUrl, product.name, 800, 800) %>"
  alt="<%= product.name %>"
  width="800"
  height="800"
/>`,
      },
      {
        eyebrow: "User avatars",
        title: "Avatar fallbacks with initials in Express",
        body: [
          "Register an avatarUrl helper in middleware that generates an initials-based avatar URL when the user has no profile photo.",
          "This keeps avatar fallback logic in one place even when avatars appear in multiple templates — navigation headers, comment threads, and profile pages.",
        ],
        code: `// In middleware
res.locals.avatarUrl = function(user) {
  if (user.avatar) return user.avatar;
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return \`https://fallback.pics/api/v1/avatar/64?text=\${encodeURIComponent(initials)}\`;
};

// In EJS template
<img
  src="<%= avatarUrl(user) %>"
  alt="<%= user.name %>"
  width="64"
  height="64"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/avatar/64?text=??'"
/>`,
      },
      {
        eyebrow: "OG image",
        title: "Pass og:image to EJS layouts",
        body: [
          "For blog and product pages that need social sharing previews, pass an ogImage variable to the template and render it in the <head> partial.",
          "Compute the fallback URL in the route handler with OG-appropriate dimensions. Append .jpg for social platform compatibility.",
        ],
        code: `// Route handler
const ogImage = post.featuredImage
  ?? \`https://fallback.pics/api/v1/1200x630.jpg?text=\${encodeURIComponent(post.title)}\`;
res.render('blog/post', { post, ogImage });

<%-- views/partials/head.ejs --%>
<meta property="og:image" content="<%= ogImage %>" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Security",
        title: "Escape user-controlled content in EJS templates",
        body: [
          "EJS escapes HTML in <%= %> tags by default. Use <%- %> only for pre-rendered HTML you control entirely. For URLs containing user-supplied text, use encodeURIComponent before embedding in the fallback URL.",
          "Never put raw user input into an onerror JavaScript string. The fallback URL in the onerror attribute should be a hard-coded string without user-controlled segments.",
        ],
      },
      {
        eyebrow: "Further reading",
        title: "Related guides",
        body: [
          "For PHP without a framework, the same pattern applies with slightly different syntax. For Django and Rails, the server-side approach is similar but with ORM-specific tooling.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/php-img-onerror-fallback/`,
      },
    ],
    takeaways: [
      "Resolve null image fields in Express route handlers before passing data to res.render() so templates stay clean.",
      "Register an imageUrl helper on res.locals in middleware for fallback URL logic used across many routes.",
      "EJS escapes HTML in <%= %> by default; use encodeURIComponent for user-controlled text in fallback URL parameters.",
      "Set og:image in the route handler and pass it to the EJS layout for social sharing previews.",
      "Keep the onerror attribute value as a hard-coded fallback URL — never construct it from user-controlled input.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "php-img-onerror-fallback",
      "laravel-blade-image-fallback",
    ],
  },
];
