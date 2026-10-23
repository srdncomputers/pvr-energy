import { getContent } from '$lib/server/gallery-store.js';

export const prerender = false;

export async function load() {
  return { content: await getContent() };
}
