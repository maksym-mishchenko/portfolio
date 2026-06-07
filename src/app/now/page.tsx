import type { Metadata } from "next";
import Link from "next/link";
import { SITE, NOW, NOW_LAST_UPDATED } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Now — Maksym Mishchenko",
  description: "What I'm currently focused on.",
};

export default function NowPage() {
  return (
    <main id="main" className="max-w-2xl mx-auto px-6 py-20">
      <Link
        href="/"
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        ← Back home
      </Link>

      <h1 className="text-3xl font-bold mt-8 mb-2">Now</h1>
      <p className="text-muted text-sm mb-10">
        What I&apos;m currently focused on.{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          What is a /now page?
        </a>
      </p>

      <ul className="space-y-4">
        {NOW.map((item) => (
          <li key={item.text} className="flex gap-3 items-start">
            <span className="text-lg shrink-0" role="img" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="text-foreground leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted mt-16 border-t border-border pt-6">
        Last updated: {NOW_LAST_UPDATED} ·{" "}
        <a href={SITE.github} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
          View source
        </a>
      </p>
    </main>
  );
}
