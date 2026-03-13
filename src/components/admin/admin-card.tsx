import { cn } from "@/lib/utils";

type AdminCardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function AdminCard({
  title,
  description,
  className,
  children,
}: AdminCardProps) {
  return (
    <section className={cn("rounded-[1.8rem] border border-brand/10 bg-white p-6 shadow-sm", className)}>
      {title ? <h2 className="text-3xl leading-none text-slate-950">{title}</h2> : null}
      {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
      <div className={title || description ? "mt-6" : ""}>{children}</div>
    </section>
  );
}
