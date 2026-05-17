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
      "relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem]",
      className
    )}
  >
    {/* Background Image */}
   
    {/* Content */}
    <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center text-white">

      {/* Brand */}
      <p className="mb-6 text-sm tracking-[0.35em] text-white/80">
        MELA ACTIVE
      </p>

      {/* Day */}
      <h1 className="text-[88px] font-light leading-none tracking-[-0.06em]">
        DAY {day} / 45
      </h1>

      {/* Quote */}
      <p className="mt-6 text-lg italic text-white/80">
        sexy of me to work out in winter
      </p>

      {/* Progress */}
      <div className="mt-10 w-[180px]">
        <div className="mb-2 text-xs tracking-[0.3em] text-[#00A86B]">
          {Math.round((day / 45) * 100)}% COMPLETE
        </div>

        <div className="h-[2px] w-full bg-white/20">
          <div
            className="h-full bg-[#00A86B]"
            style={{
              width: `${(day / 45) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Handle */}
      <p className="mt-10 text-sm tracking-[0.25em] text-white/70">
        @MELAACTIVE
      </p>
    </div>
  </div>
);
});