"use client";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

import { ArrowPathIcon, HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";

import { useNarration } from "./Context";

export function EditorialActionsBar({ docId }: { docId: string }) {
  return (
    <>
      <RegenerateEditorial docId={docId} />
      <GoodExample docId={docId} />
      <BadExample docId={docId} />
      <Tooltip anchorSelect="button" place="top"></Tooltip>
    </>
  );
}

export function RegenerateEditorial({ docId }: { docId: string }) {
  const { regenerateContent } = useNarration();

  return (
    <button
      data-tooltip-content="Regenerate section"
      data-tooltip-variant="info"
      className="hover:drop-shadow-md opacity-50 hover:opacity-100 no-underline h-4 w-4"
      onClick={() => regenerateContent(docId)}
    >
      <ArrowPathIcon />
    </button>
  );
}

export function GoodExample({ docId }: { docId: string }) {
  const { markGoodExample } = useNarration();

  return (
    <button
      data-tooltip-content="Save as good example"
      data-tooltip-variant="success"
      className="hover:drop-shadow-md opacity-50 hover:opacity-100 no-underline h-4 w-4"
      onClick={() => markGoodExample(docId)}
    >
      <HandThumbUpIcon />
    </button>
  );
}

export function BadExample({ docId }: { docId: string }) {
  const { markBadExample } = useNarration();

  return (
    <button
      data-tooltip-content="Save as bad example"
      data-tooltip-variant="warning"
      className="hover:drop-shadow-md opacity-50 hover:opacity-100 no-underline h-4 w-4"
      onClick={() => markBadExample(docId)}
    >
      <HandThumbDownIcon />
    </button>
  );
}

export function ReasonForm({ docId, formAction }: { docId: string; formAction: string }) {
  return (
    <form action={formAction}>
      <input type="hidden" name="docId" value={docId} />
      <input type="text" name="reason" />
      <button>Save</button>
    </form>
  );
}

export function GeneratedNarration() {
  // this should be a MarkdownContent that supports a Vercel AI stream
}
