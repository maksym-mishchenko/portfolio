"use client";

import { motion } from "framer-motion";

interface TimelineEvent {
  label: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  events: string; // JSON array of TimelineEvent
}

export function Timeline({ events }: TimelineProps) {
  // Guard: events may be undefined during SSR prerendering
  const parsedEvents: TimelineEvent[] = events ? JSON.parse(events) : [];

  if (!parsedEvents.length) return null;

  return (
    <div className="my-6 relative pl-6 border-l-2 border-border">
      {parsedEvents.map((event, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="mb-6 last:mb-0 relative"
        >
          <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-accent border-2 border-background" />
          <p className="font-medium text-sm">
            {event.icon && <span className="mr-1.5">{event.icon}</span>}
            {event.label}
          </p>
          <p className="text-sm text-muted mt-0.5">{event.description}</p>
        </motion.div>
      ))}
    </div>
  );
}