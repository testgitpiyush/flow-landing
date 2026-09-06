"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Starter",
      description: "For individuals looking to regain control of their daily focus.",
      priceMonthly: 0,
      priceYearly: 0,
      priceText: "Free forever",
      cta: "Get Started",
      popular: false,
      features: [
        "Unlimited tasks & projects",
        "Basic focus timer & analytics",
        "3 integration connectors (Google Cal, Slack)",
        "7-day history & activity logs",
        "Mobile & Web apps",
      ],
    },
    {
      name: "Pro",
      description: "For professionals and power users who require deep intelligence.",
      priceMonthly: 16,
      priceYearly: 12,
      priceText: billingCycle === "yearly" ? "$12 / mo" : "$16 / mo",
      subtext: billingCycle === "yearly" ? "Billed annually ($144/yr)" : "Billed monthly",
      cta: "Start 14-Day Free Trial",
      popular: true,
      features: [
        "Everything in Starter, plus:",
        "AI task prioritization & breakdown",
        "Unlimited third-party integrations",
        "Advanced energy & focus analytics",
        "Keyboard-first command center (⌘K)",
        "Priority support & early beta access",
      ],
    },
    {
      name: "Team",
      description: "For agile teams that want unified alignment without the noise.",
      priceMonthly: 32,
      priceYearly: 24,
      priceText: billingCycle === "yearly" ? "$24 / seat / mo" : "$32 / seat / mo",
      subtext: billingCycle === "yearly" ? "Billed annually" : "Billed monthly",
      cta: "Contact Sales",
      popular: false,
      features: [
        "Everything in Pro, plus:",
        "Shared workspaces & team goals",
        "Automated status check-ins",
        "SAML SSO & advanced security",
        "Dedicated success manager",
        "Custom API & webhooks access",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 relative border-t border-neutral-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Invest in your output, not in overhead
          </p>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg">
            Choose the plan that matches your ambition. Upgrade, downgrade, or cancel at any time.
          </p>

          {/* Toggle */}
          <div
            role="group"
            aria-label="Billing frequency"
            className="mt-8 inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-full"
          >
            <button
              type="button"
              aria-pressed={billingCycle === "monthly"}
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                billingCycle === "monthly"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={billingCycle === "yearly"}
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl flex flex-col justify-between p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-neutral-900 via-neutral-900 to-indigo-950/40 border-2 border-indigo-500/80 shadow-2xl shadow-indigo-950/50 scale-[1.02]"
                  : "bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <p className="mt-2 text-xs text-neutral-400 min-h-[32px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {plan.priceText}
                    </span>
                  </div>
                  {plan.subtext && (
                    <p className="text-xs text-neutral-500 mt-1">{plan.subtext}</p>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-4 border-t border-neutral-800/80">
                  <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Included Features:
                  </p>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="mt-8 pt-4">
                <a
                  href={plan.name === "Team" ? "/contact" : "/signup"}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
                      : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}