"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Flame, Lock, LockOpen, RefreshCcw, Share2, Sparkles } from "lucide-react";
import { toPng } from "html-to-image";
import {
  completeGreatLockInDay,
  completeSoftLockInDay,
  defaultChallengeState,
  failGreatLockIn,
  formatArcDates,
  formatDateKey,
  getCurrentChallengeDay,
  getDailySummary,
  getMotivationalMessage,
  getProgressPercentage,
  getTasksForMode,
  getWindowStatus,
  isFriday,
  isWeeklyClassSatisfied
} from "@/lib/challenge";
import { STORAGE_KEY } from "@/lib/constants";
import type { ChallengeState } from "@/lib/types";
import { ShareCard } from "@/components/share-card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { syncChallengeState } from "@/lib/supabase/state";

interface ChallengeDashboardProps {
  initialState: ChallengeState | null;
  canSync: boolean;
}

function loadLocalState() {
  if (typeof window === "undefined") {
    return defaultChallengeState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultChallengeState;
  }

  try {
    return JSON.parse(raw) as ChallengeState;
  } catch {
    return defaultChallengeState;
  }
}

export function ChallengeDashboard({ initialState, canSync }: ChallengeDashboardProps) {
  const hasInitialState =
    Boolean(initialState?.dailyCheckIns.length) ||
    Boolean(initialState?.successfulDays) ||
    Boolean(initialState?.latestMessage);
  const [state, setState] = useState<ChallengeState>(() =>
    hasInitialState && initialState ? initialState : defaultChallengeState
  );
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [weeklyClassDoneToday, setWeeklyClassDoneToday] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "sharing" | "saved">("idle");
  const [userId, setUserId] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());
  const shareRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date(), []);
  const todayKey = formatDateKey(today);
  const dailySummary = useMemo(() => getDailySummary(today, state.successfulDays), [today, state.successfulDays]);
  const mode = dailySummary.mode;
  const tasks = getTasksForMode(mode);
  const weeklyClassAlreadyDone = isWeeklyClassSatisfied(state, today);
  const progressPercentage = getProgressPercentage(state.successfulDays);
  const windowStatus = getWindowStatus(today);
  const statusLabel = mode === "great" ? "Lock In" : "Soft Lock In";
  const isFridayLockIn = mode === "great" && isFriday(today);
  const message = state.latestMessage ?? getMotivationalMessage(state.successfulDays);
  const todayCheckIn = state.dailyCheckIns.find((entry) => entry.date === todayKey) ?? null;
  const submissionLocked = todayCheckIn?.status === "complete" || todayCheckIn?.status === "failed";

  useEffect(() => {
    if (!hasInitialState) {
      setState(loadLocalState());
    }
  }, [hasInitialState]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, [supabase]);

  function persist(nextState: ChallengeState) {
    setState(nextState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));

    if (supabase && userId) {
      void syncChallengeState(supabase, userId, nextState);
    }
  }

  function toggleHabit(habit: string) {
    setSelectedHabits((current) =>
      current.includes(habit) ? current.filter((item) => item !== habit) : [...current, habit]
    );
  }

  function resetSelectors() {
    setSelectedHabits([]);
    setWeeklyClassDoneToday(false);
  }

  function handleSubmit() {
    if (windowStatus !== "during" || submissionLocked) {
      return;
    }

    const nextState =
      mode === "great"
        ? completeGreatLockInDay(state, todayKey, selectedHabits, weeklyClassDoneToday)
        : completeSoftLockInDay(state, todayKey, selectedHabits);

    persist(nextState);
    resetSelectors();
  }

  function handleBreakLockIn() {
    if (submissionLocked || windowStatus !== "during") {
      return;
    }

    const nextState = failGreatLockIn(state, todayKey);
    persist(nextState);
    resetSelectors();
  }

  useEffect(() => {
    if (!todayCheckIn) {
      return;
    }

    setSelectedHabits(todayCheckIn.completedHabits);
    setWeeklyClassDoneToday(todayCheckIn.weeklyClassCompleted);
  }, [todayCheckIn]);

  async function handleShare() {
    if (!shareRef.current) {
      return;
    }

    try {
      setShareState("sharing");
      const dataUrl = await toPng(shareRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "mela-winter-arc-card.png", { type: "image/png" });
      const shareText = `Mela Winter Arc • Day ${getCurrentChallengeDay(state.successfulDays)} of 45 • ${statusLabel} • Streak ${state.streak}`;

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Mela Winter Arc",
          text: shareText,
          files: [file]
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "mela-winter-arc-card.png";
        link.click();
      }

      setShareState("saved");
      window.setTimeout(() => setShareState("idle"), 1600);
    } catch {
      setShareState("idle");
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-5 sm:px-6">
      <div className="space-y-5">
        <section className="glass-panel animate-rise overflow-hidden rounded-[2rem] border border-white/70 px-5 py-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink/45">Mela Winter Arc</p>
              <h1 className="mt-3 max-w-[12rem] font-display text-[2.7rem] leading-none text-ink">
                Winter discipline. Soft grace.
              </h1>
            </div>
            <div className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-right text-[11px] uppercase tracking-[0.22em] text-ink/55">
              {canSync ? "Supabase ready" : "Local mode"}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-soft-emerald px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald/70">Day</p>
              <p className="mt-2 font-display text-3xl leading-none text-emerald">
                {getCurrentChallengeDay(state.successfulDays)}
                <span className="text-lg text-emerald/55"> / 45</span>
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white px-4 py-4 shadow-soft">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Streak</p>
              <p className="mt-2 flex items-center gap-2 font-display text-3xl leading-none text-ink">
                <Flame className="h-5 w-5 text-emerald" />
                {state.streak}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-ink/60">
              <span>{progressPercentage}% complete</span>
              <span>{formatArcDates()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-emerald transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(15,61,46,0.1),_transparent_60%)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald">
              <Sparkles className="h-4 w-4" />
              {getMotivationalMessage(state.successfulDays)}
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/65">{message}</p>
          </div>
        </section>

        <section className="glass-panel animate-rise rounded-[2rem] border border-white/70 px-5 py-6 shadow-card [animation-delay:100ms]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/42">Today's alignment</p>
              <h2 className="mt-2 font-display text-3xl leading-none text-ink">{dailySummary.label}</h2>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]",
                mode === "great" ? "bg-emerald text-white" : "bg-soft-emerald text-emerald"
              )}
            >
              {mode === "great" ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
              {mode === "great" ? "The Great Lock In" : "Soft Lock In"}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => {
              const checked = selectedHabits.includes(task);

              return (
                <button
                  key={task}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[1.5rem] border px-4 py-4 text-left transition",
                    checked
                      ? "border-transparent bg-soft-emerald shadow-soft"
                      : "border-ink/8 bg-white hover:border-emerald/30"
                  )}
                  type="button"
                  onClick={() => toggleHabit(task)}
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{task}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/42">
                      {checked ? "Locked" : "Tap to confirm"}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border transition",
                      checked ? "border-emerald bg-emerald text-white" : "border-ink/15 bg-canvas text-transparent"
                    )}
                  >
                    ✓
                  </div>
                </button>
              );
            })}
          </div>

          {mode === "great" ? (
            <div className="mt-4 rounded-[1.5rem] border border-emerald/10 bg-white px-4 py-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Weekly task</p>
                  <p className="mt-2 text-sm font-semibold text-ink">Join a class or club 1x this week</p>
                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    {weeklyClassAlreadyDone
                      ? "This week is already covered."
                      : isFridayLockIn
                        ? "Friday check-ins need this completed before the week closes."
                        : "You can tick this on the day you complete it."}
                  </p>
                </div>
                <button
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                    weeklyClassAlreadyDone || weeklyClassDoneToday
                      ? "bg-emerald text-white"
                      : "bg-soft-emerald text-emerald"
                  )}
                  type="button"
                  onClick={() => setWeeklyClassDoneToday((current) => !current)}
                >
                  {weeklyClassAlreadyDone || weeklyClassDoneToday ? "Done" : "Mark done"}
                </button>
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "mt-5 rounded-[1.5rem] px-4 py-4 text-sm leading-6",
              state.latestMessage?.includes("broke")
                ? "bg-soft-red text-danger"
                : "bg-soft-emerald text-emerald"
            )}
          >
            {mode === "great"
              ? "No partial completion allowed. If any weekday rule breaks, your progress resets to Day 1."
              : "Weekends are softer, but they still count toward your streak if you follow through."}
          </div>

          {windowStatus !== "during" ? (
            <div className="mt-5 rounded-[1.5rem] bg-white px-4 py-4 text-sm leading-6 text-ink/65 shadow-soft">
              {windowStatus === "before"
                ? "The challenge window opens on June 1, 2026. You can use this screen as your preview and save the design now."
                : "The 2026 arc has ended. Your progress card stays visible, and you can duplicate the system for the next season."}
            </div>
          ) : null}

          {submissionLocked ? (
            <div className="mt-5 rounded-[1.5rem] bg-white px-4 py-4 text-sm leading-6 text-ink/65 shadow-soft">
              Today's check-in is already locked. Come back tomorrow for the next alignment.
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="rounded-full bg-emerald px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-55"
              disabled={submissionLocked || windowStatus !== "during"}
              type="button"
              onClick={handleSubmit}
            >
              Complete today's alignment
            </button>
            {mode === "great" ? (
              <button
                className="rounded-full border border-danger/18 bg-soft-red px-4 py-3 text-sm font-semibold text-danger transition hover:border-danger/30 disabled:opacity-55"
                disabled={submissionLocked || windowStatus !== "during"}
                type="button"
                onClick={handleBreakLockIn}
              >
                I broke the lock in
              </button>
            ) : (
              <button
                className="rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-emerald/25 disabled:opacity-55"
                disabled={submissionLocked || windowStatus !== "during"}
                type="button"
                onClick={() => persist({ ...state, streak: 0, latestMessage: "You didn't show up today. Tomorrow, we reset." })}
              >
                Missed today
              </button>
            )}
          </div>
        </section>

        <section className="glass-panel animate-rise rounded-[2rem] border border-white/70 px-5 py-6 shadow-card [animation-delay:180ms]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/42">Share your arc</p>
              <h2 className="mt-2 font-display text-3xl leading-none text-ink">Shareable progress card</h2>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55 shadow-soft">
              Premium
            </div>
          </div>
          <ShareCard
            ref={shareRef}
            className="mt-5"
            dayNumber={getCurrentChallengeDay(state.successfulDays)}
            progressPercentage={progressPercentage}
            statusLabel={statusLabel}
            streak={state.streak}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="rounded-full bg-emerald px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              type="button"
              onClick={handleShare}
            >
              <span className="inline-flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                {shareState === "sharing" ? "Preparing card..." : "Share card"}
              </span>
            </button>
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-emerald/25"
              type="button"
              onClick={handleShare}
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                {shareState === "saved" ? "Saved" : "Download image"}
              </span>
            </button>
          </div>
        </section>

        <section className="animate-rise rounded-[2rem] bg-[#fffdfa] px-5 py-6 shadow-soft [animation-delay:240ms]">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink/42">
            <RefreshCcw className="h-4 w-4 text-emerald" />
            Reset rules
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/68">
            <li>Weekdays are strict. Miss any Great Lock In rule and progress resets to Day 1.</li>
            <li>Your streak resets on every failed day.</li>
            <li>Friday Great Lock In check-ins expect the weekly class or club task to be complete.</li>
            <li>The challenge window is fixed: June 1, 2026 to July 15, 2026.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
