import type { Metadata } from "next";
import { Rss } from "lucide-react";
import Link from "next/link";
import { BlogSearch } from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Maksym Mishchenko",
  description:
    "Writing about AI agents, engineering workflows, and building things that actually work.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts.find((post) => post.slug === "mcp-servers-in-production") ?? posts[0];

  return (
    <main id="main" className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-4xl font-bold font-heading">Blog</h1>
        <a
          href="/blog/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="RSS Feed"
          className="mt-2 text-muted hover:text-accent transition-colors"
        >
          <Rss className="w-5 h-5" />
        </a>
      </div>
      <p className="text-muted mb-8">
        Writing about AI agents, engineering workflows, and building things that actually work.
      </p>

      {featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="mb-8 block rounded-2xl border border-accent/30 bg-surface p-5 transition-colors hover:border-accent/60"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Start here</p>
          <h2 className="mt-3 text-xl font-semibold text-foreground">{featuredPost.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{featuredPost.description}</p>
          <p className="mt-4 text-sm text-accent">Read the recommended first post -&gt;</p>
        </Link>
      )}

      <BlogSearch posts={posts} />

      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/"
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
