"use client";

import "react-tooltip/dist/react-tooltip.css";

import { Tooltip, VariantType } from "react-tooltip";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, HandThumbUpIcon, HandThumbDownIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useNarration } from "./useNarration";
import { Spinner } from "./Spinner";
import { useState } from "react";

export function Narration({
  id,
  title,
  className,
  children,
  titleClassName,
  sparkleLink,
  showSparkle = true,
  sparkleText,
  showActions = true,
}: {
  id: string;
  title: string;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
  sparkleLink?: string;
  showSparkle?: boolean;
  sparkleText?: string;
  showActions?: boolean;
}) {
  const { getContent, isLoading } = useNarration();

  const loading = isLoading(id);
  const content = getContent(id);
  const spinner = loading && content.length === 0;

  return (
    <div className={`${className} narration`}>
      {title ? (
        <div className="titlebar">
          <h1 className={titleClassName}>{title}</h1>
          {showSparkle ? <AISparkle sparkleLink={sparkleLink} sparkleText={sparkleText} /> : null}
          {showActions ? (
            <>
              <RegenerateNarration docId={id} />
              <GoodExample docId={id} />
              <BadExample docId={id} />
            </>
          ) : null}
          <Tooltip anchorSelect=".narration-tooltip" place="top"></Tooltip>
        </div>
      ) : null}
      {spinner ? <Spinner /> : content || children}
    </div>
  );
}

export function AISparkle({ sparkleLink = "#", sparkleText }: { sparkleLink?: string; sparkleText?: string }) {
  return (
    <a
      href={sparkleLink}
      className="sparkle narration-tooltip"
      data-tooltip-html={sparkleText}
      data-tooltip-place="bottom"
      data-tooltip-variant="info"
    >
      <SparklesIcon className="sparkle-icon" />
    </a>
  );
}

export function RegenerateNarration({ docId }: { docId: string }) {
  const { regenerateContent } = useNarration();

  return (
    <button
      data-tooltip-content="Regenerate section"
      data-tooltip-variant="info"
      className="narration-tooltip"
      onClick={() => regenerateContent(docId)}
    >
      <ArrowPathIcon />
    </button>
  );
}

export function GoodExample({ docId }: { docId: string }) {
  const { markGoodExample } = useNarration();

  return (
    <SubmitButton
      tooltip="Save as good example"
      tooltipVariant="success"
      action={() => markGoodExample(docId)}
      icon={<HandThumbDownIcon />}
      docId={docId}
    />
  );
}

export function BadExample({ docId }: { docId: string }) {
  const { markBadExample } = useNarration();

  return (
    <SubmitButton
      tooltip="Save as bad example"
      tooltipVariant="warning"
      action={() => markBadExample(docId)}
      icon={<HandThumbDownIcon />}
      docId={docId}
    />
  );
}

export function SubmitButton({
  docId,
  action,
  tooltip,
  tooltipVariant,
  icon,
}: {
  docId: string;
  action: Function;
  tooltip: string;
  tooltipVariant: VariantType;
  icon: React.ReactNode;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState(tooltip);

  function submit(docId: string) {
    setSubmitting(true);
    action(docId);
    setCurrentTooltip("Saved");

    setTimeout(() => {
      setSubmitting(false);
      setCurrentTooltip(tooltip);
    }, 2000);
  }

  return (
    <button
      data-tooltip-content={currentTooltip}
      data-tooltip-variant={tooltipVariant}
      className="narration-tooltip"
      onClick={() => submit(docId)}
    >
      {submitting ? <CheckIcon /> : icon}
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
