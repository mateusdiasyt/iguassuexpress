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
      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/18 bg-[linear-gradient(135deg,rgba(9,28,48,0.78),rgba(26,43,67,0.64))] p-1.5 shadow-[0_16px_40px_rgba(5,20,34,0.32)] backdrop-blur-xl">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={selected === category.slug}
            onClick={() => onSelect(category.slug)}
            className={cn(
              "min-w-[8.5rem] rounded-xl px-5 py-2.5 text-sm font-semibold text-white/72 transition-all duration-250",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/65",
              selected === category.slug
                ? "bg-white/16 text-white shadow-[0_8px_24px_rgba(6,20,34,0.24)]"
                : "hover:bg-white/8 hover:text-white/95",
            )}
          >
            {getCategoryLabel(category.name, category.slug)}
          </button>
        ))}
      </div>
    </div>
  );
}
