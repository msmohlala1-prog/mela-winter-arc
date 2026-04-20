import {
  differenceInCalendarDays,
  endOfWeek,
  format,
  formatISO,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfWeek
} from "date-fns";
import {
  ALL_CHALLENGE_DATES,
  CHALLENGE_END,
  CHALLENGE_START,
  GREAT_LOCK_IN_TASKS,
  SOFT_LOCK_IN_TASKS,
  TOTAL_DAYS
} from "@/lib/constants";
import type { ChallengeMode, ChallengeState, DailyCheckIn, DailySummary } from "@/lib/types";

export const defaultChallengeState: ChallengeState = {
  successfulDays: 0,
  streak: 0,
  longestStreak: 0,
  resetCount: 0,
  lastCompletedDate: null,
  latestMessage: null,
  dailyCheckIns: []
};

export function getChallengeMode(date: Date): ChallengeMode {
  const day = date.getDay();
  return day === 0 || day === 6 ? "soft" : "great";
}

export function getTasksForMode(mode: ChallengeMode) {
  return mode === "great" ? [...GREAT_LOCK_IN_TASKS] : [...SOFT_LOCK_IN_TASKS];
}

export function getCurrentChallengeDay(successfulDays: number) {
  return Math.min(Math.max(successfulDays + 1, 1), TOTAL_DAYS);
}

export function getProgressPercentage(successfulDays: number) {
  return Math.round((Math.min(successfulDays, TOTAL_DAYS) / TOTAL_DAYS) * 100);
}

export function getMotivationalMessage(successfulDays: number) {
  if (successfulDays < 15) {
    return "Build the discipline";
  }

  if (successfulDays < 30) {
    return "You're locked in now";
  }

  return "Finish strong. No excuses.";
}

export function getWindowStatus(date: Date) {
  if (isBefore(date, CHALLENGE_START)) {
    return "before";
  }

  if (isAfter(date, CHALLENGE_END)) {
    return "after";
  }

  return "during";
}

export function createOrUpdateCheckIn(
  state: ChallengeState,
  payload: Omit<DailyCheckIn, "dayNumber"> & { dayNumber?: number }
) {
  const nextCheckIn: DailyCheckIn = {
    ...payload,
    dayNumber: payload.dayNumber ?? getCurrentChallengeDay(state.successfulDays)
  };

  const remaining = state.dailyCheckIns.filter((item) => item.date !== nextCheckIn.date);
  remaining.push(nextCheckIn);

  return {
    ...state,
    dailyCheckIns: remaining.sort((a, b) => a.date.localeCompare(b.date))
  };
}

export function getCheckInForDate(state: ChallengeState, date: string) {
  return state.dailyCheckIns.find((entry) => entry.date === date) ?? null;
}

export function isWeeklyClassSatisfied(state: ChallengeState, date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

  return state.dailyCheckIns.some((checkIn) => {
    const parsed = parseISO(checkIn.date);
    return (
      isWithinInterval(parsed, { start: weekStart, end: weekEnd }) &&
      checkIn.weeklyClassCompleted
    );
  });
}

export function isFriday(date: Date) {
  return date.getDay() === 5;
}

export function completeGreatLockInDay(
  state: ChallengeState,
  date: string,
  completedHabits: string[],
  weeklyClassCompleted: boolean
) {
  const parsedDate = parseISO(date);
  const weeklyRequirementMet = isFriday(parsedDate)
    ? weeklyClassCompleted || isWeeklyClassSatisfied(state, parsedDate)
    : true;
  const hasAllHabits = GREAT_LOCK_IN_TASKS.every((task) => completedHabits.includes(task));

  if (!hasAllHabits || !weeklyRequirementMet) {
    return failGreatLockIn(state, date);
  }

  const successfulDays = Math.min(state.successfulDays + 1, TOTAL_DAYS);
  const streak = state.streak + 1;

  return createOrUpdateCheckIn(
    {
      ...state,
      successfulDays,
      streak,
      longestStreak: Math.max(state.longestStreak, streak),
      lastCompletedDate: date,
      latestMessage: "You showed up. Stay locked in."
    },
    {
      date,
      mode: "great",
      completedHabits,
      weeklyClassCompleted,
      status: "complete"
    }
  );
}

export function completeSoftLockInDay(
  state: ChallengeState,
  date: string,
  completedHabits: string[]
) {
  const hasAllHabits = SOFT_LOCK_IN_TASKS.every((task) => completedHabits.includes(task));

  if (!hasAllHabits) {
    return createOrUpdateCheckIn(
      {
        ...state,
        streak: 0,
        latestMessage: "You didn't show up today. Tomorrow, we reset."
      },
      {
        date,
        mode: "soft",
        completedHabits,
        weeklyClassCompleted: false,
        status: "failed"
      }
    );
  }

  const successfulDays = Math.min(state.successfulDays + 1, TOTAL_DAYS);
  const streak = state.streak + 1;

  return createOrUpdateCheckIn(
    {
      ...state,
      successfulDays,
      streak,
      longestStreak: Math.max(state.longestStreak, streak),
      lastCompletedDate: date,
      latestMessage: "You showed up. Stay locked in."
    },
    {
      date,
      mode: "soft",
      completedHabits,
      weeklyClassCompleted: false,
      status: "complete"
    }
  );
}

export function failGreatLockIn(state: ChallengeState, date: string) {
  return createOrUpdateCheckIn(
    {
      ...state,
      successfulDays: 0,
      streak: 0,
      lastCompletedDate: null,
      resetCount: state.resetCount + 1,
      latestMessage: "You broke the lock in. We start again."
    },
    {
      date,
      mode: "great",
      completedHabits: [],
      weeklyClassCompleted: false,
      status: "failed",
      dayNumber: 1
    }
  );
}

export function getDailySummary(today: Date, successfulDays: number): DailySummary {
  const clampedDay =
    getWindowStatus(today) === "before"
      ? CHALLENGE_START
      : getWindowStatus(today) === "after"
        ? CHALLENGE_END
        : today;
  const offset = differenceInCalendarDays(clampedDay, CHALLENGE_START);
  const challengeDate = ALL_CHALLENGE_DATES[Math.max(0, Math.min(offset, TOTAL_DAYS - 1))];

  return {
    date: challengeDate,
    label: format(clampedDay, "EEEE, MMMM d"),
    mode: getChallengeMode(clampedDay),
    isInChallengeWindow: getWindowStatus(today) === "during",
    dayNumber: getCurrentChallengeDay(successfulDays),
    percentageComplete: getProgressPercentage(successfulDays),
    status:
      getWindowStatus(today) === "before"
        ? "upcoming"
        : getWindowStatus(today) === "after"
          ? "complete"
          : "live"
  };
}

export function formatArcDates() {
  return `${format(CHALLENGE_START, "MMMM d")} - ${format(CHALLENGE_END, "MMMM d, yyyy")}`;
}

export function isTodayAlreadyCompleted(state: ChallengeState, date: Date) {
  if (!state.lastCompletedDate) {
    return false;
  }

  return isSameDay(parseISO(state.lastCompletedDate), date);
}

export function formatDateKey(date: Date) {
  return formatISO(date, { representation: "date" });
}
