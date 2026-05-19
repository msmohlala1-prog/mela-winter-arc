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
  className
},
ref
){

const quotes = [
"hot girls stay consistent",
"currently becoming that girl",
"discipline but make it cute",
"moved my body, fixed my mood",
"cute & committed",
"strong girls romanticize routines",
"healthy is the new hot",
"showing up still counts",
"movement is a privilege",
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

{/* transparent background */}
<div className="absolute inset-0" />

<div className="relative z-10 flex h-full flex-col items-center justify-end pb-44 px-8 text-white">

{/* logo */}

<div className="mb-14 text-center">

<p className="text-[24px] font-semibold tracking-[0.35em]">
MELA ACTIVE
</p>

<p className="mt-2 text-[13px] tracking-[0.28em] text-white/70">
WINTER CHALLENGE
</p>

</div>


{/* day */}

<div className="flex items-end gap-1">

<span className="text-[78px] font-bold leading-none">
{day}
</span>

<span className="text-[78px] font-medium leading-none text-white/70">
/45
</span>

</div>


{/* quote */}

<p className="mt-6 max-w-[360px] text-center text-[26px] italic leading-tight">

"{quote}"

</p>


{/* progress */}

<div className="mt-10 flex flex-col items-center">

<p className="mb-3 text-[15px] font-semibold tracking-[0.2em] text-[#00C389]">

{Math.round((day/45)*100)}% COMPLETE

</p>

<div className="h-[4px] w-[150px] rounded-full bg-white/20">

<div
className="h-full rounded-full bg-[#00C389]"
style={{
width:`${(day/45)*100}%`
}}
/>

</div>

</div>


<p className="mt-10 text-[18px] font-semibold tracking-[0.25em]">

@MELAACTIVE

</p>

</div>

</div>

);

});

ShareDayCard.displayName = "ShareDayCard";