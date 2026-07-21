/** Server-only mapping from plan ID to Razorpay plan ID, sourced from env vars.
 *  No NEXT_PUBLIC_ prefix → these never reach the client bundle.
 *
 *  IMPORTANT: the Razorpay plan object — not constants.ts — defines the amount
 *  that is actually charged. Set these env vars (in .env.local and on the server)
 *  to the plan_xxx IDs created in the Razorpay Dashboard at the matching price
 *  (Starter ₹499/mo, Growth ₹999/mo).
 *
 *  If a var is unset, its value is "" → create-subscription returns 400 (fails
 *  loudly) instead of silently billing a wrong/old price. */
export const RAZORPAY_PLAN_MAP: Record<string, string> = {
  starter: process.env.RAZORPAY_PLAN_ID_STARTER ?? "",
  growth: process.env.RAZORPAY_PLAN_ID_GROWTH ?? "",
  // Internal ₹1 tracking-verification plan (see /test-plan). Unset in normal
  // operation once verification is done — that alone disables the checkout.
  test: process.env.RAZORPAY_PLAN_ID_TEST ?? "",
};
