"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Word {
  label: string;
  x: number;
  y: number;
  group?: string;
}

interface EmbeddingSpaceProps {
  words: string;
  connections?: string;
  width?: number;
  height?: number;
}

const GROUP_COLORS: Record<string, string> = {
  royalty: "#818cf8",
  gender: "#34d399",
  default: "#94a3b8",
};

export function EmbeddingSpace({
  words: wordsStr,
  connections,
  width = 400,
  height = 300,
}: EmbeddingSpaceProps) {
  // Guard: wordsStr may be undefined during SSR prerendering
  const words: Word[] = wordsStr ? JSON.parse(wordsStr) : [];
  const parsedConnections: [string, string][] = connections
    ? JSON.parse(connections)
    : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(Math.min(w / width, 1));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  if (!words.length) return null;

  const wordMap = Object.fromEntries(words.map((w) => [w.label, w]));

  return (
    <div className="my-8 rounded-xl border border-border bg-surface/50 p-6 overflow-hidden">
      <div ref={containerRef} className="flex justify-center">
        <svg
          width={width * scale}
          height={height * scale}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Connection lines */}
          {parsedConnections.map(([from, to], i) => {
            const a = wordMap[from];
            const b = wordMap[to];
            if (!a || !b) return null;
            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--color-accent)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Word dots + labels */}
          {words.map((word, i) => {
            const color = GROUP_COLORS[word.group ?? "default"] ?? GROUP_COLORS.default;
            return (
              <motion.g
                key={word.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
              >
                <circle cx={word.x} cy={word.y} r={5} fill={color} />
                <text
                  x={word.x}
                  y={word.y - 10}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={12}
                  fontFamily="var(--font-mono)"
                  className="text-foreground"
                >
                  {word.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-muted text-center mt-3">
        Words become vectors in high-dimensional space
      </p>
    </div>
  );
}