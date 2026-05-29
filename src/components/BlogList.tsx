"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Rss } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    let result = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeTag, posts, query]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
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

      <input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors mb-6"
        aria-label="Search blog posts"
      />

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              activeTag === null
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted hover:border-accent/50 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTag === tag
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted">
          {query ? `No posts matching "${query}"` : "No posts found for this tag."}
        </p>
      ) : (
        <div className="space-y-1">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-4 -mx-4 px-4 rounded-lg hover:bg-surface transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h2 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <span className="text-sm text-muted shrink-0 tabular-nums">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-muted mt-1">{post.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted">{post.readingTime}</span>
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          activeTag === tag
                            ? "border-accent text-accent bg-accent/10"
                            : "bg-surface border-border text-muted"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

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
