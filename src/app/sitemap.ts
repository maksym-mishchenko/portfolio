import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://mmishchenko.dev";
  const posts = getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/uses`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    ...blogEntries,
  ];
}
