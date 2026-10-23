import { json, error } from '@sveltejs/kit';
import { getContent, saveContent, isAuthorized } from '$lib/server/gallery-store.js';

/** Admin: read current site content. */
export async function GET({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  return json(await getContent());
}

/** Admin: save the full edited content object. */
export async function PUT({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  const raw = await request.text();
  if (raw.length > 300_000) throw error(413, 'Content too large');
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    throw error(400, 'Invalid JSON');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw error(400, 'Invalid content');
  const saved = await saveContent(body);
  return json(saved);
}
