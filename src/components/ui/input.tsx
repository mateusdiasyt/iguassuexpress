import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-brand/10 bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand/50 focus:ring-4 focus:ring-brand/10",
        className,
      )}
      {...props}
    />
  );
}
