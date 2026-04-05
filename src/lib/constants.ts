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

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    amount: 500000,
    amountDisplay: "₹5,000",
    period: "/month",
    description: "Ideal for beginners in professional content",
    popular: false,
    features: [
      "5 AI model product photos",
      "2 short-form reels",
      "5 SEO-optimized listings",
      "WhatsApp support",
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
    features: [
      "15 AI model product photos",
      "5 short-form reels",
      "15 SEO-optimized listings",
      "Brand logo design",
      "Priority WhatsApp support",
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
    features: [
      "30 AI model product photos",
      "10 short-form reels",
      "30 SEO-optimized listings",
      "Full brand identity kit",
      "Dedicated account manager",
      "Catalogue design",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
