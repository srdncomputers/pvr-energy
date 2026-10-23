import { json, error } from '@sveltejs/kit';
import { uploadImage, isAuthorized } from '$lib/server/gallery-store.js';

/** Admin: upload a single picture (hero/about/etc.) and get back its public URL. */
export async function POST({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') throw error(400, 'No file provided');
  if (!file.type.startsWith('image/')) throw error(400, 'Only image files are allowed');
  // Vercel serverless functions accept request bodies up to ~4.5 MB
  if (file.size > 4 * 1024 * 1024) throw error(413, 'Image too large (max 4 MB)');
  const url = await uploadImage(file, 'site');
  return json({ url });
}
