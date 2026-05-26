"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  config?: object;
}

// Initialize mermaid once
let mermaidInitialized = false;

export function Mermaid({ chart, config = {} }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default", // Will be overridden by CSS custom properties
        themeVariables: {
          primaryColor: "var(--color-accent)",
          primaryTextColor: "var(--color-foreground)",
          primaryBorderColor: "var(--color-border)",
          lineColor: "var(--color-border)",
          secondaryColor: "var(--color-surface)",
          tertiaryColor: "var(--color-muted)",
        },
        ...config,
      });
      mermaidInitialized = true;
    }
  }, [config]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render diagram");
        console.error("Mermaid render error:", err);
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="my-8 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-sm text-red-500">
        <strong>Mermaid Error:</strong> {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-8 flex items-center justify-center rounded-xl border border-border bg-surface/50 p-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
