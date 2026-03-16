"use client";

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

export function RoomCategorySelector({
  categories,
  selected,
  onSelect,
}: RoomCategorySelectorProps) {
  return (
    <div className="flex">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/88 p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={selected === category.slug}
            onClick={() => onSelect(category.slug)}
            className={cn(
              "min-w-[8.25rem] rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.02em] transition-all duration-250",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20",
              selected === category.slug
                ? "bg-brand text-white shadow-[0_10px_22px_rgba(9,77,122,0.16)]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
            )}
          >
            {getCategoryLabel(category.name, category.slug)}
          </button>
        ))}
      </div>
    </div>
  );
}
