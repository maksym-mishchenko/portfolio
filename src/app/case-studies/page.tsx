import type { Metadata } from "next";
import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies - Maksym Mishchenko",
  description:
    "Deep dives into shipped engineering work, security tradeoffs, architecture decisions, and release outcomes.",
};

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-sm font-mono text-accent mb-3">CASE STUDIES</p>
      <h1 className="text-4xl font-bold font-heading mb-4">Engineering work, explained.</h1>
      <p className="text-muted mb-10">
        Focused breakdowns of problems I shipped: what risk existed, what constraints mattered,
        what changed, and how the outcome was verified.
      </p>

      <div className="space-y-4">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/case-studies/${study.slug}`}
            className="group block rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
          >
            <div className="flex flex-col gap-3">
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
              <p className="text-sm text-accent">Read case study -&gt;</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
