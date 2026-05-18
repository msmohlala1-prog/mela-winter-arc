"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ShareDayCardProps {
  day: number;
  className?: string;
}

export const ShareDayCard = forwardRef<
  HTMLDivElement,
  ShareDayCardProps
>(function ShareDayCard(
  { day, className },
  ref
) {

  const [uploadedImage, setUploadedImage] =
    useState<string | null>(null);

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
        "relative w-full h-screen overflow-hidden bg-black text-white",
        className
      )}
    >

      {/* Uploaded Background */}
      {uploadedImage && (
        <img
          src={uploadedImage}
          alt="Uploaded background"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Hidden Upload Input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="background-upload"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
          }
        }}
      />

      {/* Upload Button */}
      <label
        htmlFor="background-upload"
        className="absolute top-6 right-6 z-20 cursor-pointer rounded-full bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur-md"
      >
        Add Photo
      </label>

      {/* Main Layout */}
      <div className="relative z-10 flex h-full flex-col justify-between px-10 py-20">

        {/* Top */}
        <div className="text-center">

          <p className="text-[28px] font-bold tracking-[0.35em]">
            MELA ACTIVE
          </p>

          <p className="mt-3 text-[16px] font-medium tracking-[0.25em] text-white/70">
            WINTER CHALLENGE
          </p>

        </div>

        {/* Center */}
        <div className="flex flex-col items-center text-center">

          <div className="flex items-end justify-center leading-none">

            <span className="text-[180px] font-black tracking-[-0.08em]">
              {day}
            </span>

            <span className="mb-5 ml-3 text-[90px] font-semibold text-white/80">
              /45
            </span>

          </div>

          <p className="mt-8 max-w-[700px] text-[34px] font-semibold italic leading-[1.2] text-white/90">
            {randomQuote}
          </p>

        </div>

        {/* Bottom */}
        <div>

          <div className="mb-4 text-center text-[34px] font-black tracking-[0.2em] text-[#00A86B]">
            {Math.round((day / 45) * 100)}% COMPLETE
          </div>

          <div className="h-[10px] w-full rounded-full bg-white/20">

            <div
              className="h-full rounded-full bg-[#00A86B]"
              style={{
                width: `${(day / 45) * 100}%`,
              }}
            />

          </div>

          <p className="mt-12 text-center text-[28px] font-bold tracking-[0.3em]">
            @MELAACTIVE
          </p>

        </div>

      </div>

    </div>
  );
});