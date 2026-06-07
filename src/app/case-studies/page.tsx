import type { Metadata } from "next";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Study - Maksym Mishchenko",
  description:
    "Flagship deep dive into shipped security engineering work, MCP gateway design, and AI-agent governance tradeoffs.",
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <main id="main" className="mx-auto max-w-4xl px-6 py-20">
      <p className="mb-3 font-mono text-sm text-accent">FLAGSHIP CASE STUDY</p>
      <h1 className="mb-4 font-heading text-4xl font-bold">Security engineering work, explained.</h1>
      <p className="mb-10 max-w-2xl text-muted">
        One current flagship deep dive into MCP tool-call security: the risk, the design constraints,
        what shipped, and how the outcome was verified.
      </p>

      <div className="space-y-4">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group block rounded-2xl border border-accent/30 bg-surface p-6 transition-colors hover:border-accent/60"
          >
            <div className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Current flagship
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                <span>{study.project}</span>
                <span aria-hidden="true">/</span>
                <time dateTime={study.date}>
                  {new Date(study.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-2xl font-semibold group-hover:text-accent transition-colors">
                {study.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">{study.summary}</p>
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-accent">Read the flagship case study -&gt;</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface/40 p-5">
        <h2 className="text-lg font-semibold text-foreground">More deep dives will follow when they are worth reading.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          I would rather keep this page focused than pad it with shallow write-ups. The current flagship is the best
          representative sample of my security, backend, and AI-agent governance work.
        </p>
      </div>
    </main>
  );
}
