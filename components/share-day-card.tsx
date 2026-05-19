"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShareDayCardProps {
  day: number;
  className?: string;
}

export const ShareDayCard = forwardRef<
  HTMLDivElement,
  ShareDayCardProps
>(function ShareDayCard(
  {
    day,
    className,
  },
  ref
) {

  const quotes = [
    "hot girls stay consistent",
    "dnd currently becoming that girl",
    "discipline but make it cute",
    "moved my body, fixed my mood",
    "cute & committed",
    "strong girls romanticize routines",
    "currently becoming that girl",
    "healthy is the new hot",
    "showing up still counts",
    "hot girls stay consistent",
    "discipline is the real self respect",
    "sexy of me to work out in winter",
    "wellness is the flex",
    "stronger every day",
    "understood the assignment",
    "it's giving discipline",
    "chose hard",
  ];

  const quote = quotes[day % quotes.length];

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[9/16] w-full overflow-hidden",
        className
      )}
    >

      {/* Transparent overlay layer */}
      <div className="absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-white">

        {/* Logo */}
        <div className="mb-8 text-center">

          <p className="text-[18px] font-semibold tracking-[0.4em]">
            MELA ACTIVE
          </p>

          <p className="mt-2 text-[10px] tracking-[0.35em] text-white/70">
            WINTER CHALLENGE
          </p>

        </div>

        {/* Day */}
        <div className="flex items-end justify-center">

          <span className="text-[75px] font-bold leading-none">
            {day}
          </span>

          <span className="mb-2 ml-2 text-[36px] text-white/70">
            /45
          </span>

        </div>

        {/* Quote */}
        <p className="mt-4 max-w-[260px] text-center text-[18px] italic leading-tight text-white">
          "{quote}"
        </p>

        {/* Progress */}
        <div className="mt-8 flex flex-col items-center">

          <p className="mb-3 text-[15px] font-semibold tracking-[0.2em] text-[#00C389]">
            {Math.round((day / 45) * 100)}% COMPLETE
          </p>

          <div className="h-[4px] w-[120px] rounded-full bg-white/20">

            <div
              className="h-full rounded-full bg-[#00C389]"
              style={{
                width: `${(day / 45) * 100}%`,
              }}
            />

          </div>

        </div>

        <p className="mt-8 text-[14px] font-semibold tracking-[0.25em]">
          @MELAACTIVE
        </p>

      </div>

    </div>
  );
});