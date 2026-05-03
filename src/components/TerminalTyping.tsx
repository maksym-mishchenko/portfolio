"use client";

import { useState, useEffect, useCallback } from "react";

const lines = [
  { prompt: "> whoami", response: "  Maksym Mishchenko" },
  { prompt: "> title", response: "  Software Engineer @ Microsoft" },
  {
    prompt: "> cat interests.txt",
    response: "  Security · Full-Stack · AI Automation",
  },
];

const CHAR_DELAY = 40;
const LINE_PAUSE = 500;

export function TerminalTyping({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      setCompletedLines(lines.map((_, i) => i));
      setDone(true);
      onComplete?.();
    }
  }, [onComplete]);

  const advance = useCallback(() => {
    if (reducedMotion || done) return;

    const line = lines[currentLine];
    if (!line) return;

    if (!showResponse) {
      if (charIndex < line.prompt.length) {
        setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY);
      } else {
        setShowResponse(true);
      }
    } else {
      setTimeout(() => {
        setCompletedLines((prev) => [...prev, currentLine]);
        const next = currentLine + 1;
        if (next < lines.length) {
          setCurrentLine(next);
          setCharIndex(0);
          setShowResponse(false);
        } else {
          setDone(true);
          onComplete?.();
        }
      }, LINE_PAUSE);
    }
  }, [reducedMotion, done, currentLine, charIndex, showResponse, onComplete]);

  useEffect(() => {
    advance();
  }, [advance]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        const isCompleted = completedLines.includes(i);
        const isCurrent = i === currentLine && !done;

        if (!isCompleted && !isCurrent) return null;

        return (
          <div key={i} className="mb-1">
            <div>
              <span className="text-[#3b82f6]">
                {isCompleted ? line.prompt : line.prompt.slice(0, charIndex)}
              </span>
              {isCurrent && !showResponse && (
                <span className="inline-block w-2 h-5 bg-[#3b82f6] ml-1 align-middle animate-terminal-blink" />
              )}
            </div>
            {(isCompleted || showResponse) && (
              <div className="text-[#fafafa]">{line.response}</div>
            )}
          </div>
        );
      })}
      {done && (
        <span className="inline-block w-2 h-5 bg-[#3b82f6] ml-1 align-middle animate-terminal-blink" />
      )}

      <style jsx>{`
        @keyframes terminal-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-terminal-blink {
          animation: terminal-blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
