"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AsideProps {
  title: string;
  children: React.ReactNode;
}

export function Aside({ title, children }: AsideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-border bg-surface/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-surface/50 transition-colors"
      >
        <span className="text-sm font-medium text-muted">
          Aside: {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-muted"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
