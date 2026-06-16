import { SITE } from "./constants";

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.status,
    worksFor: {
      "@type": "Organization",
      name: "Microsoft Security",
      url: "https://www.microsoft.com",
    },
    url: SITE.url,
    image: SITE.image,
    sameAs: [SITE.github, SITE.linkedin],
    knowsAbout: [
      "Identity and access governance",
      "Application security",
      "Backend systems",
      "Developer tooling",
      "AI agent governance",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Prague",
      addressCountry: "CZ",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "mmishchenko.dev",
    url: SITE.url,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
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
    image: SITE.image,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
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
    image: SITE.image,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
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
