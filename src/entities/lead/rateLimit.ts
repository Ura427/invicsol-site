/**
 * A minimal in-memory sliding-window rate limiter, keyed by IP. This is not a
 * durable store — it resets on redeploy and doesn't share state across serverless
 * instances — but it's enough to blunt naive scripted spam without adding an
 * external dependency (Redis, etc.) that a portfolio-scale lead form doesn't need.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}
