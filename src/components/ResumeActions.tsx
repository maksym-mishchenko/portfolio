"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export function ResumeActions() {
  return (
    <div className="flex gap-3 print:hidden mb-8">
      <button
        onClick={() => {
          track("resume_download");
          window.print();
        }}
        className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
      >
        Download PDF
      </button>
      <Link
        href="/"
        className="border border-border hover:border-accent text-muted hover:text-foreground px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
      >
        ← Back to site
      </Link>
    </div>
  );
}
