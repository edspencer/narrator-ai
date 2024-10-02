"use client";

import { useNarrationContext } from "./Context";

export function useNarration() {
  const context = useNarrationContext();
  if (!context) {
    throw new Error("useNarration must be used within a NarrationProvider");
  }
  return context;
}
