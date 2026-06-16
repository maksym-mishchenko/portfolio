"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { track } from "@vercel/analytics";
import { SectionReveal } from "./SectionReveal";

type FormState = "idle" | "submitting" | "success" | "error";

function getResponseError(data: unknown): string | null {
  if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
    return data.error;
  }

  return null;
}

export function Contact() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "success" || state === "error") {
      feedbackRef.current?.focus();
    }
  }, [state]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("website")) return;

    setState("submitting");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(getResponseError(body) ?? `Error ${res.status}`);
      }

      setState("success");
      form.reset();

      try {
        track("contact_submit", { status: "success" });
      } catch (error) {
        console.warn("Contact analytics failed", error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-lg mx-auto">
        <SectionReveal>
          <h2 className="text-3xl font-mono font-bold mb-16 text-center">Contact</h2>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <AnimatePresence mode="wait">
              {state === "success" ? (
                <motion.div
                  key="success"
                  ref={feedbackRef}
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                  initial={false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-8 outline-none"
                >
                  <CheckCircle size={48} className="text-success" />
                  <p className="text-lg font-medium">Message sent!</p>
                  <p className="text-sm text-muted">I&apos;ll get back to you soon.</p>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="mt-2 min-h-11 rounded-lg px-4 text-sm text-accent transition-colors hover:text-accent-hover"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute opacity-0 pointer-events-none h-0 w-0"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={100}
                      placeholder="Your name"
                      className="w-full rounded-lg bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      maxLength={1000}
                      rows={4}
                      placeholder="What's on your mind?"
                      className="w-full rounded-lg bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>

                  {state === "error" && (
                    <motion.div
                      ref={feedbackRef}
                      role="alert"
                      tabIndex={-1}
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger outline-none"
                    >
                      <AlertCircle size={16} aria-hidden="true" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-background transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {state === "submitting" ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {state === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
