"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BlogSearchPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
  tags?: string[];
};

type BlogSearchProps = {
  posts: BlogSearchPost[];
};

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function postMatchesQuery(post: BlogSearchPost, normalizedQuery: string) {
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
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
            className="min-h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
          />
          <span className="text-sm text-slate-400" aria-live="polite">
            {resultLabel}
          </span>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.04]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>/</span>
                <span>{post.readingTime}</span>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-emerald-300">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="mb-4 text-slate-400">{post.description}</p>

              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-lg font-semibold text-white">No posts found</p>
          <p className="mt-2 text-sm text-slate-400">
            Try a different title, topic, or tag.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-full border border-emerald-400/30 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-400/10"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
