export function setCacheHeaders(format: string): Headers {
  const headers = new Headers();
  
  // Set content type based on format
  const contentTypes: Record<string, string> = {
    'svg': 'image/svg+xml; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'gif': 'image/gif'
  };
  
  headers.set('Content-Type', contentTypes[format] || contentTypes.svg);
  
  // Aggressive caching for placeholder images - 1 year
  // This will be cached by Cloudflare's edge automatically
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'ALLOWALL'); // Allow embedding
  headers.set('Access-Control-Allow-Origin', '*'); // CORS for all origins
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Performance hints
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Timing-Allow-Origin', '*');
  
  return headers;
}