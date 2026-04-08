"use client";

import type { Plan } from "@/lib/constants";
import Button from "./ui/Button";

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-success flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PricingCard({
  plan,
  isHighlighted,
  onSelect,
  onHover,
}: {
  plan: Plan;
  isHighlighted: boolean;
  onSelect: (planId: string) => void;
  onHover: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-card p-6 transition-all duration-200 ${
        isHighlighted
          ? "bg-growth-bg border border-primary shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          : "bg-bg-alt border border-border"
      }`}
      onMouseEnter={onHover}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold leading-4 px-3 py-1 rounded-pill">
          Most Popular
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-base font-semibold leading-6 text-text-dark">
          {plan.name}
        </h3>
        <p className="text-sm leading-5 text-text-muted mt-1">
          {plan.description}
        </p>
      </div>

      <div className="mb-6">
        <span className="font-heading text-[30px] leading-9 font-bold text-text-dark">
          {plan.amountDisplay}
        </span>
        <span className="text-sm text-text-muted">{plan.period}</span>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon />
            <span className="text-sm leading-5 text-text-dark">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isHighlighted ? "primary" : "outlined"}
        fullWidth
        onClick={() => onSelect(plan.id)}
      >
        Start {plan.name} Plan
      </Button>
    </div>
  );
}
