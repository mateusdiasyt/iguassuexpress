import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomCardProps = {
  room: {
    title: string;
    shortDescription: string;
    occupancy: number;
    coverImage?: string | null;
    features: string[];
  };
  onClick: () => void;
  className?: string;
};

export function RoomCard({ room, onClick, className }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group soft-card overflow-hidden rounded-[1.8rem] text-left transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden">
        {room.coverImage ? (
          <Image
            src={room.coverImage}
            alt={room.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
        <div className="absolute right-4 bottom-4 rounded-full bg-white/14 p-3 text-white backdrop-blur-md">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[1.55rem] leading-[1.02] font-extrabold text-slate-950 md:text-[1.7rem]">
            {room.title}
          </h3>
          <div className="flex items-center gap-2 rounded-full bg-brand/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            <Users className="h-4 w-4" />
            {room.occupancy} pessoa{room.occupancy > 1 ? "s" : ""}
          </div>
        </div>
        <p className="text-sm leading-7 text-slate-600">{room.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          {room.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-slate-950/5 px-3 py-2 text-xs font-medium text-slate-600"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
