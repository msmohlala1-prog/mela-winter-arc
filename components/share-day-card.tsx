"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShareDayCardProps {
  day:number;
  className?:string;
}

export const ShareDayCard = forwardRef<
HTMLDivElement,
ShareDayCardProps
>(function ShareDayCard(
{day,className},
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
"movement is a privillege",
"discipline is real self respect",
"sexy of me to work out in winter",
"wellness is the flex",
"stronger every day",
"understood the assignment",
"it's giving discipline",
"chose hard",
];

const quote = quotes[day % quotes.length];

return(

<div
ref={ref}
className={cn(
"relative aspect-[9/16] w-full overflow-hidden rounded-[50px] bg-transparent",
className
)}
>

<div className="flex h-full flex-col justify-between px-12 py-14">

{/* TOP */}

<div className="text-center">

<p className="text-[16px] font-bold tracking-[0.4em] text-black">

MELA ACTIVE

</p>

<p className="mt-2 text-[11px] tracking-[0.35em] text-black/40">

WINTER CHALLENGE

</p>

</div>


{/* CENTER */}

<div className="flex flex-col items-center flex-1 justify-center">

<p className="mb-3 text-[13px] tracking-[0.5em] text-black/35">

DAY

</p>

<div className="flex items-end">

<h1 className="text-[85px] font-bold leading-none text-black">

{day}

</h1>

<p className="mb-2 ml-2 text-[38px] text-black/45 font-medium">

/45

</p>

</div>

<p className="mt-6 max-w-[280px] text-center text-[24px] italic font-medium leading-[1.4] text-black">

"{quote}"

</p>

</div>


{/* BOTTOM */}

<div className="flex flex-col items-center">

<p className="text-[18px] font-semibold tracking-[0.25em] text-[#00A86B]">

{Math.round((day/45)*100)}% COMPLETE

</p>

<div className="mt-4 h-[6px] w-[220px] rounded-full bg-black/10">

<div
className="h-full rounded-full rounded-full bg-[#00A86B]"
style={{
width:`${(day/45)*100}%`
}}
/>

</div>

<p className="mt-8 text-[15px] font-bold tracking-[0.3em] text-black">

@MELAACTIVE

</p>

</div>

</div>

</div>

)

});