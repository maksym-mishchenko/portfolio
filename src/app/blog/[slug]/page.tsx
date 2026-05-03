import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx";

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
    openGraph: {
      title: post.title,
      description: post.description,
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

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <Link
        href="/blog"
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        ← Back to blog
      </Link>

      <article className="mt-8">
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
            <div className="flex gap-1.5 mt-3">
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

        <div className="prose-custom">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

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
