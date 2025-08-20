export async function onRequest(context: any) {
  // Handle OPTIONS requests directly
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      }
    });
  }
  
  // Extract the path after /api/v1/
  const url = new URL(context.request.url);
  const pathAfterApi = url.pathname.replace('/api/v1/', '');
  
  // Forward the request to the worker
  const workerUrl = `https://fallback-pics.billing-04f.workers.dev/${pathAfterApi}${url.search}`;
  
  // Always use GET for the worker (even for HEAD requests)
  const workerRequest = new Request(workerUrl, {
    method: 'GET',
    headers: context.request.headers
  });
  
  // Fetch from the worker
  const response = await fetch(workerRequest);
  
  // For HEAD requests, return empty body
  const body = context.request.method === 'HEAD' ? null : response.body;
  
  // Return the worker's response
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}