import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const alt = "Blog post preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? slug;
  const tags = post?.tags ?? [];
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              color: "#3b82f6",
              marginBottom: 24,
              display: "flex",
            }}
          >
            mmishchenko.dev/blog
          </div>
          <div
            style={{
              fontSize: 52,
              color: "#fafafa",
              fontWeight: 700,
              lineHeight: 1.2,
              display: "flex",
              maxWidth: "90%",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              {tags.slice(0, 4).map((tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: 16,
                    color: "#a1a1aa",
                    border: "1px solid #27272a",
                    borderRadius: 9999,
                    padding: "4px 12px",
                    display: "flex",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 18, color: "#71717a", display: "flex" }}>
              {date}
            </div>
            <div style={{ fontSize: 18, color: "#71717a", display: "flex" }}>
              Maksym Mishchenko
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
