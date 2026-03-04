#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const projectRoot = process.cwd();
const inputDir = path.join(projectRoot, 'docx-posts');
const outputDir = path.join(projectRoot, 'posts');
const mediaRootDir = path.join(projectRoot, 'public', 'post-assets');
const cacheFile = path.join(projectRoot, '.cache', 'docx-posts-cache.json');

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
}

function toSlug(fileName) {
  return fileName
    .replace(/\.docx$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hashBuffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function getCache() {
  if (!existsSync(cacheFile)) return {};
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  ensureDir(path.dirname(cacheFile));
  writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
}

function formatDate(isoDate) {
  const d = new Date(isoDate);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hasPandoc() {
  try {
    execFileSync('pandoc', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function convertOneDocx({ absoluteInputPath, slug, outputPath, title, date }) {
  const mediaDir = path.join(mediaRootDir, slug);
  ensureDir(mediaDir);

  const relativeMediaPath = path.relative(projectRoot, mediaDir);

  const markdown = execFileSync(
    'pandoc',
    [
      absoluteInputPath,
      '-f',
      'docx',
      '-t',
      'gfm',
      '--wrap=none',
      `--extract-media=${relativeMediaPath}`,
    ],
    { encoding: 'utf8' }
  );

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `slug: "${slug}"`,
    'source: "docx"',
    '---',
    '',
  ].join('\n');

  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n').trimStart();
  writeFileSync(outputPath, `${frontmatter}${normalizedMarkdown}\n`, 'utf8');
}

function main() {
  ensureDir(inputDir);
  ensureDir(outputDir);
  ensureDir(mediaRootDir);

  if (!hasPandoc()) {
    console.error('[docx->posts] Pandoc is required but was not found on PATH.');
    console.error('[docx->posts] Install Pandoc in Netlify build image before running this script.');
    process.exit(1);
  }

  const files = readdirSync(inputDir).filter((file) => file.toLowerCase().endsWith('.docx'));
  const cache = getCache();

  if (files.length === 0) {
    console.log('[docx->posts] No .docx files found in /docx-posts.');
    return;
  }

  let convertedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const absoluteInputPath = path.join(inputDir, file);
    const fileBuffer = readFileSync(absoluteInputPath);
    const fileHash = hashBuffer(fileBuffer);
    const slug = toSlug(file);
    const outputPath = path.join(outputDir, `${slug}.md`);

    if (cache[file] === fileHash && existsSync(outputPath)) {
      skippedCount += 1;
      continue;
    }

    const title = file.replace(/\.docx$/i, '').replace(/[-_]+/g, ' ').trim();
    const date = formatDate(statSync(absoluteInputPath).mtime.toISOString());

    convertOneDocx({ absoluteInputPath, slug, outputPath, title, date });

    cache[file] = fileHash;
    convertedCount += 1;
    console.log(`[docx->posts] Converted ${file} -> posts/${slug}.md`);
  }

  saveCache(cache);
  console.log(`[docx->posts] Complete. Converted: ${convertedCount}, Skipped: ${skippedCount}`);
}

main();
