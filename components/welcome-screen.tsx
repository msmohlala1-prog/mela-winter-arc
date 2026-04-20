"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MelaLogo } from "@/components/mela-logo";
import { loadArcState, persistArcState } from "@/lib/winter-arc";

export function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const state = loadArcState();

    if (!state) {
      router.replace("/join");
    }
  }, [router]);

  function handleStart() {
    const state = loadArcState();

    if (!state) {
      router.replace("/join");
      return;
    }

    persistArcState({
      ...state,
      hasSeenWelcome: true
    });
    router.push("/dashboard");
  }

  return (
    <section className="soft-panel animate-rise flex min-h-[calc(100vh-3rem)] w-full flex-col rounded-[2rem] border border-black/8 px-6 py-10 text-center shadow-soft">
      <div className="flex flex-1 flex-col items-center justify-center">
        <MelaLogo subtle className="text-black" />
        <p className="mt-10 font-display text-[3.1rem] leading-[0.92] tracking-[-0.05em] text-black">
          Welcome to the Winter Arc.
        </p>
        <p className="mt-4 font-display text-[2.45rem] leading-none tracking-[-0.04em] text-black/88">Day 1 starts now.</p>
        <p className="mt-8 text-sm leading-7 text-black/56">
          You don&apos;t need to be perfect.
          <br />
          You just need to show up.
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-10 inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition duration-300 hover:translate-y-[-1px] hover:bg-black/92"
        >
          Start Day 1
        </button>
      </div>
      <p className="pt-10 text-center text-xs leading-6 text-black/36">
        Be part of the community
        <br />
        @melaactive
      </p>
    </section>
  );
}
