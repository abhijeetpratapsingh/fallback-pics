import { Router } from './router';
import { generateImage } from './generator';
import { setCacheHeaders } from './cache';

export interface Env {
  ALLOWED_ORIGIN?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }
    
    const url = new URL(request.url);
    
    // Debug endpoint
    if (url.pathname === '/debug') {
      return new Response(JSON.stringify({
        url: request.url,
        pathname: url.pathname,
        hostname: url.hostname,
        origin: url.origin
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const router = new Router(request);
    
    try {
      const params = router.parse();
      const image = await generateImage(params);
      
      const headers = setCacheHeaders(image.format);
      
      // Override CORS header with environment-specific value if set
      if (env.ALLOWED_ORIGIN) {
        headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGIN);
      }
      
      return new Response(image.content, {
        status: 200,
        headers
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid request';
      const headers = new Headers({
        'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      return new Response(`Error: ${message}`, { status: 400, headers });
    }
  }
};