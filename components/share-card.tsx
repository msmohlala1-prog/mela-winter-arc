"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  dayNumber: number;
  streak: number;
  progressPercentage: number;
  statusLabel: string;
  className?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { dayNumber, streak, progressPercentage, statusLabel, className },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,#0F3D2E_0%,#184C3B_38%,#DCEFE8_140%)] p-5 text-white shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-white/72">Mela Winter Arc</p>
          <p className="mt-3 font-display text-4xl font-semibold">Day {dayNumber} of 45</p>
        </div>
        <div className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/78">
          {statusLabel}
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm text-white/76">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/18">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/68">Streak</p>
          <p className="mt-2 font-display text-3xl font-semibold">{streak}</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/10 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/68">Arc</p>
          <p className="mt-2 font-display text-3xl font-semibold">Winter</p>
        </div>
      </div>
    </div>
  );
});
