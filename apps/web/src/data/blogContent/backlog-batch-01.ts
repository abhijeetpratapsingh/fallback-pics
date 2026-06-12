import type { BlogPost } from '../blogPosts';

export const backlogBatch01: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    title: "Vue 3 Image Fallback Component for Failed and Missing Src",
    description:
      "Build a vue image fallback component in Vue 3 that catches load errors, swaps in a placeholder URL, and prevents infinite onerror loop cycles in reactive templates.",
    slug: "vue-image-fallback-component",
    readTime: "9 min read",
    category: "Implementation Guides",
    tags: [
      "Vue image fallback",
      "Vue 3",
      "onerror handler",
      "Placeholder images",
      "Composition API",
    ],
    summary: [
      "Vue 3's composition API makes it straightforward to build a vue image fallback component that catches load errors, swaps in a deterministic placeholder URL, and prevents the infinite onerror loop that trips up many first implementations.",
      "This guide covers the minimal SFC pattern, the loop-guard technique, TypeScript prop types, and how to pair the component with fallback.pics URLs that match your layout's exact dimensions and colors.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why Vue's native img tag fails without a vue image fallback",
        body: [
          "When an image src returns a 404, the browser fires an error event and renders a broken-image icon. Vue binds src reactively, but the framework does not intercept load errors by default. If the bound value is undefined, null, or an unavailable URL, your component renders nothing useful for the user.",
          "In a product catalog or content feed this is immediately noticeable. Layout space collapses if you have not set explicit dimensions, CLS scores rise, and there is no useful visual state. A broken-image icon does not communicate why the image is missing or indicate what should be there.",
          "A small wrapper component solves all three problems at once. It catches the error event, replaces the failing src with a stable fallback URL, and preserves the original layout geometry. Built once and placed in your shared UI library, it handles the fallback pattern consistently across every image surface in the app.",
        ],
      },
      {
        eyebrow: "Component",
        title: "The minimal Vue fallback SFC with @error binding",
        body: [
          "The component template binds src to a reactive ref initialized with the incoming prop, then listens to the @error event. On error, the handler replaces the ref value with the fallback URL. Reactive bindings mean Vue re-renders the element automatically.",
          "Always provide width and height attributes. Without them, the fallback image and the original image may have different intrinsic sizes, which produces a second layout shift after the swap.",
        ],
        code: `<!-- FallbackImage.vue -->
<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :width="width"
    :height="height"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  src: string;
  fallback: string;
  alt?: string;
  width?: number;
  height?: number;
}>(), { alt: '' });

const errored = ref(false);
const currentSrc = ref(props.src);

watch(() => props.src, (val) => {
  errored.value = false;
  currentSrc.value = val;
});

function handleError() {
  if (!errored.value) {
    errored.value = true;
    currentSrc.value = props.fallback;
  }
}
</script>`,
      },
      {
        eyebrow: "Loop guard",
        title: "Prevent infinite error loops with a boolean flag",
        body: [
          "Without the errored flag, the @error handler fires on both the original src and the fallback src. If your fallback URL is also unreachable—network is down, domain expired, or blocked by a CSP directive—the handler fires again, sets the same src again, which fires again. Most browsers will not loop indefinitely, but the behavior differs between Chrome, Firefox, and Safari.",
          "The errored boolean stops this cleanly. Once the first error fires, set the flag and swap the src. Any subsequent error events on the same element are ignored because the condition check exits immediately. Reset the flag in the watch on props.src so a legitimate src change gets a fresh attempt.",
          "If you want a visible error state instead of a silent placeholder swap, expose an error slot or emit a custom error event from the component. That is useful for debug tooling, analytics instrumentation, or error boundaries at the page level.",
        ],
      },
      {
        eyebrow: "Fallback URLs",
        title: "Choosing placeholder dimensions for the vue image fallback",
        body: [
          "The fallback URL should match the expected dimensions of the image slot. If your product card shows a 400x300 image, the fallback should be 400x300 so the layout stays intact when the real image fails. A 200x200 fallback in a 400x300 slot causes its own CLS.",
          "Pass the fallback as a prop at the call site rather than hardcoding it inside the component. That keeps the component generic and lets each use case supply its own dimensions, background color, text label, and format. Different parts of the app have different slot sizes and brand requirements.",
        ],
        code: `<!-- Product card usage -->
<FallbackImage
  :src="product.imageUrl"
  fallback="https://fallback.pics/api/v1/400x300/E5E7EB/9CA3AF?text=No+Image"
  :alt="product.name"
  :width="400"
  :height="300"
/>

<!-- Avatar slot -->
<FallbackImage
  :src="user.avatar"
  fallback="https://fallback.pics/api/v1/avatar/80?text=?"
  :alt="user.name"
  :width="80"
  :height="80"
/>

<!-- Blog thumbnail -->
<FallbackImage
  :src="post.thumbnail"
  fallback="https://fallback.pics/api/v1/thumbnail/1200x630?text=No+Thumbnail&theme=purple"
  :alt="post.title"
  :width="1200"
  :height="630"
/>`,
      },
      {
        eyebrow: "Composable",
        title: "A reusable useImageFallback composable for Vue 3",
        body: [
          "If you need to add fallback behavior to an existing img element rather than wrapping it in a new component, a composable gives you the same logic in a composable function. Bind the returned src ref to the img element and pass the returned onError handler to @error.",
          "The composable is also useful when working with a component library that renders its own img element internally and only exposes an image URL prop. You can preprocess the URL before passing it in, and conditionally generate the fallback URL server-side.",
        ],
        code: `// composables/useImageFallback.ts
import { ref, watch } from 'vue';

export function useImageFallback(
  initialSrc: Ref<string> | string,
  fallbackSrc: string
) {
  const src = isRef(initialSrc) ? initialSrc : ref(initialSrc);
  const currentSrc = ref(src.value);
  const errored = ref(false);

  watch(src, (val) => {
    errored.value = false;
    currentSrc.value = val;
  });

  function onError() {
    if (!errored.value) {
      errored.value = true;
      currentSrc.value = fallbackSrc;
    }
  }

  return { currentSrc, onError, errored };
}`,
      },
      {
        eyebrow: "Dynamic catalogs",
        title: "Integration with reactive product lists and Pinia stores",
        body: [
          "In a product catalog that fetches data from an API, product image URLs may be unknown until the API response arrives. Using FallbackImage keeps the layout stable during both the loading state and the error state. During loading you can show a skeleton; after the API responds the real URL is bound, and if that URL 404s the fallback takes over seamlessly.",
          "When the API returns products without an image field, build a computed fallback URL that encodes the product name so the placeholder is labeled. This helps QA and support staff identify which product slot the placeholder represents in screenshots and recorded sessions.",
          "For large catalogs, all fallback URLs for the same product type can share the same dimensions and base color parameters. This means they hash to the same CDN cache entry and do not generate unique backend requests for every missing product.",
        ],
        code: `<template>
  <div class="grid">
    <FallbackImage
      v-for="product in products"
      :key="product.id"
      :src="product.imageUrl ?? ''"
      :fallback="\`https://fallback.pics/api/v1/400x300/F3F4F6/6B7280?text=\${encodeURIComponent(product.name)}\`"
      :alt="product.name"
      :width="400"
      :height="300"
    />
  </div>
</template>`,
      },
      {
        eyebrow: "Resources",
        title: "API reference and related implementation guides",
        body: [
          "The fallback.pics documentation covers all available routes including avatar, banner, blur, skeleton, and custom color formats. The related posts below cover the same fallback pattern for React and Angular.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/react-image-fallback-patterns/
https://fallback.pics/blog/angular-image-fallback-patterns/`,
      },
    ],
    takeaways: [
      "Bind src to a reactive ref and use an errored boolean flag to prevent the infinite onerror loop.",
      "Reset the errored flag in a watch on the src prop so re-fetched URLs get a fresh load attempt.",
      "Pass the fallback URL as a prop at the call site so dimensions and colors match each image slot.",
      "Use https://fallback.pics/api/v1/{w}x{h} to generate dimension-matched placeholder URLs on demand.",
      "Emit a custom error event or expose an error slot when you need to track fallback triggers in analytics or monitoring.",
    ],
    related: [
      "react-image-fallback-patterns",
      "fix-broken-images-html-onerror",
      "angular-image-fallback-patterns",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    title: "Angular Image Fallback: onerror, Placeholders, and Error States",
    description:
      "Implement an angular image placeholder directive that catches src load errors, swaps in fallback URLs, and prevents infinite onerror cycles across Angular templates.",
    slug: "angular-image-fallback-patterns",
    readTime: "9 min read",
    category: "Implementation Guides",
    tags: [
      "Angular image placeholder",
      "Angular directive",
      "onerror fallback",
      "Image error handling",
      "Angular templates",
    ],
    summary: [
      "Angular does not handle image load errors by default. A reusable attribute directive is the cleanest way to add angular image placeholder behavior across your templates without duplicating event binding logic in every component.",
      "This guide walks through the directive implementation, the infinite-loop guard, TypeScript decorators, integration with NgOptimizedImage, and how to choose fallback.pics URLs that match your slot dimensions.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "How Angular handles image load failures by default",
        body: [
          "Angular template bindings are reactive but they do not catch network-level failures like a 404 response for an image src. If you bind [src] to a string that points to a missing resource, the browser fires an error event on the img element and renders the broken-image icon. Angular has no built-in mechanism to intercept this.",
          "The common workaround of adding (error) bindings directly in each template works, but it scatters the logic everywhere and makes it hard to change the fallback strategy globally. Every team eventually ends up with slightly different implementations across product components, blog cards, and user profile views.",
          "An attribute directive centralizes the pattern. You add fallbackSrc as an attribute once and the directive handles the error event, the loop guard, and the src swap. You change the default behavior in one place, not across dozens of components.",
        ],
      },
      {
        eyebrow: "Directive",
        title: "The FallbackSrc directive for angular image placeholder",
        body: [
          "The directive uses @HostListener to bind to the error event on the host element. When the image fails, it checks the errored flag, sets it to true, and updates the src property directly on the element reference. Direct DOM mutation is fine here because this is an intentional error-recovery pattern.",
          "The @Input fallbackSrc property receives the replacement URL. Mark the errored flag as a private instance property so each directive instance tracks its own error state independently across multiple images on the same page.",
        ],
        code: `// fallback-src.directive.ts
import {
  Directive, Input, HostListener, ElementRef
} from '@angular/core';

@Directive({ selector: 'img[fallbackSrc]', standalone: true })
export class FallbackSrcDirective {
  @Input() fallbackSrc = '';
  private errored = false;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError() {
    if (!this.errored && this.fallbackSrc) {
      this.errored = true;
      this.el.nativeElement.src = this.fallbackSrc;
    }
  }
}`,
      },
      {
        eyebrow: "Template usage",
        title: "Using the directive in Angular component templates",
        body: [
          "Add the directive to the imports array of your standalone component or to the declarations array of your NgModule. Then apply the fallbackSrc attribute to any img element. The attribute name doubles as the CSS selector, so no extra configuration is needed.",
          "Match the fallback URL dimensions to the img element's width and height attributes. This prevents a second layout shift when the fallback renders at a different intrinsic size than the intended image.",
        ],
        code: `<!-- product-card.component.html -->
<img
  [src]="product.imageUrl"
  [alt]="product.name"
  fallbackSrc="https://fallback.pics/api/v1/400x300/E5E7EB/6B7280?text=No+Image"
  width="400"
  height="300"
/>

<!-- user avatar -->
<img
  [src]="user.avatarUrl"
  [alt]="user.name"
  fallbackSrc="https://fallback.pics/api/v1/avatar/48?text={{ user.initials }}"
  width="48"
  height="48"
  class="rounded-full"
/>`,
      },
      {
        eyebrow: "Loop guard",
        title: "Preventing infinite error loops in Angular directives",
        body: [
          "The errored flag is the same technique used in React and Vue fallback implementations. Without it, setting el.nativeElement.src to a fallback URL triggers another load attempt. If that URL also fails—due to offline state, CSP rules, or an expired domain—the error event fires again and you are in an infinite loop.",
          "The guard is a simple private boolean. After the first error, set it to true and never overwrite src again for this element. If you want to retry when the input URL changes (e.g., due to Angular change detection from a new data binding), reset errored in ngOnChanges when the relevant input changes.",
        ],
        code: `// Extended version with reset on input change
import { Directive, Input, HostListener,
         ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: 'img[fallbackSrc]', standalone: true })
export class FallbackSrcDirective implements OnChanges {
  @Input() src = '';
  @Input() fallbackSrc = '';
  private errored = false;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src']) {
      this.errored = false;
    }
  }

  @HostListener('error')
  onError() {
    if (!this.errored && this.fallbackSrc) {
      this.errored = true;
      this.el.nativeElement.src = this.fallbackSrc;
    }
  }
}`,
      },
      {
        eyebrow: "NgOptimizedImage",
        title: "Fallbacks alongside Angular NgOptimizedImage",
        body: [
          "Angular 15+ includes NgOptimizedImage which automates lazy loading, intrinsic size hints, and LCP preload hints. It does not provide an error fallback mechanism out of the box. You can still use the FallbackSrcDirective on the same element, but NgOptimizedImage uses ngSrc rather than src, so the directive needs to listen to the error event via @HostListener and then set nativeElement.src directly.",
          "An alternative is to wrap NgOptimizedImage in a parent component that uses a template reference variable and an (error) output binding if and when Angular exposes one. Until then, the native DOM event approach on the element itself is the most reliable path.",
        ],
      },
      {
        eyebrow: "Testing",
        title: "Testing the FallbackSrc directive in Karma or Jest",
        body: [
          "Create a test component that uses the directive, set the src to a URL that will fail (a data: URL that is syntactically invalid works reliably), and dispatch an error event programmatically. Assert that nativeElement.src equals your expected fallback URL.",
          "Test the loop guard by dispatching a second error event after the first. The src should still equal the fallback URL and not change again. This protects against future edits that accidentally remove the guard.",
        ],
        code: `it('swaps to fallback on error', () => {
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  const img = fixture.nativeElement.querySelector('img');

  img.dispatchEvent(new Event('error'));
  fixture.detectChanges();

  expect(img.src).toContain('fallback.pics');
});

it('does not loop on second error', () => {
  const img = fixture.nativeElement.querySelector('img');
  img.dispatchEvent(new Event('error'));
  img.dispatchEvent(new Event('error'));
  fixture.detectChanges();

  // src should equal the fallback, not change again
  expect(img.src).toContain('fallback.pics');
});`,
      },
      {
        eyebrow: "Resources",
        title: "Related guides and fallback.pics API reference",
        body: [
          "The fallback.pics API reference covers dimension, color, avatar, and skeleton routes. The related posts below cover the React and Vue equivalents of this pattern.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/vue-image-fallback-component/`,
      },
    ],
    takeaways: [
      "A standalone directive with @HostListener('error') centralizes the fallback pattern without scattering it across templates.",
      "Set a private errored boolean flag to prevent the infinite loop when the fallback URL also fails.",
      "Reset the errored flag in ngOnChanges when the src input changes to allow fresh load attempts.",
      "Match fallback URL dimensions to the img width/height attributes to avoid a second layout shift.",
      "Test the directive by dispatching error events programmatically and asserting the final src value.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "vue-image-fallback-component",
      "react-image-fallback-patterns",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    title: "WordPress Featured Image Fallback When No Image Is Set",
    description:
      "Set a wordpress featured image fallback using PHP conditional logic, the_post_thumbnail, and fallback.pics URLs that generate thumbnails from post titles.",
    slug: "wordpress-featured-image-fallback",
    readTime: "8 min read",
    category: "CMS Workflows",
    tags: [
      "WordPress featured image fallback",
      "get_the_post_thumbnail",
      "WordPress PHP",
      "CMS image fallback",
      "Blog thumbnails",
    ],
    summary: [
      "WordPress posts without a featured image render a blank space in blog archives, related post modules, and social cards unless the theme handles the missing state explicitly. A wordpress featured image fallback fills that gap with a placeholder generated from the post title.",
      "This guide covers the PHP conditional approach using get_the_post_thumbnail_url, building dynamic fallback URLs from post metadata, and wiring the fallback into Open Graph tags so social crawlers always receive a valid image.",
    ],
    sections: [
      {
        eyebrow: "The gap",
        title: "What happens when wordpress featured image is missing",
        body: [
          "When has_post_thumbnail() returns false, calling get_the_post_thumbnail() returns an empty string. Themes that do not check for this display nothing where the featured image should be. Blog index pages, category archives, and related-post widgets all have the same gap.",
          "The social metadata problem is often worse than the on-page problem. Open Graph and Twitter Card meta tags that reference an empty og:image URL are not flagged as errors by debuggers—they simply produce cards with no image preview. That reduces click-through rates on shared links.",
          "The fix is a conditional fallback in the template: if has_post_thumbnail() is false, build a URL from the post title and use it wherever the thumbnail would appear. The same URL can serve both on-page img tags and og:image meta tags.",
        ],
      },
      {
        eyebrow: "PHP conditional",
        title: "The basic WordPress featured image fallback pattern",
        body: [
          "WordPress provides has_post_thumbnail() and get_the_post_thumbnail_url() to check and retrieve the featured image URL. Wrap the thumbnail call in a conditional and build the fallback URL in the else branch. The fallback URL can be static or dynamic based on post metadata.",
          "For dynamic URLs, the fallback should encode the post title as a text parameter. This makes the placeholder readable in blog previews and distinguishable in QA screenshots. Use urlencode() to handle spaces and special characters in titles.",
        ],
        code: `<?php
// In single.php, archive.php, or a template part

$thumb_url = get_the_post_thumbnail_url( null, 'large' );
$post_title = urlencode( get_the_title() );
$fallback_url = 'https://fallback.pics/api/v1/thumbnail/1200x630?text='
  . $post_title . '&style=soft&theme=purple&label=' . urlencode( get_bloginfo( 'name' ) );

$image_url = $thumb_url ?: $fallback_url;
?>

<img
  src="<?php echo esc_url( $image_url ); ?>"
  alt="<?php the_title_attribute(); ?>"
  width="1200"
  height="630"
  loading="<?php echo is_singular() ? 'eager' : 'lazy'; ?>"
/>`,
      },
      {
        eyebrow: "Open Graph",
        title: "Wiring the fallback into og:image meta tags",
        body: [
          "Social crawlers fetch og:image when a URL is shared on Facebook, Twitter, LinkedIn, and Discord. If the featured image is missing and you have no fallback, crawlers receive an empty or absent og:image and produce a text-only link card.",
          "Add the same fallback logic to your theme's wp_head hook or the functions.php output for meta tags. If you use a plugin like Yoast SEO or Rank Math, their fallback image settings handle some of this, but the generated fallback URL approach gives you more control over dimensions and labeling.",
          "Use the .jpg format suffix on the fallback URL for OG tags. Facebook, Twitter, and LinkedIn do not reliably accept SVG og:image values. Append .jpg to the dimensions segment to request a raster output.",
        ],
        code: `<?php
// functions.php – add to wp_head
add_action( 'wp_head', function() {
  if ( ! is_singular() ) return;

  $thumb = get_the_post_thumbnail_url( null, 'large' );
  if ( ! $thumb ) {
    $title = urlencode( get_the_title() );
    $thumb = 'https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=' . $title
           . '&style=soft&theme=purple&label=' . urlencode( get_bloginfo('name') );
  }
  echo '<meta property="og:image" content="' . esc_url( $thumb ) . '" />' . "\n";
  echo '<meta property="og:image:width" content="1200" />' . "\n";
  echo '<meta property="og:image:height" content="630" />' . "\n";
} );`,
      },
      {
        eyebrow: "Post category",
        title: "Using post category in the fallback label",
        body: [
          "The label parameter in the thumbnail route shows a small pill above the title. Using the post category as the label makes auto-generated blog card images look intentional rather than fallback-ish. The category gives context that helps users decide whether to click.",
          "Retrieve the primary category using get_the_category() and take the first result. If the post has no category, fall back to the blog name. Keep the label short—more than 20 characters gets truncated by the safe-zone layout.",
        ],
        code: `<?php
$categories = get_the_category();
$label = ! empty( $categories )
  ? $categories[0]->name
  : get_bloginfo( 'name' );

$fallback_url = 'https://fallback.pics/api/v1/thumbnail/1200x630?text='
  . urlencode( get_the_title() )
  . '&label=' . urlencode( $label )
  . '&style=soft&theme=blue';`,
      },
      {
        eyebrow: "Plugin approach",
        title: "Setting the fallback via woocommerce_placeholder_img_src or theme filter",
        body: [
          "If you prefer a site-wide default rather than template-by-template logic, register a filter on post_thumbnail_html and return a fallback img tag when the thumbnail is empty. This works across all themes that call the_post_thumbnail() without modifying template files.",
          "Alternatively, many themes implement a fallback_thumbnail_url function or filter. Check your theme documentation. The advantage of the filter approach is that it works even when other plugins call get_the_post_thumbnail() for their own output.",
        ],
        code: `<?php
add_filter( 'post_thumbnail_html', function( $html, $post_id ) {
  if ( $html ) return $html;

  $title   = urlencode( get_the_title( $post_id ) );
  $src     = 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=' . $title;

  return '<img src="' . esc_url( $src ) . '"'
       . ' width="1200" height="630"'
       . ' alt="' . esc_attr( get_the_title( $post_id ) ) . '"'
       . ' class="attachment-large wp-post-image" />';
}, 10, 2 );`,
      },
      {
        eyebrow: "Performance",
        title: "Caching and lazy loading the WordPress fallback image",
        body: [
          "Fallback.pics URLs are deterministic for the same parameters, so the same post title always produces the same image URL. This means browser caches, object caches, and CDN edge caches all benefit from cache hits across page views.",
          "For above-the-fold images on single post pages, set loading=\"eager\" on the img tag so the browser fetches the image immediately. For archive and listing pages where featured images are below the fold, loading=\"lazy\" reduces initial page weight.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related guides and API documentation",
        body: [
          "The fallback.pics thumbnail route documentation covers style, theme, label, and custom color parameters. The related posts cover OG image fallbacks and CMS preview patterns.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/
https://fallback.pics/blog/placeholder-images-cms-previews-missing-media/`,
      },
    ],
    takeaways: [
      "Use has_post_thumbnail() to check before calling get_the_post_thumbnail_url() and build a fallback URL in the else branch.",
      "Encode the post title as the text parameter for labeled, readable placeholder thumbnails.",
      "Use .jpg format suffix on fallback URLs in og:image meta tags—most social crawlers reject SVG.",
      "Add the primary post category as the label parameter to make generated blog cards look intentional.",
      "The filter approach on post_thumbnail_html provides a site-wide default without editing every template.",
    ],
    related: [
      "placeholder-images-cms-previews-missing-media",
      "og-image-placeholders-blogs-docs-social-sharing",
      "generate-blog-thumbnails-from-text",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    title: "Shopify Product Image Placeholder for Missing Catalog Photos",
    description:
      "Add a shopify product image placeholder using Liquid conditionals, the fallback.pics API, and proper aspect-ratio containers to prevent layout shift in your theme.",
    slug: "shopify-product-image-placeholder",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "Shopify product image placeholder",
      "Shopify Liquid",
      "Product catalog",
      "Ecommerce images",
      "Placeholder API",
    ],
    summary: [
      "Shopify themes display a broken icon or collapse the image container when a product has no photos. A proper shopify product image placeholder fills that space with a correctly-sized, labeled image so the catalog grid stays visually consistent during photo uploads or for products without images.",
      "This guide covers the Liquid conditional approach, replacing Shopify's built-in placeholder SVG with a URL-based placeholder, and handling the aspect-ratio requirements that prevent layout shift in modern theme sections.",
    ],
    sections: [
      {
        eyebrow: "Default behavior",
        title: "What Shopify renders for products without images",
        body: [
          "Shopify provides a placeholder_svg_tag helper that outputs a generic gray SVG placeholder when a product has no featured image. This works but it has no product context—all placeholder slots look identical regardless of which product they represent. In a catalog with hundreds of partially-uploaded products, that makes QA difficult.",
          "The built-in placeholder also has a fixed SVG shape that may not match your theme's aspect ratio requirements. If your product cards use 1:1 square images but the placeholder SVG has a different ratio, the card layout jumps when the real image loads.",
          "An external URL-based placeholder lets you specify exact dimensions, include a product name label, and match your brand colors. All of this is achievable through the fallback.pics API without any app installs or admin changes.",
        ],
      },
      {
        eyebrow: "Liquid conditional",
        title: "The Shopify Liquid product image fallback pattern",
        body: [
          "Check product.featured_image in Liquid. If it is truthy, use the standard img_url filter to size it. If it is nil, build a fallback URL using the product title as the text parameter. The product.title filter url_encode handles spaces and special characters.",
          "Set explicit width and height attributes on both the real image and the placeholder. This is important for Core Web Vitals—the browser needs to know the image dimensions before the image loads to reserve the right space and avoid CLS.",
        ],
        code: `{% comment %} product-card.liquid {% endcomment %}
{% if product.featured_image %}
  <img
    src="{{ product.featured_image | img_url: '400x400', crop: 'center' }}"
    alt="{{ product.featured_image.alt | escape }}"
    width="400"
    height="400"
    loading="lazy"
  />
{% else %}
  <img
    src="https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text={{ product.title | url_encode }}"
    alt="{{ product.title | escape }}"
    width="400"
    height="400"
    loading="lazy"
  />
{% endif %}`,
      },
      {
        eyebrow: "Aspect ratio",
        title: "Preserving aspect ratio to prevent CLS",
        body: [
          "The most common source of layout shift in Shopify product grids is images with different intrinsic sizes. Some products have portrait photos, some landscape, some square. Without an aspect-ratio container, the grid reflows each time a new image loads at a different size.",
          "Wrap images in a container with a fixed aspect ratio using CSS. The image fills the container with object-fit: cover, and the placeholder URL matches the container dimensions exactly. This makes the grid stable regardless of what images are loaded or missing.",
        ],
        code: `{% comment %} Use consistent aspect ratio container {% endcomment %}
<div class="product-image" style="aspect-ratio: 1/1; overflow: hidden;">
  {% if product.featured_image %}
    <img
      src="{{ product.featured_image | img_url: '400x400', crop: 'center' }}"
      alt="{{ product.featured_image.alt | escape }}"
      width="400" height="400"
      style="width:100%; height:100%; object-fit:cover;"
      loading="lazy"
    />
  {% else %}
    <img
      src="https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text={{ product.title | url_encode }}"
      alt="{{ product.title | escape }}"
      width="400" height="400"
      style="width:100%; height:100%; object-fit:cover;"
      loading="lazy"
    />
  {% endif %}
</div>`,
      },
      {
        eyebrow: "Product page",
        title: "Handling the main product page hero image",
        body: [
          "On product detail pages, the main hero image is typically above the fold and should not be lazy loaded. Use loading=\"eager\" and consider adding a fetchpriority=\"high\" attribute so the browser prioritizes it in the resource queue. The fallback URL should be larger here—1000x1000 or your theme's standard product image size.",
          "The product page often shows multiple variant images. If a variant has no image, product.selected_or_first_available_variant.image will be nil. Check this separately from the main product.featured_image so variant-specific fallbacks match variant context.",
        ],
        code: `{% assign hero_img = product.selected_or_first_available_variant.image
                        | default: product.featured_image %}

{% if hero_img %}
  <img
    src="{{ hero_img | img_url: '1000x1000', crop: 'center' }}"
    alt="{{ hero_img.alt | escape }}"
    width="1000" height="1000"
    loading="eager"
    fetchpriority="high"
  />
{% else %}
  <img
    src="https://fallback.pics/api/v1/1000x1000/F3F4F6/6B7280?text={{ product.title | url_encode }}"
    alt="{{ product.title | escape }}"
    width="1000" height="1000"
    loading="eager"
    fetchpriority="high"
  />
{% endif %}`,
      },
      {
        eyebrow: "Thumbnails",
        title: "Thumbnail gallery placeholders for additional images",
        body: [
          "Product pages typically show a gallery of thumbnails below or beside the hero. When a product has only one image, the remaining thumbnail slots are empty. Add a conditional in the thumbnail loop that generates placeholder URLs for empty slots rather than leaving gaps.",
          "Use a consistent thumbnail size—80x80 or 100x100 is common—and a neutral color so placeholders are distinguishable from uploaded images without being distracting. Avoid using the product name text in thumbnails at this size since the text will be too small to read.",
        ],
        code: `{% for image in product.images limit: 4 %}
  <img
    src="{{ image | img_url: '100x100', crop: 'center' }}"
    alt="{{ image.alt | escape }}"
    width="100" height="100"
  />
{% else %}
  <img
    src="https://fallback.pics/api/v1/100x100/F3F4F6/D1D5DB"
    alt="{{ product.title | escape }}"
    width="100" height="100"
  />
{% endfor %}`,
      },
      {
        eyebrow: "Resources",
        title: "Related Shopify and ecommerce placeholder guides",
        body: [
          "The fallback.pics API supports square, avatar, banner, and custom dimension routes. The related posts below cover WooCommerce placeholders and general ecommerce catalog patterns.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/
https://fallback.pics/blog/woocommerce-placeholder-image/`,
      },
    ],
    takeaways: [
      "Check product.featured_image in Liquid before rendering; build a URL-based placeholder in the else branch.",
      "Set explicit width and height attributes on placeholder images to prevent CLS in the product grid.",
      "Wrap images in an aspect-ratio container with object-fit: cover for a consistent grid layout.",
      "Use loading=\"eager\" and fetchpriority=\"high\" on the above-the-fold hero image, not on thumbnails.",
      "Match placeholder URL dimensions to the image slot exactly so real images and placeholders occupy the same space.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "woocommerce-placeholder-image",
      "prevent-layout-shift-missing-images",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    title: "WooCommerce Placeholder Image for Products Without Photos",
    description:
      "Replace or customize the woocommerce placeholder image using filter hooks, a URL-based API, and proper dimensions so product grids look complete before photos are uploaded.",
    slug: "woocommerce-placeholder-image",
    readTime: "8 min read",
    category: "Ecommerce",
    tags: [
      "WooCommerce placeholder image",
      "WooCommerce product photos",
      "WordPress ecommerce",
      "Product image fallback",
      "Filter hooks",
    ],
    summary: [
      "WooCommerce ships with a built-in placeholder image that appears when products have no photos, but it is a static gray box that offers no product context and does not match custom theme aspect ratios. Replacing the woocommerce placeholder image via filter hooks takes less than ten lines of PHP.",
      "This guide covers the woocommerce_placeholder_img_src filter, building dynamic URL-based placeholders from product metadata, handling variable products, and managing the performance implications of external placeholder requests in a catalog with thousands of products.",
    ],
    sections: [
      {
        eyebrow: "Default behavior",
        title: "How WooCommerce handles missing product images",
        body: [
          "WooCommerce stores its default placeholder image in the plugin assets folder. When a product has no featured image, WooCommerce outputs this generic placeholder on all product loops, single product pages, cart items, and order emails. The path is controlled by the woocommerce_placeholder_img_src filter.",
          "The default placeholder is a low-resolution JPG with a shopping bag icon. It does not include product name, category, or any identifying information. In a store during active inventory upload, dozens of products can show the same generic placeholder simultaneously, making it hard to distinguish incomplete entries.",
          "Swapping it for a URL-based placeholder that encodes the product name or SKU makes QA significantly easier. Any incomplete product in the catalog is immediately identifiable by the text on its placeholder image.",
        ],
      },
      {
        eyebrow: "Filter hook",
        title: "Using woocommerce_placeholder_img_src to replace the default",
        body: [
          "The simplest customization is a global static replacement. Add the filter to your theme's functions.php or a site-specific plugin. This replaces the placeholder for every product without images in the entire store.",
          "For a static placeholder that matches your brand colors, point the filter return value at a fixed fallback.pics URL with your preferred dimensions, background, and text. WooCommerce uses the returned URL in every context where it would normally show its default placeholder.",
        ],
        code: `<?php
// Static replacement – functions.php or site plugin
add_filter( 'woocommerce_placeholder_img_src', function( $src ) {
  return 'https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text=No+Photo';
} );

// Optionally override the full <img> HTML for more control:
add_filter( 'woocommerce_placeholder_img', function( $html, $size ) {
  $sizes = [
    'thumbnail'      => '100x100',
    'shop_catalog'   => '300x300',
    'shop_single'    => '600x600',
    'shop_thumbnail' => '100x100',
  ];
  $dim = $sizes[ $size ] ?? '300x300';
  $src = 'https://fallback.pics/api/v1/' . $dim . '/F3F4F6/9CA3AF?text=No+Photo';
  return '<img src="' . esc_url( $src ) . '" alt="No product image" '
       . 'class="woocommerce-placeholder wp-post-image" />';
}, 10, 2 );`,
      },
      {
        eyebrow: "Dynamic labels",
        title: "Product-specific placeholders from WooCommerce metadata",
        body: [
          "A static placeholder is fine for stores where all products eventually get photos. For stores that sell digital products or services without photos, or for B2B wholesale catalogs, a placeholder labeled with the product name or SKU is more useful long-term.",
          "You cannot directly pass WooCommerce product data to the woocommerce_placeholder_img_src filter because it does not receive a product object. Instead, filter woocommerce_loop_add_to_cart_link or use the woocommerce_before_shop_loop_item action to inject a custom image tag where you do have access to the global $product.",
        ],
        code: `<?php
// Access product data in the loop for dynamic placeholder text
add_action( 'woocommerce_before_shop_loop_item_title', function() {
  global $product;

  if ( $product && ! $product->get_image_id() ) {
    $name = urlencode( $product->get_name() );
    $sku  = $product->get_sku() ? ' (' . urlencode( $product->get_sku() ) . ')' : '';
    $src  = 'https://fallback.pics/api/v1/300x300/F3F4F6/6B7280?text=' . $name . $sku;
    echo '<img src="' . esc_url( $src ) . '" alt="' . esc_attr( $product->get_name() ) . '" '
       . 'width="300" height="300" class="woocommerce-placeholder" />';
  }
}, 5 );`,
      },
      {
        eyebrow: "Variable products",
        title: "Handling variable product swatches and gallery images",
        body: [
          "Variable products in WooCommerce can have per-variation images. When a variation has no image, WooCommerce falls back to the parent product's featured image. If the parent also has no image, the placeholder is shown. Your filter applies at both levels, so the same logic works for simple and variable products.",
          "For variation swatches displayed in the product thumbnail gallery, check whether variation images are set. The woocommerce_available_variation filter fires for each variation object and includes the image data. You can intercept this to substitute placeholder URLs for variations with empty image fields before the JSON is sent to the front end.",
        ],
      },
      {
        eyebrow: "Cart and emails",
        title: "Placeholder images in cart, order, and email views",
        body: [
          "WooCommerce uses the placeholder image in cart line items, order confirmation pages, and order notification emails. The woocommerce_placeholder_img_src filter applies consistently across all of these contexts.",
          "Email clients block external images by default in many corporate environments. For transactional email contexts, a plain colored rectangle with no text may be safer than a detailed labeled placeholder. Consider a separate simpler URL for email-specific contexts if you have the ability to hook into the email rendering flow.",
          "In the cart, customers can see placeholder images for items they just added. This is acceptable if the placeholder is clean, but label it with 'No Image' or the product name so the cart line item is clearly associated with the right product.",
        ],
      },
      {
        eyebrow: "Performance",
        title: "CDN caching and performance for WooCommerce placeholder requests",
        body: [
          "Fallback.pics URLs are deterministic, which means the CDN caches the response at the edge. For a catalog with 500 products and no images, all 500 products that use the same static placeholder URL share a single CDN cache entry. The performance overhead is one HTTP request per unique URL.",
          "For dynamic labeled placeholders where each product has a different text parameter, each URL is unique and caches separately. The CDN still handles these efficiently, but your catalog page will generate more distinct cache entries. This is usually a worthwhile tradeoff for the QA visibility gains.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related WooCommerce and placeholder API guides",
        body: [
          "The fallback.pics API documentation covers all available placeholder routes including square, avatar, and banner presets. Related posts cover Shopify placeholder patterns and general ecommerce catalog approaches.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/shopify-product-image-placeholder/
https://fallback.pics/blog/product-image-placeholder-ecommerce-catalogs/`,
      },
    ],
    takeaways: [
      "Use the woocommerce_placeholder_img_src filter for a global static replacement in under ten lines of PHP.",
      "Filter woocommerce_placeholder_img when you need size-aware placeholders at different WooCommerce contexts.",
      "Access the global $product in loop actions to build dynamic labeled placeholders from product names or SKUs.",
      "Deterministic URLs for the same placeholder type share a single CDN cache entry, keeping performance overhead low.",
      "Label cart and order placeholders clearly so customers and support staff can identify products from screenshots.",
    ],
    related: [
      "product-image-placeholder-ecommerce-catalogs",
      "shopify-product-image-placeholder",
      "placeholder-images-cms-previews-missing-media",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    title: "Open Graph Image Size Guide (1200×630) and Fallback URLs",
    description:
      "Understand og image size requirements across social platforms and generate fallback URLs from page titles so shared links always display a preview card image.",
    slug: "og-image-size-guide-fallback-urls",
    readTime: "9 min read",
    category: "Content Workflows",
    tags: [
      "OG image size",
      "Open Graph image",
      "Social media images",
      "og:image fallback",
      "Social card preview",
    ],
    summary: [
      "Open Graph og:image metadata drives the preview card when a URL is shared on Facebook, Twitter, LinkedIn, Discord, and Slack. Getting the og image size right and providing a fallback URL for pages without uploaded images are two of the highest-ROI SEO and sharing improvements you can make.",
      "This guide covers the 1200×630 standard, platform-specific requirements, generating og:image fallback URLs from page titles, and wiring them into HTML meta tags, CMS templates, and framework head components.",
    ],
    sections: [
      {
        eyebrow: "The standard",
        title: "Why 1200×630 is the og image size to target",
        body: [
          "The Open Graph spec does not mandate a specific image size, but social platforms have converged on 1200×630 pixels as the safe target. Facebook's sharing debugger documentation recommends at least 1200×628. Twitter's card spec specifies 1200×628 minimum for summary_large_image cards. LinkedIn renders best at 1200×627. The 1200×630 target covers all three without cropping.",
          "Images below 600×315 may be displayed at a reduced size or only in a small thumbnail format rather than the full-width card preview. Platforms use the og:image:width and og:image:height meta tags to determine layout before fetching the image, so always include those alongside og:image.",
          "For dynamic pages where the title changes but the layout is static, generating the og:image URL from the title keeps the card visually relevant without manual image uploads for every page.",
        ],
      },
      {
        eyebrow: "Platform requirements",
        title: "Platform-specific og image size differences",
        body: [
          "Facebook crops og:image to 1200×628 for link shares and shows the full image for large cards. Twitter crops to 600×314 for standard summary cards and 1200×628 for summary_large_image. LinkedIn typically shows 1200×627 for link posts. Discord and Slack both pull the og:image meta tag and render it at their own sizes.",
          "Because different platforms crop differently, keep critical content—title text, brand mark—within a 1080×567 safe zone centered within the 1200×630 frame. The fallback.pics thumbnail route is designed with this in mind: the text zone stays within the safe zone regardless of which style or theme you choose.",
        ],
        cards: [
          {
            title: "Facebook / Meta",
            body: "1200×628 recommended. Use og:image:width and og:image:height tags. SVG is not accepted; use JPG or WebP.",
          },
          {
            title: "Twitter / X",
            body: "summary_large_image: 1200×628 minimum. Add twitter:card, twitter:image meta tags alongside og:image.",
          },
          {
            title: "LinkedIn",
            body: "1200×627 renders at full width. Square images (1200×1200) also work for direct post images.",
          },
        ],
      },
      {
        eyebrow: "Fallback generation",
        title: "Generating og:image fallback URLs from page titles",
        body: [
          "The thumbnail route at fallback.pics generates a 1200×630 image from a text parameter. Pass the page title as the text parameter and append .jpg to get a raster output that social crawlers accept. The style and theme parameters control visual decoration.",
          "Use URL encoding for the title parameter. Most frameworks provide a utility for this—encodeURIComponent in JavaScript, urlencode in PHP, urllib.parse.quote in Python. Spaces should be represented as + or %20 in the query string.",
        ],
        code: `<!-- Static HTML og:image fallback -->
<meta property="og:image"
      content="https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Your+Page+Title&style=soft&theme=purple&label=fallback.pics" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<!-- Twitter card alongside og -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image"
      content="https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=Your+Page+Title&style=soft&theme=purple" />`,
      },
      {
        eyebrow: "Framework integration",
        title: "Adding og:image fallback in React, Next.js, and Astro",
        body: [
          "In Next.js, use the metadata API to define og:image per page or as a default. In the openGraph object, set images to an array containing the fallback URL when the real image is absent. The fallback URL can be computed from the page title using encodeURIComponent.",
          "In Astro, add the meta tags directly to the Layout component's head slot using a conditional expression. If the passed ogImage prop is empty, compute the fallback URL from the title prop. In React with React Helmet or similar, the same conditional logic applies in the component JSX.",
        ],
        code: `// Next.js app router – generateMetadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  const ogImage = post.featuredImage
    ?? \`https://fallback.pics/api/v1/thumbnail/1200x630.jpg?text=\${encodeURIComponent(post.title)}&style=soft&theme=purple\`;

  return {
    openGraph: {
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
    },
  };
}`,
      },
      {
        eyebrow: "Caching",
        title: "Cache-friendly og:image URLs for CDN performance",
        body: [
          "Generated og:image URLs are deterministic for the same title and parameters, so social platforms that cache preview cards will get a cache hit on repeated shares of the same URL. The URL should be stable—avoid including timestamps, random seeds, or session identifiers in the og:image URL.",
          "Social platforms crawl og:image on first share and cache the result. If you update a page's title and want the social card to reflect the change, you need to manually invalidate the cache using the platform's sharing debugger tool. Facebook has a Sharing Debugger at developers.facebook.com/tools/debug; Twitter has a Card Validator.",
        ],
      },
      {
        eyebrow: "Validation",
        title: "Testing og:image fallback URLs before publishing",
        body: [
          "Before going live, paste the page URL into each platform's debugging tool. Facebook's Sharing Debugger shows exactly what the card will look like and flags missing dimensions, wrong content types, or broken image URLs. Twitter's Card Validator works similarly.",
          "Check that the og:image URL returns a 200 response, has the correct Content-Type header (image/jpeg or image/png), and matches the declared width and height. Fallback.pics URLs include proper Content-Type headers and serve the exact declared dimensions.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related social image and OG guides",
        body: [
          "The related posts below cover blog thumbnail generation and Open Graph placeholder patterns in more depth.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/generate-blog-thumbnails-from-text/
https://fallback.pics/blog/og-image-placeholders-blogs-docs-social-sharing/`,
      },
    ],
    takeaways: [
      "Target 1200×630 for og:image to satisfy Facebook, Twitter, LinkedIn, and Discord without cropping.",
      "Always include og:image:width and og:image:height tags so platforms know the dimensions before fetching.",
      "Append .jpg to the thumbnail route dimensions segment to get a raster image accepted by all social crawlers.",
      "Keep dynamic og:image URLs deterministic—avoid timestamps or random values that break CDN caching.",
      "Validate generated og:image URLs with the Facebook Sharing Debugger and Twitter Card Validator before launch.",
    ],
    related: [
      "og-image-placeholders-blogs-docs-social-sharing",
      "generate-blog-thumbnails-from-text",
      "broken-images-seo-fallback-fix",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    title: "Lazy Loading Images: native loading=lazy vs Placeholder Fallbacks",
    description:
      "Compare native lazy loading images with placeholder fallback patterns, learn when each is appropriate, and prevent layout shift by combining both in production.",
    slug: "lazy-loading-images-placeholder-fallbacks",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "Lazy loading images",
      "loading=lazy",
      "Image placeholders",
      "Core Web Vitals",
      "Layout shift",
    ],
    summary: [
      "Native lazy loading images with loading=lazy is one line of HTML but it defers the network fetch without providing any visible state during the gap. Combining lazy loading with a low-cost placeholder ensures the layout stays stable and users have a visual signal that content is coming.",
      "This guide covers when to use loading=lazy, when to use loading=eager, how skeleton and blur placeholders interact with the lazy loading lifecycle, and the specific patterns that prevent CLS in image-heavy pages.",
    ],
    sections: [
      {
        eyebrow: "Basics",
        title: "What native loading=lazy actually does for lazy loading images",
        body: [
          "The loading attribute with value lazy tells the browser to defer loading the image until it approaches the viewport. The distance threshold varies by browser—Chrome uses roughly 1250px below the viewport at a fast connection, more at slow connections. Firefox uses a similar heuristic. Safari supported lazy loading from version 15.4.",
          "During the deferral period, if the img element has no placeholder src and no background, the space is empty or collapsed. Whether it collapses depends on whether you set width and height attributes. With attributes set, the browser reserves the space; without them, the space collapses and reflows when the image loads.",
          "Loading lazy does not eliminate broken images. If the deferred URL returns a 404 or fails to load, the browser still shows the broken-image icon. Combining loading=lazy with an onerror fallback covers both the deferred case and the failure case.",
        ],
      },
      {
        eyebrow: "Placeholder gap",
        title: "Filling the visual gap during lazy loading",
        body: [
          "The period between page render and when the image loads creates a gap. On a fast connection, this gap is barely noticeable. On a 3G connection or when the page has many below-the-fold images, the gap can last several seconds. Users scrolling through a long feed see gray or empty slots instead of content.",
          "A placeholder fills the gap with a visible, sized element that signals image content is coming. The placeholder can be a static colored rectangle, a skeleton animation, or a blur-up low-quality version. The choice affects both perceived performance and CPU cost.",
        ],
        cards: [
          {
            title: "Static placeholder",
            body: "A fixed-color rectangle at the correct dimensions. Zero CPU cost, no animation, works well for grids where the gap is brief.",
          },
          {
            title: "Skeleton animation",
            body: "A shimmer animation that indicates loading state. Higher perceived performance than static but costs CSS animation frames.",
          },
          {
            title: "Blur-up placeholder",
            body: "A blurred low-quality version of the image, fading to the real image. Best perceived performance but requires a separate low-res image URL.",
          },
        ],
      },
      {
        eyebrow: "Implementation",
        title: "Using a static placeholder with loading=lazy",
        body: [
          "The simplest pattern: set src to the placeholder URL and data-src to the real image URL. A small JavaScript observer swaps data-src to src when the element enters the viewport. This predates native lazy loading and is still useful when you want control over the threshold or need to support older browsers.",
          "With native lazy loading, set src to the placeholder and use a secondary srcset or JS swap on load. Alternatively, use both src (placeholder) and loading=lazy: the browser shows the placeholder immediately and fetches the lazy-loaded image when it nears the viewport, then the load event fires and you can replace the src.",
        ],
        code: `<!-- Static placeholder with native lazy loading -->
<img
  src="https://fallback.pics/api/v1/800x500/F3F4F6/E5E7EB"
  data-src="/product-photo.jpg"
  loading="lazy"
  width="800"
  height="500"
  alt="Product photo"
  class="lazy-image"
/>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    observer.observe(img);
  });
});
</script>`,
      },
      {
        eyebrow: "LCP",
        title: "Do not lazy load above-the-fold images (LCP impact)",
        body: [
          "The most common lazy loading mistake is applying loading=lazy to the Largest Contentful Paint (LCP) element. The LCP is typically the hero image or the first product image in a catalog. Deferring it delays the LCP metric, which directly affects Core Web Vitals scores and page experience signals.",
          "Use loading=eager on images that are visible in the initial viewport. Use fetchpriority=high on the LCP image to tell the browser to prioritize it in the fetch queue. All images below the fold can safely use loading=lazy.",
          "A practical rule: images in the first viewport row of a grid use loading=eager; all others use loading=lazy. The exact threshold depends on your grid and viewport size, but erring on the side of eager loading for the first row prevents accidental LCP degradation.",
        ],
        code: `<!-- Hero or first-in-grid: eager and high priority -->
<img
  src="/hero.jpg"
  onerror="this.onerror=null;this.src='https://fallback.pics/api/v1/1200x600/7C3AED/FFFFFF?text=Hero'"
  loading="eager"
  fetchpriority="high"
  width="1200"
  height="600"
  alt="Hero"
/>

<!-- Below-the-fold product grid: lazy with placeholder -->
<img
  src="https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF"
  data-src="/product.jpg"
  loading="lazy"
  width="400"
  height="400"
  alt="Product"
  class="lazy-image"
/>`,
      },
      {
        eyebrow: "Animated skeleton",
        title: "Using animated skeleton placeholders during lazy loading",
        body: [
          "Animated skeleton placeholders communicate loading state better than static gray boxes. The shimmer animation gives users a clear signal that content is being fetched, not missing. Skeletons are especially effective in social feed layouts where users expect content to flow in progressively.",
          "The fallback.pics animated skeleton route generates a shimmer placeholder from a URL. This avoids writing CSS animations for each image size. Use it as the initial src before swapping to the real image URL on load.",
        ],
        code: `<img
  src="https://fallback.pics/api/v1/animated/skeleton/400x300"
  data-src="/product.jpg"
  loading="lazy"
  width="400"
  height="300"
  alt="Product photo"
  class="lazy-image"
/>`,
      },
      {
        eyebrow: "Resources",
        title: "Related lazy loading and performance guides",
        body: [
          "The related posts below cover LQIP blur-up placeholders and CLS prevention patterns in more detail.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/prevent-layout-shift-missing-images/
https://fallback.pics/blog/lqip-blur-up-placeholders-layout-shift/`,
      },
    ],
    takeaways: [
      "Set width and height attributes on every lazy-loaded image to prevent layout shift during the deferral period.",
      "Never apply loading=lazy to above-the-fold or LCP images—it directly delays the Core Web Vitals LCP score.",
      "Use a static placeholder src that matches the slot dimensions to fill the visual gap during lazy loading.",
      "Use fetchpriority=high on the LCP image to prioritize it in the browser's fetch queue.",
      "Combine loading=lazy with an onerror fallback so deferred images that fail still show a usable placeholder.",
    ],
    related: [
      "prevent-layout-shift-missing-images",
      "lqip-blur-up-placeholders-layout-shift",
      "image-loading-best-practices-for-better-ux",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    title: "LQIP and Blur-Up Placeholders Without Layout Shift",
    description:
      "Implement lqip placeholder and blur-up image loading in production without causing layout shift, using aspect-ratio containers and URL-based blur placeholders.",
    slug: "lqip-blur-up-placeholders-layout-shift",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "LQIP placeholder",
      "Blur-up images",
      "Image loading UX",
      "CLS prevention",
      "Core Web Vitals",
    ],
    summary: [
      "LQIP—Low-Quality Image Placeholder—is a technique where a blurred low-resolution version of an image loads first, giving users a sense of the final image while the full-resolution version downloads. Done incorrectly, LQIP introduces its own layout shift; done correctly, it improves perceived performance significantly.",
      "This guide covers the aspect-ratio container requirement, generating blur placeholders from URLs, CSS filter transitions, and when to choose LQIP over a skeleton loader or a static color swatch.",
    ],
    sections: [
      {
        eyebrow: "What is LQIP",
        title: "How LQIP placeholders work and why they improve perceived performance",
        body: [
          "LQIP works by showing a tiny version of the final image—typically 20–40 pixels wide—blurred and scaled up to fill the image slot. The blurred version communicates the shape, color palette, and rough composition of the final image before it loads. Users perceive this as faster loading because they see recognizable content immediately rather than a blank space.",
          "The technique is used by Medium, Facebook, Pinterest, and most modern image-heavy applications. Next.js Image component implements a version of it with the placeholder='blur' prop. The blurred version is usually a base64-encoded inline data URI or a very small remote URL.",
          "The tradeoff is complexity: you need a low-quality version of each image, a CSS filter transition, and a JavaScript event to remove the blur on load. URL-based placeholder services simplify the first step by generating an approximate blur placeholder from a URL alone.",
        ],
      },
      {
        eyebrow: "Layout shift danger",
        title: "How LQIP causes CLS if you skip the aspect-ratio container",
        body: [
          "The most common LQIP mistake is loading the blurred placeholder as an absolutely-positioned overlay without reserving the final image's dimensions beforehand. When the full-resolution image loads at its intrinsic size, the layout shifts around it.",
          "The fix is an aspect-ratio container. The container reserves the correct space at the right ratio before either the placeholder or the final image loads. The placeholder and the final image both fill the container using position: absolute and object-fit: cover. This way, nothing in the document flow changes when the image swaps.",
          "Setting explicit width and height on the img element achieves a similar result when the img is not wrapped in a container. The browser uses the width/height attributes to compute an intrinsic size and reserves the space. This is simpler but less flexible for responsive layouts where the width is fluid.",
        ],
      },
      {
        eyebrow: "CSS setup",
        title: "The aspect-ratio container pattern for LQIP placeholders",
        body: [
          "The container uses position: relative and a fixed or responsive aspect-ratio. The img fills the container with position: absolute, inset: 0, and object-fit: cover. The blur filter starts at 20px and transitions to 0 when a loaded class is added on the image's load event.",
          "Keep the transition short—200–400ms is enough to signal the swap without feeling sluggish. Longer transitions are distracting in grids where many images load in sequence.",
        ],
        code: `.lqip-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #f3f4f6;
}

.lqip-wrap img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  transform: scale(1.05); /* hide blur edge artifacts */
  transition: filter 0.3s ease, transform 0.3s ease;
}

.lqip-wrap img.loaded {
  filter: blur(0);
  transform: scale(1);
}`,
      },
      {
        eyebrow: "Blur URL",
        title: "Generating LQIP blur placeholders via URL",
        body: [
          "The fallback.pics blur route generates a blurred placeholder at any dimension. Use it as the initial src to get a blurred image that fills the container before the final image loads. Unlike base64-encoded inline data URIs, the URL is cacheable and reusable across multiple pages.",
          "The color of the blur placeholder approximates the average color of a typical image in your catalog. For product images, a light gray matches most backgrounds. For hero images and editorial photos, you can use a custom background color that matches your typical palette.",
        ],
        code: `<!-- HTML: blur placeholder swapped out on load -->
<div class="lqip-wrap">
  <img
    src="https://fallback.pics/api/v1/blur/800x600"
    data-src="/final-image.jpg"
    alt="Product photo"
    loading="lazy"
    onload="this.classList.add('loaded'); if(this.dataset.src){this.src=this.dataset.src}"
  />
</div>`,
      },
      {
        eyebrow: "JavaScript swap",
        title: "The image load event and src swap sequence",
        body: [
          "The src swap uses a simple onload handler. When the placeholder finishes loading, check for a data-src attribute and replace the src with the real image URL. Add the loaded class after the swap so the CSS transition fires.",
          "The sequence matters. Set src to the placeholder, define data-src as the real URL, and only swap to the real URL inside the load callback. Trying to preload the real image and the placeholder simultaneously can cause race conditions where the wrong image ends up displayed.",
          "In React, use the onLoad event prop and useState to track the loaded state. Set the initial state to the blur URL and transition to the real URL in the onLoad callback, wrapping the final image in a CSS class that controls the filter.",
        ],
        code: `// React LQIP implementation
import { useState } from 'react';

function LQIPImage({ src, blurUrl, alt, width, height }) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(blurUrl);

  return (
    <div style={{ position: 'relative', aspectRatio: \`\${width}/\${height}\` }}>
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: loaded ? 'blur(0)' : 'blur(20px)',
          transform: loaded ? 'scale(1)' : 'scale(1.05)',
          transition: 'filter 0.3s ease, transform 0.3s ease',
        }}
        onLoad={() => {
          if (!loaded) {
            setCurrentSrc(src);
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}`,
      },
      {
        eyebrow: "When to use",
        title: "Choosing LQIP vs skeleton loader vs static color swatch",
        body: [
          "LQIP works best for editorial content, hero images, and photography-heavy pages where the image composition is the primary content. The blurred preview gives users a recognizable glimpse of the final image before it loads.",
          "Skeleton loaders work better for UI elements where the image is part of a larger layout—product cards, user avatars, news feed items. The skeleton communicates that content is being fetched without suggesting what the content looks like.",
          "Static color swatches (a plain colored rectangle) are the lightest option and work well in fast-loading grids where the gap is too short to warrant animation. They are also the safest option for accessibility since they do not add motion and require no JavaScript.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related blur and loading pattern guides",
        body: [
          "The fallback.pics blur route documentation covers available dimensions and color parameters. Related posts cover lazy loading patterns and skeleton placeholder comparisons.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/lazy-loading-images-placeholder-fallbacks/
https://fallback.pics/blog/skeleton-placeholder-images-vs-static-fallbacks/`,
      },
    ],
    takeaways: [
      "Always use an aspect-ratio container or explicit width/height attributes to prevent layout shift during the blur-to-real swap.",
      "Scale the blurred placeholder to 1.05x and trim with overflow: hidden to hide blur edge artifacts at image borders.",
      "Use https://fallback.pics/api/v1/blur/{w}x{h} for a cacheable, reusable LQIP placeholder without base64 encoding.",
      "Add the CSS filter and transform transition only after the final image loads to avoid animating the blur placeholder.",
      "Prefer skeleton loaders for UI components and LQIP for editorial photography—the tradeoff is clarity of loading state vs. content preview.",
    ],
    related: [
      "prevent-layout-shift-missing-images",
      "lazy-loading-images-placeholder-fallbacks",
      "skeleton-placeholder-images-vs-static-fallbacks",
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────────
  {
    title: "WebP Fallbacks with picture Element and Placeholder URLs",
    description:
      "Use the picture element to serve WebP and AVIF with automatic webp fallback, and add placeholder URLs so every source has a usable fallback when media fails to load.",
    slug: "webp-fallback-picture-element-placeholders",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "WebP fallback",
      "picture element",
      "AVIF support",
      "Image formats",
      "Browser compatibility",
    ],
    summary: [
      "The picture element solves two different problems: format selection (serving WebP or AVIF to browsers that support it) and art direction (serving different crops at different viewport sizes). The webp fallback in the picture element's final img tag handles browsers that do not accept modern formats.",
      "This guide covers the correct source order, how placeholder URLs fit into the picture element structure, and how to combine format fallbacks with onerror fallbacks so the image slot is never empty regardless of browser support or network failure.",
    ],
    sections: [
      {
        eyebrow: "Picture element basics",
        title: "How the picture element handles webp fallback",
        body: [
          "The picture element contains one or more source elements followed by a mandatory img element. The browser evaluates source elements in order and uses the first one whose type and media conditions are satisfied. If no source matches, the browser falls back to the img element's src attribute.",
          "The img element is the actual rendered element in all cases. Source elements only influence which URL is loaded. The img element's width, height, alt, class, and style attributes apply regardless of which source was selected. The onerror handler on the img element fires for failures at any source.",
          "Source element order is important: put the most efficient format first (AVIF, then WebP) and reserve the img src for the most widely supported format (JPEG or PNG). Reversing the order causes browsers to use the less efficient format even when they support the better one.",
        ],
      },
      {
        eyebrow: "Basic pattern",
        title: "The AVIF → WebP → JPEG picture stack with webp fallback",
        body: [
          "The standard multi-format pattern puts AVIF at the top, WebP in the middle, and JPEG or PNG in the final img tag. All browsers that support AVIF use the AVIF source. Browsers that support WebP but not AVIF use the WebP source. Older browsers fall back to the img src.",
          "Each source's srcset can contain multiple resolutions using the w descriptor. The browser picks the right resolution based on the sizes attribute and the device pixel ratio.",
        ],
        code: `<picture>
  <source
    srcset="/image.avif 1x, /image@2x.avif 2x"
    type="image/avif"
  />
  <source
    srcset="/image.webp 1x, /image@2x.webp 2x"
    type="image/webp"
  />
  <img
    src="/image.jpg"
    srcset="/image@2x.jpg 2x"
    onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x300/F3F4F6/9CA3AF'"
    width="400"
    height="300"
    alt="Product photo"
    loading="lazy"
  />
</picture>`,
      },
      {
        eyebrow: "Placeholder sources",
        title: "Adding placeholder URLs to picture source elements",
        body: [
          "When a source file does not exist yet—during development or for products without uploaded photos—a placeholder URL in the source srcset keeps the layout intact. The placeholder URL can serve any format including WebP. Use the format suffix in the fallback.pics URL to match the source element's type.",
          "During development, replace real image URLs with placeholder URLs that match the expected dimensions. This lets you build and test the picture element structure without waiting for assets.",
        ],
        code: `<!-- Development placeholder in each source -->
<picture>
  <source
    srcset="https://fallback.pics/api/v1/400x300.webp?text=WebP+Placeholder"
    type="image/webp"
  />
  <img
    src="https://fallback.pics/api/v1/400x300?text=JPEG+Placeholder"
    width="400"
    height="300"
    alt="Placeholder"
  />
</picture>`,
      },
      {
        eyebrow: "Responsive sources",
        title: "Combining responsive srcset with webp fallback",
        body: [
          "For responsive images, the picture element can combine format selection with responsive sizing. Use the w descriptor in srcset alongside a sizes attribute to let the browser pick both the right format and the right resolution for the current viewport and device.",
          "Placeholder URLs can also use the w descriptor pattern by generating different sizes at build time. This is more setup than a single placeholder URL but provides an accurate preview of how the responsive image behaves at different breakpoints.",
        ],
        code: `<picture>
  <source
    type="image/webp"
    srcset="/image-400.webp 400w, /image-800.webp 800w, /image-1200.webp 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 960px) 800px, 1200px"
  />
  <img
    src="/image-800.jpg"
    srcset="/image-400.jpg 400w, /image-800.jpg 800w, /image-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 960px) 800px, 1200px"
    onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/800x600/F3F4F6/9CA3AF'"
    width="800"
    height="600"
    alt="Hero image"
    loading="lazy"
  />
</picture>`,
      },
      {
        eyebrow: "React components",
        title: "React picture component with webp fallback and onerror",
        body: [
          "In React, the picture element translates directly to JSX. Avoid the common mistake of using camelCase for srcSet—React's JSX does accept srcSet for img and source elements. The onerror handler on the img element works the same way as in plain HTML.",
          "If you use Next.js Image component, it handles format negotiation and responsive sizes automatically via the Accept header and Cloudflare Image Resizing or a custom loader. For external images without a CDN loader, the manual picture approach is still the most reliable path.",
        ],
        code: `function ResponsiveImage({ src, webp, avif, alt, width, height, fallbackSrc }) {
  const [errored, setErrored] = React.useState(false);

  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      {webp && <source srcSet={webp} type="image/webp" />}
      <img
        src={errored ? fallbackSrc : src}
        width={width}
        height={height}
        alt={alt}
        onError={() => !errored && setErrored(true)}
        loading="lazy"
      />
    </picture>
  );
}`,
      },
      {
        eyebrow: "Resources",
        title: "Related format and fallback guides",
        body: [
          "The fallback.pics API supports WebP and JPEG output formats for placeholders. Related posts cover SVG vs raster placeholder tradeoffs and lazy loading patterns.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/svg-placeholder-images-fast-cacheable-scalable/
https://fallback.pics/blog/lazy-loading-images-placeholder-fallbacks/`,
      },
    ],
    takeaways: [
      "Put source elements in order from most efficient (AVIF) to least, with the img src as the final JPEG fallback.",
      "The onerror handler on the img element fires for failures at any source in the picture element.",
      "Use format suffixes (.webp, .jpg) in fallback.pics URLs to match the type attribute in source elements.",
      "Combine the w descriptor for responsive sizing with type-based source selection in the same picture element.",
      "In React, use a state variable for errored and set the img src conditionally rather than using the string onerror attribute.",
    ],
    related: [
      "svg-placeholder-images-fast-cacheable-scalable",
      "lazy-loading-images-placeholder-fallbacks",
      "fix-broken-images-html-onerror",
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────────
  {
    title: "Fakeimg.pl and fakeimg Alternatives for Production Apps",
    description:
      "Compare fakeimg.pl with modern fakeimg alternative services and learn which placeholder API is appropriate for development mockups versus real production fallback states.",
    slug: "fakeimg-alternatives-production",
    readTime: "8 min read",
    category: "Alternatives",
    tags: [
      "Fakeimg alternative",
      "Placeholder image API",
      "Development tools",
      "Image placeholders",
      "Production fallback",
    ],
    summary: [
      "Fakeimg.pl is a simple placeholder image service that generates labeled rectangles. It works well for quick mockups but lacks the reliability, format options, and production-oriented features that real fallback states require. If you are shipping fakeimg URLs to production, you have a problem.",
      "This guide covers what fakeimg.pl provides, where it falls short for production use, and how to migrate to a URL-based alternative that supports avatars, skeletons, blur placeholders, and deterministic CDN caching.",
    ],
    sections: [
      {
        eyebrow: "What fakeimg offers",
        title: "What fakeimg.pl provides and where it is useful",
        body: [
          "Fakeimg.pl generates a PNG image with a gray background and white text showing the dimensions. You can pass custom background and text colors as URL path segments. The URL format is /WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR with an optional text query parameter.",
          "It is useful for rapid wireframing and initial HTML layout work where you need a visible image of a specific size without sourcing a real photo. Many developers use it as a starting point for mockups before final assets are available.",
          "The limitation is that fakeimg.pl is a third-party service with no SLA, no CDN, and no guaranteed uptime. In 2022 and 2023 the service experienced extended downtime, breaking mockups and demo deployments that had not replaced the development URLs before shipping.",
        ],
      },
      {
        eyebrow: "Production problems",
        title: "Why fakeimg URLs should not reach production",
        body: [
          "Any dependency on a third-party service you do not control is a production risk. If fakeimg.pl goes down—as it has—your fallback images return 503s. A 503 on an image URL shows the broken-image icon, which is exactly the problem a fallback image is supposed to prevent.",
          "Fakeimg.pl does not send CDN-friendly cache headers for all responses. Without long-lived Cache-Control headers, each page load may generate a new request to the origin server rather than serving from a CDN edge node. For high-traffic pages, this adds latency and load.",
          "There is no avatar route, no skeleton loader, no blur placeholder, and no thumbnail generator. For production apps with multiple image states—empty avatar slots, skeleton loading grids, blog thumbnails—you end up combining multiple services with inconsistent URL formats.",
        ],
      },
      {
        eyebrow: "URL comparison",
        title: "Translating fakeimg URLs to fallback.pics equivalents",
        body: [
          "The URL translation is straightforward. The fakeimg path format maps directly to the fallback.pics dimension format. Custom colors and text parameters both exist in fallback.pics with minor syntax differences.",
          "The main difference is the base domain and the /api/v1/ prefix. Your build pipeline or a simple find-and-replace can handle bulk migration across a codebase.",
        ],
        code: `# fakeimg.pl format
https://fakeimg.pl/400x300/                    # gray placeholder
https://fakeimg.pl/400x300/7C3AED/FFFFFF       # custom colors
https://fakeimg.pl/400x300/?text=Hello         # with text

# fallback.pics equivalents
https://fallback.pics/api/v1/400x300           # gray placeholder
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF  # custom colors
https://fallback.pics/api/v1/400x300?text=Hello     # with text

# Features fakeimg does not have
https://fallback.pics/api/v1/avatar/80?text=AB
https://fallback.pics/api/v1/animated/skeleton/400x300
https://fallback.pics/api/v1/blur/400x300
https://fallback.pics/api/v1/thumbnail/1200x630?text=Blog+Title&style=soft`,
      },
      {
        eyebrow: "Migration",
        title: "Migrating a codebase from fakeimg to a production-safe alternative",
        body: [
          "Search the codebase for all fakeimg.pl URLs. In most JavaScript and TypeScript projects, a simple rg or grep for fakeimg.pl surfaces all occurrences. Update them in bulk using a script or your IDE's find-and-replace across files.",
          "Pay attention to dynamic URL construction. If fakeimg URLs are built from templates using width and height variables, make sure the template updates to the new format rather than just replacing the domain. The path structure is close enough that a regex substitution usually works.",
          "Add a CI lint rule or a grep check in your deployment pipeline that fails the build if fakeimg.pl appears in any source file. This prevents accidental regression after the migration.",
        ],
        code: `# Find all fakeimg.pl references in a JS/TS project
rg "fakeimg\\.pl" --type ts --type js

# Bulk replace in place (macOS sed syntax)
rg -l "fakeimg\\.pl" | xargs sed -i '' 's|fakeimg\.pl|fallback.pics/api/v1|g'

# Add to CI as a lint check (package.json script)
# "lint:images": "! rg fakeimg.pl src/"`,
      },
      {
        eyebrow: "Feature gaps",
        title: "What you get from a modern fakeimg alternative",
        body: [
          "A modern URL-based placeholder API provides routes beyond basic dimension rectangles. Avatar placeholders with initials or a question mark fill user profile slots. Animated skeleton placeholders fill loading states. Blur placeholders fill LQIP slots. Thumbnail routes fill blog featured image slots with title text.",
          "All of these are accessible from deterministic URLs with predictable CDN caching. You do not need to host image files, maintain an image generation server, or depend on a third-party service with no SLA.",
        ],
        cards: [
          {
            title: "Avatar route",
            body: "https://fallback.pics/api/v1/avatar/80?text=JD — initials in a circle, consistent across user profiles.",
          },
          {
            title: "Skeleton route",
            body: "https://fallback.pics/api/v1/animated/skeleton/400x300 — animated shimmer for loading grid states.",
          },
          {
            title: "Thumbnail route",
            body: "https://fallback.pics/api/v1/thumbnail/1200x630?text=Post+Title — labeled blog card fallback at OG dimensions.",
          },
        ],
      },
      {
        eyebrow: "Storybook and test fixtures",
        title: "Updating Storybook stories and test fixtures",
        body: [
          "Storybook stories often contain hardcoded fakeimg URLs in the args defaults. Update these to fallback.pics URLs and the stories will continue to work without modification. The visual appearance is similar—a labeled rectangle—but the source is now a service with proper CDN headers.",
          "Test fixtures in Jest, Vitest, or Playwright that reference fakeimg URLs should also be updated. Deterministic fallback.pics URLs are stable across test runs and do not depend on external service availability.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Placeholder API comparison and migration guides",
        body: [
          "Related posts compare other popular placeholder services and cover the migration from via.placeholder.com in detail.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/best-placeholder-image-apis-for-developers/
https://fallback.pics/blog/via-placeholder-alternative-migration/`,
      },
    ],
    takeaways: [
      "Fakeimg.pl is fine for local mockups but has no SLA, no CDN, and no guarantee of uptime—do not ship it to production.",
      "The fakeimg.pl URL format maps directly to fallback.pics with a domain change and /api/v1/ prefix.",
      "Use rg to find all fakeimg.pl references and bulk-replace them before deploying.",
      "Add a CI lint rule to prevent fakeimg.pl from reappearing after migration.",
      "Fallback.pics adds avatar, skeleton, blur, and thumbnail routes that fakeimg.pl does not provide.",
    ],
    related: [
      "best-placeholder-image-apis-for-developers",
      "placeholder-image-generator-vs-dummy-image-generator",
      "via-placeholder-alternative-migration",
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────────
  {
    title: "via.placeholder.com Migration Guide (Service Changes)",
    description:
      "Migrate away from via.placeholder.com with a direct URL translation guide, bulk find-and-replace scripts, and a via placeholder alternative that adds CDN caching and production routes.",
    slug: "via-placeholder-alternative-migration",
    readTime: "8 min read",
    category: "Alternatives",
    tags: [
      "Via placeholder alternative",
      "via.placeholder.com",
      "Placeholder migration",
      "Image placeholder API",
      "Developer tools",
    ],
    summary: [
      "Via.placeholder.com was one of the most widely used placeholder image services, appearing in tutorials, course materials, and thousands of open-source repositories. Service reliability issues and deprecation notices have pushed developers to seek a via placeholder alternative with better uptime guarantees.",
      "This guide covers the via.placeholder.com URL format, a direct translation to fallback.pics equivalents, bulk migration scripts, and how to update Storybook stories and test fixtures efficiently.",
    ],
    sections: [
      {
        eyebrow: "History",
        title: "Via.placeholder.com service reliability and deprecation",
        body: [
          "Via.placeholder.com has gone through multiple ownership and maintenance changes. The service has experienced extended downtime, rate limiting, and changes in behavior for requests without referer headers. Developers who relied on it in production faced broken images in demos, documentation, and staging environments.",
          "The core problem is that via.placeholder.com was always intended as a simple developer utility, not a production-grade service. It was not built for CDN caching, has no SLA, and does not provide the modern routes that production placeholder use cases require.",
          "If you are finding via.placeholder.com URLs in your codebase during a dependency audit, that is a signal to migrate before the service changes behavior again.",
        ],
      },
      {
        eyebrow: "URL format",
        title: "Understanding the via.placeholder.com URL structure",
        body: [
          "Via.placeholder.com uses a path-based format: /WIDTHxHEIGHT for basic dimensions, /WIDTHxHEIGHT/BGCOLOR for custom background, and a text query parameter for labels. Colors are hex without the # prefix. The path format is similar to fallback.pics with minor differences in path ordering.",
          "The main difference: via.placeholder.com puts the dimensions in the first path segment without a prefix, while fallback.pics uses /api/v1/ as the base prefix. Text and color parameters match closely.",
        ],
        code: `# via.placeholder.com format
https://via.placeholder.com/400x300
https://via.placeholder.com/400x300/7C3AED
https://via.placeholder.com/400x300/7C3AED/FFFFFF
https://via.placeholder.com/400x300?text=Hello+World
https://via.placeholder.com/400        # square shorthand

# fallback.pics equivalents
https://fallback.pics/api/v1/400x300
https://fallback.pics/api/v1/400x300/7C3AED
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF
https://fallback.pics/api/v1/400x300?text=Hello+World
https://fallback.pics/api/v1/square/400`,
      },
      {
        eyebrow: "Bulk migration",
        title: "Finding and replacing via.placeholder.com URLs at scale",
        body: [
          "Use ripgrep to find all via.placeholder.com occurrences across your project. The URL appears in HTML templates, JSX files, CSS background properties, JSON fixtures, and Markdown documentation. Search without file type filters first to get a complete count.",
          "A regex substitution handles the path prefix difference. The dimensions segment stays the same; only the domain and base path change. Test the substitution on a single file before running it across the full codebase.",
        ],
        code: `# Find all occurrences
rg "via\\.placeholder\\.com" --include="*.{ts,tsx,js,jsx,html,md,json}"

# Preview the replacement (dry run with sed)
rg -l "via\\.placeholder\\.com" | \
  xargs sed 's|https://via\\.placeholder\\.com/\\([0-9x]*\\)|https://fallback.pics/api/v1/\\1|g'

# Apply in place (macOS)
rg -l "via\\.placeholder\\.com" | \
  xargs sed -i '' 's|https://via\.placeholder\.com/|https://fallback.pics/api/v1/|g'

# Apply in place (Linux)
rg -l "via\\.placeholder\\.com" | \
  xargs sed -i 's|https://via\.placeholder\.com/|https://fallback.pics/api/v1/|g'`,
      },
      {
        eyebrow: "Edge cases",
        title: "Handling via.placeholder.com edge cases in the migration",
        body: [
          "The square shorthand (/400 instead of /400x400) does not have a direct equivalent in fallback.pics. Replace these with either /400x400 or /square/400—both produce a square image. The /square/ route is more explicit and readable.",
          "Via.placeholder.com supports a /gif route for animated GIFs. If you are using GIF placeholders, migrate to the animated skeleton route instead. The skeleton animation is lighter than a GIF and has better visual quality.",
          "Text with special characters in via.placeholder.com URLs uses %20 for spaces. Fallback.pics also accepts %20 but the + encoding is shorter. Either works; leave the encoding as-is during migration to avoid double-encoding issues.",
        ],
      },
      {
        eyebrow: "Storybook",
        title: "Updating Storybook args and fixtures",
        body: [
          "Storybook stories often define image URLs in args defaults, argTypes controls, or directly in story JSX. Search your .stories.tsx and .stories.js files separately since they may use different patterns than application code.",
          "Component README files and docs pages that show via.placeholder.com URLs in example code also need updating. These are documentation issues but they matter because they are often the reference that future developers copy from when adding new image slots.",
        ],
        code: `// Before migration – Storybook args
export const Default = {
  args: {
    imageUrl: 'https://via.placeholder.com/400x300',
    avatarUrl: 'https://via.placeholder.com/80x80',
  },
};

// After migration
export const Default = {
  args: {
    imageUrl: 'https://fallback.pics/api/v1/400x300',
    avatarUrl: 'https://fallback.pics/api/v1/avatar/80',
  },
};`,
      },
      {
        eyebrow: "Prevention",
        title: "Preventing via.placeholder.com from reappearing after migration",
        body: [
          "Add a CI check that scans the source tree for via.placeholder.com and fails the build if found. This prevents new occurrences from sneaking in through copy-pasted code, imported dependencies, or contributors unfamiliar with the migration.",
          "Update your team's development setup guide or onboarding document to reference fallback.pics instead of via.placeholder.com. Most developers reach for a placeholder service by memory or convention; the first reference they see in internal docs is usually the one they copy.",
        ],
        code: `# package.json – add to lint or test scripts
# "lint:placeholders": "! rg via.placeholder.com src/ docs/"

# .github/workflows/ci.yml – add a step
- name: Check for deprecated placeholder URLs
  run: |
    if rg "via\\.placeholder\\.com" src/ docs/ --quiet; then
      echo "Found via.placeholder.com URLs. Please migrate to fallback.pics."
      exit 1
    fi`,
      },
      {
        eyebrow: "Resources",
        title: "Related placeholder migration and comparison guides",
        body: [
          "Related posts cover fakeimg.pl migration and a comparison of URL-based placeholder APIs.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fakeimg-alternatives-production/
https://fallback.pics/blog/placeholder-com-alternative/`,
      },
    ],
    takeaways: [
      "Via.placeholder.com has experienced extended downtime and is not suitable for production use.",
      "The URL format translates directly: replace https://via.placeholder.com/ with https://fallback.pics/api/v1/.",
      "Replace /400 square shorthand with /square/400 or /400x400 explicitly.",
      "Run the migration with ripgrep + sed and verify with a CI check that rejects the old domain.",
      "Update Storybook args, test fixtures, and documentation alongside application code.",
    ],
    related: [
      "best-placeholder-image-apis-for-developers",
      "fakeimg-alternatives-production",
      "placeholder-com-alternative",
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────────
  {
    title: "Placeholder.com vs URL-Based Placeholder APIs",
    description:
      "Compare placeholder.com alternative services against URL-based placeholder APIs for developers. Understand format support, caching, production safety, and feature gaps.",
    slug: "placeholder-com-alternative",
    readTime: "8 min read",
    category: "Alternatives",
    tags: [
      "Placeholder.com alternative",
      "Placeholder image API",
      "Image placeholder comparison",
      "Developer tools",
      "Production images",
    ],
    summary: [
      "Placeholder.com generates simple gray boxes at any dimension and has been a go-to resource for mockups since 2013. As a placeholder.com alternative, URL-based APIs like fallback.pics add avatar routes, skeleton loaders, blur placeholders, custom colors, and CDN-backed caching that placeholder.com does not provide.",
      "This guide compares the two approaches on format support, uptime guarantees, caching behavior, production suitability, and total feature set so you can make an informed choice for your project.",
    ],
    sections: [
      {
        eyebrow: "What placeholder.com offers",
        title: "Placeholder.com's gray box model and use cases",
        body: [
          "Placeholder.com generates PNG images with a gray background and centered text showing the dimensions. The URL format is simple: /WIDTHxHEIGHT with optional hex color path segments. It works without authentication, is freely accessible, and appears in countless tutorials and course materials.",
          "The service is well-suited for HTML learning exercises, wireframe mockups, and documentation examples where the only requirement is a visible rectangle of a specific size. For these use cases, placeholder.com is perfectly adequate.",
          "Where it falls short is everything beyond a gray box. There is no avatar route, no animation, no blur placeholder, no custom-text thumbnail generation, and no format options beyond the default PNG. For a production app with multiple image states, you cannot rely on placeholder.com alone.",
        ],
      },
      {
        eyebrow: "Reliability",
        title: "Third-party service risk for placeholder.com",
        body: [
          "Placeholder.com is a free service maintained by a small team. It has experienced downtime, slow response times during high-traffic periods, and has gone through ownership changes. Unlike a service backed by a CDN like Cloudflare, requests to placeholder.com may originate from a single region and introduce latency for users in other regions.",
          "A production application that shows a broken image icon because a third-party placeholder service went down has the same user-facing problem as if the real image failed. The whole point of a placeholder is to prevent the broken icon.",
        ],
      },
      {
        eyebrow: "Feature comparison",
        title: "URL-based placeholder APIs vs placeholder.com",
        body: [
          "The comparison below covers the features most commonly needed in production applications. Placeholder.com covers the basics; URL-based APIs add the production-oriented features.",
        ],
        cards: [
          {
            title: "Dimensions and colors",
            body: "Both support custom width × height and hex background colors. URL-based APIs also support text color parameters and named color presets.",
          },
          {
            title: "Format and routes",
            body: "Placeholder.com outputs PNG only. URL-based APIs support SVG, PNG, JPEG, WebP, avatar, skeleton, blur, and thumbnail routes for different use cases.",
          },
          {
            title: "CDN and caching",
            body: "Placeholder.com does not publish Cache-Control headers for all responses. fallback.pics uses Cloudflare edge caching with immutable headers for deterministic URLs.",
          },
        ],
      },
      {
        eyebrow: "URL translation",
        title: "Translating placeholder.com URLs to fallback.pics",
        body: [
          "The path format is similar. Placeholder.com uses /WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR. Fallback.pics uses /api/v1/WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR. The main change is adding the /api/v1/ base path. Hex colors without # work the same way in both.",
          "Fallback.pics accepts both WIDTHxHEIGHT and WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR path segments, so most placeholder.com URLs are a direct swap after updating the domain and adding the base path.",
        ],
        code: `# placeholder.com format
https://via.placeholder.com/400x300
https://via.placeholder.com/400x300/7C3AED
https://via.placeholder.com/400x300/7C3AED/FFFFFF

# fallback.pics equivalents
https://fallback.pics/api/v1/400x300
https://fallback.pics/api/v1/400x300/7C3AED
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF

# Routes placeholder.com does not offer
https://fallback.pics/api/v1/avatar/80?text=JD
https://fallback.pics/api/v1/animated/skeleton/400x300
https://fallback.pics/api/v1/blur/400x300
https://fallback.pics/api/v1/thumbnail/1200x630?text=Article+Title&style=soft`,
      },
      {
        eyebrow: "When to keep placeholder.com",
        title: "When placeholder.com is still appropriate",
        body: [
          "Placeholder.com is appropriate in contexts that are explicitly not production: HTML course exercises, wireframe screenshots in documentation, and one-off demo pages where uptime does not matter. If the only use case is 'show me a gray box of this size,' placeholder.com works fine.",
          "The migration becomes important when placeholder.com URLs appear in code that ships to users. A find-replace migration to a production-safe alternative takes less than an hour and eliminates the dependency on a service you do not control.",
        ],
      },
      {
        eyebrow: "Production checklist",
        title: "Checklist for selecting a placeholder.com alternative",
        body: [
          "Before selecting any third-party placeholder service for production use, verify three things: the service uses a CDN for global edge delivery; the URL format is deterministic so the same parameters always produce the same image; and the service provides routes beyond basic dimension rectangles.",
          "Verify that the service sends correct Content-Type headers and Cache-Control: public, max-age with a long TTL. These are the headers that allow browser and CDN caching to work correctly. Without them, every image request hits the origin server.",
        ],
        code: `# Verify headers with curl
curl -I "https://fallback.pics/api/v1/400x300"

# Expected headers:
# Content-Type: image/svg+xml
# Cache-Control: public, max-age=31536000, immutable
# Vary: Accept`,
      },
      {
        eyebrow: "Resources",
        title: "Related comparison and placeholder API guides",
        body: [
          "Related posts compare other popular placeholder services and cover the via.placeholder.com migration in more detail.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/via-placeholder-alternative-migration/
https://fallback.pics/blog/placeholder-image-api-url-syntax-guide/`,
      },
    ],
    takeaways: [
      "Placeholder.com is suitable for mockups and exercises but not for production—it has no CDN, no SLA, and limited format options.",
      "The URL translation is a domain change plus adding /api/v1/ as the base path.",
      "URL-based placeholder APIs add avatar, skeleton, blur, and thumbnail routes that placeholder.com does not offer.",
      "Verify that any placeholder service you use sends Cache-Control: public, max-age headers for CDN caching.",
      "Run a codebase search for placeholder.com and migrate before it causes a production incident.",
    ],
    related: [
      "best-placeholder-image-apis-for-developers",
      "via-placeholder-alternative-migration",
      "placeholder-image-api-url-syntax-guide",
    ],
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────────
  {
    title: "How Broken Images Hurt SEO (and Fix Them with Fallback URLs)",
    description:
      "Understand how broken images seo impact affects crawling, Core Web Vitals CLS, and structured data. Fix broken images with onerror fallback URLs before they cost you rankings.",
    slug: "broken-images-seo-fallback-fix",
    readTime: "9 min read",
    category: "Performance",
    tags: [
      "Broken images SEO",
      "Image alt text",
      "Core Web Vitals",
      "CLS",
      "SEO images",
    ],
    summary: [
      "Broken images affect SEO in three distinct ways: Googlebot cannot index image content from broken URLs, the missing visual signals CLS to Core Web Vitals if dimensions are not reserved, and structured data markup that references broken images may be treated as invalid by Google's rich results validator.",
      "This guide covers how broken images seo impact works in practice, how to find broken images at scale, and how fallback URLs prevent the SEO damage without requiring changes to your CMS or upload workflow.",
    ],
    sections: [
      {
        eyebrow: "How Google sees it",
        title: "How broken images affect SEO and Googlebot crawling",
        body: [
          "Googlebot crawls images separately from page content. It follows img src attributes, srcset URLs, and og:image meta tag values. When a crawl returns a 4xx or 5xx status for an image URL, Google marks that image as unavailable for its index. Indexed images contribute to Google Images traffic and can appear as rich results for some content types.",
          "Broken images in structured data are flagged by the Rich Results Test. If your Article, Product, or Recipe schema references an image URL that returns an error, the structured data is considered incomplete and may not generate rich results in search. The image property is required in several schema types.",
          "Broken images do not directly cause a page ranking penalty, but they can reduce crawl efficiency. Google's crawl budget is not unlimited—spending crawl capacity on broken image URLs is waste that could be used for new or updated content.",
        ],
      },
      {
        eyebrow: "CLS impact",
        title: "CLS from missing images hurts Core Web Vitals scores",
        body: [
          "Cumulative Layout Shift (CLS) is a Core Web Vitals metric that measures how much the page layout shifts during load. An image without width and height attributes that fails to load starts as zero height, then causes a shift when an error state renders or when a fallback image loads at its intrinsic size.",
          "Google uses CLS as a ranking signal via the Page Experience update. A CLS score above 0.1 is in the 'needs improvement' category; above 0.25 is 'poor.' A catalog page with dozens of broken product images, each causing a small layout shift, can accumulate a CLS score that meaningfully affects rankings.",
          "The fix at the layout level is setting explicit width and height on every img element. The fix at the content level is providing a fallback URL via onerror so the element always has a visible, correctly-sized image even when the original URL fails.",
        ],
      },
      {
        eyebrow: "Finding broken images",
        title: "Scanning for broken images at scale with crawlers and logs",
        body: [
          "Screaming Frog, Sitebulb, and Ahrefs Site Audit all detect broken image URLs during a site crawl. Run a full crawl and filter for image URLs returning 4xx or 5xx responses. Export the list and triage by page—product pages, blog posts, and category archives are typically the highest priority.",
          "Server access logs give you the real-world picture. Filter for image requests returning 404 and group by URL path. High-frequency 404s for image URLs usually indicate a systematic problem: an upload workflow that does not create the expected filename, a CDN path change, or a CMS migration that broke image references.",
          "Sentry and similar error monitoring tools can track client-side image errors via the img onerror event. A global error handler that logs broken image URLs provides real-user data that crawlers cannot capture, including images that fail due to CDN edge issues or client network conditions.",
        ],
      },
      {
        eyebrow: "Onerror fallback",
        title: "Using fallback URLs to fix broken images before Google crawls them",
        body: [
          "An onerror fallback URL does not change the response Googlebot gets when it crawls the original src—it still returns a 404. The fallback only fires in the browser. To fix the SEO problem completely, you need to update the actual src value or add a server-side redirect for the broken URL.",
          "However, the onerror fallback immediately fixes the user-facing problem and prevents the CLS damage. For pages where the broken image is causing measurable CLS, adding the fallback while you investigate the root cause is the right tactical step.",
          "For structured data, update the image property to reference the fallback URL so Google's validator sees a valid, accessible image. This is more important for Product and Article schema where the image is required for rich results.",
        ],
        code: `<!-- Fix broken image with onerror fallback (prevents CLS for users) -->
<img
  src="/uploads/product-photo.jpg"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text=No+Image'"
  width="400"
  height="400"
  alt="Product photo"
/>

<!-- Update structured data to reference a valid image URL -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text=Product"
}
</script>`,
      },
      {
        eyebrow: "Alt text",
        title: "Alt text on fallback images for SEO and accessibility",
        body: [
          "The alt attribute on a fallback image should describe the content the image represents, not the fact that it is a fallback. If the fallback is for a product photo, alt should be the product name. If it is for a blog featured image, alt should be the post title or a description of the topic.",
          "Search engines use alt text as a signal for image relevance. An empty alt on a fallback image is treated as a decorative image; a descriptive alt is treated as content-relevant. For product and editorial content where images contribute to SEO, maintain meaningful alt text even on fallback states.",
          "Screen readers announce alt text when images are not loaded or when images fail. Users navigating with assistive technology need meaningful alt text on fallback images just as much as on real images.",
        ],
      },
      {
        eyebrow: "Sitemap",
        title: "Image sitemaps and broken image references",
        body: [
          "XML sitemaps with image extensions reference image URLs that should return 200 responses. A sitemap that lists broken image URLs tells Google to crawl URLs that return errors, which wastes crawl budget. Audit your image sitemap periodically and remove or update entries for image URLs that no longer exist.",
          "Generate image sitemap entries programmatically from your CMS. If your CMS flags products or posts without images, you can skip those entries from the sitemap or use the fallback URL as the sitemap image reference. A fallback URL in the image sitemap is better than a broken URL—it gives Google something to index.",
        ],
        code: `<!-- Image sitemap with fallback URL for products without photos -->
<url>
  <loc>https://example.com/products/widget/</loc>
  <image:image>
    <image:loc>https://fallback.pics/api/v1/400x400/F3F4F6/9CA3AF?text=Widget</image:loc>
    <image:title>Widget</image:title>
    <image:caption>Product image for Widget</image:caption>
  </image:image>
</url>`,
      },
      {
        eyebrow: "Resources",
        title: "Related SEO and broken image guides",
        body: [
          "The related posts below cover the practical checklist for fixing broken images and alt text rules for placeholder images.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/fix-broken-images-html-onerror/
https://fallback.pics/blog/alt-text-placeholder-fallback-images/`,
      },
    ],
    takeaways: [
      "Broken image URLs waste Googlebot crawl budget and exclude images from Google Images indexing.",
      "CLS from missing images—images without reserved dimensions—affects Core Web Vitals scores and page experience rankings.",
      "The onerror fallback fixes the user-facing problem immediately; fix the actual src URL to resolve the SEO problem completely.",
      "Update image properties in structured data to reference valid URLs so rich results validation passes.",
      "Maintain descriptive alt text on fallback images—screen readers and search engines both use it.",
    ],
    related: [
      "fix-broken-images-html-onerror",
      "broken-image-icon-to-branded-fallback-checklist",
      "alt-text-placeholder-fallback-images",
    ],
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────────
  {
    title: "Alt Text for Placeholder and Fallback Images: Practical Rules",
    description:
      "Apply practical image alt text placeholder rules for loading states, error fallbacks, decorative placeholders, and screen reader accessibility across WCAG guidelines.",
    slug: "alt-text-placeholder-fallback-images",
    readTime: "8 min read",
    category: "UX Patterns",
    tags: [
      "Image alt text placeholder",
      "Alt text accessibility",
      "WCAG images",
      "Screen reader",
      "Fallback images",
    ],
    summary: [
      "Alt text rules for standard content images are well understood, but placeholder and fallback images create cases that do not fit neatly into the standard guidance. A loading skeleton is decorative; a fallback image for a failed product photo is not.",
      "This guide covers WCAG rules for decorative vs informative images, practical alt text choices for loading states and error fallbacks, how screen readers handle these states, and real examples from production UI patterns.",
    ],
    sections: [
      {
        eyebrow: "Two categories",
        title: "Decorative vs informative: the WCAG image alt text rule",
        body: [
          "WCAG 2.1 Success Criterion 1.1.1 requires that all non-decorative images have a text alternative that describes the image's purpose or content. Decorative images—images that add visual interest but convey no information needed to understand the content—should use empty alt attributes (alt=\"\") so screen readers skip them.",
          "The key question for placeholder and fallback images is: does this image convey information the user needs? A loading skeleton is decorative—it conveys state, not content. A fallback image for a product photo that failed to load is informative—it represents a product the user is looking at.",
          "Getting this distinction wrong causes real accessibility problems. An empty alt on a product fallback means screen readers skip the image slot entirely, giving blind users no indication that a product image should be there. A long alt text on a skeleton loader means screen readers announce the loading state for every item in a skeleton grid, which is noisy and confusing.",
        ],
      },
      {
        eyebrow: "Loading states",
        title: "Alt text for skeleton and blur placeholder loading states",
        body: [
          "Skeleton loaders and blur placeholders are used while content loads. They are transitional UI states, not content. Use empty alt=\"\" on these images so screen readers do not announce the loading state.",
          "If you want to communicate the loading state to screen reader users, use an aria-label on the container element or add an aria-live region that announces when content finishes loading. Do not put loading state information in image alt attributes.",
          "In practice: a product card skeleton with an img element showing a shimmer placeholder should have alt=\"\". The screen reader user does not need to hear 'shimmer placeholder 400x300' for every card in the grid.",
        ],
        code: `<!-- Loading skeleton: decorative, empty alt -->
<div class="card" aria-label="Loading product">
  <img
    src="https://fallback.pics/api/v1/animated/skeleton/400x300"
    alt=""
    width="400"
    height="300"
    role="presentation"
  />
  <div class="skeleton-text" aria-hidden="true"></div>
</div>

<!-- Content loaded: informative, meaningful alt -->
<div class="card">
  <img
    src="/product-photo.jpg"
    alt="Running shoes in blue and white, size range 6-13"
    width="400"
    height="300"
  />
  <h3>Running Shoes</h3>
</div>`,
      },
      {
        eyebrow: "Error fallbacks",
        title: "Alt text when the image alt text placeholder is an error state",
        body: [
          "When a product or content image fails to load and is replaced by a fallback URL via onerror, the alt attribute should still describe the intended content, not the failure. If the original img has alt=\"Running shoes\" and the src fails, the fallback should also have alt=\"Running shoes\".",
          "In most implementations, the alt attribute is set on the img element and does not change when the src changes via onerror. As long as your original alt is correct, the error fallback inherits it automatically. The alt attribute only needs special handling if you are dynamically generating it.",
          "If the fallback image itself conveys context—for example, a product placeholder labeled with the product name—that label is already in the fallback URL as a text parameter and will be visible to sighted users. The alt should describe the product, not the placeholder label.",
        ],
        code: `<!-- Original image with good alt text -->
<img
  src="/products/running-shoes.jpg"
  alt="Running shoes in blue and white"
  width="400"
  height="300"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/400x300/F3F4F6/9CA3AF?text=Running+Shoes'"
/>
<!-- If the src fails, alt is still "Running shoes in blue and white" ✓ -->`,
      },
      {
        eyebrow: "Empty avatar slots",
        title: "Alt text for user avatar fallbacks and initials placeholders",
        body: [
          "User avatar slots without an uploaded photo typically show initials or a generic user icon. The alt text should identify the user, not describe the placeholder. If the avatar represents a user named Jane Doe, use alt=\"Jane Doe\" or alt=\"Profile photo for Jane Doe\".",
          "Generic user icon fallbacks that do not identify a specific user can use alt=\"User\" or alt=\"Profile photo\" depending on context. If the avatar is next to a username, it may be redundant and can use alt=\"\" to avoid announcing the same name twice in quick succession.",
          "For a list of users or contributors, screen readers will read through each item sequentially. Consistent, specific alt text on avatar fallbacks ensures the list is comprehensible to users who cannot see the images.",
        ],
        code: `<!-- Avatar with user name in alt -->
<img
  src="{{ user.avatarUrl }}"
  alt="{{ user.name }}"
  width="48"
  height="48"
  onerror="this.onerror=null; this.src='https://fallback.pics/api/v1/avatar/48?text={{ user.initials }}'"
  class="rounded-full"
/>

<!-- Generic user icon: alt describes function not appearance -->
<img
  src="https://fallback.pics/api/v1/avatar/48?text=?"
  alt="Unknown user"
  width="48"
  height="48"
/>`,
      },
      {
        eyebrow: "Test placeholders",
        title: "Alt text for placeholder images in testing and Storybook",
        body: [
          "Placeholder images in test fixtures and Storybook stories should have descriptive alt text that matches what the real image would show. This makes visual regression tests more meaningful and ensures that accessibility testing tools do not flag placeholder images as missing alt text.",
          "In Storybook, placeholder args that replace real product images should use the product category or description as the alt text, not placeholder-specific text like 'placeholder 400x300'. This produces more realistic accessibility audits during development.",
        ],
        code: `// Storybook args with descriptive alt text
export const ProductCard = {
  args: {
    imageUrl: 'https://fallback.pics/api/v1/400x300',
    imageAlt: 'Product photo',  // matches what the real image would show
    title: 'Product Name',
  },
};

// Not this:
imageAlt: 'Placeholder 400x300',  // describes the placeholder, not the content`,
      },
      {
        eyebrow: "Dynamic alt",
        title: "Dynamically generating alt text from content metadata",
        body: [
          "When image content is loaded from a CMS or API, the alt text should come from the same data source as the image URL. CMS systems like Contentful, Sanity, and WordPress store alt text alongside image files. Use that metadata when available rather than generating alt text from image filenames or dimensions.",
          "When alt text is absent from the CMS entry, fall back to the content title, product name, or post title. That is almost always a more useful description than an empty alt or a filename-derived string. Set up CMS validation rules that flag content entries without image alt text as incomplete.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related accessibility and SEO image guides",
        body: [
          "The related posts below cover how broken images affect SEO and the complete checklist for fixing broken image icons.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/broken-images-seo-fallback-fix/
https://fallback.pics/blog/fix-broken-images-html-onerror/`,
      },
    ],
    takeaways: [
      "Loading skeleton and blur placeholders are decorative—use empty alt=\"\" so screen readers skip them.",
      "Error fallback images inherit the original alt attribute; no change needed when swapping src via onerror.",
      "User avatar fallbacks should use the user's name as alt text, not a description of the placeholder.",
      "Test fixtures and Storybook stories should use content-descriptive alt text, not placeholder-specific text.",
      "Pull alt text from your CMS image metadata; fall back to content titles when image alt text is absent.",
    ],
    related: [
      "broken-images-seo-fallback-fix",
      "fix-broken-images-html-onerror",
      "avatar-placeholder-generator-initials-colors-accessibility",
    ],
  },
];
