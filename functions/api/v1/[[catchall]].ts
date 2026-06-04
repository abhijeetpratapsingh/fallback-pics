interface PagesFunctionContext {
  request: Request;
  env: {
    WORKER_ORIGIN?: string;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function getWorkerOrigin(env: PagesFunctionContext['env']): string | null {
  const workerOrigin = env.WORKER_ORIGIN?.trim();

  if (!workerOrigin) {
    return null;
  }

  return workerOrigin.replace(/\/+$/, '');
}

export function buildWorkerUrl(requestUrl: string, workerOrigin: string): string {
  const url = new URL(requestUrl);
  const pathAfterApi = url.pathname.replace(/^\/api\/v1\/?/, '');
  return `${workerOrigin.replace(/\/+$/, '')}/${pathAfterApi}${url.search}`;
}

export async function onRequest(context: PagesFunctionContext) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  const workerOrigin = getWorkerOrigin(context.env);

  if (!workerOrigin) {
    return new Response('WORKER_ORIGIN is not configured', {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const workerUrl = buildWorkerUrl(context.request.url, workerOrigin);

  const workerRequest = new Request(workerUrl, {
    method: 'GET',
    headers: context.request.headers,
  });

  const response = await fetch(workerRequest);
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', CORS_HEADERS['Access-Control-Allow-Methods']);

  return new Response(context.request.method === 'HEAD' ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
