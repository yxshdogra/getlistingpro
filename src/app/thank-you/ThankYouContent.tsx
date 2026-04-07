"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { trackPurchase } from "@/lib/pixel";
import { getPlanById } from "@/lib/constants";

const nextSteps = [
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "What happens next?",
    description: "We'll review your subscription and get started right away.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Onboarding",
    description: "Share your product details with us on WhatsApp.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Delivery",
    description: "Your content will be delivered within 48 hours.",
  },
];

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "starter";
  const amount = searchParams.get("amount") || "₹10,000";
  const subscriptionId = searchParams.get("subscription_id") || "";

  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  useEffect(() => {
    const planData = getPlanById(plan);
    if (planData && subscriptionId) {
      trackPurchase(plan, planData.amount / 100, subscriptionId);
    }
  }, [plan, subscriptionId]);

  return (
    <>
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success-light mb-6">
        <svg
          className="w-12 h-12 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="font-heading text-2xl leading-9 font-bold text-text-dark mb-2">
        Payment Successful!
      </h1>
      <p className="text-sm leading-6 text-text-muted mb-8">
        Your {planName} Plan ({amount}/month) is now active.
        {subscriptionId && (
          <span className="block text-xs mt-1">Subscription ID: {subscriptionId}</span>
        )}
      </p>

      {/* Next steps */}
      <div className="space-y-4 mb-8 text-left">
        {nextSteps.map((step) => (
          <div
            key={step.title}
            className="flex items-start gap-4 bg-white border border-border rounded-card p-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-tint flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-dark">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="whatsapp"
        href={process.env.NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL || "#"}
        fullWidth
        className="mb-4"
      >
        Start Onboarding on WhatsApp
      </Button>
      <a
        href="/"
        className="text-base leading-6 text-text-muted hover:text-text-dark transition-colors"
      >
        Go to Homepage
      </a>
    </>
  );
}
