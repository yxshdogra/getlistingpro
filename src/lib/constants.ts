export type Plan = {
  id: string;
  name: string;
  amount: number; // in paise for Razorpay
  amountDisplay: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
  razorpayPlanId: string;
};

export const SUBSCRIPTION_TOTAL_COUNT = 12; // 12 billing cycles (1 year)

export const PLANS: Plan[] = [
  {
    id: "test-monthly",
    name: "Test Monthly",
    amount: 400,
    amountDisplay: "₹4",
    period: "/month",
    description: "Test plan — ₹4/month",
    popular: false,
    razorpayPlanId: "plan_S6SWalB73bEuia",
    features: ["Payment flow test"],
  },
  {
    id: "starter",
    name: "Starter",
    amount: 500000,
    amountDisplay: "₹5,000",
    period: "/month",
    description: "Ideal for beginners in professional content",
    popular: false,
    razorpayPlanId: "plan_SJbbn4Xakqbga6",
    features: [
      "5 AI model product photos",
      "2 short-form reels",
      "5 SEO-optimized listings",
      "Dedicated support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    amount: 1000000,
    amountDisplay: "₹10,000",
    period: "/month",
    description: "For sellers ready to scale their visibility and orders",
    popular: true,
    razorpayPlanId: "plan_SJbcTvn6KTlsYN",
    features: [
      "15 AI model product photos",
      "5 short-form reels",
      "15 SEO-optimized listings",
      "Brand logo design",
      "Priority support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    amount: 2500000,
    amountDisplay: "₹25,000",
    period: "/month",
    description: "For established sellers who want maximum growth",
    popular: false,
    razorpayPlanId: "plan_SJbd3RuELBzJkA",
    features: [
      "30 AI model product photos",
      "10 short-form reels",
      "30 SEO-optimized listings",
      "Full brand identity kit",
      "Dedicated account manager",
      "Catalogue design",
    ],
  },
  {
    id: "test-yearly",
    name: "Test Yearly",
    amount: 500,
    amountDisplay: "₹5",
    period: "/year",
    description: "Test plan — ₹5/year",
    popular: false,
    razorpayPlanId: "plan_S6SWrfPil7qS6p",
    features: ["Payment flow test"],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
