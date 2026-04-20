import type { ChallengeState, DailyCheckIn } from "@/lib/types";
import { defaultChallengeState } from "@/lib/challenge";

type SupabaseLike = any;

function normalizeDailyCheckins(rows: Record<string, any>[] | null | undefined): DailyCheckIn[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((row) => ({
    date: row.checkin_date,
    dayNumber: row.day_number,
    mode: row.mode,
    completedHabits: row.completed_habits ?? [],
    weeklyClassCompleted: row.weekly_class_completed ?? false,
    status: row.status
  }));
}

export async function loadChallengeState(
  supabase: SupabaseLike,
  userId: string
): Promise<ChallengeState> {
  try {
    const aggregateQuery = supabase.from("challenge_states").select("*");
    const { data: aggregateRow } = await aggregateQuery.eq("user_id", userId).maybeSingle();

    const dailyQuery = supabase.from("daily_checkins").select("*");
    const { data: dailyRows } = await dailyQuery
      .eq("user_id", userId)
      .order("checkin_date", { ascending: true });

    return {
      ...defaultChallengeState,
      successfulDays: aggregateRow?.successful_days ?? 0,
      streak: aggregateRow?.streak ?? 0,
      longestStreak: aggregateRow?.longest_streak ?? 0,
      resetCount: aggregateRow?.reset_count ?? 0,
      lastCompletedDate: aggregateRow?.last_completed_date ?? null,
      latestMessage: aggregateRow?.latest_message ?? null,
      dailyCheckIns: normalizeDailyCheckins(dailyRows)
    };
  } catch {
    return defaultChallengeState;
  }
}

export async function syncChallengeState(
  supabase: SupabaseLike,
  userId: string,
  state: ChallengeState
) {
  try {
    const latestCheckIn = [...state.dailyCheckIns].sort((a, b) => a.date.localeCompare(b.date)).pop();

    await supabase.from("challenge_states").upsert({
      user_id: userId,
      successful_days: state.successfulDays,
      streak: state.streak,
      longest_streak: state.longestStreak,
      reset_count: state.resetCount,
      last_completed_date: state.lastCompletedDate,
      latest_message: state.latestMessage
    }, { onConflict: "user_id" });

    if (latestCheckIn) {
      await supabase.from("daily_checkins").upsert({
        user_id: userId,
        checkin_date: latestCheckIn.date,
        mode: latestCheckIn.mode,
        day_number: latestCheckIn.dayNumber,
        completed_habits: latestCheckIn.completedHabits,
        weekly_class_completed: latestCheckIn.weeklyClassCompleted,
        status: latestCheckIn.status
      }, { onConflict: "user_id,checkin_date" });
    }
  } catch {
    return;
  }
}
