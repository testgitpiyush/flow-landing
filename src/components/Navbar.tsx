"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Menu, X, ArrowRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white flex items-center gap-1.5">
            Flow
            <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.0
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link
            href="/features"
            className="hover:text-white transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/workflow"
            className="hover:text-white transition-colors duration-200"
          >
            Workflow
          </Link>
          <Link
            href="/pricing"
            className="hover:text-white transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/changelog"
            className="hover:text-white transition-colors duration-200"
          >
            Changelog
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link
                href="/demo"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <span className="text-xs text-neutral-400 font-medium bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                {session?.user?.name || session?.user?.email || "User"}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white text-neutral-950 hover:bg-neutral-200 transition-all duration-200 shadow-sm hover:shadow-indigo-500/10"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4 animate-fade-in"
        >
          <nav className="flex flex-col space-y-3">
            <Link
              href="/features"
              className="text-base text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/workflow"
              className="text-base text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Workflow
            </Link>
            <Link
              href="/pricing"
              className="text-base text-neutral-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </nav>
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            {status === "authenticated" ? (
              <>
                <div className="text-center text-xs text-neutral-400 font-medium py-1">
                  Signed in as <span className="text-neutral-200">{session?.user?.name || session?.user?.email}</span>
                </div>
                <Link
                  href="/demo"
                  className="w-full text-center py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full text-center py-2 text-sm font-medium text-neutral-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}