import { CalendarCheck2, Gem, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

type HighlightCardColumnProps = {
  cards: Array<{
    title: string;
    description: string;
  }>;
  className?: string;
};

export function HighlightCardColumn({
  cards,
  className,
}: HighlightCardColumnProps) {
  const icons = [MapPinned, CalendarCheck2, Gem];

  if (!cards.length) {
    return null;
  }

  return (
    <aside className={cn("grid gap-4 md:grid-cols-3 lg:gap-5", className)}>
      {cards.map((card, index) => {
        const Icon = icons[index] ?? Gem;

        return (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,251,255,0.9))] p-6 shadow-[0_16px_34px_rgba(8,36,58,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/20 hover:shadow-[0_24px_46px_rgba(8,36,58,0.13)] md:min-h-[162px] md:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-brand/[0.06] blur-2xl transition-transform duration-300 group-hover:scale-110" />
            <div className="relative flex h-full flex-col gap-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-brand/[0.07] text-brand ring-1 ring-brand/[0.12]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="max-w-[12rem] text-[1.45rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-slate-950 md:text-[1.65rem]">
                {card.title}
              </h3>
              <div className="mt-auto h-px w-full bg-gradient-to-r from-brand/22 to-transparent" />
            </div>
          </article>
        );
      })}
    </aside>
  );
}
