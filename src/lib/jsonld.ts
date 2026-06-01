import { SITE } from "./constants";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.status,
    url: SITE.url,
    sameAs: [SITE.github, SITE.linkedin],
  };
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    keywords: post.tags,
  };
}

export function techArticleSchema(study: {
  title: string;
  summary: string;
  date: string;
  slug: string;
  tags: string[];
}) {
  const url = `${SITE.url}/case-studies/${study.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: study.title,
    description: study.summary,
    datePublished: study.date,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    keywords: study.tags,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}
