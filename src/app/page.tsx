import { Hero } from "@/components/Hero";
import { DashboardMockup } from "@/components/DashboardMockup";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Realistic Dashboard Showcase */}
      <DashboardMockup />

      {/* 3 Core Features & Ecosystem */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Final High-Conversion CTA */}
      <CTA />
    </>
  );
}