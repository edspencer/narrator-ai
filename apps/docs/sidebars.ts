import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Documentation",
      items: ["intro", "generation", "rendering", "training", "configuration"],
    },
    {
      type: "category",
      label: "narrator-ai",
      items: [
        { label: "Narrator", type: "doc", id: "api/classes/Narrator" },
        {
          type: "category",
          label: "Types",
          items: [
            { type: "doc", label: "NarratorArgs", id: "api/interfaces/NarratorArgs" },
            { type: "doc", label: "GenerateOptions", id: "api/interfaces/GenerateOptions" },
            { type: "doc", label: "SaveExampleArgs", id: "api/interfaces/SaveExampleArgs" },
            { type: "doc", label: "Narration", id: "api/type-aliases/Narration" },
            { type: "doc", label: "Evaluation", id: "api/type-aliases/Evaluation" },
            { type: "doc", label: "Example", id: "api/type-aliases/Example" },
            { type: "doc", label: "GenerationTask", id: "api/type-aliases/GenerationTask" },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "@narrator-ai/react",
      items: [
        {
          type: "category",
          label: "Components",
          items: [
            { type: "doc", id: "react/functions/Narration", label: "Narration" },
            { type: "doc", id: "react/interfaces/NarrationProps", label: "NarrationProps" },
            { type: "doc", id: "react/functions/AISparkle", label: "AISparkle" },
            { type: "doc", id: "react/functions/BadExample", label: "BadExample" },
            { type: "doc", id: "react/functions/GoodExample", label: "GoodExample" },
            { type: "doc", id: "react/functions/RegenerateNarration", label: "RegenerateNarration" },
            { type: "doc", id: "react/functions/Spinner", label: "Spinner" },
            { type: "doc", id: "react/functions/SubmitButton", label: "SubmitButton" },
          ],
        },
        {
          type: "category",
          label: "Provider",
          items: [
            { type: "doc", id: "react/functions/createNarrator", label: "createNarrator" },
            { type: "doc", id: "react/type-aliases/CreateNarratorProps", label: "CreateNarratorProps" },
            { type: "doc", id: "react/type-aliases/NarrationActions", label: "NarrationActions" },
            { type: "doc", id: "react/functions/useNarration", label: "useNarration" },
            { type: "doc", id: "react/functions/useNarrationContext", label: "useNarrationContext" },
            { type: "doc", id: "react/functions/NarrationProvider", label: "NarrationProvider" },
            { type: "doc", id: "react/interfaces/NarrationContextType", label: "NarrationContextType" },
            { type: "doc", id: "react/variables/NarrationContext", label: "NarrationContext" },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
