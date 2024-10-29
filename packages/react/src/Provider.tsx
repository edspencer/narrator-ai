import { NarrationProvider } from "./Context";

export type NarrationActions = {
  /** A function that saves an example to the Narrator API. */
  saveExample?: (args: any) => Promise<any>;
  /** A function that regenerates the narration for a given example. */
  regenerateNarration?: (args: any) => Promise<any>;
};

export type CreateNarratorProps = {
  /** An object containing actions to be provided by the NarrationProvider. */
  actions?: NarrationActions;
};

/**
 * Creates a Narrator component that provides narration context to its children.
 *
 * To take advantage of the content regeneration and training buttons present in the Narration UI,
 * we need to wrap our UI in a Narrator context, which provides the functionality to regenerate/train
 * when we click the buttons. The easiest way to do that is via `createNarrator`.
 *
 * Example:
 *
 * In a file somewhere in your project:
 *
 * ```tsx
 * import {saveExample, regenerateNarration} from './actions/Narrator';
 * import {createNarrator} from '@narrator-ai/react';
 *
 * const NarratorProvider = createNarrator({
 *   actions: {
 *     saveExample,
 *     regenerateNarration,
 *   }
 * });
 *
 * export default NarratorProvider;
 * ```
 *
 * In your layout file:
 * ```tsx
 * import NarratorProvider from './NarratorProvider';
 *
 * function Layout({children}) {
 *  return (
 *     <NarratorProvider>
 *       {children}
 *     </NarratorProvider>
 *   );
 * }
 * ```
 *
 * @returns {React.FC<{ children: React.ReactNode }>} A React functional component that wraps its children with a NarrationProvider.
 */
export function createNarrator(params: CreateNarratorProps = {}) {
  const { actions = {} } = params;

  const Narrator = ({ children }: { children: React.ReactNode }) => {
    return <NarrationProvider actions={actions}>{children}</NarrationProvider>;
  };

  return Narrator;
}
