"use client";

import { ReactElement, PropsWithChildren } from "react";

import { VariantType } from "react-tooltip";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon, HandThumbUpIcon, HandThumbDownIcon, CheckIcon } from "@heroicons/react/24/outline";

import { useNarration } from "./useNarration";
import { Spinner } from "./Spinner";
import { useState } from "react";
import { Verdict, ReasonForm } from "./ReasonForm";

/**
 * Props for the {@link Narration} component.
 */
export interface NarrationProps {
  /** The unique identifier for the narration. */
  id: string;

  /** The title of the narration. */
  title: string;

  /** Optional children elements to be rendered within the narration. */
  children?: React.ReactNode;

  /** Optional additional class names for the narration container. */
  className?: string;

  /** Optional additional class names for the title element. */
  titleClassName?: string;

  /** Optional link for the sparkle element. */
  sparkleLink?: string;

  /** Flag to show or hide the sparkle element. */
  showSparkle?: boolean;

  /** Optional text for the sparkle element. */
  sparkleText?: string;

  /** Flag to show or hide the action buttons. */
  showActions?: boolean;

  /** The HTML tag to use for the title element. */
  titleTag?: keyof JSX.IntrinsicElements;
}

/**
 * The `Narration` component is responsible for rendering a narration section with various interactive elements.
 * It displays a title, optional sparkle link, and action buttons for regenerating narration and providing feedback.
 *
 * The actual content of the Narration should be provided as a child element. See the intro docs for more information
 * on how to generate Narration content and examples of how to retrieve it for display.
 *
 * Simple usage:
 * ```tsx
 * const NarrationPage = () => {
 *   return (
 *     <Narration id="narration-id" title="Narration Title">
 *       <p>This is the content of the narration.</p>
 *     </Narration>
 *   );
 * }
 * ```
 *
 * With sparkle link and actions:
 * ```tsx
 * const NarrationPage = () => {
 *   return (
 *     <Narration
 *       id="narration-id"
 *       title="Narration Title"
 *       sparkleLink="https://example.com"
 *       sparkleText="Learn more"
 *       showActions={true}
 *     >
 *         <p>This is the content of the narration.</p>
 *     </Narration>
 *   );
 * }
 * ```
 *
 * @category Component
 */
export function Narration(props: PropsWithChildren<NarrationProps>): ReactElement {
  const {
    id,
    title,
    className,
    children,
    titleClassName,
    sparkleLink,
    showSparkle = true,
    sparkleText,
    showActions = false,
    titleTag: TitleTag = "h1",
  } = props;

  const { getContent, isLoading } = useNarration();

  const loading = isLoading(id);
  const content = getContent(id);
  const spinner = loading && content.length === 0;

  const [showReasonForm, setShowReasonForm] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  function verdictGiven(verdict: Verdict) {
    setVerdict(verdict);
    setShowReasonForm(true);
  }

  return (
    <div className={`${className} narration`}>
      {title ? (
        <div className="titlebar">
          <TitleTag className={titleClassName}>{title}</TitleTag>
          {showSparkle ? <AISparkle sparkleLink={sparkleLink} sparkleText={sparkleText} /> : null}
          {showActions ? (
            <>
              <RegenerateNarration docId={id} />
              <GoodExample docId={id} onSubmit={() => verdictGiven("good")} />
              <BadExample docId={id} onSubmit={() => verdictGiven("bad")} />
              <ReasonForm
                verdict={verdict}
                docId={id}
                visible={showReasonForm}
                onClose={() => setShowReasonForm(false)}
              />
            </>
          ) : null}
        </div>
      ) : null}
      {spinner ? <Spinner /> : content || children}
    </div>
  );
}

/**
 * AISparkle component renders a link with a sparkle icon and tooltip.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.sparkleLink="#"] - The URL for the link. Defaults to "#".
 * @param {string} [props.sparkleText] - The text to be displayed in the tooltip.
 * @returns {JSX.Element} The rendered AISparkle component.
 */
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

/**
 * RegenerateNarration component renders a button that triggers the regeneration of content for a given document.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.docId - The ID of the document to regenerate content for.
 *
 * @returns {JSX.Element} A button element that, when clicked, calls the regenerateContent function with the provided docId.
 */
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

/**
 * A component that renders a submit button for saving a document as a good example.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.docId - The ID of the document to be saved as a good example.
 * @param {Function} [props.onSubmit] - Optional callback function to be called upon submission.
 *
 * @returns {JSX.Element} The rendered submit button component.
 */
export function GoodExample({ docId, onSubmit }: { docId: string; onSubmit?: Function }) {
  const { saveExample } = useNarration();

  return (
    <SubmitButton
      tooltip="Save as good example"
      action={() => saveExample && saveExample({ docId, verdict: "good" })}
      onSubmit={onSubmit}
      icon={<HandThumbUpIcon />}
      docId={docId}
    />
  );
}

/**
 * Component that renders a button to save a document as a bad example.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.docId - The ID of the document to be saved as a bad example.
 * @param {Function} [props.onSubmit] - Optional callback function to be called on submit.
 *
 * @returns {JSX.Element} The rendered SubmitButton component.
 */
export function BadExample({ docId, onSubmit }: { docId: string; onSubmit?: Function }) {
  const { saveExample } = useNarration();

  return (
    <SubmitButton
      tooltip="Save as bad example"
      action={() => saveExample && saveExample({ docId, verdict: "bad" })}
      onSubmit={onSubmit}
      icon={<HandThumbDownIcon />}
      docId={docId}
    />
  );
}

/**
 * SubmitButton component renders a button that triggers a submission action.
 * It displays a tooltip and an icon, and handles the submission state.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.docId - The document ID to be submitted.
 * @param {Function} props.action - The action function to be called on submission.
 * @param {Function} [props.onSubmit] - Optional callback function to be called after submission.
 * @param {string} props.tooltip - The tooltip text to be displayed.
 * @param {React.ReactNode} props.icon - The icon to be displayed on the button.
 *
 * @returns {JSX.Element} The rendered SubmitButton component.
 */
export function SubmitButton({
  docId,
  action,
  onSubmit,
  tooltip,
  icon,
}: {
  docId: string;
  action: Function;
  onSubmit?: Function;
  tooltip: string;
  icon: React.ReactNode;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState(tooltip);
  const [tooltipVariant, setTooltipVariant] = useState<VariantType>("info");

  function submit(docId: string) {
    setSubmitting(true);
    action(docId);
    setCurrentTooltip("Saved");
    setTooltipVariant("success");

    if (onSubmit) {
      onSubmit();
    }

    setTimeout(() => {
      setSubmitting(false);
      setCurrentTooltip(tooltip);
      setTooltipVariant("info");
    }, 2000);
  }

  return (
    <button
      data-tooltip-content={currentTooltip}
      data-tooltip-variant={tooltipVariant}
      className="narration-tooltip"
      onClick={() => submit(docId)}
    >
      {submitting ? <CheckIcon className={tooltipVariant} /> : icon}
    </button>
  );
}
