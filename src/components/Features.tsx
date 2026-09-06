import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowRight,
  Workflow,
  Focus,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Focus,
      title: "Intelligent Deep Work Modes",
      description:
        "Automatically mutes distractions, groups similar tasks, and locks down your environment when you enter focus state.",
      badge: "Automation",
      highlight: "87% fewer interruptions",
      href: "/features",
    },
    {
      icon: BrainCircuit,
      title: "Context-Aware Task Prioritization",
      description:
        "Flow dynamically calculates your priority matrix based on deadlines, energy levels, and cross-team dependencies.",
      badge: "AI Powered",
      highlight: "Dynamic scheduling",
      href: "/features",
    },
    {
      icon: Workflow,
      title: "Unified Ecosystem Integration",
      description:
        "Seamlessly two-way syncs with GitHub, Linear, Notion, Slack, and Google Calendar. Never copy-paste status updates again.",
      badge: "Integrations",
      highlight: "50+ native connectors",
      href: "/integrations",
    },
  ];

  return (
    <section id="features" className="py-24 relative border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Built for High-Output Teams & Creators
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered to eliminate friction at every step
          </p>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Traditional task managers create more work than they save. Flow is crafted with keyboard-first ergonomics and quiet intelligence.
          </p>
        </div>

        {/* Features 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 hover:border-neutral-700 hover:bg-neutral-900/70 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Subtle top corner gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-tr-2xl blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:text-indigo-300 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-indigo-100 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-neutral-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono">
                    {feature.highlight}
                  </span>
                  <Link href={feature.href} className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Learn more
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison / Highlights Bar */}
        <div className="mt-16 rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-semibold text-white">
              Supercharged with sub-50ms interaction latency
            </h4>
            <p className="text-xs text-neutral-400">
              Instant keyboard shortcuts, offline cache, and optimistic syncing across all devices.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300 font-mono">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 text-white border border-neutral-700 font-semibold">
                N
              </kbd>
              <span>for new task</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 text-white border border-neutral-700 font-semibold">
                ⌘K
              </kbd>
              <span>command menu</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}