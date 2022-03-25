/**
 * The store's internal state. Use this value
 * to determine if the user has already taken
 * any action and if the listener is granted.
 */
export type IdleDetectionSubscriptionState =
  // No state changes yet.
  | "init"
  // Agent (aka browser) doesn't support the feature.
  | "not-supported"
  // User doesn't allow the API, no permission granted.
  | "not-permitted"
  // Supported + permission granted, but not yet listening.
  | "ready"
  // Listening to change events.
  | "started"
  // Detached listener, no changes will be registered.
  | "stopped";

export type SubscribeToIdleDetectionParams = {
  /**
   * Seconds for timeout window between events.
   * Please note that the browser might require a minimum of 60 sec,
   * thus 1 minute as threshold to allow the API-call.
   */
  threshold?: number;
  /**
   * Callback for state changes regarding the store-state.
   */
  onStateChange: (next: IdleDetectionSubscriptionState) => void;
  /** Callback for value changes, which are provided by the API. */
  onEventChange: (parmas: Pick<IdleDetector, "userState" | "screenState">) => void;
};
