"use client";

import { motion } from "framer-motion";
import { JOURNEY } from "@/lib/constants";
import { JourneyNode } from "@/components/JourneyNode";

export function Journey() {
  return (
    <section id="journey" className="px-6 py-24">
      <h2 className="mb-16 text-center font-mono text-3xl font-bold">
        Journey
      </h2>

      <motion.div
        className="mx-auto flex max-w-3xl flex-col"
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
    </section>
  );
}
