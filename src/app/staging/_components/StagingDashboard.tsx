"use client";

import { useState } from "react";
import type { BlogPostMeta } from "@/lib/blog";

interface Props {
  drafts: BlogPostMeta[];
}

export default function StagingDashboard({ drafts }: Props) {
  const [items, setItems] = useState(drafts);
  const [approving, setApproving] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  async function approve(slug: string) {
    setApproving(slug);
    const res = await fetch("/api/staging/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setApproving(null);
    if (res.ok) {
      const data = await res.json();
      setResults((r) => ({ ...r, [slug]: `✅ Published — ${data.url} (commit ${data.commit})` }));
      setItems((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      const err = await res.json();
      setResults((r) => ({ ...r, [slug]: `❌ Error: ${err.error}` }));
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-2">
          Staging Area
        </div>
        <h1 className="text-3xl font-black mb-1">Drafts awaiting approval</h1>
        <p className="text-[#55556a] text-sm mb-8">
          Approving a post commits directly to GitHub → Vercel redeploys → post goes live.
        </p>

        {items.length === 0 && Object.keys(results).length === 0 && (
          <p className="text-[#55556a]">No drafts in staging.</p>
        )}

        {/* Published results */}
        {Object.entries(results).map(([slug, msg]) => (
          <div
            key={slug}
            className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4 mb-4 text-sm"
          >
            <span className="font-mono text-[#f97316]">{slug}</span>
            <p className="text-[#9090b0] mt-1">{msg}</p>
          </div>
        ))}

        {/* Pending drafts */}
        {items.map((post) => (
          <div
            key={post.slug}
            className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6 mb-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-[#1a1a2a] border border-[#2a2a3e] rounded px-2 py-0.5 text-[#f97316] uppercase tracking-widest">
                    DRAFT
                  </span>
                  <span className="text-xs text-[#44445a]">{post.date}</span>
                  <span className="text-xs text-[#44445a]">{post.readingTime}</span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{post.title}</h2>
                <p className="text-sm text-[#9090b0] mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#0f0f18] border border-[#2a2a3e] rounded px-2 py-0.5 text-[#55556a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 rounded-lg border border-[#2a2a3e] text-[#9090b0] hover:text-white hover:border-[#f97316] transition-colors text-center"
                >
                  Preview ↗
                </a>
                <button
                  onClick={() => approve(post.slug)}
                  disabled={approving === post.slug}
                  className="text-sm px-4 py-2 rounded-lg bg-[#f97316] text-white font-semibold hover:bg-[#ea6c0e] disabled:opacity-50 transition-colors"
                >
                  {approving === post.slug ? "Publishing…" : "Approve & Publish"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
