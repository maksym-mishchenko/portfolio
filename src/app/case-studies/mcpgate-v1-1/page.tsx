import type { Metadata } from "next";
import { CaseStudyDetail, getCaseStudyDetailMetadata } from "../_components/CaseStudyDetail";

const slug = "mcpgate-v1-1";

export function generateMetadata(): Metadata {
  return getCaseStudyDetailMetadata(slug);
}

export default function McpgateCaseStudyPage() {
  return <CaseStudyDetail slug={slug} />;
}
