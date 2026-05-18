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

        {/* Uploaded User Image */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Upload Button */}
        <input
          type="file"
          accept="image/*"
          className="absolute left-4 top-4 z-20 text-sm text-white"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setUploadedImage(imageUrl);
            }
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center text-white">

          {/* Brand */}
          <div className="mb-8 flex flex-col items-center">
  <p className="text-lg font-medium tracking-[0.35em] text-white">
    MELA ACTIVE
  </p>

  <p className="mt-2 text-sm tracking-[0.25em] text-white/70">
    WINTER CHALLENGE
  </p>
</div>
          {/* Day */}
          <h1 className="text-[88px] font-light leading-none tracking-[-0.06em]">
            DAY {dayNumber} / 45
          </h1>

          {/* Quote */}
          <p className="mt-6 text-3xl italic font-medium text-white">
  {randomQuote}
</p>

          {/* Progress */}
          <div className="mt-10 w-[180px]">

            <div className="mb-2 text-lg font-semibold tracking-[0.2em] text-[#00A86B]">
              {Math.round((dayNumber / 45) * 100)}% COMPLETE
            </div>

            <div className="h-[2px] w-full bg-white/20">
              <div
                className="h-full bg-[#00A86B]"
                style={{
                  width: `${(dayNumber / 45) * 100}%`,
                }}
              />
            </div>

          </div>

          {/* Handle */}
          <p className="mt-10 text-xl font-medium tracking-[0.25em] text-white/70">
            @MELAACTIVE
          </p>

        </div>
      </div>
    );
  }
);