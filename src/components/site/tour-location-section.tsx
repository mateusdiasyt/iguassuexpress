"use client";

import type { ReactNode } from "react";
import {
  Compass,
  MoveHorizontal,
  Orbit,
  Play,
  ScanSearch,
} from "lucide-react";
import { useState } from "react";
import { Panorama360Viewer } from "@/components/site/panorama-360-viewer";
import { Tour360Modal } from "@/components/site/tour-360-modal";
import type { TourScene } from "@/components/site/tour-360-types";

type TourLocationSectionProps = {
  tourTitle: string;
  tourDescription: string;
  previewImage?: string;
  scenes?: TourScene[];
};

const DEFAULT_PREVIEW_IMAGE = "/piscina-hotel-iguassu.jpg";

function FeaturePill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="group inline-flex h-12 items-center rounded-full border border-slate-200/80 bg-white/86 px-3 text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-brand/20 hover:bg-white hover:text-slate-950"
      aria-label={label}
      title={label}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand">
        {icon}
      </span>
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[220px] group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

export function TourLocationSection({
  tourTitle,
  tourDescription,
  previewImage = DEFAULT_PREVIEW_IMAGE,
  scenes = [],
}: TourLocationSectionProps) {
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

  const primaryScene = tourScenes[0] ?? null;

  if (!primaryScene) {
    return null;
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:items-center">
      <div className="space-y-5 lg:pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand/75">
          Experiencia 360
        </p>
        <h3 className="max-w-md text-[2.1rem] leading-[0.94] font-extrabold text-slate-950 md:text-[3rem]">
          Explore o hotel com fotos panoramicas reais em 360
        </h3>
        <p className="max-w-md text-base leading-8 text-slate-600">
          Gire a cena, olhe para os lados e sinta a atmosfera do hotel em um panorama 360 mais limpo e imersivo.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#094d7a_0%,#0b5e94_100%)] px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(9,77,122,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#062d47_0%,#094d7a_100%)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
            <span className="text-base font-semibold text-white">Iniciar tour</span>
          </button>

          <FeaturePill
            icon={<MoveHorizontal className="h-4 w-4" />}
            label="Arraste para olhar"
          />
          <FeaturePill
            icon={<Orbit className="h-4 w-4" />}
            label="Panorama 360 real"
          />
          <FeaturePill
            icon={<ScanSearch className="h-4 w-4" />}
            label="Exploracao na mesma cena"
          />
        </div>

        <p className="max-w-sm text-sm leading-7 text-slate-500">{tourDescription}</p>
      </div>

      <div className="group relative min-h-[420px] overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.74),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-white/72 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-white/72 to-transparent" />

        <Panorama360Viewer
          src={primaryScene.image}
          alt={primaryScene.title}
          className="absolute inset-0 rounded-none"
          showHint={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/34 via-slate-950/10 to-white/8" />

        <div className="absolute inset-x-5 top-5 z-20 flex items-start justify-between gap-4">
          <span className="rounded-full border border-white/70 bg-white/85 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur-md">
            Foto panoramica 360
          </span>
          <span className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-slate-500 backdrop-blur-md md:inline-flex">
            <MoveHorizontal className="h-3.5 w-3.5" />
            Arraste para olhar
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <h3 className="text-[2rem] leading-[0.92] font-extrabold tracking-[-0.04em] text-white md:text-[2.8rem]">
              {tourTitle}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/82 md:text-base">
              Olhe em volta com mais precisao e abra a experiencia completa quando quiser.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/28 bg-white/16 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/88 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md">
              <Compass className="h-4 w-4" />
              Street View estatico
            </div>
          </div>
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
