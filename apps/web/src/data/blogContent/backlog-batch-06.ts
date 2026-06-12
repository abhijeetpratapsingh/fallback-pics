import type { BlogPost } from '../blogPosts';

export const backlogBatch06: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────
  {
    title: "Restaurant Menu and Dish Photo Fallbacks",
    description:
      "Keep restaurant menus and food delivery apps polished with restaurant menu placeholder images that hold layout when dish photos are missing or fail to load.",
    slug: "restaurant-menu-photo-fallback",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "restaurant menu placeholder",
      "food delivery image fallback",
      "menu photo missing",
      "image fallback",
      "ecommerce UX",
    ],
    summary: [
      "Restaurant menus and food delivery apps live or die on photography. A broken dish photo—especially in the hero slot or a featured item card—reads as low-quality to the customer even when the food is excellent. Restaurant menu placeholder images bridge the gap between a SKU being added to the system and the actual photo arriving from the photography team.",
      "The fallback.pics API generates warm-toned, correctly sized placeholder images from a URL with no upload required. Point your img onerror at the right endpoint and every menu item renders with a consistent visual regardless of photo status.",
    ],
    sections: [
      {
        eyebrow: "Why it matters",
        title: "Missing dish photos increase abandonment on food delivery apps",
        body: [
          "Studies of food delivery UX consistently show that menu items without photos receive significantly fewer clicks. The pattern is intuitive: diners use photos to decide. A broken image icon or a collapsed layout slot is worse than a neutral placeholder because it signals neglect.",
          "The problem is structural. New menu items go live before the photography workflow completes. Specials change daily. Seasonal items rotate. Even well-staffed operations have windows where photos are absent. A reliable restaurant menu placeholder image closes that window without blocking the menu publish.",
          "The secondary issue is layout shift. When an img element has no src fallback, browsers collapse the element to zero height. That collapses the card, reflows the grid, and produces a cumulative layout shift score that Google measures. A dimensioned fallback prevents all of that.",
        ],
      },
      {
        eyebrow: "Sizing guide",
        title: "Standard dish photo dimensions for menus and delivery apps",
        body: [
          "Different contexts call for different aspect ratios. Full-width hero slots on a restaurant homepage typically use 1200x600 or 1440x600. Category header images on delivery apps land around 800x300. Individual item cards are most commonly 400x300 (4:3) or 600x400, though square 400x400 tiles are popular in grid-style menus.",
          "For mobile-first apps, dish thumbnails appear at 160x120 in list views and 320x240 in card views. Always set explicit width and height attributes to reserve space before the placeholder or real image loads.",
        ],
        code: `<!-- Full-width hero for restaurant homepage -->
<img
  src="https://fallback.pics/api/v1/800x600/F97316/FFFFFF?text=Featured+Dish"
  width="800"
  height="600"
  alt="Featured dish photo placeholder"
/>

<!-- Standard item card (4:3) -->
<img
  src="https://fallback.pics/api/v1/400x300/FB923C/FFFFFF?text=Menu+Item"
  width="400"
  height="300"
  alt="Menu item photo placeholder"
/>

<!-- Square tile for grid menus -->
<img
  src="https://fallback.pics/api/v1/square/400?text=Dish"
  width="400"
  height="400"
  alt="Dish image placeholder"
/>`,
      },
      {
        eyebrow: "onerror pattern",
        title: "Wire the fallback into your img tag with onerror",
        body: [
          "The simplest integration is an inline onerror attribute that swaps in the placeholder URL when the real photo fails to load. This works in any HTML context—server-rendered templates, React JSX, Vue templates, or plain HTML files.",
          "One important detail: set the onerror to clear itself before assigning the fallback src. If the fallback URL itself ever fails (unlikely for a CDN-hosted service, but worth guarding), without clearing onerror you get an infinite loop of error events trying to load the same broken URL.",
        ],
        code: `<!-- Inline onerror with loop guard -->
<img
  src="{{ dish.photo_url }}"
  width="400"
  height="300"
  alt="{{ dish.name }}"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/400x300/F97316/FFFFFF?text=No+Photo'"
/>

<!-- React equivalent -->
<img
  src={dish.photoUrl}
  width={400}
  height={300}
  alt={dish.name}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      'https://fallback.pics/api/v1/400x300/F97316/FFFFFF?text=No+Photo';
  }}
/>`,
      },
      {
        eyebrow: "Category colors",
        title: "Assign placeholder colors by food category",
        body: [
          "A flat gray placeholder for every missing dish photo is functional but uninspired. A small mapping table lets you assign warm oranges to mains, greens to salads, yellows to desserts, and blues to drinks. The color communicates category even before the real photo loads.",
          "This approach also makes the 'missing photo' state feel intentional rather than accidental. Customers perceive it as a design choice, not a bug.",
        ],
        code: `const CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  mains:    { bg: 'F97316', fg: 'FFFFFF' },
  salads:   { bg: '10B981', fg: 'FFFFFF' },
  desserts: { bg: 'FBBF24', fg: '1F2937' },
  drinks:   { bg: '3B82F6', fg: 'FFFFFF' },
  default:  { bg: '7C3AED', fg: 'FFFFFF' },
};

function dishFallbackUrl(category: string, name: string, w = 400, h = 300) {
  const { bg, fg } = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default;
  const text = encodeURIComponent(name.slice(0, 20));
  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${bg}/\${fg}?text=\${text}\`;
}`,
      },
      {
        eyebrow: "Delivery app pattern",
        title: "Handle CDN images with unknown failure modes",
        body: [
          "Food delivery platforms source dish photos from restaurant operators, third-party photography services, and sometimes AI-generated assets. Each source has its own failure mode: the restaurant deletes the photo from their system, the CDN key expires, the image CDN returns a 404 for a renamed path. None of those failures are under your control.",
          "A universal fallback at the component level means none of those upstream failures ever produce a broken image icon. Wrap the img in a component, centralize the fallback URL construction, and never rely on individual restaurant systems being reliable.",
        ],
        code: `// DishPhoto.tsx
interface DishPhotoProps {
  src?: string;
  name: string;
  category: string;
  width?: number;
  height?: number;
}

export function DishPhoto({
  src,
  name,
  category,
  width = 400,
  height = 300,
}: DishPhotoProps) {
  const fallback = dishFallbackUrl(category, name, width, height);
  return (
    <img
      src={src ?? fallback}
      width={width}
      height={height}
      alt={name}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Animated option",
        title: "Use skeleton placeholders while photos load asynchronously",
        body: [
          "If your app fetches dish photo URLs from an API rather than embedding them in the initial HTML, there is a window where the component renders but the URL is not yet known. A skeleton placeholder is a better UX than a blank box during that window.",
          "The animated skeleton route produces a shimmer-effect SVG at any dimension. Show it while the data fetch is in-flight, then swap in the real photo or the static fallback based on what the API returns.",
        ],
        code: `<!-- Animated skeleton while data loads -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/400x300"
  width="400"
  height="300"
  alt="Loading dish photo"
/>`,
      },
      {
        eyebrow: "Internal links",
        title: "More on image fallback patterns",
        body: [
          "The patterns in this post apply to any image-heavy ecommerce context. The fallback.pics documentation covers the full API surface including color parameters, text truncation, and format options.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/food-menu-image-fallbacks/
https://fallback.pics/blog/cart-thumbnail-image-fallback/`,
      },
    ],
    takeaways: [
      "Missing dish photos cause measurable abandonment; a styled placeholder is always better than a broken icon.",
      "Set explicit width and height on every img element to prevent layout shift regardless of photo load state.",
      "Clear onerror before assigning the fallback src to prevent infinite error loops.",
      "Map food categories to placeholder colors so missing photos still communicate visual category.",
      "Use animated skeleton placeholders during async data fetches, then swap to static fallbacks or real photos.",
    ],
    related: [
      "food-menu-image-fallbacks",
      "cart-thumbnail-image-fallback",
      "fashion-apparel-catalog-placeholders",
    ],
  },
  // ─── 2 ───────────────────────────────────────────────────────────────────
  {
    title: "Subscription Box Product Preview Placeholders",
    description:
      "Keep subscription box product pages polished with subscription box image placeholders that fill slots before curated product photos are available.",
    slug: "subscription-box-preview-placeholders",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "subscription box images",
      "product preview placeholder",
      "subscription ecommerce",
      "image fallback",
      "ecommerce UX",
    ],
    summary: [
      "Subscription box pages present a timing problem: the products in next month's box are often finalized before the photography is ready. Teams routinely publish box reveal pages with placeholder slots and fill them over several days as photos arrive. Subscription box image placeholders make that gap invisible to customers.",
      "The fallback.pics API generates correctly sized, brand-colored placeholders from a URL. You can pre-wire the fallback endpoint into your product grid and swap in real photos progressively without any page deploys.",
    ],
    sections: [
      {
        eyebrow: "The reveal problem",
        title: "Subscription box reveals publish before photos are ready",
        body: [
          "The marketing timeline for a subscription box typically runs: product finalization → box build → photography → editing → upload → publish. In practice the last three steps compress into a 48-72 hour window while the reveal page is already live. Customers arrive during that window and see whatever the image slot shows.",
          "A broken image or a collapsed grid slot creates distrust at exactly the wrong moment—the first time a customer sees what they are paying for. A polished placeholder that matches the product category and box theme communicates care rather than incompleteness.",
          "The same problem recurs for gifting flows, add-on products, and limited edition items where the photo approval process takes longer than the product copy.",
        ],
      },
      {
        eyebrow: "Sizing guide",
        title: "Product preview image dimensions for subscription box pages",
        body: [
          "Box hero images showing the full curation typically render at 1200x800 or 1440x900. Individual product tiles in the 'what's in the box' grid are usually 400x400 (square) or 300x300. Product detail side panels use 600x600 or 800x800.",
          "For spoiler-protected reveals where the image is blurred until a date, use the blur route at the same dimensions. The blur communicates 'coming soon' rather than 'missing photo' and is appropriate for pre-reveal states.",
        ],
        code: `<!-- Box hero placeholder -->
<img
  src="https://fallback.pics/api/v1/1200x800/7C3AED/FFFFFF?text=Box+Preview"
  width="1200"
  height="800"
  alt="Subscription box contents preview placeholder"
/>

<!-- Product tile in the grid -->
<img
  src="https://fallback.pics/api/v1/square/400?text=Product+Photo"
  width="400"
  height="400"
  alt="Product photo placeholder"
/>

<!-- Pre-reveal blur state -->
<img
  src="https://fallback.pics/api/v1/blur/600x600/7C3AED/8B5CF6"
  width="600"
  height="600"
  alt="Reveal coming soon"
/>`,
      },
      {
        eyebrow: "Progressive fill",
        title: "Fill photo slots progressively without page deploys",
        body: [
          "Rather than setting the fallback in the img src directly, store the placeholder URL as the initial value in your CMS or database product record. When the real photo is ready, the CMS editor replaces it. No code deploy needed—just a content update.",
          "This pattern also works for headless CMS setups where the image field is nullable. Resolve a null or empty image field to the appropriate fallback URL at query time in your data layer rather than leaving the null to propagate into the component.",
        ],
        code: `// Contentful / Sanity data resolver
function resolveProductImage(imageUrl: string | null, productName: string): string {
  if (imageUrl) return imageUrl;
  const text = encodeURIComponent(productName.slice(0, 18));
  return \`https://fallback.pics/api/v1/400x400/7C3AED/FFFFFF?text=\${text}\`;
}`,
      },
      {
        eyebrow: "Box theme colors",
        title: "Match placeholder colors to box theme and branding",
        body: [
          "Subscription box brands invest heavily in color identity. A placeholder that clashes with the box color scheme draws attention to itself as a gap. Map your placeholder background to the box theme color and your visitors will read it as intentional.",
          "If you run themed boxes (monthly themes, seasonal editions), maintain a small color map per theme. This also makes the placeholder look deliberate in marketing screenshots and previews taken before photos are final.",
        ],
        code: `const BOX_THEME_COLORS: Record<string, string> = {
  spring: '10B981',
  summer: 'F97316',
  fall:   'B45309',
  winter: '3B82F6',
  default:'7C3AED',
};

function boxPlaceholder(theme: string, label: string, size = 400) {
  const bg = BOX_THEME_COLORS[theme] ?? BOX_THEME_COLORS.default;
  return \`https://fallback.pics/api/v1/square/\${size}/\${bg}/FFFFFF?text=\${encodeURIComponent(label)}\`;
}`,
      },
      {
        eyebrow: "Email previews",
        title: "Subscription box email placeholders for reveal campaigns",
        body: [
          "Reveal emails frequently go out before all product photos are ready for the box detail page. Email clients cache images aggressively—some providers cache the image at send time, not at open time. If you send with a placeholder URL, the cached version may persist even after you replace the real photo at the same URL.",
          "Use stable, unique placeholder URLs (with product slug or ID in the path) rather than generic dimension-only URLs. That way the email client caches a specific placeholder rather than a generic one, and when you swap the real image at the product-slug URL, the next open fetches the updated asset.",
        ],
      },
      {
        eyebrow: "React component",
        title: "ProductPreviewImage with reveal and fallback states",
        body: [
          "Subscription box pages often have three image states: blurred pre-reveal, placeholder post-reveal (photo not yet uploaded), and the real photo. A single component can handle all three states by reading a reveal date and a photo URL.",
        ],
        code: `interface ProductPreviewImageProps {
  src?: string;
  name: string;
  revealDate?: string; // ISO date
  theme?: string;
  size?: number;
}

export function ProductPreviewImage({
  src,
  name,
  revealDate,
  theme = 'default',
  size = 400,
}: ProductPreviewImageProps) {
  const isRevealed = !revealDate || new Date(revealDate) <= new Date();
  const blurSrc = \`https://fallback.pics/api/v1/blur/\${size}x\${size}/7C3AED/8B5CF6\`;
  const fallbackSrc = boxPlaceholder(theme, name, size);

  if (!isRevealed) {
    return <img src={blurSrc} width={size} height={size} alt="Coming soon" />;
  }

  return (
    <img
      src={src ?? fallbackSrc}
      width={size}
      height={size}
      alt={name}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackSrc;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Internal links",
        title: "Related fallback and placeholder patterns",
        body: [
          "The reveal pattern and progressive photo fill approach described here applies to any curated product experience. See the full API reference and related posts for more patterns.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fashion-apparel-catalog-placeholders/
https://fallback.pics/blog/blur-placeholder-loading-states/`,
      },
    ],
    takeaways: [
      "Subscription box reveals publish before photos are ready; a themed placeholder prevents broken image states during the gap.",
      "Match placeholder background to the box theme color so missing photos read as intentional design rather than a bug.",
      "Store the fallback URL as the initial CMS image field value and replace it when real photos arrive—no code deploy required.",
      "For pre-reveal states, use the blur route to communicate 'coming soon' rather than 'missing photo'.",
      "Use product-slug-specific placeholder URLs in emails to avoid aggressive client-side image caching issues.",
    ],
    related: [
      "fashion-apparel-catalog-placeholders",
      "blur-placeholder-loading-states",
      "cart-thumbnail-image-fallback",
    ],
  },
  // ─── 3 ───────────────────────────────────────────────────────────────────
  {
    title: "Dropshipping Catalog Image Fallback Strategy",
    description:
      "Handle missing and broken dropshipping product images with a URL-based fallback strategy that keeps catalogs polished when supplier photos are unavailable.",
    slug: "dropshipping-catalog-image-fallback",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "dropshipping product images",
      "catalog image fallback",
      "supplier photo missing",
      "image fallback",
      "ecommerce",
    ],
    summary: [
      "Dropshipping catalogs import product data from suppliers whose image assets are outside your control. Supplier CDN URLs expire, image hosts go offline, and products get imported before photos are added. Dropshipping product image fallbacks stop these upstream failures from surfacing as broken icons on your storefront.",
      "The fallback.pics API generates dimensioned placeholder images from a URL with no upload or processing required. Wire the fallback into your product data pipeline and every imported SKU renders with a consistent, brand-colored placeholder until a real photo is available.",
    ],
    sections: [
      {
        eyebrow: "The supplier dependency problem",
        title: "Dropshipping product images have three failure modes",
        body: [
          "First, the supplier imports a product without attaching a photo. Your catalog has a text description and a price but no image URL. If your template renders an empty src, browsers show the broken image icon.",
          "Second, the supplier attaches a photo URL that points to their own CDN. That CDN can go offline, rate-limit your domain, or return a 403 when your server fetches it. The URL exists in your data, but the image never loads.",
          "Third, the supplier updates the product photo by uploading a new file under a different path. The old URL still exists in your database but now returns a 404. Your catalog serves stale, broken image references until someone manually audits the catalog.",
        ],
      },
      {
        eyebrow: "Pipeline-level fix",
        title: "Resolve fallbacks in the data pipeline, not the template",
        body: [
          "Templates that handle fallbacks with onerror attributes work, but they push the logic to the browser. A better approach is to resolve fallback URLs at import time or at query time in your data layer. When you ingest a product from a supplier feed, check whether the image URL is present. If not, generate and store a fallback URL immediately.",
          "Storing the fallback URL in your database means it is available server-side for OG tags, email templates, sitemaps, and any other context that reads product data without running JavaScript.",
        ],
        code: `// Dropshipping import pipeline
interface SupplierProduct {
  sku: string;
  name: string;
  category: string;
  imageUrl?: string;
}

function resolveProductImage(product: SupplierProduct): string {
  if (product.imageUrl) return product.imageUrl;
  const text = encodeURIComponent(product.name.slice(0, 20));
  const bg = categoryColor(product.category);
  return \`https://fallback.pics/api/v1/600x600/\${bg}/FFFFFF?text=\${text}\`;
}

function categoryColor(category: string): string {
  const map: Record<string, string> = {
    electronics: '3B82F6',
    clothing:    '7C3AED',
    home:        '10B981',
    beauty:      'EC4899',
    toys:        'F59E0B',
  };
  return map[category.toLowerCase()] ?? '71717A';
}`,
      },
      {
        eyebrow: "onerror as safety net",
        title: "Add onerror on top of pipeline-resolved fallbacks",
        body: [
          "Even after resolving fallbacks at import time, the second and third failure modes can still surface: a valid supplier URL that worked at import time may later return a 404 or 403. Keep the onerror handler as a safety net that catches runtime failures the pipeline could not predict.",
          "With a pipeline-resolved fallback already stored in your database, the onerror handler can point to the same stored URL rather than generating it on the fly. This keeps the template logic simple.",
        ],
        code: `<!-- Template with stored fallback from DB -->
<img
  src="{{ product.image_url }}"
  width="600"
  height="600"
  alt="{{ product.name }}"
  onerror="this.onerror=null;this.src='{{ product.fallback_image_url }}'"
/>`,
      },
      {
        eyebrow: "Shopify dropshipping",
        title: "Shopify and DSers: handle empty metafield images",
        body: [
          "Shopify stores using DSers or similar dropshipping apps sync products from AliExpress or other supplier catalogs. When a product has no image, Shopify renders the store's default 'no image' placeholder—a gray box with a camera icon. You can override this by setting a featured_image metafield or by using a Liquid conditional in your theme.",
          "An easier approach for most themes is to intercept the image at the Liquid level and render a fallback.pics URL when the product image is nil.",
        ],
        code: `{%- liquid
  assign img_src = product.featured_image | img_url: '600x600'
  if img_src == blank
    assign img_src = 'https://fallback.pics/api/v1/600x600/7C3AED/FFFFFF?text=' | append: product.title | url_encode | truncate: 20
  endif
-%}
<img src="{{ img_src }}" width="600" height="600" alt="{{ product.title }}" />`,
      },
      {
        eyebrow: "WooCommerce",
        title: "WooCommerce dropshipping: filter woocommerce_placeholder_img_src",
        body: [
          "WooCommerce uses the woocommerce_placeholder_img_src filter to define the image that appears when a product has no photo. Rather than uploading a static placeholder to the media library, you can filter this value to return a fallback.pics URL dynamically.",
          "The advantage of a URL-based placeholder over a static uploaded image is that you can change the dimensions, colors, or text without re-uploading. The URL is the source of truth.",
        ],
        code: `// functions.php
add_filter('woocommerce_placeholder_img_src', function ($src) {
    return 'https://fallback.pics/api/v1/600x600/7C3AED/FFFFFF?text=No+Image';
});

// For product-specific placeholders in a loop
add_filter('woocommerce_product_get_image', function ($image, $product) {
    if (! $product->get_image_id() && ! $product->get_gallery_image_ids()) {
        $name = rawurlencode(substr($product->get_name(), 0, 20));
        return '<img src="https://fallback.pics/api/v1/600x600/7C3AED/FFFFFF?text=' . $name . '" width="600" height="600" alt="' . esc_attr($product->get_name()) . '" />';
    }
    return $image;
}, 10, 2);`,
      },
      {
        eyebrow: "Audit tooling",
        title: "Detect and repair broken supplier URLs in bulk",
        body: [
          "Beyond import-time resolution, run a periodic audit script that checks your product catalog for image URLs that now return non-200 status codes. Broken supplier URLs accumulate silently unless you actively monitor them. When the audit finds a broken URL, replace it with the stored fallback URL and queue the product for a photo request to the supplier.",
          "This is especially important for dropshipping catalogs with tens of thousands of SKUs where manual review is not feasible.",
        ],
        code: `// Simplified audit script (Node.js)
async function auditProductImages(products: Product[]) {
  const broken: string[] = [];
  for (const product of products) {
    if (!product.imageUrl) continue;
    try {
      const res = await fetch(product.imageUrl, { method: 'HEAD' });
      if (!res.ok) broken.push(product.sku);
    } catch {
      broken.push(product.sku);
    }
  }
  return broken;
}`,
      },
      {
        eyebrow: "Internal links",
        title: "More on ecommerce image fallback patterns",
        body: [
          "The pipeline-level resolution strategy described here combines well with CMS-specific fallback patterns and cart-level thumbnail handling.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/cart-thumbnail-image-fallback/
https://fallback.pics/blog/marketplace-listing-image-fallback/`,
      },
    ],
    takeaways: [
      "Dropshipping catalogs have three failure modes: no image URL at import, CDN going offline, and URL becoming stale—address all three.",
      "Resolve fallback URLs at import time and store them in your database so they are available server-side for OG tags and email templates.",
      "Keep onerror handlers as a safety net for runtime failures even after pipeline-level resolution.",
      "Use the woocommerce_placeholder_img_src filter to override the default WooCommerce placeholder with a dynamic URL.",
      "Run periodic audits to detect supplier image URLs that have gone stale and replace them in bulk.",
    ],
    related: [
      "cart-thumbnail-image-fallback",
      "marketplace-listing-image-fallback",
      "woocommerce-placeholder-image",
    ],
  },
  // ─── 4 ───────────────────────────────────────────────────────────────────
  {
    title: "B2B Wholesale Catalog Placeholders for PDF and Web",
    description:
      "Keep B2B wholesale catalog pages and PDF exports clean with b2b catalog placeholder images sized for product sheets, line sheets, and buyer portals.",
    slug: "b2b-wholesale-catalog-placeholders",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "b2b catalog placeholder",
      "wholesale product images",
      "line sheet placeholder",
      "image fallback",
      "b2b ecommerce",
    ],
    summary: [
      "B2B wholesale catalogs have a documentation problem: the product database often outpaces the photography workflow by weeks or months. Buyers reviewing a line sheet or a buyer portal expect to see every SKU represented visually. B2B catalog placeholder images fill those slots cleanly in both web portals and PDF exports.",
      "The fallback.pics API delivers correctly proportioned, label-bearing placeholder images from a URL—no upload, no processing. Drop the URL into your catalog template and every SKU renders with a professional placeholder until real photography arrives.",
    ],
    sections: [
      {
        eyebrow: "B2B context",
        title: "Why B2B catalogs need placeholder discipline more than B2C",
        body: [
          "B2C shoppers can scroll past a missing image and move on. Wholesale buyers are placing orders for dozens or hundreds of SKUs at once. A product with a missing image is a product they will skip in the order form. That has direct revenue impact per order, not just a bounce metric.",
          "Line sheets and trade show catalogs get exported to PDF and printed. A broken image in a PDF export is a hard failure—there is no onerror handler, no lazy loading, and no way to repair it after print. The placeholder must be embedded at render time.",
          "Buyer portals also get screenshotted, shared, and reviewed in meetings. A grid of broken image icons in a screenshot forwarded to a buyer's procurement team looks unprofessional regardless of product quality.",
        ],
      },
      {
        eyebrow: "Sizing guide",
        title: "Product image dimensions for wholesale catalogs and line sheets",
        body: [
          "Web buyer portals typically use 400x400 or 600x600 square images for product tiles. Product detail side panels go to 800x800. Line sheets exported to PDF use column-constrained images, usually 200x200 or 300x300 to keep file size manageable.",
          "For full-page category header images in a PDF export, use 1200x400 or 1440x300 wide-format placeholders. These communicate section breaks visually without being mistaken for product photos.",
        ],
        code: `<!-- Buyer portal product tile -->
<img
  src="https://fallback.pics/api/v1/square/400?text=SKU+12345"
  width="400"
  height="400"
  alt="Product SKU 12345 image placeholder"
/>

<!-- Line sheet PDF column image (200x200) -->
<img
  src="https://fallback.pics/api/v1/square/200?text=No+Photo"
  width="200"
  height="200"
  alt="Product photo pending"
/>

<!-- Category header in PDF export -->
<img
  src="https://fallback.pics/api/v1/1200x400/3B82F6/FFFFFF?text=Category+Header"
  width="1200"
  height="400"
  alt="Category header placeholder"
/>`,
      },
      {
        eyebrow: "PDF generation",
        title: "Embed fallback.pics URLs in PDF-generated catalogs",
        body: [
          "Most server-side PDF libraries (wkhtmltopdf, Puppeteer, WeasyPrint, Prince) resolve image URLs at render time. Fallback.pics URLs work in all of them because they are real HTTP URLs that return standard image responses. There is no authentication, no token, and no referrer restriction to configure.",
          "The key constraint for PDF exports is size. Avoid using SVG output in PDF generators that do not support inline SVG—request PNG or JPEG format by appending the extension to the URL.",
        ],
        code: `// Puppeteer PDF generation with fallback.pics URLs
const html = products.map(p => \`
  <div class="product-cell">
    <img
      src="\${p.imageUrl ?? \`https://fallback.pics/api/v1/300x300/3B82F6/FFFFFF.png?text=\${encodeURIComponent(p.sku)}\`}"
      width="300"
      height="300"
    />
    <p>\${p.name}</p>
    <p>\${p.sku}</p>
  </div>
\`).join('');

await page.setContent(\`<html><body>\${html}</body></html>\`);
const pdf = await page.pdf({ format: 'A4', printBackground: true });`,
      },
      {
        eyebrow: "SKU labels",
        title: "Display the SKU in the placeholder for easy catalog review",
        body: [
          "When a buyer reviews a catalog with placeholder images, they need to know which SKU needs photography. Embedding the SKU or a truncated product name in the placeholder text turns a visual gap into actionable information: the buyer's team can annotate exactly which products need photos before the next revision.",
          "Keep the text short—fallback.pics truncates long text automatically, but you should trim to 12-18 characters before encoding to guarantee clean display at small sizes.",
        ],
        code: `function skuPlaceholderUrl(sku: string, size = 400): string {
  const label = encodeURIComponent(sku.slice(0, 12));
  return \`https://fallback.pics/api/v1/square/\${size}/3B82F6/FFFFFF?text=\${label}\`;
}`,
      },
      {
        eyebrow: "Buyer portal",
        title: "Buyer portal grid with inline fallbacks and photo status badge",
        body: [
          "Buyer portals benefit from a visual indicator distinguishing placeholder images from real photos. A small badge overlay ('Photo Pending') communicates to the buyer that the image is temporary and a real photo will replace it. This prevents buyers from ordering based on a placeholder that might not represent the actual product color or style.",
        ],
        code: `// BuyerProductCard.tsx
export function BuyerProductCard({ product }: { product: Product }) {
  const fallbackSrc = \`https://fallback.pics/api/v1/square/400/3B82F6/FFFFFF?text=\${encodeURIComponent(product.sku.slice(0, 12))}\`;
  const hasRealPhoto = Boolean(product.imageUrl);

  return (
    <div className="relative">
      <img
        src={product.imageUrl ?? fallbackSrc}
        width={400}
        height={400}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackSrc;
        }}
      />
      {!hasRealPhoto && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded">
          Photo Pending
        </span>
      )}
    </div>
  );
}`,
      },
      {
        eyebrow: "Internal links",
        title: "More wholesale and catalog image patterns",
        body: [
          "See the full API reference for dimension, color, and format options. Related posts cover marketplace listing fallbacks and dropshipping catalog strategies.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/dropshipping-catalog-image-fallback/
https://fallback.pics/blog/marketplace-listing-image-fallback/`,
      },
    ],
    takeaways: [
      "Wholesale buyers skip products with missing images in order forms—B2B catalog placeholders have direct revenue impact.",
      "PDF line sheet exports have no onerror handler; the placeholder must be embedded at render time using a real HTTP image URL.",
      "Append .png or .jpg to fallback.pics URLs in PDF generators that do not support inline SVG.",
      "Embed the SKU in the placeholder text so catalog reviewers can identify which products need photography.",
      "Show a 'Photo Pending' badge overlay to distinguish placeholder images from real photos in buyer portals.",
    ],
    related: [
      "dropshipping-catalog-image-fallback",
      "marketplace-listing-image-fallback",
      "amazon-style-product-grid-placeholders",
    ],
  },
  // ─── 5 ───────────────────────────────────────────────────────────────────
  {
    title: "Amazon-Style Product Grid Placeholder Sizes",
    description:
      "Match Amazon product image size standards for grid and detail views using deterministic placeholder URLs that enforce correct aspect ratios before real photos arrive.",
    slug: "amazon-style-product-grid-placeholders",
    readTime: "7 min read",
    category: "Ecommerce",
    tags: [
      "amazon product image size",
      "product grid placeholder",
      "ecommerce image dimensions",
      "image fallback",
      "product listing",
    ],
    summary: [
      "Amazon enforces strict image size requirements: at least 1000 pixels on the longest side for zoom functionality, 500x500 minimum for category listings, and pure white backgrounds for main product images. Marketplaces and ecommerce platforms that mirror Amazon's standards need placeholder images that match these dimensions to avoid layout shifts when real photos arrive.",
      "The fallback.pics API generates any dimension on demand. You can produce Amazon-spec placeholders at 1000x1000, 500x500, or the responsive srcset sizes your listing grid uses—all from a URL with no upload required.",
    ],
    sections: [
      {
        eyebrow: "Amazon image specs",
        title: "Amazon product image size requirements you need to match",
        body: [
          "Amazon's main product image (MAIN) must be at least 1000px on the longest side and no less than 500px on the shortest. The recommended size is 1600x1600 or 2000x2000 for high-resolution zoom. The background must be pure white (RGB 255,255,255) with the product filling at least 85% of the image area.",
          "Swatch images (PT01–PT08) are square, typically served at 75x75 in thumbnail grids. Alternate lifestyle images can use any aspect ratio but are commonly 1500x1000 or 1200x900.",
          "If you are building a catalog import tool, a third-party marketplace, or an internal product PIM that feeds into Amazon, you need to validate and preview images at these exact dimensions before upload. Placeholders at the correct size let you validate layout without waiting for real photography.",
        ],
      },
      {
        eyebrow: "Placeholder sizes",
        title: "Generate Amazon-spec product image placeholders",
        body: [
          "Use pure white or near-white background colors to mirror Amazon's MAIN image background requirement. The fallback placeholder communicates 'photo coming' without misleading reviewers about the actual background.",
          "For internal tooling and import pipelines, use a neutral gray (F4F4F5) to distinguish the placeholder from a real white-background photo. For customer-facing pages, use white (FFFFFF) to avoid visual inconsistency when the real photo loads.",
        ],
        code: `<!-- Amazon MAIN product image placeholder (1000x1000) -->
<img
  src="https://fallback.pics/api/v1/square/1000/F4F4F5/71717A?text=Product+Photo"
  width="1000"
  height="1000"
  alt="Product image placeholder"
/>

<!-- Category grid tile (500x500) -->
<img
  src="https://fallback.pics/api/v1/square/500/F9FAFB/6B7280?text=No+Photo"
  width="500"
  height="500"
  alt="Product listing placeholder"
/>

<!-- Swatch thumbnail (75x75) -->
<img
  src="https://fallback.pics/api/v1/square/75/E5E7EB/9CA3AF"
  width="75"
  height="75"
  alt="Swatch placeholder"
/>

<!-- Lifestyle image (1200x900) -->
<img
  src="https://fallback.pics/api/v1/1200x900/F3F4F6/6B7280?text=Lifestyle+Photo"
  width="1200"
  height="900"
  alt="Lifestyle image placeholder"
/>`,
      },
      {
        eyebrow: "Responsive srcset",
        title: "Handle responsive product grids with srcset placeholders",
        body: [
          "Product listing grids are responsive. A product tile might render at 200px on mobile, 300px on tablet, and 400px on desktop. The placeholder needs to work at all three sizes without introducing layout shift at any breakpoint.",
          "You can either use a single large placeholder and rely on CSS max-width, or provide a srcset with multiple sizes. The fallback.pics URL is deterministic—the same URL always returns the same image—so srcset with multiple fallback.pics URLs works correctly.",
        ],
        code: `<img
  src="https://fallback.pics/api/v1/square/400/F4F4F5/71717A?text=No+Photo"
  srcset="
    https://fallback.pics/api/v1/square/200/F4F4F5/71717A?text=No+Photo 200w,
    https://fallback.pics/api/v1/square/300/F4F4F5/71717A?text=No+Photo 300w,
    https://fallback.pics/api/v1/square/400/F4F4F5/71717A?text=No+Photo 400w
  "
  sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
  width="400"
  height="400"
  alt="Product image placeholder"
/>`,
      },
      {
        eyebrow: "Import pipeline",
        title: "Validate image spec compliance before Amazon upload",
        body: [
          "If your workflow imports product data and uploads to Amazon, use placeholder images at the exact required dimensions to stress-test your upload pipeline before real photos are available. This catches dimension validation errors, aspect ratio rejections, and file size limits early.",
          "Generate placeholders at 2000x2000 (Amazon's recommended resolution for zoom) with a pure white background to run the full upload path end to end in a development environment.",
        ],
        code: `// Test Amazon image upload with placeholder
const testImageUrl =
  'https://fallback.pics/api/v1/square/2000/FFFFFF/AAAAAA.jpg?text=Test+SKU';

async function testAmazonUpload(sku: string) {
  const imageBuffer = await fetch(testImageUrl).then((r) => r.arrayBuffer());
  // Pass to your Amazon SP-API product image upload client
  await amazonClient.uploadProductImage({ sku, imageBuffer, imageType: 'MAIN' });
}`,
      },
      {
        eyebrow: "PIM integration",
        title: "Use placeholders in PIM systems during catalog enrichment",
        body: [
          "Product information management (PIM) tools like Akeneo and Pimcore display product data grids with image thumbnails. During a catalog import or enrichment workflow, many products have no image. Configuring the PIM to render a fallback.pics URL for empty image fields makes the enrichment grid usable before photography is complete.",
          "Filter on image field completeness to identify which products still need photos and export a list for the photography team.",
        ],
      },
      {
        eyebrow: "Internal links",
        title: "More product image placeholder patterns",
        body: [
          "The patterns here apply to any marketplace or product grid that enforces specific image dimensions. See the full API documentation for format and text options.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/b2b-wholesale-catalog-placeholders/
https://fallback.pics/blog/fashion-apparel-catalog-placeholders/`,
      },
    ],
    takeaways: [
      "Amazon requires product images at minimum 500x500 with 1000px recommended for zoom; generate placeholders at those exact dimensions.",
      "Use light gray (F4F4F5) for internal tooling placeholders and white (FFFFFF) for customer-facing pages to distinguish placeholder from real photo.",
      "Provide srcset-based placeholder sets for responsive product grids that render at multiple breakpoints.",
      "Use 2000x2000 white-background placeholders to stress-test Amazon upload pipelines before real photos are ready.",
      "Configure PIM systems to render fallback.pics URLs for empty image fields so catalog enrichment grids remain usable.",
    ],
    related: [
      "b2b-wholesale-catalog-placeholders",
      "fashion-apparel-catalog-placeholders",
      "srcset-responsive-placeholder-images",
    ],
  },
  // ─── 6 ───────────────────────────────────────────────────────────────────
  {
    title: "Empty State Images vs Placeholder Fallbacks in SaaS",
    description:
      "Understand when to use empty state images versus placeholder fallbacks in SaaS dashboards, and how to build both patterns with consistent URL-based images.",
    slug: "empty-state-images-vs-placeholders",
    readTime: "8 min read",
    category: "SaaS",
    tags: [
      "empty state images",
      "placeholder fallback",
      "SaaS UX",
      "image fallback",
      "dashboard design",
    ],
    summary: [
      "Empty states and image placeholders look similar but serve different purposes. An empty state communicates 'no data yet' and typically includes a call to action. A placeholder communicates 'content is coming' and holds space for an image that will appear. Confusing the two produces UX that either misleads users or fails to guide them.",
      "In practice, most SaaS applications need both patterns at different points in the user journey. Understanding which situation calls for which pattern—and having a consistent URL-based image source for both—simplifies implementation across the entire product.",
    ],
    sections: [
      {
        eyebrow: "Definitions",
        title: "Empty state images vs placeholder fallbacks: the distinction",
        body: [
          "An empty state image appears when a data model is genuinely empty: no team members, no uploaded files, no connected integrations. It is usually an illustration with explanatory text and a CTA button. The image is decorative and supplementary to the action you want the user to take.",
          "A placeholder fallback appears when content is expected but missing or loading: a product photo that has not been uploaded yet, an avatar that failed to load, a thumbnail while data fetches. The placeholder holds the space the real content will occupy and communicates 'this will be filled in'.",
          "The failure mode for confusing them: using an illustration-style empty state in a grid where real content will appear once uploaded makes users think the grid is disabled or broken. Using a simple placeholder in an onboarding wizard where you want users to take action fails to guide them.",
        ],
      },
      {
        eyebrow: "Pattern 1",
        title: "Empty state images with fallback.pics illustration-style URLs",
        body: [
          "Full illustration assets for empty states require design work. For early-stage SaaS or internal tools where design resources are constrained, branded placeholder images with appropriate text work as functional empty states while proper illustrations are in progress.",
          "The key is sizing and text. Empty state images are typically wide-format (400x300 or 600x400) and centered in the content area. The text should communicate the feature name, not just 'No Items'. Use a purple or brand-color background to distinguish the empty state from a broken image.",
        ],
        code: `<!-- Empty state in a file upload widget -->
<div class="empty-state">
  <img
    src="https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Files+Yet"
    width="400"
    height="300"
    alt="No files uploaded yet"
  />
  <p>Upload your first file to get started.</p>
  <button>Upload File</button>
</div>`,
      },
      {
        eyebrow: "Pattern 2",
        title: "Placeholder fallbacks for image slots that will be filled",
        body: [
          "When a data model has an image field that is empty or null, the slot in the UI needs to reserve the correct space. A neutral gray placeholder at the expected image dimensions prevents layout shift and communicates that the slot is an image container.",
          "Unlike empty states, placeholder fallbacks should not have a strong visual hierarchy—they should be subtle. Use muted colors (E5E7EB or F3F4F6) and minimal text so they recede visually and do not compete with populated content.",
        ],
        code: `<!-- Avatar placeholder (subtle, no strong color) -->
<img
  src="https://fallback.pics/api/v1/avatar/40?text=--"
  width="40"
  height="40"
  alt="User avatar placeholder"
/>

<!-- Team member card image slot -->
<img
  src="https://fallback.pics/api/v1/square/160/F3F4F6/9CA3AF?text=No+Photo"
  width="160"
  height="160"
  alt="Team member photo placeholder"
/>`,
      },
      {
        eyebrow: "When to use each",
        title: "Decision framework: which pattern for which situation",
        body: [
          "Use an empty state image when: the user has zero items in a collection and needs to take an action to add some; the absence is intentional and permanent until the user acts; and there is a primary CTA that makes sense to show alongside the image.",
          "Use a placeholder fallback when: a specific item exists in the data model but its image field is null or failed to load; the space will be filled by real content without the user doing anything; and the placeholder is one of many similar elements in a grid or list.",
          "The edge case is 'first run' onboarding where you want to show sample content. In that case, use real-looking placeholder images at the right dimensions—not empty state illustrations—so users understand what the populated state will look like.",
        ],
      },
      {
        eyebrow: "Onboarding sample content",
        title: "Seed onboarding views with realistic placeholder images",
        body: [
          "A dashboard that is entirely empty on first login gives users no mental model of what the product does. Seeding the first-run experience with sample data—including sample images—reduces time to activation. Use fallback.pics URLs as the image src for sample records so they render immediately without requiring any uploaded assets.",
          "Include an 'Example data' banner or badge on seeded records so users understand the difference between sample and real content.",
        ],
        code: `const sampleTeamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Designer',
    avatar: 'https://fallback.pics/api/v1/avatar/80?text=AJ',
  },
  {
    name: 'Sam Rivera',
    role: 'Engineer',
    avatar: 'https://fallback.pics/api/v1/avatar/80?text=SR',
  },
  {
    name: 'Morgan Lee',
    role: 'Product',
    avatar: 'https://fallback.pics/api/v1/avatar/80?text=ML',
  },
];`,
      },
      {
        eyebrow: "SaaS dark mode",
        title: "Dark mode considerations for empty states and placeholders",
        body: [
          "Light gray placeholders (F3F4F6) are invisible in dark mode where the background is also near-white. Maintain two placeholder URL sets—one for light mode, one for dark mode—or use a slightly higher-contrast neutral that works on both (27272A on dark, E4E4E7 on light).",
          "Empty state branded images with purple backgrounds (7C3AED) work well in both modes because the purple has sufficient contrast against both dark and light page backgrounds.",
        ],
        code: `function placeholderSrc(darkMode: boolean, label: string, size = 160) {
  const bg = darkMode ? '3F3F46' : 'F4F4F5';
  const fg = darkMode ? 'A1A1AA' : '71717A';
  return \`https://fallback.pics/api/v1/square/\${size}/\${bg}/\${fg}?text=\${encodeURIComponent(label)}\`;
}`,
      },
      {
        eyebrow: "Internal links",
        title: "Related SaaS image patterns",
        body: [
          "For more on onboarding-specific placeholder strategies and integration logo grids, see the related posts. The full API reference covers all dimension and color options.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/onboarding-screenshot-placeholders/
https://fallback.pics/blog/integration-logo-grid-placeholders/`,
      },
    ],
    takeaways: [
      "Empty states communicate 'no data—take action'; placeholders communicate 'content is coming'—confusing them produces misleading UX.",
      "Branded placeholder images at the correct dimensions work as functional empty states when proper illustrations are not yet available.",
      "Placeholder fallbacks should use muted colors so they recede visually and do not compete with real content.",
      "Seed first-run dashboards with sample records using fallback.pics URLs to give users a mental model of the populated state.",
      "Maintain dark mode placeholder variants with sufficient contrast against dark page backgrounds.",
    ],
    related: [
      "onboarding-screenshot-placeholders",
      "integration-logo-grid-placeholders",
      "chart-dashboard-thumbnail-placeholders",
    ],
  },
  // ─── 7 ───────────────────────────────────────────────────────────────────
  {
    title: "404 Page Image Placeholders That Match Your Brand",
    description:
      "Replace generic broken-image icons on 404 pages with branded 404 page image placeholders sized for your layout and colored to match your design system.",
    slug: "404-page-branded-image-placeholders",
    readTime: "6 min read",
    category: "UX Patterns",
    tags: [
      "404 page image",
      "branded placeholder",
      "error page design",
      "image fallback",
      "UX patterns",
    ],
    summary: [
      "A 404 page is a failure state, but it does not have to look like one. How your 404 page handles any images it displays—header illustrations, example content, product callouts—determines whether users feel like they landed in a professional product or a broken one. Branded 404 page image placeholders prevent the secondary failure of broken images on an already-failed page.",
      "The fallback.pics API lets you generate dimensioned, brand-colored image placeholders from a URL with no upload required. For 404 pages specifically, this means your illustration slot, your example product slot, and any decorative image can render with your brand palette even if no real asset exists.",
    ],
    sections: [
      {
        eyebrow: "The compounding failure problem",
        title: "A broken image on a 404 page compounds the error experience",
        body: [
          "Users who reach a 404 page are already in a recovery mode. The page exists to redirect them somewhere useful. If the 404 page itself has broken images—an illustration that fails to load, a featured product with no photo, a decorative background that returns a 404 of its own—the user's trust in the product drops further.",
          "This happens more often than expected. 404 page illustrations are often referenced via static asset paths that break during site restructuring. Decorative images in 404 templates get overlooked when CDN configurations change. Recommended product callouts on 404 pages point to image URLs from a CMS that may return null.",
        ],
      },
      {
        eyebrow: "Illustration slot",
        title: "Use a branded placeholder for the main 404 illustration",
        body: [
          "If you do not have a custom 404 illustration yet—or if the illustration asset is at risk of being unavailable (referenced from an external CDN, uploaded to a CMS that could be empty)—use a fallback.pics URL as the src or as an onerror fallback.",
          "A purple-on-white or dark-on-brand-color placeholder with text '404' or 'Page Not Found' reads as intentional and matches the brand palette rather than the browser's default broken image icon.",
        ],
        code: `<!-- Branded 404 illustration placeholder -->
<img
  src="/assets/404-illustration.svg"
  width="480"
  height="360"
  alt="Page not found illustration"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/480x360/7C3AED/FFFFFF?text=404'"
/>

<!-- Or use fallback.pics directly while illustration is in progress -->
<img
  src="https://fallback.pics/api/v1/480x360/7C3AED/FFFFFF?text=Page+Not+Found"
  width="480"
  height="360"
  alt="Page not found"
/>`,
      },
      {
        eyebrow: "Product callouts",
        title: "Recommended products on 404 pages need fallback images",
        body: [
          "A common pattern on ecommerce 404 pages is a 'You might like' or 'Popular products' section that shows a grid of product recommendations. These product images come from the same catalog that has all the normal image failure modes: null fields, broken CDN URLs, recently deleted photos.",
          "Apply the same onerror fallback pattern used in the main catalog. The 404 page product grid should be no more fragile than any other product grid on the site.",
        ],
        code: `<!-- Product callout on 404 page -->
{products.map(product => (
  <img
    key={product.id}
    src={product.imageUrl}
    width={200}
    height={200}
    alt={product.name}
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src =
        \`https://fallback.pics/api/v1/square/200/7C3AED/FFFFFF?text=\${encodeURIComponent(product.name.slice(0, 14))}\`;
    }}
  />
))}`,
      },
      {
        eyebrow: "Astro / Next.js",
        title: "Implement 404 page image fallbacks in Astro and Next.js",
        body: [
          "In Astro, the 404 page lives at src/pages/404.astro. Images in this file are static and should either be local assets or fallback.pics URLs. Do not reference CMS-hosted images in the 404 page without a runtime onerror fallback.",
          "In Next.js, the 404 page is pages/404.tsx or app/not-found.tsx. Use an img element with onerror rather than the next/image Image component for the main illustration slot—Image requires a configured domain whitelist, and fallback.pics may not be in it.",
        ],
        code: `// app/not-found.tsx (Next.js App Router)
export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-24">
      <img
        src="/images/404.svg"
        width={480}
        height={360}
        alt="Page not found"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            'https://fallback.pics/api/v1/480x360/7C3AED/FFFFFF?text=404';
        }}
      />
      <h1 className="mt-8 text-2xl font-bold">Page not found</h1>
      <a href="/" className="mt-4 text-purple-600 underline">Go home</a>
    </div>
  );
}`,
      },
      {
        eyebrow: "Brand matching",
        title: "Generate 404 placeholder colors from your design tokens",
        body: [
          "If your brand uses a specific primary color, pass the hex value directly in the fallback.pics URL. This produces placeholders that match your design system without any design work.",
          "For dark-mode 404 pages, use a lighter foreground on a darker background. For light-mode pages, a vibrant brand color background with white text reads cleanly and professionally.",
        ],
        code: `// Generate 404 placeholder URL from your brand token
const BRAND_PRIMARY = '7C3AED'; // your brand primary

export function get404ImageUrl(w = 480, h = 360): string {
  return \`https://fallback.pics/api/v1/\${w}x\${h}/\${BRAND_PRIMARY}/FFFFFF?text=404\`;
}`,
      },
      {
        eyebrow: "Internal links",
        title: "Related UX patterns and error state resources",
        body: [
          "For empty states and loading state patterns that complement 404 page design, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/empty-state-images-vs-placeholders/
https://fallback.pics/blog/onboarding-screenshot-placeholders/`,
      },
    ],
    takeaways: [
      "A broken image on a 404 page compounds user distrust—ensure every image slot on the error page has a reliable fallback.",
      "Use onerror on the 404 illustration src to catch CDN failures or missing asset paths without blocking the page layout.",
      "Product recommendation grids on 404 pages need the same fallback treatment as catalog grids.",
      "In Next.js App Router, use a plain img element for 404 illustrations to avoid next/image domain configuration requirements.",
      "Derive 404 placeholder colors from your brand tokens for a consistent, professional error page appearance.",
    ],
    related: [
      "empty-state-images-vs-placeholders",
      "onboarding-screenshot-placeholders",
      "broken-image-icon-to-branded-fallback-checklist",
    ],
  },
  // ─── 8 ───────────────────────────────────────────────────────────────────
  {
    title: "Onboarding Screenshot Placeholders for Product Tours",
    description:
      "Use onboarding screenshot placeholder images in product tours and feature walkthroughs to keep UI polished before real screenshots are captured or approved.",
    slug: "onboarding-screenshot-placeholders",
    readTime: "7 min read",
    category: "SaaS",
    tags: [
      "onboarding screenshot placeholder",
      "product tour images",
      "SaaS onboarding",
      "image fallback",
      "feature walkthrough",
    ],
    summary: [
      "Product tours and onboarding flows rely on screenshot images to show users what a feature looks like in context. During development, those screenshots do not yet exist. During redesigns, the old screenshots are wrong. Onboarding screenshot placeholder images fill those slots so the tour structure, copy, and pacing can be reviewed and tested before assets are ready.",
      "The fallback.pics API generates correctly sized, labeled placeholder images from a URL with no upload required. Drop them into your tour framework and your onboarding flow is fully previewable at any stage of product development.",
    ],
    sections: [
      {
        eyebrow: "The screenshot problem",
        title: "Product tour screenshots are almost always out of date",
        body: [
          "Screenshots in product tours decay faster than almost any other content asset. Every UI change—a button move, a layout update, a new sidebar item—makes the screenshot subtly wrong. Users notice when the highlighted area in the tour does not match the actual interface. That discrepancy breaks the trust the tour is trying to build.",
          "The practical consequence is that screenshot-heavy tours become an engineering bottleneck: before a redesign ships, someone has to re-capture, crop, annotate, and upload every screenshot in every tour flow. Teams that skip this step ship tours with outdated images and accept the resulting user confusion.",
          "Placeholder images do not solve the stale screenshot problem permanently, but they remove the blocker on launching a tour with correct structure, copy, and sequencing while screenshot production catches up.",
        ],
      },
      {
        eyebrow: "Standard dimensions",
        title: "Screenshot placeholder sizes for common tour frameworks",
        body: [
          "Intercom Product Tours typically use screenshots at 800x500 or 600x400. Appcues modal images render at 480x320 or 600x400. Shepherd.js tooltip attachments use smaller images around 400x250. Full-page overlays in frameworks like Intro.js or UserPilot can go up to 1200x700.",
          "For screenshot placeholders, use a background color that represents the UI context: light blue or gray for product dashboards, purple for analytics views, green for success states.",
        ],
        code: `<!-- Intercom-style tour screenshot placeholder -->
<img
  src="https://fallback.pics/api/v1/800x500/EFF6FF/3B82F6?text=Feature+Screenshot"
  width="800"
  height="500"
  alt="Feature screenshot placeholder"
/>

<!-- Appcues modal image -->
<img
  src="https://fallback.pics/api/v1/600x400/F5F3FF/7C3AED?text=Step+2+Screenshot"
  width="600"
  height="400"
  alt="Onboarding step screenshot placeholder"
/>

<!-- Shepherd.js tooltip image -->
<img
  src="https://fallback.pics/api/v1/400x250/F0FDF4/10B981?text=New+Feature"
  width="400"
  height="250"
  alt="New feature screenshot placeholder"
/>`,
      },
      {
        eyebrow: "Step labeling",
        title: "Label placeholders with step number and feature name",
        body: [
          "During internal review of a product tour, reviewers need to know which placeholder corresponds to which step. Embed the step number and feature name in the placeholder text so the tour structure is legible even without real screenshots.",
          "Keep labels short: 'Step 1: Dashboard', 'Step 2: Reports', 'Step 3: Export'. This also helps QA testers verify that the correct screenshot appears in each slot once real assets are uploaded.",
        ],
        code: `const tourSteps = [
  {
    target: '#dashboard-btn',
    title: 'Your Dashboard',
    image: 'https://fallback.pics/api/v1/800x500/EFF6FF/3B82F6?text=Step+1+Dashboard',
    content: 'Get an overview of all your key metrics at a glance.',
  },
  {
    target: '#reports-btn',
    title: 'Reports',
    image: 'https://fallback.pics/api/v1/800x500/F5F3FF/7C3AED?text=Step+2+Reports',
    content: 'Drill into the data that matters to your team.',
  },
  {
    target: '#export-btn',
    title: 'Export',
    image: 'https://fallback.pics/api/v1/800x500/F0FDF4/10B981?text=Step+3+Export',
    content: 'Download reports in CSV, PDF, or directly to Google Sheets.',
  },
];`,
      },
      {
        eyebrow: "CMS-driven tours",
        title: "CMS-managed tour assets with fallback URLs",
        body: [
          "If your product tour content is managed in a CMS (Contentful, Sanity, Notion API), the image field may be null for steps that have not yet been designed. Resolve null image fields to fallback.pics URLs at query time rather than letting nulls reach the tour renderer.",
          "This means your tour framework always receives a valid image URL and never needs to handle the null case at the component level.",
        ],
        code: `// Contentful tour step resolver
function resolveTourStepImage(step: ContentfulTourStep): string {
  if (step.screenshot?.url) return step.screenshot.url;
  const label = encodeURIComponent(\`Step \${step.order}: \${step.featureName.slice(0, 12)}\`);
  return \`https://fallback.pics/api/v1/800x500/EFF6FF/3B82F6?text=\${label}\`;
}`,
      },
      {
        eyebrow: "Design review",
        title: "Use placeholders in Figma handoff for tour frame annotation",
        body: [
          "During design handoff, Figma frames for product tours often contain placeholder images rather than real screenshots. Using fallback.pics URLs in the Figma frame's image embed means the designer, engineer, and PM are all looking at the same dimensioned placeholder in all contexts: Figma, staging, and production.",
          "When real screenshots are ready, replacing the URL in Figma and in the code is a single coordinated update rather than a hunt across multiple asset systems.",
        ],
      },
      {
        eyebrow: "A/B testing tours",
        title: "Placeholder-first tour development accelerates A/B test setup",
        body: [
          "If you A/B test onboarding flows, the variant tour needs images just as much as the control. With placeholder-first development, you can launch both variants with the same placeholder images and measure conversion differences before investing in variant-specific screenshot production.",
          "Only produce custom screenshots for variants that show statistically significant conversion lift. This avoids wasted design effort on underperforming variants.",
        ],
      },
      {
        eyebrow: "Internal links",
        title: "Related SaaS image and onboarding patterns",
        body: [
          "For file upload preview fallbacks and integration logo grids that appear in onboarding flows, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/empty-state-images-vs-placeholders/
https://fallback.pics/blog/file-upload-preview-fallbacks/`,
      },
    ],
    takeaways: [
      "Product tour screenshots decay with every UI change; placeholder-first development lets you launch tours before screenshot production catches up.",
      "Label placeholders with step number and feature name so tour structure is legible during internal review without real screenshots.",
      "Resolve null image fields from CMS-managed tour content to fallback.pics URLs at query time, not at the component level.",
      "Match placeholder background colors to the feature context (blue for dashboards, purple for analytics, green for success states).",
      "Use placeholders in A/B test variants and only invest in custom screenshots for variants that show conversion lift.",
    ],
    related: [
      "empty-state-images-vs-placeholders",
      "file-upload-preview-fallbacks",
      "integration-logo-grid-placeholders",
    ],
  },
  // ─── 9 ───────────────────────────────────────────────────────────────────
  {
    title: "File Upload Preview Fallbacks Before Upload Completes",
    description:
      "Show file upload preview placeholder images while files are uploading or when file types cannot be previewed, using URL-based fallbacks that match file type context.",
    slug: "file-upload-preview-fallbacks",
    readTime: "7 min read",
    category: "SaaS",
    tags: [
      "file upload preview placeholder",
      "upload preview fallback",
      "file type placeholder",
      "image fallback",
      "SaaS UX",
    ],
    summary: [
      "File upload UIs show preview thumbnails to confirm what the user selected. For image files, this preview is usually a local object URL. For non-image files—PDFs, spreadsheets, video—or while an upload is in progress, the preview slot needs a placeholder that communicates file type rather than showing a broken image icon.",
      "The fallback.pics API generates correctly sized, labeled placeholder images from a URL. Map each file type to a colored placeholder that communicates context, and your upload preview UI handles all file types consistently.",
    ],
    sections: [
      {
        eyebrow: "Why it matters",
        title: "Upload preview failure modes that leave users confused",
        body: [
          "There are four common failure modes in file upload preview UIs. First, the user selects a non-image file type (PDF, DOCX, XLSX) and the template tries to render it as an img src, producing a broken icon. Second, the upload is in progress and there is no preview URL yet—the placeholder renders nothing until the upload completes.",
          "Third, the file is an image but the local FileReader API fails (common on iOS for certain HEIC/HEIF formats) and the preview errors. Fourth, after upload the server returns a CDN URL for the file, but the CDN propagation delay means the URL returns a 404 for the first few seconds.",
          "All four of these produce the same result: a broken image icon in the preview slot. A typed placeholder—different for PDF, spreadsheet, video, image—prevents all four failure modes from surfacing as broken UI.",
        ],
      },
      {
        eyebrow: "File type placeholders",
        title: "Map file types to colored placeholder URLs",
        body: [
          "Assign a color by file type so the placeholder communicates context: red for documents, green for spreadsheets, blue for PDFs, orange for video, gray for unknown types. The type label in the placeholder text (PDF, XLS, MP4) gives additional context at a glance.",
          "These placeholders serve as the default src for all non-image file types and as the onerror fallback for image uploads that fail to generate a local preview.",
        ],
        code: `const FILE_TYPE_PLACEHOLDERS: Record<string, string> = {
  pdf:   'https://fallback.pics/api/v1/200x200/EF4444/FFFFFF?text=PDF',
  doc:   'https://fallback.pics/api/v1/200x200/3B82F6/FFFFFF?text=DOC',
  docx:  'https://fallback.pics/api/v1/200x200/3B82F6/FFFFFF?text=DOCX',
  xls:   'https://fallback.pics/api/v1/200x200/10B981/FFFFFF?text=XLS',
  xlsx:  'https://fallback.pics/api/v1/200x200/10B981/FFFFFF?text=XLSX',
  csv:   'https://fallback.pics/api/v1/200x200/10B981/FFFFFF?text=CSV',
  mp4:   'https://fallback.pics/api/v1/200x200/F97316/FFFFFF?text=MP4',
  mov:   'https://fallback.pics/api/v1/200x200/F97316/FFFFFF?text=MOV',
  zip:   'https://fallback.pics/api/v1/200x200/8B5CF6/FFFFFF?text=ZIP',
  default: 'https://fallback.pics/api/v1/200x200/71717A/FFFFFF?text=FILE',
};

function filePlaceholder(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'default';
  return FILE_TYPE_PLACEHOLDERS[ext] ?? FILE_TYPE_PLACEHOLDERS.default;
}`,
      },
      {
        eyebrow: "In-progress state",
        title: "Animated skeleton placeholder while upload is in progress",
        body: [
          "While a file is uploading, neither the local preview nor the CDN URL is ready. Show an animated skeleton placeholder during the upload. Once the upload completes, swap in the local preview URL (for images) or the file type placeholder (for non-images).",
          "The animated skeleton communicates active progress rather than an empty or broken state. Pair it with a progress indicator for large files.",
        ],
        code: `<!-- Animated skeleton during upload -->
<img
  src="https://fallback.pics/api/v1/animated/skeleton/200x200"
  width="200"
  height="200"
  alt="Uploading file"
/>`,
      },
      {
        eyebrow: "React component",
        title: "FilePreview component with upload state and type fallbacks",
        body: [
          "A single FilePreview component can handle all four failure modes. It tracks upload state, reads the file extension for type detection, and generates the appropriate placeholder URL for each state.",
        ],
        code: `interface FilePreviewProps {
  file: File;
  uploadState: 'pending' | 'uploading' | 'complete' | 'error';
  uploadedUrl?: string;
}

export function FilePreview({ file, uploadState, uploadedUrl }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const [localSrc, setLocalSrc] = useState<string | null>(null);
  const typePlaceholder = filePlaceholder(file.name);
  const skeletonSrc = 'https://fallback.pics/api/v1/animated/skeleton/200x200';

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setLocalSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  if (uploadState === 'uploading') {
    return <img src={skeletonSrc} width={200} height={200} alt="Uploading" />;
  }

  const src = uploadState === 'complete' && uploadedUrl
    ? uploadedUrl
    : (isImage && localSrc) ? localSrc : typePlaceholder;

  return (
    <img
      src={src}
      width={200}
      height={200}
      alt={file.name}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = typePlaceholder;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "CDN propagation delay",
        title: "Handle CDN propagation delay after upload completes",
        body: [
          "After a file upload completes and the server returns a CDN URL, the file may not yet be available at that URL if CDN propagation is still in progress. An img element pointing at the CDN URL immediately after upload may produce a brief 404.",
          "Show the local preview or file type placeholder for a brief window after upload completion and only swap to the CDN URL after a short delay—or after confirming the CDN URL is reachable with a HEAD request.",
        ],
        code: `async function waitForCdnUrl(url: string, retries = 5): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return true;
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  return false;
}`,
      },
      {
        eyebrow: "Internal links",
        title: "Related upload and attachment patterns",
        body: [
          "For attachment preview patterns in support tools and related SaaS image handling, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/support-ticket-attachment-preview/
https://fallback.pics/blog/onboarding-screenshot-placeholders/`,
      },
    ],
    takeaways: [
      "Four failure modes affect upload previews: non-image file type, upload in progress, FileReader failure on mobile, and CDN propagation delay—cover all four.",
      "Map file extensions to colored type placeholders (red for docs, green for sheets, blue for PDF) so non-image files have recognizable icons.",
      "Use the animated skeleton placeholder during active upload progress rather than a static placeholder.",
      "Revoke object URLs created with URL.createObjectURL to prevent memory leaks in React upload components.",
      "Confirm CDN URL availability with a HEAD request before swapping from local preview to CDN URL to avoid 404 flashes.",
    ],
    related: [
      "support-ticket-attachment-preview",
      "onboarding-screenshot-placeholders",
      "animated-skeleton-placeholder-url",
    ],
  },
  // ─── 10 ──────────────────────────────────────────────────────────────────
  {
    title: "Integration Logo Grid Placeholders in App Marketplaces",
    description:
      "Keep integration marketplace grids polished with integration logo placeholder images for third-party app logos that are missing, loading, or pending partner submission.",
    slug: "integration-logo-grid-placeholders",
    readTime: "7 min read",
    category: "SaaS",
    tags: [
      "integration logo placeholder",
      "app marketplace grid",
      "partner logo fallback",
      "image fallback",
      "SaaS integrations",
    ],
    summary: [
      "Integration marketplaces display grids of partner logos from dozens or hundreds of third-party services. Logo submissions are inconsistent: some partners submit high-quality SVGs, others submit JPEGs with white backgrounds, and some submit nothing at all. Integration logo placeholder images handle the gap between an integration going live in the database and a polished logo asset being available.",
      "The fallback.pics API generates correctly sized, monogram-style placeholder logos from a URL. For any integration where a real logo is unavailable, the API can generate a placeholder with the first two letters of the integration name—similar to an avatar placeholder—that keeps the grid visually consistent.",
    ],
    sections: [
      {
        eyebrow: "Why logo grids break",
        title: "Integration logo grid failure modes",
        body: [
          "The first failure mode is the missing logo: an integration is added to the database before the partner submits a logo. The grid has a slot for it but no image. If the template renders an empty src, the broken image icon appears in the grid.",
          "The second failure mode is the expired logo URL: a partner updates their brand and removes the old logo from their CDN without notifying your team. Your database still has the old URL, which now returns a 404.",
          "The third is the wrong-size logo: a partner submits a wide banner logo (e.g., 400x120) for a square tile grid (64x64). Without server-side normalization, the image renders with incorrect aspect ratio or overflows its container.",
        ],
      },
      {
        eyebrow: "Placeholder sizing",
        title: "Standard integration logo dimensions for marketplace grids",
        body: [
          "Integration marketplace tiles most commonly use square logos. Small grid tiles are 40x40 or 48x48. Medium cards use 64x64 or 80x80. Large feature tiles use 120x120. Details pages or sidebars sometimes show 160x160.",
          "For horizontal list views (integration name + logo in a table row), logos appear at 32x32 or 40x40. Always set explicit width and height to prevent layout shift.",
        ],
        code: `<!-- Small tile logo (48x48) -->
<img
  src="https://fallback.pics/api/v1/avatar/48?text=SF"
  width="48"
  height="48"
  alt="Salesforce integration logo placeholder"
/>

<!-- Medium card logo (80x80) -->
<img
  src="https://fallback.pics/api/v1/square/80/3B82F6/FFFFFF?text=HB"
  width="80"
  height="80"
  alt="HubSpot integration logo placeholder"
/>

<!-- Feature tile (120x120) -->
<img
  src="https://fallback.pics/api/v1/square/120/7C3AED/FFFFFF?text=SL"
  width="120"
  height="120"
  alt="Slack integration logo placeholder"
/>`,
      },
      {
        eyebrow: "Monogram generation",
        title: "Generate monogram placeholders from integration names",
        body: [
          "The avatar route with a two-letter initials parameter produces a monogram that serves as a recognizable identifier for the integration even without a real logo. Take the first letter of each word in the integration name (Salesforce → SF, HubSpot → HS, Google Sheets → GS).",
          "Assign a consistent color per integration by hashing the integration name to a color index. This ensures the same integration always gets the same placeholder color—important for recognition across sessions and devices.",
        ],
        code: `const PLACEHOLDER_COLORS = [
  '7C3AED', '3B82F6', '10B981', 'F97316',
  'EC4899', 'EAB308', '14B8A6', '6366F1',
];

function integrationInitials(name: string): string {
  return name
    .split(/\\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function integrationPlaceholderUrl(name: string, size = 80): string {
  const initials = integrationInitials(name);
  const colorIndex = name.charCodeAt(0) % PLACEHOLDER_COLORS.length;
  const bg = PLACEHOLDER_COLORS[colorIndex];
  return \`https://fallback.pics/api/v1/avatar/\${size}/\${bg}/FFFFFF?text=\${initials}\`;
}`,
      },
      {
        eyebrow: "onerror pattern",
        title: "Fallback to monogram when real logo fails to load",
        body: [
          "Even for integrations that have submitted logos, keep the onerror fallback active to handle CDN failures and expired URLs. Generate the monogram placeholder at the same size as the real logo so there is no layout shift when the fallback triggers.",
        ],
        code: `function IntegrationLogo({
  integration,
  size = 80,
}: {
  integration: { name: string; logoUrl?: string };
  size?: number;
}) {
  const fallback = integrationPlaceholderUrl(integration.name, size);
  return (
    <img
      src={integration.logoUrl ?? fallback}
      width={size}
      height={size}
      alt={\`\${integration.name} logo\`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}`,
      },
      {
        eyebrow: "Partner submission flow",
        title: "Display placeholder during partner logo review",
        body: [
          "If your marketplace has a partner logo submission and review workflow, the integration may go live before the submitted logo clears your review queue. Display the monogram placeholder in the 'pending review' state and swap in the real logo only after it passes review.",
          "This is preferable to hiding the integration from the grid until review completes—a missing entry is more confusing than a placeholder entry.",
        ],
        code: `// Integration with logo review state
function logoSrc(integration: Integration): string {
  if (integration.logoStatus === 'approved' && integration.logoUrl) {
    return integration.logoUrl;
  }
  return integrationPlaceholderUrl(integration.name);
}`,
      },
      {
        eyebrow: "Dark mode",
        title: "Dark mode logo grid considerations",
        body: [
          "Real partner logos often have transparent backgrounds designed for light mode. On a dark background they appear as white-border-free logos that may be nearly invisible. A monogram placeholder with an opaque colored background avoids this entirely.",
          "Consider normalizing all partner logos server-side to add an opaque background before serving them, or maintain separate dark-mode logo variants. Until you have that infrastructure, the monogram placeholder is the safest option for dark mode.",
        ],
      },
      {
        eyebrow: "Internal links",
        title: "Related SaaS image and logo patterns",
        body: [
          "For related patterns on onboarding flows that feature integration logos, see the connected posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/onboarding-screenshot-placeholders/
https://fallback.pics/blog/empty-state-images-vs-placeholders/`,
      },
    ],
    takeaways: [
      "Integration logo grids break in three ways: missing logo, expired CDN URL, and wrong-aspect-ratio submission—cover all three with a monogram fallback.",
      "Generate consistent monogram placeholders from integration names by extracting two-letter initials and hashing the name to a color.",
      "Use the avatar route for circular logo tiles and the square route for card-style logo containers.",
      "Keep onerror active even for integrations with submitted logos to handle CDN failures and URL expiration.",
      "Display monogram placeholders for integrations pending logo review rather than hiding them from the grid.",
    ],
    related: [
      "onboarding-screenshot-placeholders",
      "empty-state-images-vs-placeholders",
      "job-board-logo-avatar-fallbacks",
    ],
  },
  // ─── 11 ──────────────────────────────────────────────────────────────────
  {
    title: "Support Ticket Attachment Preview Fallbacks",
    description:
      "Handle broken and unpreviewable attachments in support ticket systems with typed attachment preview placeholder images that communicate file type without a broken icon.",
    slug: "support-ticket-attachment-preview",
    readTime: "6 min read",
    category: "SaaS",
    tags: [
      "attachment preview placeholder",
      "support ticket images",
      "file attachment fallback",
      "image fallback",
      "SaaS support tools",
    ],
    summary: [
      "Support ticket systems display attachment thumbnails inline in the conversation thread. When an attachment is a non-image file or a broken image URL, the default broken image icon is unhelpful—it gives the support agent no information about what the customer attached. Attachment preview placeholder images replace the broken icon with a type-aware visual that communicates file format at a glance.",
      "The fallback.pics API generates file-type labeled placeholder images from a URL. Map each MIME type or file extension to a colored placeholder and your support UI handles every attachment type consistently.",
    ],
    sections: [
      {
        eyebrow: "The broken attachment problem",
        title: "Why support ticket attachment previews break",
        body: [
          "Support ticket systems receive files from customers over email, web forms, and mobile apps. The file types are unpredictable: PDFs, screenshots, log files, spreadsheets, recordings, archives. Many support tools try to render all attachments as img elements and fall back to a broken icon for anything that is not a browser-renderable image format.",
          "A second failure mode is URL expiration. Most support platforms store attachments in object storage with signed URLs that expire after a period. If an agent revisits an old ticket, attachment URLs from 90+ days ago may be expired, producing 404 responses for every thumbnail.",
          "Both failure modes produce the same broken icon. A type-aware placeholder replaces the broken icon with useful information.",
        ],
      },
      {
        eyebrow: "Type mapping",
        title: "File type to placeholder color and label mapping",
        body: [
          "A small mapping from MIME type or file extension to placeholder URL provides the foundation for type-aware attachment previews. Use distinct colors that agents can learn to recognize at a glance: red for documents, green for spreadsheets, blue for PDFs, orange for videos, yellow for archives.",
        ],
        code: `const ATTACHMENT_PLACEHOLDERS: Record<string, string> = {
  'application/pdf':
    'https://fallback.pics/api/v1/120x120/EF4444/FFFFFF?text=PDF',
  'application/msword':
    'https://fallback.pics/api/v1/120x120/3B82F6/FFFFFF?text=DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'https://fallback.pics/api/v1/120x120/3B82F6/FFFFFF?text=DOCX',
  'application/vnd.ms-excel':
    'https://fallback.pics/api/v1/120x120/10B981/FFFFFF?text=XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'https://fallback.pics/api/v1/120x120/10B981/FFFFFF?text=XLSX',
  'text/csv':
    'https://fallback.pics/api/v1/120x120/10B981/FFFFFF?text=CSV',
  'video/mp4':
    'https://fallback.pics/api/v1/120x120/F97316/FFFFFF?text=MP4',
  'application/zip':
    'https://fallback.pics/api/v1/120x120/8B5CF6/FFFFFF?text=ZIP',
  'text/plain':
    'https://fallback.pics/api/v1/120x120/71717A/FFFFFF?text=TXT',
  default:
    'https://fallback.pics/api/v1/120x120/71717A/FFFFFF?text=FILE',
};

function attachmentPlaceholder(mimeType: string): string {
  return ATTACHMENT_PLACEHOLDERS[mimeType] ?? ATTACHMENT_PLACEHOLDERS.default;
}`,
      },
      {
        eyebrow: "Render pattern",
        title: "AttachmentPreview component for support UIs",
        body: [
          "The component logic is: if the attachment is an image MIME type, render with src and an onerror fallback. If it is any other type, render the type placeholder directly as the src. Never try to render a PDF or DOCX as an img src.",
        ],
        code: `interface AttachmentPreviewProps {
  url: string;
  mimeType: string;
  filename: string;
  size?: number;
}

export function AttachmentPreview({
  url,
  mimeType,
  filename,
  size = 120,
}: AttachmentPreviewProps) {
  const isImage = mimeType.startsWith('image/');
  const placeholder = attachmentPlaceholder(mimeType);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title={filename}>
      <img
        src={isImage ? url : placeholder}
        width={size}
        height={size}
        alt={filename}
        onError={
          isImage
            ? (e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }
            : undefined
        }
      />
    </a>
  );
}`,
      },
      {
        eyebrow: "Expired URLs",
        title: "Handle expired signed storage URLs in old tickets",
        body: [
          "When an agent opens an old ticket, the attachment URL may have expired. Rather than showing broken icons throughout the conversation, detect the 404 at component mount and replace with a type placeholder proactively.",
          "A HEAD request at mount time catches expired URLs before the img element tries to load them, preventing the brief broken-icon flash that onerror-only approaches produce.",
        ],
        code: `function useAttachmentSrc(url: string, mimeType: string) {
  const [src, setSrc] = useState(
    mimeType.startsWith('image/') ? url : attachmentPlaceholder(mimeType)
  );

  useEffect(() => {
    if (!mimeType.startsWith('image/')) return;
    fetch(url, { method: 'HEAD' }).then((res) => {
      if (!res.ok) setSrc(attachmentPlaceholder(mimeType));
    });
  }, [url, mimeType]);

  return src;
}`,
      },
      {
        eyebrow: "Zendesk / Intercom",
        title: "Custom attachment rendering in Zendesk and Intercom apps",
        body: [
          "Both Zendesk Apps Framework and Intercom App Kit allow custom rendering of ticket attachment areas. If you are building a support sidebar app, you can override the default attachment preview with your own component and apply the type-aware placeholder logic.",
          "For Zendesk, use the ticket.comment.attachments API to get MIME types and URLs. For Intercom, the conversation.parts[].attachments array provides the same data. Both give you enough information to apply the file type mapping.",
        ],
      },
      {
        eyebrow: "Internal links",
        title: "Related file preview and attachment patterns",
        body: [
          "For the file upload preview pattern that precedes the attachment thumbnail in the workflow, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/file-upload-preview-fallbacks/
https://fallback.pics/blog/integration-logo-grid-placeholders/`,
      },
    ],
    takeaways: [
      "Never render non-image MIME types as img src—use a file type placeholder directly instead of attempting to render and catching the error.",
      "Map MIME types to distinct colored placeholder images so support agents recognize file formats without reading the filename.",
      "Detect expired signed storage URLs with a HEAD request at component mount to avoid brief broken-icon flashes in old tickets.",
      "Both Zendesk and Intercom provide MIME type data in their attachment APIs, enabling type-aware placeholder rendering in sidebar apps.",
      "Keep the onerror handler active for image MIME types to handle CDN failures and encoding errors.",
    ],
    related: [
      "file-upload-preview-fallbacks",
      "integration-logo-grid-placeholders",
      "status-page-banner-fallbacks",
    ],
  },
  // ─── 12 ──────────────────────────────────────────────────────────────────
  {
    title: "Status Page and Incident Banner Image Fallbacks",
    description:
      "Prevent broken images on status pages and incident banners using deterministic status page image fallbacks that render correctly even under infrastructure stress.",
    slug: "status-page-banner-fallbacks",
    readTime: "7 min read",
    category: "SaaS",
    tags: [
      "status page images",
      "incident banner placeholder",
      "status page design",
      "image fallback",
      "SaaS reliability",
    ],
    summary: [
      "Status pages are viewed precisely when your infrastructure is under stress. If your status page logo, incident banner, or service icon depends on a CDN or image host that is affected by the incident, the images break exactly when users are most anxious. Status page image fallbacks decouple the visual presentation of your status page from the availability of your primary image infrastructure.",
      "The fallback.pics API operates on Cloudflare's global edge network independently of your application infrastructure. Using fallback.pics URLs for status page images means they remain available even when your own CDN or application server is degraded.",
    ],
    sections: [
      {
        eyebrow: "The irony problem",
        title: "Status page images break during the incidents they describe",
        body: [
          "The most common cause of broken status page images is that the status page and the application share the same image CDN. During an S3 outage, a CloudFront degradation, or a Cloudinary incident, your application goes down and so does the image CDN that serves your status page logo and incident banners.",
          "This is a design smell, not bad luck. A status page should be deployed on infrastructure completely separate from the application it monitors. Images are part of that infrastructure dependency—they should be sourced from a service with independent uptime.",
          "Fallback.pics runs on Cloudflare Workers and edges, not on the same origin as your application. Referencing fallback.pics URLs for status page images means your visual assets have a separate availability dependency from your application assets.",
        ],
      },
      {
        eyebrow: "Status page images",
        title: "What images appear on status pages and need fallbacks",
        body: [
          "The main images on a status page are: the company logo in the header, service component icons (database icon, API icon, CDN icon), incident banner images (if used for severity), and the favicon.",
          "Logo and service icons are the most critical. If those break during an incident, the page looks unbranded and untrustworthy at precisely the wrong moment. Incident banners are lower priority but should still have fallbacks.",
        ],
        code: `<!-- Status page header logo with fallback -->
<img
  src="/static/logo.svg"
  width="160"
  height="40"
  alt="Acme Status"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/160x40/7C3AED/FFFFFF?text=Acme+Status'"
/>

<!-- Service component icon -->
<img
  src="/static/icons/api.svg"
  width="32"
  height="32"
  alt="API service icon"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/32/3B82F6/FFFFFF?text=API'"
/>

<!-- Database component icon -->
<img
  src="/static/icons/database.svg"
  width="32"
  height="32"
  alt="Database service icon"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/square/32/10B981/FFFFFF?text=DB'"
/>`,
      },
      {
        eyebrow: "Incident severity",
        title: "Color-coded incident banner placeholders by severity",
        body: [
          "Some status page designs include a banner at the top of the page that changes color based on incident severity: yellow for degraded performance, orange for partial outage, red for major outage. If this banner includes a background image or illustration, that image needs a fallback.",
          "Use severity-matched placeholder colors so the fallback state communicates the same visual urgency as the designed state.",
        ],
        code: `const SEVERITY_COLORS: Record<string, string> = {
  none:      '10B981', // green
  degraded:  'EAB308', // yellow
  partial:   'F97316', // orange
  major:     'EF4444', // red
  maintenance: '3B82F6', // blue
};

function incidentBannerFallback(severity: string): string {
  const color = SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.degraded;
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return \`https://fallback.pics/api/v1/1200x80/\${color}/FFFFFF?text=\${encodeURIComponent(label + ' Incident')}\`;
}`,
      },
      {
        eyebrow: "Statuspage.io / Atlassian",
        title: "Custom domains and images on Statuspage.io",
        body: [
          "Statuspage.io (Atlassian) lets you set a custom logo and a custom domain for your hosted status page. If you set the logo to a URL hosted on your application CDN, and that CDN goes down in an incident, your logo breaks on your status page.",
          "Set the logo on Statuspage.io to an image URL hosted on a completely separate domain. Fallback.pics URLs work for this: the URL is permanent, the CDN is Cloudflare, and the service has no dependency on your application infrastructure.",
        ],
      },
      {
        eyebrow: "Freshstatus / Instatus",
        title: "Self-hosted and third-party status pages: the same principle",
        body: [
          "Whether you use Freshstatus, Instatus, Cachet, or a hand-rolled status page, the infrastructure independence principle applies. Any image referenced in your status page template should be hosted on a domain with independent availability from your application.",
          "For self-hosted status pages, audit your image references and replace any that point to your application CDN or origin with fallback.pics URLs or assets hosted on a separate static file host.",
        ],
      },
      {
        eyebrow: "No-JavaScript environments",
        title: "Status pages must work without JavaScript",
        body: [
          "During a major incident, some users will be on degraded connections or will have disabled JavaScript to reduce load. Status pages should render all critical information in pure HTML without requiring JavaScript. This means onerror handlers must work in plain HTML, not just in React or framework-managed components.",
          "Test your status page with JavaScript disabled. Every img element should either load successfully or fall back gracefully via the onerror attribute—no framework required.",
        ],
        code: `<!-- Plain HTML status page logo - no JS framework needed -->
<img
  src="https://cdn.acme.com/logo.svg"
  width="160"
  height="40"
  alt="Acme Status"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/160x40/7C3AED/FFFFFF?text=Acme+Status'"
/>`,
      },
      {
        eyebrow: "Internal links",
        title: "Related reliability and fallback patterns",
        body: [
          "For changelog header image patterns and documentation page fallbacks that share similar reliability requirements, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/changelog-header-image-from-text/
https://fallback.pics/blog/documentation-hero-image-fallbacks/`,
      },
    ],
    takeaways: [
      "Status pages and their image assets should be hosted on infrastructure completely independent from the application they monitor.",
      "Fallback.pics runs on Cloudflare edge independently of your application CDN—use it for status page logo and service icons.",
      "Color-code incident banner placeholders by severity (green/yellow/orange/red) to maintain visual urgency in fallback states.",
      "Test your status page with JavaScript disabled—onerror attributes must work without a JavaScript framework.",
      "If using Statuspage.io, set your custom logo to a URL on a separate CDN, not your application image host.",
    ],
    related: [
      "changelog-header-image-from-text",
      "documentation-hero-image-fallbacks",
      "cloudflare-cdn-cache-generated-images",
    ],
  },
  // ─── 13 ──────────────────────────────────────────────────────────────────
  {
    title: "Changelog and Release Note Header Images from Text",
    description:
      "Generate changelog header images automatically from release version text using fallback.pics thumbnail URLs—no design work required for every release.",
    slug: "changelog-header-image-from-text",
    readTime: "7 min read",
    category: "Content Workflows",
    tags: [
      "changelog header image",
      "release note image",
      "thumbnail from text",
      "image fallback",
      "developer content",
    ],
    summary: [
      "Changelog entries and release notes benefit from a header image that distinguishes each version visually in the feed. Design teams rarely have bandwidth to produce a custom header for every release. Generating changelog header images from the version number or release title using a URL-based API solves this without bottlenecking on design.",
      "The fallback.pics thumbnail route produces OG-card-sized header images from text with configurable background styles and colors. Add it to your changelog template and every release automatically gets a consistent, branded header.",
    ],
    sections: [
      {
        eyebrow: "Why changelogs need headers",
        title: "Changelog entries without images get lower social engagement",
        body: [
          "When a changelog entry or release post is shared on LinkedIn, Twitter, or Slack, the OG image is what draws the click. A changelog entry without an OG image falls back to the site's default OG image—which is usually the homepage hero, not the release content.",
          "Teams that share changelogs regularly notice that posts with release-specific images consistently outperform posts that use the generic site OG image. The image communicates 'this is a specific update' rather than 'this is the website.'",
          "The engineering bottleneck is that someone has to produce a new image for every release. The thumbnail-from-text approach removes that bottleneck entirely.",
        ],
      },
      {
        eyebrow: "Thumbnail URL",
        title: "Generate changelog headers from version text",
        body: [
          "The fallback.pics thumbnail route accepts a text parameter, a style, a theme, and a label. For changelogs, the text is the version number (v2.4.0), the style is 'soft' or 'gradient', the theme is your brand color, and the label can be 'Changelog' or the product name.",
          "The URL is deterministic: the same version always produces the same image. This means you can reference the URL in OG meta tags, in RSS feed entries, and in Slack notifications without storing any image asset.",
        ],
        code: `<!-- Changelog entry OG meta tag -->
<meta
  property="og:image"
  content="https://fallback.pics/api/v1/thumbnail/1200x630?text=v2.4.0&style=soft&theme=purple&label=Changelog"
/>

<!-- Changelog entry header image -->
<img
  src="https://fallback.pics/api/v1/thumbnail/1200x630?text=v2.4.0&style=soft&theme=purple&label=Changelog"
  width="1200"
  height="630"
  alt="v2.4.0 changelog header"
/>

<!-- Smaller header for in-page feed (800x400) -->
<img
  src="https://fallback.pics/api/v1/thumbnail/800x400?text=v2.4.0&style=soft&theme=purple&label=Changelog"
  width="800"
  height="400"
  alt="v2.4.0 release notes"
/>`,
      },
      {
        eyebrow: "Astro changelog",
        title: "Astro content collection changelog with auto-generated headers",
        body: [
          "In an Astro project, changelog entries live in src/content/changelog/. Each entry is a Markdown file with frontmatter. Add a computed image field that generates the thumbnail URL from the version field—no manual image uploads required.",
        ],
        code: `---
// src/content/changelog/v2-4-0.md frontmatter
version: "v2.4.0"
date: "2026-06-12"
title: "Improved webhook retry logic and dashboard performance"
---

// In your Astro page or layout, generate the image URL
const ogImageUrl =
  \`https://fallback.pics/api/v1/thumbnail/1200x630?text=\${encodeURIComponent(entry.data.version)}&style=soft&theme=purple&label=Changelog\`;`,
      },
      {
        eyebrow: "Ghost / Hashnode",
        title: "Changelog on Ghost or Hashnode with injected OG images",
        body: [
          "Ghost and Hashnode both let you set a custom OG image per post. For changelog posts where you don't have a custom design, paste the fallback.pics thumbnail URL directly into the post's social sharing image field.",
          "The URL is stable and permanent—it works as a social sharing image URL without requiring any upload. The image is served from Cloudflare's edge with appropriate cache headers.",
        ],
        code: `// Ghost Admin API: set post og_image programmatically
const post = {
  title: 'v2.4.0 - Webhook improvements',
  og_image:
    'https://fallback.pics/api/v1/thumbnail/1200x630?text=v2.4.0&style=soft&theme=purple&label=Changelog',
};`,
      },
      {
        eyebrow: "RSS feed",
        title: "Include thumbnail URLs in changelog RSS feeds",
        body: [
          "RSS readers and aggregators display media:thumbnail or enclosure images from changelog feeds. Generate the thumbnail URL for each entry and include it in the RSS feed as a media:content element. RSS readers that support thumbnails will display the version image in the feed list.",
          "Because the URL is deterministic, you can generate it during RSS feed construction without any database query for image assets.",
        ],
        code: `// RSS feed generation (simplified)
function changelogRssItem(entry: ChangelogEntry): string {
  const thumbnailUrl = \`https://fallback.pics/api/v1/thumbnail/800x400?text=\${encodeURIComponent(entry.version)}&style=soft&theme=purple&label=Changelog\`;
  return \`
    <item>
      <title>\${entry.version}: \${entry.title}</title>
      <link>https://example.com/changelog/\${entry.slug}</link>
      <media:content url="\${thumbnailUrl}" medium="image" width="800" height="400" />
      <description><![CDATA[\${entry.body}]]></description>
    </item>
  \`;
}`,
      },
      {
        eyebrow: "Release notes platform",
        title: "Linear, Notion, and Coda changelog integrations",
        body: [
          "Teams that manage changelogs in Linear releases, Notion databases, or Coda docs can generate and store the thumbnail URL as a computed property when creating a release. When pushing release notes to a website or sharing in Slack, pull the pre-computed thumbnail URL rather than generating it ad hoc.",
          "This pattern also makes it easy to prefetch and cache the image before the announcement goes out, so the first social share does not hit a cold CDN edge.",
        ],
      },
      {
        eyebrow: "Internal links",
        title: "Related content and release image patterns",
        body: [
          "For documentation hero image patterns and OG image strategies that use the same thumbnail route, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/documentation-hero-image-fallbacks/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "Changelog posts with release-specific OG images outperform posts that fall back to the generic site image in social sharing.",
      "The thumbnail route generates 1200x630 changelog headers from version text with no design work or upload required.",
      "The URL is deterministic—use it directly in OG meta tags, RSS feeds, and Slack notifications without storing any image asset.",
      "In Astro content collections, compute the thumbnail URL from the version frontmatter field at build time.",
      "Pre-compute and cache the thumbnail URL before announcement to warm the CDN edge before the first social share.",
    ],
    related: [
      "documentation-hero-image-fallbacks",
      "og-image-placeholders-blogs-docs-social-sharing",
      "generate-blog-thumbnails-from-text",
    ],
  },
  // ─── 14 ──────────────────────────────────────────────────────────────────
  {
    title: "Documentation Hero Image Fallbacks (Docusaurus, VitePress)",
    description:
      "Prevent broken hero images in Docusaurus and VitePress documentation sites with docusaurus og image fallbacks and URL-based placeholder patterns for docs sites.",
    slug: "documentation-hero-image-fallbacks",
    readTime: "8 min read",
    category: "Content Workflows",
    tags: [
      "docusaurus og image",
      "vitepress image fallback",
      "docs site placeholder",
      "image fallback",
      "developer documentation",
    ],
    summary: [
      "Documentation sites built with Docusaurus or VitePress often have hero images on the homepage, OG images for individual doc pages, and illustrative screenshots inside guides. These images are frequently missing for new doc pages, outdated after UI changes, or broken when the docs site moves hosts. Setting up documentation hero image fallbacks prevents these gaps from surfacing as broken icons or missing OG cards.",
      "The fallback.pics API generates page-specific OG images and in-page placeholder images from URL parameters. For documentation sites, this means every page can have a descriptive OG image and every hero slot can have a brand-consistent fallback—automatically, from the page title.",
    ],
    sections: [
      {
        eyebrow: "Docs site image failures",
        title: "Where documentation site images break most often",
        body: [
          "The most common failure is the OG image. Docusaurus and VitePress support a custom_edit_url and a custom image field in the frontmatter, but they do not auto-generate OG images for pages that lack a custom image. Those pages use whatever fallback OG image the site has configured globally—or no image at all if none is configured.",
          "Screenshot images inside guides are the second failure point. Docs screenshots are captured from a specific UI version and go stale with every redesign. A screenshot referenced by a hardcoded path may return a 404 after a docs reorganization or a static asset migration.",
          "Hero images on landing pages and homepage hero sections are the third: often referenced from the same CDN as the application, which creates the same infrastructure dependency problem that affects status pages.",
        ],
      },
      {
        eyebrow: "OG image per page",
        title: "Generate per-page OG images in Docusaurus with the thumbnail route",
        body: [
          "In Docusaurus, you can add custom OG image generation to the page configuration or use a Docusaurus plugin. The simplest approach without a plugin is to add a @theme/DocItem/Layout swizzle that injects a computed og:image meta tag based on the page title.",
          "The thumbnail route accepts the page title as the text parameter and produces a 1200x630 image branded with your doc site color. No external plugin or build-time image generation required—the URL is computed at render time.",
        ],
        code: `// Docusaurus swizzle: src/theme/DocItem/Layout/index.js
import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import Head from '@docusaurus/Head';
import { useDoc } from '@docusaurus/theme-common/internal';

export default function DocItemLayout(props) {
  const { frontMatter, metadata } = useDoc();
  const ogImage =
    frontMatter.image ??
    \`https://fallback.pics/api/v1/thumbnail/1200x630?text=\${encodeURIComponent(metadata.title.slice(0, 40))}&style=soft&theme=purple&label=Docs\`;

  return (
    <>
      <Head>
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <Layout {...props} />
    </>
  );
}`,
      },
      {
        eyebrow: "VitePress",
        title: "VitePress per-page OG images with the transformPageData hook",
        body: [
          "VitePress provides a transformPageData hook in the config that runs for every page during the build. Use it to inject a computed og:image into the page head when the frontmatter does not include a custom image.",
          "This approach generates all OG image URLs at build time, which means they appear in the pre-rendered HTML and are available for social crawlers that do not execute JavaScript.",
        ],
        code: `// .vitepress/config.mts
export default defineConfig({
  transformPageData(pageData) {
    const image =
      pageData.frontmatter.image ??
      \`https://fallback.pics/api/v1/thumbnail/1200x630?text=\${encodeURIComponent(pageData.title.slice(0, 40))}&style=soft&theme=purple&label=Docs\`;

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:image', content: image }],
      ['meta', { name: 'twitter:image', content: image }],
    );
  },
});`,
      },
      {
        eyebrow: "Hero images",
        title: "Homepage hero and docs landing page image fallbacks",
        body: [
          "Documentation site homepage heroes are typically wide-format images (1440x600 or 1200x500) that showcase the product or technology the docs describe. These images are maintained by whoever owns the docs site and can go stale or break during site migrations.",
          "Add an onerror fallback to the hero img element that generates a branded placeholder at the same dimensions. For a docs site, a purple-on-white or dark-on-brand-color placeholder with the product name communicates the brand without requiring a custom illustration.",
        ],
        code: `<!-- Docusaurus homepage hero with fallback -->
<img
  src="/img/hero.png"
  width="1200"
  height="500"
  alt="Product hero image"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/1200x500/7C3AED/FFFFFF?text=Your+Product'"
/>`,
      },
      {
        eyebrow: "Screenshot guides",
        title: "Handle stale screenshots in written guides",
        body: [
          "Screenshots inside documentation guides break silently. The image was valid when the page was written, but a UI redesign or a docs reorganization can break the path. Browser DevTools will show 404 errors in the console, but neither the author nor the reader is alerted.",
          "Add a global onerror handler that catches all broken images in your docs site and replaces them with a 'Screenshot outdated' placeholder. This surfaces the problem visually to readers who can then file an issue, instead of silently serving a broken page.",
        ],
        code: `// docusaurus.config.js: inject global onerror via scripts
module.exports = {
  scripts: [
    {
      src: '/js/image-fallback.js',
      async: true,
    },
  ],
};

// static/js/image-fallback.js
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('article img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.src.startsWith('https://fallback.pics')) return;
      img.onerror = null;
      img.src =
        'https://fallback.pics/api/v1/800x400/F4F4F5/9CA3AF?text=Screenshot+Outdated';
    });
  });
});`,
      },
      {
        eyebrow: "Nextra / Mintlify",
        title: "Other docs frameworks: apply the same per-page OG pattern",
        body: [
          "Nextra (Next.js-based) and Mintlify both support custom head injection per page. In Nextra, use the _document.tsx or _app.tsx to inject the computed og:image. In Mintlify, the og:image can be set in the page frontmatter or in the global config.",
          "For any docs framework that does not support auto-generated OG images, the thumbnail URL approach produces a consistent, page-specific image from the title with zero build-time processing.",
        ],
        code: `// Nextra: per-page OG image in MDX frontmatter
---
title: Getting Started
image: https://fallback.pics/api/v1/thumbnail/1200x630?text=Getting+Started&style=soft&theme=purple&label=Docs
---`,
      },
      {
        eyebrow: "Internal links",
        title: "Related documentation and content image patterns",
        body: [
          "For changelog header images and OG image placeholder patterns that use the same thumbnail route, see the related posts.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/changelog-header-image-from-text/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "Docusaurus and VitePress do not auto-generate per-page OG images; inject a thumbnail URL computed from the page title with a swizzle or transformPageData hook.",
      "VitePress transformPageData runs at build time so OG meta tags appear in pre-rendered HTML, available to social crawlers before JavaScript executes.",
      "Add a global article img onerror handler in Docusaurus to replace stale screenshots with a visible 'Screenshot Outdated' placeholder.",
      "For homepage heroes, use an onerror fallback at the same dimensions to handle CDN failures during site migrations.",
      "The thumbnail URL is deterministic—compute it from the page title in any docs framework that supports custom head injection.",
    ],
    related: [
      "changelog-header-image-from-text",
      "og-image-placeholders-blogs-docs-social-sharing",
      "generate-blog-thumbnails-from-text",
    ],
  },
];
