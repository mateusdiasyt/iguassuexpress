"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

export function SubmitButton({ children, className, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className={className} disabled={pending || disabled} type="submit" {...props}>
      {pending ? "Salvando..." : children}
    </Button>
  );
}
