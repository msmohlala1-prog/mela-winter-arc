export type ChallengeMode = "great" | "soft";
export type DayStatus = "pending" | "complete" | "failed";

export interface DailyCheckIn {
  date: string;
  mode: ChallengeMode;
  dayNumber: number;
  completedHabits: string[];
  weeklyClassCompleted: boolean;
  status: DayStatus;
}

export interface ChallengeState {
  successfulDays: number;
  streak: number;
  longestStreak: number;
  resetCount: number;
  lastCompletedDate: string | null;
  latestMessage: string | null;
  dailyCheckIns: DailyCheckIn[];
}

export interface DailySummary {
  date: string;
  label: string;
  mode: ChallengeMode;
  isInChallengeWindow: boolean;
  dayNumber: number;
  percentageComplete: number;
  status: "upcoming" | "live" | "complete";
}
