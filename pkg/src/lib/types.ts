export type IdleDetectionSubscriptionState =
  | "init"
  | "not-supported"
  | "not-permitted"
  | "ready"
  | "started"
  | "stopped";

export type SubscribeToIdleDetectionParams = {
  threshold?: number;
  onStateChange: (next: IdleDetectionSubscriptionState) => void;
  onEventChange: (parmas: Pick<IdleDetector, "userState" | "screenState">) => void;
};
