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

        {/* Uploaded Background */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Upload */}
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

        {/* Main Layout */}
        <div className="relative z-10 flex h-full flex-col justify-between px-10 py-20 text-white">

          {/* Top Branding */}
          <div className="flex flex-col items-center text-center">

            <p className="text-5xl font-black tracking-[0.3em]">
              MELA ACTIVE
            </p>

            <p className="mt-4 text-2xl font-bold tracking-[0.25em] text-white/80">
              WINTER CHALLENGE
            </p>

          </div>

          {/* Middle Content */}
          <div className="flex flex-col items-center text-center">

            <h1 className="text-[180px] font-black leading-none tracking-[-0.1em]">
              {dayNumber}
            </h1>

            <p className="-mt-6 text-6xl font-black uppercase tracking-[0.2em]">
              / 45
            </p>

            <p className="mt-12 max-w-[700px] text-6xl font-bold italic leading-tight">
              {randomQuote}
            </p>

          </div>

          {/* Bottom Content */}
          <div className="flex flex-col items-center">

            <div className="w-full max-w-[420px]">

              <div className="mb-4 text-center text-4xl font-black tracking-[0.2em] text-[#00A86B]">
                {Math.round((dayNumber / 45) * 100)}% COMPLETE
              </div>

              <div className="h-[8px] w-full rounded-full bg-white/20">

                <div
                  className="h-full rounded-full bg-[#00A86B]"
                  style={{
                    width: `${(dayNumber / 45) * 100}%`,
                  }}
                />

              </div>

            </div>

            <p className="mt-14 text-4xl font-black tracking-[0.25em]">
              @MELAACTIVE
            </p>

          </div>

        </div>

      </div>
    );
  }
);