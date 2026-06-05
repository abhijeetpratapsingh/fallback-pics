#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPageInventory, renderLlmsTxt, renderSitemap, urlForPath } from './seo-inventory.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(scriptDir, '../public');
const failures = [];

const pages = await getPageInventory();
const expectedSitemap = renderSitemap(pages);
const expectedLlms = renderLlmsTxt(pages);
const [actualSitemap, actualLlms] = await Promise.all([
  readFile(resolve(publicDir, 'sitemap.xml'), 'utf8'),
  readFile(resolve(publicDir, 'llms.txt'), 'utf8')
]);

if (actualSitemap !== expectedSitemap) {
  failures.push('apps/web/public/sitemap.xml is stale; run pnpm --filter @fallback-pics/web seo:generate');
}

if (actualLlms !== expectedLlms) {
  failures.push('apps/web/public/llms.txt is stale; run pnpm --filter @fallback-pics/web seo:generate');
}

const expectedUrls = new Set(pages.map((page) => urlForPath(page.path)));
const expectedLlmsUrls = new Set(pages.filter((page) => page.llmsSection).map((page) => urlForPath(page.path)));
checkUrls('sitemap.xml', extractXmlLocs(actualSitemap), expectedUrls);
checkUrls('llms.txt', extractHttpUrls(actualLlms), expectedLlmsUrls, {
  valid: expectedUrls,
  allow: new Set(['https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Product+Image'])
});

if (failures.length > 0) {
  console.error(`SEO file check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SEO generated file check passed.');

function checkUrls(label, urls, expected, options = {}) {
  const allow = options.allow || new Set();
  const valid = options.valid || expected;
  const uniqueUrls = new Set(urls);

  for (const url of uniqueUrls) {
    if (allow.has(url)) continue;
    if (/https:\/\/fallback\.pics\/(400x300|square\/400|avatar\/200|banner\/|blur\/|skeleton\/)/.test(url)) {
      failures.push(`${label} includes root-level image endpoint example: ${url}`);
      continue;
    }
    if (url.startsWith('https://fallback.pics/') && !valid.has(url)) {
      failures.push(`${label} includes stale or non-inventory URL: ${url}`);
    }
    if (isHtmlPageUrl(url) && !url.endsWith('/')) {
      failures.push(`${label} includes non-final URL without trailing slash: ${url}`);
    }
  }

  for (const url of expected) {
    if (!uniqueUrls.has(url)) failures.push(`${label} is missing inventory URL: ${url}`);
  }
}

function extractXmlLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => unescapeXml(match[1]));
}

function extractHttpUrls(text) {
  return [...text.matchAll(/https:\/\/[^\s)]+/g)].map((match) => match[0]);
}

function isHtmlPageUrl(url) {
  if (!url.startsWith('https://fallback.pics/')) return false;
  if (url.includes('/api/v1/')) return false;
  return !/\.(xml|txt|png|jpg|jpeg|webp|svg|ico|webmanifest)$/i.test(new URL(url).pathname);
}

function unescapeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}
