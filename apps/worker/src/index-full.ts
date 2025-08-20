/**
 * Full-featured Cloudflare Worker for fallback.pics
 * Optimized for <10ms response with all features
 */

export interface Env {
  ALLOWED_ORIGIN?: string;
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

const CHART_BAR_TEMPLATE = (w: number, h: number) => {
  const bars = [30, 70, 45, 90, 60, 80, 40].map((height, i) => 
    `<rect x="${i * w/8 + w/16}" y="${h - h*height/100}" width="${w/12}" height="${h*height/100}" fill="#7C3AED" opacity="0.8"/>`
  ).join('');
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/>${bars}</svg>`;
};

// AI context patterns
const AI_CONTEXTS: Record<string, { bg: string; text: string; content: string }> = {
  'e-commerce': { bg: '#FF6B6B', text: '#FFFFFF', content: 'Product Image' },
  'tech': { bg: '#4ECDC4', text: '#FFFFFF', content: 'Tech Preview' },
  'blog': { bg: '#45B7D1', text: '#FFFFFF', content: 'Blog Header' },
  'portfolio': { bg: '#96CEB4', text: '#FFFFFF', content: 'Portfolio Item' },
  'dashboard': { bg: '#667EEA', text: '#FFFFFF', content: 'Analytics' },
  'social': { bg: '#F093FB', text: '#FFFFFF', content: 'Social Post' },
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only GET requests
    if (request.method !== 'GET') {
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

    // Chart generation
    if (firstSegment === 'chart' && segments[1] && segments[2]) {
      const chartType = segments[1];
      const dimensionStr = segments[2].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : width;
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          if (chartType === 'bar') {
            const svg = CHART_BAR_TEMPLATE(width, height);
            return new Response(svg, { headers: SVG_HEADERS });
          }
          // Add more chart types here
        }
      }
    }

    // AI context generation
    if (firstSegment === 'ai' && segments[1]) {
      const dimensionStr = segments[1].replace(FORMAT_REGEX, '');
      const match = DIMENSION_REGEX.exec(dimensionStr);
      
      if (match) {
        const width = parseInt(match[1]);
        const height = match[2] ? parseInt(match[2]) : width;
        
        if (width > 0 && width <= 5000 && height > 0 && height <= 5000) {
          const context = url.searchParams.get('context') || 'tech';
          const aiConfig = AI_CONTEXTS[context] || AI_CONTEXTS['tech'];
          
          const svg = SVG_TEMPLATE(width, height, aiConfig.bg, aiConfig.text, aiConfig.content);
          return new Response(svg, { headers: SVG_HEADERS });
        }
      }
    }

    // Standard dimensions with special effects
    const dimensionStr = firstSegment.replace(FORMAT_REGEX, '');
    const match = DIMENSION_REGEX.exec(dimensionStr);
    
    if (!match) {
      return new Response('Invalid dimensions format', { status: 400, headers: CORS_HEADERS });
    }

    const width = parseInt(match[1]);
    const height = match[2] ? parseInt(match[2]) : width;

    // Validate dimensions
    if ((width | height) <= 0 || width > 5000 || height > 5000) {
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
    return new Response(svg, { headers: SVG_HEADERS });
  }
};