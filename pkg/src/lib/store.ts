import { browser } from "$app/env";
import { derived, writable } from "svelte/store";
import {
  isIdleDetectionSupported,
  requestIdleDetectionPermission,
  subscribeToIdleDetection,
  unsubscribeFromIdleDetection,
  type SubscribeToIdleDetectionParams
} from "./model";
import type { IdleDetectionSubscriptionState } from "./types";

/** Mutable store w/ all data. */
const store = {
  state: writable<IdleDetectionSubscriptionState>(
    !browser || isIdleDetectionSupported() ? "init" : "not-supported"
  ),
  userState: writable<IdleDetector["userState"]>(null),
  screenState: writable<IdleDetector["screenState"]>(null)
};

/**
 * Readable store w/ idle detection values
 *  & handlers to manage subscription.
 */
export const idleDetectionStore = {
  state: derived(store.state, ($s) => $s),
  userState: derived(store.userState, ($s) => $s),
  screenState: derived(store.screenState, ($s) => $s),

  requestPermission: async () => {
    const res = await requestIdleDetectionPermission();
    store.state.set(res === "granted" ? "ready" : "not-permitted");
  },
  start: (params?: Pick<SubscribeToIdleDetectionParams, "threshold">) =>
    subscribeToIdleDetection({
      ...params,
      onStateChange: store.state.set,
      onEventChange: (next) => {
        store.userState.set(next.userState);
        store.screenState.set(next.screenState);
      }
    }),
  stop: () => {
    try {
      unsubscribeFromIdleDetection();
    } finally {
      store.state.set("stopped");
    }
  }
};
