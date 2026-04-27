export async function onRequest(context: any) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const url = new URL(context.request.url);
  const pathAfterApi = url.pathname.replace('/api/v1/', '');
  const workerUrl = `https://fallback-pics.billing-04f.workers.dev/${pathAfterApi}${url.search}`;

  const workerRequest = new Request(workerUrl, {
    method: 'GET',
    headers: context.request.headers,
  });

  const response = await fetch(workerRequest);
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(context.request.method === 'HEAD' ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
