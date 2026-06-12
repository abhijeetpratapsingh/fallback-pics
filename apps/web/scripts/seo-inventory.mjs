import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const publicOrigin = 'https://fallback.pics';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDir, '..');

const staticPages = [
  {
    path: '/',
    title: 'Homepage',
    description: 'Developer-focused placeholder image API and fallback image service.',
    lastmod: '2026-04-27',
    changefreq: 'weekly',
    priority: '1.0',
    llmsSection: 'Primary pages',
    image: {
      loc: 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=fallback.pics',
      title: 'fallback.pics - Never show broken images again',
      caption: 'Lightning-fast placeholder images for developers'
    }
  },
  {
    path: '/docs/',
    title: 'Documentation',
    description: 'Implementation docs and usage examples for fallback.pics.',
    lastmod: '2026-04-27',
    changefreq: 'weekly',
    priority: '0.9',
    llmsSection: 'Primary pages'
  },
  {
    path: '/api/',
    title: 'API Reference',
    description: 'Public API route strategy and generated image examples.',
    lastmod: '2026-04-27',
    changefreq: 'monthly',
    priority: '0.8',
    llmsSection: 'Primary pages'
  },
  {
    path: '/features/',
    title: 'Features',
    description: 'fallback.pics feature overview for generated placeholders and fallback images.',
    lastmod: '2026-04-27',
    changefreq: 'monthly',
    priority: '0.7',
    llmsSection: 'Primary pages'
  },
  {
    path: '/showcase/',
    title: 'Showcase',
    description: 'Visual showcase of fallback.pics generated placeholder, avatar, skeleton, banner, and fallback image examples.',
    lastmod: '2026-06-05',
    changefreq: 'monthly',
    priority: '0.8',
    llmsSection: 'Primary pages',
    image: {
      loc: 'https://fallback.pics/api/v1/1200x630/18181B/FFFFFF?text=fallback.pics+Showcase',
      title: 'fallback.pics Showcase - Visual fallback image examples',
      caption: 'A visual gallery of generated fallback images, avatars, banners, skeleton states, and missing-media placeholders'
    }
  },
  {
    path: '/privacy/',
    title: 'Privacy Policy',
    description: 'Privacy terms for fallback.pics.',
    lastmod: '2026-04-27',
    changefreq: 'yearly',
    priority: '0.3'
  },
  {
    path: '/terms/',
    title: 'Terms',
    description: 'Terms of service for fallback.pics.',
    lastmod: '2026-04-27',
    changefreq: 'yearly',
    priority: '0.3'
  }
];

export async function getPageInventory() {
  const [{ seoPages }, { blogPosts }] = await Promise.all([
    importTsData(resolve(webRoot, 'src/data/seoPages.ts')),
    importTsData(resolve(webRoot, 'src/data/blogPosts.ts'))
  ]);

  const seoInventory = seoPages.map((page) => ({
    path: finalPath(`/${page.slug}/`),
    title: page.eyebrow,
    description: page.description,
    lastmod: page.updated,
    changefreq: 'monthly',
    priority: seoPriority(page.slug),
    llmsSection: coreTopicSection(page.slug)
  }));

  const blogPostDate = (post, index) => post.date ?? blogPublishDate(index);
  const latestBlogDate = maxDate(blogPosts.map((post, index) => blogPostDate(post, index)));
  const blogIndex = {
    path: '/blog/',
    title: 'Blog',
    description: 'Guides on image placeholders, fallback strategy, image loading, and web performance.',
    lastmod: latestBlogDate,
    changefreq: 'weekly',
    priority: '0.9',
    llmsSection: 'Primary pages',
    image: {
      loc: 'https://fallback.pics/api/v1/1200x630/7C3AED/FFFFFF?text=fallback.pics+Blog',
      title: 'fallback.pics Blog - Image Placeholder Guides and Best Practices',
      caption: 'Learn about image placeholders, fallback strategies, and web development best practices'
    }
  };

  const blogInventory = blogPosts.map((post, index) => ({
    path: finalPath(`/blog/${post.slug}/`),
    title: post.title,
    description: post.description,
    lastmod: blogPostDate(post, index),
    changefreq: 'monthly',
    priority: '0.8',
    llmsSection: 'Blog posts',
    image: {
      loc: post.image ?? buildBlogThumbnailUrl(post.title, post.slug),
      title: post.title,
      caption: post.description
    }
  }));

  const pages = [...staticPages, ...seoInventory, blogIndex, ...blogInventory];
  validateInventory(pages);
  return pages;
}

export function finalPath(path) {
  if (path === '/') return path;
  return `/${path.replace(/^\/|\/$/g, '')}/`;
}

export function urlForPath(path) {
  return `${publicOrigin}${finalPath(path)}`;
}

export function renderSitemap(pages) {
  const urls = pages
    .map((page) => {
      const image = page.image
        ? `
    <image:image>
      <image:loc>${escapeXml(page.image.loc)}</image:loc>
      <image:title>${escapeXml(page.image.title)}</image:title>
      <image:caption>${escapeXml(page.image.caption)}</image:caption>
    </image:image>`
        : '';

      return `  <url>
    <loc>${urlForPath(page.path)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${image}
  </url>`;
    })
    .join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by apps/web/scripts/generate-seo-files.mjs. Do not edit by hand. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

export function renderLlmsTxt(pages) {
  const sections = new Map();
  for (const page of pages) {
    if (!page.llmsSection) continue;
    if (!sections.has(page.llmsSection)) sections.set(page.llmsSection, []);
    sections.get(page.llmsSection).push(page);
  }

  const sectionText = [...sections.entries()]
    .map(([section, sectionPages]) => {
      const rows = sectionPages.map((page) => `- ${page.title}: ${urlForPath(page.path)}`).join('\n');
      return `## ${section}\n\n${rows}`;
    })
    .join('\n\n');

  return `# fallback.pics

fallback.pics is a developer-focused placeholder image API and fallback image service. It generates deterministic SVG placeholder images, avatars, banners, skeleton states, and broken-image fallbacks from copy-paste URLs.

${sectionText}

## API route strategy

Use the canonical API route prefix for generated images:

https://fallback.pics/api/v1/800x450/18181B/FFFFFF?text=Product+Image

The current public image API returns SVG responses with deterministic cache headers. Do not place secrets, tokens, or regulated customer data in URL parameters.

## Source

- GitHub repository: https://github.com/abhijeetpratapsingh/fallback-pics
`;
}

async function importTsData(filePath) {
  const source = await readFile(filePath, 'utf8');
  if (filePath.endsWith('seoPages.ts')) return { seoPages: extractExportedArray(source, 'seoPages') };
  if (filePath.endsWith('blogPosts.ts')) {
    const batchContext = await resolveBatchImports(filePath, source);
    const posts = extractExportedArrayWithContext(source, 'blogPostData', batchContext);
    return { blogPosts: posts };
  }
  throw new Error(`Unsupported metadata source: ${filePath}`);
}

/** Load all ./blogContent/backlog-batch-NN imports referenced in a TS file. */
async function resolveBatchImports(baseFilePath, source) {
  const batchDir = resolve(dirname(baseFilePath), 'blogContent');
  const importRe = /import\s*\{\s*(\w+)\s*\}\s*from\s*['"]\.\/blogContent\/(backlog-batch-\d+)['"]/g;
  const context = {};
  for (const match of source.matchAll(importRe)) {
    const [, exportName, batchFile] = match;
    const batchSource = await readFile(resolve(batchDir, `${batchFile}.ts`), 'utf8');
    context[exportName] = extractExportedArray(batchSource, exportName);
  }
  return context;
}

function findArrayBounds(source, markerIndex) {
  // Find the '= [' assignment start, skipping TypeScript type annotations
  const assignMatch = source.slice(markerIndex).match(/=\s*\[/);
  if (!assignMatch) return null;
  const arrayStart = markerIndex + assignMatch.index + assignMatch[0].length - 1;

  // Walk character-by-character tracking string state and bracket depth
  // to find the actual closing ']' of the top-level array.
  let depth = 0;
  let i = arrayStart;
  let inString = null; // null | '\'' | '"' | '`'
  let backtickDepth = 0; // for nested ${} inside template literals

  while (i < source.length) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : '';

    if (inString) {
      if (ch === '\\') {
        i += 2; // skip escaped character
        continue;
      }
      if (inString === '`') {
        if (ch === '`' && backtickDepth === 0) {
          inString = null;
        } else if (ch === '$' && source[i + 1] === '{') {
          backtickDepth++;
          i += 2;
          continue;
        } else if (ch === '}' && backtickDepth > 0) {
          backtickDepth--;
        }
      } else if (ch === inString) {
        inString = null;
      }
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = ch;
        backtickDepth = 0;
      } else if (ch === '[') {
        depth++;
      } else if (ch === ']') {
        depth--;
        if (depth === 0) {
          return { arrayStart, arrayEnd: i };
        }
      }
    }
    i++;
  }
  return null;
}

function extractExportedArray(source, exportName) {
  const marker = `export const ${exportName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Could not find ${exportName} export`);

  const bounds = findArrayBounds(source, markerIndex);
  if (!bounds) throw new Error(`Could not read ${exportName} array`);
  const { arrayStart, arrayEnd } = bounds;

  // arrayEnd is the index of the closing ']'
  const literal = source.slice(arrayStart, arrayEnd + 1);
  return Function(`"use strict"; return (${literal});`)();
}

function extractExportedArrayWithContext(source, exportName, context) {
  const marker = `export const ${exportName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Could not find ${exportName} export`);

  const bounds = findArrayBounds(source, markerIndex);
  if (!bounds) throw new Error(`Could not read ${exportName} array`);
  const { arrayStart, arrayEnd } = bounds;

  const literal = source.slice(arrayStart, arrayEnd + 1);
  const argNames = Object.keys(context);
  const argValues = Object.values(context);
  // eslint-disable-next-line no-new-func
  return new Function(...argNames, `"use strict"; return (${literal});`)(...argValues);
}

function seoPriority(slug) {
  if (['placeholder-image-api', 'broken-image-fallback', 'placeholder-image-generator'].includes(slug)) return '0.9';
  if (['dummy-image-generator', 'product-image-placeholder'].includes(slug)) return '0.85';
  if (slug.startsWith('guides/') || slug.includes('avatar') || slug.includes('skeleton')) return '0.8';
  return '0.75';
}

function coreTopicSection(slug) {
  if (slug.startsWith('alternatives/') || slug === 'self-hosted-placeholder-image-api') return 'Comparisons and deployment';
  return 'Core topics';
}

function blogPublishDate(index) {
  const d = new Date('2026-01-01T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + index);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const THUMBNAIL_STYLES = ['soft', 'rings', 'lines', 'pattern'];
const THUMBNAIL_THEMES = ['purple', 'blue', 'green', 'orange', 'dark'];

function slugVariant(slug, options) {
  let hash = 0;
  for (const char of slug) hash = (hash + char.charCodeAt(0)) % 997;
  return options[hash % options.length];
}

function buildBlogThumbnailUrl(title, slug) {
  const params = new URLSearchParams({
    text: title,
    style: slugVariant(slug, THUMBNAIL_STYLES),
    theme: slugVariant(slug, THUMBNAIL_THEMES),
    label: 'fallback.pics',
  });
  return `https://fallback.pics/api/v1/thumbnail/1200x630?${params.toString().replace(/%20/g, '+')}`;
}

function maxDate(values) {
  const sorted = values.filter(Boolean).sort();
  return sorted.at(-1);
}

function validateInventory(pages) {
  const paths = new Set();
  for (const page of pages) {
    if (paths.has(page.path)) throw new Error(`Duplicate inventory path: ${page.path}`);
    paths.add(page.path);
    if (page.path !== finalPath(page.path)) throw new Error(`Inventory path is not final: ${page.path}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(page.lastmod)) throw new Error(`${page.path} has invalid lastmod: ${page.lastmod}`);
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
