import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for every team size. Free plan, Pro at $12/month, or Team for enterprise. Choose what works for you.",
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <Pricing />
      <CTA />
    </div>
  );
}
