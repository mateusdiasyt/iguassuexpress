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
  const shortPreview =
    room.shortDescription.length > 95
      ? `${room.shortDescription.slice(0, 95).trimEnd()}...`
      : room.shortDescription;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative min-h-[27rem] overflow-hidden rounded-[1.85rem] border border-white/72 bg-white/10 text-left text-white ring-1 ring-white/35 shadow-[0_18px_42px_rgba(8,36,58,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/85 hover:shadow-[0_24px_52px_rgba(8,36,58,0.28)]",
        className,
      )}
    >
      <div className="absolute inset-0">
        {room.coverImage ? (
          <Image
            src={room.coverImage}
            alt={room.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,#224b67,#0f2234_56%,#0b1a28)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/34 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/84 to-transparent" />
      </div>

      <span className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-4 w-4" />
      </span>

      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/95 ring-1 ring-white/22 backdrop-blur-md">
          <Users className="h-3.5 w-3.5" />
          {room.occupancy} pessoa{room.occupancy > 1 ? "s" : ""}
        </div>

        <h3 className="mt-4 max-w-[13rem] text-[2.05rem] leading-[0.92] font-extrabold tracking-[-0.04em] text-white md:text-[2.35rem]">
          {room.title}
        </h3>

        <p className="mt-3 max-w-[22rem] text-sm leading-6 text-white/84">
          {shortPreview}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {room.features.slice(0, 2).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/16 px-3 py-1.5 text-[0.67rem] font-medium uppercase tracking-[0.16em] text-white/88 ring-1 ring-white/22 backdrop-blur-md"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <span className="inline-flex h-10 min-w-[9.8rem] items-center justify-center rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition group-hover:bg-slate-50">
            Ver detalhes
          </span>
        </div>
      </div>
    </button>
  );
}
