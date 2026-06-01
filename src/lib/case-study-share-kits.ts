export interface CaseStudyShareKit {
  slug: string;
  positioning: string;
  recruiterSummary: string[];
  linkedinPost: string;
  githubBlurb: string;
  resumeBullet: string;
  recruiterMessage: string;
}

const SHARE_KITS: CaseStudyShareKit[] = [
  {
    slug: "mcpgate-v1-1",
    positioning:
      "I can identify and reduce AI-agent security risk before it becomes production damage.",
    recruiterSummary: [
      "Built mcpgate, a local governance gateway for AI-agent tool calls.",
      "Added injection heuristics, reverse-channel checks, and audit-friendly decisions without adding external services.",
      "Shipped a case study that explains the risk, design tradeoffs, validation path, and operational outcome.",
    ],
    linkedinPost:
      "I shipped a case study on mcpgate v1.1: a local governance gateway for AI-agent tool calls. The work focuses on a practical security problem: how to catch risky prompts, tool arguments, and reverse-channel behavior before an agent turns them into production-impacting actions. The key takeaway: I can identify and reduce AI-agent security risk before it becomes production damage.",
    githubBlurb:
      "Built mcpgate, a local AI-agent governance gateway focused on pre-flight policy checks, injection heuristics, reverse-channel risk detection, and audit-friendly decisions. The case study explains the security problem, implementation tradeoffs, and validation path.",
    resumeBullet:
      "Designed and shipped mcpgate v1.1, a local AI-agent governance gateway that reduces tool-call risk with pre-flight policy checks, injection heuristics, reverse-channel detection, and audit-ready decision records.",
    recruiterMessage:
      "Hi, I wanted to share a concise case study that represents the kind of engineering work I want to do next: identifying and reducing AI-agent security risk before it becomes production damage. It covers mcpgate v1.1, a local governance gateway for agent tool calls, including the problem, design tradeoffs, and validation path.",
  },
];

export function getShareKitBySlug(slug: string): CaseStudyShareKit | null {
  return SHARE_KITS.find((kit) => kit.slug === slug) ?? null;
}

export function getAllShareKitSlugs(): string[] {
  return SHARE_KITS.map((kit) => kit.slug);
}
