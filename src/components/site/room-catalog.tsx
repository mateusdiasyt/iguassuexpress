"use client";

import { useMemo, useState } from "react";
import { RoomCard } from "@/components/site/room-card";
import { RoomCategorySelector } from "@/components/site/room-category-selector";
import { RoomModal } from "@/components/site/room-modal";

type RoomCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  rooms: Array<{
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    occupancy: number;
    coverImage?: string | null;
    features: string[];
  }>;
};

type RoomCatalogProps = {
  categories: RoomCategory[];
};

export function RoomCatalog({ categories }: RoomCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.slug ?? "");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const currentCategory =
    categories.find((category) => category.slug === selectedCategory) ?? categories[0];

  const activeRoom = useMemo(() => {
    if (!currentCategory) return null;
    const room = currentCategory.rooms.find((item) => item.id === activeRoomId);
    return room ? { ...room, category: { name: currentCategory.name } } : null;
  }, [activeRoomId, currentCategory]);

  if (!categories.length) {
    return null;
  }

  return (
    <>
      <div className="space-y-8">
        <RoomCategorySelector
          categories={categories}
          selected={currentCategory.slug}
          onSelect={setSelectedCategory}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {currentCategory.rooms.map((room) => (
            <RoomCard key={room.id} room={room} onClick={() => setActiveRoomId(room.id)} />
          ))}
        </div>
      </div>
      <RoomModal
        open={Boolean(activeRoom)}
        onOpenChange={(open) => !open && setActiveRoomId(null)}
        room={activeRoom}
      />
    </>
  );
}
