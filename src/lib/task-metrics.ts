// Pure, dependency-free helpers for turning real task rows into dashboard
// metrics. Kept separate from any component so they're easy to reason
// about and reuse from both the client dashboard and (later, if needed)
// server-rendered summaries.

export interface MetricTask {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  timeframe: "today" | "upcoming";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const PRIORITY_WEIGHT: Record<MetricTask["priority"], number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

/** Parses strings like "45m", "1h", "1h 30m", "2h" into total minutes. */
export function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*h/i);
  const minutesMatch = duration.match(/(\d+(?:\.\d+)?)\s*m/i);
  const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseFloat(minutesMatch[1]) : 0;
  const total = hours * 60 + minutes;
  return Number.isFinite(total) ? total : 0;
}

export function formatMinutesAsHours(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0m";
  if (totalMinutes < 60) return `${Math.round(totalMinutes)}m`;
  return `${(totalMinutes / 60).toFixed(1)} hrs`;
}

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

/**
 * Priority-weighted completion score (0-100) for today's tasks. Returns
 * null when there are no tasks scheduled for today, so the UI can show an
 * explicit "no data yet" state instead of a fabricated number.
 */
export function computeFocusScore(tasks: MetricTask[]): number | null {
  const today = tasks.filter((t) => t.timeframe === "today");
  if (today.length === 0) return null;

  const totalWeight = today.reduce((sum, t) => sum + PRIORITY_WEIGHT[t.priority], 0);
  const completedWeight = today
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + PRIORITY_WEIGHT[t.priority], 0);

  if (totalWeight === 0) return null;
  return Math.round((completedWeight / totalWeight) * 100);
}

/**
 * Estimated focus time = sum of the stated durations of completed tasks
 * updated today. This is a real, task-data-derived estimate - not actual
 * tracked time, since the app doesn't run live work sessions.
 */
export function computeEstimatedFocusMinutesToday(tasks: MetricTask[]): number {
  const todayKey = dayKey(new Date().toISOString());
  return tasks
    .filter((t) => t.completed && dayKey(t.updatedAt) === todayKey)
    .reduce((sum, t) => sum + parseDurationToMinutes(t.duration), 0);
}

/** Sum of stated durations for all of today's tasks (completed or not). */
export function computeEstimatedTotalMinutesToday(tasks: MetricTask[]): number {
  return tasks
    .filter((t) => t.timeframe === "today")
    .reduce((sum, t) => sum + parseDurationToMinutes(t.duration), 0);
}

export interface ActivityBreakdownEntry {
  category: string;
  minutes: number;
  percent: number;
}

/** Duration-weighted percentage breakdown by category, across all tasks. */
export function computeActivityBreakdown(tasks: MetricTask[]): ActivityBreakdownEntry[] {
  if (tasks.length === 0) return [];

  const totals = new Map<string, number>();
  for (const task of tasks) {
    const minutes = parseDurationToMinutes(task.duration);
    totals.set(task.category, (totals.get(task.category) ?? 0) + minutes);
  }

  const totalMinutes = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  if (totalMinutes === 0) return [];

  const entries = Array.from(totals.entries())
    .map(([category, minutes]) => ({
      category,
      minutes,
      percent: Math.round((minutes / totalMinutes) * 100),
    }))
    .sort((a, b) => b.minutes - a.minutes);

  // Collapse anything past the top 4 into "Other" so the UI doesn't need
  // to render an unbounded legend.
  if (entries.length <= 4) return entries;
  const top = entries.slice(0, 4);
  const rest = entries.slice(4);
  const restMinutes = rest.reduce((sum, e) => sum + e.minutes, 0);
  top.push({
    category: "Other",
    minutes: restMinutes,
    percent: Math.round((restMinutes / totalMinutes) * 100),
  });
  return top;
}

/**
 * Consecutive-day streak (ending today) of days that have at least one
 * completed task. Uses each task's updatedAt as a proxy for "completed on
 * this day" since the app doesn't store a separate completedAt timestamp.
 */
export function computeStreak(tasks: MetricTask[]): number {
  const completedDays = new Set(
    tasks.filter((t) => t.completed).map((t) => dayKey(t.updatedAt))
  );
  if (completedDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (completedDays.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export interface VsAverageResult {
  hasEnoughData: boolean;
  todayCount: number;
  trailingAverage: number;
  diffPercent: number | null;
}

/**
 * Compares today's completed-task count to the trailing 7-day daily
 * average (days -7..-1), both derived from updatedAt. Returns
 * hasEnoughData=false when there's no completion history yet, so the UI
 * can avoid presenting a misleading comparison off a single data point.
 */
export function computeVsTrailingAverage(tasks: MetricTask[]): VsAverageResult {
  const completed = tasks.filter((t) => t.completed);
  const todayKey = dayKey(new Date().toISOString());

  const perDay = new Map<string, number>();
  for (const task of completed) {
    const key = dayKey(task.updatedAt);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  const todayCount = perDay.get(todayKey) ?? 0;

  let trailingSum = 0;
  let trailingDaysWithData = 0;
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = perDay.get(key);
    if (count !== undefined) {
      trailingSum += count;
      trailingDaysWithData += 1;
    }
  }

  if (trailingDaysWithData === 0) {
    return { hasEnoughData: false, todayCount, trailingAverage: 0, diffPercent: null };
  }

  const trailingAverage = trailingSum / trailingDaysWithData;
  const diffPercent =
    trailingAverage === 0
      ? null
      : Math.round(((todayCount - trailingAverage) / trailingAverage) * 100);

  return { hasEnoughData: true, todayCount, trailingAverage, diffPercent };
}
