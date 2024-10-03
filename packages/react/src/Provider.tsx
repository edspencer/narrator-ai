import { NarrationProvider } from "./Context";

type CreateNarratorProps = {
  actions?: any;
};

/**
 * Creates a Narrator component that provides narration context to its children. Example usage:
 *
 * const NarratorProvider = createNarrator({
 *   actions: {
 *     saveExample,
 *     regenerateNarration,
 *   }
 * });
 *
 * @param {CreateNarratorProps} [params={}] - The parameters for creating the Narrator.
 * @param {object} [params.actions={}] - An object containing actions to be provided by the NarrationProvider.
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
