#!/usr/bin/env node

const baseUrl = normalizeBase(process.env.SEO_RECHECK_BASE_URL || 'http://127.0.0.1:4321');
const publicOrigin = normalizeBase(process.env.SEO_RECHECK_PUBLIC_ORIGIN || 'https://fallback.pics');

const priorityPages = [
  '/',
  '/placeholder-image-api/',
  '/placeholder-image-generator/',
  '/dummy-image-generator/',
  '/broken-image-fallback/',
  '/guides/react-image-fallback/',
  '/guides/nextjs-image-fallback/',
  '/guides/img-onerror-fallback/',
];

const failures = [];

for (const path of priorityPages) {
  const response = await fetchNoRedirect(new URL(path, baseUrl));
  expect(path, 'status', response.status, 200);
  expectIncludes(path, 'content-type', response.headers.get('content-type') || '', 'text/html');
  if (!response.ok) continue;

  const html = await response.text();
  const expectedCanonical = `${publicOrigin}${path}`;
  const canonical = matchAttribute(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const title = matchText(html, /<title>(.*?)<\/title>/is);
  const description = matchAttribute(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const robots = matchAttribute(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  const h1 = matchText(html, /<h1[^>]*>(.*?)<\/h1>/is);
  const jsonLd = extractJsonLd(html, path);

  expect(path, 'canonical', canonical, expectedCanonical);
  expectPresent(path, 'title', title);
  expectPresent(path, 'meta description', description);
  expectPresent(path, 'h1', stripTags(h1 || ''));
  if (robots && /noindex/i.test(robots)) failures.push(`${path} must be indexable, got robots=${robots}`);
  if (jsonLd.length === 0) failures.push(`${path} expected at least one JSON-LD block`);

  for (const item of jsonLd) {
    const types = collectSchemaTypes(item);
    if (types.includes('FAQPage')) failures.push(`${path} must not emit FAQPage JSON-LD`);
    if (types.includes('HowTo')) failures.push(`${path} must not emit HowTo JSON-LD`);
  }

  checkApiExamples(path, html);
  await checkInternalLinks(path, html);
}

if (failures.length > 0) {
  console.error(`Priority SEO recheck failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Priority SEO recheck passed for ${baseUrl}`);

async function checkInternalLinks(path, html) {
  const hrefs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  const internalHtmlHrefs = hrefs
    .filter((href) => href.startsWith('/'))
    .filter((href) => !href.startsWith('/api/v1/'))
    .filter((href) => !href.startsWith('/_astro/'))
    .filter((href) => !href.startsWith('/favicon'))
    .filter((href) => !/\.(png|jpg|jpeg|webp|svg|ico|css|js|xml|txt|webmanifest)$/i.test(href))
    .map((href) => href.split('#')[0])
    .filter(Boolean);

  for (const href of new Set(internalHtmlHrefs)) {
    if (href !== '/' && !href.endsWith('/')) {
      failures.push(`${path} links to ${href}; internal HTML links should use final trailing-slash URLs`);
      continue;
    }

    const response = await fetchNoRedirect(new URL(href, baseUrl));
    if (response.status >= 300 && response.status < 400) {
      failures.push(`${path} links to ${href}; target redirects`);
      continue;
    }
    if (response.status !== 200 && response.status !== 404) {
      failures.push(`${path} links to ${href}; expected 200 or intentional 404, got ${response.status}`);
    }
  }
}

function checkApiExamples(path, html) {
  const visibleText = stripTags(html);
  const rootExamples = [
    /GET\s+\/[0-9]+x[0-9]+/i,
    /https:\/\/fallback\.pics\/[0-9]+x[0-9]+/i,
    /(?:^|\s)\/(?:avatar|banner|square|blur|skeleton|animated\/skeleton)\/[0-9]/i,
  ];

  for (const pattern of rootExamples) {
    if (pattern.test(visibleText)) failures.push(`${path} contains a visible root image route example matching ${pattern}`);
  }

  if (/fallback\.pics\/api\/v1|\/api\/v1\//.test(visibleText) === false) {
    failures.push(`${path} expected at least one /api/v1 example or link`);
  }
}

function extractJsonLd(html, path) {
  const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)];
  const parsed = [];
  for (const [, raw] of blocks) {
    try {
      parsed.push(JSON.parse(raw.trim()));
    } catch (error) {
      failures.push(`${path} has invalid JSON-LD: ${error.message}`);
    }
  }
  return parsed;
}

function collectSchemaTypes(value, types = []) {
  if (!value || typeof value !== 'object') return types;
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
    return types;
  }
  if (typeof value['@type'] === 'string') types.push(value['@type']);
  for (const nested of Object.values(value)) collectSchemaTypes(nested, types);
  return types;
}

async function fetchNoRedirect(url) {
  return fetch(url, { redirect: 'manual' });
}

function expect(route, label, actual, expected) {
  if (actual !== expected) failures.push(`${route} expected ${label} ${expected}, got ${actual ?? 'missing'}`);
}

function expectIncludes(route, label, actual, expected) {
  if (!actual.toLowerCase().includes(expected.toLowerCase())) {
    failures.push(`${route} expected ${label} to include ${expected}, got ${actual || 'missing'}`);
  }
}

function expectPresent(route, label, actual) {
  if (!actual || actual.trim().length === 0) failures.push(`${route} missing ${label}`);
}

function matchAttribute(html, pattern) {
  return html.match(pattern)?.[1] || '';
}

function matchText(html, pattern) {
  return stripTags(html.match(pattern)?.[1] || '').trim();
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeBase(value) {
  return value.replace(/\/$/, '');
}
