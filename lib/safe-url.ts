/**
 * Returns the URL when it is a plain http(s) link, otherwise undefined.
 *
 * User-supplied links (a studio's website) must not be rendered as `href`s
 * unchecked: a `javascript:` or `data:` URL in an anchor runs script when
 * clicked.
 */
export function safeHttpUrl(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}
