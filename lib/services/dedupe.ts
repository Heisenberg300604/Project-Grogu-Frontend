/**
 * Overlapping calls with the same key share one request.
 *
 * Used by the on-demand AI resources (feedback summaries, matching). Without
 * it, a double-fired effect or a click during an automatic refresh sends two
 * requests, and whichever answers last wins, which may be the stale one.
 */

const inFlight = new Map<string, Promise<unknown>>();

export function dedupe<T>(key: string, start: () => Promise<T>): Promise<T> {
  const running = inFlight.get(key);
  if (running) return running as Promise<T>;

  const request = start().finally(() => inFlight.delete(key));
  inFlight.set(key, request);
  return request;
}
