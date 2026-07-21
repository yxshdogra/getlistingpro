"use client";

import { useEffect, useRef, useState } from "react";
import { PLANS, getPlanById } from "@/lib/constants";
import { initiateCheckout } from "@/lib/razorpay";
import { trackInitiateCheckout, trackViewContent } from "@/lib/pixel";
import Container from "./ui/Container";
import SectionLabel from "./ui/SectionLabel";
import PricingCard from "./PricingCard";

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          trackViewContent("pricing", 0);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    const plan = getPlanById(planId);
    if (plan) {
      trackInitiateCheckout(planId, plan.amount / 100);
    }
    await initiateCheckout(planId);
  };

  return (
    <section id="pricing" ref={sectionRef} className="py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12">
          <SectionLabel>PLANS</SectionLabel>
          <h2 className="font-heading text-2xl leading-8 lg:text-[30px] lg:leading-9 font-bold text-text-heading mt-3">
            Choose your <span className="text-primary">plan</span>
          </h2>
          <p className="text-base leading-[26px] lg:text-lg lg:leading-7 text-text-muted mt-3 max-w-md mx-auto">
            Pick a plan and get fresh content every month. Cancel anytime.
          </p>
        </div>

        {/* 2 live plans → 2-up centered grid. Switch to md:grid-cols-3 max-w-4xl when the intro plan is added. */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto"
          onMouseLeave={() => setHoveredPlanId(null)}
        >
          {PLANS.filter((plan) => !plan.hidden).map((plan) => {
            // If nothing is hovered, the popular plan is highlighted
            // If a plan is hovered, only that plan is highlighted
            const isHighlighted =
              hoveredPlanId === null ? plan.popular : hoveredPlanId === plan.id;

            return (
              <PricingCard
                key={plan.id}
                plan={plan}
                isHighlighted={isHighlighted}
                onSelect={handleSelectPlan}
                onHover={() => setHoveredPlanId(plan.id)}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
