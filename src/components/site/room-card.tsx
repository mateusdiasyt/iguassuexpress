"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomCardProps = {
  room: {
    title: string;
    shortDescription: string;
    occupancy: number;
    coverImage?: string | null;
    images?: string[];
    features: string[];
  };
  onClick: () => void;
  className?: string;
};

function normalizeRoomImages(room: RoomCardProps["room"]) {
  const seen = new Set<string>();

  return [room.coverImage, ...(room.images ?? [])]
    .map((item) => item?.trim() ?? "")
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

export function RoomCard({ room, onClick, className }: RoomCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const roomImages = useMemo(() => normalizeRoomImages(room), [room]);
  const shortPreview =
    room.shortDescription.length > 95
      ? `${room.shortDescription.slice(0, 95).trimEnd()}...`
      : room.shortDescription;
  const compactPreview =
    room.shortDescription.length > 54
      ? `${room.shortDescription.slice(0, 54).trimEnd()}...`
      : room.shortDescription;

  useEffect(() => {
    if (roomImages.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % roomImages.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [roomImages.length]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative min-h-[22rem] overflow-hidden rounded-[1.55rem] border border-white/72 bg-white/10 text-left text-white ring-1 ring-white/35 shadow-[0_18px_42px_rgba(8,36,58,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/85 hover:shadow-[0_24px_52px_rgba(8,36,58,0.28)] sm:min-h-[24.5rem] sm:rounded-[1.75rem] lg:min-h-[27rem] lg:rounded-[1.85rem]",
        className,
      )}
    >
      <div className="absolute inset-0">
        {roomImages.length ? (
          roomImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                index === activeImageIndex ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={image}
                alt={room.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 420px"
                className={cn(
                  "object-cover transition-transform duration-[3200ms] ease-out",
                  index === activeImageIndex
                    ? "scale-100 group-hover:scale-105"
                    : "scale-[1.035]",
                )}
              />
            </div>
          ))
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,#224b67,#0f2234_56%,#0b1a28)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/34 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/84 to-transparent" />
      </div>

      <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:top-4 sm:right-4 sm:h-11 sm:w-11">
        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </span>

      <div className="relative flex h-full flex-col justify-end p-4 sm:p-5 lg:p-6">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/14 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-white/95 ring-1 ring-white/22 backdrop-blur-md sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[0.68rem] sm:tracking-[0.2em]">
          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {room.occupancy} pessoa{room.occupancy > 1 ? "s" : ""}
        </div>

        <h3 className="mt-3 max-w-[8rem] text-[1.5rem] leading-[0.9] font-extrabold tracking-[-0.04em] text-white sm:mt-4 sm:max-w-[10rem] sm:text-[1.75rem] md:max-w-[11rem] md:text-[2rem] lg:max-w-[13rem] lg:text-[2.35rem]">
          {room.title}
        </h3>

        <p className="mt-2 text-[0.88rem] leading-5 text-white/84 sm:hidden">
          {compactPreview}
        </p>

        <p className="mt-3 hidden max-w-[22rem] text-sm leading-6 text-white/84 sm:block">
          {shortPreview}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          {room.features.slice(0, 2).map((feature, featureIndex) => (
            <span
              key={feature}
              className={cn(
                "rounded-full bg-white/16 px-2.5 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-white/88 ring-1 ring-white/22 backdrop-blur-md sm:px-3 sm:text-[0.67rem] sm:tracking-[0.16em]",
                featureIndex > 0 ? "hidden sm:inline-flex" : "inline-flex",
              )}
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-5 sm:mt-6">
          <span className="inline-flex h-9 min-w-[7.9rem] items-center justify-center rounded-full bg-white px-4 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-[0_8px_24px_rgba(255,255,255,0.25)] transition group-hover:bg-slate-50 sm:h-10 sm:min-w-[9.8rem] sm:px-6 sm:text-xs sm:tracking-[0.2em]">
            Ver detalhes
          </span>
        </div>
      </div>
    </button>
  );
}
