import { addDays, formatISO } from "date-fns";

export const CHALLENGE_NAME = "Mela Winter Arc";
export const CHALLENGE_START = new Date("2026-06-01T00:00:00");
export const CHALLENGE_END = new Date("2026-07-15T23:59:59");
export const TOTAL_DAYS = 45;
export const STORAGE_KEY = "mela-winter-arc-state";

export const GREAT_LOCK_IN_TASKS = [
  "30 minutes intentional movement",
  "Whole foods only",
  "No sugar",
  "No alcohol",
  "No takeout"
] as const;

export const SOFT_LOCK_IN_TASKS = [
  "Rest or light movement",
  "One intentional treat",
  "Stay in control"
] as const;

export const ALL_CHALLENGE_DATES = Array.from({ length: TOTAL_DAYS }, (_, index) =>
  formatISO(addDays(CHALLENGE_START, index), { representation: "date" })
);
