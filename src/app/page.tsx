import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyNav } from "@/components/StickyNav";
import { BackToTop } from "@/components/BackToTop";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { personSchema } from "@/lib/jsonld";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
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
