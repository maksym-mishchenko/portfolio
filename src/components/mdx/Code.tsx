"use client";

import { highlight } from "sugar-high";

interface CodeProps {
  children: string;
  className?: string;
}

export function Code({ children, className }: CodeProps) {
  const isInline = !className;

  if (isInline) {
    return (
      <code className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-accent">
        {children}
      </code>
    );
  }

  // Fenced block with a language — render highlighted code (pre wraps us in index.tsx)
  const html = highlight(children);
  return (
    <code
      className="whitespace-pre font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
