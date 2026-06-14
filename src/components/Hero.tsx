"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { TerminalTyping } from "./TerminalTyping";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl lg:text-6xl">
          Maksym Mishchenko
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#a1a1aa] sm:text-xl">
          Software engineer at Microsoft Security, building AI-agent automation on the side.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/resume"
          onClick={() => track("cta_click", { label: "resume" })}
          className="rounded-lg bg-[#3b82f6] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563eb] sm:text-base"
        >
          Resume →
        </Link>
        <button
          onClick={() => {
            track("cta_click", { label: "projects" });
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
          }}
          className="rounded-lg border border-[#27272a] px-5 py-3 text-sm font-medium text-[#a1a1aa] transition-colors hover:border-[#3b82f6] hover:text-[#fafafa] sm:text-base"
        >
          Projects ↓
        </button>
        <Link
          href="/blog"
          onClick={() => track("cta_click", { label: "blog" })}
          className="rounded-lg border border-[#27272a] px-5 py-3 text-sm font-medium text-[#a1a1aa] transition-colors hover:border-[#3b82f6] hover:text-[#fafafa] sm:text-base"
        >
          Blog →
        </Link>
        <a
          href="https://github.com/maksym-mishchenko"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("cta_click", { label: "github" })}
          className="rounded-lg border border-[#27272a] px-5 py-3 text-sm font-medium text-[#a1a1aa] transition-colors hover:border-[#3b82f6] hover:text-[#fafafa] sm:text-base"
        >
          GitHub →
        </a>
      </div>

      {/* Terminal card */}
      <div className="mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b] text-left">
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
          <TerminalTyping />
        </div>
      </div>

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
