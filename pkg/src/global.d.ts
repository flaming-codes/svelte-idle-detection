/**
 * Class declaration for https://developer.mozilla.org/en-US/docs/Web/API/IdleDetector.
 */
class IdleDetector {
  constructor();

  static requestPermission(): Promise<"granted" | "denied">;

  userState: null | "active" | "idle";
  screenState: null | "locked" | "unlocked";

  addEventListener: EventTarget["addEventListener"];
  start(params: { threshold: number; signal: AbortSignal }): Promise<void>;
}
