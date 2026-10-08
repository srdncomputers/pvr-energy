import { json } from '@sveltejs/kit';
import { getManifest } from '$lib/server/gallery-store.js';

/** Public endpoint: returns only published images, offers first, then by sort_order. */
export async function GET() {
  const items = await getManifest();
  const published = items
    .filter((i) => i.published)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'offer' ? -1 : 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  return json(published);
}
