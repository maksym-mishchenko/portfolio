"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Now", href: "/now" },
  { label: "Resume", href: "/resume" },
  { label: "Uses", href: "/uses" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Homepage has its own StickyNav — don't double up
  if (pathname === "/") return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 print:hidden">
      <nav
        className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-surface/90 px-3 py-1.5 shadow-lg backdrop-blur-md"
        aria-label="Site navigation"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-mono text-accent transition-colors hover:bg-background hover:text-foreground"
        >
          mm.dev
        </Link>
        <span className="w-px h-4 bg-border" aria-hidden="true" />
        {LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors ${
              isActive(href)
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
