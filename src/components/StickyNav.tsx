"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Stack", href: "#stack" },
  { label: "Intro", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="sticky-nav"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3"
          aria-label="Site navigation"
        >
          <div className="flex max-w-full items-center overflow-hidden rounded-full border border-border bg-surface/90 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-1 overflow-x-auto snap-x px-3 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV_LINKS.map(({ label, href }) =>
                href.startsWith("#") ? (
                  <a
                    key={href}
                    href={href}
                    className="hidden min-h-11 snap-start items-center whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground sm:inline-flex"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex min-h-11 snap-start items-center whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
