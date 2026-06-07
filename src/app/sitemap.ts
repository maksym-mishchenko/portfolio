import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { getAllShareKitSlugs } from "@/lib/case-study-share-kits";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE.url;
  const staticLastModified = new Date("2026-06-01");
  const posts = getAllPosts();
  const caseStudies = getAllCaseStudies();
  const shareKitSlugs = getAllShareKitSlugs();

  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const caseStudyEntries = caseStudies.map((study) => ({
    url: `${siteUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.date),
  }));

  const shareKitEntries = shareKitSlugs.flatMap((slug) => {
    const study = getCaseStudyBySlug(slug);
    if (!study) return [];

    return [
      {
        url: `${siteUrl}/case-studies/${slug}/share`,
        lastModified: new Date(study.date),
      },
    ];
  });

  return [
    { url: siteUrl, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/about`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: staticLastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/case-studies`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/now`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteUrl}/resume`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/uses`, lastModified: staticLastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    ...blogEntries,
    ...caseStudyEntries,
    ...shareKitEntries,
  ];
}
