"use client";

import { motion } from "framer-motion";
import { JOURNEY } from "@/lib/constants";
import { JourneyNode } from "@/components/JourneyNode";
import { SectionHeader } from "@/components/SectionHeader";

export function Journey() {
  return (
    <section id="journey" className="px-6 py-24">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[260px_1fr]">
        <SectionHeader
          title="The path here"
          subtitle="Ukraine to Prague, Java contractor to Microsoft Security. Roughly a decade, compressed."
          className="md:sticky md:top-24 md:self-start"
        />

        <motion.div
          className="flex flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
        {JOURNEY.map((node, i) => (
          <JourneyNode
            key={node.year}
            year={node.year}
            icon={node.icon}
            title={node.title}
            detail={node.detail}
            link={node.link}
            index={i}
            isLast={i === JOURNEY.length - 1}
          />
        ))}
        </motion.div>
      </div>
    </section>
  );
}
