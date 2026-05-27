"use client";

import { motion } from "framer-motion";
import { TECH_STACK } from "@/lib/constants";
import { SectionReveal } from "./SectionReveal";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function TechStack() {
  return (
    <section id="stack" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionReveal>
          <h2 className="text-3xl font-mono font-bold mb-16 text-center">Tech Stack</h2>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TECH_STACK.map((category, catIndex) => (
            <SectionReveal key={category.name} delay={catIndex * 0.1}>
              <div>
                <h3 className="font-mono text-sm text-accent mb-4 uppercase tracking-wider">
                  {category.name}
                </h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {category.items.map((item) => (
                    <motion.span
                      key={item}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-surface border border-border px-4 py-2 text-sm font-mono text-foreground cursor-default transition-colors hover:border-accent/50"
                    >
                      {item}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
