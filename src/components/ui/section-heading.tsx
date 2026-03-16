import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  layout?: "stacked" | "split";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  layout = "stacked",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        layout === "split"
          ? "grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-end"
          : "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand/75">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="max-w-2xl text-[2rem] leading-[0.94] font-extrabold text-slate-950 md:text-[2.8rem]">
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-sm leading-7 text-slate-600 md:text-base md:leading-8",
            layout === "stacked" ? "mt-4" : "lg:pb-1",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
