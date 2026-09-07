"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  duration: string;
  timeframe: "today" | "upcoming";
  completed: boolean;
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Finalize Flow 2.0 Design System & Tokens",
    category: "Design",
    priority: "High",
    duration: "45m",
    timeframe: "today",
    completed: true,
  },
  {
    id: "2",
    title: "Implement optimistic task reordering",
    category: "Engineering",
    priority: "High",
    duration: "1h 30m",
    timeframe: "today",
    completed: true,
  },
  {
    id: "3",
    title: "Prepare launch copy & product screenshots",
    category: "Marketing",
    priority: "Medium",
    duration: "50m",
    timeframe: "today",
    completed: false,
  },
  {
    id: "4",
    title: "Review analytics funnel & drop-off rate",
    category: "Product",
    priority: "Low",
    duration: "25m",
    timeframe: "upcoming",
    completed: false,
  },
  {
    id: "5",
    title: "Sync with core engineering team on API latency",
    category: "Engineering",
    priority: "Medium",
    duration: "30m",
    timeframe: "upcoming",
    completed: false,
  },
];

export function DashboardMockup() {
  // This component is a marketing showcase only - it always renders static
  // sample data and never calls the real tasks API or represents any
  // signed-in user's actual tasks. The real, database-backed dashboard is
  // the <Dashboard /> component rendered at /demo for authenticated users.
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming">("today");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    setTasks((prev) => [
      ...prev,
      {
        id: `sample-${prev.length + 1}`,
        title,
        category: "Product",
        priority: "Medium",
        duration: "25m",
        timeframe: activeTab === "upcoming" ? "upcoming" : "today",
        completed: false,
      },
    ]);
    setNewTaskTitle("");
  };

  const visibleTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.timeframe === activeTab);
  const completedCount = visibleTasks.filter((t) => t.completed).length;
  const progressPercent = visibleTasks.length > 0 ? Math.round((completedCount / visibleTasks.length) * 100) : 0;

  return (
    <section id="dashboard-preview" className="relative pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mockup Outer Frame */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-neutral-700/40 via-neutral-800/20 to-neutral-900/40 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl">
          <div className="rounded-xl bg-neutral-950/90 border border-neutral-800/80 overflow-hidden">
            {/* Top Bar / App Window Header */}
            <div className="h-12 border-b border-neutral-800/80 px-4 flex items-center justify-between bg-neutral-900/40 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-500">
                  flow.app/workspace/today
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-md text-neutral-400">
                <Search className="w-3 h-3" />
                <span>Search tasks, docs, commands...</span>
                <kbd className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded ml-2">
                  ⌘K
                </kbd>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-800/80 text-neutral-400 border border-neutral-700/80 text-[10px] font-medium uppercase tracking-wider">
                  Sample data
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium">
                  <Flame className="w-3.5 h-3.5 text-indigo-400" />
                  <span>5 Day Streak</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium text-white border border-indigo-400/30">
                  JD
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-neutral-800/80">
              {/* Left/Main Column: Task Manager */}
              <div className="lg:col-span-8 p-5 sm:p-7 space-y-6">
                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                      Today&apos;s Focus
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                        {visibleTasks.length} tasks
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Tuesday, September 8 • 4.2 hrs estimated
                    </p>
                  </div>

                  {/* Filter tabs */}
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

                {/* Progress bar */}
                <div className="space-y-2 p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300 font-medium">
                      Daily Completion Goal
                    </span>
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

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {visibleTasks.length === 0 ? (
                    <p className="p-4 text-sm text-neutral-500 text-center border border-dashed border-neutral-800 rounded-xl">
                      No tasks in this view.
                    </p>
                  ) : visibleTasks.map((task) => (
                    <div
                      key={task.id}
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
                      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        task.completed
                          ? "bg-neutral-900/20 border-neutral-800/40 opacity-70"
                          : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/90"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          aria-hidden="true"
                          className="text-neutral-400 group-hover:text-indigo-400 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-indigo-400 fill-indigo-950" />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-500" />
                          )}
                        </span>
                        <span
                          className={`text-sm truncate transition-all ${
                            task.completed
                              ? "line-through text-neutral-500"
                              : "text-neutral-200 group-hover:text-white"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 ml-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                            task.category === "Design"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : task.category === "Engineering"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : task.category === "Marketing"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {task.category}
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {task.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Bar */}
                <form
                  className="flex items-center gap-2 pt-2"
                  onSubmit={addTask}
                >
                  <label htmlFor="new-task" className="sr-only">Create a task</label>
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
                    disabled={!newTaskTitle.trim()}
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Right Column: Insights & Quick Stats */}
              <div className="lg:col-span-4 p-5 sm:p-7 space-y-6 bg-neutral-900/20">
                {/* Deep Work Metric Card */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Focus Score
                    </span>
                    <span className="text-emerald-400 font-mono font-medium">
                      +14% vs avg
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-white font-mono">
                      92
                    </span>
                    <span className="text-xs text-neutral-400">/ 100</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You spent 3.8 hours in uninterrupted flow mode today.
                  </p>
                </div>

                {/* Time Allocation Mini Chart */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-200 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-purple-400" />
                      Activity Breakdown
                    </span>
                  </div>

                  {/* Multi-segment bar */}
                  <div className="flex h-2.5 w-full rounded-full overflow-hidden gap-1">
                    <div className="bg-indigo-500 w-[45%]" title="Coding: 45%" />
                    <div className="bg-purple-500 w-[30%]" title="Design: 30%" />
                    <div className="bg-amber-500 w-[15%]" title="Review: 15%" />
                    <div className="bg-neutral-600 w-[10%]" title="Other: 10%" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Coding (45%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Design (30%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Review (15%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-neutral-600" />
                      <span>Other (10%)</span>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Callout */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-neutral-900/60 to-neutral-900/40 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Flow AI Recommendation</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Block your afternoon calendar for 90 mins to finish &quot;Prepare launch copy&quot; before the 4 PM review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
