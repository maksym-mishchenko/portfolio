import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import { getAllShareKitSlugs, getShareKitBySlug } from "@/lib/case-study-share-kits";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllShareKitSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const shareKit = getShareKitBySlug(slug);

  if (!study || !shareKit) return {};

  return {
    title: `${study.project} share-ready summary - Maksym Mishchenko`,
    description: shareKit.positioning,
    openGraph: {
      title: `${study.project} share-ready summary`,
      description: shareKit.positioning,
      type: "article",
    },
  };
}

function ShareCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-mono text-accent mb-3">{title}</h2>
      <div className="text-sm leading-relaxed text-muted whitespace-pre-line">{children}</div>
    </section>
  );
}

export default async function CaseStudySharePage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  const shareKit = getShareKitBySlug(slug);

  if (!study || !shareKit) notFound();

  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-20">
      <Link
        href={`/case-studies/${study.slug}`}
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        &lt;- Back to case study
      </Link>

      <header className="mt-8 mb-10">
        <p className="text-sm font-mono text-accent mb-3">SHARE KIT / {study.project}</p>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Share-ready summary</h1>
        <p className="text-lg text-muted leading-relaxed">{shareKit.positioning}</p>
      </header>

      <div className="space-y-4">
        <ShareCard title="Recruiter summary">
          <ul className="space-y-2">
            {shareKit.recruiterSummary.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ShareCard>

        <ShareCard title="LinkedIn post">{shareKit.linkedinPost}</ShareCard>
        <ShareCard title="GitHub profile blurb">{shareKit.githubBlurb}</ShareCard>
        <ShareCard title="Resume bullet">{shareKit.resumeBullet}</ShareCard>
        <ShareCard title="Recruiter outreach message">{shareKit.recruiterMessage}</ShareCard>
      </div>
    </main>
  );
}
