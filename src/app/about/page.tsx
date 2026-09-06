import React from "react";
import { CTA } from "@/components/CTA";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            About Flow
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            We believe deep work shouldn&apos;t be a luxury — it should be the default.
          </p>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Flow was born out of frustration with the constant context-switching modern knowledge workers endure. We set out to build a system that protects focus, automates busywork, and gives teams clarity without adding overhead. Today, thousands of engineers, designers, and founders use Flow to reclaim 10+ hours every week.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <h2 className="text-xl font-bold text-white mb-3">The Team</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We&apos;re a small, distributed team of builders who care deeply about developer experience, beautiful interfaces, and shipping fast. We&apos;ve worked at companies like Linear, Vercel, Stripe, and Figma — and we&apos;re applying those lessons to build the productivity layer we always wanted.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
              <span className="text-3xl font-bold text-white font-mono">12K+</span>
              <p className="text-xs text-neutral-500 mt-1">Active Users</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
              <span className="text-3xl font-bold text-white font-mono">50+</span>
              <p className="text-xs text-neutral-500 mt-1">Integrations</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
              <span className="text-3xl font-bold text-white font-mono">99.99%</span>
              <p className="text-xs text-neutral-500 mt-1">Uptime SLA</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <CTA />
      </div>
    </div>
  );
}
