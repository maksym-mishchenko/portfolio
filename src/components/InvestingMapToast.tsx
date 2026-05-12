"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "itm_toast_shown";

export function InvestingMapToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    const timer = setTimeout(() => dismiss(), 6000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                New Project
              </p>
              <a
                href="https://investing.mmishchenko.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-zinc-300 transition-colors"
                onClick={dismiss}
              >
                🗺️ Investing Treasure Map is live!
              </a>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 mt-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
