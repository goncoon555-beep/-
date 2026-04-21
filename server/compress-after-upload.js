#!/usr/bin/env node
// compress-after-upload.js
// Simple worker: list files in Supabase storage folder, download, resize/compress and upload (overwrite)

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const BUCKET = process.env.BUCKET || 'product-images';
const FOLDER = process.env.FOLDER || 'products';
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 300000); // default 5 minutes
const MAX_WIDTH = Number(process.env.MAX_WIDTH || 1920);
const JPEG_QUALITY = Number(process.env.JPEG_QUALITY || 75);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function listFiles(prefix = FOLDER) {
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 100 });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('List files failed:', err.message || err);
    return [];
  }
}

function shouldProcess(name) {
  const lower = (name || '').toLowerCase();
  if (!lower) return false;
  // skip already-optimized or non-image
  if (lower.endsWith('.webp') || lower.endsWith('.avif') || lower.endsWith('.gif')) return false;
  if (!(lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png'))) return false;
  return true;
}

async function downloadFile(path) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw error;
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadBuffer(path, buffer, contentType = 'image/jpeg') {
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { upsert: true, contentType });
  if (error) throw error;
}

async function processFile(file) {
  try {
    if (!shouldProcess(file.name)) return;
    const path = `${file.name.startsWith(FOLDER) ? '' : FOLDER + '/'}${file.name}`.replace('//','/').replace(/^\//,'');
    console.log('Processing', path);

    const input = await downloadFile(path);

    let img = sharp(input).rotate();
    const meta = await img.metadata();
    if (meta.width && meta.width > MAX_WIDTH) img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });

    const output = await img.jpeg({ quality: JPEG_QUALITY }).toBuffer();

    await uploadBuffer(path, output, 'image/jpeg');

    console.log(`Compressed ${path}: ${input.length} -> ${output.length} bytes`);
  } catch (err) {
    console.error('processFile error:', err.message || err);
  }
}

async function runOnce() {
  console.log(new Date().toISOString(), 'Starting compress pass for', BUCKET + '/' + FOLDER);
  const files = await listFiles(FOLDER);
  if (!files || files.length === 0) {
    console.log('No files found.');
    return;
  }

  // process sequentially to avoid memory spike; could be parallelized with limits
  for (const f of files) {
    // Skip folders
    if (f.type && f.type === 'folder') continue;
    await processFile(f);
  }
}

async function main() {
  await runOnce();
  console.log('Worker sleeping for', POLL_INTERVAL_MS, 'ms');
  setInterval(async () => {
    await runOnce();
  }, POLL_INTERVAL_MS);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
