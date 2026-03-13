import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-brand/10 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-brand/50 focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
