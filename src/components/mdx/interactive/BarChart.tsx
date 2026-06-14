"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdxJsonError, isRecord, parseMdxJsonProp } from "./mdx-json";

interface Bar {
  label: string;
  value: number;   // 0–100 (percentage or absolute — display as-is)
  suffix?: string; // e.g. "%" or "×"
  color?: string;  // "red" | "orange" | "yellow" | "green" | "blue" | "gray"
}

interface BarChartProps {
  bars: string;      // JSON: Bar[]
  title?: string;
  caption?: string;
}

const COLOR_MAP: Record<string, string> = {
  red:    "bg-red-500",
  orange: "bg-orange-400",
  yellow: "bg-yellow-400",
  green:  "bg-emerald-400",
  blue:   "bg-blue-500",
  gray:   "bg-zinc-500",
};

const LABEL_MAP: Record<string, string> = {
  red:    "text-red-400",
  orange: "text-orange-400",
  yellow: "text-yellow-400",
  green:  "text-emerald-400",
  blue:   "text-blue-400",
  gray:   "text-zinc-400",
};

function isBarArray(value: unknown): value is Bar[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.label === "string" &&
        typeof item.value === "number" &&
        (item.suffix === undefined || typeof item.suffix === "string") &&
        (item.color === undefined || typeof item.color === "string")
    )
  );
}

export function BarChart({ bars: barsStr, title, caption }: BarChartProps) {
  const barsResult = parseMdxJsonProp(barsStr, "bars", isBarArray);
  const parsed = barsResult.value ?? [];
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parsed.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [parsed.length]);

  if (barsResult.error) return <MdxJsonError component="BarChart" error={barsResult.error} />;
  if (!parsed.length) return null;

  const max = Math.max(...parsed.map((b) => b.value));

  return (
    <div ref={ref} className="my-8 rounded-xl border border-border bg-surface/50 p-5 sm:p-6">
      {title && (
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">{title}</p>
      )}
      <div className="space-y-4">
        {parsed.map((bar, i) => {
          const pct = max > 0 ? (bar.value / max) * 100 : 0;
          const colorBar = COLOR_MAP[bar.color ?? "blue"] ?? COLOR_MAP.blue;
          const colorLabel = LABEL_MAP[bar.color ?? "blue"] ?? LABEL_MAP.blue;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground">{bar.label}</span>
                <span className={`text-sm font-mono font-semibold tabular-nums ${colorLabel}`}>
                  {bar.value}{bar.suffix ?? "%"}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-border overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${colorBar}`}
                  initial={{ width: 0 }}
                  animate={{ width: visible ? `${pct}%` : 0 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {caption && (
        <p className="text-xs text-muted mt-5 border-t border-border pt-4">{caption}</p>
      )}
    </div>
  );
}
