/**
 * Thin wrapper around Plausible's queued-event API. Calling trackEvent before
 * the Plausible script has loaded (or when analytics are disabled entirely,
 * because NEXT_PUBLIC_PLAUSIBLE_DOMAIN is unset) is always safe — the queue
 * shim in the layout defines window.plausible as a no-op-until-loaded
 * function, and this guards for the case where the shim itself never ran
 * (analytics disabled in this environment).
 *
 * As the site owner, knowing WHICH page produced a lead is the actual
 * business question analytics exists to answer here — not raw traffic
 * volume — so every lead-producing form fires one of these on success.
 */
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(eventName: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined' || !window.plausible) return;
  window.plausible(eventName, props ? { props } : undefined);
}
