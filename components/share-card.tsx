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

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    { dayNumber, className },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem]",
          className
        )}
      >
        <img
          src="/share-bg.png"
          alt="Mela Winter Arc"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
          <p className="text-[120px] leading-none font-light tracking-[-0.08em]">
            {dayNumber}
          </p>

          <p className="text-[60px] leading-none font-light -mt-2">
            /45
          </p>

          <p className="mt-10 text-lg tracking-[0.2em] uppercase text-[#00A86B]">
            This discipline is self respect
          </p>
        </div>
      </div>
    );
  }
);