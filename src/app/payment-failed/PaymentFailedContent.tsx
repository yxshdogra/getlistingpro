"use client";

import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { initiateCheckout } from "@/lib/razorpay";
import { getPlanById } from "@/lib/constants";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const rawPlanId = searchParams.get("plan") || "";
  const plan = getPlanById(rawPlanId);
  const planId = plan?.id || "starter";
  const planName = plan?.name || "Selected";

  const handleRetry = async () => {
    try {
      await initiateCheckout(planId);
    } catch (error) {
      console.error("Retry failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Error header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-5">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="font-heading text-2xl lg:text-[30px] leading-9 font-bold text-text-heading">
          Payment Failed
        </h1>
        <p className="text-base leading-6 text-text-muted mt-2">
          Your payment for the {planName} Plan could not be processed.
          <br />
          Don&apos;t worry — no charges were made.
        </p>
      </div>

      {/* Info card */}
      <div className="bg-bg-alt border border-border rounded-card p-5 mb-8">
        <h2 className="text-sm font-semibold text-text-dark mb-3">Common reasons for failure</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">&bull;</span>
            <span className="text-sm text-text-muted">Insufficient balance in your account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">&bull;</span>
            <span className="text-sm text-text-muted">Bank declined the transaction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-text-muted mt-0.5">&bull;</span>
            <span className="text-sm text-text-muted">Session timed out or was cancelled</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3 text-center">
        <Button variant="primary" fullWidth onClick={handleRetry}>
          Try Again
        </Button>
        <a
          href="/"
          className="inline-block text-sm text-text-muted hover:text-primary transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
