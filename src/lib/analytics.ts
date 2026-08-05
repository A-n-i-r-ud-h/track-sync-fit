declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Push straight onto dataLayer so events are never dropped when gtag.js
 * hasn't finished loading yet — GTM replays the queue on init.
 */
function push(args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  } else {
    window.dataLayer.push(args);
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  push(["event", name, params ?? {}]);
}

export function trackPageView(path: string) {
  push(["event", "page_view", { page_path: path, page_location: typeof window !== "undefined" ? window.location.href : undefined }]);
}

/**
 * Fire an event and wait for GA to acknowledge (or a short timeout) before
 * navigating away — otherwise the beacon is cancelled by the page unload.
 */
export function trackEventAndWait(
  name: string,
  params?: Record<string, unknown>,
  timeoutMs = 700,
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    push([
      "event",
      name,
      {
        ...(params ?? {}),
        event_callback: () => {
          clearTimeout(timer);
          finish();
        },
        event_timeout: timeoutMs,
      },
    ]);
  });
}
