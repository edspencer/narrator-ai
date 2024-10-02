import React from "react";
import { NarrationSection } from "./NarrationInner";

export function Narration({
  id,
  title,
  className,
  children,
  titleClassName,
}: {
  id: string;
  title: string;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <NarrationSection id={id} title={title} className={className} titleClassName={titleClassName}>
      {children}
    </NarrationSection>
  );
}
