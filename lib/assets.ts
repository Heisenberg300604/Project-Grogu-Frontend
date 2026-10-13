import { apiBaseUrl } from "@/lib/config";

/**
 * Turns a stored asset link into something a browser can load.
 *
 * Uploaded files are stored as paths (`/uploads/<name>.png`) so the same data
 * works against any API host. An absolute `https` link is used as-is. Anything
 * else (a `javascript:` URL, a relative path outside `/uploads`) yields
 * `undefined`, so callers fall back to their placeholder instead of rendering
 * it.
 */
export function assetUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  if (/^https:\/\/\S+$/i.test(url)) return url;

  if (/^\/uploads\/[A-Za-z0-9._-]+$/.test(url) && !url.includes("..")) {
    return `${apiBaseUrl()}${url}`;
  }

  return undefined;
}
