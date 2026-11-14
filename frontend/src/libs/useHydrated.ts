import { useSyncExternalStore } from "react";

const noop = () => () => {};

// false during server render + hydration, true once React is interactive.
// Used to keep submit buttons disabled until onSubmit handlers are attached.
export default function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
