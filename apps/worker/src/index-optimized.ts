/**
 * Ultra-optimized Cloudflare Worker for fallback.pics
 * Goal: <10ms response time globally
 */

export interface Env {
  ALLOWED_ORIGIN?: string;
}

// Pre-computed constants
const DEFAULT_BG = '#7C3AED';
const DEFAULT_TEXT = '#FFFFFF';
const CACHE_TTL = 31536000; // 1 year in seconds
const STALE_WHILE_REVALIDATE = 86400; // 1 day

// Pre-compiled regex patterns (compiled once, reused)
const DIMENSION_REGEX = /^(\d+)(?:x(\d+))?$/;
const HEX_COLOR_REGEX = /^[0-9A-Fa-f]{6}$/;
const FORMAT_REGEX = /\.(svg|png|jpg|jpeg|webp|avif|gif)$/i;

// Minimal SVG template (no spaces, minimal tags)
const SVG_TEMPLATE = (w: number, h: number, bg: string, text: string, content: string) => 
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${Math.min(w,h)*0.1}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

// Avatar SVG (circle)
const AVATAR_TEMPLATE = (size: number, bg: string, text: string, content: string) =>
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${bg}"/><text x="50%" y="50%" font-family="system-ui" font-size="${size*0.4}" fill="${text}" text-anchor="middle" dominant-baseline="middle">${content}</text></svg>`;

// Pre-computed headers
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

// Ultra-fast color validation and normalization
const normalizeColor = (color: string): string => {
  if (!color) return '';
  // Remove # if present and validate
  const cleaned = color.replace('#', '');
  return HEX_COLOR_REGEX.test(cleaned) ? `#${cleaned}` : '';
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Early return for OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only handle GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Remove /api/v1 prefix if present
    if (pathname.startsWith('/api/v1/')) {
      pathname = pathname.substring(8); // Faster than replace
    }
    
    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1);
    }

    // Fast path for empty/root requests
    if (!pathname) {
      return new Response('Invalid dimensions', { status: 400, headers: CORS_HEADERS });
    }

    // Parse path segments efficiently
    const segments = pathname.split('/');
    const firstSegment = segments[0];
    
    // Handle special routes with early returns
    if (firstSegment === 'avatar' && segments[1]) {
      const size = parseInt(segments[1]);
      if (size > 0 && size <= 5000) {
        const text = url.searchParams.get('text') || 'A';
        const bg = normalizeColor(segments[2]) || DEFAULT_BG;
        const textColor = normalizeColor(segments[3]) || DEFAULT_TEXT;
        
        const svg = AVATAR_TEMPLATE(size, bg, textColor, escapeXml(text));
        return new Response(svg, { headers: SVG_HEADERS });
      }
    }

    // Handle square format (single dimension)
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

    // Parse standard dimensions (WIDTHxHEIGHT)
    // Remove format extension if present
    const dimensionStr = firstSegment.replace(FORMAT_REGEX, '');
    const match = DIMENSION_REGEX.exec(dimensionStr);
    
    if (!match) {
      return new Response('Invalid dimensions format', { status: 400, headers: CORS_HEADERS });
    }

    const width = parseInt(match[1]);
    const height = match[2] ? parseInt(match[2]) : width;

    // Validate dimensions (using bitwise OR for faster comparison)
    if ((width | height) <= 0 || width > 5000 || height > 5000) {
      return new Response('Invalid dimensions (max 5000x5000)', { status: 400, headers: CORS_HEADERS });
    }

    // Parse colors from path or use defaults
    const bg = normalizeColor(segments[1]) || DEFAULT_BG;
    const textColor = normalizeColor(segments[2]) || DEFAULT_TEXT;
    
    // Get custom text or use dimensions
    const customText = url.searchParams.get('text') || `${width} × ${height}`;
    
    // Generate optimized SVG
    const svg = SVG_TEMPLATE(width, height, bg, textColor, escapeXml(customText));
    
    // Return with aggressive caching
    return new Response(svg, { headers: SVG_HEADERS });
  }
};