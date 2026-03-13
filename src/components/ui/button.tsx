import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
};

const variants = {
  primary:
    "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-deep hover:shadow-brand/35",
  secondary:
    "bg-white/85 text-brand hover:bg-white",
  ghost:
    "bg-transparent text-white hover:bg-white/10",
  outline:
    "border border-brand/20 bg-white text-brand hover:bg-brand/5",
};

export function Button({
  className,
  variant = "primary",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-300",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
