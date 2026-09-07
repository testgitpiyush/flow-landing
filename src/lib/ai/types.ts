export interface TaskSummary {
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  timeframe: "today" | "upcoming";
  completed: boolean;
}

export interface AIProvider {
  /**
   * Returns a short, actionable recommendation string based on the user's
   * current tasks, or null if the provider could not produce one.
   */
  getRecommendation(tasks: TaskSummary[]): Promise<string | null>;
}
