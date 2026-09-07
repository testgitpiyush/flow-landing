"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      setSubmitted(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Create your free account
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Free to use. No credit card required.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400 text-center">{error}</p>
        )}

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
