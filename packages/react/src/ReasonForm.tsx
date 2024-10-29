"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { useNarration } from "./useNarration";

export type Verdict = "good" | "bad";

/**
 * ReasonForm component renders a form that allows users to provide a reason for a given verdict.
 * The form can be shown or hidden based on the `visible` prop and can be closed by clicking outside
 * the form or pressing the Escape key.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.docId - The document ID associated with the form.
 * @param {Verdict | null} props.verdict - The verdict for which the reason is being provided.
 * @param {() => void} props.onClose - The function to call when the form is closed.
 * @param {boolean} props.visible - A boolean indicating whether the form is visible or not.
 *
 * @returns {JSX.Element} The rendered ReasonForm component.
 */
export function ReasonForm({
  docId,
  verdict,
  onClose,
  visible,
}: {
  docId: string;
  verdict: Verdict | null;
  onClose: () => void;
  visible: boolean;
}) {
  const { saveExample } = useNarration();
  const [reason, setReason] = useState("");
  const [saved, setSaved] = useState<boolean | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const className = `reason-popup ${visible ? "visible" : ""}`;

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleBodyClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement && !formRef.current?.contains(event.target)) {
      onClose();
    }
  };

  // Close form when body is clicked
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleBodyClick);
      return () => document.removeEventListener("click", handleBodyClick);
    }
  }, [onClose]);

  // Close form when escape key is pressed
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [onClose]);

  // Focus on the input field when the form is shown
  useEffect(() => {
    if (visible) {
      formRef.current?.querySelector("input")?.focus();
    }
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (reason && verdict && saveExample) {
      const success = await saveExample({ docId, verdict, reason });

      if (success) {
        setSaved(true);
        setReason("");
        setTimeout(() => {
          setSaved(null);
          onClose();
        }, 1000);
      }
    }

    return false;
  };

  if (saved) {
    return (
      <div className={`${className} saved`}>
        <CheckIcon className="success" />
        Saved
      </div>
    );
  }

  return (
    <form ref={formRef} className={className} onSubmit={handleSubmit}>
      <input
        type="text"
        autoFocus
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="(Optional) Reason"
      />
      <button type="submit">
        <CheckIcon />
      </button>
    </form>
  );
}
