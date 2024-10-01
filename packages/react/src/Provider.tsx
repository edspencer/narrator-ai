import { NarrationProvider } from "./Context";

type CreateNarratorProps = {
  actions?: any;
};

export function createNarrator(params: CreateNarratorProps = {}) {
  const { actions = {} } = params;

  const Narrator = ({ children }: { children: React.ReactNode }) => {
    return <NarrationProvider actions={actions}>{children}</NarrationProvider>;
  };

  return Narrator;
}
