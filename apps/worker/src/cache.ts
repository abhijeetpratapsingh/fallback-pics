import { getContentType, isSupportedOutputFormat } from './raster';
import { ImageParams } from './router';

export function setCacheHeaders(format: string): Headers {
  const headers = new Headers();
  const candidateFormat = format as ImageParams['format'];

  headers.set('Content-Type', isSupportedOutputFormat(candidateFormat) ? getContentType(candidateFormat) : getContentType('svg'));
  
  // Aggressive caching for placeholder images - 1 year
  // This will be cached by Cloudflare's edge automatically
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Access-Control-Allow-Origin', '*'); // CORS for all origins
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Performance hints
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Timing-Allow-Origin', '*');
  
  return headers;
}
