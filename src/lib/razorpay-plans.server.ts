/** Server-only mapping from plan ID to Razorpay plan ID.
 *  Kept out of the client bundle to avoid leaking Razorpay plan IDs. */
export const RAZORPAY_PLAN_MAP: Record<string, string> = {
  "test-monthly": "plan_S6SWalB73bEuia",
  "starter": "plan_SJbbn4Xakqbga6",
  "growth": "plan_SJbcTvn6KTlsYN",
  "scale": "plan_SJbd3RuELBzJkA",
  "test-yearly": "plan_S6SWrfPil7qS6p",
};
