"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outlined" | "whatsapp" | "white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90",
  outlined:
    "bg-bg-alt border border-border text-text-dark hover:bg-border/30",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp/90",
  white:
    "bg-white text-text-dark hover:bg-white/90",
};

export default function Button({
  variant = "primary",
  href,
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-[8px] px-6 py-3 text-base font-semibold leading-6 transition-colors cursor-pointer ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
