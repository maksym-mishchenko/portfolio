"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TokenizerProps {
  text: string;
  tokens: string;
  tokenIds: string;
  speed?: number;
}

export function Tokenizer({ text, tokens: tokensStr, tokenIds: idsStr, speed = 1 }: TokenizerProps) {
  // Guard: props may be undefined during SSR prerendering
  const tokens: string[] = tokensStr ? JSON.parse(tokensStr) : [];
  const tokenIds: number[] = idsStr ? JSON.parse(idsStr) : [];
  const [step, setStep] = useState(0); // 0=text, 1=tokens, 2=ids
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState(speed);

  useEffect(() => {
    if (!isPlaying) return;
    const ms = 1500 / activeSpeed;
    const timer = setTimeout(() => {
      if (step < 2) setStep((s) => s + 1);
      else setIsPlaying(false);
    }, ms);
    return () => clearTimeout(timer);
  }, [isPlaying, step, activeSpeed]);

  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const play = () => {
    if (step >= 2) setStep(0);
    setIsPlaying(true);
  };

  if (!tokens.length) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-surface/50 p-6 overflow-hidden">
      <div className="flex items-center justify-center min-h-[120px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-sm text-muted mb-2">Original Text</p>
              <p className="text-2xl font-semibold">{text}</p>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {tokens.map((token, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="px-4 py-2 rounded-lg border border-accent/40 bg-accent/5 font-mono text-lg">
                      {token}
                    </div>
                    {step >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 + 0.3 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-muted text-sm">↓</span>
                        <span className="text-accent font-mono font-bold">
                          {tokenIds[i]}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span className="text-xs text-muted">
          {step === 0 ? "Original Text" : step === 1 ? "Tokenized" : "Token IDs"}
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
            onClick={reset}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface border border-border hover:border-accent/50 transition-colors text-xs"
            aria-label="Reset"
          >
            ↺
          </button>
          {[0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => setActiveSpeed(s)}
              className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                activeSpeed === s
                  ? "bg-accent text-white border-accent"
                  : "bg-surface border-border text-muted hover:border-accent/50"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}