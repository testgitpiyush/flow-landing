"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      setSubmitted(true);
      router.push("/demo");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to sign in. Please try again.");
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Sign in to access your workspaces
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400 text-center">{error}</p>
        )}

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <p className="text-emerald-400 font-medium text-sm">Successfully authenticated!</p>
            <p className="text-xs text-neutral-400">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-neutral-300 mb-1">
                  Email address
                </label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
