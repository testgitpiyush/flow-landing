import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-neutral-400 font-medium animate-pulse text-sm">Loading Flow...</p>
      </div>
    </div>
  );
}
