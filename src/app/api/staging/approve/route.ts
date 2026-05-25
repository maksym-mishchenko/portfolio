import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const STAGING_SECRET = process.env.STAGING_SECRET ?? "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const REPO = "maksym-mishchenko/portfolio";

function isAuthorized(request: NextRequest): boolean {
  const cookieStore = request.cookies;
  return !!STAGING_SECRET && cookieStore.get("staging_auth")?.value === STAGING_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug } = body as { slug?: string };
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return Response.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (!GITHUB_TOKEN) {
    return Response.json({ error: "GitHub token not configured" }, { status: 500 });
  }

  const filePath = `content/blog/${slug}.mdx`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  // Fetch current file
  const existing = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!existing.ok) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const fileData = await existing.json();
  const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");

  // Remove draft: true from frontmatter
  const updated = currentContent
    .replace(/^draft:\s*true\s*\n/m, "")
    .replace(/^draft:\s*false\s*\n/m, "");

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `blog: publish "${slug}"`,
      content: Buffer.from(updated).toString("base64"),
      sha: fileData.sha,
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
