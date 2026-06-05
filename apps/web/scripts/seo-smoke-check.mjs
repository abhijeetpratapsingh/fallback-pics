#!/usr/bin/env node

const baseUrl = normalizeBase(process.env.SEO_CHECK_BASE_URL || 'http://127.0.0.1:4321');
const publicOrigin = normalizeBase(process.env.SEO_CHECK_PUBLIC_ORIGIN || 'https://fallback.pics');
const apiBase = normalizeBase(process.env.SEO_CHECK_API_BASE_URL || 'https://fallback.pics');

const webRoutes = [
  { path: '/', status: 200, type: 'text/html' },
  { path: '/placeholder-image-api/', status: 200, type: 'text/html', canonical: `${publicOrigin}/placeholder-image-api/` },
  { path: '/dummy-image-generator/', status: 200, type: 'text/html', canonical: `${publicOrigin}/dummy-image-generator/` },
  { path: '/broken-image-fallback/', status: 200, type: 'text/html', canonical: `${publicOrigin}/broken-image-fallback/` },
  { path: '/not-a-real-seo-test-page', status: 404, type: 'text/html' },
];

const apiRoutes = [
  { path: '/api/v1/400x300', type: 'image/svg+xml' },
  { path: '/api/v1/avatar/200', type: 'image/svg+xml' },
];

const failures = [];

for (const route of webRoutes) {
  const response = await fetchNoRedirect(new URL(route.path, baseUrl));
  expect(route.path, 'status', response.status, route.status);
  expectIncludes(route.path, 'content-type', response.headers.get('content-type') || '', route.type);

  if (route.canonical && response.ok) {
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(route.path, 'canonical', canonical, route.canonical);
  }
}

for (const route of apiRoutes) {
  const response = await fetchNoRedirect(new URL(route.path, apiBase));
  expect(route.path, 'status', response.status, 200);
  expectIncludes(route.path, 'content-type', response.headers.get('content-type') || '', route.type);
  expectIncludes(route.path, 'cache-control', response.headers.get('cache-control') || '', 'max-age=31536000');
  expectIncludes(route.path, 'cache-control', response.headers.get('cache-control') || '', 'immutable');
}

await checkSitemap();
await checkLlmsTxt();

if (failures.length > 0) {
  console.error(`SEO smoke check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO smoke check passed for ${baseUrl}`);
console.log(`API checks used ${apiBase}`);

async function checkSitemap() {
  const sitemapUrl = new URL('/sitemap.xml', baseUrl);
  const response = await fetchNoRedirect(sitemapUrl);
  expect('/sitemap.xml', 'status', response.status, 200);
  expectIncludes('/sitemap.xml', 'content-type', response.headers.get('content-type') || '', 'xml');

  if (!response.ok) return;
  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  for (const loc of locs) {
    if (/https:\/\/fallback\.pics\/(400x300|square\/400|avatar\/200)/.test(loc)) {
      failures.push(`sitemap loc ${loc} must not list root-level image endpoint examples`);
      continue;
    }

    const localUrl = new URL(new URL(loc).pathname, baseUrl);
    const locResponse = await fetchNoRedirect(localUrl);
    expect(new URL(loc).pathname, 'sitemap status', locResponse.status, 200);
    if (locResponse.status >= 300 && locResponse.status < 400) {
      failures.push(`${loc} redirects; sitemap entries must resolve directly`);
      continue;
    }

    const html = await locResponse.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical) {
      expect(new URL(loc).pathname, 'sitemap canonical', canonical, loc);
    }
  }
}

async function checkLlmsTxt() {
  const llmsUrl = new URL('/llms.txt', baseUrl);
  const response = await fetchNoRedirect(llmsUrl);
  expect('/llms.txt', 'status', response.status, 200);
  expectIncludes('/llms.txt', 'content-type', response.headers.get('content-type') || '', 'text/plain');

  if (!response.ok) return;
  const text = await response.text();
  const urls = [...text.matchAll(/https:\/\/fallback\.pics\/[^\s)]+/g)].map((match) => match[0]);

  for (const url of urls) {
    if (url.includes('/api/v1/')) continue;
    const parsed = new URL(url);
    if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
      failures.push(`llms.txt URL ${url} must use the final trailing-slash URL`);
      continue;
    }

    const localUrl = new URL(parsed.pathname, baseUrl);
    const urlResponse = await fetchNoRedirect(localUrl);
    expect(parsed.pathname, 'llms.txt URL status', urlResponse.status, 200);
    if (urlResponse.status >= 300 && urlResponse.status < 400) {
      failures.push(`${url} redirects; llms.txt entries must resolve directly`);
    }
  }
}

async function fetchNoRedirect(url) {
  return fetch(url, { redirect: 'manual' });
}

function expect(route, label, actual, expected) {
  if (actual !== expected) {
    failures.push(`${route} expected ${label} ${expected}, got ${actual ?? 'missing'}`);
  }
}

function expectIncludes(route, label, actual, expected) {
  if (!actual.toLowerCase().includes(expected.toLowerCase())) {
    failures.push(`${route} expected ${label} to include ${expected}, got ${actual || 'missing'}`);
  }
}

function normalizeBase(value) {
  return value.replace(/\/$/, '');
}
