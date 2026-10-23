import { put, del, list } from '@vercel/blob';
import { defaultContent, mergeContent } from '$lib/content-defaults.js';

const MANIFEST_PATH = 'manifest.json';
const CONTENT_PATH = 'content.json';

async function readJsonBlob(path) {
  const { blobs } = await list({ prefix: path, limit: 1 });
  const found = blobs.find((b) => b.pathname === path);
  if (!found) return null;
  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function writeJsonBlob(path, data) {
  await put(path, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true
  });
}

/**
 * Reads the gallery manifest (all images, published + unpublished) from Blob storage.
 * Returns an empty array if the manifest doesn't exist yet (first run).
 */
export async function getManifest() {
  try {
    const data = await readJsonBlob(MANIFEST_PATH);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('getManifest failed:', err);
    return [];
  }
}

/**
 * Overwrites the manifest with the full updated list of items.
 */
export async function saveManifest(items) {
  await writeJsonBlob(MANIFEST_PATH, items);
}

/**
 * Site content (hero, about, services, reviews, contact...) = saved edits merged over defaults.
 * Never throws: falls back to defaults if Blob is unreachable.
 */
export async function getContent() {
  try {
    const saved = await readJsonBlob(CONTENT_PATH);
    return mergeContent(defaultContent, saved);
  } catch (err) {
    console.error('getContent failed:', err);
    return defaultContent;
  }
}

/** Saves the edited content (already validated) and returns the merged result. */
export async function saveContent(content) {
  const merged = mergeContent(defaultContent, content);
  await writeJsonBlob(CONTENT_PATH, merged);
  return merged;
}

/**
 * Uploads an image file to Blob storage and returns its public URL.
 * `folder` keeps gallery photos and site pictures (hero/about) apart.
 */
export async function uploadImage(file, folder = 'gallery') {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const blob = await put(path, file, {
    access: 'public',
    addRandomSuffix: false
  });
  return blob.url;
}

/**
 * Deletes an uploaded image from Blob storage (no-op for external URLs added by link).
 */
export async function deleteImageBlob(url) {
  try {
    if (url.includes('.public.blob.vercel-storage.com')) {
      await del(url);
    }
  } catch (err) {
    console.error('deleteImageBlob failed (non-fatal):', err);
  }
}

/**
 * Checks the admin password sent via the x-admin-password header
 * against the ADMIN_PASSWORD environment variable.
 */
export function isAuthorized(request) {
  const provided = request.headers.get('x-admin-password') || '';
  const expected = process.env.ADMIN_PASSWORD || 'pvr2025';
  return provided === expected;
}
