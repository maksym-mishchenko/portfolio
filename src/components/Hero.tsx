"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { TerminalTyping } from "./TerminalTyping";

export function Hero() {
  const [typingDone, setTypingDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
      <h1 className="sr-only">Maksym Mishchenko — Software Engineer II at Microsoft Security</h1>
      {/* Terminal card */}
      <div className="max-w-2xl w-full mx-auto bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#18181b] border-b border-[#27272a]">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="ml-2 text-xs text-[#71717a] font-mono">
            terminal
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-6 min-h-[200px]">
          <TerminalTyping onComplete={() => setTypingDone(true)} />
        </div>
      </div>

      {/* CTA buttons */}
      {typingDone && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-3 mt-8"
        >
          <button
            onClick={() => {
              track("cta_click", { label: "projects" });
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            }}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Projects ↓
          </button>
          <Link
            href="/blog"
            onClick={() => track("cta_click", { label: "blog" })}
            className="border border-[#27272a] hover:border-[#3b82f6] text-[#a1a1aa] hover:text-[#fafafa] px-5 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Blog →
          </Link>
          <a
            href="https://github.com/maksym-mishchenko"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_click", { label: "github" })}
            className="border border-[#27272a] hover:border-[#3b82f6] text-[#a1a1aa] hover:text-[#fafafa] px-5 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            GitHub →
          </a>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-[#71717a]" />
      </motion.div>
    </section>
  );
}
