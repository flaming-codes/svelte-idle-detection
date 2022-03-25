import { browser } from "$app/env";
import type { IdleDetectionSubscriptionState, SubscribeToIdleDetectionParams } from "./types";

/** AbortController reference for reuse. */
let controller: AbortController;
/** Signal used to stop listening for events. */
let signal: AbortSignal;

/**
 * Simple utiltiy that requests for permission to
 * access the API, if supported.
 *
 * @returns Result of 'requestPermission'-call.
 */
export async function requestIdleDetectionPermission() {
  if (!isIdleDetectionSupported) {
    return;
  }

  return IdleDetector.requestPermission();
}

/**
 * Small utility to check if the API is
 * actually supported.
 *
 * @returns Boolean of check.
 */
export function isIdleDetectionSupported() {
  return browser && "IdleDetector" in window;
}

/**
 * Start listening to changes for idle detection, if possible.
 * If the feature isn't supported or the user hasn't granted
 * permission, 'onStateChange' is called accordingly.
 *
 * If everything is ready to be used, this function attaches
 * a listener for a given threshold interval for change events.
 *
 * Please note that the browser might require a minimum of 60 sec,
 * thus 1 minute as threshold to allow the API-call.
 *
 * @param params.threshold        Seconds for timeout window between events.
 * @param params.onStateChange    Callback for state changes.
 * @param params.onEventChange    Callback for value changes.
 */
export async function subscribeToIdleDetection(params: SubscribeToIdleDetectionParams) {
  const { threshold = 60_000, onStateChange, onEventChange } = params;

  if (!isIdleDetectionSupported) {
    return;
  }

  onStateChange("init");

  if (signal) {
    return;
  }

  controller = new AbortController();
  signal = controller.signal;

  if ((await IdleDetector.requestPermission()) !== "granted") {
    onStateChange("not-permitted");
    return;
  }

  try {
    const idleDetector = new IdleDetector();
    idleDetector.addEventListener("change", () => {
      onEventChange({
        userState: idleDetector.userState,
        screenState: idleDetector.screenState
      });
    });

    await idleDetector.start({
      threshold,
      signal
    });

    onStateChange("started");
  } catch (err) {
    signal = null;
    onStateChange("stopped");
  }
}

/**
 * Stop listening to the event emitter
 * for changes.
 */
export function unsubscribeFromIdleDetection() {
  controller.abort();
  controller = null;
  signal = null;
}
