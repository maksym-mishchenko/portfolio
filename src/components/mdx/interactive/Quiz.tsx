"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface QuizProps {
  question: string;
  options: string; // JSON array of strings
  answer: string; // correct answer text
  explanation?: string;
}

export function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  // Guard: options may be undefined during SSR prerendering
  const parsedOptions: string[] = options ? JSON.parse(options) : [];

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
  };

  if (!parsedOptions.length) return null;

  return (
    <div className="my-6 rounded-xl border border-border bg-surface/30 p-5">
      <p className="text-sm font-medium text-accent mb-1">🧠 Quick Check</p>
      <p className="font-medium mb-4">{question}</p>
      <div className="space-y-2">
        {parsedOptions.map((option) => {
          const isCorrect = option === answer;
          const isSelected = option === selected;
          let borderColor = "border-border";
          if (revealed && isCorrect) borderColor = "border-green-500 bg-green-500/10";
          else if (revealed && isSelected && !isCorrect) borderColor = "border-red-500 bg-red-500/10";

          return (
            <motion.button
              key={option}
              onClick={() => handleSelect(option)}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left px-4 py-2.5 rounded-lg border ${borderColor} transition-colors text-sm ${
                !revealed ? "hover:bg-surface/50 cursor-pointer" : "cursor-default"
              }`}
            >
              {option}
              {revealed && isCorrect && " ✓"}
              {revealed && isSelected && !isCorrect && " ✗"}
            </motion.button>
          );
        })}
      </div>
      {revealed && explanation && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-muted italic"
        >
          {explanation}
        </motion.p>
      )}
    </div>
  );
}