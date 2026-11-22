#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const placesDir = path.join(rootDir, 'src/constants/places');
const placeImagesPath = path.join(rootDir, 'src/constants/placeImages.ts');
const publicDir = path.join(rootDir, 'public');

function readPlaces() {
  const files = fs.readdirSync(placesDir).filter((f) => f.endsWith('.ts')).sort();
  const places = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(placesDir, file), 'utf8');
    const blocks = content.split(/\{\s*\n\s*id:/g).slice(1);
    for (const block of blocks) {
      const idMatch = block.match(/^\s*'([^']+)'/);
      const nameMatch = block.match(/placeName:\s*'((?:\\.|[^'])*)'/);
      if (idMatch) {
        places.push({
          id: idMatch[1],
          placeName: nameMatch ? nameMatch[1].replace(/\\'/g, "'") : '',
          file,
        });
      }
    }
  }
  return places;
}

function readPlaceImages() {
  const content = fs.readFileSync(placeImagesPath, 'utf8');
  const map = new Map();
  const entryRegex =
    /^\s*'([^']+)':\s*\{([\s\S]*?)\},?\s*$/gm;
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const id = match[1];
    const body = match[2];
    const getField = (name) => {
      const m = body.match(new RegExp(`${name}:\\s*'((?:\\\\.|[^'])*)'`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };
    map.set(id, {
      url: getField('url'),
      title: getField('title'),
      source: getField('source'),
      credit: getField('credit'),
      license: getField('license'),
    });
  }
  return map;
}

function getWebpDimensions(buffer) {
  // RIFF....WEBP
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X' && buffer.length >= 30) {
    const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
    const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
    return { width, height };
  }
  if (chunk === 'VP8 ' && buffer.length >= 30) {
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { width, height };
  }
  if (chunk === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }
  return null;
}

const places = readPlaces();
const imageMap = readPlaceImages();
const placeIds = new Set(places.map((p) => p.id));

let errors = 0;
let warnings = 0;

// 1. Missing & extra IDs
const missing = places.filter((p) => !imageMap.has(p.id));
const extra = [...imageMap.keys()].filter((id) => !placeIds.has(id));
if (missing.length > 0) {
  console.error(`[FAIL] Missing PLACE_IMAGES entries (${missing.length}):`, missing.map((p) => p.id));
  errors += missing.length;
}
if (extra.length > 0) {
  console.error(`[FAIL] Orphaned PLACE_IMAGES entries (${extra.length}):`, extra);
  errors += extra.length;
}

// 2. Local file existence, size, dimensions
let localCount = 0;
let totalBytes = 0;
const urlUsage = new Map();

for (const [id, entry] of imageMap.entries()) {
  if (!entry.url) {
    console.error(`[FAIL] Empty URL for ${id}`);
    errors++;
    continue;
  }
  const list = urlUsage.get(entry.url) || [];
  list.push(id);
  urlUsage.set(entry.url, list);

  if (entry.url.startsWith('/')) {
    localCount++;
    const filePath = path.join(publicDir, entry.url);
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Missing local image for ${id}: ${entry.url}`);
      errors++;
      continue;
    }
    const buf = fs.readFileSync(filePath);
    totalBytes += buf.length;
    if (buf.length < 5000) {
      console.error(`[FAIL] Image too small (${buf.length} bytes) for ${id}: ${entry.url}`);
      errors++;
    }
    const dims = getWebpDimensions(buf);
    if (!dims) {
      console.error(`[FAIL] Invalid WebP header for ${id}: ${entry.url}`);
      errors++;
    } else {
      if (dims.width < 700) {
        console.warn(`[WARN] Narrow width (${dims.width}x${dims.height}) for ${id}`);
        warnings++;
      }
      if (dims.height > dims.width) {
        console.warn(`[WARN] Portrait orientation (${dims.width}x${dims.height}) for ${id}`);
        warnings++;
      }
    }
  }
}

// 3. Duplicate URL check
const duplicates = [...urlUsage.entries()].filter(([, ids]) => ids.length > 1);
if (duplicates.length > 0) {
  console.warn(`[WARN] Duplicate image URLs (${duplicates.length}):`);
  for (const [url, ids] of duplicates) {
    console.warn(`  - ${url} => ${ids.join(', ')}`);
  }
  warnings += duplicates.length;
}

console.log(
  `\nPlace Image Audit Summary: ${imageMap.size}/${places.length} mapped | ${localCount} local WebP (${(
    totalBytes /
    (1024 * 1024)
  ).toFixed(2)} MB) | ${errors} errors | ${warnings} warnings`
);

if (errors > 0) {
  process.exit(1);
}
