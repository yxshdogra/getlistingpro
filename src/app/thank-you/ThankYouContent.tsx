"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { trackPurchase } from "@/lib/pixel";
import {
  getPlanById,
  LP_PLAN_ID_STORAGE_KEY,
  LP_SUBSCRIPTION_ID_STORAGE_KEY,
  type Plan,
} from "@/lib/constants";

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-success flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
      {n}
    </div>
  );
}

export default function ThankYouContent() {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    // Read checkout context from sessionStorage (not from URL for privacy)
    const storedPlanId = sessionStorage.getItem(LP_PLAN_ID_STORAGE_KEY);
    const subscriptionId = sessionStorage.getItem(LP_SUBSCRIPTION_ID_STORAGE_KEY) || "";

    const clearContext = () => {
      sessionStorage.removeItem(LP_PLAN_ID_STORAGE_KEY);
      sessionStorage.removeItem(LP_SUBSCRIPTION_ID_STORAGE_KEY);
    };

    if (!storedPlanId) return;
    const resolvedPlan = getPlanById(storedPlanId);
    if (!resolvedPlan) {
      clearContext();
      return;
    }
    setPlan(resolvedPlan);

    if (!subscriptionId) {
      clearContext();
      return;
    }

    // The pixel bootstraps afterInteractive (layout.tsx), so fbq may not exist
    // yet when this effect runs. Retry until it fires, then clear the context
    // so a refresh can't double-track. Give up after 10s (blocked pixel) —
    // the server-side CAPI event is the backstop.
    const deadline = Date.now() + 10_000;
    let timerId: number | undefined;
    const tryFire = () => {
      if (
        trackPurchase(resolvedPlan.id, resolvedPlan.amount / 100, subscriptionId) ||
        Date.now() >= deadline
      ) {
        clearContext();
        return;
      }
      timerId = window.setTimeout(tryFire, 200);
    };
    tryFire();

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-light mb-5">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-heading text-2xl lg:text-[30px] leading-9 font-bold text-text-heading">
          Payment Successful!
        </h1>
        <p className="text-base leading-6 text-text-muted mt-2">
          Your subscription is now active. Welcome to ListingPro!
        </p>
      </div>

      {/* Subscription details card */}
      <div className="bg-bg-alt border border-border rounded-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
          Subscription Details
        </h2>
        {plan ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Plan</span>
              <span className="text-sm font-semibold text-text-dark">{plan.name} Plan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Amount</span>
              <span className="text-sm font-semibold text-text-dark">{plan.amountDisplay}{plan.period}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Billing cycle</span>
              <span className="text-sm font-semibold text-text-dark">12 months</span>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 text-text-muted">
            Your payment has been received and your subscription is active. We&apos;ll share onboarding details with you shortly.
          </p>
        )}
      </div>

      {/* What's included */}
      {plan && (
        <div className="bg-white border border-border rounded-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            What&apos;s Included
          </h2>
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm leading-5 text-text-dark">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next steps */}
      <div className="bg-white border border-border rounded-card p-5 mb-8">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
          Next Steps
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <StepNumber n={1} />
            <div>
              <h3 className="text-sm font-semibold text-text-dark">Start onboarding</h3>
              <p className="text-sm text-text-muted mt-0.5">Share your product details and brand info with our team.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <StepNumber n={2} />
            <div>
              <h3 className="text-sm font-semibold text-text-dark">We create your content</h3>
              <p className="text-sm text-text-muted mt-0.5">Our team starts working on photos, reels, and listings.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <StepNumber n={3} />
            <div>
              <h3 className="text-sm font-semibold text-text-dark">Content delivered in 48 hours</h3>
              <p className="text-sm text-text-muted mt-0.5">Review your content and start seeing more orders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3 text-center">
        <Button variant="primary" href="/" fullWidth>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
