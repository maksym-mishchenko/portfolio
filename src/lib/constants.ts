export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  url: "https://mmishchenko.dev",
  github: "https://github.com/maksym-mishchenko",
  linkedin: "https://linkedin.com/in/maksym-mishchenko-1036381b8",
  email: "mailto:maksym@mmishchenko.dev",
} as const;

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: "OpenClaw",
    description:
      "Personal AI assistant running on Azure VM — Telegram bot orchestrating coding agents, monitoring, and automation across all my projects.",
    tech: ["Python", "Telegram API", "Azure VM", "LiteLLM"],
    github: "https://github.com/maksym-mishchenko/openclaw",
    featured: true,
  },
  {
    title: "Smart Wardrobe",
    description:
      "AI-powered wardrobe management with outfit recommendations. FastAPI backend with Next.js frontend, deployed on Azure.",
    tech: ["FastAPI", "Next.js", "OpenAI", "Azure"],
    github: "https://github.com/maksym-mishchenko/smart-wardrobe",
    live: "https://wardrobe.mmishchenko.dev",
  },
  {
    title: "English Helper",
    description:
      "Telegram Mini App for vocabulary learning with spaced repetition, HMAC-SHA256 auth, and 19 API routes.",
    tech: ["Next.js", "FastAPI", "Telegram API"],
    github: "https://github.com/maksym-mishchenko/english-helper-app",
  },
  {
    title: "Devlog Publisher",
    description:
      "AI content studio that generates LinkedIn posts from GitHub activity, with a blog publishing pipeline that auto-commits MDX to my portfolio.",
    tech: ["Next.js", "GPT-4o", "GitHub API", "Vercel KV"],
    github: "https://github.com/maksym-mishchenko/devlog-publisher",
  },
  {
    title: "Stock Bot",
    description:
      "Telegram bot for portfolio tracking with IBKR integration, real-time P&L, and automated market summaries.",
    tech: ["Python", "IBKR API", "Telegram API", "SQLite"],
    github: "https://github.com/maksym-mishchenko/stock-bot",
  },
  {
    title: "PowerBI Buddy",
    description:
      "AI assistant for Power BI — helps write DAX formulas, optimize data models, and troubleshoot reports.",
    tech: ["Next.js", "OpenAI", "Vercel AI SDK", "Tailwind"],
    github: "https://github.com/maksym-mishchenko/powerbi-buddy",
    live: "https://powerbi-buddy.vercel.app",
  },
];

export interface JourneyNode {
  year: string;
  icon: string;
  title: string;
  detail: string;
  link?: string;
}

export const JOURNEY: JourneyNode[] = [
  {
    year: "2016",
    icon: "🇺🇦",
    title: "Ukraine → Czechia",
    detail: "Moved to study Computer Science",
  },
  {
    year: "2016–2020",
    icon: "🎓",
    title: "BSc Computer Science",
    detail: "Technical University of Ostrava",
  },
  {
    year: "2019",
    icon: "💼",
    title: "Stora Enso",
    detail: "Java Developer — invoice processing, land management systems",
  },
  {
    year: "2022",
    icon: "💼",
    title: "EPAM Systems",
    detail: "SW Engineer → Senior SE — DevEx, licensing & package management in CI/CD (financial services)",
  },
  {
    year: "2023",
    icon: "☁️",
    title: "AWS Certified",
    detail: "Cloud Practitioner certification",
    link: "https://www.credly.com/badges/3617b306-40c2-4bab-94e4-2f20265e41d3",
  },
  {
    year: "2025",
    icon: "🚀",
    title: "Microsoft Security",
    detail: "Software Engineer II — Identity & Application Governance, Prague",
  },
  {
    year: "Now",
    icon: "🔧",
    title: "Building",
    detail: "Side projects, automation, learning security",
  },
];

export interface TechCategory {
  name: string;
  items: string[];
}

export const TECH_STACK: TechCategory[] = [
  { name: "Languages", items: ["Java", "C#", "Python", "TypeScript"] },
  { name: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  { name: "Backend", items: [".NET", "FastAPI", "Spring Boot"] },
  { name: "Cloud", items: ["Azure", "AWS"] },
  { name: "Tools", items: ["Git", "GitHub Actions", "Docker", "Vercel", "Telegram API"] },
];

