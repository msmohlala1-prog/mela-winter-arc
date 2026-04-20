"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";
import { TOTAL_DAYS } from "@/lib/constants";
import { MelaLogo } from "@/components/mela-logo";
import { ShareDayCard } from "@/components/share-day-card";
import {
  ArcState,
  ArcMode,
  canSelectMode,
  getAvailableModes,
  getChecklistForMode,
  getCompletedDays,
  getCurrentDay,
  getDaysToGo,
  getMissedLockInDate,
  getProgress,
  loadArcState,
  markDayComplete,
  persistArcState,
  resetArc,
  shouldRedirectToJoin,
  shouldShowWelcome,
  toDateKey,
  touchArc
} from "@/lib/winter-arc";

export function WinterArcDashboard() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const [state, setState] = useState<ArcState | null>(null);
  const [selectedMode, setSelectedMode] = useState<ArcMode>("lock-in");
  const [checked, setChecked] = useState<string[]>([]);
  const [pendingReset, setPendingReset] = useState(false);
  const [showBrokenStandard, setShowBrokenStandard] = useState(false);
  const [checklistWarning, setChecklistWarning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadArcState();

    if (!stored || shouldRedirectToJoin(stored)) {
      router.replace("/join");
      return;
    }

    if (shouldShowWelcome(stored)) {
      router.replace("/welcome");
      return;
    }

    const missedDate = getMissedLockInDate(stored, today);
    const hydrated = touchArc(stored, today);
    persistArcState(hydrated);
    setState(hydrated);
    setChecked([]);
    setSelectedMode("lock-in");

    if (missedDate) {
      setPendingReset(true);
    }
  }, [router, today]);

  const availableModes = useMemo(() => getAvailableModes(today), [today]);
  const checklist = useMemo(() => getChecklistForMode(selectedMode), [selectedMode]);
  const allChecked = checked.length === checklist.length;
  const completedToday = state ? state.entries.some((entry) => entry.date === todayKey && entry.completed) : false;
  const completedDays = state ? getCompletedDays(state) : 0;
  const progress = state ? getProgress(state) : 0;
  const currentDay = state ? getCurrentDay(state) : 1;
  const daysToGo = state ? getDaysToGo(state) : TOTAL_DAYS;
  const shareDay = Math.max(completedDays, 1);

  useEffect(() => {
    if (!completionNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCompletionNotice(null), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [completionNotice]);

  function toggleItem(itemId: string) {
    setChecklistWarning(false);
    setChecked((current) =>
      current.includes(itemId) ? current.filter((item) => item !== itemId) : [...current, itemId]
    );
  }

  function resetToDayOne() {
    if (!state) {
      return null;
    }

    const nextState = resetArc(state, today);
    persistArcState(nextState);
    setState(nextState);
    setSelectedMode("lock-in");
    setChecked([]);
    setChecklistWarning(false);
    setCompletionNotice(null);

    return nextState;
  }

  function handleStartAgain() {
    const nextState = resetToDayOne();

    if (!nextState) {
      return;
    }

    setPendingReset(false);
    setShowBrokenStandard(true);
  }

  function handleBeginAgain() {
    if (pendingReset) {
      resetToDayOne();
      setPendingReset(false);
    }

    setShowBrokenStandard(false);
  }

  function handleSubmit() {
    if (!state || completedToday || pendingReset) {
      return;
    }

    if (!allChecked) {
      setChecklistWarning(true);
      setCompletionNotice(null);
      return;
    }

    const modeForCompletion = selectedMode;
    const nextState = markDayComplete(state, today, modeForCompletion);
    persistArcState(nextState);
    setState(nextState);
    setChecked([]);
    setChecklistWarning(false);
    setCompletionNotice(modeForCompletion === "lock-in" ? "Day complete. Locked in." : "Day complete. Still in it.");
  }

  function handleModeChange(mode: ArcMode) {
    if (!canSelectMode(today, mode) || pendingReset) {
      return;
    }

    setSelectedMode(mode);
    setChecked([]);
    setChecklistWarning(false);
  }

  async function handleDownloadShare() {
    if (!shareCardRef.current) {
      return;
    }

    try {
      setDownloading(true);
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `mela-winter-arc-day-${shareDay}.png`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
    }
  }

  if (!state) {
    return null;
  }

  return (
    <>
      <section className="soft-panel animate-rise rounded-[2rem] border border-black/8 px-5 py-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-black/38">Day {currentDay} of {TOTAL_DAYS}</p>
            <h1 className="mt-2 font-display text-[3.15rem] leading-[0.92] tracking-[-0.05em] text-black">Winter Arc</h1>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-black/38">{daysToGo} days to go</p>
          </div>
          <MelaLogo subtle className="mt-1 text-black" />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-black/42">
            <span>{progress}% complete</span>
            <span>{completedToday ? "Today logged" : "Log today"}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#111111_0%,#2f2f2f_55%,#111111_100%)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-[1.6rem] bg-[#f6f2ec] px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-black/42">Today&apos;s standard</p>
              <p className="mt-2 text-sm leading-6 text-black/56">
                {selectedMode === "lock-in" ? (
                  "Weekday discipline. Miss it and the arc resets."
                ) : (
                  <>
                    Weekends are for recovery.
                    <br />
                    Light movement or full rest. You’re still in the arc.
                  </>
                )}
              </p>
            </div>
            <div className="rounded-full bg-white p-1">
              <div className="flex items-center gap-1">
                {availableModes.map((mode) => {
                  const active = selectedMode === mode;
                  const disabled = !canSelectMode(today, mode);

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleModeChange(mode)}
                      disabled={disabled}
                      className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition duration-300 ${
                        active ? "bg-black text-white" : "bg-transparent text-black/44"
                      } ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-black"}`}
                    >
                      {mode === "lock-in" ? "Lock In" : "Soft"}
                    </button>
                  );
                })}
              </div>
            </div>
        </div>

          <div className="mt-5 space-y-3">
            {checklist.map((item) => {
              const isChecked = checked.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-center gap-3 rounded-[1.4rem] bg-white px-4 py-4 text-left transition-all duration-300 hover:translate-y-[-1px]"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition duration-300 ${
                      isChecked
                        ? "scale-105 border-black bg-black text-white shadow-[0_8px_20px_rgba(17,17,17,0.14)]"
                        : "scale-100 border-black/14 bg-transparent text-transparent"
                    }`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 transition-all duration-300 ${
                        isChecked ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      }`}
                    />
                  </span>
                  <span className={`text-sm transition-all duration-300 ${isChecked ? "text-black/42 line-through" : "text-black/78"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-6 text-black/42">
            {selectedMode === "lock-in"
              ? "Every rule must be checked before today can count."
              : "Soft days count as showing up without resetting your progress."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={completedToday || pendingReset}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition duration-300 hover:translate-y-[-1px] hover:bg-black/92 disabled:cursor-not-allowed disabled:bg-black/18"
        >
          {completedToday ? "Already done today" : "I showed up today"}
        </button>

        {checklistWarning ? (
          <div className="mt-5 rounded-[1.4rem] bg-[#f6f2ec] px-4 py-4 text-center">
            <p className="text-sm font-medium text-black/72">You didn&apos;t complete your checklist.</p>
            <p className="mt-2 text-xs text-black/42">Missed something? Start again.</p>
            <button
              type="button"
              onClick={handleStartAgain}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition duration-300 hover:translate-y-[-1px] hover:bg-black/92"
            >
              Start again
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleDownloadShare}
          disabled={downloading || completedDays === 0}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-black/8 bg-[#f7f4ef] px-6 text-sm font-medium text-black transition duration-300 hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Preparing your image" : "Share your Day"}
        </button>

        {completionNotice ? <p className="mt-5 text-center text-sm text-black/52">{completionNotice}</p> : null}
        <p className="mt-2 text-center text-xs text-black/36">Progress is saved on this device.</p>
      </section>

      <footer className="pb-3 pt-8 text-center text-xs leading-6 text-black/36">
        Be part of the community
        <br />
        @melaactive
      </footer>

      {pendingReset || showBrokenStandard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f3eee6]/96 px-5">
          <div className="w-full max-w-sm rounded-[2rem] bg-black px-6 py-8 text-white shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-white/52">You broke the standard.</p>
            <h2 className="mt-4 font-display text-5xl leading-[0.9] tracking-[-0.05em]">Day 1. Again.</h2>
            <p className="mt-5 text-sm leading-7 text-white/70">
              This isn&apos;t punishment. This is the standard you chose.
            </p>
            <button
              type="button"
              onClick={handleBeginAgain}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition duration-300 hover:translate-y-[-1px]"
            >
              Begin again
            </button>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed left-[-9999px] top-0 w-[1080px]">
        <ShareDayCard ref={shareCardRef} day={shareDay} />
      </div>
    </>
  );
}
