"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FlowStep {
  label: string;
  description?: string;
}

interface FlowDiagramProps {
  steps: string;
  speed?: number;
  loop?: boolean;
}

export function FlowDiagram({ steps: stepsStr, speed = 1, loop = false }: FlowDiagramProps) {
  // Guard: stepsStr may be undefined during SSR prerendering
  const steps: FlowStep[] = stepsStr ? JSON.parse(stepsStr) : [];
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const ms = 1200 / speed;
    const timer = setTimeout(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length - 1) {
          if (loop) return 0;
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, ms);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, speed, steps.length, loop]);

  const play = () => {
    if (activeStep >= steps.length - 1) setActiveStep(-1);
    setIsPlaying(true);
  };

  if (!steps.length) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-surface/50 p-6">
      {/* Flow steps */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.05 : 1,
                borderColor: activeStep === i ? "var(--color-accent)" : activeStep > i ? "var(--color-accent)" : "var(--color-border)",
                backgroundColor: activeStep === i ? "var(--color-accent)" : "transparent",
              }}
              transition={{ duration: 0.3 }}
              className="px-4 py-3 rounded-lg border-2 text-center min-w-[100px]"
            >
              <span
                className={`text-sm font-medium ${
                  activeStep === i ? "text-white" : "text-foreground"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                animate={{
                  color: activeStep > i ? "var(--color-accent)" : "var(--color-muted)",
                }}
                className="mx-1 text-lg"
              >
                →
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Active step description */}
      {activeStep >= 0 && steps[activeStep]?.description && (
        <motion.p
          key={activeStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted text-center mt-4"
        >
          {steps[activeStep].description}
        </motion.p>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted">
          {activeStep >= 0
            ? `Step ${activeStep + 1} / ${steps.length}`
            : "Ready"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : play}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border hover:border-accent/50 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={() => { setActiveStep(-1); setIsPlaying(false); }}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border hover:border-accent/50 transition-colors text-xs"
            aria-label="Reset"
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
}