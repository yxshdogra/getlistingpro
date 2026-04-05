"use client";

import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { initiateCheckout } from "@/lib/razorpay";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "starter";
  const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

  const handleRetry = async () => {
    try {
      await initiateCheckout(planId);
    } catch (error) {
      console.error("Retry failed:", error);
    }
  };

  return (
    <>
      {/* Failure icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="font-heading text-2xl leading-9 font-bold text-text-dark mb-2">
        Payment Failed
      </h1>
      <p className="text-sm leading-6 text-text-muted mb-8">
        Your payment for the {planName} Plan could not be processed. No charges
        were made.
      </p>

      <Button variant="primary" fullWidth className="mb-4" onClick={handleRetry}>
        Try Again
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
