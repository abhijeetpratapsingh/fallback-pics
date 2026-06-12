import type { BlogPost } from '../blogPosts';

export const backlogBatch03: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─────────────────────────────────────────────────────────
  // 1. contentful-image-field-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Contentful Image Field Fallback in Headless CMS Setups",
    description:
      "Handle missing Contentful image fields in React, Next.js, and Astro frontends by inserting a generated fallback URL for any unset asset reference.",
    slug: "contentful-image-field-fallback",
    readTime: "8 min read",
    category: "CMS Workflows",
    tags: [
      "Contentful image fallback",
      "Headless CMS",
      "Missing media",
      "Placeholder image API",
      "Next.js CMS",
    ],
    summary: [
      "Contentful image fields return null when an entry is saved without an attached asset. A null field in a headless frontend means the img src resolves to undefined or an empty string, which produces a broken image icon and can trigger a 404 cascade if your error handler feeds back into itself.",
      "The cleanest fix is a small helper that produces a dimension-matched fallback URL before the value ever reaches a component. fallback.pics generates SVG placeholders from URL parameters, so you get stable layout and a visible fallback without storing any extra assets in your Contentful space.",
    ],
    sections: [
      {
        eyebrow: "Why it happens",
        title: "Contentful image fields that return null",
        body: [
          "Every Contentful content type can have an image field marked optional. Authors frequently save draft entries with all text written but no media uploaded yet. The Contentful Delivery API returns those fields as null, not as a missing key, so code that does not check for null will receive a value — it just cannot be used as an image src.",
          "Localization makes this worse. An entry may have an image in the default locale but null for every other locale, so a content type that looked safe in development breaks on translated pages in production. Migrate carefully when adding required validation to an existing field; existing entries will fail validation until each one is updated.",
          "The third common source is programmatic content import. When a migration script creates entries before the corresponding assets are uploaded, there is a window where the image field is null and end users may hit the page before the import completes.",
        ],
      },
      {
        eyebrow: "Safe access",
        title: "Reading Contentful asset fields without crashing",
        body: [
          "The Contentful SDK returns typed responses when you use their TypeScript client. An image field typed as `Asset | undefined` requires explicit null checking before you read `fields.file?.url`. Accessing nested properties on an undefined Asset throws at runtime.",
          "The safest pattern is a dedicated helper that accepts the full Contentful entry, extracts the image URL if it exists, and returns a fallback URL otherwise. Centralizing this logic means you change the fallback in one place across all templates.",
        ],
        code: `// lib/contentful-image.ts
import type { Asset } from 'contentful';

export function getImageSrc(
  asset: Asset | undefined | null,
  width: number,
  height: number,
  label = '',
): string {
  if (asset?.fields?.file?.url) {
    const url = asset.fields.file.url as string;
    return url.startsWith('//') ? \`https:\${url}\` : url;
  }
  const text = label
    ? encodeURIComponent(label)
    : encodeURIComponent(\`\${width}×\${height}\`);
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${text}\`;
}`,
      },
      {
        eyebrow: "Fallback URL",
        title: "Generate dimension-matched placeholders from the API",
        body: [
          "Pass the same dimensions you use for the final image slot. If your blog hero is 1200×630, your fallback should also be 1200×630 so the page does not reflow when the real image loads. This keeps Cumulative Layout Shift at zero even during the loading window.",
          "Use the text parameter to show something more informative than a plain color block. A short label like the post category or 'Image coming soon' gives authors visual feedback in the CMS preview that the field still needs filling.",
        ],
        code: `// Blog featured image
https://fallback.pics/api/v1/1200x630?text=Blog+Post

// Product card thumbnail
https://fallback.pics/api/v1/400x300?text=Product+Image

// Author avatar
https://fallback.pics/api/v1/avatar/80?text=AB

// Wide banner
https://fallback.pics/api/v1/banner/1200x400?text=Hero+Banner`,
      },
      {
        eyebrow: "Draft previews",
        title: "Preview mode exposes more null fields than production",
        body: [
          "Contentful preview mode uses the Preview API, which returns unpublished entries. An author may publish text-only updates, leaving the image field empty in the draft state. If your Next.js preview route does not apply the same fallback logic as the production route, you get broken images only during editorial review — which delays publishing and trains authors to ignore broken previews.",
          "Apply the same `getImageSrc` helper in both the production and preview data-fetching paths. The generated fallback URL is cacheable and deterministic, so it appears instantly without hitting Contentful's image transform API.",
        ],
      },
      {
        eyebrow: "Avatars",
        title: "Author and profile image fallbacks",
        body: [
          "Author profiles often have an optional headshot field. When that field is null, the avatar slot collapses or shows a broken icon. The avatar route accepts a text parameter for initials, which makes the fallback feel intentional rather than broken.",
          "Generate initials from the author name field, which is always present. A two-letter uppercase initial works reliably across all avatar sizes.",
        ],
        code: `function authorAvatarSrc(author: ContentfulAuthor): string {
  if (author.fields.headshot?.fields.file?.url) {
    const url = author.fields.headshot.fields.file.url as string;
    return url.startsWith('//') ? \`https:\${url}\` : url;
  }
  const name = author.fields.name as string;
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return \`https://fallback.pics/api/v1/avatar/80?text=\${initials}\`;
}`,
      },
      {
        eyebrow: "Next.js",
        title: "Use with Next.js Image and the Contentful domain",
        body: [
          "Next.js `<Image>` requires every external image domain in `next.config.js`. Add both `images.ctfassets.net` for Contentful and `fallback.pics` to `remotePatterns`. Without both entries, Next.js will throw a runtime error when the fallback URL is used as the src.",
          "Set `width` and `height` props on the Next.js Image component equal to the fallback.pics dimensions. This eliminates CLS regardless of whether the displayed src is the Contentful asset or the fallback.",
        ],
        code: `// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'fallback.pics' },
    ],
  },
};

// components/ContentfulImage.tsx
import Image from 'next/image';
import { getImageSrc } from '../lib/contentful-image';

export function ContentfulImage({ asset, width, height, alt, label }) {
  return (
    <Image
      src={getImageSrc(asset, width, height, label)}
      width={width}
      height={height}
      alt={alt}
    />
  );
}`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "Check the fallback.pics docs for the full list of URL parameters including custom colors, formats, and skeleton states. If you are setting up fallbacks across multiple CMS platforms, the general CMS placeholder pattern guide covers the common patterns in one place.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/placeholder-images-cms-previews-missing-media/
https://fallback.pics/blog/sanity-cms-image-fallback/`,
      },
    ],
    takeaways: [
      "Contentful image fields return null for unpublished, localized, or import-incomplete entries — always guard before using as src.",
      "Centralize fallback logic in a helper that accepts an Asset and returns a fallback.pics URL for null fields.",
      "Match the placeholder dimensions to the final slot dimensions to prevent layout shift.",
      "Use the avatar route with initials for author headshot fallbacks.",
      "Add fallback.pics to Next.js remotePatterns alongside ctfassets.net to avoid runtime errors.",
    ],
    related: [
      "placeholder-images-cms-previews-missing-media",
      "sanity-cms-image-fallback",
      "generate-blog-thumbnails-from-text",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. sanity-cms-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Sanity CMS Image Fallback for Draft Previews and Missing Media",
    description:
      "Handle null Sanity image references in GROQ queries and React frontends by generating dimension-matched placeholder URLs for missing or unpublished media.",
    slug: "sanity-cms-image-fallback",
    readTime: "8 min read",
    category: "CMS Workflows",
    tags: [
      "Sanity image placeholder",
      "Sanity CMS",
      "Headless CMS",
      "GROQ query",
      "Missing media fallback",
    ],
    summary: [
      "Sanity image fields hold a reference object, not a direct URL. When the field is empty, the reference is null. Passing a null reference to `@sanity/image-url` throws or silently returns an unusable object, and the component renders a broken image.",
      "The fix is a short null check before calling the URL builder. When the reference is absent, substitute a generated fallback URL sized to match the destination slot. fallback.pics serves these from a public CDN with no authentication, so any frontend can use them without configuration.",
    ],
    sections: [
      {
        eyebrow: "How Sanity stores images",
        title: "Sanity image references vs Contentful asset objects",
        body: [
          "Sanity stores images as separate documents in the dataset. An image field on a content document holds a `_ref` string pointing to the asset document, plus optional crop and hotspot data. When you query with GROQ, you get this reference object back — not the URL directly. You pass the reference to `@sanity/image-url` (the `urlFor()` builder) to construct a CDN URL.",
          "The difference from Contentful matters: a null Contentful field gives you null. A null Sanity image field also gives you null, but code that checks `if (post.image)` will pass truthy for an empty object `{}` if the type is wrong. Use optional chaining: `post.image?._ref` is the actual indicator that an image document reference exists.",
          "Portable Text documents can also embed inline images. Those follow the same pattern but appear inside an array of blocks, making systematic null checking even more important.",
        ],
      },
      {
        eyebrow: "GROQ",
        title: "Project image fields in your GROQ queries",
        body: [
          "Projecting the full image object in GROQ lets you check for null in one place at the query level, rather than scattering null checks through components. Use the `defined()` function in filters if you want to skip entries with missing images, or accept null and handle it on the frontend.",
          "For performance, project only the fields you need from the asset document rather than dereferencing the full asset with `->`. The `_id`, `url`, and dimensions metadata are usually sufficient for building a fallback-aware image component.",
        ],
        code: `// Fetch posts — include image dimensions for fallback matching
const query = groq\`
  *[_type == "post"] {
    _id,
    title,
    slug,
    "image": mainImage {
      asset-> {
        _id,
        url,
        metadata { dimensions }
      },
      crop,
      hotspot
    }
  }
\`;`,
      },
      {
        eyebrow: "Fallback helper",
        title: "Build a null-safe image URL helper",
        body: [
          "Wrap the `urlFor()` call in a helper that first checks whether the image reference exists. If it does not, return a fallback.pics URL with the slot dimensions as parameters. This keeps every component clean and consistent.",
          "Use the projected metadata dimensions if available to match the aspect ratio of the original asset. When the image exists but you need a fallback during an error event, the stored width and height are the best source for dimension-correct placeholders.",
        ],
        code: `// lib/sanity-image.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity-client';

const builder = imageUrlBuilder(client);

export function sanityImageUrl(
  image: SanityImageRef | null | undefined,
  width: number,
  height: number,
): string {
  if (image?.asset?._ref || image?.asset?.url) {
    return builder.image(image).width(width).height(height).url();
  }
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=Image+Missing\`;
}`,
      },
      {
        eyebrow: "Draft previews",
        title: "Draft mode surfaces null images earlier",
        body: [
          "Sanity Studio previews use the Sanity API with `perspective: 'previewDrafts'`. Authors often write and preview posts before uploading the hero image. Without a fallback, the preview page shows a broken layout that creates distrust in the preview tool and leads editors to skip previews entirely.",
          "Apply the same `sanityImageUrl` helper in preview data-fetching. Since preview routes typically run on-demand in Next.js, the fallback.pics URL is fast and does not require Sanity to have a real asset ready. Authors see a properly sized placeholder with a label instead of a broken icon.",
        ],
      },
      {
        eyebrow: "Portable Text",
        title: "Handle inline image blocks in Portable Text",
        body: [
          "Portable Text content can contain image blocks inline with paragraphs. When rendering with `@portabletext/react`, you provide a custom renderer for the `image` type. That renderer must handle null asset references.",
          "Inline images in Portable Text rarely have predictable target dimensions. Use a sensible default like 800×500 for article body images, or read the image metadata dimensions if available.",
        ],
        code: `import { PortableText } from '@portabletext/react';
import { sanityImageUrl } from '../lib/sanity-image';

const components = {
  types: {
    image: ({ value }) => {
      const src = sanityImageUrl(value, 800, 500);
      return (
        <img
          src={src}
          alt={value.alt ?? ''}
          width={800}
          height={500}
          loading="lazy"
        />
      );
    },
  },
};

export function ArticleBody({ content }) {
  return <PortableText value={content} components={components} />;
}`,
      },
      {
        eyebrow: "Studio",
        title: "Use fallback previews inside Sanity Studio",
        body: [
          "Sanity Studio document previews use a `preview` config on the schema type. The `media` field in the preview config points to an image field. When that field is empty, the Studio shows a generic icon. You can override the preview resolver to return a generated fallback URL so Studio editors see a properly sized card even for image-less entries.",
          "This is a quality-of-life improvement for editorial teams: the document list looks consistent, and editors can clearly see which entries still need images uploaded rather than distinguishing between intentionally image-free content and entries with missing assets.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The fallback.pics API supports text labels, custom colors, skeleton animations, and avatar routes. The CMS placeholder patterns guide covers Sanity alongside other headless CMS setups.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/contentful-image-field-fallback/
https://fallback.pics/blog/placeholder-images-cms-previews-missing-media/`,
      },
    ],
    takeaways: [
      "Check image?._asset?._ref, not just image, to determine if a Sanity image reference is set.",
      "Wrap urlFor() in a helper that returns a fallback.pics URL when the reference is absent.",
      "Match the fallback dimensions to the destination slot to prevent layout shift.",
      "Apply the same helper in draft preview routes so editors see a consistent preview layout.",
      "Handle the image block type in Portable Text renderers with the same null-safe helper.",
    ],
    related: [
      "contentful-image-field-fallback",
      "strapi-media-fallback",
      "placeholder-images-cms-previews-missing-media",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. strapi-media-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Strapi Media Library Fallback for Empty Image Fields",
    description:
      "Fix null Strapi media fields on REST and GraphQL responses by generating dimension-matched placeholder URLs before they reach your frontend components.",
    slug: "strapi-media-fallback",
    readTime: "7 min read",
    category: "CMS Workflows",
    tags: [
      "Strapi placeholder image",
      "Strapi media library",
      "Headless CMS",
      "Missing media",
      "Placeholder image API",
    ],
    summary: [
      "Strapi media fields are optional by default. When an entry is created without a file attached, the field value is null in both the REST API response and the GraphQL response. Frontends that omit a null check render a broken image or throw a runtime error trying to access properties on null.",
      "Adding a fallback URL at the data layer — before the value reaches a component — keeps layouts stable and eliminates the broken-image icon. fallback.pics generates dimension-correct SVG placeholders from the URL, so you do not need to store or serve any extra assets in your Strapi media library.",
    ],
    sections: [
      {
        eyebrow: "Strapi API responses",
        title: "How Strapi returns null media fields",
        body: [
          "Strapi v4 wraps collection entries in a `data` envelope. A media field returns `null` as its full value when nothing has been uploaded: `{ data: { id: 1, attributes: { image: { data: null } } } }`. Code that navigates straight to `attributes.image.data.attributes.url` throws a TypeError on null.",
          "GraphQL responses follow the same pattern. The generated schema makes media fields nullable, so queries succeed but the image object is null. Apollo Client and similar tools do not throw on null fields — the component receives null and must handle it.",
          "Bulk imports are a frequent cause of null media. When content is migrated from another CMS or seeded from a spreadsheet, text fields populate first while images are uploaded separately. There is always a window when entries are public but image fields are not yet set.",
        ],
      },
      {
        eyebrow: "REST helper",
        title: "Extract the media URL safely from a Strapi response",
        body: [
          "Write a utility that accepts the full Strapi media object and returns either the real URL or a fallback. Make the fallback dimensions a required argument so each call site is explicit about the slot size.",
          "Strapi serves files from its own domain when using the local upload provider. If you use a cloud provider like Cloudinary or AWS S3 through a Strapi plugin, the URL comes from the external CDN instead. The helper needs to handle both — or simply forward whatever URL Strapi provides.",
        ],
        code: `// lib/strapi-image.ts
interface StrapiMedia {
  data: {
    attributes: {
      url: string;
      width?: number;
      height?: number;
      formats?: Record<string, { url: string }>;
    };
  } | null;
}

export function strapiImageUrl(
  media: StrapiMedia | null | undefined,
  width: number,
  height: number,
  label = '',
): string {
  const url = media?.data?.attributes?.url;
  if (url) {
    return url.startsWith('/') ? \`\${process.env.NEXT_PUBLIC_STRAPI_URL}\${url}\` : url;
  }
  const text = label ? encodeURIComponent(label) : \`\${width}x\${height}\`;
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${text}\`;
}`,
      },
      {
        eyebrow: "Responsive formats",
        title: "Use Strapi format variants or fall back gracefully",
        body: [
          "Strapi generates multiple format variants (thumbnail, small, medium, large) for images above certain thresholds. These are stored under `attributes.formats`. If you target a specific format for a card thumbnail and the uploaded image was too small for Strapi to create that variant, `formats.medium` will be undefined even though the original image exists.",
          "Your helper should check the target format first, fall back to the original URL if the format is missing, and then fall back to the generated placeholder URL if the original is also absent. Three-level fallback chains are common in production Strapi deployments.",
        ],
        code: `export function strapiThumbnailUrl(
  media: StrapiMedia | null | undefined,
  width: number,
  height: number,
): string {
  const attrs = media?.data?.attributes;
  const src =
    attrs?.formats?.medium?.url ??
    attrs?.formats?.small?.url ??
    attrs?.url;
  if (src) {
    return src.startsWith('/')
      ? \`\${process.env.NEXT_PUBLIC_STRAPI_URL}\${src}\`
      : src;
  }
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=No+Image\`;
}`,
      },
      {
        eyebrow: "GraphQL",
        title: "GraphQL query patterns with nullable image fields",
        body: [
          "When querying Strapi with GraphQL, request the url, width, and height from the media attributes. Having width and height in the response lets you pass matching dimensions to the fallback URL rather than hardcoding them for each query.",
          "Use fragments to avoid repeating image field selection across multiple queries. One `MediaFields` fragment covers every content type that includes a media relation.",
        ],
        code: `fragment MediaFields on UploadFileEntityResponse {
  data {
    attributes {
      url
      width
      height
      alternativeText
    }
  }
}

query GetArticle($slug: String!) {
  articles(filters: { slug: { eq: $slug } }) {
    data {
      attributes {
        title
        cover { ...MediaFields }
        author {
          data {
            attributes {
              avatar { ...MediaFields }
            }
          }
        }
      }
    }
  }
}`,
      },
      {
        eyebrow: "Bulk imports",
        title: "Protect pages during content migration",
        body: [
          "When importing content from a spreadsheet or legacy CMS, images typically arrive after the initial text import. If you publish entries before the media upload script completes, live pages will have null image fields for a period of time.",
          "The fallback URL provides a graceful degradation during this window. Users see a labeled placeholder rather than a broken icon, and search crawlers do not encounter broken image references that might affect indexing.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "See the full API parameter list on the fallback.pics docs. The general CMS placeholder guide covers patterns shared across Strapi, Contentful, and Sanity.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/contentful-image-field-fallback/
https://fallback.pics/blog/sanity-cms-image-fallback/`,
      },
    ],
    takeaways: [
      "Strapi media fields return null when no file is attached — the v4 data envelope requires navigating data.attributes.url safely.",
      "Write a strapiImageUrl helper that checks the format variant, original URL, then falls back to a generated placeholder URL.",
      "Pass matching width and height to fallback.pics to prevent layout shift.",
      "Request width and height in GraphQL queries so dimension-matched fallbacks require no hardcoding.",
      "Fallback URLs protect live pages during bulk content imports when images arrive after text entries.",
    ],
    related: [
      "contentful-image-field-fallback",
      "sanity-cms-image-fallback",
      "drupal-media-placeholder",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. hubspot-cms-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "HubSpot CMS Default Featured Image Fallback Pattern",
    description:
      "Set a reliable HubSpot CMS featured image fallback for blog posts and landing pages using HubL conditionals and a generated fallback URL.",
    slug: "hubspot-cms-image-fallback",
    readTime: "7 min read",
    category: "CMS Workflows",
    tags: [
      "HubSpot featured image fallback",
      "HubSpot CMS",
      "HubL template",
      "CMS Workflows",
      "Blog placeholder",
    ],
    summary: [
      "HubSpot blog posts have a Featured Image field that is entirely optional. When posts are published without one, templates that reference `content.featured_image` receive an empty string. Using that empty string as an img src renders the broken-image browser icon and produces an empty `<img>` tag in the page source that search crawlers index.",
      "HubL provides a straightforward conditional operator to substitute a fallback URL when the featured image is absent. Pair that with a generated fallback.pics URL and every post has a valid, cacheable image — whether or not the author uploaded one.",
    ],
    sections: [
      {
        eyebrow: "HubSpot image fields",
        title: "How featured_image behaves when empty",
        body: [
          "In the HubSpot blog template system, `content.featured_image` is a string holding the CDN URL of the uploaded image. When no image is uploaded, it resolves to an empty string, not null. HubL treats empty strings as falsy, so the standard `{% if content.featured_image %}` conditional works correctly.",
          "The field is also used to populate Open Graph and Twitter Card meta tags. When it is empty and you have no fallback, the social share preview shows no image. Search results that rely on structured data image properties also lose the signal.",
          "HubSpot Landing Pages have similar image fields on modules. Module image fields follow the same empty-string pattern and require the same HubL conditional treatment.",
        ],
      },
      {
        eyebrow: "HubL template",
        title: "Insert a fallback URL with a HubL conditional",
        body: [
          "Use HubL's `|default` filter or a straightforward `{% if %}` block to check for the empty string and substitute a fallback. The filter approach is more concise for inline use inside an `src` attribute.",
          "Set `width` and `height` attributes on the `<img>` tag using the same dimensions as the fallback URL. This is critical for preventing layout shift when the image loads.",
        ],
        code: `{# Blog post featured image with fallback #}
{% set fallback_image = "https://fallback.pics/api/v1/1200x630?text=" ~ content.name | urlencode %}

<img
  src="{{ content.featured_image | default(fallback_image) }}"
  alt="{{ content.featured_image_alt_text | default(content.name) }}"
  width="1200"
  height="630"
  loading="lazy"
/>

{# Short form using the default filter inline #}
<meta property="og:image"
  content="{{ content.featured_image | default(fallback_image) }}" />`,
      },
      {
        eyebrow: "Blog listing",
        title: "Apply fallbacks in the blog listing template",
        body: [
          "The blog post listing template (`blog_listing.html`) iterates over `content_group.blog_listing_items`. Each item has its own `featured_image` field. Apply the fallback per item so every card in the listing has a visible image.",
          "Use the post name (title) as the fallback text parameter for each card. This makes the generated placeholder informative and distinct for each post in the listing — editors can immediately see which posts still need images uploaded.",
        ],
        code: `{% for item in content_group.blog_listing_items %}
  {% set fb = "https://fallback.pics/api/v1/600x400?text=" ~ item.name | urlencode %}
  <article class="blog-card">
    <a href="{{ item.absolute_url }}">
      <img
        src="{{ item.featured_image | default(fb) }}"
        alt="{{ item.featured_image_alt_text | default(item.name) }}"
        width="600"
        height="400"
        loading="lazy"
      />
    </a>
    <h2>{{ item.name }}</h2>
  </article>
{% endfor %}`,
      },
      {
        eyebrow: "Open Graph",
        title: "Ensure social sharing always has an image",
        body: [
          "Social platforms pull the `og:image` meta tag when a URL is shared. An empty `og:image` means the shared post appears without a preview image on LinkedIn, Twitter/X, and Slack. Adding the fallback URL to the meta tag ensures every post gets a preview image even before the author uploads one.",
          "The 1200×630 dimension is the standard for Open Graph images. Use the blog post title as the text parameter to make the generated social card informative. Authors can replace it with a custom image at any time — the fallback only activates when the field is empty.",
        ],
        code: `<head>
  {% set og_image = content.featured_image
    | default("https://fallback.pics/api/v1/1200x630?text=" ~ content.name | urlencode) %}

  <meta property="og:image" content="{{ og_image }}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:image" content="{{ og_image }}" />
</head>`,
      },
      {
        eyebrow: "Landing pages",
        title: "Module-level image fallbacks",
        body: [
          "HubSpot Landing Page modules have custom image fields defined in `module.html` and `meta.json`. You can set a default value in `meta.json` using the `default` property on the image field. This is the most robust approach for landing pages: the module always has a valid image value in the editor, and authors see a fallback in the live preview without any template logic.",
          "For blog templates, the module default approach does not apply because `featured_image` is a built-in field. The HubL conditional in the template is required there.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The fallback.pics thumbnail route generates blog-card-style images with a title, label, and gradient. It is a step up from the basic dimension placeholder when you want the fallback to look like an intentional design rather than a filler.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/generate-blog-thumbnails-from-text/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "HubSpot featured_image resolves to an empty string, not null — use the HubL | default filter or {% if %} block to substitute a fallback.",
      "Include the post name in the fallback URL text parameter so each placeholder is identifiable in the listing.",
      "Apply the same fallback to og:image and twitter:image meta tags so social shares always have a preview.",
      "Match fallback dimensions to the slot dimensions — 1200×630 for Open Graph, 600×400 for listing cards.",
      "Use module meta.json default values for custom landing page modules to avoid per-template conditional logic.",
    ],
    related: [
      "ghost-blog-featured-image-fallback",
      "generate-blog-thumbnails-from-text",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. ghost-blog-featured-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Ghost Blog Featured Image Fallback Generated from Post Title",
    description:
      "Generate a fallback image for Ghost blog posts when feature_image is null using the Ghost Content API and a title-based placeholder URL.",
    slug: "ghost-blog-featured-image-fallback",
    readTime: "7 min read",
    category: "CMS Workflows",
    tags: [
      "Ghost blog featured image",
      "Ghost CMS",
      "feature_image fallback",
      "Placeholder image API",
      "Headless Ghost",
    ],
    summary: [
      "Ghost stores the featured image URL in a `feature_image` field on each post. The field is null for any post published without an image — which includes many newsletters, tutorials, and quick notes. Templates that render the field without a null check produce broken-image icons in post cards, headers, and Open Graph meta tags.",
      "The Ghost Content API lets you handle this entirely at the data layer. When `feature_image` is null, substitute a fallback.pics URL built from the post title. The generated image appears immediately and looks like an intentional placeholder rather than a missing asset.",
    ],
    sections: [
      {
        eyebrow: "Ghost API",
        title: "The feature_image field and when it is null",
        body: [
          "The Ghost Content API returns posts with a `feature_image` field that is either a string URL or `null`. There is no default image in Ghost's data model — the field is simply absent when no image has been set. Ghost's Handlebars helper `{{#if feature_image}}` handles this correctly in native themes, but headless frontends using the JSON API need their own null check.",
          "Ghost also returns `feature_image_alt` and `feature_image_caption`. These are null whenever the image itself is null. Your fallback should either omit these fields or supply a safe default alt text derived from the post title.",
        ],
      },
      {
        eyebrow: "Headless setup",
        title: "Fetching posts with the Ghost Content API",
        body: [
          "The `@tryghost/content-api` npm package wraps the HTTP API. Each post object includes `feature_image` as a nullable string. Fetch posts with the fields you need and apply fallback logic after the fetch — not inside the component.",
          "For static site builds (Astro, Next.js, Eleventy), compute fallback URLs during the build. For client-side Ghost-powered sites or ISR routes, compute them in the data-fetching layer before passing to components.",
        ],
        code: `import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: 'v5.0',
});

function ghostPostImage(post: GhostPost): string {
  if (post.feature_image) return post.feature_image;
  const title = encodeURIComponent(post.title);
  return \`https://fallback.pics/api/v1/1200x630?text=\${title}\`;
}

export async function getPosts() {
  const posts = await api.posts.browse({ limit: 'all' });
  return posts.map((post) => ({
    ...post,
    feature_image: ghostPostImage(post),
  }));
}`,
      },
      {
        eyebrow: "Thumbnail style",
        title: "Use the thumbnail route for blog-card style fallbacks",
        body: [
          "The basic dimension route gives you a solid-color placeholder. The thumbnail route generates a blog-card layout with a title, category label, gradient, and safe-zone decoration. For Ghost blogs where every post should look publication-quality even before photography is ready, the thumbnail route is a better default.",
          "Map Ghost's primary tag to the thumbnail `label` parameter. This gives each post card a category pill that matches the blog's taxonomy, making fallback images look intentional rather than generic.",
        ],
        code: `function ghostThumbnailUrl(post: GhostPost): string {
  if (post.feature_image) return post.feature_image;

  const params = new URLSearchParams({
    text: post.title,
    label: post.primary_tag?.name ?? 'Blog',
    style: 'soft',
    theme: 'purple',
  });
  return \`https://fallback.pics/api/v1/thumbnail/1200x630?\${params}\`;
}`,
      },
      {
        eyebrow: "Handlebars themes",
        title: "Fallback in native Ghost Handlebars themes",
        body: [
          "In a native Ghost Handlebars theme, the `{{feature_image}}` helper outputs nothing when the field is null. You cannot pass it a default value directly. Instead, use a custom helper or a conditional block to output the fallback URL.",
          "Register a custom `featureImageOrFallback` helper in your theme's `helpers.js` file. This is cleaner than duplicating the conditional in every template partial.",
        ],
        code: `{{! In your theme template (e.g. index.hbs, post.hbs) }}
{{#if feature_image}}
  <img src="{{feature_image}}" alt="{{feature_image_alt}}" width="1200" height="630" />
{{else}}
  <img
    src="https://fallback.pics/api/v1/thumbnail/1200x630?text={{encode title}}&label={{primary_tag.name}}&style=soft&theme=purple"
    alt="{{title}}"
    width="1200"
    height="630"
  />
{{/if}}`,
      },
      {
        eyebrow: "RSS feed",
        title: "Feature images in the Ghost RSS feed",
        body: [
          "Ghost's RSS feed includes `<media:content>` tags for featured images. When `feature_image` is null, the RSS item has no image, which means podcast apps, RSS readers, and feed aggregators show a blank entry. If your Ghost blog is also used as an RSS feed source, the fallback URL should be included in the feed output.",
          "For headless Ghost setups, you control the RSS generation. Include the fallback URL in the feed item's image field. For native Ghost themes, a custom template in `ghost.hbs` or a route configuration is needed to inject fallback URLs into the feed.",
        ],
      },
      {
        eyebrow: "Open Graph",
        title: "Populate og:image for social sharing",
        body: [
          "Ghost populates `og:image` from `feature_image` automatically in native themes. In headless setups, you are responsible for the meta tags. Apply the same fallback URL to `og:image`, `twitter:image`, and `og:image:secure_url` so shares on LinkedIn, X, and Slack all get a preview image.",
        ],
        code: `<head>
  {/* Next.js / Astro headless Ghost example */}
  <meta property="og:image" content={ghostThumbnailUrl(post)} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={ghostThumbnailUrl(post)} />
</head>`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The fallback.pics thumbnail route documentation covers all style, theme, and label parameters. For full open graph image strategies, the OG image placeholders guide is a useful reference.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/generate-blog-thumbnails-from-text/
https://fallback.pics/blog/hubspot-cms-image-fallback/`,
      },
    ],
    takeaways: [
      "Ghost's feature_image field is null when no image is set — check before using as img src or og:image.",
      "Compute fallback URLs in the data-fetching layer, not inside components, so every template gets a valid string.",
      "Use the thumbnail route with the post title and primary tag label for publication-quality fallback cards.",
      "Apply the same fallback URL to Open Graph and Twitter Card meta tags to ensure social previews always render.",
      "In native Handlebars themes, use a {{#if feature_image}} block since the helper has no default value parameter.",
    ],
    related: [
      "hubspot-cms-image-fallback",
      "generate-blog-thumbnails-from-text",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. drupal-media-placeholder
  // ─────────────────────────────────────────────────────────
  {
    title: "Drupal Media Entity Placeholder Images for Empty Fields",
    description:
      "Handle empty Drupal media entity fields in Twig templates and decoupled frontends with generated placeholder URLs sized to match your image styles.",
    slug: "drupal-media-placeholder",
    readTime: "7 min read",
    category: "CMS Workflows",
    tags: [
      "Drupal placeholder image",
      "Drupal media entity",
      "Twig template fallback",
      "Headless Drupal",
      "CMS Workflows",
    ],
    summary: [
      "Drupal media entities decouple files from field instances, which means an image field can reference a media entity that does not exist yet. Empty media fields return null at the Twig layer and as null in JSON:API and GraphQL responses. Twig templates that call `file_url(content.field_image.entity.field_media_image.entity.uri.value)` without checking for entity existence throw a fatal error.",
      "The defensive pattern is to check for the media entity at each step of the chain before resolving the file URL. When any step is null, fall back to a generated placeholder URL. fallback.pics returns cacheable SVG images from URL parameters, so you do not need to upload placeholder assets to Drupal's file system.",
    ],
    sections: [
      {
        eyebrow: "Media entity chain",
        title: "Why Drupal image fields throw on null",
        body: [
          "A typical Drupal image field is a media reference field. The chain is: content type field → media entity → file entity → URI → public URL. Any step in this chain can be null if the media entity was not attached, if the media entity was deleted, or if the file was removed from the managed file table.",
          "Drupal 10 uses the Media module by default. When a media reference field is optional and left empty, `node.field_image.entity` is null. Twig's null-propagation (the `?.` operator is not native HubL, but Twig has its own approach) requires explicit checks before property access.",
          "For decoupled Drupal frontends using JSON:API, the field value comes back as null inside the `relationships` key. Frontends receive `{ field_image: { data: null } }` and must handle it without crashing the render.",
        ],
      },
      {
        eyebrow: "Twig template",
        title: "Null-safe image rendering in Twig",
        body: [
          "Use Twig's `is not empty` check or the `?:` null-coalescing approach before rendering the image URL. For a media reference field, check the entity existence before navigating to the file entity.",
          "Set explicit `width` and `height` attributes on the rendered `<img>` tag. These attributes must match the Drupal image style dimensions to prevent layout shift when the real image loads.",
        ],
        code: `{# node--article.html.twig #}
{% set img_src = null %}
{% if content.field_image[0] is not empty %}
  {% set img_src = content.field_image[0]['#media'].field_media_image.entity.uri.value | file_url %}
{% endif %}

{% if img_src %}
  <img src="{{ img_src }}" alt="{{ content.field_image[0]['#media'].field_media_image.alt }}" width="800" height="450" />
{% else %}
  <img
    src="https://fallback.pics/api/v1/800x450?text=Image+Missing"
    alt="{{ node.title.value }}"
    width="800"
    height="450"
  />
{% endif %}`,
      },
      {
        eyebrow: "Image styles",
        title: "Match fallback dimensions to Drupal image styles",
        body: [
          "Drupal image styles define specific output dimensions. A `16_9_medium` style might output 800×450. Your fallback URL should use the same dimensions as the image style you target for the context. If the image style scales proportionally, use the largest expected output dimensions.",
          "When multiple image styles are used for different breakpoints, use different fallback URLs per breakpoint in your `<picture>` or `srcset` setup. Dimension-matched fallbacks ensure no reflow when an image loads or when the fallback is shown permanently.",
        ],
        code: `{# Using multiple image styles with srcset and matching fallbacks #}
{% if img_src %}
  <picture>
    <source srcset="{{ img_src | image_style('16_9_large') }}" media="(min-width: 1024px)" />
    <source srcset="{{ img_src | image_style('16_9_medium') }}" media="(min-width: 640px)" />
    <img src="{{ img_src | image_style('16_9_small') }}" width="400" height="225" alt="{{ alt }}" />
  </picture>
{% else %}
  <picture>
    <source srcset="https://fallback.pics/api/v1/1200x675?text=No+Image" media="(min-width: 1024px)" />
    <source srcset="https://fallback.pics/api/v1/800x450?text=No+Image" media="(min-width: 640px)" />
    <img src="https://fallback.pics/api/v1/400x225?text=No+Image" width="400" height="225" alt="{{ node.title.value }}" />
  </picture>
{% endif %}`,
      },
      {
        eyebrow: "JSON:API",
        title: "Decoupled Drupal: handle null in JSON:API responses",
        body: [
          "A decoupled frontend using Drupal's JSON:API receives media reference fields inside the `relationships` key. When the field is empty, the value is `{ data: null }`. To get the file URL, you need to resolve the included resources — the media entity and then the file entity.",
          "Write a resolver function that accepts the full JSON:API response and the node data, walks the included resources to find the file entity, and returns the real URL or a fallback URL. Keep the resolver deterministic so the same null input always produces the same fallback URL.",
        ],
        code: `function resolveMediaUrl(
  node: JsonApiNode,
  included: JsonApiResource[],
  width: number,
  height: number,
): string {
  const mediaRef = node.relationships?.field_image?.data;
  if (!mediaRef) {
    return \`https://fallback.pics/api/v1/\${width}x\${height}?text=No+Image\`;
  }

  const mediaEntity = included.find(
    (r) => r.type === mediaRef.type && r.id === mediaRef.id,
  );
  const fileRef = mediaEntity?.relationships?.field_media_image?.data;
  const fileEntity = included.find(
    (r) => r.type === fileRef?.type && r.id === fileRef?.id,
  );
  const url = fileEntity?.attributes?.uri?.url;

  return url
    ? \`\${process.env.DRUPAL_BASE_URL}\${url}\`
    : \`https://fallback.pics/api/v1/\${width}x\${height}?text=No+Image\`;
}`,
      },
      {
        eyebrow: "Default image",
        title: "Use the Drupal field default image vs URL fallback",
        body: [
          "Drupal's image field has a built-in default image setting. You can upload an image to the media library and configure the field to use it when no media is attached. This is the simplest approach for Twig-only setups. The tradeoff: you store an asset in Drupal and need to manage it per-environment. A URL-based fallback requires no storage.",
          "For decoupled setups, the Drupal default image appears in the JSON:API response as a real file entity, so your resolver handles it automatically. URL-based fallbacks are more useful in headless contexts where the frontend team controls the placeholder design independently of the CMS.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For more on placeholder image patterns across CMS platforms, see the general CMS placeholder guide and the Contentful and Strapi guides in this series.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/strapi-media-fallback/
https://fallback.pics/blog/placeholder-images-cms-previews-missing-media/`,
      },
    ],
    takeaways: [
      "Drupal media entity chains can fail at multiple points — check each step before accessing the final file URL.",
      "Match fallback.pics dimensions to your Drupal image style output dimensions to prevent layout shift.",
      "In decoupled setups, walk the JSON:API included resources to resolve media-to-file references before deciding on a fallback.",
      "Drupal's built-in default image works for Twig setups; URL-based fallbacks are better for headless frontends where the frontend controls placeholder design.",
      "Use a `<picture>` element with separate fallback URLs per breakpoint when multiple image styles are active.",
    ],
    related: [
      "strapi-media-fallback",
      "contentful-image-field-fallback",
      "placeholder-images-cms-previews-missing-media",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 7. webflow-cms-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Webflow CMS Collection Image Fallback for Blank Fields",
    description:
      "Handle blank Webflow CMS image reference fields in collection lists using conditional visibility and custom code to inject fallback placeholder URLs.",
    slug: "webflow-cms-image-fallback",
    readTime: "6 min read",
    category: "CMS Workflows",
    tags: [
      "Webflow CMS image placeholder",
      "Webflow collection list",
      "CMS image fallback",
      "Webflow custom code",
    ],
    summary: [
      "Webflow CMS image reference fields render nothing when left blank — the bound image element simply disappears from the DOM. This collapses card layouts, breaks grid alignment, and leaves an unexpected gap where the image should appear.",
      "Webflow's native conditional visibility lets you show a fallback image element when the CMS image field is empty. For more control, a small script in the page's custom code section can replace missing images with generated placeholder URLs sized to match each slot.",
    ],
    sections: [
      {
        eyebrow: "Webflow CMS images",
        title: "What happens when a CMS image field is empty",
        body: [
          "Webflow CMS image fields are optional. When an author creates a collection item without uploading an image, Webflow renders the bound element with an empty src or hides it depending on your visibility settings. An empty src triggers the browser's broken-image icon. Hidden elements collapse the layout and break grid spacing.",
          "Collection list templates are static Webflow designs — you cannot write conditional logic directly in the template. Webflow provides conditional visibility as a design-level workaround, and custom code for programmatic handling.",
        ],
      },
      {
        eyebrow: "Conditional visibility",
        title: "Use conditional visibility with a static fallback image",
        body: [
          "In the Webflow Designer, select the CMS image element and set its visibility to show only when the image field is set. Then add a second static image element in the same slot — a locally uploaded fallback image — and set its visibility to show only when the CMS field is empty. The two elements occupy the same layout slot and exactly one is visible at a time.",
          "This approach works without code and is easy for non-developers to configure. The tradeoff is that you must upload a static fallback image to Webflow's asset manager and update it manually if the placeholder design changes.",
        ],
      },
      {
        eyebrow: "Custom code",
        title: "Replace empty images with generated URLs via JavaScript",
        body: [
          "For dynamic fallbacks — where the placeholder shows the item name or dimensions — add a small script to the collection list page's before-body-close custom code. The script finds bound images that failed to load, reads the element dimensions, and replaces the src with a generated fallback URL.",
          "This approach scales better than static fallbacks: each missing image gets a placeholder labeled with the item name, and dimension changes in the design automatically propagate to the fallback URLs without needing to re-upload an asset.",
        ],
        code: `<script>
  // Runs after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-cms-image]').forEach(function (img) {
      if (!img.src || img.src === window.location.href) {
        var w = img.offsetWidth || 600;
        var h = img.offsetHeight || 400;
        var label = img.closest('[data-item-name]')
          ?.getAttribute('data-item-name') || '';
        img.src =
          'https://fallback.pics/api/v1/' + w + 'x' + h +
          (label ? '?text=' + encodeURIComponent(label) : '');
      }
    });

    // Also handle images that load but return 404
    document.querySelectorAll('[data-cms-image]').forEach(function (img) {
      img.addEventListener('error', function () {
        var w = this.offsetWidth || 600;
        var h = this.offsetHeight || 400;
        this.src = 'https://fallback.pics/api/v1/' + w + 'x' + h + '?text=No+Image';
        this.onerror = null; // prevent infinite loop
      });
    });
  });
</script>`,
      },
      {
        eyebrow: "Webflow attributes",
        title: "Tag CMS image elements for reliable script targeting",
        body: [
          "Webflow-generated class names change unpredictably during redesigns. Instead of targeting by class, add a custom attribute like `data-cms-image` to each CMS image element in the Designer. This gives the fallback script a stable hook that survives layout changes.",
          "To pass the item name to the script, add another custom attribute — `data-item-name` — bound to the CMS item Name field. The script reads this attribute and uses it as the fallback image label, making each placeholder distinct.",
        ],
      },
      {
        eyebrow: "Webflow API",
        title: "Headless Webflow: handle null in Data API responses",
        body: [
          "Webflow's Data API returns CMS collection items with image fields as objects containing `url`, `alt`, and dimension metadata, or null when the field is empty. Headless frontends using the Data API should apply the same null-check helper pattern used for other headless CMS platforms.",
        ],
        code: `// Webflow Data API response
// { fieldData: { image: { url: '...', alt: '...' } | null } }

function webflowImageUrl(
  item: WebflowCollectionItem,
  fieldName: string,
  width: number,
  height: number,
): string {
  const image = item.fieldData?.[fieldName] as WebflowImage | null;
  if (image?.url) return image.url;
  const name = (item.fieldData?.name as string) ?? '';
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${encodeURIComponent(name || 'No Image')}\`;
}`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The fallback.pics API also provides skeleton animation and blur placeholder routes. For collection lists with loading states, see the responsive placeholder guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/responsive-placeholder-images-cards-banners-grids/
https://fallback.pics/blog/contentful-image-field-fallback/`,
      },
    ],
    takeaways: [
      "Webflow CMS image fields render an empty src or collapsed element when blank — both break grid layouts.",
      "Use conditional visibility in the Webflow Designer to show a static fallback image when the CMS field is empty.",
      "For dynamic fallbacks, add a custom attribute to CMS image elements and use a small DOM script to inject generated placeholder URLs.",
      "Prevent the onerror infinite loop by setting onerror = null after the first fallback assignment.",
      "In headless Webflow setups, use the same null-check helper pattern as other headless CMS platforms.",
    ],
    related: [
      "contentful-image-field-fallback",
      "sanity-cms-image-fallback",
      "responsive-placeholder-images-cards-banners-grids",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. squarespace-product-image-placeholder
  // ─────────────────────────────────────────────────────────
  {
    title: "Squarespace Product Image Placeholder Strategy for Shops",
    description:
      "Handle missing Squarespace product images in commerce blocks using Developer Mode custom code and onerror fallback URLs sized for product grids.",
    slug: "squarespace-product-image-placeholder",
    readTime: "6 min read",
    category: "Ecommerce",
    tags: [
      "Squarespace product image",
      "Squarespace commerce",
      "Image fallback",
      "Ecommerce placeholder",
      "Squarespace Developer Mode",
    ],
    summary: [
      "Squarespace commerce blocks render product grids where every item is expected to have at least one product image. When a product is created without images — common during catalog setup or bulk import from another platform — the product grid collapses that item's image slot, breaking the visual alignment of the entire grid row.",
      "Squarespace limits direct template access outside of Developer Mode. The most reliable cross-plan solution is a custom code block with a JavaScript snippet that detects broken or absent product images and replaces them with a generated fallback URL.",
    ],
    sections: [
      {
        eyebrow: "Squarespace image behavior",
        title: "How Squarespace handles products without images",
        body: [
          "In Squarespace Commerce, a product with no images renders its grid item with a gray box or a missing-image icon depending on the template. Some templates completely omit the image element, which collapses the card height. Either way, the product card looks unfinished in the store.",
          "Squarespace does not expose a template-level fallback image configuration for product images outside of Developer Mode. Standard plans are limited to injecting JavaScript or CSS through Settings > Advanced > Code Injection.",
          "Developer Mode (available on Business plans and above) gives access to `.item` template files where you can add conditional logic to output a fallback src directly in the markup.",
        ],
      },
      {
        eyebrow: "Code injection",
        title: "JavaScript fallback for all Squarespace plans",
        body: [
          "The code injection approach works on every Squarespace plan. Add the script to Settings > Advanced > Code Injection > Footer. It queries product grid images and attaches onerror handlers that substitute a generated fallback URL when the image fails to load.",
          "Target Squarespace product images by their data attributes or class names. Squarespace uses the `sqspc-product-image` class and `data-collection-item-id` attributes on product cards. Targeting by these stable identifiers is safer than class names that vary per template.",
        ],
        code: `<script>
(function () {
  function applyProductFallbacks() {
    var images = document.querySelectorAll(
      '.ProductItem-gallery-slides img, .products-item-image img'
    );
    images.forEach(function (img) {
      if (!img.complete || img.naturalWidth === 0) {
        img.onerror = function () {
          this.src = 'https://fallback.pics/api/v1/600x600?text=Product+Image';
          this.onerror = null;
        };
        if (img.complete && img.naturalWidth === 0) {
          img.src = 'https://fallback.pics/api/v1/600x600?text=Product+Image';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyProductFallbacks);
  } else {
    applyProductFallbacks();
  }
})();
</script>`,
      },
      {
        eyebrow: "Developer Mode",
        title: "Template-level fallback in Developer Mode",
        body: [
          "In Developer Mode, Squarespace templates use JSON-T (JSONT) as their templating language. Product data is available in the template context, and image collections are arrays of image objects. An empty products list or a product with an empty `items` array requires a conditional check.",
          "JSONT syntax uses `{.if}` blocks for conditionals. Check whether the image collection is populated before rendering the image element, and output a fallback `<img>` in the else branch.",
        ],
        code: `{# JSONT template fragment for a product image block #}
{.section product}
  {.repeated section items}
    {.section assetUrl}
      <img src="{@}" alt="{title}" width="600" height="600" />
    {.or}
      <img
        src="https://fallback.pics/api/v1/600x600?text={title|htmltag}"
        alt="{title}"
        width="600"
        height="600"
      />
    {.end}
  {.end}
{.end}`,
      },
      {
        eyebrow: "Square images",
        title: "Use square fallbacks for product grid consistency",
        body: [
          "Squarespace product grids expect square or consistent-aspect-ratio images. A 1:1 fallback (600×600) matches the most common product grid layout. If your store uses a 4:3 or 3:2 layout, adjust the fallback dimensions accordingly.",
          "The square placeholder route is a shortcut for 1:1 images: `https://fallback.pics/api/v1/square/600?text=Product`. It generates a properly sized square without needing to specify both width and height.",
        ],
        code: `// Square product placeholder — matches 1:1 Squarespace product grids
https://fallback.pics/api/v1/square/600?text=Product+Image

// Product thumbnail for cart and order confirmation pages
https://fallback.pics/api/v1/square/200?text=Item

// Larger 4:3 fallback for wide-format product pages
https://fallback.pics/api/v1/800x600?text=Product+Photo`,
      },
      {
        eyebrow: "Catalog import",
        title: "Protect the store during catalog imports",
        body: [
          "Squarespace Commerce supports CSV product imports. When importing a large catalog, product images are added separately after the initial CSV import completes. During this window, products are live but image slots are empty.",
          "Having the JavaScript fallback already in place means the store is protected from the moment products appear. Customers see a labeled placeholder rather than an empty card, and product grids maintain their visual alignment throughout the import process.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For ecommerce image placeholder strategies across platforms, see the product image placeholder guide and the WooCommerce guide in this series.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
https://fallback.pics/blog/bigcommerce-image-fallback/`,
      },
    ],
    takeaways: [
      "Squarespace product grids collapse or show broken icons when products have no images — inject a fallback script via Code Injection for all plans.",
      "Use a 1:1 (square) fallback URL to match standard Squarespace product grid layouts.",
      "Attach onerror handlers to product images and set onerror = null immediately after to prevent infinite reload loops.",
      "Developer Mode enables template-level JSONT conditionals for cleaner fallback logic without JavaScript.",
      "Pre-deploy the fallback script before starting catalog imports so every gap in the import process is covered.",
    ],
    related: [
      "bigcommerce-image-fallback",
      "magento-product-image-placeholder",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. bigcommerce-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "BigCommerce Catalog Image Fallbacks for Missing Products",
    description:
      "Handle missing BigCommerce product thumbnail URLs in Stencil themes and headless storefronts using onerror handlers and generated fallback URLs.",
    slug: "bigcommerce-image-fallback",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "BigCommerce product image placeholder",
      "BigCommerce Stencil",
      "Headless BigCommerce",
      "Ecommerce image fallback",
      "Product catalog",
    ],
    summary: [
      "BigCommerce products can be created without images. The Catalog API returns a `thumbnail_url` field that is an empty string or contains a path to the BigCommerce default gray square when no image has been uploaded. That default image is low-resolution, does not match your store's branding, and is the same for every product.",
      "Replacing missing thumbnails with generated, brand-consistent fallback URLs requires a small check in either the Stencil template layer or your headless storefront component. fallback.pics generates placeholder images from URL parameters with no upload or storage required.",
    ],
    sections: [
      {
        eyebrow: "BigCommerce image fields",
        title: "What BigCommerce returns for products without images",
        body: [
          "The BigCommerce Catalog V2 and V3 REST APIs return image data on product objects. In V3, the primary image is under `images` — an array that is empty when no images have been uploaded. The `thumbnail_url` shortcut field on a product returns BigCommerce's default gray square image hosted at `cdn11.bigcommerce.com/s-{hash}/images/stencil/default-bc-image.jpg`.",
          "The default image is 1280×1280 but visually identical across every product. Storefront buyers cannot distinguish one missing-image product from another. In a product grid with multiple missing images, every card looks the same, which is confusing.",
          "The Storefront GraphQL API returns `defaultImage: { url: string } | null` on the Product type. A null value here — rather than the default image URL — indicates no image has ever been uploaded. Both patterns require a fallback strategy.",
        ],
      },
      {
        eyebrow: "Stencil templates",
        title: "Handlebars fallback in Stencil themes",
        body: [
          "BigCommerce Stencil themes use Handlebars. Product image data is available in the `product.main_image` and `product.images` template variables. When `product.main_image` is empty, apply a fallback URL.",
          "The Handlebars `{{#if}}` block is the right tool. Check `product.main_image` before rendering the img tag and output the fallback src in the `{{else}}` branch.",
        ],
        code: `{{! templates/components/products/card.html }}
{{#if product.main_image}}
  <img
    src="{{getImageSrcset product.main_image use_default_sizes=true}}"
    alt="{{product.main_image.alt}}"
    width="300"
    height="300"
  />
{{else}}
  <img
    src="https://fallback.pics/api/v1/300x300?text={{product.name}}"
    alt="{{product.name}}"
    width="300"
    height="300"
  />
{{/if}}`,
      },
      {
        eyebrow: "Headless storefront",
        title: "Null checks in a React or Next.js headless storefront",
        body: [
          "Headless BigCommerce storefronts commonly use the Storefront GraphQL API or the Catalyst framework. The GraphQL Product type returns `defaultImage` as a nullable object. A null check before accessing `defaultImage.url` is the minimum needed to avoid a runtime crash.",
          "Write a utility function that accepts the product data and returns a valid image URL or a generated fallback. This function should handle both the null case and the BigCommerce default image case if you want to replace the gray square.",
        ],
        code: `const BC_DEFAULT_IMAGE = 'cdn11.bigcommerce.com';

function productImageUrl(
  product: BigCommerceProduct,
  width = 400,
  height = 400,
): string {
  const url = product.defaultImage?.url ?? product.images?.[0]?.url;
  // Replace the BigCommerce default gray square with a branded fallback
  if (!url || url.includes(BC_DEFAULT_IMAGE)) {
    const name = encodeURIComponent(product.name);
    return \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${name}\`;
  }
  return url;
}`,
      },
      {
        eyebrow: "Cart and checkout",
        title: "Line item thumbnail fallbacks",
        body: [
          "Cart line items in BigCommerce also reference product images. When a product has no image, the cart thumbnail column shows the default gray square or breaks. The Cart API returns `imageUrl` on each line item — apply the same fallback check.",
          "Cart and checkout are high-trust surfaces. A broken or visually confusing image at checkout can increase cart abandonment. A labeled placeholder — even a simple one — is less disruptive than a generic gray box or a broken icon.",
        ],
        code: `// Cart line item with fallback
function cartItemImageUrl(item: BigCommerceCartItem): string {
  const url = item.imageUrl;
  if (!url || url.includes(BC_DEFAULT_IMAGE)) {
    return \`https://fallback.pics/api/v1/square/80?text=\${encodeURIComponent(item.name)}\`;
  }
  return url;
}`,
      },
      {
        eyebrow: "Search results",
        title: "Product search and faceted results with missing thumbnails",
        body: [
          "BigCommerce search results (via Elasticsearch-backed APIs) return the same thumbnail data as the catalog API. If a merchant runs a search campaign while mid-import, search result pages may contain products without images. Applying the same fallback utility to search results keeps the results page consistent with the main catalog.",
          "Search result pages are often conversion-critical. Products that appear visually broken or that look identical to every other missing-image product in search results perform worse in click-through. A labeled placeholder that shows the product name is meaningfully better.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For a broader view of ecommerce placeholder strategies, see the product image placeholder guide and the Magento 2 and PrestaShop guides.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
https://fallback.pics/blog/magento-product-image-placeholder/`,
      },
    ],
    takeaways: [
      "BigCommerce returns its own default gray square for products without images — detect it by hostname and replace with a branded fallback.",
      "In Stencil themes, use the Handlebars {{#if product.main_image}} block to conditionally output the fallback src.",
      "In headless storefronts, check defaultImage against null and the BigCommerce default hostname before using the URL.",
      "Apply the same fallback logic to cart line item thumbnails — checkout is a high-trust surface where broken images increase abandonment.",
      "Use the product name as the fallback text parameter so each missing-image card remains identifiable in search results and grids.",
    ],
    related: [
      "squarespace-product-image-placeholder",
      "magento-product-image-placeholder",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. magento-product-image-placeholder
  // ─────────────────────────────────────────────────────────
  {
    title: "Magento 2 Product Image Placeholder for Missing SKUs",
    description:
      "Override Magento 2's default no_selection placeholder with a generated URL and apply consistent image fallbacks in Luma, Hyvä, and PWA Studio frontends.",
    slug: "magento-product-image-placeholder",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "Magento placeholder image",
      "Magento 2 product image",
      "no_selection image",
      "Hyvä fallback",
      "PWA Studio image",
    ],
    summary: [
      "Magento 2 stores a special `no_selection` sentinel value in the product image database field when no image has been uploaded for a product. The core image helper translates this into a URL pointing to the configured placeholder image in the store admin. By default, that placeholder is a generic gray box.",
      "Replacing `no_selection` products with dimension-matched, branded fallback URLs requires a small override at the template or data layer. The strategy differs between traditional Luma themes, Hyvä themes, and headless PWA Studio frontends, but the core check is the same: detect `no_selection` or a placeholder URL and substitute a generated one.",
    ],
    sections: [
      {
        eyebrow: "no_selection sentinel",
        title: "How Magento 2 signals a missing product image",
        body: [
          "In Magento 2's `catalog_product_entity_varchar` table, the `no_selection` string is stored as the image attribute value for products without an uploaded image. The PHP `\\Magento\\Catalog\\Block\\Product\\AbstractProduct::getImage()` method and the related `ProductImageFactory` check for this sentinel and fall back to the configured placeholder image stored in `pub/media/catalog/product/placeholder/`.",
          "The admin-configured placeholder appears on every product grid, product page, and cart thumbnail where no real image exists. It is a single image across the entire catalog — there is no per-category or per-attribute variation without custom development.",
          "The practical consequence is that large catalogs imported from an ERP or PIM system look visually identical for all SKUs that lacked images in the source system. Buyers cannot distinguish between similar products in search or category views.",
        ],
      },
      {
        eyebrow: "Admin configuration",
        title: "Override the default placeholder in Admin",
        body: [
          "The simplest approach is uploading a better placeholder to Stores > Configuration > Catalog > Product Image Placeholders. Upload separate images for Base Image, Small Image, and Thumbnail. This is a global change requiring no code deployment.",
          "The limitation is that the same image appears for every product. If your catalog spans multiple categories, a generic 'Image Coming Soon' graphic is the best universal placeholder. For more targeted fallbacks — where the SKU name or category appears in the placeholder — a URL-based approach is necessary.",
        ],
      },
      {
        eyebrow: "Luma theme",
        title: "Template override for Luma themes",
        body: [
          "In Luma, product images are rendered through a complex block chain involving `Magento_Catalog::product/list/items.phtml`, view models, and image helpers. The cleanest override for the fallback is a custom theme override on the product image template that checks the resolved URL and replaces the admin-configured placeholder path with a generated one.",
          "Check the URL against the known placeholder path prefix (`pub/media/catalog/product/placeholder/`) rather than the `no_selection` value, since you are working at the template render layer after the PHP helper has already resolved the value.",
        ],
        code: `<?php
// app/design/frontend/Vendor/theme/Magento_Catalog/templates/product/image.phtml
/** @var \\Magento\\Catalog\\Block\\Product\\Image $block */

$imageSrc = $block->getImageUrl();
$placeholderPattern = '/catalog/product/placeholder/';

if (strpos($imageSrc, $placeholderPattern) !== false || empty($imageSrc)) {
    $productName = urlencode($block->getLabel());
    $width = $block->getWidth() ?: 300;
    $height = $block->getHeight() ?: 300;
    $imageSrc = "https://fallback.pics/api/v1/{$width}x{$height}?text={$productName}";
}
?>
<img
  src="<?= $block->escapeUrl($imageSrc) ?>"
  alt="<?= $block->escapeHtmlAttr($block->getLabel()) ?>"
  width="<?= (int)$block->getWidth() ?>"
  height="<?= (int)$block->getHeight() ?>"
  loading="lazy"
/>`,
      },
      {
        eyebrow: "Hyvä theme",
        title: "Alpine.js or Tailwind Hyvä theme approach",
        body: [
          "Hyvä themes use Alpine.js components and Tailwind CSS. Image rendering in Hyvä often goes through the `Hyva\\Theme\\ViewModel\\ProductImages` view model or directly through product page JavaScript components. You can add an `onerror` attribute directly on the img tag to substitute the fallback URL when the placeholder image itself returns a 404.",
          "Set the fallback URL in a PHP variable and output it into the Alpine data context or directly as the onerror attribute value. Avoid inline event handlers that reference unreachable variables.",
        ],
        code: `<?php
$placeholderUrl = "https://fallback.pics/api/v1/{$width}x{$height}?text=" . urlencode($productName);
?>
<img
  src="<?= $escaper->escapeUrl($imageSrc) ?>"
  alt="<?= $escaper->escapeHtmlAttr($productName) ?>"
  width="<?= (int)$width ?>"
  height="<?= (int)$height ?>"
  onerror="this.src='<?= $escaper->escapeJs($placeholderUrl) ?>'; this.onerror=null;"
  loading="lazy"
/>`,
      },
      {
        eyebrow: "PWA Studio",
        title: "React component fallback in PWA Studio",
        body: [
          "Magento PWA Studio uses Peregrine hooks to fetch product data and Venia UI components to render it. The `ProductImageComponent` in `@magento/venia-ui` accepts an `onError` prop. Pass a fallback URL generator that reads the product name and returns a dimension-matched placeholder URL.",
          "PWA Studio queries product images via GraphQL. The `url_thumbnail`, `url_small_image`, and `url_full_size` fields on media gallery entries can each be null or point to the placeholder path. Check all three before concluding that no real image exists.",
        ],
        code: `// src/components/ProductImage/productImage.js
import React, { useCallback, useState } from 'react';

const MAGENTO_PLACEHOLDER = '/media/catalog/product/placeholder/';

export function ProductImage({ src, name, width = 300, height = 300 }) {
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${encodeURIComponent(name)}\`;
  const realSrc = src && !src.includes(MAGENTO_PLACEHOLDER) ? src : fallback;
  const [imgSrc, setImgSrc] = useState(realSrc);

  const handleError = useCallback(() => {
    setImgSrc(fallback);
  }, [fallback]);

  return (
    <img
      src={imgSrc}
      alt={name}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
    />
  );
}`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For catalog image fallback strategies across ecommerce platforms, see the PrestaShop and BigCommerce guides.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/prestashop-image-fallback/
https://fallback.pics/blog/bigcommerce-image-fallback/`,
      },
    ],
    takeaways: [
      "Magento 2 uses a no_selection sentinel and admin-configured placeholder images — detect the placeholder URL path to intercept it in templates.",
      "Upload a better placeholder to Stores > Configuration > Catalog > Product Image Placeholders for the quickest global fix.",
      "In Luma themes, override the product image template to check the resolved URL against the placeholder path prefix.",
      "In Hyvä, use an onerror attribute with the PHP-generated fallback URL to handle both missing and broken images.",
      "In PWA Studio, pass a fallback URL to the ProductImageComponent's onError prop and detect the Magento placeholder path on the src before render.",
    ],
    related: [
      "bigcommerce-image-fallback",
      "prestashop-image-fallback",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 11. prestashop-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "PrestaShop Product Image Fallback for Incomplete Imports",
    description:
      "Handle missing PrestaShop product images during catalog imports and theme templates by substituting generated fallback URLs for the no-image default.",
    slug: "prestashop-image-fallback",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "PrestaShop placeholder image",
      "PrestaShop product image",
      "Catalog import fallback",
      "Ecommerce image fallback",
      "Smarty template",
    ],
    summary: [
      "PrestaShop ships with a default no-image picture located at `img/p/en-default-{format}.jpg`. When a product has no images, the product listing and product page templates render this file. It is a generic placeholder with no product-specific information, and it looks the same for every image-less product in the catalog.",
      "Substituting PrestaShop's default no-image with a generated placeholder URL — one that includes the product name — makes image-less products identifiable and prevents the visual monotony of a catalog filled with identical gray boxes. The change can be made at the Smarty template level or through a PrestaShop override.",
    ],
    sections: [
      {
        eyebrow: "PrestaShop image system",
        title: "How PrestaShop picks a product image",
        body: [
          "PrestaShop stores product images in `img/p/` with a hierarchical directory structure based on the image ID. Each product can have multiple images; the cover image is the one shown in listings. When no cover image is set, `Product::getCover()` returns false, and templates fall back to the language-specific no-image file.",
          "The no-image file is per-language. The default is `en-default-{format_name}.jpg`, where format names like `home_default`, `small_default`, `large_default`, and `thickbox_default` correspond to different resized versions. Each format has its own dimensions configured in the admin.",
          "Bulk imports via the native import tool or third-party modules like StoreCommander often bring text content before media. Products are visible in the store during this window with no image attached.",
        ],
      },
      {
        eyebrow: "Smarty template",
        title: "Override the no-image URL in Smarty templates",
        body: [
          "PrestaShop themes use Smarty. Product listing templates (`catalog/listing/product-list.tpl`, `catalog/product/product.tpl`) build image URLs using the `$product.cover.bySize` variable. When cover is empty, the template falls through to `$urls.no_picture_image.bySize`.",
          "Override the no-image display by checking whether the resolved image URL contains the `no-picture` path segment and substituting a generated fallback. This check works in the template without needing a PHP override.",
        ],
        code: `{* catalog/listing/product-list.tpl override *}
{assign var="img_url" value=$product.cover.bySize.home_default.url|default:''}

{if $img_url && 'no-picture' notin $img_url}
  <img
    src="{$img_url}"
    alt="{$product.name|escape:'html'}"
    width="{$product.cover.bySize.home_default.width}"
    height="{$product.cover.bySize.home_default.height}"
    loading="lazy"
  />
{else}
  {assign var="product_name_enc" value=$product.name|escape:'url'}
  <img
    src="https://fallback.pics/api/v1/350x350?text={$product_name_enc}"
    alt="{$product.name|escape:'html'}"
    width="350"
    height="350"
    loading="lazy"
  />
{/if}`,
      },
      {
        eyebrow: "PHP override",
        title: "Override getCover in a module or PHP override",
        body: [
          "For a more systematic approach, override the `getCoverWs()` static method or write a PrestaShop module that hooks into `actionProductListingResultsModifier` to post-process product image data before it reaches templates. In the hook, replace null or no-image cover entries with a generated fallback URL.",
          "This approach centralizes the fallback logic in one PHP file rather than distributing it across every template partial that renders product images. It also applies to the webservice (API) endpoints, so third-party integrations receive the fallback URL instead of the empty no-image path.",
        ],
        code: `<?php
// modules/yourmodule/yourmodule.php

class YourModule extends Module
{
    public function install()
    {
        parent::install();
        $this->registerHook('actionProductListingResultsModifier');
        return true;
    }

    public function hookActionProductListingResultsModifier(array $params): void
    {
        foreach ($params['products'] as &$product) {
            $cover = $product['cover'] ?? null;
            $url = $cover['bySize']['home_default']['url'] ?? '';
            if (empty($url) || str_contains($url, 'no-picture')) {
                $name = urlencode((string)($product['name'] ?? ''));
                $product['cover']['bySize']['home_default']['url'] =
                    "https://fallback.pics/api/v1/350x350?text={$name}";
            }
        }
    }
}`,
      },
      {
        eyebrow: "Import window",
        title: "Protecting live pages during bulk imports",
        body: [
          "PrestaShop's native product import tool processes rows sequentially. When importing thousands of products, the store is live and indexed by search engines during the import. Products imported before their images are processed will appear with the no-image placeholder for hours or days.",
          "The fallback URL approach means that during this window, product cards show a placeholder with the product name rather than an identical gray box. This is a better user experience and avoids the indexing problems that come with multiple products sharing the same image URL.",
        ],
      },
      {
        eyebrow: "Image format sizes",
        title: "Match fallback dimensions to PrestaShop image formats",
        body: [
          "PrestaShop image formats (`home_default`, `small_default`, `large_default`, `thickbox_default`) have specific dimensions configured in Design > Image Settings. Use those dimensions as the fallback URL dimensions to avoid layout shift when a real image eventually loads.",
          "Common PrestaShop default format dimensions are: small_default 98×98, home_default 250×250, large_default 800×800, thickbox_default 800×800. Verify these in your store's admin since themes can reconfigure them.",
        ],
        code: `// Fallback URLs sized for standard PrestaShop image formats
https://fallback.pics/api/v1/98x98?text=Product+Image     // small_default
https://fallback.pics/api/v1/250x250?text=Product+Image   // home_default
https://fallback.pics/api/v1/800x800?text=Product+Image   // large_default / thickbox`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For cross-platform ecommerce image fallback patterns, see the Magento 2 and BigCommerce guides.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/magento-product-image-placeholder/
https://fallback.pics/blog/shopify-hydrogen-image-fallback/`,
      },
    ],
    takeaways: [
      "PrestaShop uses language-specific no-image files for products without covers — detect the 'no-picture' URL segment in templates.",
      "Override the template using a Smarty conditional that substitutes a generated fallback URL sized to match the image format dimensions.",
      "For global coverage, hook into actionProductListingResultsModifier to replace no-image entries before templates render.",
      "Match fallback URL dimensions to the configured PrestaShop image format sizes (small_default: 98×98, home_default: 250×250).",
      "Deploy fallback logic before starting bulk imports so live pages are protected during the import window.",
    ],
    related: [
      "magento-product-image-placeholder",
      "shopify-hydrogen-image-fallback",
      "product-image-placeholder-ecommerce-catalogs",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 12. shopify-hydrogen-image-fallback
  // ─────────────────────────────────────────────────────────
  {
    title: "Headless Shopify Hydrogen Image Fallbacks with React",
    description:
      "Add image fallbacks to Shopify Hydrogen storefronts when product featuredImage is null, using onError handlers and generated placeholder URLs in React components.",
    slug: "shopify-hydrogen-image-fallback",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "Shopify Hydrogen image",
      "Headless Shopify",
      "Hydrogen React",
      "Product image fallback",
      "Storefront API",
    ],
    summary: [
      "Shopify Hydrogen uses the Storefront API's GraphQL schema, where `Product.featuredImage` is a nullable `Image` type. Products created without images — draft products, imported SKUs, or products awaiting photography — return `featuredImage: null`. A Hydrogen component that accesses `product.featuredImage.url` without a null guard crashes with a TypeError at runtime.",
      "The fix is a utility function and a React component that both check for null and substitute a generated fallback URL. The `@shopify/hydrogen` package's `Image` component accepts a fallback src, but you still need to handle the null case before the component receives data.",
    ],
    sections: [
      {
        eyebrow: "Storefront API types",
        title: "The featuredImage nullable type in Storefront GraphQL",
        body: [
          "Shopify's Storefront API returns product data with `featuredImage: Image | null`. The `Image` type has `url`, `width`, `height`, and `altText` properties. When `featuredImage` is null, accessing any property on it throws a TypeError. TypeScript with strict null checks will flag this at compile time, but JavaScript projects or incorrectly typed GraphQL queries can miss it.",
          "The `images` connection on Product returns all uploaded images. An empty `edges` array here confirms no images exist. Some Hydrogen codebases use `images.edges[0]?.node.url` as an alternative to `featuredImage.url` — both require null safety.",
          "Product variants also have an image field (`ProductVariant.image`). A variant may have its own image or inherit the product's featured image. Null check variant images independently of the product-level fallback.",
        ],
      },
      {
        eyebrow: "GraphQL query",
        title: "Request image dimensions in your fragment",
        body: [
          "Request `width` and `height` alongside `url` in your GraphQL fragment. These values let you pass matching dimensions to the fallback URL, ensuring no layout shift occurs when the fallback renders instead of the real image.",
          "Define a reusable fragment for image fields so dimensions are always included. A missing width or height in the query forces you to hardcode fallback dimensions, which can diverge from the actual image slot.",
        ],
        code: `fragment ProductImageFields on Image {
  url
  altText
  width
  height
}

fragment ProductCard on Product {
  id
  title
  handle
  featuredImage {
    ...ProductImageFields
  }
  priceRange {
    minVariantPrice { amount currencyCode }
  }
}`,
      },
      {
        eyebrow: "Utility function",
        title: "Build a null-safe image URL helper",
        body: [
          "Write a utility that accepts a nullable Storefront API image and the expected dimensions, then returns either the real URL or a fallback URL. Keep the fallback URL deterministic so it is stable for caching and predictable for tests.",
        ],
        code: `// app/lib/product-image.ts
import type { Image } from '@shopify/hydrogen/storefront-api-types';

export function productImageUrl(
  image: Image | null | undefined,
  width: number,
  height: number,
  productTitle = '',
): string {
  if (image?.url) return image.url;
  const label = productTitle
    ? encodeURIComponent(productTitle)
    : \`\${width}×\${height}\`;
  return \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${label}\`;
}`,
      },
      {
        eyebrow: "React component",
        title: "ProductImage component with onError handling",
        body: [
          "Use the utility function for the initial src and an onError handler for network failures after initial render. An onError on a Hydrogen Image component ensures that a product whose image URL returns a 404 (deleted assets, CDN issues) also gets a fallback.",
          "Set onError = null inside the handler to prevent infinite reload loops. If the fallback URL also returns an error, the browser should not keep retrying indefinitely.",
        ],
        code: `// app/components/ProductImage.tsx
import { Image } from '@shopify/hydrogen';
import { productImageUrl } from '~/lib/product-image';
import type { Image as ImageType } from '@shopify/hydrogen/storefront-api-types';

interface ProductImageProps {
  image: ImageType | null | undefined;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ProductImage({
  image,
  title,
  width = 400,
  height = 400,
  className,
}: ProductImageProps) {
  const src = productImageUrl(image, width, height, title);
  const fallbackSrc = \`https://fallback.pics/api/v1/\${width}x\${height}?text=\${encodeURIComponent(title)}\`;

  return (
    <Image
      src={src}
      alt={image?.altText ?? title}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        const target = e.currentTarget;
        target.src = fallbackSrc;
        target.onerror = null;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Variant images",
        title: "Handle variant-level image fallbacks separately",
        body: [
          "Product pages in Hydrogen switch the displayed image when the user selects a different variant. The variant image (`selectedVariant.image`) may be null even when the product has a featured image. Your image component should accept either the variant image or the product featured image, with the generated fallback as the last resort.",
        ],
        code: `// In a product page component
const displayImage =
  selectedVariant?.image ??
  product.featuredImage;

<ProductImage
  image={displayImage}
  title={product.title}
  width={800}
  height={800}
/>`,
      },
      {
        eyebrow: "Cart",
        title: "Line item thumbnails in the Hydrogen cart",
        body: [
          "Hydrogen's cart template renders line item thumbnails. Each line item includes a `merchandise.image` field (nullable). Apply the same utility function to cart thumbnails. Cart thumbnails are smaller — typically 80×80 or 100×100 — so use the square route for simplicity.",
        ],
        code: `// app/components/CartLineItem.tsx
function lineItemImageUrl(line: CartLine): string {
  const image = line.merchandise?.image;
  const title = line.merchandise?.product?.title ?? 'Item';
  if (image?.url) return image.url;
  return \`https://fallback.pics/api/v1/square/80?text=\${encodeURIComponent(title)}\`;
}`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "For React-specific image fallback patterns, the React image fallback patterns guide covers onerror lifecycle, useRef approaches, and the infinite loop prevention pattern in detail.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/react-image-fallback-patterns/
https://fallback.pics/blog/nextjs-image-fallbacks-without-layout-shift/`,
      },
    ],
    takeaways: [
      "Product.featuredImage and ProductVariant.image are nullable in the Storefront GraphQL schema — always null-check before accessing .url.",
      "Request width and height in your image fragment so fallback URLs can be dimension-matched without hardcoding.",
      "Write a productImageUrl utility that returns a fallback.pics URL when the image is null or undefined.",
      "Add an onError handler to the rendered Image component for network failures after initial render, and set onerror = null to prevent infinite loops.",
      "Apply the same utility to cart line item thumbnails — cart is a high-trust surface where broken images affect conversion.",
    ],
    related: [
      "prestashop-image-fallback",
      "react-image-fallback-patterns",
      "nextjs-image-fallbacks-without-layout-shift",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 13. core-web-vitals-cls-missing-images
  // ─────────────────────────────────────────────────────────
  {
    title: "Core Web Vitals: How Missing Images Inflate Your CLS Score",
    description:
      "Understand why missing or slow-loading images inflate Cumulative Layout Shift and how dimension-matched placeholder URLs eliminate the CLS penalty at zero cost.",
    slug: "core-web-vitals-cls-missing-images",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "CLS missing images",
      "Cumulative Layout Shift",
      "Core Web Vitals",
      "Image performance",
      "Layout shift prevention",
    ],
    summary: [
      "Cumulative Layout Shift (CLS) measures how much visible content moves after the browser has rendered it. Images without explicit dimensions are the single most common cause of CLS above the 0.1 threshold. When a browser renders an img tag without width and height attributes, it reserves zero pixels for the element until the image file arrives — at which point everything below the image shifts down.",
      "The fix for dimensionless images is to add width and height attributes, use aspect-ratio CSS, or provide a same-size placeholder URL as the initial src. Any of these three approaches prevents the 0-to-full-height expansion that scores against CLS. Placeholder URLs from fallback.pics are deterministic and cacheable, making them a practical complement to the attribute-based approach.",
    ],
    sections: [
      {
        eyebrow: "How CLS is scored",
        title: "What Google counts as a layout shift",
        body: [
          "CLS accumulates whenever a visible element moves unexpectedly within the viewport after the first input delay or 500ms after the page starts rendering. The score is the sum of individual layout shift scores, where each shift score is the impact fraction (fraction of viewport affected) multiplied by the distance fraction (how far the element moved relative to viewport height).",
          "An image loading late on a page with no reserved space is a textbook CLS event. If the image is 600px tall and the viewport is 800px, the distance fraction is 600/800 = 0.75. If the image is 100% wide (full viewport width), the impact fraction is high. These two factors multiply to create a large layout shift score.",
          "CLS above 0.1 is rated 'Needs Improvement' by Lighthouse and PageSpeed Insights. Above 0.25 is 'Poor'. Both Google Search Console and Chrome User Experience Report (CrUX) track CLS in the field, meaning real user experiences with layout shifts affect your site's Core Web Vitals status in search.",
        ],
      },
      {
        eyebrow: "Root cause",
        title: "Why images without dimensions cause 0-height reserves",
        body: [
          "When the browser parses an `<img>` tag without width and height attributes, it has no way to know the image's dimensions until the file download begins (HTTP headers include dimensions for some formats) or the file is decoded. Modern browsers attempt to infer dimensions from image format headers early in the download, but this is not reliable for all formats or network conditions.",
          "The result is that the browser reserves 0px × 0px for the image element during initial layout. Content below the image renders at the top of the available space. When the image finally loads and expands to its natural dimensions, all subsequent content shifts downward. This is the classic layout shift from images.",
          "CMS-delivered images are particularly prone to this problem because developers do not always know the final image dimensions when writing the template. A product photo could be 600×400 or 1000×700 depending on what the merchandising team uploads. Explicit width and height attributes require knowing the expected aspect ratio.",
        ],
      },
      {
        eyebrow: "Fix 1: attributes",
        title: "Width and height attributes are the primary fix",
        body: [
          "Adding `width` and `height` attributes to `<img>` tags is the most direct CLS fix. These values tell the browser the image's intended display size before any network bytes arrive. The browser can reserve the correct layout space immediately. If you use CSS to make images responsive (e.g., `width: 100%`), browsers from 2019 onward will use the aspect ratio from the attributes to maintain proportional space.",
          "You do not need to know the exact pixel dimensions of every image. You need to know the aspect ratio. A 600×400 image and a 1200×800 image both have a 3:2 aspect ratio. Setting `width=600 height=400` works correctly for both if your CSS constrains the display size.",
        ],
        code: `<!-- Breaks layout: no width/height, browser reserves 0px height -->
<img src="product.jpg" alt="Product" />

<!-- Fixes CLS: browser reserves correct space before image loads -->
<img src="product.jpg" alt="Product" width="600" height="400" />

<!-- Also works: aspect-ratio CSS with a known ratio -->
<style>
  .product-img { aspect-ratio: 3/2; width: 100%; }
</style>
<img class="product-img" src="product.jpg" alt="Product" />`,
      },
      {
        eyebrow: "Fix 2: placeholder URLs",
        title: "Placeholder URLs prevent CLS for async-loaded content",
        body: [
          "Width and height attributes handle CLS for statically known images. For dynamically loaded content — search results, infinite scroll, lazy-loaded cards — there is often a moment when the img src is undefined while the component data is loading. During this moment, an img with no src can cause a 0-height element that causes a layout shift when the real src arrives.",
          "Using a placeholder URL as the initial src while the real URL loads prevents this. The placeholder is served immediately from the CDN, so the browser receives the image dimensions from the response and reserves the correct space. No layout shift occurs when the real image replaces the placeholder.",
          "The tradeoff is a network request for the placeholder URL. For content above the fold, where CLS is most impactful, this request cost is worth the CLS improvement. For below-the-fold content with `loading=lazy`, the request does not fire until the user scrolls, so the impact is minimal.",
        ],
        code: `// React: use placeholder URL while data loads
function ProductCard({ product }) {
  const src = product
    ? product.imageUrl ?? \`https://fallback.pics/api/v1/400x300?text=\${encodeURIComponent(product.name)}\`
    : 'https://fallback.pics/api/v1/400x300?text=Loading';

  return (
    <img
      src={src}
      alt={product?.name ?? 'Loading'}
      width={400}
      height={300}
    />
  );
}`,
      },
      {
        eyebrow: "Fix 3: aspect-ratio CSS",
        title: "The aspect-ratio property for responsive images",
        body: [
          "The CSS `aspect-ratio` property maintains the correct height as the image width changes. Combined with `width: 100%`, it produces an intrinsically sized container that reserves space correctly without knowing pixel dimensions in advance.",
          "Use `aspect-ratio` on a wrapper element or directly on the `<img>` tag. For product grids where all images should be the same ratio, apply `aspect-ratio: 1` (square) or `aspect-ratio: 4/3` at the component level. For article hero images, use `aspect-ratio: 16/9` or your editorial layout ratio.",
          "The tradeoff with pure CSS aspect-ratio (no placeholder URL): the browser reserves the correct space, but the area is blank until the image loads. For above-the-fold hero images, a visible placeholder is better UX than a blank white space. For below-fold content, blank space during lazy loading is acceptable.",
        ],
        code: `/* Universal image CLS prevention */
img {
  aspect-ratio: attr(width) / attr(height); /* Use intrinsic ratio from attributes */
  width: 100%;
  height: auto;
}

/* Grid cards with known 3:4 aspect ratio */
.product-card img {
  aspect-ratio: 3/4;
  width: 100%;
  object-fit: cover;
}

/* Hero image with 16:9 ratio */
.hero-image {
  aspect-ratio: 16/9;
  width: 100%;
  overflow: hidden;
}`,
      },
      {
        eyebrow: "Measurement",
        title: "Measure CLS from images before and after",
        body: [
          "Use Chrome DevTools Performance panel to record a page load and inspect layout shift events. Each shift event shows the impacting element. Images without dimensions appear as the source of shift events with large impact fractions.",
          "Lighthouse in DevTools, PageSpeed Insights, and the Lighthouse CI GitHub Action all report CLS and flag 'Image elements do not have explicit width and height' as a diagnostic item. Fix every flagged image and re-run Lighthouse to confirm the score improves.",
        ],
        code: `# Check CLS with Lighthouse CLI
npx lighthouse https://yoursite.com --only-audits=cumulative-layout-shift,unsized-images

# Monitor CLS in field data
# CrUX API endpoint (replace with your URL):
https://chromeuxreport.googleapis.com/v1/records:queryRecord?key={API_KEY}`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The prevent layout shift guide covers both the image attribute fix and placeholder URL patterns in depth. The LCP optimization guide covers the hero image loading side of Core Web Vitals.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/prevent-layout-shift-missing-images/
https://fallback.pics/blog/lcp-optimization-failed-hero-images/`,
      },
    ],
    takeaways: [
      "Images without width and height attributes reserve 0px height — add explicit attributes or aspect-ratio CSS to every img tag.",
      "A CLS score above 0.1 is 'Needs Improvement'; above 0.25 is 'Poor' — both affect Google Search Core Web Vitals status.",
      "Use placeholder URLs as the initial src for async-loaded content to prevent the shift when real images replace undefined src values.",
      "The CSS aspect-ratio property is a modern complement to attributes — use both for full coverage across old and new browsers.",
      "Measure CLS from images using Lighthouse's 'unsized-images' audit and the Performance panel layout shift events before and after fixes.",
    ],
    related: [
      "prevent-layout-shift-missing-images",
      "lcp-optimization-failed-hero-images",
      "lqip-blur-up-placeholders-layout-shift",
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 14. lcp-optimization-failed-hero-images
  // ─────────────────────────────────────────────────────────
  {
    title: "LCP Optimization Strategies When Hero Images Fail to Load",
    description:
      "Prevent poor LCP scores when hero images fail or load slowly using fetchpriority, rel=preload, and a fast-loading fallback URL as the LCP candidate.",
    slug: "lcp-optimization-failed-hero-images",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "LCP image optimization",
      "Largest Contentful Paint",
      "Hero image performance",
      "fetchpriority",
      "Core Web Vitals",
    ],
    summary: [
      "The Largest Contentful Paint element on most pages is the hero image. When that image fails to load — due to a 404, a slow CDN response, or a null src — the browser must find another LCP candidate. The fallback candidate is often text, which typically appears much later in the render timeline, resulting in a poor LCP score above 2.5 seconds.",
      "Defending your LCP against hero image failures requires two things: a fast, reliable fallback that serves as an acceptable LCP candidate, and correct priority signals so the browser fetches the hero aggressively. A generated placeholder URL served from a CDN with correct Cache-Control headers can function as the LCP element when the primary image is unavailable.",
    ],
    sections: [
      {
        eyebrow: "LCP and the hero image",
        title: "Why the hero image dominates your LCP score",
        body: [
          "LCP is measured from navigation start to when the browser paints the largest visible content element. Above-the-fold images are almost always the LCP element because text, buttons, and other content are smaller. A hero image covering 60–80% of the viewport at load time will be the LCP candidate on most page views.",
          "When the hero image is not painted — because the src is null, the network request fails, the image returns 404, or the server is slow — the browser falls back to the next-largest painted element. That is usually a text heading or a content section below the hero. Text renders at a different time in the loading timeline than images, often shifting the LCP timestamp significantly.",
          "LCP above 2.5 seconds is rated 'Needs Improvement'. Above 4 seconds is 'Poor'. Both thresholds affect Core Web Vitals assessments in Google Search Console and the Chrome User Experience Report (CrUX), which reflect real user experiences rather than lab data.",
        ],
      },
      {
        eyebrow: "fetchpriority",
        title: "Signal the hero image priority to the browser",
        body: [
          "By default, the browser discovers images during HTML parsing and assigns them a fetch priority based on whether they are in the viewport. Above-the-fold images typically receive 'High' priority, but the browser does not know they are above the fold until after it has parsed enough of the document to calculate layout. This can delay the priority assignment.",
          "The `fetchpriority=\"high\"` attribute on the hero image tells the browser to fetch it at high priority immediately, without waiting for layout calculation. Combine this with `loading=\"eager\"` to ensure the image is not deferred. Add a `<link rel=\"preload\" as=\"image\">` tag in the `<head>` for the most aggressive preloading.",
        ],
        code: `<!-- Hero image with explicit fetch priority -->
<img
  src="https://example.com/hero.jpg"
  fetchpriority="high"
  loading="eager"
  decoding="async"
  width="1200"
  height="600"
  alt="Product hero"
/>

<!-- Preload in <head> for even earlier discovery -->
<link
  rel="preload"
  as="image"
  href="https://example.com/hero.jpg"
  imagesrcset="https://example.com/hero-800.jpg 800w,
               https://example.com/hero-1200.jpg 1200w"
  imagesizes="100vw"
/>`,
      },
      {
        eyebrow: "Fallback URL as LCP candidate",
        title: "Use a fast fallback URL when the real hero fails",
        body: [
          "When a hero image src is null, undefined, or returns a 404, the browser cannot paint the LCP element. Providing a fast-loading fallback URL as the initial src — while the real image resolves — gives the browser a valid LCP candidate to paint on schedule.",
          "A generated SVG placeholder from fallback.pics is served from Cloudflare's CDN. The response is fast (sub-50ms from most locations), cacheable, and does not require any file storage. As the LCP candidate, it paints quickly and keeps the LCP metric on track even when the real image is unavailable.",
          "This is different from a loading state placeholder. For LCP purposes, you want the fallback to be a valid, visible element that the browser can commit to painting. An SVG with correct dimensions and a label is that element. The tradeoff: if the real image loads quickly, there may be a brief flash of the placeholder before the real image replaces it. For LCP optimization, this tradeoff is acceptable.",
        ],
        code: `// Next.js: hero with fallback and fetchpriority
import Image from 'next/image';

const FALLBACK_HERO = 'https://fallback.pics/api/v1/1200x600?text=Loading';

export function HeroImage({ src, alt }) {
  const [imgSrc, setImgSrc] = React.useState(src || FALLBACK_HERO);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={1200}
      height={600}
      priority // Next.js equivalent of fetchpriority=high + preload
      onError={() => setImgSrc(FALLBACK_HERO)}
    />
  );
}`,
      },
      {
        eyebrow: "onerror and null src",
        title: "Handling null src and network errors separately",
        body: [
          "Two distinct failure modes need separate handling: a null or undefined src (the image was never set), and a network error on a valid src (CDN outage, deleted asset, 404 response). A null src renders no request at all — the browser paints nothing, and the LCP element is not the hero. A failed network request fires the onerror event, which you can intercept.",
          "For null src, substitute the fallback URL before the component renders. For failed network requests, use an onerror handler. Both cases require setting onerror = null after the first fallback to prevent an infinite retry loop if the fallback URL itself returns an error.",
        ],
        code: `// Vanilla JS: handles both null src and network failures
function mountHeroImage(containerEl, src, alt) {
  const fallback = 'https://fallback.pics/api/v1/1200x600?text=Hero+Image';
  const img = document.createElement('img');
  img.src = src || fallback;
  img.alt = alt;
  img.width = 1200;
  img.height = 600;
  img.fetchPriority = 'high';
  img.loading = 'eager';
  img.onerror = function () {
    this.src = fallback;
    this.onerror = null; // prevent infinite loop
  };
  containerEl.appendChild(img);
}`,
      },
      {
        eyebrow: "CMS and API sources",
        title: "Hero images from CMS APIs are high-risk LCP candidates",
        body: [
          "When a hero image URL comes from a CMS API response — Contentful, Sanity, Strapi, or a headless Shopify storefront — the URL depends on both the API call succeeding and the image field being populated. Both can fail independently of each other.",
          "Pre-compute a fallback URL during the data-fetching phase, before the component renders. This way the component always has a valid src from the first render. You avoid the double-render (first with null, then with the real URL) that causes a layout shift and a delayed LCP paint.",
        ],
      },
      {
        eyebrow: "Measurement",
        title: "Verify LCP improvements with Lighthouse and WebPageTest",
        body: [
          "Run Lighthouse before and after your hero image changes to verify LCP improvement. PageSpeed Insights shows both lab data (simulated) and field data (from CrUX). Field data reflects real user experiences and updates over a rolling 28-day window, so changes take time to appear there.",
          "WebPageTest's filmstrip view is useful for identifying exactly when the LCP element paints. You can see whether the hero image, the fallback, or a text element is the LCP candidate at each step of the waterfall. This is more diagnostic than a single LCP number.",
        ],
        code: `# Lighthouse CLI for LCP measurement
npx lighthouse https://yoursite.com --only-audits=largest-contentful-paint,render-blocking-resources,uses-optimized-images

# Check which element is the LCP candidate in DevTools:
# Performance panel > LCP marker > select event > Initiator shows the element`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading",
        body: [
          "The CLS missing images guide covers the layout-shift side of Core Web Vitals. The lazy loading guide covers below-the-fold image performance. For hero image placeholder aesthetics, see the LQIP and blur-up guide.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/core-web-vitals-cls-missing-images/
https://fallback.pics/blog/prevent-layout-shift-missing-images/`,
      },
    ],
    takeaways: [
      "The hero image is the LCP element on most pages — a failed hero shifts the LCP candidate to text, often doubling the LCP time.",
      "Add fetchpriority='high' and loading='eager' to hero images, plus a <link rel=preload> in <head> for the most aggressive loading.",
      "Use a fast-loading fallback URL as the initial src when the hero image src is null to keep the LCP element valid from first render.",
      "Handle null src and network errors separately: substitute the fallback before render for null, and use onerror for network failures.",
      "Measure LCP improvements with Lighthouse and WebPageTest filmstrip before deploying — field data via CrUX takes 28 days to update.",
    ],
    related: [
      "core-web-vitals-cls-missing-images",
      "prevent-layout-shift-missing-images",
      "lazy-loading-images-placeholder-fallbacks",
    ],
  },
];
