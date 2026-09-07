import React from "react";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden border-t border-neutral-800/60">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free to get started — no credit card required</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Ready to experience flow state every single day?
          </h2>

          <p className="mt-4 text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of developers, designers, and founders who reclaimed 10+ hours every week with Flow.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-base transition-all duration-200 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium text-base transition-all duration-200"
            >
              <span>Schedule a Demo</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              SOC2 Type II Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              99.99% Uptime SLA
            </span>
            <span>•</span>
            <span>No lock-in contracts</span>
          </div>
        </div>
      </div>
    </section>
  );
}