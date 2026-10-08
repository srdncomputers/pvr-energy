import { json, error } from '@sveltejs/kit';
import {
  getManifest,
  saveManifest,
  uploadImage,
  deleteImageBlob,
  isAuthorized
} from '$lib/server/gallery-store.js';

/** Admin: list ALL images (published + unpublished). Requires x-admin-password header. */
export async function GET({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  const items = await getManifest();
  return json(items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
}

/**
 * Admin: add a new image — either an uploaded file (multipart/form-data)
 * or a direct URL (JSON body). Requires x-admin-password header.
 */
export async function POST({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');

  const contentType = request.headers.get('content-type') || '';
  let url, caption, kind;

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const file = form.get('file');
    caption = (form.get('caption') || 'PVR Energy Project').toString();
    kind = form.get('kind') === 'offer' ? 'offer' : 'gallery';
    if (!file || typeof file === 'string') throw error(400, 'No file provided');
    url = await uploadImage(file);
  } else {
    const body = await request.json();
    if (!body.url) throw error(400, 'URL required');
    url = body.url;
    caption = body.caption || 'PVR Energy Project';
    kind = body.kind === 'offer' ? 'offer' : 'gallery';
  }

  const items = await getManifest();
  const maxOrder = items.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
  const newItem = {
    id: crypto.randomUUID(),
    url,
    caption,
    kind,
    published: true,
    order: maxOrder + 1,
    created_at: new Date().toISOString()
  };
  items.push(newItem);
  await saveManifest(items);

  return json(newItem, { status: 201 });
}

/** Admin: update an existing item's caption / kind / published / order. */
export async function PATCH({ request }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  const body = await request.json();
  if (!body.id) throw error(400, 'id required');

  const items = await getManifest();
  const idx = items.findIndex((i) => i.id === body.id);
  if (idx === -1) throw error(404, 'Not found');

  const allowed = ['caption', 'kind', 'published', 'order'];
  for (const key of allowed) {
    if (key in body) items[idx][key] = body[key];
  }
  await saveManifest(items);
  return json(items[idx]);
}

/** Admin: delete an image by id (query param ?id=...). */
export async function DELETE({ request, url }) {
  if (!isAuthorized(request)) throw error(401, 'Unauthorized');
  const id = url.searchParams.get('id');
  if (!id) throw error(400, 'id required');

  const items = await getManifest();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw error(404, 'Not found');

  const [removed] = items.splice(idx, 1);
  await saveManifest(items);
  await deleteImageBlob(removed.url);

  return json({ success: true });
}
