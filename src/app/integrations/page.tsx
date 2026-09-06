import React from "react";
import { CTA } from "@/components/CTA";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "GitHub",
      category: "Developer Tools",
      desc: "Automatically sync pull requests, issues, and commit statuses to your tasks.",
    },
    {
      name: "Linear",
      category: "Project Management",
      desc: "Two-way status updates and real-time sprint tracking.",
    },
    {
      name: "Slack",
      category: "Communication",
      desc: "Auto-set 'Focusing' status and snooze noisy channel notifications.",
    },
    {
      name: "Google Calendar",
      category: "Scheduling",
      desc: "Block out deep work sessions and prevent overlapping meetings.",
    },
    {
      name: "Notion",
      category: "Knowledge Base",
      desc: "Embed docs directly into task workspaces with instant search.",
    },
    {
      name: "Figma",
      category: "Design",
      desc: "Attach live design frames and preview comments in one place.",
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Connect Everything
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Integrate with your daily tools
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Flow fits perfectly into your existing ecosystem. Set up connectors in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/50 inline-block mb-4">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <CTA />
    </div>
  );
}
