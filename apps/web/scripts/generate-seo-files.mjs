#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPageInventory, renderLlmsTxt, renderSitemap } from './seo-inventory.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(scriptDir, '../public');

const pages = await getPageInventory();

await Promise.all([
  writeFile(resolve(publicDir, 'sitemap.xml'), renderSitemap(pages)),
  writeFile(resolve(publicDir, 'llms.txt'), renderLlmsTxt(pages))
]);

console.log(`Generated sitemap.xml and llms.txt from ${pages.length} inventory pages.`);
