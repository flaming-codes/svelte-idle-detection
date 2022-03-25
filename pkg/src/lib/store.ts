import { browser } from "$app/env";
import { derived, writable } from "svelte/store";
import {
  isIdleDetectionSupported,
  requestIdleDetectionPermission,
  subscribeToIdleDetection,
  unsubscribeFromIdleDetection
} from "./model";
import type { IdleDetectionSubscriptionState, SubscribeToIdleDetectionParams } from "./types";

/** Mutable store w/ all data. */
const store = {
  state: writable<IdleDetectionSubscriptionState>(
    !browser || isIdleDetectionSupported() ? "init" : "not-supported"
  ),
  userState: writable<IdleDetector["userState"]>(null),
  screenState: writable<IdleDetector["screenState"]>(null)
} as const;

/** Helper that starts listening. */
async function start(params?: Pick<SubscribeToIdleDetectionParams, "threshold">) {
  return subscribeToIdleDetection({
    ...params,
    onStateChange: store.state.set,
    onEventChange: (next) => {
      store.userState.set(next.userState);
      store.screenState.set(next.screenState);
    }
  });
}

/** Helper that stops listening. */
function stop() {
  try {
    unsubscribeFromIdleDetection();
  } finally {
    store.state.set("stopped");
    store.userState.set(null);
    store.screenState.set(null);
  }
}

/** Helper to ask user for permission, if possible. */
async function requestPermission() {
  const res = await requestIdleDetectionPermission();
  store.state.set(res === "granted" ? "ready" : "not-permitted");
  return res;
}

/** Helper to ask for permission & start if possible. */
async function requestPermissionAndStart(
  params?: Pick<SubscribeToIdleDetectionParams, "threshold">
) {
  const res = await requestIdleDetectionPermission();
  store.state.set(res === "granted" ? "ready" : "not-permitted");

  if (res === "granted") {
    await start(params);
  }

  return res;
}

/**
 * Readable store w/ idle detection values
 *  & handlers to manage subscription.
 */
export const idleDetectionStore = {
  state: derived(store.state, ($s) => $s),
  userState: derived(store.userState, ($s) => $s),
  screenState: derived(store.screenState, ($s) => $s),

  requestPermission,
  requestPermissionAndStart,
  start,
  stop
} as const;
