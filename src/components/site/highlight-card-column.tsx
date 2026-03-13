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
            className="group relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,249,252,0.94))] p-6 shadow-[0_22px_46px_rgba(8,36,58,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_54px_rgba(8,36,58,0.12)] md:min-h-[188px] md:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
            <div className="absolute top-0 left-0 h-20 w-20 rounded-br-[2rem] bg-brand/[0.035]" />
            <div className="absolute -top-7 -right-7 h-24 w-24 rounded-full bg-brand/[0.045] blur-2xl transition-transform duration-300 group-hover:scale-110" />
            <div className="relative flex h-full flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-brand/[0.06] text-brand ring-1 ring-brand/[0.08]">
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-auto pt-10">
                <h3 className="max-w-[12rem] text-[1.45rem] leading-[0.96] font-extrabold tracking-[-0.04em] text-slate-950 md:text-[1.7rem]">
                  {card.title}
                </h3>
              </div>
            </div>
          </article>
        );
      })}
    </aside>
  );
}
