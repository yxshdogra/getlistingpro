"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import PricingCard from "@/components/PricingCard";
import { TEST_PLANS, getPlanById } from "@/lib/constants";
import { initiateCheckout } from "@/lib/razorpay";

export default function TestCheckoutPage() {
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    await initiateCheckout(planId);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          {/* Test mode banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-card p-4 mb-8 text-center">
            <p className="text-sm font-semibold text-amber-800">
              TEST MODE — These plans charge real but tiny amounts (₹4–₹5) to verify the payment flow.
            </p>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-heading text-2xl lg:text-[30px] leading-9 font-bold text-text-heading">
              Test Checkout
            </h1>
            <p className="text-base leading-6 text-text-muted mt-2">
              Use these plans to test the full payment flow end-to-end.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
            onMouseLeave={() => setHoveredPlanId(null)}
          >
            {TEST_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isHighlighted={hoveredPlanId === plan.id}
                onSelect={handleSelectPlan}
                onHover={() => setHoveredPlanId(plan.id)}
              />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
