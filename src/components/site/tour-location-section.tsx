"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { Tour360Modal, type TourScene } from "@/components/site/tour-360-modal";
import { cn } from "@/lib/utils";

type TourLocationSectionProps = {
  tourTitle: string;
  tourDescription: string;
  previewImage?: string;
  scenes?: TourScene[];
};

const DEFAULT_PREVIEW_IMAGE = "/piscina-hotel-iguassu.jpg";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function TourLocationSection({
  tourTitle,
  tourDescription,
  previewImage = DEFAULT_PREVIEW_IMAGE,
  scenes = [],
}: TourLocationSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ startX: number; startOffset: number } | null>(null);
  const [offset, setOffset] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tourScenes =
    scenes.length > 0
      ? scenes
      : [
          {
            id: "pool-scene",
            title: "Piscina panoramica",
            description: "Deck externo, espelho d'agua e atmosfera de descanso do hotel.",
            image: previewImage,
          },
        ];

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    dragStateRef.current = {
      startX: event.clientX,
      startOffset: offset,
    };

    setIsDragging(true);
    setHasInteracted(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStateRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const delta = (event.clientX - dragStateRef.current.startX) / rect.width;
    const nextOffset = clamp(dragStateRef.current.startOffset - delta, 0, 1);
    setOffset(nextOffset);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragStateRef.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const translateX = `${-8 - offset * 18}%`;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:items-center">
      <div className="space-y-5 lg:pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/75">
          Experiencia 360
        </p>
        <h3 className="max-w-md text-[2.1rem] leading-[0.94] font-extrabold text-slate-950 md:text-[3rem]">
          Explore o hotel em uma navegacao mais sensorial
        </h3>
        <p className="max-w-md text-sm leading-7 text-slate-600 md:text-base md:leading-8">
          {tourDescription}
        </p>
        <p className="max-w-sm text-sm leading-7 text-slate-500">
          A interacao foi pensada para destacar a piscina e convidar o visitante a descobrir o ambiente antes da reserva.
        </p>
      </div>

      <div
        ref={containerRef}
        role="presentation"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "group relative min-h-[420px] overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]",
          "cursor-grab touch-none select-none",
          isDragging && "cursor-grabbing",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.74),transparent_30%)]" />
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white/72 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-white/72 to-transparent z-10" />

        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[140%] transition-transform duration-700 ease-out",
            !hasInteracted && "group-hover:duration-300",
          )}
          style={{ transform: `translateX(${translateX})` }}
        >
          <Image
            src={previewImage}
            alt="Preview panoramico da piscina do hotel"
            fill
            priority={false}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-950/6 to-white/8" />
        </div>

        <div className="absolute inset-x-5 top-5 z-20 flex items-start justify-between gap-4">
          <span className="rounded-full border border-white/70 bg-white/85 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-md">
            Tour 360 da piscina
          </span>
          <span className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-slate-500 backdrop-blur-md md:inline-flex">
            <MoveHorizontal className="h-3.5 w-3.5" />
            Arraste para explorar
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <h3 className="text-[2rem] leading-[0.92] font-extrabold tracking-[-0.04em] text-white md:text-[2.8rem]">
              {tourTitle}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/82 md:text-base">
              Arraste a imagem para sentir a atmosfera da area da piscina e antecipar a experiencia da sua hospedagem.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            onPointerDown={(event) => event.stopPropagation()}
            className="inline-flex h-12 items-center gap-3 self-start rounded-full border border-white/35 bg-white/18 px-5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/24"
          >
            Abrir tour 360
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Tour360Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={tourTitle}
        description={tourDescription}
        scenes={tourScenes}
      />
    </section>
  );
}
