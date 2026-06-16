import type { Metadata } from "next";
import { CaseStudyShare, getCaseStudyShareMetadata } from "../../_components/CaseStudyShare";

const slug = "mcpgate-v1-1";

export function generateMetadata(): Metadata {
  return getCaseStudyShareMetadata(slug);
}

export default function McpgateCaseStudySharePage() {
  return <CaseStudyShare slug={slug} />;
}
