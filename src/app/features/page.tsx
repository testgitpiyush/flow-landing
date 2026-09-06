import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover Flow's intelligent deep work modes, AI task prioritization, and ecosystem integrations that eliminate distractions and boost productivity.",
};

export default function FeaturesPage() {
  return (
    <div className="pt-20">
      <Features />
      <CTA />
    </div>
  );
}
