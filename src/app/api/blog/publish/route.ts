import { NextRequest } from "next/server";
import matter from "gray-matter";
import { z } from "zod";

const PUBLISH_SECRET = process.env.BLOG_PUBLISH_SECRET ?? "";

const publishRequestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional().default(""),
  tags: z.array(z.string().min(1).max(50)).max(20).optional().default([]),
  content: z.string().min(1),
  date: z.iso.date().optional(),
});

const githubContentSchema = z.object({
  sha: z.string().min(1),
});

const githubWriteResultSchema = z.object({
  commit: z
    .object({
      sha: z.string().min(1),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  // Authenticate
  const auth = request.headers.get("x-publish-secret");
  if (!PUBLISH_SECRET || auth !== PUBLISH_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = publishRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { slug, title, description, tags, content, date } = parsed.data;
  const postDate = date ?? new Date().toISOString().split("T")[0];
  const mdxContent = matter.stringify(content, {
    title,
    date: postDate,
    description,
    tags,
  });

  // Push to GitHub via API
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) {
    return Response.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const filePath = `content/blog/${slug}.mdx`;
  const apiUrl = `https://api.github.com/repos/maksym-mishchenko/portfolio/contents/${filePath}`;

  // Check if file exists (for updates)
  let existingSha: string | undefined;
  try {
    const existing = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${ghToken}`, Accept: "application/vnd.github.v3+json" },
    });
    if (existing.ok) {
      const existingData = githubContentSchema.safeParse(await existing.json());
      if (existingData.success) {
        existingSha = existingData.data.sha;
      }
    }
  } catch {
    return Response.json({ error: "Failed to check existing post" }, { status: 502 });
  }

  // Create or update the file
  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `blog: ${existingSha ? "update" : "publish"} "${title}"`,
      content: Buffer.from(mdxContent).toString("base64"),
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: "GitHub API error", details: err }, { status: 502 });
  }

  const result = githubWriteResultSchema.safeParse(await res.json());

  return Response.json({
    success: true,
    url: `https://mmishchenko.dev/blog/${slug}`,
    commit: result.success ? result.data.commit?.sha.slice(0, 7) : undefined,
  });
}
