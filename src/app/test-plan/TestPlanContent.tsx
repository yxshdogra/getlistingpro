"use client";

import { useState } from "react";
import { getPlanById } from "@/lib/constants";
import { initiateCheckout } from "@/lib/razorpay";
import { trackInitiateCheckout } from "@/lib/pixel";

export default function TestPlanContent() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setBusy(true);
    setError(null);
    try {
      const plan = getPlanById("test");
      if (plan) trackInitiateCheckout(plan.id, plan.amount / 100);
      await initiateCheckout("test");
    } catch {
      setError(
        "Could not start the test checkout. The test plan may be disabled (RAZORPAY_PLAN_ID_TEST unset)."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center border border-black/10 rounded-xl p-8">
        <p className="text-sm uppercase tracking-wide text-text-muted">
          Internal use only
        </p>
        <h1 className="font-heading text-2xl font-bold text-text-heading mt-2">
          ₹1 Tracking Test
        </h1>
        <p className="text-base text-text-muted mt-3">
          Pays ₹1 once through the real checkout to verify Meta Purchase
          tracking end to end. You will land on the thank-you page when it
          succeeds.
        </p>
        <button
          onClick={handlePay}
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-primary text-white py-3 font-semibold disabled:opacity-60"
        >
          {busy ? "Opening checkout…" : "Pay ₹1 test"}
        </button>
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      </div>
    </main>
  );
}
