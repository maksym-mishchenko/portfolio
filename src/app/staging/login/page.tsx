"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StagingLoginPage() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/staging/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/staging");
      router.refresh();
    } else {
      setError("Wrong password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f13]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-8 flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-2">
          Staging Area
        </div>
        <h1 className="text-xl font-bold text-white">Unlock</h1>
        <input
          type="password"
          placeholder="Staging secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="bg-[#0f0f18] border border-[#2a2a3e] rounded-lg px-4 py-2 text-sm text-white placeholder:text-[#44445a] focus:outline-none focus:border-[#f97316]"
          autoFocus
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f97316] text-white font-semibold text-sm py-2 rounded-lg hover:bg-[#ea6c0e] disabled:opacity-50 transition-colors"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
