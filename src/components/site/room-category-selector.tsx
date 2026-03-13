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

export function RoomCategorySelector({
  categories,
  selected,
  onSelect,
}: RoomCategorySelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onSelect(category.slug)}
          className={cn(
            "rounded-[1.75rem] border px-5 py-4 text-left transition-all duration-300",
            selected === category.slug
              ? "border-brand bg-brand text-white shadow-lg shadow-brand/20"
              : "border-brand/10 bg-white/80 hover:border-brand/30 hover:bg-white",
          )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-70">
              Categoria
            </p>
          <h3 className="mt-3 text-[1.8rem] leading-[0.98] font-extrabold md:text-[2rem]">
            {category.name}
          </h3>
          {category.description ? (
            <p className="mt-3 text-sm leading-7 opacity-75">{category.description}</p>
          ) : null}
        </button>
      ))}
    </div>
  );
}
