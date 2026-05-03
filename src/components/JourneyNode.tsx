"use client";

import { motion } from "framer-motion";

interface JourneyNodeProps {
  year: string;
  icon: string;
  title: string;
  detail: string;
  index: number;
  isLast: boolean;
}

export function JourneyNode({
  year,
  icon,
  title,
  detail,
  index,
  isLast,
}: JourneyNodeProps) {
  return (
    <motion.div
      className="relative flex items-start gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Year */}
      <span className="w-24 shrink-0 pt-2.5 text-right font-mono text-sm text-[#a1a1aa] max-md:hidden">
        {year}
      </span>

      {/* Circle + Line */}
      <div className="relative flex flex-col items-center">
        <div
          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#18181b] text-xl ${
            isLast ? "border-[#3b82f6]" : "border-[#27272a]"
          }`}
        >
          {icon}

          {isLast && (
            <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#3b82f6] opacity-30" />
          )}
        </div>

        {!isLast && (
          <div className="h-16 w-px bg-[#27272a]" />
        )}
      </div>

      {/* Content */}
      <div className="pt-2.5">
        <span className="mb-1 block font-mono text-sm text-[#a1a1aa] md:hidden">
          {year}
        </span>
        <p className="font-semibold text-[#fafafa]">{title}</p>
        <p className="text-sm text-[#a1a1aa]">{detail}</p>
      </div>
    </motion.div>
  );
}
