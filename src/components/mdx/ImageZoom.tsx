"use client";

import { useState, useCallback, useEffect } from "react";

export function ImageZoom({ src, alt }: { src?: string; alt?: string }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="rounded-xl border border-border my-6 max-w-full cursor-zoom-in transition-transform hover:scale-[1.01]"
        loading="lazy"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt ?? ""}
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
          />
        </div>
      )}
    </>
  );
}
