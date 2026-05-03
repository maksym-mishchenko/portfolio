"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { ZERO_TRUST_STEPS } from "@/lib/constants";

const SPEEDS = [0.5, 1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function ZeroTrustDemo() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<Speed>(1);
  const reducedMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = ZERO_TRUST_STEPS.length;
  const isComplete = currentStep >= totalSteps - 1;

  const reset = useCallback(() => {
    setCurrentStep(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Main interval loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPlaying) return;

    const delay = 1500 / speed;

    if (isComplete) {
      // Pause on complete, then restart
      const timeout = setTimeout(() => {
        reset();
      }, 2000);
      return () => clearTimeout(timeout);
    }

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) return prev;
        return prev + 1;
      });
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, isComplete, totalSteps, reset]);

  const animDuration = reducedMotion ? 0 : 0.4;

  const activeDescription =
    currentStep >= 0 && currentStep < totalSteps
      ? ZERO_TRUST_STEPS[currentStep].description
      : "Waiting to start…";

  return (
    <div>
      <h3 className="font-mono text-lg font-semibold text-[#fafafa] mb-4">
        Zero Trust Pipeline
      </h3>

      <motion.div
        className="bg-[#18181b] rounded-xl border border-[#27272a] p-6 md:p-8 overflow-hidden"
        animate={
          isComplete
            ? {
                boxShadow: [
                  "0 0 0px rgba(34,197,94,0)",
                  "0 0 24px rgba(34,197,94,0.25)",
                  "0 0 0px rgba(34,197,94,0)",
                ],
              }
            : { boxShadow: "0 0 0px rgba(34,197,94,0)" }
        }
        transition={
          isComplete
            ? { duration: reducedMotion ? 0 : 1.6, repeat: Infinity }
            : { duration: 0 }
        }
      >
        {/* Pipeline */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 mb-6">
          {ZERO_TRUST_STEPS.map((step, i) => {
            const isVisible = i <= currentStep;
            const isActive = i === currentStep;
            const isDone = i < currentStep || (i === currentStep && isComplete);

            return (
              <div
                key={step.id}
                className="flex items-center flex-col md:flex-row"
              >
                {/* Arrow (before each step except first) */}
                {i > 0 && (
                  <div className="hidden md:flex items-center w-6 lg:w-8 shrink-0">
                    {isVisible && (
                      <motion.div
                        className="h-px w-full bg-[#3f3f46]"
                        initial={
                          reducedMotion
                            ? { scaleX: 1 }
                            : { scaleX: 0 }
                        }
                        animate={{ scaleX: 1 }}
                        transition={{ duration: animDuration, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      />
                    )}
                  </div>
                )}
                {/* Vertical arrow for mobile */}
                {i > 0 && (
                  <div className="flex md:hidden items-center justify-center h-4 shrink-0">
                    {isVisible && (
                      <motion.div
                        className="w-px h-full bg-[#3f3f46]"
                        initial={
                          reducedMotion
                            ? { scaleY: 1 }
                            : { scaleY: 0 }
                        }
                        animate={{ scaleY: 1 }}
                        transition={{ duration: animDuration, ease: "easeOut" }}
                        style={{ originY: 0 }}
                      />
                    )}
                  </div>
                )}

                {/* Step node */}
                {isVisible ? (
                  <motion.div
                    className={`
                      relative flex items-center gap-2 px-3 py-2 rounded-lg
                      bg-[#0a0a0a] border text-sm shrink-0 transition-colors
                      ${isActive && !isComplete ? "border-[#3b82f6]" : ""}
                      ${isDone ? "border-[#22c55e]" : ""}
                      ${!isActive && !isDone ? "border-[#27272a]" : ""}
                    `}
                    initial={
                      reducedMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: animDuration, ease: "easeOut" }}
                  >
                    <span className="text-base" role="img" aria-hidden>
                      {step.icon}
                    </span>
                    <span className="text-[#a1a1aa] text-xs font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                    {/* Checkmark */}
                    {isDone && (
                      <motion.span
                        className="text-[#22c55e] text-xs font-bold ml-0.5"
                        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: animDuration * 0.5 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#27272a] opacity-20 text-sm shrink-0">
                    <span className="text-base">{step.icon}</span>
                    <span className="text-[#a1a1aa] text-xs font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#27272a] pt-4">
          <p className="text-xs text-[#71717a] min-h-[1.25rem] order-2 sm:order-1">
            {activeDescription}
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={toggle}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] transition-colors"
              aria-label={isPlaying ? "Pause pipeline" : "Play pipeline"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <div className="flex items-center gap-1 ml-2">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`
                    px-2 py-1 rounded text-xs font-mono transition-colors
                    ${
                      speed === s
                        ? "bg-[#3b82f6] text-white"
                        : "bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46]"
                    }
                  `}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
