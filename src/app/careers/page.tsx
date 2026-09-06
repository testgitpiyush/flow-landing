import React from "react";
import Link from "next/link";

export default function CareersPage() {
  const positions = [
    { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote" },
    { title: "Product Designer", team: "Design", location: "Remote" },
    { title: "Founding Backend Engineer", team: "Engineering", location: "San Francisco / Remote" },
    { title: "Developer Advocate", team: "Marketing", location: "Remote" },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Join Us
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Careers at Flow
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Help us build the future of focused productivity. We&apos;re hiring across all teams.
          </p>
        </div>

        <div className="space-y-4">
          {positions.map((pos, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div>
                <h3 className="text-base font-semibold text-white">{pos.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {pos.team} · {pos.location}
                </p>
              </div>
              <Link
                href="/contact"
                className="text-xs text-indigo-400 font-medium hover:underline"
              >
                Apply →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
