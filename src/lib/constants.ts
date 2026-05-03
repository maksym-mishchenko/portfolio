export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  url: "https://maksym.dev",
  github: "https://github.com/maksym-mishchenko",
  linkedin: "https://linkedin.com/in/maksym-mishchenko-1036381b8",
  email: "mailto:contact@maksym.dev",
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
    title: "English Helper",
    description:
      "AI-powered Telegram Mini App for vocabulary learning with spaced repetition, HMAC-SHA256 auth, and 19 API routes.",
    tech: ["Next.js", "FastAPI", "Telegram API", "Azure VM"],
    github: "https://github.com/maksym-mishchenko/english-helper-app",
    featured: true,
  },
];

export interface JourneyNode {
  year: string;
  icon: string;
  title: string;
  detail: string;
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
    detail: "Software Engineer → Senior SE — Java libraries, DevOps tooling",
  },
  {
    year: "2023",
    icon: "☁️",
    title: "AWS Certified",
    detail: "Cloud Practitioner certification",
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
    detail: "Side projects, open source, learning security",
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
  { name: "Cloud", items: ["Azure", "AWS", "Docker", "Vercel"] },
  { name: "Tools", items: ["Git", "GitHub Actions", "Telegram API"] },
];

