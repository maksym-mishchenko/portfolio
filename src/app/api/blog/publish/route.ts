import { NextRequest } from "next/server";

const PUBLISH_SECRET = process.env.BLOG_PUBLISH_SECRET ?? "";

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

  const { slug, title, description, tags, content, date } = body as {
    slug?: string;
    title?: string;
    description?: string;
    tags?: string[];
    content?: string;
    date?: string;
  };

  if (!slug || !title || !content) {
    return Response.json({ error: "slug, title, and content are required" }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: "Invalid slug format" }, { status: 400 });
  }

  // Build MDX frontmatter + content
  const postDate = date ?? new Date().toISOString().split("T")[0];
  const tagList = tags ?? [];
  const desc = description ?? "";

  const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${postDate}"
description: "${desc.replace(/"/g, '\\"')}"
tags: [${tagList.map((t) => `"${t}"`).join(", ")}]
---

${content}
`;

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
      const data = await existing.json();
      existingSha = data.sha;
    }
  } catch {
    // File doesn't exist, that's fine
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

  const result = await res.json();

  return Response.json({
    success: true,
    url: `https://mmishchenko.dev/blog/${slug}`,
    commit: result.commit?.sha?.slice(0, 7),
  });
}
