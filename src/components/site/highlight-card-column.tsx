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
    <aside className={cn("grid gap-4 md:grid-cols-3", className)}>
      {cards.map((card, index) => {
        const Icon = icons[index] ?? Gem;

        return (
          <article
            key={card.title}
            className="soft-card rounded-[1.6rem] p-5 md:min-h-[220px] md:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 max-w-[11rem] text-[1.65rem] leading-[0.98] font-extrabold text-slate-950">
              {card.title}
            </h3>
          </article>
        );
      })}
    </aside>
  );
}
