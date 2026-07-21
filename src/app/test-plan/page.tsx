import type { Metadata } from "next";
import TestPlanContent from "./TestPlanContent";

// Internal, unlinked page: real ₹1 payment through the full production flow
// (InitiateCheckout → Razorpay → verify-payment → /thank-you Purchase pixel →
// subscription.charged webhook). Active only while RAZORPAY_PLAN_ID_TEST is
// set on the service.
export const metadata: Metadata = {
  title: "Tracking Test — ListingPro",
  robots: { index: false, follow: false },
};

export default function TestPlanPage() {
  return <TestPlanContent />;
}
