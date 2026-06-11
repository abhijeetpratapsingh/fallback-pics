/**
 * Full-featured Cloudflare Worker for fallback.pics
 * Optimized for <10ms response with all features
 */

import { generateAISVG } from "./ai-generator";
import { generateChartSVG } from "./chart-generator";
import { generateThumbnailSVG } from "./thumbnail-generator";
import {
  GoogleAnalyticsTelemetry,
  NewRelicTelemetry,
  extractFormat,
  extractRoute,
  extractDimensions,
  getUserAgentCategory,
} from "./telemetry";
import type { RequestMetrics } from "./telemetry";
import {
  encodeSvg,
  getContentType,
  ImagesEncoder,
  parseFormatFromSegment,
  SupportedOutputFormat,
} from "./raster";
import {
  escapeXml,
  getAvatarInitials,
  normalizeColor,
} from "./utils";

export interface Env {
  IMAGES?: ImagesEncoder;
  ALLOWED_ORIGIN?: string;
  NEW_RELIC_LICENSE_KEY?: string;
  NEW_RELIC_APP_NAME?: string;
  NEW_RELIC_ENABLED?: string;
  GOOGLE_ANALYTICS_MEASUREMENT_ID?: string;
  GOOGLE_ANALYTICS_API_SECRET?: string;
  GOOGLE_ANALYTICS_ENABLED?: string;
  GOOGLE_ANALYTICS_CLIENT_ID_SALT?: string;
  GOOGLE_ANALYTICS_WORKER_EVENT_NAME?: string;
}

// Pre-computed constants
const DEFAULT_BG = "#7C3AED";
const DEFAULT_TEXT = "#FFFFFF";
const CACHE_TTL = 31536000; // 1 year
const STALE_WHILE_REVALIDATE = 86400; // 1 day

// Pre-compiled regex patterns
const DIMENSION_REGEX = /^(\d+)(?:x(\d+))?$/;
const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{6}$/;
const FORMAT_REGEX = /\.[a-z0-9]+$/i;
const MAX_DIMENSION = 5000;
const PRESET_ROUTES = new Set([
  "thumbnail",
  "avatar",
  "square",
  "banner",
  "chart",
  "ai",
  "skeleton",
  "blur",
  "gradient",
  "animated",
]);

// Headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SVG_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": `public, max-age=${CACHE_TTL}, immutable, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
  "CDN-Cache-Control": `max-age=${CACHE_TTL}`,
  "X-Content-Type-Options": "nosniff",
  ...CORS_HEADERS,
};

async function createImageResponse(
  svg: string,
  format: SupportedOutputFormat,
  images?: ImagesEncoder,
): Promise<Response> {
  const encoded = await encodeSvg(svg, format, images);
  const headers = new Headers(SVG_HEADERS);
  headers.set("Content-Type", encoded.contentType || getContentType(format));
  return new Response(encoded.body, { headers });
}

function normalizePathname(pathname: string): string {
  if (pathname.startsWith("/api/v1/")) {
    pathname = pathname.substring(8);
  } else if (pathname === "/api/v1") {
    pathname = "";
  }

  if (pathname.startsWith("/")) {
    pathname = pathname.substring(1);
  }

  return pathname;
}

function isValidDimensions(width: number, height: number): boolean {
  return (
    width > 0 &&
    height > 0 &&
    width <= MAX_DIMENSION &&
    height <= MAX_DIMENSION
  );
}

// SVG Templates
const SVG_TEMPLATE = (
  w: number,
  h: number,
  bg: string,
  text: string,
  content: string,
) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${Math.min(w, h) * 0.1}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

const AVATAR_TEMPLATE = (
  size: number,
  bg: string,
  text: string,
  content: string,
) =>
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${size * 0.4}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

const GRADIENT_TEMPLATE = (
  w: number,
  h: number,
  color1: string,
  color2: string,
  textColor: string,
  displayText?: string,
) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color1}"/><stop offset="100%" style="stop-color:${color2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" font-family="system-ui" font-size="${Math.min(w, h) * 0.1}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${escapeXml(displayText ?? `${w} × ${h}`)}</text></svg>`;

const SKELETON_TEMPLATE = (w: number, h: number) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="50%" style="stop-color:#e0e0e0"/><stop offset="100%" style="stop-color:#f0f0f0"/><animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="1.5s" repeatCount="indefinite"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#shimmer)"/></svg>`;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const startTime = Date.now();
    const telemetry = new NewRelicTelemetry(env);
    const googleAnalytics = new GoogleAnalyticsTelemetry(env);

    const trackWorkerResponse = (
      response: Response,
      attributes: Partial<RequestMetrics> = {},
    ): Response => {
      const requestUrl = new URL(request.url);
      const route = attributes.route || extractRoute(requestUrl.pathname);
      const dimensions = extractDimensions(requestUrl.pathname);
      const customText =
        attributes.customText ??
        (requestUrl.searchParams.has("text") ||
          requestUrl.searchParams.has("label"));

      ctx.waitUntil(
        googleAnalytics.trackWorkerRequest(request, {
          route,
          method: request.method,
          statusCode: response.status,
          responseTime: Date.now() - startTime,
          country: request.cf?.country as string | undefined,
          userAgent: request.headers.get("user-agent"),
          imageWidth: attributes.imageWidth ?? dimensions.width,
          imageHeight: attributes.imageHeight ?? dimensions.height,
          imageFormat:
            attributes.imageFormat ?? extractFormat(requestUrl.pathname),
          customText,
          errorMessage: attributes.errorMessage,
        }),
      );

      return response;
    };

    const serveImage = async (
      svg: string,
      outputFormat: SupportedOutputFormat,
      metrics: Partial<RequestMetrics> & { route: string },
    ): Promise<Response> => {
      const response = await createImageResponse(svg, outputFormat, env.IMAGES);
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackRequest({
            route: metrics.route,
            method: request.method,
            statusCode: 200,
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgent: request.headers.get("user-agent"),
            imageWidth: metrics.imageWidth,
            imageHeight: metrics.imageHeight,
            imageFormat: metrics.imageFormat,
            customText: metrics.customText,
          }),
        ]),
      );

      return trackWorkerResponse(response, metrics);
    };

    const presetError = (
      route: string,
      message: string,
      attrs: Partial<RequestMetrics> = {},
    ): Response => {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError(message, route, 400, {
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgentCategory: getUserAgentCategory(
              request.headers.get("user-agent"),
            ),
          }),
        ]),
      );

      return trackWorkerResponse(
        new Response(message, { status: 400, headers: CORS_HEADERS }),
        { route, errorMessage: message, ...attrs },
      );
    };

    // Handle OPTIONS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only GET requests
    if (request.method !== "GET") {
      const responseTime = Date.now() - startTime;

      // Track error
      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError("Method not allowed", "unknown", 405, {
            method: request.method,
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgentCategory: getUserAgentCategory(
              request.headers.get("user-agent"),
            ),
          }),
        ]),
      );

      return trackWorkerResponse(
        new Response("Method not allowed", {
          status: 405,
          headers: CORS_HEADERS,
        }),
        {
          route: "unknown",
          errorMessage: "Method not allowed",
        },
      );
    }

    try {
    const url = new URL(request.url);
    const pathname = normalizePathname(url.pathname);

    // Empty path
    if (!pathname) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError("Empty pathname", "unknown", 400, {
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgentCategory: getUserAgentCategory(
              request.headers.get("user-agent"),
            ),
          }),
        ]),
      );

      return trackWorkerResponse(
        new Response("Invalid dimensions", {
          status: 400,
          headers: CORS_HEADERS,
        }),
        {
          route: "unknown",
          errorMessage: "Empty pathname",
        },
      );
    }

    // Parse path segments
    const segments = pathname.split("/");
    const firstSegment = segments[0];

    // Handle special routes

    // Blog thumbnail route
    if (firstSegment === "thumbnail") {
      if (!segments[1]) {
        return presetError("thumbnail", "Invalid thumbnail dimensions");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError("thumbnail", parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError("thumbnail", "Invalid thumbnail dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : 630;

      if (!isValidDimensions(width, height)) {
        return presetError(
          "thumbnail",
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      const svg = generateThumbnailSVG(width, height, {
        text: url.searchParams.get("text") || undefined,
        label: url.searchParams.get("label") || undefined,
        style: url.searchParams.get("style") || undefined,
        theme: url.searchParams.get("theme") || undefined,
        bg: url.searchParams.get("bg") || undefined,
        accent: url.searchParams.get("accent") || undefined,
        color: url.searchParams.get("color") || undefined,
        seed: url.searchParams.get("seed") || undefined,
      });

      return serveImage(svg, parsedFormat.format, {
        route: "thumbnail",
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
        customText: !!url.searchParams.get("text"),
      });
    }

    // Avatar route
    if (firstSegment === "avatar") {
      if (!segments[1]) {
        return presetError("avatar", "Invalid avatar size");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError("avatar", parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const size = parseInt(dimensionStr, 10);

      if (!Number.isFinite(size) || size <= 0 || size > MAX_DIMENSION) {
        return presetError(
          "avatar",
          `Invalid avatar size (max ${MAX_DIMENSION})`,
          { imageWidth: size, imageHeight: size },
        );
      }

      const text = url.searchParams.get("text") || "A";
      const bg = normalizeColor(segments[2] || "", DEFAULT_BG);
      const textColor = normalizeColor(segments[3] || "", DEFAULT_TEXT);
      const initials = getAvatarInitials(text);
      const svg = AVATAR_TEMPLATE(
        size,
        bg,
        textColor,
        escapeXml(initials),
      );

      const response = await serveImage(svg, parsedFormat.format, {
        route: "avatar",
        imageWidth: size,
        imageHeight: size,
        imageFormat: parsedFormat.format,
        customText: !!url.searchParams.get("text"),
      });

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackBusinessMetric("avatar_generated", 1, {
            size,
            hasCustomText: !!url.searchParams.get("text"),
            country: request.cf?.country as string | undefined,
          }),
        ]),
      );

      return response;
    }

    // Square format
    if (firstSegment === "square") {
      if (!segments[1]) {
        return presetError("square", "Invalid square size");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError("square", parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const size = parseInt(dimensionStr, 10);

      if (!Number.isFinite(size) || size <= 0 || size > MAX_DIMENSION) {
        return presetError(
          "square",
          `Invalid square size (max ${MAX_DIMENSION})`,
          { imageWidth: size, imageHeight: size },
        );
      }

      const text = url.searchParams.get("text") || `${size} × ${size}`;
      const bg = normalizeColor(segments[2] || "", DEFAULT_BG);
      const textColor = normalizeColor(segments[3] || "", DEFAULT_TEXT);
      const svg = SVG_TEMPLATE(size, size, bg, textColor, escapeXml(text));

      return serveImage(svg, parsedFormat.format, {
        route: "square",
        imageWidth: size,
        imageHeight: size,
        imageFormat: parsedFormat.format,
        customText: !!url.searchParams.get("text"),
      });
    }

    // Banner preset
    if (firstSegment === "banner") {
      if (!segments[1]) {
        return presetError("banner", "Invalid banner dimensions");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError("banner", parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError("banner", "Invalid banner dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : 400;

      if (!isValidDimensions(width, height)) {
        return presetError(
          "banner",
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      const text = url.searchParams.get("text") || "Banner";
      const svg = GRADIENT_TEMPLATE(
        width,
        height,
        "#667EEA",
        "#764BA2",
        "#FFFFFF",
        text,
      );

      return serveImage(svg, parsedFormat.format, {
        route: "banner",
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
        customText: !!url.searchParams.get("text"),
      });
    }

    // Chart generation with sophisticated visualizations
    if (firstSegment === "chart") {
      if (!segments[1] || !segments[2]) {
        return presetError("chart", "Invalid chart route");
      }

      const chartType = segments[1];
      const parsedFormat = parseFormatFromSegment(segments[2]);
      if (!parsedFormat.ok) {
        return presetError("chart", parsedFormat.error);
      }

      const dimensionStr = segments[2].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError("chart", "Invalid chart dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : width;

      if (!isValidDimensions(width, height)) {
        return presetError(
          "chart",
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      const svg = generateChartSVG(width, height, chartType);
      return serveImage(svg, parsedFormat.format, {
        route: "chart",
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
      });
    }

    // AI context generation with intelligent layouts
    if (firstSegment === "ai") {
      if (!segments[1]) {
        return presetError("ai", "Invalid AI dimensions");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError("ai", parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError("ai", "Invalid AI dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : width;

      if (!isValidDimensions(width, height)) {
        return presetError(
          "ai",
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      const context = (url.searchParams.get("context") || "tech").toLowerCase();
      const mood = (url.searchParams.get("mood") || "default").toLowerCase();
      const customText = url.searchParams.get("text");

      let customBgColor =
        url.searchParams.get("bg") || url.searchParams.get("bgcolor");
      let customTextColor =
        url.searchParams.get("text_color") ||
        url.searchParams.get("textcolor");

      if (segments[2] && HEX_COLOR_REGEX.test(segments[2])) {
        customBgColor = `#${segments[2]}`;
      }
      if (segments[3] && HEX_COLOR_REGEX.test(segments[3])) {
        customTextColor = `#${segments[3]}`;
      }

      if (customBgColor) {
        customBgColor = normalizeColor(customBgColor, "");
      }
      if (customTextColor) {
        customTextColor = normalizeColor(customTextColor, "");
      }

      const svg = generateAISVG(
        width,
        height,
        context,
        mood,
        customText || undefined,
        customBgColor || undefined,
        customTextColor || undefined,
      );

      return serveImage(svg, parsedFormat.format, {
        route: "ai",
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
        customText: !!customText,
      });
    }

    // Direct effect endpoints (e.g., /skeleton/400x300, /blur/400x300)
    if (
      firstSegment === "skeleton" ||
      firstSegment === "blur" ||
      firstSegment === "gradient"
    ) {
      if (!segments[1]) {
        return presetError(firstSegment, "Invalid dimensions");
      }

      const parsedFormat = parseFormatFromSegment(segments[1]);
      if (!parsedFormat.ok) {
        return presetError(firstSegment, parsedFormat.error);
      }

      const dimensionStr = segments[1].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError(firstSegment, "Invalid dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : width;

      if (!isValidDimensions(width, height)) {
        return presetError(
          firstSegment,
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      if (firstSegment === "skeleton") {
        return serveImage(SKELETON_TEMPLATE(width, height), parsedFormat.format, {
          route: "skeleton",
          imageWidth: width,
          imageHeight: height,
          imageFormat: parsedFormat.format,
        });
      }

      if (firstSegment === "blur") {
        const blurSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="100%" height="100%" fill="#e0e0e0" filter="url(#blur)"/></svg>`;
        return serveImage(blurSvg, parsedFormat.format, {
          route: "blur",
          imageWidth: width,
          imageHeight: height,
          imageFormat: parsedFormat.format,
        });
      }

      const svg = GRADIENT_TEMPLATE(
        width,
        height,
        "#7C3AED",
        "#3B82F6",
        "#FFFFFF",
      );
      return serveImage(svg, parsedFormat.format, {
        route: "gradient",
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
      });
    }

    // Animated endpoints
    if (firstSegment === "animated") {
      if (!segments[1] || !segments[2]) {
        return presetError("animated", "Invalid animated route");
      }

      const animationType = segments[1];
      const parsedFormat = parseFormatFromSegment(segments[2]);
      if (!parsedFormat.ok) {
        return presetError(`animated-${animationType}`, parsedFormat.error);
      }

      const dimensionStr = segments[2].replace(FORMAT_REGEX, "");
      const match = DIMENSION_REGEX.exec(dimensionStr);

      if (!match) {
        return presetError(`animated-${animationType}`, "Invalid dimensions");
      }

      const width = parseInt(match[1], 10);
      const height = match[2] ? parseInt(match[2], 10) : width;

      if (!isValidDimensions(width, height)) {
        return presetError(
          `animated-${animationType}`,
          `Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`,
          { imageWidth: width, imageHeight: height },
        );
      }

      let svg: string;
      switch (animationType) {
        case "skeleton":
          svg = SKELETON_TEMPLATE(width, height);
          break;
        case "pulse":
          svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e0e0e0"><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/></rect></svg>`;
          break;
        case "wave":
          svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#e0e0e0"/><stop offset="50%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/><animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="2s" repeatCount="indefinite"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wave)"/></svg>`;
          break;
        case "shimmer":
          svg = SKELETON_TEMPLATE(width, height);
          break;
        case "dots":
          svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><g><circle cx="${width / 2 - 30}" cy="${height / 2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0s" repeatCount="indefinite"/></circle><circle cx="${width / 2}" cy="${height / 2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0.2s" repeatCount="indefinite"/></circle><circle cx="${width / 2 + 30}" cy="${height / 2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0.4s" repeatCount="indefinite"/></circle></g></svg>`;
          break;
        case "gradient":
          svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="animGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7C3AED"><animate attributeName="stop-color" values="#7C3AED;#3B82F6;#7C3AED" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" style="stop-color:#3B82F6"><animate attributeName="stop-color" values="#3B82F6;#7C3AED;#3B82F6" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="100%" height="100%" fill="url(#animGrad)"/></svg>`;
          break;
        default:
          return presetError(
            `animated-${animationType || "unknown"}`,
            "Invalid animation type",
            { imageWidth: width, imageHeight: height },
          );
      }

      return serveImage(svg, parsedFormat.format, {
        route: `animated-${animationType}`,
        imageWidth: width,
        imageHeight: height,
        imageFormat: parsedFormat.format,
      });
    }

    if (PRESET_ROUTES.has(firstSegment)) {
      return presetError(firstSegment, "Invalid route parameters");
    }

    // Standard dimensions with special effects
    const parsedStandardFormat = parseFormatFromSegment(firstSegment);
    if (!parsedStandardFormat.ok) {
      return trackWorkerResponse(
        new Response(parsedStandardFormat.error, {
          status: 400,
          headers: CORS_HEADERS,
        }),
        {
          route: extractRoute(pathname),
          errorMessage: parsedStandardFormat.error,
        },
      );
    }

    const outputFormat = parsedStandardFormat.format;
    const dimensionStr = firstSegment.replace(FORMAT_REGEX, "");
    const match = DIMENSION_REGEX.exec(dimensionStr);

    if (!match) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError(
            "Invalid dimensions format",
            extractRoute(pathname),
            400,
            {
              pathname: firstSegment,
              responseTime,
              country: request.cf?.country as string | undefined,
              userAgentCategory: getUserAgentCategory(
                request.headers.get("user-agent"),
              ),
            },
          ),
        ]),
      );

      return trackWorkerResponse(
        new Response("Invalid dimensions format", {
          status: 400,
          headers: CORS_HEADERS,
        }),
        {
          route: extractRoute(pathname),
          errorMessage: "Invalid dimensions format",
        },
      );
    }

    const width = parseInt(match[1]);
    const height = match[2] ? parseInt(match[2]) : width;

    // Validate dimensions
    if (!isValidDimensions(width, height)) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError(
            "Invalid dimensions range",
            extractRoute(pathname),
            400,
            {
              width,
              height,
              responseTime,
              country: request.cf?.country as string | undefined,
              userAgentCategory: getUserAgentCategory(
                request.headers.get("user-agent"),
              ),
            },
          ),
        ]),
      );

      return trackWorkerResponse(
        new Response(`Invalid dimensions (max ${MAX_DIMENSION}x${MAX_DIMENSION})`, {
          status: 400,
          headers: CORS_HEADERS,
        }),
        {
          route: extractRoute(pathname),
          imageWidth: width,
          imageHeight: height,
          errorMessage: "Invalid dimensions range",
        },
      );
    }

    // Check for special effects in path
    if (segments[1] === "gradient") {
      const color1 = normalizeColor(segments[2] || "", "#7C3AED");
      const color2 = normalizeColor(segments[3] || "", "#3B82F6");
      const svg = GRADIENT_TEMPLATE(width, height, color1, color2, "#FFFFFF");
      return serveImage(svg, outputFormat, {
        route: "gradient",
        imageWidth: width,
        imageHeight: height,
        imageFormat: outputFormat,
      });
    }

    if (segments[1] === "skeleton") {
      return serveImage(SKELETON_TEMPLATE(width, height), outputFormat, {
        route: "skeleton",
        imageWidth: width,
        imageHeight: height,
        imageFormat: outputFormat,
      });
    }

    // Standard placeholder
    const bg = normalizeColor(segments[1] || "", DEFAULT_BG);
    const textColor = normalizeColor(segments[2] || "", DEFAULT_TEXT);
    const customText = url.searchParams.get("text") || `${width} × ${height}`;
    const svg = SVG_TEMPLATE(
      width,
      height,
      bg,
      textColor,
      escapeXml(customText),
    );

    const route = extractRoute(pathname);
    const response = await serveImage(svg, outputFormat, {
      route,
      imageWidth: width,
      imageHeight: height,
      imageFormat: outputFormat,
      customText: !!url.searchParams.get("text"),
    });

    ctx.waitUntil(
      telemetry.sendMetrics([
        telemetry.trackBusinessMetric("image_generated", 1, {
          route,
          width,
          height,
          hasCustomText: !!url.searchParams.get("text"),
          country: request.cf?.country as string | undefined,
        }),
      ]),
    );

    return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      const status = message.includes("Unsupported image format")
        ? 400
        : message.includes("Raster output requires")
          ? 503
          : 500;
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(
        telemetry.sendMetrics([
          telemetry.trackError(message, "unknown", status, {
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgentCategory: getUserAgentCategory(
              request.headers.get("user-agent"),
            ),
          }),
        ]),
      );

      return trackWorkerResponse(
        new Response(message, { status, headers: CORS_HEADERS }),
        { route: "unknown", errorMessage: message },
      );
    }
  },
};
