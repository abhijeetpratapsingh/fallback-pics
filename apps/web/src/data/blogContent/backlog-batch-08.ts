import type { BlogPost } from '../blogPosts';

export const backlogBatch08: Omit<BlogPost, 'image' | 'date'>[] = [
  // ─── 1 ───────────────────────────────────────────────────────────────────────
  {
    title: "SwiftUI AsyncImage Placeholder and Failure States",
    description:
      "Handle swiftui asyncimage placeholder views for slow loads and network failures using content phases, custom shapes, and deterministic fallback URLs.",
    slug: "swiftui-asyncimage-placeholders",
    readTime: "8 min read",
    category: "Mobile UX",
    tags: [
      "SwiftUI AsyncImage placeholder",
      "iOS image loading",
      "AsyncImage failure",
      "SwiftUI",
      "Mobile UX",
    ],
    summary: [
      "SwiftUI's AsyncImage component handles remote image loading, but its default placeholder is a gray rectangle that conveys no context. Using the phase-based API, you can render a branded SwiftUI AsyncImage placeholder during loading and swap to a deterministic fallback URL when the network request fails.",
      "This guide walks through the phase closure pattern, custom placeholder shapes, and pairing the failure case with fallback.pics URLs that match your UI's exact dimensions and color scheme.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why the default AsyncImage placeholder falls short",
        body: [
          "AsyncImage has three states: empty (loading), success (image ready), and failure (network or decoding error). The default API collapses all three into a single content closure that only fires on success, leaving the empty and failure cases as a uniform gray box. In a product grid or avatar list, every card looks broken during load and stays broken on failure.",
          "Unlike UIKit where you set a placeholder synchronously before the request starts, SwiftUI renders the view tree before data arrives. Without explicit handling, users see no visual feedback, layout jumps when the image loads, and error states are indistinguishable from loading states.",
          "Fallback URLs fix the failure case by providing a predictable image that matches your card's dimensions. A branded fallback at exactly 400×400 prevents layout shift and gives the UI a consistent visual footprint regardless of network conditions.",
        ],
      },
      {
        eyebrow: "Implementation",
        title: "AsyncImage phase closure for placeholder and failure states",
        body: [
          "The phase-based initializer passes an AsyncImagePhase enum value to the content closure. You switch over .empty, .success(let image), and .failure to render different views for each case. The .failure case is where you inject your fallback URL.",
          "Keep placeholder views dimensionally identical to the success state. A ProgressView() inside a frame that matches the expected image size prevents layout reflow when the image resolves.",
        ],
        code: `import SwiftUI

struct FallbackImage: View {
    let url: URL?
    let width: CGFloat
    let height: CGFloat
    let fallbackURL: URL

    var body: some View {
        AsyncImage(url: url) { phase in
            switch phase {
            case .empty:
                // Skeleton placeholder while loading
                Rectangle()
                    .fill(Color(.systemGray5))
                    .overlay(
                        ProgressView()
                            .progressViewStyle(.circular)
                    )
                    .frame(width: width, height: height)

            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: width, height: height)
                    .clipped()

            case .failure:
                // Deterministic fallback from fallback.pics
                AsyncImage(url: fallbackURL) { img in
                    img.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Color(.systemGray5)
                }
                .frame(width: width, height: height)
                .clipped()

            @unknown default:
                Color(.systemGray6)
                    .frame(width: width, height: height)
            }
        }
        .cornerRadius(8)
    }
}

// Usage
FallbackImage(
    url: URL(string: product.imageURL),
    width: 200,
    height: 200,
    fallbackURL: URL(string: "https://fallback.pics/api/v1/200x200/7C3AED/FFFFFF?text=No+Photo")!
)`,
      },
      {
        eyebrow: "Retry logic",
        title: "Refreshing failed images without infinite loops",
        body: [
          "Network failures are often transient. A pull-to-refresh mechanism or an explicit retry button gives users control without triggering automatic retry loops that hammer a server already under load.",
          "Implement retry by toggling a UUID-based cache-busting query parameter on the URL. SwiftUI detects the URL change and restarts the fetch cycle. Store retry count in @State and cap retries at two attempts to avoid hammering a server that is genuinely down.",
        ],
        code: `@State private var retryID = UUID()
@State private var retryCount = 0

var retryURL: URL? {
    guard retryCount < 2, let base = originalURL else { return nil }
    return URL(string: "\\(base.absoluteString)?_retry=\\(retryID)")
}

// In phase .failure:
if retryCount < 2 {
    Button("Retry") {
        retryID = UUID()
        retryCount += 1
    }
}`,
      },
      {
        eyebrow: "Skeleton",
        title: "Shimmer placeholder for image loading states",
        body: [
          "A shimmer animation during the .empty phase communicates that content is loading, not absent. Use a linear gradient mask animated with a phase offset to produce the sweep effect purely with SwiftUI APIs — no UIKit shimmer libraries required.",
          "Set the shimmer frame to the exact image dimensions. This keeps layout stable across all three phases and ensures the content view doesn't reflow when the image resolves.",
        ],
        code: `struct ShimmerBox: View {
    @State private var phase: CGFloat = 0

    var body: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(.systemGray5),
                        Color(.systemGray4),
                        Color(.systemGray5)
                    ]),
                    startPoint: .init(x: phase - 0.3, y: 0.5),
                    endPoint: .init(x: phase + 0.3, y: 0.5)
                )
            )
            .onAppear {
                withAnimation(.linear(duration: 1.2).repeatForever(autoreverses: false)) {
                    phase = 1.3
                }
            }
    }
}`,
      },
      {
        eyebrow: "Caching",
        title: "URL caching and avoiding redundant network requests",
        body: [
          "AsyncImage uses URLSession.shared under the hood, which respects standard HTTP caching headers. Fallback.pics URLs return Cache-Control: public, max-age=31536000, immutable so successful fallback fetches are cached locally and never re-fetched during the session.",
          "For frequently repeated URLs (avatar lists, product grids), wrap AsyncImage inside an observable image cache that stores loaded UIImage values in NSCache. This avoids redundant network requests when cells scroll off and back on screen.",
        ],
      },
      {
        eyebrow: "Accessibility",
        title: "Alt text and VoiceOver for placeholder and failure states",
        body: [
          "Pass a meaningful accessibility label to every image state. The loading placeholder should announce 'Loading image' and the failure fallback should describe what the image was supposed to show. Avoid leaving the default empty label, which causes VoiceOver to read out the URL string.",
          "Use .accessibilityHidden(true) on decorative shimmer views so VoiceOver skips the loading animation. The success image receives the full descriptive label.",
        ],
        code: `// Accessibility for each phase
case .empty:
    Rectangle()
        .fill(Color(.systemGray5))
        .accessibilityLabel("Loading image")

case .failure:
    AsyncImage(url: fallbackURL) { ... }
        .accessibilityLabel(alt ?? "Image unavailable")`,
      },
      {
        eyebrow: "Resources",
        title: "Further reading and fallback.pics routes",
        body: [
          "The fallback.pics API provides dimension-matched SVG fallbacks that never 404 and cache for one year. Use the /api/v1/{w}x{h}/{bg}/{fg} route to match your app's color scheme exactly.",
        ],
        code: `// Useful fallback.pics routes for iOS
// Product tile 200x200, brand purple background
https://fallback.pics/api/v1/200x200/7C3AED/FFFFFF?text=No+Photo

// Avatar 80x80 with initials
https://fallback.pics/api/v1/avatar/80?text=AB

// Hero banner 390x200 (iPhone width)
https://fallback.pics/api/v1/390x200/18181B/A1A1AA?text=Image+Unavailable

// Docs and API reference
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/expo-image-fallback/
https://fallback.pics/blog/react-native-image-fallback/`,
      },
    ],
    takeaways: [
      "Use the AsyncImage phase closure to handle .empty, .success, and .failure states explicitly instead of relying on the default gray placeholder.",
      "In the .failure case, load a deterministic fallback URL from fallback.pics that matches your image's exact dimensions and color scheme.",
      "Cap retry attempts at two and require user intent (button tap) to avoid hammering a server that is genuinely down.",
      "Shimmer animations on the .empty phase communicate loading without consuming screen real estate for a spinner.",
      "Add explicit VoiceOver labels to every phase so screen reader users understand loading, failure, and success states.",
    ],
    related: [
      "expo-image-fallback",
      "react-native-image-fallback",
      "flutter-image-placeholder-errorbuilder",
    ],
  },

  // ─── 2 ───────────────────────────────────────────────────────────────────────
  {
    title: "Kotlin Compose Image Fallback for Coil and Glide",
    description:
      "Implement a compose image placeholder in Jetpack Compose using Coil's AsyncImage and Glide Compose with error drawables and deterministic fallback URLs.",
    slug: "kotlin-compose-image-fallback",
    readTime: "9 min read",
    category: "Mobile UX",
    tags: [
      "Compose image placeholder",
      "Coil AsyncImage",
      "Jetpack Compose",
      "Glide Compose",
      "Android image loading",
    ],
    summary: [
      "Jetpack Compose does not ship a built-in network image component. Coil and Glide fill that gap, each providing placeholder and error drawable APIs that wire directly into the compose image placeholder pattern. Pairing these with deterministic fallback URLs from fallback.pics means every broken or missing image resolves to a branded, dimension-matched placeholder.",
      "This guide covers Coil's AsyncImage model and Glide Compose's GlideImage API, the placeholder/error composable slots, Painter-based fallbacks, and how to use fallback.pics URLs as the error drawable source.",
    ],
    sections: [
      {
        eyebrow: "Background",
        title: "Why Compose needs explicit compose image placeholder handling",
        body: [
          "Compose renders UI from state. When a network image URL fails, the composable has no built-in mechanism to show an error UI — it simply renders nothing or the last drawn state. Without explicit placeholder and error handling, a product grid shows empty boxes and a user profile screen shows no avatar.",
          "Coil and Glide both provide placeholder/error slots in their Compose DSLs. These accept Painter instances, Drawable references, or composable lambdas. Using a fallback.pics URL as the error source gives you a predictable visual fallback that is dimensionally matched to the composable's size.",
        ],
      },
      {
        eyebrow: "Coil",
        title: "Coil AsyncImage with placeholder and error Painters",
        body: [
          "Coil's AsyncImage composable takes placeholder and error parameters as Painter or ImageRequest. Use rememberAsyncImagePainter for the error case to load a fallback.pics URL, or pass a local drawable for offline resilience.",
          "Set contentScale and modifier size before the image request resolves. Coil preserves the composable's layout bounds regardless of whether the placeholder, image, or error state is shown.",
        ],
        code: `// build.gradle.kts
// implementation("io.coil-kt:coil-compose:2.6.0")

import coil.compose.AsyncImage
import coil.compose.rememberAsyncImagePainter
import coil.request.ImageRequest

@Composable
fun FallbackImage(
    url: String?,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    width: Int = 400,
    height: Int = 300,
) {
    val fallbackUrl = "https://fallback.pics/api/v1/\${width}x\${height}/7C3AED/FFFFFF?text=No+Image"

    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(url)
            .crossfade(true)
            .build(),
        contentDescription = contentDescription,
        contentScale = ContentScale.Crop,
        placeholder = rememberAsyncImagePainter(
            model = "https://fallback.pics/api/v1/animated/skeleton/\${width}x\${height}"
        ),
        error = rememberAsyncImagePainter(model = fallbackUrl),
        modifier = modifier.size(width.dp, height.dp)
    )
}`,
      },
      {
        eyebrow: "Glide",
        title: "GlideImage error and loading composables in Glide Compose",
        body: [
          "Glide Compose's GlideImage provides loading and failure composable slots that accept arbitrary Compose content. This lets you show a ShimmerBox during load and a full Compose fallback layout on error — more flexible than a static drawable.",
          "Glide's RequestBuilder.error() also accepts a resource ID or URL string for non-Compose failure paths. Use whichever fits your existing Glide configuration.",
        ],
        code: `// implementation("com.github.bumptech.glide:compose:1.0.0-beta01")

import com.bumptech.glide.integration.compose.ExperimentalGlideComposeApi
import com.bumptech.glide.integration.compose.GlideImage

@OptIn(ExperimentalGlideComposeApi::class)
@Composable
fun GlideFallbackImage(
    url: String?,
    modifier: Modifier = Modifier,
) {
    GlideImage(
        model = url,
        contentDescription = null,
        modifier = modifier,
        loading = placeholder {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFE5E7EB))
                    .shimmerEffect()
            )
        },
        failure = placeholder {
            AsyncImage(
                model = "https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Unavailable",
                contentDescription = "Image unavailable",
                modifier = Modifier.fillMaxSize()
            )
        }
    )
}`,
      },
      {
        eyebrow: "Loop guard",
        title: "Preventing fallback URL error loops",
        body: [
          "If the fallback.pics URL itself fails (rare, but possible in offline scenarios), Coil will fire another error event. Guard against this by using a local drawable as the terminal fallback — a vector drawable that ships with the APK never triggers a network request.",
          "Coil's ImageRequest.Builder supports .fallback() for the case where the data is null and .error() for load failures. Use a local drawable resource for .error() and reserve the fallback.pics URL for the .placeholder() so it streams in during load, not as the error recovery.",
        ],
        code: `ImageRequest.Builder(context)
    .data(url)
    .placeholder(R.drawable.img_placeholder_shimmer)
    .error(R.drawable.img_error_local)   // local drawable, never 404s
    .fallback(R.drawable.img_error_local) // shown when data == null
    .build()`,
      },
      {
        eyebrow: "Performance",
        title: "Disk cache and memory cache configuration for placeholders",
        body: [
          "Coil caches images in memory (LruCache) and on disk (DiskLruCache) by default. Fallback.pics URLs return immutable cache headers, so successful fetches land in the disk cache and survive process restarts. Set diskCachePolicy to ENABLED for the error painter to avoid re-fetching the fallback on every list scroll.",
          "Cap the memory cache at 25% of the available heap for image-heavy screens. Product grids with 50+ images can exhaust the default cache size quickly, causing repeated decodes and jank.",
        ],
      },
      {
        eyebrow: "Accessibility",
        title: "Content descriptions across placeholder and error states",
        body: [
          "Set contentDescription on both the loading state and error state composables. Talkback reads the content description from the innermost focusable element. An empty string silences the announcement for decorative placeholders; a descriptive string like 'Product image unavailable' informs the user on error.",
          "Use LocalInspectionMode.current to detect preview mode and return a static painter instead of making a network request during Compose previews.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Fallback.pics routes for Android dimensions",
        body: [
          "Common Android image sizes map directly to fallback.pics API routes. Use these for error drawables or placeholder URLs.",
        ],
        code: `// Common Android fallback URLs
// Product tile (Material card 2:1)
https://fallback.pics/api/v1/400x200/7C3AED/FFFFFF?text=Product

// Avatar (circular, 56dp standard)
https://fallback.pics/api/v1/avatar/56?text=AB

// Full-width hero (360dp typical phone width)
https://fallback.pics/api/v1/360x200/18181B/FFFFFF?text=Hero

// Thumbnail (56x56 list item)
https://fallback.pics/api/v1/56x56/E5E7EB/71717A

// Related posts
https://fallback.pics/blog/react-native-image-fallback/
https://fallback.pics/blog/flutter-image-placeholder-errorbuilder/
https://fallback.pics/docs/`,
      },
    ],
    takeaways: [
      "Coil's AsyncImage accepts placeholder and error Painter instances; use rememberAsyncImagePainter with a fallback.pics URL for the error case.",
      "Glide Compose's failure composable slot accepts arbitrary Compose content, letting you show a branded fallback layout rather than a static drawable.",
      "Always use a local vector drawable as the terminal error fallback to guard against offline scenarios where even the fallback URL is unreachable.",
      "Set diskCachePolicy to ENABLED for fallback painters so repeated list scrolls don't trigger redundant network requests.",
      "Add explicit content descriptions to every image state — empty string for decorative placeholders, descriptive text for error states.",
    ],
    related: [
      "flutter-image-placeholder-errorbuilder",
      "react-native-image-fallback",
      "swiftui-asyncimage-placeholders",
    ],
  },

  // ─── 3 ───────────────────────────────────────────────────────────────────────
  {
    title: "Ionic and Capacitor WebView Image Fallbacks",
    description:
      "Fix capacitor image loading failures in Ionic apps by combining ion-img error events, onerror handlers, and deterministic fallback.pics URLs across WebView environments.",
    slug: "ionic-capacitor-image-fallbacks",
    readTime: "8 min read",
    category: "Mobile UX",
    tags: [
      "Capacitor image loading",
      "Ionic image fallback",
      "ion-img error",
      "WebView images",
      "Hybrid app images",
    ],
    summary: [
      "Ionic apps run inside a Capacitor WebView, which means image loading behaves like a browser but with additional constraints around CORS, local file access, and mixed content policies. Capacitor image loading failures are common when remote URLs return 404s, CORS blocks requests, or the device is offline.",
      "This guide covers the ion-img ionError event, vanilla onerror fallbacks for non-Ionic frameworks, CORS and mixed-content solutions, and pairing every failure case with deterministic fallback.pics URLs.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "WebView image failures differ from browser image failures",
        body: [
          "Capacitor's WebView enforces the same CORS rules as a browser, but the origin is typically capacitor://localhost or http://localhost. Remote image hosts that do not include localhost in their Access-Control-Allow-Origin header block image loads even when the same URL works in a desktop browser.",
          "Mixed content is another failure mode: an HTTPS Capacitor app cannot load HTTP image URLs without explicit allowMixedContent configuration in AndroidManifest.xml. These failures are silent — the image element fires an error event, but no console warning appears in the device log by default.",
          "Using deterministic fallback.pics HTTPS URLs sidesteps both problems. The API always returns HTTPS, includes permissive CORS headers, and never blocks requests from localhost origins.",
        ],
      },
      {
        eyebrow: "ion-img",
        title: "Handling ion-img ionError for failed image loads",
        body: [
          "ion-img is Ionic's lazy-loading image component. It fires an ionError event when the src fails to load. Bind a handler to swap in a fallback URL. Avoid setting src directly inside the handler without a guard — it can trigger another error event if the fallback URL also fails.",
          "For Angular Ionic, use event binding syntax. For React Ionic, use the onIonError prop. Both expose the same HTMLIonImgElement event object.",
        ],
        code: `<!-- Angular Ionic -->
<ion-img
  [src]="product.imageUrl"
  [alt]="product.name"
  (ionError)="onImgError($event, 400, 300)"
></ion-img>

// In component class
onImgError(event: CustomEvent, w: number, h: number): void {
  const el = event.target as HTMLIonImgElement;
  el.src = \`https://fallback.pics/api/v1/\${w}x\${h}/7C3AED/FFFFFF?text=No+Image\`;
  el.onerror = null; // prevent loop
}

// React Ionic
<IonImg
  src={product.imageUrl}
  alt={product.name}
  onIonError={(e) => {
    const target = e.target as HTMLIonImgElement;
    target.src = \`https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image\`;
    (target as any).onerror = null;
  }}
/>`,
      },
      {
        eyebrow: "Vanilla",
        title: "onerror fallback for img tags outside ion-img",
        body: [
          "Not all images in an Ionic app go through ion-img. Background images set via CSS, img tags in third-party plugins, or images inside iframes bypass the Ionic component system. Use standard onerror handlers on these elements.",
          "A global onerror delegate registered on document during app initialization catches failures from any img tag regardless of how it was inserted into the DOM.",
        ],
        code: `// app.component.ts — global image error handler
function registerGlobalImageFallback(w = 400, h = 300) {
  document.addEventListener('error', (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      if (!img.dataset['fallbackApplied']) {
        img.dataset['fallbackApplied'] = '1';
        img.src = \`https://fallback.pics/api/v1/\${w}x\${h}/7C3AED/FFFFFF?text=Unavailable\`;
      }
    }
  }, true); // capture phase to catch all img errors
}`,
      },
      {
        eyebrow: "CORS",
        title: "Fixing CORS and mixed content in Capacitor WebViews",
        body: [
          "For Android, add android:usesCleartextTraffic=\"false\" and ensure your image CDN sends Access-Control-Allow-Origin: * or your app's Capacitor origin. Fallback.pics already sends permissive CORS headers so fallback images never block.",
          "For iOS, configure NSAppTransportSecurity in Info.plist to allow only HTTPS connections. Fallback.pics serves exclusively over HTTPS, making it safe to whitelist without the NSAllowsArbitraryLoads flag.",
        ],
        code: `// capacitor.config.ts — server config for image origins
{
  server: {
    allowNavigation: [
      "fallback.pics",
      "your-image-cdn.com"
    ]
  }
}

// AndroidManifest.xml (mixed content — do not set true in production)
// <application android:usesCleartextTraffic="false" ...>`,
      },
      {
        eyebrow: "Offline",
        title: "Caching fallback images for offline use with Capacitor",
        body: [
          "Capacitor apps can use the Filesystem plugin to cache image blobs locally. For product catalogs with known images, pre-cache the set of fallback.pics URLs during the first launch. Ion-img will serve them from the local file system when the device is offline.",
          "Alternatively, register a service worker that intercepts image requests and returns the cached fallback response. Service workers work in Capacitor WebViews on both iOS and Android with no additional plugin required.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Fallback.pics routes and related guides",
        body: [
          "These fallback.pics routes work reliably inside Capacitor WebViews because they serve HTTPS and include broad CORS headers.",
        ],
        code: `// Useful routes for Ionic / Capacitor
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image
https://fallback.pics/api/v1/avatar/80?text=AB
https://fallback.pics/api/v1/animated/skeleton/400x300
https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/pwa-icon-splash-placeholders/
https://fallback.pics/blog/service-worker-placeholder-cache/`,
      },
    ],
    takeaways: [
      "Use ion-img's ionError event to swap in a fallback.pics URL; set onerror to null immediately to prevent an error loop if the fallback URL also fails.",
      "Register a document-level error listener in capture phase to catch failures from img tags inserted outside ion-img, including those from plugins and third-party libraries.",
      "Fallback.pics serves HTTPS with permissive CORS headers, making it safe to use as a fallback source inside Capacitor WebViews without extra configuration.",
      "Pre-cache fallback.pics responses with the Capacitor Filesystem plugin or a service worker to serve branded placeholders in offline mode.",
      "Do not set android:usesCleartextTraffic=true in production; use HTTPS fallback URLs to avoid the configuration entirely.",
    ],
    related: [
      "pwa-icon-splash-placeholders",
      "service-worker-placeholder-cache",
      "react-native-image-fallback",
    ],
  },

  // ─── 4 ───────────────────────────────────────────────────────────────────────
  {
    title: "PWA App Icon and Splash Screen Placeholder Strategy",
    description:
      "Design a pwa splash screen and app icon placeholder strategy for Progressive Web Apps that covers manifest icons, splash screens, and install-prompt image fallbacks.",
    slug: "pwa-icon-splash-placeholders",
    readTime: "7 min read",
    category: "Mobile UX",
    tags: [
      "PWA splash screen",
      "App icon placeholder",
      "Progressive Web App",
      "Web app manifest",
      "PWA icons",
    ],
    summary: [
      "A Progressive Web App's web manifest references icon URLs that the browser downloads during installation. If any icon URL returns a 404, Chrome and Safari fall back to a generic browser icon — or refuse to install the PWA entirely. Having a reliable pwa splash screen and icon placeholder strategy prevents install failures and maintains brand consistency.",
      "This guide covers manifest icon requirements, how to use fallback.pics to generate correctly-sized placeholder icons during development, splash screen generation from manifest colors, and what happens when icon URLs fail in installed PWAs.",
    ],
    sections: [
      {
        eyebrow: "Manifest icons",
        title: "What happens when PWA icon URLs fail",
        body: [
          "The web app manifest requires at least one icon sized 192×192 and one sized 512×512 for Chrome to display a PWA install prompt. If the 192×192 icon URL returns a 404, Chrome shows a default browser icon on the home screen. If the 512×512 URL fails, the splash screen shows no image.",
          "Safari on iOS has stricter requirements: it uses apple-touch-icon link tags rather than the manifest, and a missing icon prevents the home screen icon from rendering correctly after installation.",
          "During development — when your production CDN is not yet configured, or when you're testing against a staging environment with incomplete assets — fallback.pics icon-sized URLs let you complete the manifest without blocking on asset uploads.",
        ],
      },
      {
        eyebrow: "Development placeholders",
        title: "Placeholder icon URLs for the web app manifest",
        body: [
          "Fallback.pics square route generates square images at any size. Use it for every icon size in your manifest during development. The URLs are deterministic, cacheable, and work from any origin including localhost.",
          "Keep the manifest placeholder separate from your production icon configuration. Use environment variables to swap between placeholder and production URLs at build time.",
        ],
        code: `// manifest.webmanifest (development)
{
  "name": "My App",
  "short_name": "App",
  "theme_color": "#7C3AED",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "icons": [
    {
      "src": "https://fallback.pics/api/v1/square/192?text=APP&bg=7C3AED&fg=FFFFFF",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "https://fallback.pics/api/v1/square/512?text=APP&bg=7C3AED&fg=FFFFFF",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}

// astro.config.mjs or vite.config.ts — swap via env
const iconBase = import.meta.env.PROD
  ? '/icons'
  : 'https://fallback.pics/api/v1/square';`,
      },
      {
        eyebrow: "Splash screen",
        title: "Generating splash screen placeholders for PWA testing",
        body: [
          "Chrome on Android generates the PWA splash screen from the manifest's name, background_color, and the 512×512 icon. You don't create a splash screen image manually — Chrome constructs it. Providing a valid 512×512 icon URL is sufficient.",
          "Safari on iOS requires explicit apple-touch-startup-image link tags for custom splash screens. These must be exact pixel dimensions for each device. During development, fallback.pics banner URLs at the correct dimensions let you test splash screen layout without creating device-specific assets.",
        ],
        code: `<!-- index.html — splash screen placeholders for iOS development -->
<!-- iPhone 14 Pro Max 430×932 -->
<link rel="apple-touch-startup-image"
  href="https://fallback.pics/api/v1/1290x2796/7C3AED/FFFFFF?text=Loading"
  media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)">

<!-- iPhone SE 375×667 -->
<link rel="apple-touch-startup-image"
  href="https://fallback.pics/api/v1/750x1334/7C3AED/FFFFFF?text=Loading"
  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180"
  href="https://fallback.pics/api/v1/square/180?text=APP&bg=7C3AED&fg=FFFFFF">`,
      },
      {
        eyebrow: "Maskable icons",
        title: "Safe zone requirements for maskable PWA icons",
        body: [
          "Maskable icons are cropped to different shapes depending on the device launcher. The safe zone is a circle that covers the center 80% of the icon. Anything outside that circle may be clipped. Fallback.pics square icons center text in the middle of the image, making them safe to use as maskable placeholders.",
          "Declare purpose: 'any maskable' only when your icon is intentionally designed for masking. Using a non-maskable icon with that declaration causes Chrome to crop off critical parts of the design on adaptive icon launchers.",
        ],
      },
      {
        eyebrow: "Service worker",
        title: "Caching icon URLs in the service worker install step",
        body: [
          "Include your icon URLs in the service worker's precache list so they are available offline from first install. Workbox's precacheAndRoute handles this automatically when you list the icon assets in the manifest.",
          "For fallback.pics URLs used as development placeholders, cache them explicitly with a NetworkFirst strategy so they update when the CDN response changes.",
        ],
        code: `// service-worker.js (Workbox)
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// Cache fallback.pics placeholder icons
registerRoute(
  ({ url }) => url.hostname === 'fallback.pics',
  new NetworkFirst({ cacheName: 'placeholder-icons', networkTimeoutSeconds: 3 })
);`,
      },
      {
        eyebrow: "Resources",
        title: "Manifest icon sizes and fallback.pics routes",
        body: [
          "These routes cover all standard PWA icon sizes. Replace them with production assets before shipping.",
        ],
        code: `// Standard PWA icon placeholders
https://fallback.pics/api/v1/square/72?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/96?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/128?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/144?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/152?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/192?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/384?text=APP&bg=7C3AED&fg=FFFFFF
https://fallback.pics/api/v1/square/512?text=APP&bg=7C3AED&fg=FFFFFF

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/service-worker-placeholder-cache/
https://fallback.pics/blog/ionic-capacitor-image-fallbacks/`,
      },
    ],
    takeaways: [
      "A missing 192×192 or 512×512 icon URL prevents Chrome from displaying a PWA install prompt; fallback.pics square URLs keep your manifest valid during development.",
      "Safari splash screens require explicit apple-touch-startup-image tags at exact device pixel dimensions; use fallback.pics banner routes to test layout without real assets.",
      "Declare purpose: 'any maskable' only for icons that place content inside the center 80% safe zone to avoid launcher-cropped designs.",
      "Precache icon URLs in your service worker so they are available offline from first install without additional network requests.",
      "Use environment variables to swap between fallback.pics placeholder URLs and production icon paths at build time.",
    ],
    related: [
      "service-worker-placeholder-cache",
      "ionic-capacitor-image-fallbacks",
      "animated-skeleton-placeholder-url",
    ],
  },

  // ─── 5 ───────────────────────────────────────────────────────────────────────
  {
    title: "Service Worker Cache for Placeholder Image URLs",
    description:
      "Use a service worker image cache to intercept placeholder URL requests, serve fallbacks offline, and control cache lifetime for deterministic placeholder images.",
    slug: "service-worker-placeholder-cache",
    readTime: "9 min read",
    category: "Technical",
    tags: [
      "Service worker image cache",
      "Workbox images",
      "Offline image fallback",
      "Cache API",
      "PWA performance",
    ],
    summary: [
      "A service worker sitting between your app and the network can intercept every image request and return a cached copy when the network is unavailable or slow. Registering a service worker image cache for placeholder URLs means branded fallback images load instantly even offline, without a second network round trip.",
      "This guide covers Workbox routing strategies for image caches, manual Cache API usage for specific fallback URLs, cache expiration policies, and how to serve fallback.pics responses as offline fallbacks.",
    ],
    sections: [
      {
        eyebrow: "Architecture",
        title: "Where a service worker fits in the image loading pipeline",
        body: [
          "The browser fetches images through the network stack. A service worker intercepts fetch events before they reach the network. You can inspect the request URL, decide whether to return a cached response, forward to the network, or respond with a synthetic image — all without touching application code.",
          "For placeholder.pics URLs this is particularly useful: the first fetch goes to the CDN, the response is cached locally, and every subsequent request for the same URL returns instantly from the Cache API. For a product grid with 50 identical card placeholders, this eliminates 49 network requests.",
        ],
      },
      {
        eyebrow: "Workbox",
        title: "Routing placeholder image requests with Workbox strategies",
        body: [
          "Workbox's StaleWhileRevalidate strategy serves placeholder images from cache immediately while updating the cache in the background. This is the right strategy for placeholder images where a slightly stale response is acceptable and speed matters more than freshness.",
          "CacheFirst works for immutable placeholder URLs. Fallback.pics URLs return Cache-Control: public, max-age=31536000, immutable, which aligns with CacheFirst. Once cached, the image is served from disk without a network request for an entire year.",
        ],
        code: `// service-worker.js (Workbox)
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Fallback.pics placeholder images — immutable, cache forever
registerRoute(
  ({ url }) => url.hostname === 'fallback.pics',
  new CacheFirst({
    cacheName: 'placeholder-images-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// Your own image CDN — stale-while-revalidate
registerRoute(
  ({ url }) => url.hostname === 'cdn.yourapp.com',
  new StaleWhileRevalidate({
    cacheName: 'app-images-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);`,
      },
      {
        eyebrow: "Manual Cache API",
        title: "Pre-caching specific fallback URLs at service worker install",
        body: [
          "If you know which fallback URLs your app uses — typically a small set of dimension-matched placeholders — pre-cache them during the service worker install event. The install step blocks activation until all URLs are cached, guaranteeing offline availability from the first page load.",
          "Pre-cache only the URLs that are used before the user interacts with the app. Caching 50 placeholder dimensions on install adds latency to the service worker lifecycle.",
        ],
        code: `// service-worker.js — manual pre-cache
const PLACEHOLDER_CACHE = 'placeholder-images-v1';

const FALLBACK_URLS = [
  'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image',
  'https://fallback.pics/api/v1/avatar/80?text=AB',
  'https://fallback.pics/api/v1/200x200/7C3AED/FFFFFF?text=Product',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PLACEHOLDER_CACHE).then((cache) =>
      cache.addAll(FALLBACK_URLS)
    )
  );
  self.skipWaiting();
});

// Offline fallback: if image fetch fails, return a cached placeholder
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Offline')
      )
    );
  }
});`,
      },
      {
        eyebrow: "Cache versioning",
        title: "Cache invalidation and version management",
        body: [
          "Service worker caches persist across page loads and browser restarts. Rename the cache (e.g. placeholder-images-v2) in the activate event to clear stale entries when you update your placeholder URLs. Delete old cache versions during activation to prevent unbounded disk growth.",
          "Workbox handles versioning automatically when you use the GenerateSW plugin with a revision hash. Manual Cache API usage requires explicit version management in the activate event.",
        ],
        code: `const CURRENT_CACHES = ['placeholder-images-v2', 'app-images-v1'];

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});`,
      },
      {
        eyebrow: "Performance",
        title: "Measuring cache hit rate for placeholder images",
        body: [
          "Use the Performance Timeline API to measure image load times before and after the service worker is active. Cache hits from the Cache API should resolve in under 10ms; network hits take 50–200ms for fallback.pics edge responses.",
          "Log cache misses to a beacon endpoint during development to identify which placeholder URLs are not pre-cached. A cache miss on every page load for a commonly used avatar placeholder indicates it should be added to the pre-cache list.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Related guides and fallback.pics API reference",
        body: [
          "Combine service worker caching with the fallback.pics immutable URL scheme for the most efficient image loading pipeline.",
        ],
        code: `// Immutable placeholder URLs (safe to cache for 1 year)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image
https://fallback.pics/api/v1/200x200/E5E7EB/71717A
https://fallback.pics/api/v1/animated/skeleton/400x300

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/pwa-icon-splash-placeholders/
https://fallback.pics/blog/immutable-urls-cdn-placeholder-caching/`,
      },
    ],
    takeaways: [
      "A service worker intercepts image fetch events before they reach the network, enabling instant offline delivery of cached placeholder images.",
      "Use CacheFirst for fallback.pics URLs since they return immutable Cache-Control headers; once cached they never need re-fetching.",
      "Pre-cache a small set of commonly used fallback URLs during the service worker install event to guarantee offline availability from first load.",
      "Rename cache versions in the activate event and delete stale caches to prevent unbounded disk growth as placeholder URLs change.",
      "Measure cache hit latency with the Performance Timeline API to verify that placeholder images are loading from the cache rather than the network.",
    ],
    related: [
      "pwa-icon-splash-placeholders",
      "immutable-urls-cdn-placeholder-caching",
      "cloudflare-cdn-cache-generated-images",
    ],
  },

  // ─── 6 ───────────────────────────────────────────────────────────────────────
  {
    title: "Cypress E2E Tests with Stable Placeholder Image URLs",
    description:
      "Replace flaky remote images in Cypress E2E tests with stable cypress image testing strategies using deterministic placeholder URLs that never return 404 or time out.",
    slug: "cypress-stable-placeholder-urls",
    readTime: "8 min read",
    category: "Testing",
    tags: [
      "Cypress image testing",
      "E2E test images",
      "Cypress stub images",
      "Cypress image fixtures",
      "Test stability",
    ],
    summary: [
      "Remote image URLs in Cypress E2E tests introduce flakiness. A CDN outage, a 404 from a staging environment, or a slow image load can cause assertions to fail for reasons unrelated to the feature under test. Replacing remote image src values with deterministic placeholder URLs from fallback.pics eliminates the entire class of image-related test failures.",
      "This guide covers three approaches: intercepting image requests with cy.intercept(), injecting placeholder URLs via test fixtures, and configuring Cypress to globally stub external image domains during E2E runs.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why remote images break Cypress tests",
        body: [
          "Cypress tests run against real network conditions unless you stub requests. A test that clicks through a product catalog depends on every product image loading without a 404. If one image CDN request times out, the test either hangs waiting for the image or fails an assertion about image visibility.",
          "Snapshot-based visual tests are even more sensitive. A slightly different image (new compression artifact, updated content) can cause pixel-diff failures that have nothing to do with the component under test.",
          "Placeholder URLs from fallback.pics are deterministic: the same URL always returns the same pixel output. They cache for a year and never return 404. This makes them ideal replacements for real image URLs in test environments.",
        ],
      },
      {
        eyebrow: "cy.intercept",
        title: "Stubbing image requests with cy.intercept in Cypress",
        body: [
          "cy.intercept() can match image requests by URL pattern and return a fixture or redirect to a deterministic placeholder URL. Use this approach when image URLs are generated at runtime and can't be replaced in fixtures.",
          "Returning a redirect (statusCode 302, Location header pointing to fallback.pics) is simpler than returning binary fixture data. Cypress follows redirects, the browser fetches the placeholder, and your test assertions see a loaded image.",
        ],
        code: `// cypress/support/commands.ts
Cypress.Commands.add('stubImages', () => {
  // Stub any image from your CDN with a deterministic placeholder
  cy.intercept('GET', 'https://cdn.yourapp.com/**', (req) => {
    // Parse dimensions from URL if available, else use default
    req.reply({
      statusCode: 302,
      headers: {
        Location: 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Test+Image',
      },
    });
  }).as('stubImages');
});

// In tests
describe('Product catalog', () => {
  beforeEach(() => {
    cy.stubImages();
    cy.visit('/products');
  });

  it('displays product cards with images', () => {
    cy.get('[data-cy="product-image"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('not.be.empty');
  });
});`,
      },
      {
        eyebrow: "Fixtures",
        title: "Injecting placeholder URLs via Cypress fixtures",
        body: [
          "When your app fetches product or article data from an API, use cy.intercept() to return a fixture file where image URLs are already replaced with fallback.pics URLs. This approach is clean: all test data is in fixture files, and there is no regex logic in test files.",
          "Keep fixture image URLs dimensional and labeled so they are easy to distinguish in test screenshots: 400x300 for product images, avatar/80 for user thumbnails.",
        ],
        code: `// cypress/fixtures/products.json
{
  "data": [
    {
      "id": "1",
      "name": "Test Product",
      "imageUrl": "https://fallback.pics/api/v1/400x400/7C3AED/FFFFFF?text=Product+1",
      "price": 29.99
    },
    {
      "id": "2",
      "name": "Another Product",
      "imageUrl": "https://fallback.pics/api/v1/400x400/3B82F6/FFFFFF?text=Product+2",
      "price": 49.99
    }
  ]
}

// cypress/e2e/products.cy.ts
it('renders product grid', () => {
  cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('products');
  cy.visit('/shop');
  cy.wait('@products');
  cy.get('[data-cy="product-card"]').should('have.length', 2);
});`,
      },
      {
        eyebrow: "Global config",
        title: "Globally blocking image domains in cypress.config.ts",
        body: [
          "For test suites where you never want real CDN images, configure a Cypress intercept in the setupNodeEvents hook to block all external image domains and return placeholder redirects. This runs before every test without needing a cy.stubImages() call.",
          "Be specific about which domains to stub. Blocking * can interfere with auth flows, OAuth redirects, and other requests your tests depend on.",
        ],
        code: `// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // No node-level image stubbing available, use support file
    },
    baseUrl: 'http://localhost:3000',
  },
});

// cypress/support/e2e.ts
before(() => {
  cy.intercept(
    { method: 'GET', hostname: 'images.yourdomain.com' },
    {
      statusCode: 302,
      headers: {
        Location: 'https://fallback.pics/api/v1/400x300/E5E7EB/71717A?text=Stubbed',
      },
    }
  );
});`,
      },
      {
        eyebrow: "Visual testing",
        title: "Using placeholder URLs for visual regression baselines",
        body: [
          "Visual regression tools like Percy and Chromatic compare screenshots pixel-by-pixel. Real images introduce noise: compression differs between CDN regions, content changes, and image crops vary. Replacing real images with deterministic placeholders produces stable baselines that only change when your UI changes.",
          "Label placeholders with the content they represent (text=Hero+Image, text=Avatar) so screenshots are readable without context. Use different colors for different content types to catch layout errors visually.",
        ],
        code: `// Meaningful placeholder URLs for visual tests
// Hero image — full width banner
https://fallback.pics/api/v1/1200x400/7C3AED/FFFFFF?text=Hero+Image

// Avatar in header
https://fallback.pics/api/v1/avatar/40?text=JD

// Sidebar thumbnail
https://fallback.pics/api/v1/120x80/3B82F6/FFFFFF?text=Thumb`,
      },
      {
        eyebrow: "Resources",
        title: "Related testing guides and API reference",
        body: [
          "Combine Cypress image stubbing with deterministic placeholder URLs for the most stable E2E test suite.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/playwright-deterministic-placeholders/
https://fallback.pics/blog/percy-chromatic-placeholder-images/`,
      },
    ],
    takeaways: [
      "Replace remote CDN image URLs in Cypress tests with deterministic fallback.pics URLs to eliminate an entire class of network-related test flakiness.",
      "Use cy.intercept() to redirect image requests to placeholder URLs at runtime, or preload fixture JSON files where image URLs are already substituted.",
      "Configure global intercepts in cypress/support/e2e.ts to stub all requests from your image CDN domain without repeating setup in every test file.",
      "Label placeholder URLs with descriptive text parameters so visual regression screenshots are readable without additional context.",
      "For visual regression baselines, deterministic placeholders eliminate pixel noise from CDN compression differences and content updates.",
    ],
    related: [
      "playwright-deterministic-placeholders",
      "percy-chromatic-placeholder-images",
      "lighthouse-ci-missing-image-cls",
    ],
  },

  // ─── 7 ───────────────────────────────────────────────────────────────────────
  {
    title: "Playwright Visual Regression with Deterministic Placeholders",
    description:
      "Stabilize playwright visual regression images by replacing flaky CDN URLs with deterministic placeholder images that produce identical pixel output on every test run.",
    slug: "playwright-deterministic-placeholders",
    readTime: "9 min read",
    category: "Testing",
    tags: [
      "Playwright visual regression images",
      "Playwright screenshot testing",
      "Deterministic images",
      "Visual regression",
      "Playwright E2E",
    ],
    summary: [
      "Playwright's screenshot and visual comparison tooling (toHaveScreenshot, toMatchSnapshot) is sensitive to pixel differences. Remote images from a CDN introduce noise: compression quality varies by region, content is updated, or images 404 on a staging environment. Replacing them with deterministic placeholder images from fallback.pics makes visual regression baselines stable across CI runs and local environments.",
      "This guide covers Playwright's route.fulfill() for request interception, the expect(page).toHaveScreenshot() API with image thresholds, and patterns for keeping placeholder URLs meaningful in test output.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why real images cause playwright visual regression failures",
        body: [
          "Playwright's toHaveScreenshot() compares a PNG screenshot pixel-by-pixel against a stored baseline. A 1-pixel difference fails the assertion. CDN images introduce differences through JPEG recompression on each encode, progressive loading artifacts, and WebP vs PNG format negotiation between Playwright's Chromium and your CDN.",
          "Beyond pixel noise, CDN images also cause test order instability. An image loaded before the screenshot assertion causes a pass; the same image loading 50ms later causes a diff. Playwright's network idle waiting helps but doesn't eliminate race conditions.",
          "Deterministic placeholder URLs from fallback.pics return identical pixel output for the same URL on every request. There is no recompression, no content variation, and the response arrives in under 100ms from the nearest edge node.",
        ],
      },
      {
        eyebrow: "Route interception",
        title: "Intercepting image requests with Playwright's page.route()",
        body: [
          "page.route() matches URL patterns and lets you fulfill, abort, or continue requests. Fulfill with a redirect to a fallback.pics URL to replace every image request from your CDN with a deterministic placeholder.",
          "Place the route registration in a beforeEach hook or a shared test fixture. This ensures every test in a describe block uses placeholder images without repeating setup.",
        ],
        code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
  },
});

// tests/fixtures.ts
import { test as base, Page } from '@playwright/test';

async function stubImages(page: Page) {
  await page.route('https://cdn.yourapp.com/**', (route) => {
    // Parse width/height from URL or use defaults
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: \`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#E5E7EB"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
              font-family="system-ui" font-size="14" fill="#71717A">Stubbed</text>
      </svg>\`,
    });
  });
}

export const test = base.extend<{ stubImages: void }>({
  stubImages: [async ({ page }, use) => {
    await stubImages(page);
    await use();
  }, { auto: true }],
});`,
      },
      {
        eyebrow: "Redirect",
        title: "Redirecting to fallback.pics for dimension-matched placeholders",
        body: [
          "Instead of inlining SVG in the route handler, redirect to a fallback.pics URL that matches the original image dimensions. This approach is cleaner for large test suites: placeholder content is defined by the URL, not by inline test code.",
          "Parse the image dimensions from the original URL using a regex or URL pattern. If the original URL contains no dimension information, map image types to default sizes (product → 400×400, avatar → 80×80, banner → 1200×400).",
        ],
        code: `// Redirect to dimension-matched placeholders
await page.route('https://cdn.yourapp.com/products/**', async (route) => {
  const url = new URL(route.request().url());
  // Extract dimensions from query string if present
  const w = url.searchParams.get('w') ?? '400';
  const h = url.searchParams.get('h') ?? '400';

  await route.fulfill({
    status: 302,
    headers: {
      Location: \`https://fallback.pics/api/v1/\${w}x\${h}/7C3AED/FFFFFF?text=Product\`,
    },
  });
});

await page.route('https://cdn.yourapp.com/avatars/**', (route) => {
  route.fulfill({
    status: 302,
    headers: {
      Location: 'https://fallback.pics/api/v1/avatar/80?text=JD',
    },
  });
});`,
      },
      {
        eyebrow: "Snapshots",
        title: "Configuring toHaveScreenshot thresholds for placeholder tests",
        body: [
          "Even with deterministic placeholders, minor rendering differences between operating systems (font antialiasing, subpixel rendering) can cause false failures. Set a small threshold with maxDiffPixelRatio to allow for rendering variation without hiding real regressions.",
          "Store baseline screenshots per platform in CI. Playwright's update snapshots flag (--update-snapshots) regenerates baselines when you intentionally change the UI. Run this on a clean branch before merging to avoid baseline drift.",
        ],
        code: `// In your test
await expect(page).toHaveScreenshot('product-grid.png', {
  maxDiffPixelRatio: 0.01, // allow 1% pixel difference
  threshold: 0.1,           // per-pixel color tolerance
  animations: 'disabled',   // no animation interference
});

// playwright.config.ts — global snapshot settings
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}-{projectName}{ext}',
});`,
      },
      {
        eyebrow: "CI integration",
        title: "Running deterministic image tests in GitHub Actions",
        body: [
          "Use the playwright/action GitHub Action to run tests and upload snapshots as artifacts. Set --update-snapshots on a dedicated snapshot update workflow triggered manually rather than on every PR.",
          "Cache the fallback.pics CDN responses in CI using Playwright's har recording capability. Record a HAR file on the first CI run and replay it on subsequent runs to eliminate network latency from placeholder URL fetches.",
        ],
        code: `# .github/workflows/playwright.yml
- name: Run Playwright tests
  run: npx playwright test --reporter=html
  env:
    PLAYWRIGHT_BROWSERS_PATH: 0

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/`,
      },
      {
        eyebrow: "Resources",
        title: "Related testing guides and fallback.pics routes",
        body: [
          "Use these deterministic URLs as stable visual regression anchors across all your Playwright test suites.",
        ],
        code: `// Deterministic placeholder URLs for visual tests
https://fallback.pics/api/v1/1200x400/7C3AED/FFFFFF?text=Hero
https://fallback.pics/api/v1/400x400/3B82F6/FFFFFF?text=Product
https://fallback.pics/api/v1/avatar/80?text=JD
https://fallback.pics/api/v1/120x80/E5E7EB/71717A?text=Thumb

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/cypress-stable-placeholder-urls/
https://fallback.pics/blog/percy-chromatic-placeholder-images/`,
      },
    ],
    takeaways: [
      "Real CDN images cause Playwright visual regression failures through compression artifacts, content updates, and race conditions; deterministic placeholders eliminate all three.",
      "Use page.route() to intercept CDN image requests and redirect them to dimension-matched fallback.pics URLs before the screenshot assertion runs.",
      "Set maxDiffPixelRatio: 0.01 to tolerate minor OS-level rendering differences without hiding real UI regressions.",
      "Store baseline screenshots per platform in CI and use --update-snapshots on a dedicated manual workflow to prevent baseline drift.",
      "Label placeholder text parameters with meaningful content descriptions so screenshots are readable without additional context.",
    ],
    related: [
      "cypress-stable-placeholder-urls",
      "percy-chromatic-placeholder-images",
      "lighthouse-ci-missing-image-cls",
    ],
  },

  // ─── 8 ───────────────────────────────────────────────────────────────────────
  {
    title: "Percy and Chromatic: Placeholder Images in UI Tests",
    description:
      "Use chromatic placeholder images and Percy fixtures to produce stable visual regression baselines by replacing real CDN images with deterministic fallback URLs.",
    slug: "percy-chromatic-placeholder-images",
    readTime: "8 min read",
    category: "Testing",
    tags: [
      "Chromatic placeholder images",
      "Percy visual testing",
      "Storybook snapshots",
      "Visual regression",
      "UI testing",
    ],
    summary: [
      "Percy and Chromatic are visual regression services built around Storybook and component snapshots. Both compare screenshots pixel-by-pixel and flag any difference as a change requiring human review. Real remote images in story args or test fixtures introduce noise: the same image can render with different compression or dimensions across CI runs, triggering false positive change requests.",
      "Replacing remote image props with chromatic placeholder images from fallback.pics gives your visual test suite a stable, deterministic baseline that only changes when your component UI changes.",
    ],
    sections: [
      {
        eyebrow: "Problem",
        title: "Why remote images in Storybook args produce unstable snapshots",
        body: [
          "A story that renders a product card with src pointing to a real product image on Cloudinary or AWS S3 is only stable as long as that image never changes. CDN purge, re-upload, or format renegotiation can alter the pixels that Percy or Chromatic capture, triggering a change that has nothing to do with your component.",
          "Chromatic's TurboSnap can mark stories as unaffected based on git diff, but if the image URL is in a fixture file that changes independently of the component, the story rerenders with a different image and generates a diff.",
          "Deterministic placeholder URLs from fallback.pics return identical pixels for the same URL on every request. No CDN purge, no re-upload, no format change. The only reason a Chromatic snapshot changes is if your story or component changed.",
        ],
      },
      {
        eyebrow: "Storybook",
        title: "Setting placeholder image args in Storybook stories",
        body: [
          "Replace real image URLs in story args with fallback.pics URLs. Name the stories to reflect what real content they represent (not what the placeholder looks like) so the story library remains meaningful.",
          "Use the same fallback.pics URL across all story variants that share a layout. Different colors or text labels help distinguish content types visually.",
        ],
        code: `// src/components/ProductCard/ProductCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Ecommerce/ProductCard',
  component: ProductCard,
};
export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    name: 'Sample Product',
    price: 29.99,
    // Deterministic placeholder — stable across all CI runs
    imageUrl: 'https://fallback.pics/api/v1/400x400/7C3AED/FFFFFF?text=Product',
  },
};

export const WithLongTitle: Story = {
  args: {
    name: 'A Very Long Product Name That Wraps to Multiple Lines',
    price: 99.99,
    imageUrl: 'https://fallback.pics/api/v1/400x400/3B82F6/FFFFFF?text=Product',
  },
};

export const Loading: Story = {
  args: {
    name: '',
    price: 0,
    imageUrl: 'https://fallback.pics/api/v1/animated/skeleton/400x400',
  },
};`,
      },
      {
        eyebrow: "Percy",
        title: "Percy snapshots with mocked image requests",
        body: [
          "Percy captures screenshots during Cypress, Playwright, or Storybook test runs. When using Percy with Cypress, intercept image requests with cy.intercept() and return placeholder URLs before Percy takes the snapshot. This produces identical pixel output across Percy's Chromium instances regardless of CDN state.",
          "Percy's --allowed-hostname flag controls which external domains Percy agents fetch. Add fallback.pics to the allowed list so Percy's rendering agent can fetch placeholder images directly.",
        ],
        code: `// .percy.yml
version: 2
snapshot:
  widths: [375, 768, 1280]
  min-height: 600
  enable-javascript: true

# Allow Percy to fetch from fallback.pics
percy:
  allowed-hostnames:
    - fallback.pics

# cypress/support/percy-setup.ts
before(() => {
  cy.intercept('https://cdn.yourapp.com/**', {
    statusCode: 302,
    headers: {
      Location: 'https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Percy+Test',
    },
  });
});`,
      },
      {
        eyebrow: "Chromatic",
        title: "Chromatic TurboSnap and stable placeholder args",
        body: [
          "Chromatic's TurboSnap skips snapshots for stories whose dependency graph has not changed since the last build. Stories that use inline placeholder URLs (not fetched from a fixture file that changes) benefit maximally from TurboSnap: they only re-snapshot when the component file itself changes.",
          "Configure Chromatic's --only-changed flag to further limit snapshots to affected stories. Combined with deterministic placeholder images, this can reduce your Chromatic build time by 60–80% on a large Storybook.",
        ],
        code: `// package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --only-changed",
    "chromatic:all": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"
  }
}

// chromatic.config.ts
import { defineConfig } from 'chromatic';

export default defineConfig({
  projectId: 'your-project-id',
  // Prevent Chromatic from flagging external image changes
  externals: ['https://cdn.yourapp.com/**'],
  // Stable fallback.pics images don't need to be listed here
});`,
      },
      {
        eyebrow: "Decorator",
        title: "Global Storybook decorator to replace image props",
        body: [
          "Write a Storybook decorator that intercepts network requests using MSW (Mock Service Worker) and returns placeholder images for all external image domains. This avoids the need to update every story when your CDN domain changes.",
          "MSW's browser integration with Storybook's msw-storybook-addon lets you define handlers in a global preview.js file that apply to every story without per-story setup.",
        ],
        code: `// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon';
import { http, HttpResponse } from 'msw';

initialize();

export const loaders = [mswLoader];

export const parameters = {
  msw: {
    handlers: [
      http.get('https://cdn.yourapp.com/*', () => {
        return HttpResponse.redirect(
          'https://fallback.pics/api/v1/400x300/E5E7EB/71717A?text=Mocked',
          302
        );
      }),
    ],
  },
};`,
      },
      {
        eyebrow: "Resources",
        title: "Fallback.pics routes and related testing guides",
        body: [
          "These deterministic routes are safe to use as Storybook args and Percy/Chromatic snapshot sources.",
        ],
        code: `// Recommended story image URLs
https://fallback.pics/api/v1/400x400/7C3AED/FFFFFF?text=Product
https://fallback.pics/api/v1/1200x400/3B82F6/FFFFFF?text=Banner
https://fallback.pics/api/v1/avatar/80?text=JD
https://fallback.pics/api/v1/animated/skeleton/400x300

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/cypress-stable-placeholder-urls/
https://fallback.pics/blog/playwright-deterministic-placeholders/`,
      },
    ],
    takeaways: [
      "Real CDN image URLs in Storybook args or Percy fixtures cause false-positive visual regression failures; deterministic placeholders eliminate image-related noise entirely.",
      "Replace story imageUrl args with fallback.pics URLs that match the component's expected image dimensions and color scheme.",
      "Percy's allowed-hostname configuration must include fallback.pics for Percy rendering agents to fetch placeholder images during snapshot capture.",
      "Chromatic TurboSnap skips unchanged stories more effectively when image URLs are inline in story args rather than in frequently-changing fixture files.",
      "Use MSW in Storybook's preview.ts to globally intercept CDN image requests without updating every story individually.",
    ],
    related: [
      "cypress-stable-placeholder-urls",
      "playwright-deterministic-placeholders",
      "lighthouse-ci-missing-image-cls",
    ],
  },

  // ─── 9 ───────────────────────────────────────────────────────────────────────
  {
    title: "Lighthouse CI: Catch Layout Shift from Missing Images",
    description:
      "Use Lighthouse CI to detect lighthouse cls images issues caused by missing width/height attributes, late-loading images, and broken image URLs before they reach production.",
    slug: "lighthouse-ci-missing-image-cls",
    readTime: "8 min read",
    category: "Testing",
    tags: [
      "Lighthouse CLS images",
      "Lighthouse CI",
      "Core Web Vitals CI",
      "CLS testing",
      "Image performance",
    ],
    summary: [
      "Lighthouse CI runs performance audits against your app in a CI pipeline and fails the build when a metric drops below a threshold. Missing or broken images are one of the most common sources of Cumulative Layout Shift — they collapse reserved space, shift content, and inflate CLS scores. Running Lighthouse CI with lighthouse cls images assertions catches these issues before they reach production.",
      "This guide covers Lighthouse CI setup, the assertions configuration for CLS and image audits, how to use placeholder.pics URLs to test fallback rendering, and integrating Lighthouse CI with GitHub Actions.",
    ],
    sections: [
      {
        eyebrow: "How images affect CLS",
        title: "Why broken images inflate CLS scores in Lighthouse",
        body: [
          "CLS measures the sum of unexpected layout shifts during page load. An img element without explicit width and height attributes has zero reserved space before the image loads. When the image loads, the browser allocates space and shifts all subsequent content down. The shift score is proportional to the fraction of the viewport affected and the distance shifted.",
          "A broken image URL that never loads actually prevents the layout shift from occurring — the img element collapses to 0×0 and nothing shifts. But a 404 image with explicit dimensions causes a brief flicker as the browser shows the broken-image icon. More critically, if your onerror handler swaps the src to a fallback image with different dimensions, the layout shifts twice: once when the original load fails and once when the fallback loads.",
          "Lighthouse CI catches both scenarios. The cumulative-layout-shift audit measures the total CLS score and fails when it exceeds your threshold. The uses-optimized-images and uses-responsive-images audits flag missing dimensions and oversized images.",
        ],
      },
      {
        eyebrow: "Setup",
        title: "Installing and configuring Lighthouse CI",
        body: [
          "Install @lhci/cli globally or as a dev dependency. Create a lighthouserc.js configuration file that points to your local dev server and defines assertions for image-related audits.",
          "Run lhci autorun to start the dev server, run Lighthouse against configured URLs, assert results against thresholds, and upload results to a storage backend (local, LHCI server, or temporary public storage).",
        ],
        code: `# Install Lighthouse CI
npm install -D @lhci/cli

# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run preview',
      url: [
        'http://localhost:4321/',
        'http://localhost:4321/shop',
        'http://localhost:4321/blog',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        // Fail build if CLS > 0.1
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        // Warn if any image is missing width/height
        'uses-responsive-images': 'warn',
        // Fail if images lack explicit dimensions
        'unsized-images': 'error',
        // Warn on images not lazy loaded below fold
        'offscreen-images': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};`,
      },
      {
        eyebrow: "Image audit",
        title: "The unsized-images audit and explicit dimension requirements",
        body: [
          "Lighthouse's unsized-images audit flags img elements that lack both width and height attributes (or equivalent CSS aspect-ratio). Every image in your app — including fallback images — should have explicit dimensions set.",
          "When using fallback.pics URLs as onerror fallbacks, ensure your fallback img element has width and height set to the same values as the placeholder dimensions. Mismatched dimensions cause a layout shift when the fallback loads.",
        ],
        code: `<!-- Correct: explicit dimensions match fallback URL dimensions -->
<img
  src="https://cdn.yourapp.com/product.jpg"
  width="400"
  height="300"
  alt="Product"
  onerror="if(!this.dataset.fe){this.dataset.fe=1;this.src='https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image'}"
/>

<!-- Incorrect: dimensions missing, fallback will cause CLS -->
<img
  src="https://cdn.yourapp.com/product.jpg"
  alt="Product"
  onerror="this.src='https://fallback.pics/api/v1/400x300/...'"
/>`,
      },
      {
        eyebrow: "GitHub Actions",
        title: "Running Lighthouse CI in GitHub Actions",
        body: [
          "Lighthouse CI integrates with GitHub Actions via the treosh/lighthouse-ci-action action or by calling lhci autorun directly in a workflow step. The action posts audit results as a PR comment and fails the check when assertions are not met.",
          "Set LHCI_GITHUB_APP_TOKEN to enable GitHub status checks from the Lighthouse CI GitHub App. This adds a required check to your PR that fails when CLS exceeds the threshold.",
        ],
        code: `# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: ./lighthouserc.js
          uploadArtifacts: true
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: \${{ secrets.LHCI_GITHUB_APP_TOKEN }}`,
      },
      {
        eyebrow: "Fallback images in Lighthouse",
        title: "Testing fallback image behavior during Lighthouse audits",
        body: [
          "Lighthouse audits a real page load, including onerror handlers. To test that your fallback images don't introduce CLS, point Lighthouse at a test page where all product image URLs intentionally return 404. The onerror handler fires during the Lighthouse audit, and the CLS score reflects the fallback load behavior.",
          "Use fallback.pics URLs as the fallback src. They respond in under 100ms from the edge, which means the fallback image loads during the same measurement window as the original page load — giving you an accurate CLS score for the failure scenario.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Lighthouse audit references and fallback.pics docs",
        body: [
          "Fix CLS from images by setting explicit dimensions and using dimension-matched fallback URLs.",
        ],
        code: `// Dimension-matched fallback URLs (prevent CLS)
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image
https://fallback.pics/api/v1/1200x630/3B82F6/FFFFFF?text=OG+Image
https://fallback.pics/api/v1/avatar/80?text=JD

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/core-web-vitals-cls-missing-images/
https://fallback.pics/blog/automated-broken-image-scanner/`,
      },
    ],
    takeaways: [
      "Lighthouse's unsized-images audit flags img elements without explicit width and height; every image including fallbacks must have dimensions set to prevent CLS.",
      "An onerror handler that swaps to a fallback URL with different dimensions causes two layout shifts; use dimension-matched fallback.pics URLs to avoid this.",
      "Configure lighthouserc.js with cumulative-layout-shift and unsized-images assertions that fail the build when thresholds are exceeded.",
      "Test fallback image CLS by pointing Lighthouse at a page where all product image URLs return 404, then verifying the CLS score remains under 0.1.",
      "Use the treosh/lighthouse-ci-action GitHub Action to post CLS results as a required PR check and prevent regressions from reaching production.",
    ],
    related: [
      "cypress-stable-placeholder-urls",
      "automated-broken-image-scanner",
      "core-web-vitals-cls-missing-images",
    ],
  },

  // ─── 10 ──────────────────────────────────────────────────────────────────────
  {
    title: "Automated Broken Image Scanner for Production Sites",
    description:
      "Build an automated broken image checker that crawls production pages, reports 404 image URLs, and integrates with CI pipelines to catch regressions before users see them.",
    slug: "automated-broken-image-scanner",
    readTime: "9 min read",
    category: "Testing",
    tags: [
      "Broken image checker",
      "Image 404 scanner",
      "Site crawler",
      "Production image monitoring",
      "CI image audit",
    ],
    summary: [
      "Broken images reach production in several ways: a CDN migration leaves stale URLs, a CMS editor deletes a media attachment, or a deployment removes a static asset. An automated broken image checker that crawls your site and reports 404 image URLs catches these regressions before users encounter broken-image icons.",
      "This guide covers building a crawler with Playwright, extracting and validating image URLs, integrating the scanner into a CI pipeline, and using fallback.pics to understand which placeholder dimensions you need.",
    ],
    sections: [
      {
        eyebrow: "Approach",
        title: "How automated broken image scanning works",
        body: [
          "A broken image scanner crawls pages, collects all img src and srcset URLs, makes HEAD requests to each URL, and reports any that return non-200 status codes. For large sites, the scanner deduplicates URLs across pages so each unique image URL is checked once regardless of how many pages reference it.",
          "Running this in CI against a staging environment catches broken images before deployment. Running it nightly against production catches regressions from CMS changes, CDN purges, or third-party image host failures.",
        ],
      },
      {
        eyebrow: "Playwright crawler",
        title: "Building a broken image checker with Playwright",
        body: [
          "Playwright gives you full browser rendering, which means img src values set via JavaScript or frameworks (React, Vue) are captured after rendering — not just from the HTML source. This catches dynamically inserted images that a simple HTML parser would miss.",
          "Use page.$$eval() to collect all img src values after the page reaches networkidle. Filter out data URIs and blob URLs that are not network resources.",
        ],
        code: `// scripts/scan-images.ts
import { chromium, Browser, Page } from 'playwright';
import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL ?? 'https://yourapp.com';
const ROUTES = ['/', '/shop', '/blog', '/about'];

async function getImageUrls(page: Page): Promise<string[]> {
  return page.$$eval('img[src]', (imgs) =>
    imgs
      .map((img) => img.getAttribute('src') ?? '')
      .filter((src) => src.startsWith('http') || src.startsWith('/'))
  );
}

async function checkUrl(url: string): Promise<{ url: string; status: number }> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return { url, status: res.status };
  } catch {
    return { url, status: 0 };
  }
}

async function scanRoute(browser: Browser, route: string) {
  const page = await browser.newPage();
  await page.goto(\`\${BASE_URL}\${route}\`, { waitUntil: 'networkidle' });
  const urls = await getImageUrls(page);
  await page.close();
  return urls;
}

async function main() {
  const browser = await chromium.launch();
  const urlSet = new Set<string>();

  for (const route of ROUTES) {
    const urls = await scanRoute(browser, route);
    urls.forEach((u) => urlSet.add(u.startsWith('/') ? \`\${BASE_URL}\${u}\` : u));
  }

  await browser.close();

  const results = await Promise.all([...urlSet].map(checkUrl));
  const broken = results.filter((r) => r.status !== 200 && r.status !== 301 && r.status !== 302);

  if (broken.length > 0) {
    console.error('Broken images found:');
    broken.forEach((r) => console.error(\`  [\${r.status}] \${r.url}\`));
    process.exit(1);
  }

  console.log(\`Checked \${urlSet.size} unique image URLs. All OK.\`);
}

main();`,
      },
      {
        eyebrow: "srcset",
        title: "Scanning srcset and picture element sources",
        body: [
          "Product grids and responsive images use srcset, and picture elements may have multiple source URLs. A scanner that only checks img.src misses the majority of image URLs on modern sites.",
          "Parse srcset strings by splitting on commas and extracting the URL from each descriptor. The format is: 'url 2x, url2 3x' or 'url 400w, url2 800w'.",
        ],
        code: `// Enhanced image URL extraction
async function getImageUrls(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const urls: string[] = [];

    document.querySelectorAll('img').forEach((img) => {
      if (img.src) urls.push(img.src);
      if (img.srcset) {
        img.srcset.split(',').forEach((part) => {
          const url = part.trim().split(/\s+/)[0];
          if (url) urls.push(url);
        });
      }
    });

    document.querySelectorAll('source[srcset]').forEach((source) => {
      (source as HTMLSourceElement).srcset.split(',').forEach((part) => {
        const url = part.trim().split(/\s+/)[0];
        if (url) urls.push(url);
      });
    });

    return [...new Set(urls)].filter((u) => u.startsWith('http'));
  });
}`,
      },
      {
        eyebrow: "CI integration",
        title: "Running the broken image scanner in GitHub Actions",
        body: [
          "Schedule the scanner as a daily cron job against production and as a required check on PRs against your staging environment. Use different exit code handling: fail the PR check on any broken image, but only send an alert (not a build failure) for production scans.",
          "Cache the list of known-broken URLs in CI so the scanner can distinguish new regressions from pre-existing issues. Report only newly broken URLs in PR comments.",
        ],
        code: `# .github/workflows/image-scan.yml
name: Broken Image Scanner
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6am UTC
  pull_request:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx playwright install chromium
      - name: Scan images
        run: npx tsx scripts/scan-images.ts
        env:
          BASE_URL: \${{ github.event_name == 'schedule' && 'https://yourapp.com' || 'https://staging.yourapp.com' }}`,
      },
      {
        eyebrow: "Reporting",
        title: "Generating reports and alerting on broken images",
        body: [
          "Output the scan report as a JSON file with URL, status code, referring page, and image alt text. Upload as a CI artifact for debugging. For production scans, post the report to Slack or create a GitHub issue with the list of broken URLs.",
          "Group broken images by domain to identify systematic failures. Fifteen broken images all from the same CDN domain indicate a CDN migration issue, not individual missing files.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Fallback.pics and related monitoring guides",
        body: [
          "Once you identify broken images, fallback.pics provides dimension-matched replacements while you fix the source URLs.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/monitoring-image-404-sentry/
https://fallback.pics/blog/lighthouse-ci-missing-image-cls/`,
      },
    ],
    takeaways: [
      "A Playwright-based crawler captures dynamically inserted image URLs that a static HTML parser misses — essential for React, Vue, and Next.js sites.",
      "Parse srcset attributes and picture source elements in addition to img.src to catch the majority of image URLs on responsive sites.",
      "Run the scanner daily against production on a cron schedule and as a required PR check against staging to catch both deployment regressions and CMS-driven changes.",
      "Group broken images by domain in the report to distinguish systematic CDN failures from individual missing files.",
      "Use fallback.pics dimension-matched URLs as emergency replacements while permanent fixes are being deployed.",
    ],
    related: [
      "monitoring-image-404-sentry",
      "lighthouse-ci-missing-image-cls",
      "core-web-vitals-cls-missing-images",
    ],
  },

  // ─── 11 ──────────────────────────────────────────────────────────────────────
  {
    title: "Monitoring Image 404s with Sentry and Log Pipelines",
    description:
      "Set up image 404 monitoring using Sentry breadcrumbs, custom error events, and log pipeline aggregation to detect broken images before users report them.",
    slug: "monitoring-image-404-sentry",
    readTime: "8 min read",
    category: "Technical",
    tags: [
      "Image 404 monitoring",
      "Sentry image errors",
      "Broken image detection",
      "Frontend monitoring",
      "Error tracking",
    ],
    summary: [
      "Broken images are silent failures. Users see a broken-image icon and move on without filing a support ticket. Without image 404 monitoring, teams only learn about broken images when SEO rankings drop or when a customer explicitly complains. Instrumenting your frontend to capture image load errors and route them through Sentry or a log pipeline gives you visibility before the impact accumulates.",
      "This guide covers capturing img error events in JavaScript, sending them to Sentry as custom breadcrumbs and events, aggregating them in a log pipeline, and setting up alerts when image 404 rates exceed a threshold.",
    ],
    sections: [
      {
        eyebrow: "Detection",
        title: "Capturing image load errors in the browser",
        body: [
          "The browser fires an error event on every img element that fails to load. Registering a document-level listener in capture phase catches all failures regardless of when img elements are inserted into the DOM — including those from React renders, virtual scroll lists, and third-party widgets.",
          "Collect the failing URL, the page URL where it occurred, the img alt text, and the timestamp. This gives your monitoring system enough context to group errors by image domain, route, and time window.",
        ],
        code: `// monitoring/imageErrors.ts
interface ImageErrorEvent {
  imageUrl: string;
  pageUrl: string;
  alt: string;
  timestamp: number;
}

export function initImageErrorMonitoring() {
  document.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'IMG') return;

      const img = target as HTMLImageElement;
      const payload: ImageErrorEvent = {
        imageUrl: img.currentSrc || img.src,
        pageUrl: window.location.href,
        alt: img.alt ?? '',
        timestamp: Date.now(),
      };

      // Skip placeholder.pics fallback failures
      if (payload.imageUrl.includes('fallback.pics')) return;

      reportImageError(payload);
    },
    true // capture phase
  );
}`,
      },
      {
        eyebrow: "Sentry",
        title: "Sending image errors to Sentry as custom events",
        body: [
          "Sentry.captureEvent() sends a fully structured event with fingerprinting, context, and tags. Use it for image 404s so they appear as grouped issues in the Sentry issues list, separate from JavaScript exceptions.",
          "Set the fingerprint to the image URL hostname so all 404s from the same CDN domain group into one issue. This prevents noise from high-frequency identical errors filling your issues list.",
        ],
        code: `import * as Sentry from '@sentry/browser';

function reportImageError(payload: ImageErrorEvent) {
  const url = new URL(payload.imageUrl);

  Sentry.captureEvent({
    message: \`Image 404: \${payload.imageUrl}\`,
    level: 'warning',
    fingerprint: ['image-404', url.hostname],
    tags: {
      image_host: url.hostname,
      page_path: new URL(payload.pageUrl).pathname,
    },
    extra: {
      imageUrl: payload.imageUrl,
      alt: payload.alt,
      pageUrl: payload.pageUrl,
    },
    timestamp: payload.timestamp / 1000,
  });

  // Also add as breadcrumb for session context
  Sentry.addBreadcrumb({
    category: 'image.error',
    message: payload.imageUrl,
    level: 'warning',
    data: { alt: payload.alt },
  });
}`,
      },
      {
        eyebrow: "Log pipeline",
        title: "Aggregating image errors in a log pipeline",
        body: [
          "For high-traffic sites, sending every image 404 to Sentry can exhaust your event quota. Route image errors to a log pipeline instead — Datadog, Grafana Loki, or CloudFlare Logpush — and aggregate counts by image URL and time window.",
          "Batch events locally in a small in-memory queue and flush every 30 seconds or when the queue reaches 20 events. This reduces the number of requests from the frontend without losing individual error events.",
        ],
        code: `// Batched log pipeline approach
const errorQueue: ImageErrorEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(error: ImageErrorEvent) {
  errorQueue.push(error);
  if (errorQueue.length >= 20) flush();
  else if (!flushTimer) {
    flushTimer = setTimeout(flush, 30_000);
  }
}

async function flush() {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!errorQueue.length) return;
  const batch = errorQueue.splice(0);

  await fetch('/api/log/image-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
    keepalive: true,
  });
}`,
      },
      {
        eyebrow: "Alerting",
        title: "Setting up alerts when image 404 rate spikes",
        body: [
          "A sudden spike in image 404s from a single domain indicates a CDN misconfiguration or accidental deletion. Configure an alert that fires when more than 50 unique image URLs return 404 within a 10-minute window from the same hostname.",
          "In Sentry, use Alert Rules with a count threshold on events tagged image_host. In Datadog, use a metric monitor on the image error log count grouped by image_host.",
        ],
      },
      {
        eyebrow: "Fallback integration",
        title: "Pairing monitoring with fallback.pics for graceful degradation",
        body: [
          "The onerror fallback and the monitoring instrumentation work together. The onerror handler fixes the visual experience for the user immediately; the monitoring layer records the failure for your engineering team to fix the root cause.",
          "Skip reporting errors for fallback.pics URLs (as shown in the detection code above). The fallback is working as designed — no need to monitor a URL that intentionally never 404s.",
        ],
        code: `// Complete integration: fallback + monitoring
document.addEventListener('error', (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'IMG') return;

  const img = target as HTMLImageElement;
  const failedUrl = img.currentSrc || img.src;

  // Skip if already a fallback URL
  if (failedUrl.includes('fallback.pics')) return;

  // Apply fallback
  if (!img.dataset['fallbackApplied']) {
    img.dataset['fallbackApplied'] = '1';
    img.src = \`https://fallback.pics/api/v1/\${img.width || 400}x\${img.height || 300}/7C3AED/FFFFFF?text=Unavailable\`;
  }

  // Report to monitoring
  reportImageError({ imageUrl: failedUrl, pageUrl: location.href, alt: img.alt, timestamp: Date.now() });
}, true);`,
      },
      {
        eyebrow: "Resources",
        title: "Monitoring guides and fallback.pics reference",
        body: [
          "Combine proactive scanning with runtime monitoring for full coverage of broken image scenarios.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/automated-broken-image-scanner/
https://fallback.pics/blog/lighthouse-ci-missing-image-cls/`,
      },
    ],
    takeaways: [
      "Register a document-level error listener in capture phase to catch all image load failures, including those from dynamically rendered components and third-party widgets.",
      "Send image 404s to Sentry as custom captureEvent() calls with fingerprinting by CDN hostname so each domain's issues group separately.",
      "For high-traffic sites, batch errors into a local queue and flush every 30 seconds to avoid overwhelming your Sentry event quota or log pipeline ingestion.",
      "Alert on spikes in image 404 rate per domain (50+ unique URLs in 10 minutes) to catch CDN misconfigurations before they accumulate into an SEO or UX problem.",
      "Skip reporting errors from fallback.pics URLs — the fallback is working as designed and does not need monitoring.",
    ],
    related: [
      "automated-broken-image-scanner",
      "lighthouse-ci-missing-image-cls",
      "core-web-vitals-cls-missing-images",
    ],
  },

  // ─── 12 ──────────────────────────────────────────────────────────────────────
  {
    title: "Content-Security-Policy img-src for External Placeholder APIs",
    description:
      "Configure a csp img-src directive to allow external placeholder image APIs like fallback.pics without opening your policy to untrusted image sources.",
    slug: "csp-img-src-placeholder-apis",
    readTime: "7 min read",
    category: "Trust",
    tags: [
      "CSP img-src",
      "Content-Security-Policy images",
      "Image API CSP",
      "Security headers",
      "Trust",
    ],
    summary: [
      "A Content-Security-Policy (CSP) header with a restrictive img-src directive blocks external placeholder image APIs unless you explicitly allow them. Without the correct csp img-src configuration, fallback.pics URLs return a net::ERR_BLOCKED_BY_CSP error in the browser console and your onerror fallback images never display.",
      "This guide covers the correct img-src syntax for fallback.pics, how to scope the allowlist to specific subpaths rather than entire domains, nonce-based policies for inline img elements, and how to test CSP violations in development.",
    ],
    sections: [
      {
        eyebrow: "How CSP blocks images",
        title: "Why img-src violations prevent fallback images from loading",
        body: [
          "A Content-Security-Policy header tells the browser which sources are trusted for each resource type. The img-src directive governs image requests. If your policy includes img-src 'self' only, any image from an external domain — including fallback.pics — is blocked before the network request is made.",
          "The block is silent from the user's perspective: the img element shows a broken-image icon, the same as a 404. But the browser console shows a CSP violation: Refused to load the image 'https://fallback.pics/...' because it violates the following Content Security Policy directive. Your onerror handler fires, tries to load the fallback URL, and that request is also blocked.",
          "The fix is to add fallback.pics to the img-src allowlist. Do this with the minimum required scope — hostname only, not wildcard subdomain — to maintain a tight policy.",
        ],
      },
      {
        eyebrow: "Syntax",
        title: "Adding fallback.pics to your img-src directive",
        body: [
          "CSP host sources support scheme, hostname, and path. Use https://fallback.pics to allow any path under that domain over HTTPS only. Avoid using https://*.fallback.pics unless you specifically need subdomain support — the API lives on the apex domain.",
          "If your policy is delivered via a meta tag rather than an HTTP header, the same syntax applies. However, meta tags cannot set certain directives; for image sources, both delivery methods work.",
        ],
        code: `# HTTP header (Apache / nginx / Cloudflare Worker)
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://fallback.pics; script-src 'self'; style-src 'self' 'unsafe-inline';

# nginx
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https://fallback.pics;" always;

# Cloudflare Worker (TypeScript)
response.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; img-src 'self' data: https://fallback.pics;"
);

# Astro (astro.config.mjs)
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https://fallback.pics;",
    },
  },
});`,
      },
      {
        eyebrow: "Report-only",
        title: "Using Content-Security-Policy-Report-Only to test before enforcing",
        body: [
          "Deploy Content-Security-Policy-Report-Only alongside your existing policy to identify which image domains you're loading before switching to enforcement mode. Violations are reported to the report-uri endpoint without blocking the request.",
          "Use a CSP reporting endpoint (your own server or a service like report-uri.com) to collect violations during QA. Every image domain that appears in the violation reports needs an explicit img-src entry.",
        ],
        code: `# Test mode — reports violations but doesn't block
Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data: https://fallback.pics; report-uri /csp-reports;

# Your /csp-reports endpoint (Express example)
app.post('/csp-reports', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body['csp-report'];
  console.log('CSP violation:', report['blocked-uri'], 'on', report['document-uri']);
  res.status(204).send();
});`,
      },
      {
        eyebrow: "Nonces",
        title: "Nonce-based policies and inline img elements",
        body: [
          "If your policy uses nonces for script-src and style-src, you don't need nonces for img elements — the img-src directive controls image sources by hostname, not by nonce. Inline img elements with src attributes are governed by img-src regardless of whether a nonce is present on the element.",
          "Background images set via inline style attributes fall under style-src, not img-src. If you reference fallback.pics URLs in CSS background-image properties, ensure your style-src also allows the domain.",
        ],
        code: `/* background-image in CSS — requires style-src, not img-src */
.card-placeholder {
  background-image: url('https://fallback.pics/api/v1/400x300/E5E7EB/71717A');
  /* Requires: style-src 'self' https://fallback.pics; in your CSP */
}`,
      },
      {
        eyebrow: "Other image APIs",
        title: "Adding multiple image API domains to img-src",
        body: [
          "If your app loads images from multiple external sources — Cloudinary, your own CDN, and fallback.pics — list each domain separately in the img-src directive. Use the minimum required specificity: prefer https://cdn.yourapp.com over https:// to avoid unintentionally allowing all HTTPS image sources.",
          "Separate domains with spaces. There is no limit on the number of entries, but policies longer than 8KB may be truncated by some HTTP servers.",
        ],
        code: `# Multiple image domains
Content-Security-Policy: 
  default-src 'self';
  img-src 'self' 
          data: 
          blob:
          https://fallback.pics
          https://cdn.yourapp.com
          https://res.cloudinary.com;`,
      },
      {
        eyebrow: "Resources",
        title: "Security documentation and fallback.pics headers",
        body: [
          "The fallback.pics API responds with appropriate CORS and cache headers but does not set CSP headers — configure CSP in your own application.",
        ],
        code: `// Verify fallback.pics allows your origin
curl -I "https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Test"
# Look for: Access-Control-Allow-Origin: *

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/referrer-policy-placeholder-urls/
https://fallback.pics/blog/gdpr-safe-image-url-parameters/`,
      },
    ],
    takeaways: [
      "An img-src 'self' CSP blocks all external placeholder APIs including fallback.pics; add https://fallback.pics as an explicit img-src entry to allow fallback images to load.",
      "Deploy Content-Security-Policy-Report-Only first to identify which image domains your app loads before switching to enforcement mode.",
      "CSS background-image properties require the image domain in style-src, not img-src — list fallback.pics in both if you use it in CSS and HTML.",
      "Use the minimum required hostname specificity (https://fallback.pics rather than https://*) to keep your policy tight while allowing the required API.",
      "Collect CSP violation reports from QA environments to build a complete img-src allowlist before enforcing the policy in production.",
    ],
    related: [
      "referrer-policy-placeholder-urls",
      "gdpr-safe-image-url-parameters",
      "immutable-urls-cdn-placeholder-caching",
    ],
  },

  // ─── 13 ──────────────────────────────────────────────────────────────────────
  {
    title: "Referrer-Policy and Privacy for Hotlinked Placeholder URLs",
    description:
      "Understand how referrer policy images controls what URL information is sent when your pages hotlink placeholder images from external APIs like fallback.pics.",
    slug: "referrer-policy-placeholder-urls",
    readTime: "7 min read",
    category: "Trust",
    tags: [
      "Referrer policy images",
      "Hotlink privacy",
      "HTTP Referer header",
      "Image privacy",
      "Trust",
    ],
    summary: [
      "When your page loads an image from an external URL, the browser sends a Referer HTTP header containing your page URL to the image server. For most placeholder APIs this is benign, but for sensitive internal tools, staging environments, or pages with user IDs in the URL, the referrer leaks navigation context to third parties. Understanding referrer policy images behavior lets you balance analytics collection with privacy.",
      "This guide explains what the Referer header reveals when loading external placeholder images, how to configure Referrer-Policy to control what is sent, and when to prefer self-hosted fallback images over external API URLs.",
    ],
    sections: [
      {
        eyebrow: "What is sent",
        title: "What the Referer header reveals when loading placeholder images",
        body: [
          "When a browser loads an image from https://fallback.pics, it sends a request with a Referer header containing the URL of the page that triggered the load. By default (no-referrer-when-downgrade), this is the full URL including path and query parameters: https://yourapp.com/admin/users/123?filter=active.",
          "For public marketing pages this is harmless. For internal dashboards, admin panels, or pages where query parameters contain user IDs or session tokens, the referrer leaks sensitive routing information to the image API provider — even if the image itself is innocuous.",
          "The Referrer-Policy header or meta tag gives you precise control over what is sent. strict-origin-when-cross-origin (the Chrome default since 2020) sends only the origin (https://yourapp.com) to cross-origin image requests, which is a reasonable balance between analytics utility and privacy.",
        ],
      },
      {
        eyebrow: "Policies",
        title: "Choosing the right Referrer-Policy for image requests",
        body: [
          "There are eight Referrer-Policy values. For cross-origin image requests to placeholder APIs, the most relevant are: strict-origin-when-cross-origin (sends only origin), origin (always sends only origin), and no-referrer (sends nothing). Avoid unsafe-url — it sends the full URL including sensitive query parameters to every cross-origin request.",
          "Set strict-origin-when-cross-origin as a site-wide default. For specific pages that handle sensitive data, override to no-referrer on the individual img element using the referrerpolicy attribute.",
        ],
        code: `# Site-wide Referrer-Policy header
Referrer-Policy: strict-origin-when-cross-origin

# nginx
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Per-element override for sensitive pages
<img
  src="https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=No+Image"
  referrerpolicy="no-referrer"
  alt="Product unavailable"
  width="400"
  height="300"
/>

# Meta tag (applies to all requests from the page)
<meta name="referrer" content="strict-origin-when-cross-origin">`,
      },
      {
        eyebrow: "Analytics impact",
        title: "How Referrer-Policy affects image API analytics",
        body: [
          "Placeholder image APIs use referrer data to provide analytics: which pages are loading images, how many unique origins are using the service. Restricting the referrer to origin-only (strict-origin-when-cross-origin) still provides this data at the domain level without exposing individual page paths.",
          "If you use no-referrer, the image API receives no referrer information. For privacy-sensitive applications this is the right choice. For development and staging environments where analytics are less important, no-referrer prevents staging URLs from appearing in usage reports.",
        ],
        code: `# Staging/internal environment — suppress referrer entirely
Referrer-Policy: no-referrer

# Production — allow origin-level analytics
Referrer-Policy: strict-origin-when-cross-origin`,
      },
      {
        eyebrow: "Self-hosting",
        title: "When to self-host placeholder images instead of using an API",
        body: [
          "If your compliance requirements prohibit sending any data to third parties — even an HTTP request — self-hosting your placeholder images is the only option. Generate SVG placeholder files at build time and serve them from your own domain. No external request, no Referer header, no third-party involvement.",
          "The fallback.pics API is open source and can be deployed as a Cloudflare Worker on your own account. Self-hosting the worker gives you all the API capabilities with no external domain dependency.",
        ],
        code: `<!-- Self-hosted fallback: no external request -->
<img
  src="/placeholders/400x300.svg"
  alt="Product unavailable"
  width="400"
  height="300"
/>

<!-- Generated at build time with a simple SVG template -->
<!-- /placeholders/400x300.svg -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#E5E7EB"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui" font-size="14" fill="#71717A">400 × 300</text>
</svg>`,
      },
      {
        eyebrow: "Hotlink prevention",
        title: "Protecting your own images from hotlinking by third parties",
        body: [
          "Your own CDN images may be hotlinked by third parties — their pages load your image URLs without your permission, consuming your bandwidth. Configure your CDN or server to check the Referer header and deny requests that don't originate from your domain.",
          "Fallback.pics does not implement hotlink protection — it is designed to be loaded from any origin. For your own image CDN, use Cloudflare's hotlink protection feature or an nginx referer block.",
        ],
        code: `# nginx hotlink protection for your own images
location /images/ {
  valid_referers none blocked yourapp.com *.yourapp.com;
  if ($invalid_referer) {
    return 403;
  }
}`,
      },
      {
        eyebrow: "Resources",
        title: "Privacy-related guides and fallback.pics documentation",
        body: [
          "Review your Referrer-Policy before deploying external placeholder APIs on pages that handle authenticated or sensitive content.",
        ],
        code: `https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/csp-img-src-placeholder-apis/
https://fallback.pics/blog/gdpr-safe-image-url-parameters/`,
      },
    ],
    takeaways: [
      "By default (no-referrer-when-downgrade), the browser sends your full page URL as the Referer header when loading external placeholder images — including query parameters that may contain user IDs or session tokens.",
      "Set Referrer-Policy: strict-origin-when-cross-origin site-wide to send only the origin (domain) to cross-origin image requests, balancing analytics with privacy.",
      "Use referrerpolicy='no-referrer' on individual img elements for sensitive pages where even the origin should not be leaked to external APIs.",
      "For compliance environments that prohibit all third-party requests, generate SVG placeholder files at build time and serve them from your own domain.",
      "Fallback.pics is designed to accept requests from any origin and does not log or track referrer data for user profiling.",
    ],
    related: [
      "csp-img-src-placeholder-apis",
      "gdpr-safe-image-url-parameters",
      "privacy-safe-placeholder-images-url-text-uploads",
    ],
  },

  // ─── 14 ──────────────────────────────────────────────────────────────────────
  {
    title: "GDPR-Safe Image URLs: What Not to Put in Query Parameters",
    description:
      "Understand what gdpr image urls compliance requires when using query-parameter-based placeholder image APIs and how to keep personal data out of URL logs.",
    slug: "gdpr-safe-image-url-parameters",
    readTime: "8 min read",
    category: "Trust",
    tags: [
      "GDPR image URLs",
      "Privacy image API",
      "Personal data URLs",
      "GDPR compliance",
      "Trust",
    ],
    summary: [
      "URL-based placeholder image APIs accept parameters like text, colors, and labels in query strings. These parameters appear in server access logs, browser history, CDN logs, and referrer headers — potentially turning a benign image URL into a personal data record. Understanding what makes a gdpr image urls pattern compliant protects your users and your legal standing.",
      "This guide explains which query parameters constitute personal data under GDPR, how server log retention policies interact with URL-embedded data, and how to structure fallback.pics URLs to stay within safe practices.",
    ],
    sections: [
      {
        eyebrow: "What GDPR considers personal data",
        title: "When image URL parameters become personal data",
        body: [
          "GDPR defines personal data as any information relating to an identified or identifiable natural person. A URL parameter like ?text=John+Smith is personal data if John Smith is a real user in your system. A URL parameter like ?text=400x300 is not personal data — it describes the image, not a person.",
          "The risk is subtle. Developers building avatar placeholders often add the user's name or initials: https://fallback.pics/api/v1/avatar/80?text=JS for a user named John Smith. If this URL appears in CDN access logs retained for 90 days, and those logs are processed by a data processor without a DPA, you may have a GDPR violation.",
          "The same applies to user IDs in URL paths: /api/v1/avatar/80?user_id=12345. Even if the URL doesn't contain a name, if user_id maps to an identifiable person in your database, the URL parameter constitutes personal data in the log.",
        ],
      },
      {
        eyebrow: "Safe patterns",
        title: "URL parameters that are safe to use in placeholder APIs",
        body: [
          "Category labels are safe: ?text=Product, ?text=Avatar, ?text=Preview. These describe content type, not a person. Dimensions and colors are safe: /400x300/7C3AED/FFFFFF. Role-based labels that don't identify individuals are safe: ?text=Admin, ?text=Team.",
          "Initials are a grey area. AB could refer to a specific person (Alice Brown) or be entirely generic. If initials are derived from a real user's name, treat them as personal data. Use role-based or category-based text instead.",
        ],
        code: `// Safe — no personal data in URL
https://fallback.pics/api/v1/avatar/80?text=AB           // generic initials
https://fallback.pics/api/v1/avatar/80?text=User         // role label
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF       // no text at all

// Avoid — may constitute personal data
https://fallback.pics/api/v1/avatar/80?text=John+Smith   // full name
https://fallback.pics/api/v1/avatar/80?text=j.smith      // username
https://fallback.pics/api/v1/avatar/80?user_id=12345     // not a real parameter, but demonstrates risk`,
      },
      {
        eyebrow: "Server logs",
        title: "CDN and server log retention for URL-embedded data",
        body: [
          "Cloudflare logs image requests including the full URL with query parameters. If a Cloudflare worker serves your images, and the URL contains a user's name, that data sits in Cloudflare's log pipeline for your configured retention period. Cloudflare is a GDPR-compliant data processor with a standard DPA, but you're still responsible for minimizing data in logs.",
          "Fallback.pics is a third-party service. Its access logs include the full request URL. Avoid embedding personal data in fallback.pics URLs just as you would avoid logging personal data to any third-party service.",
        ],
        code: `// Pattern: generate a hash instead of embedding a name
// Instead of: /avatar/80?text=John+Smith
// Use: a deterministic color derived from user ID, no name in URL

function userColor(userId: number): string {
  const colors = ['7C3AED', '3B82F6', '10B981', 'F97316', 'EF4444'];
  return colors[userId % colors.length];
}

// URL contains user ID category color, not personal data
const avatarUrl = \`https://fallback.pics/api/v1/avatar/80/\${userColor(user.id)}/FFFFFF?text=U\`;`,
      },
      {
        eyebrow: "Data minimization",
        title: "Applying GDPR data minimization to image URL design",
        body: [
          "GDPR's data minimization principle (Article 5(1)(c)) requires processing only the personal data necessary for the specified purpose. An avatar placeholder's purpose is to show a visually distinct image — the user's name is not necessary for that purpose. A colored circle with a category label achieves the same UI goal without personal data in the URL.",
          "Design your fallback URL generation to use the minimum information required: dimensions, brand colors, and a generic role label. Derive display information (colors, initials) client-side from stored profile data, but don't embed it in the image URL.",
        ],
        code: `// Client-side: derive visual from profile, encode minimally in URL
function buildAvatarUrl(user: { id: number; role: string }): string {
  const colors = ['7C3AED', '3B82F6', '10B981', 'F97316'];
  const color = colors[user.id % colors.length];
  const label = encodeURIComponent(user.role.charAt(0).toUpperCase());
  // Role initial (A=Admin, U=User) — not personal data
  return \`https://fallback.pics/api/v1/avatar/80/\${color}/FFFFFF?text=\${label}\`;
}`,
      },
      {
        eyebrow: "Data subject rights",
        title: "Right to erasure and URL-embedded personal data",
        body: [
          "If a user exercises their GDPR right to erasure (Article 17), you must delete their personal data from your systems. If their name or ID is embedded in a CDN-cached placeholder URL, you cannot easily purge that cached response. CDN cache invalidation by URL pattern is possible but requires knowing every URL that contains the user's data.",
          "Keeping personal data out of image URLs entirely avoids this problem. A URL like /avatar/80/7C3AED/FFFFFF?text=U contains no data that maps to an individual and requires no special erasure handling.",
        ],
      },
      {
        eyebrow: "Resources",
        title: "Privacy guides and fallback.pics documentation",
        body: [
          "Review your use of placeholder image APIs against these guidelines before deploying to production for EU users.",
        ],
        code: `// GDPR-safe fallback.pics patterns
https://fallback.pics/api/v1/avatar/80/7C3AED/FFFFFF?text=U    // role initial only
https://fallback.pics/api/v1/400x300/E5E7EB/71717A             // no text
https://fallback.pics/api/v1/400x300/7C3AED/FFFFFF?text=Photo  // category label

https://fallback.pics/docs/
https://fallback.pics/placeholder-image-api/
https://fallback.pics/blog/referrer-policy-placeholder-urls/
https://fallback.pics/blog/csp-img-src-placeholder-apis/`,
      },
    ],
    takeaways: [
      "URL query parameters like ?text=John+Smith constitute personal data under GDPR if they map to an identifiable person; avoid embedding real user names or IDs in placeholder image URLs.",
      "Use category labels (?text=User, ?text=Product) or role initials (?text=A) instead of personal identifiers; derive colors from user IDs client-side without embedding the ID in the URL.",
      "Fallback.pics logs include the full request URL; treat all data in the URL as visible to Cloudflare's log pipeline for the configured retention period.",
      "GDPR's data minimization principle requires only the data necessary for the purpose — a colored placeholder requires no personal data in the URL to achieve its visual goal.",
      "Keeping personal data out of image URLs avoids right-to-erasure complications; CDN cache invalidation for URLs containing personal data requires knowing every affected URL pattern.",
    ],
    related: [
      "referrer-policy-placeholder-urls",
      "csp-img-src-placeholder-apis",
      "privacy-safe-placeholder-images-url-text-uploads",
    ],
  },
];
