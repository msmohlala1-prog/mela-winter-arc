"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShareDayCardProps {
  day: number;
  uploadedImage?: string;
  className?: string;
}

export const ShareDayCard = forwardRef<
HTMLDivElement,
ShareDayCardProps
>(function ShareDayCard(
{
day,
uploadedImage,
className
},
ref
) {

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
quotes[day % quotes.length];

return (

<div
ref={ref}
className={cn(
"relative w-full h-screen overflow-hidden bg-black text-white",
className
)}
>

{/* Background */}
{uploadedImage && (
<img
src={uploadedImage}
alt="Background"
className="absolute inset-0 h-full w-full object-cover"
/>
)}

<div className="absolute inset-0 bg-black/50" />

<div className="relative z-10 flex h-full flex-col justify-between px-10 py-16">

{/* Top */}
<div className="text-center">

<p className="text-[22px] font-bold tracking-[0.35em]">
MELA ACTIVE
</p>

<p className="mt-2 text-[14px] tracking-[0.25em] text-white/70">
WINTER CHALLENGE
</p>

</div>

{/* Center */}
<div className="flex flex-col items-center text-center">

<p className="mb-4 text-[18px] tracking-[0.4em] text-white/60">
DAY
</p>

<div className="flex items-end">

<span className="text-[140px] font-black leading-none">
{day}
</span>

<span className="mb-3 ml-2 text-[56px] font-medium text-white/80">
/45
</span>

</div>

<p className="mt-10 max-w-[500px] text-[28px] italic font-semibold leading-[1.3]">
"{randomQuote}"
</p>

</div>

{/* Bottom */}

<div>

<div className="mb-3 text-center text-[24px] font-bold tracking-[0.25em] text-[#00A86B]">
{Math.round((day/45)*100)}% COMPLETE
</div>

<div className="h-[8px] rounded-full bg-white/20">

<div
className="h-full rounded-full bg-[#00A86B]"
style={{
width:`${(day/45)*100}%`
}}
/>

</div>

<p className="mt-8 text-center text-[18px] font-bold tracking-[0.3em]">
@MELAACTIVE
</p>

</div>

</div>

</div>

);
});