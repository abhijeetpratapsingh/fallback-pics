/**
 * Full-featured Cloudflare Worker for fallback.pics
 * Optimized for <10ms response with all features
 */

import { generateAISVG } from './ai-generator';
import { NewRelicTelemetry, extractRoute, extractDimensions, getUserAgentCategory } from './telemetry';

export interface Env {
  ALLOWED_ORIGIN?: string;
  NEW_RELIC_LICENSE_KEY?: string;
  NEW_RELIC_APP_NAME?: string;
  NEW_RELIC_ENABLED?: string;
}

// Pre-computed constants
const DEFAULT_BG = '#7C3AED';
const DEFAULT_TEXT = '#FFFFFF';
const CACHE_TTL = 31536000; // 1 year
const STALE_WHILE_REVALIDATE = 86400; // 1 day

// Pre-compiled regex patterns
const DIMENSION_REGEX = /^(\d+)(?:x(\d+))?$/;
const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{6}$/;
const FORMAT_REGEX = /\.(svg|png|jpg|jpeg|webp|avif|gif)$/i;

// Headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const SVG_HEADERS = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': `public, max-age=${CACHE_TTL}, immutable, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
  'CDN-Cache-Control': `max-age=${CACHE_TTL}`,
  'X-Content-Type-Options': 'nosniff',
  ...CORS_HEADERS
};

// Fast XML escape
const escapeXml = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
};

// Color normalization
const normalizeColor = (color: string): string => {
  if (!color) return '';
  const cleaned = color.replace('#', '');
  return HEX_COLOR_REGEX.test(cleaned) ? `#${cleaned}` : '';
};

// SVG Templates
const SVG_TEMPLATE = (w: number, h: number, bg: string, text: string, content: string) => 
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${Math.min(w,h)*0.1}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

const AVATAR_TEMPLATE = (size: number, bg: string, text: string, content: string) =>
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${size*0.4}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

const GRADIENT_TEMPLATE = (w: number, h: number, color1: string, color2: string, text: string) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color1}"/><stop offset="100%" style="stop-color:${color2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" font-family="system-ui" font-size="${Math.min(w,h)*0.1}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${w} × ${h}</text></svg>`;

const SKELETON_TEMPLATE = (w: number, h: number) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f0f0f0"/><stop offset="50%" style="stop-color:#e0e0e0"/><stop offset="100%" style="stop-color:#f0f0f0"/><animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="1.5s" repeatCount="indefinite"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#shimmer)"/></svg>`;

// Import chart generator
import { generateChartSVG } from './chart-generator';


// Mood modifiers for colors
const MOOD_MODIFIERS: Record<string, (color: string) => string> = {
  'energetic': (color) => adjustBrightness(color, 1.2),
  'calm': (color) => adjustSaturation(color, 0.7),
  'dark': (color) => adjustBrightness(color, 0.6),
  'vibrant': (color) => adjustSaturation(color, 1.3),
  'professional': (color) => adjustSaturation(color, 0.8),
  'playful': (color) => adjustHue(color, 30),
  'serious': (color) => adjustSaturation(color, 0.5),
  'warm': (color) => adjustHue(color, -20),
  'cool': (color) => adjustHue(color, 20),
};

// Color adjustment helpers
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function adjustBrightness(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.floor(r * factor)),
    Math.min(255, Math.floor(g * factor)),
    Math.min(255, Math.floor(b * factor))
  );
}

function adjustSaturation(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
  return rgbToHex(
    Math.min(255, Math.floor(gray + factor * (r - gray))),
    Math.min(255, Math.floor(gray + factor * (g - gray))),
    Math.min(255, Math.floor(gray + factor * (b - gray)))
  );
}

function adjustHue(hex: string, degrees: number): string {
  const [r, g, b] = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  hsl[0] = (hsl[0] + degrees) % 360;
  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startTime = Date.now();
    const telemetry = new NewRelicTelemetry(env);

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only GET requests
    if (request.method !== 'GET') {
      const responseTime = Date.now() - startTime;

      // Track error
      ctx.waitUntil(telemetry.sendMetrics([
        telemetry.trackError('Method not allowed', 'unknown', 405, {
          method: request.method,
          responseTime,
          country: request.cf?.country as string | undefined,
          userAgentCategory: getUserAgentCategory(request.headers.get('user-agent'))
        })
      ]));

      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Remove /api/v1 prefix
    if (pathname.startsWith('/api/v1/')) {
      pathname = pathname.substring(8);
    }
    
    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1);
    }

    // Empty path
    if (!pathname) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(telemetry.sendMetrics([
        telemetry.trackError('Empty pathname', 'unknown', 400, {
          responseTime,
          country: request.cf?.country as string | undefined,
          userAgentCategory: getUserAgentCategory(request.headers.get('user-agent'))
        })
      ]));

      return new Response('Invalid dimensions', { status: 400, headers: CORS_HEADERS });
    }

    // Parse path segments
    const segments = pathname.split('/');
    const firstSegment = segments[0];
    
    // Handle special routes
    
    // Avatar route
    if (firstSegment === 'avatar' && segments[1]) {
      const size = parseInt(segments[1]);
      if (size > 0 && size <= 5000) {
        const text = url.searchParams.get('text') || 'A';
        const bg = normalizeColor(segments[2]) || DEFAULT_BG;
        const textColor = normalizeColor(segments[3]) || DEFAULT_TEXT;
        
        const svg = AVATAR_TEMPLATE(size, bg, textColor, escapeXml(text));

        // Track avatar request
        const responseTime = Date.now() - startTime;
        ctx.waitUntil(telemetry.sendMetrics([
          telemetry.trackRequest({
            route: 'avatar',
            method: request.method,
            statusCode: 200,
            responseTime,
            country: request.cf?.country as string | undefined,
            userAgent: request.headers.get('user-agent'),
            imageWidth: size,
            imageHeight: size,
            imageFormat: 'svg',
            customText: !!text && text !== 'A',
          }),
          telemetry.trackBusinessMetric('avatar_generated', 1, {
            size,
            hasCustomText: !!text && text !== 'A',
            country: request.cf?.country as string | undefined,
          })
        ]));

        return new Response(svg, { headers: SVG_HEADERS });
      }
    }

    // Square format
    if (firstSegment === 'square' && segments[1]) {
      const size = parseInt(segments[1]);
      if (size > 0 && size <= 5000) {
        const text = url.searchParams.get('text') || `${size} × ${size}`;
        const bg = normalizeColor(segments[2]) || DEFAULT_BG;
        const textColor = normalizeColor(segments[3]) || DEFAULT_TEXT;
        
        const svg = SVG_TEMPLATE(size, size, bg, textColor, escapeXml(text));
        return new Response(svg, { headers: SVG_HEADERS });
      }
    }

    // Banner preset
    if (firstSegment === 'banner' && segments[1]) {
      const dimensionStr = segments[1].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : 400; // Default banner height
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          const text = url.searchParams.get('text') || 'Banner';
          const svg = GRADIENT_TEMPLATE(width, height, '#667EEA', '#764BA2', '#FFFFFF');
          return new Response(svg, { headers: SVG_HEADERS });
        }
      }
    }

    // Chart generation with sophisticated visualizations
    if (firstSegment === 'chart' && segments[1] && segments[2]) {
      const chartType = segments[1];
      const dimensionStr = segments[2].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : width;
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          // Use the improved chart generator
          const svg = generateChartSVG(width, height, chartType);
          return new Response(svg, { headers: SVG_HEADERS });
        }
      }
    }

    // AI context generation with intelligent layouts
    if (firstSegment === 'ai' && segments[1]) {
      const dimensionStr = segments[1].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : width;
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          const context = (url.searchParams.get('context') || 'tech').toLowerCase();
          const mood = (url.searchParams.get('mood') || 'default').toLowerCase();
          const customText = url.searchParams.get('text');
          
          // Support custom colors from URL params or path segments
          let customBgColor = url.searchParams.get('bg') || url.searchParams.get('bgcolor');
          let customTextColor = url.searchParams.get('text_color') || url.searchParams.get('textcolor');
          
          // Also support colors in path: /ai/400x300/FF6B6B/FFFFFF
          if (segments[2] && HEX_COLOR_REGEX.test(segments[2])) {
            customBgColor = `#${segments[2]}`;
          }
          if (segments[3] && HEX_COLOR_REGEX.test(segments[3])) {
            customTextColor = `#${segments[3]}`;
          }
          
          // Normalize colors if provided
          if (customBgColor) customBgColor = normalizeColor(customBgColor);
          if (customTextColor) customTextColor = normalizeColor(customTextColor);
          
          // Use the intelligent AI generator
          const svg = generateAISVG(width, height, context, mood, customText || undefined, customBgColor || undefined, customTextColor || undefined);
          return new Response(svg, { headers: SVG_HEADERS });
        }
      }
    }

    // Direct effect endpoints (e.g., /skeleton/400x300, /blur/400x300)
    if (firstSegment === 'skeleton' || firstSegment === 'blur' || firstSegment === 'gradient') {
      const dimensionStr = segments[1]?.replace(FORMAT_REGEX, '');
      if (dimensionStr) {
        const match = DIMENSION_REGEX.exec(dimensionStr);
        if (match) {
          const width = parseInt(match[1]);
          const height = match[2] ? parseInt(match[2]) : width;
          
          if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
            if (firstSegment === 'skeleton') {
              const svg = SKELETON_TEMPLATE(width, height);
              return new Response(svg, { headers: SVG_HEADERS });
            } else if (firstSegment === 'blur') {
              // Blur effect using SVG filter
              const blurSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter></defs><rect width="100%" height="100%" fill="#e0e0e0" filter="url(#blur)"/></svg>`;
              return new Response(blurSvg, { headers: SVG_HEADERS });
            } else if (firstSegment === 'gradient') {
              const svg = GRADIENT_TEMPLATE(width, height, '#7C3AED', '#3B82F6', '#FFFFFF');
              return new Response(svg, { headers: SVG_HEADERS });
            }
          }
        }
      }
    }
    
    // Animated endpoints
    if (firstSegment === 'animated' && segments[1] && segments[2]) {
      const animationType = segments[1];
      const dimensionStr = segments[2].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : width;
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          // Handle different animation types
          let svg;
          switch (animationType) {
            case 'skeleton':
              svg = SKELETON_TEMPLATE(width, height);
              break;
            case 'pulse':
              svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e0e0e0"><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/></rect></svg>`;
              break;
            case 'wave':
              svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#e0e0e0"/><stop offset="50%" style="stop-color:#f0f0f0"/><stop offset="100%" style="stop-color:#e0e0e0"/><animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="2s" repeatCount="indefinite"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#wave)"/></svg>`;
              break;
            case 'shimmer':
              svg = SKELETON_TEMPLATE(width, height); // Reuse skeleton which has shimmer
              break;
            case 'dots':
              svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><g><circle cx="${width/2-30}" cy="${height/2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0s" repeatCount="indefinite"/></circle><circle cx="${width/2}" cy="${height/2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0.2s" repeatCount="indefinite"/></circle><circle cx="${width/2+30}" cy="${height/2}" r="8" fill="#999"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" begin="0.4s" repeatCount="indefinite"/></circle></g></svg>`;
              break;
            case 'gradient':
              svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="animGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7C3AED"><animate attributeName="stop-color" values="#7C3AED;#3B82F6;#7C3AED" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" style="stop-color:#3B82F6"><animate attributeName="stop-color" values="#3B82F6;#7C3AED;#3B82F6" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="100%" height="100%" fill="url(#animGrad)"/></svg>`;
              break;
            default:
              return new Response('Invalid animation type', { status: 400, headers: CORS_HEADERS });
          }
          return new Response(svg, { headers: SVG_HEADERS });
        }
      }
    }

    // Standard dimensions with special effects
    const dimensionStr = firstSegment.replace(FORMAT_REGEX, '');
    const match = DIMENSION_REGEX.exec(dimensionStr);
    
    if (!match) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(telemetry.sendMetrics([
        telemetry.trackError('Invalid dimensions format', extractRoute(pathname), 400, {
          pathname: firstSegment,
          responseTime,
          country: request.cf?.country as string | undefined,
          userAgentCategory: getUserAgentCategory(request.headers.get('user-agent'))
        })
      ]));

      return new Response('Invalid dimensions format', { status: 400, headers: CORS_HEADERS });
    }

    const width = parseInt(match[1]);
    const height = match[2] ? parseInt(match[2]) : width;

    // Validate dimensions
    if ((width | height) <= 0 || width > 5000 || height > 5000) {
      const responseTime = Date.now() - startTime;

      ctx.waitUntil(telemetry.sendMetrics([
        telemetry.trackError('Invalid dimensions range', extractRoute(pathname), 400, {
          width,
          height,
          responseTime,
          country: request.cf?.country as string | undefined,
          userAgentCategory: getUserAgentCategory(request.headers.get('user-agent'))
        })
      ]));

      return new Response('Invalid dimensions (max 5000x5000)', { status: 400, headers: CORS_HEADERS });
    }

    // Check for special effects in path
    if (segments[1] === 'gradient') {
      const color1 = normalizeColor(segments[2]) || '#7C3AED';
      const color2 = normalizeColor(segments[3]) || '#3B82F6';
      const svg = GRADIENT_TEMPLATE(width, height, color1, color2, '#FFFFFF');
      return new Response(svg, { headers: SVG_HEADERS });
    }

    if (segments[1] === 'skeleton') {
      const svg = SKELETON_TEMPLATE(width, height);
      return new Response(svg, { headers: SVG_HEADERS });
    }

    // Standard placeholder
    const bg = normalizeColor(segments[1]) || DEFAULT_BG;
    const textColor = normalizeColor(segments[2]) || DEFAULT_TEXT;
    const customText = url.searchParams.get('text') || `${width} × ${height}`;

    const svg = SVG_TEMPLATE(width, height, bg, textColor, escapeXml(customText));

    // Track successful request
    const responseTime = Date.now() - startTime;
    const route = extractRoute(pathname);
    const dimensions = extractDimensions(pathname);

    ctx.waitUntil(telemetry.sendMetrics([
      telemetry.trackRequest({
        route,
        method: request.method,
        statusCode: 200,
        responseTime,
        country: request.cf?.country as string | undefined,
        userAgent: request.headers.get('user-agent'),
        imageWidth: dimensions.width,
        imageHeight: dimensions.height,
        imageFormat: 'svg',
        customText: !!url.searchParams.get('text'),
      }),
      telemetry.trackBusinessMetric('image_generated', 1, {
        route,
        width: dimensions.width,
        height: dimensions.height,
        hasCustomText: !!url.searchParams.get('text'),
        country: request.cf?.country as string | undefined,
      })
    ]));

    return new Response(svg, { headers: SVG_HEADERS });
  }
};