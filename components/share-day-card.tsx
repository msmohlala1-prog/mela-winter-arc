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
) {

const quotes = [
"sexy of me to work out in winter",
"discipline is self respect",
"wellness is the flex",
"showing up each day",
"winter arc loading...",
"stronger every day",
"consistency looks good on me",
"becoming her"
];

const quote =
quotes[day % quotes.length];

return (

<div
ref={ref}
className={cn(
"relative w-full h-screen overflow-hidden bg-white text-black",
className
)}
>

<div className="flex h-full flex-col justify-between px-10 py-14">

{/* Top */}

<div className="text-center">

<p className="text-[20px] font-bold tracking-[0.35em]">
MELA ACTIVE
</p>

<p className="mt-2 text-[13px] tracking-[0.3em] opacity-60">
WINTER CHALLENGE
</p>

</div>

{/* Middle */}

<div className="flex flex-col items-center">

<div className="flex items-end">

<span className="text-[95px] font-bold leading-none">
{day}
</span>

<span className="mb-2 ml-2 text-[42px] font-medium opacity-70">
/45
</span>

</div>

<p className="mt-8 max-w-[300px] text-center text-[22px] italic font-medium leading-[1.3]">
"{quote}"
</p>

</div>

{/* Bottom */}

<div className="flex flex-col items-center">

<div className="mb-4 text-[22px] font-bold tracking-[0.25em] text-[#00A86B]">
{Math.round((day/45)*100)}% COMPLETE
</div>

<div className="h-[6px] w-[220px] rounded-full bg-gray-200">

<div
className="h-full rounded-full bg-[#00A86B]"
style={{
width:`${(day/45)*100}%`
}}
/>

</div>

<p className="mt-8 text-[18px] font-bold tracking-[0.25em]">
@MELAACTIVE
</p>

</div>

</div>

</div>

);

});