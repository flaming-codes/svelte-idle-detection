import { browser } from "$app/env";
import type { IdleDetectionSubscriptionState } from "./types";

let controller: AbortController;
let signal: AbortSignal;

export async function requestIdleDetectionPermission() {
  if (!isIdleDetectionSupported) {
    return;
  }

  return IdleDetector.requestPermission();
}

export function isIdleDetectionSupported() {
  return browser && "IdleDetector" in window;
}

export type SubscribeToIdleDetectionParams = {
  threshold?: number;
  onStateChange: (next: IdleDetectionSubscriptionState) => void;
  onEventChange: (parmas: Pick<IdleDetector, "userState" | "screenState">) => void;
};

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

export function unsubscribeFromIdleDetection() {
  controller.abort();
  controller = null;
  signal = null;
}
