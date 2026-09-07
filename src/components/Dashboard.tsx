"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Flame,
  Plus,
  Search,
  Sparkles,
  BarChart2,
  Target,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  type MetricTask,
  computeFocusScore,
  computeEstimatedFocusMinutesToday,
  computeEstimatedTotalMinutesToday,
  computeActivityBreakdown,
  computeStreak,
  computeVsTrailingAverage,
  formatMinutesAsHours,
} from "@/lib/task-metrics";

type Task = MetricTask;

type LoadState = "loading" | "ready" | "error";

const CATEGORY_STYLES: Record<string, string> = {
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Marketing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};
const DEFAULT_CATEGORY_STYLE = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

const ACTIVITY_COLORS = ["bg-indigo-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500", "bg-neutral-600"];

type AIState =
  | { status: "loading" }
  | { status: "unavailable"; reason: string }
  | { status: "ready"; text: string }
  | { status: "error" };

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming">("today");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [actionError, setActionError] = useState("");
  const [ai, setAi] = useState<AIState>({ status: "loading" });
  // Fixed locale so the server-rendered and client-hydrated strings always
  // match (avoids a hydration mismatch that "undefined" locale could cause
  // if the server and browser resolve different default locales).
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()),
    []
  );

  const loadTasks = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setTasks(data.tasks ?? []);
      setLoadState("ready");
    } catch (error) {
      console.error("Failed to load tasks", error);
      setLoadState("error");
    }
  }, []);

  const loadRecommendation = useCallback(async () => {
    setAi({ status: "loading" });
    try {
      const res = await fetch("/api/ai/recommendation");
      const data = await res.json();
      if (!res.ok) {
        setAi({ status: "error" });
        return;
      }
      if (data.available) {
        setAi({ status: "ready", text: data.recommendation });
      } else {
        setAi({ status: "unavailable", reason: data.reason ?? "unknown" });
      }
    } catch (error) {
      console.error("Failed to load AI recommendation", error);
      setAi({ status: "error" });
    }
  }, []);

  // Standard fetch-on-mount pattern (React's own docs use this exact shape
  // for syncing with an external API). The experimental
  // react-hooks/set-state-in-effect rule flags any effect that calls a
  // function which eventually calls setState, even async ones guarded by
  // loading/error state as done here - that's a known false positive for
  // this well-established pattern, not a bug in this component.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
    loadRecommendation();
  }, [loadTasks, loadRecommendation]);

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;

    setActionError("");
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t)));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      // Reconcile with the server's updatedAt so streak/metric math stays accurate.
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (error) {
      console.error("Failed to update task", error);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: task.completed } : t)));
      setActionError("Couldn't save that change. Please try again.");
    }
  };

  const deleteTask = async (id: string) => {
    const previous = tasks;
    setActionError("");
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error("Failed to delete task", error);
      setTasks(previous);
      setActionError("Couldn't delete that task. Please try again.");
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title || adding) return;

    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: "Product",
          priority: "Medium",
          duration: "25m",
          timeframe: activeTab === "upcoming" ? "upcoming" : "today",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }
      setTasks((prev) => [...prev, data.task]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Failed to create task", error);
      setAddError(error instanceof Error ? error.message : "Failed to create task");
    } finally {
      setAdding(false);
    }
  };

  const visibleTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.timeframe === activeTab);
  const completedCount = visibleTasks.filter((t) => t.completed).length;
  const progressPercent = visibleTasks.length > 0 ? Math.round((completedCount / visibleTasks.length) * 100) : 0;

  const focusScore = useMemo(() => computeFocusScore(tasks), [tasks]);
  const estimatedFocusMinutes = useMemo(() => computeEstimatedFocusMinutesToday(tasks), [tasks]);
  const estimatedTotalMinutesToday = useMemo(() => computeEstimatedTotalMinutesToday(tasks), [tasks]);
  const activityBreakdown = useMemo(() => computeActivityBreakdown(tasks), [tasks]);
  const streak = useMemo(() => computeStreak(tasks), [tasks]);
  const vsAverage = useMemo(() => computeVsTrailingAverage(tasks), [tasks]);

  if (loadState === "loading") {
    return (
      <section id="dashboard" className="relative pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/90 p-16 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            <p className="text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (loadState === "error") {
    return (
      <section id="dashboard" className="relative pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/20 bg-neutral-950/90 p-16 flex flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400" aria-hidden="true" />
            <p className="text-sm text-neutral-300">We couldn&apos;t load your tasks.</p>
            <button
              type="button"
              onClick={loadTasks}
              className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="relative pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-neutral-700/40 via-neutral-800/20 to-neutral-900/40 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
          <div className="rounded-xl bg-neutral-950/90 border border-neutral-800/80 overflow-hidden">
            {/* Top Bar */}
            <div className="h-12 border-b border-neutral-800/80 px-4 flex items-center justify-between bg-neutral-900/40 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-500">flow.app/workspace/today</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-md text-neutral-400">
                <Search className="w-3 h-3" />
                <span>Search tasks, docs, commands...</span>
                <kbd className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium"
                  title="Consecutive days with at least one completed task"
                >
                  <Flame className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{streak === 1 ? "1 Day Streak" : `${streak} Day Streak`}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-neutral-800/80">
              {/* Left: Task Manager */}
              <div className="lg:col-span-8 p-5 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                      Today&apos;s Focus
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                        {visibleTasks.length} tasks
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {today}
                      {estimatedTotalMinutesToday > 0 && (
                        <> • {formatMinutesAsHours(estimatedTotalMinutesToday)} estimated</>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
                    {(["all", "today", "upcoming"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        aria-pressed={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                          activeTab === tab
                            ? "bg-neutral-800 text-white font-medium"
                            : "text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {actionError && (
                  <p role="alert" className="text-xs text-red-400">
                    {actionError}
                  </p>
                )}

                {visibleTasks.length > 0 && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">Daily Completion Goal</span>
                      <span className="text-indigo-400 font-mono font-medium">
                        {progressPercent}% ({completedCount}/{visibleTasks.length})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  {tasks.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl space-y-2">
                      <p className="text-sm text-neutral-300 font-medium">No tasks yet</p>
                      <p className="text-xs text-neutral-500">
                        Add your first task below to start tracking your focus.
                      </p>
                    </div>
                  ) : visibleTasks.length === 0 ? (
                    <p className="p-4 text-sm text-neutral-500 text-center border border-dashed border-neutral-800 rounded-xl">
                      No tasks in this view.
                    </p>
                  ) : (
                    visibleTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                          task.completed
                            ? "bg-neutral-900/20 border-neutral-800/40 opacity-70"
                            : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/90"
                        }`}
                      >
                        <div
                          onClick={() => toggleTask(task.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              toggleTask(task.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-pressed={task.completed}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
                        >
                          <span aria-hidden="true" className="text-neutral-400 group-hover:text-indigo-400 transition-colors">
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-indigo-400 fill-indigo-950" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-500" />
                            )}
                          </span>
                          <span
                            className={`text-sm truncate transition-all ${
                              task.completed ? "line-through text-neutral-500" : "text-neutral-200 group-hover:text-white"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ml-3">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                              CATEGORY_STYLES[task.category] ?? DEFAULT_CATEGORY_STYLE
                            }`}
                          >
                            {task.category}
                          </span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {task.duration}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            aria-label={`Delete task: ${task.title}`}
                            className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form className="flex items-center gap-2 pt-2" onSubmit={addTask}>
                  <label htmlFor="new-task" className="sr-only">
                    Create a task
                  </label>
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900/50 border border-dashed border-neutral-800 focus-within:border-indigo-500 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                    <input
                      id="new-task"
                      type="text"
                      value={newTaskTitle}
                      onChange={(event) => setNewTaskTitle(event.target.value)}
                      placeholder="Type to create a task, press Enter..."
                      className="flex-1 bg-transparent text-xs text-neutral-200 placeholder:text-neutral-500 outline-none"
                      maxLength={120}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                    disabled={!newTaskTitle.trim() || adding}
                  >
                    {adding ? "Adding..." : "Add"}
                  </button>
                </form>
                {addError && (
                  <p role="alert" className="text-xs text-red-400">
                    {addError}
                  </p>
                )}
              </div>

              {/* Right: Insights */}
              <div className="lg:col-span-4 p-5 sm:p-7 space-y-6 bg-neutral-900/20">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Focus Score
                    </span>
                    {vsAverage.hasEnoughData && vsAverage.diffPercent !== null && (
                      <span
                        className={`font-mono font-medium ${
                          vsAverage.diffPercent >= 0 ? "text-emerald-400" : "text-neutral-400"
                        }`}
                      >
                        {vsAverage.diffPercent >= 0 ? "+" : ""}
                        {vsAverage.diffPercent}% vs 7-day avg
                      </span>
                    )}
                  </div>
                  {focusScore === null ? (
                    <p className="text-xs text-neutral-500">Add a task for today to see your focus score.</p>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-white font-mono">{focusScore}</span>
                        <span className="text-xs text-neutral-400">/ 100</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {estimatedFocusMinutes > 0
                          ? `You've logged ${formatMinutesAsHours(estimatedFocusMinutes)} of estimated focus time on completed tasks today.`
                          : "Complete a task today to start logging focus time."}
                      </p>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-purple-400" />
                      Activity Breakdown
                    </span>
                  </div>

                  {activityBreakdown.length === 0 ? (
                    <p className="text-xs text-neutral-500">No task data yet.</p>
                  ) : (
                    <>
                      <div className="flex h-2.5 w-full rounded-full overflow-hidden gap-1">
                        {activityBreakdown.map((entry, i) => (
                          <div
                            key={entry.category}
                            className={ACTIVITY_COLORS[i % ACTIVITY_COLORS.length]}
                            style={{ width: `${entry.percent}%` }}
                            title={`${entry.category}: ${entry.percent}%`}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-neutral-400">
                        {activityBreakdown.map((entry, i) => (
                          <div key={entry.category} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${ACTIVITY_COLORS[i % ACTIVITY_COLORS.length]}`} />
                            <span>
                              {entry.category} ({entry.percent}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-neutral-900/60 to-neutral-900/40 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Flow AI Recommendation</span>
                  </div>
                  {ai.status === "loading" && (
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                      Thinking...
                    </p>
                  )}
                  {ai.status === "ready" && <p className="text-xs text-neutral-300 leading-relaxed">{ai.text}</p>}
                  {ai.status === "error" && (
                    <p className="text-xs text-neutral-500">Couldn&apos;t generate a recommendation right now.</p>
                  )}
                  {ai.status === "unavailable" && (
                    <p className="text-xs text-neutral-500">
                      AI recommendations aren&apos;t configured for this deployment yet. This is a prototype panel
                      until an AI provider is set up server-side.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
