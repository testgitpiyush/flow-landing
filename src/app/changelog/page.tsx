import React from "react";
import { CTA } from "@/components/CTA";

export default function ChangelogPage() {
  const logs = [
    {
      version: "v2.0.0",
      date: "September 8, 2026",
      tag: "Major Release",
      title: "Flow 2.0: Deep Work Engine & AI Matrix",
      description:
        "A complete overhaul of the focus system, featuring intelligent multi-app synchronization, improved battery life, and keyboard-first navigation.",
      changes: [
        "Introduced dynamic calendar time-blocking via AI",
        "Sub-50ms latency across global sync nodes",
        "Added Linear and Slack status automations",
      ],
    },
    {
      version: "v1.4.2",
      date: "August 24, 2026",
      tag: "Improvement",
      title: "Performance & Integrations Update",
      description:
        "Faster load times for users with over 10,000 tasks and official support for Notion database sync.",
      changes: [
        "Optimized local-first SQLite offline cache",
        "Added granular webhook triggers for enterprise teams",
      ],
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Updates & Notes
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Changelog
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Follow our journey as we build the ultimate productivity workspace.
          </p>
        </div>

        <div className="space-y-12">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white font-mono">
                    {log.version}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {log.tag}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">{log.date}</span>
              </div>

              <h3 className="text-xl font-semibold text-white">{log.title}</h3>
              <p className="text-neutral-400 text-sm">{log.description}</p>

              <div className="space-y-2 pt-2">
                {log.changes.map((change, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-sm text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <CTA />
      </div>
    </div>
  );
}
