"use client";

interface MermaidProps {
  chart: string;
  config?: object;
}

export function Mermaid({ chart }: MermaidProps) {
  if (!chart) return null;

  return (
    <pre className="my-8 overflow-x-auto rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted">
      <code>{chart}</code>
    </pre>
  );
}
