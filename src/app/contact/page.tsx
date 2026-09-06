"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    if (name.trim().length < 2 || message.trim().length < 10) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-32">
      <div className="max-w-lg w-full space-y-8 p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Questions, demos, or enterprise inquiries — we&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <p className="text-emerald-400 font-medium text-sm">Message received!</p>
            <p className="text-xs text-neutral-400">
              Thanks {name}, our team will get back to you at {email} within 24 hours.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-neutral-300 mb-1">
                Full Name
              </label>
              <Input
                id="contact-name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-neutral-300 mb-1">
                Work Email
              </label>
              <Input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-neutral-300 mb-1">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                minLength={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Tell us how we can help..."
              />
              <p className="mt-1 text-xs text-neutral-500">Use at least 10 characters so we can route your inquiry.</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
