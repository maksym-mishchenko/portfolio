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
