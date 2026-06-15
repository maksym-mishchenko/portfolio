import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { getShareKitBySlug } from "@/lib/case-study-share-kits";
import { mdxComponents } from "@/components/mdx";
import { safeJsonLd, techArticleSchema } from "@/lib/jsonld";
import { extractSecondLevelHeadings } from "@/lib/mdx-headings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
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
          <MDXRemote source={study.content} components={mdxComponents} />
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
