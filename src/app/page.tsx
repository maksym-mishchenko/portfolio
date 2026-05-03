import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <main id="main">
        <Hero />
        <Projects />

        <Journey />
        <TechStack />
        <About />
        <Contact />
      </main>
      <footer className="py-8 text-center text-sm text-muted border-t border-border">
        <p>© {new Date().getFullYear()} Maksym Mishchenko.</p>
      </footer>
    </>
  );
}
