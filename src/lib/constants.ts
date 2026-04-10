export type Plan = {
  id: string;
  name: string;
  amount: number; // in paise for Razorpay
  amountDisplay: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
};

export const SUBSCRIPTION_TOTAL_COUNT = 12; // 12 billing cycles (1 year)

export const LP_PLAN_ID_STORAGE_KEY = "lp_plan_id";
export const LP_SUBSCRIPTION_ID_STORAGE_KEY = "lp_subscription_id";

// Deliverable-based monthly subscription packages.
// NOTE: the amount actually billed is defined by the Razorpay plan object
// (see RAZORPAY_PLAN_MAP in razorpay-plans.server.ts), NOT by `amount` here.
// `amount` drives only the displayed price and the Meta Pixel value — it must
// be kept in sync with the matching Razorpay plan's price.
//
// Intro plan is intentionally deferred (price/contents TBD). To add it later:
// insert an `intro` entry first, add its id to RAZORPAY_PLAN_MAP, and switch
// PricingSection back to a 3-up grid.
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    amount: 49900,
    amountDisplay: "₹499",
    period: "/month",
    description: "Get started with consistent monthly content",
    popular: false,
    features: [
      "1 reel per month",
      "20 product photos / images",
      "Dedicated support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    amount: 99900,
    amountDisplay: "₹999",
    period: "/month",
    description: "For sellers scaling their content output",
    popular: true,
    features: [
      "3 reels per month",
      "50 product photos / social media posts",
      "Priority support",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
