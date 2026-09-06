import React from "react";
import { CTA } from "@/components/CTA";

export default function WorkflowPage() {
  const steps = [
    {
      step: "01",
      title: "Connect your ecosystem",
      desc: "Link GitHub, Linear, Slack, and Google Calendar in a single click. Flow continuously syncs and maps dependencies automatically.",
    },
    {
      step: "02",
      title: "AI organizes your day",
      desc: "Our machine learning engine builds an optimal schedule aligned with your personal focus cycles and peak energy windows.",
    },
    {
      step: "03",
      title: "Execute in deep focus",
      desc: "Enter distraction-free mode. Incoming notifications are silently batched, and status changes propagate across your team seamlessly.",
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            How Flow Works
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Designed for seamless execution
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Say goodbye to chaotic tab-switching and fragmented workflows. Here&apos;s how Flow keeps you in the zone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 relative"
            >
              <span className="text-5xl font-extrabold text-neutral-800 block mb-4">
                {item.step}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <CTA />
    </div>
  );
}
