import { put, del, list } from '@vercel/blob';

const MANIFEST_PATH = 'manifest.json';

/**
 * Reads the gallery manifest (all images, published + unpublished) from Blob storage.
 * Returns an empty array if the manifest doesn't exist yet (first run).
 */
export async function getManifest() {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATH, limit: 1 });
    const found = blobs.find((b) => b.pathname === MANIFEST_PATH);
    if (!found) return [];
    const res = await fetch(found.url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
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
  await put(MANIFEST_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true
  });
}

/**
 * Uploads an image file to Blob storage under gallery/ and returns its public URL.
 */
export async function uploadImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `gallery/${Date.now()}-${safeName}`;
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
