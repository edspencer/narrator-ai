"use client";

import { useNarrationContext } from "./Context";

/**
 * Custom hook that provides access to the narration context. This provides
 * access to functions like `isLoading`, `saveExample`, and `regenerate`.
 *
 * This hook must be used within a `NarrationProvider`. If it is used outside
 * of a `NarrationProvider`, it will throw an error.
 *
 * @returns {NarrationContext} The narration context.
 * @throws {Error} If the hook is used outside of a `NarrationProvider`.
 */
export function useNarration() {
  const context = useNarrationContext();
  if (!context) {
    throw new Error("useNarration must be used within a NarrationProvider");
  }
  return context;
}
