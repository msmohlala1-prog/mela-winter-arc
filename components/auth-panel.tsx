"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();

    if (!supabase) {
      setMessage("Add your Supabase keys to enable sign-in. The app still works in local demo mode.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`
      }
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Magic link sent. Check your inbox and open the link on this device.");
    setLoading(false);
  }

  return (
    <section className="glass-panel animate-rise rounded-[2rem] border border-white/60 px-6 py-7 shadow-card">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-emerald text-emerald">
        <Mail className="h-5 w-5" />
      </div>
      <p className="font-display text-3xl font-semibold text-ink">Keep your arc private</p>
      <p className="mt-2 text-sm leading-6 text-ink/68">
        Use Supabase magic links to sync your streak, resets, and weekly class completion across devices.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleMagicLink}>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
            Email
          </span>
          <input
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button
          className="w-full rounded-full bg-emerald px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-ink/68">{message}</p> : null}
    </section>
  );
}
