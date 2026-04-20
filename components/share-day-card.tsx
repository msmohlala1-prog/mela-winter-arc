"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShareDayCardProps {
  day: number;
  className?: string;
}

export const ShareDayCard = forwardRef<HTMLDivElement, ShareDayCardProps>(function ShareDayCard(
  { day, className },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex aspect-[9/16] w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-black px-12 py-20 text-center text-white",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-7 rounded-[2rem] border border-white/[0.07]" />
      <div className="pointer-events-none absolute inset-x-14 top-16 h-32 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative flex min-h-[64%] flex-col items-center justify-center">
        <p className="text-sm uppercase tracking-[0.36em] text-white/52">Day {day} of 45</p>
        <h2 className="mt-12 font-display text-[6.8rem] leading-[0.82] tracking-[-0.055em] text-white/88">
          Locked in
        </h2>
        <p className="mt-14 text-sm uppercase tracking-[0.3em] text-white/54">❄️ Mela Winter Arc</p>
        <p className="mt-10 text-sm leading-8 tracking-[0.08em] text-white/46">
          @melaactive
          <br />
          #MelaWinterArc
        </p>
      </div>

      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <div className="flex items-end text-[1.35rem] font-light uppercase leading-none tracking-[0.42em] text-white/28">
          <span>M</span>
          <span className="relative">
            E
            <span className="absolute left-1/2 top-[-0.24em] h-px w-[0.72em] -translate-x-1/2 bg-white/28" />
            <span className="absolute left-1/2 top-[-0.34em] h-px w-[0.52em] -translate-x-[42%] bg-white/28" />
          </span>
          <span>L</span>
          <span>A</span>
        </div>
      </div>
    </div>
  );
});
