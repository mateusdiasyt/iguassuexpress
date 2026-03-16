"use client";

import { BedDouble, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomCategorySelectorProps = {
  categories: Array<{
    slug: string;
    name: string;
    description?: string | null;
  }>;
  selected: string;
  onSelect: (slug: string) => void;
};

function getCategoryLabel(name: string, slug: string) {
  const raw = `${name} ${slug}`.toLowerCase();
  if (raw.includes("standard")) return "Standard";
  if (raw.includes("superior")) return "Superior";
  return name.replace(/^apartamentos?\s+/i, "").trim();
}

function getCategoryIcon(name: string, slug: string) {
  const raw = `${name} ${slug}`.toLowerCase();
  if (raw.includes("superior")) return Sparkles;
  return BedDouble;
}

export function RoomCategorySelector({
  categories,
  selected,
  onSelect,
}: RoomCategorySelectorProps) {
  return (
    <div className="flex">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/88 p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        {categories.map((category) => (
          (() => {
            const Icon = getCategoryIcon(category.name, category.slug);

            return (
              <button
                key={category.slug}
                type="button"
                aria-pressed={selected === category.slug}
                onClick={() => onSelect(category.slug)}
                className={cn(
                  "inline-flex min-w-[8.75rem] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.02em] transition-all duration-250",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20",
                  selected === category.slug
                    ? "bg-brand text-white shadow-[0_10px_22px_rgba(9,77,122,0.16)]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{getCategoryLabel(category.name, category.slug)}</span>
              </button>
            );
          })()
        ))}
      </div>
    </div>
  );
}
