"use client";

import React from "react";

import { SparklesIcon } from "@heroicons/react/24/solid";

import { ActionsBar } from "./NarrationActions";
import { useNarration } from "./Context";
import { Spinner } from "./Spinner";

export function AISparkle() {
  return (
    <a href="/about/ai" className="sparkle">
      <SparklesIcon className="sparkle-icon" />
    </a>
  );
}

export function NarrationSection({
  id,
  className,
  title,
  titleClassName,
  children,
}: {
  id: string;
  className?: string;
  title?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  const { getContent, isLoading } = useNarration();

  const loading = isLoading(id);
  const content = getContent(id);
  const spinner = loading && content.length === 0;

  return (
    <div className={`${className} narration`}>
      {title ? <NarrationTitleBar title={title} titleClassName={titleClassName} docId={id} /> : null}
      {spinner ? <Spinner /> : content || children}
    </div>
  );
}

export function NarrationTitleBar({
  title,
  titleClassName,
  docId,
}: {
  title: string;
  titleClassName?: string;
  docId: string;
}) {
  return (
    <div className="titlebar">
      <h1 className={titleClassName}>{title}</h1>
      <AISparkle />
      <ActionsBar docId={docId} />
    </div>
  );
}
