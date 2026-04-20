"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MelaLogo } from "@/components/mela-logo";
import { supabase } from "@/lib/supabase";
import { defaultArcState, loadArcState, persistArcState } from "@/lib/winter-arc";

export function JoinForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const existing = loadArcState();

    if (existing?.hasSeenWelcome) {
      router.replace("/dashboard");
      return;
    }

    if (existing) {
      router.replace("/welcome");
    }
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      return;
    }

    const nextState = {
      ...defaultArcState(new Date()),
      name: cleanName,
      email: cleanEmail,
      hasSeenWelcome: true
    };

    persistArcState(nextState);

    if (supabase) {
      void (async () => {
        try {
          const { error } = await supabase.from("signups").insert({
            name: cleanName,
            email: cleanEmail || null
          });

          if (error) {
            console.error("error", error);
            return;
          }

          console.log("success");
        } catch (error) {
          console.error("error", error);
        }
      })();
    } else {
      console.error("error", "Missing Supabase environment variables");
    }

    router.push("/dashboard");
  }

  return (
    <section className="soft-panel animate-rise w-full rounded-[2rem] border border-black/8 px-6 py-8 shadow-soft">
      <MelaLogo subtle className="text-black" />
      <h1 className="mt-8 font-display text-[3rem] leading-[0.92] tracking-[-0.05em] text-black">Join the Arc</h1>
      <p className="mt-4 text-sm leading-7 text-black/56">Enter your details to begin</p>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Name</span>
          <input
            className="h-14 w-full rounded-[1.4rem] border border-black/8 bg-[#fcfbf8] px-5 text-base text-black outline-none transition duration-300 placeholder:text-black/28 focus:border-black/20"
            placeholder="Mela"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Email</span>
          <input
            className="h-14 w-full rounded-[1.4rem] border border-black/8 bg-[#fcfbf8] px-5 text-base text-black outline-none transition duration-300 placeholder:text-black/28 focus:border-black/20"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition duration-300 hover:translate-y-[-1px] hover:bg-black/92"
        >
          Begin
        </button>

        <p className="text-center text-xs text-black/42">Progress is saved on this device.</p>
      </form>
    </section>
  );
}
