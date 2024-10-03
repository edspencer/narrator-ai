"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { getResponseType } from "./utils";

import { createContext, useContext } from "react";

/**
 * Interface representing the content and operations for narration.
 */
export interface NarrationContentType {
  /**
   * Retrieves the content associated with the given ID. This could be the already-
   * generated content, or it could be new content streaming in.
   *
   * @param id - The unique identifier for the content.
   * @returns The content as a string.
   */
  getContent: (id: string) => string;

  /**
   * Regenerates the content associated with the given ID.
   *
   * @param id - The unique identifier for the content.
   * @returns A promise that resolves when the content has been regenerated.
   */
  regenerateContent: (id: string) => Promise<void>;

  /**
   * Checks if the content associated with the given ID is currently loading.
   *
   * @param id - The unique identifier for the content.
   * @returns A boolean indicating whether the content is loading.
   */
  isLoading: (id: string) => boolean;

  /**
   * Saves an example content.
   *
   * @param example - The example content to be saved.
   * @returns A promise that resolves to a boolean indicating whether the save was successful.
   */
  saveExample: (example: any) => Promise<boolean>;
}

export const NarrationContext = createContext<NarrationContentType | undefined>(undefined);

export const useNarrationContext = () => useContext(NarrationContext);

/**
 * Provides narration-related functionalities and state management to its children components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @param {Object} [props.actions={}] - Optional actions that can be performed within the provider.
 * @param {Function} [props.actions.saveExample] - Function to save an example narration.
 * @param {Function} [props.actions.regenerateNarration] - Function to regenerate a narration based on an ID.
 *
 * @returns {JSX.Element} The provider component that wraps its children with narration context.
 *
 * @context {Function} getContent - Retrieves the narration content for a given ID.
 * @context {Function} regenerateContent - Regenerates the narration content for a given ID.
 * @context {Function} isLoading - Checks if the narration content is currently being regenerated for a given ID.
 * @context {Function} saveExample - Saves an example narration.
 */
export function NarrationProvider({ children, actions = {} }: { children: React.ReactNode; actions?: any }) {
  const [narrationStreams, setNarrationStreams] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingState] = useState<{ [key: string]: boolean }>({});

  const { saveExample, regenerateNarration } = actions;

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
    <NarrationContext.Provider value={{ getContent, regenerateContent, isLoading, saveExample }}>
      {children}
    </NarrationContext.Provider>
  );
}
