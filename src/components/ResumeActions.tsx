"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export function ResumeActions() {
  function handlePrintResume() {
    window.print();

    try {
      track("resume_download");
    } catch (error) {
      console.warn("Resume download analytics failed", error);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden mb-8">
      <Link
        href="/resume.pdf"
        download
        className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
      >
        Download PDF
      </Link>
      <button
        type="button"
        onClick={handlePrintResume}
        className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        Print / Save PDF
      </button>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        ← Back to site
      </Link>
    </div>
  );
}
