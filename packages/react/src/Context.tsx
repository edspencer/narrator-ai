"use client";

import React, { createContext, useContext, useState } from "react";
import { readStreamableValue } from "ai/rsc";

export interface NarrationContentType {
  getContent: (id: string) => string;
  regenerateContent: (id: string) => void;
  isLoading: (id: string) => boolean;
  newContent?: string;
  markGoodExample: (id: string) => void;
  markBadExample: (id: string) => void;
}

const NarrationContext = createContext<NarrationContentType | undefined>(undefined);

export const useNarrationContext = () => useContext(NarrationContext);

export function useNarration() {
  const context = useNarrationContext();
  if (!context) {
    throw new Error("useNarration must be used within a NarrationProvider");
  }
  return context;
}

export function NarrationProvider({ children, actions = {} }: { children: React.ReactNode; actions?: any }) {
  const [narrationStreams, setNarrationStreams] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingState] = useState<{ [key: string]: boolean }>({});

  const { markGoodExample, markBadExample, regenerateEditorial } = actions;

  const regenerateContent = async (id: string) => {
    setLoadingState({ ...loadingStates, [id]: true });

    //start the regeneration
    const { output } = await regenerateEditorial(id);

    for await (const delta of readStreamableValue(output)) {
      const deltaString = delta as string;
      setNarrationStreams((streams) => ({
        ...streams,
        [id]: streams[id] ? `${streams[id]}${deltaString}` : deltaString,
      }));
    }

    setLoadingState({ ...loadingStates, [id]: false });
  };

  function getContent(id: string) {
    return narrationStreams[id] || "";
  }

  function isLoading(id: string) {
    return loadingStates[id] || false;
  }

  return (
    <NarrationContext.Provider value={{ getContent, regenerateContent, isLoading, markBadExample, markGoodExample }}>
      {children}
    </NarrationContext.Provider>
  );
}
