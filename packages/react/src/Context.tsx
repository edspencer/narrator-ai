"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { getResponseType } from "./utils";

import { createContext, useContext } from "react";

export interface NarrationContentType {
  getContent: (id: string) => string;
  regenerateContent: (id: string) => Promise<void>;
  isLoading: (id: string) => boolean;
  newContent?: string;
  markGoodExample: (id: string) => void;
  markBadExample: (id: string) => void;
}

export const NarrationContext = createContext<NarrationContentType | undefined>(undefined);

export const useNarrationContext = () => useContext(NarrationContext);

export function NarrationProvider({ children, actions = {} }: { children: React.ReactNode; actions?: any }) {
  const [narrationStreams, setNarrationStreams] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingState] = useState<{ [key: string]: boolean }>({});

  const { markGoodExample, markBadExample, regenerateNarration } = actions;

  const regenerateContent = async (id: string) => {
    setLoadingState({ ...loadingStates, [id]: true });
    setNarrationStreams((streams) => ({ ...streams, [id]: "" }));

    //start the regeneration
    const response = await regenerateNarration(id);
    const responseType = getResponseType(response);

    if (responseType === "stream") {
      for await (const delta of readStreamableValue(response)) {
        const deltaString = delta as string;
        setNarrationStreams((streams) => ({
          ...streams,
          [id]: streams[id] ? `${streams[id]}${deltaString}` : deltaString,
        }));
      }
    } else if (responseType === "ui" || responseType === "string") {
      setNarrationStreams((streams) => ({ ...streams, [id]: response }));
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
