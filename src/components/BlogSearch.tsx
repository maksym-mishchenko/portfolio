"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { BlogPostMeta } from "@/lib/blog";

type BlogSearchProps = {
  posts: BlogPostMeta[];
};

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function postMatchesQuery(post: BlogPostMeta, normalizedQuery: string) {
  if (normalizedQuery.length === 0) {
    return true;
  }

  const searchableText = [
    post.title,
    post.description,
    post.date,
    post.readingTime,
    ...(post.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query);

  const filteredPosts = useMemo(
    () => posts.filter((post) => postMatchesQuery(post, normalizedQuery)),
    [normalizedQuery, posts],
  );

  const isFiltering = normalizedQuery.length > 0;
  const resultLabel = isFiltering
    ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "match" : "matches"}`
    : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface/40 p-4">
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts by title, topic, or tag..."
            className="min-h-11 flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <span className="text-sm text-muted" aria-live="polite">
            {resultLabel}
          </span>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-1">
          {filteredPosts.map((post) => (
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
                        className="text-xs px-2 py-0.5 rounded-full border bg-surface border-border text-muted"
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
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-lg font-semibold text-foreground">No posts found</p>
          <p className="mt-2 text-sm text-muted">
            Try a different title, topic, or tag.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-full border border-accent/40 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent/10"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
