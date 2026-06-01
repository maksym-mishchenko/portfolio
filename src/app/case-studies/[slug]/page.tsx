import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { mdxComponents } from "@/components/mdx";
import { techArticleSchema } from "@/lib/jsonld";

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
    openGraph: {
      title: study.title,
      description: study.summary,
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

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techArticleSchema(study)),
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
        </header>

        <section className="mb-10 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <h2 className="text-sm font-mono text-accent mb-4">Risk reduction summary</h2>
          <ul className="space-y-3">
            {study.outcome.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

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
