"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];

export function SiteHeader() {
  const pathname = usePathname();

  // Homepage has its own StickyNav — don't double up
  if (pathname === "/") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 print:hidden">
      <nav
        className="flex items-center gap-1 rounded-full border border-border bg-surface/90 backdrop-blur-md px-3 py-1.5 shadow-lg overflow-x-auto"
        aria-label="Site navigation"
      >
        <Link
          href="/"
          className="px-3 py-1 text-sm font-mono text-accent hover:text-foreground rounded-full hover:bg-background transition-colors mr-1 whitespace-nowrap"
        >
          mm.dev
        </Link>
        <span className="w-px h-4 bg-border" aria-hidden="true" />
        {LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
              pathname.startsWith(href)
                ? "text-foreground bg-background"
                : "text-muted hover:text-foreground hover:bg-background"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
