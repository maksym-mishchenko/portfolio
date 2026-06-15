import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/blog";
import type { BlogPostMeta } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx";
import { blogPostingSchema, safeJsonLd } from "@/lib/jsonld";
import { extractSecondLevelHeadings } from "@/lib/mdx-headings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Maksym Mishchenko`,
    description: post.description,
    // URL-live drafts and staged posts must stay out of search results.
    ...(post.draft || post.published === false
      ? { robots: { index: false, follow: false } }
      : {}),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost: BlogPostMeta | null = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost: BlogPostMeta | null = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const headings = extractSecondLevelHeadings(post.content);

  return (
    <main id="main" className="max-w-2xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(blogPostingSchema(post)),
        }}
      />
      <Link
        href="/blog"
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        ← Back to blog
      </Link>

      <article className="mt-8">
        {post.draft && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-[#f97316]/40 bg-[#f97316]/10 text-sm text-[#f97316] font-medium">
            🚧 This post is in staging — not yet publicly listed. Go to{" "}
            <a href="/staging" className="underline hover:no-underline">
              /staging
            </a>{" "}
            to approve &amp; publish it.
          </div>
        )}
        {!post.draft && post.published === false && (
          <div className="mb-6 px-4 py-3 rounded-lg border border-[#a78bfa]/40 bg-[#a78bfa]/10 text-sm text-[#a78bfa] font-medium">
            📅 This post is staged — it will go live at its scheduled time and won&apos;t appear in the blog index until then.
          </div>
        )}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {headings.length > 1 && (
          <nav
            aria-label="Article sections"
            className="mb-10 rounded-xl border border-border bg-surface/40 p-4"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              In this article
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
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      {/* Prev/Next navigation */}
      {(prevPost || nextPost) && (
        <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
            >
              <span className="text-xs text-muted">← Older</span>
              <span className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors text-right sm:text-right"
            >
              <span className="text-xs text-muted">Newer →</span>
              <span className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/blog"
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          ← Back to blog
        </Link>
      </div>
    </main>
  );
}
