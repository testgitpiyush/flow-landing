import React from "react";

export default function BlogPage() {
  const posts = [
    {
      title: "Announcing Flow 2.0: The Deep Work Engine",
      date: "September 8, 2026",
      excerpt:
        "Today we're launching the biggest update in Flow's history — a complete overhaul of our AI scheduling engine, a new keyboard-first interface, and sub-50ms sync.",
    },
    {
      title: "Why Context Switching Costs You 3 Hours a Day",
      date: "August 15, 2026",
      excerpt:
        "Research shows that every interruption costs an average of 23 minutes to recover from. Here's how Flow engineers designed around that.",
    },
    {
      title: "Building a Local-First Productivity Stack",
      date: "July 21, 2026",
      excerpt:
        "How we achieved instant offline support with SQLite, CRDT-based sync, and optimistic UI — no spinners, ever.",
    },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Insights & Updates
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Blog
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">
            Thoughts on productivity, engineering, and building great tools.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <span className="text-xs text-neutral-500">{post.date}</span>
              <h3 className="text-xl font-semibold text-white mt-2">
                {post.title}
              </h3>
              <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
