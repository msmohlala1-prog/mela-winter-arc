import { addDays, differenceInCalendarDays, eachDayOfInterval, endOfDay, format, isAfter, isBefore } from "date-fns";
import { TOTAL_DAYS } from "@/lib/constants";

export type ArcMode = "lock-in" | "soft";

export interface ArcEntry {
  date: string;
  mode: ArcMode;
  completed: boolean;
}

export interface ArcState {
  name: string;
  email: string;
  startedAt: string;
  lastSeenDate: string;
  entries: ArcEntry[];
  resetCount: number;
  hasSeenWelcome: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export const WINTER_ARC_STORAGE_KEY = "mela-winter-arc-v2";

export const defaultArcState = (today = new Date()): ArcState => ({
  name: "",
  email: "",
  startedAt: toDateKey(today),
  lastSeenDate: toDateKey(today),
  entries: [],
  resetCount: 0,
  hasSeenWelcome: false
});

export function toDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function fromDateKey(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function getSuggestedMode(date: Date): ArcMode {
  const day = date.getDay();
  return day === 0 || day === 6 ? "soft" : "lock-in";
}

export function getChecklistForMode(mode: ArcMode): ChecklistItem[] {
  return mode === "lock-in"
    ? [
        { id: "movement", label: "30 min movement" },
        { id: "whole-foods", label: "Whole foods" },
        { id: "no-alcohol", label: "No alcohol" },
        { id: "no-added-sugar", label: "No added sugar" },
        { id: "no-takeout", label: "No takeout" }
      ]
    : [
        { id: "light-movement-rest", label: "Light movement or rest" },
        { id: "intentional-treat", label: "One intentional treat" }
      ];
}

export function getAvailableModes(date: Date): ArcMode[] {
  void date;
  return ["lock-in", "soft"];
}

export function canSelectMode(date: Date, mode: ArcMode) {
  void date;
  void mode;
  return true;
}

export function getCompletedDays(state: ArcState) {
  return state.entries.filter((entry) => entry.completed).length;
}

export function getCurrentDay(state: ArcState) {
  return Math.min(getCompletedDays(state) + 1, TOTAL_DAYS);
}

export function getProgress(state: ArcState) {
  return Math.round((getCompletedDays(state) / TOTAL_DAYS) * 100);
}

export function getDaysToGo(state: ArcState) {
  return Math.max(TOTAL_DAYS - getCompletedDays(state), 0);
}

export function hasCompletedDate(state: ArcState, dateKey: string) {
  return state.entries.some((entry) => entry.date === dateKey && entry.completed);
}

export function markDayComplete(state: ArcState, date: Date, mode: ArcMode) {
  const dateKey = toDateKey(date);
  const remaining = state.entries.filter((entry) => entry.date !== dateKey);

  return {
    ...state,
    lastSeenDate: dateKey,
    entries: [...remaining, { date: dateKey, mode, completed: true }].sort((a, b) => a.date.localeCompare(b.date))
  };
}

export function resetArc(state: ArcState, today = new Date()) {
  const todayKey = toDateKey(today);

  return {
    ...state,
    startedAt: todayKey,
    lastSeenDate: todayKey,
    entries: [],
    resetCount: state.resetCount + 1
  };
}

export function touchArc(state: ArcState, today = new Date()) {
  return {
    ...state,
    lastSeenDate: toDateKey(today)
  };
}

export function getMissedLockInDate(state: ArcState, today = new Date()) {
  const start = fromDateKey(state.startedAt);
  const yesterday = addDays(today, -1);

  if (isAfter(start, endOfDay(yesterday))) {
    return null;
  }

  return (
    eachDayOfInterval({ start, end: yesterday }).find((date) => {
      if (getSuggestedMode(date) !== "lock-in") {
        return false;
      }

      return !hasCompletedDate(state, toDateKey(date));
    }) ?? null
  );
}

export function getDayLabel(state: ArcState, today = new Date()) {
  const arcDay = Math.min(
    Math.max(differenceInCalendarDays(today, fromDateKey(state.startedAt)) + 1, 1),
    TOTAL_DAYS
  );

  return `Day ${arcDay} of ${TOTAL_DAYS}`;
}

export function getCompletionText(state: ArcState) {
  const completedDays = getCompletedDays(state);

  if (completedDays >= TOTAL_DAYS) {
    return "Arc complete.";
  }

  if (completedDays === 0) {
    return "Consistency > perfection.";
  }

  if (completedDays < 15) {
    return "Quiet discipline is still discipline.";
  }

  if (completedDays < 30) {
    return "You are becoming someone you can trust.";
  }

  return "Keep the standard. Finish with intention.";
}

export function shouldRedirectToJoin(state: ArcState | null) {
  return !state || !state.startedAt;
}

export function shouldShowWelcome(state: ArcState | null) {
  return Boolean(state && !state.hasSeenWelcome);
}

export function loadArcState() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(WINTER_ARC_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ArcState;
  } catch {
    return null;
  }
}

export function persistArcState(state: ArcState) {
  window.localStorage.setItem(WINTER_ARC_STORAGE_KEY, JSON.stringify(state));
}

export function isArcExpired(state: ArcState, today = new Date()) {
  const finalDay = addDays(fromDateKey(state.startedAt), TOTAL_DAYS - 1);
  return isBefore(finalDay, today);
}
