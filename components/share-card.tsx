"use client";

import { forwardRef, useState } from "react";
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

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const quotes = [
      "sexy of me to work out in winter",
      "discipline is the ultimate self respect",
      "wellness is the flex",
      "showing up each day",
      "winter arc in progress",
      "healthier every day",
      "consistency looks good on me",
    ];

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem] bg-black",
          className
        )}
      >

        {/* Uploaded Background Image */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          className="absolute left-5 top-5 z-20 text-sm text-white"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setUploadedImage(imageUrl);
            }
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center text-white">

          {/* Brand */}
          <div className="mb-10 flex flex-col items-center">

            <p className="text-3xl font-semibold tracking-[0.35em] text-white">
              MELA ACTIVE
            </p>

            <p className="mt-3 text-lg font-medium tracking-[0.25em] text-white/80">
              WINTER CHALLENGE
            </p>

          </div>

          {/* Day */}
          <h1 className="text-[110px] font-light leading-none tracking-[-0.08em]">
            DAY {dayNumber} / 45
          </h1>

          {/* Quote */}
          <p className="mt-8 max-w-[520px] text-5xl italic font-medium leading-tight text-white">
            {randomQuote}
          </p>

          {/* Progress */}
          <div className="mt-14 w-[260px]">

            <div className="mb-3 text-2xl font-semibold tracking-[0.2em] text-[#00A86B]">
              {Math.round((dayNumber / 45) * 100)}% COMPLETE
            </div>

            <div className="h-[4px] w-full rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-[#00A86B]"
                style={{
                  width: `${(dayNumber / 45) * 100}%`,
                }}
              />

            </div>

          </div>

          {/* Handle */}
          <p className="mt-14 text-3xl font-medium tracking-[0.25em] text-white">
            @MELAACTIVE
          </p>

        </div>

      </div>
    );
  }
);