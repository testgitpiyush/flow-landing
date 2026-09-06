"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return; // Prevent rapid clicks
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // In production, redirect would happen here
      // For demo, auto-reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setPassword("");
      }, 5000);
    }, 800);
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32">
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group" aria-label="Go to Flow homepage">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg text-white">Flow</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Start your free trial
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            14 days free. No credit card required.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <p className="text-emerald-400 font-medium text-sm">Account created successfully!</p>
            <p className="text-xs text-neutral-400">Welcome to Flow. Redirecting you to set up your workspace...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="signup-name" className="block text-xs font-medium text-neutral-300 mb-1">
                Full Name
              </label>
              <Input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-neutral-300 mb-1">
                Email address
              </label>
              <Input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-xs font-medium text-neutral-300 mb-1">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
              <p className="mt-1 text-xs text-neutral-500">Use at least 8 characters.</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
