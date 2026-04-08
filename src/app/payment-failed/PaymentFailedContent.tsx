"use client";

import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { initiateCheckout } from "@/lib/razorpay";
import { getPlanById } from "@/lib/constants";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "starter";
  const plan = getPlanById(planId);
  const planName = plan?.name || planId.charAt(0).toUpperCase() + planId.slice(1);

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
        <Button
          variant="whatsapp"
          href={process.env.NEXT_PUBLIC_WHATSAPP_ONBOARDING_URL || "#"}
          fullWidth
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Need Help? Chat on WhatsApp
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
