import Link from "next/link";
import { MelaLogo } from "@/components/mela-logo";

const lockInRules = ["30 min movement", "Whole foods", "No alcohol", "No added sugar", "No takeout"];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-12 pt-5 sm:max-w-lg sm:px-6">
      <section className="animate-rise rounded-[2rem] border border-black/8 bg-white/92 px-6 pb-8 pt-14 shadow-soft">
        <MelaLogo subtle className="text-black" />
        <h1 className="mt-8 font-display text-[3.9rem] leading-[0.88] tracking-[-0.05em] text-black sm:text-[4.6rem]">
          Mela
          <br />
          The Winter Arc
        </h1>
        <p className="mt-5 text-lg font-medium tracking-[-0.02em] text-black/78">45 days. No shortcuts.</p>
        <p className="mt-10 max-w-sm text-[1.02rem] leading-8 text-black/62">
          Move this winter. That&apos;s it.
          <br />
          However you move, whatever that looks like ... just don&apos;t stop.
        </p>

        <div className="mt-12">
          <Link
            href="/join"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition duration-300 hover:translate-y-[-1px] hover:bg-black/92"
          >
            Join the Arc
          </Link>
          <p className="mt-3 text-center text-xs tracking-[0.08em] text-black/42">Free.</p>
        </div>
      </section>

      <section className="mt-4 animate-rise rounded-[2rem] border border-black/8 bg-[#f5f1ea] px-6 py-7 shadow-soft [animation-delay:80ms]">
        <p className="text-xs uppercase tracking-[0.24em] text-black/42">Challenge</p>
        <p className="mt-3 font-display text-[2.4rem] leading-none tracking-[-0.04em] text-black">June 1 to July 15</p>
        <p className="mt-4 text-sm leading-7 text-black/58">
          5 days of discipline.
          <br />
          2 days to reset.
        </p>
        <div className="mt-8 border-t border-black/8 pt-6">
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">Lock In</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-black/66">
            {lockInRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-black/58">Soft days keep you moving. Lock In days keep the standard.</p>
        </div>
      </section>

      <footer className="pb-4 pt-8 text-center text-xs uppercase tracking-[0.2em] text-black/34">Mela Winter Arc</footer>
    </main>
  );
}
