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
    <div className="my-8 rounded-xl border border-border bg-surface/50 p-4 sm:p-6">
      {/* Vertical layout — each step is a full-width row */}
      <div className="flex flex-col items-stretch gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              animate={{
                borderColor:
                  activeStep === i
                    ? "var(--color-accent)"
                    : activeStep > i
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                backgroundColor:
                  activeStep === i ? "var(--color-accent)" : "transparent",
              }}
              transition={{ duration: 0.3 }}
              className="w-full px-4 py-3 rounded-lg border-2 text-center"
            >
              <span
                className={`text-sm font-medium ${
                  activeStep === i ? "text-white" : "text-foreground"
                }`}
              >
                {step.label}
              </span>
              {step.description && activeStep === i && (
                <motion.p
                  key={activeStep}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-white/80 mt-1"
                >
                  {step.description}
                </motion.p>
              )}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                animate={{
                  color:
                    activeStep > i
                      ? "var(--color-accent)"
                      : "var(--color-muted)",
                }}
                className="text-lg my-1"
              >
                ↓
              </motion.span>
            )}
          </div>
        ))}
      </div>

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
