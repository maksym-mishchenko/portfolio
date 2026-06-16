import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { getShareKitBySlug } from "@/lib/case-study-share-kits";
import { extractSecondLevelHeadings, slugifyHeading } from "@/lib/mdx-headings";
import { safeJsonLd, techArticleSchema } from "@/lib/jsonld";

interface CaseStudyDetailProps {
  slug: string;
}

export function getCaseStudyDetailMetadata(slug: string): Metadata {
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: `${study.title} - Maksym Mishchenko`,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: study.title,
      description: study.summary,
      url: `/case-studies/${study.slug}`,
      type: "article",
      publishedTime: study.date,
      tags: study.tags,
    },
  };
}

function renderInlineText(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-surface px-1.5 py-0.5 text-sm text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function CaseStudyBody({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <>
      {blocks.map((block) => {
        if (block.startsWith("## ")) {
          const heading = block.slice(3).trim();
          const id = slugifyHeading(heading);

          return (
            <h2 key={block} id={id} className="text-2xl font-bold mt-8 mb-3 font-heading scroll-mt-20 group">
              <a href={`#${id}`} className="no-underline hover:underline">
                {heading}
              </a>
            </h2>
          );
        }

        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={block} className="list-disc pl-6 mb-4 space-y-2 text-muted">
              {block.split("\n").map((line) => (
                <li key={line} className="leading-relaxed pl-1">
                  {renderInlineText(line.slice(2))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block} className="text-muted leading-relaxed mb-4">
            {renderInlineText(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </>
  );
}

export function CaseStudyDetail({ slug }: CaseStudyDetailProps) {
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const shareKit = getShareKitBySlug(slug);
  const headings = extractSecondLevelHeadings(study.content);

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(techArticleSchema(study)),
        }}
      />

      <Link href="/case-studies" className="text-sm text-muted hover:text-accent transition-colors">
        &lt;- Back to case studies
      </Link>

      <article className="mt-8">
        <header className="mb-10">
          <p className="text-sm font-mono text-accent mb-3">CASE STUDY / {study.project}</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">{study.title}</h1>
          <p className="text-lg text-muted leading-relaxed mb-5">{study.summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={study.date}>
              {new Date(study.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden="true">/</span>
            <span>{study.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          {shareKit && (
            <Link
              href={`/case-studies/${study.slug}/share`}
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-accent/40 px-4 py-2 text-sm text-accent transition-colors hover:border-accent hover:text-foreground"
            >
              Share-ready summary -&gt;
            </Link>
          )}
        </header>

        <section className="mb-8 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Outcome at a glance
          </p>
          <h2 className="text-2xl font-semibold text-foreground">What changed</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {study.outcome.map((item) => (
              <article key={item} className="rounded-xl border border-border bg-background/60 p-4">
                <span className="mb-3 block h-1.5 w-8 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-muted">{item}</p>
              </article>
            ))}
          </div>
        </section>

        {headings.length > 1 && (
          <nav
            aria-label="Case study sections"
            className="mb-10 rounded-xl border border-border bg-surface/40 p-4"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              Read path
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  {heading.text}
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="prose-custom">
          <CaseStudyBody content={study.content} />
        </div>
      </article>

      <div className="mt-16 pt-8 border-t border-border">
        <Link href="/#projects" className="text-sm text-muted hover:text-accent transition-colors">
          View more projects -&gt;
        </Link>
      </div>
    </main>
  );
}
