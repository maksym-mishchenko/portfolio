import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Maksym Mishchenko",
  description:
    "Thoughts on backend engineering, security, AI agents, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold font-heading mb-2">Blog</h1>
      <p className="text-muted mb-12">
        Thoughts on backend engineering, security, and automation.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-1">
          {posts.map((post) => (
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
                  <div className="flex gap-1.5">
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
