"use client";

import { motion } from "framer-motion";
import { MdxJsonError, isRecord, parseMdxJsonProp } from "./mdx-json";

interface TimelineEvent {
  label: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  events: string; // JSON array of TimelineEvent
}

function isTimelineEventArray(value: unknown): value is TimelineEvent[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.label === "string" &&
        typeof item.description === "string" &&
        (item.icon === undefined || typeof item.icon === "string")
    )
  );
}

export function Timeline({ events }: TimelineProps) {
  const eventsResult = parseMdxJsonProp(events, "events", isTimelineEventArray);
  const parsedEvents = eventsResult.value ?? [];

  if (eventsResult.error) return <MdxJsonError component="Timeline" error={eventsResult.error} />;
  if (!parsedEvents.length) return null;

  return (
    <div className="my-6 space-y-0">
      {parsedEvents.map((event, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex gap-4 mb-6 last:mb-0"
        >
          {/* Left column: dot + line */}
          <div className="flex flex-col items-center flex-none w-4">
            <div className="w-3 h-3 rounded-full bg-accent border-2 border-background flex-none mt-[2px]" />
            {i < parsedEvents.length - 1 && (
              <div className="w-0.5 bg-border flex-1 mt-1 min-h-[1.5rem]" />
            )}
          </div>
          {/* Right column: content */}
          <div className="pb-2 flex-1">
            <p className="font-medium text-sm">{event.label}</p>
            <p className="text-sm text-muted mt-0.5">{event.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
