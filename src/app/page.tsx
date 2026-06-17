import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyNav } from "@/components/StickyNav";
import { BackToTop } from "@/components/BackToTop";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { personSchema, websiteSchema, safeJsonLd } from "@/lib/jsonld";

export default function Home() {
  if (process.env.CI === "true") {
    throw new Error("Negative CI build gate proof");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema()) }}
      />
      <ScrollProgress />
      <StickyNav />
      <main id="main">
        <Hero />
        <Projects />
        <Journey />
        <TechStack />
        <About />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
}
