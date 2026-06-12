import type { BlogPost } from '../blogPosts';

export const backlogBatch07: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    title: "API Reference Open Graph Images for Developer Portals",
    description:
      "Generate consistent api documentation og image URLs for every endpoint page in your developer portal without manual uploads or a design tool.",
    slug: "api-reference-og-image-fallbacks",
    readTime: "8 min read",
    category: "Content Workflows",
    tags: [
      "api documentation og image",
      "developer portal",
      "Open Graph",
      "OG image fallback",
      "API docs SEO",
    ],
    summary: [
      "Every endpoint page in a developer portal is a potential social share: a Slack message, a Reddit thread, a bookmark. Without a proper api documentation og image, those shares render the blank-card preview that signals an abandoned site to everyone who sees it.",
      "Generating deterministic OG images from the endpoint name, HTTP method, and category avoids the upload-per-page workflow that never actually happens. This guide shows the URL patterns, the meta tag wiring, and the platform-specific quirks for Readme, Stoplight, and custom-built portals.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why API documentation og images are always missing",
        body: [
          "API reference pages are generated, not authored. Stoplight reads an OpenAPI spec; Readme pulls from a YAML file; custom portals render from a database of endpoints. None of those pipelines has a step that says 'attach an OG image.' The result is that every endpoint page either inherits a single site-wide OG image or serves no image at all.",
          "A single site-wide image is slightly better than nothing, but it breaks the expectation that a shared link preview reflects the content of the page. When someone pastes a link to your POST /users/invite endpoint in a Slack channel, the preview should signal authentication and user management, not your company logo on a white background.",
          "Manual uploads are the wrong fix. A realistic API reference has hundreds of endpoints. No documentation team maintains OG images for each one. The right fix is a URL-based generation strategy that derives the image from data already present on the page.",
        ],
      },
      {
        eyebrow: "URL pattern",
        title: "Deriving api documentation og image URLs from endpoint metadata",
        body: [
          "The fallback.pics thumbnail route accepts text, a background color, and a label parameter. For an API reference page, you have three pieces of data: the HTTP method (GET, POST, DELETE), the path (/users/{id}), and the category (Authentication, Billing). Those three fields are enough to produce a meaningful OG image.",
          "The text parameter should carry the endpoint path. The label parameter adds a secondary line. Pick a background color per HTTP method: green for GET, blue for POST, orange for PATCH, red for DELETE. This produces visually distinct previews without any design work.",
        ],
        code: `<!-- HTML meta tags for an endpoint page -->
<!-- POST /users/invite in the Authentication category -->
<meta property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630
    ?text=POST+%2Fusers%2Finvite
    &label=Authentication
    &theme=purple
    &style=soft" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Method-colored variants -->
<!-- GET  → theme=green  -->
<!-- POST → theme=purple -->
<!-- DELETE → theme=red  -->`,
      },
      {
        eyebrow: "Platform wiring",
        title: "Injecting OG tags in Readme, Stoplight, and custom portals",
        body: [
          "Readme supports custom HTML in the page head via the 'Custom HTML' setting in your project's Appearance tab. Paste a script tag that reads the page URL, extracts the endpoint slug, and writes the og:image meta tag dynamically. The script runs client-side but most crawlers including Slack's unfurler and Google's crawler execute JavaScript, so this works.",
          "Stoplight Studio lets you add a custom header template to your published docs. Inject the meta tag derivation logic there. For Docusaurus or VitePress-based portals, add the logic in the site config's head array or in a custom layout component that receives the page frontmatter.",
          "Custom portals built with Next.js or Astro can generate the OG URL server-side and inject it cleanly into the document head with no JavaScript required. This is the most reliable approach because the tag is present in the initial HTML before any crawler starts parsing.",
        ],
        code: `// Next.js API reference page — generateMetadata
export async function generateMetadata({ params }) {
  const endpoint = await fetchEndpoint(params.slug);
  const methodColor = { GET: 'green', POST: 'purple',
    PATCH: 'orange', DELETE: 'red' }[endpoint.method] ?? 'blue';

  const ogImage =
    \`https://fallback.pics/api/v1/thumbnail/1200x630\` +
    \`?text=\${encodeURIComponent(endpoint.method + ' ' + endpoint.path)}\` +
    \`&label=\${encodeURIComponent(endpoint.category)}\` +
    \`&theme=\${methodColor}&style=soft\`;

  return {
    openGraph: {
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  };
}`,
      },
      {
        eyebrow: "Caching",
        title: "CDN caching keeps generated images fast and free",
        body: [
          "Because the OG image URL is derived entirely from the endpoint metadata and contains no user-specific data, it is safe to cache at the CDN layer indefinitely. fallback.pics returns Cache-Control: public, max-age=31536000, immutable on all generated images. Cloudflare and other CDNs will serve subsequent requests for the same URL from edge cache with no origin hit.",
          "When endpoint metadata changes (a renamed path or a new category label), update the URL parameters and the old cached image is simply no longer referenced. There is no cache invalidation step. This is the same immutable-URL strategy used by fingerprinted static assets.",
        ],
      },
      {
        eyebrow: "Testing",
        title: "Validate OG images in Slack, LinkedIn, and Google before launch",
        body: [
          "Slack's link preview fetches og:image at share time and caches the result for several days. Use the Slack API's unfurl.links endpoint or paste the URL into a test channel to see the preview before announcing your portal. If the image does not appear, check that the meta tag is in the initial server-rendered HTML, not injected by client-side JavaScript after page load.",
          "LinkedIn's Post Inspector at linkedin.com/post-inspector/ re-fetches the page and shows exactly what the crawler found. Google Search Console's URL Inspection tool shows whether Googlebot saw the og:image tag. Run both after launch and any time you change the URL pattern.",
        ],
      },
      {
        eyebrow: "Spec compliance",
        title: "Meeting the minimum image spec for all major platforms",
        body: [
          "1200×630 pixels at 1:1.91 aspect ratio is the baseline that satisfies Facebook, LinkedIn, Slack, and Discord simultaneously. Twitter/X requires a 2:1 ratio (1200×600) for large cards; if you want Twitter large cards you need a separate image or a crop. The simplest approach is 1200×630 for everything and accept that Twitter will show a summary card.",
          "Minimum file size requirements are rarely a concern for generated SVG or raster images from a CDN. The constraint that does bite is image accessibility behind authentication. OG crawlers do not send session cookies, so if your API portal is behind a login wall, the og:image URL must be publicly accessible even if the page content is not.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading on OG images and API documentation",
        body: [
          "The fallback.pics API reference covers all thumbnail parameters, color themes, and text encoding rules. The blog post on OG image placeholders covers the full tag structure for articles and products.",
        ],
        code: `# API docs and related posts
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/documentation-hero-image-fallbacks/`,
      },
    ],
    takeaways: [
      "API reference pages almost never have OG images because the pipeline is generated, not authored — fix this with URL-derived thumbnails.",
      "Encode the HTTP method, endpoint path, and category into the og:image URL to produce visually distinct previews per endpoint.",
      "Inject the meta tag server-side so crawlers see it in initial HTML, not after JavaScript execution.",
      "Generated image URLs are immutable and CDN-cached indefinitely — no upload workflow, no cache invalidation.",
      "Validate with Slack's test channel, LinkedIn's Post Inspector, and Google's URL Inspection tool after launch.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "documentation-hero-image-fallbacks",
      "changelog-header-image-from-text",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    title: "Email Newsletter Hero Image Fallbacks (No Upload Required)",
    description:
      "Skip the upload workflow and generate newsletter hero image URLs from your subject line text, brand color, and issue number instead.",
    slug: "email-newsletter-hero-fallbacks",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "newsletter hero image",
      "email image fallback",
      "HTML email",
      "Mailchimp placeholder",
      "email design",
    ],
    summary: [
      "A newsletter hero image is the first thing a subscriber sees after the pre-header text. When it fails to load or was never set, the email starts with a blank block that pushes the actual content down and erodes trust in the send. The newsletter hero image problem is worse in text-only drafts where contributors forget to attach a header graphic before hitting send.",
      "URL-based hero generation means you can define the hero image once in your template as a formula, not as a file to upload per issue. The image updates automatically when the subject line changes, requires no design tool, and works in every email client that loads external images.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why newsletter hero images break and what the fallback looks like",
        body: [
          "Newsletter hero images break in three ways: the image file was never uploaded before the draft was scheduled, the hosting domain goes offline between draft and delivery, or the subscriber's email client blocks all external images by default. The first failure is the most common and the most avoidable.",
          "When the hero image fails, most email clients render an alt-text string inside a broken-image box. The box height collapses to about 16px of text. The visual impact is dramatic: the email goes from having a bold branded header to looking like a plain-text message with an error at the top.",
          "A URL-based fallback image does not solve the blocked-images case (no external image loads there), but it eliminates the 'forgot to upload' case entirely and ensures that any subscriber whose client loads external images sees something intentional rather than a broken box.",
        ],
      },
      {
        eyebrow: "URL pattern",
        title: "Building newsletter hero image URLs from subject line data",
        body: [
          "The fallback.pics banner route accepts width, height, text, and color parameters. For a newsletter hero, use the issue subject or a short version of it as the text parameter. Use your brand's primary hex color as the background. The result is a hero image that reflects the content of each issue without any file management.",
          "Encode the text parameter carefully. Email platforms URL-encode template variables when inserting merge tags into HTML, which can double-encode your query string. Test with a hard-coded URL first, then replace the text value with your platform's merge tag for the email subject.",
        ],
        code: `<!-- Mailchimp HTML email hero block -->
<img
  src="https://fallback.pics/api/v1/banner/600x200?text=Issue+%2342%3A+The+State+of+Web+Performance&style=soft&theme=purple"
  width="600"
  height="200"
  alt="Issue #42: The State of Web Performance"
  style="display:block;border:0;"
/>

<!-- With Mailchimp merge tag for subject line -->
<img
  src="https://fallback.pics/api/v1/banner/600x200?text=*|SUBJECT|*&theme=purple"
  width="600"
  height="200"
  alt="*|SUBJECT|*"
  style="display:block;border:0;"
/>`,
      },
      {
        eyebrow: "Dimensions",
        title: "Correct hero image widths for email clients and mobile",
        body: [
          "The standard single-column email template is 600px wide. Desktop email clients display images at full 600px. Mobile clients scale the image down to fit the viewport, which is typically 375-430px wide. Use a 2× height for the image you want displayed: if you want a 100px-tall hero on desktop, request 200px height from the API so it renders at a sensible size on high-DPI screens.",
          "Multi-column layouts reduce the available width. A two-column layout at 600px total gives 280px per column after padding. Size hero images for the container they sit in, not for the email width. Always include explicit width and height attributes on the img element so the layout does not shift when the image loads.",
        ],
      },
      {
        eyebrow: "Platform integration",
        title: "Wiring hero fallbacks in Mailchimp, ConvertKit, and Beehiiv",
        body: [
          "Mailchimp's drag-and-drop builder does not support arbitrary img src URLs in the visual editor, but the HTML editor does. Use the 'Edit HTML' mode for header blocks and paste the fallback.pics URL directly. Mailchimp does not rewrite external image URLs, so the URL arrives in the subscriber's inbox as you wrote it.",
          "ConvertKit's template editor accepts raw HTML in its content blocks. Beehiiv provides a 'Custom HTML' block. In both cases, paste the img tag with the generated URL. Ghost newsletters, Substack does not support custom HTML in the body, so URL-based images are only an option in email templates you control end-to-end.",
          "For newsletters sent via SMTP (Postmark, SendGrid, AWS SES with your own templates), the img tag goes directly into the HTML template. Use your templating language to insert the post title or subject into the text parameter.",
        ],
        code: `<!-- Postmark HTML template (Handlebars) -->
<img
  src="https://fallback.pics/api/v1/banner/600x200
    ?text={{subject}}
    &theme=purple&style=soft"
  width="600"
  height="200"
  alt="{{subject}}"
  style="display:block;max-width:100%;border:0;"
/>`,
      },
      {
        eyebrow: "Testing",
        title: "Checking hero images across Gmail, Outlook, and Apple Mail",
        body: [
          "Use Litmus or Email on Acid to preview the template across clients before sending. Pay attention to Outlook 2016-2019 on Windows, which uses the Word rendering engine and ignores max-width: 100% on images. Set explicit width attributes in pixels on every img element. Outlook also strips CSS background images, so do not use the URL as a CSS background-image; use an img tag.",
          "Gmail on Android and iOS caches externally hosted images via Google's image proxy. The URL is rewritten to a googleapis.com proxy URL on first load and cached for subsequent opens. This means the image that loads in Gmail may be a cached version if the subscriber has opened the email before. Test by sending to a fresh Gmail account.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Docs, related posts, and the full banner API reference",
        body: [
          "The fallback.pics banner and thumbnail routes support additional parameters including label, font size adjustments, and style presets. Read the API reference for the full parameter list.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/email-images-blocked-placeholders/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "URL-based hero images eliminate the 'forgot to upload' failure mode that causes broken email headers.",
      "Use the subject line or issue title as the text parameter to produce issue-specific hero images without design work.",
      "Always set explicit width and height attributes on email img elements to prevent layout shifts in Outlook.",
      "Test with Litmus or Email on Acid before sending to catch Outlook-specific rendering issues.",
      "Gmail proxies external images via its own CDN; test with a fresh account to see the first-load experience.",
    ],
    related: [
      "email-images-blocked-placeholders",
      "transactional-email-product-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    title: "Why Email Clients Block Images and What to Use Instead",
    description:
      "Email images blocked by default in Outlook and Gmail means your design relies on invisible assets. Here is what still works and how to plan for it.",
    slug: "email-images-blocked-placeholders",
    readTime: "8 min read",
    category: "Content Workflows",
    tags: [
      "email images blocked",
      "email client image loading",
      "HTML email",
      "email alt text",
      "email design fallback",
    ],
    summary: [
      "Most desktop email clients block external images by default, including Outlook on Windows and many corporate Gmail environments. When images are blocked, your email renders with empty boxes and alt text strings. If your layout depends on images to convey meaning, blocked-image rendering breaks the email's message entirely.",
      "Understanding which clients block images and why changes how you design the fallback state. The goal is not to make blocked images invisible — it is to make the email readable and persuasive even when no images load.",
    ],
    sections: [
      {
        eyebrow: "Which clients block",
        title: "Email clients that block images by default in 2026",
        body: [
          "Outlook 2016, 2019, and 2021 on Windows block all external images until the user clicks 'Download Pictures.' This setting is on by default and affects corporate environments where IT policy enforces it. Outlook 365 in the desktop app follows the same behavior. Outlook on the web (OWA) loads images by default.",
          "Gmail on Android and iOS loads images automatically via Google's image proxy cache. Desktop Gmail in a browser loads images. The corporate exception is Google Workspace accounts where the administrator has configured an image proxy policy — these rarely block images outright.",
          "Apple Mail on macOS and iOS loads images with Mail Privacy Protection enabled, but the images load via Apple's proxy, not the user's IP. This means images appear to load for tracking purposes while actual user location is masked. Thunderbird blocks remote images by default. Yahoo Mail and Outlook.com (web) load images.",
        ],
        cards: [
          {
            title: "Blocks by default",
            body: "Outlook 2016/2019/2021 (desktop), Thunderbird, some Lotus Notes environments.",
          },
          {
            title: "Loads via proxy",
            body: "Gmail (Google proxy), Apple Mail (Apple Privacy Relay) — images load but IP is hidden.",
          },
          {
            title: "Loads directly",
            body: "Outlook.com (web), Yahoo Mail, Gmail in browser without Workspace policy.",
          },
        ],
      },
      {
        eyebrow: "Impact",
        title: "What blocked images do to your email layout",
        body: [
          "When images are blocked in Outlook, the img element renders as a box with the dimensions you specified (if you specified them) or as a collapsed 16px-tall line. If you used images for spacing, the layout shifts. If the hero image was full-width and 200px tall, Outlook shows an empty 600×200 box with a broken-image icon in the corner.",
          "Buttons built from images break completely. The call-to-action becomes invisible. This is why HTML email best practice has recommended VML buttons for Outlook since the early 2010s. Any essential content that lives inside an image — product names, prices, CTA copy — is invisible to users who block images.",
          "The blocked-image state is not an edge case. In corporate B2B email campaigns, Outlook-on-Windows open rates can represent 30-40% of your audience depending on industry. Designing only for the images-loaded state means designing for less than the full audience.",
        ],
      },
      {
        eyebrow: "Alt text",
        title: "Writing alt text that carries the message when images are blocked",
        body: [
          "Alt text in email is not just for accessibility — it is the content that blocked-image users see. Write alt text as if it is the only thing the subscriber will read. For a hero image showing a product launch announcement, alt='Image' is useless. Alt='Announcing the new API dashboard — live today' carries the message.",
          "Outlook renders alt text in the default system font inside the broken-image box. You can style it with the font attributes on the img element, but support is inconsistent. The more reliable approach is to never put essential information exclusively inside an image. Use HTML text for headlines and CTAs, and use images only as visual reinforcement.",
        ],
        code: `<!-- Alt text that carries meaning -->
<img
  src="https://fallback.pics/api/v1/banner/600x200
    ?text=Announcing+the+new+API+dashboard&theme=purple"
  width="600"
  height="200"
  alt="Announcing the new API dashboard — live today"
  style="display:block;border:0;"
/>

<!-- Use HTML text for critical CTA, not an image button -->
<table>
  <tr>
    <td bgcolor="#7C3AED" style="border-radius:4px;padding:12px 24px;">
      <a href="https://app.example.com" style="color:#fff;text-decoration:none;font-weight:600;">
        Open Dashboard
      </a>
    </td>
  </tr>
</table>`,
      },
      {
        eyebrow: "Design strategy",
        title: "Designing email layouts that work with and without images",
        body: [
          "The safe email design pattern puts all informational content in HTML text and uses images only for brand personality and visual polish. The hero image sets the tone but the headline below it carries the message. The product photo is nice to have but the product name, price, and CTA are plain HTML.",
          "Background colors on table cells are a reliable fallback for images in layout-critical areas. A purple table cell with white HTML text reads well even when the background image on that cell fails to load. Test your email in Outlook's image-blocking mode before sending to see exactly what blocked-image subscribers experience.",
          "For transactional emails (order confirmations, password resets), the content is functional rather than persuasive, so blocked images matter less. For marketing emails, especially those promoting visual products like apparel or furniture, blocked images can significantly reduce the email's effectiveness.",
        ],
      },
      {
        eyebrow: "URL-based images",
        title: "When URL-based placeholder images help in email",
        body: [
          "URL-based images from fallback.pics do not solve the blocked-images problem because they are still external images. What they do solve is the 'image never uploaded' problem and the 'hosting domain went down' problem. They also produce correct dimensions reliably, which matters for Outlook's broken-image box rendering.",
          "When you specify a fallback.pics URL in the img src, you know the URL will return a valid image at the exact dimensions you requested. The broken-image box in Outlook will have the correct size, and the alt text will be displayed at those dimensions rather than collapsing. This is marginally better than a 404 response from a deleted S3 object.",
        ],
      },
      {
        eyebrow: "Testing",
        title: "Simulating blocked images during development",
        body: [
          "In Outlook on Windows, go to File → Options → Trust Center → Trust Center Settings → Automatic Download and check 'Don't download pictures automatically.' This simulates the default corporate experience. Check the email in this mode before every campaign send.",
          "In Litmus and Email on Acid, image blocking previews are available as a rendering variant alongside regular previews. Set blocked-images as a required test case in your QA checklist. Thunderbird's image blocking is in Preferences → Privacy → Block remote content.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Further reading on HTML email image handling",
        body: [
          "See the related post on newsletter hero fallbacks for the URL generation patterns. The transactional email post covers order confirmation image fallbacks specifically.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/email-newsletter-hero-fallbacks/
https://fallback.pics/blog/transactional-email-product-fallbacks/`,
      },
    ],
    takeaways: [
      "Outlook 2016-2021 on Windows blocks external images by default — this affects a significant share of B2B email audiences.",
      "Write alt text as a content fallback, not a description: it must carry the message when images are invisible.",
      "Never put essential CTA copy or prices inside images; use HTML text with VML buttons for Outlook compatibility.",
      "Background colors on table cells are a reliable visual fallback for layout areas that rely on images.",
      "Test blocked-image rendering in Outlook and Thunderbird before every campaign send.",
    ],
    related: [
      "email-newsletter-hero-fallbacks",
      "transactional-email-product-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    title: "Transactional Email Product Image Fallbacks for Receipts",
    description:
      "Handle transactional email images that fail to load in order receipts and shipping notifications without breaking the email layout.",
    slug: "transactional-email-product-fallbacks",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "transactional email images",
      "order confirmation email",
      "email product image",
      "ecommerce email",
      "email image fallback",
    ],
    summary: [
      "Transactional emails — order confirmations, shipping notifications, and return receipts — pull product images dynamically from a catalog API or CDN at send time. When those images are unavailable (deleted SKU, CDN outage, image processing backlog), the email renders with broken-image icons next to the product name and price.",
      "Unlike marketing emails, transactional emails have a functional job: confirm what was ordered. A missing product image is a trust signal failure right at the moment the customer needs confidence. A deterministic fallback that renders the product name inside a placeholder image keeps the email intact when the product photo is unavailable.",
    ],
    sections: [
      {
        eyebrow: "Failure modes",
        title: "Why transactional email images fail at scale",
        body: [
          "Transactional emails are sent immediately after a customer action. The email system queries the product catalog for images at send time or templates them from data available in the order object. If the product was recently added and the image has not finished processing through the CDN pipeline, the URL exists but returns a 404 or an incomplete image.",
          "Deleted products present a similar problem. A return confirmation email generated weeks after the original order references an image that may have been removed from the catalog when the SKU was retired. The product name and SKU exist in the order database but the image URL is stale.",
          "CDN origin pull failures during traffic spikes cause transient 502 or 503 responses for image URLs. These are temporary but email clients do not retry image loads. The first render the subscriber sees is what they get.",
        ],
      },
      {
        eyebrow: "Fallback pattern",
        title: "Generating product image fallbacks from SKU and product name",
        body: [
          "Use the product name as the text parameter in a fallback.pics square or thumbnail URL. Set the dimensions to match the product image container in your email template. Most order receipt templates use 80×80 or 100×100 pixel product thumbnails in a line-item table.",
          "The product category or brand makes a useful label parameter when it is available in the order data. For returns, the order number provides a secondary identifier. Encode the text values before inserting them into the URL to handle product names with ampersands, slashes, and special characters.",
        ],
        code: `<!-- Order receipt line item row -->
<!-- Product image with fallback URL as onerror is not reliable in email -->
<!-- Instead: use the fallback URL directly if product image might be missing -->

<!-- Option A: Check image URL at template render time (server-side) -->
{% set product_image = order.line_items[0].image_url
   if order.line_items[0].image_url
   else "https://fallback.pics/api/v1/square/100?text="
        + order.line_items[0].name | urlencode %}

<img
  src="{{ product_image }}"
  width="100"
  height="100"
  alt="{{ order.line_items[0].name }}"
  style="display:block;border:0;border-radius:4px;"
/>

<!-- Option B: Always use fallback.pics, swap to product image if available -->
<!-- Check at send time in your email service worker -->`,
      },
      {
        eyebrow: "Server-side check",
        title: "Validate image URLs before inserting them into email templates",
        body: [
          "The most reliable approach is to verify image availability at template render time on the server, before sending. Make a HEAD request to the product image URL and fall back to the generated URL if the response is not 200. This adds latency to your send pipeline but eliminates broken images completely.",
          "For high-volume transactional sends where HEAD request latency is unacceptable, use a pre-send image validation queue. When an order is placed, a background job fetches and validates all product images and stores a resolved-URL list in the order record. The email template reads from the resolved list instead of the raw catalog URLs.",
        ],
        code: `// Node.js send-time image validation
async function resolveProductImage(catalogUrl, productName, size = 100) {
  try {
    const res = await fetch(catalogUrl, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    if (res.ok) return catalogUrl;
  } catch {
    // timeout or network error — use fallback
  }
  return \`https://fallback.pics/api/v1/square/\${size}?text=\${encodeURIComponent(productName)}\`;
}

// Usage in order confirmation builder
const lineItemImages = await Promise.all(
  order.lineItems.map((item) =>
    resolveProductImage(item.imageUrl, item.name, 100)
  )
);`,
      },
      {
        eyebrow: "Platform patterns",
        title: "Shopify, WooCommerce, and custom platform implementations",
        body: [
          "Shopify's transactional email templates (Order Confirmation, Shipping Confirmation) use Liquid and pull line item images from the product object. Access {{ line_item.image | img_url: '100x100' }}. If the image is nil, Shopify renders nothing. Add a Liquid conditional: {% if line_item.image %}...{% else %}<img src=\"https://fallback.pics/api/v1/square/100?text={{ line_item.title | url_encode }}\">{% endif %}.",
          "WooCommerce sends transactional emails through PHP templates. The wc_get_template function renders order-details.php. Edit the line item image section to check wp_get_attachment_image_src and fall back to a fallback.pics URL when it returns false. Override the template in your theme's woocommerce/ directory to preserve the change across plugin updates.",
          "Custom platforms using Postmark or SendGrid templates can pass the resolved image URL (or the fallback URL) as a template variable. The fallback logic lives in your order processing code, not in the email template itself, which is cleaner and easier to test.",
        ],
      },
      {
        eyebrow: "Dimensions",
        title: "Standard product thumbnail sizes for email line items",
        body: [
          "Most email templates built on MJML or hand-coded HTML use 80×80 or 100×100 for line-item product thumbnails. Shopify's default order template uses 64×64. The Container width for a single-column order confirmation is 600px, so the product image column is typically 100-120px and the text column fills the rest.",
          "For higher-end fashion or furniture brands, some templates use a wider image column at 150×150 or even 200×200. Match your fallback image dimensions to your template's img width and height attributes precisely. A mismatch in dimensions produces a layout shift when the fallback loads.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related posts and API documentation",
        body: [
          "The post on cart thumbnail fallbacks covers similar patterns for in-app checkout interfaces. The email images blocked post covers the broader context of email image rendering.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/cart-thumbnail-image-fallback/
https://fallback.pics/blog/email-images-blocked-placeholders/`,
      },
    ],
    takeaways: [
      "Transactional emails fail at moments of high customer trust — order confirmations with broken images undermine confidence immediately.",
      "Validate product image URLs server-side before inserting them into the email template to eliminate broken images before send.",
      "Use the product name as the text parameter in a fallback.pics square URL to produce a readable placeholder at catalog thumbnail dimensions.",
      "Shopify and WooCommerce both support template overrides where you can add Liquid or PHP fallback logic without touching core files.",
      "Match fallback image dimensions to your template's img attributes exactly to prevent layout shifts when the fallback loads.",
    ],
    related: [
      "email-newsletter-hero-fallbacks",
      "email-images-blocked-placeholders",
      "cart-thumbnail-image-fallback",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    title: "RSS Feeds and Podcast Cover Art Image Placeholders",
    description:
      "Generate podcast cover placeholder images and RSS feed thumbnails from text when cover art files are missing or pending approval.",
    slug: "rss-podcast-cover-placeholders",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "podcast cover placeholder",
      "RSS feed image",
      "podcast art requirements",
      "iTunes artwork",
      "feed thumbnail",
    ],
    summary: [
      "Podcast directories — Apple Podcasts, Spotify, Google Podcasts — require artwork before approving a new show. If your cover art is not ready or fails Apple's technical validation, your podcast submission is rejected and you cannot launch until you supply a compliant image. A placeholder that meets the minimum spec unblocks the submission while you finalize the real artwork.",
      "RSS feed readers also display channel and item-level thumbnails from the image tags in the feed. When those images are missing or return errors, feed readers show broken-image icons beside every episode. A URL-based placeholder image keeps the feed presentable and the metadata complete.",
    ],
    sections: [
      {
        eyebrow: "Requirements",
        title: "Apple Podcasts and Spotify artwork spec for podcast cover placeholder",
        body: [
          "Apple Podcasts requires artwork between 1400×1400 and 3000×3000 pixels, square aspect ratio, in JPEG or PNG format, under 512 KB, in RGB color space. The image must be accessible via a public URL that returns the correct Content-Type header. Apple's validator rejects images that return text/html or application/octet-stream even if the file is a valid JPEG.",
          "Spotify Podcasters has the same 1400×1400 minimum with a 3000×3000 recommended resolution. Both platforms require the image URL in the RSS feed's <itunes:image href> tag at the channel level. Episode-level artwork goes in each <item>'s <itunes:image href> tag.",
          "Google Podcasts (now Podcast Manager by Google) and iHeartRadio follow the same minimum 1400×1400 requirement. The consistent spec across directories means a single placeholder image URL at 1400×1400 satisfies all major submission requirements.",
        ],
        code: `<!-- RSS channel-level podcast artwork -->
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>My Podcast</title>
    <itunes:image href="https://fallback.pics/api/v1/square/1400?text=My+Podcast&theme=purple" />

    <!-- Episode-level artwork override -->
    <item>
      <title>Episode 1: Getting Started</title>
      <itunes:image href="https://fallback.pics/api/v1/square/1400?text=Ep+1%3A+Getting+Started&theme=purple" />
    </item>
  </channel>
</rss>`,
      },
      {
        eyebrow: "Feed readers",
        title: "Thumbnail sizes for RSS feed reader item previews",
        body: [
          "RSS feed readers display channel artwork at around 64×64 to 128×128 pixels in their list view. The image is fetched from the itunes:image URL and scaled down. Feedly, Inoreader, and Reeder all follow this pattern. The high-resolution artwork requirement from Apple Podcasts is for the directory listing page where the image is shown at larger sizes.",
          "Item-level images in blog RSS feeds come from the media:content or enclosure tag in each item element. When a blog post has a featured image, that URL goes there. When it does not, feed readers show a broken icon. A fallback.pics thumbnail URL derived from the post title keeps every item in the feed visually complete.",
        ],
        code: `<!-- Blog RSS item with fallback thumbnail via media:content -->
<item>
  <title>How to Optimize Your Database Queries</title>
  <link>https://example.com/blog/database-query-optimization</link>
  <media:content
    url="https://fallback.pics/api/v1/thumbnail/1200x630
      ?text=How+to+Optimize+Your+Database+Queries
      &theme=purple&style=soft"
    medium="image"
    width="1200"
    height="630"
  />
</item>`,
      },
      {
        eyebrow: "Validation",
        title: "Testing RSS feed images before submitting to directories",
        body: [
          "Use Podbase's podcast validator at podbase.fm/validator or Cast Feed Validator at castfeedvalidator.com to check your RSS feed before submitting to Apple Podcasts. Both tools check the itunes:image URL for accessibility, correct Content-Type, and minimum dimensions. Paste the fallback.pics URL into a browser first to verify it returns an image at the expected dimensions.",
          "Apple's Podcasts Connect portal shows a preview of the artwork during submission. If the image looks correct in the preview, it will pass Apple's automated validation. The most common failure is a URL that requires authentication or returns a redirect chain that the validator does not follow.",
        ],
      },
      {
        eyebrow: "Transition plan",
        title: "Replacing the placeholder with real artwork without breaking the feed",
        body: [
          "When your real artwork is ready, update the URL in the RSS feed's itunes:image tag. Apple Podcasts re-fetches channel artwork periodically (roughly every 24 hours). The change propagates to listeners within a day or two. You do not need to re-submit to the directory.",
          "For episode-level artwork, update the item's itunes:image href. Podcast apps generally show the artwork that was set when the listener first downloaded or streamed the episode. Updating the feed does not update artwork the listener has already cached.",
        ],
      },
      {
        eyebrow: "Blog feeds",
        title: "Generating consistent og:image and feed thumbnails from one URL",
        body: [
          "If you generate your blog's OG image from a fallback.pics thumbnail URL, you can reuse the same URL in the RSS feed's media:content tag. The OG image and the feed thumbnail are the same asset, derived from the same post title and color theme. This eliminates the need to maintain separate image assets for two distribution channels.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "API docs and related reading on feed and social images",
        body: [
          "The OG image blog post covers social sharing meta tags in detail. The API reference documents all text encoding and size parameters for the square and thumbnail routes.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/jpeg-placeholder-urls-email-social/`,
      },
    ],
    takeaways: [
      "Apple Podcasts requires artwork at 1400×1400 to 3000×3000 pixels, JPEG or PNG, under 512 KB — a placeholder at 1400×1400 satisfies all major directory requirements.",
      "Generate podcast cover placeholder URLs from the show name to unblock directory submission while final artwork is in production.",
      "Blog RSS feeds can reuse the same fallback.pics thumbnail URL for both OG meta tags and media:content feed thumbnails.",
      "Validate the image URL in Podbase or Cast Feed Validator before submitting to podcast directories.",
      "Update the RSS feed's itunes:image href when real artwork is ready — directories re-fetch and update within 24 hours.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "jpeg-placeholder-urls-email-social",
      "facebook-meta-og-image-fallbacks",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    title: "Pinterest Rich Pin Image Fallbacks for Product Boards",
    description:
      "Set up pinterest image size compliant og:image fallbacks so Rich Pins populate correctly when product photos are missing from your catalog.",
    slug: "pinterest-rich-pin-image-fallbacks",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "pinterest image size",
      "Pinterest Rich Pin",
      "og:image fallback",
      "product pin",
      "Pinterest SEO",
    ],
    summary: [
      "Pinterest Rich Pins pull product data including images from your page's Open Graph meta tags. When the og:image URL is missing or returns an error, Pinterest renders the pin with no image — a blank card that gets zero engagement. For product boards, a missing image means the pin effectively does not exist.",
      "A deterministic fallback og:image URL generated from the product name and category keeps Rich Pins populated and visually consistent even when product photography is incomplete. This is especially useful during catalog launches when new SKUs go live before their product photos are processed.",
    ],
    sections: [
      {
        eyebrow: "Requirements",
        title: "Pinterest image size requirements for Rich Pins and standard pins",
        body: [
          "Pinterest recommends a 2:3 aspect ratio (1000×1500 pixels) for standard product pins. This vertical format performs best in the Pinterest feed because it takes up more vertical space without being hidden by the 'show more' cutoff. Square images (1:1) also work. Horizontal images (wider than tall) are penalized in the algorithm and display less prominently.",
          "For Rich Pins specifically, Pinterest reads the og:image meta tag. The minimum recommended size is 600px on the shortest side. Pinterest does not have a maximum file size requirement, but images above 10 MB may fail to process. The format must be JPEG or PNG.",
          "Pinterest caches pin images aggressively. Once a pin is created, Pinterest stores its own copy of the image. Updating the og:image URL on the source page does not update existing pins, only new pins created after the change.",
        ],
      },
      {
        eyebrow: "OG setup",
        title: "Wiring og:image fallback for Pinterest Rich Pin validation",
        body: [
          "Pinterest reads og:image, og:image:width, og:image:height, og:title, og:description, and product-specific tags (og:price:amount, og:price:currency) from your page. All of these should be present for Product Rich Pins to qualify.",
          "Generate the fallback og:image URL from the product name and category. Use a vertical 1000×1500 format to match Pinterest's preferred ratio. Set og:image:width and og:image:height explicitly so Pinterest knows the dimensions without fetching the image first.",
        ],
        code: `<!-- Product page meta tags for Pinterest Rich Pin -->
<!-- Pinterest prefers 2:3 vertical ratio -->
<meta property="og:type" content="product" />
<meta property="og:title" content="Merino Wool Running Socks – 3-Pack" />
<meta property="og:image"
  content="https://fallback.pics/api/v1/1000x1500/7C3AED/FFFFFF
    ?text=Merino+Wool+Running+Socks" />
<meta property="og:image:width" content="1000" />
<meta property="og:image:height" content="1500" />
<meta property="og:image:alt" content="Merino Wool Running Socks in purple packaging" />
<meta property="product:price:amount" content="24.99" />
<meta property="product:price:currency" content="USD" />`,
      },
      {
        eyebrow: "Product catalog",
        title: "Generating Pinterest fallback images for new SKUs at catalog launch",
        body: [
          "When a new product category launches with 200 SKUs and only 80% of the product photos have been processed, the remaining 40 products will have broken pins if you go live without fallback images. A server-side check at page render time — does this product have a photo? — lets you serve a fallback.pics URL for the 20% that do not.",
          "The fallback image does not have to be abstract. Use the product name as the text parameter and the product category color as the background. A pin showing 'Merino Wool Running Socks' on a brand-purple background is more informative than a broken image and can still drive clicks.",
        ],
        code: `// Next.js product page — conditional og:image
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  const ogImage = product.imageUrl
    ? product.imageUrl
    : \`https://fallback.pics/api/v1/1000x1500/7C3AED/FFFFFF\` +
      \`?text=\${encodeURIComponent(product.name)}\`;

  return {
    openGraph: {
      images: [{ url: ogImage, width: 1000, height: 1500 }],
    },
  };
}`,
      },
      {
        eyebrow: "Validation",
        title: "Testing Rich Pins with Pinterest's Rich Pin Validator",
        body: [
          "Pinterest provides a Rich Pin Validator at developers.pinterest.com/tools/url-debugger/. Paste your product page URL and Pinterest will fetch the og:image and display a preview of how the pin will appear. If the fallback image URL is valid and returns the correct Content-Type, the preview will show the generated image.",
          "After making changes to your og:image tag, clear Pinterest's cache by re-running the validator. Pinterest does not expose a manual cache-clear button for page metadata, but re-running the validator forces a fresh fetch. Allow 24-48 hours for the change to propagate to existing scheduled pins.",
        ],
      },
      {
        eyebrow: "SEO impact",
        title: "Pinterest image quality and its effect on pin discoverability",
        body: [
          "Pinterest's search algorithm considers image quality as a ranking signal. High-resolution, properly formatted images rank higher in Pinterest search than images that appear low-quality or blurry. A generated placeholder image with clear text on a solid background is visually clear and will not be penalized for quality.",
          "The text in a generated placeholder is not indexed by Pinterest's visual search. Pinterest's visual search engine analyzes photographic content for objects and scenes, not text. The generated image's SEO value comes from the Rich Pin metadata (title, description, price) rather than the image content itself.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Pinterest documentation and related SEO image posts",
        body: [
          "See the Facebook OG image post for the full OG tag setup guide. The JSON-LD schema post covers structured data for products that complements Rich Pin metadata.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/facebook-meta-og-image-fallbacks/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "Pinterest recommends 1000×1500 pixels (2:3 ratio) for product pins — use this aspect ratio for og:image fallbacks.",
      "Pinterest reads og:image from the page; a missing or broken URL results in a blank pin card with zero engagement.",
      "Generate fallback images from the product name and category color to keep new SKU pins informative during photography backlog.",
      "Use Pinterest's Rich Pin Validator to confirm the fallback URL is accessible and renders correctly before going live.",
      "Pinterest caches pin images at creation time; updating og:image only affects new pins, not existing ones.",
    ],
    related: [
      "facebook-meta-og-image-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
      "json-ld-image-schema-fallbacks",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    title: "Facebook and Meta OG Image Fallback Setup Checklist",
    description:
      "Fix facebook og image size issues and missing Open Graph images on Facebook and WhatsApp with a deterministic fallback URL strategy.",
    slug: "facebook-meta-og-image-fallbacks",
    readTime: "8 min read",
    category: "Content Workflows",
    tags: [
      "facebook og image size",
      "Open Graph",
      "Facebook sharing",
      "WhatsApp image preview",
      "Meta OG image",
    ],
    summary: [
      "Facebook and Instagram display a link preview card when a URL is shared. The card image comes from the og:image meta tag on the page. When that tag is missing, the image URL returns an error, or the image does not meet Facebook's minimum size requirements, the preview renders without an image — a text-only card that generates 3-5× fewer clicks than one with an image.",
      "The facebook og image size requirement is 1200×630 pixels minimum for the large card format. A deterministic fallback URL generated from the page title means every page on your site has a compliant OG image, regardless of whether a designer uploaded one manually.",
    ],
    sections: [
      {
        eyebrow: "Requirements",
        title: "Facebook og image size and format requirements",
        body: [
          "Facebook's large link preview card requires og:image at 1200×630 pixels or larger at the same 1.91:1 ratio. Images smaller than 600×315 display as a small thumbnail on the left of the link card instead of the large banner format. Images smaller than 200×200 are ignored entirely.",
          "Facebook supports JPEG, PNG, GIF, and WebP. SVG is not supported. Generated SVG placeholder images must be converted to raster format for Facebook. The fallback.pics API returns PNG or JPEG by specifying the format in the URL or via the Accept header. Use .png or .jpg extension to force a specific format.",
          "Facebook's scraper follows up to one redirect. If your og:image URL redirects to a different URL, the scraper follows it. If it redirects again, the scraper gives up. Avoid redirect chains in your og:image URLs.",
        ],
        cards: [
          {
            title: "Large card",
            body: "1200×630 px minimum. Displayed as full-width banner above the link text.",
          },
          {
            title: "Small thumbnail",
            body: "600×315 to 1199×629 px. Displayed as a small left-aligned thumbnail.",
          },
          {
            title: "Ignored",
            body: "Below 200×200 px. No image is shown in the link preview.",
          },
        ],
      },
      {
        eyebrow: "Meta tags",
        title: "The complete OG image meta tag set for Facebook compliance",
        body: [
          "Facebook reads og:image, og:image:url, og:image:width, og:image:height, og:image:alt, og:image:type, and og:image:secure_url. Only og:image is strictly required, but providing width and height lets Facebook display the large card format immediately without fetching the image to determine dimensions.",
          "og:image:secure_url must be an HTTPS URL. If you provide an HTTP URL in og:image, Facebook will accept it but the secure_url fallback is used for HTTPS pages. Always use HTTPS for og:image URLs in 2026.",
        ],
        code: `<!-- Complete OG meta tag set for Facebook, WhatsApp, Instagram -->
<meta property="og:type" content="article" />
<meta property="og:title" content="How to Optimize Lighthouse CI in Monorepos" />
<meta property="og:description" content="A practical guide to running Lighthouse CI..." />
<meta property="og:url" content="https://example.com/blog/lighthouse-ci-monorepos" />

<!-- Primary OG image: use real image URL or fallback -->
<meta property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=How+to+Optimize+Lighthouse+CI+in+Monorepos
    &theme=purple&style=soft&label=example.com" />
<meta property="og:image:secure_url"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=How+to+Optimize+Lighthouse+CI+in+Monorepos
    &theme=purple&style=soft&label=example.com" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Article: How to Optimize Lighthouse CI in Monorepos" />
<meta property="og:image:type" content="image/png" />`,
      },
      {
        eyebrow: "Debugger",
        title: "Testing with Facebook Sharing Debugger and clearing the cache",
        body: [
          "Facebook's Sharing Debugger at developers.facebook.com/tools/debug/ fetches your page and shows exactly what the scraper found, including the resolved og:image URL, its dimensions, and any errors. Paste the page URL and click Debug. If the image is missing or the wrong size, the debugger explains why.",
          "Facebook caches og:image for a period after the first scrape. When you update the image URL, use the 'Scrape Again' button in the Sharing Debugger to force a fresh fetch. The cache clears for subsequent organic shares after the re-scrape, but users who shared the link before the re-scrape will see the old cached image.",
          "The debugger also validates og:image for Instagram and WhatsApp sharing, since all three use the same Open Graph protocol. Clearing the Facebook cache clears the preview for all Meta platforms.",
        ],
      },
      {
        eyebrow: "WhatsApp",
        title: "WhatsApp link preview image requirements",
        body: [
          "WhatsApp reads og:image from the page's meta tags using its own scraper. The scraper runs when a user sends a link in a chat. The preview shows a thumbnail, title, and description. WhatsApp's scraper does not have public documentation on minimum sizes, but in practice the Facebook og:image spec (1200×630 or at minimum 600×315) works for WhatsApp previews.",
          "WhatsApp caches link previews per user device. If a recipient has seen the link before, they see the cached preview. There is no WhatsApp-equivalent of the Facebook Sharing Debugger for cache clearing. The practical approach is to use a URL with a cache-busting parameter if you need the preview to update, though this requires generating a new link.",
        ],
      },
      {
        eyebrow: "Site-wide implementation",
        title: "Generating fallback OG images for every page automatically",
        body: [
          "Add the og:image generation logic to your site's layout template or metadata component. Pages that have a manually uploaded image use that URL. Pages without one generate a fallback.pics URL from the page title and category. This requires zero per-page work from content contributors.",
          "For static sites generated at build time, compute the fallback URL during the build and embed it as a static meta tag. This avoids any runtime URL generation and means the OG image is present in the initial HTML for all crawlers.",
        ],
        code: `// Astro layout — auto-generate og:image if not provided
---
const { title, ogImage, category = 'Article' } = Astro.props;
const resolvedOgImage = ogImage ??
  \`https://fallback.pics/api/v1/thumbnail/1200x630.png\` +
  \`?text=\${encodeURIComponent(title)}\` +
  \`&label=\${encodeURIComponent(category)}\` +
  \`&theme=purple&style=soft\`;
---
<meta property="og:image" content={resolvedOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      },
      {
        eyebrow: "Resources",
        title: "Facebook documentation and related OG image posts",
        body: [
          "The full OG image placeholders guide covers article, product, and profile use cases. The Pinterest post covers similar requirements for a different platform.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/pinterest-rich-pin-image-fallbacks/`,
      },
    ],
    takeaways: [
      "Facebook requires 1200×630 px for large link preview cards; below 600×315 only a small thumbnail shows.",
      "Provide og:image:width and og:image:height so Facebook displays the large card without fetching image dimensions.",
      "Facebook does not support SVG — use .png or .jpg format parameters in your fallback.pics URL.",
      "Use the Facebook Sharing Debugger to validate og:image and clear the cached preview after updates.",
      "Implement fallback URL generation in your layout template so every page has a compliant OG image automatically.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "pinterest-rich-pin-image-fallbacks",
      "discord-slack-link-preview-fallbacks",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    title: "Discord and Slack Link Preview Image Fallback Guide",
    description:
      "Fix slack link preview image failures and Discord embed images with deterministic og:image fallback URLs that unfurl reliably in both platforms.",
    slug: "discord-slack-link-preview-fallbacks",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "slack link preview image",
      "Discord embed image",
      "og:image unfurl",
      "Slack unfurl",
      "link preview",
    ],
    summary: [
      "When a URL is posted in Slack or Discord, the platform fetches the page's Open Graph meta tags and renders a link preview card. The slack link preview image comes from og:image. When that tag is missing or returns an error, the preview shows the page title and description with no image — a notably less engaging card.",
      "Internal tools, documentation portals, and developer blogs are the most common sources of shared links in engineering Slack channels. These sites rarely have per-page OG images. A URL-based fallback strategy makes every shared link from these properties look intentional.",
    ],
    sections: [
      {
        eyebrow: "How unfurling works",
        title: "Slack and Discord scraping behavior for link previews",
        body: [
          "Slack's Link Unfurling runs when a user posts a URL in a channel or DM. Slack's servers fetch the URL (not the user's browser), parse the HTML, extract og:title, og:description, og:image, and og:image:width/height, then render the unfurled card. The fetch runs server-to-server and does not send user credentials.",
          "Discord's embed system works similarly. Discord's scraper fetches the URL from Discord's servers and renders an embed using OG tags. Discord also reads Twitter Card meta tags (twitter:image, twitter:card) as a fallback when OG tags are absent. Providing both OG and Twitter Card tags maximizes compatibility.",
          "Both platforms cache the unfurled preview. Slack's cache duration is not publicly documented but approximately 30 minutes to a few hours for frequently shared URLs. Discord's cache is similar. Neither platform has a user-accessible cache clear button; the developer console in the respective API can force a re-fetch.",
        ],
      },
      {
        eyebrow: "OG tags",
        title: "Required og:image tags for reliable Slack and Discord unfurls",
        body: [
          "Provide og:image, og:image:width, og:image:height, og:title, and og:description at minimum. Slack shows the image at 400-500px wide in the unfurl card. Discord shows it at 400px wide. The aspect ratio is preserved. A 1200×630 image (1.91:1) is the standard that works across all platforms.",
          "Slack does not require secure_url to be HTTPS in 2026, but HTTP og:image URLs may be blocked in enterprise workspaces with strict content policies. Always use HTTPS.",
        ],
        code: `<!-- OG + Twitter Card meta tags for maximum unfurl compatibility -->
<meta property="og:title" content="Database Schema Migration Guide v2.0" />
<meta property="og:description" content="Step-by-step migration from v1 to v2 schema..." />
<meta property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=Database+Schema+Migration+Guide+v2.0
    &label=Docs&theme=purple&style=soft" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card fallback (Discord also reads these) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=Database+Schema+Migration+Guide+v2.0
    &label=Docs&theme=purple&style=soft" />`,
      },
      {
        eyebrow: "Private URLs",
        title: "Handling link previews for authenticated internal tools",
        body: [
          "Slack and Discord fetch URLs from their own servers without authentication. If the URL requires a login to access, the scraper receives a redirect to the login page and reads the login page's OG tags instead of the target page's tags. The preview shows the generic login page image, not the document image.",
          "There is no way to pass session cookies to the platform's scraper. The only reliable solution for authenticated content is to serve the OG meta tags in a public pre-render layer that does not require authentication. Some frameworks support this via a public metadata endpoint that returns the OG tags for a given document ID without serving the document content.",
          "For internal tools where you control the embedding, Discord and Slack both support rich message embeds via their APIs. You can send a message with a pre-constructed embed object that includes the image URL directly, bypassing the unfurl scraper entirely.",
        ],
      },
      {
        eyebrow: "Internal tools",
        title: "Generating og:image for internal documentation and runbooks",
        body: [
          "Internal documentation portals (Notion-exported pages, Confluence, custom wikis) are shared constantly in Slack. They almost never have per-page OG images. A site-wide layout that generates a fallback.pics thumbnail from the page title and section name covers every page without per-page work.",
          "For Notion, you cannot inject custom OG tags into exported pages. The workaround is to publish Notion content through a proxy (Feather, super.so, Potion) that adds a custom head and lets you configure OG image generation per page or based on the page title.",
        ],
        code: `// Express middleware — inject og:image for every page
app.use((req, res, next) => {
  res.locals.generateOgImage = (title, section = 'Docs') =>
    \`https://fallback.pics/api/v1/thumbnail/1200x630.png\` +
    \`?text=\${encodeURIComponent(title)}\` +
    \`&label=\${encodeURIComponent(section)}\` +
    \`&theme=purple&style=soft\`;
  next();
});

// In your EJS/Handlebars template
// <meta property="og:image" content="<%= generateOgImage(pageTitle, section) %>" />`,
      },
      {
        eyebrow: "Testing",
        title: "Debugging unfurl previews without spamming your Slack channel",
        body: [
          "Slack provides an API endpoint for testing unfurls: chat.unfurl in the Slack API. You can call it with a URL to see the resolved unfurl data without posting to a channel. The simpler approach is to create a private Slack channel used exclusively for testing link previews and post URLs there.",
          "Discord's embed tester is available at discohook.org — a community tool that lets you construct and preview Discord embeds including link unfurls. For your own URL, the easiest test is to create a server and post the URL in a private channel.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related posts on OG images and social sharing",
        body: [
          "The Facebook OG image post covers the full meta tag specification. The Reddit and HN post covers social preview requirements for developer-oriented sharing platforms.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/facebook-meta-og-image-fallbacks/
https://fallback.pics/blog/reddit-hn-social-preview-images/`,
      },
    ],
    takeaways: [
      "Slack and Discord fetch og:image from their own servers without user credentials — authenticated pages cannot provide previews.",
      "Include og:image:width and og:image:height in your meta tags so Slack and Discord display the card immediately.",
      "Discord also reads Twitter Card tags; providing both sets maximizes compatibility.",
      "For internal tools behind authentication, serve OG tags in a public metadata layer or use the platform's rich message API.",
      "Test with a private Slack channel or discohook.org without polluting shared channels.",
    ],
    related: [
      "facebook-meta-og-image-fallbacks",
      "reddit-hn-social-preview-images",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────────
  {
    title: "Reddit and Hacker News Social Preview Images That Stick",
    description:
      "Optimize social preview image tags for Reddit thumbnails and Hacker News link previews so your posts generate clicks from developer audiences.",
    slug: "reddit-hn-social-preview-images",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "social preview image",
      "Reddit thumbnail",
      "Hacker News",
      "og:image",
      "developer marketing",
    ],
    summary: [
      "Reddit generates a thumbnail for link posts by fetching the og:image meta tag from the submitted URL. Hacker News does not display images at all — it is a text-only feed — but the content of your page's og:image is still read by the HN companion apps and bots that many users rely on for reading HN content.",
      "For developer tools and SaaS products, Reddit and Hacker News represent high-intent traffic. A post that surfaces on r/webdev or the HN front page sends experienced developers who evaluate technical quality quickly. The first visual impression — the thumbnail on Reddit — shapes whether someone clicks through.",
    ],
    sections: [
      {
        eyebrow: "Reddit thumbnails",
        title: "How Reddit generates thumbnails from social preview image tags",
        body: [
          "Reddit's link scraper fetches og:image from the submitted URL when a link post is created. If og:image is present and returns a valid image, Reddit generates a thumbnail at approximately 140×140 pixels and displays it on the left side of the link card in list view. If og:image is missing, Reddit shows a default icon based on the subreddit or no thumbnail at all.",
          "Reddit does not re-fetch the thumbnail after the post is created. If you update og:image after the post is submitted, the existing post keeps the original thumbnail. Only new posts pick up the updated image.",
          "Reddit also reads twitter:image as a fallback when og:image is absent. The image must return a 200 response with a valid image Content-Type. Reddit's scraper times out after a few seconds, so slow image generation APIs can result in missing thumbnails even when the URL is valid.",
        ],
      },
      {
        eyebrow: "Image strategy",
        title: "Choosing the right social preview image for technical content",
        body: [
          "For developer tools and libraries, the OG image should communicate what the product does at a glance. Text-heavy images that explain the tool perform better in developer communities than abstract brand imagery. A thumbnail showing 'Fallback Images for Production Apps' in readable text on a dark background works. An abstract gradient with a logo is harder to read at 140px.",
          "Reddit's thumbnail is 140×140 — square, small. Design your og:image with a center-safe zone. Any essential text or logo should be within the middle 40% of the 1200×630 image. When Reddit crops to 140×140 from the center, your key content should still be visible.",
          "Hacker News companion apps like Hacker News PWA, Reeder, and Apollo for HN display the og:image at varying sizes. Some show a full 1200×630 preview in article view. Others show a small thumbnail in list view. Design for legibility at both 140px and 630px.",
        ],
        code: `<!-- OG image optimized for Reddit and HN companion apps -->
<!-- Center-safe design: key text and logo in central 40% of frame -->
<meta property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=Fallback+Images+for+Production+Apps
    &label=fallback.pics
    &theme=purple&style=soft" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card — Hacker News apps often read this -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630.png
    ?text=Fallback+Images+for+Production+Apps
    &label=fallback.pics&theme=purple&style=soft" />`,
      },
      {
        eyebrow: "Hacker News",
        title: "What HN reads and what it ignores",
        body: [
          "Hacker News itself does not display images in its classic text-only interface. The og:image URL is not used by news.ycombinator.com directly. What HN does display is the domain name next to the link title. The visual identity on HN comes from your title copy, not from any image.",
          "The HN ecosystem is large. Companion apps, bots that post HN links to Slack, browser extensions that add previews to HN pages — all of these read og:image. If your og:image is missing, HN links shared in Slack or Discord show no preview image, which is a missed opportunity when the link is to developer content.",
          "For 'Show HN' posts (product announcements), HN readers click through to your site. Your landing page's first impression matters more than the HN listing's appearance. The og:image is relevant when the Show HN link gets shared secondarily on Twitter or Slack.",
        ],
      },
      {
        eyebrow: "Submission timing",
        title: "Making sure og:image is set before submitting to Reddit",
        body: [
          "Reddit fetches og:image at submission time, not at the time the thumbnail is first displayed to users. If you submit a link before the og:image tag is in place, the post has no thumbnail permanently. Deploy your og:image meta tag before announcing a product or post on Reddit.",
          "If you submitted a post without an og:image by mistake, the only fix is to delete the post and resubmit after adding the tag. Reddit does not provide a mechanism to refresh a post's thumbnail. Check your og:image tag is rendering in the page source before hitting submit.",
        ],
      },
      {
        eyebrow: "Caching",
        title: "Reddit thumbnail caching and URL stability",
        body: [
          "Reddit stores a copy of your thumbnail image on its own CDN (i.redd.it). The cached copy is immutable — it never updates from the source. This is another reason to have the og:image URL correct before submission. A generated fallback.pics URL is stable and returns the same image on every request, making it a reliable source for Reddit's scraper.",
          "Because the thumbnail is stored by Reddit, fallback.pics does not need to serve the image repeatedly for Reddit traffic after the initial scrape. Reddit's CDN copy handles all subsequent requests from Reddit users.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Docs and related posts on social preview images",
        body: [
          "The Facebook OG image post covers the full meta tag specification that Reddit also follows. The Slack and Discord post covers unfurl behavior in developer communication tools.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/facebook-meta-og-image-fallbacks/
https://fallback.pics/blog/discord-slack-link-preview-fallbacks/`,
      },
    ],
    takeaways: [
      "Reddit generates thumbnails from og:image at submission time — set the tag before you post, not after.",
      "Reddit crops to 140×140 from center; keep key content in the central 40% of your 1200×630 image.",
      "Hacker News itself ignores og:image; companion apps and platforms that share HN links use it extensively.",
      "Text-heavy OG images that explain the tool perform better than abstract brand imagery on developer platforms.",
      "Reddit stores a copy of your thumbnail on its CDN — an immutable image is set at submission time forever.",
    ],
    related: [
      "facebook-meta-og-image-fallbacks",
      "discord-slack-link-preview-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────────
  {
    title: "JSON-LD Image Properties When featuredImage Is Missing",
    description:
      "Supply valid json-ld image schema values when your CMS featured image is absent to keep structured data eligible for Google rich results.",
    slug: "json-ld-image-schema-fallbacks",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "json-ld image schema",
      "structured data images",
      "schema.org image",
      "rich results",
      "Google structured data",
    ],
    summary: [
      "Google's rich result types — Article, Product, Recipe, Event — all require an image property in their JSON-LD structured data. When the image is missing from the schema, Google may still index the page but the rich result is ineligible. A page that was showing an article rich snippet in search results stops doing so once the image is removed or becomes unavailable.",
      "Generating a fallback image URL for the json-ld image schema property ensures that structured data remains valid even when the CMS featured image is missing. The image does not need to be a photograph — it needs to meet Google's minimum pixel requirements and be publicly accessible.",
    ],
    sections: [
      {
        eyebrow: "Requirements",
        title: "Google's json-ld image schema requirements for rich results",
        body: [
          "For Article rich results, Google requires the image property to be an ImageObject or URL. The image must be crawlable and indexable. The minimum dimensions are 696 pixels wide, and images should be at 16×9, 4×3, or 1×1 aspect ratios for Article. Larger images (at least 1200px wide) are preferred.",
          "For Product rich results, the image array can contain multiple ImageObjects. Google recommends high-resolution images but does not specify a minimum size for products. The image must be of the actual product, not a logo or text-only placeholder — though enforcement of this rule is inconsistent in practice.",
          "For Event and Recipe rich results, image is required and must be at least 720×405 pixels. The 16×9 ratio is standard. Google uses the first image in the array for rich result display if multiple are provided.",
        ],
      },
      {
        eyebrow: "Fallback URL",
        title: "Generating a json-ld image schema fallback from page metadata",
        body: [
          "When a CMS article has no featured image, generate a fallback.pics thumbnail URL and use it as the image property in the Article JSON-LD block. Use 1200×630 to satisfy the 'at least 1200px wide' recommendation and the 16×9 ratio. Encode the article title as the text parameter so the image reflects the content.",
          "The fallback image URL must be publicly accessible — no authentication, no cookies required. fallback.pics generates images on the Cloudflare edge and returns them with public caching headers, so Googlebot can fetch and index them without any special configuration.",
        ],
        code: `<!-- Article JSON-LD with conditional image fallback -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Configure Redis Caching for Node.js",
  "description": "A practical guide to Redis caching patterns...",
  "author": {
    "@type": "Person",
    "name": "Alex Chen"
  },
  "datePublished": "2026-01-15",
  "image": {
    "@type": "ImageObject",
    "url": "https://fallback.pics/api/v1/thumbnail/1200x630.png?text=How+to+Configure+Redis+Caching+for+Node.js&theme=purple&style=soft",
    "width": 1200,
    "height": 630
  }
}
</script>`,
      },
      {
        eyebrow: "CMS integration",
        title: "Adding fallback logic to CMS-generated structured data",
        body: [
          "Most CMS platforms generate JSON-LD from their own schema plugins. WordPress with Yoast SEO generates Article or Product JSON-LD automatically. When the featured image is not set, Yoast omits the image property entirely, making the structured data invalid for rich results.",
          "Override the image property in your WordPress theme or with a Yoast filter hook. Check if the post has a featured image; if not, generate a fallback.pics URL from the post title and inject it into the schema. The wpseo_schema_article filter provides access to the schema array before it is output.",
          "In headless CMS setups (Contentful, Sanity, Strapi), the JSON-LD is generated in your frontend application. Add a utility function that accepts the page data and returns either the CMS image URL or a fallback URL. Call it from the same place where you construct the og:image tag so both are consistent.",
        ],
        code: `// WordPress — Yoast schema filter for image fallback
add_filter('wpseo_schema_article', function($schema) {
  if (empty($schema['image'])) {
    $title = get_the_title();
    $fallback = 'https://fallback.pics/api/v1/thumbnail/1200x630.png'
      . '?text=' . urlencode($title)
      . '&theme=purple&style=soft';

    $schema['image'] = [
      '@type'  => 'ImageObject',
      'url'    => $fallback,
      'width'  => 1200,
      'height' => 630,
    ];
  }
  return $schema;
});`,
      },
      {
        eyebrow: "Product schema",
        title: "Product JSON-LD image when catalog photo is pending",
        body: [
          "Product pages with missing images drop out of Google Shopping eligibility. The Merchant Center requires at least one product image and reports validation errors when image is absent. A fallback.pics square URL with the product name satisfies the schema requirement while the real product photo is in processing.",
          "Use a square format (1000×1000 or 800×800) for product image fallbacks. Product images in Google Search and Shopping display in square or near-square crop frames. A 1200×630 landscape image will be cropped awkwardly in product carousels.",
        ],
        code: `<!-- Product JSON-LD with fallback image -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Titanium Mechanical Keyboard – 65% Layout",
  "image": [
    "https://fallback.pics/api/v1/square/800?text=Titanium+Mechanical+Keyboard"
  ],
  "offers": {
    "@type": "Offer",
    "price": "149.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
      },
      {
        eyebrow: "Validation",
        title: "Testing JSON-LD image properties with Google's Rich Results Test",
        body: [
          "Google's Rich Results Test at search.google.com/test/rich-results accepts a URL or code snippet and shows which rich result types the page qualifies for, including any errors. The tool highlights missing required properties and shows a preview of how the rich result will appear in search.",
          "Test with both your real featured image URL and the fallback URL to confirm that the fallback satisfies Google's requirements. Pay attention to the image dimensions reported in the test — if the tool cannot fetch the image, it cannot validate the dimensions and will mark the image property as unresolvable.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Structured data documentation and related SEO posts",
        body: [
          "The Google Images SEO post covers how Google handles generated and placeholder images in image search. The OG image post covers the parallel tag structure for social sharing.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/google-images-seo-generated-placeholders/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "Missing image in JSON-LD structured data makes Article, Product, Recipe, and Event pages ineligible for Google rich results.",
      "Google recommends at least 1200px wide for Article images in a 16×9 ratio — a 1200×630 fallback.pics thumbnail satisfies this.",
      "Use square fallback images (800×800 or 1000×1000) for Product schema to match Google Shopping's crop frame.",
      "Override CMS schema plugins with filter hooks to inject fallback image URLs when featured images are absent.",
      "Validate with Google's Rich Results Test to confirm the fallback image satisfies dimension and accessibility requirements.",
    ],
    related: [
      "google-images-seo-generated-placeholders",
      "og-image-placeholders-blogs-docs-social-sharing",
      "broken-images-seo-fallback-fix",
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────────
  {
    title: "Google Images SEO for URL-Generated Placeholder SVGs",
    description:
      "Understand google images seo behavior for programmatically generated placeholder images and whether SVG placeholders appear in image search results.",
    slug: "google-images-seo-generated-placeholders",
    readTime: "8 min read",
    category: "Performance",
    tags: [
      "google images seo",
      "placeholder image indexing",
      "SVG SEO",
      "image search optimization",
      "generated images",
    ],
    summary: [
      "Google crawls and indexes images from web pages, including programmatically generated ones. Whether your placeholder images appear in Google Images search depends on their alt text, their surrounding page context, and whether Google's quality filters classify them as low-value or high-value content.",
      "For most use cases, placeholder images should not appear in Google Images and will not, provided you handle alt text correctly and use the images only where appropriate. Understanding google images seo behavior helps you avoid accidentally surfacing placeholder images in search while ensuring your real product and content images remain indexable.",
    ],
    sections: [
      {
        eyebrow: "Does Google index them?",
        title: "How Google Images handles generated and placeholder images",
        body: [
          "Google's image indexing pipeline crawls img src URLs and applies quality filters. For an image to appear in Google Images, it needs to be high-resolution, non-duplicative, and contextually relevant to the surrounding page content. Generated placeholder images — particularly text-on-solid-color designs — are rarely considered high-value by Google's quality filters.",
          "Google does index SVG images. Since 2019, Googlebot has been able to parse and render SVG. However, SVG files returned from a dynamic URL (like fallback.pics) are indexed as a specific URL, not as a reusable asset. Each unique URL is a separate candidate for indexing.",
          "In practice, generated placeholder images with generic text like '400×300' almost never appear in Google Images because: (a) no meaningful alt text is provided, (b) hundreds of other pages have the same image URL returning the same content, and (c) the image quality filter deprioritizes text-on-color images over photographs.",
        ],
      },
      {
        eyebrow: "Alt text",
        title: "Writing alt text for placeholder images to avoid indexing",
        body: [
          "Alt text is the primary signal Google uses to understand image context. For placeholder images that should not appear in image search, use empty alt text (alt=\"\"). This marks the image as decorative. Googlebot skips decorative images for image search indexing while still crawling the page.",
          "Never use descriptive alt text on a placeholder that will be replaced by a real image later. If your placeholder has alt='Product photo of running shoes' and the real photo loads via JavaScript, Googlebot may index the placeholder URL with that descriptive alt text, which persists even after the real image is in place.",
          "For fallback images that will remain as the permanent image when the original is unavailable (not a temporary placeholder), write descriptive alt text that accurately describes what the image represents. 'Placeholder for missing product photo: Blue Merino Running Socks' is honest and won't mislead users.",
        ],
      },
      {
        eyebrow: "Robots and noindex",
        title: "Preventing placeholder image indexing with robots directives",
        body: [
          "You cannot add a robots meta tag to an image URL — only to an HTML page. To prevent a specific image URL from being indexed in Google Images, you have three options: use X-Robots-Tag: noindex in the HTTP response headers from the image URL, block the URL pattern in robots.txt with Disallow, or use empty alt text to mark the image as decorative.",
          "Adding X-Robots-Tag: noindex to fallback.pics image responses is not currently supported. The practical approach for self-hosted placeholder generators is to add the noindex header in your image serving middleware. For third-party services, use the other methods.",
        ],
        code: `# robots.txt — disallow indexing of dynamic placeholder image paths
# (only effective if you self-host or control the image origin)

User-agent: Googlebot-Image
Disallow: /api/v1/placeholder/
Disallow: /api/v1/skeleton/
Disallow: /api/v1/blur/

# Allow product images that are real content
Allow: /api/v1/product/`,
      },
      {
        eyebrow: "Format considerations",
        title: "SVG vs PNG for generated images and Google Images visibility",
        body: [
          "SVG images from a generated URL are indexed per-URL by Google. A PNG image from a generated URL is also indexed per-URL. The format does not determine whether Google indexes the image; the quality signals do. That said, Google's image search surface shows more photographic PNG and JPEG images than SVG files because SVG is less common and often decorative.",
          "For real content images (blog thumbnails, product OG images), use PNG or JPEG format from your fallback.pics URL. Append .png to the URL path for explicit format selection. Google Images is more likely to surface raster images from editorial content than SVG files.",
        ],
      },
      {
        eyebrow: "Real content images",
        title: "Optimizing generated thumbnails for Google Images SEO",
        body: [
          "Blog post thumbnails and OG images generated from fallback.pics are candidates for Google Images indexing if they contain valuable text and are referenced from high-quality pages. For content marketing, this is actually desirable. A well-labeled thumbnail can appear in Google Images search and drive referral traffic.",
          "To maximize Google Images visibility for intentional generated images: provide descriptive alt text, include the image URL in your sitemap's image extension tags, use a canonical URL for the image that does not change, and ensure the surrounding page content is high-quality and relevant to the image text.",
        ],
        code: `<!-- Sitemap image extension for generated thumbnails -->
<url>
  <loc>https://example.com/blog/redis-caching-guide/</loc>
  <image:image>
    <image:loc>
      https://fallback.pics/api/v1/thumbnail/1200x630.png
        ?text=Redis+Caching+Guide+for+Node.js&theme=purple&style=soft
    </image:loc>
    <image:title>Redis Caching Guide for Node.js</image:title>
    <image:caption>Thumbnail for the Redis caching guide article</image:caption>
  </image:image>
</url>`,
      },
      {
        eyebrow: "Resources",
        title: "Related posts on image SEO and structured data",
        body: [
          "The JSON-LD image schema post covers structured data requirements for rich results. The broken images SEO post covers the broader impact of missing images on search ranking.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/json-ld-image-schema-fallbacks/
https://fallback.pics/blog/broken-images-seo-fallback-fix/`,
      },
    ],
    takeaways: [
      "Google does index SVG and generated images, but quality filters deprioritize text-on-color placeholders with no meaningful alt text.",
      "Use empty alt=\"\" on decorative placeholders to mark them as non-indexable by Google Images.",
      "Never write descriptive alt text on a temporary placeholder that will be replaced — it can stick in Google's index.",
      "For intentional generated thumbnails (blog OG images), use descriptive alt text and include the image in your XML sitemap.",
      "Use X-Robots-Tag: noindex in image response headers on self-hosted generators to explicitly block image indexing.",
    ],
    related: [
      "json-ld-image-schema-fallbacks",
      "broken-images-seo-fallback-fix",
      "svg-placeholder-images-fast-cacheable-scalable",
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────────
  {
    title: "React Native Image Fallback with Default Source URLs",
    description:
      "Implement react native image fallback using defaultSource and onError to show placeholder images when remote URLs fail on iOS and Android.",
    slug: "react-native-image-fallback",
    readTime: "8 min read",
    category: "Mobile UX",
    tags: [
      "react native image fallback",
      "defaultSource",
      "React Native Image",
      "mobile image placeholder",
      "onError handler",
    ],
    summary: [
      "React Native's Image component provides two mechanisms for handling image failures: the defaultSource prop, which shows a local asset while the remote image loads, and the onError callback, which fires when the remote image cannot be fetched. Neither mechanism automatically swaps in a fallback URL — you implement that logic yourself.",
      "Using a remote URL from fallback.pics as the fallback eliminates the need to bundle a placeholder image asset in your app. This reduces app size and lets you change the fallback design without an app update.",
    ],
    sections: [
      {
        eyebrow: "Component API",
        title: "React Native Image defaultSource and onError behavior",
        body: [
          "The defaultSource prop accepts a local asset (required() reference) or a URI object. It displays while the source image is loading. On iOS, defaultSource is shown during the loading period. On Android, defaultSource is not supported for remote images loaded via network request — it only works with local assets. This platform divergence is a common source of bugs.",
          "The onError callback fires when the image fails to load (network error, 404, timeout, or invalid image data). Inside the callback, you update the image source to a fallback URL. Without a guard flag, this can trigger an infinite loop if the fallback URL also fails.",
        ],
        code: `// Basic React Native image fallback with onError
import React, { useState } from 'react';
import { Image } from 'react-native';

const FALLBACK_URL = (width: number, height: number) =>
  \`https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF\`;

export function RemoteImage({
  uri,
  width = 200,
  height = 200,
  ...props
}: { uri: string; width?: number; height?: number } & React.ComponentProps<typeof Image>) {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      {...props}
      source={{ uri: errored ? FALLBACK_URL(width, height) : uri }}
      style={[props.style, { width, height }]}
      onError={() => {
        if (!errored) setErrored(true);
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Platform differences",
        title: "iOS vs Android behavior for remote image fallbacks",
        body: [
          "On iOS, defaultSource renders a local asset during the network fetch. The fetch happens in the background. If it succeeds, the local asset is replaced by the remote image. If it fails, the onError callback fires and you can update the source. iOS handles this correctly.",
          "On Android, defaultSource is ignored when source is a remote URI. The Image component renders nothing until the network image loads or fails. To show a placeholder on Android during loading, use the loadingIndicatorSource prop (deprecated in some RN versions) or render a separate View with a placeholder image behind the Image component using absolute positioning.",
          "React Native's fast-image library (react-native-fast-image) handles this platform inconsistency more gracefully. It supports onLoadStart, onLoad, onError events consistently across iOS and Android and handles cache control, priority queuing, and CORS headers.",
        ],
        code: `// Platform-safe loading state with absolute-positioned placeholder
import { View, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

export function SafeImage({ uri, width, height, style }: {
  uri: string; width: number; height: number; style?: object;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/71717A\`;

  return (
    <View style={[{ width, height }, style]}>
      {/* Placeholder layer — always visible until loaded or errored */}
      {!loaded && !errored && (
        <Image
          source={{ uri: \`https://fallback.pics/api/v1/animated/skeleton/\${width}x\${height}\` }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <Image
        source={{ uri: errored ? fallback : uri }}
        style={{ width, height }}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!errored) setErrored(true); }}
      />
    </View>
  );
}`,
      },
      {
        eyebrow: "Remote fallbacks",
        title: "Using URL-based fallbacks instead of bundled assets",
        body: [
          "Bundled placeholder assets (require('./placeholder.png')) increase app size and require an app update to change the fallback design. A remote URL from fallback.pics requires network access but is dynamically generated and can be changed without shipping a new app version.",
          "The tradeoff is that remote fallback URLs require network connectivity. If the device is offline and the primary image fails, the remote fallback also fails. For offline-capable apps, bundle a minimal local fallback asset and use the remote URL as an intermediate state when network is available.",
        ],
      },
      {
        eyebrow: "List performance",
        title: "Image fallback performance in FlatList and SectionList",
        body: [
          "React Native's FlatList recycles cells as the user scrolls. When a cell goes off-screen and back on-screen, the Image component remounts. If you store the errored state in local component state, the remounted component starts fresh and attempts the failing URL again. This causes repeated network errors in scrolling lists.",
          "Lift the errored state out of the image component and into a cache at the list level, keyed by the image URI. When the image reports an error, record it in the cache. On remount, the component checks the cache first and skips the failing URL immediately.",
        ],
        code: `// URI error cache for FlatList
const imageErrorCache = new Set<string>();

export function CachedFallbackImage({ uri, width, height }: {
  uri: string; width: number; height: number;
}) {
  const [errored, setErrored] = useState(imageErrorCache.has(uri));
  const fallback = \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/71717A\`;

  return (
    <Image
      source={{ uri: errored ? fallback : uri }}
      style={{ width, height }}
      onError={() => {
        if (!errored) {
          imageErrorCache.add(uri);
          setErrored(true);
        }
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Testing",
        title: "Testing fallback behavior in simulators and on device",
        body: [
          "Test the fallback by using an intentionally broken image URL (a 404 endpoint or a local IP that does not exist). In the iOS Simulator, use Network Conditioner to simulate offline or slow network conditions. Android emulator allows network speed throttling in the Extended Controls panel.",
          "Log the onError event with the error object — React Native's Image component passes an event with a nativeEvent that includes an error message. This is useful for distinguishing between 404 errors, network timeouts, and image format errors.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related documentation and mobile image posts",
        body: [
          "The Flutter ErrorBuilder post covers the equivalent pattern in Dart. The Expo Image post covers the Expo SDK's Image component which has a simpler placeholder API.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/flutter-image-placeholder-errorbuilder/
https://fallback.pics/blog/expo-image-fallback/`,
      },
    ],
    takeaways: [
      "React Native's onError callback is the primary mechanism for fallback — update the image source in state with a guard flag to prevent infinite loops.",
      "defaultSource only works for local assets on Android; use absolute-positioned placeholder images for cross-platform loading states.",
      "Remote fallback URLs from fallback.pics reduce app size and allow design updates without app releases, but require network access.",
      "Cache errored URIs at the list level to prevent repeated network failures when FlatList cells remount on scroll.",
      "Test fallback behavior with intentionally broken URLs and the simulator's network throttling tools.",
    ],
    related: [
      "flutter-image-placeholder-errorbuilder",
      "expo-image-fallback",
      "mobile-app-image-fallbacks-avatars-cards-offline",
    ],
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────────
  {
    title: "Flutter Image Placeholder and ErrorBuilder Patterns",
    description:
      "Use flutter image placeholder and errorBuilder to show loading states and fallback images when Image.network fails in Flutter apps.",
    slug: "flutter-image-placeholder-errorbuilder",
    readTime: "8 min read",
    category: "Mobile UX",
    tags: [
      "flutter image placeholder",
      "errorBuilder",
      "Flutter Image.network",
      "CachedNetworkImage",
      "Flutter loading state",
    ],
    summary: [
      "Flutter's Image.network widget has three loading-state callbacks: loadingBuilder for the in-progress state, errorBuilder for the failed state, and frameBuilder for controlling the transition from loading to loaded. Using these callbacks correctly lets you show a flutter image placeholder during loading and a fallback image on error without third-party dependencies.",
      "The CachedNetworkImage package adds disk caching and a simpler placeholder API on top of Image.network. Both approaches work with URL-based fallback images from fallback.pics, eliminating the need to bundle placeholder asset files in your app.",
    ],
    sections: [
      {
        eyebrow: "Widget API",
        title: "Image.network loadingBuilder and errorBuilder signatures",
        body: [
          "loadingBuilder receives the BuildContext, a child widget (the image being loaded), and a ImageChunkEvent that reports bytes downloaded. Return a widget from loadingBuilder — typically a progress indicator or a placeholder widget. When the image finishes loading, Flutter calls the builder with a null loadingProgress and renders the loaded image.",
          "errorBuilder receives the BuildContext, the error object, and a stack trace. Return a widget that represents the error state — a fallback image, an icon, or a text label. The errorBuilder fires on any Image.network failure: 404, network timeout, or invalid image data.",
          "frameBuilder wraps the loaded image widget and is called on every animation frame while the image transitions from loading to loaded. Use it to add fade-in effects. Without frameBuilder, the image appears instantly with no transition.",
        ],
        code: `// Image.network with loadingBuilder and errorBuilder
import 'package:flutter/material.dart';

class NetworkImageWithFallback extends StatelessWidget {
  final String imageUrl;
  final double width;
  final double height;

  const NetworkImageWithFallback({
    super.key,
    required this.imageUrl,
    this.width = 200,
    this.height = 200,
  });

  String get _fallbackUrl =>
    'https://fallback.pics/api/v1/\${width.toInt()}x\${height.toInt()}/E4E4E7/71717A';

  @override
  Widget build(BuildContext context) {
    return Image.network(
      imageUrl,
      width: width,
      height: height,
      fit: BoxFit.cover,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Container(
          width: width,
          height: height,
          color: const Color(0xFFE4E4E7),
          child: const Center(child: CircularProgressIndicator()),
        );
      },
      errorBuilder: (context, error, stackTrace) {
        return Image.network(
          _fallbackUrl,
          width: width,
          height: height,
          fit: BoxFit.cover,
        );
      },
    );
  }
}`,
      },
      {
        eyebrow: "CachedNetworkImage",
        title: "Simpler placeholder API with CachedNetworkImage",
        body: [
          "The cached_network_image package provides placeholder and errorWidget properties that accept a WidgetBuilder. It handles disk caching, memory caching, and HTTP cache headers automatically. For most production use cases, CachedNetworkImage is simpler than wiring Image.network callbacks manually.",
          "The placeholder property shows a widget while the image is being fetched. The errorWidget property shows a widget when the fetch fails. Both accept the context and the URL as parameters, which lets you generate a fallback URL from the original URL's dimensions.",
        ],
        code: `// CachedNetworkImage with fallback.pics fallback
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class CachedImageWithFallback extends StatelessWidget {
  final String imageUrl;
  final double width;
  final double height;

  const CachedImageWithFallback({
    super.key,
    required this.imageUrl,
    this.width = 200,
    this.height = 200,
  });

  @override
  Widget build(BuildContext context) {
    final fallbackUrl =
      'https://fallback.pics/api/v1/\${width.toInt()}x\${height.toInt()}/7C3AED/FFFFFF';

    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: BoxFit.cover,
      placeholder: (context, url) => Container(
        width: width,
        height: height,
        color: const Color(0xFFE4E4E7),
      ),
      errorWidget: (context, url, error) => CachedNetworkImage(
        imageUrl: fallbackUrl,
        width: width,
        height: height,
        fit: BoxFit.cover,
      ),
    );
  }
}`,
      },
      {
        eyebrow: "Shimmer loading",
        title: "Animated shimmer placeholder during image load",
        body: [
          "A shimmer animation communicates loading state better than a static grey box, especially for image-heavy lists like product catalogs or social feeds. The shimmer package provides a Shimmer widget that animates a linear gradient across a placeholder shape.",
          "Combine the shimmer placeholder with loadingBuilder in Image.network or the placeholder property in CachedNetworkImage. Show the shimmer during the loading phase and remove it when loadingProgress is null (loaded) or when errorBuilder fires.",
        ],
        code: `// Shimmer loading placeholder
import 'package:shimmer/shimmer.dart';

Widget _buildPlaceholder(double width, double height) {
  return Shimmer.fromColors(
    baseColor: const Color(0xFFE4E4E7),
    highlightColor: const Color(0xFFF4F4F5),
    child: Container(
      width: width,
      height: height,
      color: Colors.white,
    ),
  );
}

// Use inside CachedNetworkImage:
// placeholder: (context, url) => _buildPlaceholder(width, height),`,
      },
      {
        eyebrow: "List performance",
        title: "Flutter image loading performance in ListView and GridView",
        body: [
          "Flutter's ListView.builder creates and destroys widgets as items scroll off-screen. When a widget is destroyed and later recreated, Image.network re-fetches the image from cache or network. CachedNetworkImage uses a disk cache keyed by URL, so the re-fetch is a fast cache hit after the first load.",
          "Without CachedNetworkImage, use the precacheImage function to pre-load images before they scroll into view. Call precacheImage in the initState of your list widget for the first batch of URLs. This reduces the loading state duration for initially visible items.",
        ],
      },
      {
        eyebrow: "Error handling depth",
        title: "Handling errorBuilder fallback failures gracefully",
        body: [
          "If the fallback URL itself fails (device is offline), the errorBuilder's Image.network will call its own errorBuilder. Avoid infinite nesting of errorBuilders. Instead, use a local asset or a simple Container as the ultimate fallback — the last resort that requires no network.",
          "A two-level fallback strategy works well: level 1 is the remote fallback URL (fallback.pics), level 2 is a local bundled asset that is always available. The local asset only needs to be a small, generic placeholder since it fires only when both the original URL and the remote fallback fail.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Flutter documentation and related mobile image posts",
        body: [
          "The React Native image fallback post covers the equivalent pattern in JavaScript. The Expo Image post covers the Expo SDK image component.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/react-native-image-fallback/
https://fallback.pics/blog/expo-image-fallback/`,
      },
    ],
    takeaways: [
      "Image.network provides loadingBuilder and errorBuilder for loading states and error fallbacks without any third-party package.",
      "CachedNetworkImage simplifies the placeholder and fallback API and adds disk caching, making it the better choice for production apps.",
      "Use a shimmer animation via the shimmer package in the loadingBuilder or placeholder for a polished loading state.",
      "errorBuilder fallbacks can also fail — implement a two-level strategy: remote fallback URL first, local bundled asset as last resort.",
      "CachedNetworkImage's disk cache means ListView.builder recycling does not cause unnecessary network re-fetches.",
    ],
    related: [
      "react-native-image-fallback",
      "expo-image-fallback",
      "mobile-app-image-fallbacks-avatars-cards-offline",
    ],
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────────
  {
    title: "Expo Image Component Fallback and Placeholder for Remote URLs",
    description:
      "Configure expo image fallback using the Expo Image component's placeholder prop and onError event for remote URLs in React Native apps.",
    slug: "expo-image-fallback",
    readTime: "7 min read",
    category: "Mobile UX",
    tags: [
      "expo image fallback",
      "Expo Image component",
      "React Native placeholder",
      "blurhash placeholder",
      "Expo SDK",
    ],
    summary: [
      "The Expo Image component (expo-image) is a high-performance Image implementation for React Native that provides a placeholder prop, transition animations, and onError event handling out of the box. It handles the iOS vs Android defaultSource inconsistency that plagues the built-in Image component and adds disk caching with configurable cache policies.",
      "Using a fallback.pics URL as the expo image fallback eliminates bundled placeholder assets and lets you generate dimension-matched placeholders dynamically. The component's blurhash placeholder support is also useful when you have a blurhash string from your image CDN.",
    ],
    sections: [
      {
        eyebrow: "Component API",
        title: "Expo Image placeholder, source, and onError props",
        body: [
          "The Expo Image component's placeholder prop accepts a blurhash string, a thumbhash string, a local asset (require()), or a remote URL. The placeholder is shown while the source image is loading. When loading completes (success or error), the placeholder transitions out.",
          "The source prop accepts a URI string, a local asset, or an array of sources for progressive loading (low-res first, high-res on network load). The onError callback fires when the source fails to load. Expo Image does not automatically switch to a fallback — you update the source in state inside onError.",
          "The transition prop controls the animation from placeholder to loaded image. Use { duration: 200 } for a 200ms cross-fade. Expo Image also supports { timing: 'ease-in-out' } for more control over the animation curve.",
        ],
        code: `// Expo Image with placeholder and onError fallback
import { Image } from 'expo-image';
import { useState } from 'react';

const FALLBACK = (w: number, h: number) =>
  \`https://fallback.pics/api/v1/\${w}x\${h}/E4E4E7/71717A\`;

export function ExpoImageWithFallback({
  uri,
  width = 200,
  height = 200,
}: {
  uri: string;
  width?: number;
  height?: number;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      source={errored ? FALLBACK(width, height) : uri}
      placeholder={{ uri: \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/A1A1AA\` }}
      transition={200}
      style={{ width, height }}
      contentFit="cover"
      onError={() => {
        if (!errored) setErrored(true);
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Blurhash placeholder",
        title: "Using blurhash strings as expo image placeholder",
        body: [
          "Blurhash is a compact representation of an image's color and structure, encoded as a short string. When you have a blurhash string from your image CDN (Cloudinary and imgix both provide them), you can pass it directly to Expo Image's placeholder prop. The component decodes the blurhash and renders a blurred preview while the full image loads.",
          "When you do not have a blurhash string, a URL-based placeholder is the next best option. The placeholder URL shows a solid color or simple pattern that matches the image's expected dimensions. A grey rectangle is the minimal useful placeholder — it reserves space and prevents layout shift without implying any content.",
        ],
        code: `// Blurhash placeholder when available, URL placeholder as fallback
import { Image } from 'expo-image';

export function SmartPlaceholderImage({
  uri,
  blurhash,
  width,
  height,
}: {
  uri: string;
  blurhash?: string;
  width: number;
  height: number;
}) {
  const [errored, setErrored] = useState(false);
  const placeholder = blurhash
    ? blurhash
    : { uri: \`https://fallback.pics/api/v1/\${width}x\${height}/E4E4E7/A1A1AA\` };

  return (
    <Image
      source={errored
        ? \`https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF\`
        : uri}
      placeholder={placeholder}
      transition={300}
      style={{ width, height }}
      contentFit="cover"
      onError={() => { if (!errored) setErrored(true); }}
    />
  );
}`,
      },
      {
        eyebrow: "Cache policy",
        title: "Expo Image caching and when remote fallbacks are fetched",
        body: [
          "Expo Image caches images on disk by default. The cachePolicy prop controls this: 'memory-disk' (default, best performance), 'memory' (only RAM, lost on app restart), 'disk' (only disk, no RAM cache), or 'none' (no cache). For most apps, the default is correct.",
          "The remote fallback URL from fallback.pics is also cached by Expo Image after the first fetch. Subsequent onError events for the same primary URL use the cached fallback image. This is desirable — the fallback.pics CDN returns Cache-Control: public, max-age=31536000, so the cached entry is valid for a year.",
          "If you use the same fallback URL for many images (same dimensions, same color), Expo Image hits the disk cache for every image after the first one. This is efficient. If you generate unique fallback URLs per image (including the product name in text parameter), each URL is a separate cache entry.",
        ],
      },
      {
        eyebrow: "Avatar fallback",
        title: "Expo Image for user avatar placeholders with initials",
        body: [
          "User avatars are a common use case for expo image fallback. When a user has not uploaded a profile photo, or the photo URL becomes unavailable, the avatar shows a broken image or a default grey circle. A fallback.pics avatar URL with the user's initials provides a useful state.",
          "Generate the avatar fallback URL from the user's name. Use the /avatar/ route with the text parameter set to the user's initials. The avatar route renders a circular image suitable for round avatar displays. For square avatar containers, use /square/ instead.",
        ],
        code: `// Avatar with initials fallback
import { Image } from 'expo-image';

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export function UserAvatar({ avatarUrl, name, size = 48 }: {
  avatarUrl?: string;
  name: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(!avatarUrl);
  const initials = getInitials(name);
  const fallback = \`https://fallback.pics/api/v1/avatar/\${size}?text=\${initials}\`;

  return (
    <Image
      source={errored || !avatarUrl ? fallback : avatarUrl}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      contentFit="cover"
      onError={() => { if (!errored) setErrored(true); }}
    />
  );
}`,
      },
      {
        eyebrow: "vs React Native Image",
        title: "When to use Expo Image over the built-in Image component",
        body: [
          "Use expo-image when you need: consistent behavior across iOS and Android, built-in disk caching, blurhash or thumbhash placeholder support, smooth cross-fade transitions, or better performance in large image lists. The trade-off is adding an Expo SDK dependency.",
          "Use the built-in React Native Image when you need a smaller dependency footprint and your image use case is simple (no progressive loading, no disk cache required, no animations). For apps already using Expo SDK, expo-image is almost always the better choice.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Expo Image documentation and related mobile posts",
        body: [
          "The React Native Image fallback post covers the built-in Image component patterns. The Flutter errorBuilder post covers the equivalent in Dart.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/react-native-image-fallback/
https://fallback.pics/blog/flutter-image-placeholder-errorbuilder/`,
      },
    ],
    takeaways: [
      "Expo Image's placeholder prop accepts blurhash strings, thumbhash strings, local assets, or remote URLs — use a fallback.pics URL when no blurhash is available.",
      "Expo Image handles iOS/Android defaultSource inconsistency correctly, making it preferable to the built-in Image component.",
      "Cache the remote fallback URL via Expo Image's disk cache — subsequent requests for the same fallback dimensions hit the cache without a network round trip.",
      "Generate avatar fallbacks from user initials via the /avatar/ route for a useful non-empty state when profile photos are unavailable.",
      "Use cachePolicy: 'memory-disk' (default) for best performance; fallback.pics CDN headers allow year-long cache entries.",
    ],
    related: [
      "react-native-image-fallback",
      "flutter-image-placeholder-errorbuilder",
      "mobile-app-image-fallbacks-avatars-cards-offline",
    ],
  },
];
